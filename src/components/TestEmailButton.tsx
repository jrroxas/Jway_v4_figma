'use client';

import React, { useState } from 'react';

export const TestEmailButton: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleTestEmail = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setResult({
          success: true,
          message: data.message || 'Test email dispatched successfully!',
        });
      } else {
        setResult({
          success: false,
          message: data.error || 'Failed to send test email.',
        });
      }
    } catch (err: any) {
      setResult({
        success: false,
        message: err?.message || 'Network error while attempting to send test email.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '1rem', marginBottom: '1.5rem', padding: '1rem', border: '1px solid #cbd5e1', borderRadius: '8px', backgroundColor: '#f8fafc' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <strong style={{ fontSize: '0.9rem', color: '#1e293b' }}>Email Connection Tester</strong>
          <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '4px 0 0 0' }}>
            Click below to verify your email settings and send a test email to the configured Recipient (To) address.
          </p>
        </div>
        <button
          type="button"
          onClick={handleTestEmail}
          disabled={loading}
          style={{
            backgroundColor: loading ? '#94a3b8' : '#A8C028',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            padding: '10px 18px',
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          {loading ? 'Sending Test Email...' : '✉️ Send Test Email'}
        </button>
      </div>

      {result && (
        <div
          style={{
            marginTop: '1rem',
            padding: '12px 16px',
            borderRadius: '6px',
            fontSize: '0.85rem',
            lineHeight: 1.5,
            whiteSpace: 'pre-wrap',
            backgroundColor: result.success ? '#f0fdf4' : '#fef2f2',
            color: result.success ? '#166534' : '#991b1b',
            border: `1px solid ${result.success ? '#bbf7d0' : '#fecaca'}`,
          }}
        >
          <strong>{result.success ? '✅ Success:' : '❌ Dispatch Error:'}</strong> {result.message}
        </div>
      )}
    </div>
  );
};

export default TestEmailButton;
