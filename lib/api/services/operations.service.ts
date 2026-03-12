import { apiClient } from '@/lib/client';
import { ENDPOINTS } from '@/lib/config';
import type {
  Customer,
  Vendor,
  Rider,
  PaginatedResponse,
  PaginationParams,
} from '@/types';

// ── Reviews Types ─────────────────────────────────────────────────────────────
export type ReviewType = 'vendor' | 'rider';
export type ReviewFilter = 'mixed' | 'good' | 'bad';

export interface ReviewStats {
  totalReviews: number;
  goodRating: number;
  averageRating: number;
  badRating: number;
}

export interface ReviewItem {
  id: string;
  reviewerName: string;
  reviewerPhoto: string;
  starRating: number;
  date: string;
  text: string;
}

export interface VendorReviewRow {
  id: string;
  name: string;
  photo: string;
  address: string;
  totalRatings: number;
  starRating: number;
}

export interface RiderReviewRow {
  id: string;
  name: string;
  photo: string;
  zone: string;
  totalRatings: number;
  starRating: number;
}

export interface VendorReviewDetail {
  id: string;
  name: string;
  photo: string;
  phoneNumber: string;
  rating: number;
  ratingCount: number;
  address: string;
  reviews: ReviewItem[];
}

export interface RiderReviewDetail {
  id: string;
  name: string;
  photo: string;
  phoneNumber: string;
  rating: number;
  ratingCount: number;
  zone: string;
  reviews: ReviewItem[];
}

export interface ReviewListParams extends PaginationParams {
  ratingCategory?: '1' | '2' | '3' | '4' | '5';
  filter?: ReviewFilter;
}

// ── Service ───────────────────────────────────────────────────────────────────
export const operationsService = {

  // ==================== DASHBOARD ====================
  async getDashboard(period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'daily') {
    const res = await apiClient.get(`${ENDPOINTS.OPERATIONS.DASHBOARD}?period=${period}`);
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
    const res = await apiClient.get(ENDPOINTS.OPERATIONS.ORDERS, { params });
    return res;
  },

  async getOrder(id: string) {
    const res = await apiClient.get(ENDPOINTS.OPERATIONS.ORDER_BY_ID(id));
    return res;
  },

  // ==================== CUSTOMERS ====================
  async getCustomers(params?: PaginationParams) {
    const queryParams: Record<string, any> = {
      ...params,
      isActive: 'true',
      isSuspended: 'false',
    };
    const res = await apiClient.get(ENDPOINTS.OPERATIONS.CUSTOMERS, { params: queryParams });
    return res;
  },

  async getCustomer(id: string) {
    const res = await apiClient.get(ENDPOINTS.OPERATIONS.CUSTOMER_BY_ID(id));
    return res;
  },

  // ==================== VENDORS ====================
  async getVendors(params?: PaginationParams) {
    const queryParams: Record<string, any> = {
      ...params,
      isActive: 'true',
      isSuspended: 'false',
    };
    const res = await apiClient.get(ENDPOINTS.OPERATIONS.VENDORS, { params: queryParams });
    return res;
  },

  async getVendor(id: string) {
    const res = await apiClient.get(ENDPOINTS.OPERATIONS.VENDOR_BY_ID(id));
    return res;
  },

  // ==================== RIDERS ====================
  async getRiders(params?: PaginationParams & {
    zone?: string;
    status?: 'active' | 'inactive';
  }) {
    const res = await apiClient.get(ENDPOINTS.OPERATIONS.RIDERS, { params });
    return res;
  },

  async getRider(id: string) {
    const res = await apiClient.get(ENDPOINTS.OPERATIONS.RIDER_BY_ID(id));
    return res;
  },

  async assignRider(orderId: string, riderId: string) {
    const res = await apiClient.post(ENDPOINTS.OPERATIONS.ORDER_ASSIGN_RIDER(orderId), {
      riderId,
    });
    return res;
  },

  // ==================== REVIEWS & RATINGS ====================

  async getReviewStats(type: ReviewType): Promise<ReviewStats> {
  const res = await apiClient.get<ReviewStats>(ENDPOINTS.OPERATIONS.REVIEWS_STATS, {
    params: { type },
  });
  return res;
},

async getVendorReviews(params?: ReviewListParams): Promise<PaginatedResponse<VendorReviewRow>> {
  const res = await apiClient.get<PaginatedResponse<VendorReviewRow>>(
    ENDPOINTS.OPERATIONS.REVIEWS_VENDORS, { params }
  );
  return res;
},

async getRiderReviews(params?: ReviewListParams): Promise<PaginatedResponse<RiderReviewRow>> {
  const res = await apiClient.get<PaginatedResponse<RiderReviewRow>>(
    ENDPOINTS.OPERATIONS.REVIEWS_RIDERS, { params }
  );
  return res;
},

async getVendorReviewDetail(
  id: string,
  params?: { starFilter?: number; filter?: ReviewFilter }
): Promise<VendorReviewDetail> {
  const res = await apiClient.get<VendorReviewDetail>(
    ENDPOINTS.OPERATIONS.REVIEWS_VENDOR_BY_ID(id), { params }
  );
  return res;
},

async getRiderReviewDetail(
  id: string,
  params?: { starFilter?: number; filter?: ReviewFilter }
): Promise<RiderReviewDetail> {
  const res = await apiClient.get<RiderReviewDetail>(
    ENDPOINTS.OPERATIONS.REVIEWS_RIDER_BY_ID(id), { params }
  );
  return res;
},

  async warnReviewAccount(type: ReviewType, id: string): Promise<void> {
    await apiClient.post(ENDPOINTS.OPERATIONS.REVIEWS_WARN(type, id));
  },

  async suspendReviewAccount(type: ReviewType, id: string): Promise<void> {
    await apiClient.post(ENDPOINTS.OPERATIONS.REVIEWS_SUSPEND(type, id));
  },

  async commendReviewAccount(type: ReviewType, id: string): Promise<void> {
    await apiClient.post(ENDPOINTS.OPERATIONS.REVIEWS_COMMEND(type, id));
  },

  // ==================== PROFILE (SETTINGS) ====================

  async getProfile() {
    const res = await apiClient.get(ENDPOINTS.OPERATIONS.PROFILE);
    return res;
  },

  async updateProfile(data: { firstName?: string; lastName?: string; phone?: string }) {
    const res = await apiClient.put(ENDPOINTS.OPERATIONS.PROFILE, data);
    return res;
  },

  async uploadAvatar(formData: FormData) {
    const res = await apiClient.post(ENDPOINTS.OPERATIONS.PROFILE_AVATAR, formData);
    return res;
  },

  async changePassword(currentPassword: string, newPassword: string) {
    const res = await apiClient.post(ENDPOINTS.OPERATIONS.CHANGE_PASSWORD, {
      currentPassword,
      newPassword,
    });
    return res;
  },

  async verifyOTP(otp: string) {
    const res = await apiClient.post(ENDPOINTS.OPERATIONS.VERIFY_OTP, { otp });
    return res;
  },

  async resendOTP() {
    const res = await apiClient.post(ENDPOINTS.OPERATIONS.RESEND_OTP);
    return res;
  },
};