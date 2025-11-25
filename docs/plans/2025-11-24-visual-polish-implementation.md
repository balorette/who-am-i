# Visual Polish & UX Enhancement Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement typography system, spacing improvements, and interactive polish for cards and CTAs to create a professional yet playful visual experience.

**Architecture:** Progressive enhancement approach in 3 phases: (1) Typography & readability foundation using Tailwind utilities, (2) Card hover effects with CSS animations, (3) CTA polish with fast transitions. All changes maintain static export compatibility.

**Tech Stack:** Next.js 16, Tailwind CSS 4, TypeScript, React Server Components

---

## Progress Tracking

| Phase | Status | Tasks | Notes |
|-------|--------|-------|-------|
| Phase 1: Typography & Readability | ✅ Complete | 9/9 | Monospace links, heading hierarchy, optimal widths, generous spacing |
| Phase 2: Card Interactive Polish | ✅ Complete | 4/4 | Card hover effects with lift, glow, border |
| Phase 3: CTA Refinement | ⏳ Pending | 0/5 | Button component, link animations, icon hovers |
| Final Verification | ⏳ Pending | 0/4 | Cross-browser, accessibility, performance |

**Last Updated:** 2025-11-25

### Phase 2 Commits
```
d17a9f1 feat(ui): add terminal-style hover effects to Card component
e55149b feat(ui): add optional animated border overlay to Card
```

### Phase 1 Commits
```
2c5d334 feat(typography): add monospace font to prose links with hover underline
f1021ff feat(ui): add monospace uppercase styling to Tag component
43b51e4 feat(ui): add monospace font to StatusBadge component
a9a3a94 feat(mdx): update Link component with monospace and hover underline
6c72e01 feat(mdx): update heading scale for better visual hierarchy
ba136a9 feat(layout): optimize blog post width for readability
1c03338 feat(layout): optimize project page width for technical content
5247107 feat(layout): add generous spacing to homepage sections
ca47102 chore: verify Phase 1 typography and spacing across all pages
```

---

## Phase 1: Typography & Readability Foundation ✅

### Task 1: Update Global Styles for Typography

**Files:**
- Modify: `app/globals.css` (after line 50)

**Step 1: Add prose typography styles**

Add these styles after the existing `@keyframes` definitions:

```css
/* Prose Typography System */
.prose {
  @apply text-base leading-7 max-w-2xl;
}

.prose a {
  @apply font-mono text-accent-primary no-underline transition-colors duration-200;
}

.prose a:hover {
  @apply underline text-accent-secondary;
}

.prose code {
  @apply font-mono text-sm bg-background-secondary px-1.5 py-0.5 rounded;
}

.prose strong {
  @apply font-semibold text-text-primary;
}

/* Heading overrides for generous spacing */
.prose h1 {
  @apply text-5xl font-bold tracking-tight mb-6 mt-0;
}

.prose h2 {
  @apply text-3xl font-bold tracking-tight mt-12 mb-4;
}

.prose h3 {
  @apply text-2xl font-semibold mt-8 mb-3;
}

.prose h4 {
  @apply text-xl font-semibold mt-6 mb-2;
}

.prose p {
  @apply mb-4;
}

.prose ul, .prose ol {
  @apply my-6 space-y-2;
}

.prose li {
  @apply leading-7;
}
```

**Step 2: Verify styles compile**

Run: `npm run build`
Expected: Build succeeds without CSS errors

**Step 3: Commit typography styles**

```bash
git add app/globals.css
git commit -m "feat(typography): add prose typography system with monospace links"
```

---

### Task 2: Update Tag Component

**Files:**
- Modify: `components/ui/Tag.tsx:14`

**Step 1: Add monospace and uppercase styling**

Replace line 14:

```tsx
// OLD
className={`inline-block px-3 py-1 text-xs font-mono border rounded-full ${styles[variant]}`}

// NEW
className={`inline-block px-3 py-1 text-xs font-mono uppercase tracking-wider border rounded-full ${styles[variant]}`}
```

**Step 2: Test Tag rendering**

