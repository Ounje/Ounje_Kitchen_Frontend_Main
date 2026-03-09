import { apiClient } from '@/lib/client';
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

  /**
   * Fetch aggregated stats for the reviews page header cards.
   * Used by both vendor and rider views.
   *
   * GET /api/operations/reviews/stats?type=vendor|rider
   */
  async getReviewStats(type: ReviewType): Promise<ReviewStats> {
    const res = await apiClient.get<ReviewStats>(
      '/api/operations/reviews/stats',
      { params: { type } }
    );
    return res;
  },

  /**
   * Fetch paginated vendor review rows for the main table.
   *
   * GET /api/operations/reviews/vendors
   * Query: page, limit, ratingCategory, filter
   */
  async getVendorReviews(
    params?: ReviewListParams
  ): Promise<PaginatedResponse<VendorReviewRow>> {
    const res = await apiClient.get<PaginatedResponse<VendorReviewRow>>(
      '/api/operations/reviews/vendors',
      { params }
    );
    return res;
  },

  /**
   * Fetch paginated rider review rows for the main table.
   *
   * GET /api/operations/reviews/riders
   * Query: page, limit, ratingCategory, filter
   */
  async getRiderReviews(
    params?: ReviewListParams
  ): Promise<PaginatedResponse<RiderReviewRow>> {
    const res = await apiClient.get<PaginatedResponse<RiderReviewRow>>(
      '/api/operations/reviews/riders',
      { params }
    );
    return res;
  },

  /**
   * Fetch full review detail for a single vendor (profile + review list).
   *
   * GET /api/operations/reviews/vendors/:id
   * Query: starFilter (1–5), filter (mixed|good|bad)
   */
  async getVendorReviewDetail(
    id: string,
    params?: { starFilter?: number; filter?: ReviewFilter }
  ): Promise<VendorReviewDetail> {
    const res = await apiClient.get<VendorReviewDetail>(
      `/api/operations/reviews/vendors/${id}`,
      { params }
    );
    return res;
  },

  /**
   * Fetch full review detail for a single rider (profile + review list).
   *
   * GET /api/operations/reviews/riders/:id
   * Query: starFilter (1–5), filter (mixed|good|bad)
   */
  async getRiderReviewDetail(
    id: string,
    params?: { starFilter?: number; filter?: ReviewFilter }
  ): Promise<RiderReviewDetail> {
    const res = await apiClient.get<RiderReviewDetail>(
      `/api/operations/reviews/riders/${id}`,
      { params }
    );
    return res;
  },

  /**
   * Warn a vendor or rider account based on their reviews.
   *
   * POST /api/operations/reviews/:type/:id/warn
   */
  async warnReviewAccount(type: ReviewType, id: string): Promise<void> {
    await apiClient.post(`/api/operations/reviews/${type}/${id}/warn`);
  },

  /**
   * Suspend a vendor or rider account based on their reviews.
   *
   * POST /api/operations/reviews/:type/:id/suspend
   */
  async suspendReviewAccount(type: ReviewType, id: string): Promise<void> {
    await apiClient.post(`/api/operations/reviews/${type}/${id}/suspend`);
  },

  /**
   * Commend a vendor or rider account based on their reviews.
   *
   * POST /api/operations/reviews/:type/:id/commend
   */
  async commendReviewAccount(type: ReviewType, id: string): Promise<void> {
    await apiClient.post(`/api/operations/reviews/${type}/${id}/commend`);
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