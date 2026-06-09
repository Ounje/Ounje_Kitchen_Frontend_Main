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
  withdrawals:    { count: number; subtitle: string };
  transactions:   { count: number; subtitle: string };
  payroll:        { count: number; subtitle: string };
  todayRevenue?:  { gross: number; net: number; subtitle: string };
  pendingPayouts?: { count: number; total: number; subtitle: string };
  failedPayouts?:  { count: number; subtitle: string };
}

// ── Reconciliation ─────────────────────────────────────────────────────────────
export interface ReconciliationCheckSummary {
  key:      string;
  label:    string;
  severity: 'critical' | 'warning' | 'info';
  count:    number;
  items:    any[];
}

export interface ReconciliationReport {
  id:          string;
  runAt:       string;
  triggeredBy: string;
  durationMs:  number;
  summary: {
    totalIssues:    number;
    criticalIssues: number;
    warningIssues:  number;
    infoIssues:     number;
  };
  checks:  ReconciliationCheckSummary[];
  errors:  { check: string; message: string }[];
  clean:   boolean;
}

export interface ReconciliationHistoryItem {
  id:          string;
  runAt:       string;
  triggeredBy: string;
  durationMs:  number;
  summary:     ReconciliationReport['summary'];
  hasErrors:   boolean;
  clean:       boolean;
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
  status: 'PASS' | 'FAIL' | 'PENDING';
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

// ── Wallets & Payouts ─────────────────────────────────────────────────────────

export interface WalletBucket {
  availableBalance: number;
  pendingBalance:   number;
  holdBalance:      number;
  totalBalance:     number;
}

export interface WalletOverview {
  vendors:  WalletBucket;
  riders:   WalletBucket;
  platform: { availableBalance: number; pendingBalance: number; totalBalance: number };
  pendingPayouts: { count: number; totalNaira: number };
}

export interface PayoutItem {
  _id:            string;
  recipientName:  string;
  recipientType:  'VendorProfile' | 'RiderProfile';
  amountNaira:    number;
  netAmountNaira: number;
  feeNaira:       number;
  status:         'pending' | 'processing' | 'success' | 'failed' | 'cancelled';
  bankDetails: {
    bankName:      string;
    accountNumber: string;
    accountName:   string;
  };
  processAt:      string;
  processedAt?:   string;
  failureReason?: string;
  retryCount:     number;
  createdAt:      string;
}

export interface PayoutStats {
  pending:    { count: number; totalNaira: number };
  processing: { count: number; totalNaira: number };
  success:    { count: number; totalNaira: number };
  failed:     { count: number; totalNaira: number };
  cancelled:  { count: number; totalNaira: number };
}

export interface PayoutFilters {
  status?:        string;
  recipientType?: string;
  startDate?:     string;
  endDate?:       string;
  page?:          number;
  limit?:         number;
}

// ── Paid In (customer wallet top-ups) ─────────────────────────────────────────
export interface PaidInItem {
  _id:          string;
  customerName: string;
  amountNaira:  number;
  reference:    string;
  status:       'pending' | 'success' | 'failed';
  paidAt:       string | null;
  createdAt:    string;
}

export interface PaidInFilters {
  customerName?: string;
  status?:       string;
  startDate?:    string;
  endDate?:      string;
  page?:         number;
  limit?:        number;
}

export interface PaidInStats {
  pending: { count: number; totalNaira: number };
  success: { count: number; totalNaira: number };
  failed:  { count: number; totalNaira: number };
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

  async approveWithdrawal(id: string, note?: string) {
    const res = await apiClient.put(ENDPOINTS.FINANCE.WITHDRAWAL_APPROVE(id), { note });
    return res;
  },

  async rejectWithdrawal(id: string, note?: string) {
    const res = await apiClient.put(ENDPOINTS.FINANCE.WITHDRAWAL_REJECT(id), { note });
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

  // ==================== WALLETS & PAYOUTS ====================

  async getWalletOverview(): Promise<WalletOverview> {
    const res = await apiClient.get(ENDPOINTS.FINANCE.WALLETS_OVERVIEW) as any;
    return res?.data ?? res;
  },

  async getPayouts(filters: PayoutFilters = {}) {
    const res = await apiClient.get(ENDPOINTS.FINANCE.PAYOUTS, { params: filters }) as any;
    return res?.data ?? res;
  },

  async getPayoutStats(): Promise<PayoutStats> {
    const res = await apiClient.get(ENDPOINTS.FINANCE.PAYOUTS_STATS) as any;
    return res?.data ?? res;
  },

  async getPayoutById(id: string): Promise<PayoutItem> {
    const res = await apiClient.get(ENDPOINTS.FINANCE.PAYOUT_BY_ID(id)) as any;
    return res?.data ?? res;
  },

  // ==================== PAID IN ====================

  async getCustomerPaymentStats(): Promise<PaidInStats> {
    const res = await apiClient.get(ENDPOINTS.FINANCE.PAID_IN_STATS) as any;
    return res?.data ?? res;
  },

  async getCustomerPayments(filters: PaidInFilters = {}) {
    const res = await apiClient.get(ENDPOINTS.FINANCE.PAID_IN, { params: filters }) as any;
    return res?.data ?? res;
  },

  // ==================== RECONCILIATION ====================

  async getLatestReconciliation(): Promise<ReconciliationReport | null> {
    try {
      const res = await apiClient.get(ENDPOINTS.FINANCE.RECONCILIATION_LATEST) as any;
      return res?.data ?? res ?? null;
    } catch { return null; }
  },

  async getReconciliationHistory(page = 1, limit = 20) {
    const res = await apiClient.get(ENDPOINTS.FINANCE.RECONCILIATION_HISTORY, { params: { page, limit } }) as any;
    return res?.data ?? res;
  },

  async getReconciliationById(id: string): Promise<ReconciliationReport> {
    const res = await apiClient.get(ENDPOINTS.FINANCE.RECONCILIATION_BY_ID(id)) as any;
    return res?.data ?? res;
  },
};

export default financeService;