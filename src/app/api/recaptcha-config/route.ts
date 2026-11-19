import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@/payload.config';

export async function GET() {
  try {
    const payload = await getPayload({ config });
    const formSettings = await payload.findGlobal({
      slug: 'form-settings',
    });

    const siteKey =
      (typeof formSettings?.recaptchaSiteKey === 'string' && formSettings.recaptchaSiteKey.trim()) ||
      process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim() ||
      '';

    return NextResponse.json({ siteKey });
  } catch (err) {
    console.warn('[reCAPTCHA Config] Failed to fetch site key:', err);
    return NextResponse.json({
      siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim() || '',
    });
  }
}
