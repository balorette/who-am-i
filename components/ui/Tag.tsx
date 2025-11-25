interface TagProps {
  children: string;
  variant?: 'default' | 'accent';
}

export default function Tag({ children, variant = 'default' }: TagProps) {
  const styles = {
    default: 'bg-background-tertiary text-text-secondary border-border',
    accent: 'bg-accent-primary/10 text-accent-primary border-accent-primary/30',
  };

  return (
    <span
      className={`inline-block px-3 py-1 text-xs font-mono uppercase tracking-wider border rounded-full ${styles[variant]}`}
    >
      {children}
    </span>
  );
}
