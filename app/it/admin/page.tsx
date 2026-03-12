"use client";

import { useState, useEffect, useCallback } from "react";
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

// ── Field helpers (mirrors actual DB shapes) ─────────────────────────────────
function getDisplayName(item: any, view: ViewType): string {
  if (view === "Admin" || view === "Staff") {
    return `${item.firstName ?? ''} ${item.lastName ?? ''}`.trim() || '—';
  }
  if (view === "Customer") {
    return item.user?.name || '—';
  }
  if (view === "Vendor") {
    return item.name || '—';
  }
  if (view === "Rider") {
    // IT rider backend has NO .populate("user") — firstName/lastName are direct fields
    return `${item.firstName ?? ''} ${item.lastName ?? ''}`.trim() || '—';
  }
  return '—';
}

function getEmail(item: any, view: ViewType): string {
  if (view === "Admin" || view === "Staff") return item.email || '—';
  if (view === "Customer")  return item.user?.email || '—';
  if (view === "Vendor")    return item.owner?.email || '—';
  if (view === "Rider")     return item.email || '—'; // direct field, no user ref
  return '—';
}

// ── Skeleton Row ──────────────────────────────────────────────────────────────
function SkeletonRow({ cols }: { cols: number }) {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-3.5 rounded bg-gray-200" style={{ width: `${[40, 140, 180, 120, 120, 100, 80][i] ?? 100}px` }} />
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
  const [admins, setAdmins]           = useState<any[]>([]);

  const [pagination, setPagination] = useState({ page: 1, limit: 7, total: 0, pages: 1 });

  const [adminForm, setAdminForm] = useState({ firstName: "", lastName: "", email: "", department: "" });
  const [staffForm, setStaffForm] = useState({ firstName: "", lastName: "", email: "", department: "", lineManager: "", phone: "" });
  const [searchFilters, setSearchFilters] = useState({ name: "", email: "", phoneNumber: "", accountStatus: "" });

  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [suspendTarget, setSuspendTarget] = useState<{ id: string; name: string } | null>(null);
  const [suspendReason, setSuspendReason] = useState("");
  const [suspending, setSuspending] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  // ── Extract rows from raw API response ───────────────────────────────────
  // IT controllers return: { success, data: { customers/vendors/riders: [...], pagination: {...} } }
  // Superadmin returns:    { success, data: { data: [...], page, pages, total } }
  const extractRows = (res: any): any[] => {
    if (Array.isArray(res)) return res;

    const d = res?.data ?? res; // unwrap one level

    // IT-style named keys
    if (Array.isArray(d?.customers)) return d.customers;
    if (Array.isArray(d?.vendors))   return d.vendors;
    if (Array.isArray(d?.riders))    return d.riders;
    if (Array.isArray(d?.staff))     return d.staff;
    if (Array.isArray(d?.admins))    return d.admins;
    if (Array.isArray(d?.users))     return d.users;

    // Superadmin-style: { data: [...], page, pages }
    if (Array.isArray(d?.data))      return d.data;
    if (Array.isArray(d))            return d;

    return [];
  };

  const extractPagination = (res: any, currentLimit: number) => {
    const d = res?.data ?? res;
    // IT-style: pagination is a nested object
    const p = d?.pagination ?? d;
    return {
      page:  p?.page  ?? 1,
      pages: p?.pages ?? 1,
      total: p?.total ?? 0,
      limit: currentLimit,
    };
  };

  // ── Fetch admins for line manager dropdown ────────────────────────────────
  const fetchAdmins = useCallback(async () => {
    try {
      const res: any = await itService.getAdmins({ page: 1, limit: 100 });
      setAdmins(extractRows(res));
    } catch { /* silent */ }
  }, [extractRows]);

  // ── Main data fetch ───────────────────────────────────────────────────────
  const fetchData = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: pagination.limit };
      let res: any;

      switch (currentView) {
        case "Admin":    res = await itService.getAdmins(params);    break;
        case "Staff":    res = await itService.getStaff(params);     break;
        case "Customer": res = await itService.getCustomers(params); break;
        case "Vendor":   res = await itService.getVendors(params);   break;
        case "Rider":    res = await itService.getRiders(params);    break;
      }

      setData(extractRows(res));
      setPagination(extractPagination(res, pagination.limit));
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch data");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [currentView, pagination.limit]);

  useEffect(() => {
    fetchData(1);
    if (currentView === "Admin" || currentView === "Staff") fetchAdmins();
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
      fetchData(pagination.page);
      fetchAdmins();
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

  // ── Suspend ───────────────────────────────────────────────────────────────
  const confirmSuspend = async () => {
    if (!suspendTarget || !suspendReason.trim()) { toast.error("Enter a suspension reason"); return; }
    setSuspending(true);
    try {
      if (currentView === "Customer") await itService.suspendCustomer(suspendTarget.id, suspendReason);
      else if (currentView === "Vendor") await itService.suspendVendor(suspendTarget.id, suspendReason);
      else if (currentView === "Rider") await itService.suspendRider(suspendTarget.id, suspendReason);
      else await itService.suspendStaff(suspendTarget.id, suspendReason);
      toast.success("Account suspended");
      setSuspendModalOpen(false); setSuspendTarget(null); setSuspendReason("");
      fetchData(pagination.page);
    } catch (err: any) { toast.error(err.message || "Failed to suspend"); }
    finally { setSuspending(false); }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      if (currentView === "Customer") await itService.deleteCustomer(deleteTarget.id);
      else if (currentView === "Vendor") await itService.deleteVendor(deleteTarget.id);
      else if (currentView === "Rider") await itService.deleteRider(deleteTarget.id);
      else await itService.deleteStaff(deleteTarget.id);
      toast.success("Account deleted");
      setDeleteModalOpen(false); setDeleteTarget(null);
      fetchData(pagination.page);
    } catch (err: any) { toast.error(err.message || "Failed to delete"); }
    finally { setDeleting(false); }
  };

  const handleRowClick = (id: string) => {
    const type = currentView === "Admin" ? "staff" : currentView.toLowerCase();
    router.push(`/it/admin/${id}?type=${type}`);
  };

  const handleExportCSV = () => {
    if (!data.length) { toast.error("No data to export"); return; }
    exportToCSV({ filename: `${currentView.toLowerCase()}_accounts`, data, entityType: currentView === "Admin" ? "staff" : currentView.toLowerCase() as any, includeEntityTypeColumn: false });
    toast.success("CSV exported");
  };

  // ── Column count for skeleton ─────────────────────────────────────────────
  const colCount =
    currentView === "Admin"    ? 5 :
    currentView === "Staff"    ? 6 :
    currentView === "Customer" ? 5 :
    currentView === "Vendor"   ? 6 :
    currentView === "Rider"    ? 7 : 5;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Admin</h1>
        <Select value={currentView} onValueChange={(v) => setCurrentView(v as ViewType)}>
          <SelectTrigger className="w-48" style={{ backgroundColor: '#98ef9b' }}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(["Admin","Staff","Customer","Vendor","Rider"] as ViewType[]).map(v => (
              <SelectItem key={v} value={v}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Admin creation form */}
      {currentView === "Admin" && (
        <Card className="border shadow-sm">
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-4">Create New Admin</h2>
            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label>First Name *</Label>
                  <Input value={adminForm.firstName} onChange={e => setAdminForm({...adminForm, firstName: e.target.value})} placeholder="Enter first name" /></div>
                <div><Label>Last Name *</Label>
                  <Input value={adminForm.lastName} onChange={e => setAdminForm({...adminForm, lastName: e.target.value})} placeholder="Enter last name" /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label>Email *</Label>
                  <Input type="email" value={adminForm.email} onChange={e => setAdminForm({...adminForm, email: e.target.value})} placeholder="Enter email" /></div>
                <div><Label>Department *</Label>
                  <Select value={adminForm.department} onValueChange={v => setAdminForm({...adminForm, department: v})}>
                    <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                    <SelectContent>{DEPARTMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                  </Select></div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" style={{ backgroundColor: '#1a3f1c' }} className="text-white hover:opacity-90">Create Admin</Button>
                <Button type="button" variant="outline" onClick={() => setAdminForm({ firstName:"", lastName:"", email:"", department:"" })}>Clear</Button>
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
                <div><Label>First Name *</Label><Input value={staffForm.firstName} onChange={e => setStaffForm({...staffForm, firstName: e.target.value})} placeholder="Enter first name" /></div>
                <div><Label>Last Name *</Label><Input value={staffForm.lastName} onChange={e => setStaffForm({...staffForm, lastName: e.target.value})} placeholder="Enter last name" /></div>
                <div><Label>Email *</Label><Input type="email" value={staffForm.email} onChange={e => setStaffForm({...staffForm, email: e.target.value})} placeholder="Enter email" /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><Label>Department *</Label>
                  <Select value={staffForm.department} onValueChange={v => setStaffForm({...staffForm, department: v})}>
                    <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                    <SelectContent>{DEPARTMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                  </Select></div>
                <div><Label>Line Manager *</Label>
                  <Select value={staffForm.lineManager} onValueChange={v => setStaffForm({...staffForm, lineManager: v})}>
                    <SelectTrigger><SelectValue placeholder="Select line manager" /></SelectTrigger>
                    <SelectContent>
                      {admins.length === 0 && <SelectItem value="_none" disabled>No admins available</SelectItem>}
                      {admins.map(a => (
                        <SelectItem key={a._id} value={a._id}>
                          {a.firstName} {a.lastName} ({a.department})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select></div>
                <div><Label>Phone Number</Label><Input value={staffForm.phone} onChange={e => setStaffForm({...staffForm, phone: e.target.value})} placeholder="Enter phone number" /></div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" style={{ backgroundColor: '#1a3f1c' }} className="text-white hover:opacity-90">Create Staff</Button>
                <Button type="button" variant="outline" onClick={() => setStaffForm({ firstName:"", lastName:"", email:"", department:"", lineManager:"", phone:"" })}>Clear</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Search filters (Customer / Vendor / Rider) */}
      {(currentView === "Customer" || currentView === "Vendor" || currentView === "Rider") && (
        <Card className="border shadow-sm">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div><Label>Name</Label><Input value={searchFilters.name} onChange={e => setSearchFilters({...searchFilters, name: e.target.value})} placeholder="Search by name" /></div>
              <div><Label>E-mail</Label><Input type="email" value={searchFilters.email} onChange={e => setSearchFilters({...searchFilters, email: e.target.value})} placeholder="Search by email" /></div>
              <div><Label>Phone Number</Label><Input value={searchFilters.phoneNumber} onChange={e => setSearchFilters({...searchFilters, phoneNumber: e.target.value})} placeholder="Search by phone" /></div>
            </div>
            <div className="mb-4"><Label>Account Status</Label>
              <Input value={searchFilters.accountStatus} onChange={e => setSearchFilters({...searchFilters, accountStatus: e.target.value})} placeholder="Account Status" /></div>
            <div className="flex gap-2">
              <Button onClick={() => fetchData(1)} style={{ backgroundColor: '#1a3f1c' }} className="text-white hover:opacity-90">Search</Button>
              <Button onClick={() => { setSearchFilters({ name:"", email:"", phoneNumber:"", accountStatus:"" }); fetchData(1); }} variant="outline">Reset</Button>
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
      <Card className="border shadow-sm" style={{ backgroundColor: '#e8f7e8' }}>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead style={{ backgroundColor: '#98ef9b' }}>
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-[#1a3f1c]">S/N</th>
                  <th className="px-4 py-3 text-left font-medium text-[#1a3f1c]">Name</th>
                  <th className="px-4 py-3 text-left font-medium text-[#1a3f1c]">Email</th>
                  {(currentView === "Admin" || currentView === "Staff") && (
                    <th className="px-4 py-3 text-left font-medium text-[#1a3f1c]">Department</th>
                  )}
                  {currentView === "Staff" && (
                    <th className="px-4 py-3 text-left font-medium text-[#1a3f1c]">Line Manager</th>
                  )}
                  {currentView === "Customer" && <>
                    <th className="px-4 py-3 text-left font-medium text-[#1a3f1c]">Phone</th>
                    <th className="px-4 py-3 text-left font-medium text-[#1a3f1c]">Status</th>
                  </>}
                  {currentView === "Vendor" && <>
                    <th className="px-4 py-3 text-left font-medium text-[#1a3f1c]">Owner</th>
                    <th className="px-4 py-3 text-left font-medium text-[#1a3f1c]">Phone</th>
                    <th className="px-4 py-3 text-left font-medium text-[#1a3f1c]">Status</th>
                  </>}
                  {currentView === "Rider" && <>
                    <th className="px-4 py-3 text-left font-medium text-[#1a3f1c]">Phone</th>
                    <th className="px-4 py-3 text-left font-medium text-[#1a3f1c]">Operating Area</th>
                    <th className="px-4 py-3 text-left font-medium text-[#1a3f1c]">Rank</th>
                    <th className="px-4 py-3 text-left font-medium text-[#1a3f1c]">Status</th>
                  </>}
                  <th className="px-4 py-3 text-left font-medium text-[#1a3f1c]">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {loading ? (
                  Array.from({ length: 7 }).map((_, i) => <SkeletonRow key={i} cols={colCount} />)
                ) : data.length === 0 ? (
                  <tr><td colSpan={colCount} className="px-4 py-10 text-center text-gray-400">No {currentView.toLowerCase()} found</td></tr>
                ) : data.map((item: any, idx) => {
                  const name = getDisplayName(item, currentView);
                  const email = getEmail(item, currentView);
                  const id = item._id ?? item.id;
                  const isActive = item.isActive !== false;
                  const sn = (pagination.page - 1) * pagination.limit + idx + 1;

                  return (
                    <tr key={id} className="border-t hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => handleRowClick(id)}>
                      <td className="px-4 py-3">{sn}</td>
                      <td className="px-4 py-3 font-medium hover:text-[#1a3f1c] hover:underline">{name}</td>
                      <td className="px-4 py-3 text-gray-600">{email}</td>

                      {(currentView === "Admin" || currentView === "Staff") && (
                        <td className="px-4 py-3 capitalize">{item.department || '—'}</td>
                      )}
                      {currentView === "Staff" && (
                        <td className="px-4 py-3">
                          {item.lineManager
                            ? typeof item.lineManager === 'object'
                              ? item.lineManager.name
                                || `${item.lineManager.firstName ?? ''} ${item.lineManager.lastName ?? ''}`.trim()
                                || '—'
                              : item.lineManager
                            : '—'}
                        </td>
                      )}

                      {currentView === "Customer" && <>
                        <td className="px-4 py-3">{item.user?.phone ? String(item.user.phone) : '—'}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {isActive ? 'Active' : 'Suspended'}
                          </span>
                        </td>
                      </>}

                      {currentView === "Vendor" && <>
                        <td className="px-4 py-3">{item.owner?.name || '—'}</td>
                        <td className="px-4 py-3">{item.owner?.phone ? String(item.owner.phone) : '—'}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {isActive ? 'Active' : 'Suspended'}
                          </span>
                        </td>
                      </>}

                      {currentView === "Rider" && <>
                        {/* Rider backend has no .populate("user") — phone is a direct field */}
                        <td className="px-4 py-3">{item.phone ? String(item.phone) : '—'}</td>
                        <td className="px-4 py-3">{item.operatingArea?.join(', ') || '—'}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                            {item.rank || '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {isActive ? 'Active' : 'Suspended'}
                          </span>
                        </td>
                      </>}

                      <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                        <div className="flex gap-2">
                          <button onClick={e => { e.stopPropagation(); handleRowClick(id); }}
                            className="p-1.5 rounded-full" style={{ backgroundColor: '#1a3f1c' }} title="View">
                            <Eye className="h-3.5 w-3.5 text-white" />
                          </button>
                          <button onClick={e => { e.stopPropagation(); setSuspendTarget({ id, name }); setSuspendModalOpen(true); }}
                            className="p-1.5 bg-[#ffca3a] rounded-full" title="Suspend">
                            <Lock className="h-3.5 w-3.5 text-[#1a3f1c]" />
                          </button>
                          <button onClick={e => { e.stopPropagation(); setDeleteTarget({ id, name }); setDeleteModalOpen(true); }}
                            className="p-1.5 bg-red-500 rounded-full" title="Delete">
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
              onPageSizeChange={size => { setPagination(p => ({ ...p, limit: size, page: 1 })); setTimeout(() => fetchData(1), 0); }}
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
              <span className="font-semibold text-gray-900 mt-1 block">{suspendTarget?.name}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label className="mb-2 block">Suspension Reason *</Label>
            <Textarea value={suspendReason} onChange={e => setSuspendReason(e.target.value)} placeholder="Enter reason..." rows={4} />
          </div>
          <DialogFooter className="flex-row gap-3">
            <Button variant="outline" onClick={() => { setSuspendModalOpen(false); setSuspendReason(""); }} disabled={suspending} className="flex-1">Cancel</Button>
            <Button onClick={confirmSuspend} disabled={suspending || !suspendReason.trim()} className="flex-1" style={{ backgroundColor: '#ffca3a', color: '#1a3f1c' }}>
              {suspending ? <div className="w-4 h-4 border-2 border-[#1a3f1c] border-t-transparent rounded-full animate-spin" /> : 'Yes, Suspend'}
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
              <span className="font-semibold text-gray-900 mt-2 block">{deleteTarget?.name}</span><br />
              <span className="text-red-300 text-sm">This is a soft-delete and can be restored.</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row gap-3">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)} disabled={deleting} className="flex-1">No, Cancel</Button>
            <Button onClick={confirmDelete} disabled={deleting} className="flex-1 bg-red-500 hover:bg-red-600 text-white">
              {deleting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Yes, Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}