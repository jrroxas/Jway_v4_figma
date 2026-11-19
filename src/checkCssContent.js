async function checkCss() {
  const res = await fetch('http://localhost:3000/_next/static/chunks/_0vseub5._.css');
  const css = await res.text();
  console.log('CSS Length:', css.length);
  console.log('CSS Snippet:', css.substring(0, 500));
}

checkCss().catch(console.error);
