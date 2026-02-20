---
title: "TIL: Next.js Static Export with App Router"
date: "2025-01-12"
tags: ["Next.js", "Static Sites", "Web Development"]
category: "insight"
published: true
---

I don't hide the fact that I am not a frontend person and for me this has been a big win area for me when it comes to agentic coding. I have been using Claude to teach me (and yes, just build for me) a lot of frontend capabilities. I had a project in the past that looked Next.js for some backend work and it was my first stint back into the TypeScript. While I liked the familar feel and structure, I ended up going a different route. Here though, for a quick static page... It works really well. Next.js 14+ App Router supports static export with `output: 'export'` in next.config.js. This generates a fully static site that can be hosted on any static file server (S3, Netlify, Vercel, GitHub Pages, etc.).

Below is a quick call out to finding from my use case: This personal site. Content lives in markdown files, builds to static HTML, deployed to AWS S3 with CloudFront. Total hosting cost: ~$1/month for millions of page views.

## Key Configuration

```javascript
// next.config.js
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // Required for static export
  },
  trailingSlash: true, // Better for S3 hosting
};
```

## Important Considerations

**1. Image Optimization**
Must set `unoptimized: true` because static export can't run the image optimization API. For production, consider:
- Pre-optimizing images before build
- Using a CDN with image optimization (Cloudflare, imgix)
- Self-hosting next/image with a custom loader

**2. Dynamic Routes**
Need `generateStaticParams()` for dynamic routes:

```typescript
// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}
```

**3. API Routes Don't Work**
API routes require a Node.js server. For static sites:
- Use build-time data fetching instead
- External APIs called from client-side
- Serverless functions if needed 

**4. Server Components Still Work**
Server Components run at build time, generating static HTML. Perfect for:
- Fetching data from markdown files
- Reading databases during build
- Calling external APIs for static content

## Why
- **Cost-effective** - Static files are dirt cheap to host
- **Fast** - No server-side rendering delays
- **Secure** - No server to attack
- **Scalable** - CDNs handle infinite traffic
- **Simple** - Upload files, done

## Perfect For
- Personal blogs
- Documentation sites
- Marketing pages
- Portfolios
- Any content that changes infrequently

## Gotchas
- Can't use `revalidate` or ISR
- Can't use Middleware
- Can't use `headers()` or `cookies()` at runtime
- Dynamic content requires client-side fetching
