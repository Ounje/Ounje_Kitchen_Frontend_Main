import { apiClient } from '@/lib/client';
import { ENDPOINTS } from '@/lib/config';
import type { DashboardData, RevenueData, OrderStats } from '@/types';

export const dashboardService = {

  /**
   * GET /api/superadmin/dashboard
   * Returns users, orders, ratings, queries, revenue stats
   */
  async getDashboard(): Promise<DashboardData> {
    const res = await apiClient.get<DashboardData>(ENDPOINTS.SUPERADMIN.DASHBOARD);
    return res;
  },

  /**
   * GET /api/superadmin/revenue?period=...
   */
  async getRevenue(
    period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'weekly'
  ): Promise<RevenueData> {
    const res = await apiClient.get<RevenueData>(
      ENDPOINTS.SUPERADMIN.REVENUE, { params: { period } }
    );
    return res;
  },

  /**
   * GET /api/superadmin/revenue/trends
   */
  async getRevenueTrends(): Promise<any> {
    const res = await apiClient.get(ENDPOINTS.SUPERADMIN.REVENUE_TRENDS);
    return res;
  },

  /**
   * GET /api/superadmin/orders/stats
   */
  async getOrderStats(): Promise<OrderStats> {
    const res = await apiClient.get<OrderStats>(`${ENDPOINTS.SUPERADMIN.ORDERS}/stats`);
    return res;
  },

  /**
   * GET /api/superadmin/dashboard/stats
   */
  async getSystemStats(): Promise<any> {
    const res = await apiClient.get(`${ENDPOINTS.SUPERADMIN.DASHBOARD}/stats`);
    return res;
  },
};