interface AccountStatusBadgeProps {
  status: 'active' | 'suspended';
  size?: 'sm' | 'md' | 'lg';
}

export function AccountStatusBadge({ status, size = 'sm' }: AccountStatusBadgeProps) {
  const sizeClasses = { sm: 'px-2 py-1 text-xs', md: 'px-3 py-1.5 text-sm', lg: 'px-5 py-2 text-sm sm:text-base font-medium' };
  const config = {
    active:    { bg: '#37A449', text: 'white',    label: 'Active' },
    suspended: { bg: '#D00000', text: 'white',    label: 'Suspended' },
  }[status];

  return (
    <span
      className={`inline-block rounded whitespace-nowrap ${sizeClasses[size]}`}
      style={{ backgroundColor: config.bg, color: config.text }}
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
  const sizeClasses = { sm: 'px-2 py-1 text-xs', md: 'px-3 py-1.5 text-sm', lg: 'px-5 py-2 text-sm sm:text-base font-medium' };
  const config = {
    free:     { bg: '#37A449', text: 'white',    label: 'Free' },
    busy:     { bg: '#FFCA3A', text: '#1A3F1C',  label: 'Busy' },
    verified: { bg: '#1A3F1C', text: 'white',    label: 'Verified' },
  }[status];

  return (
    <span
      className={`inline-block rounded whitespace-nowrap ${sizeClasses[size]}`}
      style={{ backgroundColor: config.bg, color: config.text }}
    >
      {config.label}
    </span>
  );
}