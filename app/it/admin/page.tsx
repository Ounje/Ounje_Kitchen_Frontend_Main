"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { itService } from "@/lib/api/services/it.service";
import { exportToCSV } from "@/lib/csv-export";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Eye, Lock, Trash2, Download } from "lucide-react";
import { toast } from "sonner";
import Pagination from "@/components/Pagination";

type ViewType = "Admin" | "Staff" | "Customer" | "Vendor" | "Rider";

const DEPARTMENTS = ["IT", "Operations", "Finance", "Investors"];

export default function ITAdminPage() {
  const router = useRouter();
  const [currentView, setCurrentView] = useState<ViewType>("Admin");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [admins, setAdmins] = useState<any[]>([]); // For line manager dropdown
  
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 7,
    total: 0,
    pages: 1,
  });

  // Admin/Staff creation form
  const [adminForm, setAdminForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
  });

  const [staffForm, setStaffForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
    lineManager: "",
    phone: "",
  });

  // Search filters (for Customer/Vendor/Rider)
  const [searchFilters, setSearchFilters] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    accountStatus: "",
  });

  // Suspend Modal State
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [suspendTarget, setSuspendTarget] = useState<{ id: string; name: string } | null>(null);
  const [suspendReason, setSuspendReason] = useState("");
  const [suspending, setSuspending] = useState(false);

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch all admins for line manager dropdown
  const fetchAdmins = async () => {
    try {
      console.log('[IT Admin] Fetching admins for dropdown...');
      const result = await itService.getAdmins({ page: 1, limit: 100 }); // Get all admins
      console.log('[IT Admin] Admins for dropdown:', result);
      setAdmins(result.admins || []);
    } catch (error: any) {
      console.error("Failed to fetch admins:", error);
      toast.error("Failed to load admin list for dropdown");
    }
  };

  // Fetch data based on current view
  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      let result;
      const params = {
        page,
        limit: pagination.limit,
        search: searchFilters.name || searchFilters.email || searchFilters.phoneNumber,
      };

      console.log(`[IT Admin] Fetching ${currentView} with params:`, params);

      switch (currentView) {
        case "Admin":
          result = await itService.getAdmins(params);
          console.log('[IT Admin] Admins fetched:', result);
          setData(result.admins || []);
          setPagination(result.pagination || { page: 1, limit: 7, total: 0, pages: 1 });
          break;
        case "Staff":
          result = await itService.getStaff(params);
          console.log('[IT Admin] Staff fetched:', result);
          setData(result.staff || []);
          setPagination(result.pagination || { page: 1, limit: 7, total: 0, pages: 1 });
          break;
        case "Customer":
          result = await itService.getCustomers(params);
          console.log('[IT Admin] Customers fetched:', result);
          setData(result.customers || []);
          setPagination(result.pagination || { page: 1, limit: 7, total: 0, pages: 1 });
          break;
        case "Vendor":
          result = await itService.getVendors(params);
          console.log('[IT Admin] Vendors fetched:', result);
          setData(result.vendors || []);
          setPagination(result.pagination || { page: 1, limit: 7, total: 0, pages: 1 });
          break;
        case "Rider":
          result = await itService.getRiders(params);
          console.log('[IT Admin] Riders fetched:', result);
          setData(result.riders || []);
          setPagination(result.pagination || { page: 1, limit: 7, total: 0, pages: 1 });
          break;
      }
      
      console.log(`[IT Admin] Final data set:`, { count: data.length, pagination });
    } catch (error: any) {
      console.error("[IT Admin] Fetch error:", error);
      toast.error(error.message || "Failed to fetch data");
      setData([]);
      setPagination({ page: 1, limit: 7, total: 0, pages: 1 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1);
    // Fetch admins for dropdown whenever we're on Admin or Staff view
    if (currentView === "Admin" || currentView === "Staff") {
      fetchAdmins();
    }
  }, [currentView]);

  // Create Admin
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!adminForm.firstName || !adminForm.lastName || !adminForm.email || !adminForm.department) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      await itService.createAdmin({
        firstName: adminForm.firstName,
        lastName: adminForm.lastName,
        email: adminForm.email,
        department: adminForm.department.toLowerCase(),
      });
      
      toast.success("Admin created successfully! Login credentials sent to email.");
      setAdminForm({ firstName: "", lastName: "", email: "", department: "" });
      
      // Refresh the table to show new admin
      await fetchData(pagination.page);
      
      // CRITICAL: Also refresh admins dropdown so new admin appears
      await fetchAdmins();
    } catch (error: any) {
      toast.error(error.message || "Failed to create admin");
    }
  };

  // Create Staff
  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!staffForm.firstName || !staffForm.lastName || !staffForm.email || 
        !staffForm.department || !staffForm.lineManager) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      await itService.createStaff({
        firstName: staffForm.firstName,
        lastName: staffForm.lastName,
        email: staffForm.email,
        department: staffForm.department.toLowerCase(),
        lineManager: staffForm.lineManager,
        phone: staffForm.phone,
      });
      
      toast.success("Staff created successfully! Login credentials sent to email.");
      setStaffForm({ firstName: "", lastName: "", email: "", department: "", lineManager: "", phone: "" });
      
      // Refresh the table to show new staff
      await fetchData(pagination.page);
    } catch (error: any) {
      toast.error(error.message || "Failed to create staff");
    }
  };

  const handleSearch = () => {
    fetchData(1);
  };

  const handleReset = () => {
    setSearchFilters({
      name: "",
      email: "",
      phoneNumber: "",
      accountStatus: "",
    });
    fetchData(1);
  };

  // Open Suspend Modal
  const handleSuspend = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSuspendTarget({ id, name });
    setSuspendModalOpen(true);
  };

  // Confirm Suspend
  const confirmSuspend = async () => {
    if (!suspendTarget || !suspendReason.trim()) {
      toast.error("Please enter a suspension reason");
      return;
    }
    
    setSuspending(true);
    try {
      switch (currentView) {
        case "Customer":
          await itService.suspendCustomer(suspendTarget.id, suspendReason);
          break;
        case "Vendor":
          await itService.suspendVendor(suspendTarget.id, suspendReason);
          break;
        case "Rider":
          await itService.suspendRider(suspendTarget.id, suspendReason);
          break;
        case "Admin":
        case "Staff":
          await itService.suspendStaff(suspendTarget.id, suspendReason); // ✅ CORRECT ENDPOINT
          break;
      }
      
      toast.success("Account suspended successfully");
      setSuspendModalOpen(false);
      setSuspendTarget(null);
      setSuspendReason("");
      fetchData(pagination.page); // ✅ AUTO REFETCH
    } catch (error: any) {
      toast.error(error.message || "Failed to suspend account");
    } finally {
      setSuspending(false);
    }
  };

  // Open Delete Modal
  const handleDelete = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteTarget({ id, name });
    setDeleteModalOpen(true);
  };

  // Confirm Delete
  const confirmDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      switch (currentView) {
        case "Customer":
          await itService.deleteCustomer(deleteTarget.id);
          break;
        case "Vendor":
          await itService.deleteVendor(deleteTarget.id);
          break;
        case "Rider":
          await itService.deleteRider(deleteTarget.id);
          break;
        case "Admin":
        case "Staff":
          await itService.deleteStaff(deleteTarget.id);
          break;
      }

      toast.success("Account deleted successfully");
      setDeleteModalOpen(false);
      setDeleteTarget(null);
      fetchData(pagination.page); // ✅ AUTO REFETCH
    } catch (error: any) {
      toast.error(error.message || "Failed to delete account");
    } finally {
      setDeleting(false);
    }
  };

  const handleRowClick = (id: string) => {
    const type = currentView === "Admin" ? "staff" : currentView.toLowerCase();
    router.push(`/it/admin/${id}?type=${type}`);
  };

  const handlePageSizeChange = (size: number) => {
    setPagination({ ...pagination, limit: size, page: 1 });
    setTimeout(() => fetchData(1), 0);
  };

  // CSV Export Handler
  const handleExportCSV = () => {
    if (data.length === 0) {
      toast.error("No data to export");
      return;
    }

    exportToCSV({
      filename: `${currentView.toLowerCase()}_accounts`,
      data: data,
      entityType: currentView === "Admin" ? "staff" : currentView.toLowerCase() as any,
      includeEntityTypeColumn: false,
    });

    toast.success("CSV exported successfully");
  };

  return (
    <div className="space-y-6">
      {/* Header with Dropdown */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Admin</h1>
        
        <Select value={currentView} onValueChange={(value) => setCurrentView(value as ViewType)}>
          <SelectTrigger 
            className="w-48"
            style={{ backgroundColor: '#98ef9b' }}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Admin">Admin</SelectItem>
            <SelectItem value="Staff">Staff</SelectItem>
            <SelectItem value="Customer">Customer</SelectItem>
            <SelectItem value="Vendor">Vendor</SelectItem>
            <SelectItem value="Rider">Rider</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Admin Creation Form */}
      {currentView === "Admin" && (
        <Card className="border shadow-sm">
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-4">Create New Admin</h2>
            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="adminFirstName">First Name *</Label>
                  <Input
                    id="adminFirstName"
                    value={adminForm.firstName}
                    onChange={(e) => setAdminForm({ ...adminForm, firstName: e.target.value })}
                    placeholder="Enter first name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="adminLastName">Last Name *</Label>
                  <Input
                    id="adminLastName"
                    value={adminForm.lastName}
                    onChange={(e) => setAdminForm({ ...adminForm, lastName: e.target.value })}
                    placeholder="Enter last name"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="adminEmail">Email *</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    value={adminForm.email}
                    onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                    placeholder="Enter email"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="adminDepartment">Department *</Label>
                  <Select 
                    value={adminForm.department} 
                    onValueChange={(value) => setAdminForm({ ...adminForm, department: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPARTMENTS.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  type="submit"
                  style={{ backgroundColor: '#1a3f1c' }}
                  className="text-white hover:opacity-90"
                >
                  Create Admin
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => setAdminForm({ firstName: "", lastName: "", email: "", department: "" })}
                >
                  Clear
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Staff Creation Form */}
      {currentView === "Staff" && (
        <Card className="border shadow-sm">
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-4">Create New Staff</h2>
            <form onSubmit={handleCreateStaff} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="staffFirstName">First Name *</Label>
                  <Input
                    id="staffFirstName"
                    value={staffForm.firstName}
                    onChange={(e) => setStaffForm({ ...staffForm, firstName: e.target.value })}
                    placeholder="Enter first name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="staffLastName">Last Name *</Label>
                  <Input
                    id="staffLastName"
                    value={staffForm.lastName}
                    onChange={(e) => setStaffForm({ ...staffForm, lastName: e.target.value })}
                    placeholder="Enter last name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="staffEmail">Email *</Label>
                  <Input
                    id="staffEmail"
                    type="email"
                    value={staffForm.email}
                    onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                    placeholder="Enter email"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="staffDepartment">Department *</Label>
                  <Select 
                    value={staffForm.department} 
                    onValueChange={(value) => setStaffForm({ ...staffForm, department: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPARTMENTS.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="staffLineManager">Line Manager *</Label>
                  <Select 
                    value={staffForm.lineManager} 
                    onValueChange={(value) => setStaffForm({ ...staffForm, lineManager: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select line manager" />
                    </SelectTrigger>
                    <SelectContent>
                      {admins.map((admin) => (
                        <SelectItem key={admin._id} value={admin._id}>
                          {admin.firstName} {admin.lastName} ({admin.department})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="staffPhone">Phone Number</Label>
                  <Input
                    id="staffPhone"
                    value={staffForm.phone}
                    onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  type="submit"
                  style={{ backgroundColor: '#1a3f1c' }}
                  className="text-white hover:opacity-90"
                >
                  Create Staff
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => setStaffForm({ firstName: "", lastName: "", email: "", department: "", lineManager: "", phone: "" })}
                >
                  Clear
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Search Form (for Customer/Vendor/Rider only) */}
      {(currentView === "Customer" || currentView === "Vendor" || currentView === "Rider") && (
        <Card className="border shadow-sm">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={searchFilters.name}
                  onChange={(e) => setSearchFilters({ ...searchFilters, name: e.target.value })}
                  placeholder="Search by name"
                />
              </div>
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={searchFilters.email}
                  onChange={(e) => setSearchFilters({ ...searchFilters, email: e.target.value })}
                  placeholder="Search by email"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={searchFilters.phoneNumber}
                  onChange={(e) => setSearchFilters({ ...searchFilters, phoneNumber: e.target.value })}
                  placeholder="Search by phone"
                />
              </div>
            </div>

            <div className="mb-4">
              <Label htmlFor="accountStatus">Account Status</Label>
              <Input
                id="accountStatus"
                value={searchFilters.accountStatus}
                onChange={(e) => setSearchFilters({ ...searchFilters, accountStatus: e.target.value })}
                placeholder="Account Status"
              />
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleSearch}
                style={{ backgroundColor: '#1a3f1c' }}
                className="text-white hover:opacity-90"
              >
                Search
              </Button>
              <Button 
                onClick={handleReset}
                variant="outline"
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* CSV Export Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleExportCSV}
          variant="outline"
          className="gap-2"
          disabled={loading || data.length === 0}
        >
          <Download className="h-4 w-4" />
          Export as CSV
        </Button>
      </div>

      {/* Table */}
      <Card className="border shadow-sm" style={{ backgroundColor: '#e8f7e8' }}>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: '#98ef9b' }}>
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#1a3f1c]">S/N</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#1a3f1c]">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#1a3f1c]">Email</th>
                  {(currentView === "Admin" || currentView === "Staff") && (
                    <>
                      <th className="px-4 py-3 text-left text-sm font-medium text-[#1a3f1c]">Department</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-[#1a3f1c]">Line Manager</th>
                    </>
                  )}
                  {currentView === "Customer" && (
                    <>
                      <th className="px-4 py-3 text-left text-sm font-medium text-[#1a3f1c]">Address</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-[#1a3f1c]">Status of Account</th>
                    </>
                  )}
                  {currentView === "Vendor" && (
                    <>
                      <th className="px-4 py-3 text-left text-sm font-medium text-[#1a3f1c]">Delivery Type</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-[#1a3f1c]">Address</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-[#1a3f1c]">Status of Account</th>
                    </>
                  )}
                  {currentView === "Rider" && (
                    <>
                      <th className="px-4 py-3 text-left text-sm font-medium text-[#1a3f1c]">Phone</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-[#1a3f1c]">Rating</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-[#1a3f1c]">Zone</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-[#1a3f1c]">Status</th>
                    </>
                  )}
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#1a3f1c]">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {loading ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-8 text-center">
                      <div className="w-8 h-8 border-4 border-[#1a3f1c] border-t-transparent rounded-full animate-spin mx-auto" />
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-8 text-center text-gray-500">
                      No {currentView.toLowerCase()} found
                    </td>
                  </tr>
                ) : (
                  data.map((item: any, index) => {
                    const name = (currentView === "Admin" || currentView === "Staff" || currentView === "Rider") 
                      ? `${item.firstName} ${item.lastName}`
                      : currentView === "Vendor"
                      ? item.ownerName || item.businessName
                      : item.name || `${item.firstName} ${item.lastName}`;
                    
                    return (
                      <tr 
                        key={item._id} 
                        className="border-t hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleRowClick(item._id)}
                      >
                        <td className="px-4 py-3 text-sm">
                          {((pagination?.page || 1) - 1) * (pagination?.limit || 7) + index + 1}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium hover:text-[#1a3f1c] hover:underline">
                          {name}
                        </td>
                        <td className="px-4 py-3 text-sm">{item.email}</td>
                        {(currentView === "Admin" || currentView === "Staff") && (
                          <>
                            <td className="px-4 py-3 text-sm capitalize">{item.department}</td>
                            <td className="px-4 py-3 text-sm">
                              {item.lineManager 
                                ? typeof item.lineManager === 'object'
                                  ? `${item.lineManager.firstName} ${item.lineManager.lastName}`
                                  : item.lineManager
                                : item.isSuperAdmin ? 'Super Admin' : '-'}
                            </td>
                          </>
                        )}
                        {currentView === "Customer" && (
                          <>
                            <td className="px-4 py-3 text-sm">{item.address || '-'}</td>
                            <td className="px-4 py-3 text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs ${item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {item.isActive ? 'Active' : 'Suspended'}
                              </span>
                            </td>
                          </>
                        )}
                        {currentView === "Vendor" && (
                          <>
                            <td className="px-4 py-3 text-sm">{item.deliveryType || 'Hybrid'}</td>
                            <td className="px-4 py-3 text-sm">{item.address?.street || '-'}</td>
                            <td className="px-4 py-3 text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs ${item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {item.isActive ? 'Active' : 'Suspended'}
                              </span>
                            </td>
                          </>
                        )}
                        {currentView === "Rider" && (
                          <>
                            <td className="px-4 py-3 text-sm">{item.phone}</td>
                            <td className="px-4 py-3 text-sm">{item.rating?.toFixed(1) || '0.0'} ⭐</td>
                            <td className="px-4 py-3 text-sm">{item.zone || '-'}</td>
                            <td className="px-4 py-3 text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs ${item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {item.isActive ? 'Active' : 'Suspended'}
                              </span>
                            </td>
                          </>
                        )}
                        <td className="px-4 py-3">
                          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRowClick(item._id);
                              }}
                              className="p-2 rounded-full"
                              style={{ backgroundColor: '#1a3f1c' }}
                              title="View"
                            >
                              <Eye className="h-4 w-4 text-white" />
                            </button>
                            <button
                              onClick={(e) => handleSuspend(item._id, name, e)}
                              className="p-2 bg-[#ffca3a] rounded-full"
                              title="Suspend"
                            >
                              <Lock className="h-4 w-4 text-[#1a3f1c]" />
                            </button>
                            <button
                              onClick={(e) => handleDelete(item._id, name, e)}
                              className="p-2 bg-red-500 rounded-full"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4 text-white" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {!loading && data.length > 0 && pagination && (
            <Pagination
              currentPage={pagination.page || 1}
              totalPages={pagination.pages || 1}
              pageSize={pagination.limit || 7}
              onPageChange={(page) => fetchData(page)}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </CardContent>
      </Card>

      {/* Suspend Confirmation Modal */}
      <Dialog open={suspendModalOpen} onOpenChange={setSuspendModalOpen}>
        <DialogContent className="sm:max-w-md bg-[#4B8A4E] text-white md:p-8">
          <DialogHeader>
            <DialogTitle className="text-xl">Suspend Account</DialogTitle>
            <DialogDescription className="text-base pt-2">
              You are about to suspend:
              <br />
              <span className="font-semibold text-gray-900 mt-1 block">{suspendTarget?.name}</span>
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Label htmlFor="suspendReason" className="mb-2 block">
              Suspension Reason *
            </Label>
            <Textarea
              id="suspendReason"
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
              placeholder="Enter reason for suspension..."
              rows={4}
              className="w-full"
            />
          </div>

          <DialogFooter className="flex-row gap-3 sm:gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setSuspendModalOpen(false);
                setSuspendReason("");
              }}
              disabled={suspending}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmSuspend}
              disabled={suspending || !suspendReason.trim()}
              className="flex-1"
              style={{ backgroundColor: '#ffca3a', color: '#1a3f1c' }}
            >
              {suspending ? (
                <div className="w-4 h-4 border-2 border-[#1a3f1c] border-t-transparent rounded-full animate-spin" />
              ) : (
                'Yes, Suspend'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-md bg-[#4B8A4E] text-white md:p-8">
          <DialogHeader>
            <DialogTitle className="text-xl">Delete Account</DialogTitle>
            <DialogDescription className="text-base pt-4">
              Are you sure you want to delete this account?
              <br />
              <span className="font-semibold text-gray-900 mt-2 block">{deleteTarget?.name}</span>
              <br />
              <span className="text-red-600 text-sm mt-2 block">
                This action will soft-delete the account. It can be restored from the Deleted Accounts section.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row gap-3 sm:gap-3">
            <Button
              variant="outline"
              onClick={() => setDeleteModalOpen(false)}
              disabled={deleting}
              className="flex-1"
            >
              No, Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              disabled={deleting}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white"
            >
              {deleting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Yes, Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}