import { Suspense } from 'react';
import { getContentItems } from '@/lib/markdown';
import { BlogPostFrontmatter } from '@/lib/types';
import BlogContent from './BlogContent';

export default function BlogPage() {
  const allPosts = getContentItems<BlogPostFrontmatter>('blog');

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">📝 Blog</h1>
        <p className="text-xl text-text-secondary max-w-3xl">
          Insights, reflections, and learnings on technology, infrastructure, and AI.
        </p>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <BlogContent posts={allPosts} />
      </Suspense>
    </div>
  );
}
