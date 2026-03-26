import { apiClient } from '@/lib/client';
import { ENDPOINTS } from '@/lib/config';

export const notificationService = {
  /** Fetch all notifications, optionally filtered by the portal audience */
  async getAllNotifications(targetPortal?: string) {
    return await apiClient.get(ENDPOINTS.SHARED.NOTIFICATIONS, {
      params: targetPortal ? { targetPortal } : undefined,
    });
  },

  /** Fetch a single notification by _id */
  async getNotificationById(id: string) {
    return await apiClient.get(ENDPOINTS.SHARED.NOTIFICATIONS + `/${id}`);
  },

  /** Mark a notification as read */
  async markAsRead(id: string) {
    return await apiClient.put(ENDPOINTS.SHARED.NOTIFICATIONS + `/${id}/read`, {});
  },

  async createBroadcast(data: {
    title: string;
    message: string;
    audience: string;
    type?: string;
    sourcePortal?: string;
    targetPortal?: string;
    relatedId?: string;
    relatedModel?: string;
  }) {
    return await apiClient.post(ENDPOINTS.SHARED.NOTIFICATIONS, data);
  },

  /** Delete a notification */
  async deleteBroadcast(id: string) {
    return await apiClient.delete(ENDPOINTS.SHARED.NOTIFICATION_DELETE(id));
  },

  /** Delete ALL notifications (Cleanup) */
  async deleteAll() {
    return await apiClient.delete(ENDPOINTS.SHARED.NOTIFICATIONS + '/delete-all');
  },
};

export default notificationService;
