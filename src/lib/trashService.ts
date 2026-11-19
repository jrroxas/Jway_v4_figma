import fs from 'fs';
import path from 'path';
import pg from 'pg';
import { createClient } from '@libsql/client';
import type { CollectionAfterDeleteHook, Payload } from 'payload';

export interface TrashItemRecord {
  id: number;
  collectionSlug: string;
  originalId: string;
  title: string;
  slug: string | null;
  filePath: string;
  trashDiskPath: string | null;
  docData: Record<string, unknown>;
  deletedAt: string;
}

const globalTrashPool = global as unknown as {
  __trashPgPool?: pg.Pool;
};

function getPgPool(): pg.Pool | null {
  if (!process.env.DATABASE_URI) return null;
  if (!globalTrashPool.__trashPgPool) {
    globalTrashPool.__trashPgPool = new pg.Pool({
      connectionString: process.env.DATABASE_URI,
      max: 4,
      idleTimeoutMillis: 5000,
      connectionTimeoutMillis: 15000,
    });
  }
  return globalTrashPool.__trashPgPool;
}

function getSqliteClient() {
  const dbPath = path.resolve(process.cwd(), '.data/jway-local.db').replace(/\\/g, '/');
  return createClient({ url: `file:${dbPath}` });
}

/**
 * Finds the matching directory inside `src/app/(frontend)` for a given page slug.
 */
