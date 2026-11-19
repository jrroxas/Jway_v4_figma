import fs from 'fs';

const filePath = 'c:\\Localhost\\jway-site\\src\\app\\(frontend)\\blog\\[slug]\\page.tsx';
let fileContent = fs.readFileSync(filePath, 'utf8');

// Insert helper function before export default async function BlogPostPage
const helperFunc = `function resolveAllContentMediaUrls(html: string): string {
  if (!html) return '';

  return html
    // 1. Convert relative /blog/ paths or /header.png to full S3 URLs via getMediaUrl()
    .replace(/src=["'](\/blog\/[^"']+)["']/gi, (match, p1) => \`src="\${getMediaUrl(p1)}"\`)
    .replace(/src=["'](\/header\\.png)["']/gi, (match, p1) => \`src="\${getMediaUrl(p1)}"\`)
    // 2. Convert 403-blocked hs-sites URLs to S3 URLs
    .replace(/src=["']https:\\/\\/jway-20137624\\.hs-sites\\.com\\/hubfs\\/Imported_Blog_Media\\/([^"']+)["']/gi, (match, filename) => {
      const cleanName = filename.split('?')[0];
      return \`src="\${getMediaUrl(\`/blog/\${cleanName}\`)}"\`;
    })
    .replace(/src=["']https:\\/\\/jway-20137624\\.hs-sites\\.com\\/hs-fs\\/hubfs\\/Imported_Blog_Media\\/([^"']+)["']/gi, (match, filename) => {
      const cleanName = filename.split('?')[0];
      return \`src="\${getMediaUrl(\`/blog/\${cleanName}\`)}"\`;
    });
}

export default async function BlogPostPage`;

if (!fileContent.includes('function resolveAllContentMediaUrls')) {
  fileContent = fileContent.replace('export default async function BlogPostPage', helperFunc);
}

// Update dangerouslySetInnerHTML
if (fileContent.includes('dangerouslySetInnerHTML={{ __html: article.content }}')) {
  fileContent = fileContent.replace(
    'dangerouslySetInnerHTML={{ __html: article.content }}',
    'dangerouslySetInnerHTML={{ __html: resolveAllContentMediaUrls(article.content) }}'
  );
}

// Update cover image src
const oldCoverSrc = 'src={getMediaUrl(article.image || "/blog/header.png")}';
const newCoverSrc = 'src={getMediaUrl(article.image && article.image.includes("hs-sites.com") ? `/blog/\${article.image.split("/").pop()?.split("?")[0]}` : (article.image || "/blog/header.png"))}';

if (fileContent.includes(oldCoverSrc)) {
  fileContent = fileContent.replace(oldCoverSrc, newCoverSrc);
}

fs.writeFileSync(filePath, fileContent);
console.log('✅ Successfully updated page.tsx with resolveAllContentMediaUrls!');
