import fs from 'fs';
import pg from 'pg';
import { getPayloadClient } from './lib/getPayload';

const neonConnectionString =
  'postgresql://neondb_owner:npg_cS8JPsinDve1@ep-long-morning-aqxemcyr-pooler.c-8.us-east-1.aws.neon.tech/jway_web?sslmode=verify-full&channel_binding=require';

const rdsConnectionString =
  'postgresql://devops:2-1tLRb%5D%3EdO_W%29yE7M%5BfY-3%21%3FG%29%3E@ai-jwaystaging.csyjujqjax22.us-west-1.rds.amazonaws.com:5432/postgres?sslmode=verify-full&channel_binding=require';

const s3BaseUrl = 'https://jway-ai-content.s3.us-west-1.amazonaws.com/jway-ai-content';

function toCleanS3Url(rawUrl: string): string {
  if (!rawUrl) return `${s3BaseUrl}/blog/header.png`;
  let filename = rawUrl.split('/').pop()?.split('?')[0] || '';
  filename = filename.replace(/ /g, '_');
  if (!filename) return `${s3BaseUrl}/blog/header.png`;
  return `${s3BaseUrl}/blog/${filename}`;
}

function cleanHtmlS3Urls(html: string): string {
  if (!html) return '';
  return html.replace(/src=["']([^"']+)["']/gi, (match, p1) => {
    return `src="${toCleanS3Url(p1)}"`;
  });
}

const articles = JSON.parse(
  fs.readFileSync('c:\\Localhost\\jway-site\\src\\allArticlesFullParsed.json', 'utf8')
);

async function run() {
  console.log('☁️ Sanitizing all cover images and content HTML to direct S3 URLs...\n');

  for (const art of articles) {
    art.coverImageUrl = toCleanS3Url(art.coverImageUrl);
    art.contentHtml = cleanHtmlS3Urls(art.contentHtml);
    console.log(`📌 Post "${art.slug}" -> Cover: ${art.coverImageUrl}`);
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
            coverImageUrl: item.coverImageUrl,
            contentHtml: item.contentHtml,
            summary: item.summary,
          },
        });
      }
    }
    console.log('✅ Local SQLite DB updated with direct S3 URLs.');
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
        `UPDATE posts SET cover_image_url = $1, content_html = $2, summary = $3, updated_at = NOW() WHERE slug = $4;`,
        [item.coverImageUrl, item.contentHtml, item.summary, item.slug]
      );
    }
    console.log('✅ Remote Neon PostgreSQL DB updated with direct S3 URLs.');
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
        `UPDATE posts SET cover_image_url = $1, content_html = $2, summary = $3, updated_at = NOW() WHERE slug = $4;`,
        [item.coverImageUrl, item.contentHtml, item.summary, item.slug]
      );
    }
    console.log('✅ AWS RDS Staging PostgreSQL DB updated with direct S3 URLs.');
  } catch (e: any) {
    console.error('❌ AWS RDS Staging DB error:', e.message || e);
  } finally {
    await rdsPool.end();
  }

  console.log('\n🎉 All articles sanitized with direct S3 URLs!');
  process.exit(0);
}

run();
