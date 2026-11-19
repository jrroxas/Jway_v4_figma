/**
 * Resolves any media file path or legacy CDN URL to its full AWS S3 URL,
 * while preserving local-only client logos per AGENTS.md rules.
 */
export function getMediaUrl(path: string): string {
  if (!path) return '';

  // Clean spaces in path (e.g. "187 compressed.jpg" -> "187_compressed.jpg")
  path = path.replace(/ /g, '_');

  // Trusted client logos and core favicon MUST remain local per AGENTS.md rules
  const localOnlyFiles = [
    '/omnicell-logo.png',
    '/aehr-logo.png',
    '/pointwest-logo.png',
    '/cisco-logo.png',
    '/onramplab-logo.svg',
    '/capgemini-logo.png',
    '/favicon.ico',
  ];

  if (localOnlyFiles.includes(path) || path.startsWith('/clients/')) {
    return path;
  }

  const s3BaseUrl =
    process.env.NEXT_PUBLIC_S3_MEDIA_URL ||
    'https://jway-ai-content.s3.us-west-1.amazonaws.com/jway-ai-content';

  // If already an absolute URL
  if (path.startsWith('http://') || path.startsWith('https://')) {
    // If it's a legacy hs-sites URL or S3 URL with space/params, extract filename and map to S3
    if (path.includes('hs-sites.com') || path.includes('s3.amazonaws.com')) {
      const filename = path.split('/').pop()?.split('?')[0] || '';
      if (filename) {
        return `${s3BaseUrl}/blog/${filename}`;
      }
    }
    return path;
  }

  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${s3BaseUrl}${cleanPath}`;
}
