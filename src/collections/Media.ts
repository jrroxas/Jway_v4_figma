import type { CollectionConfig } from 'payload';
import { createTrashAfterDeleteHook } from '@/lib/trashService';

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: 'public/uploads',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 512,
        position: 'centre',
      },
      {
        name: 'tablet',
        width: 1024,
        // Height is calculated dynamically based on original aspect ratio if omitted
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  hooks: {
    afterDelete: [createTrashAfterDeleteHook('media')],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
};
