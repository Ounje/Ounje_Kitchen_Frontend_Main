"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { notificationService } from "@/lib/api/services/notification.service";
import { promoService } from "@/lib/api/services/promo.service";
import { useAuth } from "@/lib/context/AuthContext";
import {
  ArrowRight,
  Bell,
  CheckCircle,
  Trash2,
  X,
  AlertCircle,
  Info,
  ChevronRight,
} from "lucide-react";

// --- Portal color mapping ---
const portalColors: Record<string, { bg: string; text: string; border: string }> = {
  Admin: { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-200" },
  Operations: { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200" },
  Finance: { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-200" },
  IT: { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-200" },
  All: { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-200" },
  Customers: { bg: "bg-pink-100", text: "text-pink-700", border: "border-pink-200" },
  Vendors: { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-200" },
  Riders: { bg: "bg-cyan-100", text: "text-cyan-700", border: "border-cyan-200" },
};

function PortalBadge({ name }: { name: string }) {
  const colors = portalColors[name] || {
    bg: "bg-gray-100",
    text: "text-gray-700",
    border: "border-gray-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colors.bg} ${colors.text} ${colors.border}`}
    >
      {name}
    </span>
  );
}

// --- Type badge ---
const typeMeta: Record<string, { label: string; bg: string; text: string; icon: any }> = {
  promo_approval_request: {
    label: "Needs Approval",
    bg: "bg-amber-50",
    text: "text-amber-700",
    icon: AlertCircle,
  },
  promo_approved: {
    label: "Approved",
    bg: "bg-green-50",
    text: "text-green-700",
    icon: CheckCircle,
  },
  promo_declined: { label: "Declined", bg: "bg-red-50", text: "text-red-700", icon: X },
  promo_approval_processed: {
    label: "Processed",
    bg: "bg-gray-50",
    text: "text-gray-600",
    icon: CheckCircle,
  },
  general: { label: "Broadcast", bg: "bg-indigo-50", text: "text-indigo-700", icon: Bell },
  broadcast: { label: "Broadcast", bg: "bg-indigo-50", text: "text-indigo-700", icon: Bell },
};

interface NotificationDetailModalProps {
  notification: any | null;
  open: boolean;
  onClose: () => void;
}

export function NotificationDetailModal({
  notification,
  open,
  onClose,
}: NotificationDetailModalProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showDeclineForm, setShowDeclineForm] = useState(false);
  const [declineReason, setDeclineReason] = useState("");

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
    queryClient.invalidateQueries({ queryKey: ["notifications_widget"] });
    queryClient.invalidateQueries({ queryKey: ["promos"] });
  };

  const markReadMutation = useMutation({
    mutationFn: () => notificationService.markAsRead(notification?.id || notification?._id),
    onSuccess: () => {
      toast.success("Marked as read");
      invalidate();
      onClose();
    },
    onError: (err: any) => toast.error(err.message || "Failed to mark as read"),
  });

  const deleteMutation = useMutation({
    mutationFn: () => notificationService.deleteBroadcast(notification?.id || notification?._id),
    onSuccess: () => {
      toast.success("Notification deleted");
      invalidate();
      onClose();
    },
    onError: (err: any) => toast.error(err.message || "Failed to delete"),
  });

  const approveMutation = useMutation({
    mutationFn: () => promoService.approvePromo(notification?.relatedId),
    onSuccess: () => {
      toast.success("Promo approved! Operations has been notified.");
      invalidate();
      onClose();
    },
    onError: (err: any) => toast.error(err.message || "Failed to approve promo"),
  });

  const declineMutation = useMutation({
    mutationFn: () => promoService.declinePromo(notification?.relatedId, declineReason),
    onSuccess: () => {
      toast.success("Promo declined. Operations has been notified.");
      setShowDeclineForm(false);
      setDeclineReason("");
      invalidate();
      onClose();
    },
    onError: (err: any) => toast.error(err.message || "Failed to decline promo"),
  });

  const isPromoApprovalRequest =
    notification?.type === "promo_approval_request" ||
    notification?.type === "promo_approval_processed";
  const isRead = notification?.read;

  // --- Fetch Related Promo ---
  const { data: promoData, isLoading: isLoadingPromo } = useQuery({
    queryKey: ["promo", notification?.relatedId],
    queryFn: async () => {
      const res: any = await promoService.getPromoById(notification.relatedId);
      return res?.data?.promo || res?.promo || res;
    },
    enabled: !!(open && notification?.relatedId && isPromoApprovalRequest),
    staleTime: 60000, // Keep promo data fresh for 1 minute
  });

  const isPending = promoData?.status === "pending_approval";
  // canApprove only if we have promoData AND it is pending_approval
  const canApprove =
    isPromoApprovalRequest &&
    user?.isSuperAdmin &&
    notification?.relatedId &&
    !isLoadingPromo &&
    isPending;

  if (!notification) return null;

  const fromPortal = notification.sourcePortal || "System";
  const toPortal = notification.targetPortal || notification.audience || "All";
  const formattedDate = notification.createdAt
    ? new Date(notification.createdAt).toLocaleString()
    : "Just now";
  const typeInfo = typeMeta[notification.type] || typeMeta.general;
  const TypeIcon = typeInfo.icon;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[540px] p-0 overflow-hidden rounded-xl bg-white shadow-2xl transition-all">
        {/* Header strip — brand aligned */}
        <div className={`px-6 pt-6 pb-4 bg-primary border-b border-white/10`}>
          <DialogHeader>
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-full bg-white/10 border border-white/10`}>
                <TypeIcon className={`w-5 h-5 text-white`} />
              </div>
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-white text-lg font-black tracking-tight leading-tight">
                  {notification.title}
                </DialogTitle>
                <p className={`text-xs font-bold mt-0.5 text-secondary`}>{typeInfo.label}</p>
              </div>
              {!isRead && (
                <span
                  className="shrink-0 w-2.5 h-2.5 rounded-full bg-blue-400 mt-1.5 shadow-[0_0_8px_rgba(96,165,250,0.6)]"
                  title="Unread"
                />
              )}
            </div>
          </DialogHeader>
          {/* Route: From → To */}
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <span className="text-[10px] uppercase font-black tracking-widest text-white/40">
              From
            </span>
            <PortalBadge name={fromPortal} />
            <ChevronRight className="w-3.5 h-3.5 text-white/30 shrink-0" />
            <span className="text-[10px] uppercase font-black tracking-widest text-white/40">
              To
            </span>
            <PortalBadge name={toPortal} />
            <span className="ml-auto text-[10px] font-bold text-white/50">{formattedDate}</span>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 bg-white">
          {/* Message */}
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 leading-relaxed border border-gray-100 whitespace-pre-wrap">
            {notification.message}
          </div>

          {/* Promo Summary (if applicable) */}
          {isPromoApprovalRequest && promoData && (
            <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
              <div className="bg-gray-50 px-3 py-1.5 border-b text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                Promo Details
              </div>
              <div className="p-3 grid grid-cols-2 gap-y-2 gap-x-4">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-semibold">Code</p>
                  <p className="text-sm font-mono font-bold text-[#1A3F1C]">{promoData.code}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-semibold">Discount</p>
                  <p className="text-sm font-bold">
                    {promoData.discountValue}
                    {promoData.discountType === "percentage" ? "%" : "₦"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-semibold">Min Order</p>
                  <p className="text-sm font-medium">₦{promoData.minOrderValue || 0}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-semibold">Usage Limit</p>
                  <p className="text-sm font-medium">{promoData.maxTotalUses} users</p>
                </div>
              </div>
            </div>
          )}

          {/* Status Badge for Processed Request */}
          {isPromoApprovalRequest && promoData && !isPending && (
            <div
              className={`rounded-lg p-3 flex items-center gap-2 border ${
                promoData.status === "active"
                  ? "bg-green-50 border-green-200 text-green-700"
                  : "bg-red-50 border-red-200 text-red-700"
              }`}
            >
              <CheckCircle className="w-4 h-4 shrink-0" />
              <p className="text-sm font-semibold">
                This request has been processed:
                <span className="capitalize ml-1">
                  {promoData.status === "active" ? "Approved" : promoData.status}
                </span>
              </p>
            </div>
          )}

          {canApprove && !showDeclineForm && (
            <div className="border border-amber-200 bg-amber-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <p className="text-sm font-semibold text-amber-800">
                  This promo requires your approval
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white gap-1.5"
                  onClick={() => approveMutation.mutate()}
                  disabled={approveMutation.isPending}
                >
                  <CheckCircle className="w-4 h-4" />
                  {approveMutation.isPending ? "Approving..." : "Approve"}
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1 gap-1.5"
                  onClick={() => setShowDeclineForm(true)}
                >
                  <X className="w-4 h-4" />
                  Decline
                </Button>
              </div>
            </div>
          )}

          {/* Decline form */}
          {showDeclineForm && (
            <div className="border-2 border-red-100 bg-red-50/50 rounded-xl p-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center gap-2 text-red-700">
                <div className="p-1.5 bg-red-100 rounded-full">
                  <X className="w-4 h-4" />
                </div>
                <p className="font-bold text-sm tracking-tight">Deny Promotion Request</p>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="decline-reason"
                  className="text-xs font-bold text-red-800 uppercase tracking-wider flex items-center gap-1"
                >
                  Reason for Denial <span className="text-red-400 font-normal">*</span>
                </Label>
                <Textarea
                  id="decline-reason"
                  placeholder="Example: This discount is too high for the current campaign..."
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  className="min-h-[100px] bg-white border-red-200 text-sm focus-visible:ring-red-500 shadow-inner"
                />
              </div>

              <div className="flex gap-2 pt-1 border-t border-red-100 mt-2">
                <Button
                  variant="outline"
                  className="flex-1 text-xs border-red-200 text-red-700 hover:bg-red-100 transition-colors"
                  onClick={() => setShowDeclineForm(false)}
                >
                  Back to Decisions
                </Button>
                <Button
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold"
                  onClick={() => {
                    if (!declineReason.trim()) {
                      toast.error("Please provide a reason for denial");
                      return;
                    }
                    declineMutation.mutate();
                  }}
                  disabled={declineMutation.isPending}
                >
                  {declineMutation.isPending ? "Denying..." : "Confirm Denial"}
                </Button>
              </div>
            </div>
          )}

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-2 pt-1 border-t border-gray-100">
            {!isRead && (
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-blue-600 border-blue-200 hover:bg-blue-50"
                onClick={() => markReadMutation.mutate()}
                disabled={markReadMutation.isPending}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                {markReadMutation.isPending ? "Marking..." : "Mark as Read"}
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="w-3.5 h-3.5" />
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
