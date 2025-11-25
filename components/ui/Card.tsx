import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  animatedBorder?: boolean;
}

export default function Card({
  children,
  className = '',
  hover = true,
  animatedBorder = false
}: CardProps) {
  const hoverStyles = hover
    ? 'transition-all duration-300 ease-out hover:border-accent-primary hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(78,201,176,0.15)] hover:scale-[1.01]'
    : '';

  return (
    <div
      className={`group relative p-6 rounded-lg border border-border bg-background-tertiary ${hoverStyles} ${className}`}
    >
      {animatedBorder && (
        <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity border-2 border-accent-primary/20 animate-pulse-border pointer-events-none" />
      )}
      {children}
    </div>
  );
}
