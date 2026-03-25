import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import { getContentBySlug, getAllSlugs, markdownToHtml, getReadingTime } from '@/lib/markdown';
import { BlogPostFrontmatter } from '@/lib/types';
import { generateMetadata as genMetadata, generateBlogPostingJsonLd } from '@/lib/seo';
import JsonLd from '@/components/seo/JsonLd';
import Tag from '@/components/ui/Tag';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllSlugs('blog');
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getContentBySlug<BlogPostFrontmatter>('blog', slug);

  if (!post) {
    return {};
  }

  return genMetadata({
    title: post.frontmatter.title,
    description: post.frontmatter.excerpt || '',
    path: `/blog/${slug}`,
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getContentBySlug<BlogPostFrontmatter>('blog', slug);

  if (!post) {
    notFound();
  }

  const htmlContent = await markdownToHtml(post.content);
  const readingTime = getReadingTime(post.content);
  const isReflection = post.frontmatter.category === 'reflection';

  return (
    <>
      <JsonLd
        data={generateBlogPostingJsonLd({
          title: post.frontmatter.title,
          description: post.frontmatter.excerpt || '',
          datePublished: post.frontmatter.date,
          slug: `blog/${slug}`,
        })}
      />

      <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-accent-primary hover:underline mb-8"
        >
          <FaArrowLeft /> Back to Blog
        </Link>

        <header className="mb-8 pb-8 border-b border-border">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.frontmatter.title}</h1>

          {isReflection && post.frontmatter.excerpt && (
            <p className="text-xl text-text-secondary mb-6">{post.frontmatter.excerpt}</p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
            <time dateTime={post.frontmatter.date}>
              {new Date(post.frontmatter.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <span>•</span>
            <span>{readingTime}</span>
          </div>

          <div className="flex flex-wrap gap-2 mt-6">
            {post.frontmatter.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        </header>

        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </article>
    </>
  );
}
