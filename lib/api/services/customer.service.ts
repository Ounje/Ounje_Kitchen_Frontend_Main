import { apiClient } from '@/lib/client';
import { ENDPOINTS } from '@/lib/config';

// ── Types ─────────────────────────────────────────────────────────────────────
// Customer shape used by all components — flattened from backend's nested user ref

export interface Customer {
  // Navigation / key
  id:    string;   // = _id.toString()
  _id:   string;
  // Profile — flattened from user populate
  name:   string;
  email:  string;
  phone:  string;
  avatar: string;
  address: string;
  // Derived status — from isActive / isSuspended
  accountStatus: 'active' | 'suspended' | 'unverified';
  isActive:    boolean;
  isSuspended: boolean;
  // Order stats — from enrichCustomer (populated by updated operations controller)
  successfulOrders: number;
  cancelledOrders:  number;
  pendingOrders:    number;
  totalOrders:      number;
  // Most used vendor — inline from enrichCustomer
  mostUsedVendor?: Vendor | null;
  createdAt?: string;
}

export interface Vendor {
  id:          string;
  name:        string;
  photo:       string;
  rating:      number;
  ratingCount: number;
  address:     string;
  ordersCount: number;
}

export interface CustomerFilters {
  name?:          string;
  email?:         string;
  accountStatus?: 'active' | 'suspended' | 'unverified' | '';
  page?:          number;
  limit?:         number;
}

// Shape the list page reads: { data, page, total, limit, totalPages }
export interface PaginatedCustomers {
  data:       Customer[];
  total:      number;
  page:       number;
  limit:      number;
  totalPages: number;
}

// ── Normalisers ───────────────────────────────────────────────────────────────

function deriveStatus(raw: any): 'active' | 'suspended' | 'unverified' {
  if (raw.isSuspended === true)  return 'suspended';
  if (raw.isActive    === false) return 'unverified';
  return 'active';
}

// Flatten a raw backend customer document to the Customer interface
function normaliseCustomer(raw: any): Customer {
  const id   = String(raw._id ?? raw.id ?? '');
  const name  = raw.user?.name   ?? raw.name   ?? '';
  const email = raw.user?.email  ?? raw.email  ?? '';
  const phone = raw.user?.phone  ?? raw.phone  ?? '';
  const avatar = raw.user?.img ?? raw.user?.avatar ?? raw.img ?? raw.avatar ?? raw.photo ?? '';
  const address =
    raw.savedAddresses?.[0]?.address ??
    raw.savedAddresses?.[0]?.label   ??
    raw.address ?? '';

  const mv = raw.mostUsedVendor;
  const mostUsedVendor: Vendor | null = mv
    ? {
        id:          String(mv.id ?? mv._id ?? ''),
        name:        mv.name        ?? '',
        photo:       mv.photo       ?? '',
        rating:      mv.rating      ?? mv.averageRating ?? 0,
        ratingCount: mv.ratingCount ?? 0,
        address:     mv.address     ?? '',
        ordersCount: mv.ordersCount ?? mv.totalOrders ?? 0,
      }
    : null;

  return {
    id,
    _id: id,
    name,
    email,
    phone,
    avatar,
    address,
    accountStatus:    deriveStatus(raw),
    isActive:         raw.isActive    !== false,
    isSuspended:      raw.isSuspended === true,
    successfulOrders: raw.successfulOrders ?? 0,
    cancelledOrders:  raw.cancelledOrders  ?? 0,
    pendingOrders:    raw.pendingOrders    ?? 0,
    totalOrders:      raw.totalOrders      ?? 0,
    mostUsedVendor,
    createdAt:        raw.createdAt,
  };
}

// Backend returns:
// list → { success, count, total, page, pages, customers: [...] }
// single → { success, data: { customer: {...}, recentOrders: [...] } }
function normaliseList(res: any): PaginatedCustomers {
  const d   = res?.data ?? res;
  const rows: any[] = d?.customers ?? d?.data ?? [];
  const pag = d?.pagination ?? d;
  return {
    data:       rows.map(normaliseCustomer),
    total:      pag?.total  ?? rows.length,
    page:       pag?.page   ?? 1,
    limit:      pag?.limit  ?? rows.length,
    totalPages: pag?.pages  ?? 1,
  };
}

// ── Service ───────────────────────────────────────────────────────────────────
export const customerService = {

  async getCustomers(params: CustomerFilters = {}): Promise<PaginatedCustomers> {
    const { accountStatus, ...rest } = params;
    const query: Record<string, any> = { ...rest };

    // Send only the single condition that corresponds to the selected status.
    // Sending both isActive AND isSuspended at once can produce wrong results
    // if the controller applies them independently (active=true AND suspended=false
    // would exclude customers where isSuspended is simply undefined in the DB).
    if (accountStatus === 'active')     query.isActive    = 'true';
    if (accountStatus === 'suspended')  query.isSuspended = 'true';
    if (accountStatus === 'unverified') query.isActive    = 'false';
    // No filter set → returns all customers (correct default for the list page)

    const res = await apiClient.get(ENDPOINTS.OPERATIONS.CUSTOMERS, { params: query }) as any;
    return normaliseList(res);
  },

  async getCustomerById(id: string): Promise<Customer> {
    const res = await apiClient.get(ENDPOINTS.OPERATIONS.CUSTOMER_BY_ID(id)) as any;
    const d   = res?.data ?? res;
    const raw = d?.customer ?? d;
    return normaliseCustomer(raw);
  },

  // mostUsedVendor is returned inline from getCustomerById (enrichCustomer)
  // No separate endpoint — extract from the customer object
  async getMostUsedVendor(id: string): Promise<Vendor | null> {
    const customer = await customerService.getCustomerById(id);
    return customer.mostUsedVendor ?? null;
  },

  async suspendCustomer(id: string, reason?: string): Promise<{ message: string }> {
    const res = await apiClient.put(ENDPOINTS.OPERATIONS.CUSTOMER_SUSPEND(id), { reason });
    return res as { message: string };
  },

  async activateCustomer(id: string): Promise<{ message: string }> {
    const res = await apiClient.put(ENDPOINTS.OPERATIONS.CUSTOMER_ACTIVATE(id));
    return res as { message: string };
  },

  async deleteCustomer(id: string): Promise<{ message: string }> {
    const res = await apiClient.delete(ENDPOINTS.OPERATIONS.CUSTOMER_DELETE(id));
    return res as { message: string };
  },
};