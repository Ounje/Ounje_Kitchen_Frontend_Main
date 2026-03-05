import { apiClient } from '@/lib/client';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
  accountStatus: 'active' | 'suspended' | 'unverified';
  orders: number;
  successfulOrders: number;
  cancelledOrders: number;
  pendingOrders: number;
  totalOrders: number;
}

export interface Vendor {
  id: string;
  name: string;
  photo: string;
  rating: number;
  ratingCount: number;
  address: string;
  ordersCount: number;
}

export interface CustomerFilters {
  name?: string;
  email?: string;
  accountStatus?: 'active' | 'suspended' | 'unverified' | '';
  page?: number;
  limit?: number;
}

export interface PaginatedCustomers {
  customers: Customer[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class CustomerService {
  /**
   * Get paginated list of customers with optional filters
   */
  async getCustomers(params: CustomerFilters = {}): Promise<PaginatedCustomers> {
    try {
      const response = await apiClient.get('/customers', { params });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch customers');
    }
  }

  /**
   * Get single customer by ID
   */
  async getCustomerById(id: string): Promise<Customer> {
    try {
      const response = await apiClient.get(`/customers/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch customer details');
    }
  }

  /**
   * Suspend a customer account
   */
  async suspendCustomer(id: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.patch(`/customers/${id}/suspend`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to suspend customer');
    }
  }

  /**
   * Activate a customer account
   */
  async activateCustomer(id: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.patch(`/customers/${id}/activate`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to activate customer');
    }
  }

  /**
   * Delete a customer account
   */
  async deleteCustomer(id: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.delete(`/customers/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete customer');
    }
  }

  /**
   * Get customer's most used vendor
   */
  async getMostUsedVendor(customerId: string): Promise<Vendor> {
    try {
      const response = await apiClient.get(`/customers/${customerId}/most-used-vendor`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch most used vendor');
    }
  }
}

export const customerService = new CustomerService();