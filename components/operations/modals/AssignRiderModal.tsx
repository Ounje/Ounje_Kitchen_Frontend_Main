"use client";

import { useState, useEffect, useCallback } from "react";
import { operationsService } from "@/lib/api/services/operations.service";
import { Star, Phone, MapPin, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Rider {
  _id:    string;
  user?:  { name?: string; phone?: string | number; avatar?: string };
  firstName?: string;
  lastName?:  string;
  phone?:     string | number;
  photo?:     string;
  avatar?:    string;
  ratings?:   { average?: number; count?: number };
  averageRating?: number;
  ratingCount?:   number;
  totalDeliveries?: number;
  operatingArea?: string[];
  zone?:          string;
  // RiderProfile status: "available" | "busy" | "offline" | "pending" | "deactivated"
  status?:        string;
  isActive?:      boolean;
  isSuspended?:   boolean;
  modeOfDelivery?: string;
}

interface Props {
  open:       boolean;
  orderId:    string;
  orderZone?: string;       // pre-fill zone filter from the order
  onClose:    () => void;
  onAssigned?: () => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function riderName(r: Rider): string {
  return (r.user?.name ?? `${r.firstName ?? ""} ${r.lastName ?? ""}`.trim()) || "Rider";
}

function riderPhone(r: Rider): string {
  const p = r.user?.phone ?? r.phone ?? "";
  return p ? String(p) : "—";
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

// Derive a clear availability label from status + isActive + isSuspended
function riderAvailability(r: Rider): {
  label: string;
  color: string;         // tailwind bg class
  textColor: string;
  canAssign: boolean;    // only truly available riders can be assigned
} {
  if (r.isSuspended === true) {
    return { label: "Suspended",    color: "bg-red-100",    textColor: "text-red-700",    canAssign: false };
  }
  if (r.isActive === false) {
    return { label: "Inactive",     color: "bg-gray-100",   textColor: "text-gray-500",   canAssign: false };
  }
  const s = (r.status ?? "").toLowerCase();
  if (s === "available") {
    return { label: "Available",    color: "bg-green-100",  textColor: "text-green-700",  canAssign: true  };
  }
  if (s === "busy") {
    return { label: "Delivering",   color: "bg-blue-100",   textColor: "text-blue-700",   canAssign: false };
  }
  if (s === "offline") {
    return { label: "Offline",      color: "bg-gray-100",   textColor: "text-gray-500",   canAssign: false };
  }
  if (s === "deactivated") {
    return { label: "Deactivated",  color: "bg-red-100",    textColor: "text-red-700",    canAssign: false };
  }
  // "pending" or unknown — treat as available for assignment (new riders)
  return   { label: "Available",    color: "bg-green-100",  textColor: "text-green-700",  canAssign: true  };
}

function unwrapRiders(res: any): Rider[] {
  if (!res) return [];
  if (Array.isArray(res.data))         return res.data;
  if (Array.isArray(res.data?.riders)) return res.data.riders;
  if (Array.isArray(res.riders))       return res.riders;
  if (Array.isArray(res))              return res;
  return [];
}

// ── Rider Card ────────────────────────────────────────────────────────────────
function RiderCard({ rider, onAssign, assigning }: {
  rider: Rider;
  onAssign: (id: string) => void;
  assigning: boolean;
}) {
  const name         = riderName(rider);
  const phone        = riderPhone(rider);
  const photo        = riderPhoto(rider);
  const rating       = riderRating(rider);
  const reviews      = riderRatingCount(rider);
  const zone         = riderZone(rider);
  const availability = riderAvailability(rider);

  return (
    <div className={`flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm border ${
      availability.canAssign ? "border-green-100" : "border-gray-100 opacity-70"
    }`}>
      {/* Avatar */}
      <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-green-200 bg-gray-100">
        {photo ? (
          <img src={photo} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#1a3f1c] text-white font-bold text-lg">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-bold text-gray-900 text-base truncate">{name}</p>
          {/* Availability badge */}
          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${availability.color} ${availability.textColor}`}>
            {availability.label}
          </span>
        </div>

        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400 flex-shrink-0" />
          <span>
            {rating > 0 ? rating.toFixed(1) : "No rating"}
            {reviews > 0 && <span className="text-gray-400 ml-1">({reviews})</span>}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          <Phone className="h-3.5 w-3.5 flex-shrink-0" />
          <span>{phone}</span>
        </div>

        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          <MapPin className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />
          <span className="truncate">{zone}</span>
        </div>
      </div>

      {/* Assign button — disabled + tooltip if not available */}
      <div className="flex-shrink-0 flex flex-col items-center gap-1">
        <button
          onClick={() => availability.canAssign && onAssign(rider._id)}
          disabled={assigning || !availability.canAssign}
          title={!availability.canAssign ? `Cannot assign — rider is ${availability.label}` : "Assign this rider"}
          className={`px-4 py-2.5 rounded-xl text-sm font-bold text-white
                     transition-opacity flex items-center gap-2
                     ${availability.canAssign
                       ? "hover:opacity-90 disabled:opacity-50"
                       : "cursor-not-allowed opacity-40"
                     }`}
          style={{ backgroundColor: availability.canAssign ? "#1a3f1c" : "#6b7280" }}
        >
          {assigning ? <Loader2 className="h-4 w-4 animate-spin" /> : "Assign"}
        </button>
        {!availability.canAssign && (
          <span className="text-[9px] text-gray-400 text-center leading-tight max-w-[60px]">
            {availability.label}
          </span>
        )}
      </div>
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────
export default function AssignRiderModal({ open, orderId, orderZone, onClose, onAssigned }: Props) {
  const [allRiders,        setAllRiders]        = useState<Rider[]>([]);
  const [filtered,         setFiltered]         = useState<Rider[]>([]);
  const [loading,          setLoading]          = useState(false);
  const [assigning,        setAssigning]        = useState<string | null>(null);
  const [zoneFilter,       setZoneFilter]       = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");

  // Unique zones from all fetched riders
  const zones: string[] = Array.from(
    new Set(
      allRiders.flatMap(r =>
        Array.isArray(r.operatingArea) ? r.operatingArea
        : r.zone ? [r.zone] : []
      )
    )
  ).sort();

  // ── Fetch all riders (all pages, up to 200) ─────────────────────────────────
  const fetchRiders = useCallback(async () => {
    setLoading(true);
    try {
      const res1: any  = await operationsService.getRiders({ page: 1, limit: 50 } as any);
      const page1      = unwrapRiders(res1);
      const totalPages = Math.min(res1?.pages ?? res1?.totalPages ?? 1, 4);

      let extra: Rider[] = [];
      if (totalPages > 1) {
        const promises = Array.from({ length: totalPages - 1 }, (_, i) =>
          operationsService.getRiders({ page: i + 2, limit: 50 } as any)
            .then((r: any) => unwrapRiders(r))
            .catch(() => [] as Rider[])
        );
        const pages = await Promise.all(promises);
        extra = pages.flat();
      }

      const all = [...page1, ...extra];
      setAllRiders(all);

      // Auto-apply zone from order if provided
      applyFilters(all, zoneFilter, availabilityFilter);
    } catch (err) {
      console.error("AssignRiderModal fetch error:", err);
      setAllRiders([]);
      setFiltered([]);
      toast.error("Failed to load riders");
    } finally {
      setLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (open) {
      // Pre-fill zone from the order's zone
      const z = orderZone && orderZone !== "Other" ? orderZone : "all";
      setZoneFilter(z);
      setAvailabilityFilter("all");
      fetchRiders();
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // When allRiders loads, re-apply the pre-filled zone filter
  useEffect(() => {
    if (allRiders.length > 0) {
      applyFilters(allRiders, zoneFilter, availabilityFilter);
    }
  }, [allRiders]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Client-side filter ──────────────────────────────────────────────────────
  function applyFilters(riders: Rider[], zone: string, avail: string) {
    let result = [...riders];

    if (zone !== "all") {
      result = result.filter(r => {
        const rz = Array.isArray(r.operatingArea)
          ? r.operatingArea.map(z => z.toLowerCase())
          : r.zone ? [r.zone.toLowerCase()] : [];
        return rz.some(z => z.toLowerCase().includes(zone.toLowerCase()));
      });
    }

    if (avail === "available") {
      result = result.filter(r => riderAvailability(r).canAssign);
    } else if (avail === "unavailable") {
      result = result.filter(r => !riderAvailability(r).canAssign);
    }

    // Sort: available first
    result.sort((a, b) => {
      const aAvail = riderAvailability(a).canAssign ? 0 : 1;
      const bAvail = riderAvailability(b).canAssign ? 0 : 1;
      return aAvail - bAvail;
    });

    setFiltered(result);
  }

  const handleSearch = () => applyFilters(allRiders, zoneFilter, availabilityFilter);

  // ── Assign ──────────────────────────────────────────────────────────────────
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

  const availableCount   = filtered.filter(r => riderAvailability(r).canAssign).length;
  const unavailableCount = filtered.length - availableCount;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        style={{ backgroundColor: "#e8f7e8", maxHeight: "90vh" }}
      >
        {/* Header */}
        <div className="px-6 pt-5 pb-3 flex items-center justify-between flex-shrink-0">
          <div className="flex-1" />
          <h2 className="text-xl font-bold text-gray-900 text-center flex-1">Assign a Rider</h2>
          <div className="flex-1 flex justify-end">
            <button onClick={onClose} className="w-8 h-8 rounded-full border-2 border-gray-400 flex items-center justify-center hover:bg-gray-100 transition-colors">
              <X className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="px-6 pb-4 flex items-end gap-3 flex-shrink-0 flex-wrap">
          {/* Zone */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700">Zone</label>
            <select
              value={zoneFilter}
              onChange={e => setZoneFilter(e.target.value)}
              className="h-9 rounded-lg border border-gray-300 bg-white text-sm px-3 focus:outline-none focus:ring-2 focus:ring-[#1a3f1c] min-w-[130px]"
            >
              <option value="all">All Zones</option>
              {zones.map(z => <option key={z} value={z}>{z}</option>)}
            </select>
          </div>

          {/* Availability */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700">Availability</label>
            <select
              value={availabilityFilter}
              onChange={e => setAvailabilityFilter(e.target.value)}
              className="h-9 rounded-lg border border-gray-300 bg-white text-sm px-3 focus:outline-none focus:ring-2 focus:ring-[#1a3f1c] min-w-[150px]"
            >
              <option value="all">All Riders</option>
              <option value="available">Available only</option>
              <option value="unavailable">Unavailable only</option>
            </select>
          </div>

          <button
            onClick={handleSearch}
            className="h-9 px-5 rounded-lg text-sm font-bold text-white flex items-center gap-2 hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "#1a3f1c" }}
          >
            Search
          </button>

          <button
            onClick={fetchRiders}
            className="h-9 px-4 rounded-lg text-sm text-[#1a3f1c] border border-[#1a3f1c] hover:bg-[#98ef9b] transition-colors"
          >
            Reload
          </button>
        </div>

        <div className="border-t border-gray-300 mx-6 flex-shrink-0" />

        {/* Summary */}
        <div className="px-6 py-3 flex items-center gap-4 flex-shrink-0">
          <p className="text-base font-bold text-gray-900">
            {loading ? "Loading riders…" : `Riders found (${filtered.length})`}
          </p>
          {!loading && filtered.length > 0 && (
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                <span className="text-green-700 font-semibold">{availableCount} Available</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-gray-400 inline-block" />
                <span className="text-gray-500">{unavailableCount} Unavailable</span>
              </span>
            </div>
          )}
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-3 min-h-0">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-[#1a3f1c]" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
              <p className="text-sm font-medium">No riders found</p>
              <p className="text-xs text-center">Try changing the zone or availability filter.</p>
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