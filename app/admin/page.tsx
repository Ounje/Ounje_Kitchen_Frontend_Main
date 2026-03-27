// 'use client';

// import { useState } from 'react';
// import StatsCard from '@/components/dashboard/StatsCard';
// import { NotificationItem } from '@/components/dashboard/NotificationItem';
// import { Button } from '@/components/ui/button';
// import { RatingsModal, OrdersModal, UsersModal, RevenueModal } from '@/components/dashboard/stat-modals';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { toast } from 'sonner';
// import { Users, Package, Store, TrendingUp, Bike, HelpCircle, Star } from 'lucide-react';

// const mockNotifications = [
//   {
//     id: 1,
//     name: 'Madu Lydia Just placed order from Iya Bolu',
//     message: 'Choice: Tray Builder',
//     orderInfo: 'Order ID: Oun - 123 - 7D5T',
//   },
//   {
//     id: 2,
//     name: 'Martina Chinyere Just placed order from Iya Bolu',
//     message: 'Choice: Tray Builder',
//     orderInfo: 'Order ID: Oun - 123 - 7D5T',
//   },
//   {
//     id: 3,
//     name: 'Ben Dike Order is reported as late',
//     message: 'Choice: Tray Builder',
//     orderInfo: 'Order ID: Oun - 123 - 7D5T',
//     action: 'emoji',
//   },
//   {
//     id: 4,
//     name: 'Ekele Emelegu Just placed order from Iya Bolu',
//     message: 'Choice: Tray Builder',
//     orderInfo: 'Order ID: Oun - 123 - 7D5T',
//   },
//   {
//     id: 5,
//     name: 'Sochi Just placed order from Iya Bolu',
//     message: 'Choice: Tray Builder',
//     orderInfo: 'Order ID: Oun - 123 - 7D5T',
//   },
//   {
//     id: 6,
//     name: 'Izuki Midoriya Just placed order from Iya Bolu',
//     message: 'Choice: Tray Builder',
//     orderInfo: 'Order ID: Oun - 123 - 7D5T',
//   },
// ];

// export default function Dashboard() {
//   const [timeframe, setTimeframe] = useState('weekly');
//   const [deletedNotifications, setDeletedNotifications] = useState<Set<number>>(new Set());
//   const [openModal, setOpenModal] = useState<string | null>(null);

//   const handleDeleteNotification = (id: number) => {
//     setDeletedNotifications((prev) => new Set(prev).add(id));
//     toast.success('Notification dismissed');
//   };

//   const visibleNotifications = mockNotifications.filter(
//     (n) => !deletedNotifications.has(n.id)
//   );

//   const handleShowAll = () => {
//     toast.info('Navigating to notifications page');
//   };

//   const stats = [
//     {
//       icon: '👥',
//       value: '3,000',
//       label: 'Total Users',
//       subtext: 'Active Users: 19 | Inactive Users: 23',
//       colorClass: 'bg-chart-1',
//       id: 'users',
//     },
//     {
//       icon: '📦',
//       value: '7,000',
//       label: 'Total Orders',
//       subtext: '1000 delivered | 50 on delivery',
//       colorClass: 'bg-chart-2',
//       id: 'orders',
//     },
//     {
//       icon: '🏪',
//       value: '300',
//       label: 'Total vendors',
//       subtext: '10 active | 5 suspended',
//       colorClass: 'bg-chart-3',
//       id: null,
//     },
//     {
//       icon: '💰',
//       value: '₦1,900,000',
//       label: 'Total Revenue',
//       subtext: '',
//       colorClass: 'bg-chart-4',
//       id: 'revenue',
//     },
//     {
//       icon: '🚴',
//       value: '30',
//       label: 'Total Riders',
//       subtext: 'Active Riders: 20 | Available Riders: 5',
//       colorClass: 'bg-chart-1',
//       id: null,
//     },
//     {
//       icon: '❓',
//       value: '5',
//       label: 'Total Queries',
//       subtext: 'Awaiting Resolution: 2 | Resolved: 2',
//       colorClass: 'bg-chart-2',
//       id: null,
//     },
//     {
//       icon: '⭐',
//       value: '700',
//       label: 'Total Ratings',
//       subtext: 'Excellent Ratings: 5 | Good Ratings: 2',
//       colorClass: 'bg-chart-1',
//       id: 'ratings',
//     },
//   ];

