import { apiClient } from "@/lib/client";
import { ENDPOINTS } from "@/lib/config";

// ── Types (flat interface matching what all components actually read) ──────────
export interface Vendor {
  id: string;
  _id?: string;
  name: string;
  phone: string;
  address: string;
  avatar: string; // photo / logo flattened
  // status
  accountStatus: "active" | "suspended";
  businessStatus: "registered" | "unregistered" | "pending";
  isActive: boolean;
  isSuspended: boolean;
  isVerified?: boolean;
  // business info
  cacNumber?: string;
  serviceType?: string;
  // ratings
  rating: number;
  ratingCount: number;
  // order stats (enrichVendor field names → mapped to what VendorMetrics expects)
  successfulOrders: number; // = deliveredOrders
  cancelledOrders: number; // = rejectedOrders
  pendingOrders: number; // = receivedOrders
  totalOrders: number;
  // inline from enrichVendor
  mostFrequentBuyer?: Buyer | null;
  createdAt?: string;
}

export interface Buyer {
  id: string;
  name: string;
  address?: string;
  avatar?: string;
  totalOrders: number;
  ordersCount?: number;
}

export interface TopVendor {
  id: string;
  name: string;
  phone: string;
  location: string;
  avatar: string;
  completedOrders: number;
  rank: 1 | 2 | 3;
}

export interface VendorFilters {
  name?: string;
  accountStatus?: "active" | "suspended" | "";
  businessStatus?: "registered" | "unregistered" | "pending" | "";
  page?: number;
  limit?: number;
}

