async function inspectStaging() {
  console.log('🔍 Fetching https://stg-ai.jway.com/jway-administrator/login...');
  const res = await fetch('https://stg-ai.jway.com/jway-administrator/login');
  console.log('Status code:', res.status);
  const html = await res.text();
  console.log('HTML size (bytes):', html.length);
  console.log('Includes login form or payload container:', html.includes('login') || html.includes('payload'));
  console.log('--- HTML SNIPPET ---');
  console.log(html.substring(0, 2000));
}

inspectStaging().catch(console.error);
