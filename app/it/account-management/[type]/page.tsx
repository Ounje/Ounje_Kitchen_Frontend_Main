"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { itService } from "@/lib/api/services/it.service";
import { exportMixedAccounts } from "@/lib/csv-export";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, Eye, RotateCcw, Download } from "lucide-react";
import { toast } from "sonner";
import Pagination from "@/components/Pagination";

type AccountType = "suspended" | "deleted";
type EntityRole  = "all" | "customer" | "vendor" | "rider" | "staff";

interface AccountsData {
  customers: any[];
  vendors:   any[];
  riders:    any[];
  staff:     any[];
}

// ── Unwrap helpers ────────────────────────────────────────────────────────────
// IT backend returns: { success, data: { suspendedAccounts: { customers, vendors, riders, staff }, pagination } }
function unwrapAccounts(res: any, accountType: AccountType): AccountsData {
  const empty: AccountsData = { customers: [], vendors: [], riders: [], staff: [] };
  if (!res) return empty;

  const d = res?.data ?? res;
  const block = accountType === "suspended"
    ? (d?.suspendedAccounts ?? d)
    : (d?.deletedAccounts   ?? d);

  return {
    customers: Array.isArray(block?.customers) ? block.customers : [],
    vendors:   Array.isArray(block?.vendors)   ? block.vendors   : [],
    riders:    Array.isArray(block?.riders)    ? block.riders    : [],
    staff:     Array.isArray(block?.staff)     ? block.staff     : [],
  };
}

function unwrapPagination(res: any, currentLimit: number) {
  const d = res?.data ?? res;
  const p = d?.pagination ?? d;
  return {
    page:  p?.page  ?? 1,
    pages: p?.pages ?? 1,
    total: p?.total ?? 0,
    limit: currentLimit,
  };
}

// ── Per-entity field resolvers ────────────────────────────────────────────────
function resolveName(account: any, entityType: string): string {
  if (entityType === "customer") return account.user?.name  || account.name || "N/A";
  if (entityType === "vendor")   return account.name        || "N/A";
  if (entityType === "rider")    return `${account.firstName ?? ""} ${account.lastName ?? ""}`.trim() || "N/A";
  // staff / admin
  return `${account.firstName ?? ""} ${account.lastName ?? ""}`.trim() || account.name || "N/A";
}

function resolveEmail(account: any, entityType: string): string {
  if (entityType === "customer") return account.user?.email  || account.email || "N/A";
  if (entityType === "vendor")   return account.owner?.email || account.email || "N/A";
  return account.email || "N/A";
}

