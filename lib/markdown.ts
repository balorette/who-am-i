import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import readingTime from 'reading-time';
import type { ContentItem, Frontmatter } from './types';

const contentDirectory = path.join(process.cwd(), 'content');

/**
 * Get all content items from a specific directory
 */
export function getContentItems<T extends Frontmatter>(
  type: 'projects' | 'experiments' | 'findings' | 'thoughts'
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
  type: 'projects' | 'experiments' | 'findings' | 'thoughts',
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
  } catch (error) {
    return null;
  }
}

/**
 * Convert markdown to HTML
 */
export async function markdownToHtml(markdown: string): Promise<string> {
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
  type: 'projects' | 'experiments' | 'findings' | 'thoughts'
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
  type?: 'projects' | 'experiments' | 'findings' | 'thoughts'
): string[] {
  const types = type
    ? [type]
    : (['projects', 'experiments', 'findings', 'thoughts'] as const);

  const allTags = new Set<string>();

  types.forEach((t) => {
    const items = getContentItems(t);
    items.forEach((item) => {
      item.frontmatter.tags?.forEach((tag) => allTags.add(tag));
    });
  });

  return Array.from(allTags).sort();
}
