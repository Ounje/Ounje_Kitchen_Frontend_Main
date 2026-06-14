// 'use client';

// import { useState } from 'react';

// interface BaseModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   title: string;
// }

// // Ratings Modal
// export function RatingsModal({ isOpen, onClose, title }: BaseModalProps) {
//   const [selectedRating, setSelectedRating] = useState<number | null>(null);

//   const ratingsData = [
//     {
//       id: 1,
//       name: "Sarah's Order",
//       vendor: 'Iya Bolu',
//       type: 'Tray Builder',
//       review:
//         'Great food and speedy delivery. Your item fresh and on time. I recommend this vendor to every one around me.',
//       rating: 5,
//       image: 'https://i.pravatar.cc/150?img=1',
//     },
//     {
//       id: 2,
//       name: "Chad's Order",
//       vendor: 'Iya Bolu',
//       type: 'Tray Builder',
//       review:
//         'Great food and speedy delivery. Your item fresh and on time.',
//       rating: 4,
//       image: 'https://i.pravatar.cc/150?img=2',
//     },
//     {
//       id: 3,
//       name: 'Harlod\'s Order',
//       vendor: 'Iya Bolu',
//       type: 'Tray Builder',
//       review:
//         'Great food and speedy delivery. Your item fresh and on time. I recommend this vendor to every one around me.',
//       rating: 5,
//       image: 'https://i.pravatar.cc/150?img=3',
//     },
//     {
//       id: 4,
//       name: 'Josepha\'s Order',
//       vendor: 'Iya Bolu',
//       type: 'Tray Builder',
//       review:
//         'Good food but the delivery went late. Your item fresh and on time.',
//       rating: 4,
//       image: 'https://i.pravatar.cc/150?img=4',
//     },
//     {
//       id: 5,
//       name: 'Zika\'s Order',
//       vendor: 'Iya Bolu',
//       type: 'Tray Builder',
//       review:
//         'Great food and speedy delivery. Your item fresh and on time. I recommend this vendor to every one around me.',
//       rating: 5,
//       image: 'https://i.pravatar.cc/150?img=5',
//     },
//     {
//       id: 6,
//       name: 'Mason\'s Order',
//       vendor: 'Iya Bolu',
//       type: 'Tray Builder',
//       review:
//         'Great food and speedy delivery. Your item fresh and on time.',
//       rating: 4,
//       image: 'https://i.pravatar.cc/150?img=6',
//     },
//   ];

//   const ratingCounts = { 5: 100, 4: 200, 3: 100, 2: 30, 1: 22 };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//       <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="sticky top-0 bg-background border-b border-border p-6 flex justify-between items-center">
//           <h2 className="text-2xl font-bold text-foreground">{title}</h2>
//           <button
//             onClick={onClose}
//             className="text-muted-foreground hover:text-foreground transition-colors"
//           >
//             ✕
//           </button>
//         </div>

//         <div className="p-6 space-y-6">
//           {/* Star Filter */}
//           <div className="flex gap-2 flex-wrap">
//             {[5, 4, 3, 2, 1].map((star) => (
//               <button
//                 key={star}
//                 onClick={() => setSelectedRating(selectedRating === star ? null : star)}
//                 className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//                   selectedRating === star
//                     ? 'bg-primary text-primary-foreground'
//                     : 'bg-secondary text-secondary-foreground hover:opacity-80'
//                 }`}
//               >
//                 {star} Star{star !== 1 ? 's' : ''}
//               </button>
//             ))}
//           </div>

//           {/* Total Ratings Count */}
//           <div className="text-center">
//             <p className="text-sm text-muted-foreground">Total Ratings</p>
//             <p className="text-3xl font-bold text-primary">452</p>
//           </div>

//           {/* Ratings Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {ratingsData.map((rating) => (
//               <div key={rating.id} className="bg-secondary rounded-lg p-4 space-y-3">
//                 <div className="flex gap-3">
//                   <img
//                     src={rating.image}
//                     alt={rating.name}
//                     className="w-12 h-12 rounded-lg object-cover"
//                   />
//                   <div className="flex-1">
//                     <p className="font-semibold text-foreground">{rating.name}</p>
//                     <p className="text-xs text-muted-foreground">
//                       Vendor: {rating.vendor} | Type: {rating.type}
//                     </p>
//                   </div>
//                   <span className="text-lg">{'⭐'.repeat(rating.rating)}</span>
//                 </div>
//                 <p className="text-sm text-foreground line-clamp-2">{rating.review}</p>
//               </div>
//             ))}
//           </div>

//           {/* View All Button */}
//           <button
//             onClick={onClose}
//             className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
//           >
//             View All
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Orders Modal
// export function OrdersModal({ isOpen, onClose, title }: BaseModalProps) {
//   const [selectedTab, setSelectedTab] = useState<'active' | 'delivered' | 'rejected'>(
//     'active'
//   );

//   const ordersData = {
//     active: [
//       {
//         id: 1,
//         name: 'South\'s Order',
//         amount: 5600,
//         vendor: 'Iya Bolu',
//         image: 'https://i.pravatar.cc/150?img=10',
//       },
//       {
//         id: 2,
//         name: 'South\'s Order',
//         amount: 5600,
//         vendor: 'Iya Bolu',
//         image: 'https://i.pravatar.cc/150?img=11',
//       },
//       {
//         id: 3,
//         name: 'South\'s Order',
//         amount: 5600,
//         vendor: 'Iya Bolu',
//         image: 'https://i.pravatar.cc/150?img=12',
//       },
//     ],
//     delivered: [
//       {
//         id: 4,
//         name: 'South\'s Order',
//         amount: 3200,
//         vendor: 'Iya Bolu',
//         image: 'https://i.pravatar.cc/150?img=13',
//       },
//       {
//         id: 5,
//         name: 'South\'s Order',
//         amount: 4500,
//         vendor: 'Iya Bolu',
//         image: 'https://i.pravatar.cc/150?img=14',
//       },
//       {
//         id: 6,
//         name: 'South\'s Order',
//         amount: 5600,
//         vendor: 'Iya Bolu',
//         image: 'https://i.pravatar.cc/150?img=15',
//       },
//     ],
//     rejected: [
//       {
//         id: 7,
//         name: 'South\'s Order',
//         amount: 2800,
//         vendor: 'Iya Bolu',
//         image: 'https://i.pravatar.cc/150?img=16',
//       },
//       {
//         id: 8,
//         name: 'South\'s Order',
//         amount: 3100,
//         vendor: 'Iya Bolu',
//         image: 'https://i.pravatar.cc/150?img=17',
//       },
//       {
//         id: 9,
//         name: 'South\'s Order',
//         amount: 4200,
//         vendor: 'Iya Bolu',
//         image: 'https://i.pravatar.cc/150?img=18',
//       },
//     ],
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//       <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="sticky top-0 bg-background border-b border-border p-6 flex justify-between items-center">
//           <h2 className="text-2xl font-bold text-foreground">{title}</h2>
//           <button
//             onClick={onClose}
//             className="text-muted-foreground hover:text-foreground transition-colors"
//           >
//             ✕
//           </button>
//         </div>

