import fs from 'fs';

const content = fs.readFileSync('C:\\Users\\joeyc\\.gemini\\antigravity\\brain\\42f5864c-2c4d-4eaa-a908-a9bc48daea03\\.system_generated\\steps\\2192\\content.md', 'utf8');

const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('blog-banner-img-min.png') || line.includes('blog-page-banner-bg-min.png')) {
    console.log(`Line ${idx}: ${line}`);
    for (let i = Math.max(0, idx - 10); i <= Math.min(lines.length - 1, idx + 15); i++) {
      console.log(`  [${i}] ${lines[i]}`);
    }
    console.log('---');
  }
});
