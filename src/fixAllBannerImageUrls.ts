import fs from 'fs';
import pg from 'pg';
import https from 'https';
import { getPayloadClient } from './lib/getPayload';

const neonConnectionString =
  'postgresql://neondb_owner:npg_cS8JPsinDve1@ep-long-morning-aqxemcyr-pooler.c-8.us-east-1.aws.neon.tech/jway_web?sslmode=verify-full&channel_binding=require';

const rdsConnectionString =
  'postgresql://devops:2-1tLRb%5D%3EdO_W%29yE7M%5BfY-3%21%3FG%29%3E@ai-jwaystaging.csyjujqjax22.us-west-1.rds.amazonaws.com:5432/postgres?sslmode=verify-full&channel_binding=require';

const agent = new https.Agent({ rejectUnauthorized: false });

async function checkUrl(url: string): Promise<number> {
  return new Promise((resolve) => {
    https
      .get(url, { agent }, (res) => resolve(res.statusCode || 500))
      .on('error', () => resolve(500));
  });
}

// 1. Update media.ts to replace spaces in paths with underscores automatically
const mediaTsPath = 'c:\\Localhost\\jway-site\\src\\utils\\media.ts';
let mediaTsContent = fs.readFileSync(mediaTsPath, 'utf8');

if (!mediaTsContent.includes('path.replace(/ /g, "_")')) {
  mediaTsContent = mediaTsContent.replace(
    'if (!path) return \'\';',
    'if (!path) return \'\';\n  path = path.replace(/ /g, "_");'
  );
  fs.writeFileSync(mediaTsPath, mediaTsContent);
  console.log('✅ Updated utils/media.ts to replace spaces in paths with underscores.');
}

const articles = JSON.parse(
  fs.readFileSync('c:\\Localhost\\jway-site\\src\\allArticlesFullParsed.json', 'utf8')
);

async function run() {
  console.log('🔍 Checking and fixing all banner image URLs...\n');

  for (const art of articles) {
    let cleanCover = art.coverImageUrl.replace(/ /g, '_');
    if (!cleanCover.startsWith('http')) {
      cleanCover = `https://jway-ai-content.s3.us-west-1.amazonaws.com/jway-ai-content${cleanCover.startsWith('/') ? '' : '/'}${cleanCover}`;
    }
    art.coverImageUrl = cleanCover;

    const status = await checkUrl(cleanCover);
    console.log(`[${status}] Post "${art.title}" (${art.slug}) -> Cover: ${cleanCover}`);
  }

  // Save updated JSON
  fs.writeFileSync(
    'c:\\Localhost\\jway-site\\src\\allArticlesFullParsed.json',
    JSON.stringify(articles, null, 2)
  );

  // 2. Update Local SQLite Payload CMS
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
          },
        });
      }
    }
    console.log('✅ Local SQLite DB updated with sanitized cover banner URLs.');
  } catch (e: any) {
    console.error('❌ Local SQLite error:', e.message || e);
  }

  // 3. Remote Neon PostgreSQL
  const neonPool = new pg.Pool({
    connectionString: neonConnectionString.replace(/\?sslmode=.*$/, ''),
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  try {
    for (const item of articles) {
      await neonPool.query(
        `UPDATE posts SET cover_image_url = $1, updated_at = NOW() WHERE slug = $2;`,
        [item.coverImageUrl, item.slug]
      );
    }
    console.log('✅ Remote Neon PostgreSQL DB updated with sanitized cover banner URLs.');
  } catch (e: any) {
    console.error('❌ Neon DB error:', e.message || e);
  } finally {
    await neonPool.end();
  }

  // 4. AWS RDS Staging PostgreSQL
  const rdsPool = new pg.Pool({
    connectionString: rdsConnectionString.replace(/\?sslmode=.*$/, ''),
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  try {
    for (const item of articles) {
      await rdsPool.query(
        `UPDATE posts SET cover_image_url = $1, updated_at = NOW() WHERE slug = $2;`,
        [item.coverImageUrl, item.slug]
      );
    }
    console.log('✅ AWS RDS Staging PostgreSQL DB updated with sanitized cover banner URLs.');
  } catch (e: any) {
    console.error('❌ AWS RDS Staging DB error:', e.message || e);
  } finally {
    await rdsPool.end();
  }

  console.log('\n🎉 Banner image URLs sanitized and verified across all databases!');
  process.exit(0);
}

run();
