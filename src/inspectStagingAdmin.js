async function inspectStaging() {
  console.log('🔍 Fetching https://stg-ai.jway.com/jway-administrator/login...');
  const res = await fetch('https://stg-ai.jway.com/jway-administrator/login');
  console.log('Status code:', res.status);
  const html = await res.text();
  console.log('HTML snippet (first 1000 chars):');
  console.log(html.substring(0, 1000));
}

inspectStaging().catch(console.error);
