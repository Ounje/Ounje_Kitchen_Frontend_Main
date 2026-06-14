import { apiClient } from "@/lib/client";
import { ENDPOINTS } from "@/lib/config";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Rider {
  id: string;
  _id?: string;
  name: string;
  phone: string;
  zone: string;
  accountStatus: "active" | "suspended";
  riderStatus: "free" | "busy" | "verified";
  modeOfDelivery: "motorcycle" | "bicycle" | "car";
  photo: string;
  successfulDeliveries: number;
  cancelledDeliveries: number;
  processingDeliveries: number;
  totalDeliveries: number;
  mostFrequentZone?: string;
  serviceMode?: string;
  documentUrl?: string;
  nin?: string;
  driversLicense?: string;
}

export interface TopPerformer {
  id: string;
  name: string;
  phone: string;
  location: string;
  photo: string;
  completedOrders: number;
  rank: 1 | 2 | 3;
}

export interface RiderFilters {
  name?: string;
  status?: "active" | "suspended" | "";
  modeOfDelivery?: "motorcycle" | "bicycle" | "car" | "";
  page?: number;
  limit?: number;
}

export interface PaginatedRiders {
  riders: Rider[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ── Normaliser ────────────────────────────────────────────────────────────────
// Backend (operations riderController) returns FLAT shape:
//   { success, count, total, page, pages, data: [...riders] }
// Each rider has: user:{name,phone}, operatingArea[], ratings, deliveredOrders, etc.

function normaliseRider(raw: any): Rider {
  const id = String(raw._id ?? raw.id ?? "");
  const name = (raw.user?.name ?? `${raw.firstName ?? ""} ${raw.lastName ?? ""}`.trim()) || "Rider";
  const phone = raw.phoneNumber ?? raw.user?.phone ?? raw.phone ?? "";
  const zone = Array.isArray(raw.operatingArea)
    ? raw.operatingArea.join(", ")
    : (raw.operatingArea ?? raw.zone ?? "");

  const isSuspended = raw.isSuspended === true;
  const accountStatus: Rider["accountStatus"] = isSuspended ? "suspended" : "active";

  // riderStatus — derive from isAvailable / status field
  let riderStatus: Rider["riderStatus"] = "free";
  if (raw.status === "available" || raw.isAvailable === true) riderStatus = "free";
  else if (raw.status === "busy" || raw.isAvailable === false) riderStatus = "busy";

  return {
    id,
    _id: id,
    name,
    phone,
    zone,
    accountStatus,
    riderStatus,
    modeOfDelivery: raw.modeOfDelivery ?? raw.vehicleType ?? "motorcycle",
    photo: raw.photo ?? raw.avatar ?? raw.user?.avatar ?? "",
    successfulDeliveries: raw.deliveredOrders ?? raw.successfulDeliveries ?? 0,
    cancelledDeliveries: raw.rejectedOrders ?? raw.cancelledDeliveries ?? 0,
    processingDeliveries: raw.outgoingOrders ?? raw.processingDeliveries ?? 0,
    totalDeliveries: raw.totalDeliveries ?? 0,
    mostFrequentZone: raw.mostFrequentZone ?? zone,
    serviceMode: raw.modeOfDelivery,
    documentUrl: raw.documentUrl,
    nin: raw.nin,
    driversLicense: raw.driversLicense,
  };
}

function normaliseList(res: any): PaginatedRiders {
  // Flat response: { success, count, total, page, pages, data: [...] }
  // Wrapped response: { data: { riders: [...], pagination: {...} } }
  let rows: any[], total: number, page: number, pages: number, limit: number;

  if (Array.isArray(res?.data)) {
    rows = res.data;
    total = res.total ?? rows.length;
    page = res.page ?? 1;
    pages = res.pages ?? 1;
    limit = res.limit ?? rows.length;
  } else {
    const d = res?.data ?? res;
    rows = d?.riders ?? d?.data ?? [];
    const pag = d?.pagination ?? d;
    total = pag?.total ?? rows.length;
    page = pag?.page ?? 1;
    pages = pag?.pages ?? 1;
    limit = pag?.limit ?? rows.length;
  }

  return { riders: rows.map(normaliseRider), total, page, limit, totalPages: pages };
}

// ── Service ───────────────────────────────────────────────────────────────────

export const riderService = {
  async getRiders(params: RiderFilters = {}): Promise<PaginatedRiders> {
    // Map 'status' to isActive / isSuspended params the backend reads
    const { status, ...rest } = params;
    const query: Record<string, any> = { ...rest };
    if (status === "active") query.isActive = "true";
    if (status === "suspended") query.isSuspended = "true";

    const res = (await apiClient.get(ENDPOINTS.OPERATIONS.RIDERS, { params: query })) as any;
    return normaliseList(res);
  },

  // Top 3 by delivered orders — derived client-side (no /top-performers endpoint)
  async getTopPerformers(): Promise<TopPerformer[]> {
    const res = (await apiClient.get(ENDPOINTS.OPERATIONS.RIDERS, {
      params: { isActive: "true", page: 1, limit: 20 },
    })) as any;
    const { riders } = normaliseList(res);
    return riders
      .sort((a, b) => b.successfulDeliveries - a.successfulDeliveries)
      .slice(0, 3)
      .map((r, i) => ({
        id: r.id,
        name: r.name,
        phone: r.phone,
        location: r.zone,
        photo: r.photo,
        completedOrders: r.successfulDeliveries,
        rank: (i + 1) as 1 | 2 | 3,
      }));
  },

  async getRiderById(id: string): Promise<Rider> {
    const res = (await apiClient.get(ENDPOINTS.OPERATIONS.RIDER_BY_ID(id))) as any;
    // Response: { success, data: { rider, recentDeliveries } } OR flat rider object
    const d = res?.data ?? res;
    const raw = d?.rider ?? d;
    return normaliseRider(raw);
  },

  // suspend / activate are PUT (all portals use PUT for these routes)
  async suspendRider(id: string, reason?: string): Promise<{ message: string }> {
    const res = await apiClient.put(ENDPOINTS.OPERATIONS.RIDER_SUSPEND(id), { reason });
    return res as { message: string };
  },

  async activateRider(id: string): Promise<{ message: string }> {
    const res = await apiClient.put(ENDPOINTS.OPERATIONS.RIDER_ACTIVATE(id));
    return res as { message: string };
  },

  async deleteRider(id: string): Promise<{ message: string }> {
    const res = await apiClient.delete(ENDPOINTS.OPERATIONS.RIDER_DELETE(id));
    return res as { message: string };
  },
};
