import type { GlobalConfig } from 'payload';
import fs from 'fs';
import path from 'path';

const defaultRobotsTxt = `# Robots.txt for JWay Group Inc.
User-agent: *
Allow: /

# Disallow administrative and private API endpoints
Disallow: /jway_administrator/
Disallow: /api/

# Sitemap Location
Sitemap: https://www.jway.com/sitemap.xml
`.trim();

export const SeoSettings: GlobalConfig = {
  slug: 'seo-settings',
  label: 'SEO',
  admin: {
    group: 'Site Settings',
    description: 'Manage global SEO parameters, search engine crawler directives, and Robots.txt rules dynamically.',
  },
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'robotsTxt',
      label: 'Robots.txt Content',
      type: 'textarea',
      required: true,
      defaultValue: defaultRobotsTxt,
      admin: {
        description: 'Edit your website’s Robots.txt rules for search engine crawlers (Googlebot, Bingbot, etc.). Changes will automatically update your live /robots.txt endpoint and public file upon saving.',
        rows: 12,
      },
    },
  ],
};
