import { apiClient } from '@/lib/client';

// ── Shared ────────────────────────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export interface DashboardStats {
  withdrawals:  { count: number; subtitle: string };
  transactions: { count: number; subtitle: string };
  payroll:      { count: number; subtitle: string };
}

export interface DashboardWithdrawalRow {
  id: string;
  userName: string;
  userAvatar?: string;
  role: 'Rider' | 'Vendor';
  process: string;
  amount: number;
  status: 'Successful' | 'Failed';
}

// ── Transactions ──────────────────────────────────────────────────────────────
export interface TransactionItem {
  id: string;
  transactionId: string;
  orderId: string;
  customerName: string;
  customerAvatar?: string;
  vendorName: string;
  orderType: string;
  amount: number;
  paymentMethod: string;
}

export interface TransactionGroup {
  date: string;           // e.g. "Wednesday 7th, 2026"
  transactions: TransactionItem[];
}

export interface TransactionDetail {
  orderId: string;
  customerName: string;
  vendorName: string;
  orderType: string;
  paymentMethod: string;
  transactionId: string;
  amount: number;
  orderCost: number;
  serviceCost: number;
  deliveryFee: number;
  total: number;
}

export interface TransactionFilters {
  name?: string;
  role?: 'Rider' | 'Vendor' | '';
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

// ── Withdrawals ───────────────────────────────────────────────────────────────
export interface WithdrawalItem {
  id: string;
  withdrawalId: string;
  userName: string;
  userAvatar?: string;
  role: 'Rider' | 'Vendor';
  bankName: string;
  amount: number;
  narration: string;
  status: 'PASS' | 'FAIL';
}

export interface WithdrawalGroup {
  date: string;
  withdrawals: WithdrawalItem[];
}

export interface WithdrawalDetail {
  withdrawalId: string;
  vendorName: string;
  bankName: string;
  accountNumber: string;
  paymentMethod: string;
  amount: number;
  status: 'PASS' | 'FAIL';
  note: string;
}

export interface WithdrawalFilters {
  name?: string;
  role?: 'Rider' | 'Vendor' | '';
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

// ── Revenue ───────────────────────────────────────────────────────────────────
export type RevenuePeriod = 'daily' | 'weekly' | 'monthly';

export interface RevenueStatCard {
  amount: number;
  change: number;       // percentage change
  detail1?: string;
  detail2?: string;
}

export interface RevenueStats {
  gross:  RevenueStatCard;
  vendor: RevenueStatCard;
  rider:  RevenueStatCard;
  net:    RevenueStatCard;
}

export interface RevenueTrendPoint {
  label: string;        // "Mon", "Tue" …
  gross: number;
  vendor: number;
  rider: number;
  net: number;
}

export interface RevenueDistributionPoint {
  name: string;
  value: number;
  fill: string;
}

export interface TopVendor {
  id: string;
  name: string;
  photo?: string;
  orders: number;
  revenue: number;
  commission: number;
  aov: number;
}

export interface TopRider {
  id: string;
  name: string;
  photo?: string;
  deliveries: number;
  earnings: number;
  completion: number;   // percentage
  rating: number;
}

export interface RevenueData {
  stats: RevenueStats;
  trend: RevenueTrendPoint[];
  distribution: RevenueDistributionPoint[];
  topVendors: TopVendor[];
  topRiders: TopRider[];
}

export interface RevenueFilters {
  startDate?: string;
  endDate?: string;
  period?: RevenuePeriod;
}

// ── Profile / Settings ────────────────────────────────────────────────────────
export interface FinanceProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: string;
}

// ── Service ───────────────────────────────────────────────────────────────────
export const financeService = {

  // ==================== DASHBOARD ====================

  /**
   * GET /api/finance/dashboard/stats
   * Returns the 3 top-level stat cards (Withdrawals, Transactions, Payroll).
   */
  async getDashboardStats() {
    const res = await apiClient.get<{
      success: boolean;
      data: DashboardStats;
    }>('/api/finance/dashboard/stats');
    return res;
  },

  /**
   * GET /api/finance/dashboard/withdrawals
   * Returns recent withdrawal rows for the dashboard table.
   */
  async getDashboardWithdrawals() {
    const res = await apiClient.get<{
      success: boolean;
      data: DashboardWithdrawalRow[];
    }>('/api/finance/dashboard/withdrawals');
    return res;
  },

  /**
   * DELETE /api/finance/dashboard/withdrawals/:id
   * Removes a withdrawal row from the dashboard list.
   */
  async deleteDashboardWithdrawal(id: string) {
    const res = await apiClient.delete(`/api/finance/dashboard/withdrawals/${id}`);
    return res;
  },

  // ==================== TRANSACTIONS ====================

  /**
   * GET /api/finance/transactions
   * Paginated, filtered transaction list — grouped by date on the backend.
   */
  async getTransactions(filters: TransactionFilters) {
    const res = await apiClient.get<
      PaginatedResponse<TransactionGroup>
    >('/api/finance/transactions', { params: filters });
    return res;
  },

  /**
   * GET /api/finance/transactions/:id
   * Full transaction detail / slip data.
   */
  async getTransactionDetail(id: string) {
    const res = await apiClient.get<{
      success: boolean;
      data: TransactionDetail;
    }>(`/api/finance/transactions/${id}`);
    return res;
  },

  /**
   * GET /api/finance/transactions/export
   * Downloads filtered transactions as a CSV blob.
   */
  async exportTransactionsCSV(filters: Omit<TransactionFilters, 'page' | 'limit'>) {
    const res = await apiClient.get<Blob>('/api/finance/transactions/export', {
      params: filters,
    } as any);
    return res;
  },

  // ==================== WITHDRAWALS ====================

  /**
   * GET /api/finance/withdrawals
   * Paginated, filtered withdrawal list — grouped by date on the backend.
   */
  async getWithdrawals(filters: WithdrawalFilters) {
    const res = await apiClient.get<
      PaginatedResponse<WithdrawalGroup>
    >('/api/finance/withdrawals', { params: filters });
    return res;
  },

  /**
   * GET /api/finance/withdrawals/:id
   * Full withdrawal detail / slip data.
   */
  async getWithdrawalDetail(id: string) {
    const res = await apiClient.get<{
      success: boolean;
      data: WithdrawalDetail;
    }>(`/api/finance/withdrawals/${id}`);
    return res;
  },

  /**
   * GET /api/finance/withdrawals/export
   * Downloads filtered withdrawals as a CSV blob.
   */
  async exportWithdrawalsCSV(filters: Omit<WithdrawalFilters, 'page' | 'limit'>) {
    const res = await apiClient.get<Blob>('/api/finance/withdrawals/export', {
      params: filters,
    } as any);
    return res;
  },

  // ==================== REVENUE ====================

  /**
   * GET /api/finance/revenue
   * Full revenue dashboard — stats, trend chart, distribution chart, top performers.
   */
  async getRevenueData(filters: RevenueFilters) {
    const res = await apiClient.get<{
      success: boolean;
      data: RevenueData;
    }>('/api/finance/revenue', { params: filters });
    return res;
  },

  /**
   * GET /api/finance/revenue/top-vendors
   * Top 5 vendors for the given period.
   */
  async getTopVendors(params: { period?: RevenuePeriod }) {
    const res = await apiClient.get<{
      success: boolean;
      data: TopVendor[];
    }>('/api/finance/revenue/top-vendors', { params });
    return res;
  },

  /**
   * GET /api/finance/revenue/top-riders
   * Top 5 riders for the given period.
   */
  async getTopRiders(params: { period?: RevenuePeriod }) {
    const res = await apiClient.get<{
      success: boolean;
      data: TopRider[];
    }>('/api/finance/revenue/top-riders', { params });
    return res;
  },

  // ==================== PROFILE (SETTINGS) ====================

  /**
   * GET /api/finance/profile
   * Returns the current finance user's profile.
   */
  async getProfile() {
    const res = await apiClient.get<{
      success: boolean;
      data: FinanceProfile;
    }>('/api/finance/profile');
    return res;
  },

  /**
   * PUT /api/finance/profile
   * Updates name / phone fields.
   */
  async updateProfile(data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
  }) {
    const res = await apiClient.put('/api/finance/profile', data);
    return res;
  },

  /**
   * POST /api/finance/profile/avatar
   * Uploads a new avatar image (multipart/form-data).
   */
  async uploadAvatar(formData: FormData) {
    const res = await apiClient.post('/api/finance/profile/avatar', formData);
    return res;
  },

  /**
   * POST /api/finance/change-password
   * Updates the finance user's password after verifying the current one.
   */
  async changePassword(currentPassword: string, newPassword: string) {
    const res = await apiClient.post('/api/finance/change-password', {
      currentPassword,
      newPassword,
    });
    return res;
  },

  /**
   * POST /api/finance/verify-otp
   * Verifies a one-time password (e.g. after password change).
   */
  async verifyOTP(otp: string) {
    const res = await apiClient.post('/api/finance/verify-otp', { otp });
    return res;
  },

  /**
   * POST /api/finance/resend-otp
   * Resends the OTP to the finance user's registered contact.
   */
  async resendOTP() {
    const res = await apiClient.post('/api/finance/resend-otp');
    return res;
  },
};

export default financeService;