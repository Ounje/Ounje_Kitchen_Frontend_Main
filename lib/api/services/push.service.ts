import { apiClient } from "@/lib/client";
import { ENDPOINTS } from "@/lib/config";

export const pushService = {
  async subscribe(subscription: PushSubscriptionJSON, userAgent?: string) {
    return apiClient.post(ENDPOINTS.PUSH.SUBSCRIBE, { subscription, userAgent });
  },

  async unsubscribe(endpoint: string) {
    return apiClient.post(ENDPOINTS.PUSH.UNSUBSCRIBE, { endpoint });
  },
};
