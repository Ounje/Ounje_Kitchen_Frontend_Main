"use client";

import { use, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { itService } from "@/lib/api/services/it.service";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Building, User, Shield } from "lucide-react";
import { toast } from "sonner";

// ── Helpers ───────────────────────────────────────────────────────────────────
// Backend wraps single records as: { success, data: { customer/vendor/rider: {...} } }
function unwrap(res: any, entityType?: string): any {
  if (!res) return null;
  const d = res?.data ?? res;

  // Named key from IT controllers: getCustomer → { data: { customer: {...} } }
  if (entityType === "customer" && d?.customer) return d.customer;
  if (entityType === "vendor"   && d?.vendor)   return d.vendor;
  if (entityType === "rider"    && d?.rider)    return d.rider;
  if (entityType === "staff"    && (d?.staff || d?.admin)) return d.staff ?? d.admin;

  // Fallback: if d is a non-list object, return it directly
  if (d && typeof d === 'object' && !Array.isArray(d)) return d;
  return res;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 'N/A';
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

// ── Sub-components ────────────────────────────────────────────────────────────
const InfoRow = ({ label, value, icon: Icon }: { label: string; value?: string | number; icon?: any }) => (
  <div className="flex items-start gap-3 py-2">
    {Icon && <div className="mt-0.5 text-[#1a3f1c]"><Icon className="h-4 w-4" /></div>}
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-sm font-medium text-gray-900 break-words">{value || 'N/A'}</p>
    </div>
  </div>
);

const StatCard = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="p-4 md:p-6 rounded-lg text-center" style={{ backgroundColor: color }}>
    <p className="text-2xl md:text-3xl font-bold text-white">{value}</p>
    <p className="text-xs md:text-sm mt-1 text-white/90">{label}</p>
  </div>
);

