export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://ounje-kitchen-backend.pxxl.pro',
  // BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://ounje-kitchen-backend-kiwy.onrender.com',
  //  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  TIMEOUT: 30000,
  
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

export const ENDPOINTS = {
  // ── Shared (Universal Access) ─────────────────────────────────────────────
  SHARED: {
    NOTIFICATIONS:       '/api/shared/notifications',
    NOTIFICATION_DELETE: (id: string) => `/api/shared/notifications/${id}`,
  },

  // ── Authentication ────────────────────────────────────────────────────────
  AUTH: {
    LOGIN:           '/api/auth/login',
    ME:              '/api/auth/me',
    CHANGE_PASSWORD: '/api/auth/change-password',
    LOGOUT:          '/api/auth/logout',
  },

  // ── Super Admin Portal ────────────────────────────────────────────────────
  SUPERADMIN: {
    DASHBOARD:      '/api/superadmin/dashboard',
    REVENUE:        '/api/superadmin/revenue',
    REVENUE_TRENDS: '/api/superadmin/revenue/trends',

    // Customers
    CUSTOMERS:         '/api/superadmin/customers',
    CUSTOMER_BY_ID:    (id: string) => `/api/superadmin/customers/${id}`,
    CUSTOMER_SUSPEND:  (id: string) => `/api/superadmin/customers/${id}/suspend`,
    CUSTOMER_ACTIVATE: (id: string) => `/api/superadmin/customers/${id}/activate`,

    // Vendors
    VENDORS:         '/api/superadmin/vendors',
    VENDOR_BY_ID:    (id: string) => `/api/superadmin/vendors/${id}`,
    VENDOR_SUSPEND:  (id: string) => `/api/superadmin/vendors/${id}/suspend`,
    VENDOR_ACTIVATE: (id: string) => `/api/superadmin/vendors/${id}/activate`,
    VENDOR_VERIFY:   (id: string) => `/api/superadmin/vendors/${id}/verify`,

    // Riders
    RIDERS:         '/api/superadmin/riders',
    RIDER_BY_ID:    (id: string) => `/api/superadmin/riders/${id}`,
    RIDER_SUSPEND:  (id: string) => `/api/superadmin/riders/${id}/suspend`,
    RIDER_ACTIVATE: (id: string) => `/api/superadmin/riders/${id}/activate`,
    RIDER_VERIFY:   (id: string) => `/api/superadmin/riders/${id}/verify`,

    // Staff
    STAFF:    '/api/superadmin/staff',
    STAFF_BY_ID: (id: string) => `/api/superadmin/staff/{id}`,

    // Orders
    ORDERS:         '/api/superadmin/orders',
    ORDER_BY_ID:    (id: string) => `/api/superadmin/orders/${id}`,
    ORDER_OVERRIDE: (id: string) => `/api/superadmin/orders/${id}/override`,

    // Ratings
    RATINGS: '/api/superadmin/ratings',

    // Queries / Complaints
    QUERIES:       '/api/superadmin/queries',
    QUERY_BY_ID:   (id: string) => `/api/superadmin/queries/${id}`,
    QUERY_ASSIGN:  (id: string) => `/api/superadmin/queries/${id}/assign`,
    QUERY_RESOLVE: (id: string) => `/api/superadmin/queries/${id}/resolve`,

    // Profile / Settings
    PROFILE:         '/api/superadmin/profile',
    PROFILE_AVATAR:  '/api/superadmin/profile/avatar',
    CHANGE_PASSWORD: '/api/superadmin/change-password',
    VERIFY_OTP:      '/api/superadmin/verify-otp',
    RESEND_OTP:      '/api/superadmin/resend-otp',

    // Promo Codes
    PROMOS:       '/api/superadmin/promos',
    PROMO_TOGGLE: (id: string) => `/api/superadmin/promos/${id}/toggle`,
    PROMO_DELETE: (id: string) => `/api/superadmin/promos/${id}`,

    // Notifications
    NOTIFICATIONS:       '/api/superadmin/notifications',
    NOTIFICATION_DELETE: (id: string) => `/api/superadmin/notifications/${id}`,
  },

  // ── IT Portal ─────────────────────────────────────────────────────────────
  IT: {
    DASHBOARD: '/api/it/dashboard',

    // Customers
    CUSTOMERS:          '/api/it/customers',
    CUSTOMER_BY_ID:     (id: string) => `/api/it/customers/${id}`,
    CUSTOMER_SUSPEND:   (id: string) => `/api/it/customers/${id}/suspend`,
    CUSTOMER_ACTIVATE:  (id: string) => `/api/it/customers/${id}/activate`,
    CUSTOMER_DELETE:    (id: string) => `/api/it/customers/${id}`,
    CUSTOMER_RESTORE:   (id: string) => `/api/it/customers/${id}/restore`,

    // Vendors
    VENDORS:         '/api/it/vendors',
    VENDOR_BY_ID:    (id: string) => `/api/it/vendors/${id}`,
    VENDOR_SUSPEND:  (id: string) => `/api/it/vendors/${id}/suspend`,
    VENDOR_ACTIVATE: (id: string) => `/api/it/vendors/${id}/activate`,
    VENDOR_VERIFY:   (id: string) => `/api/it/vendors/${id}/verify`,
    VENDOR_DELETE:   (id: string) => `/api/it/vendors/${id}`,
    VENDOR_RESTORE:  (id: string) => `/api/it/vendors/${id}/restore`,

    // Riders
    RIDERS:         '/api/it/riders',
    RIDER_BY_ID:    (id: string) => `/api/it/riders/${id}`,
    RIDER_SUSPEND:  (id: string) => `/api/it/riders/${id}/suspend`,
    RIDER_ACTIVATE: (id: string) => `/api/it/riders/${id}/activate`,
    RIDER_DELETE:   (id: string) => `/api/it/riders/${id}`,
    RIDER_RESTORE:  (id: string) => `/api/it/riders/${id}/restore`,

    // Orders
    ORDERS:      '/api/it/orders',
    ORDER_BY_ID: (id: string) => `/api/it/orders/${id}`,

    // Account management
    SUSPENDED_ACCOUNTS: '/api/it/suspended-accounts',
    DELETED_ACCOUNTS:   '/api/it/deleted-accounts',

    // Profile / Settings
    PROFILE:         '/api/it/profile',
    PROFILE_AVATAR:  '/api/it/profile/avatar',
    CHANGE_PASSWORD: '/api/it/change-password',
    VERIFY_OTP:      '/api/it/verify-otp',
    RESEND_OTP:      '/api/it/resend-otp',

    // Promo Codes (Read + Emergency Toggle)
    PROMOS:       '/api/it/promos',
    PROMO_TOGGLE: (id: string) => `/api/it/promos/${id}/toggle`,

    // Notifications
    NOTIFICATIONS:       '/api/it/notifications',
    NOTIFICATION_DELETE: (id: string) => `/api/it/notifications/${id}`,
  },

  // ── Staff Management ──────────────────────────────────────────────────────
  STAFF: {
    DEPARTMENT_HEADS:     '/api/staff/department-heads',
    ALL_STAFF:            '/api/staff',
    STAFF_BY_ID:          (id: string) => `/api/staff/${id}`,
    STAFF_SUSPEND:        (id: string) => `/api/staff/${id}/suspend`,
    STAFF_DEACTIVATE:     (id: string) => `/api/staff/${id}/deactivate`,
    STAFF_ACTIVATE:       (id: string) => `/api/staff/${id}/activate`,
    STAFF_RESET_PASSWORD: (id: string) => `/api/staff/${id}/reset-password`,
    STAFF_DELETE:         (id: string) => `/api/staff/${id}`,
    STAFF_RESTORE:        (id: string) => `/api/staff/${id}/restore`,
    AUDIT_LOGS:           '/api/staff/audit-logs',
  },

  // ── Operations Portal ─────────────────────────────────────────────────────
  OPERATIONS: {
    DASHBOARD: '/api/operations/dashboard',

    // Orders
    ORDERS:                 '/api/operations/orders',
    ORDER_BY_ID:            (id: string) => `/api/operations/orders/${id}`,
    ORDER_AVAILABLE_RIDERS: (id: string) => `/api/operations/orders/${id}/available-riders`,
    ORDER_ASSIGN_RIDER:     (id: string) => `/api/operations/orders/${id}/assign-rider`,
    ORDER_STATUS:           (id: string) => `/api/operations/orders/${id}/status`,
    ORDER_REMIND_VENDOR:    (id: string) => `/api/operations/orders/${id}/remind-vendor`,
    ORDER_REMIND_RIDER:     (id: string) => `/api/operations/orders/${id}/remind-rider`,

    // Transactions (temporary module until migration to Admin Portal)
    TRANSACTIONS:           '/api/operations/transactions',
    TRANSACTIONS_STATS:     '/api/operations/transactions/stats',
    TRANSACTION_BY_ID:      (id: string) => `/api/operations/transactions/${id}`,
    TRANSACTIONS_EXPORT:    '/api/operations/transactions/export',

    // Customers
    CUSTOMERS:         '/api/operations/customers',
    CUSTOMERS_TOP:     '/api/operations/customers/top',
    CUSTOMER_BY_ID:    (id: string) => `/api/operations/customers/${id}`,
    CUSTOMER_SUSPEND:  (id: string) => `/api/operations/customers/${id}/suspend`,
    CUSTOMER_ACTIVATE: (id: string) => `/api/operations/customers/${id}/activate`,
    CUSTOMER_DELETE:   (id: string) => `/api/operations/customers/${id}`,

    // Vendors
    VENDORS:         '/api/operations/vendors',
    VENDOR_BY_ID:    (id: string) => `/api/operations/vendors/${id}`,
    VENDOR_VERIFY:   (id: string) => `/api/operations/vendors/${id}/verify`,
    VENDOR_SUSPEND:  (id: string) => `/api/operations/vendors/${id}/suspend`,
    VENDOR_ACTIVATE: (id: string) => `/api/operations/vendors/${id}/activate`,
    VENDOR_DELETE:   (id: string) => `/api/operations/vendors/${id}`,

    // Riders
    RIDERS:         '/api/operations/riders',
    RIDER_BY_ID:    (id: string) => `/api/operations/riders/${id}`,
    RIDER_SUSPEND:  (id: string) => `/api/operations/riders/${id}/suspend`,
    RIDER_ACTIVATE: (id: string) => `/api/operations/riders/${id}/activate`,
    RIDER_DELETE:   (id: string) => `/api/operations/riders/${id}`,

    // Ratings (raw CRUD)
    RATINGS:      '/api/operations/ratings',
    RATING_BY_ID: (id: string) => `/api/operations/ratings/${id}`,

    // Reviews (aggregated / frontend-facing)
    REVIEWS_STATS:        '/api/operations/reviews/stats',
    REVIEWS_VENDORS:      '/api/operations/reviews/vendors',
    REVIEWS_VENDOR_BY_ID: (id: string) => `/api/operations/reviews/vendors/${id}`,
    REVIEWS_RIDERS:       '/api/operations/reviews/riders',
    REVIEWS_RIDER_BY_ID:  (id: string) => `/api/operations/reviews/riders/${id}`,
    REVIEWS_WARN:         (type: string, id: string) => `/api/operations/reviews/${type}/${id}/warn`,
    REVIEWS_SUSPEND:      (type: string, id: string) => `/api/operations/reviews/${type}/${id}/suspend`,
    REVIEWS_COMMEND:      (type: string, id: string) => `/api/operations/reviews/${type}/${id}/commend`,

    // Profile / Settings
    PROFILE:         '/api/operations/profile',
    PROFILE_AVATAR:  '/api/operations/profile/avatar',
    CHANGE_PASSWORD: '/api/operations/change-password',
    VERIFY_OTP:      '/api/operations/verify-otp',
    RESEND_OTP:      '/api/operations/resend-otp',

    // Promo Codes
    PROMOS:       '/api/operations/promos',
    PROMO_TOGGLE: (id: string) => `/api/operations/promos/${id}/toggle`,
    PROMO_DELETE: (id: string) => `/api/operations/promos/${id}`,

    // Notifications
    NOTIFICATIONS:       '/api/operations/notifications',
    NOTIFICATION_DELETE: (id: string) => `/api/operations/notifications/${id}`,
  },

  // ── Account Setup (IT + Operations) ──────────────────────────────────────────
  ACCOUNTS: {
    CUSTOMERS:        '/api/accounts/customers',
    CUSTOMER_UPDATE:  (id: string) => `/api/accounts/customers/${id}`,

    VENDORS:          '/api/accounts/vendors',
    VENDOR_BY_ID:     (id: string) => `/api/accounts/vendors/${id}`,
    VENDOR_UPDATE:    (id: string) => `/api/accounts/vendors/${id}`,

    FOOD_ITEMS:       (vendorId: string) => `/api/accounts/vendors/${vendorId}/food-items`,
    FOOD_ITEM:        (vendorId: string, itemId: string) => `/api/accounts/vendors/${vendorId}/food-items/${itemId}`,
    FOOD_ITEM_TOGGLE: (vendorId: string, itemId: string) => `/api/accounts/vendors/${vendorId}/food-items/${itemId}/toggle`,

    COMBOS:           (vendorId: string) => `/api/accounts/vendors/${vendorId}/combos`,
    COMBO:            (vendorId: string, comboId: string) => `/api/accounts/vendors/${vendorId}/combos/${comboId}`,
    COMBO_TOGGLE:     (vendorId: string, comboId: string) => `/api/accounts/vendors/${vendorId}/combos/${comboId}/toggle`,

    RIDERS:           '/api/accounts/riders',
    RIDER_BY_ID:      (id: string) => `/api/accounts/riders/${id}`,
    RIDER_UPDATE:     (id: string) => `/api/accounts/riders/${id}`,
  },

  // ── Finance Portal ────────────────────────────────────────────────────────
  FINANCE: {
    // Dashboard
    DASHBOARD_STATS:             '/api/finance/dashboard/stats',
    DASHBOARD_WITHDRAWALS:       '/api/finance/dashboard/withdrawals',
    DASHBOARD_WITHDRAWAL_DELETE: (id: string) => `/api/finance/dashboard/withdrawals/${id}`,

    // Transactions
    TRANSACTIONS:        '/api/finance/transactions',
    TRANSACTION_BY_ID:   (id: string) => `/api/finance/transactions/${id}`,
    TRANSACTIONS_EXPORT: '/api/finance/transactions/export',

    // Withdrawals
    WITHDRAWALS:           '/api/finance/withdrawals',
    WITHDRAWAL_BY_ID:      (id: string) => `/api/finance/withdrawals/${id}`,
    WITHDRAWALS_EXPORT:    '/api/finance/withdrawals/export',
    WITHDRAWAL_APPROVE:    (id: string) => `/api/finance/withdrawals/${id}/approve`,
    WITHDRAWAL_REJECT:     (id: string) => `/api/finance/withdrawals/${id}/reject`,

    // Revenue
    REVENUE:             '/api/finance/revenue',
    REVENUE_TOP_VENDORS: '/api/finance/revenue/top-vendors',
    REVENUE_TOP_RIDERS:  '/api/finance/revenue/top-riders',

    // Profile / Settings
    PROFILE:         '/api/finance/profile',
    PROFILE_AVATAR:  '/api/finance/profile/avatar',
    CHANGE_PASSWORD: '/api/finance/change-password',
    VERIFY_OTP:      '/api/finance/verify-otp',
    RESEND_OTP:      '/api/finance/resend-otp',
  },
};
