import fs from 'fs';

const content = fs.readFileSync('C:\\Users\\joeyc\\.gemini\\antigravity\\brain\\42f5864c-2c4d-4eaa-a908-a9bc48daea03\\.system_generated\\steps\\2192\\content.md', 'utf8');

// Search for article blocks or image URLs associated with titles
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('background-image:') || line.includes('<img') || line.includes('hubfs')) {
    if (line.includes('hubfs') && !line.includes('favicon') && !line.includes('Logo') && !line.includes('Icon')) {
      console.log(`[Line ${idx}] ${line.trim()}`);
    }
  }
});
