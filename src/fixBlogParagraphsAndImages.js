import fs from 'fs';

const filePath = 'C:/Localhost/jway-site/src/app/(frontend)/blog/[slug]/page.tsx';
let code = fs.readFileSync(filePath, 'utf8');

// 1. Convert <br/><br/> and <br><br> inside content strings into proper separate <p> tags
code = code.replace(/(?:<br\s*\/?>\s*){2,}/gi, '</p><p>');

// 2. Strip unnecessary <span> and </span> wrapper tags inside content
code = code.replace(/<span[^>]*>/gi, '').replace(/<\/span>/gi, '');

// 3. Clean up any empty <p></p> tags created by replacements
code = code.replace(/<p>\s*<\/p>/gi, '');

fs.writeFileSync(filePath, code, 'utf8');
console.log('✅ Converted br breaks to proper <p> tags and stripped empty spans across all blog articles in page.tsx');
