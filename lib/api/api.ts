// import { apiClient } from "../client";
// import { ENDPOINTS } from "../config";

// // ─────────────────────────────────────────────
// // Shared / Generic Types
// // ─────────────────────────────────────────────

// export interface PaginatedResponse<T> {
//   data: T[];
//   total: number;
//   page: number;
//   limit: number;
//   totalPages: number;
// }

// export interface PaginationParams {
//   page?: number;
//   limit?: number;
//   search?: string;
//   status?: string;
//   [key: string]: any;
// }

// export interface ApiMessage {
//   message: string;
// }

// // ─────────────────────────────────────────────
// // Auth Types
// // ─────────────────────────────────────────────

// export interface LoginPayload {
//   email: string;
//   password: string;
// }

// export interface AuthUser {
//   id: string;
//   name: string;
//   email: string;
//   role: string;
//   avatar?: string;
// }

// export interface LoginResponse {
//   token: string;
//   user: AuthUser;
// }

// // ─────────────────────────────────────────────
// // Dashboard Types
// // ─────────────────────────────────────────────

// export interface DashboardStats {
//   totalCustomers: number;
//   totalVendors: number;
//   totalRiders: number;
//   totalOrders: number;
//   totalRevenue: number;
//   activeOrders: number;
//   pendingVerifications: number;
//   openQueries: number;
//   [key: string]: any;
// }

// export interface RevenueStats {
//   totalRevenue: number;
//   todayRevenue: number;
//   weekRevenue: number;
//   monthRevenue: number;
//   [key: string]: any;
// }

// export interface RevenueTrend {
//   date: string;
//   revenue: number;
//   orders: number;
// }

// export interface RevenueTrendsResponse {
//   trends: RevenueTrend[];
//   [key: string]: any;
// }

// // ─────────────────────────────────────────────
// // Customer Types
// // ─────────────────────────────────────────────

// export interface Customer {
//   id: string;
//   name: string;
//   email: string;
//   phone?: string;
//   status: "active" | "suspended" | "deleted";
//   createdAt: string;
//   updatedAt: string;
//   [key: string]: any;
// }

// // ─────────────────────────────────────────────
// // Vendor Types
// // ─────────────────────────────────────────────

// export interface Vendor {
//   id: string;
//   name: string;
//   email: string;
//   phone?: string;
//   businessName?: string;
//   status: "active" | "suspended" | "pending";
//   isVerified: boolean;
//   createdAt: string;
//   updatedAt: string;
//   [key: string]: any;
// }

// // ─────────────────────────────────────────────
// // Rider Types
// // ─────────────────────────────────────────────

// export interface Rider {
//   id: string;
//   name: string;
//   email: string;
//   phone?: string;
//   status: "active" | "suspended" | "pending";
//   isVerified: boolean;
//   createdAt: string;
//   updatedAt: string;
//   [key: string]: any;
// }

// // ─────────────────────────────────────────────
// // Staff Types
// // ─────────────────────────────────────────────

// export interface Staff {
//   id: string;
//   name: string;
//   email: string;
//   role: string;
//   department?: string;
//   status: "active" | "suspended" | "deactivated";
//   createdAt: string;
//   updatedAt: string;
//   [key: string]: any;
// }

// // ─────────────────────────────────────────────
// // Order Types
// // ─────────────────────────────────────────────

// export interface Order {
//   id: string;
//   customerId: string;
//   vendorId: string;
//   riderId?: string;
//   status: string;
//   totalAmount: number;
//   createdAt: string;
//   updatedAt: string;
//   [key: string]: any;
// }

// export interface OrderOverridePayload {
//   status: string;
//   reason?: string;
//   [key: string]: any;
// }

// // ─────────────────────────────────────────────
// // Rating Types
// // ─────────────────────────────────────────────

// export interface Rating {
//   id: string;
//   customerId: string;
//   targetId: string;
//   targetType: "vendor" | "rider";
//   score: number;
//   comment?: string;
//   createdAt: string;
//   [key: string]: any;
// }

// // ─────────────────────────────────────────────
// // Query / Complaint Types
// // ─────────────────────────────────────────────

// export interface Query {
//   id: string;
//   customerId: string;
//   subject: string;
//   message: string;
//   status: "open" | "assigned" | "resolved";
//   assignedTo?: string;
//   createdAt: string;
//   updatedAt: string;
//   [key: string]: any;
// }

// export interface QueryAssignPayload {
//   staffId: string;
// }

// export interface QueryResolvePayload {
//   resolution: string;
//   [key: string]: any;
// }

// // ─────────────────────────────────────────────
// // Profile Types
// // ─────────────────────────────────────────────

// export interface Profile {
//   id: string;
//   name: string;
//   email: string;
//   avatar?: string;
//   role: string;
//   [key: string]: any;
// }

// export interface UpdateProfilePayload {
//   name?: string;
//   email?: string;
//   [key: string]: any;
// }

// export interface ChangePasswordPayload {
//   currentPassword: string;
//   newPassword: string;
//   confirmPassword: string;
// }

// export interface VerifyOtpPayload {
//   otp: string;
//   [key: string]: any;
// }

// export interface ResendOtpPayload {
//   email?: string;
//   [key: string]: any;
// }

// // ─────────────────────────────────────────────
// // Super Admin API
// // ─────────────────────────────────────────────

// export const superAdminApi = {

//   // ── Authentication ──────────────────────────────────────────────────────

//   auth: {
//     login: (payload: LoginPayload) =>
//       apiClient.post<LoginResponse>(ENDPOINTS.AUTH.LOGIN, payload, { requiresAuth: false }),

//     me: () =>
//       apiClient.get<AuthUser>(ENDPOINTS.AUTH.ME),

//     changePassword: (payload: ChangePasswordPayload) =>
//       apiClient.post<ApiMessage>(ENDPOINTS.AUTH.CHANGE_PASSWORD, payload),

//     logout: () =>
//       apiClient.post<ApiMessage>(ENDPOINTS.AUTH.LOGOUT),
//   },

//   // ── Dashboard ───────────────────────────────────────────────────────────

//   dashboard: {
//     getStats: () =>
//       apiClient.get<DashboardStats>(ENDPOINTS.SUPERADMIN.DASHBOARD),

//     getRevenue: () =>
//       apiClient.get<RevenueStats>(ENDPOINTS.SUPERADMIN.REVENUE),

//     getRevenueTrends: (params?: PaginationParams) =>
//       apiClient.get<RevenueTrendsResponse>(ENDPOINTS.SUPERADMIN.REVENUE_TRENDS, { params }),
//   },

//   // ── Customers ───────────────────────────────────────────────────────────

//   customers: {
//     getAll: (params?: PaginationParams) =>
//       apiClient.get<PaginatedResponse<Customer>>(ENDPOINTS.SUPERADMIN.CUSTOMERS, { params }),

//     getById: (id: string) =>
//       apiClient.get<Customer>(ENDPOINTS.SUPERADMIN.CUSTOMER_BY_ID(id)),

//     suspend: (id: string) =>
//       apiClient.post<ApiMessage>(ENDPOINTS.SUPERADMIN.CUSTOMER_SUSPEND(id)),

//     activate: (id: string) =>
//       apiClient.post<ApiMessage>(ENDPOINTS.SUPERADMIN.CUSTOMER_ACTIVATE(id)),
//   },

//   // ── Vendors ─────────────────────────────────────────────────────────────

//   vendors: {
//     getAll: (params?: PaginationParams) =>
//       apiClient.get<PaginatedResponse<Vendor>>(ENDPOINTS.SUPERADMIN.VENDORS, { params }),

//     getById: (id: string) =>
//       apiClient.get<Vendor>(ENDPOINTS.SUPERADMIN.VENDOR_BY_ID(id)),

//     suspend: (id: string) =>
//       apiClient.post<ApiMessage>(ENDPOINTS.SUPERADMIN.VENDOR_SUSPEND(id)),

//     activate: (id: string) =>
//       apiClient.post<ApiMessage>(ENDPOINTS.SUPERADMIN.VENDOR_ACTIVATE(id)),

//     verify: (id: string) =>
//       apiClient.post<ApiMessage>(ENDPOINTS.SUPERADMIN.VENDOR_VERIFY(id)),
//   },

//   // ── Riders ──────────────────────────────────────────────────────────────

//   riders: {
//     getAll: (params?: PaginationParams) =>
//       apiClient.get<PaginatedResponse<Rider>>(ENDPOINTS.SUPERADMIN.RIDERS, { params }),

//     getById: (id: string) =>
//       apiClient.get<Rider>(ENDPOINTS.SUPERADMIN.RIDER_BY_ID(id)),

//     suspend: (id: string) =>
//       apiClient.post<ApiMessage>(ENDPOINTS.SUPERADMIN.RIDER_SUSPEND(id)),

//     activate: (id: string) =>
//       apiClient.post<ApiMessage>(ENDPOINTS.SUPERADMIN.RIDER_ACTIVATE(id)),

//     verify: (id: string) =>
//       apiClient.post<ApiMessage>(ENDPOINTS.SUPERADMIN.RIDER_VERIFY(id)),
//   },

//   // ── Staff ────────────────────────────────────────────────────────────────

