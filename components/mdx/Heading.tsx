export function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl font-bold text-text-primary mt-8 mb-4 scroll-mt-20">
      {children}
    </h2>
  );
}

export function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3 scroll-mt-20">
      {children}
    </h3>
  );
}
