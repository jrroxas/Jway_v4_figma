import fs from 'fs';

const filePath = 'c:\\Localhost\\jway-site\\src\\app\\(frontend)\\blog\\[slug]\\page.tsx';
let fileContent = fs.readFileSync(filePath, 'utf8');

const migratedArticles = JSON.parse(
  fs.readFileSync('c:\\Localhost\\jway-site\\src\\allArticlesFullParsed.json', 'utf8')
);

// We will construct the newly appended static articles safely using backticks for `content`
let staticArticlesPart = '';

for (const art of migratedArticles) {
  // Clean backticks inside contentHtml if any
  const cleanContent = art.contentHtml
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\${/g, '\\${');

  const cleanSummary = art.summary
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"');

  const tagsArr = Array.isArray(art.tags) ? art.tags : (art.tags || '').split(',').map((t) => t.trim()).filter(Boolean);
  const displayDate = art.displayDate || art.date || 'July 16, 2024';
  const authorName = art.authorName || art.author || 'JWay Group';

  staticArticlesPart += `  ${JSON.stringify(art.slug)}: {\n`;
  staticArticlesPart += `    title: ${JSON.stringify(art.title)},\n`;
  staticArticlesPart += `    date: ${JSON.stringify(displayDate)},\n`;
  staticArticlesPart += `    category: ${JSON.stringify(art.category)},\n`;
  staticArticlesPart += `    tags: ${JSON.stringify(tagsArr)},\n`;
  staticArticlesPart += `    readTime: ${JSON.stringify(art.readTime)},\n`;
  staticArticlesPart += `    author: ${JSON.stringify(authorName)},\n`;
  staticArticlesPart += `    image: ${JSON.stringify(art.coverImageUrl)},\n`;
  staticArticlesPart += `    summary: "${cleanSummary}",\n`;
  staticArticlesPart += `    content: \`${cleanContent}\`,\n`;
  staticArticlesPart += `  },\n`;
}

// Restore original page.tsx from git HEAD first, then append staticArticlesPart
// First, find closing bracket before RELATED_POSTS
const targetIdx = fileContent.indexOf('const RELATED_POSTS =');
if (targetIdx !== -1) {
  const closingIdx = fileContent.lastIndexOf('};', targetIdx);
  if (closingIdx !== -1) {
    // Truncate fileContent before the newly appended articles
    // Find where the 8 migrated articles start (certified-true-copies)
    const firstMigratedIdx = fileContent.indexOf('"certified-true-copies-now-required-for-first-time-jobseekers-in-the-philippines":');
    if (firstMigratedIdx !== -1 && firstMigratedIdx < targetIdx) {
      fileContent = fileContent.substring(0, firstMigratedIdx) + staticArticlesPart + fileContent.substring(closingIdx);
    }
  }
}

fs.writeFileSync(filePath, fileContent);
console.log('✅ Converted content fields to backtick template literals for Turbopack compatibility!');