Run: `npm run dev` and visit any page with tags (e.g., /projects)
Expected: Tags display in monospace, uppercase with wider letter spacing

**Step 3: Commit Tag component update**

```bash
git add components/ui/Tag.tsx
git commit -m "feat(ui): add monospace uppercase styling to Tag component"
```

---

### Task 3: Update StatusBadge Component

**Files:**
- Modify: `components/ui/StatusBadge.tsx:22`

**Step 1: Add monospace to StatusBadge**

Replace line 22:

```tsx
// OLD
className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium border rounded-full ${styles[status]}`}

// NEW
className={`inline-flex items-center px-2.5 py-0.5 text-xs font-mono font-medium border rounded-full ${styles[status]}`}
```

**Step 2: Test StatusBadge rendering**

Run: `npm run dev` and visit any project page
Expected: Status badges display in monospace font

**Step 3: Commit StatusBadge update**

```bash
git add components/ui/StatusBadge.tsx
git commit -m "feat(ui): add monospace font to StatusBadge component"
```

---

### Task 4: Update MDX Link Component

**Files:**
- Modify: `components/mdx/Link.tsx:9`

**Step 1: Add monospace and remove default underline**

Replace line 9:

```tsx
// OLD
className="text-accent-primary hover:text-accent-secondary underline transition-colors"

// NEW
className="font-mono text-accent-primary hover:text-accent-secondary no-underline hover:underline transition-colors duration-200"
```

**Step 2: Test MDX links in blog posts**

Run: `npm run dev` and visit a blog post with links (e.g., /blog/infrastructure-to-ai)
Expected: Links display in monospace, underline appears only on hover

**Step 3: Commit MDX Link update**

```bash
git add components/mdx/Link.tsx
git commit -m "feat(mdx): update Link component with monospace and hover underline"
```

---

### Task 5: Update MDX Heading Components

**Files:**
- Modify: `components/mdx/Heading.tsx`

**Step 1: Update H2 component with new scale**

Replace H2 component (lines 1-7):

```tsx
export function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-3xl font-bold tracking-tight text-text-primary mt-12 mb-4 scroll-mt-20">
      {children}
    </h2>
  );
}
```

**Step 2: Update H3 component with new scale**

Replace H3 component (lines 9-15):

```tsx
export function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-2xl font-semibold text-text-primary mt-8 mb-3 scroll-mt-20">
      {children}
    </h3>
  );
}
```

**Step 3: Add H1 and H4 components**

Add before H2:

```tsx
export function H1({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="text-5xl font-bold tracking-tight text-text-primary mb-6 scroll-mt-20">
      {children}
    </h1>
  );
}
```

Add after H3:

```tsx
export function H4({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-xl font-semibold text-text-primary mt-6 mb-2 scroll-mt-20">
      {children}
    </h4>
  );
}
```

**Step 4: Test heading hierarchy in blog posts**

Run: `npm run dev` and visit blog posts
Expected: Headings have clear size distinction and generous spacing

**Step 5: Commit heading updates**

```bash
git add components/mdx/Heading.tsx
git commit -m "feat(mdx): update heading scale for better visual hierarchy"
```

---

### Task 6: Update Blog Post Layout Width

**Files:**
- Find and modify blog post layout pages (likely `app/blog/[slug]/page.tsx`)

**Step 1: Check current blog post layout**

Run: `cat app/blog/[slug]/page.tsx | grep "className"`
Expected: Find the container className

**Step 2: Update container width to optimal reading length**

Update the main content wrapper to:

```tsx
<article className="prose max-w-2xl mx-auto px-6 py-12">
  {/* content */}
</article>
```

**Step 3: Test blog post width**

Run: `npm run dev` and visit /blog/infrastructure-to-ai
Expected: Content width is approximately 672px, optimal for reading (60-75 characters per line)

**Step 4: Commit layout width update**

```bash
git add app/blog/[slug]/page.tsx
git commit -m "feat(layout): optimize blog post width for readability"
```

---

### Task 7: Update Project Layout Width

**Files:**
- Find and modify: `app/projects/[slug]/page.tsx`

**Step 1: Update project page container width**

Update the main content wrapper to:

```tsx
<article className="max-w-3xl mx-auto px-6 py-12">
  {/* content */}
