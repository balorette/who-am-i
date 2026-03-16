import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  animatedBorder?: boolean;
  coverImage?: string;
  coverAlt?: string;
}

export default function Card({
  children,
  className = '',
  hover = true,
  animatedBorder = false,
  coverImage,
  coverAlt = '',
}: CardProps) {
  const hoverStyles = hover
    ? 'transition-all duration-300 ease-out hover:border-accent-primary hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(78,201,176,0.15)] hover:scale-[1.01] focus-within:border-accent-primary focus-within:ring-2 focus-within:ring-accent-primary/50'
    : '';

  return (
    <div
      className={`group relative rounded-lg border border-border bg-background-tertiary overflow-hidden ${hoverStyles} ${className}`}
    >
      {animatedBorder && (
        <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity border-2 border-accent-primary/20 animate-pulse-border pointer-events-none" />
      )}
      {coverImage && (
        <div className="w-full h-40 overflow-hidden">
          <img
            src={coverImage}
            alt={coverAlt}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}