//   return (
//     // <DashboardLayout>
//       <div className="space-y-8">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//           <h1 className="text-3xl md:text-4xl font-bold text-foreground">Dashboard</h1>
//           <Select value={timeframe} onValueChange={setTimeframe}>
//             <SelectTrigger className="w-full md:w-40 bg-[#98EF9B] text-[#000000] font-semibold">
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="daily">Daily</SelectItem>
//               <SelectItem value="weekly">Weekly</SelectItem>
//               <SelectItem value="monthly">Monthly</SelectItem>
//               <SelectItem value="yearly">Yearly</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {stats.map((stat, index) => (
//             <div
//               key={index}
//               onClick={() => stat.id && setOpenModal(stat.id)}
//               className={stat.id ? 'cursor-pointer' : ''}
//             >
//               <StatsCard {...stat} />
//             </div>
//           ))}
//         </div>

//         {/* Notifications Section */}
//         <div className="space-y-4">
//           <div className="flex justify-between items-center">
//             <h2 className="text-2xl font-bold text-foreground">Notifications/Alerts</h2>
//             <Button
//               onClick={handleShowAll}
//               className="bg-[#1A3F1C] py-6 px-6 rounded-lg hover:bg-sidebar/90 text-[#FFFFFF] cursor-pointer"
//             >
//               Show all
//             </Button>
//           </div>

//           <div className="space-y-3">
//             {visibleNotifications.length === 0 ? (
//               <div className="bg-chart-1 rounded-xl p-8 text-center">
//                 <p className="text-muted-foreground">No notifications at the moment</p>
//               </div>
//             ) : (
//               visibleNotifications.map((notification) => (
//                 <NotificationItem
//                   key={notification.id}
//                   name={notification.name}
//                   message={notification.message}
//                   orderInfo={notification.orderInfo}
//                   rightAction={
//                     notification.action === 'emoji' ? (
//                       <Button
//                         size="icon"
//                         variant="ghost"
//                         className="bg-foreground text-background hover:bg-foreground/90"
//                         onClick={() => handleDeleteNotification(notification.id)}
//                       >
//                         😊
//                       </Button>
//                     ) : (
//                       <Button
//                         size="icon"
//                         variant="ghost"
//                         className="bg-foreground text-background hover:bg-foreground/90"
//                         onClick={() => handleDeleteNotification(notification.id)}
//                       >
//                         🗑️
//                       </Button>
//                     )
//                   }
//                 />
//               ))
//             )}
//           </div>
//         </div>

//         {/* Modals */}
//         <RatingsModal
//           isOpen={openModal === 'ratings'}
//           onClose={() => setOpenModal(null)}
//           title="Ratings"
//         />
//         <OrdersModal
//           isOpen={openModal === 'orders'}
//           onClose={() => setOpenModal(null)}
//           title="Orders"
//         />
//         <UsersModal
//           isOpen={openModal === 'users'}
//           onClose={() => setOpenModal(null)}
//           title="Total Users"
//         />
//         <RevenueModal
//           isOpen={openModal === 'revenue'}
//           onClose={() => setOpenModal(null)}
//           title="Revenue"
//         />
//       </div>
//     // </DashboardLayout>
//   );
// }




// new


// 'use client';

// import { useState, useEffect, useCallback, useRef } from 'react';
// import { useRouter } from 'next/navigation';
// import StatsCard from '@/components/dashboard/StatsCard';
// import { NotificationItem } from '@/components/dashboard/NotificationItem';
// import { Button } from '@/components/ui/button';
// import { Skeleton } from '@/components/ui/skeleton';
// import { Badge } from '@/components/ui/badge';
// import {
//   RatingsModal,
//   OrdersModal,
//   UsersModal,
//   RevenueModal,
// } from '@/components/dashboard/stat-modals';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { toast } from 'sonner';
// import { X, ExternalLink, Clock, Package, AlertTriangle } from 'lucide-react';
// import { superAdminApi, type DashboardStats, type Order, } from '@/lib/api/api';
// // ─────────────────────────────────────────────────────────────────────────────
// // Helpers
// // ─────────────────────────────────────────────────────────────────────────────

// function fmt(n?: number): string {
//   if (n == null) return '—';
//   if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
//   if (n >= 1_000) return n.toLocaleString();
//   return String(n);
// }

// function fmtCurrency(n?: number): string {
//   if (n == null) return '—';
//   return `₦${n.toLocaleString()}`;
// }

// function timeAgo(iso: string): string {
//   const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
//   if (diff < 60) return `${diff}s ago`;
//   if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
//   if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
//   return `${Math.floor(diff / 86400)}d ago`;
// }

