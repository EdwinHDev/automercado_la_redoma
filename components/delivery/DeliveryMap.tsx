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
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);

  useEffect(() => {
    async function fetchRoute() {
      try {
        setRouteCoords([]); // Reset route on change
        // OSRM Public Demo Server
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${storePos.lng},${storePos.lat};${customerPos.lng},${customerPos.lat}?overview=full&geometries=geojson`
        );
        const data = await response.json();

        if (data.routes && data.routes[0]) {
          // OSRM returns [lng, lat], Leaflet needs [lat, lng]
          const coords = data.routes[0].geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]]);
          setRouteCoords(coords);
        }
      } catch (error) {
        console.error("Error fetching route:", error);
      }
    }

    fetchRoute();
  }, [storePos, customerPos]);

  return (
    <MapContainer
      center={storePos}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={true}
      className="z-0"
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

      {/* Route Line - OSRM or Fallback */}
      <Polyline
        positions={routeCoords.length > 0 ? routeCoords : [storePos, customerPos]}
        color="#059669"
        weight={5}
        opacity={0.8}
        lineCap="round"
        lineJoin="round"
        dashArray={routeCoords.length > 0 ? undefined : "10, 10"}
      />

      <MapFitter bounds={bounds} />
    </MapContainer>
  );
}