</article>
```

**Step 2: Test project page width**

Run: `npm run dev` and visit /projects/agentic-contextualizer
Expected: Content width is approximately 768px, slightly wider than blog posts for technical content

**Step 3: Commit project layout update**

```bash
git add app/projects/[slug]/page.tsx
git commit -m "feat(layout): optimize project page width for technical content"
```

---

### Task 8: Update Homepage Spacing

**Files:**
- Modify: `app/page.tsx`

**Step 1: Add generous spacing between sections**

Update section wrappers to use `space-y-16` (64px vertical spacing):

```tsx
<div className="max-w-6xl mx-auto px-8 py-12 space-y-16">
  {/* sections */}
</div>
```

**Step 2: Update card grids with gap-8**

For any grid layout containing cards:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {/* cards */}
</div>
```

**Step 3: Test homepage spacing**

Run: `npm run dev` and visit homepage
Expected: Generous spacing between major sections (64px), cards have 32px gaps

**Step 4: Commit homepage spacing updates**

```bash
git add app/page.tsx
git commit -m "feat(layout): add generous spacing to homepage sections"
```

---

### Task 9: Verify Phase 1 Across All Pages

**Step 1: Build site and check for errors**

Run: `npm run build`
Expected: Build succeeds, all 21 pages generate

**Step 2: Visual inspection checklist**

Visit each page type and verify:
- [ ] `/` - Homepage: generous spacing, proper widths
- [ ] `/blog` - Blog list: card spacing correct
- [ ] `/blog/infrastructure-to-ai` - Blog post: monospace links, optimal width, heading hierarchy
- [ ] `/projects` - Project list: card spacing
- [ ] `/projects/agentic-contextualizer` - Project page: optimal width, monospace tags
- [ ] `/about` - About page: proper typography
- [ ] `/now` - Now page: proper typography

**Step 3: Commit verification checklist**

```bash
git add -A
git commit -m "chore: verify Phase 1 typography and spacing across all pages"
```

---

## Phase 2: Card Interactive Polish

### Task 10: Update Card Component Base Styles

**Files:**
- Modify: `components/ui/Card.tsx`

**Step 1: Replace Card component with new hover styles**

Replace entire file content:

```tsx
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = '', hover = true }: CardProps) {
  const hoverStyles = hover
    ? 'transition-all duration-300 ease-out hover:border-accent-primary hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(78,201,176,0.15)] hover:scale-[1.01]'
    : '';

  return (
    <div
      className={`p-6 rounded-lg border border-border bg-background-tertiary ${hoverStyles} ${className}`}
    >
      {children}
    </div>
  );
}
```

**Step 2: Test card hover on homepage**

Run: `npm run dev` and hover over cards on homepage
Expected: Cards lift 4px, border turns cyan, soft cyan glow appears, slight scale increase

**Step 3: Commit Card component update**

```bash
git add components/ui/Card.tsx
git commit -m "feat(ui): add terminal-style hover effects to Card component"
```

---

### Task 11: Add Optional Animated Border Overlay

**Files:**
- Modify: `components/ui/Card.tsx` (add variant support)
- Modify: `app/globals.css` (add border animation)

**Step 1: Add border pulse animation to globals.css**

Add after existing `@keyframes`:

```css
@keyframes pulse-border {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.6;
  }
}

.animate-pulse-border {
  animation: pulse-border 2s ease-in-out infinite;
}
```

**Step 2: Update Card component with animated overlay option**

Add new prop and overlay:

