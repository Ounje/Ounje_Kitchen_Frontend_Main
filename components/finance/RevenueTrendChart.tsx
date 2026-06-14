"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import type { RevenueTrendPoint } from "@/lib/api/services/finance.service";

interface Props {
  data: RevenueTrendPoint[];
}

const LINES = [
  { key: "gross", color: "#1A3F1C", label: "Gross" },
  { key: "vendor", color: "#FFCA3A", label: "Vendor" },
  { key: "rider", color: "#D00000", label: "Rider" },
  { key: "net", color: "#37A449", label: "Net" },
] as const;

function formatY(v: number) {
  if (v >= 1000) return `${v / 1000}k`;
  return String(v);
}

export function RevenueTrendChart({ data }: Props) {
  return (
    <div className="bg-white rounded-xl p-4 sm:p-5 w-full">
      <h3 className="text-sm font-bold mb-3 text-[#1a3f1c]">Revenue Trend</h3>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={formatY}
            tick={{ fontSize: 11, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value: any, name: any) => [
              `₦${value.toLocaleString()}`,
              name.charAt(0).toUpperCase() + name.slice(1),
            ]}
            contentStyle={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              fontSize: "12px",
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: 12 }}
            formatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
          />
          {LINES.map(({ key, color, label }) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              name={label}
              stroke={color}
              strokeWidth={2}
              dot={{ r: 4, fill: color, strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
