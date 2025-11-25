# Visual Polish & UX Enhancement Design

**Date:** 2025-01-24
**Author:** Bryan Lorette with Claude Code
**Status:** Design Complete, Ready for Implementation

---

## Overview

This design document outlines a comprehensive visual polish and UX enhancement strategy for the Aftermarket Code personal portfolio site. The approach uses progressive enhancement to improve typography, readability, and interactive elements while maintaining the site's technical aesthetic and static-first architecture.

---

## Design Goals

1. **Enhanced Readability** - Make content inviting and comfortable to read through improved typography and spacing
2. **Professional + Playful Balance** - Reflect brand personality (50/50 professional/playful) through typography choices
3. **Technical Sophistication** - Leverage terminal/developer aesthetic with subtle, refined execution
4. **Interactive Polish** - Create engaging card and CTA interactions without sacrificing performance
5. **Static-First** - Maintain compatibility with Next.js static export and minimize bundle size

---

## Approach: Progressive Enhancement

**Phase 1: Typography & Readability Foundation**
- Establish typography system with monospace accents
- Implement spacing scale and visual hierarchy
- Create optimal reading experience

**Phase 2: Card Interactive Polish**
- Add terminal-style hover effects
- Implement subtle lift and glow
- Enhance project/blog card engagement

**Phase 3: CTA Refinement**
- Polish button and link interactions
- Fast, snappy feedback
- Maintain technical aesthetic

---

## Phase 1: Typography & Readability Foundation

### Typography System

**Font Stack:**
- **Body/Headings:** Inter (already in use)
- **Monospace:** JetBrains Mono (already in use)

**Monospace Usage Strategy:**

**Mixed into body content:**
- All inline links in prose
- Technical terms and code references
- Tech-related emphasis

**Accent elements:**
- Technology tags
- Dates and timestamps
- Status badges ("in-progress", "completed")
- Metadata labels

**Sans-serif for:**
- All headings (H1-H6)
- Body paragraphs
- Card titles and excerpts
- Navigation

### Typography Scale

```
H1: text-5xl (48px)
    font-bold, tracking-tight
    mb-6 (24px bottom margin)

H2: text-3xl (30px)
    font-bold, tracking-tight
    mt-12 mb-4 (large top, medium bottom)

H3: text-2xl (24px)
    font-semibold
    mt-8 mb-3

H4: text-xl (20px)
    font-semibold
    mt-6 mb-2

Body: text-base (16px)
      leading-7 (28px line height = 1.75)

Large: text-lg (18px) - Excerpts, intros
       leading-8 (32px line height)

Small: text-sm (14px) - Metadata, captions
       leading-6 (24px line height)
```

**Monospace Variants:**
```
Inline code/links: font-mono text-base
                   text-accent-primary (cyan)

Tags/badges: font-mono text-xs (12px)
             uppercase tracking-wider

Metadata: font-mono text-sm
          text-text-secondary (muted)
```

### Spacing System

**Vertical Rhythm:**
```
Between major sections: space-y-16 (64px)
Between related content: space-y-8 (32px)
Between tightly related: space-y-4 (16px)
Within components: space-y-2 (8px)
```

**Horizontal Spacing:**
```
Blog posts: max-w-2xl (672px) - optimal line length
Projects: max-w-3xl (768px) - technical content
Homepage: max-w-6xl (1152px) - card grids

Side padding: px-6 (mobile), px-8 (tablet+)
Card padding: p-6 (24px internal)
Grid gaps: gap-8 (32px between cards)
```

### Implementation Files

**1. Tailwind Config (`tailwind.config.js`)**
- Confirm font family variables
- Extend theme if needed (colors already defined)

**2. Global Styles (`app/globals.css`)**
```css
.prose {
  @apply text-base leading-7 max-w-2xl;
}

.prose a {
  @apply font-mono text-accent-primary no-underline hover:underline;
}

.prose code {
  @apply font-mono text-sm;
}

.prose h2 {
  @apply mt-12 mb-4;
}
```

