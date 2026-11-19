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
  console.log('🧹 Dropping old form_settings table to allow Payload schema auto-creation...');
  await client.execute('DROP TABLE IF EXISTS form_settings;');
  await client.execute('DROP TABLE IF EXISTS _form_settings_v;');
  console.log('✅ form_settings table dropped successfully!');
}

main().catch(console.error);
