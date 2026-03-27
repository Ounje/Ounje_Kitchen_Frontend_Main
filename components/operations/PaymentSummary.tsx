"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { CreditCard, Wallet, Landmark, Info, CheckCircle2, AlertCircle } from "lucide-react";

interface PaymentSummaryProps {
  order: any;
}

export function PaymentSummary({ order }: PaymentSummaryProps) {
  if (!order) return null;

  const paymentStatus = (order.paymentStatus || "unpaid").toLowerCase();
  const paymentMethod = order.paymentMethod || "Bank Transfer";
  const amount = order.totalPrice || order.grandTotal || order.total || 0;
  const reference = order.paymentReference || "N/A";

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case "paid": return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "refunded": return <Info className="w-5 h-5 text-blue-600" />;
      default: return <AlertCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getMethodIcon = () => {
    const method = paymentMethod.toLowerCase();
    if (method.includes("card")) return <CreditCard className="w-4 h-4" />;
    if (method.includes("wallet") || method.includes("credit")) return <Wallet className="w-4 h-4" />;
    return <Landmark className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-full",
            paymentStatus === "paid" ? "bg-green-100" : paymentStatus === "refunded" ? "bg-blue-100" : "bg-red-100"
          )}>
            {getStatusIcon()}
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Payment Status</p>
            <p className={cn(
              "text-lg font-bold uppercase",
              paymentStatus === "paid" ? "text-green-700" : paymentStatus === "refunded" ? "text-blue-700" : "text-red-700"
            )}>
              {paymentStatus}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total Amount</p>
          <p className="text-2xl font-black text-[#1a3f1c]">₦{Number(amount).toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-gray-100 space-y-3">
          <div className="flex items-center gap-2 text-gray-700 font-bold text-sm">
            {getMethodIcon()}
            Payment Method
          </div>
          <p className="text-sm text-gray-600">{paymentMethod}</p>
          <div className="pt-2 border-t border-gray-50">
             <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Reference ID</p>
             <p className="text-xs font-mono text-gray-600 truncate">{reference}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-gray-100 space-y-3">
          <div className="flex items-center gap-2 text-gray-700 font-bold text-sm">
            <Info className="w-4 h-4" />
            Payment History
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Order Placed</span>
              <span className="text-gray-600 font-medium">{order.createdAt ? new Date(order.createdAt).toLocaleString() : "—"}</span>
            </div>
            {order.paymentConfirmedAt && (
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Payment Confirmed</span>
                <span className="text-green-600 font-bold">{new Date(order.paymentConfirmedAt).toLocaleString()}</span>
              </div>
            )}
            {order.refundedAt && (
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Refund Processed</span>
                <span className="text-blue-600 font-bold">{new Date(order.refundedAt).toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {order.paymentDetails && (
        <div className="p-4 rounded-xl bg-[#98ef9b]/10 border border-[#98ef9b]/20">
          <p className="text-xs font-bold text-[#1a3f1c] mb-2 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Gateway Response Details
          </p>
          <pre className="text-[10px] text-[#1a3f1c]/70 font-mono overflow-auto max-h-32">
            {JSON.stringify(order.paymentDetails, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

function ShieldCheck({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
