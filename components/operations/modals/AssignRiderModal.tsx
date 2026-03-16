"use client";

import { useState, useEffect, useCallback } from "react";
import { operationsService } from "@/lib/api/services/operations.service";
import { Star, Phone, MapPin, X, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Rider {
  _id:    string;
  user?:  { name?: string; phone?: string; email?: string; avatar?: string };
  // populated name/phone may also be at top-level
  firstName?: string;
  lastName?:  string;
  phone?:     string;
  photo?:     string;
  avatar?:    string;
  ratings?:   { average?: number; count?: number };
  averageRating?: number;
  ratingCount?:   number;
  totalDeliveries?: number;
  operatingArea?: string[];
  zone?:          string;
  status?:        string;
  isActive?:      boolean;
  isSuspended?:   boolean;
  modeOfDelivery?: string;
}

interface Props {
  open:    boolean;
  orderId: string;
  onClose: () => void;
  onAssigned?: () => void;  // called after successful assignment so parent can refresh
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function riderName(r: Rider): string {
  return (r.user?.name ?? `${r.firstName ?? ""} ${r.lastName ?? ""}`.trim()) || "Rider";
}

function riderPhone(r: Rider): string {
  return r.user?.phone ?? r.phone ?? "—";
}

function riderPhoto(r: Rider): string {
  return r.user?.avatar ?? r.photo ?? r.avatar ?? "";
}

function riderRating(r: Rider): number {
  return r.ratings?.average ?? r.averageRating ?? 0;
}

function riderRatingCount(r: Rider): number {
  return r.ratings?.count ?? r.ratingCount ?? 0;
}

function riderZone(r: Rider): string {
  if (Array.isArray(r.operatingArea) && r.operatingArea.length > 0)
    return r.operatingArea.join(", ");
  return r.zone ?? "—";
}

function riderFirstZone(r: Rider): string {
  if (Array.isArray(r.operatingArea) && r.operatingArea.length > 0)
    return r.operatingArea[0];
  return r.zone ?? "";
}

// ── Rider Card ────────────────────────────────────────────────────────────────
function RiderCard({
  rider, onAssign, assigning,
}: {
  rider: Rider; onAssign: (id: string) => void; assigning: boolean;
}) {
  const name    = riderName(rider);
  const phone   = riderPhone(rider);
  const photo   = riderPhoto(rider);
  const rating  = riderRating(rider);
  const reviews = riderRatingCount(rider);
  const zone    = riderZone(rider);

  return (
    <div className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm border border-green-100">
      {/* Avatar */}
      <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-green-200 bg-gray-100">
        {photo ? (
          <img src={photo} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#1a3f1c] text-white font-bold text-lg">
            {name.charAt(0)}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 space-y-1">
        <p className="font-bold text-gray-900 text-base">{name}</p>

        {/* Rating */}
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 flex-shrink-0" />
          <span>
            Rating: {rating > 0 ? rating.toFixed(1) : "—"}
            {reviews > 0 && <span className="text-gray-400"> ({reviews})</span>}
          </span>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          <Phone className="h-3.5 w-3.5 flex-shrink-0" />
          <span>{phone}</span>
        </div>

        {/* Zone */}
        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          <MapPin className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />
          <span>{zone} zone</span>
        </div>
      </div>

      {/* Assign button */}
      <button
        onClick={() => onAssign(rider._id)}
        disabled={assigning}
        className="flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
        style={{ backgroundColor: "#1a3f1c" }}
      >
        {assigning ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Assign Rider"
        )}
      </button>
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────
export default function AssignRiderModal({ open, orderId, onClose, onAssigned }: Props) {
  const [allRiders,      setAllRiders]      = useState<Rider[]>([]);
  const [filtered,       setFiltered]       = useState<Rider[]>([]);
  const [loading,        setLoading]        = useState(false);
  const [assigning,      setAssigning]      = useState<string | null>(null);

  const [zoneFilter,     setZoneFilter]     = useState("all");
  const [statusFilter,   setStatusFilter]   = useState("active");

  // Derived: unique zones from all fetched riders
  const zones: string[] = Array.from(
    new Set(
      allRiders.flatMap(r =>
        Array.isArray(r.operatingArea) ? r.operatingArea : r.zone ? [r.zone] : []
      )
    )
  ).sort();

  // ── Fetch available riders on modal open ───────────────────────────────────
  // Uses getAvailableRiders (active + available riders for this order's zone area)
  // Falls back to getRiders if the endpoint returns empty
  const fetchRiders = useCallback(async () => {
    if (!orderId) return;
    setLoading(true);
    try {
      // Primary: available riders for this specific order
      const res: any = await operationsService.getAvailableRiders(orderId);
      const riders: Rider[] = res?.data ?? res?.riders ?? (Array.isArray(res) ? res : []);

      if (riders.length > 0) {
        setAllRiders(riders);
        setFiltered(riders);
      } else {
        // Fallback: fetch all active riders so the modal is never empty
        const fallback: any = await operationsService.getRiders({
          isActive:    "true",
          isSuspended: "false",
          limit:       50,
        } as any);
        const d = fallback?.data ?? fallback?.riders ?? [];
        setAllRiders(Array.isArray(d) ? d : []);
        setFiltered(Array.isArray(d) ? d : []);
      }
    } catch {
      // Silent — show empty state
      setAllRiders([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (open) {
      setZoneFilter("all");
      setStatusFilter("active");
      fetchRiders();
    }
  }, [open, fetchRiders]);

  // ── Client-side filter (Zone + Status) ────────────────────────────────────
  const handleSearch = () => {
    let result = [...allRiders];

    if (zoneFilter !== "all") {
      result = result.filter(r => {
        const rz = Array.isArray(r.operatingArea)
          ? r.operatingArea.map(z => z.toLowerCase())
          : r.zone ? [r.zone.toLowerCase()] : [];
        return rz.some(z => z.includes(zoneFilter.toLowerCase()));
      });
    }

    if (statusFilter === "active") {
      result = result.filter(r => r.isActive !== false && r.isSuspended !== true);
    } else if (statusFilter === "suspended") {
      result = result.filter(r => r.isSuspended === true);
    }

    setFiltered(result);
  };

  // ── Assign rider ───────────────────────────────────────────────────────────
  const handleAssign = async (riderId: string) => {
    setAssigning(riderId);
    try {
      await operationsService.assignRider(orderId, riderId);
      toast.success("Rider assigned successfully");
      onAssigned?.();
      onClose();
    } catch (err: any) {
      toast.error(err?.message || "Failed to assign rider");
    } finally {
      setAssigning(null);
    }
  };

  if (!open) return null;

  return (
    // ── Overlay ──────────────────────────────────────────────────────────────
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* ── Modal panel ─────────────────────────────────────────────────────── */}
      <div
        className="w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        style={{ backgroundColor: "#e8f7e8", maxHeight: "90vh" }}
      >
        {/* Header */}
        <div className="px-6 pt-5 pb-4 flex items-center justify-between flex-shrink-0">
          <div className="flex-1" />
          <h2 className="text-xl font-bold text-gray-900 text-center flex-1">
            Assign a rider
          </h2>
          <div className="flex-1 flex justify-end">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full border-2 border-gray-400 flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <X className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Filters row */}
        <div className="px-6 pb-4 flex items-end gap-3 flex-shrink-0">
          {/* Zone dropdown */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700">Zone:</label>
            <select
              value={zoneFilter}
              onChange={e => setZoneFilter(e.target.value)}
              className="h-9 rounded-lg border border-gray-300 bg-white text-sm px-3 pr-8 focus:outline-none focus:ring-2 focus:ring-[#1a3f1c] min-w-[120px]"
            >
              <option value="all">All Zones</option>
              {zones.map(z => (
                <option key={z} value={z}>{z}</option>
              ))}
            </select>
          </div>

          {/* Status dropdown */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700">Status</label>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="h-9 rounded-lg border border-gray-300 bg-white text-sm px-3 pr-8 focus:outline-none focus:ring-2 focus:ring-[#1a3f1c] min-w-[120px]"
            >
              <option value="active">Active</option>
              <option value="all">All</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          {/* Search button */}
          <button
            onClick={handleSearch}
            className="h-9 px-5 rounded-lg text-sm font-bold text-white flex items-center gap-2 hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "#1a3f1c" }}
          >
            Search
          </button>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-300 mx-6 flex-shrink-0" />

        {/* Riders found label */}
        <div className="px-6 py-3 flex-shrink-0">
          <h3 className="text-base font-bold text-gray-900">
            {loading ? "Loading riders…" : `Riders found`}
            {!loading && filtered.length > 0 && (
              <span className="ml-2 text-sm font-medium text-gray-500">
                ({filtered.length})
              </span>
            )}
          </h3>
        </div>

        {/* Scrollable rider list */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-3 min-h-0">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-[#1a3f1c]" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
              <Search className="h-10 w-10" />
              <p className="text-sm font-medium">No riders found</p>
              <p className="text-xs text-center">
                Try changing the zone or status filter,<br />or check that riders are marked as available.
              </p>
              <button
                onClick={fetchRiders}
                className="text-xs text-[#1a3f1c] underline hover:opacity-70"
              >
                Reload
              </button>
            </div>
          ) : (
            filtered.map(rider => (
              <RiderCard
                key={rider._id}
                rider={rider}
                onAssign={handleAssign}
                assigning={assigning === rider._id}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}