//   staff: {
//     getAll: (params?: PaginationParams) =>
//       apiClient.get<PaginatedResponse<Staff>>(ENDPOINTS.SUPERADMIN.STAFF, { params }),
//   },

//   // ── Orders ───────────────────────────────────────────────────────────────

//   orders: {
//     getAll: (params?: PaginationParams) =>
//       apiClient.get<PaginatedResponse<Order>>(ENDPOINTS.SUPERADMIN.ORDERS, { params }),

//     getById: (id: string) =>
//       apiClient.get<Order>(ENDPOINTS.SUPERADMIN.ORDER_BY_ID(id)),

//     override: (id: string, payload: OrderOverridePayload) =>
//       apiClient.post<ApiMessage>(ENDPOINTS.SUPERADMIN.ORDER_OVERRIDE(id), payload),
//   },

//   // ── Ratings ──────────────────────────────────────────────────────────────

//   ratings: {
//     getAll: (params?: PaginationParams) =>
//       apiClient.get<PaginatedResponse<Rating>>(ENDPOINTS.SUPERADMIN.RATINGS, { params }),
//   },

//   // ── Queries / Complaints ─────────────────────────────────────────────────

//   queries: {
//     getAll: (params?: PaginationParams) =>
//       apiClient.get<PaginatedResponse<Query>>(ENDPOINTS.SUPERADMIN.QUERIES, { params }),

//     getById: (id: string) =>
//       apiClient.get<Query>(ENDPOINTS.SUPERADMIN.QUERY_BY_ID(id)),

//     assign: (id: string, payload: QueryAssignPayload) =>
//       apiClient.post<ApiMessage>(ENDPOINTS.SUPERADMIN.QUERY_ASSIGN(id), payload),

//     resolve: (id: string, payload: QueryResolvePayload) =>
//       apiClient.post<ApiMessage>(ENDPOINTS.SUPERADMIN.QUERY_RESOLVE(id), payload),
//   },

//   // ── Profile / Settings ───────────────────────────────────────────────────

//   profile: {
//     get: () =>
//       apiClient.get<Profile>(ENDPOINTS.SUPERADMIN.PROFILE),

//     update: (payload: UpdateProfilePayload) =>
//       apiClient.put<Profile>(ENDPOINTS.SUPERADMIN.PROFILE, payload),

//     updateAvatar: (formData: FormData) =>
//       apiClient.put<Profile>(ENDPOINTS.SUPERADMIN.PROFILE_AVATAR, formData),

//     changePassword: (payload: ChangePasswordPayload) =>
//       apiClient.post<ApiMessage>(ENDPOINTS.SUPERADMIN.CHANGE_PASSWORD, payload),

//     verifyOtp: (payload: VerifyOtpPayload) =>
//       apiClient.post<ApiMessage>(ENDPOINTS.SUPERADMIN.VERIFY_OTP, payload),

//     resendOtp: (payload?: ResendOtpPayload) =>
//       apiClient.post<ApiMessage>(ENDPOINTS.SUPERADMIN.RESEND_OTP, payload),
//   },
// };

// second new endpoints

// import { apiClient } from "../client";
// import { ENDPOINTS } from "../config";

// // ─────────────────────────────────────────────
// // Shared / Generic Types
// // ─────────────────────────────────────────────

// export interface PaginatedResponse<T> {
//   data: T[];
//   total: number;
//   page: number;
//   limit: number;
//   totalPages: number;
// }

// export interface PaginationParams {
//   page?: number;
//   limit?: number;
//   search?: string;
//   status?: string;
//   [key: string]: any;
// }

// export interface ApiMessage {
//   message: string;
// }

// // ─────────────────────────────────────────────
// // Auth Types
// // ─────────────────────────────────────────────

// export interface LoginPayload {
//   email: string;
//   password: string;
// }

// export interface AuthUser {
//   id: string;
//   name: string;
//   email: string;
//   role: string;
//   avatar?: string;
// }

// export interface LoginResponse {
//   token: string;
//   user: AuthUser;
// }

// // ─────────────────────────────────────────────
// // Dashboard Types
// // ─────────────────────────────────────────────

// /**
//  * Returned by GET /api/superadmin/dashboard
//  *
//  * ⚠️  BACKEND REQUIREMENTS — fields the frontend depends on that must be
//  *     included in the response (confirm field names with backend team):
//  *
//  *   activeCustomers    – count of customers where status = "active"
//  *   inactiveCustomers  – count of customers where status = "inactive" | "suspended"
//  *   deliveredOrders    – count of orders where status = "delivered"
//  *   activeVendors      – count of vendors where status = "active"
//  *   suspendedVendors   – count of vendors where status = "suspended"
//  *   activeRiders       – count of riders where status = "active"
//  *   availableRiders    – count of riders currently available for dispatch
//  *   totalQueries       – total query/complaint count
//  *   pendingQueries     – queries with status "open" or "assigned"
//  *   resolvedQueries    – queries with status "resolved"
//  *   totalRatings       – total rating count across all vendors and riders
//  *   excellentRatings   – count of ratings with score = 5
//  *   goodRatings        – count of ratings with score = 4
//  */
// export interface DashboardStats {
//   // Customers
//   totalCustomers: number;
//   activeCustomers: number;
//   inactiveCustomers: number;

//   // Orders
//   totalOrders: number;
//   activeOrders: number;
//   deliveredOrders: number;

//   // Vendors
//   totalVendors: number;
//   activeVendors: number;
//   suspendedVendors: number;

//   // Revenue
//   totalRevenue: number;

//   // Riders
//   totalRiders: number;
//   activeRiders: number;
//   availableRiders: number;

//   // Queries
//   totalQueries: number;
//   openQueries: number;
//   pendingQueries: number;
//   resolvedQueries: number;

//   // Ratings
//   totalRatings: number;
//   excellentRatings: number;
//   goodRatings: number;

//   // Other
//   pendingVerifications: number;

//   [key: string]: any;
// }

// /**
//  * Returned by GET /api/superadmin/revenue
//  *
//  * ⚠️  BACKEND REQUIREMENTS — the Revenue modal has three tabs:
//  *   "Gross Revenue", "Total Expenses", "Net Revenue".
//  *   Each tab × three duration options (daily / weekly / yearly) must be served.
//  *   The frontend expects these fields (confirm names with backend):
//  *
//  *   grossRevenue   – total income before any deductions
//  *   totalExpenses  – platform costs, rider payouts, refunds, etc.
//  *   netRevenue     – grossRevenue minus totalExpenses
//  *   todayRevenue   – gross revenue for today
//  *   weekRevenue    – gross revenue for current ISO week
//  *   monthRevenue   – gross revenue for current calendar month
//  */
// export interface RevenueStats {
//   grossRevenue: number;
//   totalExpenses: number;
//   netRevenue: number;
//   totalRevenue: number;
//   todayRevenue: number;
//   weekRevenue: number;
//   monthRevenue: number;
//   [key: string]: any;
// }

// /**
//  * Returned by GET /api/superadmin/revenue/trends
//  *
//  * ⚠️  BACKEND REQUIREMENTS:
//  *   Each trend data point should include gross, expenses, and net so the
//  *   frontend can switch between tabs without re-fetching.
//  *   The response should also include a summary object for the selected period.
//  *
//  *   Query param: period = "daily" | "weekly" | "monthly" | "yearly"
//  */
// export interface RevenueTrend {
//   date: string;
//   grossRevenue: number;
//   totalExpenses: number;
//   netRevenue: number;
//   orders: number;
// }

// export interface RevenueTrendsResponse {
//   period: string;
//   trends: RevenueTrend[];
//   summary: {
//     grossRevenue: number;
//     totalExpenses: number;
//     netRevenue: number;
//     totalOrders: number;
//     startDate: string;
//     endDate: string;
//   };
//   [key: string]: any;
// }

// // ─────────────────────────────────────────────
// // Customer Types
// // ─────────────────────────────────────────────

// export interface Customer {
//   id: string;
//   name: string;
//   email: string;
//   phone?: string;
//   avatar?: string;
//   status: "active" | "suspended" | "deleted";
//   totalOrders?: number;
//   createdAt: string;
//   updatedAt: string;
//   [key: string]: any;
// }

// // ─────────────────────────────────────────────
// // Vendor Types
// // ─────────────────────────────────────────────

// export interface Vendor {
//   id: string;
//   name: string;
//   email: string;
//   phone?: string;
//   avatar?: string;
//   businessName?: string;
//   status: "active" | "suspended" | "pending";
//   isVerified: boolean;
//   totalOrders?: number;
//   createdAt: string;
//   updatedAt: string;
//   [key: string]: any;
// }

// // ─────────────────────────────────────────────
// // Rider Types
// // ─────────────────────────────────────────────

// export interface Rider {
//   id: string;
//   name: string;
//   email: string;
//   phone?: string;
//   avatar?: string;
//   status: "active" | "suspended" | "pending";
//   isVerified: boolean;
//   totalOrders?: number;
//   createdAt: string;
//   updatedAt: string;
//   [key: string]: any;
// }

// // ─────────────────────────────────────────────
// // Staff Types
// // ─────────────────────────────────────────────

