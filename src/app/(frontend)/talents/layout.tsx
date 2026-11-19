import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/getPageMetadata';

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('talents', {
    title: 'Vetted Talents Network',
    description: 'Explore JWay’s expert-vetted network of top AI, Engineering, Design, and Management talents available for immediate deployment.',
  });
}

export default function TalentsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
