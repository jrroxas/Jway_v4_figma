import fs from 'fs';

const content = fs.readFileSync('C:\\Users\\joeyc\\.gemini\\antigravity\\brain\\42f5864c-2c4d-4eaa-a908-a9bc48daea03\\.system_generated\\steps\\2328\\content.md', 'utf8');

const lines = content.split('\n');
for (let i = 700; i <= 1200; i++) {
  if (lines[i] && (lines[i].includes('<img') || lines[i].includes('hubfs') || lines[i].includes('banner') || lines[i].includes('feature') || lines[i].includes('h1') || lines[i].includes('h2'))) {
    console.log(`[${i}] ${lines[i].trim()}`);
  }
}
