"use client";

import { useEffect, useRef, useState } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  DirectionsRenderer,
  Marker,
} from "@react-google-maps/api";
import { io, Socket } from "socket.io-client";

interface MapFeatureTabProps {
  order: any;
}

const MAP_LIBRARIES: ("places" | "geometry")[] = ["geometry"];

const containerStyle = { width: "100%", height: "100%" };

const VENDOR_ICON = {
  path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z",
  fillColor: "#98ef9b",
  fillOpacity: 1,
  strokeColor: "#1a3f1c",
  strokeWeight: 1.5,
  scale: 1.4,
  anchor: { x: 12, y: 24 } as google.maps.Point,
};

const CUSTOMER_ICON = {
  path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z",
  fillColor: "#ffca3a",
  fillOpacity: 1,
  strokeColor: "#92400e",
  strokeWeight: 1.5,
  scale: 1.4,
  anchor: { x: 12, y: 24 } as google.maps.Point,
};

const RIDER_ICON = {
  path: "M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z",
  fillColor: "#ffffff",
  fillOpacity: 1,
  strokeColor: "#1a3f1c",
  strokeWeight: 1.5,
  scale: 1.2,
  anchor: { x: 12, y: 12 } as google.maps.Point,
};

export default function MapFeatureTab({ order }: MapFeatureTabProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    libraries: MAP_LIBRARIES,
  });

  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [riderPos, setRiderPos] = useState<{ lat: number; lng: number } | null>(null);
  const [routeError, setRouteError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const vendorLat = order.vendor?.latitude;
  const vendorLng = order.vendor?.longitude;
  const customerLat = order.deliveryLatitude;
  const customerLng = order.deliveryLongitude;
  const riderId = order.rider?._id ?? order.rider?.user?._id;

  // Fetch road route once map is ready and coordinates are available
  useEffect(() => {
    if (!isLoaded) return;
    if (!vendorLat || !vendorLng || !customerLat || !customerLng) return;

    const service = new window.google.maps.DirectionsService();
    service.route(
      {
        origin: { lat: Number(vendorLat), lng: Number(vendorLng) },
        destination: { lat: Number(customerLat), lng: Number(customerLng) },
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          setDirections(result);
        } else {
          setRouteError("Could not load route — check coordinates.");
        }
      },
    );
  }, [isLoaded, vendorLat, vendorLng, customerLat, customerLng]);

  // Subscribe to live rider location updates via mobile backend Socket.io
  useEffect(() => {
    if (!riderId) return;
    const mobileUrl = process.env.NEXT_PUBLIC_MOBILE_BACKEND_URL;
    if (!mobileUrl) return;

    const socket = io(mobileUrl, { transports: ["websocket"], reconnectionAttempts: 3 });
    socketRef.current = socket;

    socket.on("rider-moved", (data: { riderId: string; lat: number; lng: number }) => {
      if (String(data.riderId) === String(riderId)) {
        setRiderPos({ lat: data.lat, lng: data.lng });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [riderId]);

  const defaultCenter = vendorLat && vendorLng
    ? { lat: Number(vendorLat), lng: Number(vendorLng) }
    : { lat: 6.5244, lng: 3.3792 }; // Lagos fallback

  if (loadError) {
    return (
      <div className="space-y-4">
        <AddressCards order={order} />
        <div className="flex items-center justify-center h-[320px] bg-muted/30 rounded-2xl border border-border text-sm text-muted-foreground">
          Map failed to load — check your Google Maps API key.
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="space-y-4">
        <AddressCards order={order} />
        <div className="animate-pulse h-[320px] sm:h-[400px] bg-muted/30 rounded-2xl border border-border" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AddressCards order={order} />

      <div className="relative w-full h-[320px] sm:h-[400px] rounded-2xl overflow-hidden shadow-lg border border-border">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={defaultCenter}
          zoom={13}
          options={{
            disableDefaultUI: false,
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: true,
          }}
        >
          {directions ? (
            <DirectionsRenderer
              directions={directions}
              options={{
                suppressMarkers: false,
                polylineOptions: { strokeColor: "#1a3f1c", strokeWeight: 5, strokeOpacity: 0.8 },
              }}
            />
          ) : (
            <>
              {vendorLat && vendorLng && (
                <Marker
                  position={{ lat: Number(vendorLat), lng: Number(vendorLng) }}
                  icon={VENDOR_ICON}
                  title="Vendor / Pickup"
                />
              )}
              {customerLat && customerLng && (
                <Marker
                  position={{ lat: Number(customerLat), lng: Number(customerLng) }}
                  icon={CUSTOMER_ICON}
                  title="Customer / Drop-off"
                />
              )}
            </>
          )}

          {riderPos && (
            <Marker
              position={riderPos}
              icon={RIDER_ICON}
              title="Rider (live)"
            />
          )}
        </GoogleMap>

        {/* Live indicator */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 shadow border border-white/50 z-10">
          <span className={`w-2 h-2 rounded-full ${riderPos ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
          <span className="text-[10px] font-black uppercase tracking-widest text-[#1a3f1c]">
            {riderPos ? "Live Tracking" : riderId ? "Waiting for rider" : "No rider assigned"}
          </span>
        </div>

        {routeError && (
          <div className="absolute bottom-3 left-3 bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs px-3 py-1.5 rounded-lg shadow z-10">
            {routeError}
          </div>
        )}
      </div>
    </div>
  );
}

function AddressCards({ order }: { order: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="p-4 bg-muted/50 rounded-xl border border-border shadow-sm">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-[#1a3f1c]/50 mb-1">Pickup From</h3>
        <p className="font-bold text-[#1a3f1c] text-sm leading-snug">{order.vendor?.address || "—"}</p>
      </div>
      <div className="p-4 bg-secondary rounded-xl border border-primary/10 shadow-sm">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-primary/60 mb-1">Deliver To</h3>
        <p className="font-bold text-primary text-sm leading-snug">
          {order.deliveryAddress || order.customer?.address || "—"}
        </p>
      </div>
    </div>
  );
}
