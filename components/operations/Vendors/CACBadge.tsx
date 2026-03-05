// app/operations/vendors/components/CACBadge.tsx
interface CACBadgeProps {
  isRegistered: boolean;
  size?: 'sm' | 'md';
}

export function CACBadge({ isRegistered, size = 'md' }: CACBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm'
  };

  return (
    <span
      className={`inline-block rounded ${sizeClasses[size]} font-medium`}
      style={{
        backgroundColor: isRegistered ? '#37A449' : '#D00000',
        color: 'white'
      }}
    >
      {isRegistered ? 'Registered' : 'Not Registered'}
    </span>
  );
}