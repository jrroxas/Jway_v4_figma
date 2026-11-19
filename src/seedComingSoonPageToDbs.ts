import { getPayloadClient } from './lib/getPayload';
import pg from 'pg';

const remoteConnectionString = 'postgresql://neondb_owner:npg_cS8JPsinDve1@ep-long-morning-aqxemcyr-pooler.c-8.us-east-1.aws.neon.tech/jway_web?sslmode=verify-full&channel_binding=require';

const pageItem = {
  title: 'Coming Soon',
  slug: 'coming-soon',
  metaTitle: 'Coming Soon | JWay Group Inc.',
  metaDescription: 'We are currently working on a new super awesome website.',
};

async function run() {
  console.log('🚀 Seeding Coming Soon page into Payload CMS & Database (Local & Remote)...');

  // 1. Local SQLite Payload CMS
  try {
    const payload = await getPayloadClient();
    const existing = await payload.find({
      collection: 'pages',
      where: { slug: { equals: pageItem.slug } },
    });

    if (existing.docs && existing.docs.length > 0) {
      console.log(`  ⏭  Local SQLite: Skipped "${pageItem.slug}" (Already exists)`);
    } else {
      await payload.create({
        collection: 'pages',
        data: {
          title: pageItem.title,
          slug: pageItem.slug,
          metaTitle: pageItem.metaTitle,
          metaDescription: pageItem.metaDescription,
        },
      });
      console.log(`  ✅ Local SQLite: Created page "${pageItem.title}" (${pageItem.slug})`);
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
    const checkRes = await pool.query(`SELECT id FROM pages WHERE slug = $1;`, [pageItem.slug]);
    if (checkRes.rows.length > 0) {
      console.log(`  ⏭  Remote Neon DB: Skipped "${pageItem.slug}" (Already exists)`);
    } else {
      await pool.query(
        `INSERT INTO pages (title, slug, meta_title, meta_description, created_at, updated_at)
         VALUES ($1, $2, $3, $4, NOW(), NOW());`,
        [pageItem.title, pageItem.slug, pageItem.metaTitle, pageItem.metaDescription]
      );
      console.log(`  🌐 Remote Neon DB: Inserted page "${pageItem.title}" (${pageItem.slug})`);
    }
  } catch (e: any) {
    console.error('❌ Remote Error:', e.message || e);
  } finally {
    await pool.end();
  }

  process.exit(0);
}

run();