function resolvePhone(account: any, entityType: string): string {
  if (entityType === "customer") {
    const p = account.user?.phone || account.phone || account.phoneNumber;
    return p ? String(p) : "N/A";
  }
  if (entityType === "vendor") {
    const p = account.owner?.phone || account.phone;
    return p ? String(p) : "N/A";
  }
  const p = account.phone || account.phoneNumber;
  return p ? String(p) : "N/A";
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr className="animate-pulse border-t">
      {[40, 160, 200, 130, 110, 80].map((w, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-3.5 rounded bg-gray-200" style={{ width: w }} />
        </td>
      ))}
    </tr>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AccountsListPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = use(params);
  const router      = useRouter();
  const accountType = type as AccountType;

  const [accounts, setAccounts] = useState<AccountsData>({
    customers: [], vendors: [], riders: [], staff: [],
  });
  const [loading, setLoading]         = useState(true);
  const [selectedRole, setSelectedRole] = useState<EntityRole>("all");
  const [searchFilters, setSearchFilters] = useState({
    name: "", email: "", phoneNumber: "",
  });
  const [pagination, setPagination] = useState({
    page: 1, limit: 7, total: 0, pages: 1,
  });

  // Restore modal
  const [restoreModalOpen, setRestoreModalOpen] = useState(false);
  const [restoreTarget, setRestoreTarget] = useState<{
    id: string; name: string; entityType: string;
  } | null>(null);
  const [restoring, setRestoring] = useState(false);

  useEffect(() => { fetchAccounts(1); }, [accountType]);

  const fetchAccounts = async (page = 1) => {
    setLoading(true);
    try {
      const p = { page, limit: pagination.limit, ...searchFilters };
      const raw = accountType === "suspended"
        ? await itService.getSuspendedAccounts(p)
        : await itService.getDeletedAccounts(p);

      setAccounts(unwrapAccounts(raw, accountType));
      setPagination(unwrapPagination(raw, pagination.limit));
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch accounts");
    } finally {
      setLoading(false);
    }
  };

  const confirmRestore = async () => {
    if (!restoreTarget) return;
    setRestoring(true);
    try {
      const { id, entityType } = restoreTarget;
      if (entityType === "customer") {
        accountType === "suspended"
          ? await itService.activateCustomer(id)
          : await itService.restoreCustomer(id);
      } else if (entityType === "vendor") {
        accountType === "suspended"
          ? await itService.activateVendor(id)
          : await itService.restoreVendor(id);
      } else if (entityType === "rider") {
        accountType === "suspended"
          ? await itService.activateRider(id)
          : await itService.restoreRider(id);
      } else {
        accountType === "suspended"
          ? await itService.activateStaff(id)
          : await itService.restoreStaff(id);
      }
      toast.success(`Account ${accountType === "suspended" ? "activated" : "restored"} successfully`);
      setRestoreModalOpen(false);
      setRestoreTarget(null);
      fetchAccounts(pagination.page);
    } catch (err: any) {
      toast.error(err.message || "Failed");
    } finally {
      setRestoring(false);
    }
  };

  const handleExportCSV = () => exportMixedAccounts(accounts, accountType);

  const getFiltered = (): AccountsData => {
    if (selectedRole === "all") return accounts;
    return {
      customers: selectedRole === "customer" ? accounts.customers : [],
      vendors:   selectedRole === "vendor"   ? accounts.vendors   : [],
      riders:    selectedRole === "rider"    ? accounts.riders    : [],
      staff:     selectedRole === "staff"    ? accounts.staff     : [],
    };
  };

  const filtered     = getFiltered();
  const totalAccounts = Object.values(filtered).reduce((s, a) => s + a.length, 0);

  const renderAccountTable = (accountList: any[], entityType: string) => {
    if (accountList.length === 0) return null;
    return (
      <div className="mb-8" key={entityType}>
        <div className="px-4 md:px-6 py-4 bg-[#98ef9b] border-b flex items-center gap-2">
          <h3 className="text-lg font-semibold text-[#1a3f1c] capitalize">
            {entityType}s
          </h3>
          <span className="text-sm text-[#1a3f1c]/70">({accountList.length})</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: "#e8f7e8" }}>
              <tr>
                {["S/N", "Name", "Email", "Phone Number", "Date", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-sm font-medium text-[#1a3f1c]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white">
              {accountList.map((account, index) => {
                const name  = resolveName(account, entityType);
                const email = resolveEmail(account, entityType);
                const phone = resolvePhone(account, entityType);
                const date  = accountType === "deleted"
                  ? account.deletedAt
                  : account.suspendedAt || account.suspensionDate || account.updatedAt;

                return (
                  <tr
                    key={account._id}
                    className="border-t hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() =>
                      router.push(
                        `/it/account-management/${accountType}/${account._id}?entityType=${entityType}&status=${accountType}`
                      )
                    }
                  >
                    <td className="px-4 py-3 text-sm">
                      {(pagination.page - 1) * pagination.limit + index + 1}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{email}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{phone}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {date
                        ? new Date(date).toLocaleDateString("en-US", {
                            year: "numeric", month: "short", day: "numeric",
                          })
                        : "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setRestoreTarget({ id: account._id, name, entityType });
                            setRestoreModalOpen(true);
                          }}
                          className="p-2 rounded-full transition-colors hover:opacity-80"
                          style={{ backgroundColor: "#98ef9b" }}
                          title={accountType === "suspended" ? "Activate Account" : "Restore Account"}
                        >
                          <RotateCcw className="h-4 w-4 text-[#1a3f1c]" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(
                              `/it/account-management/${accountType}/${account._id}?entityType=${entityType}&status=${accountType}`
                            );
                          }}
                          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4 text-gray-700" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => router.push("/it/account-management")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 capitalize">
            {accountType} Accounts
          </h1>
          <p className="text-sm md:text-base text-gray-500 mt-1">
            {totalAccounts} account{totalAccounts !== 1 ? "s" : ""} found
          </p>
        </div>
      </div>

      {/* Search / Filter */}
      <Card className="border shadow-sm">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Search & Filter</h2>
            <Button
              onClick={handleExportCSV}
              variant="outline"
              className="gap-2"
              disabled={loading || totalAccounts === 0}
            >
              <Download className="h-4 w-4" /> Export CSV
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <Label>Name</Label>
              <Input
                value={searchFilters.name}
                onChange={(e) => setSearchFilters({ ...searchFilters, name: e.target.value })}
                placeholder="Search by name"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={searchFilters.email}
                onChange={(e) => setSearchFilters({ ...searchFilters, email: e.target.value })}
                placeholder="Search by email"
              />
            </div>
            <div>
              <Label>Phone Number</Label>
              <Input
                value={searchFilters.phoneNumber}
                onChange={(e) => setSearchFilters({ ...searchFilters, phoneNumber: e.target.value })}
                placeholder="Search by phone"
              />
            </div>
            <div>
              <Label>Account Role</Label>
              <Select
                value={selectedRole}
                onValueChange={(v) => setSelectedRole(v as EntityRole)}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="vendor">Vendor</SelectItem>
                  <SelectItem value="rider">Rider</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => fetchAccounts(1)}
              style={{ backgroundColor: "#1a3f1c" }}
              className="text-white hover:opacity-90"
            >
              Search
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setSearchFilters({ name: "", email: "", phoneNumber: "" });
                setSelectedRole("all");
                fetchAccounts(1);
              }}
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tables */}
      <Card className="border shadow-sm" style={{ backgroundColor: "#e8f7e8" }}>
        <CardContent className="p-0">
          {loading ? (
            <div>
              {["customers", "vendors", "riders"].map((t) => (
                <div key={t} className="mb-6">
                  <div className="px-4 py-4 h-12 bg-[#98ef9b]/50 animate-pulse" />
                  <table className="w-full">
                    <tbody>
                      {Array.from({ length: 3 }).map((_, i) => (
                        <SkeletonRow key={i} />
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          ) : totalAccounts === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No {accountType} accounts found
              </p>
            </div>
          ) : (
            <>
              {renderAccountTable(filtered.customers, "customer")}
              {renderAccountTable(filtered.vendors,   "vendor")}
              {renderAccountTable(filtered.riders,    "rider")}
              {renderAccountTable(filtered.staff,     "staff")}

              <div className="px-4 py-2">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.pages}
                  pageSize={pagination.limit}
                  onPageChange={fetchAccounts}
                  onPageSizeChange={(size) => {
                    setPagination((p) => ({ ...p, limit: size, page: 1 }));
                    setTimeout(() => fetchAccounts(1), 0);
                  }}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Restore Confirmation Modal */}
      <Dialog open={restoreModalOpen} onOpenChange={setRestoreModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {accountType === "suspended" ? "Activate Account" : "Restore Account"}
            </DialogTitle>
            <DialogDescription className="text-base pt-4">
              Are you sure you want to{" "}
              {accountType === "suspended" ? "activate" : "restore"} this account?
              <br />
              <span className="font-semibold text-gray-900 mt-2 block">
                {restoreTarget?.name}
              </span>
              {accountType === "deleted" && (
                <span className="text-green-600 text-sm mt-2 block">
                  This will restore the account and make it active again.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row gap-3">
            <Button
              variant="outline"
              onClick={() => { setRestoreModalOpen(false); setRestoreTarget(null); }}
              disabled={restoring}
              className="flex-1"
            >
              No, Cancel
            </Button>
            <Button
              onClick={confirmRestore}
              disabled={restoring}
              className="flex-1"
              style={{ backgroundColor: "#1a3f1c" }}
            >
              {restoring ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                `Yes, ${accountType === "suspended" ? "Activate" : "Restore"}`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}