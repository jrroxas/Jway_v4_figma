import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/getPageMetadata';

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('contact-us', {
    title: 'Connect With Our Global Offices',
    description: 'Partner with a Silicon Valley powerhouse backed by premier Philippine delivery capabilities. We are here to support your scaling and product objectives.',
  });
}

export default function ContactUsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
