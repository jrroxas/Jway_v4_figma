async function testDispatch() {
  console.log('🚀 Testing contact form submission with updated From header...');
  const res = await fetch('http://localhost:3000/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      formName: 'Contact Us Form',
      name: 'Test Sender Verification',
      email: 'joey.concepcion@jway.com',
      company: 'JWay Philippines',
      phone: '+6 (321) 458-4655',
      subject: 'Sender Header Test',
      message: 'Testing email dispatch to verify From Email (Sender) is info@jway.com',
    }),
  });

  const data = await res.json();
  console.log('--- SUBMISSION RESPONSE ---');
  console.log(data);
}

testDispatch().catch(console.error);
