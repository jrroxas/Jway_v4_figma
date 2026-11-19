async function inspectDom() {
  const res = await fetch('http://localhost:3000/admin/login');
  const html = await res.text();
  
  // Find all class names in the HTML
  const classes = [...html.matchAll(/class="([^"]+)"/g)].map(m => m[1]);
  console.log('--- ALL CLASSES RENDERED IN LOGIN HTML ---');
  console.log([...new Set(classes)]);

  // Find img and svg tags
  const images = [...html.matchAll(/<(img|svg)[^>]*>/g)].map(m => m[0]);
  console.log('--- ALL IMAGES / SVGS ---');
  console.log(images);
}

inspectDom().catch(console.error);
