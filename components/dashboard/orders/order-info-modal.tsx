// 'use client';

// import { Order } from '@/lib/orders-data';

// interface OrderInfoModalProps {
//   order: Order;
//   onClose: () => void;
//   onFlagClick: () => void;
// }

// export function OrderInfoModal({ order, onClose, onFlagClick }: OrderInfoModalProps) {
//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//       <div className="bg-background rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
//         {/* Header */}
//         <div className="sticky top-0 bg-background p-4 border-b border-border flex items-center justify-between">
//           <h2 className="text-xl font-bold text-foreground">Order Information</h2>
//           <button
//             onClick={onClose}
//             className="text-muted-foreground hover:text-foreground transition-colors"
//           >
//             <svg
//               className="w-6 h-6"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M6 18L18 6M6 6l12 12"
//               />
//             </svg>
//           </button>
//         </div>

//         {/* Content */}
//         <div className="p-6 space-y-6">
//           {/* Order Image */}
//           <img
//             src={order.foodImage}
//             alt="Order"
//             className="w-full h-48 object-cover rounded-lg"
//           />

//           {/* Details Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {/* Customer Details */}
//             <div className="bg-[#98EF9B] rounded-lg p-4 space-y-2">
//               <h3 className="font-semibold text-foreground mb-3">Customer Details</h3>
//               <div className="flex items-center gap-2">
//                 <svg
//                   className="w-5 h-5 text-foreground"
//                   fill="currentColor"
//                   viewBox="0 0 20 20"
//                 >
//                   <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
//                 </svg>
//                 <span className="text-foreground font-medium">{order.customerName}</span>
//               </div>
//               <div className="flex items-start gap-2">
//                 <svg
//                   className="w-5 h-5 text-red-500 shrink-0 mt-0.5"
//                   fill="currentColor"
//                   viewBox="0 0 20 20"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//                 <span className="text-foreground">{order.customerAddress}</span>
//               </div>
//             </div>

//             {/* Vendor Details */}
//             <div className="bg-[#98EF9B] rounded-lg p-4 space-y-2">
//               <h3 className="font-semibold text-foreground mb-3">Vendor Details</h3>
//               <div className="flex items-center gap-2">
//                 <svg
//                   className="w-5 h-5 text-foreground"
//                   fill="currentColor"
//                   viewBox="0 0 20 20"
//                 >
//                   <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
//                 </svg>
//                 <span className="text-foreground font-medium">{order.vendorName}</span>
//               </div>
//               <div className="flex items-start gap-2">
//                 <svg
//                   className="w-5 h-5 text-red-500 shrink-0 mt-0.5"
//                   fill="currentColor"
//                   viewBox="0 0 20 20"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//                 <span className="text-foreground">21, Old yaba road, surulere.</span>
//               </div>
//             </div>

//             {/* Rider Details */}
//             <div className="bg-[#98EF9B] rounded-lg p-2 space-y-1">
//               <h3 className="font-semibold text-foreground mb-3">Rider Details</h3>
//               <div className="flex items-center gap-2">
//                 <svg
//                   className="w-5 h-5 text-foreground"
//                   fill="currentColor"
//                   viewBox="0 0 20 20"
//                 >
//                   <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
//                 </svg>
//                 <span className="text-foreground font-medium">{order.riderName}</span>
//               </div>
//               <div className="flex items-start gap-2">
//                 <svg
//                   className="w-5 h-5 text-green-600 shrink-0 mt-0.5"
//                   fill="currentColor"
//                   viewBox="0 0 20 20"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//                 <span className="text-foreground">{order.riderZone}</span>
//               </div>
//             </div>

//             {/* Order Details */}
//             <div className="bg-[#98EF9B] rounded-lg p-2 space-y-1">
//               <h3 className="font-semibold text-foreground mb-3">Order Details</h3>
//               <div className="space-y-2">
//                 <div>
//                   <p className="text-lg text-black">
//                     <span className="font-medium">Order ID : </span>{" "}
//                     {order.orderId}
//                 </p>
//                 </div>
//                 <div>
//                   <p className="text-lg text-black">
//                     <span className="font-medium">Amount Paid :</span>{" "}
//                     ₦{order.amountPaid.toLocaleString()}
//                 </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Status */}
//           <div className="text-center py-4 border-y border-border">
//             <p className="text-lg font-semibold text-foreground">
//               Status: <span className="text-primary capitalize">{order.status}</span>
//             </p>
//           </div>

//           {/* Action Buttons */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity cursor-pointer">
//               Print Slip
//             </button>
//             <button
//               onClick={onFlagClick}
//               className="px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity cursor-pointer"
//             >
//               Flag Order
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



'use client';

import { useRef } from 'react';
import { type Order } from '@/lib/api/api';

interface OrderInfoModalProps {
  order: Order;
  onClose: () => void;
  onFlagClick: () => void;
}

