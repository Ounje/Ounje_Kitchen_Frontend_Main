export type Period = 'daily' | 'monthly' | 'yearly';
export type RevenueTab = 'gross' | 'expenses' | 'net';

export interface TopPerformer {
  id: number;
  name: string;
  avatar: string;
  location?: string;
  type?: string;
  revenue: number;
}

export interface RevenueData {
  period: Period;
  duration: string;
  grossRevenue: number;
  totalExpenses: number;
  netRevenue: number;
  totalOrders?: number;
  revenueGenerated?: number;
  expensesPaid?: number;
  topVendor?: TopPerformer;
  topRider?: TopPerformer;
}

// Daily Revenue Data
const dailyRevenueData: RevenueData = {
  period: 'daily',
  duration: '15/10/2025',
  grossRevenue: 150000,
  totalExpenses: 45000,
  netRevenue: 105000,
  expensesPaid: 45000,
};

// Weekly Revenue Data
const weeklyRevenueData: RevenueData = {
  period: 'daily',
  duration: '09/10/2025 - 15/10/2025',
  grossRevenue: 1050000,
  totalExpenses: 310000,
  netRevenue: 740000,
  expensesPaid: 310000,
};

// Monthly Revenue Data
const monthlyRevenueData: RevenueData = {
  period: 'monthly',
  duration: '01/10/2025 - 31/10/2025',
  grossRevenue: 4500000,
  totalExpenses: 1350000,
  netRevenue: 3150000,
  totalOrders: 350,
  revenueGenerated: 980000,
  topVendor: {
    id: 1,
    name: 'Iya Bolu',
    avatar: 'https://i.pravatar.cc/150?img=25',
    location: '23 Adekunle Street',
    revenue: 500000,
  },
  topRider: {
    id: 2,
    name: 'Yusuf Jimoh',
    avatar: 'https://i.pravatar.cc/150?img=35',
    type: 'Bicycle',
    revenue: 70000,
  },
};

// Yearly Revenue Data
const yearlyRevenueData: RevenueData = {
  period: 'yearly',
  duration: '01/01/2025 - 31/12/2025',
  grossRevenue: 54000000,
  totalExpenses: 16200000,
  netRevenue: 37800000,
  totalOrders: 4200,
  revenueGenerated: 11760000,
  topVendor: {
    id: 1,
    name: 'Premium Vendor Co.',
    avatar: 'https://i.pravatar.cc/150?img=40',
    location: '45 Victoria Island, Lagos',
    revenue: 6000000,
  },
  topRider: {
    id: 2,
    name: 'Ahmed Hassan',
    avatar: 'https://i.pravatar.cc/150?img=50',
    type: 'Motorcycle',
    revenue: 840000,
  },
};

export const getRevenueData = (period: Period): RevenueData => {
  switch (period) {
    case 'daily':
      return dailyRevenueData;
    case 'monthly':
      return monthlyRevenueData;
    case 'yearly':
      return yearlyRevenueData;
    default:
      return monthlyRevenueData;
  }
};

export const formatCurrency = (value: number): string => {
  return `₦${value.toLocaleString('en-NG')}`;
};