// export interface Staff {
//   id: string;
//   name: string;
//   email: string;
//   role: string;
//   department?: string;
//   status: "active" | "suspended" | "deactivated";
//   createdAt: string;
//   updatedAt: string;
//   [key: string]: any;
// }

// // ─────────────────────────────────────────────
// // Order Types
// // ─────────────────────────────────────────────

// /**
//  * ⚠️  BACKEND REQUIREMENTS — the orders list endpoint should include:
//  *   customerName  – display name of the customer (avoids N+1 fetches in the modal)
//  *   vendorName    – display name of the vendor
//  *   riderName     – display name of the assigned rider (nullable)
//  *   items         – array of line items (for the detail drawer)
//  */
// export interface OrderItem {
//   name: string;
//   quantity: number;
//   price: number;
//   [key: string]: any;
// }

// export interface Order {
//   id: string;
//   customerId: string;
//   customerName?: string;
//   vendorId: string;
//   vendorName?: string;
//   riderId?: string;
//   riderName?: string;
//   status: "active" | "delivered" | "rejected" | "late" | "pending" | string;
//   totalAmount: number;
//   items?: OrderItem[];
//   createdAt: string;
//   updatedAt: string;
//   [key: string]: any;
// }

// export interface OrderOverridePayload {
//   status: string;
//   reason?: string;
//   [key: string]: any;
// }

// // ─────────────────────────────────────────────
// // Rating Types
// // ─────────────────────────────────────────────

// /**
//  * ⚠️  BACKEND REQUIREMENTS — the ratings list endpoint should include:
//  *   customerName    – display name of the reviewer
//  *   customerAvatar  – avatar URL (nullable)
//  *   targetName      – name of the rated vendor or rider
//  *   orderType       – order category e.g. "Tray Builder"
//  */
// export interface Rating {
//   id: string;
//   customerId: string;
//   customerName?: string;
//   customerAvatar?: string;
//   targetId: string;
//   targetName?: string;
//   targetType: "vendor" | "rider";
//   orderType?: string;
//   score: number;
//   comment?: string;
//   createdAt: string;
//   [key: string]: any;
// }

// // ─────────────────────────────────────────────
// // Query / Complaint Types
// // ─────────────────────────────────────────────

// export interface Query {
//   id: string;
//   customerId: string;
//   customerName?: string;
//   subject: string;
//   message: string;
//   status: "open" | "assigned" | "resolved";
//   assignedTo?: string;
//   createdAt: string;
//   updatedAt: string;
//   [key: string]: any;
// }

// export interface QueryAssignPayload {
//   staffId: string;
// }

// export interface QueryResolvePayload {
//   resolution: string;
//   [key: string]: any;
// }

// // ─────────────────────────────────────────────
// // Profile Types
// // ─────────────────────────────────────────────

// export interface Profile {
//   id: string;
//   name: string;
//   email: string;
//   avatar?: string;
//   role: string;
//   [key: string]: any;
// }

// export interface UpdateProfilePayload {
//   name?: string;
//   email?: string;
//   [key: string]: any;
// }

// export interface ChangePasswordPayload {
//   currentPassword: string;
//   newPassword: string;
//   confirmPassword: string;
// }

// export interface VerifyOtpPayload {
//   otp: string;
//   [key: string]: any;
// }

// export interface ResendOtpPayload {
//   email?: string;
//   [key: string]: any;
// }

// // ─────────────────────────────────────────────
// // Super Admin API
// // ─────────────────────────────────────────────

// export const superAdminApi = {

//   // ── Authentication ──────────────────────────────────────────────────────

//   auth: {
//     login: (payload: LoginPayload) =>
//       apiClient.post<LoginResponse>(ENDPOINTS.AUTH.LOGIN, payload, { requiresAuth: false }),

//     me: () =>
//       apiClient.get<AuthUser>(ENDPOINTS.AUTH.ME),

//     changePassword: (payload: ChangePasswordPayload) =>
//       apiClient.post<ApiMessage>(ENDPOINTS.AUTH.CHANGE_PASSWORD, payload),

//     logout: () =>
//       apiClient.post<ApiMessage>(ENDPOINTS.AUTH.LOGOUT),
//   },

//   // ── Dashboard ───────────────────────────────────────────────────────────

//   dashboard: {
//     getStats: () =>
//       apiClient.get<DashboardStats>(ENDPOINTS.SUPERADMIN.DASHBOARD),

//     getRevenue: () =>
//       apiClient.get<RevenueStats>(ENDPOINTS.SUPERADMIN.REVENUE),

//     getRevenueTrends: (params?: PaginationParams) =>
//       apiClient.get<RevenueTrendsResponse>(ENDPOINTS.SUPERADMIN.REVENUE_TRENDS, { params }),
//   },

//   // ── Customers ───────────────────────────────────────────────────────────

//   customers: {
//     getAll: (params?: PaginationParams) =>
//       apiClient.get<PaginatedResponse<Customer>>(ENDPOINTS.SUPERADMIN.CUSTOMERS, { params }),

//     getById: (id: string) =>
//       apiClient.get<Customer>(ENDPOINTS.SUPERADMIN.CUSTOMER_BY_ID(id)),

//     suspend: (id: string) =>
//       apiClient.post<ApiMessage>(ENDPOINTS.SUPERADMIN.CUSTOMER_SUSPEND(id)),

//     activate: (id: string) =>
//       apiClient.post<ApiMessage>(ENDPOINTS.SUPERADMIN.CUSTOMER_ACTIVATE(id)),
//   },

//   // ── Vendors ─────────────────────────────────────────────────────────────

//   vendors: {
//     getAll: (params?: PaginationParams) =>
//       apiClient.get<PaginatedResponse<Vendor>>(ENDPOINTS.SUPERADMIN.VENDORS, { params }),

//     getById: (id: string) =>
//       apiClient.get<Vendor>(ENDPOINTS.SUPERADMIN.VENDOR_BY_ID(id)),

//     suspend: (id: string) =>
//       apiClient.post<ApiMessage>(ENDPOINTS.SUPERADMIN.VENDOR_SUSPEND(id)),

//     activate: (id: string) =>
//       apiClient.post<ApiMessage>(ENDPOINTS.SUPERADMIN.VENDOR_ACTIVATE(id)),

//     verify: (id: string) =>
//       apiClient.post<ApiMessage>(ENDPOINTS.SUPERADMIN.VENDOR_VERIFY(id)),
//   },

//   // ── Riders ──────────────────────────────────────────────────────────────

//   riders: {
//     getAll: (params?: PaginationParams) =>
//       apiClient.get<PaginatedResponse<Rider>>(ENDPOINTS.SUPERADMIN.RIDERS, { params }),

//     getById: (id: string) =>
//       apiClient.get<Rider>(ENDPOINTS.SUPERADMIN.RIDER_BY_ID(id)),

//     suspend: (id: string) =>
//       apiClient.post<ApiMessage>(ENDPOINTS.SUPERADMIN.RIDER_SUSPEND(id)),

//     activate: (id: string) =>
//       apiClient.post<ApiMessage>(ENDPOINTS.SUPERADMIN.RIDER_ACTIVATE(id)),

//     verify: (id: string) =>
//       apiClient.post<ApiMessage>(ENDPOINTS.SUPERADMIN.RIDER_VERIFY(id)),
//   },

//   // ── Staff ────────────────────────────────────────────────────────────────

//   staff: {
//     getAll: (params?: PaginationParams) =>
//       apiClient.get<PaginatedResponse<Staff>>(ENDPOINTS.SUPERADMIN.STAFF, { params }),
//   },

//   // ── Orders ───────────────────────────────────────────────────────────────

//   orders: {
//     getAll: (params?: PaginationParams) =>
//       apiClient.get<PaginatedResponse<Order>>(ENDPOINTS.SUPERADMIN.ORDERS, { params }),

//     getById: (id: string) =>
//       apiClient.get<Order>(ENDPOINTS.SUPERADMIN.ORDER_BY_ID(id)),

//     override: (id: string, payload: OrderOverridePayload) =>
//       apiClient.post<ApiMessage>(ENDPOINTS.SUPERADMIN.ORDER_OVERRIDE(id), payload),
//   },

//   // ── Ratings ──────────────────────────────────────────────────────────────

//   ratings: {
//     getAll: (params?: PaginationParams) =>
//       apiClient.get<PaginatedResponse<Rating>>(ENDPOINTS.SUPERADMIN.RATINGS, { params }),
//   },

//   // ── Queries / Complaints ─────────────────────────────────────────────────

//   queries: {
//     getAll: (params?: PaginationParams) =>
//       apiClient.get<PaginatedResponse<Query>>(ENDPOINTS.SUPERADMIN.QUERIES, { params }),

//     getById: (id: string) =>
//       apiClient.get<Query>(ENDPOINTS.SUPERADMIN.QUERY_BY_ID(id)),

//     assign: (id: string, payload: QueryAssignPayload) =>
//       apiClient.post<ApiMessage>(ENDPOINTS.SUPERADMIN.QUERY_ASSIGN(id), payload),

//     resolve: (id: string, payload: QueryResolvePayload) =>
//       apiClient.post<ApiMessage>(ENDPOINTS.SUPERADMIN.QUERY_RESOLVE(id), payload),
//   },

