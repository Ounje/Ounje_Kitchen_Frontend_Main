"use client";

import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/client";
import { ENDPOINTS } from "@/lib/config";
import { toast } from "sonner";
import { ShieldAlert, RefreshCw, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ── constants ─────────────────────────────────────────────────────────────────

const ACTION_COLORS: Record<string, string> = {
  LOGIN_SUCCESS: "bg-green-100 text-green-700 border-green-200",
  LOGIN_FAILED: "bg-red-100 text-red-700 border-red-200",
  LOGOUT: "bg-gray-100 text-gray-600 border-gray-200",
  STAFF_CREATED: "bg-blue-100 text-blue-700 border-blue-200",
  STAFF_UPDATED: "bg-blue-100 text-blue-700 border-blue-200",
  STAFF_DELETED: "bg-red-100 text-red-700 border-red-200",
  STAFF_ACTIVATED: "bg-green-100 text-green-700 border-green-200",
  STAFF_DEACTIVATED: "bg-orange-100 text-orange-700 border-orange-200",
  STAFF_RESTORED: "bg-purple-100 text-purple-700 border-purple-200",
  PROFILE_UPDATED: "bg-gray-100 text-gray-600 border-gray-200",
  AVATAR_UPDATED: "bg-gray-100 text-gray-600 border-gray-200",
  PASSWORD_CHANGED: "bg-yellow-100 text-yellow-700 border-yellow-200",
  PASSWORD_RESET: "bg-yellow-100 text-yellow-700 border-yellow-200",
  PASSWORD_RESET_BY_ADMIN: "bg-yellow-100 text-yellow-700 border-yellow-200",
  ACCOUNT_CREATED: "bg-blue-100 text-blue-700 border-blue-200",
  ACCOUNT_DEACTIVATED: "bg-orange-100 text-orange-700 border-orange-200",
  ACCOUNT_REACTIVATED: "bg-green-100 text-green-700 border-green-200",
  CUSTOMER_SUSPENDED: "bg-orange-100 text-orange-700 border-orange-200",
  CUSTOMER_ACTIVATED: "bg-green-100 text-green-700 border-green-200",
  CUSTOMER_DELETED: "bg-red-100 text-red-700 border-red-200",
  CUSTOMER_RESTORED: "bg-purple-100 text-purple-700 border-purple-200",
  VENDOR_SUSPENDED: "bg-orange-100 text-orange-700 border-orange-200",
  VENDOR_ACTIVATED: "bg-green-100 text-green-700 border-green-200",
  VENDOR_DELETED: "bg-red-100 text-red-700 border-red-200",
  VENDOR_RESTORED: "bg-purple-100 text-purple-700 border-purple-200",
  VENDOR_VERIFIED: "bg-teal-100 text-teal-700 border-teal-200",
  RIDER_SUSPENDED: "bg-orange-100 text-orange-700 border-orange-200",
  RIDER_ACTIVATED: "bg-green-100 text-green-700 border-green-200",
  RIDER_DELETED: "bg-red-100 text-red-700 border-red-200",
  RIDER_RESTORED: "bg-purple-100 text-purple-700 border-purple-200",
  ORDER_DELETED: "bg-red-100 text-red-700 border-red-200",
  RIDER_ASSIGNED: "bg-blue-100 text-blue-700 border-blue-200",
  ORDER_STATUS_UPDATED: "bg-blue-100 text-blue-700 border-blue-200",
};

const ALL_ACTIONS = [
  "LOGIN_SUCCESS",
  "LOGIN_FAILED",
  "LOGOUT",
  "ACCOUNT_CREATED",
  "ACCOUNT_DEACTIVATED",
  "ACCOUNT_REACTIVATED",
  "STAFF_CREATED",
  "STAFF_UPDATED",
  "STAFF_DELETED",
  "STAFF_ACTIVATED",
  "STAFF_DEACTIVATED",
  "STAFF_RESTORED",
  "PROFILE_UPDATED",
  "AVATAR_UPDATED",
  "PASSWORD_CHANGED",
  "PASSWORD_RESET",
  "PASSWORD_RESET_BY_ADMIN",
  "CUSTOMER_SUSPENDED",
  "CUSTOMER_ACTIVATED",
  "CUSTOMER_DELETED",
  "CUSTOMER_RESTORED",
  "VENDOR_SUSPENDED",
  "VENDOR_ACTIVATED",
  "VENDOR_DELETED",
  "VENDOR_RESTORED",
  "VENDOR_VERIFIED",
  "RIDER_SUSPENDED",
  "RIDER_ACTIVATED",
  "RIDER_DELETED",
  "RIDER_RESTORED",
  "RIDER_ASSIGNED",
  "ORDER_DELETED",
  "ORDER_STATUS_UPDATED",
];

const ROLES = [
  { value: "super_admin", label: "Super Admin" },
  { value: "it", label: "IT" },
  { value: "operations", label: "Operations" },
  { value: "finance", label: "Finance" },
  { value: "investors", label: "Investors" },
];

const PAGE_SIZE = 20;

// ── helpers ───────────────────────────────────────────────────────────────────

function actionLabel(action: string) {
  return action.replace(/_/g, " ");
}

function actionStatus(action: string) {
  if (action?.includes("FAILED"))
    return { label: "Failed", cls: "bg-red-100 text-red-700 border-red-200" };
  return { label: "Success", cls: "bg-green-100 text-green-700 border-green-200" };
}

function formatDate(d: string) {
  return new Date(d).toLocaleString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

function resolveEmail(u: any) {
  if (!u) return "—";
  return u.email || "—";
}

function resolveRole(u: any) {
  if (!u) return "—";
  return u.department || "—";
}

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-100 animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <td key={i} className="px-4 py-3.5">
          <div className="h-3.5 bg-gray-100 rounded-full w-3/4" />
        </td>
      ))}
    </tr>
  );
}

