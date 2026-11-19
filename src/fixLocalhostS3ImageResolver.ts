import fs from 'fs';
import pg from 'pg';
import { getPayloadClient } from './lib/getPayload';

const neonConnectionString =
  'postgresql://neondb_owner:npg_cS8JPsinDve1@ep-long-morning-aqxemcyr-pooler.c-8.us-east-1.aws.neon.tech/jway_web?sslmode=verify-full&channel_binding=require';

const rdsConnectionString =
  'postgresql://devops:2-1tLRb%5D%3EdO_W%29yE7M%5BfY-3%21%3FG%29%3E@ai-jwaystaging.csyjujqjax22.us-west-1.rds.amazonaws.com:5432/postgres?sslmode=verify-full&channel_binding=require';

// 1. Update page.tsx
const pagePath = 'c:\\Localhost\\jway-site\\src\\app\\(frontend)\\blog\\[slug]\\page.tsx';
let pageContent = fs.readFileSync(pagePath, 'utf8');

const helperFunc = `function resolveAllContentMediaUrls(html: string): string {
  if (!html) return '';

  return html
    .replace(/src=["'](\\/(?:blog|hubfs)\\/[^"']+)["']/gi, (match, p1) => \`src="\${getMediaUrl(p1)}"\`)
    .replace(/src=["'](\\/header\\.png)["']/gi, (match, p1) => \`src="\${getMediaUrl(p1)}"\`)
    .replace(/src=["']https:\\/\\/jway-20137624\\.hs-sites\\.com\\/hubfs\\/Imported_Blog_Media\\/([^"']+)["']/gi, (match, filename) => {
      const cleanName = filename.split('?')[0];
      return \`src="\${getMediaUrl(\`/blog/\${cleanName}\`)}"\`;
    })
    .replace(/src=["']https:\\/\\/jway-20137624\\.hs-sites\\.com\\/hs-fs\\/hubfs\\/Imported_Blog_Media\\/([^"']+)["']/gi, (match, filename) => {
      const cleanName = filename.split('?')[0];
      return \`src="\${getMediaUrl(\`/blog/\${cleanName}\`)}"\`;
    });
}

export default async function BlogPostPage`;

if (!pageContent.includes('function resolveAllContentMediaUrls')) {
  pageContent = pageContent.replace('export default async function BlogPostPage', helperFunc);
}

if (pageContent.includes('dangerouslySetInnerHTML={{ __html: article.content }}')) {
  pageContent = pageContent.replace(
    'dangerouslySetInnerHTML={{ __html: article.content }}',
    'dangerouslySetInnerHTML={{ __html: resolveAllContentMediaUrls(article.content) }}'
  );
}

fs.writeFileSync(pagePath, pageContent);
console.log('✅ Updated page.tsx with resolveAllContentMediaUrls for localhost rendering.');

// 2. Process all articles to convert image paths to S3 URLs in DB
const articles = JSON.parse(
  fs.readFileSync('c:\\Localhost\\jway-site\\src\\allArticlesFullParsed.json', 'utf8')
);

function convertToS3Urls(html: string) {
  if (!html) return '';

  return html
    .replace(/src=["'](\/blog\/[^"']+)["']/gi, (match, p1) => `src="https://jway-ai-content.s3.us-west-1.amazonaws.com/jway-ai-content${p1}"`)
    .replace(/src=["']https:\/\/jway-20137624\.hs-sites\.com\/(?:hs-fs\/)?hubfs\/Imported_Blog_Media\/([^"']+)["']/gi, (match, filename) => {
      const cleanName = filename.split('?')[0];
      return `src="https://jway-ai-content.s3.us-west-1.amazonaws.com/jway-ai-content/blog/${cleanName}"`;
    });
}

async function run() {
  console.log('🔄 Converting all article content image URLs to full S3 URLs across databases...\n');

  for (const item of articles) {
    item.contentHtml = convertToS3Urls(item.contentHtml);
    if (item.coverImageUrl.startsWith('/blog/')) {
      item.coverImageUrl = `https://jway-ai-content.s3.us-west-1.amazonaws.com/jway-ai-content${item.coverImageUrl}`;
    } else if (item.coverImageUrl.includes('hs-sites.com')) {
      const filename = item.coverImageUrl.split('/').pop()?.split('?')[0];
      item.coverImageUrl = `https://jway-ai-content.s3.us-west-1.amazonaws.com/jway-ai-content/blog/${filename}`;
    }
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
            coverImageUrl: item.coverImageUrl,
            contentHtml: item.contentHtml,
            summary: item.summary,
          },
        });
      }
    }
    console.log('✅ Local SQLite DB updated with S3 image URLs.');
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
        `UPDATE posts SET cover_image_url = $1, content_html = $2, summary = $3, updated_at = NOW() WHERE slug = $4;`,
        [item.coverImageUrl, item.contentHtml, item.summary, item.slug]
      );
    }
    console.log('✅ Remote Neon PostgreSQL DB updated with S3 image URLs.');
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
        `UPDATE posts SET cover_image_url = $1, content_html = $2, summary = $3, updated_at = NOW() WHERE slug = $4;`,
        [item.coverImageUrl, item.contentHtml, item.summary, item.slug]
      );
    }
    console.log('✅ AWS RDS Staging PostgreSQL DB updated with S3 image URLs.');
  } catch (e: any) {
    console.error('❌ AWS RDS Staging DB error:', e.message || e);
  } finally {
    await rdsPool.end();
  }

  console.log('\n🎉 S3 Image Resolver fix completed successfully!');
  process.exit(0);
}

run();
