import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHANGELOG_PATH = path.resolve(process.cwd(), 'CHANGELOG.md');

// Run a git command and return stdout
function runGitCommand(command) {
  try {
    return execSync(command, { encoding: 'utf8' }).trim();
  } catch (error) {
    return null;
  }
}

function getSubstantialChanges() {
  // Check staged changes first, fall back to unstaged, then fall back to the last commit
  let diffFiles = runGitCommand('git diff --cached --name-only');
  let isStaged = true;

  if (!diffFiles) {
    diffFiles = runGitCommand('git diff --name-only');
    isStaged = false;
  }
  if (!diffFiles) {
    diffFiles = runGitCommand('git diff HEAD~1 --name-only');
    isStaged = false;
  }

  if (!diffFiles) {
    console.log('No git changes or history detected.');
    return [];
  }

  const files = diffFiles.split('\n').filter(Boolean);
  const changes = [];

  for (const file of files) {
    const filePath = path.resolve(process.cwd(), file);
    if (!fs.existsSync(filePath)) {
      changes.push({ file, type: 'DELETE', category: 'General' });
      continue;
    }

    let category = 'General';
    let detail = '';

    if (file.startsWith('src/collections/')) {
      category = 'Schema / Database Collection';
      detail = `Modified schema for collection: \`${path.basename(file, '.ts')}\``;
    } else if (file === 'src/seed.ts') {
      category = 'Database Seeding';
      detail = 'Modified seed script or seeded database content (e.g., blog posts, initial users).';
    } else if (file === 'amplify.yml') {
      category = 'AWS Amplify Config / Build Pipeline';
      detail = 'Updated AWS Amplify build settings or environment variable deployment mappings.';
    } else if (file === 'src/payload.config.ts') {
      category = 'CMS Engine Configuration';
      detail = 'Modified core Payload CMS engine configurations (plugins, collections, storage adapters).';
    } else if (file === 'package.json') {
      category = 'Dependencies';
      detail = 'Updated package.json dependencies or build scripts.';
    } else if (file === 'verify.js') {
      category = 'Testing & Verification';
      detail = 'Modified verification tests or test parameters.';
    } else {
      // Skip non-substantial files if we want to focus on schema, seeding, breaking configs
      continue;
    }

    changes.push({ file, category, detail });
  }

  return changes;
}

function appendToChangelog(changes) {
  if (changes.length === 0) {
    console.log('No substantial schema, configuration, or database seeding changes detected to document.');
    return;
  }

  const dateStr = new Date().toISOString().split('T')[0];
  let changelogEntry = `\n## [${dateStr}] - Substantial Changes Detected\n\n`;

  const categorized = {};
  for (const change of changes) {
    if (!categorized[change.category]) {
      categorized[change.category] = [];
    }
    categorized[change.category].push(change);
  }

  for (const [category, items] of Object.entries(categorized)) {
    changelogEntry += `### 📁 ${category}\n`;
    for (const item of items) {
      changelogEntry += `- **File**: \`${item.file}\`\n  - ${item.detail || 'Substantial modification.'}\n`;
    }
    changelogEntry += '\n';
  }

  let currentContent = '';
  if (fs.existsSync(CHANGELOG_PATH)) {
    currentContent = fs.readFileSync(CHANGELOG_PATH, 'utf8');
  } else {
    currentContent = `# JWay Migration Project Changelog\n\nAll substantial changes to schemas, configs, and migrations are documented here.\n`;
  }

  // Insert entry after the header
  const headerEndIndex = currentContent.indexOf('\n\n') + 2;
  const newContent =
    currentContent.substring(0, headerEndIndex) +
    changelogEntry.trim() +
    '\n\n' +
    currentContent.substring(headerEndIndex);

  fs.writeFileSync(CHANGELOG_PATH, newContent, 'utf8');
  console.log(`Successfully documented ${changes.length} substantial changes in CHANGELOG.md`);
}

const changes = getSubstantialChanges();
appendToChangelog(changes);
