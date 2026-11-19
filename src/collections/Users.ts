import type { CollectionConfig } from 'payload';

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  access: {
    // Admin users can do everything
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    // Email and password are automatically included by enabling "auth: true"
    {
      name: 'name',
      type: 'text',
      required: true,
    },
  ],
};