// function statusBadgeClass(status: string): string {
//   const map: Record<string, string> = {
//     active: 'bg-blue-100 text-blue-700',
//     delivered: 'bg-green-100 text-green-700',
//     rejected: 'bg-red-100 text-red-700',
//     late: 'bg-orange-100 text-orange-700',
//     pending: 'bg-yellow-100 text-yellow-700',
//   };
//   return map[status] ?? 'bg-gray-100 text-gray-700';
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // Skeleton sub-components
// // ─────────────────────────────────────────────────────────────────────────────

// function StatsCardSkeleton() {
//   return (
//     <div className="rounded-2xl p-6 bg-[#98EF9B] flex items-start justify-between">
//       <div className="flex-1 space-y-3">
//         <div className="flex items-center gap-2">
//           <Skeleton className="w-8 h-8 rounded bg-black/10" />
//           <Skeleton className="w-24 h-9 rounded bg-black/10" />
//         </div>
//         <Skeleton className="w-32 h-5 rounded bg-black/10" />
//         <Skeleton className="w-48 h-4 rounded bg-black/10" />
//       </div>
//       <Skeleton className="w-5 h-5 rounded bg-black/10 mt-2" />
//     </div>
//   );
// }

// function NotificationSkeleton() {
//   return (
//     <div className="bg-[#98EF9B] rounded-xl p-4 flex items-center justify-between gap-4">
//       <div className="flex-1 space-y-2">
//         <Skeleton className="w-64 h-4 rounded bg-black/10" />
//         <Skeleton className="w-40 h-3 rounded bg-black/10" />
//         <Skeleton className="w-48 h-3 rounded bg-black/10" />
//       </div>
//       <Skeleton className="w-9 h-9 rounded-full bg-black/10" />
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // Notification Detail Drawer
// // Slides in from the right when a notification is clicked.
// // ─────────────────────────────────────────────────────────────────────────────

// interface NotificationDrawerProps {
//   order: Order | null;
//   onClose: () => void;
//   onViewFull: (id: string) => void;
// }

// function NotificationDrawer({ order, onClose, onViewFull }: NotificationDrawerProps) {
//   // Trap focus inside drawer for a11y
//   const ref = useRef<HTMLDivElement>(null);
//   useEffect(() => {
//     if (order) ref.current?.focus();
//   }, [order]);

//   const isVisible = order !== null;

//   return (
//     <>
//       {/* Backdrop */}
//       <div
//         onClick={onClose}
//         className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ${
//           isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
//         }`}
//       />

//       {/* Drawer panel */}
//       <div
//         ref={ref}
//         tabIndex={-1}
//         className={`fixed right-0 top-0 h-full w-full max-w-sm bg-background shadow-2xl z-50 flex flex-col
//           transition-transform duration-300 ease-in-out outline-none
//           ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between p-5 border-b border-border">
//           <h3 className="text-lg font-bold text-foreground">Order Detail</h3>
//           <button
//             onClick={onClose}
//             className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         {order && (
//           <div className="flex-1 overflow-y-auto p-5 space-y-5">

//             {/* Status badge */}
//             <div className="flex items-center gap-3">
//               <span
//                 className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${statusBadgeClass(
//                   order.status
//                 )}`}
//               >
//                 {order.status}
//               </span>
//               {order.status === 'late' && (
//                 <span className="flex items-center gap-1 text-orange-600 text-xs font-medium">
//                   <AlertTriangle size={13} /> Reported as late
//                 </span>
//               )}
//             </div>

//             {/* Order ID */}
//             <div className="bg-secondary rounded-xl p-4 space-y-3">
//               <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                 <Package size={15} />
//                 <span className="font-mono font-medium text-foreground">{order.id}</span>
//               </div>
//               <div className="flex items-center gap-2 text-xs text-muted-foreground">
//                 <Clock size={13} />
//                 {order.createdAt ? timeAgo(order.createdAt) : '—'}
//               </div>
//             </div>

//             {/* Parties */}
//             <div className="space-y-3">
//               <InfoRow label="Customer" value={order.customerName ?? order.customerId} />
//               <InfoRow label="Vendor" value={order.vendorName ?? order.vendorId} />
//               {order.riderName && (
//                 <InfoRow label="Rider" value={order.riderName} />
//               )}
//             </div>

//             {/* Amount */}
//             <div className="bg-[#98EF9B] rounded-xl p-4">
//               <p className="text-sm text-muted-foreground mb-1">Order Total</p>
//               <p className="text-2xl font-bold text-foreground">
//                 {fmtCurrency(order.totalAmount)}
//               </p>
//             </div>

