interface StatusBadgeProps {
  status: 'active' | 'suspended';
  size?: 'sm' | 'md' | 'lg';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const sizeClasses = { sm: 'px-2 py-1 text-xs', md: 'px-3 py-1.5 text-sm', lg: 'px-5 py-2 text-sm font-medium' };
  const cfg = status === 'active'
    ? { bg: '#37A449', text: 'white', label: 'Active' }
    : { bg: '#D00000', text: 'white', label: 'Suspended' };
  return (
    <span className={`inline-block rounded-lg whitespace-nowrap font-semibold ${sizeClasses[size]}`}
      style={{ backgroundColor: cfg.bg, color: cfg.text }}>
      {cfg.label}
    </span>
  );
}