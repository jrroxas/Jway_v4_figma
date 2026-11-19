process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function testAdmin() {
  const res = await fetch('https://stg-ai.jway.com/admin/login');
  const html = await res.text();
  console.log('--- ADMIN RESPONSE LENGTH ---', html.length);
  console.log('--- FULL ADMIN HTML CONTENT ---');
  console.log(html);
}

testAdmin().catch(console.error);
