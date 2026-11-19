import { getPayload } from 'payload';
import config from '@/payload.config';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const payload = await getPayload({ config });
    const seo = await payload.findGlobal({
      slug: 'seo-settings',
    });

    if (seo?.robotsTxt && typeof seo.robotsTxt === 'string' && seo.robotsTxt.trim().length > 0) {
      return new Response(seo.robotsTxt, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-store, max-age=0',
        },
      });
    }
  } catch (err) {
    console.warn('[Robots.txt Route Warning]:', err);
  }

  // Fallback to disk public/robots.txt if database is initializing
  try {
    const publicPath = path.resolve(process.cwd(), 'public/robots.txt');
    if (fs.existsSync(publicPath)) {
      const content = fs.readFileSync(publicPath, 'utf8');
      return new Response(content, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }
  } catch {}

  const defaultContent = `User-agent: *\nAllow: /\nDisallow: /jway_administrator/\nDisallow: /api/\n\nSitemap: https://www.jway.com/sitemap.xml`;
  return new Response(defaultContent, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
