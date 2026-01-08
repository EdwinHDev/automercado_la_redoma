"use client";

import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { STORE_LOCATION } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Navigation, Maximize2, Minimize2, X } from "lucide-react";

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



// ... existing imports ...

// Fullscreen Control Component
function FullscreenControl({ isFullscreen, onToggle }: { isFullscreen: boolean; onToggle: () => void }) {
  const map = useMap();
  const controlRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (controlRef.current) {
      L.DomEvent.disableClickPropagation(controlRef.current);
      L.DomEvent.disableScrollPropagation(controlRef.current);
    }
  }, []);

  // Invalidate size when fullscreen toggles to ensure tiles load correctly
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [isFullscreen, map]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggle();
  };

  return (
    <div className="leaflet-top leaflet-right">
      <div
        ref={controlRef}
        className="leaflet-control m-4"
      >
        <Button
          size="icon"
          className="bg-white text-gray-700 hover:bg-gray-50 w-10 h-10 rounded-lg shadow-xl border-0 ring-1 ring-gray-200"
          onClick={handleToggle}
          title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
          type="button"
        >
          {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
        </Button>
      </div>
    </div>
  );
}

export default function MapPicker({ onLocationSelect }: LocationPickerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Prevent scrolling on body when map is fullscreen
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFullscreen]);

  return (
    <div className={isFullscreen ? "fixed inset-0 z-50 bg-white" : "h-full w-full relative z-0"}>
      {/* Close Button Mobile Overlay (Only visible in fullscreen) */}
      {isFullscreen && (
        <div className="absolute top-4 left-4 z-[1000] md:hidden">
          <Button
            size="icon"
            variant="ghost"
            className="bg-white/90 backdrop-blur shadow-md rounded-full w-10 h-10"
            onClick={() => setIsFullscreen(false)}
          >
            <X className="w-6 h-6 text-gray-700" />
          </Button>
        </div>
      )}

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
        <FullscreenControl isFullscreen={isFullscreen} onToggle={() => setIsFullscreen(!isFullscreen)} />
      </MapContainer>
    </div>
  );
}
