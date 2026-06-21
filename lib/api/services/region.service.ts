import { apiClient } from "@/lib/client";
import { ENDPOINTS } from "@/lib/config";

export interface RegionData {
  name: string;
  description?: string;
  markupRate: number;
  serviceFeeRate: number;
  freeDelivery: boolean;
  deliveryFeeMultiplier: number;
  isActive?: boolean;
}

export const regionService = {
  async getRegions() {
    return await apiClient.get(ENDPOINTS.OPERATIONS.REGIONS);
  },

  async getRegionById(id: string) {
    return await apiClient.get(ENDPOINTS.OPERATIONS.REGION_BY_ID(id));
  },

  async createRegion(data: RegionData) {
    return await apiClient.post(ENDPOINTS.OPERATIONS.REGIONS, data);
  },

  async updateRegion(id: string, data: Partial<RegionData>) {
    return await apiClient.put(ENDPOINTS.OPERATIONS.REGION_BY_ID(id), data);
  },

  async toggleRegion(id: string) {
    return await apiClient.put(ENDPOINTS.OPERATIONS.REGION_TOGGLE(id), {});
  },

  async deleteRegion(id: string) {
    return await apiClient.delete(ENDPOINTS.OPERATIONS.REGION_BY_ID(id));
  },

  async assignVendorToRegion(regionId: string, vendorId: string) {
    return await apiClient.put(ENDPOINTS.OPERATIONS.REGION_ASSIGN_VENDOR(regionId), { vendorId });
  },

  async unassignVendorFromRegion(regionId: string, vendorId: string) {
    return await apiClient.put(ENDPOINTS.OPERATIONS.REGION_ASSIGN_VENDOR(regionId), {
      vendorId,
      unassign: true,
    });
  },
};

export default regionService;
