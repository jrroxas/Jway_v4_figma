import pg from 'pg';

const neonConnectionString =
  'postgresql://neondb_owner:npg_cS8JPsinDve1@ep-long-morning-aqxemcyr-pooler.c-8.us-east-1.aws.neon.tech/jway_web?sslmode=verify-full&channel_binding=require';

const rdsConnectionString =
  'postgresql://devops:2-1tLRb%5D%3EdO_W%29yE7M%5BfY-3%21%3FG%29%3E@ai-jwaystaging.csyjujqjax22.us-west-1.rds.amazonaws.com:5432/postgres?sslmode=verify-full&channel_binding=require';

const slug = 'the-ultimate-guide-to-create-an-online-store';

async function check() {
  console.log(`Checking remote databases for slug: "${slug}"...\n`);

  // Neon
  const neonPool = new pg.Pool({
    connectionString: neonConnectionString.replace(/\?sslmode=.*$/, ''),
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  try {
    const res = await neonPool.query(`SELECT id, title, slug, length(content_html) as content_length, cover_image_url FROM posts WHERE slug = $1;`, [slug]);
    console.log('🌐 Neon DB Result:', res.rows[0]);
  } catch (e: any) {
    console.error('❌ Neon Error:', e.message || e);
  } finally {
    await neonPool.end();
  }

  // AWS RDS Staging
  const rdsPool = new pg.Pool({
    connectionString: rdsConnectionString.replace(/\?sslmode=.*$/, ''),
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  try {
    const res = await rdsPool.query(`SELECT id, title, slug, length(content_html) as content_length, cover_image_url FROM posts WHERE slug = $1;`, [slug]);
    console.log('☁️ AWS RDS Staging DB Result:', res.rows[0]);
  } catch (e: any) {
    console.error('❌ AWS RDS Staging Error:', e.message || e);
  } finally {
    await rdsPool.end();
  }

  process.exit(0);
}

check();
