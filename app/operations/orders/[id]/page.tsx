"use client";

import { use, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useRouteGuard } from "@/hooks/useRouteGuard";
import { operationsService } from "@/lib/api/services/operations.service";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Phone, Mail, MapPin, Star, Loader2 } from "lucide-react";
import { toast } from "sonner";
import AssignRiderModal from "@/components/operations/modals/AssignRiderModal";

type TabType = "content" | "party" | "map";

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(n: any): string {
  return `₦${Number(n ?? 0).toLocaleString()}`;
}

function resolveName(obj: any, fallback = "—"): string {
  if (!obj) return fallback;
  if (typeof obj.resolvedName === "string" && obj.resolvedName.trim()) return obj.resolvedName.trim();
  if (typeof obj.name === "string" && obj.name.trim()) return obj.name.trim();
  const first = (obj.firstName ?? "").trim();
  const last  = (obj.lastName  ?? "").trim();
  const full  = `${first} ${last}`.trim();
  if (full) return full;
  if (obj.user) return resolveName(obj.user, fallback);
  return fallback;
}

function resolveAddress(val: any): string {
  if (!val) return "";
  if (typeof val === "string") return val.trim();
  if (typeof val === "object") {
    if (val.street) return [val.street, val.city, val.state].filter(Boolean).join(", ");
    return val.address ?? val.location ?? "";
  }
  return "";
}

function resolvePhoto(obj: any): string {
  if (!obj) return "";
  return obj.photo ?? obj.avatar ?? obj.profileImage ?? obj.img ?? obj.image ?? obj.profilePhoto ?? obj.coverImage ?? obj.logo ?? "";
}

function resolveOrderImage(order: any): string {
  const direct = order.image ?? order.foodImage ?? order.photo ?? order.thumbnail ?? order.coverImage ?? "";
  if (direct) return direct;
  const items = order.items ?? [];
  for (const item of items) {
    const img = item.displayImage ?? item.image ?? item.photo ?? item.item?.img ?? "";
    if (img) return img;
  }
  return order.vendor?.photo ?? "";
}

function statusBarColor(status: string): string {
  const s = (status ?? "").toLowerCase();
  if (["delivered", "completed"].includes(s))            return "bg-green-700 text-white";
  if (["in_transit", "picked_up", "riding"].includes(s)) return "bg-blue-700 text-white";
  if (["cancelled", "declined"].includes(s))             return "bg-red-700 text-white";
  return "bg-[#1a3f1c] text-white";
}

function statusLabel(status: string): string {
  const map: Record<string, string> = {
    in_transit: "RIDING",     picked_up:  "RIDING",
    delivered:  "SUCCESSFUL", completed:  "SUCCESSFUL",
    cancelled:  "CANCELLED",  declined:   "CANCELLED",
    riding:     "RIDING",     assigned:   "ASSIGNED",
    confirming: "CONFIRMING", pending:    "PENDING",
    preparing:  "PREPARING",
  };
  return map[(status ?? "").toLowerCase()] ?? (status ?? "PENDING").toUpperCase();
}

// Payment status badge
function paymentBadge(status: string) {
  const s = (status ?? "").toLowerCase();
  const color =
    s === "paid"     ? "bg-green-100 text-green-700 border-green-300" :
    s === "refunded" ? "bg-blue-100 text-blue-700 border-blue-300"   :
    "bg-red-100 text-red-600 border-red-300";
  return (
    <span className={`inline-block text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border ${color}`}>
      {status ?? "unpaid"}
    </span>
  );
}

// Format date to readable time
function formatOrderTime(dateStr: string): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-NG", {
    day:    "numeric",
    month:  "short",
    year:   "numeric",
    hour:   "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

