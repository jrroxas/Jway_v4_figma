import fs from 'fs';
import pg from 'pg';
import { getPayloadClient } from './lib/getPayload';

const neonConnectionString =
  'postgresql://neondb_owner:npg_cS8JPsinDve1@ep-long-morning-aqxemcyr-pooler.c-8.us-east-1.aws.neon.tech/jway_web?sslmode=verify-full&channel_binding=require';

const rdsConnectionString =
  'postgresql://devops:2-1tLRb%5D%3EdO_W%29yE7M%5BfY-3%21%3FG%29%3E@ai-jwaystaging.csyjujqjax22.us-west-1.rds.amazonaws.com:5432/postgres?sslmode=verify-full&channel_binding=require';

// 1. Remove max-height in globals.css
const cssPath = 'c:\\Localhost\\jway-site\\src\\app\\(frontend)\\globals.css';
let cssContent = fs.readFileSync(cssPath, 'utf8');

cssContent = cssContent.replace(
  /article\.prose img,\s*article\.prose figure,\s*\.blog-content-image\s*\{[\s\S]*?\}/,
  `article.prose img,
article.prose figure,
.blog-content-image {
  display: block !important;
  width: auto !important;
  max-width: 100% !important;
  height: auto !important;
  max-height: none !important;
  border-radius: 1.25rem !important; /* 20px */
  margin-top: 2rem !important;
  margin-bottom: 2rem !important;
  margin-left: auto !important;
  margin-right: auto !important;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04) !important;
}`
);

fs.writeFileSync(cssPath, cssContent);
console.log('✅ Removed max-height constraints in globals.css.');

// 2. Remove max-height in HTML content strings
const articles = JSON.parse(
  fs.readFileSync('c:\\Localhost\\jway-site\\src\\allArticlesFullParsed.json', 'utf8')
);

function stripMaxHeight(html: string) {
  if (!html) return '';

  return html
    // Remove max-height from style attributes
    .replace(/max-height:\s*[^;"]+;?/gi, '')
    // Ensure img inline styles use height: auto !important without max-height
    .replace(/<img\s+/gi, '<img style="max-width: 100%; height: auto; display: block; margin: 1.5rem auto; border-radius: 0.75rem;" ');
}

async function run() {
  console.log('🧼 Stripping max-height constraints from all article content images...\n');

  for (const item of articles) {
    item.contentHtml = stripMaxHeight(item.contentHtml);
    console.log(`  Stripped max-height for "${item.title}"`);
  }

  // Save updated JSON
  fs.writeFileSync(
    'c:\\Localhost\\jway-site\\src\\allArticlesFullParsed.json',
    JSON.stringify(articles, null, 2)
  );

  // 3. Update Local SQLite Payload CMS
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
    console.log('✅ Local SQLite DB updated with max-height removed.');
  } catch (e: any) {
    console.error('❌ Local SQLite error:', e.message || e);
  }

  // 4. Remote Neon PostgreSQL
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
    console.log('✅ Remote Neon PostgreSQL DB updated with max-height removed.');
  } catch (e: any) {
    console.error('❌ Neon DB error:', e.message || e);
  } finally {
    await neonPool.end();
  }

  // 5. AWS RDS Staging PostgreSQL
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
    console.log('✅ AWS RDS Staging PostgreSQL DB updated with max-height removed.');
  } catch (e: any) {
    console.error('❌ AWS RDS Staging DB error:', e.message || e);
  } finally {
    await rdsPool.end();
  }

  console.log('\n🎉 Removal of max-height constraints completed successfully!');
  process.exit(0);
}

run();
