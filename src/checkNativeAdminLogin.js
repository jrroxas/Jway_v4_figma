async function testNativeLogin() {
  console.log('🔍 Testing native Payload login route /jway-administrator/login...');
  const res = await fetch('http://localhost:3000/jway-administrator/login');
  console.log('Status code /jway-administrator/login:', res.status);

  const html = await res.text();
  const includesForm = html.includes('form') || html.includes('Payload');
  console.log('HTML contains Payload login container:', includesForm);
}

testNativeLogin().catch(console.error);
