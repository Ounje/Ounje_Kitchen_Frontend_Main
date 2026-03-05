// app/operations/vendors/components/BusinessStatusBadge.tsx
interface BusinessStatusBadgeProps {
  status: 'registered' | 'unregistered' | 'pending';
  size?: 'sm' | 'md';
}

export function BusinessStatusBadge({ status, size = 'sm' }: BusinessStatusBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm'
  };

  const statusConfig = {
    registered: {
      bg: '#37A449',
      text: 'white',
      label: 'Registered'
    },
    unregistered: {
      bg: '#D00000',
      text: 'white',
      label: 'Unregistered'
    },
    pending: {
      bg: '#FFCA3A',
      text: '#1A3F1C',
      label: 'Pending'
    }
  };

  const config = statusConfig[status];

  return (
    <span
      className={`inline-block rounded ${sizeClasses[size]} font-medium`}
      style={{
        backgroundColor: config.bg,
        color: config.text
      }}
    >
      {config.label}
    </span>
  );
}