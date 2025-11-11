import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FaGithub, FaArrowLeft } from 'react-icons/fa';
import { getContentBySlug, getAllSlugs, markdownToHtml, getReadingTime } from '@/lib/markdown';
import { ExperimentFrontmatter } from '@/lib/types';
import { generateMetadata as genMetadata, generateBlogPostingJsonLd } from '@/lib/seo';
import JsonLd from '@/components/seo/JsonLd';
import Tag from '@/components/ui/Tag';
import StatusBadge from '@/components/ui/StatusBadge';

interface ExperimentPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllSlugs('experiments');
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ExperimentPageProps): Promise<Metadata> {
  const { slug } = await params;
  const experiment = getContentBySlug<ExperimentFrontmatter>('experiments', slug);

  if (!experiment) {
    return {};
  }

  return genMetadata({
    title: experiment.frontmatter.title,
    description: experiment.frontmatter.excerpt || '',
    path: `/experiments/${slug}`,
  });
}

export default async function ExperimentPage({ params }: ExperimentPageProps) {
  const { slug } = await params;
  const experiment = getContentBySlug<ExperimentFrontmatter>('experiments', slug);

  if (!experiment) {
    notFound();
  }

  const htmlContent = await markdownToHtml(experiment.content);
  const readingTime = getReadingTime(experiment.content);

  return (
    <>
      <JsonLd
        data={generateBlogPostingJsonLd({
          title: experiment.frontmatter.title,
          description: experiment.frontmatter.excerpt || '',
          datePublished: experiment.frontmatter.date,
          slug: `experiments/${slug}`,
        })}
      />

      <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/experiments"
          className="inline-flex items-center gap-2 text-accent-primary hover:underline mb-8"
        >
          <FaArrowLeft /> Back to Experiments
        </Link>

        <header className="mb-8 pb-8 border-b border-border">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-4xl md:text-5xl font-bold">{experiment.frontmatter.title}</h1>
            <StatusBadge status={experiment.frontmatter.status} />
          </div>

          {experiment.frontmatter.excerpt && (
            <p className="text-xl text-text-secondary mb-6">{experiment.frontmatter.excerpt}</p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
            <time dateTime={experiment.frontmatter.date}>
              {new Date(experiment.frontmatter.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <span>•</span>
            <span>{readingTime}</span>
          </div>

          <div className="flex flex-wrap gap-2 mt-6">
            {experiment.frontmatter.tags.map((tag) => (
              <Tag key={tag} variant="accent">{tag}</Tag>
            ))}
          </div>

          {experiment.frontmatter.githubUrl && (
            <div className="mt-6">
              <a
                href={experiment.frontmatter.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-background-secondary border border-border rounded-lg hover:border-accent-primary hover:text-accent-primary transition-colors"
              >
                <FaGithub /> View on GitHub
              </a>
            </div>
          )}
        </header>

        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </article>
    </>
  );
}