//         <div className="p-6 space-y-6">
//           {/* Tabs */}
//           <div className="flex gap-2 flex-wrap">
//             {[
//               { id: 'active' as const, label: 'Active Orders' },
//               { id: 'delivered' as const, label: 'Delivered Orders' },
//               { id: 'rejected' as const, label: 'Rejected/Reported' },
//             ].map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => setSelectedTab(tab.id)}
//                 className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//                   selectedTab === tab.id
//                     ? 'bg-primary text-primary-foreground'
//                     : 'bg-secondary text-secondary-foreground hover:opacity-80'
//                 }`}
//               >
//                 {tab.label}
//               </button>
//             ))}
//           </div>

//           {/* Orders Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             {ordersData[selectedTab].map((order) => (
//               <div
//                 key={order.id}
//                 className="bg-secondary rounded-lg p-4 space-y-3 flex flex-col"
//               >
//                 <img
//                   src={order.image}
//                   alt={order.name}
//                   className="w-full h-24 rounded-lg object-cover"
//                 />
//                 <div className="flex-1">
//                   <p className="font-semibold text-foreground text-sm">{order.name}</p>
//                   <p className="text-xs text-muted-foreground">Vendor: {order.vendor}</p>
//                   <p className="text-sm font-medium text-primary">₦{order.amount.toLocaleString()}</p>
//                 </div>
//                 <button className="text-muted-foreground hover:text-foreground text-lg">
//                   ⋮
//                 </button>
//               </div>
//             ))}
//           </div>

//           {/* View All Button */}
//           <button
//             onClick={onClose}
//             className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
//           >
//             View All
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Users Modal
// export function UsersModal({ isOpen, onClose, title }: BaseModalProps) {
//   const [selectedTab, setSelectedTab] = useState<'customers' | 'vendors' | 'riders'>(
//     'customers'
//   );

//   const usersData = {
//     customers: Array.from({ length: 9 }, (_, i) => ({
//       id: i + 1,
//       name: 'Shila Madu',
//       phone: '09076542335',
//       orders: 5,
//       image: `https://i.pravatar.cc/150?img=${20 + i}`,
//     })),
//     vendors: Array.from({ length: 9 }, (_, i) => ({
//       id: i + 10,
//       name: 'Shila Madu',
//       phone: '09076542335',
//       orders: 5,
//       image: `https://i.pravatar.cc/150?img=${30 + i}`,
//     })),
//     riders: Array.from({ length: 9 }, (_, i) => ({
//       id: i + 19,
//       name: 'Shila Madu',
//       phone: '09076542335',
//       orders: 5,
//       image: `https://i.pravatar.cc/150?img=${40 + i}`,
//     })),
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//       <div className="bg-background rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="sticky top-0 bg-background border-b border-border p-6 flex justify-between items-center">
//           <h2 className="text-2xl font-bold text-foreground">{title}</h2>
//           <button
//             onClick={onClose}
//             className="text-muted-foreground hover:text-foreground transition-colors"
//           >
//             ✕
//           </button>
//         </div>

//         <div className="p-6 space-y-6">
//           {/* Tabs */}
//           <div className="flex gap-2 flex-wrap">
//             {[
//               { id: 'customers' as const, label: 'Customers' },
//               { id: 'vendors' as const, label: 'Vendors' },
//               { id: 'riders' as const, label: 'Riders' },
//             ].map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => setSelectedTab(tab.id)}
//                 className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//                   selectedTab === tab.id
//                     ? 'bg-primary text-primary-foreground'
//                     : 'bg-secondary text-secondary-foreground hover:opacity-80'
//                 }`}
//               >
//                 {tab.label}
//               </button>
//             ))}
//           </div>

//           {/* Users Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             {usersData[selectedTab].map((user) => (
//               <div
//                 key={user.id}
//                 className="bg-secondary rounded-lg p-4 space-y-3 flex flex-col items-center"
//               >
//                 <img
//                   src={user.image}
//                   alt={user.name}
//                   className="w-16 h-16 rounded-full object-cover"
//                 />
//                 <div className="text-center flex-1">
//                   <p className="font-semibold text-foreground">{user.name}</p>
//                   <p className="text-xs text-muted-foreground">📞 {user.phone}</p>
//                   <p className="text-xs text-muted-foreground">
//                     Total Orders: {user.orders}
//                   </p>
//                 </div>
//                 <button className="text-muted-foreground hover:text-foreground text-lg">
//                   ⋮
//                 </button>
//               </div>
//             ))}
//           </div>

//           {/* View All Button */}
//           <button
//             onClick={onClose}
//             className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
//           >
//             View All
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Revenue Modal
// export function RevenueModal({ isOpen, onClose, title }: BaseModalProps) {
//   const [selectedTab, setSelectedTab] = useState<'gross' | 'expenses' | 'net'>('gross');
//   const [selectedDuration, setSelectedDuration] = useState<string | null>(null);

//   const durationData = {
//     daily: {
//       gross: { label: 'Gross Revenue', value: '₦150,000' },
//       expenses: { label: 'Total Expenses', value: '₦45,000' },
//       net: { label: 'Net Revenue', value: '₦105,000' },
//       info: 'Daily Duration: 15/10/2025',
//     },
//     weekly: {
//       gross: { label: 'Gross Revenue', value: '₦1,050,000' },
//       expenses: { label: 'Total Expenses', value: '₦310,000' },
//       net: { label: 'Net Revenue', value: '₦740,000' },
//       info: 'Week Duration: 22/10/2025 - 29/10/2025\nTotal Orders: 350\nRevenue Generated: ₦980,000',
//     },
//     yearly: {
//       gross: { label: 'Gross Revenue', value: '₦12,500,000' },
//       expenses: { label: 'Total Expenses', value: '₦3,500,000' },
//       net: { label: 'Net Revenue', value: '₦9,000,000' },
//       info: 'Yearly Duration: 2025\nTotal Orders: 2500\nRevenue Generated: ₦12,500,000',
//     },
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//       <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="sticky top-0 bg-background border-b border-border p-6 flex justify-between items-center">
//           <h2 className="text-2xl font-bold text-foreground">{title}</h2>
//           <button
//             onClick={onClose}
//             className="text-muted-foreground hover:text-foreground transition-colors"
//           >
//             ✕
//           </button>
//         </div>

//         <div className="p-6 space-y-6">
//           {/* Tabs */}
//           <div className="flex gap-2 flex-wrap">
//             {[
//               { id: 'gross' as const, label: 'Gross Revenue' },
//               { id: 'expenses' as const, label: 'Total Expenses' },
//               { id: 'net' as const, label: 'Net Revenue' },
//             ].map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => setSelectedTab(tab.id)}
//                 className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//                   selectedTab === tab.id
//                     ? 'bg-primary text-primary-foreground'
//                     : 'bg-secondary text-secondary-foreground hover:opacity-80'
//                 }`}
//               >
//                 {tab.label}
//               </button>
//             ))}
//           </div>

