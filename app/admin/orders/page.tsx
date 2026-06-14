// 'use client';

// import { useState, useMemo } from 'react';
// import { OrderInfoModal } from '@/components/dashboard/orders/order-info-modal';
// import { FlagConfirmModal, FlagSuccessModal } from '@/components/dashboard/orders/flag-modals';
// import { getOrdersByPeriod, groupOrdersByPeriod, OrderPeriod, OrderStatus, Order } from '@/lib/orders-data';

// const ITEMS_PER_PAGE = 7;

// export default function OrdersPage() {
//   const [period, setPeriod] = useState<OrderPeriod>('daily');
//   const [activeTab, setActiveTab] = useState<OrderStatus>('active');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const [showOrderModal, setShowOrderModal] = useState(false);
//   const [showFlagConfirm, setShowFlagConfirm] = useState(false);
//   const [showFlagSuccess, setShowFlagSuccess] = useState(false);

//   const tabs: { id: OrderStatus; label: string }[] = [
//     { id: 'active', label: 'Active Orders' },
//     { id: 'delivered', label: 'Delivered Orders' },
//     { id: 'rejected', label: 'Rejected/Reported Orders' },
//   ];

//   // Get orders for current tab and period
//   const orders = useMemo(() => {
//     return getOrdersByPeriod(period, activeTab);
//   }, [period, activeTab]);

//   // Group orders by period
//   const groupedOrders = useMemo(() => {
//     return groupOrdersByPeriod(orders, period);
//   }, [orders, period]);

//   // Flatten grouped orders for pagination
//   const flatOrders = Object.values(groupedOrders).flat();
//   const totalPages = Math.ceil(flatOrders.length / ITEMS_PER_PAGE);
//   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//   const paginatedOrders = flatOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);

//   const handleOpenOrder = (order: Order) => {
//     setSelectedOrder(order);
//     setShowOrderModal(true);
//   };

//   const handleFlagClick = () => {
//     setShowOrderModal(false);
//     setShowFlagConfirm(true);
//   };

//   const handleConfirmFlag = () => {
//     setShowFlagConfirm(false);
//     setShowFlagSuccess(true);
//   };

//   const handleSuccessClose = () => {
//     setShowFlagSuccess(false);
//     setSelectedOrder(null);
//   };

//   const handlePageChange = (page: number) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   const handleTabChange = (tab: OrderStatus) => {
//     setActiveTab(tab);
//     setCurrentPage(1);
//   };

//   const handlePeriodChange = (newPeriod: OrderPeriod) => {
//     setPeriod(newPeriod);
//     setCurrentPage(1);
//   };

//   return (
//     <>
//       <div className="space-y-6">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <h1 className="text-3xl md:text-4xl font-bold text-foreground">Orders</h1>
//           <select
//             value={period}
//             onChange={(e) => handlePeriodChange(e.target.value as OrderPeriod)}
//             className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground font-semibold border border-border cursor-pointer outline-none transition-opacity"
//           >
//             <option value="daily">Daily</option>
//             <option value="monthly">Monthly</option>
//             <option value="yearly">Yearly</option>
//           </select>
//         </div>

//         {/* Tabs */}
//         <div className="flex gap-4 flex-wrap">
//           {tabs.map((tab) => (
//             <button
//               key={tab.id}
//               onClick={() => handleTabChange(tab.id)}
//               className={`px-6 py-3 rounded-lg font-semibold transition-colors cursor-pointer ${
//                 activeTab === tab.id
//                   ? 'bg-primary text-primary-foreground'
//                   : 'bg-[#98EF9B] text-secondary-foreground hover:opacity-90'
//               }`}
//             >
//               {tab.label}
//             </button>
//           ))}
//         </div>

//         {/* Orders List */}
//         <div className="space-y-4">
//           {Object.entries(groupedOrders).map(([groupKey, groupOrders]) => (
//             <div key={groupKey} className="space-y-3">
//               {/* Group Header */}
//               <h2 className="text-lg font-semibold text-foreground">{groupKey}</h2>

//               {/* Orders in Group */}
//               {groupOrders.map((order) => (
//                 <div
//                   key={order.id}
//                   className="bg-secondary rounded-lg p-2 border border-border hover:shadow-md transition-shadow cursor-pointer"
//                   onClick={() => handleOpenOrder(order)}
//                 >
//                   <div className="flex gap-4">
//                     {/* Order Image */}
//                     <div className="shrink-0 w-24 h-24 md:w-28 md:h-28">
//                       <img
//                         src={order.foodImage}
//                         alt={order.orderName}
//                         className="w-full h-full object-cover rounded-lg"
//                       />
//                     </div>

//                     {/* Order Info */}
//                     <div className="flex items-center justify-between gap-8 w-full">
//                         <div className="flex-1 min-w-[200px]">
//                             <h3 className="font-semibold text-xl text-black">
//                             {order.orderName}
//                             </h3>
//                             <p className="text-lg text-black">
//                             <span className="font-semibold">Total Amount:</span>{" "}
//                             ₦{order?.totalAmount?.toLocaleString?.() ?? "0"}
//                             </p>
//                         </div>

//                         {/* Vendor + Order ID */}
//                         <div className="flex-1 min-w-[200px]">
//                             <p className="text-lg text-black">
//                             <span className="font-semibold">Vendor:</span>{" "}
//                             {order.vendorName}
//                             </p>

