import { Metadata } from 'next';
import { generateMetadata as genMetadata } from '@/lib/seo';

export const metadata: Metadata = genMetadata({
  title: 'Blog',
  description: 'Insights, reflections, and learnings on technology, infrastructure, and AI.',
  path: '/blog',
});

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
