async function testJsChunks() {
  console.log('🔍 Inspecting client JS chunks for error patterns...');
  const chunks = [
    '/_next/static/chunks/0x.73w57rn4ou.js',
    '/_next/static/chunks/0i.l9589uvx0j.js',
    '/_next/static/chunks/0p_hw3lm2izza.js',
    '/_next/static/chunks/0son6d422yese.js',
    '/_next/static/chunks/0xdf53ofesebh.js',
    '/_next/static/chunks/04ft4ld8iaqni.js',
  ];

  for (const chunkPath of chunks) {
    const res = await fetch('https://stg-ai.jway.com' + chunkPath);
    const code = await res.text();
    console.log(`Chunk ${chunkPath}: size ${code.length}`);
    if (code.includes('admin') || code.includes('jway-administrator')) {
      console.log(`  -> Contains route references in ${chunkPath}`);
    }
  }
}

testJsChunks().catch(console.error);
