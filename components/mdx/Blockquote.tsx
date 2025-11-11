export function Blockquote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="border-l-4 border-accent-primary bg-background-secondary pl-4 py-2 my-4 italic text-text-secondary">
      {children}
    </blockquote>
  );
}