function findFrontendPageFolder(slug: string): { relativeDir: string; fullDir: string; filePath: string } | null {
  const appFrontendDir = path.resolve(process.cwd(), 'src/app/(frontend)');
  if (!fs.existsSync(appFrontendDir)) return null;

  let match: { relativeDir: string; fullDir: string; filePath: string } | null = null;

  const scan = (dir: string) => {
    if (match || !fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const name = entry.name;
      if (name.startsWith('(') || name.startsWith('[') || name.startsWith('_') || name.startsWith('.')) continue;

      const fullDir = path.join(dir, name);
      const relativeDir = path.relative(appFrontendDir, fullDir).replace(/\\/g, '/');
      if (relativeDir.includes('[')) continue;

      const pageFile = path.join(fullDir, 'page.tsx');
      const candidateSlug = relativeDir.replace(/\//g, '-');
      if (candidateSlug === slug && fs.existsSync(pageFile)) {
        match = {
          relativeDir,
          fullDir,
          filePath: `src/app/(frontend)/${relativeDir}/page.tsx`,
        };
        return;
      }
      scan(fullDir);
    }
  };

  scan(appFrontendDir);
  return match;
}

export async function addToTrash(params: {
  collectionSlug: string;
  originalId: string;
  title: string;
  slug?: string | null;
  filePath: string;
  trashDiskPath?: string | null;
  docData: Record<string, unknown>;
}): Promise<void> {
  const pool = getPgPool();
  const now = new Date().toISOString();

  if (pool) {
    await pool.query(
      `INSERT INTO "trash_items" ("collection_slug", "original_id", "title", "slug", "file_path", "trash_disk_path", "doc_data", "deleted_at")
       VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8)`,
      [
        params.collectionSlug,
        String(params.originalId),
        params.title,
        params.slug || null,
        params.filePath,
        params.trashDiskPath || null,
        JSON.stringify(params.docData),
        now,
      ]
    );
  } else {
    const sqlite = getSqliteClient();
    try {
      await sqlite.execute({
        sql: `INSERT INTO "trash_items" ("collection_slug", "original_id", "title", "slug", "file_path", "trash_disk_path", "doc_data", "deleted_at")
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          params.collectionSlug,
          String(params.originalId),
          params.title,
          params.slug || null,
          params.filePath,
          params.trashDiskPath || null,
          JSON.stringify(params.docData),
          now,
        ],
      });
    } finally {
      sqlite.close();
    }
  }
}

export async function listTrashItems(): Promise<TrashItemRecord[]> {
  const pool = getPgPool();
  if (pool) {
    const res = await pool.query(
      `SELECT id, collection_slug, original_id, title, slug, file_path, trash_disk_path, doc_data, deleted_at
       FROM "trash_items"
       ORDER BY deleted_at DESC, id DESC`
    );
    return res.rows.map((r) => ({
      id: Number(r.id),
      collectionSlug: r.collection_slug,
      originalId: r.original_id,
      title: r.title,
      slug: r.slug,
      filePath: r.file_path,
      trashDiskPath: r.trash_disk_path,
      docData: typeof r.doc_data === 'string' ? JSON.parse(r.doc_data) : r.doc_data,
      deletedAt: new Date(r.deleted_at).toISOString(),
    }));
  } else {
    const sqlite = getSqliteClient();
    try {
      const res = await sqlite.execute(
        `SELECT id, collection_slug, original_id, title, slug, file_path, trash_disk_path, doc_data, deleted_at
         FROM "trash_items"
         ORDER BY deleted_at DESC, id DESC`
      );
      return res.rows.map((r: any) => ({
        id: Number(r.id),
        collectionSlug: String(r.collection_slug),
        originalId: String(r.original_id),
        title: String(r.title),
        slug: r.slug ? String(r.slug) : null,
        filePath: String(r.file_path),
        trashDiskPath: r.trash_disk_path ? String(r.trash_disk_path) : null,
        docData: typeof r.doc_data === 'string' ? JSON.parse(r.doc_data) : r.doc_data,
        deletedAt: String(r.deleted_at),
      }));
    } finally {
      sqlite.close();
    }
  }
}

export async function getTrashedPageSlugs(): Promise<Set<string>> {
  try {
    const items = await listTrashItems();
    return new Set(
      items
        .filter((i) => i.collectionSlug === 'pages' && i.slug)
        .map((i) => i.slug as string)
    );
  } catch {
    return new Set();
  }
}

async function getTrashItemById(id: number): Promise<TrashItemRecord | null> {
  const items = await listTrashItems();
  return items.find((i) => i.id === id) || null;
}

async function removeTrashRowById(id: number): Promise<void> {
  const pool = getPgPool();
  if (pool) {
    await pool.query(`DELETE FROM "trash_items" WHERE id = $1`, [id]);
  } else {
    const sqlite = getSqliteClient();
    try {
      await sqlite.execute({
        sql: `DELETE FROM "trash_items" WHERE id = ?`,
        args: [id],
      });
    } finally {
      sqlite.close();
    }
  }
}

export async function restoreTrashItem(id: number, payload: Payload): Promise<{ restoredTitle: string; collectionSlug: string }> {
  const item = await getTrashItemById(id);
  if (!item) {
    throw new Error('Trash item not found.');
  }

  // 1. If a page folder was staged in .trash/pages/..., move it back to src/app/(frontend)/...
  if (item.collectionSlug === 'pages' && item.trashDiskPath) {
    const stagedDir = path.resolve(process.cwd(), item.trashDiskPath);
    // Derive original folder from item.filePath (e.g. "src/app/(frontend)/homepage_old/page.tsx")
    const targetRelativeDir = item.filePath.replace(/\/page\.tsx$/i, '');
    const targetDir = path.resolve(process.cwd(), targetRelativeDir);

    if (fs.existsSync(stagedDir)) {
      fs.mkdirSync(path.dirname(targetDir), { recursive: true });
      fs.cpSync(stagedDir, targetDir, { recursive: true, force: true });
      fs.rmSync(stagedDir, { recursive: true, force: true });
    }
  }

  // 2. Restore the database document in Payload CMS
  const rawDoc = { ...(item.docData || {}) };
  delete rawDoc.id;
  delete rawDoc.createdAt;
  delete rawDoc.updatedAt;

  // Check if a document with the same unique slug already exists (e.g. for pages or posts)
  if ((item.collectionSlug === 'pages' || item.collectionSlug === 'posts') && item.slug) {
    const existing = await payload.find({
      collection: item.collectionSlug as 'pages' | 'posts',
      where: { slug: { equals: item.slug } },
      limit: 1,
    });
    if (existing.docs.length > 0) {
      await payload.update({
        collection: item.collectionSlug as 'pages' | 'posts',
        id: existing.docs[0].id,
        data: rawDoc as any,
      });
    } else {
      await payload.create({
        collection: item.collectionSlug as 'pages' | 'posts',
        data: rawDoc as any,
      });
    }
  } else {
    await payload.create({
      collection: item.collectionSlug as any,
      data: rawDoc as any,
    });
  }

  // 3. Remove from trash_items
  await removeTrashRowById(id);

  return {
    restoredTitle: item.title,
    collectionSlug: item.collectionSlug,
  };
}

export async function permanentlyDeleteTrashItem(id: number): Promise<{ deletedTitle: string }> {
  const item = await getTrashItemById(id);
  if (!item) {
    throw new Error('Trash item not found.');
  }

  // 1. Delete staged folder in .trash/pages/... if present
  if (item.trashDiskPath) {
    const stagedDir = path.resolve(process.cwd(), item.trashDiskPath);
    if (fs.existsSync(stagedDir)) {
      fs.rmSync(stagedDir, { recursive: true, force: true });
    }
  }

  // 2. Also ensure original page folder (if not root 'home' and still on disk) is deleted
  if (item.collectionSlug === 'pages' && item.slug && item.slug !== 'home') {
    const targetRelativeDir = item.filePath.replace(/\/page\.tsx$/i, '');
    if (
      targetRelativeDir.startsWith('src/app/(frontend)/') &&
      targetRelativeDir !== 'src/app/(frontend)'
    ) {
      const targetDir = path.resolve(process.cwd(), targetRelativeDir);
      if (fs.existsSync(targetDir)) {
        fs.rmSync(targetDir, { recursive: true, force: true });
      }
    }
  }

  // 3. Delete row from trash_items
  await removeTrashRowById(id);

  return { deletedTitle: item.title };
}

export async function emptyAllTrash(): Promise<number> {
  const items = await listTrashItems();
  for (const item of items) {
    await permanentlyDeleteTrashItem(item.id);
  }
  return items.length;
}

/**
 * Creates a Payload `afterDelete` hook that moves the deleted item into Trash.
 */
export function createTrashAfterDeleteHook(collectionSlug: string): CollectionAfterDeleteHook {
  return async ({ doc }) => {
    try {
      if (!doc) return doc;

      const originalId = String(doc.id ?? '');
      const slug = typeof doc.slug === 'string' ? doc.slug : null;
      const title =
        doc.title ||
        doc.name ||
        doc.filename ||
        doc.subject ||
        `${collectionSlug} #${originalId}`;

      let filePath = `collection:${collectionSlug}/${originalId}`;
      let trashDiskPath: string | null = null;

      if (collectionSlug === 'pages') {
        if (slug === 'home') {
          filePath = 'src/app/(frontend)/page.tsx';
        } else if (slug) {
          const folderMatch = findFrontendPageFolder(slug);
          if (folderMatch) {
            filePath = folderMatch.filePath;
            // Stage the route folder inside .trash/pages/<slug> so it is removed from live routes until restored
            try {
              const trashRelDir = `.trash/pages/${slug}`;
              const trashAbsDir = path.resolve(process.cwd(), trashRelDir);
              fs.mkdirSync(path.dirname(trashAbsDir), { recursive: true });
              if (fs.existsSync(trashAbsDir)) {
                fs.rmSync(trashAbsDir, { recursive: true, force: true });
              }
              fs.cpSync(folderMatch.fullDir, trashAbsDir, { recursive: true, force: true });
              fs.rmSync(folderMatch.fullDir, { recursive: true, force: true });
              trashDiskPath = trashRelDir;
            } catch (fsErr) {
              console.warn(`[Trash] Could not stage page folder for "${slug}":`, fsErr);
            }
          } else {
            filePath = `src/app/(frontend)/${slug.replace(/-/g, '/')}/page.tsx`;
          }
        }
      } else if (collectionSlug === 'posts') {
        filePath = `src/app/(frontend)/blog/${slug || originalId}/page.tsx`;
      } else if (collectionSlug === 'testimonials') {
        filePath = `src/app/(frontend)/testimonials/page.tsx (${doc.company || 'Testimonial'})`;
      } else if (collectionSlug === 'forms') {
        filePath = `src/app/api/contact/route.ts (${doc.formName || 'Submission'})`;
      } else if (collectionSlug === 'media') {
        filePath = String(doc.url || doc.filename || `public/${originalId}`);
      }

      await addToTrash({
        collectionSlug,
        originalId,
        title: String(title),
        slug,
        filePath,
        trashDiskPath,
        docData: doc as Record<string, unknown>,
      });

      console.log(`[Trash] Moved deleted ${collectionSlug} "${title}" (${filePath}) to Trash.`);
    } catch (err) {
      console.error(`[Trash] Failed to record deleted item from ${collectionSlug}:`, err);
    }

    return doc;
  };
}