//             {/* Items */}
//             {order.items && order.items.length > 0 && (
//               <div className="space-y-2">
//                 <p className="text-sm font-semibold text-foreground">Items</p>
//                 {order.items.map((item, i) => (
//                   <div
//                     key={i}
//                     className="flex justify-between items-center bg-secondary rounded-lg px-4 py-2 text-sm"
//                   >
//                     <span className="text-foreground">
//                       {item.name} × {item.quantity}
//                     </span>
//                     <span className="font-medium text-foreground">
//                       {fmtCurrency(item.price * item.quantity)}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}

//         {/* Footer CTA */}
//         {order && (
//           <div className="p-5 border-t border-border">
//             <Button
//               onClick={() => onViewFull(order.id)}
//               className="w-full bg-[#1A3F1C] hover:bg-[#1A3F1C]/90 text-white gap-2"
//             >
//               <ExternalLink size={16} />
//               View Full Order
//             </Button>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }

// function InfoRow({ label, value }: { label: string; value?: string }) {
//   return (
//     <div className="flex justify-between items-start gap-2">
//       <span className="text-sm text-muted-foreground shrink-0">{label}</span>
//       <span className="text-sm font-medium text-foreground text-right">{value ?? '—'}</span>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // Notification Item data shape (derived from orders)
// // ─────────────────────────────────────────────────────────────────────────────

// interface NotifItem {
//   id: string;           // order id
//   title: string;
//   subtitle: string;
//   meta: string;
//   isLate: boolean;
//   raw: Order;
// }

// function orderToNotif(order: Order): NotifItem {
//   const isLate = order.status === 'late';
//   return {
//     id: order.id,
//     title: isLate
//       ? `${order.customerName ?? 'Customer'} — Order reported as late`
//       : `${order.customerName ?? 'Customer'} placed order${order.vendorName ? ` from ${order.vendorName}` : ''}`,
//     subtitle: order.items?.[0]?.name ? `Choice: ${order.items[0].name}` : `Amount: ${fmtCurrency(order.totalAmount)}`,
//     meta: `Order ID: ${order.id}`,
//     isLate,
//     raw: order,
//   };
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // Notifications Section
// // ─────────────────────────────────────────────────────────────────────────────

// function NotificationsSection({ onShowAll }: { onShowAll: () => void }) {
//   const router = useRouter();
//   const [items, setItems] = useState<NotifItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [dismissed, setDismissed] = useState<Set<string>>(new Set());
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

//   useEffect(() => {
//     let cancelled = false;
//     setLoading(true);

//     superAdminApi.orders
//       .getAll({ page: 1, limit: 8, status: 'active' })
//       .then((res) => {
//         if (cancelled) return;
//         setItems((res.data ?? []).map(orderToNotif));
//       })
//       .catch(() => {
//         if (!cancelled) setItems([]);
//       })
//       .finally(() => {
//         if (!cancelled) setLoading(false);
//       });

//     return () => { cancelled = true; };
//   }, []);

//   const dismiss = (id: string) => {
//     setDismissed((prev) => new Set(prev).add(id));
//     toast.success('Notification dismissed');
//   };

//   const visible = items.filter((n) => !dismissed.has(n.id));

//   return (
//     <>
//       <div className="space-y-4">
//         <div className="flex justify-between items-center">
//           <div className="flex items-center gap-3">
//             <h2 className="text-2xl font-bold text-foreground">Notifications/Alerts</h2>
//             {!loading && visible.length > 0 && (
//               <span className="bg-[#1A3F1C] text-white text-xs font-bold px-2.5 py-1 rounded-full">
//                 {visible.length}
//               </span>
//             )}
//           </div>
//           <Button
//             onClick={onShowAll}
//             className="bg-[#1A3F1C] py-6 px-6 rounded-lg hover:bg-[#1A3F1C]/90 text-white cursor-pointer"
//           >
//             Show all
//           </Button>
//         </div>

//         <div className="space-y-3">
//           {loading ? (
//             Array.from({ length: 5 }).map((_, i) => <NotificationSkeleton key={i} />)
//           ) : visible.length === 0 ? (
//             <div className="bg-[#98EF9B] rounded-xl p-8 text-center">
//               <p className="text-muted-foreground">No notifications at the moment</p>
//             </div>
//           ) : (
//             visible.map((notif) => (
//               <div
//                 key={notif.id}
//                 onClick={() => setSelectedOrder(notif.raw)}
//                 className="cursor-pointer"
//               >
//                 <NotificationItem
//                   name={notif.title}
//                   message={notif.subtitle}
//                   orderInfo={notif.meta}
//                   rightAction={
//                     <Button
//                       size="icon"
//                       variant="ghost"
//                       className="bg-foreground text-background hover:bg-foreground/90 shrink-0"
//                       onClick={(e) => {
//                         e.stopPropagation(); // don't open drawer when dismissing
//                         dismiss(notif.id);
//                       }}
//                     >
//                       {notif.isLate ? '😊' : '🗑️'}
//                     </Button>
//                   }
//                 />
//               </div>
//             ))
//           )}
//         </div>
//       </div>

