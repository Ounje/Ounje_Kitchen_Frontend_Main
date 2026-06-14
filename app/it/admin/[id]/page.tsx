"use client";

import { use, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { itService } from "@/lib/api/services/it.service";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, MapPin } from "lucide-react";
import { toast } from "sonner";

// ── Helpers ────────────────────────────────────────────────────────────────
function unwrap(res: any, entityType?: string): any {
  if (!res) return null;
  const d = res?.data ?? res;
  if (entityType === "customer" && d?.customer) return d.customer;
  if (entityType === "vendor" && d?.vendor) return d.vendor;
  if (entityType === "rider" && d?.rider) return d.rider;
  if (entityType === "staff" && (d?.staff || d?.admin)) return d.staff ?? d.admin;
  if (d && typeof d === "object" && !Array.isArray(d)) return d;
  return res;
}

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"],
    v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return `${ordinal(d.getDate())} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

const NA = "Info Not Yet Available";

// ── Sub-components ─────────────────────────────────────────────────────────

function StarRating({ value = 0 }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className="h-5 w-5"
          fill={i <= Math.round(value) ? "#FFCA3A" : "none"}
          stroke={i <= Math.round(value) ? "#FFCA3A" : "#d1d5db"}
        />
      ))}
    </div>
  );
}

function Avatar({ src, name, size = 110 }: { src?: string; name: string; size?: number }) {
  const initials = (name || "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className="object-cover flex-shrink-0 rounded-xl border border-gray-100 shadow-sm"
        style={{ width: size, height: size }}
        onError={(e) => {
          (e.target as HTMLImageElement).src = "";
        }}
      />
    );
  }
  return (
    <div
      className="rounded-xl flex items-center justify-center flex-shrink-0 border border-gray-200 shadow-sm"
      style={{ width: size, height: size, backgroundColor: "#1a3f1c" }}
    >
      <span className="text-white font-bold" style={{ fontSize: size * 0.28 }}>
        {initials}
      </span>
    </div>
  );
}

function StatBox({ value, label, color }: { value?: number; label: string; color: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-xl min-w-[72px] min-h-[88px] px-3 py-3 gap-1"
      style={{ backgroundColor: color }}
    >
      <span className="text-white font-extrabold leading-none" style={{ fontSize: "2rem" }}>
        {value ?? 0}
      </span>
      <span className="text-white/80 text-center leading-tight" style={{ fontSize: "10px" }}>
        {label}
      </span>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-3.5 h-3.5 rounded-sm flex-shrink-0" style={{ backgroundColor: color }} />
      <span className="text-xs text-gray-600">{label}</span>
    </div>
  );
}

// ── Skeleton ───────────────────────────────────────────────────────────────
function DetailSkeleton() {
  return (
    <div className="w-full p-4 md:p-8 max-w-2xl mx-auto animate-pulse space-y-4">
      <div className="h-6 bg-gray-200 rounded w-24" />
      <div className="bg-[#e8f7e8] rounded-2xl p-6 space-y-5">
        <div className="h-6 bg-gray-300 rounded w-48 mx-auto" />
        <div className="flex gap-5">
          <div className="w-28 h-28 rounded-xl bg-gray-300 flex-shrink-0" />
          <div className="flex-1 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-4 bg-gray-200 rounded"
                style={{ width: `${70 - i * 8}%` }}
              />
            ))}
          </div>
        </div>
        <div className="h-4 bg-gray-300 rounded w-24" />
        <div className="flex gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-20 h-24 rounded-xl bg-gray-300" />
          ))}
          <div className="flex-1 h-24 rounded-xl bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

// ── Customer Detail ────────────────────────────────────────────────────────
function CustomerDetail({ data }: { data: any }) {
  const name = data.user?.name || data.name || NA;
  const phone = data.user?.phone ? String(data.user.phone) : data.phone ? String(data.phone) : NA;
  const email = data.user?.email || data.email || NA;
  const address = data.savedAddresses?.[0]?.address || data.address || NA;
  const isActive = data.isActive !== false && data.isSuspended !== true;

  const successOrders = data.successfulOrders ?? 0;
  const cancelledOrders = data.cancelledOrders ?? 0;
  const pendingOrders = data.pendingOrders ?? 0;
  const totalOrders = data.totalOrders ?? successOrders + cancelledOrders + pendingOrders;

  // mostUsedVendor: { id, name, photo, address, ordersCount }
  const mv = data.mostUsedVendor;

  return (
    <div className="rounded-2xl overflow-hidden shadow-md" style={{ backgroundColor: "#e8f7e8" }}>
      {/* Title + badge */}
      <div className="px-6 pt-6 pb-4 flex items-start justify-between">
        <h2 className="text-xl font-bold text-gray-900">Customer&apos;s Details</h2>
        <span
          className={`px-5 py-1.5 rounded-lg text-sm font-bold text-white ${isActive ? "bg-[#1a3f1c]" : "bg-red-500"}`}
        >
          {isActive ? "Active" : "Suspended"}
        </span>
      </div>

      {/* Profile */}
      <div className="px-6 pb-5 flex items-start gap-5">
        <Avatar src={data.user?.avatar || data.avatar} name={name} size={110} />
        <div className="flex-1 space-y-2 text-[15px]">
          <p>
            <span className="font-bold">Name:</span> <span className="text-gray-700">{name}</span>
          </p>
          <p>
            <span className="font-bold">Phone number:</span>{" "}
            <span className="text-gray-700">{phone}</span>
          </p>
          <p>
            <span className="font-bold">Email:</span> <span className="text-gray-700">{email}</span>
          </p>
          <p>
            <span className="font-bold">Address:</span>{" "}
            {address !== NA ? (
              <span className="text-gray-700">{address}</span>
            ) : (
              <span className="text-gray-400 italic text-sm">{NA}</span>
            )}
          </p>
        </div>
      </div>

      {/* Activities */}
      <div className="px-6 pb-6">
        <h3 className="text-base font-bold text-gray-800 mb-3">Activites</h3>

        <div className="flex gap-3 items-stretch">
          {/* Stat boxes */}
          <div className="flex gap-2">
            <StatBox value={successOrders} label="successful orders" color="#1a3f1c" />
            <StatBox value={pendingOrders} label="pending orders" color="#FFCA3A" />
            <StatBox value={cancelledOrders} label="cancelled orders" color="#D00000" />
            <StatBox value={totalOrders} label="Total" color="#37A449" />
          </div>

          {/* Most Used Vendor */}
          <div className="flex-1 min-w-0 rounded-xl overflow-hidden bg-white shadow-sm border border-gray-100 flex flex-col">
            <p className="text-xs font-bold text-gray-700 px-3 pt-2.5 pb-2 border-b border-gray-100">
              Most Used Vendor
            </p>
            {mv ? (
              <div className="p-3 flex gap-2.5 flex-1 items-center">
                <Avatar
                  src={mv.photo || mv.image || mv.avatar || ""}
                  name={mv.name || "Vendor"}
                  size={50}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{mv.name}</p>
                  {mv.address && (
                    <p className="text-xs text-gray-500 flex items-start gap-1 mt-0.5">
                      <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0 text-gray-400" />
                      <span className="line-clamp-2">{mv.address}</span>
                    </p>
                  )}
                </div>
                <div
                  className="flex flex-col items-center justify-center rounded-lg px-2.5 py-2 flex-shrink-0"
                  style={{ backgroundColor: "#1a3f1c" }}
                >
                  <span className="text-white text-xl font-extrabold leading-none">
                    {mv.ordersCount ?? 0}
                  </span>
                  <span
                    className="text-white/80 text-center leading-tight mt-0.5"
                    style={{ fontSize: "9px" }}
                  >
                    Orders here
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center flex-1 p-3 min-h-[64px]">
                <p className="text-xs text-gray-400 italic text-center">{NA}</p>
              </div>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-3">
          <LegendDot color="#1a3f1c" label="successful orders" />
          <LegendDot color="#D00000" label="cancelled orders" />
          <LegendDot color="#FFCA3A" label="pending orders" />
        </div>
      </div>
    </div>
  );
}

// ── Vendor Detail ──────────────────────────────────────────────────────────
function VendorDetail({ data }: { data: any }) {
  const name = data.name || NA;
  const phone = data.owner?.phone ? String(data.owner.phone) : data.phone ? String(data.phone) : NA;
  const address = data.location?.address || data.address || NA;
  const rating = data.averageRating ?? data.rating ?? 0;
  const isActive = data.isActive !== false && data.isSuspended !== true;

  // Backend enrichVendor field names
  const deliveredOrders = data.deliveredOrders ?? 0;
  const rejectedOrders = data.rejectedOrders ?? 0;
  const receivedOrders = data.receivedOrders ?? 0;
  const totalOrders = data.totalOrders ?? receivedOrders;

  // mostFrequentBuyer: { id, name, address, avatar, totalOrders }
  const mfb = data.mostFrequentBuyer;

  return (
    <div className="rounded-2xl overflow-hidden shadow-md" style={{ backgroundColor: "#e8f7e8" }}>
      <div className="px-6 pt-6 pb-4 flex items-start justify-between">
        <h2 className="text-xl font-bold text-gray-900">Vendor&apos;s Details</h2>
        <span
          className={`px-5 py-1.5 rounded-lg text-sm font-bold text-white ${isActive ? "bg-[#1a3f1c]" : "bg-red-500"}`}
        >
          {isActive ? "Active" : "Suspended"}
        </span>
      </div>

      <div className="px-6 pb-5 flex items-start gap-5">
        <Avatar
          src={data.photo || data.image || data.avatar || data.owner?.avatar || ""}
          name={name}
          size={110}
        />
        <div className="flex-1 space-y-2 text-[15px]">
          <p>
            <span className="font-bold">Name:</span> <span className="text-gray-700">{name}</span>
          </p>
          <p>
            <span className="font-bold">Phone number:</span>{" "}
            <span className="text-gray-700">{phone}</span>
          </p>
          <div className="flex items-center gap-2">
            <span className="font-bold">Rating:</span>
            <StarRating value={rating} />
          </div>
          <p>
            <span className="font-bold">Address:</span>{" "}
            {address !== NA ? (
              <span className="text-gray-700">{address}</span>
            ) : (
              <span className="text-gray-400 italic text-sm">{NA}</span>
            )}
          </p>
        </div>
      </div>

      <div className="px-6 pb-6">
        <h3 className="text-base font-bold text-gray-800 mb-3">Activites</h3>

        <div className="flex gap-3 items-stretch">
          <div className="flex gap-2">
            <StatBox value={deliveredOrders} label="successful orders" color="#1a3f1c" />
            <StatBox value={rejectedOrders} label="cancelled orders" color="#D00000" />
            <StatBox value={receivedOrders} label="pending orders" color="#FFCA3A" />
            <StatBox value={totalOrders} label="Total" color="#37A449" />
          </div>

          {/* Most Frequent Buyer */}
          <div className="flex-1 min-w-0 rounded-xl overflow-hidden bg-white shadow-sm border border-gray-100 flex flex-col">
            <p className="text-xs font-bold text-gray-700 px-3 pt-2.5 pb-2 border-b border-gray-100">
              Most Frequent Buyer
            </p>
            {mfb ? (
              <div className="p-3 flex gap-2.5 flex-1 items-center">
                <Avatar src={mfb.avatar || mfb.image || ""} name={mfb.name || "Buyer"} size={50} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{mfb.name}</p>
                  {mfb.address && (
                    <p className="text-xs text-gray-500 flex items-start gap-1 mt-0.5">
                      <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0 text-gray-400" />
                      <span className="line-clamp-2">{mfb.address}</span>
                    </p>
                  )}
                </div>
                <div
                  className="flex flex-col items-center justify-center rounded-lg px-2.5 py-2 flex-shrink-0"
                  style={{ backgroundColor: "#1a3f1c" }}
                >
                  <span className="text-white text-xl font-extrabold leading-none">
                    {mfb.totalOrders ?? 0}
                  </span>
                  <span
                    className="text-white/80 text-center leading-tight mt-0.5"
                    style={{ fontSize: "9px" }}
                  >
                    Orders here
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center flex-1 p-3 min-h-[64px]">
                <p className="text-xs text-gray-400 italic text-center">{NA}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-3">
          <LegendDot color="#1a3f1c" label="successful orders" />
          <LegendDot color="#D00000" label="cancelled orders" />
          <LegendDot color="#FFCA3A" label="pending orders" />
        </div>
      </div>
    </div>
  );
}

// ── Rider Detail ───────────────────────────────────────────────────────────
function RiderDetail({ data }: { data: any }) {
  const name =
    data.user?.name ?? (`${data.firstName ?? ""} ${data.lastName ?? ""}`.trim() || null) ?? NA;
  const phone =
    data.phoneNumber ??
    (data.user?.phone ? String(data.user.phone) : null) ??
    (data.phone ? String(data.phone) : NA);
  const zone = Array.isArray(data.operatingArea)
    ? data.operatingArea.join(", ")
    : data.operatingArea || data.zone || NA;
  const rating = data.averageRating ?? data.rating ?? data.ratings?.average ?? 0;
  const isActive = data.isActive !== false && data.isSuspended !== true;

  // Backend enrichRider field names
  const deliveredOrders = data.deliveredOrders ?? 0;
  const outgoingOrders = data.outgoingOrders ?? 0;
  const rejectedOrders = data.rejectedOrders ?? 0;
  const totalDeliveries = data.totalDeliveries ?? deliveredOrders + outgoingOrders + rejectedOrders;

  // topRoutes: [{zone, deliveries}], mostFrequentZone: string
  const topRoutes: { zone: string; deliveries: number }[] = data.topRoutes ?? [];
  const mostFreqZone =
    typeof data.mostFrequentZone === "string"
      ? data.mostFrequentZone
      : (topRoutes[0]?.zone ?? zone);

  // Geocode most frequent zone for OSM map
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!mostFreqZone || mostFreqZone === NA) return;
    const query = encodeURIComponent(`${mostFreqZone}, Lagos, Nigeria`);
    fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`)
      .then((r) => r.json())
      .then((d: any[]) => {
        if (d[0]) setCoords({ lat: parseFloat(d[0].lat), lng: parseFloat(d[0].lon) });
      })
      .catch(() => {
        // Default to Lagos if geocoding fails
        setCoords({ lat: 6.5244, lng: 3.3792 });
      });
  }, [mostFreqZone]);

  const mapSrc = coords
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${coords.lng - 0.02}%2C${coords.lat - 0.02}%2C${coords.lng + 0.02}%2C${coords.lat + 0.02}&layer=mapnik&marker=${coords.lat}%2C${coords.lng}`
    : "";

  return (
    <div className="rounded-2xl overflow-hidden shadow-md" style={{ backgroundColor: "#e8f7e8" }}>
      <div className="px-6 pt-6 pb-4 flex items-start justify-between">
        <h2 className="text-xl font-bold text-gray-900">Rider&apos;s Details</h2>
        <span
          className={`px-5 py-1.5 rounded-lg text-sm font-bold text-white ${isActive ? "bg-[#1a3f1c]" : "bg-red-500"}`}
        >
          {isActive ? "Active" : "Suspended"}
        </span>
      </div>

      <div className="px-6 pb-5 flex items-start gap-5">
        <Avatar
          src={data.avatar || data.image || data.user?.avatar || ""}
          name={name === NA ? "Rider" : name}
          size={110}
        />
        <div className="flex-1 space-y-2 text-[15px]">
          <p>
            <span className="font-bold">Name:</span> <span className="text-gray-700">{name}</span>
          </p>
          <p>
            <span className="font-bold">Phone number:</span>{" "}
            <span className="text-gray-700">{phone}</span>
          </p>
          <div className="flex items-center gap-2">
            <span className="font-bold">Rating:</span>
            <StarRating value={rating} />
          </div>
          <p>
            <span className="font-bold">Zone:</span>{" "}
            {zone !== NA ? (
              <span className="text-gray-700">{zone}</span>
            ) : (
              <span className="text-gray-400 italic text-sm">{NA}</span>
            )}
          </p>
        </div>
      </div>

      <div className="px-6 pb-6">
        <h3 className="text-base font-bold text-gray-800 mb-3">Activites</h3>

        <div className="flex gap-3 items-stretch">
          <div className="flex gap-2">
            <StatBox value={deliveredOrders} label="successful Deliveries" color="#1a3f1c" />
            <StatBox value={outgoingOrders} label="Processing Deliveries" color="#FFCA3A" />
            <StatBox value={rejectedOrders} label="cancelled Deliveries" color="#D00000" />
            <StatBox value={totalDeliveries} label="Total" color="#37A449" />
          </div>

          {/* Most Frequent Zone — real OSM map embed */}
          <div className="flex-1 min-w-0 rounded-xl overflow-hidden bg-white shadow-sm border border-gray-100 flex flex-col">
            <p className="text-xs font-bold text-gray-700 px-3 pt-2.5 pb-2 border-b border-gray-100">
              Most Frequent Zone:{" "}
              <span className="text-[#1a3f1c]">{mostFreqZone !== NA ? mostFreqZone : "—"}</span>
            </p>
            <div className="flex-1 relative min-h-[88px]">
              {mapSrc ? (
                <iframe
                  title="Zone Map"
                  src={mapSrc}
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: 88, display: "block" }}
                  loading="lazy"
                />
              ) : mostFreqZone !== NA ? (
                /* Loading state — map-like placeholder */
                <div
                  className="absolute inset-0 animate-pulse"
                  style={{ backgroundColor: "#d1fae5" }}
                >
                  <div className="flex items-center justify-center h-full">
                    <div className="flex flex-col items-center gap-1 text-[#1a3f1c]/60">
                      <MapPin className="h-5 w-5 animate-bounce" />
                      <span className="text-[10px]">Loading map…</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full p-3">
                  <p className="text-xs text-gray-400 italic text-center">{NA}</p>
                </div>
              )}
            </div>
            {/* Top routes below map */}
            {topRoutes.length > 1 && (
              <div className="border-t border-gray-100 px-2.5 py-2 flex flex-col gap-1">
                {topRoutes.slice(0, 3).map((r, i) => (
                  <div key={i} className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1 min-w-0">
                      <span className="text-[10px] font-bold text-[#1a3f1c]">#{i + 1}</span>
                      <span className="text-[11px] text-gray-700 truncate">{r.zone}</span>
                    </div>
                    <span className="text-[10px] text-gray-500 flex-shrink-0">{r.deliveries}×</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-3">
          <LegendDot color="#1a3f1c" label="successful Deliveries" />
          <LegendDot color="#37A449" label="cancelled Deliveries" />
          <LegendDot color="#FFCA3A" label="Processing Deliveries" />
        </div>
      </div>
    </div>
  );
}

// ── Staff Detail ───────────────────────────────────────────────────────────
function StaffDetail({ data, lineManagerName }: { data: any; lineManagerName: string }) {
  const fullName = `${data.firstName ?? ""} ${data.lastName ?? ""}`.trim() || NA;
  const isActive = data.isActive !== false && data.isSuspended !== true;
  const isHead = data.isHead === true || data.isSuperAdmin === true;

  // "Role: IT Manager" — derive from department + role level
  const roleLabel = data.isSuperAdmin
    ? "Super Admin"
    : isHead
      ? `${data.department ? data.department.charAt(0).toUpperCase() + data.department.slice(1) : ""} Manager`
      : `${data.department ? data.department.charAt(0).toUpperCase() + data.department.slice(1) : ""} Staff`;

  const yearJoined = data.createdAt ? formatDate(data.createdAt) : NA;

  return (
    <div className="rounded-2xl overflow-hidden shadow-md" style={{ backgroundColor: "#e8f7e8" }}>
      <div className="px-6 pt-6 pb-4 flex items-start justify-between">
        <h2 className="text-xl font-bold text-gray-900">Staff Details</h2>
        <span
          className={`px-5 py-1.5 rounded-lg text-sm font-bold text-white ${isActive ? "bg-[#1a3f1c]" : "bg-red-500"}`}
        >
          {isActive ? "Active" : "Suspended"}
        </span>
      </div>

      {/* Profile */}
      <div className="px-6 pb-4 flex items-start gap-5">
        <Avatar src={data.avatar} name={fullName === NA ? "Staff" : fullName} size={110} />
        <div className="flex-1 space-y-2 text-[15px]">
          <p>
            <span className="font-bold">Name:</span>{" "}
            <span className="text-gray-700">{fullName}</span>
          </p>
          <p>
            <span className="font-bold">Phone number:</span>{" "}
            <span className="text-gray-700">{data.phoneNumber || data.phone || NA}</span>
          </p>
          <p>
            <span className="font-bold">Email:</span>{" "}
            <span className="text-gray-700">{data.email || NA}</span>
          </p>
          <p>
            <span className="font-bold">Address:</span>{" "}
            <span className="text-gray-700">{data.address || NA}</span>
          </p>
        </div>
      </div>

      {/* Role line */}
      <div className="px-6 pb-4">
        <p className="text-[15px]">
          <span className="font-bold">Role:</span>{" "}
          <span className="text-gray-700">{roleLabel}</span>
        </p>
      </div>

      {/* Employment info card */}
      <div className="px-6 pb-6">
        <div
          className="rounded-xl p-4 space-y-2.5 text-[15px]"
          style={{ backgroundColor: "#98ef9b" }}
        >
          {!isHead && (
            <p>
              <span className="font-bold text-[#1a3f1c]">Line Manager:</span>{" "}
              <span className="text-gray-800">{lineManagerName}</span>
            </p>
          )}
          <p>
            <span className="font-bold text-[#1a3f1c]">Department:</span>{" "}
            <span className="text-gray-800">
              {data.department
                ? data.department.charAt(0).toUpperCase() + data.department.slice(1)
                : NA}
            </span>
          </p>
          <p>
            <span className="font-bold text-[#1a3f1c]">Year Joined:</span>{" "}
            <span className="text-gray-800">{yearJoined}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function EntityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") as "staff" | "customer" | "vendor" | "rider";

  const [entity, setEntity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lineManagerName, setLineManagerName] = useState("Loading...");
  const [actioning, setActioning] = useState(false);

  useEffect(() => {
    if (!id || !type) return;
    (async () => {
      try {
        let res: any;
        switch (type) {
          case "staff":
            res = await itService.getStaffMember(id);
            break;
          case "customer":
            res = await itService.getCustomer(id);
            break;
          case "vendor":
            res = await itService.getVendor(id);
            break;
          case "rider":
            res = await itService.getRider(id);
            break;
        }
        const data = unwrap(res, type);
        setEntity(data);

        if (type === "staff") {
          const lm = data?.lineManager;
          if (!lm) {
            setLineManagerName("Not Assigned");
          } else if (typeof lm === "object") {
            setLineManagerName(
              lm.name || `${lm.firstName ?? ""} ${lm.lastName ?? ""}`.trim() || lm.email || "—"
            );
          } else {
            try {
              const lmRes = await itService.getStaffMember(String(lm));
              const lmData = unwrap(lmRes, "staff");
              setLineManagerName(
                `${lmData?.firstName ?? ""} ${lmData?.lastName ?? ""}`.trim() ||
                  lmData?.email ||
                  "—"
              );
            } catch {
              setLineManagerName("—");
            }
          }
        }
      } catch (err: any) {
        toast.error(err.message || "Failed to load details");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, type]);

  const handleToggleSuspend = async () => {
    if (!entity) return;
    const isCurrentlyActive = entity.isActive !== false && entity.isSuspended !== true;
    if (isCurrentlyActive) {
      const reason = prompt("Enter suspension reason:");
      if (!reason) return;
      setActioning(true);
      try {
        if (type === "customer") await itService.suspendCustomer(id, reason);
        else if (type === "vendor") await itService.suspendVendor(id, reason);
        else if (type === "rider") await itService.suspendRider(id, reason);
        else await itService.suspendStaff(id, reason);
        toast.success("Account suspended");
        router.push("/it/admin");
      } catch (err: any) {
        toast.error(err.message || "Failed to suspend");
      } finally {
        setActioning(false);
      }
    } else {
      setActioning(true);
      try {
        if (type === "customer") await itService.activateCustomer(id);
        else if (type === "vendor") await itService.activateVendor(id);
        else if (type === "rider") await itService.activateRider(id);
        else await itService.activateStaff(id);
        toast.success("Account activated");
        setEntity({ ...entity, isActive: true, isSuspended: false });
      } catch (err: any) {
        toast.error(err.message || "Failed to activate");
      } finally {
        setActioning(false);
      }
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this account?")) return;
    setActioning(true);
    try {
      if (type === "customer") await itService.deleteCustomer(id);
      else if (type === "vendor") await itService.deleteVendor(id);
      else if (type === "rider") await itService.deleteRider(id);
      else await itService.deleteStaff(id);
      toast.success("Account deleted");
      router.push("/it/admin");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete");
    } finally {
      setActioning(false);
    }
  };

  if (loading) return <DetailSkeleton />;

  if (!entity)
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 text-gray-500">
        <p className="text-lg font-medium">Record not found</p>
        <Button onClick={() => router.back()} variant="outline" className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Go Back
        </Button>
      </div>
    );

  const isActive = entity.isActive !== false && entity.isSuspended !== true;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-5 py-2">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-[#1a3f1c] font-semibold text-sm hover:opacity-70 transition-opacity"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to List
      </button>

      {/* Detail card */}
      {type === "customer" && <CustomerDetail data={entity} />}
      {type === "vendor" && <VendorDetail data={entity} />}
      {type === "rider" && <RiderDetail data={entity} />}
      {type === "staff" && <StaffDetail data={entity} lineManagerName={lineManagerName} />}

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleToggleSuspend}
          disabled={actioning}
          className="w-full py-3.5 rounded-xl text-base font-bold text-[#1a3f1c] transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 bg-amber-400"
        >
          {actioning ? (
            <div className="w-5 h-5 border-2 border-[#1a3f1c] border-t-transparent rounded-full animate-spin" />
          ) : isActive ? (
            "Suspend Account"
          ) : (
            "Activate Account"
          )}
        </button>
        <button
          onClick={handleDelete}
          disabled={actioning}
          className="w-full py-3.5 rounded-xl text-base font-bold text-white bg-[#D00000] transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {actioning ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            "Delete Account"
          )}
        </button>
      </div>
    </div>
  );
}
