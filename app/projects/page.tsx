import { Metadata } from 'next';
import Link from 'next/link';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { getContentItems } from '@/lib/markdown';
import { ProjectFrontmatter } from '@/lib/types';
import { generateMetadata as genMetadata } from '@/lib/seo';
import Card from '@/components/ui/Card';
import Tag from '@/components/ui/Tag';
import StatusBadge from '@/components/ui/StatusBadge';

export const metadata: Metadata = genMetadata({
  title: 'Projects',
  description: 'Visual portfolio of projects showcasing infrastructure, cloud-native, and AI work.',
  path: '/projects',
});

export default function ProjectsPage() {
  const projects = getContentItems<ProjectFrontmatter>('projects');

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Projects</h1>
        <p className="text-xl text-text-secondary max-w-3xl">
          Visual portfolios showcasing work across infrastructure, cloud-native technologies, and AI.
        </p>
      </div>

      {projects.length === 0 ? (
        <Card>
          <p className="text-text-secondary text-center py-12">
            No projects yet. Check back soon!
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.slug}>
              <Card>
                <div className="flex items-start justify-between mb-4">
                  <Link href={`/projects/${project.slug}`}>
                    <h2 className="text-2xl font-semibold text-text-primary hover:text-accent-primary transition-colors">
                      {project.frontmatter.title}
                    </h2>
                  </Link>
                  <StatusBadge status={project.frontmatter.status} />
                </div>

                <p className="text-text-secondary mb-4 line-clamp-3">
                  {project.frontmatter.excerpt}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.frontmatter.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>

                <div className="flex gap-3 mt-4 pt-4 border-t border-border">
                  {project.frontmatter.githubUrl && (
                    <a
                      href={project.frontmatter.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-text-secondary hover:text-accent-primary transition-colors"
                    >
                      <FaGithub /> GitHub
                    </a>
                  )}
                  {project.frontmatter.liveUrl && (
                    <a
                      href={project.frontmatter.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-text-secondary hover:text-accent-primary transition-colors"
                    >
                      <FaExternalLinkAlt /> Live Demo
                    </a>
                  )}
                  <Link
                    href={`/projects/${project.slug}`}
                    className="flex items-center gap-2 text-sm text-accent-primary hover:underline ml-auto"
                  >
                    Read more →
                  </Link>
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
