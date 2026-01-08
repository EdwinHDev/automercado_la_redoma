"use client";

import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { STORE_LOCATION } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Navigation } from "lucide-react";

// Fix Leaflet's default icon issue
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
}

// Controller component that handles logic (Events, Geolocation, Marker Request)
function MapDataController({ onLocationSelect }: LocationPickerProps) {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const map = useMap();

  const onLocationSelectRef = useRef(onLocationSelect);
  useEffect(() => { onLocationSelectRef.current = onLocationSelect; }, [onLocationSelect]);

  // 1. Auto-Locate on Mount - RUNS ONCE
  useEffect(() => {
    map.locate().on("locationfound", function (e) {
      setPosition(e.latlng);
      if (onLocationSelectRef.current) onLocationSelectRef.current(e.latlng.lat, e.latlng.lng);
      map.flyTo(e.latlng, 15);
    }).on("locationerror", function (e) {
      console.log("Geolocation denied or unavailable");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  // 2. Handle map clicks/taps
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      if (onLocationSelectRef.current) onLocationSelectRef.current(e.latlng.lat, e.latlng.lng);
    },
    locationfound(e) {
      setPosition(e.latlng);
      if (onLocationSelectRef.current) onLocationSelectRef.current(e.latlng.lat, e.latlng.lng);
      map.flyTo(e.latlng, 15);
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={icon}>
      <Popup>Entregar aquí</Popup>
    </Marker>
  );
}

function LocateControl() {
  const map = useMap();
  const [loading, setLoading] = useState(false);
  const controlRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (controlRef.current) {
      L.DomEvent.disableClickPropagation(controlRef.current);
      L.DomEvent.disableScrollPropagation(controlRef.current);
    }
  }, []);

  const handleLocate = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    map.locate();
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="leaflet-bottom leaflet-right">
      <div
        ref={controlRef}
        className="leaflet-control m-4"
      >
        <Button
          size="icon"
          className="bg-white text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 w-12 h-12 rounded-full shadow-xl border-0 ring-1 ring-gray-200"
          onClick={handleLocate}
          title="Usar mi ubicación"
          type="button"
        >
          <Navigation className={`w-6 h-6 ${loading ? 'animate-pulse' : ''}`} />
        </Button>
      </div>
    </div>
  );
}

export default function MapPicker({ onLocationSelect }: LocationPickerProps) {
  return (
    <MapContainer
      center={[STORE_LOCATION.lat, STORE_LOCATION.lng]}
      zoom={13}
      style={{ height: "100%", width: "100%", zIndex: 1 }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapDataController onLocationSelect={onLocationSelect} />
      <LocateControl />
    </MapContainer>
  );
}
