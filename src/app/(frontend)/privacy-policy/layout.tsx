import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/getPageMetadata';

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('privacy-policy', {
    title: 'Privacy Policy',
    description: 'Learn about the types of information we gather and how we use it to enhance your experience with the JWay website.',
  });
}

export default function PrivacyPolicyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
