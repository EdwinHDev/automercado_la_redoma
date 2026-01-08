"use client";

import Image from "next/image";
import { Product } from "@/lib/data";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { Plus, Minus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { items, addItem, updateQuantity, removeItem } = useCartStore();

  // Check if item is in cart
  const cartItem = items.find(item => item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateQuantity(product.id, quantity + 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateQuantity(product.id, quantity - 1);
  };

  return (
    <Card className="group relative border-0 bg-transparent shadow-none hover:shadow-none transition-none">
      {/* Image Container */}
      <div className="relative aspect-square w-full rounded-2xl bg-white overflow-hidden mb-3 border border-gray-100 shadow-sm group-hover:shadow-md transition-shadow duration-300">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Quick Add / Qty Control Overlay */}
        <div className={cn(
          "absolute bottom-3 right-3 transition-all duration-300",
          quantity > 0
            ? "opacity-100 translate-y-0"
            : "opacity-100 translate-y-0 md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0"
        )}>
          {quantity === 0 ? (
            <Button
              size="icon"
              className="h-10 w-10 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg"
              onClick={handleAdd}
            >
              <Plus className="h-5 w-5" />
            </Button>
          ) : (
            <div className="flex items-center bg-white rounded-full shadow-lg border border-emerald-100 p-1">
              <button
                onClick={handleDecrement}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-emerald-700 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-bold text-sm w-6 text-center text-gray-900">{quantity}</span>
              <button
                onClick={handleIncrement}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="px-1">
        <div className="flex justify-between items-start gap-2">
          <div>
            <h3 className="font-bold text-gray-900 text-sm md:text-base leading-tight group-hover:text-emerald-700 transition-colors cursor-pointer line-clamp-2">
              {product.name}
            </h3>
            <p className="text-xs md:text-sm text-gray-500 mt-1 font-medium">{product.weight}</p>
          </div>
          <div className="text-base md:text-lg font-bold text-gray-900 bg-emerald-50/50 px-2 py-0.5 rounded-lg shrink-0">
            {formatCurrency(product.price)}
          </div>
        </div>
      </div>
    </Card>
  );
}
