"use client";

import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/client";
import { ENDPOINTS } from "@/lib/config";
import { toast } from "sonner";
import {
  Users,
  RefreshCw,
  Plus,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ShieldOff,
  ShieldCheck,
  KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ── types ─────────────────────────────────────────────────────────────────────

interface PortalUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  mustChangePassword: boolean;
  createdAt: string;
}

const ROLES = [
  { value: "it", label: "IT" },
  { value: "operations", label: "Operations" },
  { value: "super_admin", label: "Super Admin" },
];

const ROLE_LABELS: Record<string, string> = {
  it: "IT",
  operations: "Operations",
  super_admin: "Super Admin",
  finance: "Finance",
  investors: "Investors",
};

const PAGE_SIZE = 15;

// ── helpers ───────────────────────────────────────────────────────────────────

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
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

// ── modal: create user ────────────────────────────────────────────────────────

interface CreateUserModalProps {
  onClose: () => void;
  onCreated: (user: PortalUser) => void;
}

function CreateUserModal({ onClose, onCreated }: CreateUserModalProps) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.role) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSubmitting(true);
    try {
      const res: any = await apiClient.post(ENDPOINTS.ADMIN.USERS, {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        role: form.role,
        ...(form.password ? { password: form.password } : {}),
      });
      toast.success("User created successfully");
      onCreated(res.data);
      onClose();
    } catch (err: any) {
      toast.error(err?.message || "Failed to create user");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#1a3f1c] flex items-center justify-center">
              <Plus className="w-4 h-4 text-[#ffca3a]" />
            </div>
            <h2 className="text-base font-black text-[#1a3f1c]">Create New User</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-gray-700">First Name *</Label>
              <Input
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                placeholder="Ada"
                className="h-9 text-sm rounded-xl"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-gray-700">Last Name *</Label>
              <Input
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                placeholder="Okafor"
                className="h-9 text-sm rounded-xl"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-gray-700">Email *</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="ada@ounjefood.com"
              className="h-9 text-sm rounded-xl"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-gray-700">Portal / Role *</Label>
            <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
              <SelectTrigger className="h-9 rounded-xl text-sm">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-gray-700">
              Temporary Password{" "}
              <span className="font-normal text-gray-400">
                (optional — defaults to Change@1234)
              </span>
            </Label>
            <Input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              className="h-9 text-sm rounded-xl"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 h-10 rounded-xl text-sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1 h-10 rounded-xl text-sm font-bold"
              style={{ backgroundColor: "#1a3f1c" }}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Creating…
                </>
              ) : (
                "Create User"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── modal: reset password ─────────────────────────────────────────────────────

interface ResetPasswordModalProps {
  user: PortalUser;
  onClose: () => void;
}

function ResetPasswordModal({ user, onClose }: ResetPasswordModalProps) {
  const [newPassword, setNewPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) {
      toast.error("Please enter a temporary password");
      return;
    }
    setSubmitting(true);
    try {
      await apiClient.patch(ENDPOINTS.ADMIN.USER_RESET_PASSWORD(user.id), { newPassword });
      toast.success(`Password reset for ${user.email}`);
      onClose();
    } catch (err: any) {
      toast.error(err?.message || "Failed to reset password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center">
              <KeyRound className="w-4 h-4 text-yellow-700" />
            </div>
            <h2 className="text-base font-black text-gray-900">Reset Password</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <p className="text-sm text-gray-500">
            Enter a temporary password for{" "}
            <span className="font-semibold text-gray-700">{user.email}</span>. They will be required
            to change it on next login.
          </p>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-gray-700">Temporary Password *</Label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="h-9 text-sm rounded-xl"
              required
            />
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 h-10 rounded-xl text-sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1 h-10 rounded-xl text-sm font-bold bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Reset Password"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── main page ─────────────────────────────────────────────────────────────────

export default function UserManagementPage() {
  const [users, setUsers] = useState<PortalUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [roleFilter, setRoleFilter] = useState("all");

  // Action loading states keyed by user id
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [resetPasswordUser, setResetPasswordUser] = useState<PortalUser | null>(null);

  const fetchUsers = useCallback(
    async (p: number) => {
      setLoading(true);
      try {
        const params: Record<string, any> = { page: p, limit: PAGE_SIZE };
        if (roleFilter !== "all") params.role = roleFilter;

        const res: any = await apiClient.get(ENDPOINTS.ADMIN.USERS, { params });
        setUsers(Array.isArray(res?.data) ? res.data : []);
        setTotal(res?.total ?? 0);
        setTotalPages(res?.pages ?? 1);
      } catch (err: any) {
        toast.error(err?.message || "Failed to load users");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    },
    [roleFilter]
  );

  useEffect(() => {
    fetchUsers(page);
  }, [fetchUsers, page]);

  const handleDeactivate = async (user: PortalUser) => {
    setActionLoading((prev) => ({ ...prev, [user.id]: true }));
    try {
      await apiClient.patch(ENDPOINTS.ADMIN.USER_DEACTIVATE(user.id));
      toast.success(`${user.email} deactivated`);
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, isActive: false } : u)));
    } catch (err: any) {
      toast.error(err?.message || "Failed to deactivate user");
    } finally {
      setActionLoading((prev) => ({ ...prev, [user.id]: false }));
    }
  };

  const handleReactivate = async (user: PortalUser) => {
    setActionLoading((prev) => ({ ...prev, [user.id]: true }));
    try {
      await apiClient.patch(ENDPOINTS.ADMIN.USER_REACTIVATE(user.id));
      toast.success(`${user.email} reactivated`);
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, isActive: true } : u)));
    } catch (err: any) {
      toast.error(err?.message || "Failed to reactivate user");
    } finally {
      setActionLoading((prev) => ({ ...prev, [user.id]: false }));
    }
  };

  const handleUserCreated = (newUser: PortalUser) => {
    setUsers((prev) => [newUser, ...prev]);
    setTotal((t) => t + 1);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1a3f1c] flex items-center justify-center">
              <Users className="w-5 h-5 text-[#ffca3a]" />
            </div>
            <div>
              <h1 className="text-xl font-black text-[#1a3f1c]">User Management</h1>
              <p className="text-xs text-gray-500">Manage portal user accounts</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchUsers(page)}
              disabled={loading}
              className="gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button
              size="sm"
              onClick={() => setShowCreateModal(true)}
              className="gap-2 font-bold"
              style={{ backgroundColor: "#1a3f1c" }}
            >
              <Plus className="w-4 h-4" />
              Create User
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="w-full sm:w-56">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                Filter by Portal / Role
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
            {roleFilter !== "all" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setRoleFilter("all");
                  setPage(1);
                }}
                className="gap-1.5 text-xs h-9 rounded-xl"
              >
                <X className="w-3 h-3" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {!loading && users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Users className="w-10 h-10 mb-3 opacity-30" />
              <p className="text-sm font-medium">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/80">
                    <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Portal / Role
                    </th>
                    <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Must Change PW
                    </th>
                    <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Date Created
                    </th>
                    <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
                    : users.map((user) => {
                        const busy = actionLoading[user.id];
                        return (
                          <tr
                            key={user.id}
                            className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                          >
                            <td className="px-4 py-3">
                              <div>
                                <p className="text-gray-800 font-medium text-xs">{user.email}</p>
                                <p className="text-gray-400 text-[11px]">
                                  {user.firstName} {user.lastName}
                                </p>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <Badge
                                variant="outline"
                                className="text-[10px] font-bold uppercase tracking-wider border bg-gray-100 text-gray-600 border-gray-200"
                              >
                                {ROLE_LABELS[user.role] ?? user.role}
                              </Badge>
                            </td>
                            <td className="px-4 py-3">
                              <Badge
                                variant="outline"
                                className={`text-[10px] font-bold border ${
                                  user.isActive
                                    ? "bg-green-100 text-green-700 border-green-200"
                                    : "bg-red-100 text-red-700 border-red-200"
                                }`}
                              >
                                {user.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </td>
                            <td className="px-4 py-3">
                              <Badge
                                variant="outline"
                                className={`text-[10px] font-bold border ${
                                  user.mustChangePassword
                                    ? "bg-amber-100 text-amber-700 border-amber-200"
                                    : "bg-gray-100 text-gray-500 border-gray-200"
                                }`}
                              >
                                {user.mustChangePassword ? "Yes" : "No"}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                              {formatDate(user.createdAt)}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {user.isActive ? (
                                  <button
                                    onClick={() => handleDeactivate(user)}
                                    disabled={busy}
                                    title="Deactivate"
                                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    {busy ? (
                                      <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : (
                                      <ShieldOff className="w-3 h-3" />
                                    )}
                                    Deactivate
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleReactivate(user)}
                                    disabled={busy}
                                    title="Reactivate"
                                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    {busy ? (
                                      <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : (
                                      <ShieldCheck className="w-3 h-3" />
                                    )}
                                    Reactivate
                                  </button>
                                )}
                                <button
                                  onClick={() => setResetPasswordUser(user)}
                                  disabled={busy}
                                  title="Reset password"
                                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <KeyRound className="w-3 h-3" />
                                  Reset PW
                                </button>
                              </div>
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
                Page {page} of {totalPages} · {total} total
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {!loading && users.length > 0 && totalPages <= 1 && (
          <p className="text-xs text-gray-400 text-right">
            {users.length} user{users.length !== 1 ? "s" : ""} shown
          </p>
        )}
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <CreateUserModal onClose={() => setShowCreateModal(false)} onCreated={handleUserCreated} />
      )}

      {/* Reset Password Modal */}
      {resetPasswordUser && (
        <ResetPasswordModal user={resetPasswordUser} onClose={() => setResetPasswordUser(null)} />
      )}
    </>
  );
}
