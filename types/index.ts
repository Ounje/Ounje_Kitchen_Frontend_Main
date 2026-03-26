// ==================== USER TYPE ====================
export interface User {
  _id: string;                       // MongoDB _id (backend uses this)
  id?: string;                       // Alias for _id (optional for frontend convenience)
  firstName: string;
  lastName: string;
  fullName?: string;                 // Virtual from backend
  
  email: string;
  phoneNumber?: string;              // Backend uses phoneNumber, not phone
  
  department: string;                // "it", "operations", "finance", "investors", "management"
  role?: string;                     // Optional role field
  
  isSuperAdmin: boolean;             // Critical for admin access
  isHead: boolean;                   // Department head flag
  
  lineManager?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    department: string;
  } | null;
  
  isActive: boolean;
  mustChangePassword?: boolean;
  
  dashboardUrl?: string;
  
  createdAt: string;
  updatedAt: string;

  avatar?: string;
}

// ==================== CUSTOMER TYPE ====================
export interface Customer {
  _id: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  name: string;                      // Full name
  email: string;
  phoneNumber: string;
  address: string;
  isActive: boolean;
  totalOrders: number;
  accountStatus?: 'verified' | 'unverified' | 'suspended';
  zone?: string;
  createdAt: string;
  updatedAt?: string;
}

// ==================== VENDOR TYPE ====================
export interface Vendor {
  _id: string;
  id?: string;
  ownerName: string;                 // Vendor owner name
  businessName: string;              // Business/restaurant name
  email: string;
  phoneNumber: string;
  address: string;
  deliveryType?: string;             // Pickup/delivery options
  isActive: boolean;
  isVerified: boolean;
  totalOrders: number;
  rating: number;
  zone?: string;
  createdAt: string;
  updatedAt?: string;
}

// ==================== RIDER TYPE ====================
export interface Rider {
  _id: string;
  id?: string;
  firstName: string;
  lastName: string;
  name?: string;                     // Full name
  email: string;
  phoneNumber: string;
  isActive: boolean;
  isVerified: boolean;
  zone: string;
  vehicleType?: 'bike' | 'car' | 'motorcycle';
  totalDeliveries: number;
  rating: number;
  createdAt: string;
  updatedAt?: string;
}

// ==================== STAFF TYPE ====================
export interface Staff {
  _id: string;
  id?: string;
  firstName: string;
  lastName: string;
  name?: string;
  email: string;
  phoneNumber?: string;
  department: string;
  role: string;
  isActive: boolean;
  isHead: boolean;
  isSuperAdmin?: boolean;
  lineManager?: string | {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
  updatedAt?: string;
  avatar?: string; // Base64 data URL from Settings
}

// ==================== DASHBOARD TYPES ====================
// These match the exact shape returned by GET /api/superadmin/dashboard

export interface DashboardUsers {
  total: number;
  customers: number;
  vendors: number;
  riders: number;
}

export interface DashboardOrders {
  total: number;
  active: number;
  delivered: number;
}

export interface DashboardRatings {
  total: number;
}

export interface DashboardQueries {
  open: number;
}

export interface DashboardRevenue {
  gross: number;
  expenses: number;
  net: number;
}

export interface DashboardData {
  users:   DashboardUsers;
  orders:  DashboardOrders;
  ratings: DashboardRatings;
  queries: DashboardQueries;
  revenue: DashboardRevenue;
}

// ==================== ORDER TYPES ====================
export interface Order {
  _id: string;
  id?: string;
  orderNumber: string;               // Backend uses orderNumber, not orderId
  customerId: string | Customer;
  customerName?: string;
  vendorId: string | Vendor;
  vendorName?: string;
  riderId?: string | Rider;
  riderName?: string;
  status:
    | 'pending'
    | 'confirmed'
    | 'preparing'
    | 'ready'
    | 'picked_up'
    | 'in_transit'
    | 'delivered'
    | 'cancelled'
    | 'rejected';
  items: OrderItem[];
  totalAmount: number; // Sum of items
  
  // Persisted Financials (Phase 1 Fix)
  subtotal?: number;
  serviceFee?: number;
  discount?: number;
  promoCodeApplied?: string | null;
  grandTotal?: number;

  deliveryAddress: string;
  zone?: string;
  createdAt: string;
  updatedAt?: string;
  deliveredAt?: string;
}

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  total?: number;
}

export interface OrderStats {
  total: number;
  active: number;
  delivered: number;
  rejected: number;
  pending: number;
  inProgress?: number;
  completed?: number;
  cancelled: number;
  totalRevenue: number;
  averageOrderValue: number;
}

// ==================== REVENUE TYPES ====================
export interface RevenueData {
  totalRevenue: number;
  grossRevenue?: number;
  netRevenue?: number;
  totalExpenses?: number;
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number;
  trend: 'up' | 'down' | 'stable';
  percentageChange: number;
  period?: string;
  topVendor?: {
    _id: string;
    id?: string;
    name: string;
    revenue: number;
  };
  topRider?: {
    _id: string;
    id?: string;
    name: string;
    revenue: number;
  };
}

// ==================== NOTIFICATION TYPES ====================
export interface Notification {
  _id: string;
  id?: string;
  title: string;
  message: string;
  type: 'order' | 'user' | 'system' | 'payment' | 'rating' | 'query';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  read: boolean;
  archived?: boolean;
  relatedId?: string;
  relatedModel?: string;
  createdAt: string;
  updatedAt?: string;
}

// ==================== QUERY TYPES ====================
export interface Query {
  _id: string;
  id?: string;
  customerId: string | Customer;
  customerName?: string;
  subject: string;
  description: string;
  category?: string;
  status: 'open' | 'assigned' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string | Staff;
  assignedToName?: string;
  createdAt: string;
  updatedAt?: string;
  resolvedAt?: string;
}

// ==================== RATING TYPES ====================
export interface Rating {
  _id: string;
  id?: string;
  customerId: string | Customer;
  customerName?: string;
  vendorId?: string | Vendor;
  vendorName?: string;
  riderId?: string | Rider;
  riderName?: string;
  orderId?: string | Order;
  stars: 1 | 2 | 3 | 4 | 5;
  comment?: string;
  ratingType: 'vendor' | 'rider' | 'order';
  createdAt: string;
  updatedAt?: string;
}

// ==================== PERMISSION TYPES ====================
export interface Permission {
  _id: string;
  id?: string;
  userId: string | User;
  userName?: string;
  requestType: string;
  reason: string;
  status: 'pending' | 'approved' | 'declined' | 'cancelled';
  requestedAt: string;
  reviewedAt?: string;
  reviewedBy?: string | User;
  reviewerName?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ==================== API RESPONSE TYPES ====================
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasMore?: boolean;
  };
  message?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  zone?: string;
  isActive?: boolean;
  isVerified?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ==================== AUTH TYPES ====================
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;          // Frontend field
}

// ==================== UTILITY TYPES ====================
export type UserRole = 'superadmin' | 'head' | 'staff' | 'user';
export type Department = 'it' | 'operations' | 'finance' | 'investors' | 'management';
export type OrderStatus = Order['status'];
export type QueryStatus = Query['status'];
export type NotificationType = Notification['type'];