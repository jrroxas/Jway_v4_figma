import { getPayloadClient } from './lib/getPayload';
import pg from 'pg';

const targetSlug = 'certified-true-copies-now-required-for-first-time-jobseekers-in-the-philippines';

const neonConnectionString =
  'postgresql://neondb_owner:npg_cS8JPsinDve1@ep-long-morning-aqxemcyr-pooler.c-8.us-east-1.aws.neon.tech/jway_web?sslmode=verify-full&channel_binding=require';

const rdsConnectionString =
  'postgresql://devops:2-1tLRb%5D%3EdO_W%29yE7M%5BfY-3%21%3FG%29%3E@ai-jwaystaging.csyjujqjax22.us-west-1.rds.amazonaws.com:5432/postgres?sslmode=verify-full&channel_binding=require';

async function verifyAll() {
  console.log('🔍 Verifying Blog Post Migration Across 3 Databases...\n');

  // 1. Local SQLite Payload CMS
  try {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: 'posts',
      where: { slug: { equals: targetSlug } },
    });
    if (res.docs && res.docs.length > 0) {
      console.log('✅ Local SQLite Payload CMS: VERIFIED');
      console.log('   ID:', res.docs[0].id);
      console.log('   Title:', res.docs[0].title);
      console.log('   Category:', (res.docs[0] as any).category);
    } else {
      console.error('❌ Local SQLite Payload CMS: NOT FOUND');
    }
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
      `SELECT id, title, slug, category, published_date FROM posts WHERE slug = $1;`,
      [targetSlug]
    );
    if (checkRes.rows.length > 0) {
      console.log('\n✅ Remote Neon PostgreSQL: VERIFIED');
      console.log('   ID:', checkRes.rows[0].id);
      console.log('   Title:', checkRes.rows[0].title);
      console.log('   Category:', checkRes.rows[0].category);
      console.log('   Date:', checkRes.rows[0].published_date);
    } else {
      console.error('\n❌ Remote Neon PostgreSQL: NOT FOUND');
    }
  } catch (e: any) {
    console.error('\n❌ Remote Neon Error:', e.message || e);
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
      `SELECT id, title, slug, category, published_date FROM posts WHERE slug = $1;`,
      [targetSlug]
    );
    if (checkRes.rows.length > 0) {
      console.log('\n✅ AWS RDS Staging PostgreSQL: VERIFIED');
      console.log('   ID:', checkRes.rows[0].id);
      console.log('   Title:', checkRes.rows[0].title);
      console.log('   Category:', checkRes.rows[0].category);
      console.log('   Date:', checkRes.rows[0].published_date);
    } else {
      console.error('\n❌ AWS RDS Staging PostgreSQL: NOT FOUND');
    }
  } catch (e: any) {
    console.error('\n❌ AWS RDS Staging Error:', e.message || e);
  } finally {
    await rdsPool.end();
  }

  process.exit(0);
}

verifyAll();
