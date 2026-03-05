"use client";

import { useState, useEffect } from "react";
import { useRouteGuard } from "@/hooks/useRouteGuard";
import { operationsService } from "@/lib/api/services/operations.service";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ShoppingCart, 
  Store, 
  Bike, 
  DollarSign,
  TrendingUp,
  AlertCircle,
  Eye,
  Loader2
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function OperationsDashboardPage() {
  const { shouldRender, Reloading } = useRouteGuard({ returnRenderFlag: true });
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily');
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [fetchingData, setFetchingData] = useState(true);

  useEffect(() => {
    if (shouldRender) {
      fetchDashboard();
    }
  }, [shouldRender, period]);

  const fetchDashboard = async () => {
    setFetchingData(true);
    try {
      // Mock data for now
      setDashboardData({
        todaysOrders: 1000,
        totalVendors: 300,
        totalRiders: 30,
        totalRevenue: 300000,
        recentActivity: [
          { id: 1, text: "Izuki Midoriya Just placed order from Iya Bolu", orderId: "Oun - 123 - 7D5T", type: "order" },
          { id: 2, text: "Madu South Account has been Activated", accountId: "6576828WG23", type: "activation" },
          { id: 3, text: "Izuki Midoriya order have been delivered", orderId: "Oun - 123 - 7D5T", type: "delivery" },
          { id: 4, text: "Samuel Kayode Just placed order from Iya Bolu", orderId: "Oun - 123 - 7D5T", type: "order" },
        ],
        alerts: [
          { id: 1, text: "Madu South Account has been Suspended", category: "Customer", accountId: "6576828WG23" },
          { id: 2, text: "Iya Bolu has rejected an order", category: "Vendor", accountId: "6576828WG23" },
        ],
      });
    } catch (error) {
      console.error("Failed to fetch dashboard:", error);
    } finally {
      setFetchingData(false);
    }
  };

  if (Reloading || !shouldRender) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 sm:h-12 sm:w-12 animate-spin text-[#1a3f1c]" />
      </div>
    );
  }

  const stats = [
    { 
      title: "Today's Order", 
      value: dashboardData?.todaysOrders || 0, 
      icon: ShoppingCart,
      subtitle: "991 Completed · 49 Active",
      color: "bg-[#98ef9b]"
    },
    { 
      title: "Total Vendors", 
      value: dashboardData?.totalVendors || 0, 
      icon: Store,
      subtitle: "290 Active · 10 Suspended",
      color: "bg-[#98ef9b]"
    },
    { 
      title: "Total Riders", 
      value: dashboardData?.totalRiders || 0, 
      icon: Bike,
      subtitle: "25 Active · 5 Suspended",
      color: "bg-[#98ef9b]"
    },
    { 
      title: "Total Revenue", 
      value: `₦${dashboardData?.totalRevenue?.toLocaleString() || 0}`, 
      icon: DollarSign,
      subtitle: "Daily revenue tracking",
      color: "bg-[#98ef9b]"
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
          Dashboard
        </h1>
        
        <Select value={period} onValueChange={(value: any) => setPeriod(value)}>
          <SelectTrigger className="w-full sm:w-32 h-10 sm:h-11 bg-[#98ef9b] border-none text-[#1a3f1c] font-medium">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={index} 
              className="border-none shadow-sm hover:shadow-md transition-shadow"
              style={{ backgroundColor: stat.color }}
            >
              <CardContent className="p-4 sm:p-5 md:p-6">
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className="p-2 sm:p-2.5 rounded-lg bg-white/80">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-[#1a3f1c]" />
                  </div>
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-[#1a3f1c]" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a3f1c]">
                    {stat.value}
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-[#1a3f1c]/80">
                    {stat.title}
                  </p>
                  <p className="text-[10px] sm:text-xs text-[#1a3f1c]/60">
                    {stat.subtitle}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity Section */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            Recent Activity/Feed
          </h2>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-xs sm:text-sm text-[#1a3f1c] hover:bg-[#98ef9b] h-8 sm:h-9"
          >
            Show all
          </Button>
        </div>

        <div className="space-y-2 sm:space-y-3">
          {dashboardData?.recentActivity?.map((activity: any) => (
            <Card 
              key={activity.id}
              className="border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              style={{ backgroundColor: '#98ef9b' }}
            >
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-[#1a3f1c] font-medium truncate sm:whitespace-normal">
                      {activity.text}
                    </p>
                    {activity.orderId && (
                      <p className="text-[10px] sm:text-xs text-[#1a3f1c]/70 mt-0.5 sm:mt-1">
                        Order ID: {activity.orderId}
                      </p>
                    )}
                    {activity.accountId && (
                      <p className="text-[10px] sm:text-xs text-[#1a3f1c]/70 mt-0.5 sm:mt-1">
                        Account ID: {activity.accountId}
                      </p>
                    )}
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 rounded-full bg-[#1a3f1c] text-white hover:bg-[#164016]"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Alert/Warning Section */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            Alert/Warning
          </h2>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-xs sm:text-sm text-[#1a3f1c] hover:bg-[#98ef9b] h-8 sm:h-9"
          >
            Show all
          </Button>
        </div>

        <div className="space-y-2 sm:space-y-3">
          {dashboardData?.alerts?.map((alert: any) => (
            <Card 
              key={alert.id}
              className="border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              style={{ backgroundColor: '#98ef9b' }}
            >
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-[#1a3f1c] font-medium truncate sm:whitespace-normal">
                      {alert.text}
                    </p>
                    <p className="text-[10px] sm:text-xs text-[#1a3f1c]/70 mt-0.5 sm:mt-1">
                      Category: {alert.category} | Account ID: {alert.accountId}
                    </p>
                  </div>
                  <div className="shrink-0 p-1.5 sm:p-2 rounded-full bg-[#ffca3a]">
                    <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-[#1a3f1c]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}