//                             <p className="text-lg text-black">
//                             <span className="font-semibold">Order ID:</span>{" "}
//                             {order.orderId}
//                             </p>
//                         </div>

//                         {/* Action Icons */}
//                         <div className="flex items-center gap-3 shrink-0">
//                             <button
//                             onClick={(e) => {
//                                 e.stopPropagation();
//                                 handleOpenOrder(order);
//                             }}
//                             className="p-2 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity cursor-pointer"
//                             title="View order details"
//                             >
//                             <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//                                 <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
//                                 <path
//                                 fillRule="evenodd"
//                                 d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
//                                 clipRule="evenodd"
//                                 />
//                             </svg>
//                             </button>

//                             <button
//                             onClick={(e) => {
//                                 e.stopPropagation();
//                                 setSelectedOrder(order);
//                                 setShowFlagConfirm(true);
//                             }}
//                             className="p-2 bg-accent text-accent-foreground rounded-full hover:opacity-90 transition-opacity cursor-pointer"
//                             title="Flag order"
//                             >
//                             <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//                                 <path d="M3 2a1 1 0 011 1v2.101a7.002 7.002 0 1119.414.288.75.75 0 11-1.499.034.5.5 0 00-.986.164A5.5 5.5 0 1113.5 5H11a.75.75 0 000-1.5H4a1 1 0 01-1-1V3a1 1 0 01-1-1z" />
//                             </svg>
//                             </button>
//                         </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ))}

//           {flatOrders.length === 0 && (
//             <div className="text-center py-12">
//               <p className="text-muted-foreground text-lg">
//                 No {activeTab} orders found for this period.
//               </p>
//             </div>
//           )}
//         </div>

//         {/* Pagination */}
//         {flatOrders.length > 0 && (
//           <div className="bg-card rounded-lg p-6 border border-border">
//             <div className="flex items-center justify-between gap-4 flex-wrap">
//               <span className="text-sm text-muted-foreground">
//                 Displays {paginatedOrders.length} of {flatOrders.length}
//               </span>

//               <div className="flex gap-2 items-center flex-wrap">
//                 <button
//                   onClick={() => handlePageChange(1)}
//                   disabled={currentPage === 1}
//                   className="px-3 py-2 rounded border border-border text-foreground disabled:opacity-50 hover:bg-muted transition-colors"
//                 >
//                   First
//                 </button>
//                 <button
//                   onClick={() => handlePageChange(currentPage - 1)}
//                   disabled={currentPage === 1}
//                   className="px-3 py-2 rounded border border-border text-foreground disabled:opacity-50 hover:bg-muted transition-colors"
//                 >
//                   Previous
//                 </button>

//                 {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//                   <button
//                     key={page}
//                     onClick={() => handlePageChange(page)}
//                     className={`px-3 py-2 rounded ${
//                       currentPage === page
//                         ? 'bg-primary text-primary-foreground'
//                         : 'border border-border text-foreground hover:bg-muted transition-colors'
//                     }`}
//                   >
//                     {page}
//                   </button>
//                 ))}

//                 <button
//                   onClick={() => handlePageChange(currentPage + 1)}
//                   disabled={currentPage === totalPages}
//                   className="px-3 py-2 rounded border border-border text-foreground disabled:opacity-50 hover:bg-muted transition-colors"
//                 >
//                   Next
//                 </button>
//                 <button
//                   onClick={() => handlePageChange(totalPages)}
//                   disabled={currentPage === totalPages}
//                   className="px-3 py-2 rounded border border-border text-foreground disabled:opacity-50 hover:bg-muted transition-colors"
//                 >
//                   Last
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Modals */}
//       {showOrderModal && selectedOrder && (
//         <OrderInfoModal
//           order={selectedOrder}
//           onClose={() => setShowOrderModal(false)}
//           onFlagClick={handleFlagClick}
//         />
//       )}

//       {showFlagConfirm && selectedOrder && (
//         <FlagConfirmModal
//           onConfirm={handleConfirmFlag}
//           onCancel={() => setShowFlagConfirm(false)}
//         />
//       )}

//       {showFlagSuccess && (
//         <FlagSuccessModal onClose={handleSuccessClose} />
//       )}
//     </>
//   );
// }

// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import { Skeleton } from '@/components/ui/skeleton';
// import { Button } from '@/components/ui/button';
// import { toast } from 'sonner';
// import { ChevronLeft, ChevronRight, Flag, Eye } from 'lucide-react';
// import { OrderInfoModal } from '@/components/dashboard/orders/order-info-modal';
// import { FlagConfirmModal, FlagSuccessModal } from '@/components/dashboard/orders/flag-modals';
// import { superAdminApi, type Order } from '@/lib/api/api';

// // ─────────────────────────────────────────────────────────────────────────────
// // Types
// // ─────────────────────────────────────────────────────────────────────────────

// type OrderPeriod = 'daily' | 'monthly' | 'yearly';
// type OrderTab    = 'active' | 'delivered' | 'rejected';

// const ITEMS_PER_PAGE = 7;

// // How many orders to fetch per request. Yearly needs a large window.
// const FETCH_LIMITS: Record<OrderPeriod, number> = {
//   daily:   50,
//   monthly: 300,
//   yearly:  1000,
// };

// const TAB_CONFIG: { id: OrderTab; label: string }[] = [
//   { id: 'active',    label: 'Active Orders'            },
//   { id: 'delivered', label: 'Delivered Orders'         },
//   { id: 'rejected',  label: 'Rejected/Reported Orders' },
// ];

