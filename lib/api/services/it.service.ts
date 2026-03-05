import { apiClient } from '@/lib/client';
import type {
  Customer,
  Vendor,
  Rider,
  Staff,
  PaginatedResponse,
  PaginationParams,
} from '@/types';

// Dashboard
export const itService = {
  // ==================== DASHBOARD ====================
  async getDashboard() {
    const res = await apiClient.get<{
      success: boolean;
      message?: string;
      customers: { total: number; active: number };
      vendors: { total: number; active: number };
      riders: { total: number; active: number };
      staff: { total: number; active: number };
      orders: { total: number; pending: number };
    }>('/api/it/dashboard');
    
    // Backend returns data directly, not wrapped in 'data' field
    return {
      customers: res.customers,
      vendors: res.vendors,
      riders: res.riders,
      staff: res.staff,
      orders: res.orders,
    };
  },

  // ==================== CUSTOMERS ====================
  async getCustomers(params?: PaginationParams) {
    // CRITICAL: Apply strict filters to only show active, non-suspended, non-deleted customers
    const queryParams: Record<string, any> = {
      ...params,
      isActive: 'true',       // Only active accounts
      isSuspended: 'false',   // Exclude suspended
      // isDeleted filter handled by backend (always excluded)
    };
    
    const res = await apiClient.get<{
      success: boolean;
      customers: Customer[];
      pagination: {
        total: number;
        page: number;
        pages: number;
        limit: number;
      };
    }>('/api/it/customers', { params: queryParams });
    return {
      customers: res.customers,
      pagination: res.pagination,
    };
  },

  async getCustomer(id: string) {
    const res = await apiClient.get<{
      success: boolean;
      customer: Customer;
    }>(`/api/it/customers/${id}`);
    return res.customer;
  },

  async suspendCustomer(id: string, reason: string) {
    const res = await apiClient.put(`/api/it/customers/${id}/suspend`, { reason });
    return res.data;
  },

  async activateCustomer(id: string) {
    const res = await apiClient.put(`/api/it/customers/${id}/activate`);
    return res.data;
  },

  async deleteCustomer(id: string) {
    const res = await apiClient.delete(`/api/it/customers/${id}`);
    return res;
  },

  async restoreCustomer(id: string) {
    const res = await apiClient.put(`/api/it/customers/${id}/restore`);
    return res;
  },

  // ==================== VENDORS ====================
  async getVendors(params?: PaginationParams) {
    // CRITICAL: Apply strict filters to only show active, non-suspended, non-deleted vendors
    const queryParams: Record<string, any> = {
      ...params,
      isActive: 'true',       // Only active accounts
      isSuspended: 'false',   // Exclude suspended
      // isDeleted filter handled by backend (always excluded)
    };
    
    const res = await apiClient.get<{
      success: boolean;
      vendors: Vendor[];
      pagination: {
        total: number;
        page: number;
        pages: number;
        limit: number;
      };
    }>('/api/it/vendors', { params: queryParams });
    return {
      vendors: res.vendors,
      pagination: res.pagination,
    };
  },

  async getVendor(id: string) {
    const res = await apiClient.get<{
      success: boolean;
      vendor: Vendor;
    }>(`/api/it/vendors/${id}`);
    return res.vendor;
  },

  async suspendVendor(id: string, reason: string) {
    const res = await apiClient.put(`/api/it/vendors/${id}/suspend`, { reason });
    return res.data;
  },

  async activateVendor(id: string) {
    const res = await apiClient.put(`/api/it/vendors/${id}/activate`);
    return res.data;
  },

  async verifyVendor(id: string) {
    const res = await apiClient.put(`/api/it/vendors/${id}/verify`);
    return res.data;
  },

  async deleteVendor(id: string) {
    const res = await apiClient.delete(`/api/it/vendors/${id}`);
    return res;
  },

  async restoreVendor(id: string) {
    const res = await apiClient.put(`/api/it/vendors/${id}/restore`);
    return res;
  },

  // ==================== RIDERS ====================
  async getRiders(params?: PaginationParams) {
    // CRITICAL: Apply strict filters to only show active, non-suspended, non-deleted riders
    const queryParams: Record<string, any> = {
      ...params,
      isActive: 'true',       // Only active accounts
      isSuspended: 'false',   // Exclude suspended
      // isDeleted filter handled by backend (always excluded)
    };
    
    const res = await apiClient.get<{
      success: boolean;
      riders: Rider[];
      pagination: {
        total: number;
        page: number;
        pages: number;
        limit: number;
      };
    }>('/api/it/riders', { params: queryParams });
    return {
      riders: res.riders,
      pagination: res.pagination,
    };
  },

  async getRider(id: string) {
    const res = await apiClient.get<{
      success: boolean;
      rider: Rider;
    }>(`/api/it/riders/${id}`);
    return res.rider;
  },

  async suspendRider(id: string, reason: string) {
    const res = await apiClient.put(`/api/it/riders/${id}/suspend`, { reason });
    return res.data;
  },

  async activateRider(id: string) {
    const res = await apiClient.put(`/api/it/riders/${id}/activate`);
    return res.data;
  },

  async deleteRider(id: string) {
    const res = await apiClient.delete(`/api/it/riders/${id}`);
    return res;
  },

  async restoreRider(id: string) {
    const res = await apiClient.put(`/api/it/riders/${id}/restore`);
    return res;
  },

  // ==================== STAFF ====================
  /**
   * Get all staff members (isHead=false, ACTIVE ONLY, NOT SUSPENDED, NOT DELETED)
   * Backend returns: { success, count, total, page, pages, data: [...] }
   */
  async getStaff(params?: PaginationParams) {
    // CRITICAL: Apply strict filters to only show active, non-suspended, non-deleted staff
    const queryParams: Record<string, any> = {
      ...params,
      isHead: 'false',        // Only non-head staff
      isActive: 'true',       // Only active accounts
      isSuspended: 'false',   // Exclude suspended
      // isDeleted filter handled by backend (always excluded)
    };

    const res = await apiClient.get<{
      success: boolean;
      count: number;
      total: number;
      page: number;
      pages: number;
      data: Staff[];
    }>('/api/staff', { params: queryParams });
    
    console.log('[IT Service] Staff response:', res);
    
    return {
      staff: res.data,
      pagination: {
        total: res.total,
        page: res.page,
        pages: res.pages,
        limit: params?.limit || 7,
      },
    };
  },

  /**
   * Get all admins/heads (isHead=true OR isSuperAdmin=true, ACTIVE ONLY, NOT SUSPENDED, NOT DELETED)
   * Backend returns: { success, count, total, page, pages, data: [...] }
   */
  async getAdmins(params?: PaginationParams) {
    // CRITICAL: Apply strict filters to only show active, non-suspended, non-deleted admins
    const queryParams: Record<string, any> = {
      ...params,
      isHead: 'true',         // Only heads/admins
      isActive: 'true',       // Only active accounts
      isSuspended: 'false',   // Exclude suspended
      // isDeleted filter handled by backend (always excluded)
    };

    const res = await apiClient.get<{
      success: boolean;
      count: number;
      total: number;
      page: number;
      pages: number;
      data: Staff[];
    }>('/api/staff', { params: queryParams });
    
    console.log('[IT Service] Admins response:', res);
    
    return {
      admins: res.data,
      pagination: {
        total: res.total,
        page: res.page,
        pages: res.pages,
        limit: params?.limit || 7,
      },
    };
  },

  /**
   * Create a new admin/department head
   * POST /api/staff/department-heads
   */
  async createAdmin(data: {
    firstName: string;
    lastName: string;
    email: string;
    department: string;
  }) {
    console.log('[IT Service] Creating admin:', data);
    const res = await apiClient.post('/api/staff/department-heads', data);
    console.log('[IT Service] Admin created:', res);
    return res;
  },

  /**
   * Create a new staff member
   * POST /api/staff
   */
  async createStaff(data: {
    firstName: string;
    lastName: string;
    email: string;
    department: string;
    lineManager: string;
    phone?: string;
  }) {
    console.log('[IT Service] Creating staff:', data);
    const res = await apiClient.post('/api/staff', data);
    console.log('[IT Service] Staff created:', res);
    return res;
  },

  /**
   * Get single staff member by ID
   */
  async getStaffMember(id: string) {
    const res = await apiClient.get<{ success: boolean; data: Staff }>(`/api/staff/${id}`);
    return res.data;
  },

  /**
   * Suspend staff member
   */
  async suspendStaff(id: string, reason: string) {
    const res = await apiClient.put(`/api/staff/${id}/suspend`, { reason });
    return res;
  },

  /**
   * Deactivate staff member
   */
  async deactivateStaff(id: string) {
    const res = await apiClient.put(`/api/staff/${id}/deactivate`);
    return res;
  },

  /**
   * Activate staff member
   */
  async activateStaff(id: string) {
    const res = await apiClient.put(`/api/staff/${id}/activate`);
    return res;
  },

  /**
   * Delete staff member
   */
  async deleteStaff(id: string) {
    const res = await apiClient.delete(`/api/staff/${id}`);
    return res;
  },

  async restoreStaff(id: string) {
    const res = await apiClient.put(`/api/staff/${id}/restore`);
    return res;
  },

  // ==================== ACCOUNT MANAGEMENT ====================
  async getSuspendedAccounts(params?: PaginationParams) {
    console.log('[IT Service] Fetching suspended accounts with params:', params);
    
    const res = await apiClient.get<{
      success: boolean;
      suspendedAccounts: {
        customers: any[];
        vendors: any[];
        riders: any[];
        staff: any[];
      };
      pagination: {
        total: number;
        page: number;
        pages: number;
        limit: number;
      };
    }>('/api/it/suspended-accounts', { params });
    
    console.log('[IT Service] Raw suspended accounts response:', res);
    console.log('[IT Service] Has suspendedAccounts?', !!res.suspendedAccounts);
    console.log('[IT Service] Customers count:', res.suspendedAccounts?.customers?.length);
    console.log('[IT Service] Vendors count:', res.suspendedAccounts?.vendors?.length);
    console.log('[IT Service] Riders count:', res.suspendedAccounts?.riders?.length);
    console.log('[IT Service] Staff count:', res.suspendedAccounts?.staff?.length);
    
    return {
      suspendedAccounts: res.suspendedAccounts,
      pagination: res.pagination,
    };
  },

  async getDeletedAccounts(params?: PaginationParams) {
    console.log('[IT Service] Fetching deleted accounts with params:', params);
    
    const res = await apiClient.get<{
      success: boolean;
      deletedAccounts: {
        customers: any[];
        vendors: any[];
        riders: any[];
        staff: any[];
      };
      pagination: {
        total: number;
        page: number;
        pages: number;
        limit: number;
      };
    }>('/api/it/deleted-accounts', { params });
    
    console.log('[IT Service] Raw deleted accounts response:', res);
    console.log('[IT Service] Has deletedAccounts?', !!res.deletedAccounts);
    console.log('[IT Service] Customers count:', res.deletedAccounts?.customers?.length);
    console.log('[IT Service] Vendors count:', res.deletedAccounts?.vendors?.length);
    console.log('[IT Service] Riders count:', res.deletedAccounts?.riders?.length);
    console.log('[IT Service] Staff count:', res.deletedAccounts?.staff?.length);
    
    return {
      deletedAccounts: res.deletedAccounts,
      pagination: res.pagination,
    };
  },

  // ==================== PROFILE (SETTINGS) ====================
  /**
   * Get current user's profile
   * GET /api/it/profile
   */
  async getProfile() {
    const res = await apiClient.get('/api/it/profile');
    return res;
  },

  /**
   * Update current user's profile
   * PUT /api/it/profile
   */
  async updateProfile(data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
  }) {
    const res = await apiClient.put('/api/it/profile', data);
    return res;
  },

  /**
   * Upload profile avatar (base64)
   * POST /api/it/profile/avatar
   */
  async uploadAvatar(formData: FormData) {
  // ✅ NO headers - let browser handle Content-Type with boundary
  const res = await apiClient.post('/api/it/profile/avatar', formData);
  return res;
},

  /**
   * Initiate password change (sends OTP)
   * POST /api/it/change-password
   */
  async changePassword(currentPassword: string, newPassword: string) {
    const res = await apiClient.post('/api/it/change-password', {
      currentPassword,
      newPassword,
    });
    return res;
  },

  /**
   * Verify OTP and complete password change
   * POST /api/it/verify-otp
   */
  async verifyOTP(otp: string) {
    const res = await apiClient.post('/api/it/verify-otp', { otp });
    return res;
  },

  /**
   * Resend OTP for password change
   * POST /api/it/resend-otp
   */
  async resendOTP() {
    const res = await apiClient.post('/api/it/resend-otp');
    return res;
  },
};