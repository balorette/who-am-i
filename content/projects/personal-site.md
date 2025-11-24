---
title: "Personal Portfolio Site"
date: "2025-01-15"
excerpt: "Modern static site built with Next.js, featuring dark theme and markdown-based content management."
coverImage: "/images/projects/personal-site.png"
tags: ["Next.js", "TypeScript", "Tailwind CSS", "AWS"]
githubUrl: "https://github.com/balorette/who-am-i"
liveUrl: "https://aftermarketcode.com"
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

## Design Philosophy

The site embraces a **minimal dark aesthetic** inspired by VSCode and terminal interfaces. Subtle animations and hover effects add life without being distracting. The terminal cursor effect on the logo (`$ aftermarketCode`) is a nod to my roots.

## Content Structure

The site is organized into distinct content types:

- **Projects** - Visual portfolios with code and narrative
- **Experiments** - Active explorations with status tracking
- **Findings** - Quick TIL-style insights
- **Thoughts** - Long-form reflections

All content is maintained as simple markdown files, making updates straightforward and version-controlled.

## Lessons Learned

Building this site reinforced the power of modern static site generation. The combination of Next.js App Router with static export provides the best of both worlds — developer experience during build time and pure HTML/CSS/JS for production.

**Key takeaways:**

1. **Type safety matters** - TypeScript caught numerous issues before deployment
2. **Component composition** - Breaking UI into small, focused components pays dividends
3. **Markdown simplicity** - Content management doesn't need to be complex
4. **Dark themes require care** - Color contrast and accessibility are critical

## Next Steps

- Add blog post search and filtering
- Implement RSS feed generation
- Create custom OG image generator
- Add view counter for popular posts
- Integrate GitHub API for live repo data

## Built With

This site was collaboratively built with [Claude Code](https://claude.com/claude-code), demonstrating the power of AI-assisted development while maintaining control over architecture and design decisions.
