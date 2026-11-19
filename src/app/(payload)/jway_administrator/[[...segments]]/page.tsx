import config from '@/payload.config';
import { RootPage, generatePageMetadata } from '@payloadcms/next/views';
import { importMap } from '../importMap.js';

type PageParams = {
  segments: string[];
};

type PageProps = {
  params: Promise<PageParams>;
  searchParams: Promise<{ [key: string]: string | string[] }>;
};

export const generateMetadata = ({ params, searchParams }: PageProps) =>
  generatePageMetadata({ config, params, searchParams });

const Page = ({ params, searchParams }: PageProps) => (
  <RootPage
    config={config}
    importMap={importMap}
    params={params}
    searchParams={searchParams}
  />
);

export default Page;