//   // ── Profile / Settings ───────────────────────────────────────────────────

//   profile: {
//     get: () =>
//       apiClient.get<Profile>(ENDPOINTS.SUPERADMIN.PROFILE),

//     update: (payload: UpdateProfilePayload) =>
//       apiClient.put<Profile>(ENDPOINTS.SUPERADMIN.PROFILE, payload),

//     updateAvatar: (formData: FormData) =>
//       apiClient.put<Profile>(ENDPOINTS.SUPERADMIN.PROFILE_AVATAR, formData),

//     changePassword: (payload: ChangePasswordPayload) =>
//       apiClient.post<ApiMessage>(ENDPOINTS.SUPERADMIN.CHANGE_PASSWORD, payload),

//     verifyOtp: (payload: VerifyOtpPayload) =>
//       apiClient.post<ApiMessage>(ENDPOINTS.SUPERADMIN.VERIFY_OTP, payload),

//     resendOtp: (payload?: ResendOtpPayload) =>
//       apiClient.post<ApiMessage>(ENDPOINTS.SUPERADMIN.RESEND_OTP, payload),
//   },
// };

// THIRD NEW ENDPOINT

// import { apiClient } from "../client";
// import { ENDPOINTS } from "../config";

// // ─────────────────────────────────────────────
// // Shared / Generic Types
// // ─────────────────────────────────────────────

// export interface PaginatedResponse<T> {
//   data: T[];
//   total: number;
//   page: number;
//   limit: number;
//   totalPages: number;
// }

// export interface PaginationParams {
//   page?: number;
//   limit?: number;
//   search?: string;
//   status?: string;
//   [key: string]: any;
// }

// export interface ApiMessage {
//   message: string;
// }

// // ─────────────────────────────────────────────
// // Auth Types
// // ─────────────────────────────────────────────

// export interface LoginPayload {
//   email: string;
//   password: string;
// }

// export interface AuthUser {
//   id: string;
//   name: string;
//   email: string;
//   role: string;
//   avatar?: string;
// }

// export interface LoginResponse {
//   token: string;
//   user: AuthUser;
// }

// // ─────────────────────────────────────────────
// // Dashboard Types
// // ─────────────────────────────────────────────

// /**
//  * Returned by GET /api/superadmin/dashboard
//  *
//  * ⚠️  BACKEND REQUIREMENTS — all fields below must be present in the response:
//  *   activeCustomers    – customers where status = "active"
//  *   inactiveCustomers  – customers where status = "inactive" | "suspended"
//  *   deliveredOrders    – orders where status = "delivered"
//  *   activeVendors      – vendors where status = "active"
//  *   suspendedVendors   – vendors where status = "suspended"
//  *   activeRiders       – riders where status = "active"
//  *   availableRiders    – riders currently available for dispatch
//  *   totalQueries       – total query/complaint count
//  *   pendingQueries     – queries with status "open" or "assigned"
//  *   resolvedQueries    – queries with status "resolved"
//  *   totalRatings       – total rating count across all vendors and riders
//  *   excellentRatings   – ratings with score = 5
//  *   goodRatings        – ratings with score = 4
//  */
// export interface DashboardStats {
//   totalCustomers: number;
//   activeCustomers: number;
//   inactiveCustomers: number;
//   totalOrders: number;
//   activeOrders: number;
//   deliveredOrders: number;
//   totalVendors: number;
//   activeVendors: number;
//   suspendedVendors: number;
//   totalRevenue: number;
//   totalRiders: number;
//   activeRiders: number;
//   availableRiders: number;
//   totalQueries: number;
//   openQueries: number;
//   pendingQueries: number;
//   resolvedQueries: number;
//   totalRatings: number;
//   excellentRatings: number;
//   goodRatings: number;
//   pendingVerifications: number;
//   [key: string]: any;
// }

// /**
//  * Returned by GET /api/superadmin/revenue
//  *
//  * Controller query params:
//  *   period = "today" | "week" | "month" | "year" | "all"  (NOT daily/monthly/yearly)
//  *   startDate, endDate = ISO strings for custom ranges
//  *
//  * Actual response shape from controller:
//  *   { period, data: { totalGrossRevenue, totalExpenses, totalNetRevenue,
//  *                     totalVendorPayouts, totalRiderPayouts, totalPlatformFees, count } }
//  */
// export interface RevenueAnalyticsData {
//   totalGrossRevenue: number;
//   totalExpenses: number;
//   totalNetRevenue: number;
//   totalVendorPayouts: number;
//   totalRiderPayouts: number;
//   totalPlatformFees: number;
//   count: number;
// }

// export interface RevenueAnalyticsResponse {
//   period: string;
//   data: RevenueAnalyticsData;
// }

// /**
//  * Returned by GET /api/superadmin/revenue/trends
//  *
//  * Controller query params:
//  *   groupBy = "hour" | "day" | "week" | "month"  (default: "day")
//  *   limit   = number of data points               (default: 30)
//  *
//  * Actual response shape from controller:
//  *   { groupBy, count, data: [{ _id, grossRevenue, expenses, netRevenue, orders }] }
//  *
//  * Note: trend points use `_id` for the date label and `expenses` (not `totalExpenses`)
//  */
// export interface RevenueTrendPoint {
//   _id: string;        // date label e.g. "2025-01-15" or "2025-01"
//   grossRevenue: number;
//   expenses: number;   // field name from controller (NOT totalExpenses)
//   netRevenue: number;
//   orders: number;
// }

// export interface RevenueTrendsResponse {
//   groupBy: string;
//   count: number;
//   data: RevenueTrendPoint[];
// }

// /**
//  * Top vendor/rider for the revenue page performers section.
//  * ⚠️  BACKEND REQUIREMENT: Superadmin portal needs these endpoints.
//  *   Currently only defined under FINANCE portal in ENDPOINTS.
//  *   Request backend team add:
//  *     GET /api/superadmin/revenue/top-vendors?period=month|year
//  *     GET /api/superadmin/revenue/top-riders?period=month|year
//  */
// export interface TopPerformer {
//   id: string;
//   name: string;
//   avatar?: string;
//   location?: string;  // for vendors
//   type?: string;      // for riders e.g. "Bike Rider"
//   revenue: number;
//   orders?: number;
// }

// export interface TopPerformersResponse {
//   data: TopPerformer[];
// }

// // Keep old RevenueStats as an alias for backwards compatibility with dashboard modal
// export interface RevenueStats {
//   grossRevenue: number;
//   totalExpenses: number;
//   netRevenue: number;
//   totalRevenue: number;
//   [key: string]: any;
// }

// // ─────────────────────────────────────────────
// // Customer Types
// // ─────────────────────────────────────────────

// /**
//  * ⚠️  BACKEND REQUIREMENTS — customer list & detail endpoints must include:
//  *   phoneNumber       – contact number
//  *   address           – delivery address
//  *   statusOfAccount   – human-readable label e.g. "Active", "Suspended"
//  *   successfulOrders  – count of completed orders
//  *   cancelledOrders   – count of cancelled orders
//  *   pendingOrders     – count of pending orders
//  *   mostUsedVendor    – { id, name, address, avatar, totalOrders }
//  */
// export interface MostUsedVendor {
//   id: string;
//   name: string;
//   address?: string;
//   avatar?: string;
//   totalOrders: number;
// }

// export interface Customer {
//   id: string;
//   name: string;
//   email: string;
//   phone?: string;
//   phoneNumber?: string;
//   address?: string;
//   avatar?: string;
//   status: "active" | "suspended" | "deleted";
//   statusOfAccount?: string;
//   totalOrders?: number;
//   successfulOrders?: number;
//   cancelledOrders?: number;
//   pendingOrders?: number;
//   mostUsedVendor?: MostUsedVendor;
//   createdAt: string;
//   updatedAt: string;
//   [key: string]: any;
// }

// // ─────────────────────────────────────────────
// // Vendor Types
// // ─────────────────────────────────────────────

// /**
//  * ⚠️  BACKEND REQUIREMENTS — vendor list & detail endpoints must include:
//  *   phoneNumber         – contact number
//  *   address             – physical address / zone
//  *   statusOfAccount     – human-readable status label
//  *   deliveryType        – e.g. "Bike", "Car", "Walk"
//  *   rating              – average rating score
//  *   reviewCount         – total number of reviews
//  *   deliveredOrders     – count of delivered orders
//  *   receivedOrders      – count of received / accepted orders
//  *   rejectedOrders      – count of rejected orders
//  *   mostFrequentBuyer   – { id, name, address, avatar, totalOrders }
//  */
// export interface MostFrequentBuyer {
//   id: string;
//   name: string;
//   address?: string;
//   avatar?: string;
//   totalOrders: number;
// }

// export interface Vendor {
//   id: string;
//   name: string;
//   email: string;
//   phone?: string;
//   phoneNumber?: string;
//   address?: string;
//   avatar?: string;
//   businessName?: string;
//   deliveryType?: string;
//   status: "active" | "suspended" | "pending";
//   statusOfAccount?: string;
//   isVerified: boolean;
//   rating?: number;
//   reviewCount?: number;
//   totalOrders?: number;
//   deliveredOrders?: number;
//   receivedOrders?: number;
//   rejectedOrders?: number;
//   mostFrequentBuyer?: MostFrequentBuyer;
//   createdAt: string;
//   updatedAt: string;
//   [key: string]: any;
// }

