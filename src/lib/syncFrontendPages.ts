import fs from 'fs';
import path from 'path';
import type { Payload } from 'payload';
import { getTrashedPageSlugs } from '@/lib/trashService';

const globalSyncState = global as unknown as {
  __syncedFrontendPagesSignature?: string;
  __isSyncingFrontendPages?: boolean;
  __frontendPagesWatcherStarted?: boolean;
};

export function formatTitleFromSlug(slugOrPath: string): string {
  if (slugOrPath === 'home') return 'Homepage';
  return slugOrPath
    .split('/')
    .map((segment) =>
      segment
        .split(/[-_]/)
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
    )
    .join(' — ');
}

function discoverFrontendRoutes(appFrontendDir: string): Array<{ slug: string; title: string }> {
  const discovered: Array<{ slug: string; title: string }> = [];

  const scanDir = (dir: string, baseDir: string) => {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const folderName = entry.name;
      if (
        folderName.startsWith('(') ||
        folderName.startsWith('[') ||
        folderName.startsWith('_') ||
        folderName.startsWith('.')
      ) {
        continue;
      }

      const fullPath = path.join(dir, folderName);
      const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
      if (relativePath.includes('[')) continue;

      const pageFilePath = path.join(fullPath, 'page.tsx');
      if (fs.existsSync(pageFilePath)) {
        const slug = relativePath.replace(/\//g, '-');
        const title = formatTitleFromSlug(relativePath);
        discovered.push({ slug, title });
      }

      scanDir(fullPath, baseDir);
    }
  };

  scanDir(appFrontendDir, appFrontendDir);
  return discovered;
}

export async function syncFrontendPages(payload: Payload): Promise<void> {
  if (globalSyncState.__isSyncingFrontendPages) {
    return;
  }

  const appFrontendDir = path.resolve(process.cwd(), 'src/app/(frontend)');
  if (!fs.existsSync(appFrontendDir)) return;

  // Start a lightweight filesystem watcher in dev mode so new/renamed folders sync automatically in the background
  if (process.env.NODE_ENV !== 'production' && !globalSyncState.__frontendPagesWatcherStarted) {
    globalSyncState.__frontendPagesWatcherStarted = true;
    try {
      let debounceTimer: ReturnType<typeof setTimeout> | null = null;
      fs.watch(appFrontendDir, { recursive: true }, (_eventType, filename) => {
        if (!filename || filename.includes('.next') || filename.includes('node_modules')) return;
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          void syncFrontendPages(payload);
        }, 400);
      });
    } catch {
      // Ignore watcher errors on unsupported platforms
    }
  }

  try {
    const discovered = discoverFrontendRoutes(appFrontendDir);
    const signature = discovered
      .map((d) => d.slug)
      .sort()
      .join(',');

    if (globalSyncState.__syncedFrontendPagesSignature === signature) {
      return;
    }

    globalSyncState.__isSyncingFrontendPages = true;

    try {
      const existingRes = await payload.find({
        collection: 'pages',
        limit: 500,
        depth: 0,
      });

      const existingSlugs = new Set(
        (existingRes.docs || []).map((doc: { slug?: string | null }) => doc.slug)
      );
      const trashedSlugs = await getTrashedPageSlugs();

      for (const route of discovered) {
        if (!existingSlugs.has(route.slug) && !trashedSlugs.has(route.slug)) {
          await payload.create({
            collection: 'pages',
            data: {
              title: route.title,
              slug: route.slug,
              metaTitle: `${route.title} | JWay Group Inc.`,
              metaDescription: `Discover ${route.title} services and digital solutions from JWay Group.`,
              noIndex: false,
              noFollow: false,
            },
          });
          console.log(`[Payload Auto-Page Sync] Registered new page "${route.title}" (${route.slug})`);
        }
      }

      globalSyncState.__syncedFrontendPagesSignature = signature;
    } finally {
      globalSyncState.__isSyncingFrontendPages = false;
    }
  } catch (err) {
    console.warn('[Payload Auto-Page Sync Notice]:', err);
  }
}
