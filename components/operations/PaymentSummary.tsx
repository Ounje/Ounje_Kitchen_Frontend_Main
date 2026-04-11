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
      <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/80 shadow-sm">
        <div className="flex items-center gap-4">
          <div className={cn(
            "p-3 rounded-full flex-shrink-0",
            paymentStatus === "paid" ? "bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400" : paymentStatus === "refunded" ? "bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400" : "bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400"
          )}>
            {getStatusIcon()}
          </div>
          <div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mb-1">Payment Status</p>
            <p className={cn(
              "text-xl font-black uppercase tracking-tight",
              paymentStatus === "paid" ? "text-green-700 dark:text-green-400" : paymentStatus === "refunded" ? "text-blue-700 dark:text-blue-400" : "text-red-700 dark:text-red-400"
            )}>
              {paymentStatus}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mb-1">Total Amount</p>
          <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">₦{Number(amount).toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-slate-900 dark:text-gray-100 font-bold text-sm tracking-tight">
            {getMethodIcon()}
            Payment Method
          </div>
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">{paymentMethod}</p>
          <div className="pt-3 mt-3 border-t border-gray-100 dark:border-slate-700">
             <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-widest mb-0.5">Reference ID</p>
             <p className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300 truncate">{reference}</p>
          </div>
        </div>

        <div className="p-5 rounded-xl border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-slate-900 dark:text-gray-100 font-bold text-sm tracking-tight">
            <Info className="w-4 h-4" />
            Payment History
          </div>
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Order Placed</span>
              <span className="text-slate-800 dark:text-slate-200 font-bold bg-slate-50 dark:bg-slate-700 px-2 py-0.5 rounded">{order.createdAt ? new Date(order.createdAt).toLocaleString() : "—"}</span>
            </div>
            {order.paymentConfirmedAt && (
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Payment Confirmed</span>
                <span className="text-green-700 dark:text-green-400 font-bold bg-green-50 dark:bg-green-500/10 px-2 py-0.5 rounded">{new Date(order.paymentConfirmedAt).toLocaleString()}</span>
              </div>
            )}
            {order.refundedAt && (
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Refund Processed</span>
                <span className="text-blue-700 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded">{new Date(order.refundedAt).toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {order.paymentDetails && (
        <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700">
          <p className="text-xs font-bold text-slate-700 dark:text-gray-300 mb-3 flex items-center gap-2 uppercase tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5" /> Gateway Response Details
          </p>
          <pre className="text-[10px] text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-3 rounded-lg font-mono overflow-auto max-h-40">
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