// // ─────────────────────────────────────────────
// // Rider Types
// // ─────────────────────────────────────────────

// /**
//  * ⚠️  BACKEND REQUIREMENTS — rider list & detail endpoints must include:
//  *   phoneNumber       – contact number
//  *   address           – home zone / operating area
//  *   statusOfAccount   – human-readable status label
//  *   deliveryType      – e.g. "Bike", "Car"
//  *   rating            – average rating score
//  *   reviewCount       – total number of reviews
//  *   totalDeliveries   – total completed deliveries
//  *   deliveredOrders   – count of delivered orders
//  *   outgoingOrders    – count of active / outgoing orders
//  *   rejectedOrders    – count of rejected orders
//  *   mostFrequentZone  – most common delivery zone string
//  */
// export interface Rider {
//   id: string;
//   name: string;
//   email: string;
//   phone?: string;
//   phoneNumber?: string;
//   address?: string;
//   avatar?: string;
//   deliveryType?: string;
//   status: "active" | "suspended" | "pending";
//   statusOfAccount?: string;
//   isVerified: boolean;
//   rating?: number;
//   reviewCount?: number;
//   totalOrders?: number;
//   totalDeliveries?: number;
//   deliveredOrders?: number;
//   outgoingOrders?: number;
//   rejectedOrders?: number;
//   mostFrequentZone?: string;
//   createdAt: string;
//   updatedAt: string;
//   [key: string]: any;
// }

// // ─────────────────────────────────────────────
// // Staff Types
// // ─────────────────────────────────────────────

// /**
//  * ⚠️  BACKEND REQUIREMENTS — staff list & detail endpoints must include:
//  *   phoneNumber     – contact number
//  *   statusOfAccount – human-readable status label
//  *   lineManager     – name of the direct manager
//  *
//  *   Also required: GET /api/superadmin/staff/:id
//  *   Add STAFF_BY_ID: (id: string) => `/api/superadmin/staff/${id}` to ENDPOINTS.SUPERADMIN
//  */
// export interface Staff {
//   id: string;
//   name: string;
//   email: string;
//   phone?: string;
//   phoneNumber?: string;
//   avatar?: string;
//   role: string;
//   department?: string;
//   status: "active" | "suspended" | "deactivated";
//   statusOfAccount?: string;
//   lineManager?: string;
//   createdAt: string;
//   updatedAt: string;
//   [key: string]: any;
// }

// // ─────────────────────────────────────────────
// // Order Types
// // ─────────────────────────────────────────────

// /**
//  * Backend order statuses (from controller):
//  *   active    → pending | confirmed | preparing | ready | picked_up | in_transit
//  *   delivered → delivered
//  *   rejected  → cancelled | rejected
//  *
//  * The backend populates nested objects for customer, vendor, rider.
//  * The controller maps vendor.owner.name → vendorName and vendor.storeName → storeName.
//  * Customer name comes from customer.user.name (nested populate).
//  * Rider name comes from rider.user (nested populate).
//  *
//  * ⚠️  BACKEND REQUIREMENTS — orders list/detail should also expose:
//  *   orderNumber       – human-readable order ID (e.g. "Oun-123-7D5T")
//  *   customerName      – flattened from customer.user.name
//  *   customerAddress   – flattened from customer profile address
//  *   vendorAddress     – flattened from vendor.storeDetails.address
//  *   riderName         – flattened from rider.user.name
//  *   riderZone         – flattened from rider operating zone
//  *   items             – array of line items with name, quantity, price
//  *   foodImage         – first item image or order-level image URL
//  *   isReported        – boolean, whether order is flagged/reported
//  */
// export interface OrderItem {
//   name: string;
//   quantity: number;
//   price: number;
//   image?: string;
//   [key: string]: any;
// }

// export interface Order {
//   // Core identifiers
//   id: string;
//   _id?: string;
//   orderNumber?: string;

//   // Relationships (IDs)
//   customerId?: string;
//   vendorId?: string;
//   riderId?: string;

//   // Flattened display fields (mapped by backend controller)
//   customerName?: string;
//   customerAddress?: string;
//   vendorName?: string;
//   storeName?: string;
//   vendorAddress?: string;
//   riderName?: string;
//   riderZone?: string;
//   riderPhone?: string;

//   // Order content
//   items?: OrderItem[];
//   foodImage?: string;         // first item image or order-level image
//   orderName?: string;         // derived: first item name or storeName

//   // Financials
//   totalAmount: number;
//   amountPaid?: number;        // may equal totalAmount
//   paymentStatus?: string;

//   // Status
//   status: string;             // raw backend status
//   isReported?: boolean;
//   overrideReason?: string;

//   // Timestamps
//   createdAt: string;
//   updatedAt: string;

//   [key: string]: any;
// }

// /**
//  * Payload for PUT /api/superadmin/orders/:id/override
//  * action: "resolve" | "cancel" | "refund"
//  */
// export interface OrderOverridePayload {
//   action: "resolve" | "cancel" | "refund";
//   reason: string;
// }

// /**
//  * Response shape from GET /api/superadmin/orders
//  * Note: backend returns `pages` (not `totalPages`) and `count` (current page count)
//  */
// export interface OrdersResponse {
//   count: number;
//   total: number;
//   page: number;
//   pages: number;
//   data: Order[];
// }

// // ─────────────────────────────────────────────
// // Rating Types
// // ─────────────────────────────────────────────

// /**
//  * ⚠️  BACKEND REQUIREMENTS — ratings list endpoint must include:
//  *   customerName    – display name of the reviewer
//  *   customerAvatar  – avatar URL (nullable)
//  *   targetName      – name of the rated vendor or rider
//  *   orderType       – e.g. "Tray Builder"
//  */
// export interface Rating {
//   id: string;
//   customerId: string;
//   customerName?: string;
//   customerAvatar?: string;
//   targetId: string;
//   targetName?: string;
//   targetType: "vendor" | "rider";
//   orderType?: string;
//   score: number;
//   comment?: string;
//   createdAt: string;
//   [key: string]: any;
// }

// // ─────────────────────────────────────────────
// // Query / Complaint Types
// // ─────────────────────────────────────────────

// export interface Query {
//   id: string;
//   customerId: string;
//   customerName?: string;
//   subject: string;
//   message: string;
//   status: "open" | "assigned" | "resolved";
//   assignedTo?: string;
//   createdAt: string;
//   updatedAt: string;
//   [key: string]: any;
// }

// export interface QueryAssignPayload {
//   staffId: string;
// }

// export interface QueryResolvePayload {
//   resolution: string;
//   [key: string]: any;
// }

// // ─────────────────────────────────────────────
// // Profile Types
// // ─────────────────────────────────────────────

// export interface Profile {
//   id: string;
//   name: string;
//   email: string;
//   avatar?: string;
//   role: string;
//   [key: string]: any;
// }

// export interface UpdateProfilePayload {
//   name?: string;
//   email?: string;
//   [key: string]: any;
// }

// export interface ChangePasswordPayload {
//   currentPassword: string;
//   newPassword: string;
//   confirmPassword: string;
// }

// export interface VerifyOtpPayload {
//   otp: string;
//   [key: string]: any;
// }

// export interface ResendOtpPayload {
//   email?: string;
//   [key: string]: any;
// }

// // ─────────────────────────────────────────────
// // Super Admin API
// // ─────────────────────────────────────────────

// export const superAdminApi = {

//   // ── Authentication ──────────────────────────────────────────────────────

//   auth: {
//     login: (payload: LoginPayload) =>
//       apiClient.post<LoginResponse>(ENDPOINTS.AUTH.LOGIN, payload, { requiresAuth: false }),

//     me: () =>
//       apiClient.get<AuthUser>(ENDPOINTS.AUTH.ME),

//     changePassword: (payload: ChangePasswordPayload) =>
//       apiClient.post<ApiMessage>(ENDPOINTS.AUTH.CHANGE_PASSWORD, payload),

//     logout: () =>
//       apiClient.post<ApiMessage>(ENDPOINTS.AUTH.LOGOUT),
//   },

//   // ── Dashboard ───────────────────────────────────────────────────────────

//   dashboard: {
//     getStats: () =>
//       apiClient.get<DashboardStats>(ENDPOINTS.SUPERADMIN.DASHBOARD),

//     // period: "today" | "week" | "month" | "year" | "all"
//     // or pass startDate + endDate for custom range
//     getRevenue: (params?: { period?: string; startDate?: string; endDate?: string }) =>
//       apiClient.get<RevenueAnalyticsResponse>(ENDPOINTS.SUPERADMIN.REVENUE, { params }),

//     // groupBy: "hour" | "day" | "week" | "month" — limit: number
//     getRevenueTrends: (params?: { groupBy?: string; limit?: number }) =>
//       apiClient.get<RevenueTrendsResponse>(ENDPOINTS.SUPERADMIN.REVENUE_TRENDS, { params }),

