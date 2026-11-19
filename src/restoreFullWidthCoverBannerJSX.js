import fs from 'fs';

const filePath = 'c:\\Localhost\\jway-site\\src\\app\\(frontend)\\blog\\[slug]\\page.tsx';
let fileContent = fs.readFileSync(filePath, 'utf8');

const regex = /\{\/\* ── Cover Image ──────────────────────────────────────────────── \*\/\}[\s\S]*?<\/div>\s*<\/div>/;

const replacement = `{/* ── Cover Image ──────────────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-10 lg:-mt-12 relative z-20">
          <div className="relative h-[280px] sm:h-[400px] lg:h-[460px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-gray-900">
            <img
              src={getMediaUrl(article.image || "/blog/header.png")}
              alt={article.title}
              className="object-cover w-full h-full"
            />
          </div>
        </div>`;

if (regex.test(fileContent)) {
  fileContent = fileContent.replace(regex, replacement);
  fs.writeFileSync(filePath, fileContent);
  console.log('✅ Successfully restored full-width hero cover banner JSX in page.tsx');
} else {
  console.log('⚠️ Cover image regex match failed');
}
