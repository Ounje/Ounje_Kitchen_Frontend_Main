import { BarChart2, TrendingUp } from "lucide-react";

interface StatsCardProps {
  icon?: React.ReactNode;
  value: number | string;
  label: string;
  subtitle?: string;
  change?: number; // percentage
  formatValue?: (v: number | string) => string;
}

function formatK(val: number | string) {
  const n = Number(val);
  if (n >= 1000) return n.toLocaleString();
  return String(val);
}

export function StatsCard({ icon, value, label, subtitle, change }: StatsCardProps) {
  return (
    <div className="rounded-xl p-4 sm:p-5 flex flex-col gap-2 relative overflow-hidden bg-[#98ef9b] dark:bg-primary/20">
      {/* Trend icon top right */}
      <div className="absolute top-3 right-3 text-[#1A3F1C] dark:text-primary opacity-60">
        <BarChart2 className="w-5 h-5" />
      </div>

      {/* Icon + value */}
      <div className="flex items-center gap-2">
        {icon && <span className="text-2xl">{icon}</span>}
        <span className="text-3xl sm:text-4xl font-bold text-[#1A3F1C] dark:text-primary">
          {formatK(value)}
        </span>
      </div>

      {/* Label */}
      <p className="text-sm font-semibold text-[#1A3F1C] dark:text-primary/80">{label}</p>

      {/* Subtitle / change */}
      <div className="flex items-center justify-between">
        {subtitle && <p className="text-xs text-[#1A3F1C] dark:text-primary/70">{subtitle}</p>}
        {change !== undefined && (
          <span className="text-xs font-semibold flex items-center gap-0.5 ml-auto text-[#1A3F1C] dark:text-primary">
            <TrendingUp className="w-3 h-3" />+{change}%
          </span>
        )}
      </div>
    </div>
  );
}
