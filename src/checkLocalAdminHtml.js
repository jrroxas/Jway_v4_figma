async function checkLocalAdmin() {
  const res = await fetch('http://localhost:3000/admin/login');
  const html = await res.text();
  console.log('--- LOCAL ADMIN LOGIN HTML ---');
  console.log(html.substring(0, 1000));

  const styles = [...html.matchAll(/rel="stylesheet"[^>]*href="([^"]+)"/g)].map(m => m[1]);
  console.log('--- STYLESHEETS LOADED ---', styles);
}

checkLocalAdmin().catch(console.error);
