import pg from 'pg';

const remoteConnectionString = 'postgresql://neondb_owner:npg_cS8JPsinDve1@ep-long-morning-aqxemcyr-pooler.c-8.us-east-1.aws.neon.tech/jway_web?sslmode=verify-full&channel_binding=require';

async function verify() {
  const pool = new pg.Pool({
    connectionString: remoteConnectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  const res = await pool.query(
    `SELECT id, title, slug, cover_image_url FROM posts ORDER BY id ASC;`
  );
  console.log(JSON.stringify(res.rows, null, 2));
  await pool.end();
}

verify();
