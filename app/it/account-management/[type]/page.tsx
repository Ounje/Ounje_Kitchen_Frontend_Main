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
type EntityRole = "all" | "customer" | "vendor" | "rider" | "staff";

interface AccountsData {
  customers: any[];
  vendors: any[];
  riders: any[];
  staff: any[];
}

export default function AccountsListPage({ 
  params 
}: { 
  params: Promise<{ type: string }> 
}) {
  const { type } = use(params);
  const router = useRouter();
  const accountType = type as AccountType;
  
  const [accounts, setAccounts] = useState<AccountsData>({
    customers: [],
    vendors: [],
    riders: [],
    staff: [],
  });
  
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<EntityRole>("all");
  const [searchFilters, setSearchFilters] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });
  
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 7,
    total: 0,
    pages: 1,
  });

  // Restore Modal State
  const [restoreModalOpen, setRestoreModalOpen] = useState(false);
  const [restoreTarget, setRestoreTarget] = useState<{ id: string; name: string; entityType: string } | null>(null);
  const [restoring, setRestoring] = useState(false);

  useEffect(() => {
    fetchAccounts(1);
  }, [accountType]);

  const fetchAccounts = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: pagination.limit,
        ...searchFilters,
      };

      let result;
      if (accountType === "suspended") {
        result = await itService.getSuspendedAccounts(params);
      } else {
        result = await itService.getDeletedAccounts(params);
      }

      console.log('[Accounts List] Data:', result);
      
      const accountsData = accountType === "suspended" 
        ? result.suspendedAccounts 
        : result.deletedAccounts;
      
      setAccounts(accountsData || { customers: [], vendors: [], riders: [], staff: [] });
      setPagination(result.pagination || { page: 1, limit: 7, total: 0, pages: 1 });
    } catch (error: any) {
      console.error('[Accounts List] Error:', error);
      toast.error(error.message || "Failed to fetch accounts");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchAccounts(1);
  };

  const handleReset = () => {
    setSearchFilters({ name: "", email: "", phoneNumber: "" });
    setSelectedRole("all");
    fetchAccounts(1);
  };

  const handleViewDetails = (id: string, entityType: string) => {
    router.push(`/it/account-management/${accountType}/${id}?entityType=${entityType}&status=${accountType}`);
  };

  // Open Restore Modal
  const handleRestore = (id: string, name: string, entityType: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRestoreTarget({ id, name, entityType });
    setRestoreModalOpen(true);
  };

  // Confirm Restore
  const confirmRestore = async () => {
    if (!restoreTarget) return;

    setRestoring(true);
    try {
      switch (restoreTarget.entityType) {
        case 'customer':
          if (accountType === 'suspended') {
            await itService.activateCustomer(restoreTarget.id);
          } else {
            await itService.restoreCustomer(restoreTarget.id);
          }
          break;
        case 'vendor':
          if (accountType === 'suspended') {
            await itService.activateVendor(restoreTarget.id);
          } else {
            await itService.restoreVendor(restoreTarget.id);
          }
          break;
        case 'rider':
          if (accountType === 'suspended') {
            await itService.activateRider(restoreTarget.id);
          } else {
            await itService.restoreRider(restoreTarget.id);
          }
          break;
        case 'staff':
          if (accountType === 'suspended') {
            await itService.activateStaff(restoreTarget.id);
          } else {
            await itService.restoreStaff(restoreTarget.id);
          }
          break;
      }

      toast.success(`Account ${accountType === 'suspended' ? 'activated' : 'restored'} successfully`);
      setRestoreModalOpen(false);
      setRestoreTarget(null);
      fetchAccounts(pagination.page); // ✅ AUTO REFETCH
    } catch (error: any) {
      toast.error(error.message || `Failed to ${accountType === 'suspended' ? 'activate' : 'restore'} account`);
    } finally {
      setRestoring(false);
    }
  };

  // CSV Export Handler
  const handleExportCSV = () => {
    exportMixedAccounts(accounts, accountType);
  };

  const renderAccountTable = (accountList: any[], entityType: string) => {
    if (accountList.length === 0) return null;

    return (
      <div className="mb-8">
        <div className="px-4 md:px-6 py-4 bg-[#98ef9b] border-b">
          <h3 className="text-lg font-semibold text-[#1a3f1c] capitalize">
            {entityType}s ({accountList.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: '#e8f7e8' }}>
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#1a3f1c]">S/N</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#1a3f1c]">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#1a3f1c]">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#1a3f1c]">Phone Number</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#1a3f1c]">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#1a3f1c]">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {accountList.map((account, index) => {
                const name = account.firstName && account.lastName
                  ? `${account.firstName} ${account.lastName}`
                  : account.businessName || account.ownerName || account.name || 'N/A';
                
                const date = accountType === 'deleted'
                  ? account.deletedAt
                  : account.suspensionDate || account.suspendedAt || account.updatedAt;

                return (
                  <tr 
                    key={account._id} 
                    className="border-t hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleViewDetails(account._id, entityType)}
                  >
                    <td className="px-4 py-3 text-sm">
                      {((pagination.page - 1) * pagination.limit) + index + 1}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{name}</td>
                    <td className="px-4 py-3 text-sm">{account.email}</td>
                    <td className="px-4 py-3 text-sm">{account.phone || account.phoneNumber || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm">
                      {date ? new Date(date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) : 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => handleRestore(account._id, name, entityType, e)}
                          className="p-2 rounded-full hover:bg-green-100 transition-colors"
                          style={{ backgroundColor: '#98ef9b' }}
                          title={accountType === 'suspended' ? 'Activate Account' : 'Restore Account'}
                        >
                          <RotateCcw className="h-4 w-4 text-[#1a3f1c]" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(account._id, entityType);
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

  const getFilteredAccounts = () => {
    if (selectedRole === "all") {
      return accounts;
    }
    return {
      customers: selectedRole === "customer" ? accounts.customers : [],
      vendors: selectedRole === "vendor" ? accounts.vendors : [],
      riders: selectedRole === "rider" ? accounts.riders : [],
      staff: selectedRole === "staff" ? accounts.staff : [],
    };
  };

  const filteredAccounts = getFilteredAccounts();
  const totalAccounts = Object.values(filteredAccounts).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => router.push('/it/account-management')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {accountType === 'suspended' ? 'Suspended' : 'Deleted'} Accounts
          </h1>
          <p className="text-sm md:text-base text-gray-500 mt-1">
            {totalAccounts} account{totalAccounts !== 1 ? 's' : ''} found
          </p>
        </div>
      </div>

      {/* Search/Filter Form */}
      <Card className="border shadow-sm">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Search & Filter</h2>
            
            {/* CSV Export Button */}
            <Button
              onClick={handleExportCSV}
              variant="outline"
              className="gap-2"
              disabled={loading || totalAccounts === 0}
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
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
              <Label htmlFor="email">Email</Label>
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
            
            <div>
              <Label htmlFor="role">Account Role</Label>
              <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as EntityRole)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
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

      {/* Accounts Tables */}
      <Card className="border shadow-sm" style={{ backgroundColor: '#e8f7e8' }}>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-12 h-12 border-4 border-[#1a3f1c] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : totalAccounts === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No {accountType} accounts found
              </p>
            </div>
          ) : (
            <>
              {filteredAccounts.customers.length > 0 && renderAccountTable(filteredAccounts.customers, 'customer')}
              {filteredAccounts.vendors.length > 0 && renderAccountTable(filteredAccounts.vendors, 'vendor')}
              {filteredAccounts.riders.length > 0 && renderAccountTable(filteredAccounts.riders, 'rider')}
              {filteredAccounts.staff.length > 0 && renderAccountTable(filteredAccounts.staff, 'staff')}

              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.pages}
                pageSize={pagination.limit}
                onPageChange={(page) => fetchAccounts(page)}
                onPageSizeChange={(size) => {
                  setPagination({ ...pagination, limit: size, page: 1 });
                  setTimeout(() => fetchAccounts(1), 0);
                }}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Restore Confirmation Modal */}
      <Dialog open={restoreModalOpen} onOpenChange={setRestoreModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {accountType === 'suspended' ? 'Activate Account' : 'Restore Account'}
            </DialogTitle>
            <DialogDescription className="text-base pt-4">
              Are you sure you want to {accountType === 'suspended' ? 'activate' : 'restore'} this account?
              <br />
              <span className="font-semibold text-gray-900 mt-2 block">{restoreTarget?.name}</span>
              <br />
              {accountType === 'deleted' && (
                <span className="text-green-600 text-sm mt-2 block">
                  This will restore the account and make it active again.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row gap-3 sm:gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setRestoreModalOpen(false);
                setRestoreTarget(null);
              }}
              disabled={restoring}
              className="flex-1"
            >
              No, Cancel
            </Button>
            <Button
              onClick={confirmRestore}
              disabled={restoring}
              className="flex-1"
              style={{ backgroundColor: '#1a3f1c' }}
            >
              {restoring ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                `Yes, ${accountType === 'suspended' ? 'Activate' : 'Restore'}`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}