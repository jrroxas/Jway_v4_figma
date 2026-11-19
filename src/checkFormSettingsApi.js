async function checkApi() {
  const res = await fetch('http://localhost:3000/api/globals/form-settings');
  const data = await res.json();
  console.log('--- API GLOBAL FORM SETTINGS DATA ---');
  console.log('oauth2ClientId:', JSON.stringify(data.oauth2ClientId));
  console.log('oauth2ClientSecret:', JSON.stringify(data.oauth2ClientSecret));
  console.log('oauth2RefreshToken:', JSON.stringify(data.oauth2RefreshToken));
}

checkApi().catch(console.error);
