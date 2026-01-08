"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { useCartStore } from "@/lib/store";
import { calculateDistance, formatCurrency, STORE_LOCATION } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/Card";
import Link from "next/link";
import { ArrowLeft, MapPin, CheckCircle2, Truck, CreditCard, User } from "lucide-react";

// Dynamically import MapPicker
const MapPicker = dynamic(() => import("@/components/checkout/MapPicker"), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-gray-100 animate-pulse flex items-center justify-center rounded-xl">Cargando Mapa...</div>
});

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCartStore();
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [addressDetails, setAddressDetails] = useState("");
  const [manualAddress, setManualAddress] = useState("");
  const [refNumber, setRefNumber] = useState("");
  const [form, setForm] = useState({ name: "", phone: "" });
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Stabilize the handler to prevent map re-renders
  const handleLocationSelect = (lat: number, lng: number) => {
    setCoords({ lat, lng });
  };

  const subtotal = getTotal();

  const shippingCost = useMemo(() => {
    if (subtotal >= 10) return 0;
    if (!coords) return 0;

    // Distance calculation
    const dist = calculateDistance(
      STORE_LOCATION.lat,
      STORE_LOCATION.lng,
      coords.lat,
      coords.lng
    );

    return Math.max(2, dist * 0.8); // Min $2, $0.80 per km
  }, [subtotal, coords]);

  const total = subtotal + (coords ? shippingCost : 0);

  const handlePlaceOrder = () => {
    if (!form.name || !form.phone || !refNumber || !coords) return;
    setOrderPlaced(true);
    clearCart();
  };

  if (orderPlaced) {
    return (
      <div className="container max-w-lg mx-auto py-24 px-4 text-center space-y-8 animate-fade-in">
        <div className="mx-auto w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">¡Pedido Confirmado!</h1>
          <p className="text-gray-600 text-lg">
            Gracias por tu compra. Hemos verificado tu referencia:
            <span className="font-mono font-bold bg-gray-100 px-2 py-1 rounded ml-2">{refNumber}</span>.
          </p>
          <p className="text-gray-500">
            Te contactaremos al <strong>{form.phone}</strong> en breve para coordinar la entrega.
          </p>
        </div>
        <Link href="/">
          <Button size="lg" className="w-48 mt-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full">
            Volver a la tienda
          </Button>
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container max-w-md mx-auto py-32 px-4 text-center space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">Tu carrito está vacío</h2>
        <p className="text-gray-500">Agrega productos frescos para comenzar.</p>
        <Link href="/">
          <Button size="lg" className="rounded-full bg-emerald-600 hover:bg-emerald-700">Ir a comprar</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Link href="/" className="text-sm font-medium text-gray-600 hover:text-emerald-600 flex items-center transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver a la tienda
          </Link>
          <div className="ml-auto font-bold text-xl text-gray-900">Checkout</div>
        </div>
      </div>

      <div className="container mx-auto py-12 px-4 grid lg:grid-cols-12 gap-12">
        {/* Left Column: Forms */}
        <div className="lg:col-span-7 space-y-8">

          {/* Section 1: Data */}
          <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold shrink-0">1</div>
              <h2 className="text-2xl font-bold text-gray-900">Tus Datos</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 ml-1">Nombre Completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="Ej. Juan Pérez"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="pl-10 h-12 bg-gray-50 border-gray-200 focus:bg-white transition-colors rounded-xl"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 ml-1">Teléfono</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 font-bold text-gray-400 text-sm select-none py-0.5">+58</span>
                  <Input
                    placeholder="412 123 4567"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="pl-12 h-12 bg-gray-50 border-gray-200 focus:bg-white transition-colors rounded-xl"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Delivery */}
          <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold shrink-0">2</div>
              <h2 className="text-2xl font-bold text-gray-900">Entrega</h2>
            </div>

            <div className="space-y-4">
              <p className="text-gray-600 text-sm">
                Selecciona tu ubicación exacta en el mapa para calcular el envío.
              </p>
              <div className="rounded-xl border border-gray-200 overflow-hidden h-[250px] md:h-[300px] relative shadow-inner bg-gray-50">
                <MapPicker onLocationSelect={handleLocationSelect} />
              </div>

              {coords ? (
                <div className="flex items-center text-emerald-600 bg-emerald-50 px-4 py-3 rounded-xl border border-emerald-100 animate-fade-in">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span className="font-medium">Ubicación guardada correctamente.</span>
                </div>
              ) : (
                <div className="flex items-center text-orange-600 bg-orange-50 px-4 py-3 rounded-xl border border-orange-100">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span className="font-medium">Por favor toca el mapa para indicar dónde entregar.</span>
                </div>
              )}

              <div className="mt-4 grid gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 ml-1 mb-2 block">Dirección Detallada (Opcional)</label>
                  <Input
                    placeholder="Av. Principal, Edificio Azul, Piso 2..."
                    value={manualAddress}
                    onChange={e => setManualAddress(e.target.value)}
                    className="h-12 bg-gray-50 border-gray-200 focus:bg-white transition-colors rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 ml-1 mb-2 block">Punto de Referencia</label>
                  <Input
                    placeholder="Ej. Frente a la plaza, rejas negras."
                    value={addressDetails}
                    onChange={e => setAddressDetails(e.target.value)}
                    className="h-12 bg-gray-50 border-gray-200 focus:bg-white transition-colors rounded-xl"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Payment */}
          <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold shrink-0">3</div>
              <h2 className="text-2xl font-bold text-gray-900">Pago</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-4 md:p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-emerald-900 mb-2 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-emerald-600" />
                    Ubicación de Entrega
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Selecciona tu ubicación exacta en el mapa para calcular el envío.
                  </p>
                </div>
                <h2 className="text-xl font-bold text-emerald-900 mb-6 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-emerald-600" />
                  Datos de Pagomovil
                </h2>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Banco</span>
                  <span className="font-medium">Venezuela (0102)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Teléfono</span>
                  <span className="font-medium font-mono">0414-1234567</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">C.I.</span>
                  <span className="font-medium">V-12.345.678</span>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Realiza el pago móvil y escribe los últimos 4 dígitos de la referencia.
                </p>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 ml-1">Referencia</label>
                  <Input
                    placeholder="Ej. 1234"
                    value={refNumber}
                    onChange={e => setRefNumber(e.target.value)}
                    className="h-12 bg-gray-50 border-gray-200 focus:bg-white transition-colors rounded-xl font-mono tracking-widest text-center text-lg"
                    maxLength={8}
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="lg:sticky lg:top-24 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Resumen del Pedido</h3>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map(item => (
                  <div key={item.id} className="flex gap-4 py-2">
                    <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                      <img src={item.image} alt="" className="object-cover w-full h-full" />
                      <div className="absolute top-0 right-0 bg-gray-900 text-white text-xs px-1.5 py-0.5 rounded-bl-lg font-bold">
                        x{item.quantity}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.weight}</div>
                    </div>
                    <div className="text-sm font-bold text-gray-900">
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-gray-200 my-6"></div>

              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                  <span className="flex items-center gap-2">
                    <Truck className="w-4 h-4" /> Envío
                  </span>
                  <span className="font-medium">
                    {subtotal >= 10
                      ? <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded text-xs">GRATIS</span>
                      : (!coords ? <span className="text-xs text-orange-500">Selecciona ubicación</span> : formatCurrency(shippingCost))
                    }
                  </span>
                </div>
                <div className="flex justify-between text-2xl font-bold text-gray-900 pt-4 border-t">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              <Button
                className="w-full h-14 mt-8 text-lg font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200 disabled:opacity-50 disabled:shadow-none"
                disabled={!form.name || !form.phone || !refNumber || !coords}
                onClick={handlePlaceOrder}
              >
                Confirmar Compra
              </Button>

              {!coords && (
                <p className="text-xs text-center text-orange-500 mt-3 font-medium">
                  Falta seleccionar ubicación de entrega
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
