import type { CollectionConfig, FieldHook } from 'payload';
import { createTrashAfterDeleteHook } from '@/lib/trashService';

const formatSlug = (val: string): string =>
  val
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-.]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');

const formatSlugHook = (fallback: string): FieldHook => ({ value, originalDoc, data }) => {
  if (typeof value === 'string' && value.trim() !== '') {
    return formatSlug(value);
  }
  const fallbackData = data?.[fallback] || originalDoc?.[fallback];
  if (fallbackData && typeof fallbackData === 'string') {
    return formatSlug(fallbackData);
  }
  return value;
};

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedDate', 'status'],
    description: 'Blog articles migrated from jway.com and any new posts created in this CMS.',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  hooks: {
    afterDelete: [createTrashAfterDeleteHook('posts')],
  },
  fields: [
    // ── Core ────────────────────────────────────────────────────────────────
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'URL slug. Auto-generated from title if left blank.',
      },
      hooks: {
        beforeValidate: [formatSlugHook('title')],
      },
    },

    // ── Meta ─────────────────────────────────────────────────────────────
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Short excerpt shown in the blog listing grid.',
      },
    },
    {
      name: 'coverImageUrl',
      label: 'Cover Image URL',
      type: 'text',
      required: true,
      admin: {
        description: 'Full URL to the featured image (e.g. https://www.jway.com/hubfs/...).',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'General',
      options: [
        { label: 'Design', value: 'Design' },
        { label: 'Enterprise', value: 'Enterprise' },
        { label: 'Staffing', value: 'Staffing' },
        { label: 'Strategy', value: 'Strategy' },
        { label: 'Technology', value: 'Technology' },
        { label: 'General', value: 'General' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'tags',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Comma-separated tags (e.g. Staffing, HR, Recruitment).',
      },
    },
    {
      name: 'readTime',
      label: 'Read Time',
      type: 'text',
      defaultValue: '5 min read',
      admin: { position: 'sidebar' },
    },
    {
      name: 'authorName',
      label: 'Author Name',
      type: 'text',
      defaultValue: 'JWay Group',
      admin: { position: 'sidebar' },
    },

    // ── Content ─────────────────────────────────────────────────────────
    {
      name: 'contentHtml',
      label: 'Content (HTML)',
      type: 'textarea',
      required: true,
      admin: {
        description:
          'Full article body as raw HTML. This is rendered directly on the blog detail page.',
      },
    },

    // ── Publishing ──────────────────────────────────────────────────────
    {
      name: 'publishedDate',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { position: 'sidebar' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'published',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
};
