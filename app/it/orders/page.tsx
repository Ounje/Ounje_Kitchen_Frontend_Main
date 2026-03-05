"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Pagination from "@/components/Pagination";

export default function ITOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 7,
    total: 0,
    pages: 0,
  });

  const [searchFilters, setSearchFilters] = useState({
    orderNumber: "",
    vendor: "",
    rider: "",
    zone: "",
    status: "",
  });

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    try {
      // API call will go here
      // const result = await itService.getOrders({ page, limit: pagination.limit, ...searchFilters });
      // setOrders(result.orders);
      // setPagination(result.pagination);
      
      // Mock data for now
      setOrders([]);
      setPagination({ page, limit: 7, total: 0, pages: 0 });
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSearch = () => {
    fetchOrders(1);
  };

  const handleReset = () => {
    setSearchFilters({
      orderNumber: "",
      vendor: "",
      rider: "",
      zone: "",
      status: "",
    });
    fetchOrders(1);
  };

  const handleViewOrder = (id: string) => {
    router.push(`/it/orders/${id}`);
  };

  const handleDeleteOrder = async (id: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;

    try {
      // await itService.deleteOrder(id);
      toast.success("Order deleted successfully");
      fetchOrders(pagination.page);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete order");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-sm text-gray-500 mt-1">Read-only order management</p>
      </div>

      {/* Search Form */}
      <Card className="border shadow-sm">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label htmlFor="orderNumber">Order Number</Label>
              <Input
                id="orderNumber"
                value={searchFilters.orderNumber}
                onChange={(e) => setSearchFilters({ ...searchFilters, orderNumber: e.target.value })}
                placeholder="Search by order number"
              />
            </div>
            <div>
              <Label htmlFor="vendor">Vendor</Label>
              <Input
                id="vendor"
                value={searchFilters.vendor}
                onChange={(e) => setSearchFilters({ ...searchFilters, vendor: e.target.value })}
                placeholder="Search by vendor"
              />
            </div>
            <div>
              <Label htmlFor="rider">Rider</Label>
              <Input
                id="rider"
                value={searchFilters.rider}
                onChange={(e) => setSearchFilters({ ...searchFilters, rider: e.target.value })}
                placeholder="Search by rider"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="zone">Zone</Label>
              <Input
                id="zone"
                value={searchFilters.zone}
                onChange={(e) => setSearchFilters({ ...searchFilters, zone: e.target.value })}
                placeholder="Search by zone"
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Input
                id="status"
                value={searchFilters.status}
                onChange={(e) => setSearchFilters({ ...searchFilters, status: e.target.value })}
                placeholder="Filter by status"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleSearch}
              style={{ backgroundColor: '#1a3f1c' }}
              className="text-white hover:opacity-90"
            >
              Search
            </Button>
            <Button 
              onClick={handleReset}
              variant="outline"
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border shadow-sm" style={{ backgroundColor: '#e8f7e8' }}>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: '#98ef9b' }}>
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#1a3f1c]">S/N</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#1a3f1c]">Order Number</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#1a3f1c]">Customer</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#1a3f1c]">Vendor</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#1a3f1c]">Rider</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#1a3f1c]">Zone</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#1a3f1c]">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#1a3f1c]">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center">
                      <div className="w-8 h-8 border-4 border-[#1a3f1c] border-t-transparent rounded-full animate-spin mx-auto" />
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.map((order: any, index) => (
                    <tr key={order._id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{(pagination.page - 1) * pagination.limit + index + 1}</td>
                      <td className="px-4 py-3 text-sm font-medium">{order.orderNumber}</td>
                      <td className="px-4 py-3 text-sm">{order.customerName}</td>
                      <td className="px-4 py-3 text-sm">{order.vendorName}</td>
                      <td className="px-4 py-3 text-sm">{order.riderName || '-'}</td>
                      <td className="px-4 py-3 text-sm">{order.zone || '-'}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewOrder(order._id)}
                            className="p-2 rounded-full"
                            style={{ backgroundColor: '#1a3f1c' }}
                            title="View"
                          >
                            <Eye className="h-4 w-4 text-white" />
                          </button>
                          <button
                            onClick={() => handleDeleteOrder(order._id)}
                            className="p-2 bg-red-500 rounded-full"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4 text-white" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Reusable Pagination Component */}
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            pageSize={pagination.limit}
            onPageChange={(page) => fetchOrders(page)}
            onPageSizeChange={(size) => {
              setPagination({ ...pagination, limit: size });
              fetchOrders(1);
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}