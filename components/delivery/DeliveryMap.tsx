"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Store Icon (Red)
const storeIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Customer Icon (Green)
const customerIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function MapFitter({ bounds }: { bounds: L.LatLngBoundsExpression }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, bounds]);
  return null;
}

interface DeliveryMapProps {
  storePos: { lat: number; lng: number };
  customerPos: { lat: number; lng: number };
}

export default function DeliveryMap({ storePos, customerPos }: DeliveryMapProps) {
  const bounds = L.latLngBounds([storePos, customerPos]);

  return (
    <MapContainer
      center={storePos}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Markers */}
      <Marker position={storePos} icon={storeIcon}>
        <Popup>🏪 La Redoma (Tienda)</Popup>
      </Marker>
      <Marker position={customerPos} icon={customerIcon}>
        <Popup>👤 Cliente</Popup>
      </Marker>

      {/* Visual Line */}
      <Polyline
        positions={[storePos, customerPos]}
        color="#059669"
        weight={4}
        opacity={0.6}
        dashArray="10, 10"
      />

      <MapFitter bounds={bounds} />
    </MapContainer>
  );
}
