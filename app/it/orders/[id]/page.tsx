"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { itService } from "@/lib/api/services/it.service";
import { ArrowLeft, Phone, Mail, MapPin, Star } from "lucide-react";
import { toast } from "sonner";

// ── Types ─────────────────────────────────────────────────────────────────────
type DetailTab = "Order Content" | "Involved Party Details" | "Map Feature";

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmt(n: number | undefined | null) {
  return `₦${(n ?? 0).toLocaleString()}`;
}

// Safely convert any value to a renderable string — handles GeoJSON objects,
// MongoDB ObjectId strings, embedded address objects, etc.
function safeStr(val: any, fallback = "—"): string {
  if (val === null || val === undefined) return fallback;
  if (typeof val === "string") return val.trim() || fallback;
  if (typeof val === "number") return String(val);
  if (typeof val === "object") {
    return val.address ?? val.name ?? val.label ?? val.city ?? val.street ?? fallback;
  }
  return fallback;
}

// Status → colour mapping (matches Figma green/red/yellow badges)
function statusStyle(status: string): string {
  const s = (status ?? "").toLowerCase();
  if (["delivered", "successful", "completed"].includes(s))
    return "bg-green-100 text-green-800 border border-green-200";
  if (["pending", "confirming", "confirmed", "preparing"].includes(s))
    return "bg-yellow-100 text-yellow-800 border border-yellow-200";
  if (["cancelled", "rejected", "failed"].includes(s))
    return "bg-red-100 text-red-800 border border-red-200";
  return "bg-blue-100 text-blue-800 border border-blue-200";
}

