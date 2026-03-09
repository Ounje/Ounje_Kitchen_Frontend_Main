interface StatusBadgeProps {
  status: 'active' | 'suspended' | 'unverified';
  size?: 'sm' | 'md' | 'lg';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-5 py-2 text-sm sm:text-base font-medium',
  };

  const statusConfig = {
    active: { bg: '#37A449', text: 'white', label: 'Active' },
    suspended: { bg: '#D00000', text: 'white', label: 'Suspended' },
    unverified: { bg: '#F9C846', text: '#1A3F1C', label: 'Unverified' },
  };

  const config = statusConfig[status];

  return (
    <span
      className={`inline-block rounded-lg whitespace-nowrap ${sizeClasses[size]}`}
      style={{ backgroundColor: config.bg, color: config.text }}
    >
      {config.label}
    </span>
  );
}