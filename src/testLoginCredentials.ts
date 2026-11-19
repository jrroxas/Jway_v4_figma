import { getPayload } from 'payload';
import config from './payload.config';

async function testLogin() {
  const payload = await getPayload({ config });
  const result = await payload.login({
    collection: 'users',
    data: {
      email: 'joey.concepcion@jway.com',
      password: 'k9#mP2$xR8!v',
    },
  });
  console.log('Login test successful for user:', result.user?.email ?? 'unknown');
}

testLogin()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Login test failed:', err);
    process.exit(1);
  });
