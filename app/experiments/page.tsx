import { Metadata } from 'next';
import Link from 'next/link';
import { FaGithub } from 'react-icons/fa';
import { getContentItems } from '@/lib/markdown';
import { ExperimentFrontmatter } from '@/lib/types';
import { generateMetadata as genMetadata } from '@/lib/seo';
import Card from '@/components/ui/Card';
import Tag from '@/components/ui/Tag';
import StatusBadge from '@/components/ui/StatusBadge';

export const metadata: Metadata = genMetadata({
  title: 'Experiments',
  description: 'Active explorations and experiments with emerging technologies.',
  path: '/experiments',
});

export default function ExperimentsPage() {
  const experiments = getContentItems<ExperimentFrontmatter>('experiments');

  const inProgress = experiments.filter((e) => e.frontmatter.status === 'in-progress');
  const completed = experiments.filter((e) => e.frontmatter.status === 'completed');
  const paused = experiments.filter((e) => e.frontmatter.status === 'paused');

  const renderExperiments = (items: typeof experiments, title: string) => {
    if (items.length === 0) return null;

    return (
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((experiment) => (
            <div key={experiment.slug}>
              <Card>
                <div className="flex items-start justify-between mb-4">
                  <Link href={`/experiments/${experiment.slug}`}>
                    <h3 className="text-xl font-semibold text-text-primary hover:text-accent-primary transition-colors">
                      {experiment.frontmatter.title}
                    </h3>
                  </Link>
                  <StatusBadge status={experiment.frontmatter.status} />
                </div>

                <p className="text-text-secondary mb-4">
                  {experiment.frontmatter.excerpt}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {experiment.frontmatter.tags.map((tag) => (
                    <Tag key={tag} variant="accent">{tag}</Tag>
                  ))}
                </div>

                <div className="flex gap-3 mt-4 pt-4 border-t border-border">
                  {experiment.frontmatter.githubUrl && (
                    <a
                      href={experiment.frontmatter.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-text-secondary hover:text-accent-primary transition-colors"
                    >
                      <FaGithub /> GitHub
                    </a>
                  )}
                  <Link
                    href={`/experiments/${experiment.slug}`}
                    className="flex items-center gap-2 text-sm text-accent-primary hover:underline ml-auto"
                  >
                    Read more →
                  </Link>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Experiments</h1>
        <p className="text-xl text-text-secondary max-w-3xl">
          Active explorations, side projects, and experiments with emerging technologies.
        </p>
      </div>

      {experiments.length === 0 ? (
        <Card>
          <p className="text-text-secondary text-center py-12">
            No experiments yet. Check back soon!
          </p>
        </Card>
      ) : (
        <>
          {renderExperiments(inProgress, 'In Progress')}
          {renderExperiments(completed, 'Completed')}
          {renderExperiments(paused, 'Paused')}
        </>
      )}
    </div>
  );
}
