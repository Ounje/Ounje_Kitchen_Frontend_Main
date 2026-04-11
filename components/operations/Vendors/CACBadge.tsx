interface CACBadgeProps {
  isRegistered: boolean;
}

export function CACBadge({ isRegistered }: CACBadgeProps) {
  return (
    <span
      className="inline-block px-2.5 py-1 rounded text-xs font-semibold"
      style={{
        backgroundColor: isRegistered ? '#98EF9B' : '#FEE2E2',
        color:           isRegistered ? '#1A3F1C' : '#991B1B',
      }}
    >
      {isRegistered ? 'CAC Registered' : 'Not Registered'}
    </span>
  );
}