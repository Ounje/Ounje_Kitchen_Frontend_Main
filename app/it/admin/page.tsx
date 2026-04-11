"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { itService } from "@/lib/api/services/it.service";
import { exportToCSV } from "@/lib/csv-export";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Eye, Lock, Trash2, Download } from "lucide-react";
import { toast } from "sonner";
import Pagination from "@/components/Pagination";

type ViewType = "Admin" | "Staff" | "Customer" | "Vendor" | "Rider";
const DEPARTMENTS = ["IT", "Operations", "Finance", "Investors"];

// ── Field helpers ─────────────────────────────────────────────────────────────
function getDisplayName(item: any, view: ViewType): string {
  if (view === "Admin" || view === "Staff")
    return `${item.firstName ?? ""} ${item.lastName ?? ""}`.trim() || "—";
  if (view === "Customer") return item.user?.name || "—";
  if (view === "Vendor")   return item.name       || "—";
  if (view === "Rider")    return `${item.firstName ?? ""} ${item.lastName ?? ""}`.trim() || "—";
  return "—";
}

function getEmail(item: any, view: ViewType): string {
  if (view === "Admin" || view === "Staff") return item.email        || "—";
  if (view === "Customer")                  return item.user?.email  || "—";
  if (view === "Vendor")                    return item.owner?.email || "—";
  if (view === "Rider")                     return item.email        || "—";
  return "—";
}

// ── Unwrap helpers ────────────────────────────────────────────────────────────
function extractRows(res: any): any[] {
  if (Array.isArray(res)) return res;
  const d = res?.data ?? res;
  if (Array.isArray(d?.customers)) return d.customers;
  if (Array.isArray(d?.vendors))   return d.vendors;
  if (Array.isArray(d?.riders))    return d.riders;
  if (Array.isArray(d?.staff))     return d.staff;
  if (Array.isArray(d?.admins))    return d.admins;
  if (Array.isArray(d?.users))     return d.users;
  if (Array.isArray(d?.data))      return d.data;
  if (Array.isArray(d))            return d;
  return [];
}

function extractPagination(res: any, currentLimit: number) {
  const d = res?.data ?? res;
  const p = d?.pagination ?? d;
  return {
    page:  p?.page  ?? 1,
    pages: p?.pages ?? 1,
    total: p?.total ?? 0,
    limit: currentLimit,
  };
}

// Resolve line manager name from a lookup array
function resolveLineManager(lm: any, lookupList: any[]): string {
  if (!lm) return "Not Assigned";
  if (typeof lm === "object") {
    return lm.name
      || `${lm.firstName ?? ""} ${lm.lastName ?? ""}`.trim()
      || lm.email
      || "—";
  }
  // Raw ObjectId string — look up in full staff list
  const lmStr = String(lm);
  const found = lookupList.find(
    a => String(a._id) === lmStr || String(a.id) === lmStr
  );
  if (found) {
    return `${found.firstName ?? ""} ${found.lastName ?? ""}`.trim()
      || found.name
      || found.email
      || "—";
  }
  return "—";
}