// // ─────────────────────────────────────────────────────────────────────────────
// // Helpers
// // ─────────────────────────────────────────────────────────────────────────────

// /** Returns the start of the chosen period (midnight for daily, 1st for monthly, etc.) */
// function getPeriodStart(period: OrderPeriod): Date {
//   const now = new Date();
//   if (period === 'daily') {
//     const d = new Date(now);
//     d.setHours(0, 0, 0, 0);
//     return d;
//   }
//   if (period === 'monthly') return new Date(now.getFullYear(), now.getMonth(), 1);
//   return new Date(now.getFullYear(), 0, 1); // yearly
// }

// function filterByPeriod(orders: Order[], period: OrderPeriod): Order[] {
//   const start = getPeriodStart(period);
//   return orders.filter((o) => o.createdAt && new Date(o.createdAt) >= start);
// }

// /**
//  * Groups orders into labelled buckets:
//  *   daily   → single "Today" group
//  *   monthly → one group per day  e.g. "15 Jan 2025"
//  *   yearly  → one group per month e.g. "January 2025"
//  */
// function groupByPeriod(orders: Order[], period: OrderPeriod): [string, Order[]][] {
//   if (period === 'daily') {
//     return orders.length ? [['Today', orders]] : [];
//   }

//   const map = new Map<string, Order[]>();
//   for (const order of orders) {
//     const d = new Date(order.createdAt);
//     const key =
//       period === 'monthly'
//         ? d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
//         : d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
//     if (!map.has(key)) map.set(key, []);
//     map.get(key)!.push(order);
//   }
//   // Return in descending date order (most recent first)
//   return Array.from(map.entries()).reverse();
// }

// /** Derive a display-friendly order name from real backend data. */
// function getOrderName(order: Order): string {
//   if (order.items?.[0]?.name) return order.items[0].name;
//   if (order.storeName)        return order.storeName;
//   if (order.vendorName)       return order.vendorName;
//   return `Order ${order.orderNumber ?? order._id ?? order.id}`;
// }

// /** Derive a display image. */
// function getOrderImage(order: Order): string | null {
//   if (order.foodImage)          return order.foodImage;
//   if (order.items?.[0]?.image)  return order.items[0].image;
//   return null;
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // Skeleton
// // ─────────────────────────────────────────────────────────────────────────────

// function OrderCardSkeleton() {
//   return (
//     <div className="bg-secondary rounded-xl p-3 border border-border">
//       <div className="flex gap-4 items-center">
//         <Skeleton className="w-24 h-24 md:w-28 md:h-28 rounded-xl shrink-0" />
//         <div className="flex-1 space-y-3 py-2">
//           <Skeleton className="h-5 w-48" />
//           <Skeleton className="h-4 w-36" />
//           <Skeleton className="h-4 w-32" />
//         </div>
//         <div className="flex items-center gap-2 shrink-0 pr-2">
//           <Skeleton className="w-9 h-9 rounded-full" />
//           <Skeleton className="w-9 h-9 rounded-full" />
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // Pagination bar
// // ─────────────────────────────────────────────────────────────────────────────

// function Pagination({
//   page, totalPages, total, showing, onChange,
// }: {
//   page: number; totalPages: number; total: number; showing: number; onChange: (p: number) => void;
// }) {
//   const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
//     .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
//     .reduce<(number | '…')[]>((acc, p, i, arr) => {
//       if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('…');
//       acc.push(p);
//       return acc;
//     }, []);

//   return (
//     <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
//       <span>Displaying {showing} of {total}</span>
//       <div className="flex items-center gap-1 flex-wrap justify-center">
//         <PageBtn label="First"                              onClick={() => onChange(1)}            disabled={page <= 1} />
//         <PageBtn label={<ChevronLeft size={16} />}         onClick={() => onChange(page - 1)}     disabled={page <= 1} />
//         {pages.map((p, i) =>
//           p === '…' ? (
//             <span key={`e-${i}`} className="px-2">…</span>
//           ) : (
//             <button
//               key={p}
//               onClick={() => onChange(p as number)}
//               className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
//                 p === page
//                   ? 'bg-primary text-primary-foreground'
//                   : 'hover:bg-secondary text-foreground border border-border'
//               }`}
//             >
//               {p}
//             </button>
//           )
//         )}
//         <PageBtn label={<ChevronRight size={16} />}        onClick={() => onChange(page + 1)}     disabled={page >= totalPages} />
//         <PageBtn label="Last"                              onClick={() => onChange(totalPages)}    disabled={page >= totalPages} />
//       </div>
//     </div>
//   );
// }

// function PageBtn({ label, onClick, disabled }: { label: React.ReactNode; onClick: () => void; disabled: boolean }) {
//   return (
//     <button
//       onClick={onClick}
//       disabled={disabled}
//       className="px-3 py-1.5 rounded-lg border border-border text-foreground text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-secondary transition-colors flex items-center"
//     >
//       {label}
//     </button>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // Order Card
// // ─────────────────────────────────────────────────────────────────────────────

// function OrderCard({
//   order, onView, onFlag,
// }: {
//   order: Order; onView: () => void; onFlag: () => void;
// }) {
//   const image     = getOrderImage(order);
//   const orderName = getOrderName(order);
//   const orderId   = order.orderNumber ?? order._id ?? order.id;

