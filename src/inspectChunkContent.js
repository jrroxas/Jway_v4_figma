async function inspectContent() {
  const chunks = [
    '/_next/static/chunks/0p_hw3lm2izza.js',
    '/_next/static/chunks/0son6d422yese.js',
    '/_next/static/chunks/04ft4ld8iaqni.js',
  ];

  for (const chunkPath of chunks) {
    const res = await fetch('https://stg-ai.jway.com' + chunkPath);
    const code = await res.text();
    
    const adminMatches = code.match(/\/admin["'/]/g) || [];
    const jwayMatches = code.match(/\/jway-administrator["'/]/g) || [];

    console.log(`=== ${chunkPath} ===`);
    console.log(`  -> Matches for /admin: ${adminMatches.length}`);
    console.log(`  -> Matches for /jway-administrator: ${jwayMatches.length}`);
  }
}

inspectContent().catch(console.error);
