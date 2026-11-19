import fs from 'fs';

const filePath = 'c:\\Localhost\\jway-site\\src\\app\\(frontend)\\blog\\[slug]\\page.tsx';
let fileContent = fs.readFileSync(filePath, 'utf8');

if (fileContent.includes('<section className="max-w-3xl mx-auto px-4 sm:px-6 py-16 lg:py-20">')) {
  fileContent = fileContent.replace(
    '<section className="max-w-3xl mx-auto px-4 sm:px-6 py-16 lg:py-20">',
    '<section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 lg:py-20">'
  );
  fs.writeFileSync(filePath, fileContent);
  console.log('✅ Successfully updated article body section width to max-w-5xl in page.tsx');
} else {
  console.log('⚠️ Could not find exact max-w-3xl section string in page.tsx');
}
