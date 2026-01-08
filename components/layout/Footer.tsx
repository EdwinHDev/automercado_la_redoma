import Link from "next/link";
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-emerald-950 text-emerald-50">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold tracking-tight text-white">
              La Redoma
            </h3>
            <p className="text-emerald-200/80 text-sm leading-relaxed max-w-xs">
              Tu mercado de confianza, ofreciendo los productos más frescos del campo directamente a tu hogar con la mejor atención.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-white">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-sm text-emerald-200/80">
              <li><Link href="/" className="hover:text-white transition-colors">Inicio</Link></li>
              <li><Link href="/?category=frutas-verduras" className="hover:text-white transition-colors">Frutas y Verduras</Link></li>
              <li><Link href="/checkout" className="hover:text-white transition-colors">Mi Carrito</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Términos y Condiciones</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-white">Contáctanos</h4>
            <ul className="space-y-3 text-sm text-emerald-200/80">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Caracas, Venezuela<br />Av. Principal La Redoma</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>+58 412 123 4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>contacto@laredoma.com</span>
              </li>
            </ul>
          </div>

          {/* Socials */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-white">Síguenos</h4>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-emerald-900/50 rounded-full hover:bg-emerald-800 transition-colors text-white">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-emerald-900/50 rounded-full hover:bg-emerald-800 transition-colors text-white">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-emerald-900/50 rounded-full hover:bg-emerald-800 transition-colors text-white">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-emerald-900 mt-12 pt-8 text-center text-xs text-emerald-400/60">
          © {new Date().getFullYear()} Automercado La Redoma. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
