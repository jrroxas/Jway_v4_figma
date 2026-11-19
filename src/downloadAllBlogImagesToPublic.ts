import fs from 'fs';
import path from 'path';
import https from 'https';
import pg from 'pg';
import { getPayloadClient } from './lib/getPayload';

const neonConnectionString =
  'postgresql://neondb_owner:npg_cS8JPsinDve1@ep-long-morning-aqxemcyr-pooler.c-8.us-east-1.aws.neon.tech/jway_web?sslmode=verify-full&channel_binding=require';

const rdsConnectionString =
  'postgresql://devops:2-1tLRb%5D%3EdO_W%29yE7M%5BfY-3%21%3FG%29%3E@ai-jwaystaging.csyjujqjax22.us-west-1.rds.amazonaws.com:5432/postgres?sslmode=verify-full&channel_binding=require';

const publicBlogDir = 'c:\\Localhost\\jway-site\\public\\blog';
if (!fs.existsSync(publicBlogDir)) {
  fs.mkdirSync(publicBlogDir, { recursive: true });
}

const agent = new https.Agent({ rejectUnauthorized: false });

function downloadImage(url: string, destFile: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (fs.existsSync(destFile) && fs.statSync(destFile).size > 100) {
      resolve(true);
      return;
    }

    const req = https.get(
      url,
      {
        agent,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Referer: 'https://jway-20137624.hs-sites.com/',
        },
      },
      (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          const redirectUrl = res.headers.location;
          if (redirectUrl) {
            downloadImage(redirectUrl, destFile).then(resolve);
            return;
          }
        }

        if (res.statusCode !== 200) {
          console.error(`  ❌ Failed [${res.statusCode}] ${url}`);
          resolve(false);
          return;
        }

        const fileStream = fs.createWriteStream(destFile);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`  ✅ Downloaded ${path.basename(destFile)} (${fs.statSync(destFile).size} bytes)`);
          resolve(true);
        });
      }
    );

    req.on('error', (err) => {
      console.error(`  ❌ Error downloading ${url}:`, err.message);
      resolve(false);
    });
  });
}

const articles = JSON.parse(
  fs.readFileSync('c:\\Localhost\\jway-site\\src\\allArticlesFullParsed.json', 'utf8')
);

async function run() {
  console.log('📥 Downloading all blog images to public/blog/...\n');

  for (const art of articles) {
    console.log(`📌 Article: "${art.title}"`);

    // 1. Cover Image
    if (art.coverImageUrl && art.coverImageUrl.includes('hs-sites.com')) {
      const filename = art.coverImageUrl.split('/').pop()?.split('?')[0];
      if (filename) {
        const localPath = path.join(publicBlogDir, filename);
        await downloadImage(art.coverImageUrl, localPath);
        art.coverImageUrl = `/blog/${filename}`;
      }
    }

    // 2. Content Images
    const imgMatches = [...art.contentHtml.matchAll(/src=["'](https?:\/\/[^"']+)["']/gi)];
    for (const match of imgMatches) {
      const originalSrc = match[1];
      if (originalSrc.includes('hs-sites.com')) {
        const filename = originalSrc.split('/').pop()?.split('?')[0];
        if (filename) {
          const localPath = path.join(publicBlogDir, filename);
          await downloadImage(originalSrc, localPath);

          // Replace URL in contentHtml
          const localUrl = `/blog/${filename}`;
          art.contentHtml = art.contentHtml.replaceAll(originalSrc, localUrl);
        }
      }
    }
  }

  // Save updated JSON
  fs.writeFileSync(
    'c:\\Localhost\\jway-site\\src\\allArticlesFullParsed.json',
    JSON.stringify(articles, null, 2)
  );

  // Update media.ts to treat /blog/ as local
  const mediaTsPath = 'c:\\Localhost\\jway-site\\src\\utils\\media.ts';
  let mediaTsContent = fs.readFileSync(mediaTsPath, 'utf8');
  if (!mediaTsContent.includes("path.startsWith('/blog/')")) {
    mediaTsContent = mediaTsContent.replace(
      'if (localOnlyFiles.includes(path)) {',
      "if (path.startsWith('/blog/') || localOnlyFiles.includes(path)) {"
    );
    fs.writeFileSync(mediaTsPath, mediaTsContent);
    console.log('✅ Updated utils/media.ts to preserve /blog/ local paths.');
  }

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
    console.log('✅ Local SQLite DB updated with local /blog/ image paths.');
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
    console.log('✅ Remote Neon PostgreSQL DB updated with local /blog/ image paths.');
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
    console.log('✅ AWS RDS Staging PostgreSQL DB updated with local /blog/ image paths.');
  } catch (e: any) {
    console.error('❌ AWS RDS Staging DB error:', e.message || e);
  } finally {
    await rdsPool.end();
  }

  console.log('\n🎉 All images downloaded to public/blog/ and updated across all databases!');
  process.exit(0);
}

run();
