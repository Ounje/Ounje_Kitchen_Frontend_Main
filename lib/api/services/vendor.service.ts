// lib/api/services/vendor.service.ts
import { apiClient } from '@/lib/client';

export interface Vendor {
  id: string;
  name: string;
  phone: string;
  address: string;
  avatar: string;
  accountStatus: 'active' | 'suspended';
  businessStatus: 'registered' | 'unregistered' | 'pending';
  cacNumber?: string;
  serviceType?: string;
  rating: number;
  completedOrders: number;
  successfulOrders: number;
  cancelledOrders: number;
  pendingOrders: number;
  totalOrders: number;
}

export interface TopVendor {
  id: string;
  name: string;
  phone: string;
  location: string;
  avatar: string;
  completedOrders: number;
  rank: 1 | 2 | 3;
}

export interface Buyer {
  id: string;
  name: string;
  photo: string;
  address: string;
  ordersCount: number;
}

export interface VendorFilters {
  name?: string;
  accountStatus?: 'active' | 'suspended' | '';
  businessStatus?: 'registered' | 'unregistered' | 'pending' | '';
  page?: number;
  limit?: number;
}

export interface PaginatedVendors {
  vendors: Vendor[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class VendorService {
  /**
   * Get paginated list of vendors with optional filters
   */
  async getVendors(params: VendorFilters = {}): Promise<PaginatedVendors> {
    try {
      const response = await apiClient.get('/vendors', { params });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch vendors');
    }
  }

  /**
   * Get top 3 vendors
   */
  async getTopVendors(): Promise<TopVendor[]> {
    try {
      const response = await apiClient.get('/vendors/top');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch top vendors');
    }
  }

  /**
   * Get single vendor by ID
   */
  async getVendorById(id: string): Promise<Vendor> {
    try {
      const response = await apiClient.get(`/vendors/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch vendor details');
    }
  }

  /**
   * Get vendor performance metrics
   */
  async getVendorMetrics(id: string): Promise<{
    successfulOrders: number;
    cancelledOrders: number;
    pendingOrders: number;
    totalOrders: number;
  }> {
    try {
      const response = await apiClient.get(`/vendors/${id}/metrics`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch vendor metrics');
    }
  }

  /**
   * Suspend a vendor account
   */
  async suspendVendor(id: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.patch(`/vendors/${id}/suspend`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to suspend vendor');
    }
  }

  /**
   * Activate a vendor account
   */
  async activateVendor(id: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.patch(`/vendors/${id}/activate`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to activate vendor');
    }
  }

  /**
   * Delete a vendor account
   */
  async deleteVendor(id: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.delete(`/vendors/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete vendor');
    }
  }

  /**
   * Get vendor's most frequent buyer
   */
  async getMostFrequentBuyer(vendorId: string): Promise<Buyer> {
    try {
      const response = await apiClient.get(`/vendors/${vendorId}/most-frequent-buyer`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch most frequent buyer');
    }
  }

  /**
   * Alert vendor (send notification)
   */
  async alertVendor(id: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.post(`/vendors/${id}/alert`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to alert vendor');
    }
  }
}

export const vendorService = new VendorService();