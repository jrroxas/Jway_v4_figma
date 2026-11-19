process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function testChunks() {
  const res = await fetch('https://stg-ai.jway.com/admin/login');
  const html = await res.text();
  
  const scripts = [...html.matchAll(/src="([^"]+)"/g)].map(m => m[1]);
  console.log('Found scripts:', scripts.length);

  for (const s of scripts) {
    const url = s.startsWith('http') ? s : `https://stg-ai.jway.com${s}`;
    const r = await fetch(url);
    if (r.status !== 200) {
      console.error(`❌ SCRIPT FAILED: ${url} (${r.status})`);
    } else {
      console.log(`✅ ${s}: OK (${r.status})`);
    }
  }
}

testChunks().catch(console.error);
