"use client";

import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { useUIStore } from "@/lib/ui-store";
import { Button } from "@/components/ui/Button";
import { formatCurrency, cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export function CartDrawer() {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const { isCartOpen, closeCart } = useUIStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300",
          isCartOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-out flex flex-col",
          isCartOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
            Tu Carrito
            <span className="text-sm font-normal text-gray-500 ml-1">
              ({items.length} items)
            </span>
          </h2>
          <Button variant="ghost" size="icon" onClick={closeCart}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 text-gray-500">
              <ShoppingBag className="w-16 h-16 opacity-20" />
              <p>Tu carrito está vacío.</p>
              <Button variant="outline" onClick={closeCart}>
                Explorar Productos
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100 animate-fade-in">
                <div className="relative w-20 h-20 bg-white rounded-lg overflow-hidden shrink-0 border border-gray-200">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-sm line-clamp-1">{item.name}</h3>
                    <p className="text-xs text-gray-500">{item.weight}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="font-bold text-emerald-700">
                      {formatCurrency(item.price * item.quantity)}
                    </div>

                    {/* Qty Control & Delete */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar producto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-0.5 shadow-sm">
                        <button
                          className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-600"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                        <button
                          className="p-1 hover:bg-gray-100 rounded-md transition-colors text-emerald-600"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t bg-gray-50 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-bold">{formatCurrency(getTotal())}</span>
              </div>
              <div className="flex justify-between text-sm text-emerald-600">
                <span>Envío</span>
                <span className="text-xs font-medium bg-emerald-100 px-2 py-0.5 rounded-full">
                  Calculado al pagar
                </span>
              </div>
            </div>
            <Link href="/checkout" onClick={closeCart} className="block w-full">
              <Button className="w-full h-12 text-lg font-bold bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200">
                Pagar {formatCurrency(getTotal())}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