```tsx
interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  animatedBorder?: boolean; // NEW
}

export default function Card({
  children,
  className = '',
  hover = true,
  animatedBorder = false // NEW
}: CardProps) {
  const hoverStyles = hover
    ? 'transition-all duration-300 ease-out hover:border-accent-primary hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(78,201,176,0.15)] hover:scale-[1.01]'
    : '';

  return (
    <div
      className={`relative p-6 rounded-lg border border-border bg-background-tertiary ${hoverStyles} ${className}`}
    >
      {animatedBorder && (
        <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity border-2 border-accent-primary/20 animate-pulse-border pointer-events-none" />
      )}
      {children}
    </div>
  );
}
```

**Step 3: Test animated border (optional feature)**

This is optional - cards work well without it. To test:
- Add `animatedBorder={true}` to a featured card
- Expected: Subtle pulsing border overlay on hover

**Step 4: Commit animated border feature**

```bash
git add components/ui/Card.tsx app/globals.css
git commit -m "feat(ui): add optional animated border overlay to Card"
```

---

### Task 12: Apply Card Styles to Project Cards

**Files:**
- Check: `components/content/ProjectCard.tsx` (if exists)

**Step 1: Verify ProjectCard uses base Card component**

Run: `cat components/content/ProjectCard.tsx 2>/dev/null || echo "Check if using Card component"`

**Step 2: If ProjectCard exists, ensure it wraps content with Card component**

Example structure:

```tsx
import Card from '@/components/ui/Card';

export default function ProjectCard({ project }) {
  return (
    <Card hover={true}>
      {/* project content */}
    </Card>
  );
}
```

**Step 3: Test project cards on /projects page**

Run: `npm run dev` and visit /projects
Expected: Project cards have hover effects (lift, glow, border change)

**Step 4: Commit if changes made**

```bash
git add components/content/ProjectCard.tsx
git commit -m "feat(content): apply Card hover styles to ProjectCard"
```

---

### Task 13: Test and Refine Card Animations

**Step 1: Test card interactions across devices**

- Desktop: Hover should work smoothly
- Tablet: Touch should show active state
- Mobile: No hover states, but should look good

**Step 2: Adjust timing if needed**

If 300ms feels too slow or fast, adjust in `Card.tsx`:
- Faster: Change to `duration-200`
- Slower: Change to `duration-500`

**Step 3: Build and verify**

Run: `npm run build`
Expected: All pages build successfully with card styles

**Step 4: Commit refinements**

```bash
git add -A
git commit -m "refine: adjust card animation timing and responsive behavior"
```

---

## Phase 3: CTA Refinement

### Task 14: Create Button Component for Primary CTAs

**Files:**
- Create: `components/ui/Button.tsx`

**Step 1: Create Button component**

```tsx
import { ReactNode } from 'react';
import Link from 'next/link';

interface ButtonProps {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  external?: boolean;
}

export default function Button({
  href,
  onClick,
  children,
  variant = 'primary',
  external = false,
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center gap-2 px-4 py-2 font-mono text-sm rounded transition-all duration-150';

  const variants = {
    primary:
      'border-2 border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-background-primary hover:shadow-[0_0_12px_rgba(78,201,176,0.4)]',
    secondary:
      'border-2 border-text-secondary text-text-secondary hover:border-accent-secondary hover:text-accent-secondary',
  };

  const className = `${baseStyles} ${variants[variant]}`;

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
        >
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
}
```

**Step 2: Test Button component**

Create a test page or add to existing page:

```tsx
import Button from '@/components/ui/Button';

<Button href="https://github.com" external>
  View on GitHub
</Button>
```

Expected: Button is outlined, fills with cyan on hover (150ms transition)

**Step 3: Commit Button component**

```bash
git add components/ui/Button.tsx
git commit -m "feat(ui): create Button component with primary CTA styles"
```

---

### Task 15: Update MDX Link Component for Secondary CTAs

**Files:**
- Modify: `components/mdx/Link.tsx`

**Step 1: Update Link component with arrow animation**

Replace with enhanced version:

