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

interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pages: number;
  total: number;
  limit: number;
}

interface DrawResult {
  winner: { name: string; email: string; phone: string };
  reward: { label: string; rewardType: string; walletCreditAmount: number };
  eligiblePoolSize: number;
  date: string;
}

export const rewardsService = {
  // ── Catalog ───────────────────────────────────────────────

  async getCatalogItems(filters: Record<string, unknown> = {}) {
    const res = await apiClient.get(ENDPOINTS.OPERATIONS.REWARDS_CATALOG, { params: filters });
    return res as { data: CatalogItem[] };
  },

  async getCatalogItem(id: string) {
    const res = await apiClient.get(ENDPOINTS.OPERATIONS.REWARDS_CATALOG_BY_ID(id));
    return res as { data: CatalogItem };
  },

  async createCatalogItem(data: CatalogItemData) {
    const res = await apiClient.post(ENDPOINTS.OPERATIONS.REWARDS_CATALOG, data);
    return res as { data: CatalogItem };
  },

  async updateCatalogItem(id: string, data: Partial<CatalogItemData>) {
    const res = await apiClient.put(ENDPOINTS.OPERATIONS.REWARDS_CATALOG_BY_ID(id), data);
    return res as { data: CatalogItem };
  },

  async deactivateCatalogItem(id: string) {
    const res = await apiClient.patch(ENDPOINTS.OPERATIONS.REWARDS_CATALOG_DEACTIVATE(id), {});
    return res as { data: CatalogItem };
  },

  async reactivateCatalogItem(id: string) {
    const res = await apiClient.patch(ENDPOINTS.OPERATIONS.REWARDS_CATALOG_REACTIVATE(id), {});
    return res as { data: CatalogItem };
  },

  async deleteCatalogItem(id: string) {
    const res = await apiClient.delete(ENDPOINTS.OPERATIONS.REWARDS_CATALOG_BY_ID(id));
    return res as { success: boolean; message?: string };
  },

  // ── Ledger ────────────────────────────────────────────────

  async getLedger(params: Record<string, unknown> = {}) {
    const res = await apiClient.get(ENDPOINTS.OPERATIONS.REWARDS_LEDGER, { params });
    return res as PaginatedResponse<CustomerRewardEntry>;
  },

  async getLedgerStats() {
    const res = await apiClient.get(ENDPOINTS.OPERATIONS.REWARDS_LEDGER_STATS);
    return res as { data: RewardStats[] };
  },

  async getCustomerRewards(customerId: string, params: Record<string, unknown> = {}) {
    const res = await apiClient.get(ENDPOINTS.OPERATIONS.REWARDS_LEDGER_CUSTOMER(customerId), {
      params,
    });
    return res as { data: CustomerRewardEntry[] };
  },

  async markRedeemed(id: string) {
    const res = await apiClient.patch(ENDPOINTS.OPERATIONS.REWARDS_LEDGER_REDEEM(id), {});
    return res as { data: CustomerRewardEntry };
  },

  // ── Lucky Order ───────────────────────────────────────────

  async getLuckyOrderPool() {
    const res = await apiClient.get(ENDPOINTS.OPERATIONS.REWARDS_LUCKY_POOL);
    return res as { data: { eligibleCount: number } };
  },

  async getLuckyOrderToday() {
    const res = await apiClient.get(ENDPOINTS.OPERATIONS.REWARDS_LUCKY_TODAY);
    return res as { data: LuckyOrderDraw | null };
  },

  async getLuckyOrderHistory(params: Record<string, unknown> = {}) {
    const res = await apiClient.get(ENDPOINTS.OPERATIONS.REWARDS_LUCKY_HISTORY, { params });
    return res as PaginatedResponse<LuckyOrderDraw>;
  },

  async runLuckyOrderDraw() {
    const res = await apiClient.post(ENDPOINTS.OPERATIONS.REWARDS_LUCKY_DRAW, {});
    return res as { data: DrawResult };
  },
};

export default rewardsService;
