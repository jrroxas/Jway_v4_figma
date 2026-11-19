import fs from 'fs';
import path from 'path';

const filesToCopy = [
  { src: 'C:/Localhost/jway-site/src/globals/SeoSettings.ts', dest: 'F:/Work/Repositories/jway-site/src/globals/SeoSettings.ts' },
  { src: 'C:/Localhost/jway-site/src/payload.config.ts', dest: 'F:/Work/Repositories/jway-site/src/payload.config.ts' },
  { src: 'C:/Localhost/jway-site/src/app/robots.txt/route.ts', dest: 'F:/Work/Repositories/jway-site/src/app/robots.txt/route.ts' },
  { src: 'C:/Localhost/jway-site/public/robots.txt', dest: 'F:/Work/Repositories/jway-site/public/robots.txt' }
];

for (const f of filesToCopy) {
  const destDir = path.dirname(f.dest);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  fs.copyFileSync(f.src, f.dest);
  console.log(`✅ Copied ${path.basename(f.dest)} to deployment repo`);
}

// Remove legacy robots.ts from deploy repo if present
const legacyDeployRobots = 'F:/Work/Repositories/jway-site/src/app/robots.ts';
if (fs.existsSync(legacyDeployRobots)) {
  fs.unlinkSync(legacyDeployRobots);
  console.log('✅ Removed legacy robots.ts from deployment repo');
}