//       {/* Detail drawer */}
//       <NotificationDrawer
//         order={selectedOrder}
//         onClose={() => setSelectedOrder(null)}
//         onViewFull={(id) => {
//           setSelectedOrder(null);
//           router.push(`/superadmin/orders/${id}`);
//         }}
//       />
//     </>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // Main Dashboard Page
// // ─────────────────────────────────────────────────────────────────────────────

// export default function Dashboard() {
//   const router = useRouter();
//   const [timeframe, setTimeframe] = useState('weekly');
//   const [openModal, setOpenModal] = useState<string | null>(null);
//   const [stats, setStats] = useState<DashboardStats | null>(null);
//   const [statsLoading, setStatsLoading] = useState(true);
//   const [statsError, setStatsError] = useState<string | null>(null);

//   const fetchStats = useCallback(async () => {
//     setStatsLoading(true);
//     setStatsError(null);
//     try {
//       const data = await superAdminApi.dashboard.getStats();
//       setStats(data);
//     } catch (err: any) {
//       const msg = err?.message || 'Failed to load dashboard stats';
//       setStatsError(msg);
//       toast.error(msg);
//     } finally {
//       setStatsLoading(false);
//     }
//   }, []);

//   useEffect(() => { fetchStats(); }, [fetchStats]);

//   // All 7 stat cards — every subtext field now maps to a real DashboardStats key
//   const statCards = stats
//     ? [
//         {
//           icon: '👥',
//           value: 72,
//           label: 'Total Users',
//           subtext: `Active Users: ${fmt(stats.activeCustomers)} | Inactive Users: ${fmt(stats.inactiveCustomers)}`,
//           id: 'users',
//         },
//         {
//           icon: '📦',
//           value: fmt(stats.totalOrders),
//           label: 'Total Orders',
//           subtext: `${fmt(stats.deliveredOrders)} delivered | ${fmt(stats.activeOrders)} on delivery`,
//           id: 'orders',
//         },
//         {
//           icon: '🏪',
//           value: fmt(stats.totalVendors),
//           label: 'Total Vendors',
//           subtext: `${fmt(stats.activeVendors)} active | ${fmt(stats.suspendedVendors)} suspended`,
//           id: null,
//         },
//         {
//           icon: '💰',
//           value: fmtCurrency(stats.totalRevenue),
//           label: 'Total Revenue',
//           subtext: '',
//           id: 'revenue',
//         },
//         {
//           icon: '🚴',
//           value: fmt(stats.totalRiders),
//           label: 'Total Riders',
//           subtext: `Active Riders: ${fmt(stats.activeRiders)} | Available Riders: ${fmt(stats.availableRiders)}`,
//           id: null,
//         },
//         {
//           icon: '❓',
//           value: fmt(stats.totalQueries),
//           label: 'Total Queries',
//           subtext: `Awaiting Resolution: ${fmt(stats.pendingQueries)} | Resolved: ${fmt(stats.resolvedQueries)}`,
//           id: null,
//         },
//         {
//           icon: '⭐',
//           value: fmt(stats.totalRatings),
//           label: 'Total Ratings',
//           subtext: `Riders Ratings: ${fmt(stats.excellentRatings)} | Vendors Ratings: ${fmt(stats.goodRatings)}`,
//           id: 'ratings',
//         },
//       ]
//     : [];

//   return (
//     <div className="space-y-8">

//       {/* Header */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//         <h1 className="text-3xl md:text-4xl font-bold text-foreground">Dashboard</h1>
//         <Select value={timeframe} onValueChange={setTimeframe}>
//           <SelectTrigger className="w-full md:w-40 bg-[#98EF9B] text-black font-semibold">
//             <SelectValue />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="daily">Daily</SelectItem>
//             <SelectItem value="weekly">Weekly</SelectItem>
//             <SelectItem value="monthly">Monthly</SelectItem>
//             <SelectItem value="yearly">Yearly</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {statsLoading ? (
//           Array.from({ length: 7 }).map((_, i) => <StatsCardSkeleton key={i} />)
//         ) : statsError ? (
//           <div className="col-span-full bg-destructive/10 border border-destructive/20 rounded-2xl p-6 flex items-center justify-between gap-4">
//             <p className="text-destructive font-medium">{statsError}</p>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={fetchStats}
//               className="border-destructive text-destructive hover:bg-destructive/10 shrink-0"
//             >
//               Retry
//             </Button>
//           </div>
//         ) : (
//           statCards.map((stat, i) => (
//             <div
//               key={i}
//               onClick={() => stat.id && setOpenModal(stat.id)}
//               className={stat.id ? 'cursor-pointer transition-transform hover:scale-[1.02]' : ''}
//             >
//               <StatsCard {...stat} />
//             </div>
//           ))
//         )}
//       </div>

