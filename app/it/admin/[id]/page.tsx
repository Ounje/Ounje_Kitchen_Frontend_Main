"use client";

import { use, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { itService } from "@/lib/api/services/it.service";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Building, User, Shield } from "lucide-react";
import { toast } from "sonner";

// Reusable Info Row Component
const InfoRow = ({ label, value, icon: Icon }: { label: string; value: string | number; icon?: any }) => (
  <div className="flex items-start gap-3 py-2">
    {Icon && (
      <div className="mt-0.5 text-[#1a3f1c]">
        <Icon className="h-4 w-4" />
      </div>
    )}
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-sm font-medium text-gray-900 break-words">{value || 'N/A'}</p>
    </div>
  </div>
);

// Reusable Stats Card Component
const StatCard = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="p-4 md:p-6 rounded-lg text-center" style={{ backgroundColor: color }}>
    <p className="text-2xl md:text-3xl font-bold text-white">{value}</p>
    <p className="text-xs md:text-sm mt-1 text-white/90">{label}</p>
  </div>
);

// Admin Detail Component
const AdminDetail = ({ data }: { data: any }) => (
  <div className="space-y-4 md:space-y-6">
    {/* Basic Info Card */}
    <Card className="border shadow-sm">
      <CardContent className="p-4 md:p-6">
        <h2 className="text-lg font-semibold mb-4 text-[#1a3f1c]">Admin Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoRow label="Full Name" value={`${data.firstName} ${data.lastName}`} icon={User} />
          <InfoRow label="Email" value={data.email} icon={Mail} />
          <InfoRow label="Phone" value={data.phone} icon={Phone} />
          <InfoRow label="Department" value={data.department?.toUpperCase()} icon={Building} />
          <InfoRow 
            label="Role" 
            value={data.isSuperAdmin ? 'Super Admin' : data.isHead ? 'Department Head' : 'Admin'} 
            icon={Shield} 
          />
          <InfoRow 
            label="Date Joined" 
            value={new Date(data.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} 
            icon={Calendar} 
          />
        </div>
      </CardContent>
    </Card>

    {/* Status & Permissions */}
    <Card className="border shadow-sm" style={{ backgroundColor: '#98ef9b' }}>
      <CardContent className="p-4 md:p-6">
        <h2 className="text-lg font-semibold mb-4 text-[#1a3f1c]">Access & Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-[#1a3f1c]/70 uppercase tracking-wide mb-1">Account Status</p>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
              data.isActive ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
            }`}>
              {data.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div>
            <p className="text-xs text-[#1a3f1c]/70 uppercase tracking-wide mb-1">Password Status</p>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
              data.mustChangePassword ? 'bg-yellow-600 text-white' : 'bg-blue-600 text-white'
            }`}>
              {data.mustChangePassword ? 'Must Change' : 'Set'}
            </span>
          </div>
          <div>
            <p className="text-xs text-[#1a3f1c]/70 uppercase tracking-wide mb-1">Super Admin</p>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
              data.isSuperAdmin ? 'bg-purple-600 text-white' : 'bg-gray-400 text-white'
            }`}>
              {data.isSuperAdmin ? 'Yes' : 'No'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

// Staff Detail Component
const StaffDetail = ({ data }: { data: any }) => (
  <div className="space-y-4 md:space-y-6">
    {/* Basic Info Card */}
    <Card className="border shadow-sm">
      <CardContent className="p-4 md:p-6">
        <h2 className="text-lg font-semibold mb-4 text-[#1a3f1c]">Staff Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoRow label="Full Name" value={`${data.firstName} ${data.lastName}`} icon={User} />
          <InfoRow label="Email" value={data.email} icon={Mail} />
          <InfoRow label="Phone" value={data.phone} icon={Phone} />
          <InfoRow label="Department" value={data.department?.toUpperCase()} icon={Building} />
          <InfoRow 
            label="Line Manager" 
            value={
              data.lineManager 
                ? typeof data.lineManager === 'object'
                  ? `${data.lineManager.firstName} ${data.lineManager.lastName}`
                  : data.lineManager
                : 'Not Assigned'
            } 
            icon={User} 
          />
          <InfoRow 
            label="Date Joined" 
            value={new Date(data.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} 
            icon={Calendar} 
          />
        </div>
      </CardContent>
    </Card>

    {/* Employment Details */}
    <Card className="border shadow-sm" style={{ backgroundColor: '#98ef9b' }}>
      <CardContent className="p-4 md:p-6">
        <h2 className="text-lg font-semibold mb-4 text-[#1a3f1c]">Employment Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-[#1a3f1c]/70 uppercase tracking-wide mb-1">Status</p>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
              data.isActive ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
            }`}>
              {data.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div>
            <p className="text-xs text-[#1a3f1c]/70 uppercase tracking-wide mb-1">Year Joined</p>
            <p className="text-sm font-semibold text-[#1a3f1c]">
              {new Date(data.createdAt).getFullYear()}
            </p>
          </div>
          <div>
            <p className="text-xs text-[#1a3f1c]/70 uppercase tracking-wide mb-1">Employee ID</p>
            <p className="text-sm font-semibold text-[#1a3f1c] font-mono">
              {data._id?.slice(-8).toUpperCase()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

// Customer Detail Component
const CustomerDetail = ({ data }: { data: any }) => (
  <div className="space-y-4 md:space-y-6">
    {/* Basic Info Card */}
    <Card className="border shadow-sm">
      <CardContent className="p-4 md:p-6">
        <h2 className="text-lg font-semibold mb-4 text-[#1a3f1c]">Customer Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoRow label="Full Name" value={data.name || `${data.firstName} ${data.lastName}`} icon={User} />
          <InfoRow label="Email" value={data.email} icon={Mail} />
          <InfoRow label="Phone" value={data.phone || data.phoneNumber} icon={Phone} />
          <InfoRow label="Address" value={data.address} icon={MapPin} />
          <InfoRow 
            label="Member Since" 
            value={new Date(data.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} 
            icon={Calendar} 
          />
          <InfoRow label="Customer ID" value={`#${data._id?.slice(-8).toUpperCase()}`} />
        </div>
      </CardContent>
    </Card>

    {/* Order Statistics */}
    <div>
      <h2 className="text-lg font-semibold mb-4">Order Statistics</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatCard label="Total Orders" value={240} color="#1a3f1c" />
        <StatCard label="Completed" value={230} color="#10b981" />
        <StatCard label="Pending" value={7} color="#f59e0b" />
        <StatCard label="Cancelled" value={3} color="#ef4444" />
      </div>
    </div>

    {/* Most Used Vendor */}
    <Card className="border shadow-sm" style={{ backgroundColor: '#1a3f1c' }}>
      <CardContent className="p-4 md:p-6">
        <h3 className="text-white font-semibold mb-4">Most Frequent Vendor</h3>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
            <span className="text-xl md:text-2xl">🍽️</span>
          </div>
          <div className="text-white flex-1 min-w-0">
            <p className="font-semibold text-sm md:text-base">Iya Bolu Restaurant</p>
            <p className="flex items-center gap-1 text-xs md:text-sm text-white/80">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">123 Simpson Avenue, Yaba</span>
            </p>
            <p className="text-xl md:text-2xl font-bold mt-2">30 <span className="text-sm font-normal">orders</span></p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

// Vendor Detail Component
const VendorDetail = ({ data }: { data: any }) => (
  <div className="space-y-4 md:space-y-6">
    {/* Basic Info Card */}
    <Card className="border shadow-sm">
      <CardContent className="p-4 md:p-6">
        <h2 className="text-lg font-semibold mb-4 text-[#1a3f1c]">Vendor Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoRow label="Business Name" value={data.businessName} icon={Building} />
          <InfoRow label="Owner Name" value={data.ownerName} icon={User} />
          <InfoRow label="Email" value={data.email} icon={Mail} />
          <InfoRow label="Phone" value={data.phone || data.phoneNumber} icon={Phone} />
          <InfoRow label="Address" value={data.address?.street || data.address} icon={MapPin} />
          <InfoRow label="Delivery Type" value={data.deliveryType || 'Hybrid'} />
          <InfoRow 
            label="Joined Date" 
            value={new Date(data.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} 
            icon={Calendar} 
          />
          <InfoRow label="Vendor ID" value={`#${data._id?.slice(-8).toUpperCase()}`} />
        </div>
      </CardContent>
    </Card>

    {/* Verification Status */}
    <Card className="border shadow-sm" style={{ backgroundColor: '#98ef9b' }}>
      <CardContent className="p-4 md:p-6">
        <h2 className="text-lg font-semibold mb-4 text-[#1a3f1c]">Account Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-[#1a3f1c]/70 uppercase tracking-wide mb-1">Active Status</p>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
              data.isActive ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
            }`}>
              {data.isActive ? 'Active' : 'Suspended'}
            </span>
          </div>
          <div>
            <p className="text-xs text-[#1a3f1c]/70 uppercase tracking-wide mb-1">Verification</p>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
              data.isVerified ? 'bg-blue-600 text-white' : 'bg-yellow-600 text-white'
            }`}>
              {data.isVerified ? 'Verified' : 'Pending'}
            </span>
          </div>
          <div>
            <p className="text-xs text-[#1a3f1c]/70 uppercase tracking-wide mb-1">Delivery Type</p>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-purple-600 text-white">
              {data.deliveryType || 'Hybrid'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Order Statistics */}
    <div>
      <h2 className="text-lg font-semibold mb-4">Order Statistics</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatCard label="Total Orders" value={340} color="#1a3f1c" />
        <StatCard label="Completed" value={330} color="#10b981" />
        <StatCard label="In Progress" value={7} color="#f59e0b" />
        <StatCard label="Cancelled" value={3} color="#ef4444" />
      </div>
    </div>

    {/* Most Frequent Buyer */}
    <Card className="border shadow-sm" style={{ backgroundColor: '#1a3f1c' }}>
      <CardContent className="p-4 md:p-6">
        <h3 className="text-white font-semibold mb-4">Top Customer</h3>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
            <span className="text-xl md:text-2xl">👤</span>
          </div>
          <div className="text-white flex-1 min-w-0">
            <p className="font-semibold text-sm md:text-base">Madu South</p>
            <p className="flex items-center gap-1 text-xs md:text-sm text-white/80">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">123 Old Simpson Avenue, Yaba</span>
            </p>
            <p className="text-xl md:text-2xl font-bold mt-2">45 <span className="text-sm font-normal">orders</span></p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

// Rider Detail Component
const RiderDetail = ({ data }: { data: any }) => (
  <div className="space-y-4 md:space-y-6">
    {/* Basic Info Card */}
    <Card className="border shadow-sm">
      <CardContent className="p-4 md:p-6">
        <h2 className="text-lg font-semibold mb-4 text-[#1a3f1c]">Rider Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoRow label="Full Name" value={`${data.firstName} ${data.lastName}`} icon={User} />
          <InfoRow label="Email" value={data.email} icon={Mail} />
          <InfoRow label="Phone" value={data.phone || data.phoneNumber} icon={Phone} />
          <InfoRow label="Zone" value={data.zone} icon={MapPin} />
          <InfoRow label="Rating" value={`${data.rating?.toFixed(1) || '0.0'} ⭐`} />
          <InfoRow label="Vehicle Type" value={data.vehicleType || 'Motorcycle'} />
          <InfoRow 
            label="Joined Date" 
            value={new Date(data.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} 
            icon={Calendar} 
          />
          <InfoRow label="Rider ID" value={`#${data._id?.slice(-8).toUpperCase()}`} />
        </div>
      </CardContent>
    </Card>

    {/* Rider Status */}
    <Card className="border shadow-sm" style={{ backgroundColor: '#98ef9b' }}>
      <CardContent className="p-4 md:p-6">
        <h2 className="text-lg font-semibold mb-4 text-[#1a3f1c]">Rider Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-[#1a3f1c]/70 uppercase tracking-wide mb-1">Active Status</p>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
              data.isActive ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
            }`}>
              {data.isActive ? 'Active' : 'Suspended'}
            </span>
          </div>
          <div>
            <p className="text-xs text-[#1a3f1c]/70 uppercase tracking-wide mb-1">Verification</p>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
              data.isVerified ? 'bg-blue-600 text-white' : 'bg-yellow-600 text-white'
            }`}>
              {data.isVerified ? 'Verified' : 'Pending'}
            </span>
          </div>
          <div>
            <p className="text-xs text-[#1a3f1c]/70 uppercase tracking-wide mb-1">Availability</p>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-600 text-white">
              Available
            </span>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Delivery Statistics */}
    <div>
      <h2 className="text-lg font-semibold mb-4">Delivery Statistics</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatCard label="Total Deliveries" value={456} color="#1a3f1c" />
        <StatCard label="Completed" value={450} color="#10b981" />
        <StatCard label="In Transit" value={4} color="#f59e0b" />
        <StatCard label="Failed" value={2} color="#ef4444" />
      </div>
    </div>

    {/* Most Frequent Zone */}
    <Card className="border shadow-sm" style={{ backgroundColor: '#1a3f1c' }}>
      <CardContent className="p-4 md:p-6">
        <h3 className="text-white font-semibold mb-4">Most Frequent Delivery Zone</h3>
        <div className="bg-white/10 rounded-lg p-4">
          <p className="text-white text-lg md:text-xl font-semibold">{data.zone || 'Yaba, Ikeja Lagos'}</p>
          <p className="text-white/80 text-sm mt-2">
            <span className="text-2xl md:text-3xl font-bold text-white">287</span> deliveries
          </p>
        </div>
      </CardContent>
    </Card>
  </div>
);

// Main Detail Page Component
export default function EntityDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") as "staff" | "customer" | "vendor" | "rider";

  const [entity, setEntity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        let data;
        switch (type) {
          case "staff":
            data = await itService.getStaffMember(id);
            // Check if this staff member is actually an admin
            setIsAdmin(data.isHead || data.isSuperAdmin);
            break;
          case "customer":
            data = await itService.getCustomer(id);
            break;
          case "vendor":
            data = await itService.getVendor(id);
            break;
          case "rider":
            data = await itService.getRider(id);
            break;
        }
        setEntity(data);
      } catch (error: any) {
        toast.error(error.message || "Failed to load details");
      } finally {
        setLoading(false);
      }
    };

    if (id && type) {
      fetchDetails();
    }
  }, [id, type]);

  const handleSuspend = async () => {
    const reason = prompt("Enter suspension reason:");
    if (!reason) return;

    try {
      switch (type) {
        case "customer":
          await itService.suspendCustomer(id, reason);
          break;
        case "vendor":
          await itService.suspendVendor(id, reason);
          break;
        case "rider":
          await itService.suspendRider(id, reason);
          break;
        case "staff":
          await itService.deactivateStaff(id);
          break;
      }
      toast.success("Account suspended successfully");
      router.push("/it/admin");
    } catch (error: any) {
      toast.error(error.message || "Failed to suspend account");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this account?")) return;

    try {
      switch (type) {
        case "customer":
          await itService.deleteCustomer(id);
          break;
        case "vendor":
          await itService.deleteVendor(id);
          break;
        case "rider":
          await itService.deleteRider(id);
          break;
        case "staff":
          await itService.deleteStaff(id);
          break;
      }
      toast.success("Account deleted successfully");
      router.push("/it/admin");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete account");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-[#1a3f1c] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!entity) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <p className="text-gray-500 mb-4">Entity not found</p>
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  const getName = () => {
    if (type === "staff" || type === "rider") {
      return `${entity.firstName} ${entity.lastName}`;
    }
    if (type === "vendor") {
      return entity.businessName || entity.ownerName;
    }
    return entity.name || `${entity.firstName} ${entity.lastName}`;
  };

  const getTitle = () => {
    if (type === "staff" && isAdmin) return "Admin Details";
    if (type === "staff") return "Staff Details";
    if (type === "customer") return "Customer Details";
    if (type === "vendor") return "Vendor Details";
    if (type === "rider") return "Rider Details";
    return "Details";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-4 md:space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="gap-2 hover:bg-gray-100"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Back to List</span>
          <span className="sm:hidden">Back</span>
        </Button>

        {/* Header Card */}
        <Card className="border shadow-sm" style={{ backgroundColor: '#e8f7e8' }}>
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Profile Initial */}
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#1a3f1c] flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-2xl md:text-3xl font-bold">
                    {getName().split(' ').map(n => n[0]).join('').substring(0, 2)}
                  </span>
                </div>
                
                {/* Name & Title */}
                <div className="min-w-0">
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900 break-words">
                    {getName()}
                  </h1>
                  <p className="text-sm md:text-base text-gray-600 mt-1">{getTitle()}</p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="w-full sm:w-auto">
                <span className={`inline-block px-4 py-2 rounded-lg text-sm font-semibold w-full sm:w-auto text-center ${
                  entity.isActive 
                    ? 'bg-green-600 text-white' 
                    : 'bg-red-600 text-white'
                }`}>
                  {entity.isActive ? 'Active' : 'Suspended'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dynamic Content Based on Entity Type */}
        {type === "staff" && isAdmin && <AdminDetail data={entity} />}
        {type === "staff" && !isAdmin && <StaffDetail data={entity} />}
        {type === "customer" && <CustomerDetail data={entity} />}
        {type === "vendor" && <VendorDetail data={entity} />}
        {type === "rider" && <RiderDetail data={entity} />}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 sticky bottom-4 bg-white p-4 rounded-lg shadow-lg border">
          <Button
            onClick={handleSuspend}
            className="w-full"
            style={{ backgroundColor: '#ffca3a', color: '#1a3f1c' }}
          >
            {entity.isActive ? 'Suspend Account' : 'Activate Account'}
          </Button>
          <Button
            onClick={handleDelete}
            className="w-full bg-red-500 hover:bg-red-600 text-white"
          >
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
}