```tsx
export function Link({ href, children }: { href?: string; children: React.ReactNode }) {
  const isExternal = href?.startsWith('http');
  const showArrow = typeof children === 'string' &&
                    (children.toLowerCase().includes('read more') ||
                     children.toLowerCase().includes('learn more'));

  return (
    <a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className="group inline-flex items-center gap-1 font-mono text-accent-primary hover:text-accent-secondary no-underline hover:underline transition-all duration-100"
    >
      {children}
      {showArrow && (
        <span className="transition-transform duration-100 group-hover:translate-x-0.5">
          →
        </span>
      )}
    </a>
  );
}
```

**Step 2: Test secondary link hover**

Visit blog posts with "Read more" links
Expected: Arrow shifts right 2px on hover, fast 100ms transition

**Step 3: Commit Link component update**

```bash
git add components/mdx/Link.tsx
git commit -m "feat(mdx): add arrow animation to secondary CTA links"
```

---

### Task 16: Update Footer Icon Links

**Files:**
- Modify: `components/layout/Footer.tsx`

**Step 1: Find icon links in Footer**

Run: `cat components/layout/Footer.tsx | grep -A 5 "icon"`

**Step 2: Add hover styles to icon links**

Update icon link className to:

```tsx
className="text-text-secondary hover:text-accent-primary hover:scale-110 transition-all duration-150"
```

**Step 3: Test footer icon hovers**

Run: `npm run dev` and hover over footer icons
Expected: Icons scale to 110% and change color to cyan (150ms)

**Step 4: Commit footer icon updates**

```bash
git add components/layout/Footer.tsx
git commit -m "feat(layout): add hover effects to footer icon links"
```

---

### Task 17: Apply Button Component to Project Pages

**Files:**
- Modify project page templates that have GitHub/Live Demo links

**Step 1: Import Button component in project pages**

```tsx
import Button from '@/components/ui/Button';
```

**Step 2: Replace existing CTA links with Button component**

```tsx
<div className="flex gap-4">
  <Button href={project.githubUrl} external variant="primary">
    View on GitHub
  </Button>
  {project.liveUrl && (
    <Button href={project.liveUrl} external variant="primary">
      Live Demo
    </Button>
  )}
</div>
```

**Step 3: Test CTAs on project pages**

Visit /projects/agentic-contextualizer
Expected: GitHub and Live Demo buttons have outlined→filled hover effect

**Step 4: Commit CTA updates**

```bash
git add app/projects/[slug]/page.tsx
git commit -m "feat(projects): apply Button component to project CTAs"
```

---

### Task 18: Final Consistency Pass

**Step 1: Check all interactive elements for consistency**

