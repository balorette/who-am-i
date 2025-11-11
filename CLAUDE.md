# Bryan Lorette - Personal Static Site

## Project Overview
Build a modern, minimal dark-themed personal website that showcases Bryan's evolution from traditional infrastructure to cloud-native and AI technologies. The site demonstrates continuous growth and learning through projects, experiments, and insights—balancing professional expertise with authentic personality. Built as a static site using Next.js with App Router for easy maintenance and deployed to AWS S3/CloudFront.

## Brand Identity
**Narrative:** Infrastructure specialist evolving into cloud-native and AI domains, applying foundational knowledge to cutting-edge technologies.

**Audience:** Mixed technical audience (developers, architects, hiring managers) with focus on demonstrating capabilities through building and sharing.

**Tone:** Professional yet playful, clean minimal dark aesthetic with VSCode/terminal inspiration, subtle animations that feel alive without being flashy.

**Content Strategy:** Project-based learning showcases, quick findings/insights, thoughtful reflections, and current explorations. Balanced personal/professional perspective.

## Technology Stack

### Frontend
- **Framework:** Next.js 14+ with App Router
- **Language:** TypeScript
- **UI Library:** React 18+
- **Styling:** Tailwind CSS
- **Icons:** React Icons

### Content Management
- **Blog Posts:** Markdown files stored in `/content/posts/`
- **Data Files:** JSON files for projects, experience, etc. in `/content/data/`
- **Content Processing:** gray-matter for frontmatter, remark/rehype for markdown processing

### SEO & Analytics
- **Sitemap Generation:** next-sitemap (v4.2.3) with priority structure
- **Analytics:** Google Analytics (Tracking ID: G-2HLT4VSZHW)
- **Meta Tags:** Next.js Metadata API for Open Graph and Twitter Cards
- **Structured Data:** JSON-LD schemas (Person, WebSite, Organization)
- **Canonical URLs:** Prevent duplicate content indexing

### Deployment
- **Hosting:** AWS S3 (static site hosting)
- **CDN:** AWS CloudFront
- **SSL/TLS:** AWS Certificate Manager
- **Region:** us-east-2
- **Build Output:** Static HTML export (`output: 'export'` in next.config.js)

## Project Structure
```
/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout with metadata
│   ├── page.tsx                  # Homepage with hero + current focus
│   ├── projects/
│   │   ├── page.tsx              # Projects showcase (visual portfolios)
│   │   └── [slug]/
│   │       └── page.tsx          # Individual project detail
│   ├── experiments/
│   │   ├── page.tsx              # Active explorations and experiments
│   │   └── [slug]/
│   │       └── page.tsx          # Individual experiment
│   ├── findings/
│   │   ├── page.tsx              # Quick insights, TILs
│   │   └── [slug]/
│   │       └── page.tsx          # Individual finding
│   ├── thoughts/
│   │   ├── page.tsx              # Longer-form reflections
│   │   └── [slug]/
│   │       └── page.tsx          # Individual thought piece
│   ├── now/
│   │   └── page.tsx              # Current focus (nownownow.com style)
│   ├── about/
│   │   └── page.tsx              # Professional journey, story arc
│   └── api/                      # API routes (if needed pre-build)
├── components/                   # React components
│   ├── layout/                   # Header, Footer, Nav
│   ├── blog/                     # Blog-specific components
│   ├── seo/                      # SEO components (JsonLd, etc.)
│   └── ui/                       # Reusable UI components
├── content/
│   ├── projects/                 # Project markdown with visual portfolios
│   │   └── project-name.md
│   ├── experiments/              # Experiment markdown
│   │   └── experiment-name.md
│   ├── findings/                 # Quick insight markdown
│   │   └── finding-name.md
│   ├── thoughts/                 # Long-form reflection markdown
│   │   └── thought-name.md
│   └── data/                     # JSON data files
│       ├── github.json           # GitHub profile/repos data
│       ├── experience.json       # Career timeline
│       ├── certifications.json   # Certs and learning journey
│       └── now.json              # Current focus data
├── lib/                          # Utility functions
│   ├── markdown.ts               # Markdown processing
│   ├── seo.ts                    # SEO utilities
│   └── analytics.ts              # Analytics setup
├── public/                       # Static assets
│   ├── images/
│   ├── favicon.ico
│   └── robots.txt
├── styles/
│   └── globals.css               # Global Tailwind styles
├── next.config.js                # Next.js configuration
├── next-sitemap.config.js        # Sitemap configuration
├── tailwind.config.js            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies
```

