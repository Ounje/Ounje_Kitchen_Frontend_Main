export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  TIMEOUT: 30000,
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

export const ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/api/auth/login',
    ME: '/api/auth/me',
    CHANGE_PASSWORD: '/api/auth/change-password',
    LOGOUT: '/api/auth/logout',
  },

  // Super Admin Portal
  SUPERADMIN: {
    // Dashboard & Analytics
    DASHBOARD: '/api/superadmin/dashboard',
    REVENUE: '/api/superadmin/revenue',
    REVENUE_TRENDS: '/api/superadmin/revenue/trends',

    // Customers
    CUSTOMERS: '/api/superadmin/customers',
    CUSTOMER_BY_ID: (id: string) => `/api/superadmin/customers/${id}`,
    CUSTOMER_SUSPEND: (id: string) => `/api/superadmin/customers/${id}/suspend`,
    CUSTOMER_ACTIVATE: (id: string) => `/api/superadmin/customers/${id}/activate`,

    // Vendors
    VENDORS: '/api/superadmin/vendors',
    VENDOR_BY_ID: (id: string) => `/api/superadmin/vendors/${id}`,
    VENDOR_SUSPEND: (id: string) => `/api/superadmin/vendors/${id}/suspend`,
    VENDOR_ACTIVATE: (id: string) => `/api/superadmin/vendors/${id}/activate`,
    VENDOR_VERIFY: (id: string) => `/api/superadmin/vendors/${id}/verify`,

    // Riders
    RIDERS: '/api/superadmin/riders',
    RIDER_BY_ID: (id: string) => `/api/superadmin/riders/${id}`,
    RIDER_SUSPEND: (id: string) => `/api/superadmin/riders/${id}/suspend`,
    RIDER_ACTIVATE: (id: string) => `/api/superadmin/riders/${id}/activate`,
    RIDER_VERIFY: (id: string) => `/api/superadmin/riders/${id}/verify`,

    // Staff
    STAFF: '/api/superadmin/staff',

    // Orders
    ORDERS: '/api/superadmin/orders',
    ORDER_BY_ID: (id: string) => `/api/superadmin/orders/${id}`,
    ORDER_OVERRIDE: (id: string) => `/api/superadmin/orders/${id}/override`,

    // Ratings
    RATINGS: '/api/superadmin/ratings',

    // Queries/Complaints
    QUERIES: '/api/superadmin/queries',
    QUERY_BY_ID: (id: string) => `/api/superadmin/queries/${id}`,
    QUERY_ASSIGN: (id: string) => `/api/superadmin/queries/${id}/assign`,
    QUERY_RESOLVE: (id: string) => `/api/superadmin/queries/${id}/resolve`,

    // ✅ NEW: Profile endpoints
    PROFILE: '/api/superadmin/profile',
    PROFILE_AVATAR: '/api/superadmin/profile/avatar',
    CHANGE_PASSWORD: '/api/superadmin/change-password',
    VERIFY_OTP: '/api/superadmin/verify-otp',
    RESEND_OTP: '/api/superadmin/resend-otp',
  },

  // IT Portal
  IT: {
    DASHBOARD: '/api/it/dashboard',
    CUSTOMERS: '/api/it/customers',
    VENDORS: '/api/it/vendors',
    RIDERS: '/api/it/riders',
    ORDERS: '/api/it/orders',
    PROFILE: '/api/it/profile',
  },

  // Staff Management
  STAFF: {
    DEPARTMENT_HEADS: '/api/staff/department-heads',
    ALL_STAFF: '/api/staff',
    STAFF_BY_ID: (id: string) => `/api/staff/${id}`,
    STAFF_DEACTIVATE: (id: string) => `/api/staff/${id}/deactivate`,
    STAFF_ACTIVATE: (id: string) => `/api/staff/${id}/activate`,
    STAFF_RESET_PASSWORD: (id: string) => `/api/staff/${id}/reset-password`,
    AUDIT_LOGS: '/api/staff/audit-logs',
  },
};