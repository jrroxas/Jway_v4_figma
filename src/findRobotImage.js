import fs from 'fs';

const content = fs.readFileSync('C:\\Users\\joeyc\\.gemini\\antigravity\\brain\\42f5864c-2c4d-4eaa-a908-a9bc48daea03\\.system_generated\\steps\\2645\\content.md', 'utf8');

const matches = content.match(/<img[^>]+>/gi) || [];
console.log('Img tags:', matches);

const bgMatches = content.match(/url\(['"]?([^'"\)]+)['"]?\)/gi) || [];
console.log('BG Urls:', bgMatches);
