import fs from 'fs';
import pg from 'pg';
import { getPayloadClient } from './lib/getPayload';

const neonConnectionString =
  'postgresql://neondb_owner:npg_cS8JPsinDve1@ep-long-morning-aqxemcyr-pooler.c-8.us-east-1.aws.neon.tech/jway_web?sslmode=verify-full&channel_binding=require';

const rdsConnectionString =
  'postgresql://devops:2-1tLRb%5D%3EdO_W%29yE7M%5BfY-3%21%3FG%29%3E@ai-jwaystaging.csyjujqjax22.us-west-1.rds.amazonaws.com:5432/postgres?sslmode=verify-full&channel_binding=require';

const articles = JSON.parse(
  fs.readFileSync('c:\\Localhost\\jway-site\\src\\allArticlesFullParsed.json', 'utf8')
);

async function run() {
  console.log('🔄 Restoring hero banner and moving headshots to content area...\n');

  for (const item of articles) {
    if (
      item.slug === 'certified-true-copies-now-required-for-first-time-jobseekers-in-the-philippines' ||
      item.slug === '13-week-app-development-internship-program-at-jway'
    ) {
      const headshotUrl = item.coverImageUrl;
      item.coverImageUrl = '/blog/header.png';

      // Prepend headshot to contentHtml if not already present
      if (!item.contentHtml.includes(headshotUrl)) {
        item.contentHtml = `<div class="blog-featured-image-container" style="text-align: center; margin-bottom: 2rem;"><img src="${headshotUrl}" alt="${item.title}" style="max-width: 380px; width: 100%; height: auto; border-radius: 1rem; margin: 0 auto; display: block; box-shadow: 0 4px 14px rgba(0,0,0,0.1);" /></div>` + item.contentHtml;
      }
      console.log(`  Updated cover banner and content headshot for "${item.title}"`);
    }
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
    console.log('✅ Local SQLite DB updated with restored hero banners.');
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
    console.log('✅ Remote Neon PostgreSQL DB updated with restored hero banners.');
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
    console.log('✅ AWS RDS Staging PostgreSQL DB updated with restored hero banners.');
  } catch (e: any) {
    console.error('❌ AWS RDS Staging DB error:', e.message || e);
  } finally {
    await rdsPool.end();
  }

  console.log('\n🎉 Banner restoration and DB updates completed successfully!');
  process.exit(0);
}

run();
