import type { CollectionConfig } from 'payload';
import { createTrashAfterDeleteHook } from '@/lib/trashService';

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'company', 'role', 'order'],
    description: 'Client testimonials displayed on the Testimonials page.',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  hooks: {
    afterDelete: [createTrashAfterDeleteHook('testimonials')],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'text',
      required: true,
    },
    {
      name: 'company',
      type: 'text',
      required: true,
    },
    {
      name: 'avatarUrl',
      label: 'Avatar Image URL',
      type: 'text',
      required: true,
      admin: {
        description: 'Full URL to the client avatar image (e.g., https://www.jway.com/hubfs/...).',
      },
    },
    {
      name: 'quote',
      type: 'textarea',
      required: true,
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Order value to sort the testimonials sequentially in the grid.',
      },
    },
  ],
};
