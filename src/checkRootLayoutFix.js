async function checkRoutes() {
  console.log('🔍 Testing /jway-administrator and /jway-administrator/login...');
  const res1 = await fetch('http://localhost:3000/jway-administrator/login');
  console.log('Status code /jway-administrator/login:', res1.status);

  const res2 = await fetch('http://localhost:3000/jway-administrator');
  console.log('Status code /jway-administrator:', res2.status);

  const res3 = await fetch('http://localhost:3000/contact-us');
  console.log('Status code /contact-us:', res3.status);
}

checkRoutes().catch(console.error);
