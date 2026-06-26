import { apiClient } from "@/lib/client";
import { ENDPOINTS } from "@/lib/config";

export interface CatalogItemData {
  category: string;
  triggerValue?: number;
  label: string;
  rewardType: string;
  walletCreditAmount?: number;
  freeItemDescription?: string;
  isMysteryPoolMember?: boolean;
  phase: number;
}

export interface CatalogItem extends CatalogItemData {
  _id: string;
  active: boolean;
  createdAt: string;
}

export interface CustomerRewardEntry {
  _id: string;
  customer: { _id: string; name: string; email: string; phone: string };
  catalogItem: { _id: string; label: string; category: string; rewardType: string };
  order?: { _id: string; orderRef: string; totalPrice: number };
  category: string;
  rewardType: string;
  label: string;
  walletCreditAmount: number;
  phase: number;
  status: "pending" | "applied" | "redeemed" | "expired";
  appliedAt?: string;
  redeemedAt?: string;
  createdAt: string;
}

export interface RewardStats {
  _id: string;
  count: number;
}

export interface LuckyOrderDraw {
  _id: string;
  date: string;
  winner: { _id: string; name: string; email: string; phone: string };
  rewardCatalogItem: { label: string; rewardType: string; walletCreditAmount: number };
  eligiblePoolSize: number;
  triggeredBy?: { firstName: string; lastName: string };
  createdAt: string;
}

export const rewardsService = {
  // ── Catalog ───────────────────────────────────────────────

  async getCatalogItems(filters: Record<string, unknown> = {}) {
    return await apiClient.get(ENDPOINTS.OPERATIONS.REWARDS_CATALOG, { params: filters });
  },

  async getCatalogItem(id: string) {
    return await apiClient.get(ENDPOINTS.OPERATIONS.REWARDS_CATALOG_BY_ID(id));
  },

  async createCatalogItem(data: CatalogItemData) {
    return await apiClient.post(ENDPOINTS.OPERATIONS.REWARDS_CATALOG, data);
  },

  async updateCatalogItem(id: string, data: Partial<CatalogItemData>) {
    return await apiClient.put(ENDPOINTS.OPERATIONS.REWARDS_CATALOG_BY_ID(id), data);
  },

  async deactivateCatalogItem(id: string) {
    return await apiClient.patch(ENDPOINTS.OPERATIONS.REWARDS_CATALOG_DEACTIVATE(id), {});
  },

  async reactivateCatalogItem(id: string) {
    return await apiClient.patch(ENDPOINTS.OPERATIONS.REWARDS_CATALOG_REACTIVATE(id), {});
  },

  async deleteCatalogItem(id: string) {
    return await apiClient.delete(ENDPOINTS.OPERATIONS.REWARDS_CATALOG_BY_ID(id));
  },

  // ── Ledger ────────────────────────────────────────────────

  async getLedger(params: Record<string, unknown> = {}) {
    return await apiClient.get(ENDPOINTS.OPERATIONS.REWARDS_LEDGER, { params });
  },

  async getLedgerStats() {
    return await apiClient.get(ENDPOINTS.OPERATIONS.REWARDS_LEDGER_STATS);
  },

  async getCustomerRewards(customerId: string, params: Record<string, unknown> = {}) {
    return await apiClient.get(ENDPOINTS.OPERATIONS.REWARDS_LEDGER_CUSTOMER(customerId), {
      params,
    });
  },

  async markRedeemed(id: string) {
    return await apiClient.patch(ENDPOINTS.OPERATIONS.REWARDS_LEDGER_REDEEM(id), {});
  },

  // ── Lucky Order ───────────────────────────────────────────

  async getLuckyOrderPool() {
    return await apiClient.get(ENDPOINTS.OPERATIONS.REWARDS_LUCKY_POOL);
  },

  async getLuckyOrderToday() {
    return await apiClient.get(ENDPOINTS.OPERATIONS.REWARDS_LUCKY_TODAY);
  },

  async getLuckyOrderHistory(params: Record<string, unknown> = {}) {
    return await apiClient.get(ENDPOINTS.OPERATIONS.REWARDS_LUCKY_HISTORY, { params });
  },

  async runLuckyOrderDraw() {
    return await apiClient.post(ENDPOINTS.OPERATIONS.REWARDS_LUCKY_DRAW, {});
  },
};

export default rewardsService;
