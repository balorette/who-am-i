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