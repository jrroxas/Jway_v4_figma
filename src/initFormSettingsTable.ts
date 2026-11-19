import { createClient } from '@libsql/client';
import path from 'path';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const dbPath = path.resolve(dirname, '../.data/jway-local.db');

const client = createClient({
  url: `file:${dbPath.replace(/\\/g, '/')}`,
});

async function main() {
  console.log('🛠️ Adding OAuth2 columns to form_settings table in SQLite...');
  
  await client.execute('DROP TABLE IF EXISTS form_settings;');
  await client.execute('DROP TABLE IF EXISTS _form_settings_v;');

  await client.execute(`
    CREATE TABLE form_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email_recipient TEXT DEFAULT 'joey.concepcion@jway.com',
      email_cc TEXT,
      email_subject TEXT DEFAULT 'New Contact Form Submission',
      from_email TEXT DEFAULT 'info@jway.com',
      enable_smtp INTEGER DEFAULT 1,
      auth_type TEXT DEFAULT 'smtp',
      smtp_host TEXT,
      smtp_port INTEGER DEFAULT 587,
      smtp_secure INTEGER DEFAULT 0,
      smtp_user TEXT,
      smtp_pass TEXT,
      oauth2_client_id TEXT,
      oauth2_client_secret TEXT,
      oauth2_refresh_token TEXT,
      updated_at TEXT,
      created_at TEXT
    );
  `);

  const now = new Date().toISOString();
  await client.execute({
    sql: `INSERT INTO form_settings (email_recipient, email_subject, from_email, enable_smtp, auth_type, smtp_port, smtp_secure, updated_at, created_at)
          VALUES (?, ?, ?, 1, 'smtp', 587, 0, ?, ?)`,
    args: ['joey.concepcion@jway.com', 'New Contact Form Submission', 'info@jway.com', now, now],
  });
  console.log('✅ Default Form Settings table recreated with OAuth2 columns!');
}

main().catch(console.error);
