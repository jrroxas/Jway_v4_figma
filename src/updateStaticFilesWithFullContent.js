import fs from 'fs';

const articles = JSON.parse(
  fs.readFileSync('c:\\Localhost\\jway-site\\src\\allArticlesFullParsed.json', 'utf8')
);

// 1. Update page.tsx STATIC_ARTICLES
let pageTsxContent = fs.readFileSync(
  'c:\\Localhost\\jway-site\\src\\app\\(frontend)\\blog\\[slug]\\page.tsx',
  'utf8'
);

// Format STATIC_ARTICLES object
let staticArticlesCode = `const STATIC_ARTICLES: Record<string, any> = {\n`;

for (const art of articles) {
  staticArticlesCode += `  ${JSON.stringify(art.slug)}: {\n`;
  staticArticlesCode += `    title: ${JSON.stringify(art.title)},\n`;
  staticArticlesCode += `    date: ${JSON.stringify(art.displayDate)},\n`;
  staticArticlesCode += `    category: ${JSON.stringify(art.category)},\n`;
  staticArticlesCode += `    tags: ${JSON.stringify(art.tags.split(',').map((t) => t.trim()))},\n`;
  staticArticlesCode += `    readTime: ${JSON.stringify(art.readTime)},\n`;
  staticArticlesCode += `    author: ${JSON.stringify(art.authorName)},\n`;
  staticArticlesCode += `    image: ${JSON.stringify(art.coverImageUrl)},\n`;
  staticArticlesCode += `    summary: ${JSON.stringify(art.summary)},\n`;
  staticArticlesCode += `    content: ${JSON.stringify(art.contentHtml)},\n`;
  staticArticlesCode += `  },\n`;
}
staticArticlesCode += `};`;

// Replace STATIC_ARTICLES block in page.tsx
pageTsxContent = pageTsxContent.replace(
  /const STATIC_ARTICLES: Record<string, any> = \{[\s\S]*?\n\};/,
  staticArticlesCode
);

fs.writeFileSync(
  'c:\\Localhost\\jway-site\\src\\app\\(frontend)\\blog\\[slug]\\page.tsx',
  pageTsxContent
);
console.log('✅ Updated STATIC_ARTICLES in page.tsx with 100% complete body HTML!');

// 2. Update seed.ts articles array
let seedTsContent = fs.readFileSync('c:\\Localhost\\jway-site\\src\\seed.ts', 'utf8');

let seedArticlesCode = `const articles = [\n`;

for (const art of articles) {
  seedArticlesCode += `  {\n`;
  seedArticlesCode += `    title: ${JSON.stringify(art.title)},\n`;
  seedArticlesCode += `    slug: ${JSON.stringify(art.slug)},\n`;
  seedArticlesCode += `    publishedDate: ${JSON.stringify(art.publishedDate)},\n`;
  seedArticlesCode += `    category: ${JSON.stringify(art.category)},\n`;
  seedArticlesCode += `    tags: ${JSON.stringify(art.tags)},\n`;
  seedArticlesCode += `    readTime: ${JSON.stringify(art.readTime)},\n`;
  seedArticlesCode += `    authorName: ${JSON.stringify(art.authorName)},\n`;
  seedArticlesCode += `    coverImageUrl: ${JSON.stringify(art.coverImageUrl)},\n`;
  seedArticlesCode += `    summary: ${JSON.stringify(art.summary)},\n`;
  seedArticlesCode += `    contentHtml: ${JSON.stringify(art.contentHtml)},\n`;
  seedArticlesCode += `  },\n`;
}
seedArticlesCode += `];`;

seedTsContent = seedTsContent.replace(
  /const articles = \[[\s\S]*?\n\];/,
  seedArticlesCode
);

fs.writeFileSync('c:\\Localhost\\jway-site\\src\\seed.ts', seedTsContent);
console.log('✅ Updated articles array in seed.ts with 100% complete body HTML!');
