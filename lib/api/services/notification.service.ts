import { apiClient } from "@/lib/client";
import { ENDPOINTS } from "@/lib/config";

export const notificationService = {
  async getAllNotifications(params?: { targetPortal?: string; page?: number; limit?: number }) {
    return await apiClient.get(ENDPOINTS.SHARED.NOTIFICATIONS, {
      params: params ?? undefined,
    });
  },

  async getNotificationById(id: string) {
    return await apiClient.get(ENDPOINTS.SHARED.NOTIFICATIONS + `/${id}`);
  },

  async markAsRead(id: string) {
    return await apiClient.put(ENDPOINTS.SHARED.NOTIFICATIONS + `/${id}/read`, {});
  },

  async createBroadcast(data: {
    title: string;
    message: string;
    audience?: string;
    type?: string;
    sourcePortal?: string;
    targetPortal?: string;
    relatedId?: string;
    relatedModel?: string;
    channels?: string[];
    recipientId?: string;
    recipientType?: string;
  }) {
    return await apiClient.post(ENDPOINTS.SHARED.NOTIFICATIONS, data);
  },

  async searchRecipients(q: string, type?: string) {
    return await apiClient.get(ENDPOINTS.SHARED.NOTIFICATIONS + "/search-recipients", {
      params: { q, ...(type ? { type } : {}) },
    });
  },

  async deleteBroadcast(id: string) {
    return await apiClient.delete(ENDPOINTS.SHARED.NOTIFICATION_DELETE(id));
  },

  async deleteAll() {
    return await apiClient.delete(ENDPOINTS.SHARED.NOTIFICATIONS + "/delete-all");
  },
};

export default notificationService;