// ── Skeleton Row ──────────────────────────────────────────────────────────────
function SkeletonRow({ cols }: { cols: number }) {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div
            className="h-3.5 rounded bg-gray-200"
            style={{ width: `${[40, 140, 180, 130, 160, 100, 80][i] ?? 100}px` }}
          />
        </td>
      ))}
    </tr>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function ITAdminPage() {
  const router = useRouter();
  const [currentView, setCurrentView] = useState<ViewType>("Admin");
  const [data, setData]               = useState<any[]>([]);
  const [loading, setLoading]         = useState(false);
  // allStaffLookup: used to resolve lineManager ObjectIds in the Staff table
  const [allStaffLookup, setAllStaffLookup] = useState<any[]>([]);

  const [pagination, setPagination] = useState({ page: 1, limit: 7, total: 0, pages: 1 });

  const [adminForm, setAdminForm] = useState({ firstName: "", lastName: "", email: "", department: "" });
  const [staffForm, setStaffForm] = useState({ firstName: "", lastName: "", email: "", department: "", lineManager: "", phone: "" });
  const [searchFilters, setSearchFilters] = useState({ name: "", email: "", phoneNumber: "" });

  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [suspendTarget, setSuspendTarget]       = useState<{ id: string; name: string } | null>(null);
  const [suspendReason, setSuspendReason]       = useState("");
  const [suspending, setSuspending]             = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget]       = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting]               = useState(false);

  // ── Fetch staff lookup list (for lineManager resolution) ─────────────────
  // Fetches ALL staff with no isHead filter — includes heads, staff, superadmin
  const fetchAllStaffLookup = useCallback(async () => {
    try {
      const res: any = await itService.getAllStaffForLookup();
      setAllStaffLookup(extractRows(res));
    } catch { /* silent — just means lineManager won't resolve */ }
  }, []);

  // ── Main data fetch ───────────────────────────────────────────────────────
  const fetchData = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const base = { page, limit: pagination.limit, ...searchFilters };

      let res: any;
      switch (currentView) {
        case "Admin":    res = await itService.getAdmins(base);    break;
        case "Staff":    res = await itService.getStaff(base);     break;
        case "Customer": res = await itService.getCustomers(base); break;
        case "Vendor":   res = await itService.getVendors(base);   break;
        case "Rider":    res = await itService.getRiders(base);    break;
      }

      // Client-side filter: exclude suspended and deleted accounts
      // We do this client-side because backend MongoDB strict-matches boolean fields
      // and excludes records where isSuspended/isDeleted is undefined (unset in DB)
      const rows = extractRows(res).filter(
        item => item.isSuspended !== true && item.isDeleted !== true
      );

      setData(rows);
      setPagination(extractPagination(res, pagination.limit));
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch data");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [currentView, pagination.limit, searchFilters]);

  // ── On view change: fetch data AND lookup list in parallel ────────────────
  // Using Promise.all ensures allStaffLookup is populated before/alongside rows
  useEffect(() => {
    if (currentView === "Admin" || currentView === "Staff") {
      // Fetch both in parallel — rows and lookup list at the same time
      Promise.all([fetchData(1), fetchAllStaffLookup()]);
    } else {
      fetchData(1);
    }
  }, [currentView]);

  // ── Create Admin ──────────────────────────────────────────────────────────
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminForm.firstName || !adminForm.lastName || !adminForm.email || !adminForm.department) {
      toast.error("Please fill all required fields"); return;
    }
    try {
      await itService.createAdmin({ ...adminForm, department: adminForm.department.toLowerCase() });
      toast.success("Admin created! Credentials sent to email.");
      setAdminForm({ firstName: "", lastName: "", email: "", department: "" });
      await Promise.all([fetchData(pagination.page), fetchAllStaffLookup()]);
    } catch (err: any) { toast.error(err.message || "Failed to create admin"); }
  };

  // ── Create Staff ──────────────────────────────────────────────────────────
  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffForm.firstName || !staffForm.lastName || !staffForm.email || !staffForm.department || !staffForm.lineManager) {
      toast.error("Please fill all required fields"); return;
    }
    try {
      await itService.createStaff({ ...staffForm, department: staffForm.department.toLowerCase() });
      toast.success("Staff created! Credentials sent to email.");
      setStaffForm({ firstName: "", lastName: "", email: "", department: "", lineManager: "", phone: "" });
      fetchData(pagination.page);
    } catch (err: any) { toast.error(err.message || "Failed to create staff"); }
  };

  // ── Suspend — optimistic removal from table ───────────────────────────────
  const confirmSuspend = async () => {
    if (!suspendTarget || !suspendReason.trim()) { toast.error("Enter a suspension reason"); return; }
    setSuspending(true);
    try {
      if (currentView === "Customer")    await itService.suspendCustomer(suspendTarget.id, suspendReason);
      else if (currentView === "Vendor") await itService.suspendVendor(suspendTarget.id, suspendReason);
      else if (currentView === "Rider")  await itService.suspendRider(suspendTarget.id, suspendReason);
      else                               await itService.suspendStaff(suspendTarget.id, suspendReason);

      toast.success("Account suspended");

      // Immediately remove from table — no refetch needed
      setData(prev => prev.filter(item => (item._id ?? item.id) !== suspendTarget.id));
      setPagination(prev => ({ ...prev, total: Math.max(0, prev.total - 1) }));

      setSuspendModalOpen(false);
      setSuspendTarget(null);
      setSuspendReason("");
    } catch (err: any) { toast.error(err.message || "Failed to suspend"); }
    finally { setSuspending(false); }
  };

  // ── Delete — optimistic removal from table ────────────────────────────────
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      if (currentView === "Customer")    await itService.deleteCustomer(deleteTarget.id);
      else if (currentView === "Vendor") await itService.deleteVendor(deleteTarget.id);
      else if (currentView === "Rider")  await itService.deleteRider(deleteTarget.id);
      else                               await itService.deleteStaff(deleteTarget.id);

      toast.success("Account deleted");

      // Immediately remove from table — no refetch needed
      setData(prev => prev.filter(item => (item._id ?? item.id) !== deleteTarget.id));
      setPagination(prev => ({ ...prev, total: Math.max(0, prev.total - 1) }));

      setDeleteModalOpen(false);
      setDeleteTarget(null);
    } catch (err: any) { toast.error(err.message || "Failed to delete"); }
    finally { setDeleting(false); }
  };

  const handleRowClick = (id: string) => {
    const type = currentView === "Admin" ? "staff" : currentView.toLowerCase();
    router.push(`/it/admin/${id}?type=${type}`);
  };

  const handleExportCSV = () => {
    if (!data.length) { toast.error("No data to export"); return; }
    exportToCSV({
      filename:                `${currentView.toLowerCase()}_accounts`,
      data,
      entityType:              currentView === "Admin" ? "staff" : currentView.toLowerCase() as any,
      includeEntityTypeColumn: false,
    });
    toast.success("CSV exported");
  };

  const colCount =
    currentView === "Admin"    ? 5 :
    currentView === "Staff"    ? 6 :
    currentView === "Customer" ? 4 :
    currentView === "Vendor"   ? 5 :
    currentView === "Rider"    ? 6 : 5;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-foreground tracking-tight">Admin</h1>
        <div className="flex items-center gap-2">
          <Select value={currentView} onValueChange={v => setCurrentView(v as ViewType)}>
            <SelectTrigger className="w-40 bg-secondary text-primary font-bold border-none shadow-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(["Admin","Staff","Customer","Vendor","Rider"] as ViewType[]).map(v => (
                <SelectItem key={v} value={v}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* <Button
            variant="outline"
            onClick={() => router.push("/it/account-management")}
            className="whitespace-nowrap border-[#1a3f1c] text-[#1a3f1c] hover:bg-[#e8f7e8] text-sm"
          >
            Account Management
          </Button> */}
        </div>
      </div>

      {/* Admin creation form */}
      {currentView === "Admin" && (
        <Card className="border shadow-sm">
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-4">Create New Admin</h2>
            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label>First Name *</Label>
                  <Input value={adminForm.firstName} onChange={e => setAdminForm({ ...adminForm, firstName: e.target.value })} placeholder="Enter first name" /></div>
                <div><Label>Last Name *</Label>
                  <Input value={adminForm.lastName} onChange={e => setAdminForm({ ...adminForm, lastName: e.target.value })} placeholder="Enter last name" /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label>Email *</Label>
                  <Input type="email" value={adminForm.email} onChange={e => setAdminForm({ ...adminForm, email: e.target.value })} placeholder="Enter email" /></div>
                <div><Label>Department *</Label>
                  <Select value={adminForm.department} onValueChange={v => setAdminForm({ ...adminForm, department: v })}>
                    <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                    <SelectContent>{DEPARTMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                  </Select></div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-primary text-white hover:opacity-90 px-8 py-2 h-10 font-bold">Create Admin</Button>
                <Button type="button" variant="outline" className="border-border" onClick={() => setAdminForm({ firstName: "", lastName: "", email: "", department: "" })}>Clear</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Staff creation form */}
      {currentView === "Staff" && (
        <Card className="border shadow-sm">
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-4">Create New Staff</h2>
            <form onSubmit={handleCreateStaff} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><Label>First Name *</Label><Input value={staffForm.firstName} onChange={e => setStaffForm({ ...staffForm, firstName: e.target.value })} placeholder="Enter first name" /></div>
                <div><Label>Last Name *</Label><Input value={staffForm.lastName} onChange={e => setStaffForm({ ...staffForm, lastName: e.target.value })} placeholder="Enter last name" /></div>
                <div><Label>Email *</Label><Input type="email" value={staffForm.email} onChange={e => setStaffForm({ ...staffForm, email: e.target.value })} placeholder="Enter email" /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><Label>Department *</Label>
                  <Select value={staffForm.department} onValueChange={v => setStaffForm({ ...staffForm, department: v })}>
                    <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                    <SelectContent>{DEPARTMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                  </Select></div>
                <div><Label>Line Manager *</Label>
                  <Select value={staffForm.lineManager} onValueChange={v => setStaffForm({ ...staffForm, lineManager: v })}>
                    <SelectTrigger><SelectValue placeholder="Select line manager" /></SelectTrigger>
                    <SelectContent>
                      {allStaffLookup.length === 0 && <SelectItem value="_none" disabled>Loading...</SelectItem>}
                      {allStaffLookup
                        .filter(a => a.isHead || a.isSuperAdmin) // only heads/superadmins can be line managers
                        .map(a => (
                          <SelectItem key={a._id} value={a._id}>
                            {a.firstName} {a.lastName} ({a.department})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select></div>
                <div><Label>Phone Number</Label><Input value={staffForm.phone} onChange={e => setStaffForm({ ...staffForm, phone: e.target.value })} placeholder="Enter phone number" /></div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-primary text-white hover:opacity-90 px-8 py-2 h-10 font-bold">Create Staff</Button>
                <Button type="button" variant="outline" className="border-border" onClick={() => setStaffForm({ firstName: "", lastName: "", email: "", department: "", lineManager: "", phone: "" })}>Clear</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Search filters — Customer / Vendor / Rider */}
      {(currentView === "Customer" || currentView === "Vendor" || currentView === "Rider") && (
        <Card className="border shadow-sm">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div><Label>Name</Label>
                <Input value={searchFilters.name} onChange={e => setSearchFilters({ ...searchFilters, name: e.target.value })} placeholder="Search by name" /></div>
              <div><Label>E-mail</Label>
                <Input type="email" value={searchFilters.email} onChange={e => setSearchFilters({ ...searchFilters, email: e.target.value })} placeholder="Search by email" /></div>
              <div><Label>Phone Number</Label>
                <Input value={searchFilters.phoneNumber} onChange={e => setSearchFilters({ ...searchFilters, phoneNumber: e.target.value })} placeholder="Search by phone" /></div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => fetchData(1)} className="bg-primary text-white hover:opacity-90 px-8 font-bold h-10">Search</Button>
              <Button onClick={() => { setSearchFilters({ name: "", email: "", phoneNumber: "" }); fetchData(1); }} variant="outline" className="border-border">Reset</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Export */}
      <div className="flex justify-end">
        <Button onClick={handleExportCSV} variant="outline" className="gap-2" disabled={loading || !data.length}>
          <Download className="h-4 w-4" /> Export as CSV
        </Button>
      </div>

      {/* Table */}
      <Card className="border border-border/50 shadow-sm bg-surface overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary">
                <tr>
                  <th className="px-4 py-4 text-left font-black text-primary uppercase tracking-wider text-[10px]">S/N</th>
                  <th className="px-4 py-4 text-left font-black text-primary uppercase tracking-wider text-[10px]">Name</th>
                  <th className="px-4 py-4 text-left font-black text-primary uppercase tracking-wider text-[10px]">Email</th>
                  {(currentView === "Admin" || currentView === "Staff") && (
                    <th className="px-4 py-4 text-left font-black text-primary uppercase tracking-wider text-[10px]">Department</th>
                  )}
                  {currentView === "Staff" && (
                    <th className="px-4 py-4 text-left font-black text-primary uppercase tracking-wider text-[10px]">Line Manager</th>
                  )}
                  {currentView === "Customer" && (
                    <th className="px-4 py-4 text-left font-black text-primary uppercase tracking-wider text-[10px]">Phone</th>
                  )}
                  {currentView === "Vendor" && <>
                    <th className="px-4 py-4 text-left font-black text-primary uppercase tracking-wider text-[10px]">Owner</th>
                    <th className="px-4 py-4 text-left font-black text-primary uppercase tracking-wider text-[10px]">Phone</th>
                  </>}
                  {currentView === "Rider" && <>
                    <th className="px-4 py-4 text-left font-black text-primary uppercase tracking-wider text-[10px]">Phone</th>
                    <th className="px-4 py-4 text-left font-black text-primary uppercase tracking-wider text-[10px]">Operating Area</th>
                    <th className="px-4 py-4 text-left font-black text-primary uppercase tracking-wider text-[10px]">Rank</th>
                  </>}
                  <th className="px-4 py-4 text-left font-black text-primary uppercase tracking-wider text-[10px]">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-surface divide-y divide-border/50">
                {loading ? (
                  Array.from({ length: 7 }).map((_, i) => <SkeletonRow key={i} cols={colCount} />)
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={colCount} className="px-4 py-10 text-center text-gray-400">
                      No {currentView.toLowerCase()} found
                    </td>
                  </tr>
                ) : data.map((item: any, idx) => {
                  const name  = getDisplayName(item, currentView);
                  const email = getEmail(item, currentView);
                  const id    = item._id ?? item.id;
                  const sn    = (pagination.page - 1) * pagination.limit + idx + 1;

                  return (
                    <tr
                      key={id}
                      className="hover:bg-muted/30 cursor-pointer transition-colors"
                      onClick={() => handleRowClick(id)}
                    >
                      <td className="px-4 py-3 text-foreground font-medium">{sn}</td>
                      <td className="px-4 py-3 font-bold text-foreground hover:text-primary transition-colors">{name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{email}</td>

                      {(currentView === "Admin" || currentView === "Staff") && (
                        <td className="px-4 py-3 capitalize">{item.department || "—"}</td>
                      )}

                      {currentView === "Staff" && (
                        <td className="px-4 py-3 text-gray-600">
                          {resolveLineManager(item.lineManager, allStaffLookup)}
                        </td>
                      )}

                      {currentView === "Customer" && (
                        <td className="px-4 py-3 text-gray-600">
                          {item.user?.phone ? String(item.user.phone) : "—"}
                        </td>
                      )}

                      {currentView === "Vendor" && <>
                        <td className="px-4 py-3 text-gray-600">{item.owner?.name  || "—"}</td>
                        <td className="px-4 py-3 text-gray-600">{item.owner?.phone ? String(item.owner.phone) : "—"}</td>
                      </>}

                      {currentView === "Rider" && <>
                        <td className="px-4 py-3 text-gray-600">{item.phone ? String(item.phone) : "—"}</td>
                        <td className="px-4 py-3 text-gray-600">{item.operatingArea?.join(", ") || "—"}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                            {item.rank || "—"}
                          </span>
                        </td>
                      </>}

                      <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                        <div className="flex gap-2">
                           <button
                            onClick={e => { e.stopPropagation(); handleRowClick(id); }}
                            className="p-1.5 rounded-full bg-primary hover:opacity-80 transition-all shadow-sm"
                            title="View"
                          >
                            <Eye className="h-3.5 w-3.5 text-white" />
                          </button>
                           <button
                            onClick={e => { e.stopPropagation(); setSuspendTarget({ id, name }); setSuspendModalOpen(true); }}
                            className="p-1.5 bg-accent hover:opacity-80 transition-all rounded-full shadow-sm"
                            title="Suspend"
                          >
                            <Lock className="h-3.5 w-3.5 text-primary" />
                          </button>
                          <button
                            onClick={e => { e.stopPropagation(); setDeleteTarget({ id, name }); setDeleteModalOpen(true); }}
                            className="p-1.5 bg-red-500 rounded-full"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5 text-white" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {!loading && data.length > 0 && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              pageSize={pagination.limit}
              onPageChange={fetchData}
              onPageSizeChange={size => {
                setPagination(p => ({ ...p, limit: size, page: 1 }));
                setTimeout(() => fetchData(1), 0);
              }}
            />
          )}
        </CardContent>
      </Card>

      {/* Suspend Modal */}
      <Dialog open={suspendModalOpen} onOpenChange={setSuspendModalOpen}>
        <DialogContent className="sm:max-w-md bg-[#4B8A4E] text-white md:p-8">
          <DialogHeader>
            <DialogTitle className="text-xl">Suspend Account</DialogTitle>
            <DialogDescription className="text-base pt-2">
              You are about to suspend:<br />
              <span className="font-semibold text-white mt-1 block">{suspendTarget?.name}</span>
              <span className="text-white/80 text-sm mt-1 block">
                This account will be removed from the active list and moved to Account Management.
              </span>
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label className="mb-2 block text-white">Suspension Reason *</Label>
            <Textarea
              value={suspendReason}
              onChange={e => setSuspendReason(e.target.value)}
              placeholder="Enter reason..."
              rows={4}
              className="bg-white text-gray-900"
            />
          </div>
          <DialogFooter className="flex-row gap-3">
            <Button variant="outline" onClick={() => { setSuspendModalOpen(false); setSuspendReason(""); }} disabled={suspending} className="flex-1">Cancel</Button>
            <Button onClick={confirmSuspend} disabled={suspending || !suspendReason.trim()} className="flex-1" style={{ backgroundColor: "#ffca3a", color: "#1a3f1c" }}>
              {suspending ? <div className="w-4 h-4 border-2 border-[#1a3f1c] border-t-transparent rounded-full animate-spin" /> : "Yes, Suspend"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-md bg-[#4B8A4E] text-white md:p-8">
          <DialogHeader>
            <DialogTitle className="text-xl">Delete Account</DialogTitle>
            <DialogDescription className="text-base pt-4">
              Are you sure you want to delete:<br />
              <span className="font-semibold text-white mt-2 block">{deleteTarget?.name}</span><br />
              <span className="text-white/80 text-sm">
                This is a soft-delete. The account moves to Account Management and can be restored.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row gap-3">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)} disabled={deleting} className="flex-1">No, Cancel</Button>
            <Button onClick={confirmDelete} disabled={deleting} className="flex-1 bg-red-500 hover:bg-red-600 text-white">
              {deleting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "Yes, Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}