import { getPayload } from 'payload';
import config from './payload.config';

async function fixDoc() {
  console.log('Inspecting FormSettings global document...');
  const payload = await getPayload({ config });

  const current = await payload.findGlobal({
    slug: 'form-settings',
  });

  console.log('Current stored values:');
  console.log('  oauth2ClientId:', current.oauth2ClientId);
  console.log('  oauth2ClientSecret:', current.oauth2ClientSecret);
  console.log('  oauth2RefreshToken:', current.oauth2RefreshToken);

  const isBullet = (str: unknown) => typeof str === 'string' && str.includes('...');

  const updateData: Record<string, string> = {};
  if (isBullet(current.oauth2ClientId)) {
    updateData.oauth2ClientId = '';
  }
  if (isBullet(current.oauth2RefreshToken)) {
    updateData.oauth2RefreshToken = '';
  }

  if (Object.keys(updateData).length > 0) {
    await payload.updateGlobal({
      slug: 'form-settings',
      data: updateData,
    });
    console.log('Cleared placeholder strings from stored database record:', updateData);
  } else {
    console.log('No placeholder strings in database record.');
  }
}

fixDoc()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Error fixing FormSettings record:', err);
    process.exit(1);
  });
