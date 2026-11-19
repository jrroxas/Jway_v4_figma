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

// Fix specific article cover images
const correctCovers: Record<string, string> = {
  'certified-true-copies-now-required-for-first-time-jobseekers-in-the-philippines':
    'https://jway-ai-content.s3.us-west-1.amazonaws.com/jway-ai-content/blog/187_compressed.jpg',
  'use-flutter-to-optimize-your-costs-and-time-to-market':
    'https://jway-ai-content.s3.us-west-1.amazonaws.com/jway-ai-content/blog/scrnli_1_25_2023_12-02-03-PM-1.png',
  'traditional-versus-webflow-the-rise-of-no-code-web-development-platform':
    'https://jway-ai-content.s3.us-west-1.amazonaws.com/jway-ai-content/blog/jud-mackrill-Of_m3hMsoAA-unsplash.jpg',
  '7-essential-tips-to-develop-a-winning-recruitment-process':
    'https://jway-ai-content.s3.us-west-1.amazonaws.com/jway-ai-content/blog/gabrielle-henderson-HJckKnwCXxQ-unsplash.jpg',
  '3-most-important-elements-of-a-blog-template':
    'https://jway-ai-content.s3.us-west-1.amazonaws.com/jway-ai-content/blog/fikret-tozak-rfNLa1HL7eY-unsplash.jpg',
  '13-week-app-development-internship-program-at-jway':
    'https://jway-ai-content.s3.us-west-1.amazonaws.com/jway-ai-content/blog/Untitled-design-18.png',
  '5-things-that-will-change-the-way-you-approach-customers-using-a-crm-tool':
    'https://jway-ai-content.s3.us-west-1.amazonaws.com/jway-ai-content/blog/customer-relationship.jpg',
  'the-ultimate-guide-to-create-an-online-store':
    'https://jway-ai-content.s3.us-west-1.amazonaws.com/jway-ai-content/blog/online-store.jpg',
};

async function run() {
  console.log('🔧 Cleaning up article cover images and body content...\n');

  for (const art of articles) {
    if (correctCovers[art.slug]) {
      art.coverImageUrl = correctCovers[art.slug];
    }

    // Clean up injected blog-featured-image-container from contentHtml
    art.contentHtml = art.contentHtml.replace(
      /<div class="blog-featured-image-container"[^>]*>[\s\S]*?<\/div>/gi,
      ''
    );
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
    console.log('✅ Local SQLite DB updated with corrected cover images and clean body content.');
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
    console.log('✅ Remote Neon PostgreSQL DB updated with corrected cover images.');
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
    console.log('✅ AWS RDS Staging PostgreSQL DB updated with corrected cover images.');
  } catch (e: any) {
    console.error('❌ AWS RDS Staging DB error:', e.message || e);
  } finally {
    await rdsPool.end();
  }

  console.log('\n🎉 Article cover images and content restored to match live HubSpot source pages!');
  process.exit(0);
}

run();
