async function testRoute() {
  console.log('🔍 Testing new admin route /jway-administrator/login...');
  const res = await fetch('http://localhost:3000/jway-administrator/login');
  console.log('Status code for /jway-administrator/login:', res.status);
  
  const oldRes = await fetch('http://localhost:3000/admin/login');
  console.log('Status code for old /admin/login:', oldRes.status);
}

testRoute().catch(console.error);
