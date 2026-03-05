// app/operations/vendors/components/StatusBadge.tsx
interface StatusBadgeProps {
  status: 'active' | 'suspended';
  size?: 'sm' | 'md' | 'lg';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-6 py-2.5 text-base font-medium'
  };

  const statusConfig = {
    active: {
      bg: '#1A3F1C',
      text: 'white',
      label: 'Active'
    },
    suspended: {
      bg: '#D00000',
      text: 'white',
      label: 'Suspended'
    }
  };

  const config = statusConfig[status];

  return (
    <span
      className={`inline-block rounded-lg ${sizeClasses[size]}`}
      style={{
        backgroundColor: config.bg,
        color: config.text
      }}
    >
      {config.label}
    </span>
  );
}