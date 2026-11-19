import fs from 'fs';

const srcFile = 'C:\\Localhost\\jway-site\\src\\app\\(frontend)\\about\\page.tsx';
const destFile = 'F:\\Work\\Repositories\\jway-site\\src\\app\\(frontend)\\about\\page.tsx';

fs.copyFileSync(srcFile, destFile);
console.log('✅ Copied about/page.tsx to deployment repository un-staged!');