//   return (
//     <div
//       className="bg-secondary rounded-xl p-3 border border-border hover:shadow-md transition-shadow cursor-pointer"
//       onClick={onView}
//     >
//       <div className="flex gap-4">
//         {/* Image */}
//         <div className="shrink-0 w-24 h-24 md:w-28 md:h-28 rounded-xl overflow-hidden bg-primary/10 flex items-center justify-center">
//           {image ? (
//             <img src={image} alt={orderName} className="w-full h-full object-cover" />
//           ) : (
//             <span className="text-4xl">📦</span>
//           )}
//         </div>

//         {/* Info */}
//         <div className="flex items-center justify-between gap-4 w-full min-w-0">
//           {/* Name + amount + reported badge */}
//           <div className="flex-1 min-w-0">
//             <h3 className="font-semibold text-xl text-black truncate">{orderName}</h3>
//             <p className="text-base text-black">
//               <span className="font-semibold">Total Amount:</span>{' '}
//               ₦{(order.totalAmount ?? 0).toLocaleString()}
//             </p>
//             {order.isReported && (
//               <span className="inline-block mt-1 text-xs font-semibold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
//                 ⚑ Reported
//               </span>
//             )}
//           </div>

//           {/* Vendor + order ID (hidden on small screens) */}
//           <div className="flex-1 min-w-0 hidden md:block">
//             <p className="text-base text-black">
//               <span className="font-semibold">Vendor:</span>{' '}
//               {order.vendorName ?? order.storeName ?? '—'}
//             </p>
//             <p className="text-base text-black">
//               <span className="font-semibold">Order ID:</span>{' '}
//               <span className="font-mono text-sm">{orderId}</span>
//             </p>
//           </div>

//           {/* Action buttons */}
//           <div className="flex items-center gap-2 shrink-0">
//             <button
//               onClick={(e) => { e.stopPropagation(); onView(); }}
//               className="p-2 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity"
//               title="View order details"
//             >
//               <Eye size={18} />
//             </button>
//             <button
//               onClick={(e) => { e.stopPropagation(); onFlag(); }}
//               disabled={order.isReported}
//               className="p-2 bg-accent text-accent-foreground rounded-full hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
//               title={order.isReported ? 'Already flagged' : 'Flag order'}
//             >
//               <Flag size={18} />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // Main Page
// // ─────────────────────────────────────────────────────────────────────────────

// export default function OrdersPage() {
//   const [period,    setPeriod]    = useState<OrderPeriod>('daily');
//   const [activeTab, setActiveTab] = useState<OrderTab>('active');
//   const [page,      setPage]      = useState(1);

//   // Raw orders from the API — keyed by tab so switching tabs is instant
//   const [cache, setCache] = useState<Partial<Record<OrderTab, Order[]>>>({});
//   const [loading, setLoading] = useState(true);
//   const [error,   setError]   = useState<string | null>(null);

//   // Modal state
//   const [selectedOrder,    setSelectedOrder]    = useState<Order | null>(null);
//   const [showOrderModal,   setShowOrderModal]   = useState(false);
//   const [showFlagConfirm,  setShowFlagConfirm]  = useState(false);
//   const [showFlagSuccess,  setShowFlagSuccess]  = useState(false);
//   const [flagging,         setFlagging]         = useState(false);

//   // ── Fetch ────────────────────────────────────────────────────────────────
//   //
//   // The backend supports filtering by status but NOT by date range.
//   // We therefore:
//   //   1. Fetch all orders for a given status tab (with a generous limit).
//   //   2. Filter client-side by createdAt relative to the selected period.
//   //   3. Cache the raw results per tab so switching tabs doesn't re-fetch.
//   //   4. Re-fetch when the tab changes or when the user explicitly retries.
//   //   5. Re-fetch when period changes to yearly (needs a larger limit).
//   //
//   // ⚠️  BACKEND REQUIREMENT: Add a `startDate`/`endDate` query param to
//   //      GET /api/superadmin/orders so date filtering can be done server-side.
//   //      Until then, client-side filtering is the correct approach.

//   const fetchOrders = useCallback(async (tab: OrderTab, currentPeriod: OrderPeriod) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await superAdminApi.orders.getAll({
//         status: tab,
//         page:   1,
//         limit:  FETCH_LIMITS[currentPeriod],
//       });
//       setCache((prev) => ({ ...prev, [tab]: res.data ?? [] }));
//     } catch (err: any) {
//       const msg = err?.message || 'Failed to load orders';
//       setError(msg);
//       toast.error(msg);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // Fetch on mount and whenever tab or period changes
//   useEffect(() => {
//     fetchOrders(activeTab, period);
//   }, [activeTab, period, fetchOrders]);

//   // ── Derived data ─────────────────────────────────────────────────────────

//   const allOrders      = cache[activeTab] ?? [];
//   const periodFiltered = filterByPeriod(allOrders, period);
//   const grouped        = groupByPeriod(periodFiltered, period); // [string, Order[]][]
//   const flatOrders     = grouped.flatMap(([, orders]) => orders);
//   const totalPages     = Math.max(1, Math.ceil(flatOrders.length / ITEMS_PER_PAGE));
//   const startIndex     = (page - 1) * ITEMS_PER_PAGE;

