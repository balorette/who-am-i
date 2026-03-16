# Bryan Lorette - Personal Static Site

## Project Overview
Build a modern, minimal dark-themed personal website that showcases Bryan's evolution from networking and infrastructure to devlopment, cloud-native and AI technologies. The site demonstrates continuous growth and learning through projects, experiments, and insights—balancing professional expertise with authentic personality. Built as a static site using Next.js with App Router for easy maintenance and deployed to AWS S3/CloudFront.

## Brand Identity
**Narrative:** From hardware to agents, I am a builder of systems. I grew up building computers and troubleshooting networks before "the cloud" had a name. My career has been a vertical climb up the stack: from physical networking and server rooms to Kubernetes and Internal Developer Platforms. I have built and architected enterprise-grade cloud platforms. Today, as a Tech Lead in AI, I use that foundational knowledge to demystify the 'magic' of the industry. I look at AI through the lens of architecture, governance, and root-cause reality. I write for the builders who care about how things actually work under the hood.

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

