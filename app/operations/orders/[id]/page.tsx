"use client";

import { use, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useRouteGuard } from "@/hooks/useRouteGuard";
import { operationsService } from "@/lib/api/services/operations.service";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Phone, Mail, MapPin, Star, Loader2, Users } from "lucide-react";
import { toast } from "sonner";
import AssignRiderModal from "@/components/operations/modals/AssignRiderModal";

// ── Types ─────────────────────────────────────────────────────────────────────
type TabType = "content" | "party" | "map";

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmt(n: any) {
  return `₦${Number(n ?? 0).toLocaleString()}`;
}

function safeStr(val: any, fallback = "—"): string {
  if (!val) return fallback;
  if (typeof val === "string") return val.trim() || fallback;
  if (typeof val === "object") return val.address ?? val.name ?? val.label ?? fallback;
  return String(val);
}

function statusColor(status: string) {
  const s = (status ?? "").toLowerCase();
  if (["delivered", "completed"].includes(s))  return "bg-green-100 text-green-800 border border-green-200";
  if (["cancelled", "declined"].includes(s))   return "bg-red-100 text-red-800 border border-red-200";
  return "bg-yellow-100 text-yellow-800 border border-yellow-200";
}

function StarRating({ value = 0 }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} className="h-4 w-4"
          fill={i <= Math.round(value) ? "#FFCA3A" : "none"}
          stroke={i <= Math.round(value) ? "#FFCA3A" : "#9ca3af"} />
      ))}
      <span className="text-xs text-gray-500 ml-1">{value.toFixed(1)}</span>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="animate-pulse space-y-5 max-w-4xl mx-auto">
      <div className="h-5 bg-gray-200 rounded w-28" />
      <div className="bg-white rounded-xl p-6 space-y-4">
        <div className="flex gap-4">
          <div className="w-28 h-24 bg-gray-200 rounded-lg flex-shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-1/3" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[1,2,3].map(i => <div key={i} className="h-11 bg-gray-200 rounded-lg" />)}
        </div>
        <div className="h-8 bg-gray-200 rounded-lg" />
        <div className="space-y-3">
          {[1,2,3,4].map(i => <div key={i} className="h-6 bg-gray-200 rounded" />)}
        </div>
      </div>
    </div>
  );
}