//           {/* Duration Selector */}
//           <div>
//             <select
//               value={selectedDuration || ''}
//               onChange={(e) => setSelectedDuration(e.target.value || null)}
//               className="w-60 px-4 py-2 rounded-lg border border-border bg-background text-foreground cursor-pointer"
//             >
//               <option value="">Select Duration</option>
//               <option value="daily">Daily</option>
//               <option value="weekly">Weekly</option>
//               <option value="yearly">Yearly</option>
//             </select>
//           </div>

//           {/* Content Area */}
//           {selectedDuration ? (
//             <div className="bg-secondary rounded-lg p-6 space-y-4">
//               <p className="text-lg font-semibold text-foreground">
//                 {durationData[selectedDuration as keyof typeof durationData][selectedTab].label}
//               </p>
//               <p className="text-3xl font-bold text-primary">
//                 {durationData[selectedDuration as keyof typeof durationData][selectedTab].value}
//               </p>
//               <div className="text-sm text-muted-foreground whitespace-pre-line">
//                 {durationData[selectedDuration as keyof typeof durationData].info}
//               </div>
//             </div>
//           ) : (
//             <div className="bg-secondary rounded-lg p-6 text-center text-muted-foreground">
//               Click on "Select Duration" to display revenue information in this box
//             </div>
//           )}

//           {/* View All Button */}
//           <button
//             onClick={onClose}
//             className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
//           >
//             View All
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// NEW

// 'use client';

// import { useState, useEffect, useCallback, useRef } from 'react';
// import { Skeleton } from '@/components/ui/skeleton';
// import { Button } from '@/components/ui/button';
// import { toast } from 'sonner';
// import { Loader2 } from 'lucide-react';
// // import {
// //   superAdminApi,
// //   type Rating,
// //   type Order,
// //   type Customer,
// //   type Vendor,
// //   type Rider,
// //   type RevenueStats,
// //   type RevenueTrendsResponse,
// // } from '@/lib/api/superadmin/api';

// import { superAdminApi, type Rating, type Order, type Customer, type Vendor, type Rider, type RevenueStats, type RevenueTrendsResponse, } from '@/lib/api/api';

// // ─────────────────────────────────────────────────────────────────────────────
// // Shared primitives
// // ─────────────────────────────────────────────────────────────────────────────

// interface BaseModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   title: string;
// }

// function fmtCurrency(n?: number) {
//   if (n == null) return '—';
//   return `₦${Number(n).toLocaleString()}`;
// }

// function Initials({ name, className = '' }: { name?: string; className?: string }) {
//   const letter = (name ?? '?')[0]?.toUpperCase() ?? '?';
//   return (
//     <div
//       className={`bg-primary/20 text-primary font-bold flex items-center justify-center shrink-0 ${className}`}
//     >
//       {letter}
//     </div>
//   );
// }

// function StatusDot({ status }: { status: string }) {
//   const color =
//     status === 'active' ? 'bg-green-500' :
//     status === 'suspended' ? 'bg-red-500' :
//     status === 'pending' ? 'bg-yellow-500' : 'bg-gray-400';
//   return <span className={`inline-block w-2 h-2 rounded-full ${color}`} />;
// }

// // Shared sticky modal header
// function ModalHeader({
//   title,
//   total,
//   onClose,
// }: {
//   title: string;
//   total?: number;
//   onClose: () => void;
// }) {
//   return (
//     <div className="sticky top-0 bg-background border-b border-border px-6 py-4 flex items-center justify-between z-10">
//       <div className="flex items-center gap-3">
//         <h2 className="text-xl font-bold text-foreground">{title}</h2>
//         {total != null && (
//           <span className="text-xs font-semibold bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
//             {total.toLocaleString()} total
//           </span>
//         )}
//       </div>
//       <button
//         onClick={onClose}
//         className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
//       >
//         ✕
//       </button>
//     </div>
//   );
// }

// function ErrorBanner({ message, onRetry }: { message: string; onRetry: () => void }) {
//   return (
//     <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex items-center justify-between gap-4">
//       <p className="text-destructive text-sm font-medium">{message}</p>
//       <Button
//         variant="outline"
//         size="sm"
//         onClick={onRetry}
//         className="border-destructive text-destructive hover:bg-destructive/10 shrink-0"
//       >
//         Retry
//       </Button>
//     </div>
//   );
// }

// function GridSkeleton({ cols = 2, count = 6 }: { cols?: number; count?: number }) {
//   return (
//     <div className={`grid gap-4 ${cols === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
//       {Array.from({ length: count }).map((_, i) => (
//         <Skeleton key={i} className="h-28 rounded-xl" />
//       ))}
//     </div>
//   );
// }

// // "Load More" / "View All" button — loads next page rather than closing modal
// function LoadMoreButton({
//   hasMore,
//   loading,
//   onLoadMore,
// }: {
//   hasMore: boolean;
//   loading: boolean;
//   onLoadMore: () => void;
// }) {
//   if (!hasMore) return null;
//   return (
//     <button
//       onClick={onLoadMore}
//       disabled={loading}
//       className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
//     >
//       {loading && <Loader2 size={16} className="animate-spin" />}
//       {loading ? 'Loading…' : 'View More'}
//     </button>
//   );
// }

// const PAGE_SIZE = 6;

// // ─────────────────────────────────────────────────────────────────────────────
// // Ratings Modal
// // ─────────────────────────────────────────────────────────────────────────────

// export function RatingsModal({ isOpen, onClose, title }: BaseModalProps) {
//   const [filter, setFilter] = useState<number | null>(null);
//   const [ratings, setRatings] = useState<Rating[]>([]);
//   const [total, setTotal] = useState(0);
//   const [page, setPage] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Reset when modal opens or filter changes
//   useEffect(() => {
//     if (!isOpen) return;
//     setRatings([]);
//     setPage(1);
//     setError(null);
//   }, [isOpen, filter]);

//   const fetchRatings = useCallback(
//     async (pageNum: number, append: boolean) => {
//       append ? setLoadingMore(true) : setLoading(true);
//       setError(null);
//       try {
//         const res = await superAdminApi.ratings.getAll({
//           page: pageNum,
//           limit: PAGE_SIZE,
//           ...(filter ? { score: filter } : {}),
//         });
//         setRatings((prev) => (append ? [...prev, ...(res.data ?? [])] : (res.data ?? [])));
//         setTotal(res.total ?? 0);
//       } catch (err: any) {
//         const msg = err?.message || 'Failed to load ratings';
//         setError(msg);
//         toast.error(msg);
//       } finally {
//         setLoading(false);
//         setLoadingMore(false);
//       }
//     },
//     [filter]
//   );

//   // Initial load
//   useEffect(() => {
//     if (isOpen) fetchRatings(1, false);
//   }, [isOpen, fetchRatings]);

//   const handleLoadMore = () => {
//     const next = page + 1;
//     setPage(next);
//     fetchRatings(next, true);
//   };

//   const hasMore = ratings.length < total;

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//       <div className="bg-background rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
//         <ModalHeader title={title} total={total} onClose={onClose} />

