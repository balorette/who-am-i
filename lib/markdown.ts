import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeShiki from '@shikijs/rehype';
import readingTime from 'reading-time';
import type { ContentItem, Frontmatter } from './types';

const contentDirectory = path.join(process.cwd(), 'content');

/**
 * Get all content items from a specific directory
 */
export function getContentItems<T extends Frontmatter>(
  type: 'projects' | 'experiments' | 'findings' | 'thoughts' | 'blog'
): ContentItem<T>[] {
  const directory = path.join(contentDirectory, type);

  // Check if directory exists
  if (!fs.existsSync(directory)) {
    return [];
  }

  const fileNames = fs.readdirSync(directory);

  const items = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(directory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        slug,
        frontmatter: data as T,
        content,
      };
    })
    .filter((item) => item.frontmatter.published !== false)
    .sort((a, b) => {
      // Sort by date descending
      return new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime();
    });

  return items;
}

/**
 * Get a single content item by slug
 */
export function getContentBySlug<T extends Frontmatter>(
  type: 'projects' | 'experiments' | 'findings' | 'thoughts' | 'blog',
  slug: string
): ContentItem<T> | null {
  try {
    const directory = path.join(contentDirectory, type);
    const fullPath = path.join(directory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      frontmatter: data as T,
      content,
    };
  } catch {
    return null;
  }
}

/**
 * Compile MDX content to React component
 */
export async function compileMDX(markdown: string) {
  const { evaluate } = await import('@mdx-js/mdx');
  const { Fragment, jsx, jsxs } = await import('react/jsx-runtime');

  const compiled = await evaluate(markdown, {
    Fragment,
    jsx,
    jsxs,
    development: false,
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'wrap',
          properties: {
            className: ['heading-anchor'],
            ariaLabel: 'Link to section',
          },
        },
      ],
      [
        rehypeShiki,
        {
          theme: 'dark-plus',
          langs: ['typescript', 'javascript', 'tsx', 'jsx', 'json', 'bash', 'yaml', 'markdown'],
        },
      ],
    ],
  });

  return compiled.default;
}

/**
 * @deprecated Use compileMDX instead - this is kept for backwards compatibility during migration
 * Convert markdown to HTML (legacy function)
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  // Temporary compatibility shim - will be removed in Task 8
  const { remark } = await import('remark');
  const html = (await import('remark-html')).default;

  const result = await remark()
    .use(html, { sanitize: false })
    .process(markdown);

  return result.toString();
}

/**
 * Get reading time for content
 */
export function getReadingTime(content: string): string {
  const stats = readingTime(content);
  return stats.text;
}

/**
 * Get all slugs for a content type
 */
export function getAllSlugs(
  type: 'projects' | 'experiments' | 'findings' | 'thoughts' | 'blog'
): string[] {
  const directory = path.join(contentDirectory, type);

  if (!fs.existsSync(directory)) {
    return [];
  }

  const fileNames = fs.readdirSync(directory);
  return fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => fileName.replace(/\.md$/, ''));
}

/**
 * Get all unique tags from content items
 */
export function getAllTags(
  type?: 'projects' | 'experiments' | 'findings' | 'thoughts' | 'blog'
): string[] {
  const types = type
    ? [type]
    : (['projects', 'experiments', 'findings', 'thoughts', 'blog'] as const);

  const allTags = new Set<string>();

  types.forEach((t) => {
    const items = getContentItems(t);
    items.forEach((item) => {
      item.frontmatter.tags?.forEach((tag) => allTags.add(tag));
    });
  });

  return Array.from(allTags).sort();
}
