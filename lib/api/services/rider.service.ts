import { apiClient } from '@/lib/client';
import { ENDPOINTS } from '@/lib/config';

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

export const riderService = {

  async getRiders(params: RiderFilters = {}): Promise<PaginatedRiders> {
    const res = await apiClient.get<PaginatedRiders>(
      ENDPOINTS.OPERATIONS.RIDERS, { params }
    );
    return res;
  },

  async getTopPerformers(): Promise<TopPerformer[]> {
    const res = await apiClient.get<TopPerformer[]>(
      `${ENDPOINTS.OPERATIONS.RIDERS}/top-performers`
    );
    return res;
  },

  async getRiderById(id: string): Promise<Rider> {
    const res = await apiClient.get<Rider>(
      ENDPOINTS.OPERATIONS.RIDER_BY_ID(id)
    );
    return res;
  },

  async getRiderDocument(id: string): Promise<{ documentUrl: string; documentType: string }> {
    const res = await apiClient.get<{ documentUrl: string; documentType: string }>(
      `${ENDPOINTS.OPERATIONS.RIDER_BY_ID(id)}/document`
    );
    return res;
  },

  async suspendRider(id: string): Promise<{ message: string }> {
    const res = await apiClient.post<{ message: string }>(
      ENDPOINTS.OPERATIONS.RIDER_SUSPEND(id)
    );
    return res;
  },

  async activateRider(id: string): Promise<{ message: string }> {
    const res = await apiClient.post<{ message: string }>(
      ENDPOINTS.OPERATIONS.RIDER_ACTIVATE(id)
    );
    return res;
  },

  async deleteRider(id: string): Promise<{ message: string }> {
    const res = await apiClient.delete<{ message: string }>(
      ENDPOINTS.OPERATIONS.RIDER_DELETE(id)
    );
    return res;
  },
};