// Make subStatus human-readable: "rider_assigned" → "Rider Assigned"
function formatSubStatus(sub: string): string {
  if (!sub) return "—";
  return sub
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// ── PartyCard ─────────────────────────────────────────────────────────────────
function PartyCard({ photo, name, rows }: {
  photo?: string;
  name: string;
  rows: { icon: React.ReactNode; text: string }[];
}) {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0">
        {photo ? (
          <img src={photo} alt={name} className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-gray-200" />
        ) : (
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#98ef9b] flex items-center justify-center text-[#1a3f1c] font-bold text-xl flex-shrink-0">
            {(name ?? "?").charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div className="space-y-1 min-w-0">
        <p className="font-bold text-sm text-gray-900">{name}</p>
        {rows.map((row, i) =>
          row.text ? (
            <div key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
              <span className="flex-shrink-0 mt-0.5">{row.icon}</span>
              <span className="break-words">{row.text}</span>
            </div>
          ) : null,
        )}
      </div>
    </div>
  );
}

// ── Map builder ───────────────────────────────────────────────────────────────
function buildMap(vLat: number, vLng: number, vAddr: string, cLat: number, cLng: number, cAddr: string): string {
  const mid = [(vLat + cLat) / 2, (vLng + cLng) / 2];
  const esc = (s: string) => s.replace(/'/g, "\\'");
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"/>
<script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"></script>
<style>*{margin:0;padding:0}html,body,#map{width:100%;height:100%}</style>
</head><body><div id="map"></div><script>
var map=L.map('map').setView([${mid[0]},${mid[1]}],14);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19}).addTo(map);
var vi=L.divIcon({className:'',html:'<div style="background:#1A3F1C;border-radius:50%;width:30px;height:30px;display:flex;align-items:center;justify-content:center;font-size:14px;color:white;">🏪</div>',iconAnchor:[15,15]});
var ci=L.divIcon({className:'',html:'<div style="background:#D00000;border-radius:50%;width:30px;height:30px;display:flex;align-items:center;justify-content:center;font-size:14px;color:white;">📍</div>',iconAnchor:[15,15]});
L.marker([${vLat},${vLng}],{icon:vi}).addTo(map).bindPopup('${esc(vAddr)}');
L.marker([${cLat},${cLng}],{icon:ci}).addTo(map).bindPopup('${esc(cAddr)}');
L.polyline([[${vLat},${vLng}],[${cLat},${cLng}]],{color:'#1A3F1C',weight:3,dashArray:'8,6'}).addTo(map);
map.fitBounds([[${vLat},${vLng}],[${cLat},${cLng}]],{padding:[40,40]});
</script></body></html>`;
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="animate-pulse space-y-5 max-w-4xl mx-auto">
      <div className="h-5 bg-gray-200 rounded w-28" />
      <div className="bg-white rounded-xl p-6 space-y-4">
        <div className="flex gap-4">
          <div className="w-32 h-28 bg-gray-200 rounded-xl flex-shrink-0" />
          <div className="space-y-3 flex-1">
            {[1,2,3,4,5].map(i => <div key={i} className="h-4 bg-gray-200 rounded w-1/2" />)}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[1,2,3].map(i => <div key={i} className="h-11 bg-gray-200 rounded-lg" />)}
        </div>
        <div className="h-8 bg-gray-200 rounded-lg" />
        {[1,2,3,4,5].map(i => <div key={i} className="h-5 bg-gray-200 rounded" />)}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
interface PageProps { params: Promise<{ id: string }>; }

export default function OrderDetailsPage({ params }: PageProps) {
  const { shouldRender, Reloading } = useRouteGuard({ returnRenderFlag: true });
  const router = useRouter();
  const { id } = use(params);

  const [order,      setOrder]      = useState<any>(null);
  const [loading,    setLoading]    = useState(true);
  const [tab,        setTab]        = useState<TabType>("content");
  const [assignOpen, setAssignOpen] = useState(false);

  const fetchOrder = useCallback(async () => {
    if (!shouldRender || !id) return;
    try {
      setLoading(true);
      const res: any = await operationsService.getOrder(id);
      setOrder(res?.data ?? res);
    } catch (err: any) {
      toast.error(err?.message || "Failed to load order");
    } finally {
      setLoading(false);
    }
  }, [shouldRender, id]);

  useEffect(() => { fetchOrder(); }, [fetchOrder]);

  if (!shouldRender || Reloading) {
    return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="h-10 w-10 animate-spin text-[#1a3f1c]" /></div>;
  }

  if (loading) return <Skeleton />;

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-gray-500">
        <p className="text-xl font-medium">Order not found</p>
        <Button onClick={() => router.push("/operations/orders")} className="bg-[#1a3f1c] text-white">Back to Orders</Button>
      </div>
    );
  }

  // ── Order meta ──────────────────────────────────────────────────────────────
  const status        = order.status    ?? "pending";
  const subStatus     = order.subStatus ?? "";
  const orderId       = order.orderNumber ?? order._id ?? id;
  const orderType     = order.orderType ?? order.type ?? order.category ?? order.buildType ?? "Standard";
  const orderImage    = resolveOrderImage(order);
  const paymentStatus = order.paymentStatus ?? "unpaid";
  const orderTime     = order.createdAt ?? order.placedAt ?? "";
  const zone          = order.zone ?? "—";

  // ── Items ───────────────────────────────────────────────────────────────────
  const items: any[] = order.items ?? [];

  // ── Cost breakdown ──────────────────────────────────────────────────────────
  const mealCost    = order.calculatedMealCost ?? items.reduce((s: number, item: any) => s + (item.quantity ?? 1) * (item.price ?? 0), 0);
  const deliveryFee = order.calculatedDelivery ?? order.deliveryFee ?? 0;
  const serviceFee  = order.calculatedService  ?? order.serviceFee  ?? 0;
  const totalFee    = order.calculatedTotal    ?? order.totalPrice  ?? order.total ?? null;

  // ── Customer ────────────────────────────────────────────────────────────────
  const customer        = order.customer ?? {};
  const customerName    = resolveName(customer, "Unknown");
  const customerPhone   = String(customer.phone ?? customer.phoneNumber ?? customer.user?.phone ?? customer.user?.phoneNumber ?? "");
  const customerEmail   = customer.email ?? customer.user?.email ?? "";
  const customerAddress = resolveAddress(
    customer.primaryAddress ?? customer.address ?? customer.user?.address ??
    (customer.savedAddresses?.[0]?.address) ?? order.deliveryAddress ?? ""
  );
  const customerPhoto = resolvePhoto(customer) || resolvePhoto(customer.user);

  // ── Vendor ──────────────────────────────────────────────────────────────────
  const vendor        = order.vendor ?? {};
  const vendorName    = vendor.storeName ?? vendor.businessName ?? vendor.name ?? "—";
  const vendorPhone   = String(vendor.phone ?? vendor.phoneNumber ?? "");
  const vendorAddress = resolveAddress(vendor.address ?? "");
  const vendorRating  = vendor.rating      ?? vendor.averageRating ?? 0;
  const vendorCount   = vendor.ratingCount ?? vendor.totalRatings  ?? 0;
  const vendorPhoto   = resolvePhoto(vendor);

  // ── Rider ───────────────────────────────────────────────────────────────────
  const hasRider    = !!order.rider;
  const riderObj    = order.rider ?? {};
  const riderName   = hasRider ? resolveName(riderObj.user ?? riderObj, "Rider") : "Not Assigned";
  const riderPhone  = String(riderObj.user?.phone ?? riderObj.user?.phoneNumber ?? riderObj.phone ?? riderObj.phoneNumber ?? "");
  const riderRating  = riderObj.ratings?.average ?? riderObj.averageRating ?? riderObj.rating ?? 0;
  const riderCount   = riderObj.ratings?.count   ?? riderObj.ratingCount   ?? 0;
  const riderZone    = (() => {
    const z = riderObj.operatingArea ?? riderObj.zone ?? "";
    return Array.isArray(z) ? z.join(", ") : z;
  })();
  const riderVehicle = riderObj.modeOfDelivery ?? riderObj.vehicleType ?? "";
  const riderPhoto   = resolvePhoto(riderObj) || resolvePhoto(riderObj.user);

  // ── Map coordinates ─────────────────────────────────────────────────────────
  const vendorLat = vendor.latitude  ?? 6.5244;
  const vendorLng = vendor.longitude ?? 3.3792;
  const custLat   = order.deliveryLatitude  ?? customer.latitude  ?? 6.5144;
  const custLng   = order.deliveryLongitude ?? customer.longitude ?? 3.3692;
  const mapHtml   = buildMap(vendorLat, vendorLng, vendorAddress, custLat, custLng, customerAddress);

  const tabs = [
    { id: "content" as TabType, label: "Order Content"          },
    { id: "party"   as TabType, label: "Involved Party Details" },
    { id: "map"     as TabType, label: "Map Feature"            },
  ];

  return (
    <div className="space-y-4 sm:space-y-5 max-w-4xl mx-auto">

      <Button onClick={() => router.push("/operations/orders")} variant="ghost" className="gap-2 hover:bg-[#98ef9b] text-[#1a3f1c] font-semibold">
        <ArrowLeft className="h-4 w-4" /> Back to Orders
      </Button>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-center">Order Details</h1>

      {/* ── Summary card ── */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-5 flex gap-4 items-start">
        <div className="w-28 h-24 sm:w-36 sm:h-28 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
          {orderImage ? (
            <img src={orderImage} alt="Order" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-green-200 to-green-400 flex items-center justify-center text-white text-xs font-bold">IMG</div>
          )}
        </div>
        <div className="space-y-1.5 text-sm sm:text-base flex-1 min-w-0">
          <p><span className="font-bold">Order ID:</span> <span className="text-gray-700">Order ID: {orderId}</span></p>
          <p><span className="font-bold">Order Type:</span> <span className="text-gray-700">{orderType}</span></p>
          <p><span className="font-bold">Zone:</span> <span className="text-gray-700">{zone}</span></p>
          <p className="flex flex-wrap items-center gap-2">
            <span className="font-bold">Payment:</span>
            {paymentBadge(paymentStatus)}
          </p>
          <p>
            <span className="font-bold">Sub-status:</span>{" "}
            <span className="text-gray-600 text-xs">{formatSubStatus(subStatus)}</span>
          </p>
          <p>
            <span className="font-bold">Placed:</span>{" "}
            <span className="text-gray-500 text-xs">{formatOrderTime(orderTime)}</span>
          </p>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`py-3 px-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
              tab === t.id ? "bg-[#1a3f1c] text-white" : "bg-[#98ef9b] text-[#1a3f1c] hover:bg-[#88df8b]"
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Status bar ── */}
      <div className={`text-center py-2.5 rounded-xl text-sm font-bold tracking-widest ${statusBarColor(status)}`}>
        {statusLabel(status)}
      </div>

      {/* ── Tab content ── */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 min-h-[320px]">

        {/* ORDER CONTENT */}
        {tab === "content" && (
          <div>
            {items.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-10">No item details available</p>
            ) : (
              <>
                <table className="w-full text-sm mb-4">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 font-semibold text-gray-700 w-1/2">Item</th>
                      <th className="text-center py-2 font-semibold text-gray-700">Price</th>
                      <th className="text-right py-2 font-semibold text-gray-700">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item: any, i: number) => {
                      const qty   = item.quantity ?? 1;
                      const price = item.price    ?? 0;
                      const total = qty * price;
                      const name  = item.displayName ?? item.itemType ?? "Item";
                      const unit  = item.unit ?? item.item?.unit ?? "";
                      const itemLabel  = `${qty}x ${name}`;
                      const priceLabel = unit ? `${fmt(price)}/${unit}` : fmt(price);
                      return (
                        <tr key={i} className="border-b border-gray-100">
                          <td className="py-2.5 text-gray-800">{itemLabel}</td>
                          <td className="py-2.5 text-center text-gray-500">{priceLabel}</td>
                          <td className="py-2.5 text-right font-medium">{fmt(total)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <div className="text-sm border-t border-gray-200 pt-2">
                  {mealCost > 0 && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-700 font-medium">Total Meal Cost</span>
                      <span className="font-medium">{fmt(mealCost)}</span>
                    </div>
                  )}
                  {serviceFee > 0 && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Service fee</span>
                      <span>{fmt(serviceFee)}</span>
                    </div>
                  )}
                  {deliveryFee > 0 && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Delivery fee</span>
                      <span>{fmt(deliveryFee)}</span>
                    </div>
                  )}
                  {totalFee !== null && (
                    <div className="flex justify-between py-3 font-bold text-base">
                      <span>Total Fee</span>
                      <span className="text-[#1a3f1c] text-lg">{fmt(totalFee)}</span>
                    </div>
                  )}
                </div>
              </>
            )}

            {!hasRider && (
              <Button onClick={() => setAssignOpen(true)} className="w-full bg-[#1a3f1c] hover:bg-[#164016] text-white h-11 mt-4">
                Assign a Rider
              </Button>
            )}
          </div>
        )}

        {/* INVOLVED PARTY DETAILS */}
        {tab === "party" && (
          <>
            <div className={`grid gap-6 ${hasRider ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2"}`}>
              <PartyCard photo={customerPhoto} name={customerName}
                rows={[
                  { icon: <Phone  className="h-3.5 w-3.5" />,                        text: customerPhone   },
                  { icon: <Mail   className="h-3.5 w-3.5" />,                        text: customerEmail   },
                  { icon: <MapPin className="h-3.5 w-3.5 text-green-600" />,         text: customerAddress },
                ]}
              />
              <PartyCard photo={vendorPhoto} name={vendorName}
                rows={[
                  { icon: <Star className="h-3.5 w-3.5 fill-[#FFCA3A] stroke-[#FFCA3A]" />, text: vendorRating > 0 ? `Rating: ${Number(vendorRating).toFixed(1)}${vendorCount > 0 ? ` (${vendorCount})` : ""}` : "" },
                  { icon: <Phone  className="h-3.5 w-3.5" />,                        text: vendorPhone   },
                  { icon: <MapPin className="h-3.5 w-3.5 text-green-600" />,         text: vendorAddress },
                ]}
              />
              {hasRider && (
                <PartyCard photo={riderPhoto} name={riderName}
                  rows={[
                    { icon: <Star className="h-3.5 w-3.5 fill-[#FFCA3A] stroke-[#FFCA3A]" />, text: riderRating > 0 ? `Rating: ${Number(riderRating).toFixed(1)}${riderCount > 0 ? ` (${riderCount})` : ""}` : "" },
                    { icon: <Phone  className="h-3.5 w-3.5" />,                      text: riderPhone   },
                    { icon: <span className="text-xs">🚗</span>,                     text: riderVehicle ? riderVehicle.charAt(0).toUpperCase() + riderVehicle.slice(1) : "" },
                    { icon: <MapPin className="h-3.5 w-3.5 text-green-600" />,       text: riderZone    },
                  ]}
                />
              )}
            </div>
            {!hasRider && (
              <Button onClick={() => setAssignOpen(true)} className="w-full bg-[#1a3f1c] hover:bg-[#164016] text-white h-11 mt-6">
                Assign a Rider
              </Button>
            )}
          </>
        )}

        {/* MAP FEATURE */}
        {tab === "map" && (
          <div className="flex flex-col sm:flex-row gap-4 h-full">
            <div className="sm:w-52 flex-shrink-0 space-y-4 text-sm pt-1">
              {vendorAddress && (
                <div>
                  <p className="font-bold text-[#1a3f1c] mb-1">Vendor Address</p>
                  <p className="text-gray-600 leading-relaxed">{vendorAddress}</p>
                </div>
              )}
              {customerAddress && (
                <div>
                  <p className="font-bold text-[#1a3f1c] mb-1">Customer Address</p>
                  <p className="text-gray-600 leading-relaxed">{customerAddress}</p>
                </div>
              )}
            </div>
            <div className="flex-1 rounded-xl overflow-hidden border border-gray-200" style={{ minHeight: 300 }}>
              <iframe title="Delivery Map" width="100%" height="100%"
                style={{ border: 0, display: "block", minHeight: 300 }}
                srcDoc={mapHtml} sandbox="allow-scripts allow-same-origin" />
            </div>
          </div>
        )}
      </div>

      <AssignRiderModal
        open={assignOpen}
        orderId={id}
        orderZone={order?.zone}
        onClose={() => setAssignOpen(false)}
        onAssigned={fetchOrder}
      />
    </div>
  );
}