//   // Build a paginated subset of the grouped structure (groups stay intact across page boundary)
//   const pagedGrouped = (() => {
//     const result: [string, Order[]][] = [];
//     let cursor = 0;
//     for (const [key, orders] of grouped) {
//       const pageOrders: Order[] = [];
//       for (const order of orders) {
//         if (cursor >= startIndex && cursor < startIndex + ITEMS_PER_PAGE) {
//           pageOrders.push(order);
//         }
//         cursor++;
//       }
//       if (pageOrders.length > 0) result.push([key, pageOrders]);
//     }
//     return result;
//   })();

//   // ── Tab / period handlers ────────────────────────────────────────────────

//   const handleTabChange = (tab: OrderTab) => {
//     setActiveTab(tab);
//     setPage(1);
//   };

//   const handlePeriodChange = (p: OrderPeriod) => {
//     setPeriod(p);
//     setPage(1);
//     // Invalidate cache for current tab so we re-fetch with the right limit
//     setCache((prev) => {
//       const next = { ...prev };
//       delete next[activeTab];
//       return next;
//     });
//   };

//   // ── Order modal ──────────────────────────────────────────────────────────

//   const handleOpenOrder = (order: Order) => {
//     setSelectedOrder(order);
//     setShowOrderModal(true);
//   };

//   const handleFlagClick = () => {
//     setShowOrderModal(false);
//     setShowFlagConfirm(true);
//   };

//   // ── Flag (override) ──────────────────────────────────────────────────────
//   //
//   // "Flagging" in this UI = calling the override endpoint with action:"resolve"
//   // and a reason. The controller sets isReported = false on "resolve".
//   //
//   // ⚠️  BACKEND REQUIREMENT: Add a dedicated POST /api/superadmin/orders/:id/flag
//   //      endpoint that sets isReported = true. The current `override` endpoint
//   //      does the opposite (it resolves / clears a report). Until this is added,
//   //      we call override with action:"resolve" and a descriptive reason so the
//   //      admin action is at least logged via the audit system.
//   //
//   // Once the backend adds the flag endpoint, replace the call below with:
//   //   superAdminApi.orders.flag(selectedOrder._id ?? selectedOrder.id)

//   const handleConfirmFlag = async () => {
//     if (!selectedOrder) return;
//     setFlagging(true);
//     try {
//       await superAdminApi.orders.override(selectedOrder._id ?? selectedOrder.id, {
//         action: 'resolve',
//         reason: 'Flagged by super admin for review',
//       });

//       // Optimistically mark the order as reported in the cache
//       setCache((prev) => {
//         const tabOrders = prev[activeTab] ?? [];
//         return {
//           ...prev,
//           [activeTab]: tabOrders.map((o) =>
//             (o._id ?? o.id) === (selectedOrder._id ?? selectedOrder.id)
//               ? { ...o, isReported: true }
//               : o
//           ),
//         };
//       });

//       setShowFlagConfirm(false);
//       setShowFlagSuccess(true);
//     } catch (err: any) {
//       toast.error(err?.message || 'Failed to flag order');
//       setShowFlagConfirm(false);
//     } finally {
//       setFlagging(false);
//     }
//   };

//   const handleSuccessClose = () => {
//     setShowFlagSuccess(false);
//     setSelectedOrder(null);
//   };

//   // ── Render ───────────────────────────────────────────────────────────────

//   const showingCount = Math.min(ITEMS_PER_PAGE, Math.max(0, flatOrders.length - startIndex));

//   return (
//     <>
//       <div className="space-y-6">

//         {/* Header */}
//         <div className="flex items-center justify-between gap-4">
//           <h1 className="text-3xl md:text-4xl font-bold text-foreground">Orders</h1>
//           <select
//             value={period}
//             onChange={(e) => handlePeriodChange(e.target.value as OrderPeriod)}
//             className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground font-semibold border border-border cursor-pointer outline-none"
//           >
//             <option value="daily">Daily</option>
//             <option value="monthly">Monthly</option>
//             <option value="yearly">Yearly</option>
//           </select>
//         </div>

//         {/* Tabs */}
//         <div className="flex gap-3 flex-wrap">
//           {TAB_CONFIG.map((tab) => (
//             <button
//               key={tab.id}
//               onClick={() => handleTabChange(tab.id)}
//               className={`px-6 py-3 rounded-lg font-semibold transition-colors cursor-pointer ${
//                 activeTab === tab.id
//                   ? 'bg-primary text-primary-foreground'
//                   : 'bg-[#98EF9B] text-secondary-foreground hover:opacity-90'
//               }`}
//             >
//               {tab.label}
//             </button>
//           ))}
//         </div>

//         {/* Error banner */}
//         {error && (
//           <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex items-center justify-between gap-4">
//             <p className="text-destructive text-sm font-medium">{error}</p>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => fetchOrders(activeTab, period)}
//               className="border-destructive text-destructive hover:bg-destructive/10 shrink-0"
//             >
//               Retry
//             </Button>
//           </div>
//         )}

