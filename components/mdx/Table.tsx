export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto my-6">
      <table className="min-w-full border border-border">
        {children}
      </table>
    </div>
  );
}

export function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="bg-background-secondary text-text-primary font-semibold px-4 py-2 border border-border text-left">
      {children}
    </th>
  );
}

export function Td({ children }: { children: React.ReactNode }) {
  return (
    <td className="px-4 py-2 border border-border text-text-secondary">
      {children}
    </td>
  );
}
