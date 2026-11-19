async function inspectStaging() {
  console.log('🔍 Inspecting https://stg-ai.jway.com/jway-administrator/login...');
  const res = await fetch('https://stg-ai.jway.com/jway-administrator/login');
  console.log('Status:', res.status);
  const html = await res.text();
  console.log('Total HTML Length:', html.length);
  
  const countHtmlTags = (html.match(/<html/gi) || []).length;
  const countBodyTags = (html.match(/<body/gi) || []).length;
  console.log('Number of <html tags:', countHtmlTags);
  console.log('Number of <body tags:', countBodyTags);

  // Check if old /admin is still referenced in JS bundle links
  const countOldAdmin = (html.match(/\/admin/g) || []).length;
  console.log('Occurrences of "/admin" in page HTML:', countOldAdmin);
}

inspectStaging().catch(console.error);