## Key Features to Implement

### 1. Core Pages
- **Homepage:** Hero section showcasing current focus (AI/emerging tech), featured projects, quick navigation
- **Projects:** Visual portfolio cards with code + narrative, GitHub integration, technology tags
- **Experiments:** Active explorations with status indicators (in-progress, completed, paused)
- **Findings:** Quick TIL-style insights, easily scannable format
- **Thoughts:** Long-form reflections with TOC
- **Now:** Current focus page (what I'm working on, learning, exploring)
- **About:** Professional journey narrative (infrastructure → cloud → AI), certification timeline, story arc

### 2. Content Functionality
- Markdown rendering with syntax highlighting (Shiki for VSCode-style theming)
- Frontmatter support (title, date, tags, excerpt, status, githubUrl)
- Table of contents generation for long-form content
- Reading time estimation
- Tag/category filtering across all content types
- GitHub repo integration for projects (stars, language, last updated)
- RSS feed generation

### 3. Visual Design System
- **Dark Theme:** Minimal dark base with VSCode/terminal color palette
- **Animations:** Subtle transitions, hover states, smooth scrolling, terminal cursor effects
- **Typography:** Monospace accents for code/tech elements, clean sans-serif for readability
- **Components:** Card-based layouts, code block styling, visual hierarchy for portfolios
- **Interactive Elements:** Animated terminal prompt, playful micro-interactions without distraction

### 4. SEO Implementation
- Dynamic meta tags per page
- Open Graph images
- Twitter Card metadata
- JSON-LD structured data for:
  - Person schema (homepage/about)
  - BlogPosting schema (blog posts)
  - WebSite schema (site-wide)
- Sitemap with priority levels:
  - Priority 1.0: Homepage
  - Priority 0.8: Main sections (blog, projects, about)
  - Priority 0.6: Individual blog posts
  - Priority 0.4: Tag pages
- robots.txt configuration
- Canonical URL management

### 5. Performance Optimization
- Image optimization with Next.js Image component
- Static page generation at build time
- Optimized font loading (local fonts or Google Fonts with display: swap)
- CSS purging via Tailwind
- Bundle size optimization

### 6. Analytics Integration
- Google Analytics 4 setup (G-2HLT4VSZHW)
- Event tracking for:
  - Page views
  - Blog post reads
  - External link clicks
  - Project clicks

## Development Guidelines

### Code Style
- Use TypeScript strict mode
- Implement proper type definitions for all data structures
- Follow React best practices (functional components, hooks)
- Use ES6+ features
- Implement error boundaries for production

### Component Patterns
- Server Components by default (App Router)
- Client Components only when necessary (interactivity, hooks)
- Proper component composition and reusability
- Consistent prop typing with TypeScript interfaces

### Content Schema

#### Project Frontmatter
```yaml
---
title: "Project Name"
date: "2025-01-15"
excerpt: "Brief visual portfolio description"
coverImage: "/images/projects/cover.jpg"
tags: ["Next.js", "AWS", "AI"]
githubUrl: "https://github.com/balorette/repo"
liveUrl: "https://example.com"
status: "completed" # or "in-progress", "archived"
featured: true
published: true
---
```

#### Experiment Frontmatter
```yaml
---
title: "Experiment Name"
date: "2025-01-15"
excerpt: "What I'm exploring and why"
tags: ["Claude", "AI Agents", "Python"]
status: "in-progress" # or "completed", "paused"
githubUrl: "https://github.com/balorette/experiment"
published: true
---
```

#### Finding Frontmatter (Quick Insights/TIL)
```yaml
---
title: "TIL: Short Finding Title"
date: "2025-01-15"
tags: ["AWS", "Lambda"]
category: "finding"
published: true
---
```

#### Thought Frontmatter (Long-form Reflections)
```yaml
---
title: "Thought Piece Title"
date: "2025-01-15"
excerpt: "Reflection on a topic"
tags: ["Career", "Learning", "Infrastructure"]
category: "thought"
readingTime: "5 min"
published: true
---
```

#### GitHub Data Structure (fetched via API or manual JSON)
```json
{
  "username": "balorette",
  "repos": [
    {
      "name": "repo-name",
      "description": "Repo description",
      "stars": 10,
      "language": "TypeScript",
      "url": "https://github.com/balorette/repo-name",
      "lastUpdated": "2025-01-15"
    }
  ]
}
```

## Design System & Theme

### Color Palette (VSCode/Terminal Dark Inspiration)
```javascript
// Tailwind config color scheme
colors: {
  background: {
    primary: '#1e1e1e',      // VSCode dark bg
    secondary: '#252526',     // Elevated surfaces
    tertiary: '#2d2d30',      // Cards/modals
  },
  text: {
    primary: '#d4d4d4',       // Primary text
    secondary: '#858585',     // Muted text
    accent: '#4ec9b0',        // Cyan accent (terminal green)
  },
  accent: {
    primary: '#4ec9b0',       // Teal/cyan
    secondary: '#569cd6',     // Blue
    warning: '#ce9178',       // Orange
    success: '#6a9955',       // Green
  },
  border: '#3e3e42',          // Subtle borders
}
```

### Typography
- **Headings:** Inter or Space Grotesk (clean, modern sans-serif)
- **Body:** Inter (readable, professional)
- **Code/Terminal:** JetBrains Mono or Fira Code (monospace with ligatures)

### Animation Principles
- Subtle fade-ins on scroll
- Smooth hover states (scale 1.02, border glow)
- Terminal cursor blink effect for interactive elements
- Page transitions with minimal motion
- Respect `prefers-reduced-motion`

### Component Design Patterns
- **Cards:** Dark background with subtle border, hover effect with glow
- **Code Blocks:** VSCode-style with line numbers, language badge
- **Navigation:** Minimal top nav with terminal-style active indicator
- **Footer:** Compact with social links, built-with attribution
- **Buttons:** Outlined style with accent color, filled on hover

## Deployment Configuration

### next.config.js Requirements
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // Required for static export
  },
  trailingSlash: true, // Better for S3 hosting
};
```

### next-sitemap.config.js
```javascript
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://yourdomain.com',
  generateRobotsTxt: true,
  priority: 0.7,
  changefreq: 'daily',
  transform: async (config, path) => {
    // Custom priority logic
    if (path === '/') return { priority: 1.0 };
    if (path.startsWith('/blog/')) return { priority: 0.6 };
    return { priority: 0.5 };
  },
};
```

### AWS Deployment Notes
- Build produces `out/` directory with static files
- Upload `out/` contents to S3 bucket
- Configure S3 for static website hosting
- Create CloudFront distribution pointing to S3
- Set up SSL certificate in ACM for custom domain
- Configure Route 53 (if using custom domain)

## Getting Started Commands
```bash
# Initialize project
npm create next-app@latest . -- --typescript --tailwind --app --no-src-dir

