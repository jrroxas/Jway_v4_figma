import { getPayload } from 'payload';
import config from './src/payload.config.js';

async function run() {
  const payload = await getPayload({ config });
  const users = await payload.find({ collection: 'users' });
  console.log('USERS_LIST:', users.docs.map(u => ({ email: u.email, name: u.name })));
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
