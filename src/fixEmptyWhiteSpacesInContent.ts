import fs from 'fs';
import pg from 'pg';
import { getPayloadClient } from './lib/getPayload';

const neonConnectionString =
  'postgresql://neondb_owner:npg_cS8JPsinDve1@ep-long-morning-aqxemcyr-pooler.c-8.us-east-1.aws.neon.tech/jway_web?sslmode=verify-full&channel_binding=require';

const rdsConnectionString =
  'postgresql://devops:2-1tLRb%5D%3EdO_W%29yE7M%5BfY-3%21%3FG%29%3E@ai-jwaystaging.csyjujqjax22.us-west-1.rds.amazonaws.com:5432/postgres?sslmode=verify-full&channel_binding=require';

function stripEmptySpaceTags(html: string): string {
  if (!html) return '';

  return html
    // Remove alignleft / alignright floats that trigger old clearing hacks
    .replace(/class=["'][^"']*align(?:left|right)[^"']*["']/gi, 'class="article-content-img"')
    // Remove repeated empty paragraphs
    .replace(/(?:<p[^>]*>(?:\s|&nbsp;|<br\s*\/?>)*<\/p>\s*)+/gi, '')
    // Clean up empty spans inside paragraphs
    .replace(/<p[^>]*>\s*<span[^>]*>(?:\s|&nbsp;|<br\s*\/?>)*<\/span>\s*<\/p>/gi, '');
}

const articles = JSON.parse(
  fs.readFileSync('c:\\Localhost\\jway-site\\src\\allArticlesFullParsed.json', 'utf8')
);

async function run() {
  console.log('🧹 Stripping empty white spaces (<p>&nbsp;</p>) across all articles...\n');

  for (const art of articles) {
    const originalLen = art.contentHtml.length;
    art.contentHtml = stripEmptySpaceTags(art.contentHtml);
    console.log(`📌 Post "${art.slug}": ${originalLen} chars -> ${art.contentHtml.length} chars`);
  }

  // Save updated JSON
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
          },
        });
      }
    }
    console.log('✅ Local SQLite DB updated with stripped empty space tags.');
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
        `UPDATE posts SET content_html = $1, updated_at = NOW() WHERE slug = $2;`,
        [item.contentHtml, item.slug]
      );
    }
    console.log('✅ Remote Neon PostgreSQL DB updated.');
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
        `UPDATE posts SET content_html = $1, updated_at = NOW() WHERE slug = $2;`,
        [item.contentHtml, item.slug]
      );
    }
    console.log('✅ AWS RDS Staging PostgreSQL DB updated.');
  } catch (e: any) {
    console.error('❌ AWS RDS Staging DB error:', e.message || e);
  } finally {
    await rdsPool.end();
  }

  console.log('\n🎉 Empty white spaces removed across all articles!');
  process.exit(0);
}

run();