//       {/* Notifications */}
//       <NotificationsSection onShowAll={() => router.push('/admin/notifications')} />

//       {/* Modals */}
//       <RatingsModal
//         isOpen={openModal === 'ratings'}
//         onClose={() => setOpenModal(null)}
//         title="Ratings"
//       />
//       <OrdersModal
//         isOpen={openModal === 'orders'}
//         onClose={() => setOpenModal(null)}
//         title="Orders"
//       />
//       <UsersModal
//         isOpen={openModal === 'users'}
//         onClose={() => setOpenModal(null)}
//         title="Total Users"
//       />
//       <RevenueModal
//         isOpen={openModal === 'revenue'}
//         onClose={() => setOpenModal(null)}
//         title="Revenue"
//       />
//     </div>
//   );
// }


//second new

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import StatsCard from '@/components/dashboard/StatsCard';
import { NotificationItem } from '@/components/dashboard/NotificationItem';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  RatingsModal,
  OrdersModal,
  UsersModal,
  RevenueModal,
} from '@/components/dashboard/stat-modals';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { X, ExternalLink, Clock, Package, AlertTriangle } from 'lucide-react';
import {
  superAdminApi,
  type DashboardStats,
  type Order,
} from '@/lib/api/api';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function fmt(n?: number): string {
  if (n == null) return '—';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return n.toLocaleString();
  return String(n);
}

function fmtCurrency(n?: number): string {
  if (n == null) return '—';
  return `₦${n.toLocaleString()}`;
}

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function statusBadgeClass(status: string): string {
  const map: Record<string, string> = {
    active: 'bg-blue-100 text-blue-700',
    delivered: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    late: 'bg-orange-100 text-orange-700',
    pending: 'bg-yellow-100 text-yellow-700',
  };
  return map[status] ?? 'bg-gray-100 text-gray-700';
}

// ─────────────────────────────────────────────────────────────────────────────
// Skeleton sub-components
// ─────────────────────────────────────────────────────────────────────────────

function StatsCardSkeleton() {
  return (
    <div className="rounded-2xl p-6 bg-[#98EF9B] flex items-start justify-between">
      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="w-8 h-8 rounded bg-black/10" />
          <Skeleton className="w-24 h-9 rounded bg-black/10" />
        </div>
        <Skeleton className="w-32 h-5 rounded bg-black/10" />
        <Skeleton className="w-48 h-4 rounded bg-black/10" />
      </div>
      <Skeleton className="w-5 h-5 rounded bg-black/10 mt-2" />
    </div>
  );
}

