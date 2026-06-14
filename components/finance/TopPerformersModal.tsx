"use client";

import { X, Star } from "lucide-react";
import type { TopVendor, TopRider, RevenuePeriod } from "@/lib/api/services/finance.service";

// ── Shared header ──────────────────────────────────────────────────────────────
interface ModalHeaderProps {
  title: string;
  subtitle: string;
  period: RevenuePeriod;
  onPeriodChange: (p: RevenuePeriod) => void;
  onClose: () => void;
}

function ModalHeader({ title, subtitle, period, onPeriodChange, onClose }: ModalHeaderProps) {
  return (
    <div className="px-6 pt-6 pb-4">
      <div className="flex items-start justify-between mb-1">
        <div>
          <h2 className="text-xl font-bold text-[#1a3f1c]">{title}</h2>
          <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2 ml-4">
          {/* Period selector */}
          <div className="relative">
            <select
              value={period}
              onChange={(e) => onPeriodChange(e.target.value as RevenuePeriod)}
              className="appearance-none flex items-center gap-2 px-3 py-1.5 rounded-lg text-white text-sm font-semibold pr-7 cursor-pointer bg-[#1a3f1c]"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-white pointer-events-none text-xs">
              ▾
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Top Vendors Modal ─────────────────────────────────────────────────────────
interface TopVendorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendors: TopVendor[];
  period: RevenuePeriod;
  onPeriodChange: (p: RevenuePeriod) => void;
  loading?: boolean;
}

const thCls = "px-4 py-3 text-left text-sm font-semibold whitespace-nowrap";

export function TopVendorsModal({
  isOpen,
  onClose,
  vendors,
  period,
  onPeriodChange,
  loading,
}: TopVendorsModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-2xl bg-gray-50">
        <ModalHeader
          title="Top 5 Vendors"
          subtitle="Vendors generating the highest orders and revenue on the platform."
          period={period}
          onPeriodChange={onPeriodChange}
          onClose={onClose}
        />

        <div className="overflow-x-auto px-4 pb-6">
          <table className="w-full min-w-[540px] rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Vendor Name", "Orders", "Revenue", "Commission", "AOV"].map((h) => (
                  <th key={h} className={`${thCls} text-[#1a3f1c]`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white">
              {loading
                ? [...Array(5)].map((_, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      {[...Array(5)].map((_, j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
                        </td>
                      ))}
                    </tr>
                  ))
                : vendors.map((v, i) => (
                    <tr
                      key={v.id}
                      className={`border-b border-gray-100 hover:bg-gray-50 ${i === 0 ? "border-t-0" : ""}`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-200 flex-shrink-0">
                            {v.photo ? (
                              <img
                                src={v.photo}
                                alt={v.name}
                                className="w-full h-full object-cover"
                              />
                            ) : null}
                          </div>
                          <span className="text-sm font-medium text-[#1a3f1c]">{v.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#1a3f1c]">{v.orders}</td>
                      <td className="px-4 py-3 text-sm text-[#1a3f1c]">
                        ₦{v.revenue.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#1a3f1c]">
                        ₦{v.commission.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#1a3f1c]">
                        ₦{v.aov.toLocaleString()}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Top Riders Modal ──────────────────────────────────────────────────────────
interface TopRidersModalProps {
  isOpen: boolean;
  onClose: () => void;
  riders: TopRider[];
  period: RevenuePeriod;
  onPeriodChange: (p: RevenuePeriod) => void;
  loading?: boolean;
}

export function TopRidersModal({
  isOpen,
  onClose,
  riders,
  period,
  onPeriodChange,
  loading,
}: TopRidersModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-2xl bg-gray-50">
        <ModalHeader
          title="Top 5 Riders"
          subtitle="Riders completing the most deliveries with strong performance."
          period={period}
          onPeriodChange={onPeriodChange}
          onClose={onClose}
        />

        <div className="overflow-x-auto px-4 pb-6">
          <table className="w-full min-w-[520px] rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Rider Name", "Deliveries", "Earnings", "Completion", "Rating"].map((h) => (
                  <th key={h} className={`${thCls} text-[#1a3f1c]`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white">
              {loading
                ? [...Array(5)].map((_, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      {[...Array(5)].map((_, j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
                        </td>
                      ))}
                    </tr>
                  ))
                : riders.map((r, i) => (
                    <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-200 flex-shrink-0">
                            {r.photo ? (
                              <img
                                src={r.photo}
                                alt={r.name}
                                className="w-full h-full object-cover"
                              />
                            ) : null}
                          </div>
                          <span className="text-sm font-medium text-[#1a3f1c]">{r.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#1a3f1c]">{r.deliveries}</td>
                      <td className="px-4 py-3 text-sm text-[#1a3f1c]">
                        ₦{r.earnings.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#1a3f1c]">{r.completion}%</td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1 text-sm text-[#1a3f1c]">
                          <Star className="w-4 h-4 fill-[#FFCA3A] stroke-[#FFCA3A]" />
                          {r.rating.toFixed(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
