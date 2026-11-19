async function inspectBody() {
  const res = await fetch('https://stg-ai.jway.com/jway-administrator/login');
  const html = await res.text();
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  console.log('--- STAGING BODY HTML ---');
  if (bodyMatch) {
    console.log(bodyMatch[1].substring(0, 3000));
  } else {
    console.log('No body match found');
  }
}

inspectBody().catch(console.error);
