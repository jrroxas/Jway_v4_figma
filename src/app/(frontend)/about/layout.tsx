import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/getPageMetadata';

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('about', {
    title: 'Pioneering the Digital Era: 28 Years and Beyond',
    description: "Pushing the boundaries of what's possible, fueled by our resolve to anticipate and meet the future needs of our clients and the digital world.",
  });
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
