"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Maximize2, Minimize2, X } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Customer Icon (Green)
const customerIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function MapRecenter({ lat, lng }: { lat: number, lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 15);
  }, [lat, lng, map]);
  return null;
}

function FullscreenControl({ isFullscreen, onToggle }: { isFullscreen: boolean; onToggle: () => void }) {
  const map = useMap();
  const controlRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (controlRef.current) {
      L.DomEvent.disableClickPropagation(controlRef.current);
      L.DomEvent.disableScrollPropagation(controlRef.current);
    }
  }, []);

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
      <div ref={controlRef} className="leaflet-control m-4">
        <button
          className="bg-white text-gray-700 hover:bg-gray-50 w-8 h-8 flex items-center justify-center rounded-lg shadow-xl border border-gray-200 transition-colors"
          onClick={handleToggle}
          title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
          type="button"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

export default function ClientLocationMap({ lat, lng, interactive = true }: { lat: number, lng: number, interactive?: boolean }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const isMapInteractive = interactive || isFullscreen;

  useEffect(() => {
    setMounted(true);
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isFullscreen]);

  const mapContent = (
    <div className={isFullscreen ? "fixed inset-0 z-[9999] bg-white h-screen w-screen" : "h-full w-full relative z-0"}>
      {/* Close Button Mobile Overlay (Only visible in fullscreen) */}
      {isFullscreen && (
        <div className="absolute top-4 left-4 z-[1000] md:hidden">
          <button
            className="bg-white/90 backdrop-blur shadow-md rounded-full w-10 h-10 flex items-center justify-center"
            onClick={() => setIsFullscreen(false)}
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      )}

      <MapContainer
        center={[lat, lng]}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={isMapInteractive}
        dragging={isMapInteractive}
        zoomControl={false} // We rely on custom controls or trackpad/touch
        doubleClickZoom={isMapInteractive}
        touchZoom={isMapInteractive}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]} icon={customerIcon}>
          <Popup>Ubicación del Cliente</Popup>
        </Marker>
        <MapRecenter lat={lat} lng={lng} />
        <FullscreenControl isFullscreen={isFullscreen} onToggle={() => setIsFullscreen(!isFullscreen)} />
      </MapContainer>
    </div>
  );

  if (mounted && isFullscreen) {
    return createPortal(mapContent, document.body);
  }

  return mapContent;
}
