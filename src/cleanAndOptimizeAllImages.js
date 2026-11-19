import fs from 'fs';
import pg from 'pg';
import { getPayloadClient } from './lib/getPayload.js';

const neonConnectionString =
  'postgresql://neondb_owner:npg_cS8JPsinDve1@ep-long-morning-aqxemcyr-pooler.c-8.us-east-1.aws.neon.tech/jway_web?sslmode=verify-full&channel_binding=require';

const rdsConnectionString =
  'postgresql://devops:2-1tLRb%5D%3EdO_W%29yE7M%5BfY-3%21%3FG%29%3E@ai-jwaystaging.csyjujqjax22.us-west-1.rds.amazonaws.com:5432/postgres?sslmode=verify-full&channel_binding=require';

const articles = JSON.parse(
  fs.readFileSync('c:\\Localhost\\jway-site\\src\\allArticlesFullParsed.json', 'utf8')
);

function cleanImageTags(html) {
  if (!html) return '';

  return html
    // Remove srcset and sizes attributes so browser loads full original src
    .replace(/\s+srcset="[^"]*"/gi, '')
    .replace(/\s+sizes="[^"]*"/gi, '')
    // Replace hs-fs/hubfs/ downscaled paths with clean hubfs/ original paths
    .replace(/\/hs-fs\/hubfs\//g, '/hubfs/')
    // Strip ?width=...&height=... downscaling query parameters from img src
    .replace(/(<img[^>]+src="[^"?]+)\?[^"]*"/gi, '$1"')
    // Add clean responsive inline styles to img tags
    .replace(/<img\s+/gi, '<img style="max-width:100%; height:auto; max-height:480px; width:auto; margin:1.5rem auto; display:block; border-radius:0.75rem; box-shadow:0 4px 12px rgba(0,0,0,0.08);" ');
}

async function run() {
  console.log('🧼 Cleaning up all image downscaling, srcset, and resolution parameters...\n');

  for (const item of articles) {
    const originalLen = item.contentHtml ? item.contentHtml.length : 0;
    item.contentHtml = cleanImageTags(item.contentHtml);
    console.log(`  Cleaned images for "${item.title}"`);
  }

  // Save cleaned JSON
  fs.writeFileSync(
    'c:\\Localhost\\jway-site\\src\\allArticlesFullParsed.json',
    JSON.stringify(articles, null, 2)
  );

  // 1. Update Local SQLite Payload CMS
  try {
    const payload = await getPayloadClient();
    for (const item of articles) {
      const existing = await payload.find({
        collection: 'posts',
        where: { slug: { equals: item.slug } },
      });

      if (existing.docs && existing.docs.length > 0) {
        await payload.update({
          collection: 'posts',
          id: existing.docs[0].id,
          data: {
            contentHtml: item.contentHtml,
            summary: item.summary,
          },
        });
      }
    }
    console.log('✅ Local SQLite DB updated with crisp image URLs.');
  } catch (e: any) {
    console.error('❌ Local SQLite error:', e.message || e);
  }

  // 2. Remote Neon PostgreSQL
  const neonPool = new pg.Pool({
    connectionString: neonConnectionString.replace(/\?sslmode=.*$/, ''),
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  try {
    for (const item of articles) {
      await neonPool.query(
        `UPDATE posts SET content_html = $1, summary = $2, updated_at = NOW() WHERE slug = $3;`,
        [item.contentHtml, item.summary, item.slug]
      );
    }
    console.log('✅ Remote Neon PostgreSQL DB updated with crisp image URLs.');
  } catch (e: any) {
    console.error('❌ Neon DB error:', e.message || e);
  } finally {
    await neonPool.end();
  }

  // 3. AWS RDS Staging PostgreSQL
  const rdsPool = new pg.Pool({
    connectionString: rdsConnectionString.replace(/\?sslmode=.*$/, ''),
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  try {
    for (const item of articles) {
      await rdsPool.query(
        `UPDATE posts SET content_html = $1, summary = $2, updated_at = NOW() WHERE slug = $3;`,
        [item.contentHtml, item.summary, item.slug]
      );
    }
    console.log('✅ AWS RDS Staging PostgreSQL DB updated with crisp image URLs.');
  } catch (e: any) {
    console.error('❌ AWS RDS Staging DB error:', e.message || e);
  } finally {
    await rdsPool.end();
  }

  console.log('\n🎉 Image optimization and database updates completed successfully!');
  process.exit(0);
}

run();
