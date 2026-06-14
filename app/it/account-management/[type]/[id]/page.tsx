"use client";

import { use, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { itService } from "@/lib/api/services/it.service";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  AlertCircle,
  CheckCircle2,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

// ── Unwrap ────────────────────────────────────────────────────────────────────
// IT single-record: { success, data: { customer/vendor/rider/staff: {...} } }
function unwrap(res: any, entityType: string): any {
  if (!res) return null;
  const d = res?.data ?? res;
  if (entityType === "customer" && d?.customer) return d.customer;
  if (entityType === "vendor" && d?.vendor) return d.vendor;
  if (entityType === "rider" && d?.rider) return d.rider;
  if (entityType === "staff" && (d?.staff || d?.admin)) return d.staff ?? d.admin;
  // fallback — if d is a plain object it's the entity itself
  if (d && typeof d === "object" && !Array.isArray(d)) return d;
  return res;
}

// ── Field resolvers ───────────────────────────────────────────────────────────
function resolveName(account: any, entityType: string): string {
  if (entityType === "customer") return account.user?.name || account.name || "N/A";
  if (entityType === "vendor") return account.name || "N/A";
  if (entityType === "rider")
    return `${account.firstName ?? ""} ${account.lastName ?? ""}`.trim() || "N/A";
  return `${account.firstName ?? ""} ${account.lastName ?? ""}`.trim() || account.name || "N/A";
}

function resolveEmail(account: any, entityType: string): string {
  if (entityType === "customer") return account.user?.email || account.email || "N/A";
  if (entityType === "vendor") return account.owner?.email || account.email || "N/A";
  return account.email || "N/A";
}

function resolvePhone(account: any, entityType: string): string {
  if (entityType === "customer") {
    const p = account.user?.phone || account.phone || account.phoneNumber;
    return p ? String(p) : "N/A";
  }
  if (entityType === "vendor") {
    const p = account.owner?.phone || account.phone;
    return p ? String(p) : "N/A";
  }
  const p = account.phone || account.phoneNumber;
  return p ? String(p) : "N/A";
}

function resolveAddress(account: any, entityType: string): string {
  const addr =
    entityType === "vendor"
      ? account.location?.address || account.address
      : account.address?.street || account.address;
  if (!addr) return "";
  return typeof addr === "string" ? addr : "";
}

function resolveRole(account: any, entityType: string): string {
  if (entityType === "staff") {
    if (account.isSuperAdmin) return "Super Admin";
    if (account.isHead) return `${account.department} Head`;
    return `${account.department || "—"} Staff`;
  }
  return entityType.charAt(0).toUpperCase() + entityType.slice(1);
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AccountDetailPage({
  params,
}: {
  params: Promise<{ type: string; id: string }>;
}) {
  const { type, id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const entityType = searchParams.get("entityType") as "customer" | "vendor" | "rider" | "staff";
  const status = searchParams.get("status") as "suspended" | "deleted";

  const [account, setAccount] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchAccountDetails();
  }, [id, entityType]);

  const fetchAccountDetails = async () => {
    setLoading(true);
    try {
      let raw: any;
      switch (entityType) {
        case "customer":
          raw = await itService.getCustomer(id);
          break;
        case "vendor":
          raw = await itService.getVendor(id);
          break;
        case "rider":
          raw = await itService.getRider(id);
          break;
        case "staff":
          raw = await itService.getStaffMember(id);
          break;
        default:
          throw new Error("Unknown entity type");
      }
      setAccount(unwrap(raw, entityType));
    } catch (err: any) {
      toast.error(err.message || "Failed to load account details");
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    setProcessing(true);
    try {
      if (entityType === "customer") {
        status === "suspended"
          ? await itService.activateCustomer(id)
          : await itService.restoreCustomer(id);
      } else if (entityType === "vendor") {
        status === "suspended"
          ? await itService.activateVendor(id)
          : await itService.restoreVendor(id);
      } else if (entityType === "rider") {
        status === "suspended"
          ? await itService.activateRider(id)
          : await itService.restoreRider(id);
      } else {
        status === "suspended"
          ? await itService.activateStaff(id)
          : await itService.restoreStaff(id);
      }
      setConfirmModalOpen(false);
      setSuccessModalOpen(true);
    } catch (err: any) {
      toast.error(
        err.message || `Failed to ${status === "suspended" ? "activate" : "restore"} account`
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      if (entityType === "customer") await itService.deleteCustomer(id);
      else if (entityType === "vendor") await itService.deleteVendor(id);
      else if (entityType === "rider") await itService.deleteRider(id);
      else await itService.deleteStaff(id);
      toast.success("Account deleted successfully");
      setDeleteModalOpen(false);
      router.push("/it/account-management");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete account");
    } finally {
      setDeleting(false);
    }
  };

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-[#1a3f1c] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!account) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <p className="text-gray-500 text-lg mb-4">Account not found</p>
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" /> Go Back
        </Button>
      </div>
    );
  }

  // ── Resolved values ───────────────────────────────────────────────────────
  const name = resolveName(account, entityType);
  const email = resolveEmail(account, entityType);
  const phone = resolvePhone(account, entityType);
  const address = resolveAddress(account, entityType);
  const role = resolveRole(account, entityType);
  const initials =
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "??";

  const statusColor = status === "suspended" ? "bg-yellow-500" : "bg-red-500";
  const actionText = status === "suspended" ? "Activate Account" : "Restore Account";

  const reason = account.suspensionReason || account.deletionReason || account.reason;
  const eventDate =
    status === "suspended"
      ? account.suspendedAt || account.suspensionDate || account.updatedAt
      : account.deletedAt;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back */}
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>

        {/* Profile header */}
        <Card className="border shadow-sm" style={{ backgroundColor: "#e8f7e8" }}>
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#1a3f1c] flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-2xl md:text-3xl font-bold">{initials}</span>
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{name}</h1>
                  <p className="text-sm md:text-base text-gray-600 mt-1">
                    <User className="h-4 w-4 inline mr-1" />
                    {role}
                  </p>
                </div>
              </div>
              <div className={`${statusColor} px-4 py-2 rounded-lg`}>
                <span className="text-white font-semibold text-sm">
                  {status === "suspended" ? "SUSPENDED" : "DELETED"}
                </span>
              </div>
            </div>

            {/* Contact info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-gray-700">
                <Phone className="h-5 w-5 text-[#1a3f1c] flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Phone Number</p>
                  <p className="font-medium">{phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <Mail className="h-5 w-5 text-[#1a3f1c] flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium break-all">{email}</p>
                </div>
              </div>

              {address && (
                <div className="flex items-center gap-3 text-gray-700 md:col-span-2">
                  <MapPin className="h-5 w-5 text-[#1a3f1c] flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="font-medium">{address}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Reason + Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                Reason for {status === "suspended" ? "Suspension" : "Deletion"}
              </h3>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-gray-700">{reason || "No reason provided"}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                Time of {status === "suspended" ? "Suspension" : "Deletion"}
              </h3>
              <div className="bg-gray-100 p-4 rounded-lg flex items-center gap-3">
                <Calendar className="h-8 w-8 text-[#1a3f1c] flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-600">Date & Time</p>
                  <p className="font-semibold text-gray-900">
                    {eventDate
                      ? new Date(eventDate).toLocaleString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <Button
            onClick={() => setConfirmModalOpen(true)}
            className="w-full px-8 py-6 text-lg"
            style={{
              backgroundColor: status === "suspended" ? "#98ef9b" : "#1a3f1c",
              color: status === "suspended" ? "#1a3f1c" : "#fff",
            }}
          >
            {actionText}
          </Button>
          <Button
            onClick={() => setDeleteModalOpen(true)}
            className="w-full px-8 py-6 text-lg bg-red-500 hover:bg-red-600 text-white"
          >
            <Trash2 className="h-5 w-5 mr-2" />
            Delete Account
          </Button>
        </div>
      </div>

      {/* Confirm Activate / Restore */}
      <Dialog open={confirmModalOpen} onOpenChange={setConfirmModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Confirm {status === "suspended" ? "Activation" : "Restoration"}
            </DialogTitle>
            <DialogDescription className="text-base pt-4">
              Are you sure you want to {status === "suspended" ? "activate" : "restore"} this
              account?
              <br />
              <span className="font-semibold text-gray-900 mt-2 block">{name}</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row gap-3 sm:gap-3">
            <Button
              variant="outline"
              onClick={() => setConfirmModalOpen(false)}
              disabled={processing}
              className="flex-1"
              style={{ backgroundColor: "#ffca3a", borderColor: "#ffca3a" }}
            >
              No
            </Button>
            <Button
              onClick={handleRestore}
              disabled={processing}
              className="flex-1"
              style={{ backgroundColor: "#1a3f1c" }}
            >
              {processing ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Yes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <DialogTitle className="text-xl">Delete Account</DialogTitle>
            </div>
            <DialogDescription className="text-base pt-4">
              Are you sure you want to delete this account?
              <br />
              <span className="font-semibold text-gray-900 mt-2 block">{name}</span>
              <br />
              <span className="text-red-600 text-sm">
                This action cannot be undone. The account will be permanently deleted.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row gap-3 sm:gap-3">
            <Button
              variant="outline"
              onClick={() => setDeleteModalOpen(false)}
              disabled={deleting}
              className="flex-1"
            >
              No, Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white"
            >
              {deleting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Yes, Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success */}
      <Dialog open={successModalOpen} onOpenChange={setSuccessModalOpen}>
        <DialogContent className="sm:max-w-md text-center">
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-2xl">
                The account has been {status === "suspended" ? "activated" : "restored"}!!!
              </DialogTitle>
            </DialogHeader>
            <Button
              onClick={() => {
                setSuccessModalOpen(false);
                router.push("/it/account-management");
              }}
              className="w-full mt-4"
              style={{ backgroundColor: "#1a3f1c" }}
            >
              Go Back to Main Screen
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