//         <div className="flex-1 overflow-y-auto p-6 space-y-5">
//           {/* Star filter chips */}
//           <div className="flex gap-2 flex-wrap">
//             {[5, 4, 3, 2, 1].map((star) => (
//               <button
//                 key={star}
//                 onClick={() => setFilter(filter === star ? null : star)}
//                 className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
//                   filter === star
//                     ? 'bg-primary text-primary-foreground'
//                     : 'bg-secondary text-secondary-foreground hover:opacity-80'
//                 }`}
//               >
//                 {'⭐'.repeat(star)} {star} Star{star !== 1 ? 's' : ''}
//               </button>
//             ))}
//           </div>

//           {/* Content */}
//           {loading ? (
//             <GridSkeleton cols={2} count={6} />
//           ) : error ? (
//             <ErrorBanner message={error} onRetry={() => fetchRatings(1, false)} />
//           ) : ratings.length === 0 ? (
//             <p className="text-center text-muted-foreground py-12">No ratings found.</p>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {ratings.map((r) => (
//                 <div key={r.id} className="bg-secondary rounded-xl p-4 space-y-3">
//                   <div className="flex gap-3">
//                     {r.customerAvatar ? (
//                       <img
//                         src={r.customerAvatar}
//                         alt={r.customerName}
//                         className="w-12 h-12 rounded-lg object-cover shrink-0"
//                       />
//                     ) : (
//                       <Initials name={r.customerName} className="w-12 h-12 rounded-lg text-sm" />
//                     )}
//                     <div className="flex-1 min-w-0">
//                       <p className="font-semibold text-foreground truncate">
//                         {r.customerName ?? `Customer #${r.customerId}`}
//                       </p>
//                       <p className="text-xs text-muted-foreground">
//                         {r.targetType === 'vendor' ? 'Vendor' : 'Rider'}
//                         {r.targetName ? `: ${r.targetName}` : ''}
//                         {r.orderType ? ` · ${r.orderType}` : ''}
//                       </p>
//                     </div>
//                     <span className="text-base shrink-0">{'⭐'.repeat(Math.min(r.score, 5))}</span>
//                   </div>
//                   {r.comment && (
//                     <p className="text-sm text-foreground line-clamp-3">{r.comment}</p>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Inline load more — does NOT close the modal */}
//           <LoadMoreButton hasMore={hasMore} loading={loadingMore} onLoadMore={handleLoadMore} />
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // Orders Modal
// // ─────────────────────────────────────────────────────────────────────────────

// type OrderTab = 'active' | 'delivered' | 'rejected';

// export function OrdersModal({ isOpen, onClose, title }: BaseModalProps) {
//   const [tab, setTab] = useState<OrderTab>('active');
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [total, setTotal] = useState(0);
//   const [page, setPage] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!isOpen) return;
//     setOrders([]);
//     setPage(1);
//     setError(null);
//   }, [isOpen, tab]);

//   const fetchOrders = useCallback(
//     async (pageNum: number, append: boolean) => {
//       append ? setLoadingMore(true) : setLoading(true);
//       setError(null);
//       try {
//         const res = await superAdminApi.orders.getAll({
//           page: pageNum,
//           limit: PAGE_SIZE,
//           status: tab,
//         });
//         setOrders((prev) => (append ? [...prev, ...(res.data ?? [])] : (res.data ?? [])));
//         setTotal(res.total ?? 0);
//       } catch (err: any) {
//         const msg = err?.message || 'Failed to load orders';
//         setError(msg);
//         toast.error(msg);
//       } finally {
//         setLoading(false);
//         setLoadingMore(false);
//       }
//     },
//     [tab]
//   );

//   useEffect(() => {
//     if (isOpen) fetchOrders(1, false);
//   }, [isOpen, fetchOrders]);

//   const handleLoadMore = () => {
//     const next = page + 1;
//     setPage(next);
//     fetchOrders(next, true);
//   };

//   const hasMore = orders.length < total;

//   if (!isOpen) return null;

//   const TABS: { id: OrderTab; label: string }[] = [
//     { id: 'active', label: 'Active Orders' },
//     { id: 'delivered', label: 'Delivered' },
//     { id: 'rejected', label: 'Rejected/Reported' },
//   ];

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//       <div className="bg-background rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
//         <ModalHeader title={title} total={total} onClose={onClose} />

//         <div className="flex-1 overflow-y-auto p-6 space-y-5">
//           {/* Tabs */}
//           <div className="flex gap-2 flex-wrap">
//             {TABS.map((t) => (
//               <button
//                 key={t.id}
//                 onClick={() => setTab(t.id)}
//                 className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
//                   tab === t.id
//                     ? 'bg-primary text-primary-foreground'
//                     : 'bg-secondary text-secondary-foreground hover:opacity-80'
//                 }`}
//               >
//                 {t.label}
//               </button>
//             ))}
//           </div>

//           {/* Content */}
//           {loading ? (
//             <GridSkeleton cols={3} count={6} />
//           ) : error ? (
//             <ErrorBanner message={error} onRetry={() => fetchOrders(1, false)} />
//           ) : orders.length === 0 ? (
//             <p className="text-center text-muted-foreground py-12">No {tab} orders found.</p>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               {orders.map((order) => (
//                 <div key={order.id} className="bg-secondary rounded-xl p-4 flex flex-col gap-3">
//                   <div className="w-full h-20 rounded-lg bg-primary/10 flex items-center justify-center text-3xl">
//                     📦
//                   </div>
//                   <div className="flex-1">
//                     <p className="font-semibold text-foreground text-sm truncate">
//                       {order.customerName ?? `Order #${order.id}`}
//                     </p>
//                     <p className="text-xs text-muted-foreground truncate">
//                       {order.vendorName ?? order.vendorId}
//                     </p>
//                     <p className="text-sm font-bold text-primary mt-1">
//                       {fmtCurrency(order.totalAmount)}
//                     </p>
//                   </div>
//                   <span
//                     className={`text-xs font-semibold px-2 py-0.5 rounded-full self-start capitalize ${
//                       order.status === 'active' ? 'bg-blue-100 text-blue-700' :
//                       order.status === 'delivered' ? 'bg-green-100 text-green-700' :
//                       'bg-red-100 text-red-700'
//                     }`}
//                   >
//                     {order.status}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           )}

//           <LoadMoreButton hasMore={hasMore} loading={loadingMore} onLoadMore={handleLoadMore} />
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // Users Modal
// // ─────────────────────────────────────────────────────────────────────────────

// type UsersTab = 'customers' | 'vendors' | 'riders';
// type AnyUser = Customer | Vendor | Rider;

// export function UsersModal({ isOpen, onClose, title }: BaseModalProps) {
//   const [tab, setTab] = useState<UsersTab>('customers');
//   const [users, setUsers] = useState<AnyUser[]>([]);
//   const [total, setTotal] = useState(0);
//   const [page, setPage] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!isOpen) return;
//     setUsers([]);
//     setPage(1);
//     setError(null);
//   }, [isOpen, tab]);

