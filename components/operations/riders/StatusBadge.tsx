// app/operations/riders/components/StatusBadge.tsx
interface AccountStatusBadgeProps {
  status: 'active' | 'suspended';
  size?: 'sm' | 'md' | 'lg';
}

export function AccountStatusBadge({ status, size = 'sm' }: AccountStatusBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-6 py-3 text-base font-medium'
  };

  const statusConfig = {
    active: {
      bg: '#37A449',
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
      className={`inline-block rounded ${sizeClasses[size]}`}
      style={{
        backgroundColor: config.bg,
        color: config.text
      }}
    >
      {config.label}
    </span>
  );
}

interface RiderStatusBadgeProps {
  status: 'free' | 'busy' | 'verified';
  size?: 'sm' | 'md' | 'lg';
}

export function RiderStatusBadge({ status, size = 'sm' }: RiderStatusBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-6 py-3 text-base font-medium'
  };

  const statusConfig = {
    free: {
      bg: '#37A449',
      text: 'white',
      label: 'Free'
    },
    busy: {
      bg: '#FFCA3A',
      text: '#1A3F1C',
      label: 'Busy'
    },
    verified: {
      bg: '#1A3F1C',
      text: 'white',
      label: 'Verified'
    }
  };

  const config = statusConfig[status];

  return (
    <span
      className={`inline-block rounded ${sizeClasses[size]}`}
      style={{
        backgroundColor: config.bg,
        color: config.text
      }}
    >
      {config.label}
    </span>
  );
}