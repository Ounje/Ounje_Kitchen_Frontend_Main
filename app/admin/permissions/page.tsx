"use client";

import { ShieldCheck } from "lucide-react";

interface Feature {
  area: string;
  capabilities: string;
}

interface RolePermission {
  role: string;
  number: string;
  description: string;
  color: string;
  features: Feature[];
}

const ROLES: RolePermission[] = [
  {
    role: "Super Admin",
    number: "01",
    description: "Full system oversight — highest privilege level across the entire platform.",
    color: "#f97316",
    features: [
      {
        area: "Dashboard",
        capabilities:
          "System-wide metrics: total users, active orders, revenue, ratings, and complaints.",
      },
      {
        area: "User Management",
        capabilities:
          "View all customers, vendors, riders, and staff accounts with full profile details.",
      },
      {
        area: "Account Actions",
        capabilities: "Suspend, activate, or verify vendor, rider, and customer accounts.",
      },
      {
        area: "Orders",
        capabilities: "View all orders; override complaint status; flag suspicious orders.",
      },
      {
        area: "Revenue",
        capabilities: "Revenue analytics, trends, breakdowns by vendor and time period.",
      },
      {
        area: "Promo Codes",
        capabilities: "Create, approve, decline, toggle, and delete promotional codes.",
      },
      {
        area: "Queries",
        capabilities: "View, assign, and resolve customer and vendor complaints.",
      },
      { area: "Ratings", capabilities: "View all user ratings and aggregated statistics." },
      { area: "Notifications", capabilities: "Create and manage system-wide push notifications." },
      { area: "Profile", capabilities: "Update own profile, avatar, password, and OTP settings." },
    ],
  },
  {
    role: "IT Department",
    number: "02",
    description: "Account management, system troubleshooting, and full audit trail access.",
    color: "#1e3a5f",
    features: [
      { area: "Dashboard", capabilities: "IT-specific metrics and system health indicators." },
      {
        area: "Customer Accounts",
        capabilities: "View, suspend, activate, delete, and restore customer accounts.",
      },
      {
        area: "Vendor Accounts",
        capabilities: "View, suspend, activate, verify, delete, and restore vendor accounts.",
      },
      {
        area: "Rider Accounts",
        capabilities: "View, suspend, activate, delete, and restore rider accounts.",
      },
      {
        area: "Staff Management",
        capabilities:
          "Create, edit, delete, suspend, and reset passwords for all staff and department heads.",
      },
      { area: "Orders", capabilities: "View and delete orders (read-mostly)." },
      { area: "Audit Logs", capabilities: "Full audit trail of all actions across the system." },
      {
        area: "Suspended/Deleted Accounts",
        capabilities: "Dedicated views for reviewing suspended or deleted accounts.",
      },
      {
        area: "Promos",
        capabilities:
          "Emergency toggle only — can enable or disable promo codes in critical situations.",
      },
      { area: "Notifications", capabilities: "View and delete system notifications." },
      { area: "Profile", capabilities: "Update own profile, avatar, password, and OTP settings." },
    ],
  },
  {
    role: "Operations",
    number: "03",
    description: "Day-to-day order fulfilment, quality control, and vendor/rider management.",
    color: "#2d6a4f",
    features: [
      {
        area: "Dashboard",
        capabilities: "Operational stats: active orders, pending assignments, fulfilment rate.",
      },
      {
        area: "Orders",
        capabilities:
          "View all orders, assign/reassign riders, update order status, resend delivery OTP, remind vendor and rider.",
      },
      { area: "Customers", capabilities: "View, suspend, activate, and delete customer accounts." },
      {
        area: "Vendors",
        capabilities: "View, verify, suspend, activate, and delete vendor accounts.",
      },
      {
        area: "Riders",
        capabilities: "View, suspend, activate, delete, and manage rider documents.",
      },
      {
        area: "Reviews",
        capabilities:
          "View vendor and rider reviews; issue warnings, commendations, or suspend via review actions.",
      },
      {
        area: "Promos",
        capabilities: "Create, approve, decline, toggle, update, and delete promotional codes.",
      },
      {
        area: "Transactions",
        capabilities: "View successful and failed transactions; track refunds.",
      },
      { area: "Broadcast", capabilities: "Send push notifications to user devices via FCM." },
      {
        area: "Notifications",
        capabilities: "View, create, mark as read, and delete notifications.",
      },
      { area: "Profile", capabilities: "Update own profile, avatar, password, and OTP settings." },
    ],
  },
  {
    role: "Finance",
    number: "04",
    description:
      "Financial reporting and data export — read-only access with CSV export capability.",
    color: "#92400e",
    features: [
      {
        area: "Dashboard",
        capabilities: "Financial stats overview including pending withdrawals summary.",
      },
      { area: "Transactions", capabilities: "View all transactions; view by ID; export as CSV." },
      {
        area: "Withdrawals",
        capabilities:
          "View all withdrawal requests; view by ID; approve or reject pending withdrawals; export as CSV.",
      },
      {
        area: "Revenue",
        capabilities: "Total revenue report, top-performing vendors, and top riders breakdown.",
      },
      { area: "Profile", capabilities: "Update own profile, avatar, password, and OTP settings." },
    ],
  },
  {
    role: "Investors",
    number: "05",
    description: "Portal skeleton — not yet implemented.",
    color: "#6d28d9",
    features: [
      { area: "Portal Shell", capabilities: "Login + layout — built." },
      { area: "Dashboard", capabilities: "Welcome/landing page — skeleton only." },
      { area: "Revenue Overview", capabilities: "Platform-level revenue summary — not yet built." },
      { area: "Order Volume", capabilities: "Total orders over time — not yet built." },
      {
        area: "Growth Metrics",
        capabilities: "User growth (customers, vendors, riders) — not yet built.",
      },
      {
        area: "Financial Reports",
        capabilities: "High-level financial summaries — not yet built.",
      },
      { area: "Backend API", capabilities: "Any investor-specific endpoints — not yet built." },
      { area: "Profile", capabilities: "Update profile & password — not yet built." },
    ],
  },
];

export default function PermissionsPage() {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-black text-foreground">Role & Feature Map</h1>
          <p className="text-xs text-muted-foreground">
            Access privileges and feature scope assigned to each staff role
          </p>
        </div>
      </div>

      {/* Role cards */}
      <div className="space-y-6">
        {ROLES.map((role) => (
          <div
            key={role.role}
            className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden"
          >
            {/* Role header */}
            <div
              className="flex items-center gap-4 px-5 py-4"
              style={{ backgroundColor: role.color }}
            >
              <span className="text-2xl font-black text-white/60">{role.number}</span>
              <div>
                <h2 className="text-base font-black text-white">{role.role}</h2>
                <p className="text-xs text-white/75">{role.description}</p>
              </div>
            </div>

            {/* Feature table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th
                      className="px-5 py-2.5 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground w-48"
                      style={{ color: role.color }}
                    >
                      Area / Module
                    </th>
                    <th className="px-5 py-2.5 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Features / Capabilities
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {role.features.map((f, i) => (
                    <tr
                      key={f.area}
                      className={`border-b border-border/50 last:border-0 ${i % 2 === 0 ? "" : "bg-muted/20"}`}
                    >
                      <td className="px-5 py-3 font-semibold text-foreground whitespace-nowrap align-top">
                        {f.area}
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">{f.capabilities}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
