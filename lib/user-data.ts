export type UserType = 'riders' | 'vendors' | 'customers' | 'staff';

export interface Rider {
  id: number;
  name: string;
  deliveryType: string;
  address: string;
  statusOfAccount: string;
  totalDeliveries: number;
  avatar?: string;
}

export interface Vendor {
  id: number;
  name: string;
  deliveryType: string;
  address: string;
  statusOfAccount: string;
  totalOrders: number;
  avatar?: string;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  address: string;
  statusOfAccount: string;
  totalOrders: number;
  avatar?: string;
}

export interface Staff {
  id: number;
  name: string;
  email: string;
  department: string;
  statusOfAccount: string;
  lineManager: string;
}

// Mock data for Riders
export const riderData: Rider[] = Array.from({ length: 35 }, (_, i) => ({
  id: i + 1,
  name: 'Madu South Okechukwu',
  deliveryType: i % 3 === 0 ? 'Instant' : i % 3 === 1 ? 'Hybrid' : 'Pre-Order',
  address: '25, Ikorodu Road, Yaba, Lagos.',
  statusOfAccount: 'Active',
  totalDeliveries: 120,
  avatar: `https://i.pravatar.cc/150?img=${i}`,
}));

// Mock data for Vendors
export const vendorData: Vendor[] = Array.from({ length: 35 }, (_, i) => ({
  id: i + 1,
  name: 'Madu South Okechukwu',
  deliveryType: i % 3 === 0 ? 'Instant' : i % 3 === 1 ? 'Hybrid' : 'Pre-Order',
  address: '25, Ikorodu Road, Yaba, Lagos.',
  statusOfAccount: 'Active',
  totalOrders: 120,
  avatar: `https://i.pravatar.cc/150?img=${i + 100}`,
}));

// Mock data for Customers
export const customerData: Customer[] = Array.from({ length: 35 }, (_, i) => ({
  id: i + 1,
  name: 'Madu South Okechukwu',
  email: 'arizona25@gmail.com',
  address: '25, Ikorodu Road, Yaba, Lagos.',
  statusOfAccount: 'Active',
  totalOrders: 120,
  avatar: `https://i.pravatar.cc/150?img=${i + 200}`,
}));

// Mock data for Staff
export const staffData: Staff[] = Array.from({ length: 35 }, (_, i) => ({
  id: i + 1,
  name: 'Madu South Okechukwu',
  email: 'arizona25@gmail.com',
  department: i % 2 === 0 ? 'IT' : 'Customer Service',
  statusOfAccount: 'Active',
  lineManager: 'Madu South',
}));
