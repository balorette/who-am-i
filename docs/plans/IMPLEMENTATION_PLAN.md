# Bryan Lorette Personal Site - Implementation Plan

## Overview
This plan provides step-by-step implementation instructions for building Bryan's personal static site using Next.js 14+ with App Router, TypeScript, and Tailwind CSS. The site features a minimal dark VSCode/terminal aesthetic and showcases projects, experiments, findings, and thoughts.

---

## Phase 1: Project Initialization & Setup

### Task 1.1: Initialize Next.js Project
**File:** Root directory setup
**Commands:**
```bash
cd /root/code/who-am-i
npm create next-app@latest . -- --typescript --tailwind --app --no-src-dir --import-alias "@/*"
```

**Verification:**
- `package.json` exists with Next.js 14+ dependencies
- `app/` directory created
- `tailwind.config.ts` and `tsconfig.json` present

---

### Task 1.2: Install Required Dependencies
**File:** `package.json`
**Commands:**
```bash
npm install gray-matter remark remark-html rehype-slug rehype-autolink-headings shiki reading-time date-fns
npm install next-sitemap
npm install react-icons
npm install -D @types/node
```

**Dependencies Added:**
- **Content Processing:** `gray-matter`, `remark`, `remark-html`, `rehype-slug`, `rehype-autolink-headings`
- **Syntax Highlighting:** `shiki` (VSCode-style themes)
- **Utilities:** `reading-time`, `date-fns`
- **SEO:** `next-sitemap`
- **Icons:** `react-icons`

**Verification:**
```bash
npm list gray-matter remark shiki next-sitemap
```

---

### Task 1.3: Configure Next.js for Static Export
**File:** `next.config.js`
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // Required for static export
  },
  trailingSlash: true, // Better for S3 hosting
  reactStrictMode: true,
};

module.exports = nextConfig;
```

**Verification:**
- File exists at root
- `output: 'export'` configured
- `trailingSlash: true` set

---

### Task 1.4: Configure Tailwind with Dark Theme
**File:** `tailwind.config.ts`
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: {
          primary: '#1e1e1e',
          secondary: '#252526',
          tertiary: '#2d2d30',
        },
        text: {
          primary: '#d4d4d4',
          secondary: '#858585',
          accent: '#4ec9b0',
        },
        accent: {
          primary: '#4ec9b0',
          secondary: '#569cd6',
          warning: '#ce9178',
          success: '#6a9955',
        },
        border: '#3e3e42',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'cursor-blink': 'cursorBlink 1s step-end infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        cursorBlink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}

export default config
```

**Verification:**
- VSCode dark color palette configured
- Custom animations defined
- Font families set (Inter, JetBrains Mono)

---

### Task 1.5: Configure Global Styles
**File:** `app/globals.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: #1e1e1e;
    --foreground: #d4d4d4;
  }

  body {
    @apply bg-background-primary text-text-primary;
    font-feature-settings: 'liga' 1, 'calt' 1;
  }

  /* Smooth scrolling */
  html {
    scroll-behavior: smooth;
  }

  /* Respect reduced motion */
  @media (prefers-reduced-motion: reduce) {
    html {
      scroll-behavior: auto;
    }
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
}

@layer components {
  /* Card component base */
  .card {
    @apply bg-background-secondary border border-border rounded-lg p-6 transition-all duration-300;
  }

  .card:hover {
    @apply border-accent-primary shadow-lg shadow-accent-primary/10 scale-[1.02];
  }

  /* Code block styling */
  .code-block {
    @apply bg-background-tertiary border border-border rounded-md overflow-hidden;
  }

  /* Terminal cursor effect */
  .terminal-cursor::after {
    content: '▋';
    @apply text-accent-primary animate-cursor-blink;
  }
}

@layer utilities {
  .text-gradient {
    @apply bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent;
  }
}
```

**Verification:**
- Dark theme applied globally
- Custom component classes defined (card, code-block, terminal-cursor)
- Accessibility features (prefers-reduced-motion)

---

## Phase 2: Directory Structure & Content Setup

### Task 2.1: Create Directory Structure
**Commands:**
```bash
mkdir -p content/projects
mkdir -p content/experiments
mkdir -p content/findings
mkdir -p content/thoughts
mkdir -p content/data
mkdir -p components/layout
mkdir -p components/ui
mkdir -p components/seo
mkdir -p components/content
mkdir -p lib
mkdir -p public/images/projects
mkdir -p public/images/experiments
```

**Verification:**
```bash
ls -la content/
ls -la components/
ls -la lib/
ls -la public/images/
```

---

### Task 2.2: Create TypeScript Type Definitions
**File:** `lib/types.ts`
```typescript
export interface Frontmatter {
  title: string;
  date: string;
  excerpt?: string;
  tags: string[];
  published: boolean;
}

export interface ProjectFrontmatter extends Frontmatter {
  coverImage?: string;
  githubUrl?: string;
  liveUrl?: string;
  status: 'completed' | 'in-progress' | 'archived';
  featured?: boolean;
}

export interface ExperimentFrontmatter extends Frontmatter {
  githubUrl?: string;
  status: 'in-progress' | 'completed' | 'paused';
}

export interface FindingFrontmatter extends Frontmatter {
  category: 'finding';
}

export interface ThoughtFrontmatter extends Frontmatter {
  category: 'thought';
  readingTime?: string;
}

export interface ContentItem<T = Frontmatter> {
  slug: string;
  frontmatter: T;
  content: string;
}

export interface GitHubRepo {
  name: string;
  description: string;
  stars: number;
  language: string;
  url: string;
  lastUpdated: string;
}

export interface GitHubData {
  username: string;
  repos: GitHubRepo[];
}

export interface ExperienceItem {
  id: string;
  company: string;
  title: string;
  period: string;
  description: string;
  technologies: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
}

export interface NowData {
  lastUpdated: string;
  currentFocus: string[];
  learning: string[];
  reading: string[];
}
```