# Install dependencies
npm install gray-matter remark remark-html remark-prism rehype-slug rehype-autolink-headings
npm install next-sitemap reading-time date-fns
npm install react-icons
npm install -D @types/node

# Development
npm run dev

# Build for production
npm run build

# Generate sitemap (post-build)
npm run postbuild # Add to package.json scripts
```

## Environment Variables
```env
# .env.local
NEXT_PUBLIC_GA_ID=G-2HLT4VSZHW
SITE_URL=https://yourdomain.com
NODE_ENV=production
```

## Success Criteria
- [ ] All pages render correctly as static HTML
- [ ] Blog posts load and render markdown properly
- [ ] SEO meta tags present on all pages
- [ ] Sitemap generates correctly with proper priorities
- [ ] Google Analytics tracking works
- [ ] Site loads in < 2 seconds on 3G
- [ ] Lighthouse scores: 90+ across all metrics
- [ ] Mobile responsive on all devices
- [ ] Valid HTML and accessibility standards met

## Reference Examples
- Next.js Blog Starter: https://github.com/vercel/next.js/tree/canary/examples/blog-starter
- Personal Site Reference: https://github.com/jxman/nextjs-personal-site (synepho.com)
- Bryan's GitHub: https://github.com/balorette
- Bryan's LinkedIn: https://www.linkedin.com/in/blorette/

## Notes for Claude Code
- Always use TypeScript with proper typing
- Prioritize static generation over client-side rendering
- Test build output before considering a feature complete
- Follow Next.js 14+ App Router conventions
- Keep components small and focused
- Maintain the minimal dark aesthetic with VSCode/terminal theming
- Ensure easy content maintenance (markdown/JSON only)
- Balance professional credibility with authentic personality
- Document any AWS-specific configuration decisions
- Focus on visual portfolios with code + narrative storytelling