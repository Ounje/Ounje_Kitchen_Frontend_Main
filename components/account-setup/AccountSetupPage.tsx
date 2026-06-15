"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Search, RefreshCw, Users, Store, Bike, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Pagination from "@/components/Pagination";
import {
  customerSetupService,
  vendorSetupService,
  riderSetupService,
} from "@/lib/api/services/accountSetup.service";

import CustomerForm from "./forms/CustomerForm";
import VendorForm from "./forms/VendorForm";
import RiderForm from "./forms/RiderForm";

type Tab = "customers" | "vendors" | "riders";

interface AccountSetupPageProps {
  portal: "it" | "operations";
}

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: "customers", label: "Customers", icon: <Users className="w-4 h-4" /> },
  { key: "vendors", label: "Vendors", icon: <Store className="w-4 h-4" /> },
  { key: "riders", label: "Riders", icon: <Bike className="w-4 h-4" /> },
];

export default function AccountSetupPage({ portal }: AccountSetupPageProps) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("customers");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<any>(null);
  const [editLoading, setEditLoading] = useState<string | null>(null);

  const fetchData = useCallback(
    async (pg = page, sz = pageSize, s = search) => {
      setLoading(true);
      try {
        const params = { page: pg, limit: sz, search: s || undefined };
        let res: any;
        if (tab === "customers") res = await customerSetupService.list(params);
        else if (tab === "vendors") res = await vendorSetupService.list(params);
        else res = await riderSetupService.list(params);

        setItems(res?.data ?? []);
        setTotal(res?.total ?? 0);
        setTotalPages(res?.totalPages ?? 1);
      } catch (err: any) {
        toast.error(err?.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    },
    [tab, page, pageSize, search]
  );

  useEffect(() => {
    setPage(1);
    setSearch("");
    setItems([]);
    fetchData(1, pageSize, "");
  }, [tab]); // eslint-disable-line

  const handleSearch = () => {
    setPage(1);
    fetchData(1, pageSize, search);
  };
  const handleCreated = () => {
    setShowForm(false);
    setEditTarget(null);
    fetchData(1, pageSize, search);
  };

  const handleEditClick = async (item: any) => {
    // Customers: list already returns complete MarketUser + profile data
    if (tab === "customers") {
      setEditTarget(item);
      setShowForm(true);
      return;
    }
    // Vendors and Riders: fetch full record so all fields (bank details,
    // owner address, etc.) are populated in the edit form
    setEditLoading(item._id);
    try {
      const res: any =
        tab === "vendors"
          ? await vendorSetupService.getById(item._id)
          : await riderSetupService.getById(item._id);
      setEditTarget(res?.data ?? item);
      setShowForm(true);
    } catch {
      setEditTarget(item);
      setShowForm(true);
    } finally {
      setEditLoading(null);
    }
  };

  const menuPath = (id: string) => `/${portal}/account-setup/vendor/${id}/menu`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-[#1a3f1c]">Account Setup</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Create and manage customer, vendor, and rider accounts
          </p>
        </div>
        <Button
          onClick={() => {
            setEditTarget(null);
            setShowForm(true);
          }}
          className="bg-[#1a3f1c] hover:bg-[#1a3f1c]/90 gap-2"
        >
          <Plus className="w-4 h-4" /> Create{" "}
          {tab === "customers" ? "Customer" : tab === "vendors" ? "Vendor" : "Rider"}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              tab === t.key
                ? "bg-white text-[#1a3f1c] shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder={`Search ${tab}...`}
            className="pl-9"
          />
        </div>
        <Button variant="outline" onClick={handleSearch} disabled={loading}>
          <Search className="w-4 h-4" />
        </Button>
        <Button variant="outline" onClick={() => fetchData()} disabled={loading}>
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="space-y-0">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-14 border-b border-gray-50 animate-pulse bg-gray-50/50" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-2">
            {tab === "customers" ? (
              <Users className="w-10 h-10 opacity-20" />
            ) : tab === "vendors" ? (
              <Store className="w-10 h-10 opacity-20" />
            ) : (
              <Bike className="w-10 h-10 opacity-20" />
            )}
            <p className="text-sm font-medium">No {tab} found</p>
            <p className="text-xs">Use the Create button above to add one</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Phone
                  </th>
                  {tab === "vendors" && (
                    <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Store
                    </th>
                  )}
                  {tab === "riders" && (
                    <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Mode
                    </th>
                  )}
                  <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item: any) => {
                  const name =
                    tab === "customers"
                      ? item.name
                      : tab === "vendors"
                        ? item.name
                        : (item.user?.name ?? "—");
                  const email =
                    tab === "customers"
                      ? item.email
                      : tab === "vendors"
                        ? (item.owner?.email ?? "—")
                        : (item.user?.email ?? "—");
                  const phone =
                    tab === "customers"
                      ? (item.phone ?? "—")
                      : tab === "vendors"
                        ? (item.owner?.phone ?? "—")
                        : (item.user?.phone ?? "—");
                  const isActive =
                    tab === "customers"
                      ? (item.profile?.isActive ?? item.isActive)
                      : tab === "vendors"
                        ? item.isActive
                        : item.isActive;
                  return (
                    <tr
                      key={item._id}
                      className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-4 py-3.5 font-semibold text-gray-800">{name || "—"}</td>
                      <td className="px-4 py-3.5 text-gray-500 text-xs">{email}</td>
                      <td className="px-4 py-3.5 text-gray-500 text-xs">{phone}</td>
                      {tab === "vendors" && (
                        <td className="px-4 py-3.5 text-gray-500 text-xs">
                          {item.storeDetails?.[0]?.storeName ?? "—"}
                        </td>
                      )}
                      {tab === "riders" && (
                        <td className="px-4 py-3.5 text-gray-500 text-xs">
                          {item.modeOfDelivery ?? "—"}
                        </td>
                      )}
                      <td className="px-4 py-3.5">
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                            isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1">
                          {tab === "vendors" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs gap-1"
                              onClick={() => router.push(menuPath(item._id))}
                            >
                              <Store className="w-3 h-3" /> Menu
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0"
                            disabled={editLoading === item._id}
                            onClick={() => handleEditClick(item)}
                          >
                            {editLoading === item._id ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={(p) => {
            setPage(p);
            fetchData(p, pageSize, search);
          }}
          onPageSizeChange={(s) => {
            setPageSize(s);
            setPage(1);
            fetchData(1, s, search);
          }}
        />
      </div>

      {/* Create / Edit Form Modals */}
      {showForm && tab === "customers" && (
        <CustomerForm
          existing={editTarget}
          onClose={() => {
            setShowForm(false);
            setEditTarget(null);
          }}
          onSuccess={handleCreated}
        />
      )}
      {showForm && tab === "vendors" && (
        <VendorForm
          existing={editTarget}
          onClose={() => {
            setShowForm(false);
            setEditTarget(null);
          }}
          onSuccess={handleCreated}
        />
      )}
      {showForm && tab === "riders" && (
        <RiderForm
          existing={editTarget}
          onClose={() => {
            setShowForm(false);
            setEditTarget(null);
          }}
          onSuccess={handleCreated}
        />
      )}
    </div>
  );
}
