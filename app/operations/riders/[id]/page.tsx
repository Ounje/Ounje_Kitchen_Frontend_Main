"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { X, Phone, MapPin, Bike, FileText, ShoppingBag, XCircle, Clock, Hash } from "lucide-react";
import { useRider, useSuspendRider, useActivateRider, useDeleteRider } from "@/hooks/useRiders";
import { RiderStatusBadge } from "@/components/operations/riders/StatusBadge";
import { RiderDetailsSkeleton } from "@/components/operations/riders/SkeletonLoaders";
import { ConfirmModal, SuccessModal } from "@/components/operations/riders/ActionModals";
import { formatNigerianPhone } from "@/lib/utils/formatPhone";

export default function RiderDetailsPage() {
  const params  = useParams();
  const router  = useRouter();
  const riderId = params.id as string;

  const [suspendModal,  setSuspendModal]  = useState(false);
  const [activateModal, setActivateModal] = useState(false);
  const [deleteModal,   setDeleteModal]   = useState(false);
  const [successModal,  setSuccessModal]  = useState<{ isOpen: boolean; message: string }>({ isOpen: false, message: "" });

  const { data: rider, isLoading } = useRider(riderId);
  const suspendMutation  = useSuspendRider();
  const activateMutation = useActivateRider();
  const deleteMutation   = useDeleteRider();

  const confirmSuspend = async () => {
    await suspendMutation.mutateAsync(riderId);
    setSuspendModal(false);
    setSuccessModal({ isOpen: true, message: "Rider suspended successfully." });
  };

  const confirmActivate = async () => {
    await activateMutation.mutateAsync(riderId);
    setActivateModal(false);
    setSuccessModal({ isOpen: true, message: "Rider account activated successfully." });
  };

  const confirmDelete = async () => {
    await deleteMutation.mutateAsync(riderId);
    setDeleteModal(false);
    router.push("/operations/riders");
  };

  if (isLoading) return <RiderDetailsSkeleton />;

  if (!rider) {
    return (
      <div className="flex items-center justify-center min-h-75">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Rider not found.</p>
          <button type="button" onClick={() => router.push("/operations/riders")}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#1a3f1c]">
            Back to Riders
          </button>
        </div>
      </div>
    );
  }

  const deliveryStats = [
    { label: "Successful", value: rider.successfulDeliveries,  icon: ShoppingBag, color: "text-green-700",  bg: "bg-green-50",     border: "border-green-100"     },
    { label: "Cancelled",  value: rider.cancelledDeliveries,   icon: XCircle,     color: "text-red-700",    bg: "bg-red-50",       border: "border-red-100"       },
    { label: "Processing", value: rider.processingDeliveries,  icon: Clock,       color: "text-amber-700",  bg: "bg-amber-50",     border: "border-amber-100"     },
    { label: "Total",      value: rider.totalDeliveries,        icon: Hash,        color: "text-[#1a3f1c]",  bg: "bg-[#98ef9b]/20", border: "border-[#98ef9b]/40"  },
  ];

  return (
    <div>
        {/* Page header */}
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-lg font-black text-[#1a3f1c]">Rider Details</h1>
          <button type="button" onClick={() => router.push("/operations/riders")}
            aria-label="Back to riders"
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Profile card */}
        <div className="glass-card hover-lift p-6 mb-5">
          <div className="flex items-start gap-4">
            <div className="shrink-0">
              {rider.photo ? (
                <img src={rider.photo} alt={rider.name}
                  className="w-16 h-16 rounded-xl object-cover ring-2 ring-gray-100" />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-[#98ef9b]/40 flex items-center justify-center text-xl font-bold text-[#1a3f1c]">
                  {(rider.name ?? "?").charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <h2 className="text-base font-bold text-gray-900 truncate">{rider.name}</h2>
                <RiderStatusBadge status={rider.riderStatus} size="sm" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 gap-x-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span className="tabular-nums">{formatNigerianPhone(rider.phone) || "—"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Bike className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span>{rider.serviceMode || "—"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span className="truncate">{rider.zone || rider.mostFrequentZone || "—"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FileText className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <Link href={`/operations/riders/${riderId}/document`}
                    className="text-[#1a3f1c] font-semibold hover:underline text-sm">
                    View Document
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery stats */}
        <div className="mb-4">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Delivery Performance</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {deliveryStats.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className={`glass-card hover-lift p-4 flex items-center gap-4 ${s.border}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.bg} ${s.color} shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className={`text-2xl font-black ${s.color} leading-none`}>{s.value ?? 0}</p>
                    <p className="text-xs font-bold text-gray-500 mt-1">{s.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Zone card */}
        {(rider.mostFrequentZone || rider.zone) && (
          <div className="bg-[#1a3f1c] rounded-xl p-4 mb-4 flex items-center gap-3">
            <MapPin className="w-5 h-5 text-[#ffca3a] shrink-0" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">Most Frequent Zone</p>
              <p className="text-sm font-bold text-white">{rider.mostFrequentZone || rider.zone}</p>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 pt-4 mt-4 border-t border-gray-100">
          {rider.accountStatus === "active" ? (
            <button type="button" onClick={() => setSuspendModal(true)}
              className="px-5 py-2.5 rounded-xl text-sm font-bold bg-amber-400 text-[#1a3f1c] hover:opacity-90 transition-opacity">
              Suspend Account
            </button>
          ) : (
            <button type="button" onClick={() => setActivateModal(true)}
              className="px-5 py-2.5 rounded-xl text-sm font-bold bg-[#1a3f1c] text-white hover:opacity-90 transition-opacity">
              Activate Account
            </button>
          )}
          <button type="button" onClick={() => setDeleteModal(true)}
            className="px-5 py-2.5 rounded-xl text-sm font-bold bg-red-600 text-white hover:opacity-90 transition-opacity">
            Delete Account
          </button>
        </div>

      <ConfirmModal isOpen={suspendModal}  onClose={() => setSuspendModal(false)}  onConfirm={confirmSuspend}  title="Suspend this rider?"  loading={suspendMutation.isPending} />
      <ConfirmModal isOpen={activateModal} onClose={() => setActivateModal(false)} onConfirm={confirmActivate} title="Activate this rider?" loading={activateMutation.isPending} />
      <ConfirmModal isOpen={deleteModal}   onClose={() => setDeleteModal(false)}   onConfirm={confirmDelete}   title="Delete this account?" loading={deleteMutation.isPending} />
      <SuccessModal isOpen={successModal.isOpen} title={successModal.message}
        onClose={() => { setSuccessModal({ isOpen: false, message: "" }); router.push("/operations/riders"); }} />
    </div>
  );
}