**3. MDX Components (`components/mdx/`)**
- Update `Heading.tsx` - Apply size/spacing
- Update `Link.tsx` - Monospace styling
- Keep `CodeBlock.tsx` as-is

**4. UI Components (`components/ui/`)**
- `Tag.tsx` - Add `font-mono text-xs uppercase tracking-wider`
- `StatusBadge.tsx` - Add `font-mono text-xs`
- `Card.tsx` - Update to `p-6 space-y-4`

**5. Content Pages**
- Blog posts: `max-w-2xl mx-auto px-6`
- Projects: `max-w-3xl mx-auto px-6`
- Homepage: `max-w-6xl mx-auto px-8`

---

## Phase 2: Card Interactive Polish

### Design Goal

Create hover states that feel technical and precise (terminal aesthetic) but executed with subtle sophistication.

### Card Hover Effects

**Base State:**
- Dark background (#2d2d30)
- Subtle border (1px, #3e3e42)
- No shadow, flat

**Hover State:**
1. **Border Glow** - Border color → accent cyan (#4ec9b0)
2. **Lift** - `translateY(-4px)`
3. **Shadow** - `0 8px 24px rgba(78, 201, 176, 0.15)` (cyan tint)
4. **Scale** - `scale(1.01)` (subtle)
5. **Duration** - 300ms ease-out

**Optional Enhancements:**
- Animated border overlay with pulse
- Image zoom inside card (`scale(1.05)`)
- Metadata fade-in

### Implementation Approaches

**Option 1: Pure CSS + Tailwind (Start Here)**
```tsx
<div className="group relative p-6 rounded-lg border border-border
                bg-background-tertiary
                transition-all duration-300 ease-out
                hover:border-accent-primary
                hover:-translate-y-1
                hover:shadow-[0_8px_24px_rgba(78,201,176,0.15)]">

  <div className="absolute inset-0 rounded-lg opacity-0
                  group-hover:opacity-100 transition-opacity
                  border-2 border-accent-primary/20
                  animate-pulse-border" />

  {/* Card content */}
</div>
```

**Option 2: Framer Motion (If CSS Limitations)**
```tsx
<motion.div
  whileHover={{
    y: -4,
    scale: 1.01,
    borderColor: "rgb(78, 201, 176)",
    boxShadow: "0 8px 24px rgba(78, 201, 176, 0.15)",
  }}
  transition={{ duration: 0.3, ease: "easeOut" }}
>
```

### Files to Update

- `components/ui/Card.tsx` - Add hover states
- `components/content/ProjectCard.tsx` - Apply to project cards
- `components/content/BlogCard.tsx` - Apply to blog cards
- Custom animations in `globals.css` if needed

---

## Phase 3: CTA Polish

### Design Goal

CTAs feel snappy and immediate while maintaining technical aesthetic. Faster than cards (100-150ms), more direct feedback.

### Primary CTAs (GitHub, Live Demo)

**Base State:**
- Outlined border style
- Monospace font
- Accent color border (#4ec9b0)
- Transparent background

**Hover State (150ms):**
- Background fills with accent color
- Text inverts to dark
- Subtle border glow
- No scale or lift

**Implementation:**
```tsx
<a className="inline-flex items-center gap-2 px-4 py-2
               font-mono text-sm
               border-2 border-accent-primary
               text-accent-primary
               rounded
               transition-all duration-150
               hover:bg-accent-primary
               hover:text-background-primary
               hover:shadow-[0_0_12px_rgba(78,201,176,0.4)]">
  View on GitHub
</a>
```

### Secondary CTAs (Read More, Links)

**Base State:**
- Inline link style
- Monospace font
- Accent color text
- No underline

**Hover State (100ms):**
- Underline appears
- Arrow/icon shifts right 2px

**Implementation:**
```tsx
<a className="inline-flex items-center gap-1
               font-mono text-accent-primary
               no-underline hover:underline
               transition-all duration-100
               group">
  Read more
  <span className="transition-transform duration-100
                   group-hover:translate-x-0.5">→</span>
</a>
```

### Icon Links (Social Icons)

- Scale 1.1 on hover
- Color shift to accent
- 150ms transition
- Minimal, acknowledgment only

### Files to Update

- `components/ui/Button.tsx` - Primary CTA styles
- `components/ui/Link.tsx` - Secondary link styles
- `components/layout/Footer.tsx` - Icon link hover states
- Card CTAs inline

---

## Technical Stack & Dependencies

### Confirmed Dependencies
- ✅ Tailwind CSS (core styling)
- ✅ @tailwindcss/typography (markdown)
- ✅ Next.js static export
- ✅ React Icons

### Optional Dependencies (Add If Needed)

**Framer Motion** (60KB minified)
- Use if: CSS animations hit limitations
- Best for: Complex hover states, layout animations
- When: Phase 2/3 if CSS proves insufficient

**shadcn/ui** (Radix UI + Tailwind components)
- Use if: Want accessible base components
- Best for: Long-term maintainability
- When: Future enhancement, not Phase 1-3

### Approach
- **Start:** Pure CSS + Tailwind animations
- **Upgrade:** Add Framer Motion only if needed
- **Philosophy:** Keep bundle light for static site

---

## Success Criteria

**Phase 1 Complete When:**
- [ ] Monospace applied to links, tags, dates, badges
- [ ] Heading hierarchy clear and scannable
- [ ] Blog posts have optimal line length (60-75 chars)
- [ ] Spacing feels generous and rhythmic
- [ ] Typography reflects professional/playful balance

**Phase 2 Complete When:**
- [ ] Cards have subtle hover lift (4px)
- [ ] Border glows with cyan accent on hover
- [ ] Transitions smooth at 300ms
- [ ] Terminal aesthetic evident but refined
- [ ] Hover states work across all card types

**Phase 3 Complete When:**
- [ ] Primary CTAs fill on hover (150ms)
- [ ] Secondary links underline on hover (100ms)
- [ ] Arrow icons shift on hover
- [ ] All interactions snappy and immediate
- [ ] Consistent accent colors throughout

**Overall Success:**
- [ ] Site feels more polished and intentional
- [ ] Content inviting and comfortable to read
- [ ] Interactive elements engaging without distraction
- [ ] Technical personality evident
- [ ] Static build size remains reasonable (<100KB added)
- [ ] All pages render correctly
- [ ] Mobile responsive maintained

---

## Implementation Sequence

1. **Phase 1: Foundation** (Highest Priority)
   - Update global styles and Tailwind config
   - Update UI components (tags, badges)
   - Update MDX components (links, headings)
   - Adjust page layouts (widths, spacing)
   - Test across all content types

2. **Phase 2: Card Polish** (Medium Priority)
   - Start with pure CSS hover states
   - Test on project and blog cards
   - Add Framer Motion if needed
   - Refine transitions and timing

3. **Phase 3: CTA Refinement** (Final Polish)
   - Update primary button components
   - Update inline link styles
   - Polish icon hover states
   - Final consistency pass

---

## Notes & Considerations

- **Static Export Friendly** - All effects work without JavaScript or with minimal client-side code
- **Performance First** - Start with CSS, add JS libraries only if truly needed
- **Mobile Responsive** - All hover effects should have touch equivalents
- **Accessibility** - Maintain focus states, keyboard navigation
- **Dark Theme Only** - Design optimized for dark background (#1e1e1e)
- **Future Enhancements** - shadcn/ui available as component library upgrade path

---

## Related Documents

- Implementation Plan: `2025-01-24-visual-polish-implementation.md` (to be created)
- Original Requirements: `/root/code/who-am-i/CLAUDE.md`
- Design System Reference: CLAUDE.md color palette section

---

## Changelog

- **2025-01-24** - Initial design document created after brainstorming session
