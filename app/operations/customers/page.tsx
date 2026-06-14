"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  customerService,
  type Customer,
  type TopCustomer,
} from "@/lib/api/services/customer.service";
import { TopChart, type TopChartEntry } from "@/components/operations/TopChart";
import { CustomerFilters, type FilterValues } from "@/components/operations/CustomerFilters";
import { StatusBadge } from "@/components/operations/StatusBadge";
import Pagination from "@/components/Pagination";
import { toast } from "sonner";
import { downloadCSV } from "@/lib/utils/exportCSV";
import { formatNigerianPhone } from "@/lib/utils/formatPhone";
import { Download, Loader2, ChevronRight, Users } from "lucide-react";

function TableSkeleton() {
  return (
    <>
      {[...Array(7)].map((_, i) => (
        <tr key={i} className="animate-pulse">
          {[...Array(8)].map((_, j) => (
            <td key={j}>
              <div className="h-4 bg-gray-100 rounded-full w-3/4" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export default function CustomersPage() {
  const router = useRouter();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [filters, setFilters] = useState<FilterValues>({ name: "", email: "", accountStatus: "" });
  const [activeFilters, setActiveFilters] = useState<FilterValues>({
    name: "",
    email: "",
    accountStatus: "",
  });
  const [pageSize, setPageSize] = useState(10);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0, limit: 10 });
  const [topCustomers, setTopCustomers] = useState<TopCustomer[]>([]);
  const [topLoading, setTopLoading] = useState(true);

  const loadCustomers = useCallback(
    async (page: number, f: FilterValues, limit = pageSize) => {
      setLoading(true);
      try {
        const res = await customerService.getCustomers({
          page,
          limit,
          ...(f.name ? { name: f.name } : {}),
          ...(f.email ? { email: f.email } : {}),
          ...(f.accountStatus
            ? { accountStatus: f.accountStatus as "active" | "suspended" | "unverified" }
            : {}),
        });
        setCustomers(res.data);
        setPagination({
          page: res.page,
          totalPages: res.totalPages,
          total: res.total,
          limit: res.limit,
        });
      } catch (err: any) {
        toast.error(err.message || "Failed to load customers");
      } finally {
        setLoading(false);
      }
    },
    [pageSize]
  );

  useEffect(() => {
    loadCustomers(1, filters);
    customerService
      .getTopCustomers()
      .then(setTopCustomers)
      .catch(() => setTopCustomers([]))
      .finally(() => setTopLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (f: FilterValues) => {
    setFilters(f);
    setActiveFilters(f);
    loadCustomers(1, f);
  };
  const handleReset = () => {
    const e: FilterValues = { name: "", email: "", accountStatus: "" };
    setFilters(e);
    setActiveFilters(e);
    loadCustomers(1, e);
  };

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const res = await customerService.getCustomers({
        page: 1,
        limit: 10000,
        ...(activeFilters.name ? { name: activeFilters.name } : {}),
        ...(activeFilters.email ? { email: activeFilters.email } : {}),
        ...(activeFilters.accountStatus
          ? { accountStatus: activeFilters.accountStatus as "active" | "suspended" | "unverified" }
          : {}),
      });
      downloadCSV(
        res.data.map((c) => ({
          Name: c.name,
          Email: c.email,
          Phone: formatNigerianPhone(c.phone),
          Status: c.accountStatus,
          Joined: c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "",
        })),
        `customers_${new Date().toISOString().slice(0, 10)}`
      );
      toast.success("Exported successfully");
    } catch (err: any) {
      toast.error(err.message || "Export failed");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1a3f1c]/10 flex items-center justify-center shrink-0">
            <Users className="h-5 w-5 text-[#1a3f1c]" />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900">Customers</h1>
            <p className="text-xs text-gray-400">
              {pagination.total.toLocaleString()} total customers
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleExportCSV}
          disabled={exporting || loading}
          className="inline-flex items-center gap-2 h-9 px-4 bg-[#1a3f1c] text-white text-sm font-semibold rounded-lg hover:bg-[#163318] active:scale-[0.98] transition-all disabled:opacity-50 shrink-0"
        >
          {exporting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Download className="h-3.5 w-3.5" />
          )}
          {exporting ? "Exporting…" : "Export CSV"}
        </button>
      </div>

      {/* Top Chart */}
      <TopChart
        title="Customer"
        statLabel="Completed"
        loading={topLoading}
        items={topCustomers.map(
          (c): TopChartEntry => ({
            id: c.id,
            name: c.name,
            avatar: c.avatar,
            phone: c.phone,
            location: c.address,
            stat: c.completedOrders,
            rank: c.rank,
          })
        )}
      />

      {/* Filters */}
      <CustomerFilters onSearch={handleSearch} onReset={handleReset} />

      {/* Table */}
      <div className="modern-table-container">
        <div className="overflow-x-auto">
          <table className="modern-table min-w-200">
            <thead>
              <tr>
                <th className="w-12">#</th>
                <th>Customer</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Joined</th>
                <th className="text-center">Orders</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableSkeleton />
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <Users className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">No customers found</p>
                  </td>
                </tr>
              ) : (
                customers.map((c, idx) => {
                  const sn = (pagination.page - 1) * pagination.limit + idx + 1;
                  return (
                    <tr key={c.id}>
                      <td className="text-gray-400 tabular-nums">{sn}</td>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 bg-[#98ef9b]/40 ring-2 ring-white shadow-sm flex items-center justify-center">
                            {c.avatar ? (
                              <img
                                src={c.avatar}
                                alt={c.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-[10px] font-black text-[#1a3f1c] select-none">
                                {(c.name || "?")
                                  .split(" ")
                                  .map((w: string) => w[0])
                                  .join("")
                                  .slice(0, 2)
                                  .toUpperCase()}
                              </span>
                            )}
                          </div>
                          <span className="font-bold text-gray-900">{c.name}</span>
                        </div>
                      </td>
                      <td className="text-gray-500 max-w-45 truncate">{c.email}</td>
                      <td className="text-gray-600 font-medium tabular-nums">
                        {formatNigerianPhone(c.phone)}
                      </td>
                      <td className="text-gray-500 whitespace-nowrap">
                        {c.createdAt
                          ? new Date(c.createdAt).toLocaleDateString("en-NG", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </td>
                      <td className="text-center">
                        <span className="inline-block text-xs font-black text-[#1a3f1c] bg-[#98ef9b]/40 px-2.5 py-1 rounded-full tabular-nums">
                          {c.totalOrders ?? 0}
                        </span>
                      </td>
                      <td>
                        <StatusBadge status={c.accountStatus} size="sm" />
                      </td>
                      <td className="text-right">
                        <button
                          type="button"
                          onClick={() => router.push(`/operations/customers/${c.id}`)}
                          className="inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-full bg-gray-50 text-xs font-bold text-[#1a3f1c] hover:bg-[#1a3f1c] hover:text-white transition-all"
                        >
                          Details <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          pageSize={pageSize}
          onPageChange={(p) => loadCustomers(p, activeFilters)}
          onPageSizeChange={(s) => {
            setPageSize(s);
            loadCustomers(1, activeFilters, s);
          }}
        />
      </div>
    </div>
  );
}
