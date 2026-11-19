'use client';

import React, { useCallback, useEffect, useState } from 'react';

interface TrashItem {
  id: number;
  collectionSlug: string;
  originalId: string;
  title: string;
  slug: string | null;
  filePath: string;
  trashDiskPath: string | null;
  deletedAt: string;
}

const COLLECTION_LABELS: Record<string, { label: string; bg: string; color: string }> = {
  pages: { label: 'Page', bg: '#f0fdf4', color: '#166534' },
  posts: { label: 'Blog Post', bg: '#eff6ff', color: '#1e40af' },
  testimonials: { label: 'Testimonial', bg: '#fefce8', color: '#854d0e' },
  forms: { label: 'Form Submission', bg: '#f3e8ff', color: '#6b21a8' },
  media: { label: 'Media Asset', bg: '#f1f5f9', color: '#334155' },
};

export const TrashManager: React.FC = () => {
  const [items, setItems] = useState<TrashItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [processingId, setProcessingId] = useState<number | 'all' | null>(null);
  const [banner, setBanner] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/trash', { cache: 'no-store' });
      const data = await res.json();
      if (res.ok && data.success) {
        setItems(data.items || []);
      } else {
        setBanner({ type: 'error', text: data.error || 'Could not load trash items.' });
      }
    } catch (err: any) {
      setBanner({ type: 'error', text: err?.message || 'Network error while loading Trash.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchItems();
  }, [fetchItems]);

  const handleRestore = async (item: TrashItem) => {
    setProcessingId(item.id);
    setBanner(null);
    try {
      const res = await fetch('/api/trash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'restore', id: item.id }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setBanner({ type: 'success', text: data.message });
        await fetchItems();
      } else {
        setBanner({ type: 'error', text: data.error || 'Failed to restore item.' });
      }
    } catch (err: any) {
      setBanner({ type: 'error', text: err?.message || 'Network error while restoring item.' });
    } finally {
      setProcessingId(null);
    }
  };

  const handlePermanentDelete = async (item: TrashItem) => {
    const confirmed = window.confirm(
      `Permanently delete "${item.title}" (${item.filePath})?\n\nThis action cannot be undone.`
    );
    if (!confirmed) return;

    setProcessingId(item.id);
    setBanner(null);
    try {
      const res = await fetch('/api/trash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id: item.id }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setBanner({ type: 'success', text: data.message });
        await fetchItems();
      } else {
        setBanner({ type: 'error', text: data.error || 'Failed to permanently delete item.' });
      }
    } catch (err: any) {
      setBanner({ type: 'error', text: err?.message || 'Network error while deleting item.' });
    } finally {
      setProcessingId(null);
    }
  };

  const handleEmptyTrash = async () => {
    if (items.length === 0) return;
    const confirmed = window.confirm(
      `Permanently delete all ${items.length} item(s) in Trash?\n\nThis action cannot be undone.`
    );
    if (!confirmed) return;

    setProcessingId('all');
    setBanner(null);
    try {
      const res = await fetch('/api/trash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'empty' }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setBanner({ type: 'success', text: data.message });
        await fetchItems();
      } else {
        setBanner({ type: 'error', text: data.error || 'Failed to empty trash.' });
      }
    } catch (err: any) {
      setBanner({ type: 'error', text: err?.message || 'Network error while emptying trash.' });
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div style={{ marginTop: '0.5rem', marginBottom: '2rem' }}>
      <style>{`
        /* Hide the default Payload Global Save button on the Trash view */
        .global-edit--trash .doc-controls__controls {
          display: none !important;
        }
      `}</style>

      {/* Top Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          padding: '16px 20px',
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '10px',
          marginBottom: '16px',
        }}
      >
        <div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>
            Deleted Items ({items.length})
          </div>
          <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
            Items deleted from Pages, Posts, Testimonials, Submissions, or Media are held here until you restore or permanently delete them.
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={() => void fetchItems()}
            disabled={loading || processingId !== null}
            style={{
              backgroundColor: '#ffffff',
              color: '#334155',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              padding: '8px 14px',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            ↻ Refresh
          </button>

          {items.length > 0 && (
            <button
              type="button"
              onClick={handleEmptyTrash}
              disabled={processingId !== null}
              style={{
                backgroundColor: '#dc2626',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 14px',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: processingId !== null ? 'not-allowed' : 'pointer',
              }}
            >
              {processingId === 'all' ? 'Emptying...' : 'Empty Trash'}
            </button>
          )}
        </div>
      </div>

      {/* Status Notification */}
      {banner && (
        <div
          style={{
            marginBottom: '16px',
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: 500,
            backgroundColor: banner.type === 'success' ? '#f0fdf4' : '#fef2f2',
            color: banner.type === 'success' ? '#166534' : '#991b1b',
            border: `1px solid ${banner.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
          }}
        >
          {banner.type === 'success' ? '✅ ' : '❌ '}
          {banner.text}
        </div>
      )}

      {/* Table / Empty State */}
      {loading ? (
        <div
          style={{
            padding: '40px 20px',
            textAlign: 'center',
            color: '#64748b',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            backgroundColor: '#ffffff',
          }}
        >
          Loading trash items...
        </div>
      ) : items.length === 0 ? (
        <div
          style={{
            padding: '48px 20px',
            textAlign: 'center',
            color: '#64748b',
            border: '1px dashed #cbd5e1',
            borderRadius: '10px',
            backgroundColor: '#ffffff',
          }}
        >
          <div style={{ fontSize: '1rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
            Trash is empty
          </div>
          <div style={{ fontSize: '0.85rem' }}>
            Deleted pages, blog posts, testimonials, and form submissions will appear here with their file paths.
          </div>
        </div>
      ) : (
        <div
          style={{
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            overflowX: 'auto',
            backgroundColor: '#ffffff',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '12px 16px', fontSize: '0.78rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                  Item
                </th>
                <th style={{ padding: '12px 16px', fontSize: '0.78rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                  Type
                </th>
                <th style={{ padding: '12px 16px', fontSize: '0.78rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                  File / Source Path
                </th>
                <th style={{ padding: '12px 16px', fontSize: '0.78rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                  Deleted At
                </th>
                <th style={{ padding: '12px 16px', fontSize: '0.78rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', textAlign: 'right' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const badge = COLLECTION_LABELS[item.collectionSlug] || {
                  label: item.collectionSlug,
                  bg: '#f1f5f9',
                  color: '#334155',
                };
                const isBusy = processingId === item.id || processingId === 'all';

                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 16px', verticalAlign: 'middle' }}>
                      <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>
                        {item.title}
                      </div>
                      {item.slug && (
                        <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '2px' }}>
                          Slug: <code>{item.slug}</code>
                        </div>
                      )}
                    </td>

                    <td style={{ padding: '14px 16px', verticalAlign: 'middle' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '4px 10px',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          backgroundColor: badge.bg,
                          color: badge.color,
                        }}
                      >
                        {badge.label}
                      </span>
                    </td>

                    <td style={{ padding: '14px 16px', verticalAlign: 'middle' }}>
                      <code
                        style={{
                          display: 'inline-block',
                          padding: '5px 10px',
                          backgroundColor: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          color: '#1e293b',
                          fontFamily: 'monospace',
                          wordBreak: 'break-all',
                        }}
                      >
                        {item.filePath}
                      </code>
                    </td>

                    <td style={{ padding: '14px 16px', verticalAlign: 'middle', fontSize: '0.82rem', color: '#475569', whiteSpace: 'nowrap' }}>
                      {new Date(item.deletedAt).toLocaleString()}
                    </td>

                    <td style={{ padding: '14px 16px', verticalAlign: 'middle', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => void handleRestore(item)}
                          disabled={isBusy}
                          style={{
                            backgroundColor: '#A8C028',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '7px 14px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: isBusy ? 'not-allowed' : 'pointer',
                            opacity: isBusy ? 0.6 : 1,
                          }}
                        >
                          {processingId === item.id ? 'Working...' : 'Restore'}
                        </button>

                        <button
                          type="button"
                          onClick={() => void handlePermanentDelete(item)}
                          disabled={isBusy}
                          style={{
                            backgroundColor: '#ef4444',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '7px 14px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: isBusy ? 'not-allowed' : 'pointer',
                            opacity: isBusy ? 0.6 : 1,
                          }}
                        >
                          Permanently Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TrashManager;
