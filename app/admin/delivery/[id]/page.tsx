"use client";

// Force dynamic since we're using params and potential search params in a real app, 
// though for this client component with mock data it matters less.
export const dynamic = "force-dynamic";

import { use, useState } from "react";
import dynamicImport from "next/dynamic";
import Link from "next/link";
import { ArrowLeft, Phone, Navigation, MapPin, CheckCircle, AlertTriangle, Ban, CircleAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { STORE_LOCATION } from "@/lib/utils";

// Mock Data for the demo (normally fetched by ID)
const MOCK_DELIVERY_DATA = {
  id: "#ORD-001",
  customer: {
    name: "Edwin Hernández",
    phone: "04249121031",
    address: "Urb. Coviaguard, Casa 47, Calle Aragua",
    details: "Detras del liceo.",
    location: { lat: 7.9915646729875345, lng: -62.38174344051456 } // Mock location slightly offset from store
  },
  items: 8,
  total: 45.50
};

// Lazy load Map to avoid SSR issues
const DeliveryMap = dynamicImport(() => import("@/components/delivery/DeliveryMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-100 animate-pulse flex items-center justify-center">Cargando Mapa...</div>
});

export default function DeliveryPage({ params }: { params: Promise<{ id: string }> }) {
  // In Next.js 15+, params is a Promise. Since this is a Client Component, we can use React.use() to unwrap it.
  const resolvedParams = use(params);
  const [complete, setComplete] = useState(false);

  // Use resolvedParams.id if needed for fetching, for demo we use MOCK
  const order = MOCK_DELIVERY_DATA;

  const handleOpenMaps = (app: 'google' | 'waze') => {
    const { lat, lng } = order.customer.location;
    if (app === 'google') {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
    } else {
      window.open(`https://waze.com/ul?ll=${lat},${lng}&navigate=yes`, '_blank');
    }
  };

  if (complete) {
    return (
      <div className="min-h-screen bg-emerald-600 flex flex-col items-center justify-center text-white p-6 text-center space-y-6 animate-fade-in">
        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-4xl font-bold">¡Entrega Exitosa!</h1>
        <p className="text-emerald-100 text-lg">Has completado el pedido {order.id}</p>
        <Link href="/admin/dashboard" className="w-full max-w-xs">
          <Button className="w-full bg-white text-emerald-900 override:hover:bg-emerald-50 h-14 rounded-full font-bold text-lg shadow-lg">
            Volver al Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Map Section - Takes available space */}
      <div className="flex-1 relative z-0">
        <Link href="/admin/dashboard" className="absolute top-4 left-4 z-[500]">
          <Button size="icon" className="bg-white/90 text-gray-800 shadow-md hover:bg-white rounded-full h-12 w-12">
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </Link>
        <DeliveryMap
          storePos={STORE_LOCATION}
          customerPos={order.customer.location}
        />
      </div>

      {/* Info Card - Fixed at bottom */}
      <div className="bg-white rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)] p-6 z-10 animate-slide-up">
        {/* Drag Handle */}
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />

        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{order.customer.name}</h2>
              <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded text-sm">
                Pedido {order.id}
              </span>
            </div>
            <a href={`tel:${order.customer.phone}`}>
              <Button size="icon" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-full w-12 h-12">
                <Phone className="w-6 h-6" />
              </Button>
            </a>
          </div>

          {/* Address */}
          <div className="flex gap-3">
            <MapPin className="w-6 h-6 text-gray-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-gray-900 font-medium leading-snug">{order.customer.address}</p>
              <p className="text-gray-500 text-sm mt-1 italic">"{order.customer.details}"</p>
            </div>
          </div>

          {/* Actions Grid */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-12 rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50 font-medium"
            >
              <CircleAlert className="w-4 h-4 mr-2" /> Reportar un problema
            </Button>
            <Button
              variant="outline"
              className="h-12 rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50 font-medium"
            >
              <Ban className="w-4 h-4 mr-2" /> No entregado
            </Button>
          </div>

          {/* Main Action */}
          <Button
            className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-lg font-bold shadow-lg shadow-emerald-200"
            onClick={() => setComplete(true)}
          >
            Marcar como Entregado
          </Button>
        </div>
      </div>
    </div>
  );
}