//         {/* Orders list */}
//         <div className="space-y-6">
//           {loading ? (
//             <div className="space-y-3">
//               {Array.from({ length: 5 }).map((_, i) => <OrderCardSkeleton key={i} />)}
//             </div>
//           ) : flatOrders.length === 0 ? (
//             <div className="text-center py-16 bg-secondary/40 rounded-xl border border-border">
//               <p className="text-muted-foreground text-lg">
//                 No {activeTab} orders found{period !== 'yearly' ? ' for this period' : ''}.
//               </p>
//               {period !== 'yearly' && (
//                 <button
//                   onClick={() => handlePeriodChange('yearly')}
//                   className="mt-3 text-sm text-primary underline underline-offset-2"
//                 >
//                   Try viewing all time
//                 </button>
//               )}
//             </div>
//           ) : (
//             pagedGrouped.map(([groupKey, groupOrders]) => (
//               <div key={groupKey} className="space-y-3">
//                 <h2 className="text-lg font-semibold text-foreground">{groupKey}</h2>
//                 {groupOrders.map((order) => (
//                   <OrderCard
//                     key={order._id ?? order.id}
//                     order={order}
//                     onView={() => handleOpenOrder(order)}
//                     onFlag={() => {
//                       setSelectedOrder(order);
//                       setShowFlagConfirm(true);
//                     }}
//                   />
//                 ))}
//               </div>
//             ))
//           )}
//         </div>

//         {/* Pagination */}
//         {!loading && flatOrders.length > 0 && (
//           <div className="bg-card rounded-xl p-5 border border-border">
//             <Pagination
//               page={page}
//               totalPages={totalPages}
//               total={flatOrders.length}
//               showing={showingCount}
//               onChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
//             />
//           </div>
//         )}
//       </div>

//       {/* Modals */}
//       {showOrderModal && selectedOrder && (
//         <OrderInfoModal
//           order={selectedOrder}
//           onClose={() => setShowOrderModal(false)}
//           onFlagClick={handleFlagClick}
//         />
//       )}

//       {showFlagConfirm && selectedOrder && (
//         <FlagConfirmModal
//           loading={flagging}
//           onConfirm={handleConfirmFlag}
//           onCancel={() => setShowFlagConfirm(false)}
//         />
//       )}

//       {showFlagSuccess && (
//         <FlagSuccessModal onClose={handleSuccessClose} />
//       )}
//     </>
//   );
// }

//new

"use client";

import { useState, useEffect, useCallback } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Flag, Eye } from "lucide-react";
import { OrderInfoModal } from "@/components/dashboard/orders/order-info-modal";
import { FlagConfirmModal, FlagSuccessModal } from "@/components/dashboard/orders/flag-modals";
import { superAdminApi, type Order } from "@/lib/api/api";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type OrderPeriod = "daily" | "monthly" | "yearly";
type OrderTab = "active" | "delivered" | "rejected";

const ITEMS_PER_PAGE = 7;

// How many orders to fetch per request. Yearly needs a large window.
const FETCH_LIMITS: Record<OrderPeriod, number> = {
  daily: 50,
  monthly: 300,
  yearly: 1000,
};

