"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { useUIStore } from "@/lib/ui-store";
import { Button } from "@/components/ui/Button";
import { formatCurrency, cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function Navbar() {
  const items = useCartStore((state) => state.items);
  const total = useCartStore((state) => state.getTotal());
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const { openCart } = useUIStore();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Hydration fix */
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
            <span className="text-white font-bold text-xl">R</span>
          </div>
          <span className="font-bold text-2xl text-foreground tracking-tight group-hover:text-primary transition-colors">
            La Redoma
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={openCart}
            className={cn(
              "relative group hover:bg-primary/10 transition-all rounded-full h-11 px-4 cursor-pointer",
              (mounted && itemCount > 0) ? "text-primary" : "text-muted-foreground"
            )}
          >
            <ShoppingBag className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
            <span className="font-semibold text-base">
              {mounted ? formatCurrency(total) : formatCurrency(0)}
            </span>
            {mounted && itemCount > 0 && (
              <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-secondary text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white animate-fade-in">
                {itemCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </nav>
  );
}
