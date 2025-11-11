import { Metadata } from 'next';
import Link from 'next/link';
import { getContentItems } from '@/lib/markdown';
import { ThoughtFrontmatter } from '@/lib/types';
import { generateMetadata as genMetadata } from '@/lib/seo';
import Card from '@/components/ui/Card';
import Tag from '@/components/ui/Tag';

export const metadata: Metadata = genMetadata({
  title: 'Thoughts',
  description: 'Long-form reflections, deep dives, and technical essays.',
  path: '/thoughts',
});

export default function ThoughtsPage() {
  const thoughts = getContentItems<ThoughtFrontmatter>('thoughts');

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">✍️ Thoughts</h1>
        <p className="text-xl text-text-secondary max-w-3xl">
          Long-form reflections, deep dives, and technical essays.
        </p>
      </div>

      {thoughts.length === 0 ? (
        <Card>
          <p className="text-text-secondary text-center py-12">
            No thoughts yet. Check back soon!
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {thoughts.map((thought) => (
            <Link key={thought.slug} href={`/thoughts/${thought.slug}`}>
              <Card>
                <div className="flex items-start justify-between mb-2">
                  <h2 className="text-2xl font-semibold text-text-primary hover:text-accent-primary transition-colors">
                    {thought.frontmatter.title}
                  </h2>
                </div>
                {thought.frontmatter.excerpt && (
                  <p className="text-text-secondary mb-4">{thought.frontmatter.excerpt}</p>
                )}
                <div className="flex items-center gap-4 text-sm text-text-secondary mb-3">
                  <time dateTime={thought.frontmatter.date}>
                    {new Date(thought.frontmatter.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                  {thought.frontmatter.readingTime && (
                    <>
                      <span>•</span>
                      <span>{thought.frontmatter.readingTime}</span>
                    </>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {thought.frontmatter.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
