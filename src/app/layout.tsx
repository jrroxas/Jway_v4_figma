import React from 'react';

// Root layout: transparent passthrough.
// Each route group owns its own <html> + <body>:
//   (frontend)/layout.tsx -> site pages
//   (payload)/layout.tsx  -> Payload CMS admin (via @payloadcms/next RootLayout)
// This prevents nested <html>/<body> hydration errors in React 19 / Next.js 16.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
