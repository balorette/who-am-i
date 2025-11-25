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
    'inline-flex items-center gap-2 px-4 py-2 font-mono text-sm rounded transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-background-primary';

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
