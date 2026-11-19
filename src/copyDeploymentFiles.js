import fs from 'fs';
import path from 'path';

const srcDir = 'C:/Localhost/jway-site';
const destDir = 'F:/Work/Repositories/jway-site';

const files = [
  'amplify.yml',
  'package.json',
  'yarn.lock',
  'payload-types.ts',
  'src/payload.config.ts',
  'src/collections/Forms.ts',
  'src/globals/FormSettings.ts',
  'src/components/TestEmailButton.tsx',
  'src/app/api/contact/route.ts',
  'src/app/api/test-email/route.ts',
  'src/app/api/admin-login/route.ts',
  'src/app/(frontend)/contact-us/page.tsx',
  'src/app/(frontend)/staffing/StaffingClientPage.tsx',
  'src/app/(frontend)/talents/page.tsx',
  'src/app/(frontend)/layout.tsx',
  'src/app/(payload)/custom.css',
  'src/app/(payload)/admin/importMap.js',
  'src/app/(payload)/admin/login/page.tsx'
];

console.log('📦 Copying required deployment files to F:/Work/Repositories/jway-site...');

for (const file of files) {
  const s = path.join(srcDir, file);
  const d = path.join(destDir, file);
  const parent = path.dirname(d);

  if (!fs.existsSync(parent)) {
    fs.mkdirSync(parent, { recursive: true });
  }

  fs.copyFileSync(s, d);
  console.log('✅ Copied:', file);
}

console.log('🎉 All required deployment files successfully copied!');