// ── main component ────────────────────────────────────────────────────────────

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [roleFilter, setRoleFilter] = useState("all");
  const [actionFilter, setActionFilter] = useState("all");
  const [userEmailSearch, setUserEmailSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Portal users list for email-based filtering
  const [portalUsers, setPortalUsers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("all");

  // Fetch portal users on mount for the user dropdown
  useEffect(() => {
    apiClient
      .get<any>(ENDPOINTS.ADMIN.USERS, { params: { limit: 200 } })
      .then((res) => setPortalUsers(Array.isArray(res?.data) ? res.data : []))
      .catch(() => {});
  }, []);

  const fetchLogs = useCallback(
    async (p: number) => {
      setLoading(true);
      try {
        const params: Record<string, any> = { page: p, limit: PAGE_SIZE };
        if (roleFilter !== "all") params.role = roleFilter;
        if (selectedUserId !== "all") params.userId = selectedUserId;
        if (actionFilter !== "all") params.action = actionFilter;
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;

        const res: any = await apiClient.get(ENDPOINTS.ADMIN.AUDIT_LOGS, { params });
        setLogs(Array.isArray(res?.data) ? res.data : []);
        setTotal(res?.total ?? 0);
        setTotalPages(res?.pages ?? 1);
      } catch (err: any) {
        toast.error(err?.message || "Failed to load audit logs");
        setLogs([]);
      } finally {
        setLoading(false);
      }
    },
    [roleFilter, selectedUserId, actionFilter, startDate, endDate]
  );

  // Refetch when filters or page change
  useEffect(() => {
    fetchLogs(page);
  }, [fetchLogs, page]);

  // Reset to page 1 when filters change
  const applyFilters = () => {
    setPage(1);
    fetchLogs(1);
  };

  const clearFilters = () => {
    setRoleFilter("all");
    setActionFilter("all");
    setSelectedUserId("all");
    setUserEmailSearch("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const hasActiveFilters =
    roleFilter !== "all" ||
    actionFilter !== "all" ||
    selectedUserId !== "all" ||
    startDate ||
    endDate;

  // Filter portal users by email search
  const filteredUsers = userEmailSearch
    ? portalUsers.filter((u) => u.email?.toLowerCase().includes(userEmailSearch.toLowerCase()))
    : portalUsers;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#1a3f1c] flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-[#ffca3a]" />
          </div>
          <div>
            <h1 className="text-xl font-black text-[#1a3f1c]">Audit Logs</h1>
            <p className="text-xs text-gray-500">Complete activity trail across all portals</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchLogs(page)}
          disabled={loading}
          className="gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Portal / Role */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
              Portal / Role
            </p>
            <Select
              value={roleFilter}
              onValueChange={(v) => {
                setRoleFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="h-9 rounded-xl text-sm">
                <SelectValue placeholder="All portals" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All portals</SelectItem>
                {ROLES.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Individual User */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
              Individual User
            </p>
            <Select
              value={selectedUserId}
              onValueChange={(v) => {
                setSelectedUserId(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="h-9 rounded-xl text-sm">
                <SelectValue placeholder="All users" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All users</SelectItem>
                <div className="px-2 py-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                    <input
                      placeholder="Search email…"
                      value={userEmailSearch}
                      onChange={(e) => setUserEmailSearch(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full pl-6 pr-2 py-1 text-xs border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-[#1a3f1c]/30"
                    />
                  </div>
                </div>
                {filteredUsers.map((u) => (
                  <SelectItem key={u.id || u._id} value={u.id || u._id}>
                    <span className="text-xs">{u.email}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Action Type */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
              Action Type
            </p>
            <Select
              value={actionFilter}
              onValueChange={(v) => {
                setActionFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="h-9 rounded-xl text-sm">
                <SelectValue placeholder="All actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All actions</SelectItem>
                {ALL_ACTIONS.map((a) => (
                  <SelectItem key={a} value={a}>
                    {actionLabel(a)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Clear */}
          <div className="flex items-end">
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="h-9 gap-1.5 text-xs rounded-xl w-full"
              >
                <X className="w-3 h-3" />
                Clear filters
              </Button>
            )}
          </div>
        </div>

        {/* Date range */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
              From
            </p>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPage(1);
              }}
              className="h-9 rounded-xl text-sm"
            />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
              To
            </p>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPage(1);
              }}
              className="h-9 rounded-xl text-sm"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {!loading && logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <ShieldAlert className="w-10 h-10 mb-3 opacity-30" />
            <p className="text-sm font-medium">No audit logs found</p>
            {hasActiveFilters && <p className="text-xs mt-1">Try clearing your filters</p>}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80">
                  <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400 whitespace-nowrap">
                    Date &amp; Time
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">
                    User Email
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Portal / Role
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Action
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">
                    IP Address
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 10 }).map((_, i) => <SkeletonRow key={i} />)
                  : logs.map((log) => {
                      const status = actionStatus(log.action);
                      return (
                        <tr
                          key={log._id}
                          className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                        >
                          <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                            {formatDate(log.createdAt)}
                          </td>
                          <td className="px-4 py-3 text-gray-700 font-medium text-xs truncate max-w-40">
                            {resolveEmail(log.performedBy)}
                          </td>
                          <td className="px-4 py-3 text-gray-500 text-xs capitalize">
                            {resolveRole(log.performedBy)}
                          </td>
                          <td className="px-4 py-3">
                            <Badge
                              variant="outline"
                              className={`text-[10px] font-bold uppercase tracking-wider border ${ACTION_COLORS[log.action] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}
                            >
                              {actionLabel(log.action)}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-gray-500 text-xs font-mono">
                            {log.ipAddress || "—"}
                          </td>
                          <td className="px-4 py-3">
                            <Badge
                              variant="outline"
                              className={`text-[10px] font-bold border ${status.cls}`}
                            >
                              {status.label}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-xs text-gray-500">
            <span>
              {total === 0 ? "No results" : `Page ${page} of ${totalPages} · ${total} total`}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {!loading && logs.length > 0 && totalPages <= 1 && (
        <p className="text-xs text-gray-400 text-right">
          {logs.length} log{logs.length !== 1 ? "s" : ""} shown
        </p>
      )}
    </div>
  );
}