export function OrderInfoModal({ order, onClose, onFlagClick }: OrderInfoModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  // Derive display values using the backend's flattened fields.
  // Fallback chain mirrors the controller's populate + mapping.
  const orderId    = order.orderNumber ?? order._id ?? order.id;
  const amountPaid = order.amountPaid  ?? order.totalAmount ?? 0;

  // customerName: controller populates customer.user.name but doesn't flatten it in the list
  // endpoint yet — use the nested object as a fallback until the backend adds the flat field.
  const customerName =
    order.customerName ??
    order.customer?.user?.name ??
    '—';

  const vendorName =
    order.vendorName ??          // flattened by controller ✓
    order.storeName  ??
    order.vendor?.owner?.name ??
    '—';

  const riderName =
    order.riderName ??
    order.rider?.user?.name ??
    '—';

  const handlePrint = () => {
    if (!printRef.current) return;
    const content = printRef.current.innerHTML;
    const win = window.open('', '_blank', 'width=800,height=600');
    if (!win) return;
    win.document.write(`
      <html>
        <head>
          <title>Order Slip — ${orderId}</title>
          <style>
            body { font-family: sans-serif; padding: 24px; color: #000; }
            h2 { margin-bottom: 8px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
            .card { border: 1px solid #ccc; border-radius: 8px; padding: 12px; }
            .label { font-weight: 600; }
            .status { text-align: center; padding: 12px; border-top: 1px solid #ccc; border-bottom: 1px solid #ccc; font-size: 1.1em; }
            table { width: 100%; border-collapse: collapse; }
            td, th { padding: 8px; text-align: left; border-bottom: 1px solid #eee; }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="sticky top-0 bg-background px-6 py-4 border-b border-border flex items-center justify-between rounded-t-xl z-10">
          <h2 className="text-xl font-bold text-foreground">Order Information</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable content — also the print target */}
        <div ref={printRef} className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* Food image */}
          {(order.foodImage || order.items?.[0]?.image) ? (
            <img
              src={order.foodImage ?? order.items![0].image}
              alt="Order"
              className="w-full h-48 object-cover rounded-xl"
            />
          ) : (
            <div className="w-full h-48 rounded-xl bg-primary/10 flex items-center justify-center text-6xl">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="20" fill="#FFCA3A"/>
          <path d="M29 24C29 19.375 25.493 15.559 21 15.059V13H19V15.059C14.507 15.559 11 19.375 11 24V26H29V24ZM10 27H30V29H10V27Z" fill="#1A3F1C"/>
          </svg>
            </div>
          )}

          {/* Details grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Customer */}
            <InfoCard title="Customer Details">
              <DetailRow icon="👤" value={customerName} bold />
              {order.customerAddress && (
                <DetailRow icon="📍" value={order.customerAddress} iconColor="text-red-500" />
              )}
            </InfoCard>

            {/* Vendor */}
            <InfoCard title="Vendor Details">
              <DetailRow icon="👤" value={vendorName} bold />
              {/* vendorAddress: ⚠️ backend should flatten this — see api.ts comments */}
              {order.vendorAddress ? (
                <DetailRow icon="📍" value={order.vendorAddress} iconColor="text-red-500" />
              ) : order.vendor?.storeDetails?.address ? (
                <DetailRow icon="📍" value={order.vendor.storeDetails.address} iconColor="text-red-500" />
              ) : null}
            </InfoCard>

            {/* Rider */}
            <InfoCard title="Rider Details">
              <DetailRow icon="👤" value={riderName} bold />
              {order.riderZone && (
                <DetailRow icon="📍" value={order.riderZone} iconColor="text-green-600" />
              )}
              {order.riderPhone && (
                <DetailRow icon="📱" value={order.riderPhone} />
              )}
              {/* Fallback: rider phone from nested populate */}
              {!order.riderPhone && order.rider?.phone && (
                <DetailRow icon="📱" value={order.rider.phone} />
              )}
            </InfoCard>

            {/* Order */}
            <InfoCard title="Order Details">
              <p className="text-base text-black">
                <span className="font-medium">Order ID: </span>
                <span className="font-mono text-sm break-all">{orderId}</span>
              </p>
              <p className="text-base text-black">
                <span className="font-medium">Amount Paid: </span>
                ₦{amountPaid.toLocaleString()}
              </p>
              {order.paymentStatus && (
                <p className="text-base text-black capitalize">
                  <span className="font-medium">Payment: </span>
                  {order.paymentStatus}
                </p>
              )}
            </InfoCard>
          </div>

          {/* Line items */}
          {order.items && order.items.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Items</h3>
              <div className="bg-secondary rounded-xl overflow-hidden divide-y divide-border">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center px-4 py-3 text-sm">
                    <span className="text-foreground">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-medium text-foreground">
                      ₦{((item.price ?? 0) * (item.quantity ?? 1)).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status */}
          <div className="text-center py-4 border-y border-border">
            <p className="text-lg font-semibold text-foreground">
              Status:{' '}
              <span className="text-primary capitalize">
                {order.status?.replace(/_/g, ' ') ?? '—'}
              </span>
              {order.isReported && (
                <span className="ml-2 text-sm text-orange-600 font-medium">(Reported)</span>
              )}
            </p>
            {order.overrideReason && (
              <p className="text-sm text-muted-foreground mt-1">
                Override reason: {order.overrideReason}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handlePrint}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              Print Slip
            </button>
            <button
              onClick={onFlagClick}
              disabled={order.isReported}
              className="px-6 py-3 bg-accent text-accent-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {order.isReported ? 'Already Flagged' : 'Flag Order'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── Micro-components ────────────────────────────────────────────────────────

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#98EF9B] rounded-xl p-4 space-y-2">
      <h3 className="font-semibold text-foreground mb-2">{title}</h3>
      {children}
    </div>
  );
}

function DetailRow({
  icon,
  value,
  bold = false,
  iconColor = 'text-foreground',
}: {
  icon: string;
  value: string;
  bold?: boolean;
  iconColor?: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className={`text-lg shrink-0 ${iconColor}`}>{icon}</span>
      <span className={`text-foreground text-sm ${bold ? 'font-semibold' : ''}`}>{value}</span>
    </div>
  );
}