**Verification:**
- All content types have proper TypeScript interfaces
- Frontmatter types match CLAUDE.md schema

---

### Task 2.3: Create Markdown Processing Utilities
**File:** `lib/markdown.ts`
```typescript
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
```

**Verification:**
- Functions for reading markdown files
- Frontmatter parsing with gray-matter
- HTML conversion with remark
- Reading time calculation
- Tag extraction

---

### Task 2.4: Create SEO Utilities
**File:** `lib/seo.ts`
```typescript
import { Metadata } from 'next';

const siteConfig = {
  name: 'Bryan Lorette',
  title: 'Bryan Lorette - Infrastructure to AI',
  description: 'Personal site showcasing projects, experiments, and insights from infrastructure to cloud-native and AI technologies.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com',
  ogImage: '/images/og-image.jpg',
  links: {
    github: 'https://github.com/balorette',
    linkedin: 'https://www.linkedin.com/in/blorette/',
  },
};

export function generateMetadata({
  title,
  description,
  image,
  path = '',
}: {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
}): Metadata {
  const pageTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.title;
  const pageDescription = description || siteConfig.description;
  const pageImage = image || siteConfig.ogImage;
  const pageUrl = `${siteConfig.url}${path}`;

  return {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      type: 'website',
      url: pageUrl,
      title: pageTitle,
      description: pageDescription,
      images: [
        {
          url: pageImage,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
      siteName: siteConfig.name,
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [pageImage],
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}

export function generatePersonJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Bryan Lorette',
    url: siteConfig.url,
    sameAs: [
      siteConfig.links.github,
      siteConfig.links.linkedin,
    ],
    jobTitle: 'Infrastructure & Cloud Specialist',
    description: 'Infrastructure specialist evolving into cloud-native and AI technologies',
  };
}

export function generateWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
  };
}

export function generateBlogPostingJsonLd({
  title,
  description,
  datePublished,
  slug,
}: {
  title: string;
  description: string;
  datePublished: string;
  slug: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: description,
    datePublished: datePublished,
    author: {
      '@type': 'Person',
      name: 'Bryan Lorette',
    },
    url: `${siteConfig.url}/${slug}`,
  };
}

export { siteConfig };
```

**Verification:**
- Metadata generation function
- JSON-LD schemas (Person, WebSite, BlogPosting)
- Site configuration object

---

## Phase 3: Core Components