//   const fetchUsers = useCallback(
//     async (pageNum: number, append: boolean) => {
//       append ? setLoadingMore(true) : setLoading(true);
//       setError(null);
//       try {
//         const params = { page: pageNum, limit: PAGE_SIZE };
//         const res =
//           tab === 'customers'
//             ? await superAdminApi.customers.getAll(params)
//             : tab === 'vendors'
//             ? await superAdminApi.vendors.getAll(params)
//             : await superAdminApi.riders.getAll(params);
//         setUsers((prev) => (append ? [...prev, ...(res.data ?? [])] : (res.data ?? [])));
//         setTotal(res.total ?? 0);
//       } catch (err: any) {
//         const msg = err?.message || `Failed to load ${tab}`;
//         setError(msg);
//         toast.error(msg);
//       } finally {
//         setLoading(false);
//         setLoadingMore(false);
//       }
//     },
//     [tab]
//   );

//   useEffect(() => {
//     if (isOpen) fetchUsers(1, false);
//   }, [isOpen, fetchUsers]);

//   const handleLoadMore = () => {
//     const next = page + 1;
//     setPage(next);
//     fetchUsers(next, true);
//   };

//   const hasMore = users.length < total;

//   if (!isOpen) return null;

//   const TABS: { id: UsersTab; label: string }[] = [
//     { id: 'customers', label: 'Customers' },
//     { id: 'vendors', label: 'Vendors' },
//     { id: 'riders', label: 'Riders' },
//   ];

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//       <div className="bg-background rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col">
//         <ModalHeader title={title} total={total} onClose={onClose} />

//         <div className="flex-1 overflow-y-auto p-6 space-y-5">
//           {/* Tabs */}
//           <div className="flex gap-2 flex-wrap">
//             {TABS.map((t) => (
//               <button
//                 key={t.id}
//                 onClick={() => setTab(t.id)}
//                 className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
//                   tab === t.id
//                     ? 'bg-primary text-primary-foreground'
//                     : 'bg-secondary text-secondary-foreground hover:opacity-80'
//                 }`}
//               >
//                 {t.label}
//               </button>
//             ))}
//           </div>

//           {/* Content */}
//           {loading ? (
//             <GridSkeleton cols={3} count={9} />
//           ) : error ? (
//             <ErrorBanner message={error} onRetry={() => fetchUsers(1, false)} />
//           ) : users.length === 0 ? (
//             <p className="text-center text-muted-foreground py-12">No {tab} found.</p>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               {users.map((user) => (
//                 <div
//                   key={user.id}
//                   className="bg-secondary rounded-xl p-4 flex flex-col items-center gap-3"
//                 >
//                   {user.avatar ? (
//                     <img
//                       src={user.avatar}
//                       alt={user.name}
//                       className="w-16 h-16 rounded-full object-cover"
//                     />
//                   ) : (
//                     <Initials name={user.name} className="w-16 h-16 rounded-full text-xl" />
//                   )}
//                   <div className="text-center">
//                     <p className="font-semibold text-foreground">{user.name}</p>
//                     {user.phone && (
//                       <p className="text-xs text-muted-foreground">📞 {user.phone}</p>
//                     )}
//                     {user.totalOrders != null && (
//                       <p className="text-xs text-muted-foreground">
//                         {user.totalOrders} order{user.totalOrders !== 1 ? 's' : ''}
//                       </p>
//                     )}
//                     <div className="flex items-center justify-center gap-1.5 mt-1">
//                       <StatusDot status={user.status} />
//                       <span className="text-xs text-muted-foreground capitalize">
//                         {user.status}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           <LoadMoreButton hasMore={hasMore} loading={loadingMore} onLoadMore={handleLoadMore} />
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // Revenue Modal
// // ─────────────────────────────────────────────────────────────────────────────

// type RevenueTab = 'gross' | 'expenses' | 'net';
// type RevenuePeriod = 'daily' | 'weekly' | 'yearly';

// // Maps each tab to the correct field names on RevenueStats and RevenueTrend
// const REVENUE_FIELD_MAP: Record<
//   RevenueTab,
//   { statsKey: keyof RevenueStats; trendKey: keyof import('@/lib/api/api').RevenueTrend; label: string }
// > = {
//   gross:    { statsKey: 'grossRevenue',   trendKey: 'grossRevenue',   label: 'Gross Revenue'   },
//   expenses: { statsKey: 'totalExpenses',  trendKey: 'totalExpenses',  label: 'Total Expenses'  },
//   net:      { statsKey: 'netRevenue',     trendKey: 'netRevenue',     label: 'Net Revenue'     },
// };

// export function RevenueModal({ isOpen, onClose, title }: BaseModalProps) {
//   const [tab, setTab] = useState<RevenueTab>('gross');
//   const [period, setPeriod] = useState<RevenuePeriod | ''>('');
//   const [stats, setStats] = useState<RevenueStats | null>(null);
//   const [trends, setTrends] = useState<RevenueTrendsResponse | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Reset on close
//   useEffect(() => {
//     if (!isOpen) {
//       setStats(null);
//       setTrends(null);
//       setError(null);
//     }
//   }, [isOpen]);

//   const fetchRevenue = useCallback(async () => {
//     if (!period) return;
//     setLoading(true);
//     setError(null);
//     try {
//       const [statsRes, trendsRes] = await Promise.all([
//         superAdminApi.dashboard.getRevenue(),
//         superAdminApi.dashboard.getRevenueTrends({ period }),
//       ]);
//       setStats(statsRes);
//       setTrends(trendsRes);
//     } catch (err: any) {
//       const msg = err?.message || 'Failed to load revenue data';
//       setError(msg);
//       toast.error(msg);
//     } finally {
//       setLoading(false);
//     }
//   }, [period]);

//   useEffect(() => {
//     if (isOpen && period) fetchRevenue();
//   }, [isOpen, fetchRevenue]);

//   if (!isOpen) return null;

//   const fieldMap = REVENUE_FIELD_MAP[tab];
//   const currentValue = stats ? (stats[fieldMap.statsKey] as number) : null;
//   const summary = trends?.summary;

//   const TABS: { id: RevenueTab; label: string }[] = [
//     { id: 'gross',    label: 'Gross Revenue'  },
//     { id: 'expenses', label: 'Total Expenses' },
//     { id: 'net',      label: 'Net Revenue'    },
//   ];

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//       <div className="bg-background rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
//         <ModalHeader title={title} onClose={onClose} />

//         <div className="flex-1 overflow-y-auto p-6 space-y-5">
//           {/* Tabs */}
//           <div className="flex gap-2 flex-wrap">
//             {TABS.map((t) => (
//               <button
//                 key={t.id}
//                 onClick={() => setTab(t.id)}
//                 className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
//                   tab === t.id
//                     ? 'bg-primary text-primary-foreground'
//                     : 'bg-secondary text-secondary-foreground hover:opacity-80'
//                 }`}
//               >
//                 {t.label}
//               </button>
//             ))}
//           </div>

//           {/* Period selector */}
//           <div>
//             <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">
//               Select Period
//             </label>
//             <select
//               value={period}
//               onChange={(e) => setPeriod(e.target.value as RevenuePeriod | '')}
//               className="w-52 px-4 py-2 rounded-lg border border-border bg-background text-foreground cursor-pointer text-sm"
//             >
//               <option value="">Choose duration…</option>
//               <option value="daily">Daily</option>
//               <option value="weekly">Weekly</option>
//               <option value="yearly">Yearly</option>
//             </select>
//           </div>

