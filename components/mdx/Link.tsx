export function Link({ href, children }: { href?: string; children: React.ReactNode }) {
  const isExternal = href?.startsWith('http');

  return (
    <a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className="font-mono text-accent-primary hover:text-accent-secondary no-underline hover:underline transition-colors duration-200"
    >
      {children}
    </a>
  );
}
