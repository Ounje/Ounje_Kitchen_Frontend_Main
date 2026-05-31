'use client';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import type { RevenueDistributionPoint } from '@/lib/api/services/finance.service';

interface Props {
  data: RevenueDistributionPoint[];
}

function formatY(v: number) {
  if (v >= 1000) return `${v / 1000}k`;
  return String(v);
}

export function RevenueDistributionChart({ data }: Props) {
  return (
    <div className="bg-white rounded-xl p-4 sm:p-5 w-full">
      <h3 className="text-sm font-bold mb-3" className="text-[#1a3f1c]">Revenue Distribution</h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }} barSize={40}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={formatY}
            tick={{ fontSize: 11, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value: any, name: any) => [`₦${value.toLocaleString()}`, name]}
            contentStyle={{
              backgroundColor: '#fff',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              fontSize: '12px',
            }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}