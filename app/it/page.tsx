"use client";

import { useEffect, useState } from "react";
import { itService } from "@/lib/api/services/it.service";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Users, 
  Store, 
  Bike, 
  UserCog, 
  ShoppingCart, 
  AlertCircle,
  TrendingUp,
  CheckCircle,
  XCircle,
  Bell,
  Activity as ActivityIcon,
  Clock,
  UserPlus,
  Package,
  AlertTriangle
} from "lucide-react";
import { useRouteGuard } from "@/hooks/useRouteGuard";

// ==================== TYPES ====================
interface DashboardData {
  customers: { total: number; active: number };
  vendors: { total: number; active: number };
  riders: { total: number; active: number };
  staff: { total: number; active: number };
  orders: { total: number; pending: number };
}

interface ActivityItem {
  id: string;
  type: 'admin' | 'staff' | 'customer' | 'vendor' | 'rider' | 'order';
  action: string;
  user: string;
  timestamp: string;
  icon: any;
}

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  message: string;
  timestamp: string;
}

// ==================== REUSABLE COMPONENTS ====================

// Stat Card Component
const DashboardStatCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color 
}: { 
  title: string; 
  value: number; 
  subtitle: string; 
  icon: any; 
  color: string;
}) => (
  <Card className="border-none shadow-sm hover:shadow-md transition-all duration-200">
    <CardContent className="p-4 md:p-6">
      <div className="flex items-start justify-between mb-3">
        <div 
          className="w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: color }}
        >
          <Icon className="h-5 w-5 md:h-6 md:w-6 text-white" />
        </div>
      </div>
      <div>
        <p className="text-xs md:text-sm text-gray-600 font-medium mb-1">{title}</p>
        <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
          {value.toLocaleString()}
        </p>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
    </CardContent>
  </Card>
);

