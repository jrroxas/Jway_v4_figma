import fs from 'fs';
import path from 'path';
import { createClient } from '@libsql/client';
import pg from 'pg';

const dbPath = path.resolve(process.cwd(), '.data/jway-local.db');
const localDbUrl = `file:${dbPath.replace(/\\/g, '/')}`;

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
  console.log('🚀 Creating SEO Settings Schema & Seeding Data...');

  // 1. Local SQLite Table Setup
  try {
    const client = createClient({ url: localDbUrl });

    await client.execute(`
      CREATE TABLE IF NOT EXISTS seo_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        robots_txt TEXT,
        updated_at TEXT,
        created_at TEXT
      );
    `);

    await client.execute(`
      CREATE TABLE IF NOT EXISTS payload_globals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        global_type TEXT UNIQUE,
        data TEXT,
        updated_at TEXT,
        created_at TEXT
      );
    `);

    const existing = await client.execute(`SELECT id FROM seo_settings LIMIT 1;`);
    if (existing.rows.length === 0) {
      await client.execute({
        sql: `INSERT INTO seo_settings (robots_txt, updated_at, created_at) VALUES (?, ?, ?);`,
        args: [defaultRobotsTxt, new Date().toISOString(), new Date().toISOString()],
      });
      console.log('  ✅ Local SQLite: Created & Seeded "seo_settings" table');
    } else {
      console.log('  ✅ Local SQLite: "seo_settings" record already exists');
    }

    const existingGlobal = await client.execute({
      sql: `SELECT id FROM payload_globals WHERE global_type = ?;`,
      args: ['seo-settings'],
    });

    if (existingGlobal.rows.length === 0) {
      await client.execute({
        sql: `INSERT INTO payload_globals (global_type, data, updated_at, created_at) VALUES (?, ?, ?, ?);`,
        args: ['seo-settings', JSON.stringify({ robotsTxt: defaultRobotsTxt }), new Date().toISOString(), new Date().toISOString()],
      });
    }

  } catch (e: any) {
    console.error('❌ Local SQLite Error:', e.message || e);
  }

  // 2. Remote Neon PostgreSQL Table Setup
  const pool = new pg.Pool({
    connectionString: remoteConnectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS seo_settings (
        id SERIAL PRIMARY KEY,
        robots_txt TEXT,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS payload_globals (
        id SERIAL PRIMARY KEY,
        global_type VARCHAR UNIQUE,
        data JSONB,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    const checkRes = await pool.query(`SELECT id FROM seo_settings LIMIT 1;`);
    if (checkRes.rows.length === 0) {
      await pool.query(
        `INSERT INTO seo_settings (robots_txt, updated_at, created_at) VALUES ($1, NOW(), NOW());`,
        [defaultRobotsTxt]
      );
      console.log('  🌐 Remote Neon DB: Created & Seeded "seo_settings" table');
    } else {
      console.log('  🌐 Remote Neon DB: "seo_settings" record already exists');
    }

    const checkGlobal = await pool.query(`SELECT id FROM payload_globals WHERE global_type = 'seo-settings';`);
    if (checkGlobal.rows.length === 0) {
      await pool.query(
        `INSERT INTO payload_globals (global_type, data, updated_at, created_at) VALUES ('seo-settings', $1, NOW(), NOW());`,
        [JSON.stringify({ robotsTxt: defaultRobotsTxt })]
      );
    }

  } catch (e: any) {
    console.error('❌ Remote Neon Error:', e.message || e);
  } finally {
    await pool.end();
  }

  process.exit(0);
}

run();
