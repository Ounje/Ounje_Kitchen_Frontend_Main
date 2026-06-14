import { apiClient } from "@/lib/client";
import { ENDPOINTS } from "@/lib/config";

export type InvestorPeriod = "daily" | "weekly" | "monthly" | "yearly";

export interface InvestorDashboard {
  totalRevenue: number;
  monthlyRevenue: number;
  revenueGrowth: number;
  totalOrders: number;
  deliveredOrders: number;
  completionRate: number;
  activeVendors: number;
  totalCustomers: number;
  activeRiders: number;
}

export interface RevenueTrendPoint {
  label: string;
  gross: number;
  vendor: number;
  rider: number;
  net: number;
}

export interface InvestorRevenue {
  trend: RevenueTrendPoint[];
  topVendors: { name: string; orders: number }[];
  period: InvestorPeriod;
}

export const investorService = {
  async getDashboard(): Promise<InvestorDashboard> {
    const res = (await apiClient.get(ENDPOINTS.INVESTOR.DASHBOARD)) as any;
    return res?.data ?? res;
  },

  async getRevenue(period: InvestorPeriod = "monthly"): Promise<InvestorRevenue> {
    const res = (await apiClient.get(ENDPOINTS.INVESTOR.REVENUE, { params: { period } })) as any;
    return res?.data ?? res;
  },
};

export default investorService;
