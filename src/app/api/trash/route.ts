import { NextRequest, NextResponse } from 'next/server';
import { getPayloadClient } from '@/lib/getPayload';
import {
  emptyAllTrash,
  listTrashItems,
  permanentlyDeleteTrashItem,
  restoreTrashItem,
} from '@/lib/trashService';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const items = await listTrashItems();
    return NextResponse.json({ success: true, items });
  } catch (err: any) {
    console.error('[Trash API GET Error]:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to load trash items.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, id } = body;

    if (action === 'restore') {
      const numericId = Number(id);
      if (!numericId) {
        return NextResponse.json({ success: false, error: 'Invalid trash item ID.' }, { status: 400 });
      }
      const payload = await getPayloadClient();
      const res = await restoreTrashItem(numericId, payload);
      return NextResponse.json({
        success: true,
        message: `Restored "${res.restoredTitle}" back to ${res.collectionSlug}.`,
      });
    }

    if (action === 'delete') {
      const numericId = Number(id);
      if (!numericId) {
        return NextResponse.json({ success: false, error: 'Invalid trash item ID.' }, { status: 400 });
      }
      const res = await permanentlyDeleteTrashItem(numericId);
      return NextResponse.json({
        success: true,
        message: `Permanently deleted "${res.deletedTitle}".`,
      });
    }

    if (action === 'empty') {
      const count = await emptyAllTrash();
      return NextResponse.json({
        success: true,
        message: `Permanently deleted ${count} item(s) from Trash.`,
      });
    }

    return NextResponse.json({ success: false, error: 'Unknown action.' }, { status: 400 });
  } catch (err: any) {
    console.error('[Trash API POST Error]:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to process trash action.' },
      { status: 500 }
    );
  }
}
