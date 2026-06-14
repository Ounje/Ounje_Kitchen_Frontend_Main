import { apiClient } from "@/lib/client";
import { ENDPOINTS } from "@/lib/config";
import type {
  PaginatedResponse,
  Customer,
  Vendor,
  Rider,
  Staff,
  PaginationParams,
  ApiResponse,
} from "@/types";

class UsersService {
  // ==================== CUSTOMERS ====================

  /**
   * Get all customers with optional filters
   */
  async getCustomers(params?: PaginationParams): Promise<PaginatedResponse<Customer>> {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.status) queryParams.append("status", params.status);
    if (params?.zone) queryParams.append("zone", params.zone);
    if (params?.isActive !== undefined) queryParams.append("isActive", params.isActive.toString());

    const queryString = queryParams.toString();
    const url = queryString
      ? `${ENDPOINTS.SUPERADMIN.CUSTOMERS}?${queryString}`
      : ENDPOINTS.SUPERADMIN.CUSTOMERS;

    return apiClient.get<PaginatedResponse<Customer>>(url);
  }

  /**
   * Get single customer by ID
   */
  async getCustomer(id: string): Promise<Customer> {
    const response = await apiClient.get<ApiResponse<Customer>>(
      ENDPOINTS.SUPERADMIN.CUSTOMER_BY_ID(id)
    );
    return response.data;
  }

  /**
   * Suspend a customer
   */
  async suspendCustomer(id: string): Promise<ApiResponse<Customer>> {
    return apiClient.put<ApiResponse<Customer>>(ENDPOINTS.SUPERADMIN.CUSTOMER_SUSPEND(id));
  }

  /**
   * Activate a customer
   */
  async activateCustomer(id: string): Promise<ApiResponse<Customer>> {
    return apiClient.put<ApiResponse<Customer>>(ENDPOINTS.SUPERADMIN.CUSTOMER_ACTIVATE(id));
  }

  // ==================== VENDORS ====================

  /**
   * Get all vendors with optional filters
   */
  async getVendors(params?: PaginationParams): Promise<PaginatedResponse<Vendor>> {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.status) queryParams.append("status", params.status);
    if (params?.zone) queryParams.append("zone", params.zone);
    if (params?.isActive !== undefined) queryParams.append("isActive", params.isActive.toString());
    if (params?.isVerified !== undefined)
      queryParams.append("isVerified", params.isVerified.toString());

    const queryString = queryParams.toString();
    const url = queryString
      ? `${ENDPOINTS.SUPERADMIN.VENDORS}?${queryString}`
      : ENDPOINTS.SUPERADMIN.VENDORS;

    return apiClient.get<PaginatedResponse<Vendor>>(url);
  }

  /**
   * Get single vendor by ID
   */
  async getVendor(id: string): Promise<Vendor> {
    const response = await apiClient.get<ApiResponse<Vendor>>(
      ENDPOINTS.SUPERADMIN.VENDOR_BY_ID(id)
    );
    return response.data;
  }

  /**
   * Suspend a vendor
   */
  async suspendVendor(id: string): Promise<ApiResponse<Vendor>> {
    return apiClient.put<ApiResponse<Vendor>>(ENDPOINTS.SUPERADMIN.VENDOR_SUSPEND(id));
  }

  /**
   * Activate a vendor
   */
  async activateVendor(id: string): Promise<ApiResponse<Vendor>> {
    return apiClient.put<ApiResponse<Vendor>>(ENDPOINTS.SUPERADMIN.VENDOR_ACTIVATE(id));
  }

  /**
   * Verify a vendor
   */
  async verifyVendor(id: string): Promise<ApiResponse<Vendor>> {
    return apiClient.put<ApiResponse<Vendor>>(ENDPOINTS.SUPERADMIN.VENDOR_VERIFY(id));
  }

  // ==================== RIDERS ====================

  /**
   * Get all riders with optional filters
   */
  async getRiders(params?: PaginationParams): Promise<PaginatedResponse<Rider>> {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.status) queryParams.append("status", params.status);
    if (params?.zone) queryParams.append("zone", params.zone);
    if (params?.isActive !== undefined) queryParams.append("isActive", params.isActive.toString());
    if (params?.isVerified !== undefined)
      queryParams.append("isVerified", params.isVerified.toString());

    const queryString = queryParams.toString();
    const url = queryString
      ? `${ENDPOINTS.SUPERADMIN.RIDERS}?${queryString}`
      : ENDPOINTS.SUPERADMIN.RIDERS;

    return apiClient.get<PaginatedResponse<Rider>>(url);
  }

  /**
   * Get single rider by ID
   */
  async getRider(id: string): Promise<Rider> {
    const response = await apiClient.get<ApiResponse<Rider>>(ENDPOINTS.SUPERADMIN.RIDER_BY_ID(id));
    return response.data;
  }

  /**
   * Suspend a rider
   */
  async suspendRider(id: string): Promise<ApiResponse<Rider>> {
    return apiClient.put<ApiResponse<Rider>>(ENDPOINTS.SUPERADMIN.RIDER_SUSPEND(id));
  }

  /**
   * Activate a rider
   */
  async activateRider(id: string): Promise<ApiResponse<Rider>> {
    return apiClient.put<ApiResponse<Rider>>(ENDPOINTS.SUPERADMIN.RIDER_ACTIVATE(id));
  }

  /**
   * Verify a rider
   */
  async verifyRider(id: string): Promise<ApiResponse<Rider>> {
    return apiClient.put<ApiResponse<Rider>>(ENDPOINTS.SUPERADMIN.RIDER_VERIFY(id));
  }

  // ==================== STAFF ====================

  /**
   * Get all staff members with optional filters
   */
  async getStaff(params?: PaginationParams): Promise<PaginatedResponse<Staff>> {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.isActive !== undefined) queryParams.append("isActive", params.isActive.toString());

    const queryString = queryParams.toString();
    const url = queryString
      ? `${ENDPOINTS.SUPERADMIN.STAFF}?${queryString}`
      : ENDPOINTS.SUPERADMIN.STAFF;

    return apiClient.get<PaginatedResponse<Staff>>(url);
  }
}

export const usersService = new UsersService();
