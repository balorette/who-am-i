export function H1({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="text-5xl font-bold tracking-tight text-text-primary mb-6 scroll-mt-20">
      {children}
    </h1>
  );
}

export function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-3xl font-bold tracking-tight text-text-primary mt-12 mb-4 scroll-mt-20">
      {children}
    </h2>
  );
}

export function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-2xl font-semibold text-text-primary mt-8 mb-3 scroll-mt-20">
      {children}
    </h3>
  );
}

export function H4({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-xl font-semibold text-text-primary mt-6 mb-2 scroll-mt-20">
      {children}
    </h4>
  );
}
