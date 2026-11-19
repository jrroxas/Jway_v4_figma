async function testChunks() {
  const chunks = [
    '/_next/static/chunks/0x.73w57rn4ou.js',
    '/_next/static/chunks/0i.l9589uvx0j.js',
    '/_next/static/chunks/0p_hw3lm2izza.js',
    '/_next/static/chunks/0son6d422yese.js',
    '/_next/static/chunks/0xdf53ofesebh.js',
    '/_next/static/chunks/04ft4ld8iaqni.js',
    '/_next/static/chunks/09216o14yog_5.css',
  ];

  for (const chunk of chunks) {
    const url = 'https://stg-ai.jway.com' + chunk;
    const res = await fetch(url);
    console.log(chunk, '--> Status:', res.status, 'Size:', (await res.text()).length);
  }
}

testChunks().catch(console.error);
