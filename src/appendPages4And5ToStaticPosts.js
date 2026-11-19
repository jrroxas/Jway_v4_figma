import fs from 'fs';

const pages4And5Data = JSON.parse(fs.readFileSync('C:\\Localhost\\jway-site\\src\\pages4And5ArticlesParsed.json', 'utf8'));

const blogClientPath = 'C:\\Localhost\\jway-site\\src\\app\\(frontend)\\blog\\BlogClientPage.tsx';
let blogClientContent = fs.readFileSync(blogClientPath, 'utf8');

const newStaticPosts = pages4And5Data.map(item => ({
  id: item.slug,
  title: item.title,
  slug: item.slug,
  date: item.displayDate,
  category: item.category,
  tags: item.tags.split(', '),
  readTime: item.readTime,
  author: item.author,
  image: item.coverImageUrl,
  excerpt: item.summary,
  keyPoints: [
    "Key strategic takeaways from live JWay migration",
    "Tailored execution strategy for modern enterprise teams",
    "Proven framework designed for high-performance scale"
  ]
}));

const existingSlugsMatches = blogClientContent.match(/slug:\s*"([^"]+)"/g) || [];
const existingSlugs = existingSlugsMatches.map(s => s.replace(/slug:\s*"/, '').replace('"', ''));

const missingPosts = newStaticPosts.filter(p => !existingSlugs.includes(p.slug));

if (missingPosts.length > 0) {
  const postsJsonString = missingPosts.map(p => `  ${JSON.stringify(p, null, 4)}`).join(',\n');
  blogClientContent = blogClientContent.replace(/\];\s*\/\/ ─── End STATIC_POSTS/g, `, \n${postsJsonString}\n];\n// ─── End STATIC_POSTS`) || blogClientContent.replace(/\];\s*\n\nconst CATEGORIES/g, `, \n${postsJsonString}\n];\n\nconst CATEGORIES`);
  fs.writeFileSync(blogClientPath, blogClientContent, 'utf8');
  console.log(`✅ Appended ${missingPosts.length} new Pages 4 & 5 posts to STATIC_POSTS in BlogClientPage.tsx`);
} else {
  console.log('⏭  All Pages 4 & 5 posts already exist in STATIC_POSTS in BlogClientPage.tsx');
}
