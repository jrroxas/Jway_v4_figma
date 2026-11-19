import { getPayloadClient } from './lib/getPayload';
import pg from 'pg';

const remoteConnectionString = 'postgresql://neondb_owner:npg_cS8JPsinDve1@ep-long-morning-aqxemcyr-pooler.c-8.us-east-1.aws.neon.tech/jway_web?sslmode=verify-full&channel_binding=require';

const slug = '15-minute-magic-turning-complexity-into-click-by-click-guides-with-ai';
const coverImageUrl = '/blog/Banner-1.png';

async function update15MinMagic() {
  console.log(`🚀 Updating Thumbnail for "${slug}" -> ${coverImageUrl}`);

  // 1. Local SQLite Payload CMS
  try {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: 'posts',
      where: { slug: { equals: slug } },
    });
    if (res.docs && res.docs.length > 0) {
      const doc = res.docs[0];
      await payload.update({
        collection: 'posts',
        id: doc.id,
        data: { coverImageUrl },
      });
      console.log(`  ✅ Local SQLite: Updated thumbnail to ${coverImageUrl}`);
    }
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
    const res = await pool.query(
      `UPDATE posts SET cover_image_url = $1, updated_at = NOW() WHERE slug = $2;`,
      [coverImageUrl, slug]
    );
    console.log(`  🌐 Remote Neon DB: Updated ${res.rowCount} row(s) to ${coverImageUrl}`);
  } catch (e: any) {
    console.error('❌ Remote Error:', e.message || e);
  } finally {
    await pool.end();
  }

  process.exit(0);
}

update15MinMagic();
