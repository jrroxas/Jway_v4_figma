import fs from 'fs';

const content = fs.readFileSync('C:\\Users\\joeyc\\.gemini\\antigravity\\brain\\42f5864c-2c4d-4eaa-a908-a9bc48daea03\\.system_generated\\steps\\2645\\content.md', 'utf8');

const imgMatches = content.match(/https:\/\/[^"\s\)]+?\.(png|jpg|jpeg|svg|webp)/gi) || [];
console.log('Image URLs:', imgMatches);

const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].toLowerCase().includes('coming soon') || lines[i].toLowerCase().includes('awesome website')) {
    console.log(`Line ${i}:`, lines[i]);
  }
}