//           {/* Content */}
//           {!period ? (
//             <div className="bg-secondary rounded-xl p-8 text-center text-muted-foreground text-sm">
//               Select a period above to view revenue breakdown
//             </div>
//           ) : loading ? (
//             <div className="space-y-3 animate-pulse">
//               <Skeleton className="h-32 rounded-xl" />
//               <div className="grid grid-cols-3 gap-3">
//                 {[0,1,2].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)}
//               </div>
//             </div>
//           ) : error ? (
//             <ErrorBanner message={error} onRetry={fetchRevenue} />
//           ) : stats ? (
//             <div className="space-y-4">
//               {/* Primary value card */}
//               <div className="bg-[#98EF9B] rounded-xl p-6">
//                 <p className="text-sm font-medium text-foreground/70 mb-1">{fieldMap.label}</p>
//                 <p className="text-4xl font-bold text-foreground">
//                   {fmtCurrency(currentValue ?? undefined)}
//                 </p>
//                 {summary && (
//                   <p className="text-xs text-foreground/60 mt-2">
//                     {summary.startDate} — {summary.endDate}
//                   </p>
//                 )}
//               </div>

//               {/* All three metrics side-by-side for context */}
//               <div className="grid grid-cols-3 gap-3">
//                 {TABS.map((t) => {
//                   const key = REVENUE_FIELD_MAP[t.id].statsKey;
//                   const val = stats[key] as number;
//                   return (
//                     <div
//                       key={t.id}
//                       className={`rounded-xl p-4 cursor-pointer transition-colors ${
//                         t.id === tab
//                           ? 'bg-primary text-primary-foreground'
//                           : 'bg-secondary text-foreground hover:bg-secondary/80'
//                       }`}
//                       onClick={() => setTab(t.id)}
//                     >
//                       <p className="text-xs font-medium opacity-70">{t.label}</p>
//                       <p className="text-lg font-bold mt-1">{fmtCurrency(val)}</p>
//                     </div>
//                   );
//                 })}
//               </div>

//               {/* Summary row */}
//               {summary && (
//                 <div className="bg-secondary rounded-xl p-4 grid grid-cols-2 gap-3 text-sm">
//                   <div>
//                     <p className="text-muted-foreground text-xs">Total Orders</p>
//                     <p className="font-semibold">{summary.totalOrders?.toLocaleString() ?? '—'}</p>
//                   </div>
//                   <div>
//                     <p className="text-muted-foreground text-xs">Period</p>
//                     <p className="font-semibold capitalize">{period}</p>
//                   </div>
//                 </div>
//               )}

//               {/* Trend breakdown */}
//               {trends?.trends && trends.trends.length > 0 && (
//                 <div className="space-y-2">
//                   <p className="text-sm font-semibold text-foreground">Trend Breakdown</p>
//                   <div className="max-h-52 overflow-y-auto space-y-2 pr-1">
//                     {trends.trends.map((point, i) => (
//                       <div
//                         key={i}
//                         className="flex justify-between items-center bg-secondary rounded-lg px-4 py-2 text-sm"
//                       >
//                         <span className="text-muted-foreground">{point.date}</span>
//                         <span className="font-semibold text-foreground">
//                           {fmtCurrency((point[fieldMap.trendKey] as number) ?? undefined)}
//                         </span>
//                         <span className="text-xs text-muted-foreground">
//                           {point.orders} order{point.orders !== 1 ? 's' : ''}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           ) : null}
//         </div>
//       </div>
//     </div>
//   );
// }

//Another new

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  superAdminApi,
  type Rating,
  type Order,
  type Customer,
  type Vendor,
  type Rider,
  type RevenueAnalyticsData,
  type RatingsResponse,
  type RevenueTrendsResponse,
} from "@/lib/api/api";

// ─────────────────────────────────────────────────────────────────────────────
// Shared primitives
// ─────────────────────────────────────────────────────────────────────────────

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

function fmtCurrency(n?: number) {
  if (n == null) return "—";
  return `₦${Number(n).toLocaleString()}`;
}

function Initials({ name, className = "" }: { name?: string; className?: string }) {
  const letter = (name ?? "?")[0]?.toUpperCase() ?? "?";
  return (
    <div
      className={`bg-primary/20 text-primary font-bold flex items-center justify-center shrink-0 ${className}`}
    >
      {letter}
    </div>
  );
}

function StatusDot({ status }: { status: string }) {
  const color =
    status === "active"
      ? "bg-green-500"
      : status === "suspended"
        ? "bg-red-500"
        : status === "pending"
          ? "bg-yellow-500"
          : "bg-gray-400";
  return <span className={`inline-block w-2 h-2 rounded-full ${color}`} />;
}

// Shared sticky modal header
function ModalHeader({
  title,
  total,
  onClose,
}: {
  title: string;
  total?: number;
  onClose: () => void;
}) {
  return (
    <div className="sticky top-0 bg-background border-b border-border px-6 py-4 flex items-center justify-between z-10">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
        {total != null && (
          <span className="text-xs font-semibold bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
            {total.toLocaleString()} total
          </span>
        )}
      </div>
      <button
        onClick={onClose}
        className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded cursor-pointer"
      >
        ✕
      </button>
    </div>
  );
}

function ErrorBanner({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex items-center justify-between gap-4">
      <p className="text-destructive text-sm font-medium">{message}</p>
      <Button
        variant="outline"
        size="sm"
        onClick={onRetry}
        className="border-destructive text-destructive hover:bg-destructive/10 shrink-0"
      >
        Retry
      </Button>
    </div>
  );
}

function GridSkeleton({ cols = 2, count = 6 }: { cols?: number; count?: number }) {
  return (
    <div
      className={`grid gap-4 ${cols === 3 ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1 md:grid-cols-2"}`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-28 rounded-xl" />
      ))}
    </div>
  );
}

// "Load More" / "View All" button — loads next page rather than closing modal
function LoadMoreButton({
  hasMore,
  loading,
  onLoadMore,
}: {
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
}) {
  if (!hasMore) return null;
  return (
    <button
      onClick={onLoadMore}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {loading ? "Loading…" : "View More"}
    </button>
  );
}

const PAGE_SIZE = 6;

// ─────────────────────────────────────────────────────────────────────────────
// Ratings Modal
// ─────────────────────────────────────────────────────────────────────────────

