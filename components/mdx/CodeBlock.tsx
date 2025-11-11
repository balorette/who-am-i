interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
}

export function CodeBlock({ children, className }: CodeBlockProps) {
  return (
    <pre className="bg-background-tertiary border border-border rounded-lg p-4 overflow-x-auto my-4">
      <code className={className}>{children}</code>
    </pre>
  );
}
