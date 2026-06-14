import { apiClient } from "@/lib/client";
import { ENDPOINTS } from "@/lib/config";

const E = ENDPOINTS.ACCOUNTS;

// ── helpers ───────────────────────────────────────────────────────────────────
function unwrap(res: any) {
  // success helper spreads data, so res = { success, message, data?, ... }
  return (res as any)?.data ?? (res as any);
}

// ── CUSTOMERS ─────────────────────────────────────────────────────────────────
export const customerSetupService = {
  list(params?: { search?: string; page?: number; limit?: number }) {
    return apiClient.get(E.CUSTOMERS, { params }) as Promise<any>;
  },
  create(body: { name: string; email: string; phone?: string; address?: string }) {
    return apiClient.post(E.CUSTOMERS, body) as Promise<any>;
  },
  update(
    userId: string,
    body: Partial<{ name: string; phone: string; address: string; img: string }>
  ) {
    return apiClient.put(E.CUSTOMER_UPDATE(userId), body) as Promise<any>;
  },
};

// ── VENDORS ───────────────────────────────────────────────────────────────────
export const vendorSetupService = {
  list(params?: { search?: string; page?: number; limit?: number }) {
    return apiClient.get(E.VENDORS, { params }) as Promise<any>;
  },
  getById(vendorId: string) {
    return apiClient.get(E.VENDOR_BY_ID(vendorId)) as Promise<any>;
  },
  create(body: Record<string, any>) {
    return apiClient.post(E.VENDORS, body) as Promise<any>;
  },
  update(vendorId: string, body: Record<string, any>) {
    return apiClient.put(E.VENDOR_UPDATE(vendorId), body) as Promise<any>;
  },
};

// ── FOOD ITEMS ────────────────────────────────────────────────────────────────
export const foodItemService = {
  list(vendorId: string, params?: { page?: number; limit?: number; category?: string }) {
    return apiClient.get(E.FOOD_ITEMS(vendorId), { params }) as Promise<any>;
  },
  create(vendorId: string, body: Record<string, any>) {
    return apiClient.post(E.FOOD_ITEMS(vendorId), body) as Promise<any>;
  },
  update(vendorId: string, itemId: string, body: Record<string, any>) {
    return apiClient.put(E.FOOD_ITEM(vendorId, itemId), body) as Promise<any>;
  },
  remove(vendorId: string, itemId: string) {
    return apiClient.delete(E.FOOD_ITEM(vendorId, itemId)) as Promise<any>;
  },
  toggle(vendorId: string, itemId: string) {
    return apiClient.patch(E.FOOD_ITEM_TOGGLE(vendorId, itemId)) as Promise<any>;
  },
};

// ── COMBOS ────────────────────────────────────────────────────────────────────
export const comboService = {
  list(vendorId: string, params?: { page?: number; limit?: number }) {
    return apiClient.get(E.COMBOS(vendorId), { params }) as Promise<any>;
  },
  create(vendorId: string, body: Record<string, any>) {
    return apiClient.post(E.COMBOS(vendorId), body) as Promise<any>;
  },
  update(vendorId: string, comboId: string, body: Record<string, any>) {
    return apiClient.put(E.COMBO(vendorId, comboId), body) as Promise<any>;
  },
  remove(vendorId: string, comboId: string) {
    return apiClient.delete(E.COMBO(vendorId, comboId)) as Promise<any>;
  },
  toggle(vendorId: string, comboId: string) {
    return apiClient.patch(E.COMBO_TOGGLE(vendorId, comboId)) as Promise<any>;
  },
};

// ── RIDERS ────────────────────────────────────────────────────────────────────
export const riderSetupService = {
  list(params?: { search?: string; page?: number; limit?: number }) {
    return apiClient.get(E.RIDERS, { params }) as Promise<any>;
  },
  getById(riderId: string) {
    return apiClient.get(E.RIDER_BY_ID(riderId)) as Promise<any>;
  },
  create(body: Record<string, any>) {
    return apiClient.post(E.RIDERS, body) as Promise<any>;
  },
  update(riderId: string, body: Record<string, any>) {
    return apiClient.put(E.RIDER_UPDATE(riderId), body) as Promise<any>;
  },
};

export { unwrap };
