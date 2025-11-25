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