//     // ⚠️  BACKEND: add GET /api/superadmin/revenue/top-vendors and top-riders
//     // Until then these hit the superadmin revenue endpoint; swap path once backend adds them.
//     getTopVendors: (params?: { period?: string }) =>
//       apiClient.get<TopPerformersResponse>(`/api/superadmin/revenue/top-vendors`, { params }),

//     getTopRiders: (params?: { period?: string }) =>
//       apiClient.get<TopPerformersResponse>(`/api/superadmin/revenue/top-riders`, { params }),
//   },

//   // ── Customers ───────────────────────────────────────────────────────────

//   customers: {
//     getAll: (params?: PaginationParams) =>
//       apiClient.get<PaginatedResponse<Customer>>(ENDPOINTS.SUPERADMIN.CUSTOMERS, { params }),

//     getById: (id: string) =>
//       apiClient.get<Customer>(ENDPOINTS.SUPERADMIN.CUSTOMER_BY_ID(id)),

//     suspend: (id: string) =>
//       apiClient.post<ApiMessage>(ENDPOINTS.SUPERADMIN.CUSTOMER_SUSPEND(id)),

//     activate: (id: string) =>
//       apiClient.post<ApiMessage>(ENDPOINTS.SUPERADMIN.CUSTOMER_ACTIVATE(id)),
//   },

//   // ── Vendors ─────────────────────────────────────────────────────────────

//   vendors: {
//     getAll: (params?: PaginationParams) =>
//       apiClient.get<PaginatedResponse<Vendor>>(ENDPOINTS.SUPERADMIN.VENDORS, { params }),

//     getById: (id: string) =>
//       apiClient.get<Vendor>(ENDPOINTS.SUPERADMIN.VENDOR_BY_ID(id)),

//     suspend: (id: string) =>
//       apiClient.post<ApiMessage>(ENDPOINTS.SUPERADMIN.VENDOR_SUSPEND(id)),

//     activate: (id: string) =>
//       apiClient.post<ApiMessage>(ENDPOINTS.SUPERADMIN.VENDOR_ACTIVATE(id)),

//     verify: (id: string) =>
//       apiClient.post<ApiMessage>(ENDPOINTS.SUPERADMIN.VENDOR_VERIFY(id)),
//   },

//   // ── Riders ──────────────────────────────────────────────────────────────

//   riders: {
//     getAll: (params?: PaginationParams) =>
//       apiClient.get<PaginatedResponse<Rider>>(ENDPOINTS.SUPERADMIN.RIDERS, { params }),

//     getById: (id: string) =>
//       apiClient.get<Rider>(ENDPOINTS.SUPERADMIN.RIDER_BY_ID(id)),

//     suspend: (id: string) =>
//       apiClient.post<ApiMessage>(ENDPOINTS.SUPERADMIN.RIDER_SUSPEND(id)),

//     activate: (id: string) =>
//       apiClient.post<ApiMessage>(ENDPOINTS.SUPERADMIN.RIDER_ACTIVATE(id)),

//     verify: (id: string) =>
//       apiClient.post<ApiMessage>(ENDPOINTS.SUPERADMIN.RIDER_VERIFY(id)),
//   },

//   // ── Staff ────────────────────────────────────────────────────────────────
//   // ⚠️  BACKEND: add GET /api/superadmin/staff/:id and expose as ENDPOINTS.SUPERADMIN.STAFF_BY_ID

//   staff: {
//     getAll: (params?: PaginationParams) =>
//       apiClient.get<PaginatedResponse<Staff>>(ENDPOINTS.SUPERADMIN.STAFF, { params }),

//     // Hardcoded path until ENDPOINTS.SUPERADMIN.STAFF_BY_ID is added
//     getById: (id: string) =>
//       apiClient.get<Staff>(`/api/superadmin/staff/${id}`),
//   },

//   // ── Orders ───────────────────────────────────────────────────────────────

//   orders: {
//     // status: "active" | "delivered" | "rejected"
//     // isReported: true | false
//     // page, limit
//     getAll: (params?: PaginationParams) =>
//       apiClient.get<OrdersResponse>(ENDPOINTS.SUPERADMIN.ORDERS, { params }),

//     getById: (id: string) =>
//       apiClient.get<Order>(ENDPOINTS.SUPERADMIN.ORDER_BY_ID(id)),

//     // PUT — not POST — per backend controller
//     override: (id: string, payload: OrderOverridePayload) =>
//       apiClient.put<ApiMessage>(ENDPOINTS.SUPERADMIN.ORDER_OVERRIDE(id), payload),
//   },

//   // ── Ratings ──────────────────────────────────────────────────────────────

//   ratings: {
//     getAll: (params?: PaginationParams) =>
//       apiClient.get<PaginatedResponse<Rating>>(ENDPOINTS.SUPERADMIN.RATINGS, { params }),
//   },

//   // ── Queries / Complaints ─────────────────────────────────────────────────

//   queries: {
//     getAll: (params?: PaginationParams) =>
//       apiClient.get<PaginatedResponse<Query>>(ENDPOINTS.SUPERADMIN.QUERIES, { params }),

//     getById: (id: string) =>
//       apiClient.get<Query>(ENDPOINTS.SUPERADMIN.QUERY_BY_ID(id)),

//     assign: (id: string, payload: QueryAssignPayload) =>
//       apiClient.post<ApiMessage>(ENDPOINTS.SUPERADMIN.QUERY_ASSIGN(id), payload),

//     resolve: (id: string, payload: QueryResolvePayload) =>
//       apiClient.post<ApiMessage>(ENDPOINTS.SUPERADMIN.QUERY_RESOLVE(id), payload),
//   },

//   // ── Profile / Settings ───────────────────────────────────────────────────

//   profile: {
//     get: () =>
//       apiClient.get<Profile>(ENDPOINTS.SUPERADMIN.PROFILE),

//     update: (payload: UpdateProfilePayload) =>
//       apiClient.put<Profile>(ENDPOINTS.SUPERADMIN.PROFILE, payload),

//     updateAvatar: (formData: FormData) =>
//       apiClient.put<Profile>(ENDPOINTS.SUPERADMIN.PROFILE_AVATAR, formData),

//     changePassword: (payload: ChangePasswordPayload) =>
//       apiClient.post<ApiMessage>(ENDPOINTS.SUPERADMIN.CHANGE_PASSWORD, payload),

//     verifyOtp: (payload: VerifyOtpPayload) =>
//       apiClient.post<ApiMessage>(ENDPOINTS.SUPERADMIN.VERIFY_OTP, payload),

//     resendOtp: (payload?: ResendOtpPayload) =>
//       apiClient.post<ApiMessage>(ENDPOINTS.SUPERADMIN.RESEND_OTP, payload),
//   },
// };

//Fourth endpoint

import { apiClient } from "../client";
import { ENDPOINTS } from "../config";

// ─────────────────────────────────────────────
// Shared / Generic Types
// ─────────────────────────────────────────────

/**
 * Standard paginated list response shape from the backend.
 * Note: backend uses `pages` (not `totalPages`) and `count` (items on current page).
 */
export interface PaginatedResponse<T> {
  data: T[];
  count: number; // items on current page
  total: number; // total items across all pages
  page: number;
  pages: number; // total page count
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  [key: string]: any;
}

export interface ApiMessage {
  message: string;
}

// ─────────────────────────────────────────────
// Auth Types
// ─────────────────────────────────────────────

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

// ─────────────────────────────────────────────
// Dashboard Types
// ─────────────────────────────────────────────

/**
 * Returned by GET /api/superadmin/dashboard
 *
 * The controller returns a NESTED response:
 * {
 *   data: {
 *     users:   { total, customers, activeCustomers, inactiveCustomers,
 *                vendors, activeVendors, suspendedVendors,
 *                riders, activeRiders, availableRiders }
 *     orders:  { total, active, deliveredOrders }
 *     ratings: { totalRatings, excellentRatings, goodRatings }
 *     queries: { open, totalQueries, pendingQueries, resolvedQueries }
 *     revenue: { gross, expenses, net }
 *   }
 * }
 */
export interface DashboardUsers {
  total: number;
  customers: number;
  activeCustomers: number;
  inactiveCustomers: number;
  vendors: number;
  activeVendors: number;
  suspendedVendors: number;
  riders: number;
  activeRiders: number;
  availableRiders: number;
}

export interface DashboardOrders {
  total: number;
  active: number;
  deliveredOrders: number;
}

export interface DashboardRatings {
  totalRatings: number;
  excellentRatings: number;
  goodRatings: number;
}

export interface DashboardQueries {
  open: number;
  totalQueries: number;
  pendingQueries: number;
  resolvedQueries: number;
}

export interface DashboardRevenue {
  gross: number;
  expenses: number;
  net: number;
}

export interface DashboardStats {
  users: DashboardUsers;
  orders: DashboardOrders;
  ratings: DashboardRatings;
  queries: DashboardQueries;
  revenue: DashboardRevenue;
}

// ─────────────────────────────────────────────
// Revenue Types
// ─────────────────────────────────────────────

/**
 * Returned by GET /api/superadmin/revenue
 * Query params: period = "today" | "week" | "month" | "year" | "all"
 *               startDate, endDate (ISO strings for custom range)
 */
export interface RevenueAnalyticsData {
  totalGrossRevenue: number;
  totalExpenses: number;
  totalNetRevenue: number;
  totalVendorPayouts: number;
  totalRiderPayouts: number;
  totalPlatformFees: number;
  count: number;
}

