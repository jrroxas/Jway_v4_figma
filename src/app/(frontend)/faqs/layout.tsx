import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/getPageMetadata';

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('faqs', {
    title: 'FAQ',
    description: 'Browse through our list of most frequently asked questions at JWay Group.',
  });
}

export default function FAQsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
