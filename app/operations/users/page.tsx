"use client";

import { useState } from "react";
import { Users, Store, Bike } from "lucide-react";
import CustomersPage from "@/app/operations/customers/page";
import VendorsPage from "@/app/operations/vendors/page";
import RidersPage from "@/app/operations/riders/page";

type Tab = "customers" | "vendors" | "riders";

const TABS: { key: Tab; label: string; Icon: React.ElementType }[] = [
  { key: "customers", label: "Customers", Icon: Users },
  { key: "vendors", label: "Vendors", Icon: Store },
  { key: "riders", label: "Riders", Icon: Bike },
];

export default function UsersPage() {
  const [tab, setTab] = useState<Tab>("customers");

  return (
    <div className="space-y-6">
      {/* Tab switcher */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {TABS.map(({ key, label, Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              tab === key
                ? "bg-white text-[#1a3f1c] shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content — each existing page renders in full */}
      {tab === "customers" && <CustomersPage />}
      {tab === "vendors" && <VendorsPage />}
      {tab === "riders" && <RidersPage />}
    </div>
  );
}
