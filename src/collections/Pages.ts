import type { CollectionConfig, FieldHook } from 'payload';
import { createTrashAfterDeleteHook } from '@/lib/trashService';

const formatSlug = (value: string): string =>
  value
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-.]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');

const formatSlugHook: FieldHook = ({ value, originalDoc, data }) => {
  const source = value || data?.title || originalDoc?.title;
  return typeof source === 'string' ? formatSlug(source) : value;
};

export const Pages: CollectionConfig = {
  slug: 'pages',
  defaultSort: '-updatedAt',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    description: 'Website pages managed through the CMS.',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  hooks: {
    beforeOperation: [
      ({ args, operation }) => {
        if (operation === 'read') {
          const currentSort = (args as { sort?: string | string[] })?.sort;
          if (!currentSort || currentSort === 'updatedAt' || currentSort === '-id' || currentSort === 'id') {
            (args as { sort?: string }).sort = '-updatedAt';
          }
        }
        return args;
      },
    ],
    afterDelete: [createTrashAfterDeleteHook('pages')],
  },
  fields: [
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
        description: 'URL slug. Auto-generated from the title if left blank.',
      },
      hooks: {
        beforeValidate: [formatSlugHook],
      },
    },
    {
      type: 'collapsible',
      label: 'SEO Settings',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'metaTitle',
          label: 'Meta Title',
          type: 'text',
          maxLength: 60,
          admin: {
            description: 'Recommended length: 50-60 characters.',
            components: {
              Field: '/src/components/SeoFallbackFields#SeoMetaTitleField',
            },
          },
        },
        {
          name: 'metaDescription',
          label: 'Meta Description',
          type: 'textarea',
          maxLength: 160,
          admin: {
            description: 'Recommended length: 150-160 characters.',
            components: {
              Field: '/src/components/SeoFallbackFields#SeoMetaDescriptionField',
            },
          },
        },
        {
          name: 'noIndex',
          label: 'No Index',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Prevent search engines from indexing this page.',
          },
        },
        {
          name: 'noFollow',
          label: 'No Follow',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Prevent search engines from following links on this page.',
          },
        },
      ],
    },
  ],
};
