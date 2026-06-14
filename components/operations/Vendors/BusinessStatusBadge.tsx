interface BusinessStatusBadgeProps {
  status: "registered" | "unregistered" | "pending";
}

export function BusinessStatusBadge({ status }: BusinessStatusBadgeProps) {
  const cfg = {
    registered: { bg: "#1A3F1C", text: "white", label: "Registered" },
    unregistered: { bg: "#E5E7EB", text: "#374151", label: "Unregistered" },
    pending: { bg: "#FFCA3A", text: "#1A3F1C", label: "Pending" },
  }[status];
  return (
    <span
      className="inline-block px-2 py-1 rounded text-xs font-semibold whitespace-nowrap"
      style={{ backgroundColor: cfg.bg, color: cfg.text }}
    >
      {cfg.label}
    </span>
  );
}