// ── Map Builder ───────────────────────────────────────────────────────────────
function buildMapHtml(lat: number, lng: number, address: string): string {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"/>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"/>
<script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"></script>
<style>*{margin:0;padding:0}html,body,#map{width:100%;height:100%}</style>
</head><body><div id="map"></div>
<script>
var map = L.map('map').setView([${lat},${lng}],15);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19}).addTo(map);
L.marker([${lat},${lng}],{icon:L.divIcon({className:'',html:'<div style="background:#D00000;color:#fff;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-size:16px;">📍</div>',iconAnchor:[16,16]})}).addTo(map).bindPopup('${address.replace(/'/g,"\\'")}');
</script></body></html>`;
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

  // Memoised so onAssigned can trigger a re-fetch after rider is assigned
  const fetchOrder = useCallback(async () => {
    if (!shouldRender || !id) return;
    try {
      setLoading(true);
      const res: any = await operationsService.getOrder(id);
      const d = res?.data ?? res;
      setOrder(d);
    } catch (err: any) {
      toast.error(err?.message || "Failed to load order");
    } finally {
      setLoading(false);
    }
  }, [shouldRender, id]);

  useEffect(() => { fetchOrder(); }, [fetchOrder]);

  if (!shouldRender || Reloading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-[#1a3f1c]" />
      </div>
    );
  }

  if (loading) return <Skeleton />;

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-gray-500">
        <p className="text-xl font-medium">Order not found</p>
        <Button onClick={() => router.push("/operations/orders")}
          className="bg-[#1a3f1c] hover:bg-[#164016] text-white">
          Back to Orders
        </Button>
      </div>
    );
  }

  // ── Field extraction — controller formats these fields exactly ──────────────
  const status   = (order.status ?? "pending").toUpperCase();
  const orderId  = order.orderNumber ?? order._id ?? id;
  // orderType not in operations controller select, show "Standard" fallback
  const orderType = order.orderType ?? order.type ?? "Standard";
  const orderImage = order.image ?? order.foodImage ?? order.photo ?? "";

  // Order Content — items array from the order document
  const items: any[]  = order.items ?? order.orderItems ?? [];
  const mealCost      = order.totalPrice    ?? order.mealCost   ?? order.totalAmount ?? 0;
  const deliveryFee   = order.deliveryFee   ?? 0;
  const serviceFee    = order.serviceFee    ?? Math.round(mealCost * 0.1);
  const totalFee      = order.totalFee      ?? order.total ?? (mealCost + deliveryFee + serviceFee);

  // Involved parties
  // operations customerController populates: customer { name, email, phone } (direct, no user ref)
  const customer = order.customer ?? {};
  const customerName  = safeStr(customer.name  ?? customer.user?.name);
  const customerPhone = safeStr(customer.phone ?? customer.user?.phone);
  const customerEmail = safeStr(customer.email ?? customer.user?.email);

  // vendor formatted by controller: { _id, name, storeName, address }
  const vendor = order.vendor ?? {};
  const vendorName    = safeStr(vendor.storeName ?? vendor.name);
  const vendorAddress = safeStr(vendor.address);
  const vendorRating  = vendor.rating ?? vendor.averageRating ?? 0;

  // rider in list: { phone }; in detail: { user: { name, phone, email }, operatingArea, modeOfDelivery, ... }
  const rider = order.rider ?? {};
  const riderName  = safeStr(rider.user?.name ?? `${rider.firstName ?? ""} ${rider.lastName ?? ""}`.trim());
  const riderPhone = safeStr(rider.user?.phone ?? rider.phone);
  const riderZone  = safeStr(Array.isArray(rider.operatingArea) ? rider.operatingArea[0] : rider.operatingArea);

  // Map — controller stores deliveryLocation or lat/lng directly
  const deliveryLat = order.deliveryLatitude  ?? order.latitude  ?? 6.5244;
  const deliveryLng = order.deliveryLongitude ?? order.longitude ?? 3.3792;
  const deliveryAddress = safeStr(order.deliveryAddress);
  const mapHtml = buildMapHtml(deliveryLat, deliveryLng, deliveryAddress);

  const tabs = [
    { id: "content" as TabType, label: "Order Content" },
    { id: "party"   as TabType, label: "Involved Party Details" },
    { id: "map"     as TabType, label: "Map Feature" },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">

      {/* Back */}
      <Button onClick={() => router.push("/operations/orders")}
        variant="ghost"
        className="gap-2 hover:bg-[#98ef9b] text-[#1a3f1c] font-semibold">
        <ArrowLeft className="h-4 w-4" /> Back to Orders
      </Button>

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-extrabold text-center">Order Details</h1>

      {/* Order info card */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
            {orderImage
              ? <img src={orderImage} alt="Food" className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-200 to-green-400 text-white text-xs font-bold">IMG</div>
            }
          </div>
          <div className="space-y-1.5 text-sm sm:text-base">
            <p><span className="font-bold">Order ID:</span> <span className="font-mono text-gray-700">{orderId}</span></p>
            <p><span className="font-bold">Order Type:</span> <span className="text-gray-700">{orderType}</span></p>
            {order.createdAt && (
              <p><span className="font-bold">Placed:</span> <span className="text-gray-700">{new Date(order.createdAt).toLocaleString("en-NG")}</span></p>
            )}
            {deliveryAddress !== "—" && (
              <p className="flex items-start gap-1">
                <MapPin className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{deliveryAddress}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`py-3 sm:py-4 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
              tab === t.id
                ? "bg-[#1a3f1c] text-white shadow-sm"
                : "bg-[#98ef9b] text-[#1a3f1c] hover:bg-[#88df8b]"
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Status bar */}
      <div className={`text-center py-2.5 rounded-xl text-sm font-bold tracking-widest uppercase ${statusColor(order.status ?? "")}`}>
        {status}
      </div>

      {/* Tab content */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 min-h-[300px]">

        {/* ── Order Content ── */}
        {tab === "content" && (
          <div className="space-y-4">
            {items.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No item details available</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-2 font-semibold text-gray-700">Item</th>
                    <th className="text-left py-2 font-semibold text-gray-700">Price</th>
                    <th className="text-right py-2 font-semibold text-gray-700">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item: any, i: number) => {
                    const qty   = item.quantity ?? item.qty ?? 1;
                    const name  = item.item?.name ?? item.name ?? item.foodName ?? "Item";
                    const price = item.price ?? item.unitPrice ?? 0;
                    const total = item.total ?? (qty * price);
                    return (
                      <tr key={i} className="border-b border-gray-100">
                        <td className="py-2.5 text-gray-800">{qty}x {name}</td>
                        <td className="py-2.5 text-gray-500">{fmt(price)}</td>
                        <td className="py-2.5 text-right font-medium">{fmt(total)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {/* Cost breakdown */}
            <div className="bg-gray-50 rounded-xl overflow-hidden text-sm">
              <div className="px-4 py-3 flex justify-between border-b border-gray-100">
                <span className="text-gray-600">Meal Cost</span>
                <span className="font-medium">{fmt(mealCost)}</span>
              </div>
              <div className="px-4 py-3 flex justify-between border-b border-gray-100">
                <span className="text-gray-600">Service fee</span>
                <span className="font-medium">{fmt(serviceFee)}</span>
              </div>
              <div className="px-4 py-3 flex justify-between border-b border-gray-100">
                <span className="text-gray-600">Delivery fee</span>
                <span className="font-medium">{fmt(deliveryFee)}</span>
              </div>
              <div className="px-4 py-4 flex justify-between font-bold text-base bg-[#e8f7e8]">
                <span>Total</span>
                <span className="text-[#1a3f1c] text-lg">{fmt(totalFee)}</span>
              </div>
            </div>

            {/* Assign Rider button — only shown if no rider yet */}
            {!order.rider && (
              <Button
                onClick={() => setAssignOpen(true)}
                className="w-full bg-[#1a3f1c] hover:bg-[#164016] text-white h-11">
                Assign Rider
              </Button>
            )}
          </div>
        )}

        {/* ── Involved Party Details ── */}
        {tab === "party" && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Customer */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <p className="text-xs font-bold text-[#1a3f1c] uppercase tracking-wide">Customer</p>
              <div className="flex items-center gap-2">
                <div className="w-11 h-11 rounded-full bg-[#1a3f1c] flex items-center justify-center flex-shrink-0">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <p className="font-bold text-sm text-gray-900">{customerName}</p>
              </div>
              <div className="space-y-1.5 text-xs text-gray-600">
                {customerPhone !== "—" && (
                  <div className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />{customerPhone}</div>
                )}
                {customerEmail !== "—" && (
                  <div className="flex items-start gap-1.5"><Mail className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" /><span className="break-all">{customerEmail}</span></div>
                )}
              </div>
            </div>

            {/* Vendor */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <p className="text-xs font-bold text-[#1a3f1c] uppercase tracking-wide">Vendor</p>
              <div className="flex items-center gap-2">
                <div className="w-11 h-11 rounded-full bg-[#98ef9b] flex items-center justify-center flex-shrink-0 text-[#1a3f1c] font-bold text-sm">
                  {vendorName.charAt(0) || "V"}
                </div>
                <p className="font-bold text-sm text-gray-900">{vendorName}</p>
              </div>
              <div className="space-y-1.5 text-xs text-gray-600">
                {vendorRating > 0 && <StarRating value={vendorRating} />}
                {vendorAddress !== "—" && (
                  <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-green-600" />{vendorAddress}</div>
                )}
              </div>
            </div>

            {/* Rider */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <p className="text-xs font-bold text-[#1a3f1c] uppercase tracking-wide">Rider</p>
              {order.rider ? (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-11 h-11 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0 text-[#1a3f1c] font-bold text-sm">
                      {riderName !== "—" ? riderName.charAt(0) : "R"}
                    </div>
                    <p className="font-bold text-sm text-gray-900">
                      {riderName !== "—" ? riderName : "Rider assigned"}
                    </p>
                  </div>
                  <div className="space-y-1.5 text-xs text-gray-600">
                    {riderPhone !== "—" && (
                      <div className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />{riderPhone}</div>
                    )}
                    {riderZone !== "—" && (
                      <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-green-600" />{riderZone}</div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2 py-4">
                  <p className="text-xs text-gray-400 italic">No rider assigned</p>
                  <Button size="sm"
                    onClick={() => setAssignOpen(true)}
                    className="bg-[#1a3f1c] hover:bg-[#164016] text-white text-xs h-8 px-4">
                    Assign Rider
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Map Feature ── */}
        {tab === "map" && (
          <div className="space-y-3">
            <div className="rounded-xl overflow-hidden border border-gray-200" style={{ height: 360 }}>
              <iframe
                title="Delivery Map"
                width="100%" height="100%"
                style={{ border: 0, display: "block" }}
                srcDoc={mapHtml}
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
            {deliveryAddress !== "—" && (
              <p className="text-sm text-gray-600 flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-green-600 flex-shrink-0" />
                {deliveryAddress}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Assign Rider Modal */}
      <AssignRiderModal
        open={assignOpen}
        orderId={id}
        onClose={() => setAssignOpen(false)}
        onAssigned={fetchOrder}
      />
    </div>
  );
}