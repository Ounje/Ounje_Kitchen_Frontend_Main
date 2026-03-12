import { apiClient } from '@/lib/client';
import { ENDPOINTS } from '@/lib/config';

// ── Shared Types ──────────────────────────────────────────────────────────────
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  pages: number;
  limit: number;
}

// ── Customer ──────────────────────────────────────────────────────────────────
export interface CustomerRow {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  isActive: boolean;
  isSuspended: boolean;
  createdAt: string;
}

// ── Vendor ────────────────────────────────────────────────────────────────────
export interface VendorRow {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
  };
  isActive: boolean;
  isSuspended: boolean;
  isVerified: boolean;
  rating: number;
  totalOrders: number;
  createdAt: string;
}

// ── Rider ─────────────────────────────────────────────────────────────────────
export interface RiderRow {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  zone?: string;
  vehicleType?: string;
  vehicleNumber?: string;
  isActive: boolean;
  isSuspended: boolean;
  rating: number;
  createdAt: string;
}

// ── Service ───────────────────────────────────────────────────────────────────
export const superAdminService = {

  // ==================== DASHBOARD ====================

  async getDashboard() {
    const res = await apiClient.get(ENDPOINTS.SUPERADMIN.DASHBOARD);
    return res;
  },

  async getRevenue(period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'weekly') {
    const res = await apiClient.get(ENDPOINTS.SUPERADMIN.REVENUE, { params: { period } });
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

  // ==================== CUSTOMERS ====================
  // Returns full profile: name, email, phone, address, status fields

  async getCustomers(params?: PaginationParams & {
    name?: string;
    email?: string;
    isActive?: boolean;
    isSuspended?: boolean;
  }) {
    const res = await apiClient.get(ENDPOINTS.SUPERADMIN.CUSTOMERS, { params });
    return res;
  },

  async getCustomer(id: string) {
    const res = await apiClient.get(ENDPOINTS.SUPERADMIN.CUSTOMER_BY_ID(id));
    return res;
  },

  async suspendCustomer(id: string, reason?: string) {
    const res = await apiClient.put(ENDPOINTS.SUPERADMIN.CUSTOMER_SUSPEND(id), { reason });
    return res;
  },

  async activateCustomer(id: string) {
    const res = await apiClient.put(ENDPOINTS.SUPERADMIN.CUSTOMER_ACTIVATE(id));
    return res;
  },

  // ==================== VENDORS ====================
  // Returns full profile: businessName, ownerName, email, phone, address, ratings, status

  async getVendors(params?: PaginationParams & {
    name?: string;
    email?: string;
    isActive?: boolean;
    isSuspended?: boolean;
    isVerified?: boolean;
  }) {
    const res = await apiClient.get(ENDPOINTS.SUPERADMIN.VENDORS, { params });
    return res;
  },

  async getVendor(id: string) {
    const res = await apiClient.get(ENDPOINTS.SUPERADMIN.VENDOR_BY_ID(id));
    return res;
  },

  async suspendVendor(id: string, reason?: string) {
    const res = await apiClient.put(ENDPOINTS.SUPERADMIN.VENDOR_SUSPEND(id), { reason });
    return res;
  },

  async activateVendor(id: string) {
    const res = await apiClient.put(ENDPOINTS.SUPERADMIN.VENDOR_ACTIVATE(id));
    return res;
  },

  async verifyVendor(id: string) {
    const res = await apiClient.put(ENDPOINTS.SUPERADMIN.VENDOR_VERIFY(id));
    return res;
  },

  // ==================== RIDERS ====================
  // Returns full profile: firstName, lastName, email, phone, zone, vehicle, ratings, status

  async getRiders(params?: PaginationParams & {
    name?: string;
    zone?: string;
    isActive?: boolean;
    isSuspended?: boolean;
  }) {
    const res = await apiClient.get(ENDPOINTS.SUPERADMIN.RIDERS, { params });
    return res;
  },

  async getRider(id: string) {
    const res = await apiClient.get(ENDPOINTS.SUPERADMIN.RIDER_BY_ID(id));
    return res;
  },

  async suspendRider(id: string, reason?: string) {
    const res = await apiClient.put(ENDPOINTS.SUPERADMIN.RIDER_SUSPEND(id), { reason });
    return res;
  },

  async activateRider(id: string) {
    const res = await apiClient.put(ENDPOINTS.SUPERADMIN.RIDER_ACTIVATE(id));
    return res;
  },

  async verifyRider(id: string) {
    const res = await apiClient.put(ENDPOINTS.SUPERADMIN.RIDER_VERIFY(id));
    return res;
  },

  // ==================== STAFF ====================

  async getStaff(params?: PaginationParams & { name?: string; department?: string }) {
    const res = await apiClient.get(ENDPOINTS.SUPERADMIN.STAFF, { params });
    return res;
  },

  // ==================== ORDERS ====================

  async getOrders(params?: PaginationParams & {
    status?: string;
    vendor?: string;
    customer?: string;
    dateFrom?: string;
    dateTo?: string;
  }) {
    const res = await apiClient.get(ENDPOINTS.SUPERADMIN.ORDERS, { params });
    return res;
  },

  async getOrder(id: string) {
    const res = await apiClient.get(ENDPOINTS.SUPERADMIN.ORDER_BY_ID(id));
    return res;
  },

  async overrideOrder(id: string, data: Record<string, any>) {
    const res = await apiClient.post(ENDPOINTS.SUPERADMIN.ORDER_OVERRIDE(id), data);
    return res;
  },

  // ==================== RATINGS ====================

  async getRatings(params?: PaginationParams & { targetType?: 'Vendor' | 'Rider' }) {
    const res = await apiClient.get(ENDPOINTS.SUPERADMIN.RATINGS, { params });
    return res;
  },

  // ==================== QUERIES / COMPLAINTS ====================

  async getQueries(params?: PaginationParams & { status?: string }) {
    const res = await apiClient.get(ENDPOINTS.SUPERADMIN.QUERIES, { params });
    return res;
  },

  async getQuery(id: string) {
    const res = await apiClient.get(ENDPOINTS.SUPERADMIN.QUERY_BY_ID(id));
    return res;
  },

  async assignQuery(id: string, assignedTo: string) {
    const res = await apiClient.post(ENDPOINTS.SUPERADMIN.QUERY_ASSIGN(id), { assignedTo });
    return res;
  },

  async resolveQuery(id: string, resolution: string) {
    const res = await apiClient.post(ENDPOINTS.SUPERADMIN.QUERY_RESOLVE(id), { resolution });
    return res;
  },

  // ==================== PROFILE (SETTINGS) ====================

  async getProfile() {
    const res = await apiClient.get(ENDPOINTS.SUPERADMIN.PROFILE);
    return res;
  },

  async updateProfile(data: { firstName?: string; lastName?: string; phone?: string }) {
    const res = await apiClient.put(ENDPOINTS.SUPERADMIN.PROFILE, data);
    return res;
  },

  async uploadAvatar(formData: FormData) {
    const res = await apiClient.post(ENDPOINTS.SUPERADMIN.PROFILE_AVATAR, formData);
    return res;
  },

  async changePassword(currentPassword: string, newPassword: string) {
    const res = await apiClient.post(ENDPOINTS.SUPERADMIN.CHANGE_PASSWORD, {
      currentPassword,
      newPassword,
    });
    return res;
  },

  async verifyOTP(otp: string) {
    const res = await apiClient.post(ENDPOINTS.SUPERADMIN.VERIFY_OTP, { otp });
    return res;
  },

  async resendOTP() {
    const res = await apiClient.post(ENDPOINTS.SUPERADMIN.RESEND_OTP);
    return res;
  },
};