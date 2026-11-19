import fs from 'fs';

fs.copyFileSync('C:/Localhost/jway-site/src/payload.config.ts', 'F:/Work/Repositories/jway-site/src/payload.config.ts');
console.log('✅ Copied updated payload.config.ts to deployment repo un-staged!');
