import { getPayloadClient } from './lib/getPayload';
import pg from 'pg';

const remoteConnectionString = 'postgresql://neondb_owner:npg_cS8JPsinDve1@ep-long-morning-aqxemcyr-pooler.c-8.us-east-1.aws.neon.tech/jway_web?sslmode=verify-full&channel_binding=require';

async function inspectDb() {
  console.log('--- LOCAL PAYLOAD TESTIMONIALS ---');
  try {
    const payload = await getPayloadClient();
    const localRes = await payload.find({ collection: 'testimonials', limit: 100 });
    console.log(`Local docs count: ${localRes.docs.length}`);
    localRes.docs.forEach((doc: any) => {
      console.log(`  [${doc.order}] ${doc.name} (${doc.company})`);
    });
  } catch (e) {
    console.error('Local error:', e);
  }

  console.log('\n--- REMOTE POSTGRES TESTIMONIALS ---');
  const pool = new pg.Pool({
    connectionString: remoteConnectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  try {
    const res = await pool.query('SELECT * FROM testimonials;');
    console.log(`Remote rows count: ${res.rows.length}`);
    res.rows.forEach((row: any) => {
      console.log(`  [${row.order}] ${row.name} (${row.company}) - ID: ${row.id}`);
    });
  } catch (e: any) {
    console.error('Remote error:', e.message || e);
  } finally {
    await pool.end();
  }

  process.exit(0);
}

inspectDb();
