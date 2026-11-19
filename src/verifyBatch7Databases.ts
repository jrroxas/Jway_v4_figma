import { getPayloadClient } from './lib/getPayload';
import pg from 'pg';

const targetSlugs = [
  'use-flutter-to-optimize-your-costs-and-time-to-market',
  'traditional-versus-webflow-the-rise-of-no-code-web-development-platform',
  '7-essential-tips-to-develop-a-winning-recruitment-process',
  '3-most-important-elements-of-a-blog-template',
  '13-week-app-development-internship-program-at-jway',
  '5-things-that-will-change-the-way-you-approach-customers-using-a-crm-tool',
  'the-ultimate-guide-to-create-an-online-store',
];

const neonConnectionString =
  'postgresql://neondb_owner:npg_cS8JPsinDve1@ep-long-morning-aqxemcyr-pooler.c-8.us-east-1.aws.neon.tech/jway_web?sslmode=verify-full&channel_binding=require';

const rdsConnectionString =
  'postgresql://devops:2-1tLRb%5D%3EdO_W%29yE7M%5BfY-3%21%3FG%29%3E@ai-jwaystaging.csyjujqjax22.us-west-1.rds.amazonaws.com:5432/postgres?sslmode=verify-full&channel_binding=require';

async function verifyAll() {
  console.log(`🔍 Verifying ${targetSlugs.length} Batch Blog Posts Across 3 Databases...\n`);

  // 1. Local SQLite
  try {
    const payload = await getPayloadClient();
    let localFound = 0;
    for (const slug of targetSlugs) {
      const res = await payload.find({
        collection: 'posts',
        where: { slug: { equals: slug } },
      });
      if (res.docs && res.docs.length > 0) localFound++;
    }
    console.log(`✅ Local SQLite Payload CMS: ${localFound}/${targetSlugs.length} VERIFIED`);
  } catch (e: any) {
    console.error('❌ Local SQLite Error:', e.message || e);
  }

  // 2. Remote Neon PostgreSQL
  const neonPool = new pg.Pool({
    connectionString: neonConnectionString.replace(/\?sslmode=.*$/, ''),
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  try {
    const checkRes = await neonPool.query(
      `SELECT slug FROM posts WHERE slug = ANY($1);`,
      [targetSlugs]
    );
    console.log(`✅ Remote Neon PostgreSQL: ${checkRes.rows.length}/${targetSlugs.length} VERIFIED`);
  } catch (e: any) {
    console.error('❌ Remote Neon Error:', e.message || e);
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
    const checkRes = await rdsPool.query(
      `SELECT slug FROM posts WHERE slug = ANY($1);`,
      [targetSlugs]
    );
    console.log(`✅ AWS RDS Staging PostgreSQL: ${checkRes.rows.length}/${targetSlugs.length} VERIFIED`);
  } catch (e: any) {
    console.error('❌ AWS RDS Staging Error:', e.message || e);
  } finally {
    await rdsPool.end();
  }

  process.exit(0);
}

verifyAll();
