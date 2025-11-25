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
