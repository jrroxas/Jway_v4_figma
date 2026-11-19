import type { Metadata } from 'next';
import { getPayloadClient } from '@/lib/getPayload';

type PageMetadataFallback = {
  title: string;
  description: string;
};

const TITLE_SUFFIX = ' | JWay Group Inc.';

const withTitleSuffix = (title: string): string => {
  const cleanTitle = title.replace(/\s*\|\s*JWay Group Inc\.?\s*$/i, '').trim();
  return `${cleanTitle}${TITLE_SUFFIX}`;
};

export async function getPageMetadata(
  slug: string,
  fallback: PageMetadataFallback,
): Promise<Metadata> {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: 'pages',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
    });
    const page = result.docs[0];

    if (!page) {
      return {
        title: withTitleSuffix(fallback.title),
        description: fallback.description,
      };
    }

    return {
      title: withTitleSuffix(page.metaTitle || page.title || fallback.title),
      description: page.metaDescription || fallback.description,
      robots: {
        index: !page.noIndex,
        follow: !page.noFollow,
      },
    };
  } catch (error) {
    console.error(`[Page Metadata] Failed to load ${slug}:`, error);
    return {
      title: withTitleSuffix(fallback.title),
      description: fallback.description,
    };
  }
}
