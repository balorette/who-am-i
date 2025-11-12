import { redirect } from 'next/navigation';
import { getAllSlugs } from '@/lib/markdown';

interface FindingRedirectProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllSlugs('blog');
  return slugs.map((slug) => ({ slug }));
}

export default async function FindingRedirect({ params }: FindingRedirectProps) {
  const { slug } = await params;
  redirect(`/blog/${slug}`);
}
