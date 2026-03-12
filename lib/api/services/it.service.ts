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

// ── Staff ─────────────────────────────────────────────────────────────────────
export interface StaffRow {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department: string;
  isHead: boolean;
  isActive: boolean;
  isSuspended: boolean;
  createdAt: string;
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export interface ITDashboardData {
  customers: { total: number; active: number };
  vendors:   { total: number; active: number };
  riders:    { total: number; active: number };
  staff:     { total: number; active: number };
  orders:    { total: number; pending: number };
}

// ── Service ───────────────────────────────────────────────────────────────────
export const itService = {

  // ==================== DASHBOARD ====================

  async getDashboard(): Promise<ITDashboardData> {
    const res = await apiClient.get(ENDPOINTS.IT.DASHBOARD);
    return {
      customers: res.customers,
      vendors:   res.vendors,
      riders:    res.riders,
      staff:     res.staff,
      orders:    res.orders,
    };
  },

  // ==================== CUSTOMERS ====================
  // Returns full profile: name, email, phone, address, status fields

  async getCustomers(params?: PaginationParams & {
    name?: string;
    isActive?: string;
    isSuspended?: string;
  }) {
    const res = await apiClient.get(ENDPOINTS.IT.CUSTOMERS, { params: params ?? {} });
    return res;
  },

  async getCustomer(id: string) {
    const res = await apiClient.get(ENDPOINTS.IT.CUSTOMER_BY_ID(id));
    return res;
  },

  async suspendCustomer(id: string, reason: string) {
    const res = await apiClient.put(ENDPOINTS.IT.CUSTOMER_SUSPEND(id), { reason });
    return res;
  },

  async activateCustomer(id: string) {
    const res = await apiClient.put(ENDPOINTS.IT.CUSTOMER_ACTIVATE(id));
    return res;
  },

  async deleteCustomer(id: string) {
    const res = await apiClient.delete(ENDPOINTS.IT.CUSTOMER_DELETE(id));
    return res;
  },

  async restoreCustomer(id: string) {
    const res = await apiClient.put(ENDPOINTS.IT.CUSTOMER_RESTORE(id));
    return res;
  },

  // ==================== VENDORS ====================
  // Returns full profile: businessName, ownerName, email, phone, address, ratings, status

  async getVendors(params?: PaginationParams & {
    name?: string;
    isActive?: string;
    isSuspended?: string;
  }) {
    const res = await apiClient.get(ENDPOINTS.IT.VENDORS, { params: params ?? {} });
    return res;
  },

  async getVendor(id: string) {
    const res = await apiClient.get(ENDPOINTS.IT.VENDOR_BY_ID(id));
    return res;
  },

  async suspendVendor(id: string, reason: string) {
    const res = await apiClient.put(ENDPOINTS.IT.VENDOR_SUSPEND(id), { reason });
    return res;
  },

  async activateVendor(id: string) {
    const res = await apiClient.put(ENDPOINTS.IT.VENDOR_ACTIVATE(id));
    return res;
  },

  async verifyVendor(id: string) {
    const res = await apiClient.put(ENDPOINTS.IT.VENDOR_VERIFY(id));
    return res;
  },

  async deleteVendor(id: string) {
    const res = await apiClient.delete(ENDPOINTS.IT.VENDOR_DELETE(id));
    return res;
  },

  async restoreVendor(id: string) {
    const res = await apiClient.put(ENDPOINTS.IT.VENDOR_RESTORE(id));
    return res;
  },

  // ==================== RIDERS ====================
  // Returns full profile: firstName, lastName, email, phone, zone, vehicle, ratings, status

  async getRiders(params?: PaginationParams & {
    name?: string;
    zone?: string;
    isActive?: string;
    isSuspended?: string;
  }) {
    const res = await apiClient.get(ENDPOINTS.IT.RIDERS, { params: params ?? {} });
    return res;
  },

  async getRider(id: string) {
    const res = await apiClient.get(ENDPOINTS.IT.RIDER_BY_ID(id));
    return res;
  },

  async suspendRider(id: string, reason: string) {
    const res = await apiClient.put(ENDPOINTS.IT.RIDER_SUSPEND(id), { reason });
    return res;
  },

  async activateRider(id: string) {
    const res = await apiClient.put(ENDPOINTS.IT.RIDER_ACTIVATE(id));
    return res;
  },

  async deleteRider(id: string) {
    const res = await apiClient.delete(ENDPOINTS.IT.RIDER_DELETE(id));
    return res;
  },

  async restoreRider(id: string) {
    const res = await apiClient.put(ENDPOINTS.IT.RIDER_RESTORE(id));
    return res;
  },

  // ==================== STAFF ====================

  async getStaff(params?: PaginationParams & { name?: string; department?: string }) {
    const queryParams = { isHead: 'false', ...params };
    const res = await apiClient.get(ENDPOINTS.STAFF.ALL_STAFF, { params: queryParams });
    return res;
  },

  async getAdmins(params?: PaginationParams & { department?: string }) {
    const queryParams = { isHead: 'true', ...params };
    const res = await apiClient.get(ENDPOINTS.STAFF.ALL_STAFF, { params: queryParams });
    return res;
  },

  async getStaffMember(id: string) {
    const res = await apiClient.get(ENDPOINTS.STAFF.STAFF_BY_ID(id));
    return res;
  },

  async createAdmin(data: {
    firstName: string;
    lastName: string;
    email: string;
    department: string;
  }) {
    const res = await apiClient.post(ENDPOINTS.STAFF.DEPARTMENT_HEADS, data);
    return res;
  },

  async createStaff(data: {
    firstName: string;
    lastName: string;
    email: string;
    department: string;
    lineManager: string;
    phone?: string;
  }) {
    const res = await apiClient.post(ENDPOINTS.STAFF.ALL_STAFF, data);
    return res;
  },

  async suspendStaff(id: string, reason: string) {
    const res = await apiClient.put(ENDPOINTS.STAFF.STAFF_SUSPEND(id), { reason });
    return res;
  },

  async deactivateStaff(id: string) {
    const res = await apiClient.put(ENDPOINTS.STAFF.STAFF_DEACTIVATE(id));
    return res;
  },

  async activateStaff(id: string) {
    const res = await apiClient.put(ENDPOINTS.STAFF.STAFF_ACTIVATE(id));
    return res;
  },

  async deleteStaff(id: string) {
    const res = await apiClient.delete(ENDPOINTS.STAFF.STAFF_DELETE(id));
    return res;
  },

  async restoreStaff(id: string) {
    const res = await apiClient.put(ENDPOINTS.STAFF.STAFF_RESTORE(id));
    return res;
  },

  // ==================== ACCOUNT MANAGEMENT ====================

  async getSuspendedAccounts(params?: PaginationParams) {
    const res = await apiClient.get(ENDPOINTS.IT.SUSPENDED_ACCOUNTS, { params });
    return res;
  },

  async getDeletedAccounts(params?: PaginationParams) {
    const res = await apiClient.get(ENDPOINTS.IT.DELETED_ACCOUNTS, { params });
    return res;
  },

  // ==================== PROFILE (SETTINGS) ====================

  async getProfile() {
    const res = await apiClient.get(ENDPOINTS.IT.PROFILE);
    return res;
  },

  async updateProfile(data: { firstName?: string; lastName?: string; phone?: string }) {
    const res = await apiClient.put(ENDPOINTS.IT.PROFILE, data);
    return res;
  },

  async uploadAvatar(formData: FormData) {
    const res = await apiClient.post(ENDPOINTS.IT.PROFILE_AVATAR, formData);
    return res;
  },

  async changePassword(currentPassword: string, newPassword: string) {
    const res = await apiClient.post(ENDPOINTS.IT.CHANGE_PASSWORD, {
      currentPassword,
      newPassword,
    });
    return res;
  },

  async verifyOTP(otp: string) {
    const res = await apiClient.post(ENDPOINTS.IT.VERIFY_OTP, { otp });
    return res;
  },

  async resendOTP() {
    const res = await apiClient.post(ENDPOINTS.IT.RESEND_OTP);
    return res;
  },
};