'use client';

import { useState, useMemo } from 'react';
import { OrderInfoModal } from '@/components/dashboard/orders/order-info-modal';
import { FlagConfirmModal, FlagSuccessModal } from '@/components/dashboard/orders/flag-modals';
import { getOrdersByPeriod, groupOrdersByPeriod, OrderPeriod, OrderStatus, Order } from '@/lib/orders-data';

const ITEMS_PER_PAGE = 7;

export default function OrdersPage() {
  const [period, setPeriod] = useState<OrderPeriod>('daily');
  const [activeTab, setActiveTab] = useState<OrderStatus>('active');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showFlagConfirm, setShowFlagConfirm] = useState(false);
  const [showFlagSuccess, setShowFlagSuccess] = useState(false);

  const tabs: { id: OrderStatus; label: string }[] = [
    { id: 'active', label: 'Active Orders' },
    { id: 'delivered', label: 'Delivered Orders' },
    { id: 'rejected', label: 'Rejected/Reported Orders' },
  ];

  // Get orders for current tab and period
  const orders = useMemo(() => {
    return getOrdersByPeriod(period, activeTab);
  }, [period, activeTab]);

  // Group orders by period
  const groupedOrders = useMemo(() => {
    return groupOrdersByPeriod(orders, period);
  }, [orders, period]);

  // Flatten grouped orders for pagination
  const flatOrders = Object.values(groupedOrders).flat();
  const totalPages = Math.ceil(flatOrders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedOrders = flatOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleOpenOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const handleFlagClick = () => {
    setShowOrderModal(false);
    setShowFlagConfirm(true);
  };

  const handleConfirmFlag = () => {
    setShowFlagConfirm(false);
    setShowFlagSuccess(true);
  };

  const handleSuccessClose = () => {
    setShowFlagSuccess(false);
    setSelectedOrder(null);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleTabChange = (tab: OrderStatus) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handlePeriodChange = (newPeriod: OrderPeriod) => {
    setPeriod(newPeriod);
    setCurrentPage(1);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Orders</h1>
          <select
            value={period}
            onChange={(e) => handlePeriodChange(e.target.value as OrderPeriod)}
            className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground font-semibold border border-border cursor-pointer outline-none transition-opacity"
          >
            <option value="daily">Daily</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-[#98EF9B] text-secondary-foreground hover:opacity-90'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {Object.entries(groupedOrders).map(([groupKey, groupOrders]) => (
            <div key={groupKey} className="space-y-3">
              {/* Group Header */}
              <h2 className="text-lg font-semibold text-foreground">{groupKey}</h2>

              {/* Orders in Group */}
              {groupOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-secondary rounded-lg p-2 border border-border hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleOpenOrder(order)}
                >
                  <div className="flex gap-4">
                    {/* Order Image */}
                    <div className="shrink-0 w-24 h-24 md:w-28 md:h-28">
                      <img
                        src={order.foodImage}
                        alt={order.orderName}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    {/* Order Info */}
                    <div className="flex items-center justify-between gap-8 w-full">
                        <div className="flex-1 min-w-[200px]">
                            <h3 className="font-semibold text-xl text-black">
                            {order.orderName}
                            </h3>
                            <p className="text-lg text-black">
                            <span className="font-semibold">Total Amount:</span>{" "}
                            ₦{order?.totalAmount?.toLocaleString?.() ?? "0"}
                            </p>
                        </div>

                        {/* Vendor + Order ID */}
                        <div className="flex-1 min-w-[200px]">
                            <p className="text-lg text-black">
                            <span className="font-semibold">Vendor:</span>{" "}
                            {order.vendorName}
                            </p>

                            <p className="text-lg text-black">
                            <span className="font-semibold">Order ID:</span>{" "}
                            {order.orderId}
                            </p>
                        </div>

                        {/* Action Icons */}
                        <div className="flex items-center gap-3 shrink-0">
                            <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleOpenOrder(order);
                            }}
                            className="p-2 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity cursor-pointer"
                            title="View order details"
                            >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path
                                fillRule="evenodd"
                                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                clipRule="evenodd"
                                />
                            </svg>
                            </button>

                            <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedOrder(order);
                                setShowFlagConfirm(true);
                            }}
                            className="p-2 bg-accent text-accent-foreground rounded-full hover:opacity-90 transition-opacity cursor-pointer"
                            title="Flag order"
                            >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M3 2a1 1 0 011 1v2.101a7.002 7.002 0 1119.414.288.75.75 0 11-1.499.034.5.5 0 00-.986.164A5.5 5.5 0 1113.5 5H11a.75.75 0 000-1.5H4a1 1 0 01-1-1V3a1 1 0 01-1-1z" />
                            </svg>
                            </button>
                        </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}

          {flatOrders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No {activeTab} orders found for this period.
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {flatOrders.length > 0 && (
          <div className="bg-card rounded-lg p-6 border border-border">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <span className="text-sm text-muted-foreground">
                Displays {paginatedOrders.length} of {flatOrders.length}
              </span>

              <div className="flex gap-2 items-center flex-wrap">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded border border-border text-foreground disabled:opacity-50 hover:bg-muted transition-colors"
                >
                  First
                </button>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded border border-border text-foreground disabled:opacity-50 hover:bg-muted transition-colors"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 rounded ${
                      currentPage === page
                        ? 'bg-primary text-primary-foreground'
                        : 'border border-border text-foreground hover:bg-muted transition-colors'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded border border-border text-foreground disabled:opacity-50 hover:bg-muted transition-colors"
                >
                  Next
                </button>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded border border-border text-foreground disabled:opacity-50 hover:bg-muted transition-colors"
                >
                  Last
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showOrderModal && selectedOrder && (
        <OrderInfoModal
          order={selectedOrder}
          onClose={() => setShowOrderModal(false)}
          onFlagClick={handleFlagClick}
        />
      )}

      {showFlagConfirm && selectedOrder && (
        <FlagConfirmModal
          onConfirm={handleConfirmFlag}
          onCancel={() => setShowFlagConfirm(false)}
        />
      )}

      {showFlagSuccess && (
        <FlagSuccessModal onClose={handleSuccessClose} />
      )}
    </>
  );
}
