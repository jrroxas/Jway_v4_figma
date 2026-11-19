import fs from 'fs';

function parseFile(filePath, pageNum) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  const articles = [];
  let currentArticle = null;

  for (let i = 1400; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('<article class="jwgbl-item">')) {
      if (currentArticle) articles.push(currentArticle);
      currentArticle = { page: pageNum };
    }
    if (currentArticle) {
      if (line.includes('feat-img')) {
        const match = line.match(/background-image:url\(([^)]+)\)/);
        if (match) currentArticle.image = match[1];
      }
      if (line.includes('<h3 class="name">')) {
        currentArticle.title = line.replace(/<[^>]+>/g, '').trim();
      }
      if (line.includes('<div class="date">')) {
        currentArticle.date = line.replace(/<[^>]+>/g, '').trim();
      }
      if (line.includes('class="link-more"')) {
        const match = line.match(/href="([^"]+)"/);
        if (match) {
          currentArticle.url = match[1];
          currentArticle.slug = match[1].split('/blog/')[1] || match[1];
        }
      }
      if (line.includes('<p>') && !line.includes('<p></p>')) {
        const cleanText = line.replace(/<[^>]+>/g, '').trim();
        if (cleanText.length > 20 && !currentArticle.excerpt) {
          currentArticle.excerpt = cleanText;
        }
      }
    }
  }
  if (currentArticle) articles.push(currentArticle);
  return articles;
}

const page4 = parseFile('C:\\Users\\joeyc\\.gemini\\antigravity\\brain\\42f5864c-2c4d-4eaa-a908-a9bc48daea03\\.system_generated\\steps\\2557\\content.md', 4);
const page5 = parseFile('C:\\Users\\joeyc\\.gemini\\antigravity\\brain\\42f5864c-2c4d-4eaa-a908-a9bc48daea03\\.system_generated\\steps\\2559\\content.md', 5);

console.log('Page 4 Articles:', JSON.stringify(page4, null, 2));
console.log('Page 5 Articles:', JSON.stringify(page5, null, 2));

fs.writeFileSync('C:\\Localhost\\jway-site\\src\\pages4And5Extracted.json', JSON.stringify([...page4, ...page5], null, 2));