### Task 3.1: Create Layout Components - Header
**File:** `components/layout/Header.tsx`
```typescript
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Projects', href: '/projects' },
  { name: 'Experiments', href: '/experiments' },
  { name: 'Findings', href: '/findings' },
  { name: 'Thoughts', href: '/thoughts' },
  { name: 'Now', href: '/now' },
  { name: 'About', href: '/about' },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background-primary/95 backdrop-blur-sm border-b border-border">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-mono font-bold">
              <span className="text-accent-primary">$</span>{' '}
              <span className="terminal-cursor">bryan</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:gap-x-6">
            {navigation.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== '/' && pathname?.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'text-accent-primary border-b-2 border-accent-primary'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-text-primary"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open menu</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={
                    mobileMenuOpen
                      ? 'M6 18L18 6M6 6l12 12'
                      : 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col gap-y-4">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`text-base font-medium ${
                      isActive ? 'text-accent-primary' : 'text-text-secondary'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
```

**Verification:**
- Navigation links match site structure
- Active state indicator
- Mobile responsive menu
- Terminal-style branding

---

### Task 3.2: Create Layout Components - Footer
**File:** `components/layout/Footer.tsx`
```typescript
import Link from 'next/link';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-4">
              Bryan Lorette
            </h3>
            <p className="text-sm text-text-secondary">
              Infrastructure specialist evolving into cloud-native and AI technologies.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/projects"
                  className="text-sm text-text-secondary hover:text-accent-primary transition-colors"
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/experiments"
                  className="text-sm text-text-secondary hover:text-accent-primary transition-colors"
                >
                  Experiments
                </Link>
              </li>
              <li>
                <Link
                  href="/now"
                  className="text-sm text-text-secondary hover:text-accent-primary transition-colors"
                >
                  Now
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-text-secondary hover:text-accent-primary transition-colors"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-4">
              Connect
            </h3>
            <div className="flex gap-4">
              <a
                href="https://github.com/balorette"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-accent-primary transition-colors"
                aria-label="GitHub"
              >
                <FaGithub className="h-6 w-6" />
              </a>
              <a
                href="https://www.linkedin.com/in/blorette/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-accent-primary transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-sm text-text-secondary text-center">
            © {currentYear} Bryan Lorette. Built with{' '}
            <a
              href="https://nextjs.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-primary hover:underline"
            >
              Next.js
            </a>{' '}
            and{' '}
            <a
              href="https://claude.com/claude-code"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-primary hover:underline"
            >
              Claude Code
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
```

**Verification:**
- Social links (GitHub, LinkedIn)
- Quick navigation
- Built-with attribution
- Responsive grid layout

---

### Task 3.3: Create SEO Components - JsonLd
**File:** `components/seo/JsonLd.tsx`
```typescript
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

**Verification:**
- Simple JSON-LD wrapper component

---

### Task 3.4: Create UI Components - Card
**File:** `components/ui/Card.tsx`
```typescript
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = '', hover = true }: CardProps) {
  return (
    <div className={`card ${hover ? '' : 'hover:scale-100'} ${className}`}>
      {children}
    </div>
  );
}
```

**Verification:**
- Reusable card component with optional hover effect

---

### Task 3.5: Create UI Components - Tag
**File:** `components/ui/Tag.tsx`
```typescript
interface TagProps {
  children: string;
  variant?: 'default' | 'accent';
}

export default function Tag({ children, variant = 'default' }: TagProps) {
  const styles = {
    default: 'bg-background-tertiary text-text-secondary border-border',
    accent: 'bg-accent-primary/10 text-accent-primary border-accent-primary/30',
  };

  return (
    <span
      className={`inline-block px-3 py-1 text-xs font-mono border rounded-full ${styles[variant]}`}
    >
      {children}
    </span>
  );
}
```

**Verification:**
- Tag component for technologies/categories

---

### Task 3.6: Create UI Components - StatusBadge
**File:** `components/ui/StatusBadge.tsx`
```typescript
interface StatusBadgeProps {
  status: 'completed' | 'in-progress' | 'paused' | 'archived';
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    completed: 'bg-accent-success/10 text-accent-success border-accent-success/30',
    'in-progress': 'bg-accent-secondary/10 text-accent-secondary border-accent-secondary/30',
    paused: 'bg-accent-warning/10 text-accent-warning border-accent-warning/30',
    archived: 'bg-text-secondary/10 text-text-secondary border-text-secondary/30',
  };

  const labels = {
    completed: 'Completed',
    'in-progress': 'In Progress',
    paused: 'Paused',
    archived: 'Archived',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium border rounded-full ${styles[status]}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
      {labels[status]}
    </span>
  );
}
```

**Verification:**
- Status badge with color coding for project/experiment states

---

## Phase 4: Page Implementation

### Task 4.1: Create Root Layout
**File:** `app/layout.tsx`
```typescript
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import JsonLd from '@/components/seo/JsonLd';
import { generateMetadata, generatePersonJsonLd, generateWebSiteJsonLd } from '@/lib/seo';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = generateMetadata({});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <JsonLd data={generatePersonJsonLd()} />
        <JsonLd data={generateWebSiteJsonLd()} />
      </head>
      <body className="font-sans">
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
```

**Verification:**
- Fonts loaded (Inter, JetBrains Mono)
- Header and Footer included
- JSON-LD structured data
- Flex layout for sticky footer

---

### Task 4.2: Create Homepage
**File:** `app/page.tsx`
```typescript
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
          Infrastructure specialist evolving into cloud-native and AI technologies
        </p>
        <p className="text-lg text-text-accent font-mono mb-8">
          Currently exploring: <span className="text-accent-primary">Agentic AI Systems</span>
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
            className="inline-flex items-center gap-2 px-6 py-3 border border-accent-primary text-accent-primary font-medium rounded-lg hover:bg-accent-primary/10 transition-colors"
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/findings">
            <Card>
              <h3 className="text-xl font-semibold mb-2 text-accent-primary">
                💡 Findings
              </h3>
              <p className="text-text-secondary">
                Quick insights and things I've learned
              </p>
            </Card>
          </Link>
          <Link href="/thoughts">
            <Card>
              <h3 className="text-xl font-semibold mb-2 text-accent-secondary">
                ✍️ Thoughts
              </h3>
              <p className="text-text-secondary">
                Long-form reflections and deep dives
              </p>
            </Card>
          </Link>
          <Link href="/now">
            <Card>
              <h3 className="text-xl font-semibold mb-2 text-accent-warning">
                🎯 Now
              </h3>
              <p className="text-text-secondary">
                What I'm currently focused on
              </p>
            </Card>
          </Link>
        </div>
      </section>
    </div>
  );
}
```

**Verification:**
- Hero section with gradient text
- Featured projects grid
- Active experiments
- Quick links to other sections
- All links functional

---

### Task 4.3: Create Projects Listing Page
**File:** `app/projects/page.tsx`
```typescript
import { Metadata } from 'next';
import Link from 'next/link';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { getContentItems } from '@/lib/markdown';
import { ProjectFrontmatter } from '@/lib/types';
import { generateMetadata } from '@/lib/seo';
import Card from '@/components/ui/Card';
import Tag from '@/components/ui/Tag';
import StatusBadge from '@/components/ui/StatusBadge';

export const metadata: Metadata = generateMetadata({
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
```

**Verification:**
- Projects grid layout
- Status badges
- GitHub and live demo links
- Tag filtering display
- Empty state handling

---

### Task 4.4: Create Project Detail Page
**File:** `app/projects/[slug]/page.tsx`
```typescript
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FaGithub, FaExternalLinkAlt, FaArrowLeft } from 'react-icons/fa';
import { getContentBySlug, getAllSlugs, markdownToHtml, getReadingTime } from '@/lib/markdown';
import { ProjectFrontmatter } from '@/lib/types';
import { generateMetadata, generateBlogPostingJsonLd } from '@/lib/seo';
import JsonLd from '@/components/seo/JsonLd';
import Tag from '@/components/ui/Tag';
import StatusBadge from '@/components/ui/StatusBadge';

interface ProjectPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const slugs = getAllSlugs('projects');
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const project = getContentBySlug<ProjectFrontmatter>('projects', params.slug);

  if (!project) {
    return {};
  }

  return generateMetadata({
    title: project.frontmatter.title,
    description: project.frontmatter.excerpt || '',
    path: `/projects/${params.slug}`,
  });
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = getContentBySlug<ProjectFrontmatter>('projects', params.slug);

  if (!project) {
    notFound();
  }

  const htmlContent = await markdownToHtml(project.content);
  const readingTime = getReadingTime(project.content);

  return (
    <>
      <JsonLd
        data={generateBlogPostingJsonLd({
          title: project.frontmatter.title,
          description: project.frontmatter.excerpt || '',
          datePublished: project.frontmatter.date,
          slug: `projects/${params.slug}`,
        })}
      />

      <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Link */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-accent-primary hover:underline mb-8"
        >
          <FaArrowLeft /> Back to Projects
        </Link>

        {/* Header */}
        <header className="mb-8 pb-8 border-b border-border">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-4xl md:text-5xl font-bold">{project.frontmatter.title}</h1>
            <StatusBadge status={project.frontmatter.status} />
          </div>

          {project.frontmatter.excerpt && (
            <p className="text-xl text-text-secondary mb-6">{project.frontmatter.excerpt}</p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
            <time dateTime={project.frontmatter.date}>
              {new Date(project.frontmatter.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <span>•</span>
            <span>{readingTime}</span>
          </div>

          <div className="flex flex-wrap gap-2 mt-6">
            {project.frontmatter.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>

          {/* Links */}
          <div className="flex gap-4 mt-6">
            {project.frontmatter.githubUrl && (
              <a
                href={project.frontmatter.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-background-secondary border border-border rounded-lg hover:border-accent-primary hover:text-accent-primary transition-colors"
              >
                <FaGithub /> View on GitHub
              </a>
            )}
            {project.frontmatter.liveUrl && (
              <a
                href={project.frontmatter.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-accent-primary text-background-primary rounded-lg hover:bg-accent-primary/90 transition-colors"
              >
                <FaExternalLinkAlt /> Live Demo
              </a>
            )}
          </div>
        </header>

        {/* Content */}
        <div
          className="prose prose-invert prose-headings:text-text-primary prose-p:text-text-secondary prose-a:text-accent-primary prose-code:text-accent-primary prose-pre:bg-background-tertiary prose-pre:border prose-pre:border-border max-w-none"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </article>
    </>
  );
}
```

**Verification:**
- Dynamic routing with generateStaticParams
- Full project detail with metadata
- Markdown rendered to HTML
- Reading time calculation
- JSON-LD BlogPosting schema
- GitHub and live demo links
- Back navigation

---

### Task 4.5: Create Experiments Pages (Similar Pattern)
**File:** `app/experiments/page.tsx`
```typescript
import { Metadata } from 'next';
import Link from 'next/link';
import { FaGithub } from 'react-icons/fa';
import { getContentItems } from '@/lib/markdown';
import { ExperimentFrontmatter } from '@/lib/types';
import { generateMetadata } from '@/lib/seo';
import Card from '@/components/ui/Card';
import Tag from '@/components/ui/Tag';
import StatusBadge from '@/components/ui/StatusBadge';

export const metadata: Metadata = generateMetadata({
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
```

**File:** `app/experiments/[slug]/page.tsx`
```typescript
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FaGithub, FaArrowLeft } from 'react-icons/fa';
import { getContentBySlug, getAllSlugs, markdownToHtml, getReadingTime } from '@/lib/markdown';
import { ExperimentFrontmatter } from '@/lib/types';
import { generateMetadata, generateBlogPostingJsonLd } from '@/lib/seo';
import JsonLd from '@/components/seo/JsonLd';
import Tag from '@/components/ui/Tag';
import StatusBadge from '@/components/ui/StatusBadge';

interface ExperimentPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const slugs = getAllSlugs('experiments');
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ExperimentPageProps): Promise<Metadata> {
  const experiment = getContentBySlug<ExperimentFrontmatter>('experiments', params.slug);

  if (!experiment) {
    return {};
  }

  return generateMetadata({
    title: experiment.frontmatter.title,
    description: experiment.frontmatter.excerpt || '',
    path: `/experiments/${params.slug}`,
  });
}

export default async function ExperimentPage({ params }: ExperimentPageProps) {
  const experiment = getContentBySlug<ExperimentFrontmatter>('experiments', params.slug);

  if (!experiment) {
    notFound();
  }

  const htmlContent = await markdownToHtml(experiment.content);
  const readingTime = getReadingTime(experiment.content);

  return (
    <>
      <JsonLd
        data={generateBlogPostingJsonLd({
          title: experiment.frontmatter.title,
          description: experiment.frontmatter.excerpt || '',
          datePublished: experiment.frontmatter.date,
          slug: `experiments/${params.slug}`,
        })}
      />

      <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/experiments"
          className="inline-flex items-center gap-2 text-accent-primary hover:underline mb-8"
        >
          <FaArrowLeft /> Back to Experiments
        </Link>

        <header className="mb-8 pb-8 border-b border-border">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-4xl md:text-5xl font-bold">{experiment.frontmatter.title}</h1>
            <StatusBadge status={experiment.frontmatter.status} />
          </div>

          {experiment.frontmatter.excerpt && (
            <p className="text-xl text-text-secondary mb-6">{experiment.frontmatter.excerpt}</p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
            <time dateTime={experiment.frontmatter.date}>
              {new Date(experiment.frontmatter.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <span>•</span>
            <span>{readingTime}</span>
          </div>

          <div className="flex flex-wrap gap-2 mt-6">
            {experiment.frontmatter.tags.map((tag) => (
              <Tag key={tag} variant="accent">{tag}</Tag>
            ))}
          </div>

          {experiment.frontmatter.githubUrl && (
            <div className="mt-6">
              <a
                href={experiment.frontmatter.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-background-secondary border border-border rounded-lg hover:border-accent-primary hover:text-accent-primary transition-colors"
              >
                <FaGithub /> View on GitHub
              </a>
            </div>
          )}
        </header>

        <div
          className="prose prose-invert prose-headings:text-text-primary prose-p:text-text-secondary prose-a:text-accent-primary prose-code:text-accent-primary prose-pre:bg-background-tertiary prose-pre:border prose-pre:border-border max-w-none"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </article>
    </>
  );
}
```

**Verification:**
- Experiments grouped by status (in-progress, completed, paused)
- Similar structure to projects
- Detail pages with markdown rendering

---

### Task 4.6: Create Findings and Thoughts Pages
**File:** `app/findings/page.tsx` and `app/findings/[slug]/page.tsx`
**File:** `app/thoughts/page.tsx` and `app/thoughts/[slug]/page.tsx`

Follow the same pattern as experiments with appropriate frontmatter types.

**Verification:**
- Similar listing and detail page structure
- Appropriate styling for shorter findings vs longer thoughts
- Tag filtering available

---

### Task 4.7: Create Now Page
**File:** `app/now/page.tsx`
```typescript
import { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo';
import Card from '@/components/ui/Card';

export const metadata: Metadata = generateMetadata({
  title: 'Now',
  description: "What I'm currently focused on, learning, and exploring.",
  path: '/now',
});

export default function NowPage() {
  const lastUpdated = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">What I'm Doing Now</h1>
        <p className="text-text-secondary">
          Last updated: <time>{lastUpdated}</time>
        </p>
        <p className="text-sm text-text-secondary mt-2">
          Inspired by{' '}
          <a
            href="https://nownownow.com/about"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-primary hover:underline"
          >
            nownownow.com
          </a>
        </p>
      </div>

      <div className="space-y-8">
        <Card>
          <h2 className="text-2xl font-bold mb-4 text-accent-primary">🎯 Current Focus</h2>
          <ul className="space-y-2 text-text-secondary">
            <li>• Exploring agentic AI systems with Claude and custom agents</li>
            <li>• Building personal site with Next.js and modern static site techniques</li>
            <li>• Diving deeper into AWS cloud-native architectures</li>
          </ul>
        </Card>

        <Card>
          <h2 className="text-2xl font-bold mb-4 text-accent-secondary">📚 Learning</h2>
          <ul className="space-y-2 text-text-secondary">
            <li>• Advanced TypeScript patterns and type safety</li>
            <li>• AI agent orchestration and workflow design</li>
            <li>• Infrastructure as Code best practices</li>
          </ul>
        </Card>

        <Card>
          <h2 className="text-2xl font-bold mb-4 text-accent-success">🛠️ Building</h2>
          <ul className="space-y-2 text-text-secondary">
            <li>• Personal portfolio site (this site!)</li>
            <li>• Experimental AI-powered automation tools</li>
            <li>• Documentation and learning resources</li>
          </ul>
        </Card>
      </div>

      <div className="mt-12 p-6 bg-background-secondary border border-border rounded-lg">
        <p className="text-sm text-text-secondary">
          This is a "now page" — a snapshot of what I'm currently prioritizing. If you have your own
          site, consider making one too!
        </p>
      </div>
    </div>
  );
}
```

**Verification:**
- Current focus clearly displayed
- Last updated timestamp
- nownownow.com attribution
- Can be manually updated or driven by JSON data file

---

### Task 4.8: Create About Page
**File:** `app/about/page.tsx`
```typescript
import { Metadata } from 'next';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { generateMetadata } from '@/lib/seo';
import Card from '@/components/ui/Card';
import Tag from '@/components/ui/Tag';

export const metadata: Metadata = generateMetadata({
  title: 'About',
  description: 'Professional journey from infrastructure to cloud-native and AI technologies.',
  path: '/about',
});

export default function AboutPage() {
  const certifications = [
    { name: 'AWS Certified Cloud Practitioner', year: '2023' },
    { name: 'Microsoft Azure Infrastructure Solutions', year: '2022' },
    { name: 'ITILv3 Foundation', year: '2020' },
    { name: 'Red Hat Systems Administration', year: '2019' },
    { name: 'MCSE', year: '2018' },
  ];

  const technologies = [
    'AWS', 'Azure', 'Next.js', 'TypeScript', 'React',
    'Node.js', 'Python', 'Linux', 'Docker', 'Kubernetes',
    'Terraform', 'CloudFormation', 'CI/CD', 'AI/ML'
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">About Me</h1>
        <p className="text-xl text-text-secondary">
          Infrastructure specialist evolving into cloud-native and AI technologies
        </p>
      </div>

      {/* Journey */}
      <section className="mb-12">
        <Card>
          <h2 className="text-2xl font-bold mb-4">My Journey</h2>
          <div className="space-y-4 text-text-secondary">
            <p>
              I started my career deep in traditional infrastructure — working with enterprise
              systems, datacenters, Windows Server, Cisco networking, and Red Hat Linux. This
              foundation gave me a solid understanding of how systems work at a fundamental level.
            </p>
            <p>
              As cloud technologies emerged, I evolved my skillset into cloud-native architectures,
              earning certifications in AWS and Azure. I've embraced infrastructure as code,
              containerization, and modern DevOps practices.
            </p>
            <p>
              Today, I'm exploring the cutting edge of AI and agentic systems, applying my
              infrastructure background to build and experiment with emerging technologies. I
              believe the best way to learn is by building, documenting, and sharing.
            </p>
          </div>
        </Card>
      </section>

      {/* Skills & Technologies */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Technologies & Skills</h2>
        <Card>
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech) => (
              <Tag key={tech}>{tech}</Tag>
            ))}
          </div>
        </Card>
      </section>

      {/* Certifications */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Certifications</h2>
        <div className="space-y-4">
          {certifications.map((cert) => (
            <Card key={cert.name} hover={false}>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{cert.name}</h3>
                <span className="text-text-secondary">{cert.year}</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Connect */}
      <section>
        <Card>
          <h2 className="text-2xl font-bold mb-4">Let's Connect</h2>
          <p className="text-text-secondary mb-6">
            I'm always interested in connecting with fellow technologists, learning from others,
            and sharing knowledge.
          </p>
          <div className="flex gap-4">
            <a
              href="https://github.com/balorette"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-background-tertiary border border-border rounded-lg hover:border-accent-primary hover:text-accent-primary transition-colors"
            >
              <FaGithub className="text-xl" /> GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/blorette/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-background-tertiary border border-border rounded-lg hover:border-accent-primary hover:text-accent-primary transition-colors"
            >
              <FaLinkedin className="text-xl" /> LinkedIn
            </a>
          </div>
        </Card>
      </section>
    </div>
  );
}
```

**Verification:**
- Journey narrative (infrastructure → cloud → AI)
- Technologies list
- Certifications timeline
- Social connection links

---

## Phase 5: SEO & Analytics

### Task 5.1: Configure Sitemap Generation
**File:** `next-sitemap.config.js`
```javascript
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://yourdomain.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ['/api/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
  transform: async (config, path) => {
    // Custom priority logic
    if (path === '/') {
      return {
        loc: path,
        changefreq: 'daily',
        priority: 1.0,
        lastmod: new Date().toISOString(),
      };
    }

    if (path === '/projects' || path === '/experiments' || path === '/about') {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: new Date().toISOString(),
      };
    }

    if (path.startsWith('/projects/') || path.startsWith('/experiments/')) {
      return {
        loc: path,
        changefreq: 'monthly',
        priority: 0.6,
        lastmod: new Date().toISOString(),
      };
    }

    return {
      loc: path,
      changefreq: 'monthly',
      priority: 0.5,
      lastmod: new Date().toISOString(),
    };
  },
};
```

**Verification:**
- Sitemap priority structure defined
- robots.txt generation enabled
- Custom transform function for priority logic

---

### Task 5.2: Add Sitemap Script to package.json
**File:** `package.json`
Add to scripts:
```json
{
  "scripts": {
    "postbuild": "next-sitemap"
  }
}
```

**Verification:**
- Script runs after build
- Generates sitemap.xml and robots.txt in `out/` directory

---

### Task 5.3: Create Google Analytics Component
**File:** `lib/analytics.ts`
```typescript
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-2HLT4VSZHW';

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}
```

**File:** `components/analytics/GoogleAnalytics.tsx`
```typescript
'use client';

import Script from 'next/script';
import { GA_TRACKING_ID } from '@/lib/analytics';

export default function GoogleAnalytics() {
  if (!GA_TRACKING_ID) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}
```

**Update:** `app/layout.tsx` - Add GoogleAnalytics component
```typescript
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';

// Add inside <body> tag
<GoogleAnalytics />
```

**Verification:**
- GA tracking ID configured
- Script loads after interactive
- Pageview tracking enabled

---

### Task 5.4: Create Environment Variables File
**File:** `.env.local`
```env
NEXT_PUBLIC_GA_ID=G-2HLT4VSZHW
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

**File:** `.env.example`
```env
NEXT_PUBLIC_GA_ID=your-ga-tracking-id
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

**Verification:**
- Environment variables documented
- .env.local in .gitignore

---

## Phase 6: Sample Content

### Task 6.1: Create Sample Project
**File:** `content/projects/personal-site.md`
```markdown
---
title: "Personal Portfolio Site"
date: "2025-01-15"
excerpt: "Modern static site built with Next.js, featuring dark theme and markdown-based content management."
coverImage: "/images/projects/personal-site.jpg"
tags: ["Next.js", "TypeScript", "Tailwind CSS", "AWS"]
githubUrl: "https://github.com/balorette/who-am-i"
liveUrl: "https://yourdomain.com"
status: "in-progress"
featured: true
published: true
---

## Overview

This personal portfolio site showcases my projects, experiments, and thoughts on technology. Built with Next.js 14+ and deployed as a static site to AWS S3/CloudFront.

## Features

- **Minimal Dark Theme**: VSCode-inspired color palette with terminal aesthetics
- **Markdown Content**: Easy-to-maintain blog posts and project documentation
- **Static Export**: Fast, secure, and cost-effective hosting on AWS
- **SEO Optimized**: Comprehensive metadata, sitemaps, and JSON-LD structured data

## Tech Stack

- Next.js 14+ with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Shiki for syntax highlighting
- AWS S3 + CloudFront for hosting

## Lessons Learned

Building this site reinforced the power of modern static site generation. The combination of Next.js App Router with static export provides the best of both worlds — developer experience during build time and pure HTML/CSS/JS for production.

## Next Steps

- Add blog post search and filtering
- Implement RSS feed generation
- Create custom OG image generator
- Add view counter for popular posts
```

**Verification:**
- Sample project with all frontmatter fields
- Markdown content renders properly
- Featured project appears on homepage

---

### Task 6.2: Create Sample Experiment
**File:** `content/experiments/ai-agent-exploration.md`
```markdown
---
title: "AI Agent Exploration"
date: "2025-01-10"
excerpt: "Exploring agentic AI systems and building custom Claude-powered automation workflows."
tags: ["AI", "Claude", "Python", "Automation"]
status: "in-progress"
githubUrl: "https://github.com/balorette/ai-experiments"
published: true
---

## What I'm Exploring

I'm diving into agentic AI systems — autonomous agents that can plan, execute, and adapt to achieve goals. Using Claude and custom orchestration, I'm building workflows that handle complex multi-step tasks.

## Current Progress

- ✅ Set up basic agent framework
- ✅ Implemented task decomposition logic
- 🔄 Working on error handling and retry mechanisms
- ⏳ Planning integration with external APIs

## Key Learnings

1. **Prompt engineering is critical** — Clear, specific instructions yield better agent behavior
2. **Error handling matters** — Agents need graceful failure modes
3. **Context management** — Keeping conversation context focused improves results

## Next Steps

- Implement parallel task execution
- Add monitoring and logging
- Test with real-world workflows
```

**Verification:**
- In-progress status displayed
- Tags render correctly
- Appears in "Active Experiments" section on homepage

---

### Task 6.3: Create Sample Finding
**File:** `content/findings/til-next-static-export.md`
```markdown
---
title: "TIL: Next.js Static Export with App Router"
date: "2025-01-12"
tags: ["Next.js", "Static Sites"]
category: "finding"
published: true
---

Next.js 14+ App Router supports static export with `output: 'export'` in next.config.js. This generates a fully static site that can be hosted on any static file server.

Key considerations:
- Image optimization requires `unoptimized: true`
- Dynamic routes need `generateStaticParams()`
- API routes don't work (use build-time data fetching instead)

Perfect for personal sites, documentation, and blogs that don't need server-side rendering.
```

**Verification:**
- Short, scannable format
- TIL prefix in title
- Quick insight format

---

### Task 6.4: Create Sample Thought
**File:** `content/thoughts/infrastructure-to-ai.md`
```markdown
---
title: "From Infrastructure to AI: Lessons from Two Decades"
date: "2025-01-08"
excerpt: "Reflecting on how foundational infrastructure knowledge informs my approach to emerging AI technologies."
tags: ["Career", "Infrastructure", "AI", "Learning"]
category: "thought"
readingTime: "5 min"
published: true
---

## The Foundation Matters

Twenty years ago, I was configuring Cisco routers and managing Windows Server deployments. Today, I'm experimenting with AI agents and cloud-native architectures. The journey from traditional infrastructure to cutting-edge AI might seem like a leap, but the fundamentals remain surprisingly relevant.

## What Transfers

Infrastructure work taught me systems thinking — understanding how components interact, anticipating failure modes, and designing for resilience. These same principles apply to AI systems:

- **Reliability**: Just like redundant servers, AI workflows need fallback mechanisms
- **Observability**: Monitoring infrastructure taught me to instrument everything
- **Scalability**: Cloud-native thinking scales to AI orchestration

## The Joy of Continuous Learning

What keeps me engaged is the constant evolution. Every certification, every new technology, every experiment builds on what came before. Infrastructure specialists who embrace learning have a massive advantage — we understand the full stack from bare metal to AI.

## Looking Forward

The convergence of infrastructure and AI is accelerating. Infrastructure-as-code meets AI-as-code. The skills that served me well in datacenters now inform how I build and deploy intelligent systems.

The lesson? Never stop learning. The foundation you build today will support tomorrow's innovations.
```

**Verification:**
- Long-form reflection
- Personal perspective
- Reading time estimate

---

## Phase 7: Build & Deployment

### Task 7.1: Test Development Build
**Commands:**
```bash
npm run dev
```

**Verification:**
- Site runs on localhost:3000
- All pages accessible
- Navigation works
- Content renders properly

---

### Task 7.2: Build Static Export
**Commands:**
```bash
npm run build
```

**Verification:**
- Build completes without errors
- `out/` directory created with static files
- Sitemap and robots.txt generated
- All HTML files present

---

### Task 7.3: Test Static Export Locally
**Commands:**
```bash
npx serve out
```

**Verification:**
- Site loads from static files
- All pages work correctly
- Images load
- Links functional

---

### Task 7.4: AWS Deployment (Manual Steps)

**S3 Bucket Setup:**
1. Create S3 bucket in us-east-2
2. Enable static website hosting
3. Set bucket policy for public read access
4. Upload contents of `out/` directory

**CloudFront Distribution:**
1. Create CloudFront distribution
2. Point origin to S3 bucket
3. Configure SSL certificate (ACM)
4. Set default root object to `index.html`
5. Configure error pages (404 → /404/index.html)

**Route 53 (Optional):**
1. Create hosted zone for domain
2. Add A record pointing to CloudFront
3. Verify DNS propagation

**Verification:**
- Site accessible via CloudFront URL
- SSL certificate valid
- All pages load correctly
- Custom domain resolves (if configured)

---

## Phase 8: Documentation & Finalization

### Task 8.1: Create README
**File:** `README.md`
```markdown
# Bryan Lorette - Personal Site

Modern personal portfolio site showcasing projects, experiments, and insights from infrastructure to cloud-native and AI technologies.

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Content**: Markdown with gray-matter
- **Hosting**: AWS S3 + CloudFront

## Getting Started

### Install Dependencies
\`\`\`bash
npm install
\`\`\`

### Run Development Server
\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000)

### Build for Production
\`\`\`bash
npm run build
\`\`\`

Static files generated in `out/` directory.

## Content Management

### Add a Project
Create a markdown file in `content/projects/`:

\`\`\`markdown
---
title: "Project Name"
date: "2025-01-15"
excerpt: "Brief description"
tags: ["Next.js", "AWS"]
githubUrl: "https://github.com/username/repo"
status: "completed"
featured: true
published: true
---

Your project content here...
\`\`\`

### Add an Experiment
Create a markdown file in `content/experiments/`

### Add a Finding
Create a markdown file in `content/findings/`

### Add a Thought
Create a markdown file in `content/thoughts/`

## Deployment

1. Build static export: `npm run build`
2. Upload `out/` directory to S3 bucket
3. Invalidate CloudFront cache if needed

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

\`\`\`env
NEXT_PUBLIC_GA_ID=your-ga-tracking-id
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
\`\`\`

## License

MIT

## Built With

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Claude Code](https://claude.com/claude-code)
```

**Verification:**
- README provides clear instructions
- Content management guide included
- Deployment steps documented

---

### Task 8.2: Create .gitignore
**File:** `.gitignore`
```
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
```

**Verification:**
- Sensitive files excluded
- Build artifacts ignored
- Environment files protected

---

## Success Criteria Checklist

- [ ] All pages render correctly as static HTML
- [ ] Markdown content processes properly with syntax highlighting
- [ ] SEO meta tags present on all pages
- [ ] Sitemap generates with correct priorities
- [ ] Google Analytics tracking works
- [ ] Mobile responsive on all devices
- [ ] Dark theme applied consistently
- [ ] Animations respect prefers-reduced-motion
- [ ] All navigation links functional
- [ ] GitHub and social links work
- [ ] Project/experiment status badges display correctly
- [ ] Tags render and are clickable
- [ ] Build completes without errors
- [ ] Static export works locally
- [ ] AWS deployment successful (S3 + CloudFront)

---

## Estimated Timeline

- **Phase 1**: Project Setup — 1 hour
- **Phase 2**: Directory Structure & Utilities — 2 hours
- **Phase 3**: Core Components — 3 hours
- **Phase 4**: Page Implementation — 4 hours
- **Phase 5**: SEO & Analytics — 1 hour
- **Phase 6**: Sample Content — 1 hour
- **Phase 7**: Build & Deployment — 2 hours
- **Phase 8**: Documentation — 1 hour

**Total**: ~15 hours

---

## Notes for Implementation

1. **Test frequently**: Run `npm run dev` after each phase to verify changes
2. **Commit regularly**: Create git commits after completing each task
3. **Content first**: Create sample content early to test rendering
4. **Mobile testing**: Check responsive design throughout development
5. **Performance**: Monitor bundle size and optimize as needed
6. **Accessibility**: Test keyboard navigation and screen reader compatibility
7. **Browser testing**: Verify in Chrome, Firefox, Safari, Edge

---

## Future Enhancements

- [ ] Blog post search functionality
- [ ] Tag-based filtering UI
- [ ] RSS feed generation
- [ ] Custom OG image generator
- [ ] View counter for popular posts
- [ ] GitHub API integration for live repo data
- [ ] Dark/light theme toggle
- [ ] Code block copy button
- [ ] Table of contents navigation
- [ ] Related posts suggestions
