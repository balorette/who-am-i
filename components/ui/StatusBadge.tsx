interface StatusBadgeProps {
  status: 'completed' | 'in-progress' | 'paused' | 'archived';
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    completed: 'bg-accent-success/10 text-accent-success border-accent-success/30',
    'in-progress': 'bg-accent-secondary/10 text-accent-secondary border-accent-secondary/30',
    paused: 'bg-accent-warning/10 text-accent-warning border-accent-warning/30',
    archived: 'bg-text-secondary/10 text-text-secondary border-text-secondary/30',
  };

  const labels = {
    completed: 'Completed',
    'in-progress': 'In Progress',
    paused: 'Paused',
    archived: 'Archived',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium border rounded-full ${styles[status]}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
      {labels[status]}
    </span>
  );
}