const Badge = ({ active, activeLabel = 'Active', inactiveLabel = 'Inactive' }: { active: boolean; activeLabel?: string; inactiveLabel?: string }) => (
  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${active ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
    {active ? activeLabel : inactiveLabel}
  </span>
);

// ── Detail sections ───────────────────────────────────────────────────────────
const StaffDetail = ({ data, isAdmin }: { data: any; isAdmin: boolean }) => (
  <div className="space-y-4 md:space-y-6">
    <Card className="border shadow-sm">
      <CardContent className="p-4 md:p-6">
        <h2 className="text-lg font-semibold mb-4 text-[#1a3f1c]">{isAdmin ? 'Admin' : 'Staff'} Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoRow label="Full Name" value={`${data.firstName ?? ''} ${data.lastName ?? ''}`.trim()} icon={User} />
          <InfoRow label="Email" value={data.email} icon={Mail} />
          <InfoRow label="Phone" value={data.phoneNumber || data.phone} icon={Phone} />
          <InfoRow label="Department" value={data.department?.toUpperCase()} icon={Building} />
          {!isAdmin && (
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
          )}
          {isAdmin && (
            <InfoRow
              label="Role"
              value={data.isSuperAdmin ? 'Super Admin' : data.isHead ? 'Department Head' : 'Admin'}
              icon={Shield}
            />
          )}
          <InfoRow label="Date Joined" value={formatDate(data.createdAt)} icon={Calendar} />
        </div>
      </CardContent>
    </Card>

    <Card className="border shadow-sm" style={{ backgroundColor: '#98ef9b' }}>
      <CardContent className="p-4 md:p-6">
        <h2 className="text-lg font-semibold mb-4 text-[#1a3f1c]">{isAdmin ? 'Access & Status' : 'Employment Details'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-[#1a3f1c]/70 uppercase tracking-wide mb-1">Account Status</p>
            <Badge active={data.isActive} />
          </div>
          <div>
            <p className="text-xs text-[#1a3f1c]/70 uppercase tracking-wide mb-1">
              {isAdmin ? 'Password Status' : 'Year Joined'}
            </p>
            {isAdmin ? (
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${data.mustChangePassword ? 'bg-yellow-600 text-white' : 'bg-blue-600 text-white'}`}>
                {data.mustChangePassword ? 'Must Change' : 'Set'}
              </span>
            ) : (
              <p className="text-sm font-semibold text-[#1a3f1c]">{new Date(data.createdAt).getFullYear() || 'N/A'}</p>
            )}
          </div>
          <div>
            <p className="text-xs text-[#1a3f1c]/70 uppercase tracking-wide mb-1">Employee ID</p>
            <p className="text-sm font-semibold text-[#1a3f1c] font-mono">{data._id?.slice(-8).toUpperCase() || '—'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

const CustomerDetail = ({ data }: { data: any }) => {
  // Customer: user ref is populated → name/email/phone live under data.user
  const name  = data.user?.name  || data.name  || 'N/A';
  const email = data.user?.email || data.email || 'N/A';
  const phone = data.user?.phone || data.phone || data.phoneNumber || 'N/A';

  return (
    <div className="space-y-4 md:space-y-6">
      <Card className="border shadow-sm">
        <CardContent className="p-4 md:p-6">
          <h2 className="text-lg font-semibold mb-4 text-[#1a3f1c]">Customer Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoRow label="Full Name" value={name} icon={User} />
            <InfoRow label="Email" value={email} icon={Mail} />
            <InfoRow label="Phone" value={String(phone)} icon={Phone} />
            <InfoRow label="Member Since" value={formatDate(data.createdAt)} icon={Calendar} />
            <InfoRow label="Customer ID" value={`#${data._id?.slice(-8).toUpperCase()}`} />
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-lg font-semibold mb-4">Order Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <StatCard label="Total Orders" value={data.totalOrders ?? 0} color="#1a3f1c" />
          <StatCard label="Completed" value={data.completedOrders ?? 0} color="#10b981" />
          <StatCard label="Pending" value={data.pendingOrders ?? 0} color="#f59e0b" />
          <StatCard label="Cancelled" value={data.cancelledOrders ?? 0} color="#ef4444" />
        </div>
      </div>
    </div>
  );
};

const VendorDetail = ({ data }: { data: any }) => {
  // Vendor: name = business name; owner = populated user ref
  const ownerName  = data.owner?.name  || '—';
  const ownerEmail = data.owner?.email || '—';
  const ownerPhone = data.owner?.phone ? String(data.owner.phone) : '—';

  return (
    <div className="space-y-4 md:space-y-6">
      <Card className="border shadow-sm">
        <CardContent className="p-4 md:p-6">
          <h2 className="text-lg font-semibold mb-4 text-[#1a3f1c]">Vendor Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoRow label="Business Name" value={data.name} icon={Building} />
            <InfoRow label="Owner Name" value={ownerName} icon={User} />
            <InfoRow label="Owner Email" value={ownerEmail} icon={Mail} />
            <InfoRow label="Owner Phone" value={ownerPhone} icon={Phone} />
            <InfoRow label="Location" value={data.location?.address} icon={MapPin} />
            <InfoRow label="Joined Date" value={formatDate(data.createdAt)} icon={Calendar} />
            <InfoRow label="Vendor ID" value={`#${data._id?.slice(-8).toUpperCase()}`} />
          </div>
        </CardContent>
      </Card>

      <Card className="border shadow-sm" style={{ backgroundColor: '#98ef9b' }}>
        <CardContent className="p-4 md:p-6">
          <h2 className="text-lg font-semibold mb-4 text-[#1a3f1c]">Account Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-[#1a3f1c]/70 uppercase tracking-wide mb-1">Active Status</p>
              <Badge active={data.isActive} activeLabel="Active" inactiveLabel="Suspended" />
            </div>
            <div>
              <p className="text-xs text-[#1a3f1c]/70 uppercase tracking-wide mb-1">Verification</p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${data.isVerified ? 'bg-blue-600 text-white' : 'bg-yellow-600 text-white'}`}>
                {data.isVerified ? 'Verified' : 'Pending'}
              </span>
            </div>
            <div>
              <p className="text-xs text-[#1a3f1c]/70 uppercase tracking-wide mb-1">Balance</p>
              <p className="text-sm font-semibold text-[#1a3f1c]">₦{(data.balance ?? 0).toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-lg font-semibold mb-4">Earnings</h2>
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          <StatCard label="Today" value={data.earnings?.today ?? 0} color="#1a3f1c" />
          <StatCard label="This Week" value={data.earnings?.week ?? 0} color="#10b981" />
          <StatCard label="Total" value={data.earnings?.total ?? 0} color="#3b82f6" />
        </div>
      </div>
    </div>
  );
};

const RiderDetail = ({ data }: { data: any }) => {
  // IT rider backend has NO .populate("user") — all fields are direct on RiderProfile
  const name  = `${data.firstName ?? ''} ${data.lastName ?? ''}`.trim() || '—';
  const email = data.email || '—';
  const phone = data.phone ? String(data.phone) : '—';

  return (
    <div className="space-y-4 md:space-y-6">
      <Card className="border shadow-sm">
        <CardContent className="p-4 md:p-6">
          <h2 className="text-lg font-semibold mb-4 text-[#1a3f1c]">Rider Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoRow label="Full Name" value={name} icon={User} />
            <InfoRow label="Email" value={email} icon={Mail} />
            <InfoRow label="Phone" value={phone} icon={Phone} />
            <InfoRow label="Operating Area" value={data.operatingArea?.join(', ')} icon={MapPin} />
            <InfoRow label="Mode of Delivery" value={data.modeOfDelivery} />
            <InfoRow label="Rank" value={data.rank} />
            <InfoRow label="Joined Date" value={formatDate(data.createdAt)} icon={Calendar} />
            <InfoRow label="Rider ID" value={`#${data._id?.slice(-8).toUpperCase()}`} />
          </div>
        </CardContent>
      </Card>

      <Card className="border shadow-sm" style={{ backgroundColor: '#98ef9b' }}>
        <CardContent className="p-4 md:p-6">
          <h2 className="text-lg font-semibold mb-4 text-[#1a3f1c]">Rider Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-[#1a3f1c]/70 uppercase tracking-wide mb-1">Active Status</p>
              <Badge active={data.isActive} activeLabel="Active" inactiveLabel="Suspended" />
            </div>
            <div>
              <p className="text-xs text-[#1a3f1c]/70 uppercase tracking-wide mb-1">Avg Rating</p>
              <p className="text-sm font-semibold text-[#1a3f1c]">{(data.averageRating ?? 0).toFixed(1)} ⭐</p>
            </div>
            <div>
              <p className="text-xs text-[#1a3f1c]/70 uppercase tracking-wide mb-1">Total Deliveries</p>
              <p className="text-sm font-semibold text-[#1a3f1c]">{data.totalDeliveries ?? 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-lg font-semibold mb-4">Earnings</h2>
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          <StatCard label="Today" value={data.earnings?.today ?? 0} color="#1a3f1c" />
          <StatCard label="This Week" value={data.earnings?.week ?? 0} color="#10b981" />
          <StatCard label="Total" value={data.earnings?.total ?? 0} color="#3b82f6" />
        </div>
      </div>
    </div>
  );
};

// ── Skeleton ──────────────────────────────────────────────────────────────────
function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 animate-pulse space-y-6">
      <div className="h-8 w-28 rounded bg-gray-200" />
      <div className="bg-white rounded-xl border p-6 flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-gray-200" />
        <div className="space-y-2">
          <div className="h-6 w-48 rounded bg-gray-200" />
          <div className="h-4 w-32 rounded bg-gray-200" />
        </div>
      </div>
      <div className="bg-white rounded-xl border p-6 grid grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-1">
            <div className="h-3 w-20 rounded bg-gray-200" />
            <div className="h-4 w-36 rounded bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function EntityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") as "staff" | "customer" | "vendor" | "rider";

  const [entity, setEntity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [actioning, setActioning] = useState(false);

  useEffect(() => {
    if (!id || !type) return;

    const load = async () => {
      try {
        let res: any;
        switch (type) {
          case "staff":    res = await itService.getStaffMember(id); break;
          case "customer": res = await itService.getCustomer(id);    break;
          case "vendor":   res = await itService.getVendor(id);      break;
          case "rider":    res = await itService.getRider(id);        break;
        }
        const data = unwrap(res, type);
        setEntity(data);
        if (type === "staff") setIsAdmin(data?.isHead === true || data?.isSuperAdmin === true);
      } catch (err: any) {
        toast.error(err.message || "Failed to load details");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, type]);

  const handleToggleSuspend = async () => {
    if (!entity) return;
    const isCurrentlyActive = entity.isActive !== false;

    if (isCurrentlyActive) {
      const reason = prompt("Enter suspension reason:");
      if (!reason) return;
      setActioning(true);
      try {
        if (type === "customer") await itService.suspendCustomer(id, reason);
        else if (type === "vendor") await itService.suspendVendor(id, reason);
        else if (type === "rider") await itService.suspendRider(id, reason);
        else await itService.suspendStaff(id, reason);
        toast.success("Account suspended");
        setEntity({ ...entity, isActive: false, isSuspended: true });
      } catch (err: any) { toast.error(err.message || "Failed to suspend"); }
      finally { setActioning(false); }
    } else {
      setActioning(true);
      try {
        if (type === "customer") await itService.activateCustomer(id);
        else if (type === "vendor") await itService.activateVendor(id);
        else if (type === "rider") await itService.activateRider(id);
        else await itService.activateStaff(id);
        toast.success("Account activated");
        setEntity({ ...entity, isActive: true, isSuspended: false });
      } catch (err: any) { toast.error(err.message || "Failed to activate"); }
      finally { setActioning(false); }
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this account?")) return;
    setActioning(true);
    try {
      if (type === "customer") await itService.deleteCustomer(id);
      else if (type === "vendor") await itService.deleteVendor(id);
      else if (type === "rider") await itService.deleteRider(id);
      else await itService.deleteStaff(id);
      toast.success("Account deleted");
      router.push("/it/admin");
    } catch (err: any) { toast.error(err.message || "Failed to delete"); }
    finally { setActioning(false); }
  };

  if (loading) return <DetailSkeleton />;

  if (!entity) return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <p className="text-gray-500 mb-4">Record not found</p>
      <Button onClick={() => router.back()} variant="outline"><ArrowLeft className="h-4 w-4 mr-2" />Go Back</Button>
    </div>
  );

  // ── Display name logic per type ───────────────────────────────────────────
  const getDisplayName = (): string => {
    if (type === "staff")    return `${entity.firstName ?? ''} ${entity.lastName ?? ''}`.trim() || 'Staff Member';
    if (type === "customer") return entity.user?.name || entity.name || 'Customer';
    if (type === "vendor")   return entity.name || 'Vendor';
    if (type === "rider")    return `${entity.firstName ?? ''} ${entity.lastName ?? ''}`.trim() || 'Rider';
    return 'Unknown';
  };

  const displayName = getDisplayName();
  const initials = displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || '??';
  const isActive = entity.isActive !== false;

  const titleMap = { staff: isAdmin ? 'Admin Details' : 'Staff Details', customer: 'Customer Details', vendor: 'Vendor Details', rider: 'Rider Details' };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-4 md:space-y-6">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2 hover:bg-gray-100">
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Back to List</span>
          <span className="sm:hidden">Back</span>
        </Button>

        {/* Header */}
        <Card className="border shadow-sm" style={{ backgroundColor: '#e8f7e8' }}>
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#1a3f1c] flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-2xl md:text-3xl font-bold">{initials}</span>
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900">{displayName}</h1>
                  <p className="text-sm text-gray-500 mt-1">{titleMap[type]}</p>
                </div>
              </div>
              <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${isActive ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                {isActive ? 'Active' : 'Suspended'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        {type === "staff"    && <StaffDetail data={entity} isAdmin={isAdmin} />}
        {type === "customer" && <CustomerDetail data={entity} />}
        {type === "vendor"   && <VendorDetail data={entity} />}
        {type === "rider"    && <RiderDetail data={entity} />}

        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 sticky bottom-4 bg-white p-4 rounded-lg shadow-lg border">
          <Button onClick={handleToggleSuspend} disabled={actioning} className="w-full"
            style={{ backgroundColor: '#ffca3a', color: '#1a3f1c' }}>
            {actioning ? <div className="w-4 h-4 border-2 border-[#1a3f1c] border-t-transparent rounded-full animate-spin" />
              : isActive ? 'Suspend Account' : 'Activate Account'}
          </Button>
          <Button onClick={handleDelete} disabled={actioning} className="w-full bg-red-500 hover:bg-red-600 text-white">
            {actioning ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Delete Account'}
          </Button>
        </div>
      </div>
    </div>
  );
}