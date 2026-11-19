import { RootLayout } from '@payloadcms/next/layouts';
import { handleServerFunctions } from '@payloadcms/next/layouts';
import { importMap } from './jway_administrator/importMap.js';
import config from '@/payload.config';
import React from 'react';
import '@payloadcms/next/css';
import './custom.css';

type Args = {
  children: React.ReactNode;
};

const serverFunction = async function (args: any) {
  'use server';
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  });
};

const Layout = ({ children }: Args) => (
  <RootLayout
    config={config}
    importMap={importMap}
    serverFunction={serverFunction}
  >
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              if (document.body && document.body.hasAttribute('cz-shortcut-listen')) {
                document.body.removeAttribute('cz-shortcut-listen');
              }
            } catch(e) {}
          })();
        `,
      }}
    />
    {children}
  </RootLayout>
);

export default Layout;
