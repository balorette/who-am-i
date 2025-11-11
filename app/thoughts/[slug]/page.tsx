import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import { getContentBySlug, getAllSlugs, markdownToHtml, getReadingTime } from '@/lib/markdown';
import { ThoughtFrontmatter } from '@/lib/types';
import { generateMetadata as genMetadata, generateBlogPostingJsonLd } from '@/lib/seo';
import JsonLd from '@/components/seo/JsonLd';
import Tag from '@/components/ui/Tag';

interface ThoughtPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllSlugs('thoughts');
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ThoughtPageProps): Promise<Metadata> {
  const { slug } = await params;
  const thought = getContentBySlug<ThoughtFrontmatter>('thoughts', slug);

  if (!thought) {
    return {};
  }

  return genMetadata({
    title: thought.frontmatter.title,
    description: thought.frontmatter.excerpt || '',
    path: `/thoughts/${slug}`,
  });
}

export default async function ThoughtPage({ params }: ThoughtPageProps) {
  const { slug } = await params;
  const thought = getContentBySlug<ThoughtFrontmatter>('thoughts', slug);

  if (!thought) {
    notFound();
  }

  const htmlContent = await markdownToHtml(thought.content);
  const readingTime = getReadingTime(thought.content);

  return (
    <>
      <JsonLd
        data={generateBlogPostingJsonLd({
          title: thought.frontmatter.title,
          description: thought.frontmatter.excerpt || '',
          datePublished: thought.frontmatter.date,
          slug: `thoughts/${slug}`,
        })}
      />

      <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/thoughts"
          className="inline-flex items-center gap-2 text-accent-primary hover:underline mb-8"
        >
          <FaArrowLeft /> Back to Thoughts
        </Link>

        <header className="mb-8 pb-8 border-b border-border">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{thought.frontmatter.title}</h1>

          {thought.frontmatter.excerpt && (
            <p className="text-xl text-text-secondary mb-6">{thought.frontmatter.excerpt}</p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
            <time dateTime={thought.frontmatter.date}>
              {new Date(thought.frontmatter.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <span>•</span>
            <span>{readingTime}</span>
          </div>

          <div className="flex flex-wrap gap-2 mt-6">
            {thought.frontmatter.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        </header>

        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </article>
    </>
  );
}
