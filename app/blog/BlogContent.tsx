'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ContentItem, BlogPostFrontmatter } from '@/lib/types';
import Card from '@/components/ui/Card';
import Tag from '@/components/ui/Tag';

type FilterType = 'all' | 'insights' | 'reflections';

interface BlogContentProps {
  posts: ContentItem<BlogPostFrontmatter>[];
}

export default function BlogContent({ posts }: BlogContentProps) {
  const searchParams = useSearchParams();
  const filter = (searchParams.get('filter') || 'all') as FilterType;

  // Filter posts based on category
  const filteredPosts = posts.filter((post) => {
    if (filter === 'all') return true;
    if (filter === 'insights') return post.frontmatter.category === 'insight';
    if (filter === 'reflections') return post.frontmatter.category === 'reflection';
    return true;
  });

  // Filter tabs
  const filters: { label: string; value: FilterType }[] = [
    { label: 'All', value: 'all' },
    { label: 'Insights', value: 'insights' },
    { label: 'Reflections', value: 'reflections' },
  ];

  return (
    <>
      {/* Filter tabs */}
      <div className="flex gap-2 mb-8 border-b border-border pb-4">
        {filters.map((f) => (
          <Link
            key={f.value}
            href={f.value === 'all' ? '/blog' : `/blog?filter=${f.value}`}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === f.value
                ? 'bg-accent-primary text-background-primary font-semibold'
                : 'text-text-secondary hover:text-text-primary hover:bg-background-secondary'
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {filteredPosts.length === 0 ? (
        <Card>
          <p className="text-text-secondary text-center py-12">
            {filter === 'all'
              ? 'No posts yet. Check back soon!'
              : `No ${filter} yet. Check back soon!`}
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredPosts.map((post) => {
            const isReflection = post.frontmatter.category === 'reflection';

            return (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <Card>
                  <div className="flex items-start justify-between mb-2">
                    <h2 className="text-xl md:text-2xl font-semibold text-text-primary hover:text-accent-primary transition-colors">
                      {post.frontmatter.title}
                    </h2>
                    {!isReflection && (
                      <time className="text-sm text-text-secondary whitespace-nowrap ml-4">
                        {new Date(post.frontmatter.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </time>
                    )}
                  </div>

                  {post.frontmatter.excerpt && (
                    <p className="text-text-secondary mb-3">{post.frontmatter.excerpt}</p>
                  )}

                  {isReflection && (
                    <div className="flex items-center gap-4 text-sm text-text-secondary mb-3">
                      <time dateTime={post.frontmatter.date}>
                        {new Date(post.frontmatter.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </time>
                      {post.frontmatter.readingTime && (
                        <>
                          <span>•</span>
                          <span>{post.frontmatter.readingTime}</span>
                        </>
                      )}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {post.frontmatter.tags.map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