export interface PaginatedVendors {
  vendors: Vendor[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ── Normaliser ────────────────────────────────────────────────────────────────
function normaliseVendor(raw: any): Vendor {
  const id = String(raw._id ?? raw.id ?? "");

  // Account status
  const isSuspended = raw.isSuspended === true;
  const isActive = raw.isActive !== false;
  const accountStatus: Vendor["accountStatus"] = isSuspended ? "suspended" : "active";

  // Business status
  let businessStatus: Vendor["businessStatus"] = "unregistered";
  if (raw.isVerified === true) businessStatus = "registered";
  else if (raw.isVerified === null) businessStatus = "pending";

  // Phone — vendor profile stores it at top level or via owner populate
  const phone = String(raw.owner?.phone ?? raw.phone ?? raw.phoneNumber ?? "");

  // Address — from GeoJSON location or direct address field
  const address = raw.location?.address ?? raw.address ?? "";

  // Avatar / photo
  const avatar = raw.photo ?? raw.logo ?? raw.image ?? raw.owner?.avatar ?? "";

  // Ratings
  const rating = raw.averageRating ?? raw.rating ?? 0;
  const ratingCount = raw.ratingCount ?? raw.totalRatings ?? 0;

  // Order stats — enrichVendor returns deliveredOrders / rejectedOrders / receivedOrders
  const successfulOrders = raw.deliveredOrders ?? raw.successfulOrders ?? raw.completedOrders ?? 0;
  const cancelledOrders = raw.rejectedOrders ?? raw.cancelledOrders ?? 0;
  const pendingOrders = raw.receivedOrders ?? raw.pendingOrders ?? 0;
  const totalOrders = raw.totalOrders ?? successfulOrders + cancelledOrders + pendingOrders;

  // Buyer
  const mb = raw.mostFrequentBuyer ?? null;
  const mostFrequentBuyer: Buyer | null = mb
    ? {
        id: String(mb.id ?? mb._id ?? ""),
        name: mb.name ?? "",
        address: mb.address ?? "",
        avatar: mb.avatar ?? mb.photo ?? "",
        totalOrders: mb.totalOrders ?? mb.ordersCount ?? 0,
        ordersCount: mb.totalOrders ?? mb.ordersCount ?? 0,
      }
    : null;

  return {
    id,
    _id: id,
    name: raw.name ?? "",
    phone,
    address,
    avatar,
    accountStatus,
    businessStatus,
    isActive,
    isSuspended,
    isVerified: raw.isVerified,
    cacNumber: raw.cacNumber ?? raw.cac ?? "",
    serviceType: raw.serviceType ?? raw.businessType ?? "",
    rating,
    ratingCount,
    successfulOrders,
    cancelledOrders,
    pendingOrders,
    totalOrders,
    mostFrequentBuyer,
    createdAt: raw.createdAt,
  };
}

function normaliseList(res: any): PaginatedVendors {
  // Operations vendorController returns FLAT shape:
  // { success, count, total, page, pages, data: [...vendors] }
  // IT vendorController returns WRAPPED shape:
  // { success, data: { vendors: [...], pagination: { total, page, pages } } }
  // Handle both:
  let rows: any[];
  let total: number, page: number, pages: number, limit: number;

  if (Array.isArray(res?.data)) {
    // Flat: data is the array directly
    rows = res.data;
    total = res.total ?? rows.length;
    page = res.page ?? 1;
    pages = res.pages ?? 1;
    limit = res.limit ?? rows.length;
  } else {
    // Wrapped: data is an object containing vendors + pagination
    const d = res?.data ?? res;
    rows = d?.vendors ?? d?.data ?? [];
    const pag = d?.pagination ?? d;
    total = pag?.total ?? rows.length;
    page = pag?.page ?? 1;
    pages = pag?.pages ?? 1;
    limit = pag?.limit ?? rows.length;
  }

  return {
    vendors: rows.map(normaliseVendor),
    total,
    page,
    limit,
    totalPages: pages,
  };
}

// ── Service ───────────────────────────────────────────────────────────────────
export const vendorService = {
  async getVendors(params: VendorFilters = {}): Promise<PaginatedVendors> {
    const { accountStatus, businessStatus, ...rest } = params;
    const query: Record<string, any> = { ...rest };
    if (accountStatus === "active") query.isActive = "true";
    if (accountStatus === "suspended") query.isSuspended = "true";
    if (businessStatus === "registered") query.isVerified = "true";
    if (businessStatus === "unregistered") query.isVerified = "false";

    const res = (await apiClient.get(ENDPOINTS.OPERATIONS.VENDORS, { params: query })) as any;
    return normaliseList(res);
  },

  // Top 3 vendors by completed orders — derived client-side (no dedicated endpoint)
  async getTopVendors(): Promise<TopVendor[]> {
    const res = (await apiClient.get(ENDPOINTS.OPERATIONS.VENDORS, {
      params: { isActive: "true", page: 1, limit: 20 },
    })) as any;
    const { vendors } = normaliseList(res);
    return vendors
      .sort((a, b) => b.successfulOrders - a.successfulOrders)
      .slice(0, 3)
      .map((v, i) => ({
        id: v.id,
        name: v.name,
        phone: v.phone,
        location: v.address,
        avatar: v.avatar,
        completedOrders: v.successfulOrders,
        rank: (i + 1) as 1 | 2 | 3,
      }));
  },

  async getVendorById(id: string): Promise<Vendor> {
    const res = (await apiClient.get(ENDPOINTS.OPERATIONS.VENDOR_BY_ID(id))) as any;
    const d = res?.data ?? res;
    return normaliseVendor(d?.vendor ?? d);
  },

  // mostFrequentBuyer returned inline on getVendorById — no separate endpoint
  async getMostFrequentBuyer(id: string): Promise<Buyer | null> {
    const vendor = await vendorService.getVendorById(id);
    return vendor.mostFrequentBuyer ?? null;
  },

  async suspendVendor(id: string, reason?: string): Promise<{ message: string }> {
    const res = await apiClient.put(ENDPOINTS.OPERATIONS.VENDOR_SUSPEND(id), { reason });
    return res as { message: string };
  },

  async activateVendor(id: string): Promise<{ message: string }> {
    const res = await apiClient.put(ENDPOINTS.OPERATIONS.VENDOR_ACTIVATE(id));
    return res as { message: string };
  },

  async verifyVendor(id: string): Promise<{ message: string }> {
    const res = await apiClient.put(ENDPOINTS.OPERATIONS.VENDOR_VERIFY(id));
    return res as { message: string };
  },

  async deleteVendor(id: string): Promise<{ message: string }> {
    const res = await apiClient.delete(ENDPOINTS.OPERATIONS.VENDOR_DELETE(id));
    return res as { message: string };
  },

  // Alert vendor — sends a notification (PUT to warn endpoint via reviews controller)
  async alertVendor(id: string): Promise<{ message: string }> {
    const res = await apiClient.put(ENDPOINTS.OPERATIONS.REVIEWS_WARN("vendor", id));
    return res as { message: string };
  },
};