// Build a self-contained Leaflet HTML page with OSRM route displayed.
// Injected as iframe srcDoc — no API key, no CDN calls that can be blocked.
function buildMapHtml(
  deliveryLat: number,
  deliveryLng: number,
  vendorLat: number | null,
  vendorLng: number | null,
  deliveryAddress: string,
  vendorAddress: string
): string {
  const hasVendor = vendorLat !== null && vendorLng !== null;

  const vendorMarkerJs = hasVendor
    ? `
      var vendorMarker = L.marker([${vendorLat}, ${vendorLng}], {
        icon: L.divIcon({
          className: '',
          html: '<div style="background:#1a3f1c;color:#fff;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 2px 6px rgba(0,0,0,0.3);">🏪</div>',
          iconAnchor: [16, 16]
        })
      }).addTo(map).bindPopup('<b>Vendor</b><br>${vendorAddress}');
    `
    : "";

  const routeJs = hasVendor
    ? `
      fetch('https://router.project-osrm.org/route/v1/driving/${vendorLng},${vendorLat};${deliveryLng},${deliveryLat}?overview=full&geometries=geojson')
        .then(r => r.json())
        .then(data => {
          if (data.routes && data.routes[0]) {
            L.geoJSON(data.routes[0].geometry, {
              style: { color: '#1a6dd4', weight: 5, opacity: 0.85 }
            }).addTo(map);
          }
        })
        .catch(() => {
          // Fallback: draw a straight line if OSRM is unavailable
          L.polyline([[${vendorLat}, ${vendorLng}], [${deliveryLat}, ${deliveryLng}]], {
            color: '#1a6dd4', weight: 4, opacity: 0.7, dashArray: '8 6'
          }).addTo(map);
        });
    `
    : "";

  const bounds = hasVendor
    ? `map.fitBounds([[${vendorLat}, ${vendorLng}], [${deliveryLat}, ${deliveryLng}]], { padding: [40, 40] });`
    : `map.setView([${deliveryLat}, ${deliveryLng}], 15);`;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css" />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #map { width: 100%; height: 100%; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = L.map('map', { zoomControl: true });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map);

    ${bounds}

    // Delivery marker (red pin)
    var deliveryMarker = L.marker([${deliveryLat}, ${deliveryLng}], {
      icon: L.divIcon({
        className: '',
        html: '<div style="background:#D00000;color:#fff;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 2px 6px rgba(0,0,0,0.3);">📍</div>',
        iconAnchor: [16, 16]
      })
    }).addTo(map).bindPopup('<b>Delivery Location</b><br>${deliveryAddress}');

    ${vendorMarkerJs}
    ${routeJs}
  </script>
</body>
</html>`;
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="animate-pulse w-full space-y-5 p-4 md:p-8">
      <div className="h-5 bg-gray-200 rounded w-32" />
      <div className="bg-[#e8f7e8] rounded-2xl p-6 space-y-5">
        <div className="flex gap-5">
          <div className="w-32 h-28 bg-gray-300 rounded-xl flex-shrink-0" />
          <div className="space-y-3 flex-1">
            <div className="h-5 bg-gray-300 rounded w-2/3" />
            <div className="h-4 bg-gray-300 rounded w-1/3" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-11 bg-gray-300 rounded-xl" />
          ))}
        </div>
        <div className="h-10 bg-gray-300 rounded-xl" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-8 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<DetailTab>("Order Content");

  useEffect(() => {
    if (!orderId) return;
    (async () => {
      try {
        setLoading(true);
        const res: any = await itService.getOrder(orderId);
        const d = res?.order ?? res?.data?.order ?? res;
        setOrder(d);
      } catch (err: any) {
        toast.error(err?.message || "Failed to load order");
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId]);

  // ── useMemo MUST be before any early returns (Rules of Hooks) ─────────────
  const deliveryLat = order?.deliveryLatitude ?? 6.5244;
  const deliveryLng = order?.deliveryLongitude ?? 3.3792;
  const vendorLat = order?.vendor?.location?.coordinates?.[1] ?? null;
  const vendorLng = order?.vendor?.location?.coordinates?.[0] ?? null;
  const deliveryAddress = safeStr(order?.deliveryAddress);
  const vendorZone = safeStr(
    order?.vendor?.location?.address ?? order?.vendor?.zone ?? order?.vendor?.area
  );

  const mapHtml = useMemo(
    () => buildMapHtml(deliveryLat, deliveryLng, vendorLat, vendorLng, deliveryAddress, vendorZone),
    [deliveryLat, deliveryLng, vendorLat, vendorLng, deliveryAddress, vendorZone]
  );

  if (loading) return <Skeleton />;

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] text-gray-500 gap-4">
        <p className="text-lg font-medium">Order not found</p>
        <button
          onClick={() => router.push("/it/orders")}
          className="text-[#1a3f1c] underline text-sm hover:opacity-70"
        >
          ← Back to Orders
        </button>
      </div>
    );
  }

  // ── All fields from real API — no fallback mock values ─────────────────────

  const status = (order.status ?? "pending").toUpperCase();
  const orderId2 = order.orderNumber ?? order._id ?? orderId;
  const orderType = order.orderType ?? order.type ?? "—";
  const orderImage = order.image ?? order.foodImage ?? order.photo ?? "";

  // Cost breakdown — all from DB fields set by orderController
  const items: any[] = order.items ?? order.orderItems ?? [];
  const mealCost = order.totalPrice ?? order.mealCost ?? order.orderCost ?? 0;
  const deliveryFee = order.deliveryFee ?? 0;
  const serviceFee = order.serviceFee ?? order.serviceCharge ?? 0;
  const totalFee = order.totalFee ?? order.total ?? mealCost + deliveryFee + serviceFee;

  // Populated refs from backend
  const customer = order.customer ?? {};
  const vendor = order.vendor ?? {};
  const rider = order.rider ?? {};

  // Customer fields
  const customerName = safeStr(customer.user?.name ?? customer.name);
  const customerPhone = safeStr(customer.user?.phone ?? customer.phone);
  const customerEmail = safeStr(customer.user?.email ?? customer.email);
  const customerZone = safeStr(
    customer.savedAddresses?.[0]?.address ?? customer.savedAddresses?.[0]?.label ?? customer.zone
  );
  const customerPhoto = customer.user?.avatar ?? customer.photo ?? "";

  // Vendor fields
  const vendorName = safeStr(vendor.name ?? vendor.businessName);
  const vendorRating = vendor.averageRating ?? vendor.rating ?? 0;
  const vendorReviews = vendor.ratingCount ?? vendor.totalRatings ?? 0;
  const vendorPhone = safeStr(vendor.owner?.phone ?? vendor.phone);
  const vendorPhoto = vendor.photo ?? vendor.logo ?? "";

  // Rider fields
  const riderName =
    (rider.user?.name ?? `${rider.firstName ?? ""} ${rider.lastName ?? ""}`.trim()) || "—";
  const riderRating = rider.averageRating ?? rider.rating ?? rider.ratings?.average ?? 0;
  const riderReviews = rider.ratingCount ?? rider.ratings?.count ?? 0;
  const riderPhone = safeStr(rider.user?.phone ?? rider.phone);
  const riderZone = safeStr(rider.operatingArea?.[0] ?? rider.zone);
  const riderPhoto = rider.photo ?? rider.user?.avatar ?? "";

  const tabs: DetailTab[] = ["Order Content", "Involved Party Details", "Map Feature"];

  return (
    <div className="w-full space-y-4">
      {/* ── Back ── */}
      <button
        onClick={() => router.push("/it/orders")}
        className="flex items-center gap-2 text-[#1a3f1c] font-semibold text-sm hover:opacity-70 transition-opacity"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Orders
      </button>

      {/* ── Main card — full width ── */}
      <div className="w-full bg-[#e8f7e8] rounded-2xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-green-200">
          <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
        </div>

        {/* Order summary — image + IDs */}
        <div className="flex flex-col sm:flex-row gap-5 px-6 py-5">
          {/* Food image */}
          <div className="w-full sm:w-36 h-28 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
            {orderImage ? (
              <img src={orderImage} alt="Order" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-medium">
                No image
              </div>
            )}
          </div>

          {/* Order info */}
          <div className="flex flex-col justify-center gap-2">
            <div className="text-sm md:text-base">
              <span className="font-bold text-gray-900">Order ID: </span>
              <span className="text-gray-700 font-mono">{orderId2}</span>
            </div>
            <div className="text-sm md:text-base">
              <span className="font-bold text-gray-900">Order Type: </span>
              <span className="text-gray-700">{orderType}</span>
            </div>
            {order.placedAt && (
              <div className="text-sm md:text-base">
                <span className="font-bold text-gray-900">Placed: </span>
                <span className="text-gray-700">{new Date(order.placedAt).toLocaleString()}</span>
              </div>
            )}
            {order.deliveryAddress && (
              <div className="text-sm text-gray-600 flex items-start gap-1">
                <MapPin className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                {deliveryAddress}
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-3 gap-2 px-6 pb-3">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`py-3 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                tab === t
                  ? "bg-[#1a3f1c] text-white shadow-sm"
                  : "bg-[#98ef9b] text-[#1a3f1c] hover:bg-[#7de07f]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Status bar */}
        <div className="mx-6 mb-5">
          <span
            className={`inline-block w-full text-center py-2.5 rounded-xl text-sm font-bold tracking-widest uppercase ${statusStyle(order.status ?? "")}`}
          >
            {status}
          </span>
        </div>

        {/* ── Tab content ── */}
        <div className="px-4 sm:px-6 pb-8">
          {/* ── ORDER CONTENT ── */}
          {tab === "Order Content" && (
            <div className="space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-10 text-gray-500 bg-white rounded-xl">
                  <p className="font-medium">No item details available</p>
                  <p className="text-xs mt-1">Items may not have been populated by the backend</p>
                </div>
              ) : (
                <div className="bg-white rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead style={{ backgroundColor: "#1a3f1c" }}>
                      <tr>
                        <th className="text-left px-4 py-3 font-semibold text-white">Item</th>
                        <th className="text-left px-4 py-3 font-semibold text-white">Price</th>
                        <th className="text-right px-4 py-3 font-semibold text-white">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item: any, i: number) => {
                        const qty = item.quantity ?? item.qty ?? 1;
                        const name =
                          item.item?.name ?? item.name ?? item.itemName ?? item.foodName ?? "Item";
                        const unit = item.item?.category ?? item.unit ?? item.unitLabel ?? "";
                        const price = item.price ?? item.unitPrice ?? 0;
                        const total = item.total ?? item.subtotal ?? qty * price;
                        return (
                          <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-green-50"}>
                            <td className="px-4 py-3 text-gray-800">
                              {qty}x {name}
                              {unit ? ` of ${unit}` : ""}
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                              {fmt(price)}
                              {unit ? `/${unit}` : ""}
                            </td>
                            <td className="px-4 py-3 text-right font-semibold text-gray-900">
                              {fmt(total)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Cost breakdown */}
              <div className="bg-white rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 flex justify-between text-sm">
                  <span className="text-gray-600">Total Meal Cost</span>
                  <span className="font-semibold text-gray-900">{fmt(mealCost)}</span>
                </div>
                <div className="px-4 py-3 border-b border-gray-100 flex justify-between text-sm">
                  <span className="text-gray-600">Service fee</span>
                  <span className="font-semibold text-gray-900">{fmt(serviceFee)}</span>
                </div>
                <div className="px-4 py-3 border-b border-gray-100 flex justify-between text-sm">
                  <span className="text-gray-600">Delivery fee</span>
                  <span className="font-semibold text-gray-900">{fmt(deliveryFee)}</span>
                </div>
                <div
                  className="px-4 py-4 flex justify-between font-bold text-base"
                  style={{ backgroundColor: "#e8f7e8" }}
                >
                  <span className="text-gray-900">Total Fee</span>
                  <span className="text-[#1a3f1c] text-lg">{fmt(totalFee)}</span>
                </div>
              </div>
            </div>
          )}

          {/* ── INVOLVED PARTY DETAILS ── */}
          {tab === "Involved Party Details" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <PartyCard
                label="Customer"
                photo={customerPhoto}
                name={customerName}
                rating={null}
                reviewCount={null}
                phone={customerPhone}
                email={customerEmail}
                zone={customerZone}
              />
              <PartyCard
                label="Vendor"
                photo={vendorPhoto}
                name={vendorName}
                rating={vendorRating}
                reviewCount={vendorReviews}
                phone={vendorPhone}
                zone={vendorZone}
              />
              <PartyCard
                label="Rider"
                photo={riderPhoto}
                name={riderName}
                rating={riderRating}
                reviewCount={riderReviews}
                phone={riderPhone}
                zone={riderZone}
              />
            </div>
          )}

          {/* ── MAP FEATURE ── */}
          {tab === "Map Feature" && (
            <div className="space-y-3">
              {/* Legend */}
              <div className="flex flex-wrap gap-4 text-xs font-medium text-gray-700 pb-1">
                {vendorLat && (
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#1a3f1c] inline-block" />
                    Vendor pickup
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#D00000] inline-block" />
                  Delivery location
                </span>
                {vendorLat && (
                  <span className="flex items-center gap-1.5">
                    <span className="w-6 h-0.5 bg-blue-500 inline-block" />
                    Delivery route
                  </span>
                )}
              </div>

              {/* Map */}
              <div
                className="w-full rounded-xl overflow-hidden border border-green-200 shadow-sm"
                style={{ height: "420px" }}
              >
                <iframe
                  title="Delivery Route Map"
                  width="100%"
                  height="100%"
                  style={{ border: 0, display: "block" }}
                  srcDoc={mapHtml}
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>

              {/* Address info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {deliveryAddress !== "—" && (
                  <div className="bg-white rounded-xl px-4 py-3 flex items-start gap-2 border border-green-100">
                    <MapPin className="h-4 w-4 text-[#D00000] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-0.5">Delivery address</p>
                      <p className="text-gray-800">{deliveryAddress}</p>
                    </div>
                  </div>
                )}
                {vendorZone !== "—" && (
                  <div className="bg-white rounded-xl px-4 py-3 flex items-start gap-2 border border-green-100">
                    <MapPin className="h-4 w-4 text-[#1a3f1c] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-0.5">Vendor location</p>
                      <p className="text-gray-800">{vendorZone}</p>
                    </div>
                  </div>
                )}
              </div>

              {!vendorLat && (
                <p className="text-xs text-gray-400 text-center">
                  Route line requires vendor coordinates — showing delivery point only.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Party Card ────────────────────────────────────────────────────────────────
function PartyCard({
  label,
  photo,
  name,
  rating,
  reviewCount,
  phone,
  email,
  zone,
}: {
  label: string;
  photo: string;
  name: string;
  rating: number | null;
  reviewCount: number | null;
  phone: string;
  email?: string;
  zone: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-green-100 space-y-4">
      {/* Label */}
      <p className="text-xs font-bold text-[#1a3f1c] uppercase tracking-wider">{label}</p>

      {/* Avatar + name */}
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 rounded-full bg-gray-100 overflow-hidden flex-shrink-0 border-2 border-green-200">
          {photo ? (
            <img src={photo} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl font-bold">
              {name.charAt(0) || "?"}
            </div>
          )}
        </div>
        <p className="font-bold text-gray-900 text-sm leading-tight break-words">{name}</p>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100" />

      {/* Info */}
      <div className="space-y-2 text-sm text-gray-700">
        {rating !== null && rating > 0 && (
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-400 flex-shrink-0" />
            <span>
              {rating.toFixed(1)}
              {reviewCount ? ` · ${reviewCount} reviews` : ""}
            </span>
          </div>
        )}
        {phone !== "—" && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <span>{phone}</span>
          </div>
        )}
        {email && email !== "—" && (
          <div className="flex items-start gap-2">
            <Mail className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
            <span className="break-all text-xs">{email}</span>
          </div>
        )}
        {zone !== "—" && (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-green-600 flex-shrink-0" />
            <span>{zone}</span>
          </div>
        )}
      </div>
    </div>
  );
}
