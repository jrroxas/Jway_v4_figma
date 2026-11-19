import fs from 'fs';

const content = fs.readFileSync('C:\\Users\\joeyc\\.gemini\\antigravity\\brain\\42f5864c-2c4d-4eaa-a908-a9bc48daea03\\.system_generated\\steps\\2645\\content.md', 'utf8');

const lines = content.split('\n');
console.log(lines.slice(1100, 1160).join('\n'));
