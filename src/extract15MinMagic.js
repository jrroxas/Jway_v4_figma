import fs from 'fs';

const content = fs.readFileSync('C:\\Users\\joeyc\\.gemini\\antigravity\\brain\\42f5864c-2c4d-4eaa-a908-a9bc48daea03\\.system_generated\\steps\\2192\\content.md', 'utf8');

const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.toLowerCase().includes('15-minute') || line.toLowerCase().includes('click-by-click') || line.toLowerCase().includes('complexity')) {
    console.log(`Line ${idx}: ${line}`);
    for (let i = Math.max(0, idx - 5); i <= Math.min(lines.length - 1, idx + 10); i++) {
      console.log(`  [${i}] ${lines[i]}`);
    }
    console.log('---');
  }
});
