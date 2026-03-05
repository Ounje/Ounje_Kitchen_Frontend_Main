"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRouteGuard } from "@/hooks/useRouteGuard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import { mockOrders } from "@/lib/mock-data/operations";

export default function OrdersPage() {
  const { shouldRender, loading } = useRouteGuard({ returnRenderFlag: true });
  const router = useRouter();
  const [period, setPeriod] = useState("daily");

  const [filters, setFilters] = useState({
    name: "",
    vendor: "",
    zone: "",
    orderId: "",
    status: "ongoing",
    dateFrom: undefined as Date | undefined,
    dateTo: undefined as Date | undefined,
  });

  const [filteredOrders, setFilteredOrders] = useState(mockOrders);

  const handleSearch = () => {
    let filtered = mockOrders;

    if (filters.name) {
      filtered = filtered.filter((order) =>
        order.customer.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    if (filters.vendor) {
      filtered = filtered.filter((order) =>
        order.vendor.name.toLowerCase().includes(filters.vendor.toLowerCase())
      );
    }

    if (filters.zone) {
      filtered = filtered.filter((order) =>
        order.zone.toLowerCase().includes(filters.zone.toLowerCase())
      );
    }

    if (filters.orderId) {
      filtered = filtered.filter((order) =>
        order.orderId.toLowerCase().includes(filters.orderId.toLowerCase())
      );
    }

    if (filters.status !== "all") {
      filtered = filtered.filter((order) => order.status === filters.status);
    }

    setFilteredOrders(filtered);
  };

  const handleReset = () => {
    setFilters({
      name: "",
      vendor: "",
      zone: "",
      orderId: "",
      status: "ongoing",
      dateFrom: undefined,
      dateTo: undefined,
    });
    setFilteredOrders(mockOrders);
  };

  // ✅ Navigate to order details page instead of modal
  const handleOrderClick = (orderId: string) => {
    router.push(`/operations/orders/${orderId.toLowerCase().replace(/\s+/g, '-')}`);
  };

  const groupedOrders = filteredOrders.reduce((groups: any, order) => {
    const date = order.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(order);
    return groups;
  }, {});

  if (loading || !shouldRender) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 sm:h-12 sm:w-12 animate-spin text-[#1a3f1c]" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
          Orders
        </h1>

        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-full sm:w-32 h-10 sm:h-11 bg-[#98ef9b] border-none text-[#1a3f1c] font-medium">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Filters */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Name */}
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                Name
              </Label>
              <Input
                id="name"
                value={filters.name}
                onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                className="mt-1"
                placeholder="Customer name"
              />
            </div>

            {/* Vendor */}
            <div>
              <Label htmlFor="vendor" className="text-sm font-medium text-gray-700">
                Vendor
              </Label>
              <Input
                id="vendor"
                value={filters.vendor}
                onChange={(e) => setFilters({ ...filters, vendor: e.target.value })}
                className="mt-1"
                placeholder="Vendor name"
              />
            </div>

            {/* Zone */}
            <div>
              <Label htmlFor="zone" className="text-sm font-medium text-gray-700">
                Zone
              </Label>
              <Input
                id="zone"
                value={filters.zone}
                onChange={(e) => setFilters({ ...filters, zone: e.target.value })}
                className="mt-1"
                placeholder="Zone"
              />
            </div>

            {/* Order ID */}
            <div>
              <Label htmlFor="orderId" className="text-sm font-medium text-gray-700">
                Order ID
              </Label>
              <Input
                id="orderId"
                value={filters.orderId}
                onChange={(e) => setFilters({ ...filters, orderId: e.target.value })}
                className="mt-1"
                placeholder="Order ID"
              />
            </div>

            {/* Order Status */}
            <div>
              <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                Order Status
              </Label>
              <Select
                value={filters.status}
                onValueChange={(value) => setFilters({ ...filters, status: value })}
              >
                <SelectTrigger id="status" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date From */}
            <div>
              <Label className="text-sm font-medium text-gray-700">From</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full mt-1 justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateFrom ? (
                      format(filters.dateFrom, "dd/MM/yyyy")
                    ) : (
                      <span>DD/MM/YYYY</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.dateFrom}
                    onSelect={(date) => setFilters({ ...filters, dateFrom: date })}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Date To */}
            <div>
              <Label className="text-sm font-medium text-gray-700">To</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full mt-1 justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateTo ? (
                      format(filters.dateTo, "dd/MM/yyyy")
                    ) : (
                      <span>DD/MM/YYYY</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.dateTo}
                    onSelect={(date) => setFilters({ ...filters, dateTo: date })}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <Button
              onClick={handleSearch}
              className="bg-[#1a3f1c] hover:bg-[#164016] text-white h-10 px-8"
            >
              Search
            </Button>
            <Button
              onClick={handleReset}
              className="bg-[#1a3f1c] hover:bg-[#164016] text-white h-10 px-8"
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reported Issue Badge */}
      {filteredOrders.some((o) => o.hasIssue) && (
        <div className="inline-block bg-[#ffca3a] text-[#1a3f1c] px-4 py-2 rounded-md text-sm font-medium">
          Reported with Issue
        </div>
      )}

      {/* Orders List Grouped by Date */}
      <div className="space-y-6">
        {Object.entries(groupedOrders).map(([date, orders]: [string, any]) => (
          <div key={date} className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">{date}</h2>

            <div className="space-y-3">
              {orders.map((order: any) => (
                <Card
                  key={order.id}
                  className="border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer relative"
                  style={{ backgroundColor: "#98ef9b" }}
                  onClick={() => handleOrderClick(order.orderId)}
                >
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex gap-3 sm:gap-4">
                      {/* Food Image */}
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden">
                        <Image
                          src={order.imageUrl}
                          alt="Food"
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Order Info */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-0.5">
                            <p className="text-sm sm:text-base font-semibold text-[#1a3f1c]">
                              Customer: <span className="font-normal">{order.customer.name}</span>
                            </p>
                            <p className="text-sm sm:text-base font-semibold text-[#1a3f1c]">
                              Vendor: <span className="font-normal">{order.vendor.name}</span>
                            </p>
                            <p className="text-xs sm:text-sm text-[#1a3f1c]/80">
                              Order ID: {order.orderId}
                            </p>
                            <p className="text-sm sm:text-base font-semibold text-[#1a3f1c]">
                              Rider: <span className="font-normal">{order.rider?.name || "Not Assigned"}</span>
                            </p>
                          </div>

                          {/* Issue Indicator */}
                          {order.hasIssue && (
                            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-[#ffca3a] rounded-full flex-shrink-0" />
                          )}
                        </div>
                      </div>

                      {/* Details Button */}
                      <Button
                        className="bg-[#1a3f1c] hover:bg-[#164016] text-white h-9 sm:h-10 px-4 sm:px-6 flex-shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOrderClick(order.orderId);
                        }}
                      >
                        Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}