import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Automercado La Redoma",
  description: "Tu mercado de confianza, directo a tu casa.",
};

import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/shop/CartDrawer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={outfit.variable}>
        <Navbar />
        <CartDrawer />
        <main className="min-h-screen bg-slate-50/50">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