function NotificationSkeleton() {
  return (
    <div className="bg-[#98EF9B] rounded-xl p-4 flex items-center justify-between gap-4">
      <div className="flex-1 space-y-2">
        <Skeleton className="w-64 h-4 rounded bg-black/10" />
        <Skeleton className="w-40 h-3 rounded bg-black/10" />
        <Skeleton className="w-48 h-3 rounded bg-black/10" />
      </div>
      <Skeleton className="w-9 h-9 rounded-full bg-black/10" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Notification Detail Drawer
// Slides in from the right when a notification is clicked.
// ─────────────────────────────────────────────────────────────────────────────

interface NotificationDrawerProps {
  order: Order | null;
  onClose: () => void;
  onViewFull: (id: string) => void;
}

function NotificationDrawer({ order, onClose, onViewFull }: NotificationDrawerProps) {
  // Trap focus inside drawer for a11y
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (order) ref.current?.focus();
  }, [order]);

  const isVisible = order !== null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer panel */}
      <div
        ref={ref}
        tabIndex={-1}
        className={`fixed right-0 top-0 h-full w-full max-w-sm bg-background shadow-2xl z-50 flex flex-col
          transition-transform duration-300 ease-in-out outline-none
          ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="text-lg font-bold text-foreground">Order Detail</h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
          >
            <X size={20} />
          </button>
        </div>

        {order && (
          <div className="flex-1 overflow-y-auto p-5 space-y-5">

            {/* Status badge */}
            <div className="flex items-center gap-3">
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${statusBadgeClass(
                  order.status
                )}`}
              >
                {order.status}
              </span>
              {order.status === 'late' && (
                <span className="flex items-center gap-1 text-orange-600 text-xs font-medium">
                  <AlertTriangle size={13} /> Reported as late
                </span>
              )}
            </div>

            {/* Order ID */}
            <div className="bg-secondary rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Package size={15} />
                <span className="font-mono font-medium text-foreground">{order.id}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock size={13} />
                {order.createdAt ? timeAgo(order.createdAt) : '—'}
              </div>
            </div>

            {/* Parties */}
            <div className="space-y-3">
              <InfoRow label="Customer" value={order.customerName ?? order.customerId} />
              <InfoRow label="Vendor" value={order.vendorName ?? order.vendorId} />
              {order.riderName && (
                <InfoRow label="Rider" value={order.riderName} />
              )}
            </div>

            {/* Amount */}
            <div className="bg-[#98EF9B] rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-1">Order Total</p>
              <p className="text-2xl font-bold text-foreground">
                {fmtCurrency(order.totalAmount)}
              </p>
            </div>

            {/* Items */}
            {order.items && order.items.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground">Items</p>
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center bg-secondary rounded-lg px-4 py-2 text-sm"
                  >
                    <span className="text-foreground">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-medium text-foreground">
                      {fmtCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer CTA */}
        {order && (
          <div className="p-5 border-t border-border">
            <Button
              onClick={() => onViewFull(order.id)}
              className="w-full bg-[#1A3F1C] hover:bg-[#1A3F1C]/90 text-white gap-2"
            >
              <ExternalLink size={16} />
              View Full Order
            </Button>
          </div>
        )}
      </div>
    </>
  );
}

function InfoRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex justify-between items-start gap-2">
      <span className="text-sm text-muted-foreground shrink-0">{label}</span>
      <span className="text-sm font-medium text-foreground text-right">{value ?? '—'}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Notification Item data shape (derived from orders)
// ─────────────────────────────────────────────────────────────────────────────

interface NotifItem {
  id: string;           // order id
  title: string;
  subtitle: string;
  meta: string;
  isLate: boolean;
  raw: Order;
}

