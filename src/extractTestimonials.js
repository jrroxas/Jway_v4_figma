import fs from 'fs';

const content = fs.readFileSync('C:\\Users\\joeyc\\.gemini\\antigravity\\brain\\42f5864c-2c4d-4eaa-a908-a9bc48daea03\\.system_generated\\steps\\2108\\content.md', 'utf8');

const lines = content.split('\n');
for (let i = 1350; i <= 1378; i++) {
  console.log(`[${i}] ${lines[i]}`);
}
