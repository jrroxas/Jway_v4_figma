import fs from 'fs';

const filePath = 'c:\\Localhost\\jway-site\\src\\app\\(frontend)\\blog\\[slug]\\page.tsx';
let fileContent = fs.readFileSync(filePath, 'utf8');

const regex = /\{\/\* ── Cover Image ──────────────────────────────────────────────── \*\/\}[\s\S]*?<\/div>\s*<\/div>/;

const replacement = `{/* ── Cover Image ──────────────────────────────────────────────── */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-8 lg:-mt-10 relative z-20 text-center">
          <div className="inline-block max-w-full rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-white p-1.5 sm:p-2.5">
            <img
              src={getMediaUrl(article.image)}
              alt={article.title}
              className="block max-h-[420px] w-auto max-w-full h-auto rounded-xl mx-auto object-contain"
            />
          </div>
        </div>`;

if (regex.test(fileContent)) {
  fileContent = fileContent.replace(regex, replacement);
  fs.writeFileSync(filePath, fileContent);
  console.log('✅ Successfully updated cover image to shrink-wrap natural aspect ratio with inline-block!');
} else {
  console.log('⚠️ Cover image regex match failed');
}
