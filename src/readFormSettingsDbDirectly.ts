import { getPayload } from 'payload';
import config from './payload.config';

async function checkDb() {
  const payload = await getPayload({ config });
  const globalDoc = await payload.findGlobal({
    slug: 'form-settings',
    overrideAccess: true,
  });

  console.log('--- DIRECT DATABASE VALUES FOR FORM-SETTINGS ---');
  console.log('oauth2ClientId:', JSON.stringify(globalDoc.oauth2ClientId));
  console.log('oauth2ClientSecret:', JSON.stringify(globalDoc.oauth2ClientSecret));
  console.log('oauth2RefreshToken:', JSON.stringify(globalDoc.oauth2RefreshToken));
}

checkDb().catch(console.error);
