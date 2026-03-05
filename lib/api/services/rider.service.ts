import { apiClient } from '@/lib/client';

export interface Rider {
  id: string;
  name: string;
  phone: string;
  zone: string;
  accountStatus: 'active' | 'suspended';
  riderStatus: 'free' | 'busy' | 'verified';
  modeOfDelivery: 'motorcycle' | 'bicycle' | 'car';
  photo: string;
  successfulDeliveries: number;
  cancelledDeliveries: number;
  processingDeliveries: number;
  totalDeliveries: number;
  mostFrequentZone?: string;
  serviceMode?: string;
  documentUrl?: string;
}

export interface TopPerformer {
  id: string;
  name: string;
  phone: string;
  location: string;
  photo: string;
  completedOrders: number;
  rank: 1 | 2 | 3;
}

export interface RiderFilters {
  name?: string;
  status?: 'active' | 'suspended' | '';
  modeOfDelivery?: 'motorcycle' | 'bicycle' | 'car' | '';
  page?: number;
  limit?: number;
}

export interface PaginatedRiders {
  riders: Rider[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class RiderService {
  /**
   * Get paginated list of riders with optional filters
   */
  async getRiders(params: RiderFilters = {}): Promise<PaginatedRiders> {
    try {
      const response = await apiClient.get('/riders', { params });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch riders');
    }
  }

  /**
   * Get top 3 performers
   */
  async getTopPerformers(): Promise<TopPerformer[]> {
    try {
      const response = await apiClient.get('/riders/top-performers');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch top performers');
    }
  }

  /**
   * Get single rider by ID
   */
  async getRiderById(id: string): Promise<Rider> {
    try {
      const response = await apiClient.get(`/riders/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch rider details');
    }
  }

  /**
   * Get rider document
   */
  async getRiderDocument(id: string): Promise<{ documentUrl: string; documentType: string }> {
    try {
      const response = await apiClient.get(`/riders/${id}/document`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch rider document');
    }
  }

  /**
   * Suspend a rider account
   */
  async suspendRider(id: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.post(`/riders/${id}/suspend`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to suspend rider');
    }
  }

  /**
   * Activate a rider account
   */
  async activateRider(id: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.post(`/riders/${id}/activate`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to activate rider');
    }
  }

  /**
   * Delete a rider account
   */
  async deleteRider(id: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.delete(`/riders/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete rider');
    }
  }
}

export const riderService = new RiderService();