export function RatingsModal({ isOpen, onClose, title }: BaseModalProps) {
  const [filter, setFilter] = useState<number | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset when modal opens or filter changes
  useEffect(() => {
    if (!isOpen) return;
    setRatings([]);
    setPage(1);
    setError(null);
  }, [isOpen, filter]);

  const fetchRatings = useCallback(
    async (pageNum: number, append: boolean) => {
      append ? setLoadingMore(true) : setLoading(true);
      setError(null);
      try {
        const res = await superAdminApi.ratings.getAll({
          page: pageNum,
          limit: PAGE_SIZE,
          ...(filter ? { rating: filter } : {}), // controller param is `rating` not `score`
        });
        setRatings((prev) => (append ? [...prev, ...(res.data ?? [])] : (res.data ?? [])));
        setTotal(res.total ?? 0);
      } catch (err: any) {
        const msg = err?.message || "Failed to load ratings";
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [filter]
  );

  // Initial load
  useEffect(() => {
    if (isOpen) fetchRatings(1, false);
  }, [isOpen, fetchRatings]);

  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchRatings(next, true);
  };

  const hasMore = ratings.length < total;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        <ModalHeader title={title} total={total} onClose={onClose} />

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Star filter chips */}
          <div className="flex gap-2 flex-wrap">
            {[5, 4, 3, 2, 1].map((star) => (
              <button
                key={star}
                onClick={() => setFilter(filter === star ? null : star)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === star
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:opacity-80"
                }`}
              >
                {"⭐".repeat(star)} {star} Star{star !== 1 ? "s" : ""}
              </button>
            ))}
          </div>

          {/* Content */}
          {loading ? (
            <GridSkeleton cols={2} count={6} />
          ) : error ? (
            <ErrorBanner message={error} onRetry={() => fetchRatings(1, false)} />
          ) : ratings.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No ratings found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ratings.map((r) => (
                <div key={r.id} className="bg-secondary rounded-xl p-4 space-y-3">
                  <div className="flex gap-3">
                    {r.customerImage ? (
                      <img
                        src={r.customerImage}
                        alt={r.customerName}
                        className="w-12 h-12 rounded-lg object-cover shrink-0"
                      />
                    ) : (
                      <Initials name={r.customerName} className="w-12 h-12 rounded-lg text-sm" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">
                        {r.customerName ?? `Customer #${r.customerId}`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {r.targetType === "VendorProfile"
                          ? "Vendor"
                          : r.targetType === "RiderProfile"
                            ? "Rider"
                            : (r.targetType ?? "Unknown")}
                        {r.targetName ? `: ${r.targetName}` : ""}
                        {r.orderType ? ` · ${r.orderType}` : ""}
                      </p>
                    </div>
                    <span className="text-base shrink-0">
                      {"⭐".repeat(Math.min(r.rating ?? 0, 5))}
                    </span>
                  </div>
                  {r.comment && <p className="text-sm text-foreground line-clamp-3">{r.comment}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Inline load more — does NOT close the modal */}
          <LoadMoreButton hasMore={hasMore} loading={loadingMore} onLoadMore={handleLoadMore} />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Orders Modal
// ─────────────────────────────────────────────────────────────────────────────

type OrderTab = "active" | "delivered" | "rejected";

export function OrdersModal({ isOpen, onClose, title }: BaseModalProps) {
  const [tab, setTab] = useState<OrderTab>("active");
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setOrders([]);
    setPage(1);
    setError(null);
  }, [isOpen, tab]);

  const fetchOrders = useCallback(
    async (pageNum: number, append: boolean) => {
      append ? setLoadingMore(true) : setLoading(true);
      setError(null);
      try {
        const res = await superAdminApi.orders.getAll({
          page: pageNum,
          limit: PAGE_SIZE,
          status: tab,
        });
        setOrders((prev) => (append ? [...prev, ...(res.data ?? [])] : (res.data ?? [])));
        setTotal(res.total ?? 0);
      } catch (err: any) {
        const msg = err?.message || "Failed to load orders";
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [tab]
  );

  useEffect(() => {
    if (isOpen) fetchOrders(1, false);
  }, [isOpen, fetchOrders]);

  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchOrders(next, true);
  };

  const hasMore = orders.length < total;

  if (!isOpen) return null;

  const TABS: { id: OrderTab; label: string }[] = [
    { id: "active", label: "Active Orders" },
    { id: "delivered", label: "Delivered" },
    { id: "rejected", label: "Rejected/Reported" },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        <ModalHeader title={title} total={total} onClose={onClose} />

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Tabs */}
          <div className="flex gap-2 flex-wrap">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  tab === t.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:opacity-80"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Content */}
          {loading ? (
            <GridSkeleton cols={3} count={6} />
          ) : error ? (
            <ErrorBanner message={error} onRetry={() => fetchOrders(1, false)} />
          ) : orders.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No {tab} orders found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-secondary rounded-xl p-4 flex flex-col gap-3">
                  <div className="w-full h-20 rounded-lg bg-primary/10 flex items-center justify-center text-3xl">
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 40 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="20" cy="20" r="20" fill="#FFCA3A" />
                      <path
                        d="M29 24C29 19.375 25.493 15.559 21 15.059V13H19V15.059C14.507 15.559 11 19.375 11 24V26H29V24ZM10 27H30V29H10V27Z"
                        fill="#1A3F1C"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground text-sm truncate">
                      {order.customerName ?? `Order #${order.id}`}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {order.vendorName ?? order.vendorId}
                    </p>
                    <p className="text-sm font-bold text-primary mt-1">
                      {fmtCurrency(order.totalAmount)}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full self-start capitalize ${
                      order.status === "active"
                        ? "bg-blue-100 text-blue-700"
                        : order.status === "delivered"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          <LoadMoreButton hasMore={hasMore} loading={loadingMore} onLoadMore={handleLoadMore} />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Users Modal
// ─────────────────────────────────────────────────────────────────────────────

type UsersTab = "customers" | "vendors" | "riders";
type AnyUser = Customer | Vendor | Rider;

export function UsersModal({ isOpen, onClose, title }: BaseModalProps) {
  const [tab, setTab] = useState<UsersTab>("customers");
  const [users, setUsers] = useState<AnyUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setUsers([]);
    setPage(1);
    setError(null);
  }, [isOpen, tab]);

  const fetchUsers = useCallback(
    async (pageNum: number, append: boolean) => {
      append ? setLoadingMore(true) : setLoading(true);
      setError(null);
      try {
        const params = { page: pageNum, limit: PAGE_SIZE };
        const res =
          tab === "customers"
            ? await superAdminApi.customers.getAll(params)
            : tab === "vendors"
              ? await superAdminApi.vendors.getAll(params)
              : await superAdminApi.riders.getAll(params);
        setUsers((prev) => (append ? [...prev, ...(res.data ?? [])] : (res.data ?? [])));
        setTotal(res.total ?? 0);
      } catch (err: any) {
        const msg = err?.message || `Failed to load ${tab}`;
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [tab]
  );

  useEffect(() => {
    if (isOpen) fetchUsers(1, false);
  }, [isOpen, fetchUsers]);

  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchUsers(next, true);
  };

  const hasMore = users.length < total;

  if (!isOpen) return null;

  const TABS: { id: UsersTab; label: string }[] = [
    { id: "customers", label: "Customers" },
    { id: "vendors", label: "Vendors" },
    { id: "riders", label: "Riders" },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col">
        <ModalHeader title={title} total={total} onClose={onClose} />

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Tabs */}
          <div className="flex gap-2 flex-wrap">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  tab === t.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:opacity-80"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Content */}
          {loading ? (
            <GridSkeleton cols={3} count={9} />
          ) : error ? (
            <ErrorBanner message={error} onRetry={() => fetchUsers(1, false)} />
          ) : users.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No {tab} found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="bg-secondary rounded-xl p-4 flex flex-col items-center gap-3"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <Initials name={user.name} className="w-16 h-16 rounded-full text-xl" />
                  )}
                  <div className="text-center">
                    <p className="font-semibold text-foreground">{user.name}</p>
                    {user.phone && <p className="text-xs text-muted-foreground">📞 {user.phone}</p>}
                    {user.totalOrders != null && (
                      <p className="text-xs text-muted-foreground">
                        {user.totalOrders} order{user.totalOrders !== 1 ? "s" : ""}
                      </p>
                    )}
                    <div className="flex items-center justify-center gap-1.5 mt-1">
                      <StatusDot status={user.status ?? user.statusOfAccount ?? ""} />
                      <span className="text-xs text-muted-foreground capitalize">
                        {user.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <LoadMoreButton hasMore={hasMore} loading={loadingMore} onLoadMore={handleLoadMore} />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Revenue Modal
// ─────────────────────────────────────────────────────────────────────────────

type RevenueTab = "gross" | "expenses" | "net";
type RevenuePeriod = "daily" | "weekly" | "yearly";

// Maps each tab to the correct field names on RevenueAnalyticsData and RevenueTrendPoint
// Controller fields: totalGrossRevenue, totalExpenses, totalNetRevenue (analytics)
//                    grossRevenue, expenses, netRevenue (trend points)
const REVENUE_FIELD_MAP: Record<
  RevenueTab,
  {
    statsKey: keyof RevenueAnalyticsData;
    trendKey: "grossRevenue" | "expenses" | "netRevenue";
    label: string;
  }
> = {
  gross: { statsKey: "totalGrossRevenue", trendKey: "grossRevenue", label: "Gross Revenue" },
  expenses: { statsKey: "totalExpenses", trendKey: "expenses", label: "Total Expenses" },
  net: { statsKey: "totalNetRevenue", trendKey: "netRevenue", label: "Net Revenue" },
};

export function RevenueModal({ isOpen, onClose, title }: BaseModalProps) {
  const [tab, setTab] = useState<RevenueTab>("gross");
  const [period, setPeriod] = useState<RevenuePeriod | "">("");
  const [stats, setStats] = useState<RevenueAnalyticsData | null>(null);
  const [trends, setTrends] = useState<RevenueTrendsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setStats(null);
      setTrends(null);
      setError(null);
    }
  }, [isOpen]);

  // Map UI period names to controller params
  const PERIOD_TO_API: Record<string, string> = { daily: "today", weekly: "week", yearly: "year" };
  const PERIOD_TO_GROUPBY: Record<string, string> = {
    daily: "hour",
    weekly: "day",
    yearly: "month",
  };
  const PERIOD_TO_LIMIT: Record<string, number> = { daily: 24, weekly: 7, yearly: 12 };

  const fetchRevenue = useCallback(async () => {
    if (!period) return;
    setLoading(true);
    setError(null);
    try {
      const [statsRes, trendsRes] = await Promise.all([
        superAdminApi.dashboard.getRevenue({ period: PERIOD_TO_API[period] ?? period }),
        superAdminApi.dashboard.getRevenueTrends({
          groupBy: PERIOD_TO_GROUPBY[period] ?? "day",
          limit: PERIOD_TO_LIMIT[period] ?? 12,
        }),
      ]);
      setStats(statsRes.data); // unwrap: response is { period, data: RevenueAnalyticsData }
      setTrends(trendsRes);
    } catch (err: any) {
      const msg = err?.message || "Failed to load revenue data";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    if (isOpen && period) fetchRevenue();
  }, [isOpen, fetchRevenue]);

  if (!isOpen) return null;

  const fieldMap = REVENUE_FIELD_MAP[tab];
  const currentValue = stats ? (stats[fieldMap.statsKey] as number) : null;

  const TABS: { id: RevenueTab; label: string }[] = [
    { id: "gross", label: "Gross Revenue" },
    { id: "expenses", label: "Total Expenses" },
    { id: "net", label: "Net Revenue" },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        <ModalHeader title={title} onClose={onClose} />

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Tabs */}
          <div className="flex gap-2 flex-wrap">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  tab === t.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:opacity-80"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Period selector */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">
              Select Period
            </label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as RevenuePeriod | "")}
              className="w-52 px-4 py-2 rounded-lg border border-border bg-background text-foreground cursor-pointer text-sm"
            >
              <option value="">Choose duration…</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          {/* Content */}
          {!period ? (
            <div className="bg-secondary rounded-xl p-8 text-center text-muted-foreground text-sm">
              Select a period above to view revenue breakdown
            </div>
          ) : loading ? (
            <div className="space-y-3 animate-pulse">
              <Skeleton className="h-32 rounded-xl" />
              <div className="grid grid-cols-3 gap-3">
                {[0, 1, 2].map((i) => (
                  <Skeleton key={i} className="h-20 rounded-xl" />
                ))}
              </div>
            </div>
          ) : error ? (
            <ErrorBanner message={error} onRetry={fetchRevenue} />
          ) : stats ? (
            <div className="space-y-4">
              {/* Primary value card */}
              <div className="bg-[#98EF9B] rounded-xl p-6">
                <p className="text-sm font-medium text-foreground/70 mb-1">{fieldMap.label}</p>
                <p className="text-4xl font-bold text-foreground">
                  {fmtCurrency(currentValue ?? undefined)}
                </p>
              </div>

              {/* All three metrics side-by-side for context */}
              <div className="grid grid-cols-3 gap-3">
                {TABS.map((t) => {
                  const key = REVENUE_FIELD_MAP[t.id].statsKey;
                  const val = stats[key] as number;
                  return (
                    <div
                      key={t.id}
                      className={`rounded-xl p-4 cursor-pointer transition-colors ${
                        t.id === tab
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-foreground hover:bg-secondary/80"
                      }`}
                      onClick={() => setTab(t.id)}
                    >
                      <p className="text-xs font-medium opacity-70">{t.label}</p>
                      <p className="text-lg font-bold mt-1">{fmtCurrency(val)}</p>
                    </div>
                  );
                })}
              </div>

              {/* Period label */}
              <div className="bg-secondary rounded-xl p-4 text-sm">
                <p className="text-muted-foreground text-xs">Period</p>
                <p className="font-semibold capitalize">{period}</p>
              </div>

              {/* Trend breakdown */}
              {trends?.data && trends.data.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-foreground">Trend Breakdown</p>
                  <div className="max-h-52 overflow-y-auto space-y-2 pr-1">
                    {trends.data.map((point, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center bg-secondary rounded-lg px-4 py-2 text-sm"
                      >
                        <span className="text-muted-foreground">{point._id}</span>
                        <span className="font-semibold text-foreground">
                          {fmtCurrency((point[fieldMap.trendKey] as number) ?? undefined)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {point.orders} order{point.orders !== 1 ? "s" : ""}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
