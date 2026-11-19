import type { MetadataRoute } from 'next';
import { getPayloadClient } from '@/lib/getPayload';

const staticPaths = [
  '/',
  '/about',
  '/ai-solutions',
  '/digital',
  '/enterprise',
  '/mobile',
  '/staffing',
  '/staffing/rescue-mission',
  '/blog',
  '/contact-us',
  '/faqs',
  '/privacy-policy',
  '/talents',
  '/terms-of-use',
  '/testimonials',
];

const getBaseUrl = () =>
  (process.env.NEXT_PUBLIC_SERVER_URL || process.env.SERVER_URL || 'http://localhost:3000').replace(/\/$/, '');

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const entries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${baseUrl}${path}`,
    changeFrequency: 'weekly',
    priority: path === '/' ? 1 : 0.8,
  }));

  try {
    const payload = await getPayloadClient();
    const posts = await payload.find({
      collection: 'posts',
      limit: 1000,
      depth: 0,
      where: { status: { equals: 'published' } },
    });

    entries.push(
      ...posts.docs.map((post: { slug?: string | null; updatedAt?: string | null }) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.updatedAt ? new Date(post.updatedAt) : undefined,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      })),
    );
  } catch (error) {
    console.error('[Sitemap] Failed to load blog posts:', error);
  }

  return entries;
}
