import fs from 'fs';

const content = fs.readFileSync('C:\\Users\\joeyc\\.gemini\\antigravity\\brain\\42f5864c-2c4d-4eaa-a908-a9bc48daea03\\.system_generated\\steps\\2405\\content.md', 'utf8');

const lines = content.split('\n');

const articles = [];
let currentArticle = null;

for (let i = 1500; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('<article class="jwgbl-item">')) {
    if (currentArticle) articles.push(currentArticle);
    currentArticle = {};
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
        currentArticle.slug = match[1].split('/blog/')[1];
      }
    }
  }
}
if (currentArticle) articles.push(currentArticle);

console.log(JSON.stringify(articles, null, 2));
