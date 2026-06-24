import { apiClient } from "@/lib/client";
import { ENDPOINTS } from "@/lib/config";

export const pushService = {
  async subscribe(subscription: PushSubscriptionJSON, userAgent?: string) {
    return apiClient.post(ENDPOINTS.SHARED.PUSH_SUBSCRIBE, { subscription, userAgent });
  },

  async unsubscribe(endpoint: string) {
    return apiClient.delete(ENDPOINTS.SHARED.PUSH_UNSUBSCRIBE, {
      body: JSON.stringify({ endpoint }),
    } as RequestInit);
  },
};
