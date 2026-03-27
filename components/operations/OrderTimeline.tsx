"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Package, 
  CreditCard, 
  Store, 
  ChefHat, 
  Bike, 
  MapPin, 
  ShieldCheck, 
  Flag 
} from "lucide-react";

interface TimelineStepProps {
  title: string;
  description: string;
  status: "done" | "current" | "pending";
  timestamp?: string;
  icon: React.ReactNode;
  isLast?: boolean;
}

const TimelineStep = ({ title, description, status, timestamp, icon, isLast }: TimelineStepProps) => {
  const isDone = status === "done";
  const isCurrent = status === "current";

  return (
    <div className="flex gap-4 min-h-[80px]">
      <div className="flex flex-col items-center">
        <div 
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-sm",
            isDone ? "bg-[#1a3f1c] border-[#1a3f1c] text-white" : 
            isCurrent ? "bg-[#98ef9b] border-[#1a3f1c] text-[#1a3f1c] animate-pulse" : 
            "bg-gray-100 border-gray-200 text-gray-400"
          )}
        >
          {icon}
        </div>
        {!isLast && (
          <div 
            className={cn(
              "w-0.5 flex-1 my-1 transition-all duration-500",
              isDone ? "bg-[#1a3f1c]" : "bg-gray-200"
            )}
          />
        )}
      </div>
      <div className="flex-1 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
          <h3 className={cn(
            "font-bold text-sm sm:text-base",
            isDone ? "text-[#1a3f1c]" : isCurrent ? "text-[#1a3f1c]" : "text-gray-400"
          )}>
            {title}
          </h3>
          {timestamp && (
            <span className="text-[10px] sm:text-xs text-gray-400 font-medium">
              {new Date(timestamp).toLocaleString("en-NG", {
                day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hour12: true
              })}
            </span>
          )}
        </div>
        <p className={cn(
          "text-xs sm:text-sm",
          isDone ? "text-gray-600" : isCurrent ? "text-[#1a3f1c] font-medium" : "text-gray-400"
        )}>
          {description}
        </p>
      </div>
    </div>
  );
};

export function OrderTimeline({ order }: { order: any }) {
  if (!order) return null;

  const status = (order.status || "").toLowerCase();
  const paymentStatus = (order.paymentStatus || "").toLowerCase();

  // Helper to determine step status
  const getStepStatus = (stepIndex: number, condition: boolean, currentCondition: boolean): "done" | "current" | "pending" => {
    if (condition) return "done";
    if (currentCondition) return "current";
    return "pending";
  };

  const steps = [
    {
      title: "Order Created",
      description: "Customer placed the order.",
      icon: <Package className="w-5 h-5" />,
      status: "done" as const,
      timestamp: order.createdAt || order.placedAt,
    },
    {
      title: "Payment Pending",
      description: paymentStatus === "paid" ? "Payment has been confirmed." : "Waiting for payment confirmation.",
      icon: <Clock className="w-5 h-5" />,
      status: getStepStatus(1, paymentStatus === "paid", paymentStatus !== "paid"),
      timestamp: order.createdAt, // Close enough to creation
    },
    {
      title: "Payment Confirmed",
      description: "Transaction verified successfully.",
      icon: <CreditCard className="w-5 h-5" />,
      status: getStepStatus(2, paymentStatus === "paid", false),
      timestamp: order.paymentConfirmedAt,
    },
    {
      title: "Vendor Accepted",
      description: "Vendor has acknowledged the order.",
      icon: <Store className="w-5 h-5" />,
      status: getStepStatus(3, !!order.acceptedAt || ["preparing", "ready", "picked_up", "riding", "delivered"].includes(status), status === "pending" && paymentStatus === "paid"),
      timestamp: order.acceptedAt,
    },
    {
      title: "Vendor Preparing",
      description: "Kitchen is preparing your meal.",
      icon: <ChefHat className="w-5 h-5" />,
      status: getStepStatus(4, !!order.preparingAt || ["ready", "picked_up", "riding", "delivered"].includes(status), status === "preparing"),
      timestamp: order.preparingAt,
    },
    {
      title: "Order Ready",
      description: "Meal is ready for pickup.",
      icon: <CheckCircle2 className="w-5 h-5" />,
      status: getStepStatus(5, !!order.readyAt || ["picked_up", "riding", "delivered"].includes(status), status === "ready"),
      timestamp: order.readyAt,
    },
    {
      title: "Rider Assigned",
      description: order.rider ? `Rider has been assigned.` : "Waiting for rider assignment.",
      icon: <Bike className="w-5 h-5" />,
      status: getStepStatus(6, !!order.riderAssignedAt || !!order.rider, status === "ready" && !order.rider),
      timestamp: order.riderAssignedAt,
    },
    {
      title: "Order Picked Up",
      description: "Rider has collected the order from vendor.",
      icon: <Package className="w-5 h-5" />,
      status: getStepStatus(7, !!order.pickedUpAt || ["riding", "delivered"].includes(status), status === "picked_up"),
      timestamp: order.pickedUpAt,
    },
    {
      title: "On The Way",
      description: "Rider is en route to customer location.",
      icon: <MapPin className="w-5 h-5" />,
      status: getStepStatus(8, !!order.inTransitAt || status === "riding" || status === "delivered", status === "riding"),
      timestamp: order.inTransitAt,
    },
    {
      title: "Delivery Code Sent",
      description: "Verification code sent to customer.",
      icon: <ShieldCheck className="w-5 h-5" />,
      status: getStepStatus(9, !!order.codeSentAt || status === "delivered", status === "riding" && !!order.deliveryOtpSentAt),
      timestamp: order.codeSentAt || order.deliveryOtpSentAt,
    },
    {
      title: "Code Verified",
      description: "Delivery code verified successfully.",
      icon: <ShieldCheck className="w-5 h-5" />,
      status: getStepStatus(10, !!order.codeVerifiedAt || status === "delivered", false),
      timestamp: order.codeVerifiedAt || order.deliveryConfirmedAt,
    },
    {
      title: "Order Completed",
      description: "Order delivered and journey complete.",
      icon: <Flag className="w-5 h-5" />,
      status: getStepStatus(11, status === "delivered" || status === "completed", false),
      timestamp: order.deliveredAt,
      isLast: true,
    },
  ];

  return (
    <div className="py-2 px-1 max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-[#1a3f1c] mb-2">Order Journey</h2>
        <p className="text-sm text-gray-500 italic">Track the real-time progress of this order from start to finish.</p>
      </div>
      <div className="space-y-0 text-left">
        {steps.map((step, index) => (
          <TimelineStep key={index} {...step} />
        ))}
      </div>
    </div>
  );
}