export interface RevenueAnalyticsResponse {
  period: string;
  data: RevenueAnalyticsData;
}

/**
 * Returned by GET /api/superadmin/revenue/trends
 * Query params: groupBy = "hour" | "day" | "week" | "month", limit = number
 * Trend point uses `_id` for date label and `expenses` (not `totalExpenses`)
 */
export interface RevenueTrendPoint {
  _id: string;
  grossRevenue: number;
  expenses: number;
  netRevenue: number;
  orders: number;
}

export interface RevenueTrendsResponse {
  groupBy: string;
  count: number;
  data: RevenueTrendPoint[];
}

export interface TopPerformer {
  id: string;
  name: string;
  avatar?: string;
  location?: string;
  type?: string;
  revenue: number;
  orders?: number;
}

export interface TopPerformersResponse {
  data: TopPerformer[];
}

// Keep for backwards compatibility with dashboard modal
export interface RevenueStats {
  grossRevenue: number;
  totalExpenses: number;
  netRevenue: number;
  totalRevenue: number;
  [key: string]: any;
}

// ─────────────────────────────────────────────
// Customer Types
// ─────────────────────────────────────────────

export interface MostUsedVendor {
  id: string;
  name: string;
  address?: string;
  avatar?: string;
  totalOrders: number;
}

/**
 * Customer list: { data: Customer[], count, total, page, pages }
 * Customer detail: { data: { customer: Customer, recentOrders: Order[] } }
 *
 * Flattened fields added by controller:
 *   phoneNumber, address, statusOfAccount,
 *   successfulOrders, cancelledOrders, pendingOrders, mostUsedVendor
 */
export interface Customer {
  id: string;
  _id?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  phoneNumber?: string;
  address?: string;
  avatar?: string;
  status?: string;
  statusOfAccount?: string;
  isActive?: boolean;
  isSuspended?: boolean;
  totalOrders?: number;
  successfulOrders?: number;
  cancelledOrders?: number;
  pendingOrders?: number;
  mostUsedVendor?: MostUsedVendor;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

/** Response shape for GET /api/superadmin/customers/:id */
export interface CustomerDetailResponse {
  data: {
    customer: Customer;
    recentOrders: Order[];
  };
}

// ─────────────────────────────────────────────
// Vendor Types
// ─────────────────────────────────────────────

export interface MostFrequentBuyer {
  id: string;
  name: string;
  address?: string;
  avatar?: string;
  totalOrders: number;
}

/**
 * Vendor list: { data: Vendor[], count, total, page, pages }
 * Vendor detail: { data: { vendor: Vendor, recentOrders: Order[], recentRatings: Rating[] } }
 *
 * Flattened fields added by controller:
 *   phoneNumber, address, statusOfAccount, deliveryType,
 *   rating, reviewCount, deliveredOrders, receivedOrders, rejectedOrders, mostFrequentBuyer
 */
export interface Vendor {
  id: string;
  _id?: string;
  name: string;
  email?: string;
  phone?: string;
  phoneNumber?: string;
  address?: string;
  avatar?: string;
  businessName?: string;
  deliveryType?: string;
  status?: string;
  statusOfAccount?: string;
  isActive?: boolean;
  isSuspended?: boolean;
  isVerified: boolean;
  rating?: number;
  reviewCount?: number;
  totalOrders?: number;
  deliveredOrders?: number;
  receivedOrders?: number;
  rejectedOrders?: number;
  mostFrequentBuyer?: MostFrequentBuyer;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

/** Response shape for GET /api/superadmin/vendors/:id */
export interface VendorDetailResponse {
  data: {
    vendor: Vendor;
    recentOrders: Order[];
    recentRatings: Rating[];
  };
}

// ─────────────────────────────────────────────
// Rider Types
// ─────────────────────────────────────────────

/**
 * Rider list: { data: Rider[], count, total, page, pages }
 * Rider detail: { data: { rider: Rider, recentDeliveries: Order[], recentRatings: Rating[] } }
 *
 * Flattened fields added by controller:
 *   phoneNumber, address, statusOfAccount, deliveryType,
 *   rating, reviewCount, totalDeliveries, deliveredOrders, outgoingOrders, rejectedOrders, mostFrequentZone
 */
export interface Rider {
  id: string;
  _id?: string;
  name?: string;
  email?: string;
  phone?: string;
  phoneNumber?: string;
  address?: string;
  avatar?: string;
  deliveryType?: string;
  status?: string;
  statusOfAccount?: string;
  isActive?: boolean;
  isSuspended?: boolean;
  isVerified: boolean;
  rating?: number;
  reviewCount?: number;
  totalOrders?: number;
  totalDeliveries?: number;
  deliveredOrders?: number;
  outgoingOrders?: number;
  rejectedOrders?: number;
  mostFrequentZone?: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

/** Response shape for GET /api/superadmin/riders/:id */
export interface RiderDetailResponse {
  data: {
    rider: Rider;
    recentDeliveries: Order[];
    recentRatings: Rating[];
  };
}

// ─────────────────────────────────────────────
// Staff Types
// ─────────────────────────────────────────────

/**
 * Staff list: { data: Staff[], count, total, page, pages }
 * Staff detail: { data: Staff }  ← flat, no nesting
 *
 * Flattened fields added by controller:
 *   phoneNumber, profileImage, statusOfAccount, lineManager (string name)
 */
export interface Staff {
  id: string;
  _id?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  phoneNumber?: string;
  avatar?: string;
  profileImage?: string;
  role?: string;
  department?: string;
  status?: string;
  statusOfAccount?: string;
  isActive?: boolean;
  isSuspended?: boolean;
  lineManager?: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

// ─────────────────────────────────────────────
// Order Types
// ─────────────────────────────────────────────

/**
 * All flattened fields are now confirmed present from the updated controller:
 *   customerName, customerAddress, vendorName, storeName, vendorAddress,
 *   riderName, riderZone, riderPhone, items (with name + image), foodImage
 *
 * Flag endpoint confirmed: PUT /api/superadmin/orders/:id/flag
 *   Body: { reason?: string }
 *   Sets isReported = true (opposite of override/resolve)
 */
export interface OrderItem {
  name: string;
  quantity: number;
  price?: number;
  image?: string;
  itemType?: string;
  [key: string]: any;
}

export interface Order {
  id: string;
  _id?: string;
  orderNumber?: string;

  // Populated / flattened by controller
  customerName?: string;
  customerAddress?: string;
  vendorName?: string;
  storeName?: string;
  vendorAddress?: string;
  riderName?: string;
  riderZone?: string;
  riderPhone?: string;

  items?: OrderItem[];
  foodImage?: string;

  totalAmount: number;
  amountPaid?: number;
  paymentStatus?: string;

