import { getPayloadClient } from './lib/getPayload';
import pg from 'pg';

const remoteConnectionString = 'postgresql://neondb_owner:npg_cS8JPsinDve1@ep-long-morning-aqxemcyr-pooler.c-8.us-east-1.aws.neon.tech/jway_web?sslmode=verify-full&channel_binding=require';

async function run() {
  console.log('🧹 Cleaning up [...notFound] CMS page record...');

  // 1. Local SQLite Payload CMS
  try {
    const payload = await getPayloadClient();
    await payload.delete({
      collection: 'pages',
      where: {
        or: [
          { slug: { equals: '...notfound' } },
          { slug: { equals: '[...notFound]' } },
          { title: { equals: '[...notFound]' } }
        ]
      }
    });
    console.log('  ✅ Local SQLite: Removed [...notFound] page record');
  } catch (e: any) {
    console.error('❌ Local Error:', e.message || e);
  }

  // 2. Remote Neon PostgreSQL
  const pool = new pg.Pool({
    connectionString: remoteConnectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  try {
    await pool.query(`DELETE FROM pages WHERE slug LIKE '%notfound%' OR title LIKE '%notFound%';`);
    console.log('  🌐 Remote Neon DB: Deleted [...notFound] page record');
  } catch (e: any) {
    console.error('❌ Remote Error:', e.message || e);
  } finally {
    await pool.end();
  }

  process.exit(0);
}

run();
