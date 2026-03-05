import { apiClient } from '@/lib/client';
import { ENDPOINTS } from '@/lib/config';
import type { DashboardData, RevenueData, OrderStats } from '@/types';

export const superAdminService = {
  // ==================== DASHBOARD ====================
  async getDashboard() {
    const res = await apiClient.get(ENDPOINTS.SUPERADMIN.DASHBOARD);
    return res;
  },

  async getRevenue(period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'weekly') {
    const res = await apiClient.get(`${ENDPOINTS.SUPERADMIN.REVENUE}?period=${period}`);
    return res; 
  },

  async getRevenueTrends() {
    const res = await apiClient.get(ENDPOINTS.SUPERADMIN.REVENUE_TRENDS);
    return res;
  },

  async getOrderStats() {
    const res = await apiClient.get(`${ENDPOINTS.SUPERADMIN.ORDERS}/stats`);
    return res;
  },

  async getSystemStats() {
    const res = await apiClient.get(`${ENDPOINTS.SUPERADMIN.DASHBOARD}/stats`);
    return res;
  },

  // ==================== PROFILE (SETTINGS) ====================
  /**
   * Get current user's profile
   * GET /api/superadmin/profile
   */
  async getProfile() {
    const res = await apiClient.get('/api/superadmin/profile');
    return res;
  },

  /**
   * Update current user's profile
   * PUT /api/superadmin/profile
   */
  async updateProfile(data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
  }) {
    const res = await apiClient.put('/api/superadmin/profile', data);
    return res;
  },

  /**
   * Upload profile avatar (base64)
   * POST /api/superadmin/profile/avatar
   */
  async uploadAvatar(formData: FormData) {
    const res = await apiClient.post('/api/superadmin/profile/avatar', formData);
    return res;
  },

  /**
   * Initiate password change (sends OTP)
   * POST /api/superadmin/change-password
   */
  async changePassword(currentPassword: string, newPassword: string) {
    const res = await apiClient.post('/api/superadmin/change-password', {
      currentPassword,
      newPassword,
    });
    return res;
  },

  /**
   * Verify OTP and complete password change
   * POST /api/superadmin/verify-otp
   */
  async verifyOTP(otp: string) {
    const res = await apiClient.post('/api/superadmin/verify-otp', { otp });
    return res;
  },

  /**
   * Resend OTP for password change
   * POST /api/superadmin/resend-otp
   */
  async resendOTP() {
    const res = await apiClient.post('/api/superadmin/resend-otp');
    return res;
  },
};