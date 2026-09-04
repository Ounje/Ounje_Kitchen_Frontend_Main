import { apiClient } from "@/lib/client";
import { ENDPOINTS } from "@/lib/config";
import { notificationService } from "./notification.service";
import type { PaginationParams } from "@/types";

// ── Reviews types ─────────────────────────────────────────────────────────────
export type ReviewType = "vendor" | "rider" | "all";
export type ReviewFilter = "mixed" | "good" | "bad";

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

export interface AllReviewRow {
  id: string;
  entityType: "vendor" | "rider";
  name: string;
  photo: string;
  location: string;
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
  ratingCategory?: "1" | "2" | "3" | "4" | "5";
  filter?: ReviewFilter;
}

// ── Service ───────────────────────────────────────────────────────────────────
export const operationsService = {
  // ==================== DASHBOARD ====================
  async getDashboard() {
    const res = await apiClient.get(ENDPOINTS.OPERATIONS.DASHBOARD);
    return res;
  },

  // ==================== ORDERS ====================
  async getOrders(
    params?: PaginationParams & {
      name?: string;
      vendor?: string;
      zone?: string;
      orderId?: string;
      status?: string;
      startDate?: string;
      endDate?: string;
    }
  ) {
    const res = await apiClient.get(ENDPOINTS.OPERATIONS.ORDERS, { params });
    return res;
  },

  async getOrder(id: string) {
    const res = await apiClient.get(ENDPOINTS.OPERATIONS.ORDER_BY_ID(id));
    return res;
  },

  async getAvailableRiders(orderId: string) {
    const res = await apiClient.get(ENDPOINTS.OPERATIONS.ORDER_AVAILABLE_RIDERS(orderId));
    return res;
  },

  async assignRider(orderId: string, riderId: string) {
    const res = await apiClient.put(ENDPOINTS.OPERATIONS.ORDER_ASSIGN_RIDER(orderId), { riderId });
    return res;
  },

  async updateOrderStatus(orderId: string, status: string, reason?: string) {
    const res = await apiClient.put(ENDPOINTS.OPERATIONS.ORDER_STATUS(orderId), { status, reason });
    return res;
  },

  async remindVendor(orderId: string) {
    const res = await apiClient.put(ENDPOINTS.OPERATIONS.ORDER_REMIND_VENDOR(orderId));
    return res;
  },

  async remindRider(orderId: string) {
    const res = await apiClient.put(ENDPOINTS.OPERATIONS.ORDER_REMIND_RIDER(orderId));
    return res;
  },

  async startRiderAlertLoop(orderId: string) {
    const res = await apiClient.put(ENDPOINTS.OPERATIONS.ORDER_ALERT_RIDERS_START(orderId));
    return res;
  },

  async stopRiderAlertLoop(orderId: string) {
    const res = await apiClient.put(ENDPOINTS.OPERATIONS.ORDER_ALERT_RIDERS_STOP(orderId));
    return res;
  },

  // ==================== TRANSACTIONS ====================
  async getTransactionStats(params?: { startDate?: string; endDate?: string }) {
    const res = await apiClient.get(ENDPOINTS.OPERATIONS.TRANSACTIONS_STATS, { params });
    return res;
  },

  async getTransactions(params?: {
    page?: number;
    limit?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
  }) {
    const res = await apiClient.get(ENDPOINTS.OPERATIONS.TRANSACTIONS, { params });
    return res;
  },

  async getTransaction(id: string) {
    const res = await apiClient.get(ENDPOINTS.OPERATIONS.TRANSACTION_BY_ID(id));
    return res;
  },

  async exportTransactions(params?: { startDate?: string; endDate?: string; status?: string }) {
    const res = await apiClient.get(ENDPOINTS.OPERATIONS.TRANSACTIONS_EXPORT, { params } as any);
    return res;
  },

  async getAbandonedPayments(params?: { page?: number; limit?: number }) {
    const res = await apiClient.get(ENDPOINTS.OPERATIONS.TRANSACTIONS_ABANDONED, { params });
    return res;
  },

  // ==================== CUSTOMERS ====================
  async getCustomers(params?: PaginationParams & { name?: string; email?: string }) {
    const res = await apiClient.get(ENDPOINTS.OPERATIONS.CUSTOMERS, { params });
    return res;
  },

  async getCustomer(id: string) {
    const res = await apiClient.get(ENDPOINTS.OPERATIONS.CUSTOMER_BY_ID(id));
    return res;
  },

  async suspendCustomer(id: string, reason?: string) {
    const res = await apiClient.put(ENDPOINTS.OPERATIONS.CUSTOMER_SUSPEND(id), { reason });
    return res;
  },

  async activateCustomer(id: string) {
    const res = await apiClient.put(ENDPOINTS.OPERATIONS.CUSTOMER_ACTIVATE(id));
    return res;
  },

  async deleteCustomer(id: string) {
    const res = await apiClient.delete(ENDPOINTS.OPERATIONS.CUSTOMER_DELETE(id));
    return res;
  },

  // ==================== VENDORS ====================
  async getVendors(params?: PaginationParams & { name?: string; isVerified?: string }) {
    const res = await apiClient.get(ENDPOINTS.OPERATIONS.VENDORS, { params });
    return res;
  },

  async getVendor(id: string) {
    const res = await apiClient.get(ENDPOINTS.OPERATIONS.VENDOR_BY_ID(id));
    return res;
  },

  async suspendVendor(id: string, reason?: string) {
    const res = await apiClient.put(ENDPOINTS.OPERATIONS.VENDOR_SUSPEND(id), { reason });
    return res;
  },

  async activateVendor(id: string) {
    const res = await apiClient.put(ENDPOINTS.OPERATIONS.VENDOR_ACTIVATE(id));
    return res;
  },

  async verifyVendor(id: string) {
    const res = await apiClient.put(ENDPOINTS.OPERATIONS.VENDOR_VERIFY(id));
    return res;
  },

  async deleteVendor(id: string) {
    const res = await apiClient.delete(ENDPOINTS.OPERATIONS.VENDOR_DELETE(id));
    return res;
  },

  // ==================== RIDERS ====================
  async getRiders(
    params?: PaginationParams & {
      name?: string;
      zone?: string;
      isActive?: string;
      isSuspended?: string;
    }
  ) {
    const res = await apiClient.get(ENDPOINTS.OPERATIONS.RIDERS, { params });
    return res;
  },

  async getRider(id: string) {
    const res = await apiClient.get(ENDPOINTS.OPERATIONS.RIDER_BY_ID(id));
    return res;
  },

  async suspendRider(id: string, reason?: string) {
    const res = await apiClient.put(ENDPOINTS.OPERATIONS.RIDER_SUSPEND(id), { reason });
    return res;
  },

  async activateRider(id: string) {
    const res = await apiClient.put(ENDPOINTS.OPERATIONS.RIDER_ACTIVATE(id));
    return res;
  },

  async deleteRider(id: string) {
    const res = await apiClient.delete(ENDPOINTS.OPERATIONS.RIDER_DELETE(id));
    return res;
  },

  // ==================== RATINGS ====================
  async getRatings(params?: PaginationParams & { targetType?: string; rating?: string }) {
    const res = await apiClient.get(ENDPOINTS.OPERATIONS.RATINGS, { params });
    return res;
  },

  async getRating(id: string) {
    const res = await apiClient.get(ENDPOINTS.OPERATIONS.RATING_BY_ID(id));
    return res;
  },

  async deleteRating(id: string) {
    const res = await apiClient.delete(ENDPOINTS.OPERATIONS.RATING_BY_ID(id));
    return res;
  },

  // ==================== REVIEWS ====================
  async getReviewStats(type: ReviewType): Promise<ReviewStats> {
    const res = await apiClient.get(ENDPOINTS.OPERATIONS.REVIEWS_STATS, { params: { type } });
    const payload = (res as any)?.data ?? res;
    return payload as ReviewStats;
  },

  async getVendorReviews(params?: ReviewListParams) {
    const res = await apiClient.get(ENDPOINTS.OPERATIONS.REVIEWS_VENDORS, { params });
    return res;
  },

  async getRiderReviews(params?: ReviewListParams) {
    const res = await apiClient.get(ENDPOINTS.OPERATIONS.REVIEWS_RIDERS, { params });
    return res;
  },

  async getAllReviews(params?: ReviewListParams) {
    const res = await apiClient.get(ENDPOINTS.OPERATIONS.REVIEWS_ALL, { params });
    return res;
  },

  async getVendorReviewDetail(id: string, params?: { starFilter?: number; filter?: ReviewFilter }) {
    const res = await apiClient.get(ENDPOINTS.OPERATIONS.REVIEWS_VENDOR_BY_ID(id), { params });
    return res;
  },

  async getRiderReviewDetail(id: string, params?: { starFilter?: number; filter?: ReviewFilter }) {
    const res = await apiClient.get(ENDPOINTS.OPERATIONS.REVIEWS_RIDER_BY_ID(id), { params });
    return res;
  },

  // FIX: router registers these as POST (router.post), not PUT
  async warnReviewAccount(type: ReviewType, id: string) {
    const res = await apiClient.post(ENDPOINTS.OPERATIONS.REVIEWS_WARN(type, id));
    return res;
  },

  async suspendReviewAccount(type: ReviewType, id: string) {
    const res = await apiClient.post(ENDPOINTS.OPERATIONS.REVIEWS_SUSPEND(type, id));
    return res;
  },

  async commendReviewAccount(type: ReviewType, id: string) {
    const res = await apiClient.post(ENDPOINTS.OPERATIONS.REVIEWS_COMMEND(type, id));
    return res;
  },

  // ==================== PROFILE ====================
  async getProfile() {
    return apiClient.get(ENDPOINTS.OPERATIONS.PROFILE);
  },

  async updateProfile(data: { firstName?: string; lastName?: string; phone?: string }) {
    return apiClient.put(ENDPOINTS.OPERATIONS.PROFILE, data);
  },

  async uploadAvatar(formData: FormData) {
    return apiClient.post(ENDPOINTS.OPERATIONS.PROFILE_AVATAR, formData);
  },

  async changePassword(currentPassword: string, newPassword: string, alternativeEmail?: string) {
    return apiClient.post(ENDPOINTS.OPERATIONS.CHANGE_PASSWORD, {
      currentPassword,
      newPassword,
      ...(alternativeEmail ? { alternativeEmail } : {}),
    });
  },

  async verifyOTP(otp: string) {
    return apiClient.post(ENDPOINTS.OPERATIONS.VERIFY_OTP, { otp });
  },

  async resendOTP() {
    return apiClient.post(ENDPOINTS.OPERATIONS.RESEND_OTP);
  },

  // ==================== PROMO CODES ====================

  async getPromos() {
    return await apiClient.get(ENDPOINTS.OPERATIONS.PROMOS);
  },

  async createPromo(data: any) {
    return await apiClient.post(ENDPOINTS.OPERATIONS.PROMOS, data);
  },

  async togglePromo(id: string) {
    return await apiClient.put(ENDPOINTS.OPERATIONS.PROMO_TOGGLE(id), {});
  },

  async deletePromo(id: string) {
    return await apiClient.delete(ENDPOINTS.OPERATIONS.PROMO_DELETE(id));
  },

  // ==================== NOTIFICATIONS ====================
  // MOVED TO notificationService
  async getNotifications() {
    return await notificationService.getAllNotifications();
  },

  async createBroadcast(data: any) {
    return await notificationService.createBroadcast(data);
  },

  async deleteBroadcast(id: string) {
    return await notificationService.deleteBroadcast(id);
  },
};
