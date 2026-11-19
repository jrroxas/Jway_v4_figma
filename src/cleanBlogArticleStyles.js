import fs from 'fs';

const filePath = 'C:/Localhost/jway-site/src/app/(frontend)/blog/[slug]/page.tsx';
let code = fs.readFileSync(filePath, 'utf8');

// Strip out inline style attributes inside static articles content strings
code = code.replace(/ style="[^"]*"/g, '');

fs.writeFileSync(filePath, code, 'utf8');
console.log('✅ Stripped conflicting inline styles from blog articles in page.tsx');
