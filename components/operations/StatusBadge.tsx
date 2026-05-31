type Status = "active" | "suspended" | "unverified" | "verified" | "inactive" | string;

interface StatusBadgeProps {
  status: Status;
  size?: "sm" | "md" | "lg";
}

const STATUS_MAP: Record<string, { cls: string; label: string }> = {
  active:     { cls: "bg-green-100 text-green-700 border-green-200",    label: "Active"     },
  verified:   { cls: "bg-green-100 text-green-700 border-green-200",    label: "Verified"   },
  suspended:  { cls: "bg-red-100 text-red-700 border-red-200",          label: "Suspended"  },
  inactive:   { cls: "bg-gray-100 text-gray-600 border-gray-200",       label: "Inactive"   },
  unverified: { cls: "bg-yellow-100 text-yellow-700 border-yellow-200", label: "Unverified" },
  pending:    { cls: "bg-orange-100 text-orange-700 border-orange-200", label: "Pending"    },
  deleted:    { cls: "bg-gray-200 text-gray-500 border-gray-300",       label: "Deleted"    },
};

const SIZE_MAP = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-xs",
  lg: "px-3 py-1.5 text-sm",
};

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const key    = (status ?? "").toLowerCase();
  const config = STATUS_MAP[key] ?? { cls: "bg-gray-100 text-gray-600 border-gray-200", label: status };

  return (
    <span className={`inline-flex items-center font-semibold rounded-full border whitespace-nowrap ${SIZE_MAP[size]} ${config.cls}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70" />
      {config.label}
    </span>
  );
}
