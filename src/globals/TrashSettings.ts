import type { GlobalConfig } from 'payload';

export const TrashSettings: GlobalConfig = {
  slug: 'trash',
  label: 'Trash',
  admin: {
    group: 'Site Settings',
    description:
      'Review deleted pages, blog posts, testimonials, and form submissions. Restore items back to the site or permanently delete them.',
  },
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'trashManager',
      type: 'ui',
      admin: {
        components: {
          Field: '/src/components/TrashManager',
        },
      },
    },
  ],
};
