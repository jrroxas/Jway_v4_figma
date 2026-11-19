import type { GlobalConfig } from 'payload';

export const FormSettings: GlobalConfig = {
  slug: 'form-settings',
  label: 'Form Settings',
  admin: {
    group: 'Contact Form',
    description: 'Manage email routing, recipient addresses, and live email server/API credentials dynamically.',
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'emailRecipient',
          label: 'Email Recipient (To)',
          type: 'text',
          required: true,
          defaultValue: 'info@jway.com',
          admin: {
            description: 'Primary email address that receives form notifications.',
            width: '50%',
          },
          validate: (value: unknown) => {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim()) || 'Enter a valid recipient email address.';
          },
        },
        {
          name: 'emailCc',
          label: 'Email CC',
          type: 'text',
          admin: {
            description: 'Comma-separated CC email addresses (e.g. sales@jway.com, support@jway.com).',
            width: '50%',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'emailSubject',
          label: 'Email Subject Prefix',
          type: 'text',
          required: true,
          defaultValue: 'New Contact Form Submission',
          admin: {
            description: 'Subject line prefix for incoming email notifications.',
            width: '50%',
          },
        },
        {
          name: 'fromEmail',
          label: 'From Email (Sender)',
          type: 'text',
          required: true,
          defaultValue: 'info@jway.com',
          admin: {
            description: 'Sender email address displayed on outgoing notifications.',
            width: '50%',
          },
          validate: (value: unknown) => {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim()) || 'Enter a valid sender email address.';
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Live Email Transport & Authentication Settings (SMTP or Google Cloud OAuth2)',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          name: 'enableSmtp',
          label: 'Enable Live Email Dispatch',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Toggle on to send real emails via the configured credentials below.',
          },
        },
        {
          name: 'authType',
          label: 'Authentication Method',
          type: 'radio',
          defaultValue: 'smtp',
          options: [
            { label: 'Standard SMTP / App Password', value: 'smtp' },
            { label: 'Google Cloud Console OAuth2 API', value: 'oauth2' },
          ],
          admin: {
            description: 'Select whether to authenticate via SMTP App Password or Google Cloud OAuth2 API.',
            layout: 'horizontal',
          },
        },
        {
          type: 'row',
          admin: {
            condition: (data, siblingData) => {
              const val = siblingData?.authType || data?.authType || 'smtp';
              return val === 'smtp';
            },
          },
          fields: [
            {
              name: 'smtpHost',
              label: 'SMTP Host Server',
              type: 'text',
              admin: {
                description: 'e.g. smtp.gmail.com, smtp.office365.com, email-smtp.us-east-1.amazonaws.com',
                placeholder: 'smtp.gmail.com',
                width: '50%',
              },
            },
            {
              name: 'smtpPort',
              label: 'SMTP Port',
              type: 'number',
              defaultValue: 587,
              admin: {
                description: '587 (TLS/STARTTLS) or 465 (SSL)',
                width: '25%',
              },
            },
            {
              name: 'smtpSecure',
              label: 'SSL Connection',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Check if using Port 465',
                width: '25%',
              },
            },
          ],
        },
        {
          type: 'row',
          admin: {
            condition: (data, siblingData) => {
              const val = siblingData?.authType || data?.authType || 'smtp';
              return val === 'smtp';
            },
          },
          fields: [
            {
              name: 'smtpUser',
              label: 'SMTP Username / Account Email',
              type: 'text',
              admin: {
                description: 'Email or login username for the SMTP server.',
                placeholder: 'support@jway.com',
                width: '50%',
              },
            },
            {
              name: 'smtpPass',
              label: 'SMTP Password / App Password',
              type: 'text',
              admin: {
                description: 'SMTP password or generated App Password / API key.',
                placeholder: '••••••••••••••••',
                width: '50%',
                className: 'password-mask-field',
              },
            },
          ],
        },
        {
          type: 'row',
          admin: {
            condition: (data, siblingData) => {
              const val = siblingData?.authType || data?.authType;
              return val === 'oauth2';
            },
          },
          fields: [
            {
              name: 'oauth2ClientId',
              label: 'Google Cloud Client ID',
              type: 'text',
              admin: {
                description: 'OAuth2 Client ID generated from Google Cloud Console.',
                width: '50%',
              },
            },
            {
              name: 'oauth2ClientSecret',
              label: 'Google Cloud Client Secret',
              type: 'text',
              admin: {
                description: 'OAuth2 Client Secret from Google Cloud Console.',
                placeholder: '••••••••••••••••',
                width: '50%',
              },
            },
          ],
        },
        {
          type: 'row',
          admin: {
            condition: (data, siblingData) => {
              const val = siblingData?.authType || data?.authType;
              return val === 'oauth2';
            },
          },
          fields: [
            {
              name: 'oauth2RefreshToken',
              label: 'Google Cloud Refresh Token',
              type: 'text',
              admin: {
                description: 'OAuth2 Refresh Token authorized for Gmail API sending.',
                width: '100%',
              },
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'reCAPTCHA v3',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'recaptchaSiteKey',
              label: 'Site Key',
              type: 'text',
              admin: {
                description: 'Google reCAPTCHA v3 public Site Key used on frontend forms.',
                placeholder: '6Lc...',
                width: '50%',
              },
            },
            {
              name: 'recaptchaSecretKey',
              label: 'Secret Key',
              type: 'text',
              admin: {
                description: 'Google reCAPTCHA v3 private Secret Key used for backend token verification.',
                placeholder: '••••••••••••••••',
                width: '50%',
                className: 'password-mask-field',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'testEmail',
      type: 'ui',
      admin: {
        components: {
          Field: '/src/components/TestEmailButton',
        },
      },
    },
  ],
};
