import fs from 'fs';
import path from 'path';
import { getPayloadClient } from './lib/getPayload';
import pg from 'pg';

const remoteConnectionString = 'postgresql://neondb_owner:npg_cS8JPsinDve1@ep-long-morning-aqxemcyr-pooler.c-8.us-east-1.aws.neon.tech/jway_web?sslmode=verify-full&channel_binding=require';

const defaultRobotsTxt = `# Robots.txt for JWay Group Inc.
User-agent: *
Allow: /

# Disallow administrative and private API endpoints
Disallow: /jway-administrator/
Disallow: /api/

# Sitemap Location
Sitemap: https://www.jway.com/sitemap.xml
`.trim();

async function run() {
  console.log('🚀 Setting up SEO Settings & Robots.txt...');

  // Remove old robots.ts if present
  const oldRobotsTs = path.resolve(process.cwd(), 'src/app/robots.ts');
  if (fs.existsSync(oldRobotsTs)) {
    fs.unlinkSync(oldRobotsTs);
    console.log('  ✅ Deleted legacy src/app/robots.ts in favor of dynamic route handler');
  }

  // 1. Local SQLite Payload CMS
  try {
    const payload = await getPayloadClient();
    await payload.updateGlobal({
      slug: 'seo-settings',
      data: {
        robotsTxt: defaultRobotsTxt,
      },
    });
    console.log('  ✅ Local SQLite: Seeded "seo-settings" Global');
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
    const checkRes = await pool.query(`SELECT id FROM payload_globals WHERE global_type = 'seo-settings';`);
    if (checkRes.rows.length === 0) {
      await pool.query(
        `INSERT INTO payload_globals (global_type, data, created_at, updated_at)
         VALUES ('seo-settings', $1, NOW(), NOW());`,
        [JSON.stringify({ robotsTxt: defaultRobotsTxt })]
      );
      console.log('  🌐 Remote Neon DB: Inserted "seo-settings" Global');
    } else {
      console.log('  🌐 Remote Neon DB: "seo-settings" Global already exists');
    }
  } catch (e: any) {
    console.error('❌ Remote Error:', e.message || e);
  } finally {
    await pool.end();
  }

  process.exit(0);
}

run();