const TAB_CONFIG: { id: OrderTab; label: string }[] = [
  { id: "active", label: "Active Orders" },
  { id: "delivered", label: "Delivered Orders" },
  { id: "rejected", label: "Rejected/Reported Orders" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Returns the start of the chosen period (midnight for daily, 1st for monthly, etc.) */
function getPeriodStart(period: OrderPeriod): Date {
  const now = new Date();
  if (period === "daily") {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    return d;
  }
  if (period === "monthly") return new Date(now.getFullYear(), now.getMonth(), 1);
  return new Date(now.getFullYear(), 0, 1); // yearly
}

function filterByPeriod(orders: Order[], period: OrderPeriod): Order[] {
  const start = getPeriodStart(period);
  return orders.filter((o) => o.createdAt && new Date(o.createdAt) >= start);
}

/**
 * Groups orders into labelled buckets:
 *   daily   → single "Today" group
 *   monthly → one group per day  e.g. "15 Jan 2025"
 *   yearly  → one group per month e.g. "January 2025"
 */
function groupByPeriod(orders: Order[], period: OrderPeriod): [string, Order[]][] {
  if (period === "daily") {
    return orders.length ? [["Today", orders]] : [];
  }

  const map = new Map<string, Order[]>();
  for (const order of orders) {
    const d = new Date(order.createdAt);
    const key =
      period === "monthly"
        ? d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
        : d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(order);
  }
  // Return in descending date order (most recent first)
  return Array.from(map.entries()).reverse();
}

/** Derive a display-friendly order name from real backend data. */
function getOrderName(order: Order): string {
  if (order.items?.[0]?.name) return order.items[0].name;
  if (order.storeName) return order.storeName;
  if (order.vendorName) return order.vendorName;
  return `Order ${order.orderNumber ?? order._id ?? order.id}`;
}

/** Derive a display image. */
function getOrderImage(order: Order): string | null {
  if (order.foodImage) return order.foodImage;
  if (order.items?.[0]?.image) return order.items[0].image;
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Skeleton
// ─────────────────────────────────────────────────────────────────────────────

function OrderCardSkeleton() {
  return (
    <div className="bg-secondary rounded-xl p-3 border border-border">
      <div className="flex gap-4 items-center">
        <Skeleton className="w-24 h-24 md:w-28 md:h-28 rounded-xl shrink-0" />
        <div className="flex-1 space-y-3 py-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex items-center gap-2 shrink-0 pr-2">
          <Skeleton className="w-9 h-9 rounded-full" />
          <Skeleton className="w-9 h-9 rounded-full" />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Pagination bar
// ─────────────────────────────────────────────────────────────────────────────

function Pagination({
  page,
  totalPages,
  total,
  showing,
  onChange,
}: {
  page: number;
  totalPages: number;
  total: number;
  showing: number;
  onChange: (p: number) => void;
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
    .reduce<(number | "…")[]>((acc, p, i, arr) => {
      if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("…");
      acc.push(p);
      return acc;
    }, []);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
      <span>
        Displaying {showing} of {total}
      </span>
      <div className="flex items-center gap-1 flex-wrap justify-center">
        <PageBtn label="First" onClick={() => onChange(1)} disabled={page <= 1} />
        <PageBtn
          label={<ChevronLeft size={16} />}
          onClick={() => onChange(page - 1)}
          disabled={page <= 1}
        />
        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`e-${i}`} className="px-2">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onChange(p as number)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                p === page
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-secondary text-foreground border border-border"
              }`}
            >
              {p}
            </button>
          )
        )}
        <PageBtn
          label={<ChevronRight size={16} />}
          onClick={() => onChange(page + 1)}
          disabled={page >= totalPages}
        />
        <PageBtn label="Last" onClick={() => onChange(totalPages)} disabled={page >= totalPages} />
      </div>
    </div>
  );
}

function PageBtn({
  label,
  onClick,
  disabled,
}: {
  label: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-3 py-1.5 rounded-lg border border-border text-foreground text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-secondary transition-colors flex items-center"
    >
      {label}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Order Card
// ─────────────────────────────────────────────────────────────────────────────

function OrderCard({
  order,
  onView,
  onFlag,
}: {
  order: Order;
  onView: () => void;
  onFlag: () => void;
}) {
  const image = getOrderImage(order);
  const orderName = getOrderName(order);
  const orderId = order.orderNumber ?? order._id ?? order.id;

  return (
    <div
      className="bg-secondary rounded-xl p-3 border border-border hover:shadow-md transition-shadow cursor-pointer"
      onClick={onView}
    >
      <div className="flex gap-4">
        {/* Image */}
        <div className="shrink-0 w-24 h-24 md:w-28 md:h-28 rounded-xl overflow-hidden bg-primary/10 flex items-center justify-center">
          {image ? (
            <img src={image} alt={orderName} className="w-full h-full object-cover" />
          ) : (
            <span className="text-4xl">📦</span>
          )}
        </div>

        {/* Info */}
        <div className="flex items-center justify-between gap-4 w-full min-w-0">
          {/* Name + amount + reported badge */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-xl text-black truncate">{orderName}</h3>
            <p className="text-base text-black">
              <span className="font-semibold">Total Amount:</span> ₦
              {(order.totalAmount ?? 0).toLocaleString()}
            </p>
            {order.isReported && (
              <span className="inline-block mt-1 text-xs font-semibold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                ⚑ Reported
              </span>
            )}
          </div>

          {/* Vendor + order ID (hidden on small screens) */}
          <div className="flex-1 min-w-0 hidden md:block">
            <p className="text-base text-black">
              <span className="font-semibold">Vendor:</span>{" "}
              {order.vendorName ?? order.storeName ?? "—"}
            </p>
            <p className="text-base text-black">
              <span className="font-semibold">Order ID:</span>{" "}
              <span className="font-mono text-sm">{orderId}</span>
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onView();
              }}
              className="p-2 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity"
              title="View order details"
            >
              <Eye size={18} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFlag();
              }}
              disabled={order.isReported}
              className="p-2 bg-accent text-accent-foreground rounded-full hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              title={order.isReported ? "Already flagged" : "Flag order"}
            >
              <Flag size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────

export default function OrdersPage() {
  const [period, setPeriod] = useState<OrderPeriod>("daily");
  const [activeTab, setActiveTab] = useState<OrderTab>("active");
  const [page, setPage] = useState(1);

  // Raw orders from the API — keyed by tab so switching tabs is instant
  const [cache, setCache] = useState<Partial<Record<OrderTab, Order[]>>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showFlagConfirm, setShowFlagConfirm] = useState(false);
  const [showFlagSuccess, setShowFlagSuccess] = useState(false);
  const [flagging, setFlagging] = useState(false);

  // ── Fetch ────────────────────────────────────────────────────────────────
  //
  // The backend supports filtering by status but NOT by date range.
  // We therefore:
  //   1. Fetch all orders for a given status tab (with a generous limit).
  //   2. Filter client-side by createdAt relative to the selected period.
  //   3. Cache the raw results per tab so switching tabs doesn't re-fetch.
  //   4. Re-fetch when the tab changes or when the user explicitly retries.
  //   5. Re-fetch when period changes to yearly (needs a larger limit).
  //
  // ⚠️  BACKEND REQUIREMENT: Add a `startDate`/`endDate` query param to
  //      GET /api/superadmin/orders so date filtering can be done server-side.
  //      Until then, client-side filtering is the correct approach.

  const fetchOrders = useCallback(async (tab: OrderTab, currentPeriod: OrderPeriod) => {
    setLoading(true);
    setError(null);
    try {
      const res = await superAdminApi.orders.getAll({
        status: tab,
        page: 1,
        limit: FETCH_LIMITS[currentPeriod],
      });
      setCache((prev) => ({ ...prev, [tab]: res.data ?? [] }));
    } catch (err: any) {
      const msg = err?.message || "Failed to load orders";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount and whenever tab or period changes
  useEffect(() => {
    fetchOrders(activeTab, period);
  }, [activeTab, period, fetchOrders]);

  // ── Derived data ─────────────────────────────────────────────────────────

  const allOrders = cache[activeTab] ?? [];
  const periodFiltered = filterByPeriod(allOrders, period);
  const grouped = groupByPeriod(periodFiltered, period); // [string, Order[]][]
  const flatOrders = grouped.flatMap(([, orders]) => orders);
  const totalPages = Math.max(1, Math.ceil(flatOrders.length / ITEMS_PER_PAGE));
  const startIndex = (page - 1) * ITEMS_PER_PAGE;

  // Build a paginated subset of the grouped structure (groups stay intact across page boundary)
  const pagedGrouped = (() => {
    const result: [string, Order[]][] = [];
    let cursor = 0;
    for (const [key, orders] of grouped) {
      const pageOrders: Order[] = [];
      for (const order of orders) {
        if (cursor >= startIndex && cursor < startIndex + ITEMS_PER_PAGE) {
          pageOrders.push(order);
        }
        cursor++;
      }
      if (pageOrders.length > 0) result.push([key, pageOrders]);
    }
    return result;
  })();

  // ── Tab / period handlers ────────────────────────────────────────────────

  const handleTabChange = (tab: OrderTab) => {
    setActiveTab(tab);
    setPage(1);
  };

  const handlePeriodChange = (p: OrderPeriod) => {
    setPeriod(p);
    setPage(1);
    // Invalidate cache for current tab so we re-fetch with the right limit
    setCache((prev) => {
      const next = { ...prev };
      delete next[activeTab];
      return next;
    });
  };

  // ── Order modal ──────────────────────────────────────────────────────────

  const handleOpenOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const handleFlagClick = () => {
    setShowOrderModal(false);
    setShowFlagConfirm(true);
  };

  // ── Flag order ────────────────────────────────────────────────────────────
  // Calls PUT /api/superadmin/orders/:id/flag — confirmed in router and controller.
  // Sets isReported = true (distinct from override which resolves/clears reports).

  const handleConfirmFlag = async () => {
    if (!selectedOrder) return;
    setFlagging(true);
    try {
      await superAdminApi.orders.flag(selectedOrder._id ?? selectedOrder.id, {
        reason: "Flagged for review by Super Admin",
      });

      // Optimistically update cache so card shows "Reported" badge immediately
      setCache((prev) => {
        const tabOrders = prev[activeTab] ?? [];
        return {
          ...prev,
          [activeTab]: tabOrders.map((o) =>
            (o._id ?? o.id) === (selectedOrder._id ?? selectedOrder.id)
              ? { ...o, isReported: true }
              : o
          ),
        };
      });

      setShowFlagConfirm(false);
      setShowFlagSuccess(true);
      toast.success("Order flagged for review");
    } catch (err: any) {
      toast.error(err?.message || "Failed to flag order");
      setShowFlagConfirm(false);
    } finally {
      setFlagging(false);
    }
  };

  const handleSuccessClose = () => {
    setShowFlagSuccess(false);
    setSelectedOrder(null);
  };

  // ── Render ───────────────────────────────────────────────────────────────

  const showingCount = Math.min(ITEMS_PER_PAGE, Math.max(0, flatOrders.length - startIndex));

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Orders</h1>
          <select
            value={period}
            onChange={(e) => handlePeriodChange(e.target.value as OrderPeriod)}
            className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground font-semibold border border-border cursor-pointer outline-none"
          >
            <option value="daily">Daily</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 flex-wrap">
          {TAB_CONFIG.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-[#98EF9B] text-secondary-foreground hover:opacity-90"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Error banner */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex items-center justify-between gap-4">
            <p className="text-destructive text-sm font-medium">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchOrders(activeTab, period)}
              className="border-destructive text-destructive hover:bg-destructive/10 shrink-0"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Orders list */}
        <div className="space-y-6">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <OrderCardSkeleton key={i} />
              ))}
            </div>
          ) : flatOrders.length === 0 ? (
            <div className="text-center py-16 bg-secondary/40 rounded-xl border border-border">
              <p className="text-muted-foreground text-lg">
                No {activeTab} orders found{period !== "yearly" ? " for this period" : ""}.
              </p>
              {period !== "yearly" && (
                <button
                  onClick={() => handlePeriodChange("yearly")}
                  className="mt-3 text-sm text-primary underline underline-offset-2"
                >
                  Try viewing all time
                </button>
              )}
            </div>
          ) : (
            pagedGrouped.map(([groupKey, groupOrders]) => (
              <div key={groupKey} className="space-y-3">
                <h2 className="text-lg font-semibold text-foreground">{groupKey}</h2>
                {groupOrders.map((order) => (
                  <OrderCard
                    key={order._id ?? order.id}
                    order={order}
                    onView={() => handleOpenOrder(order)}
                    onFlag={() => {
                      setSelectedOrder(order);
                      setShowFlagConfirm(true);
                    }}
                  />
                ))}
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {!loading && flatOrders.length > 0 && (
          <div className="bg-card rounded-xl p-5 border border-border">
            <Pagination
              page={page}
              totalPages={totalPages}
              total={flatOrders.length}
              showing={showingCount}
              onChange={(p) => {
                setPage(p);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
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
          loading={flagging}
          onConfirm={handleConfirmFlag}
          onCancel={() => setShowFlagConfirm(false)}
        />
      )}

      {showFlagSuccess && <FlagSuccessModal onClose={handleSuccessClose} />}
    </>
  );
}
