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
// import { NotificationItem } from '@/components/dashboard/NotificationItem';
import NotificationItem from '@/components/dashboard/NotificationItem';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  UsersRound,

} from "lucide-react";
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
          icon: (<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="20" fill="#FFCA3A"/>
          <path d="M20 12C21.0609 12 22.0783 12.4214 22.8284 13.1716C23.5786 13.9217 24 14.9391 24 16C24 17.0609 23.5786 18.0783 22.8284 18.8284C22.0783 19.5786 21.0609 20 20 20C18.9391 20 17.9217 19.5786 17.1716 18.8284C16.4214 18.0783 16 17.0609 16 16C16 14.9391 16.4214 13.9217 17.1716 13.1716C17.9217 12.4214 18.9391 12 20 12ZM20 22C24.42 22 28 23.79 28 26V28H12V26C12 23.79 15.58 22 20 22Z" fill="#1A3F1C"/>
          </svg>
          ),
          value: fmt(stats.users.customers),
          label: 'Total Users',
          subtext: `Active Users: ${fmt(stats.users.activeCustomers)} | Inactive Users: ${fmt(stats.users.inactiveCustomers)}`,
          id: 'users',
        },
        {
          icon: (<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="20" fill="#FFCA3A"/>
          <path d="M29 24C29 19.375 25.493 15.559 21 15.059V13H19V15.059C14.507 15.559 11 19.375 11 24V26H29V24ZM10 27H30V29H10V27Z" fill="#1A3F1C"/>
          </svg>
          ),
          value: fmt(stats.orders.total),
          label: 'Total Orders',
          subtext: `${fmt(stats.orders.deliveredOrders)} delivered | ${fmt(stats.orders.active)} on delivery`,
          id: 'orders',
        },
        {
          icon: (<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="20" fill="#FFCA3A"/>
          <path d="M29 24C29 19.375 25.493 15.559 21 15.059V13H19V15.059C14.507 15.559 11 19.375 11 24V26H29V24ZM10 27H30V29H10V27Z" fill="#1A3F1C"/>
          </svg>
          ),
          value: fmt(stats.users.vendors),
          label: 'Total Vendors',
          subtext: `${fmt(stats.users.activeVendors)} active | ${fmt(stats.users.suspendedVendors)} suspended`,
          id: null,
        },
        {
          icon: (
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="20" fill="#FFCA3A"/>
            <path d="M30.8975 13.6253C30.7895 13.5579 30.6662 13.5191 30.5391 13.5126C30.412 13.506 30.2853 13.5319 30.1709 13.5878C26.1462 15.5566 23.2719 14.6341 20.2334 13.661C17.0375 12.6438 13.7375 11.5891 9.17094 13.8185C9.04482 13.88 8.93851 13.9758 8.8641 14.0948C8.78969 14.2138 8.75016 14.3512 8.75 14.4916V25.735C8.74998 25.8623 8.78234 25.9874 8.84404 26.0987C8.90573 26.21 8.99472 26.3038 9.10265 26.3712C9.21057 26.4386 9.33388 26.4775 9.46096 26.4841C9.58804 26.4907 9.71471 26.4649 9.82906 26.4091C13.8538 24.4403 16.7281 25.3628 19.7712 26.336C21.575 26.9125 23.4125 27.5003 25.49 27.5003C27.0922 27.5003 28.8397 27.1516 30.8253 26.1822C30.9514 26.1206 31.0577 26.0249 31.1322 25.9059C31.2066 25.7869 31.2461 25.6494 31.2463 25.5091V14.2656C31.2474 14.1381 31.2159 14.0123 31.1549 13.9003C31.0939 13.7882 31.0053 13.6936 30.8975 13.6253ZM12.5 22.2503C12.5 22.4492 12.421 22.64 12.2803 22.7807C12.1397 22.9213 11.9489 23.0003 11.75 23.0003C11.5511 23.0003 11.3603 22.9213 11.2197 22.7807C11.079 22.64 11 22.4492 11 22.2503V16.2503C11 16.0514 11.079 15.8607 11.2197 15.72C11.3603 15.5794 11.5511 15.5003 11.75 15.5003C11.9489 15.5003 12.1397 15.5794 12.2803 15.72C12.421 15.8607 12.5 16.0514 12.5 16.2503V22.2503ZM20 23.0003C19.4067 23.0003 18.8266 22.8244 18.3333 22.4947C17.8399 22.1651 17.4554 21.6966 17.2284 21.1484C17.0013 20.6002 16.9419 19.997 17.0576 19.4151C17.1734 18.8331 17.4591 18.2986 17.8787 17.879C18.2982 17.4595 18.8328 17.1737 19.4147 17.058C19.9967 16.9422 20.5999 17.0016 21.1481 17.2287C21.6962 17.4558 22.1648 17.8403 22.4944 18.3336C22.8241 18.827 23 19.407 23 20.0003C23 20.796 22.6839 21.559 22.1213 22.1217C21.5587 22.6843 20.7956 23.0003 20 23.0003ZM29 23.7503C29 23.9492 28.921 24.14 28.7803 24.2807C28.6397 24.4213 28.4489 24.5003 28.25 24.5003C28.0511 24.5003 27.8603 24.4213 27.7197 24.2807C27.579 24.14 27.5 23.9492 27.5 23.7503V17.7503C27.5 17.5514 27.579 17.3607 27.7197 17.22C27.8603 17.0794 28.0511 17.0003 28.25 17.0003C28.4489 17.0003 28.6397 17.0794 28.7803 17.22C28.921 17.3607 29 17.5514 29 17.7503V23.7503Z" fill="#1A3F1C"/>
            </svg>
          ),
          value: fmtCurrency(stats.revenue.gross),
          label: 'Total Revenue',
          subtext: '',
          id: 'revenue',
        },
        {
          icon: (
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="20" fill="#FFCA3A"/>
            <path d="M13 22C13.7911 22 14.5645 22.2346 15.2223 22.6741C15.8801 23.1136 16.3928 23.7384 16.6955 24.4693C16.9983 25.2002 17.0775 26.0044 16.9231 26.7804C16.7688 27.5563 16.3878 28.269 15.8284 28.8284C15.269 29.3878 14.5563 29.7688 13.7804 29.9231C13.0044 30.0775 12.2002 29.9983 11.4693 29.6955C10.7384 29.3928 10.1136 28.8801 9.67412 28.2223C9.2346 27.5645 9 26.7911 9 26L9.005 25.8C9.05631 24.775 9.4996 23.809 10.2432 23.1017C10.9868 22.3944 11.9738 22 13 22ZM27 22C27.7911 22 28.5645 22.2346 29.2223 22.6741C29.8801 23.1136 30.3928 23.7384 30.6955 24.4693C30.9983 25.2002 31.0775 26.0044 30.9231 26.7804C30.7688 27.5563 30.3878 28.269 29.8284 28.8284C29.269 29.3878 28.5563 29.7688 27.7804 29.9231C27.0044 30.0775 26.2002 29.9983 25.4693 29.6955C24.7384 29.3928 24.1136 28.8801 23.6741 28.2223C23.2346 27.5645 23 26.7911 23 26L23.005 25.8C23.0563 24.775 23.4996 23.809 24.2432 23.1017C24.9868 22.3944 25.9738 22 27 22Z" fill="#1A3F1C"/>
            <path d="M22.832 15.445L24.535 18H27C27.2449 18 27.4813 18.09 27.6644 18.2527C27.8474 18.4155 27.9643 18.6397 27.993 18.883L28 19C28 19.2652 27.8946 19.5196 27.7071 19.7071C27.5196 19.8946 27.2652 20 27 20H24C23.8354 20 23.6734 19.9594 23.5282 19.8818C23.3831 19.8042 23.2593 19.6919 23.168 19.555L21.772 17.462L18.497 20.082L20.707 22.292C20.8626 22.4478 20.9624 22.6506 20.991 22.869L21 23V27C21 27.2652 20.8946 27.5196 20.7071 27.7071C20.5196 27.8946 20.2652 28 20 28C19.7348 28 19.4804 27.8946 19.2929 27.7071C19.1054 27.5196 19 27.2652 19 27V23.415L16.293 20.707C16.1075 20.5213 16.0025 20.27 16.0007 20.0075C15.9988 19.7451 16.1002 19.4924 16.283 19.304L16.375 19.219L21.375 15.219C21.4832 15.1324 21.6083 15.0692 21.7423 15.0334C21.8763 14.9977 22.0162 14.9902 22.1532 15.0115C22.2902 15.0327 22.4213 15.0823 22.5382 15.1569C22.655 15.2315 22.7551 15.3296 22.832 15.445ZM25 11C25.3956 11 25.7822 11.1173 26.1111 11.3371C26.44 11.5568 26.6964 11.8692 26.8478 12.2346C26.9991 12.6001 27.0387 13.0022 26.9616 13.3902C26.8844 13.7781 26.6939 14.1345 26.4142 14.4142C26.1345 14.6939 25.7781 14.8844 25.3902 14.9616C25.0022 15.0387 24.6001 14.9991 24.2346 14.8478C23.8692 14.6964 23.5568 14.44 23.3371 14.1111C23.1173 13.7822 23 13.3956 23 13L23.005 12.85C23.0428 12.3468 23.2695 11.8766 23.6395 11.5335C24.0094 11.1904 24.4954 10.9998 25 11Z" fill="#1A3F1C"/>
            </svg>
          ),
          value: fmt(stats.users.riders),
          label: 'Total Riders',
          subtext: `Active Riders: ${fmt(stats.users.activeRiders)} | Available Riders: ${fmt(stats.users.availableRiders)}`,
          id: null,
        },
        {
          icon: (
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="20" fill="#FFCA3A"/>
            <path d="M29 11V32H11V11H17C17 10.5859 17.0781 10.1992 17.2344 9.83984C17.3906 9.48047 17.6055 9.16016 17.8789 8.87891C18.1523 8.59766 18.4688 8.38281 18.8281 8.23438C19.1875 8.08594 19.5781 8.00781 20 8C20.4141 8 20.8008 8.07812 21.1602 8.23438C21.5195 8.39062 21.8398 8.60547 22.1211 8.87891C22.4023 9.15234 22.6172 9.46875 22.7656 9.82812C22.9141 10.1875 22.9922 10.5781 23 11H29ZM15.5 14H24.5V12.5H21.5V11C21.5 10.7891 21.4609 10.5938 21.3828 10.4141C21.3047 10.2344 21.1992 10.0781 21.0664 9.94531C20.9336 9.8125 20.7734 9.70312 20.5859 9.61719C20.3984 9.53125 20.2031 9.49219 20 9.5C19.7891 9.5 19.5938 9.53906 19.4141 9.61719C19.2344 9.69531 19.0781 9.80078 18.9453 9.93359C18.8125 10.0664 18.7031 10.2266 18.6172 10.4141C18.5312 10.6016 18.4922 10.7969 18.5 11V12.5H15.5V14ZM20 26H18.5V27.5H20V26ZM20 17H18.5V24.5H20V17Z" fill="#1A3F1C"/>
            </svg>
          ),
          value: fmt(stats.queries.totalQueries),
          label: 'Total Queries',
          subtext: `Awaiting Resolution: ${fmt(stats.queries.pendingQueries)} | Resolved: ${fmt(stats.queries.resolvedQueries)}`,
          id: null,
        },
        {
          icon: (
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="20" fill="#FFCA3A"/>
          <g clipPath="url(#clip0_9006_10568)">
          <path d="M14.322 18.1003L13.459 17.6503C13.3891 17.6138 13.3114 17.5948 13.2325 17.5948C13.1537 17.5948 13.076 17.6138 13.006 17.6503L10.991 18.7003C10.9111 18.7421 10.8212 18.761 10.7312 18.755C10.6413 18.749 10.5547 18.7183 10.481 18.6663C10.4079 18.615 10.3509 18.5439 10.3167 18.4614C10.2825 18.3788 10.2726 18.2883 10.288 18.2003L10.675 15.9543C10.6882 15.8786 10.6826 15.8008 10.6587 15.7277C10.6348 15.6547 10.5934 15.5886 10.538 15.5353L8.89403 13.9453C8.84606 13.899 8.80845 13.8431 8.78366 13.7812C8.75888 13.7193 8.74748 13.6529 8.75022 13.5863C8.75296 13.5197 8.76977 13.4544 8.79956 13.3948C8.82934 13.3351 8.87142 13.2825 8.92303 13.2403C8.99216 13.1842 9.07502 13.1476 9.16303 13.1343L11.426 12.8073C11.5034 12.7965 11.5771 12.7671 11.6405 12.7214C11.7039 12.6757 11.7553 12.6153 11.79 12.5453L12.8 10.5113C12.84 10.4305 12.9019 10.3627 12.9787 10.3154C13.0554 10.2682 13.1439 10.2436 13.234 10.2443M25.678 18.1003L26.541 17.6503C26.611 17.6138 26.6887 17.5948 26.7675 17.5948C26.8464 17.5948 26.9241 17.6138 26.994 17.6503L29.009 18.7003C29.0889 18.7421 29.1788 18.761 29.2688 18.755C29.3588 18.749 29.4454 18.7183 29.519 18.6663C29.5922 18.615 29.6491 18.5439 29.6833 18.4614C29.7175 18.3788 29.7275 18.2883 29.712 18.2003L29.325 15.9543C29.3119 15.8786 29.3175 15.8008 29.3414 15.7277C29.3652 15.6547 29.4067 15.5886 29.462 15.5353L31.106 13.9403C31.1541 13.8942 31.1918 13.8383 31.2167 13.7765C31.2416 13.7147 31.253 13.6483 31.2503 13.5817C31.2475 13.5152 31.2307 13.4499 31.2008 13.3904C31.1709 13.3308 31.1287 13.2783 31.077 13.2363C31.0079 13.1802 30.925 13.1436 30.837 13.1303L28.574 12.8033C28.4966 12.7925 28.423 12.7631 28.3595 12.7174C28.2961 12.6717 28.2448 12.6113 28.21 12.5413L27.2 10.5113C27.16 10.4305 27.0981 10.3627 27.0214 10.3154C26.9446 10.2682 26.8561 10.2436 26.766 10.2443M15.877 23.4473V24.4473C15.9159 25.5985 15.617 26.7359 15.017 27.7193M24.124 23.4473V24.4473C24.0848 25.5984 24.3834 26.7358 24.983 27.7193M15.888 23.6653C16.6692 23.6601 17.4402 23.488 18.1494 23.1605C18.8586 22.833 19.4896 22.3576 20 21.7663C20.5104 22.3578 21.1413 22.8333 21.8505 23.161C22.5597 23.4887 23.3308 23.661 24.112 23.6663M19.566 9.01728C19.6065 8.93691 19.6685 8.86937 19.7452 8.82218C19.8218 8.77499 19.91 8.75 20 8.75C20.09 8.75 20.1782 8.77499 20.2549 8.82218C20.3315 8.86937 20.3935 8.93691 20.434 9.01728L21.443 11.0513C21.4777 11.1212 21.5289 11.1815 21.5921 11.2272C21.6554 11.2728 21.7288 11.3024 21.806 11.3133L24.07 11.6403C24.1585 11.6526 24.2418 11.6893 24.3105 11.7464C24.3792 11.8035 24.4307 11.8786 24.459 11.9633C24.4869 12.0476 24.4904 12.1381 24.469 12.2243C24.4475 12.3105 24.4021 12.3888 24.338 12.4503L22.7 14.0443C22.6445 14.0975 22.6029 14.1635 22.5788 14.2366C22.5548 14.3096 22.549 14.3875 22.562 14.4633L22.95 16.7103C22.9652 16.7982 22.955 16.8886 22.9206 16.971C22.8862 17.0533 22.8292 17.1242 22.756 17.1753C22.6826 17.2273 22.5962 17.2581 22.5064 17.2642C22.4167 17.2704 22.3269 17.2517 22.247 17.2103L20.226 16.1563C20.1565 16.1192 20.0789 16.0997 20 16.0997C19.9212 16.0997 19.8436 16.1192 19.774 16.1563L17.758 17.2103C17.6986 17.2413 17.6333 17.2597 17.5664 17.2644C17.4995 17.269 17.4323 17.2598 17.3691 17.2372C17.3059 17.2147 17.2481 17.1794 17.1992 17.1334C17.1503 17.0875 17.1114 17.0319 17.085 16.9703C17.0521 16.8878 17.0418 16.7981 17.055 16.7103L17.443 14.4633C17.4562 14.3873 17.4506 14.3093 17.4265 14.236C17.4024 14.1628 17.3607 14.0966 17.305 14.0433L15.662 12.4503C15.6139 12.4042 15.5761 12.3485 15.5511 12.2867C15.5262 12.2249 15.5146 12.1585 15.5173 12.092C15.5199 12.0254 15.5367 11.9601 15.5665 11.9005C15.5963 11.8409 15.6384 11.7884 15.69 11.7463C15.7592 11.6902 15.842 11.6536 15.93 11.6403L18.194 11.3133C18.2713 11.3024 18.3447 11.2728 18.4079 11.2272C18.4712 11.1815 18.5224 11.1212 18.557 11.0513L19.566 9.01728Z" stroke="#1A3F1C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M25.047 31.2499C24.3509 30.4616 23.4815 29.8454 22.507 29.4499L20 31.2109L17.493 29.4539C16.5237 29.8462 15.658 30.4567 14.963 31.2379M15.875 23.3359C15.875 24.43 16.3096 25.4792 17.0832 26.2528C17.8568 27.0263 18.906 27.4609 20 27.4609C21.094 27.4609 22.1432 27.0263 22.9168 26.2528C23.6904 25.4792 24.125 24.43 24.125 23.3359C24.125 22.2419 23.6904 21.1927 22.9168 20.4191C22.1432 19.6455 21.094 19.2109 20 19.2109C18.906 19.2109 17.8568 19.6455 17.0832 20.4191C16.3096 21.1927 15.875 22.2419 15.875 23.3359Z" stroke="#1A3F1C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </g>
          <defs>
          <clipPath id="clip0_9006_10568">
          <rect width="24" height="24" fill="white" transform="translate(8 8)"/>
          </clipPath>
          </defs>
          </svg>
          ),
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
          <SelectTrigger className="w-full md:w-40 bg-[#98EF9B] text-black font-semibold cursor-pointer">
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