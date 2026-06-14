"use client";

import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/client";
import { ENDPOINTS } from "@/lib/config";
import { toast } from "sonner";
import { ShieldAlert, RefreshCw, Search } from "lucide-react";
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
  PASSWORD_CHANGED: "bg-yellow-100 text-yellow-700 border-yellow-200",
  PASSWORD_RESET: "bg-yellow-100 text-yellow-700 border-yellow-200",
  PROFILE_UPDATED: "bg-gray-100 text-gray-600 border-gray-200",
  AVATAR_UPDATED: "bg-gray-100 text-gray-600 border-gray-200",
};

const ALL_ACTIONS = [
  "LOGIN_SUCCESS",
  "LOGIN_FAILED",
  "LOGOUT",
  "STAFF_CREATED",
  "STAFF_UPDATED",
  "STAFF_DELETED",
  "STAFF_ACTIVATED",
  "STAFF_DEACTIVATED",
  "STAFF_RESTORED",
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
  "ORDER_DELETED",
  "PASSWORD_CHANGED",
  "PASSWORD_RESET",
  "PROFILE_UPDATED",
  "AVATAR_UPDATED",
];

function actionLabel(action: string) {
  return action.replace(/_/g, " ");
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

function resolveName(u: any) {
  if (!u) return "—";
  if (u.firstName || u.lastName) return `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim();
  return u.email || u._id || "—";
}

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-100 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <td key={i} className="px-4 py-3.5">
          <div className="h-3.5 bg-gray-100 rounded-full w-3/4" />
        </td>
      ))}
    </tr>
  );
}

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setAction] = useState("all");
  const [userId, setUserId] = useState("");
  const [limit, setLimit] = useState(50);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { limit };
      if (actionFilter !== "all") params.action = actionFilter;
      if (userId.trim()) params.userId = userId.trim();

      const res: any = await apiClient.get(ENDPOINTS.SUPERADMIN.AUDIT_LOGS, { params });
      setLogs(Array.isArray(res?.data) ? res.data : []);
    } catch (err: any) {
      toast.error(err?.message || "Failed to load audit logs");
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, [actionFilter, userId, limit]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

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
            <p className="text-xs text-gray-500">
              Full trail of all admin actions across the system
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchLogs}
          disabled={loading}
          className="gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Select value={actionFilter} onValueChange={setAction}>
              <SelectTrigger className="h-10 rounded-xl">
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                {ALL_ACTIONS.map((a) => (
                  <SelectItem key={a} value={a}>
                    {actionLabel(a)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <Input
              placeholder="Filter by User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchLogs()}
              className="pl-9 h-10 rounded-xl"
            />
          </div>

          <div className="w-32">
            <Select value={String(limit)} onValueChange={(v) => setLimit(Number(v))}>
              <SelectTrigger className="h-10 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[25, 50, 100, 200].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    Last {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {!loading && logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <ShieldAlert className="w-10 h-10 mb-3 opacity-30" />
            <p className="text-sm font-medium">No audit logs found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80">
                  <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Action
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Performed By
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Target
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Details
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 10 }).map((_, i) => <SkeletonRow key={i} />)
                  : logs.map((log) => (
                      <tr
                        key={log._id}
                        className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <Badge
                            variant="outline"
                            className={`text-[10px] font-bold uppercase tracking-wider border ${ACTION_COLORS[log.action] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}
                          >
                            {actionLabel(log.action)}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-gray-700 font-medium text-xs">
                          {resolveName(log.performedBy)}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs">
                          {resolveName(log.targetUser)}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs max-w-xs">
                          {log.details
                            ? Object.entries(log.details)
                                .map(([k, v]) => `${k}: ${v}`)
                                .join(" · ")
                            : "—"}
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                          {formatDate(log.createdAt)}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!loading && logs.length > 0 && (
        <p className="text-xs text-gray-400 text-right">
          {logs.length} log{logs.length !== 1 ? "s" : ""} shown
        </p>
      )}
    </div>
  );
}