function orderToNotif(order: Order): NotifItem {
  const isLate = order.status === 'late';
  return {
    id: order.id,
    title: isLate
      ? `${order.customerName ?? 'Customer'} — Order reported as late`
      : `${order.customerName ?? 'Customer'} placed order${order.vendorName ? ` from ${order.vendorName}` : ''}`,
    subtitle: order.items?.[0]?.name ? `Choice: ${order.items[0].name}` : `Amount: ${fmtCurrency(order.totalAmount)}`,
    meta: `Order ID: ${order.id}`,
    isLate,
    raw: order,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Notifications Section
// ─────────────────────────────────────────────────────────────────────────────

function NotificationsSection({ onShowAll }: { onShowAll: () => void }) {
  const router = useRouter();
  const [items, setItems] = useState<NotifItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    superAdminApi.orders
      .getAll({ page: 1, limit: 8, status: 'active' })
      .then((res) => {
        if (cancelled) return;
        setItems((res.data ?? []).map(orderToNotif));
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const dismiss = (id: string) => {
    setDismissed((prev) => new Set(prev).add(id));
    toast.success('Notification dismissed');
  };

  const visible = items.filter((n) => !dismissed.has(n.id));

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-foreground">Notifications/Alerts</h2>
            {!loading && visible.length > 0 && (
              <span className="bg-[#1A3F1C] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                {visible.length}
              </span>
            )}
          </div>
          <Button
            onClick={onShowAll}
            className="bg-[#1A3F1C] py-6 px-6 rounded-lg hover:bg-[#1A3F1C]/90 text-white cursor-pointer"
          >
            Show all
          </Button>
        </div>

        <div className="space-y-3">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <NotificationSkeleton key={i} />)
          ) : visible.length === 0 ? (
            <div className="bg-[#98EF9B] rounded-xl p-8 text-center">
              <p className="text-muted-foreground">No notifications at the moment</p>
            </div>
          ) : (
            visible.map((notif) => (
              <div
                key={notif.id}
                onClick={() => setSelectedOrder(notif.raw)}
                className="cursor-pointer"
              >
                <NotificationItem
                  name={notif.title}
                  message={notif.subtitle}
                  orderInfo={notif.meta}
                  rightAction={
                    <Button
                      size="icon"
                      variant="ghost"
                      className="bg-foreground text-background hover:bg-foreground/90 shrink-0"
                      onClick={(e) => {
                        e.stopPropagation(); // don't open drawer when dismissing
                        dismiss(notif.id);
                      }}
                    >
                      {notif.isLate ? '😊' : '🗑️'}
                    </Button>
                  }
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Detail drawer */}
      <NotificationDrawer
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onViewFull={(id) => {
          setSelectedOrder(null);
          router.push(`/superadmin/orders/${id}`);
        }}
      />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Dashboard Page
// ─────────────────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const router = useRouter();
  const [timeframe, setTimeframe] = useState('weekly');
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    setStatsError(null);
    try {
      // Response is: { data: { users, orders, ratings, queries, revenue } }
      const res = await superAdminApi.dashboard.getStats();
      setStats(res.data);
    } catch (err: any) {
      const msg = err?.message || 'Failed to load dashboard stats';
      setStatsError(msg);
      toast.error(msg);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  // Stats are nested: stats.users, stats.orders, stats.ratings, stats.queries, stats.revenue
  const statCards = stats
    ? [
        {
          icon: '\u{1F465}',
          value: fmt(stats.users.customers),
          label: 'Total Users',
          subtext: `Active Users: ${fmt(stats.users.activeCustomers)} | Inactive Users: ${fmt(stats.users.inactiveCustomers)}`,
          id: 'users',
        },
        {
          icon: '\u{1F4E6}',
          value: fmt(stats.orders.total),
          label: 'Total Orders',
          subtext: `${fmt(stats.orders.deliveredOrders)} delivered | ${fmt(stats.orders.active)} on delivery`,
          id: 'orders',
        },
        {
          icon: '\u{1F3EA}',
          value: fmt(stats.users.vendors),
          label: 'Total Vendors',
          subtext: `${fmt(stats.users.activeVendors)} active | ${fmt(stats.users.suspendedVendors)} suspended`,
          id: null,
        },
        {
          icon: '\u{1F4B0}',
          value: fmtCurrency(stats.revenue.gross),
          label: 'Total Revenue',
          subtext: '',
          id: 'revenue',
        },
        {
          icon: '\u{1F6B4}',
          value: fmt(stats.users.riders),
          label: 'Total Riders',
          subtext: `Active Riders: ${fmt(stats.users.activeRiders)} | Available Riders: ${fmt(stats.users.availableRiders)}`,
          id: null,
        },
        {
          icon: '\u2753',
          value: fmt(stats.queries.totalQueries),
          label: 'Total Queries',
          subtext: `Awaiting Resolution: ${fmt(stats.queries.pendingQueries)} | Resolved: ${fmt(stats.queries.resolvedQueries)}`,
          id: null,
        },
        {
          icon: '\u2B50',
          value: fmt(stats.ratings.totalRatings),
          label: 'Total Ratings',
          subtext: `Excellent Ratings: ${fmt(stats.ratings.excellentRatings)} | Good Ratings: ${fmt(stats.ratings.goodRatings)}`,
          id: 'ratings',
        },
      ]
    : [];

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Dashboard</h1>
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-full md:w-40 bg-[#98EF9B] text-black font-semibold">
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsLoading ? (
          Array.from({ length: 7 }).map((_, i) => <StatsCardSkeleton key={i} />)
        ) : statsError ? (
          <div className="col-span-full bg-destructive/10 border border-destructive/20 rounded-2xl p-6 flex items-center justify-between gap-4">
            <p className="text-destructive font-medium">{statsError}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchStats}
              className="border-destructive text-destructive hover:bg-destructive/10 shrink-0"
            >
              Retry
            </Button>
          </div>
        ) : (
          statCards.map((stat, i) => (
            <div
              key={i}
              onClick={() => stat.id && setOpenModal(stat.id)}
              className={stat.id ? 'cursor-pointer transition-transform hover:scale-[1.02]' : ''}
            >
              <StatsCard {...stat} />
            </div>
          ))
        )}
      </div>

      {/* Notifications */}
      <NotificationsSection onShowAll={() => router.push('/admin/notifications')} />

      {/* Modals */}
      <RatingsModal
        isOpen={openModal === 'ratings'}
        onClose={() => setOpenModal(null)}
        title="Ratings"
      />
      <OrdersModal
        isOpen={openModal === 'orders'}
        onClose={() => setOpenModal(null)}
        title="Orders"
      />
      <UsersModal
        isOpen={openModal === 'users'}
        onClose={() => setOpenModal(null)}
        title="Total Users"
      />
      <RevenueModal
        isOpen={openModal === 'revenue'}
        onClose={() => setOpenModal(null)}
        title="Revenue"
      />
    </div>
  );
}