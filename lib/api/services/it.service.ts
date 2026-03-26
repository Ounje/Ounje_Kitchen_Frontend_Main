import { apiClient } from '@/lib/client';
import { ENDPOINTS } from '@/lib/config';
import { PaginationParams } from '@/types';

export interface PaginationMeta {
  total: number;
  page:  number;
  pages: number;
  limit: number;
}

export interface PaginationMeta {
  total: number;
  page:  number;
  pages: number;
  limit: number;
}

// ── Staff / Dashboard types ───────────────────────────────────────────────────
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

  async getDashboard() {
    const res = await apiClient.get(ENDPOINTS.IT.DASHBOARD);
    // apiClient unwraps { success, data } → res is the data object directly
    // Handle both shapes: res = { customers, vendors, ... } OR res = { data: { customers, ... } }
    const d = ((res as any)?.customers !== undefined) ? res : ((res as any)?.data ?? res);
    return d;
  },

  // ==================== CUSTOMERS ====================
  // Controllers check: search, name, email, phoneNumber, isActive, isSuspended
  // Frontend sends:    name, email, phoneNumber, accountStatus as individual filters

  async getCustomers(params?: PaginationParams & {
    name?:          string;
    email?:         string;
    phoneNumber?:   string;
    accountStatus?: string;
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
  // Controllers check: search, name, email, phoneNumber, isActive, isSuspended, isVerified
  // No server-side active/suspended defaults — frontend filters client-side

  async getVendors(params?: PaginationParams & {
    name?:        string;
    email?:       string;
    phoneNumber?: string;
    isVerified?:  string;
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
  // Controllers check: search, name, phoneNumber, isActive, isSuspended, vehicleType
  // No server-side active/suspended defaults — frontend filters client-side

  async getRiders(params?: PaginationParams & {
    name?:        string;
    phoneNumber?: string;
    vehicleType?: string;
    zone?:        string;
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
    const res = await apiClient.get(ENDPOINTS.STAFF.ALL_STAFF, {
      params: { isHead: 'false', ...params },
    });
    return res;
  },

  async getAdmins(params?: PaginationParams & { department?: string }) {
    const res = await apiClient.get(ENDPOINTS.STAFF.ALL_STAFF, {
      params: { isHead: 'true', ...params },
    });
    return res;
  },

  // No isHead filter — returns everyone including SuperAdmin for lineManager lookups
  async getAllStaffForLookup(params?: PaginationParams) {
    const res = await apiClient.get(ENDPOINTS.STAFF.ALL_STAFF, {
      params: { page: 1, limit: 200, ...params },
    });
    return res;
  },

  async getStaffMember(id: string) {
    const res = await apiClient.get(ENDPOINTS.STAFF.STAFF_BY_ID(id));
    return res;
  },

  async createAdmin(data: {
    firstName:  string;
    lastName:   string;
    email:      string;
    department: string;
  }) {
    const res = await apiClient.post(ENDPOINTS.STAFF.DEPARTMENT_HEADS, data);
    return res;
  },

  async createStaff(data: {
    firstName:   string;
    lastName:    string;
    email:       string;
    department:  string;
    lineManager: string;
    phone?:      string;
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

  // ==================== ORDERS ====================

  async getOrders(params?: PaginationParams & {
    name?:   string;
    vendor?: string;
    rider?:  string;
    zone?:   string;
    period?: string;
    status?: string;
  }) {
    const res = await apiClient.get(ENDPOINTS.IT.ORDERS, { params });
    return res;
  },

  async getOrder(id: string) {
    const res = await apiClient.get(ENDPOINTS.IT.ORDER_BY_ID(id));
    return res;
  },

  async deleteOrder(id: string) {
    const res = await apiClient.delete(ENDPOINTS.IT.ORDER_BY_ID(id));
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

  // ==================== PROMO CODES ====================

  async getPromos() {
    return await apiClient.get(ENDPOINTS.IT.PROMOS);
  },

  async togglePromo(id: string) {
    return await apiClient.put(ENDPOINTS.IT.PROMO_TOGGLE(id), {});
  },
};