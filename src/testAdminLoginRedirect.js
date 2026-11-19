async function testLoginRedirect() {
  console.log('🚀 Testing /api/admin-login redirect destination...');
  const res = await fetch('http://localhost:3000/api/admin-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'joey.concepcion@jway.com',
      password: 'k9#mP2$xR8!v',
    }),
  });

  console.log('Response status:', res.status);
  const data = await res.json();
  console.log('Response body:', data);
}

testLoginRedirect().catch(console.error);
