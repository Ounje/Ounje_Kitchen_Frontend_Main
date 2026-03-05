import { apiClient } from '@/lib/client';
import { ENDPOINTS } from '@/lib/config';
import type { DashboardData, RevenueData, OrderStats } from '@/types';

class DashboardService {
  /**
   * Get dashboard overview data
   * Backend returns all stats in one call
   */
  async getDashboard(): Promise<DashboardData> {
    const response = await apiClient.get<{ success: boolean; data: DashboardData }>(
      ENDPOINTS.SUPERADMIN.DASHBOARD
    );
    return response.data;
  }

  /**
   * Get revenue data with optional period filter
   * @param period - 'daily' | 'weekly' | 'monthly' | 'yearly'
   */
  async getRevenue(period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'weekly'): Promise<RevenueData> {
    const response = await apiClient.get<{ success: boolean; data: RevenueData }>(
      `${ENDPOINTS.SUPERADMIN.REVENUE}?period=${period}`
    );
    return response.data;
  }

  /**
   * Get revenue trends over time
   */
  async getRevenueTrends(): Promise<any> {
    const response = await apiClient.get<{ success: boolean; data: any }>(
      ENDPOINTS.SUPERADMIN.REVENUE_TRENDS
    );
    return response.data;
  }

  /**
   * Get aggregated order statistics
   */
  async getOrderStats(): Promise<OrderStats> {
    const response = await apiClient.get<{ success: boolean; data: OrderStats }>(
      `${ENDPOINTS.SUPERADMIN.ORDERS}/stats`
    );
    return response.data;
  }

  /**
   * Get system-wide statistics
   * Alternative endpoint for system stats
   */
  async getSystemStats(): Promise<any> {
    const response = await apiClient.get<{ success: boolean; data: any }>(
      `${ENDPOINTS.SUPERADMIN.DASHBOARD}/stats`
    );
    return response.data;
  }
}



export const dashboardService = new DashboardService();