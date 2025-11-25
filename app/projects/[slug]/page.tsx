import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FaGithub, FaExternalLinkAlt, FaArrowLeft } from 'react-icons/fa';
import { getContentBySlug, getAllSlugs, markdownToHtml, getReadingTime } from '@/lib/markdown';
import { ProjectFrontmatter } from '@/lib/types';
import { generateMetadata as genMetadata, generateBlogPostingJsonLd } from '@/lib/seo';
import JsonLd from '@/components/seo/JsonLd';
import Tag from '@/components/ui/Tag';
import StatusBadge from '@/components/ui/StatusBadge';

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllSlugs('projects');
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getContentBySlug<ProjectFrontmatter>('projects', slug);

  if (!project) {
    return {};
  }

  return genMetadata({
    title: project.frontmatter.title,
    description: project.frontmatter.excerpt || '',
    path: `/projects/${slug}`,
  });
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getContentBySlug<ProjectFrontmatter>('projects', slug);

  if (!project) {
    notFound();
  }

  const htmlContent = await markdownToHtml(project.content);
  const readingTime = getReadingTime(project.content);

  return (
    <>
      <JsonLd
        data={generateBlogPostingJsonLd({
          title: project.frontmatter.title,
          description: project.frontmatter.excerpt || '',
          datePublished: project.frontmatter.date,
          slug: `projects/${slug}`,
        })}
      />

      <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Link */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-accent-primary hover:underline mb-8"
        >
          <FaArrowLeft /> Back to Projects
        </Link>

        {/* Header */}
        <header className="mb-8 pb-8 border-b border-border">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-4xl md:text-5xl font-bold">{project.frontmatter.title}</h1>
            <StatusBadge status={project.frontmatter.status} />
          </div>

          {project.frontmatter.excerpt && (
            <p className="text-xl text-text-secondary mb-6">{project.frontmatter.excerpt}</p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
            <time dateTime={project.frontmatter.date}>
              {new Date(project.frontmatter.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <span>•</span>
            <span>{readingTime}</span>
          </div>

          <div className="flex flex-wrap gap-2 mt-6">
            {project.frontmatter.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>

          {/* Links */}
          <div className="flex gap-4 mt-6">
            {project.frontmatter.githubUrl && (
              <a
                href={project.frontmatter.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-background-secondary border border-border rounded-lg hover:border-accent-primary hover:text-accent-primary transition-colors"
              >
                <FaGithub /> View on GitHub
              </a>
            )}
            {project.frontmatter.liveUrl && (
              <a
                href={project.frontmatter.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-accent-primary text-background-primary rounded-lg hover:bg-accent-primary/90 transition-colors"
              >
                <FaExternalLinkAlt /> Live Demo
              </a>
            )}
          </div>
        </header>

        {/* Content */}
        <div
          className="prose prose-lg max-w-3xl"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </article>
    </>
  );
}
