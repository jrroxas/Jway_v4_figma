import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { sqliteAdapter } from '@payloadcms/db-sqlite';
import { nodemailerAdapter } from '@payloadcms/email-nodemailer';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { s3Storage } from '@payloadcms/storage-s3';
import { Users } from './collections/Users';
import { Media } from './collections/Media';
import { Posts } from './collections/Posts';
import { Pages } from './collections/Pages';
import { Testimonials } from './collections/Testimonials';
import { Forms } from './collections/Forms';
import { FormSettings } from './globals/FormSettings';
import { SeoSettings } from './globals/SeoSettings';
import { HeaderFooterScripts } from './globals/HeaderFooterScripts';
import { TrashSettings } from './globals/TrashSettings';
import { syncFrontendPages } from './lib/syncFrontendPages';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const isAmplify = Boolean(process.env.AWS_BRANCH || process.env.AWS_APP_ID || process.env.AMPLIFY_APP_ID);

let database;
if (process.env.DATABASE_URI) {
  database = postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
      max: 10,
      idleTimeoutMillis: 5000,
      connectionTimeoutMillis: 15000,
    },
    push: false,
  });
} else if (isAmplify) {
  throw new Error('DATABASE_URI is required in AWS Amplify environments.');
} else {
  let localSQLiteUrl = 'file:./jway-local.db';
  try {
    const localDataDir = path.resolve(dirname, '../.data');
    fs.mkdirSync(localDataDir, { recursive: true });
    localSQLiteUrl = `file:${path.join(localDataDir, 'jway-local.db').replace(/\\/g, '/')}`;
  } catch (e) {
    console.warn('[SQLite Storage Notice] Falling back to local file path:', e);
  }

  database = sqliteAdapter({
    client: {
      url: localSQLiteUrl,
    },
    push: false,
  });
}

const plugins = [];

if (process.env.S3_BUCKET) {
  plugins.push(
    s3Storage({
      collections: {
        media: true,
      },
      bucket: process.env.S3_BUCKET,
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        region: process.env.S3_REGION || 'us-west-1',
        endpoint: process.env.S3_ENDPOINT || undefined,
        forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
      },
    })
  );
}

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || process.env.SERVER_URL || '';

const allowedOrigins = [
  'http://localhost:3000',
  'https://main.d2gh5ky3k8k1rd.amplifyapp.com',
  'https://stg-ai.jway.com',
  'https://jway.com',
  'https://www.jway.com',
  serverURL,
].filter(Boolean);

export default buildConfig({
  onInit: async (payload) => {
    // Run page discovery non-blocking in the background so server startup & requests never wait
    setTimeout(() => {
      void syncFrontendPages(payload);
    }, 100);
  },
  routes: {
    admin: '/jway_administrator',
  },
  cors: allowedOrigins,
  csrf: allowedOrigins,
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '- JWay CMS',
      icons: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          url: '/favicon.ico',
        },
      ],
    },
    components: {
      graphics: {
        Logo: '/src/components/AdminLogo',
        Icon: '/src/components/AdminIcon',
      },
      beforeNavLinks: [
        '/src/components/AdminNavLogo',
      ],
    },
  },
  collections: [
    Users,
    Media,
    Posts,
    Pages,
    Testimonials,
    Forms,
  ],
  globals: [
    FormSettings,
    SeoSettings,
    HeaderFooterScripts,
    TrashSettings,
  ],
  email: process.env.SMTP_HOST
    ? nodemailerAdapter({
        defaultFromAddress: process.env.SMTP_FROM || 'info@jway.com',
        defaultFromName: 'JWay CMS',
        transportOptions: {
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || 587),
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        },
      })
    : undefined,
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || 'a-very-secure-default-secret-jway-group',
  db: database,
  plugins,
  typescript: {
    outputFile: path.resolve(dirname, '../payload-types.ts'),
  },
});
