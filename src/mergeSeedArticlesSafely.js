import fs from 'fs';

const migratedArticles = JSON.parse(
  fs.readFileSync('c:\\Localhost\\jway-site\\src\\allArticlesFullParsed.json', 'utf8')
);

const filePath = 'c:\\Localhost\\jway-site\\src\\seed.ts';
let fileContent = fs.readFileSync(filePath, 'utf8');

const targetIdx = fileContent.indexOf('async function seed()');

if (targetIdx === -1) {
  console.error('Could not find async function seed() marker in seed.ts');
  process.exit(1);
}

const closingBracketIdx = fileContent.lastIndexOf('];', targetIdx);

if (closingBracketIdx === -1) {
  console.error('Could not find closing ]; before seed()');
  process.exit(1);
}

let extraArticlesCode = '';

for (const art of migratedArticles) {
  const existingCheck = `slug: '${art.slug}'`;
  if (fileContent.substring(0, targetIdx).includes(existingCheck)) {
    console.log(` Article "${art.slug}" already present in seed.ts, skipping duplicate.`);
    continue;
  }

  extraArticlesCode += `  {\n`;
  extraArticlesCode += `    title: ${JSON.stringify(art.title)},\n`;
  extraArticlesCode += `    slug: ${JSON.stringify(art.slug)},\n`;
  extraArticlesCode += `    publishedDate: ${JSON.stringify(art.publishedDate)},\n`;
  extraArticlesCode += `    category: ${JSON.stringify(art.category)},\n`;
  extraArticlesCode += `    tags: ${JSON.stringify(art.tags)},\n`;
  extraArticlesCode += `    readTime: ${JSON.stringify(art.readTime)},\n`;
  extraArticlesCode += `    authorName: ${JSON.stringify(art.authorName)},\n`;
  extraArticlesCode += `    coverImageUrl: ${JSON.stringify(art.coverImageUrl)},\n`;
  extraArticlesCode += `    summary: ${JSON.stringify(art.summary)},\n`;
  extraArticlesCode += `    contentHtml: ${JSON.stringify(art.contentHtml)},\n`;
  extraArticlesCode += `  },\n`;
}

const newFileContent =
  fileContent.substring(0, closingBracketIdx) +
  extraArticlesCode +
  fileContent.substring(closingBracketIdx);

fs.writeFileSync(filePath, newFileContent);
console.log('✅ Safely merged migrated articles into seed.ts without removing any existing articles!');