Visit all page types and verify:
- [ ] Cards have 300ms hover with lift + glow
- [ ] Primary CTAs (buttons) have 150ms outlined→filled transition
- [ ] Secondary CTAs (text links) have 100ms underline + arrow shift
- [ ] Icon links have 150ms scale + color change
- [ ] All use accent-primary color (#4ec9b0)

**Step 2: Build and verify no errors**

Run: `npm run build`
Expected: All 21 pages build successfully

**Step 3: Check bundle size**

Run: `du -sh out/`
Expected: Size increase should be minimal (<10KB) since all CSS-based

**Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete Phase 3 CTA polish and consistency pass"
```

---

## Final Verification & Testing

### Task 19: Cross-Browser Testing

**Step 1: Test in multiple browsers**

- Chrome/Edge: All transitions smooth
- Firefox: Check border animations
- Safari: Verify hover states work

**Step 2: Test responsive behavior**

- Desktop (1920px): Cards in grids, proper spacing
- Tablet (768px): 2-column grids, touch states
- Mobile (375px): Single column, no hover states

**Step 3: Document any browser-specific issues**

Create a note if any browser needs special handling

---

### Task 20: Accessibility Check

**Step 1: Keyboard navigation test**

- Tab through all interactive elements
- Ensure focus states are visible
- Verify focus order is logical

**Step 2: Add focus styles if missing**

Add to any interactive elements without focus styles:

```tsx
className="... focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-background-primary"
```

**Step 3: Test with screen reader (optional)**

- Links should announce correctly
- Buttons should have clear labels
- Headings should provide structure

**Step 4: Commit accessibility improvements**

```bash
git add -A
git commit -m "a11y: improve keyboard navigation and focus states"
```

---

### Task 21: Performance Check

**Step 1: Run Lighthouse audit**

Run in Chrome DevTools:
- Performance: Should remain 90+
- Accessibility: Should remain 90+
- Best Practices: Should remain 90+
- SEO: Should remain 90+

**Step 2: Check bundle size impact**

Compare before/after:
- Pure CSS animations = minimal impact
- No new JS dependencies = no bundle increase

**Step 3: Verify static export still works**

Run: `ls out/ | wc -l`
Expected: 21+ files generated (all pages static)

---

### Task 22: Create Comparison Screenshots (Optional)

**Step 1: Take before/after screenshots**

- Homepage before/after
- Blog post before/after
- Project card hover before/after

**Step 2: Document visual improvements**

Add to `docs/` if desired for reference

---

## Success Criteria Verification

Run through this checklist to confirm all phases complete:

### Phase 1: Typography & Readability
- [ ] Monospace applied to links, tags, dates, badges
- [ ] Heading hierarchy clear (48px → 30px → 24px → 20px)
- [ ] Blog posts have optimal line length (~672px)
- [ ] Spacing feels generous (64px sections, 32px groups)
- [ ] Typography reflects professional/playful balance

### Phase 2: Card Interactive Polish
- [ ] Cards lift 4px on hover
- [ ] Border glows cyan (#4ec9b0) on hover
- [ ] Smooth 300ms transitions
- [ ] Terminal aesthetic evident but refined
- [ ] Works across all card types (project, blog, experiment)

### Phase 3: CTA Refinement
- [ ] Primary CTAs fill on hover (150ms)
- [ ] Secondary links underline with arrow shift (100ms)
- [ ] Icon links scale and change color (150ms)
- [ ] All interactions snappy and immediate
- [ ] Consistent accent colors throughout

### Technical
- [ ] Static build succeeds (`npm run build`)
- [ ] All 21 pages generate correctly
- [ ] Bundle size increase minimal (<10KB)
- [ ] No console errors or warnings
- [ ] Mobile responsive maintained
- [ ] Accessibility standards met

---

## Troubleshooting

### If hover effects don't work:
- Check if `group` class is on parent when using `group-hover:`
- Verify Tailwind compiled the utility classes
- Check browser DevTools for CSS being applied

### If transitions feel wrong:
- Adjust duration: `duration-200` (fast), `duration-300` (medium), `duration-500` (slow)
- Adjust easing: `ease-out` (default), `ease-in`, `ease-in-out`

### If colors don't match design:
- Verify CSS custom properties in `app/globals.css:4-16`
- Check Tailwind theme config picks up CSS vars
- Use browser DevTools to inspect computed colors

### If static build fails:
- Check for Client Components that need `'use client'`
- Verify no dynamic imports without proper config
- Check Next.js static export docs if needed

---

## Next Steps After Implementation

1. **User Testing** - Get feedback on visual polish and interactions
2. **Content Population** - Add more projects, experiments, blog posts with new styling
3. **Performance Optimization** - Run Lighthouse, optimize if needed
4. **Consider shadcn/ui** - If components need more features, migrate to shadcn/ui base
5. **Add Framer Motion** - If CSS animations hit limitations, add for complex effects
6. **Enhance Further** - Table of contents, code block improvements, more micro-interactions

---

## Estimated Time

- **Phase 1:** ~2-3 hours (9 tasks, mostly straightforward CSS updates)
- **Phase 2:** ~1-2 hours (4 tasks, CSS animations)
- **Phase 3:** ~1-2 hours (5 tasks, button and link components)
- **Testing:** ~1 hour (cross-browser, accessibility, verification)

**Total:** ~5-8 hours for complete implementation and testing

---

## Notes

- All changes maintain Next.js static export compatibility
- No new npm dependencies required (pure CSS + Tailwind)
- Changes are additive - can be rolled back task-by-task if needed
- Each task has a commit point for easy rollback
- Mobile-first responsive design maintained throughout
- Dark theme only - no light mode considerations needed
