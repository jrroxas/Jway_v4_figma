import fs from 'fs';

const filePath = 'C:/Localhost/jway-site/src/app/(frontend)/blog/[slug]/page.tsx';
let code = fs.readFileSync(filePath, 'utf8');

// 1. Remove leading <br> inside <p> or <li>
code = code.replace(/<p>\s*<br\s*\/?>/gi, '<p>');
code = code.replace(/<li>\s*<br\s*\/?>/gi, '<li>');

// 2. Remove trailing <br> inside </p> or </li>
code = code.replace(/<br\s*\/?>\s*<\/p>/gi, '</p>');
code = code.replace(/<br\s*\/?>\s*<\/li>/gi, '</li>');

// 3. Remove <br> wrapped inside <strong> tags around images
code = code.replace(/<strong>\s*(<img[^>]+>)\s*<br\s*\/?>\s*<\/strong>/gi, '$1');
code = code.replace(/<p>\s*(<img[^>]+>)\s*<\/p>/gi, '$1');

// 4. Convert single <br> inside <p> into separate <p> tags if it separates sentences
code = code.replace(/<p>(.*?)<\/p>/gs, (match, pContent) => {
  if (pContent.includes('<img') || pContent.includes('<h1') || pContent.includes('<h2')) {
    return match;
  }
  // Split on <br> or <br/>
  const parts = pContent.split(/<br\s*\/?>/gi).map(s => s.trim()).filter(Boolean);
  if (parts.length > 1) {
    return parts.map(part => `<p>${part}</p>`).join('\n');
  }
  return match;
});

// 5. Clean up any empty <p></p>
code = code.replace(/<p>\s*<\/p>/gi, '');

fs.writeFileSync(filePath, code, 'utf8');
console.log('✅ Cleaned up all br breaks into separate <p> tags across all blog articles in page.tsx');
