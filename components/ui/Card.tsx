import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = '', hover = true }: CardProps) {
  return (
    <div className={`card ${hover ? '' : 'hover:scale-100'} ${className}`}>
      {children}
    </div>
  );
}
