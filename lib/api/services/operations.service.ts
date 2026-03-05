import { apiClient } from '@/lib/client';
import type {
  Customer,
  Vendor,
  Rider,
  PaginatedResponse,
  PaginationParams,
} from '@/types';

export const operationsService = {
  // ==================== DASHBOARD ====================
  async getDashboard(period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'daily') {
    const res = await apiClient.get<{
      success: boolean;
      todaysOrders: number;
      totalVendors: number;
      totalRiders: number;
      totalRevenue: number;
      recentActivity: any[];
      alerts: any[];
    }>(`/api/operations/dashboard?period=${period}`);
    
    return res;
  },

  // ==================== ORDERS ====================
  async getOrders(params?: PaginationParams & {
    name?: string;
    vendor?: string;
    zone?: string;
    orderId?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
  }) {
    const res = await apiClient.get('/api/operations/orders', { params });
    return res;
  },

  async getOrder(id: string) {
    const res = await apiClient.get(`/api/operations/orders/${id}`);
    return res;
  },

  // ==================== CUSTOMERS ====================
  async getCustomers(params?: PaginationParams) {
    const queryParams: Record<string, any> = {
      ...params,
      isActive: 'true',
      isSuspended: 'false',
    };
    
    const res = await apiClient.get('/api/operations/customers', { params: queryParams });
    return res;
  },

  async getCustomer(id: string) {
    const res = await apiClient.get(`/api/operations/customers/${id}`);
    return res;
  },

  // ==================== VENDORS ====================
  async getVendors(params?: PaginationParams) {
    const queryParams: Record<string, any> = {
      ...params,
      isActive: 'true',
      isSuspended: 'false',
    };
    
    const res = await apiClient.get('/api/operations/vendors', { params: queryParams });
    return res;
  },

  async getVendor(id: string) {
    const res = await apiClient.get(`/api/operations/vendors/${id}`);
    return res;
  },

  // ==================== RIDERS ====================
  async getRiders(params?: PaginationParams & {
    zone?: string;
    status?: 'active' | 'inactive';
  }) {
    const res = await apiClient.get('/api/operations/riders', { params });
    return res;
  },

  async getRider(id: string) {
    const res = await apiClient.get(`/api/operations/riders/${id}`);
    return res;
  },

  async assignRider(orderId: string, riderId: string) {
    const res = await apiClient.post(`/api/operations/orders/${orderId}/assign-rider`, {
      riderId,
    });
    return res;
  },

  // ==================== REVIEWS & RATINGS ====================
  async getReviews(params?: PaginationParams) {
    const res = await apiClient.get('/api/operations/reviews', { params });
    return res;
  },

  // ==================== PROFILE (SETTINGS) ====================
  async getProfile() {
    const res = await apiClient.get('/api/operations/profile');
    return res;
  },

  async updateProfile(data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
  }) {
    const res = await apiClient.put('/api/operations/profile', data);
    return res;
  },

  async uploadAvatar(formData: FormData) {
    const res = await apiClient.post('/api/operations/profile/avatar', formData);
    return res;
  },

  async changePassword(currentPassword: string, newPassword: string) {
    const res = await apiClient.post('/api/operations/change-password', {
      currentPassword,
      newPassword,
    });
    return res;
  },

  async verifyOTP(otp: string) {
    const res = await apiClient.post('/api/operations/verify-otp', { otp });
    return res;
  },

  async resendOTP() {
    const res = await apiClient.post('/api/operations/resend-otp');
    return res;
  },
};