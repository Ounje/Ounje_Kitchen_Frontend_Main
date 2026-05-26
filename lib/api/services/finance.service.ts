import { apiClient } from '@/lib/client';
import { ENDPOINTS } from '@/lib/config';

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
  date: string;
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
  orderCost: number;     // vendor's original price
  serviceCost: number;   // 10% checkout service fee
  platformMarkup: number; // 10% standard markup
  comboMarkup: number;    // 20% extra combo markup
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
  change: number;
  detail1?: string;
  detail2?: string;
}

export interface RevenueStats {
  gross:         RevenueStatCard;
  vendor:        RevenueStatCard;
  rider:         RevenueStatCard;
  net:           RevenueStatCard;
  platformMarkup?: RevenueStatCard;
  comboMarkup?:    RevenueStatCard;
  serviceFee?:     RevenueStatCard;
}

export interface RevenueTrendPoint {
  label: string;
  gross: number;
  vendor: number;
  rider: number;
  net: number;
  platformMarkup?: number;
  comboMarkup?: number;
  serviceFee?: number;
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
  completion: number;
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

  async getDashboardStats() {
    const res = await apiClient.get(ENDPOINTS.FINANCE.DASHBOARD_STATS);
    return res;
  },

  async getDashboardWithdrawals() {
    const res = await apiClient.get(ENDPOINTS.FINANCE.DASHBOARD_WITHDRAWALS);
    return res;
  },

  async deleteDashboardWithdrawal(id: string) {
    const res = await apiClient.delete(ENDPOINTS.FINANCE.DASHBOARD_WITHDRAWAL_DELETE(id));
    return res;
  },

  // ==================== TRANSACTIONS ====================

  async getTransactions(filters: TransactionFilters) {
    const res = await apiClient.get(ENDPOINTS.FINANCE.TRANSACTIONS, { params: filters });
    return res;
  },

  async getTransactionDetail(id: string) {
    const res = await apiClient.get(ENDPOINTS.FINANCE.TRANSACTION_BY_ID(id));
    return res;
  },

  async exportTransactionsCSV(filters: Omit<TransactionFilters, 'page' | 'limit'>) {
    const res = await apiClient.get(ENDPOINTS.FINANCE.TRANSACTIONS_EXPORT, {
      params: filters,
    } as any);
    return res;
  },

  // ==================== WITHDRAWALS ====================

  async getWithdrawals(filters: WithdrawalFilters) {
    const res = await apiClient.get(ENDPOINTS.FINANCE.WITHDRAWALS, { params: filters });
    return res;
  },

  async getWithdrawalDetail(id: string) {
    const res = await apiClient.get(ENDPOINTS.FINANCE.WITHDRAWAL_BY_ID(id));
    return res;
  },

  async exportWithdrawalsCSV(filters: Omit<WithdrawalFilters, 'page' | 'limit'>) {
    const res = await apiClient.get(ENDPOINTS.FINANCE.WITHDRAWALS_EXPORT, {
      params: filters,
    } as any);
    return res;
  },

  // ==================== REVENUE ====================

  async getRevenueData(filters: RevenueFilters) {
    const res = await apiClient.get(ENDPOINTS.FINANCE.REVENUE, { params: filters });
    return res;
  },

  async getTopVendors(params: { period?: RevenuePeriod }) {
    const res = await apiClient.get(ENDPOINTS.FINANCE.REVENUE_TOP_VENDORS, { params });
    return res;
  },

  async getTopRiders(params: { period?: RevenuePeriod }) {
    const res = await apiClient.get(ENDPOINTS.FINANCE.REVENUE_TOP_RIDERS, { params });
    return res;
  },

  // ==================== PROFILE (SETTINGS) ====================

  async getProfile() {
    const res = await apiClient.get(ENDPOINTS.FINANCE.PROFILE);
    return res;
  },

  async updateProfile(data: { firstName?: string; lastName?: string; phone?: string }) {
    const res = await apiClient.put(ENDPOINTS.FINANCE.PROFILE, data);
    return res;
  },

  async uploadAvatar(formData: FormData) {
    const res = await apiClient.post(ENDPOINTS.FINANCE.PROFILE_AVATAR, formData);
    return res;
  },

  async changePassword(currentPassword: string, newPassword: string) {
    const res = await apiClient.post(ENDPOINTS.FINANCE.CHANGE_PASSWORD, {
      currentPassword,
      newPassword,
    });
    return res;
  },

  async verifyOTP(otp: string) {
    const res = await apiClient.post(ENDPOINTS.FINANCE.VERIFY_OTP, { otp });
    return res;
  },

  async resendOTP() {
    const res = await apiClient.post(ENDPOINTS.FINANCE.RESEND_OTP);
    return res;
  },
};

export default financeService;