async function getConsoleError() {
  console.log('🔍 Checking console errors for https://stg-ai.jway.com/jway-administrator/login...');
  // We can fetch the RSC payload chunks directly to inspect if React throws a boundary error!
  const res = await fetch('https://stg-ai.jway.com/jway-administrator/login?_rsc=1');
  console.log('RSC Header Status:', res.status);
  const text = await res.text();
  console.log('RSC Payload snippet (first 1000 chars):');
  console.log(text.substring(0, 1000));
}

getConsoleError().catch(console.error);
