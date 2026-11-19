import https from 'https';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function checkAdminHtml() {
  const res = await fetch('https://stg-ai.jway.com/admin');
  const html = await res.text();
  console.log('Status:', res.status);
  console.log('HTML Snippet:', html.substring(0, 500));
}

checkAdminHtml().catch(console.error);