// Status Summary Card Component
const StatusSummaryCard = ({ 
  title, 
  active, 
  suspended, 
  total 
}: { 
  title: string; 
  active: number; 
  suspended: number; 
  total: number;
}) => (
  <Card className="border shadow-sm">
    <CardContent className="p-4 md:p-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">{title}</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sm text-gray-600">Active</span>
          </div>
          <span className="text-sm font-semibold text-gray-900">{active.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-sm text-gray-600">Suspended</span>
          </div>
          <span className="text-sm font-semibold text-gray-900">{suspended.toLocaleString()}</span>
        </div>
        <div className="pt-3 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Total</span>
            <span className="text-sm font-bold text-[#1a3f1c]">{total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Notification Item Component
const NotificationItem = ({ notification }: { notification: Notification }) => {
  const iconMap = {
    info: { icon: Bell, color: 'text-blue-600', bg: 'bg-blue-50' },
    warning: { icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    success: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    error: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
  };
  
  const { icon: Icon, color, bg } = iconMap[notification.type];
  
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${bg}`}>
        <Icon className={`h-4 w-4 ${color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900 break-words">{notification.message}</p>
        <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
      </div>
    </div>
  );
};

// Activity Item Component
const ActivityFeedItem = ({ activity }: { activity: ActivityItem }) => {
  const typeColors = {
    admin: 'bg-purple-100 text-purple-700',
    staff: 'bg-blue-100 text-blue-700',
    customer: 'bg-green-100 text-green-700',
    vendor: 'bg-orange-100 text-orange-700',
    rider: 'bg-indigo-100 text-indigo-700',
    order: 'bg-pink-100 text-pink-700',
  };
  
  const Icon = activity.icon;
  
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="w-8 h-8 rounded-full bg-[#1a3f1c] flex items-center justify-center flex-shrink-0">
        <Icon className="h-4 w-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeColors[activity.type]}`}>
            {activity.type}
          </span>
          <span className="text-sm text-gray-900 font-medium truncate">{activity.user}</span>
        </div>
        <p className="text-sm text-gray-600 break-words">{activity.action}</p>
        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {activity.timestamp}
        </p>
      </div>
    </div>
  );
};

// Section Header Component
const SectionHeader = ({ title, icon: Icon }: { title: string; icon: any }) => (
  <div className="flex items-center gap-2 mb-4 md:mb-6">
    <Icon className="h-5 w-5 md:h-6 md:w-6 text-[#1a3f1c]" />
    <h2 className="text-lg md:text-xl font-semibold text-gray-900">{title}</h2>
  </div>
);

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <div className="space-y-6 md:space-y-8 animate-pulse">
    {/* Stats Skeleton */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-32 bg-gray-200 rounded-lg" />
      ))}
    </div>
    {/* Content Skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 h-64 bg-gray-200 rounded-lg" />
      <div className="h-64 bg-gray-200 rounded-lg" />
    </div>
  </div>
);

// Empty State Component
const EmptyState = ({ icon: Icon, message }: { icon: any; message: string }) => (
  <div className="text-center py-8 md:py-12">
    <Icon className="h-12 w-12 md:h-16 md:w-16 text-gray-300 mx-auto mb-3 md:mb-4" />
    <p className="text-sm md:text-base text-gray-500">{message}</p>
  </div>
);

// ==================== MAIN DASHBOARD COMPONENT ====================
export default function ITDashboard() {
   const { shouldRender, Reloading} = useRouteGuard({ returnRenderFlag: true });
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [adminsCount, setAdminsCount] = useState({ total: 0, active: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

 useEffect(() => {
    // ✅ Only fetch if page should render
    if (shouldRender) {
      fetchDashboard();
    }
  }, [shouldRender]);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      // Fetch main dashboard data
      const dashboardData = await itService.getDashboard();
      console.log('[IT Dashboard] Dashboard data:', dashboardData);
      setDashboard(dashboardData);

      // Fetch admins separately (those with isHead=true)
      const adminsData = await itService.getAdmins({ page: 1, limit: 1000 });
      console.log('[IT Dashboard] Admins data:', adminsData);
      
      const totalAdmins = adminsData.pagination?.total || 0;
      const activeAdmins = adminsData.admins?.filter((admin: any) => admin.isActive).length || 0;
      
      setAdminsCount({ total: totalAdmins, active: activeAdmins });
      setError("");
    } catch (err: any) {
      console.error('[IT Dashboard] Error:', err);
      setError(err.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  // Mock notifications (replace with API when available)
  const notifications: Notification[] = [
    {
      id: '1',
      type: 'success',
      message: 'New vendor "Fresh Foods Market" has been verified and activated',
      timestamp: '2 minutes ago'
    },
    {
      id: '2',
      type: 'warning',
      message: '3 failed login attempts detected for customer account',
      timestamp: '15 minutes ago'
    },
    {
      id: '3',
      type: 'info',
      message: '12 new customer registrations pending review',
      timestamp: '1 hour ago'
    },
    {
      id: '4',
      type: 'error',
      message: 'Order #ORD-4521 payment failed - requires investigation',
      timestamp: '2 hours ago'
    }
  ];

  // Mock activities (replace with API when available)
  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'admin',
      action: 'Created new department head for Operations',
      user: 'Super Admin',
      timestamp: '5 minutes ago',
      icon: UserPlus
    },
    {
      id: '2',
      type: 'vendor',
      action: 'Vendor "Healthy Eats" account verified',
      user: 'IT Admin',
      timestamp: '12 minutes ago',
      icon: CheckCircle
    },
    {
      id: '3',
      type: 'staff',
      action: 'Added new staff member to Finance department',
      user: 'Finance Head',
      timestamp: '23 minutes ago',
      icon: UserPlus
    },
    {
      id: '4',
      type: 'order',
      action: 'Order #ORD-9821 completed successfully',
      user: 'System',
      timestamp: '35 minutes ago',
      icon: Package
    },
    {
      id: '5',
      type: 'rider',
      action: 'Rider "John Doe" accepted delivery in Yaba zone',
      user: 'Dispatch System',
      timestamp: '1 hour ago',
      icon: Bike
    },
    {
      id: '6',
      type: 'customer',
      action: 'New customer registration: "Jane Smith"',
      user: 'Registration System',
      timestamp: '2 hours ago',
      icon: UserPlus
    }
  ];

  // Loading State
  if (loading) {
    return <LoadingSkeleton />;
  }

  // Error State
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 md:p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-red-900">Error loading dashboard</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
            <button
              onClick={fetchDashboard}
              className="mt-3 text-sm font-medium text-red-700 hover:text-red-900 underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No Data State
  if (!dashboard) {
    return (
      <EmptyState 
        icon={AlertCircle} 
        message="Dashboard data will be available upon backend update" 
      />
    );
  }

  // Calculate totals and suspended counts
  const calculateSuspended = (total: number, active: number) => Math.max(0, total - active);

  const stats = [
    {
      title: "Total Admins",
      value: adminsCount.total,
      subtitle: `${adminsCount.active} active admins`,
      icon: UserCog,
      color: "#1a3f1c",
    },
    {
      title: "Total Staff",
      value: dashboard.staff?.total || 0,
      subtitle: `${dashboard.staff?.active || 0} active staff`,
      icon: Users,
      color: "#98ef9b",
    },
    {
      title: "Total Customers",
      value: dashboard.customers?.total || 0,
      subtitle: `${dashboard.customers?.active || 0} active`,
      icon: Users,
      color: "#ffca3a",
    },
    {
      title: "Total Vendors",
      value: dashboard.vendors?.total || 0,
      subtitle: `${dashboard.vendors?.active || 0} active`,
      icon: Store,
      color: "#1a3f1c",
    },
    {
      title: "Total Riders",
      value: dashboard.riders?.total || 0,
      subtitle: `${dashboard.riders?.active || 0} active`,
      icon: Bike,
      color: "#98ef9b",
    },
    {
      title: "Total Orders",
      value: dashboard.orders?.total || 0,
      subtitle: `${dashboard.orders?.pending || 0} pending`,
      icon: ShoppingCart,
      color: "#ffca3a",
    },
  ];

  // Debug: Log all counts
  console.log('[IT Dashboard] Stats:', {
    admins: adminsCount,
    staff: dashboard.staff,
    customers: dashboard.customers,
    vendors: dashboard.vendors,
    riders: dashboard.riders,
    orders: dashboard.orders
  });

  if (Reloading || !shouldRender) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-[#1a3f1c] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">IT Dashboard</h1>
        <p className="text-sm md:text-base text-gray-500 mt-1">
          Platform Overview & Management
        </p>
      </div>

      {/* Stats Grid - 6 columns on XL screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <DashboardStatCard key={index} {...stat} />
        ))}
      </div>

      {/* Status Summary Section */}
      <div>
        <SectionHeader title="Account Status Summary" icon={TrendingUp} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatusSummaryCard
            title="Customers"
            active={dashboard.customers?.active || 0}
            suspended={calculateSuspended(dashboard.customers?.total || 0, dashboard.customers?.active || 0)}
            total={dashboard.customers?.total || 0}
          />
          <StatusSummaryCard
            title="Vendors"
            active={dashboard.vendors?.active || 0}
            suspended={calculateSuspended(dashboard.vendors?.total || 0, dashboard.vendors?.active || 0)}
            total={dashboard.vendors?.total || 0}
          />
          <StatusSummaryCard
            title="Riders"
            active={dashboard.riders?.active || 0}
            suspended={calculateSuspended(dashboard.riders?.total || 0, dashboard.riders?.active || 0)}
            total={dashboard.riders?.total || 0}
          />
          <StatusSummaryCard
            title="Staff"
            active={dashboard.staff?.active || 0}
            suspended={calculateSuspended(dashboard.staff?.total || 0, dashboard.staff?.active || 0)}
            total={dashboard.staff?.total || 0}
          />
        </div>
      </div>

      {/* Notifications & Activities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Recent Activities - Takes 2 columns on large screens */}
        <div className="lg:col-span-2">
          <Card className="border shadow-sm h-full">
            <CardContent className="p-4 md:p-6">
              <SectionHeader title="Recent Activities" icon={ActivityIcon} />
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                {activities.length > 0 ? (
                  activities.map((activity) => (
                    <ActivityFeedItem key={activity.id} activity={activity} />
                  ))
                ) : (
                  <EmptyState 
                    icon={ActivityIcon} 
                    message="No recent activities" 
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications - Takes 1 column on large screens */}
        <div>
          <Card className="border shadow-sm h-full">
            <CardContent className="p-4 md:p-6">
              <SectionHeader title="Notifications" icon={Bell} />
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <NotificationItem key={notification.id} notification={notification} />
                  ))
                ) : (
                  <EmptyState 
                    icon={Bell} 
                    message="No new notifications" 
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Orders Summary Card */}
      <Card className="border shadow-sm" style={{ backgroundColor: '#e8f7e8' }}>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-[#1a3f1c] flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Order Management</h3>
                <p className="text-sm text-gray-600">Track and manage all platform orders</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full sm:w-auto">
              <div className="text-center">
                <p className="text-2xl font-bold text-[#1a3f1c]">
                  {dashboard.orders?.total || 0}
                </p>
                <p className="text-xs text-gray-600">Total</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">
                  {dashboard.orders?.pending || 0}
                </p>
                <p className="text-xs text-gray-600">Pending</p>
              </div>
              <div className="text-center col-span-2 sm:col-span-1">
                <p className="text-2xl font-bold text-green-600">
                  {(dashboard.orders?.total || 0) - (dashboard.orders?.pending || 0)}
                </p>
                <p className="text-xs text-gray-600">Completed</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}