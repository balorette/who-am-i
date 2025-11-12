import Link from 'next/link';
import { FaArrowRight, FaGithub } from 'react-icons/fa';
import { getContentItems } from '@/lib/markdown';
import { ProjectFrontmatter, ExperimentFrontmatter } from '@/lib/types';
import Card from '@/components/ui/Card';
import Tag from '@/components/ui/Tag';
import StatusBadge from '@/components/ui/StatusBadge';

export default function Home() {
  const projects = getContentItems<ProjectFrontmatter>('projects')
    .filter((p) => p.frontmatter.featured)
    .slice(0, 3);

  const experiments = getContentItems<ExperimentFrontmatter>('experiments')
    .filter((e) => e.frontmatter.status === 'in-progress')
    .slice(0, 2);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <section className="py-20 text-center animate-fade-in">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          <span className="text-gradient">Bryan Lorette</span>
        </h1>
        <p className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto mb-4">
          Building what&apos;s next, and fixing what&apos;s now. Going beyond the source code and engineering clarity and value.
        </p>
        <p className="text-lg text-text-accent font-mono mb-8">
          Currently exploring: <span className="text-accent-primary">Agentic AI Architectures</span>
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent-primary text-background-primary font-medium rounded-lg hover:bg-accent-primary/90 transition-colors"
          >
            View Projects <FaArrowRight />
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 px-6 py-3 border border-border text-text-primary font-medium rounded-lg hover:border-accent-primary hover:text-accent-primary transition-colors"
          >
            About Me
          </Link>
          <a
            href="https://github.com/balorette"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 border border-border text-text-primary font-medium rounded-lg hover:border-accent-primary hover:text-accent-primary transition-colors"
          >
            <FaGithub /> GitHub
          </a>
        </div>
      </section>

      {/* Featured Projects */}
      {projects.length > 0 && (
        <section className="py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Featured Projects</h2>
            <Link
              href="/projects"
              className="text-accent-primary hover:underline flex items-center gap-2"
            >
              View all <FaArrowRight className="text-sm" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link key={project.slug} href={`/projects/${project.slug}`}>
                <Card>
                  <h3 className="text-xl font-semibold mb-2 text-text-primary">
                    {project.frontmatter.title}
                  </h3>
                  <p className="text-text-secondary mb-4 line-clamp-2">
                    {project.frontmatter.excerpt}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.frontmatter.tags.slice(0, 3).map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </div>
                  <StatusBadge status={project.frontmatter.status} />
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Active Experiments */}
      {experiments.length > 0 && (
        <section className="py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Active Experiments</h2>
            <Link
              href="/experiments"
              className="text-accent-primary hover:underline flex items-center gap-2"
            >
              View all <FaArrowRight className="text-sm" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {experiments.map((experiment) => (
              <Link key={experiment.slug} href={`/experiments/${experiment.slug}`}>
                <Card>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-semibold text-text-primary">
                      {experiment.frontmatter.title}
                    </h3>
                    <StatusBadge status={experiment.frontmatter.status} />
                  </div>
                  <p className="text-text-secondary mb-4">
                    {experiment.frontmatter.excerpt}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {experiment.frontmatter.tags.map((tag) => (
                      <Tag key={tag} variant="accent">{tag}</Tag>
                    ))}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Quick Links */}
      <section className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/blog">
            <Card>
              <h3 className="text-xl font-semibold mb-2 text-accent-primary">
                Blog
              </h3>
              <p className="text-text-secondary">
                Insights, reflections, and learnings on technology and AI
              </p>
            </Card>
          </Link>
          <Link href="/now">
            <Card>
              <h3 className="text-xl font-semibold mb-2 text-accent-warning">
                Now
              </h3>
              <p className="text-text-secondary">
                What I&apos;m currently focused on
              </p>
            </Card>
          </Link>
        </div>
      </section>
    </div>
  );
}
