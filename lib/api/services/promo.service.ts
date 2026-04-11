import { apiClient } from '@/lib/client';
import { ENDPOINTS } from '@/lib/config';

export const promoService = {
  async getAllPromos() {
    return await apiClient.get(ENDPOINTS.OPERATIONS.PROMOS);
  },

  async getPromoById(id: string) {
    return await apiClient.get(ENDPOINTS.OPERATIONS.PROMOS + `/${id}`);
  },

  async createPromo(data: {
    name: string;
    code: string;
    discountType: string;
    discountValue: number;
    maxTotalUses: number;
    maxUsesPerUser: number;
    minOrderValue: number;
    eventName?: string;
    validUntil?: string;
  }) {
    return await apiClient.post(ENDPOINTS.OPERATIONS.PROMOS, data);
  },

  async togglePromo(id: string) {
    return await apiClient.put(ENDPOINTS.OPERATIONS.PROMO_TOGGLE(id), {});
  },

  /** SuperAdmin: approve a pending promo — activates it and broadcasts to customers */
  async approvePromo(id: string) {
    return await apiClient.put(ENDPOINTS.OPERATIONS.PROMOS + `/${id}/approve`, {});
  },

  /** SuperAdmin: decline a pending promo with a reason */
  async declinePromo(id: string, reason: string) {
    return await apiClient.put(ENDPOINTS.OPERATIONS.PROMOS + `/${id}/decline`, { reason });
  },

  async updatePromo(id: string, data: Partial<{
    name: string;
    code: string;
    discountType: string;
    discountValue: number;
    maxTotalUses: number;
    maxUsesPerUser: number;
    minOrderValue: number;
    eventName?: string;
    validUntil?: string;
    isActive: boolean;
  }>) {
    return await apiClient.put(ENDPOINTS.OPERATIONS.PROMOS + `/${id}`, data);
  },

  async deletePromo(id: string) {
    return await apiClient.delete(ENDPOINTS.OPERATIONS.PROMO_DELETE(id));
  },
};

export default promoService;