  status: string;
  isReported?: boolean;
  reportReason?: string;
  overrideReason?: string;

  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

export interface OrderOverridePayload {
  action: "resolve" | "cancel" | "refund";
  reason: string;
}

export interface OrderFlagPayload {
  reason?: string;
}

/**
 * List response shape: uses `pages` not `totalPages`, `count` = current page items
 */
export interface OrdersResponse {
  count: number;
  total: number;
  page: number;
  pages: number;
  data: Order[];
}

// ─────────────────────────────────────────────
// Rating Types
// ─────────────────────────────────────────────

/**
 * Filter params: rating (integer 1–5), targetType ("VendorProfile" | "RiderProfile" | "FoodItem" | "Combo" | "Plate")
 *
 * Flattened fields added by controller:
 *   customerName, customerImage (NOT customerAvatar), targetName, orderType
 *
 * Note: the schema field is `rating` (not `score`)
 * Note: response also includes `distribution` and `byType` arrays
 */
export interface Rating {
  id: string;
  _id?: string;
  customerId?: string;
  customerName?: string;
  customerImage?: string; // controller returns customerImage, not customerAvatar
  targetId?: string;
  targetName?: string;
  targetType?: string; // full model name e.g. "VendorProfile", "RiderProfile"
  orderType?: string; // human-readable e.g. "Tray Builder", "Vendor Review"
  rating: number; // the field is `rating`, not `score`
  comment?: string;
  review?: string;
  createdAt: string;
  [key: string]: any;
}

export interface RatingDistributionPoint {
  _id: number; // star value 1–5
  count: number;
}

export interface RatingByTypePoint {
  _id: string; // targetType string
  count: number;
  avgRating: number;
}

export interface RatingsResponse {
  count: number;
  total: number;
  page: number;
  pages: number;
  distribution: RatingDistributionPoint[];
  byType: RatingByTypePoint[];
  data: Rating[];
}

export interface RatingStatsResponse {
  data: {
    total: number;
    average: number;
    distribution: RatingDistributionPoint[];
  };
}

// ─────────────────────────────────────────────
// Query / Complaint Types
// ─────────────────────────────────────────────

export interface Query {
  id: string;
  _id?: string;
  customerId?: string;
  customerName?: string;
  subject: string;
  message: string;
  status: "open" | "assigned" | "resolved" | "Open" | "In-Progress" | "Pending-Reply" | "Resolved";
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

export interface QueryAssignPayload {
  staffId: string;
}

export interface QueryResolvePayload {
  resolution: string;
  [key: string]: any;
}

// ─────────────────────────────────────────────
// Profile Types
// ─────────────────────────────────────────────

export interface Profile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  [key: string]: any;
}

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  [key: string]: any;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface VerifyOtpPayload {
  otp: string;
  [key: string]: any;
}

export interface ResendOtpPayload {
  email?: string;
  [key: string]: any;
}

// ─────────────────────────────────────────────
// Super Admin API
// ─────────────────────────────────────────────

export const superAdminApi = {
  // ── Authentication ──────────────────────────────────────────────────────

  auth: {
    login: (payload: LoginPayload) =>
      apiClient.post<LoginResponse>(ENDPOINTS.AUTH.LOGIN, payload, { requiresAuth: false }),

    me: () => apiClient.get<AuthUser>(ENDPOINTS.AUTH.ME),

    changePassword: (payload: ChangePasswordPayload) =>
      apiClient.post<ApiMessage>(ENDPOINTS.AUTH.CHANGE_PASSWORD, payload),

    logout: () => apiClient.post<ApiMessage>(ENDPOINTS.AUTH.LOGOUT),
  },

  // ── Dashboard ───────────────────────────────────────────────────────────

  dashboard: {
    // Response is nested: { data: { users, orders, ratings, queries, revenue } }
    getStats: () => apiClient.get<{ data: DashboardStats }>(ENDPOINTS.SUPERADMIN.DASHBOARD),

    // period: "today" | "week" | "month" | "year" | "all"
    getRevenue: (params?: { period?: string; startDate?: string; endDate?: string }) =>
      apiClient.get<RevenueAnalyticsResponse>(ENDPOINTS.SUPERADMIN.REVENUE, { params }),

    // groupBy: "hour" | "day" | "week" | "month", limit: number
    getRevenueTrends: (params?: { groupBy?: string; limit?: number }) =>
      apiClient.get<RevenueTrendsResponse>(ENDPOINTS.SUPERADMIN.REVENUE_TRENDS, { params }),

    // ⚠️  BACKEND: add GET /api/superadmin/revenue/top-vendors and top-riders
    getTopVendors: (params?: { period?: string }) =>
      apiClient.get<TopPerformersResponse>(`/api/superadmin/revenue/top-vendors`, { params }),

    getTopRiders: (params?: { period?: string }) =>
      apiClient.get<TopPerformersResponse>(`/api/superadmin/revenue/top-riders`, { params }),
  },

  // ── Customers ───────────────────────────────────────────────────────────

  customers: {
    // Params: search, isActive, isSuspended, page, limit
    getAll: (params?: PaginationParams) =>
      apiClient.get<PaginatedResponse<Customer>>(ENDPOINTS.SUPERADMIN.CUSTOMERS, { params }),

    // Response: { data: { customer: Customer, recentOrders: Order[] } }
    getById: (id: string) =>
      apiClient.get<CustomerDetailResponse>(ENDPOINTS.SUPERADMIN.CUSTOMER_BY_ID(id)),

    // Router uses PUT
    suspend: (id: string) => apiClient.put<ApiMessage>(ENDPOINTS.SUPERADMIN.CUSTOMER_SUSPEND(id)),

    activate: (id: string) => apiClient.put<ApiMessage>(ENDPOINTS.SUPERADMIN.CUSTOMER_ACTIVATE(id)),
  },

  // ── Vendors ─────────────────────────────────────────────────────────────

  vendors: {
    // Params: search, isActive, isVerified, isSuspended, page, limit
    getAll: (params?: PaginationParams) =>
      apiClient.get<PaginatedResponse<Vendor>>(ENDPOINTS.SUPERADMIN.VENDORS, { params }),

    // Response: { data: { vendor: Vendor, recentOrders: Order[], recentRatings: Rating[] } }
    getById: (id: string) =>
      apiClient.get<VendorDetailResponse>(ENDPOINTS.SUPERADMIN.VENDOR_BY_ID(id)),

    // Router uses PUT
    suspend: (id: string) => apiClient.put<ApiMessage>(ENDPOINTS.SUPERADMIN.VENDOR_SUSPEND(id)),

    activate: (id: string) => apiClient.put<ApiMessage>(ENDPOINTS.SUPERADMIN.VENDOR_ACTIVATE(id)),

    verify: (id: string) => apiClient.put<ApiMessage>(ENDPOINTS.SUPERADMIN.VENDOR_VERIFY(id)),
  },

  // ── Riders ──────────────────────────────────────────────────────────────

  riders: {
    // Params: search, isActive, isVerified, isSuspended, page, limit
    getAll: (params?: PaginationParams) =>
      apiClient.get<PaginatedResponse<Rider>>(ENDPOINTS.SUPERADMIN.RIDERS, { params }),

    // Response: { data: { rider: Rider, recentDeliveries: Order[], recentRatings: Rating[] } }
    getById: (id: string) =>
      apiClient.get<RiderDetailResponse>(ENDPOINTS.SUPERADMIN.RIDER_BY_ID(id)),

    // Router uses PUT
    suspend: (id: string) => apiClient.put<ApiMessage>(ENDPOINTS.SUPERADMIN.RIDER_SUSPEND(id)),

    activate: (id: string) => apiClient.put<ApiMessage>(ENDPOINTS.SUPERADMIN.RIDER_ACTIVATE(id)),

    verify: (id: string) => apiClient.put<ApiMessage>(ENDPOINTS.SUPERADMIN.RIDER_VERIFY(id)),
  },

  // ── Staff ────────────────────────────────────────────────────────────────

  staff: {
    // Params: department, isHead, page, limit
    getAll: (params?: PaginationParams) =>
      apiClient.get<PaginatedResponse<Staff>>(ENDPOINTS.SUPERADMIN.STAFF, { params }),

    // Response: { data: Staff }  — flat, no nesting
    getById: (id: string) => apiClient.get<{ data: Staff }>(ENDPOINTS.SUPERADMIN.STAFF_BY_ID(id)),
  },

  // ── Orders ───────────────────────────────────────────────────────────────

  orders: {
    // Params: status ("active"|"delivered"|"rejected"), isReported, page, limit
    getAll: (params?: PaginationParams) =>
      apiClient.get<OrdersResponse>(ENDPOINTS.SUPERADMIN.ORDERS, { params }),

    getById: (id: string) => apiClient.get<{ data: Order }>(ENDPOINTS.SUPERADMIN.ORDER_BY_ID(id)),

    // PUT — confirmed from router
    override: (id: string, payload: OrderOverridePayload) =>
      apiClient.put<ApiMessage>(ENDPOINTS.SUPERADMIN.ORDER_OVERRIDE(id), payload),

    // PUT — confirmed from router; sets isReported = true
    flag: (id: string, payload?: OrderFlagPayload) =>
      apiClient.put<ApiMessage>(`/api/superadmin/orders/${id}/flag`, payload),
  },

  // ── Ratings ──────────────────────────────────────────────────────────────

  ratings: {
    // Params: rating (1–5 integer), targetType ("VendorProfile"|"RiderProfile" etc.), page, limit
    getAll: (params?: PaginationParams) =>
      apiClient.get<RatingsResponse>(ENDPOINTS.SUPERADMIN.RATINGS, { params }),

    getStats: () => apiClient.get<RatingStatsResponse>(`/api/superadmin/ratings/stats`),
  },

  // ── Queries / Complaints ─────────────────────────────────────────────────

  queries: {
    getAll: (params?: PaginationParams) =>
      apiClient.get<PaginatedResponse<Query>>(ENDPOINTS.SUPERADMIN.QUERIES, { params }),

    getById: (id: string) => apiClient.get<Query>(ENDPOINTS.SUPERADMIN.QUERY_BY_ID(id)),

    assign: (id: string, payload: QueryAssignPayload) =>
      apiClient.put<ApiMessage>(ENDPOINTS.SUPERADMIN.QUERY_ASSIGN(id), payload),

    resolve: (id: string, payload: QueryResolvePayload) =>
      apiClient.put<ApiMessage>(ENDPOINTS.SUPERADMIN.QUERY_RESOLVE(id), payload),
  },

  // ── Profile / Settings ───────────────────────────────────────────────────

  profile: {
    get: () => apiClient.get<Profile>(ENDPOINTS.SUPERADMIN.PROFILE),

    update: (payload: UpdateProfilePayload) =>
      apiClient.put<Profile>(ENDPOINTS.SUPERADMIN.PROFILE, payload),

    updateAvatar: (formData: FormData) =>
      apiClient.post<Profile>(ENDPOINTS.SUPERADMIN.PROFILE_AVATAR, formData),

    changePassword: (payload: ChangePasswordPayload) =>
      apiClient.post<ApiMessage>(ENDPOINTS.SUPERADMIN.CHANGE_PASSWORD, payload),

    verifyOtp: (payload: VerifyOtpPayload) =>
      apiClient.post<ApiMessage>(ENDPOINTS.SUPERADMIN.VERIFY_OTP, payload),

    resendOtp: (payload?: ResendOtpPayload) =>
      apiClient.post<ApiMessage>(ENDPOINTS.SUPERADMIN.RESEND_OTP, payload),
  },
};
