# Copilot / AI agent instructions — Personal Static Site (Next.js)

## Project Overview
Modern SEO-optimized personal static website using Next.js 14+ App Router, TypeScript, and Tailwind CSS. Deployed to AWS S3/CloudFront as static HTML export.

## Quick Start Commands
```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build static site
npm run build

# Post-build tasks (sitemap generation)
npm run postbuild
```

## Project Structure & Conventions

### Directory Layout
- `app/` - Next.js App Router pages (Server Components by default)
  - `blog/[slug]/` - Dynamic blog posts from markdown
  - `projects/` - Portfolio showcase
  - `about/` - Professional bio
- `components/` - React components organized by domain
  - `layout/` - Header, Footer, Nav components
  - `blog/` - BlogCard, TableOfContents, etc.
  - `seo/` - JsonLd, MetaTags components
  - `ui/` - Reusable UI components
- `content/` - Content files (NOT in public/)
  - `posts/` - Markdown blog posts with frontmatter
  - `data/` - JSON data (projects.json, experience.json)
- `lib/` - Utility functions (markdown.ts, seo.ts, analytics.ts)

### Key Technical Decisions
- **Static Export**: `output: 'export'` in next.config.js - NO dynamic routes or API routes at runtime
- **Server Components First**: Use Client Components (`'use client'`) only for interactivity
- **TypeScript Strict Mode**: All code must pass strict type checking
- **Markdown Processing**: gray-matter for frontmatter, remark/rehype pipeline
- **Image Optimization**: Use Next.js Image component with `unoptimized: true` for static export

### Content Schemas

Blog Post Frontmatter (`content/posts/*.md`):
```yaml
---
title: "Post Title"
date: "2024-01-15"
excerpt: "Brief description"
coverImage: "/images/posts/cover.jpg"
tags: ["tag1", "tag2"]
author: "Your Name"
published: true
---
```

Project Data (`content/data/projects.json`):
```typescript
{
  id: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
}
```

### Critical Implementation Notes
1. **SEO Requirements**: Every page needs proper metadata using Next.js Metadata API
2. **Static Paths**: Use `generateStaticParams()` for dynamic routes like blog posts
3. **Trailing Slashes**: Enabled in next.config.js for S3 compatibility
4. **Analytics**: Google Analytics 4 (G-2HLT4VSZHW) - implement in root layout
5. **Sitemap Priorities**: Homepage (1.0), sections (0.8), posts (0.6), tags (0.4)

### Testing Requirements
- Verify `npm run build` produces `out/` directory
- Check all routes generate static HTML files
- Validate metadata on all pages
- Ensure sitemap.xml generates with correct priorities
- Test mobile responsiveness
- Lighthouse scores should be 90+ across all metrics

### Common Tasks

Adding a Blog Post:
1. Create markdown file in `content/posts/`
2. Include all required frontmatter fields
3. Run build to verify static generation

Adding a Project:
1. Update `content/data/projects.json`
2. Add project image to `public/images/projects/`
3. Verify featured projects appear on homepage

### AWS Deployment Notes
- Build output is in `out/` directory
- Upload to S3 with static website hosting enabled
- CloudFront distribution for CDN
- Region: us-east-2

### When to Ask the User
- Before adding new npm packages not in CLAUDE.md
- When implementing features not specified in project brief
- If build errors occur that suggest missing configuration
