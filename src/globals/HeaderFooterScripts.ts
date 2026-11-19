import type { GlobalConfig } from 'payload';

const defaultHeaderScripts = `<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1012098261533939');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=1012098261533939&ev=PageView&noscript=1"
/></noscript>
<!-- End Meta Pixel Code -->`.trim();

export const HeaderFooterScripts: GlobalConfig = {
  slug: 'header-footer-scripts',
  label: 'Header/Footer Scripts',
  admin: {
    group: 'Site Settings',
    description: 'Manage custom scripts, tracking tags, and analytics code rendered in the header, body, and footer across all pages.',
  },
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'headerScripts',
      label: 'Header Scripts',
      type: 'textarea',
      defaultValue: defaultHeaderScripts,
      admin: {
        description: 'Code placed here will be rendered inside the <head> tag across all pages (e.g. Meta Pixel, Google Tag Manager script, verification meta tags).',
        rows: 10,
      },
    },
    {
      name: 'bodyScripts',
      label: 'Body Scripts',
      type: 'textarea',
      defaultValue: '',
      admin: {
        description: 'Code placed here will be rendered immediately after the opening <body> tag across all pages (e.g. Google Tag Manager noscript, top-of-body snippets).',
        rows: 10,
      },
    },
    {
      name: 'footerScripts',
      label: 'Footer Scripts',
      type: 'textarea',
      defaultValue: '',
      admin: {
        description: 'Code placed here will be rendered right before the closing </body> tag across all pages (e.g. chat widgets, conversion tags, third-party libraries).',
        rows: 10,
      },
    },
  ],
};
