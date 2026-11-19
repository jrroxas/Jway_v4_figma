import fs from 'fs';
import path from 'path';
import { createClient } from '@libsql/client';
import pg from 'pg';

const dbPath = path.resolve(process.cwd(), '.data/jway-local.db');
const localDbUrl = `file:${dbPath.replace(/\\/g, '/')}`;

const remoteConnectionString = 'postgresql://neondb_owner:npg_cS8JPsinDve1@ep-long-morning-aqxemcyr-pooler.c-8.us-east-1.aws.neon.tech/jway_web?sslmode=verify-full&channel_binding=require';

const defaultHeaderScripts = `<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1012098261533939');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=1012098261533939&ev=PageView&noscript=1"
/></noscript>
<!-- End Meta Pixel Code -->`.trim();

const defaultBodyScripts = '';
const defaultFooterScripts = '';

async function run() {
  console.log('🚀 Setting up Header/Body/Footer Scripts Schema & Seeding Data...');

  // 1. Local SQLite Table Setup
  try {
    const client = createClient({ url: localDbUrl });

    await client.execute(`
      CREATE TABLE IF NOT EXISTS header_footer_scripts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        header_scripts TEXT,
        body_scripts TEXT,
        footer_scripts TEXT,
        updated_at TEXT,
        created_at TEXT
      );
    `);

    // Ensure body_scripts column exists
    try {
      await client.execute(`ALTER TABLE header_footer_scripts ADD COLUMN body_scripts TEXT;`);
    } catch (e) {
      // Column might already exist
    }

    await client.execute(`
      CREATE TABLE IF NOT EXISTS payload_globals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        global_type TEXT UNIQUE,
        data TEXT,
        updated_at TEXT,
        created_at TEXT
      );
    `);

    const existing = await client.execute(`SELECT id FROM header_footer_scripts LIMIT 1;`);
    if (existing.rows.length === 0) {
      await client.execute({
        sql: `INSERT INTO header_footer_scripts (header_scripts, body_scripts, footer_scripts, updated_at, created_at) VALUES (?, ?, ?, ?, ?);`,
        args: [defaultHeaderScripts, defaultBodyScripts, defaultFooterScripts, new Date().toISOString(), new Date().toISOString()],
      });
      console.log('  ✅ Local SQLite: Created & Seeded "header_footer_scripts" table');
    } else {
      console.log('  ✅ Local SQLite: "header_footer_scripts" record already exists');
    }

    const existingGlobal = await client.execute({
      sql: `SELECT id FROM payload_globals WHERE global_type = ?;`,
      args: ['header-footer-scripts'],
    });

    if (existingGlobal.rows.length === 0) {
      await client.execute({
        sql: `INSERT INTO payload_globals (global_type, data, updated_at, created_at) VALUES (?, ?, ?, ?);`,
        args: ['header-footer-scripts', JSON.stringify({ headerScripts: defaultHeaderScripts, bodyScripts: defaultBodyScripts, footerScripts: defaultFooterScripts }), new Date().toISOString(), new Date().toISOString()],
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
      CREATE TABLE IF NOT EXISTS header_footer_scripts (
        id SERIAL PRIMARY KEY,
        header_scripts TEXT,
        body_scripts TEXT,
        footer_scripts TEXT,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Ensure body_scripts column exists
    try {
      await pool.query(`ALTER TABLE header_footer_scripts ADD COLUMN IF NOT EXISTS body_scripts TEXT;`);
    } catch (e) {
      // Column might already exist
    }

    await pool.query(`
      CREATE TABLE IF NOT EXISTS payload_globals (
        id SERIAL PRIMARY KEY,
        global_type VARCHAR UNIQUE,
        data JSONB,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    const checkRes = await pool.query(`SELECT id FROM header_footer_scripts LIMIT 1;`);
    if (checkRes.rows.length === 0) {
      await pool.query(
        `INSERT INTO header_footer_scripts (header_scripts, body_scripts, footer_scripts, updated_at, created_at) VALUES ($1, $2, $3, NOW(), NOW());`,
        [defaultHeaderScripts, defaultBodyScripts, defaultFooterScripts]
      );
      console.log('  🌐 Remote Neon DB: Created & Seeded "header_footer_scripts" table');
    } else {
      console.log('  🌐 Remote Neon DB: "header_footer_scripts" record already exists');
    }

    const checkGlobal = await pool.query(`SELECT id FROM payload_globals WHERE global_type = 'header-footer-scripts';`);
    if (checkGlobal.rows.length === 0) {
      await pool.query(
        `INSERT INTO payload_globals (global_type, data, updated_at, created_at) VALUES ('header-footer-scripts', $1, NOW(), NOW());`,
        [JSON.stringify({ headerScripts: defaultHeaderScripts, bodyScripts: defaultBodyScripts, footerScripts: defaultFooterScripts })]
      );
      console.log('  🌐 Remote Neon DB: Seeded payload_globals for "header-footer-scripts"');
    }

  } catch (e: any) {
    console.error('❌ Remote Neon Error:', e.message || e);
  } finally {
    await pool.end();
  }

  process.exit(0);
}

run();
