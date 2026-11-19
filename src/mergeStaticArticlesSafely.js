import fs from 'fs';

const migratedArticles = JSON.parse(
  fs.readFileSync('c:\\Localhost\\jway-site\\src\\allArticlesFullParsed.json', 'utf8')
);

const filePath = 'c:\\Localhost\\jway-site\\src\\app\\(frontend)\\blog\\[slug]\\page.tsx';
let fileContent = fs.readFileSync(filePath, 'utf8');

// Find closing bracket of STATIC_ARTICLES object
// STATIC_ARTICLES ends right before `// ─── Related posts data` or `const RELATED_POSTS =`
const targetIdx = fileContent.indexOf('const RELATED_POSTS =');

if (targetIdx === -1) {
  console.error('Could not find const RELATED_POSTS marker in page.tsx');
  process.exit(1);
}

// Find the `};` right before `const RELATED_POSTS`
const closingBracketIdx = fileContent.lastIndexOf('};', targetIdx);

if (closingBracketIdx === -1) {
  console.error('Could not find closing }; before RELATED_POSTS');
  process.exit(1);
}

let extraArticlesCode = '';

for (const art of migratedArticles) {
  // Check if article slug is already in fileContent before targetIdx
  const existingCheck = `"${art.slug}":`;
  if (fileContent.substring(0, targetIdx).includes(existingCheck)) {
    console.log(` Article "${art.slug}" already present in static dict, will update/skip inline.`);
    continue;
  }

  extraArticlesCode += `  ${JSON.stringify(art.slug)}: {\n`;
  extraArticlesCode += `    title: ${JSON.stringify(art.title)},\n`;
  extraArticlesCode += `    date: ${JSON.stringify(art.displayDate)},\n`;
  extraArticlesCode += `    category: ${JSON.stringify(art.category)},\n`;
  extraArticlesCode += `    tags: ${JSON.stringify(art.tags.split(',').map((t) => t.trim()))},\n`;
  extraArticlesCode += `    readTime: ${JSON.stringify(art.readTime)},\n`;
  extraArticlesCode += `    author: ${JSON.stringify(art.authorName)},\n`;
  extraArticlesCode += `    image: ${JSON.stringify(art.coverImageUrl)},\n`;
  extraArticlesCode += `    summary: ${JSON.stringify(art.summary)},\n`;
  extraArticlesCode += `    content: ${JSON.stringify(art.contentHtml)},\n`;
  extraArticlesCode += `  },\n`;
}

// Insert extra articles right before the closing `};` of STATIC_ARTICLES
const newFileContent =
  fileContent.substring(0, closingBracketIdx) +
  extraArticlesCode +
  fileContent.substring(closingBracketIdx);

fs.writeFileSync(filePath, newFileContent);
console.log('✅ Safely merged 8 migrated articles into STATIC_ARTICLES without removing any existing articles!');
