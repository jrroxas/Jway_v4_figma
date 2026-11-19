import type { CollectionConfig } from 'payload';
import { createTrashAfterDeleteHook } from '@/lib/trashService';

export const Forms: CollectionConfig = {
  slug: 'forms',
  labels: {
    singular: 'Submission',
    plural: 'Submissions',
  },
  admin: {
    group: 'Contact Form',
    useAsTitle: 'name',
    defaultColumns: ['name', 'formName', 'email', 'company', 'status', 'createdAt'],
    description: 'Submissions from website forms (Homepage, Contact Us, Staffing, Talents, AI Solutions, Mobile).',
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => true,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  hooks: {
    afterDelete: [createTrashAfterDeleteHook('forms')],
  },
  fields: [
    {
      name: 'formName',
      label: 'Form Name / Origin',
      type: 'select',
      required: true,
      options: [
        { label: 'Homepage Form', value: 'Homepage Form' },
        { label: 'Contact Us Form', value: 'Contact Us Form' },
        { label: 'Staffing Talent Request', value: 'Staffing Talent Request' },
        { label: 'Talent Sourcing Inquiry', value: 'Talent Sourcing Inquiry' },
        { label: 'AI Solutions Inquiry', value: 'AI Solutions Inquiry' },
        { label: 'Mobile Consultation', value: 'Mobile Consultation' },
      ],
      defaultValue: 'Contact Us Form',
    },
    {
      name: 'name',
      label: 'Full Name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      required: true,
    },
    {
      name: 'company',
      label: 'Company Name',
      type: 'text',
    },
    {
      name: 'phone',
      label: 'Phone Number',
      type: 'text',
    },
    {
      name: 'subject',
      label: 'Subject / Role / Inquiry Type',
      type: 'text',
    },
    {
      name: 'message',
      label: 'Message / Requirements',
      type: 'textarea',
    },
    {
      name: 'status',
      label: 'Submission Status',
      type: 'select',
      options: [
        { label: 'New', value: 'new' },
        { label: 'In Progress', value: 'in_progress' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Archived', value: 'archived' },
      ],
      defaultValue: 'new',
    },
  ],
};
