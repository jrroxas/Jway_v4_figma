async function traceRedirects(url) {
  console.log(`\n🔍 Tracing redirects for: ${url}`);
  let currentUrl = url;
  let count = 0;
  
  while (count < 10) {
    count++;
    const res = await fetch(currentUrl, { redirect: 'manual' });
    console.log(`Step ${count}: ${currentUrl} -> Status ${res.status}`);
    const location = res.headers.get('location');
    if (location) {
      console.log(`  Redirecting to: ${location}`);
      currentUrl = new URL(location, currentUrl).href;
    } else {
      console.log(`  Final Destination: ${currentUrl} (Status ${res.status})`);
      break;
    }
  }
}

async function main() {
  await traceRedirects('http://localhost:3000/admin');
  await traceRedirects('http://localhost:3000/admin/login');
  await traceRedirects('http://localhost:3000/jway-administrator');
  await traceRedirects('http://localhost:3000/jway-administrator/login');
}

main().catch(console.error);
