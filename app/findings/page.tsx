import { Metadata } from 'next';
import Link from 'next/link';
import { getContentItems } from '@/lib/markdown';
import { FindingFrontmatter } from '@/lib/types';
import { generateMetadata as genMetadata } from '@/lib/seo';
import Card from '@/components/ui/Card';
import Tag from '@/components/ui/Tag';

export const metadata: Metadata = genMetadata({
  title: 'Findings',
  description: 'Quick insights, learnings, and today-I-learned moments.',
  path: '/findings',
});

export default function FindingsPage() {
  const findings = getContentItems<FindingFrontmatter>('findings');

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">💡 Findings</h1>
        <p className="text-xl text-text-secondary max-w-3xl">
          Quick insights, things I&apos;ve learned, and today-I-learned moments.
        </p>
      </div>

      {findings.length === 0 ? (
        <Card>
          <p className="text-text-secondary text-center py-12">
            No findings yet. Check back soon!
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {findings.map((finding) => (
            <Link key={finding.slug} href={`/findings/${finding.slug}`}>
              <Card>
                <div className="flex items-start justify-between mb-2">
                  <h2 className="text-xl font-semibold text-text-primary hover:text-accent-primary transition-colors">
                    {finding.frontmatter.title}
                  </h2>
                  <time className="text-sm text-text-secondary whitespace-nowrap ml-4">
                    {new Date(finding.frontmatter.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </time>
                </div>
                {finding.frontmatter.excerpt && (
                  <p className="text-text-secondary mb-3">{finding.frontmatter.excerpt}</p>
                )}
                <div className="flex flex-wrap gap-2">
                  {finding.frontmatter.tags.map((tag) => (
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
