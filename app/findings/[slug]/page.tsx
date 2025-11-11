import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import { getContentBySlug, getAllSlugs, markdownToHtml, getReadingTime } from '@/lib/markdown';
import { FindingFrontmatter } from '@/lib/types';
import { generateMetadata as genMetadata, generateBlogPostingJsonLd } from '@/lib/seo';
import JsonLd from '@/components/seo/JsonLd';
import Tag from '@/components/ui/Tag';

interface FindingPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllSlugs('findings');
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: FindingPageProps): Promise<Metadata> {
  const { slug } = await params;
  const finding = getContentBySlug<FindingFrontmatter>('findings', slug);

  if (!finding) {
    return {};
  }

  return genMetadata({
    title: finding.frontmatter.title,
    description: finding.frontmatter.excerpt || '',
    path: `/findings/${slug}`,
  });
}

export default async function FindingPage({ params }: FindingPageProps) {
  const { slug } = await params;
  const finding = getContentBySlug<FindingFrontmatter>('findings', slug);

  if (!finding) {
    notFound();
  }

  const htmlContent = await markdownToHtml(finding.content);
  const readingTime = getReadingTime(finding.content);

  return (
    <>
      <JsonLd
        data={generateBlogPostingJsonLd({
          title: finding.frontmatter.title,
          description: finding.frontmatter.excerpt || '',
          datePublished: finding.frontmatter.date,
          slug: `findings/${slug}`,
        })}
      />

      <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/findings"
          className="inline-flex items-center gap-2 text-accent-primary hover:underline mb-8"
        >
          <FaArrowLeft /> Back to Findings
        </Link>

        <header className="mb-8 pb-8 border-b border-border">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{finding.frontmatter.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
            <time dateTime={finding.frontmatter.date}>
              {new Date(finding.frontmatter.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <span>•</span>
            <span>{readingTime}</span>
          </div>

          <div className="flex flex-wrap gap-2 mt-6">
            {finding.frontmatter.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        </header>

        <div
          className="prose prose-invert prose-headings:text-text-primary prose-p:text-text-secondary prose-a:text-accent-primary prose-code:text-accent-primary prose-pre:bg-background-tertiary prose-pre:border prose-pre:border-border max-w-none"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </article>
    </>
  );
}
