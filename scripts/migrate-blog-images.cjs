const fs = require('fs');
const path = require('path');
const https = require('https');

const SEED_FILE = path.join(__dirname, '../src/seed.ts');
const BLOG_PAGE_FILE = path.join(__dirname, '../src/app/(frontend)/blog/[slug]/page.tsx');
const PUBLIC_BLOG_DIR = path.join(__dirname, '../public/blog');

// Ensure public/blog directory exists
if (!fs.existsSync(PUBLIC_BLOG_DIR)) {
  fs.mkdirSync(PUBLIC_BLOG_DIR, { recursive: true });
}

// Helper to download file
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Handle redirect
        downloadFile(response.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: status code ${response.statusCode}`));
        return;
      }
      const file = fs.createWriteStream(dest);
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  console.log('🔍 Scanning files for external jway.com blog images...');
  
  if (!fs.existsSync(SEED_FILE)) {
    console.error(`Error: Seed file not found at ${SEED_FILE}`);
    return;
  }
  
  let seedContent = fs.readFileSync(SEED_FILE, 'utf8');
  let blogContent = fs.readFileSync(BLOG_PAGE_FILE, 'utf8');
  
  // Find all https://www.jway.com/ URLs
  const urlRegex = /https:\/\/www\.jway\.com\/[^"'\s>]+/g;
  const urls = new Set();
  
  let match;
  while ((match = urlRegex.exec(seedContent)) !== null) {
    urls.add(match[0]);
  }
  while ((match = urlRegex.exec(blogContent)) !== null) {
    urls.add(match[0]);
  }
  
  console.log(`Found ${urls.size} unique external image URLs. Starting migration...`);
  
  const mappings = [];
  
  for (const urlStr of urls) {
    try {
      // Decode entities like &amp; in the URL
      const cleanUrlStr = urlStr.replace(/&amp;/g, '&');
      const url = new URL(cleanUrlStr);
      
      // Determine filename
      let filename = '';
      if (url.searchParams.get('name')) {
        filename = url.searchParams.get('name');
      } else {
        filename = path.basename(url.pathname);
      }
      
      // Sanitize filename
      filename = decodeURIComponent(filename).replace(/[^a-zA-Z0-9.\-_]/g, '_');
      
      // Avoid empty filename
      if (!filename || !filename.includes('.')) {
        filename = `image_${Date.now()}.png`;
      }
      
      const destPath = path.join(PUBLIC_BLOG_DIR, filename);
      const relativePath = `/blog/${filename}`;
      
      console.log(`Downloading: ${cleanUrlStr} -> public/blog/${filename}`);
      await downloadFile(cleanUrlStr, destPath);
      
      mappings.push({ original: urlStr, replacement: relativePath });
    } catch (err) {
      console.error(`Failed to migrate image ${urlStr}:`, err.message);
    }
  }
  
  console.log('\n✍️ Updating references in source files...');
  
  // Update seed.ts
  let updatedSeed = seedContent;
  let updatedBlog = blogContent;
  
  for (const mapping of mappings) {
    updatedSeed = updatedSeed.replaceAll(mapping.original, mapping.replacement);
    updatedBlog = updatedBlog.replaceAll(mapping.original, mapping.replacement);
  }
  
  // Also update seed logic to do upserts (update if exists)
  updatedSeed = updatedSeed.replace(
    /if \(existing\.docs\.length > 0\) \{[\s\S]*?skipped\+\+;[\s\S]*?continue;[\s\S]*?\}/,
    `if (existing.docs.length > 0) {
        const id = existing.docs[0].id;
        await payload.update({
          collection: 'posts',
          id,
          data: {
            title: article.title,
            publishedDate: article.publishedDate,
            category: article.category as any,
            tags: article.tags,
            readTime: article.readTime,
            authorName: article.authorName,
            coverImageUrl: article.coverImageUrl,
            summary: article.summary,
            contentHtml: article.contentHtml,
            status: 'published',
          },
        });
        console.log(\`  🔄 Updated: \${article.title}\`);
        skipped++;
        continue;
      }`
  );
  
  fs.writeFileSync(SEED_FILE, updatedSeed, 'utf8');
  fs.writeFileSync(BLOG_PAGE_FILE, updatedBlog, 'utf8');
  
  console.log('🎉 Migration script completed successfully!');
}

run();
