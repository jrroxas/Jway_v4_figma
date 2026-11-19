import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/getPageMetadata';

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('terms-of-use', {
    title: 'Terms of Use',
    description: 'Learn about JWay Group website guidelines, policies, and conditions.',
  });
}

export default function TermsOfUseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
