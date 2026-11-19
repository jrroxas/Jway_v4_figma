import { getPayload } from 'payload';
import config from './payload.config';
import pg from 'pg';
import { sitePagesData } from './seedPages';

const remoteConnectionString = 'postgresql://neondb_owner:npg_cS8JPsinDve1@ep-long-morning-aqxemcyr-pooler.c-8.us-east-1.aws.neon.tech/jway_web?sslmode=verify-full&channel_binding=require';

async function syncRemote() {
  console.log('🚀 Connecting to Remote Test Server (Neon Postgres)...');
  const pool = new pg.Pool({
    connectionString: remoteConnectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  try {
    let created = 0;
    let updated = 0;

    for (const page of sitePagesData) {
      // Check if page exists in remote db
      const checkRes = await pool.query('SELECT id, title, slug, meta_title, meta_description FROM pages WHERE slug = $1;', [page.slug]);

      if (checkRes.rows.length > 0) {
        const id = checkRes.rows[0].id;
        await pool.query(
          `UPDATE pages 
           SET title = $1, meta_title = $2, meta_description = $3, updated_at = NOW() 
           WHERE id = $4;`,
          [page.title, page.metaTitle, page.metaDescription, id]
        );
        console.log(`  🔄 Updated Remote Page: "${page.title}" (slug: ${page.slug})`);
        updated++;
      } else {
        await pool.query(
          `INSERT INTO pages (title, slug, meta_title, meta_description, no_index, no_follow, created_at, updated_at) 
           VALUES ($1, $2, $3, $4, false, false, NOW(), NOW());`,
          [page.title, page.slug, page.metaTitle, page.metaDescription]
        );
        console.log(`  ✅ Created Remote Page: "${page.title}" (slug: ${page.slug})`);
        created++;
      }
    }

    console.log('\n========================================================================');
    console.log(`🎉 REMOTE TEST DATABASE SYNC COMPLETED SUCCESSFULLY!`);
    console.log(`   Created: ${created}`);
    console.log(`   Updated: ${updated}`);
    console.log('========================================================================');

  } catch (err: any) {
    console.error('❌ Sync Error:', err.message || err);
  } finally {
    await pool.end();
  }

  process.exit(0);
}

syncRemote();
