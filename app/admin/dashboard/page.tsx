"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import dynamicImport from "next/dynamic";
import {
  Package,
  Clock,
  CheckCircle,
  MapPin,
  Phone,
  User,
  ChevronRight,
  Search,
  Bell,
  Settings,
  CreditCard,
  ChefHat,
  Bike,
  Menu,
  ArrowLeft,
  X,
  Maximize2
} from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

// Lazy load Maps
const ClientLocationMap = dynamicImport(() => import("@/components/admin/ClientLocationMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-emerald-50 animate-pulse flex items-center justify-center text-emerald-800 text-xs font-bold">Cargando Mapa...</div>
});

// Mock Data
const MOCK_ORDERS = [
  {
    id: "#ORD-001",
    customer: "Maria Rodríguez",
    phone: "0414-555-0012",
    status: "pending",
    time: "Hace 5 min",
    total: 45.50,
    items: [
      { name: "Harina de Maíz", qty: 4, price: 1.10 },
      { name: "Queso Blanco Duro", qty: 1, price: 6.00 },
      { name: "Cartón de Huevos", qty: 1, price: 5.50 },
      { name: "Carne Molida", qty: 2, price: 5.50 },
    ],
    address: "Urb. Los Mangos, Casa 22-A, Calle Principal",
    details: "Tocar timbre gris.",
    location: { lat: 7.9915646729875345, lng: -62.38174344051456 },
    paymentRef: "00123456",
  },
  {
    id: "#ORD-002",
    customer: "Carlos Pérez",
    phone: "0412-123-9988",
    status: "processing",
    time: "Hace 25 min",
    total: 12.80,
    items: [
      { name: "Pepitos", qty: 2, price: 1.80 },
      { name: "Coca-Cola", qty: 1, price: 2.00 },
      { name: "Doritos", qty: 1, price: 2.00 },
      { name: "Chocolate Savoy", qty: 2, price: 2.60 },
    ],
    address: "Av. Bolívar, Edificio Centro, Piso 4, Apto 4B",
    details: "Dejar en recepción.",
    paymentRef: "00567890",
  },
  {
    id: "#ORD-003",
    customer: "Ana García",
    phone: "0424-777-1122",
    status: "completed",
    time: "Hace 1 hora",
    total: 8.50,
    items: [
      { name: "Jamón de Pierna", qty: 0.5, price: 8.50 },
      { name: "Pan de Sandwich", qty: 1, price: 4.25 },
    ],
    address: "Barrio Sucre, Calle 5",
    details: "Casa azul rejas blancas.",
    paymentRef: "00901234",
  },
];

export default function AdminDashboard() {
  const [selectedOrder, setSelectedOrder] = useState<typeof MOCK_ORDERS[0] | null>(MOCK_ORDERS[0]);
  const [activeTab, setActiveTab] = useState("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDetailsMobile, setShowDetailsMobile] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);

  useEffect(() => {
    // Ensure correct initial state on mount
    if (window.innerWidth < 768) {
      setSelectedOrder(null); // Deselect on mobile to show list
    }
  }, []);

  const handleOrderClick = (order: typeof MOCK_ORDERS[0]) => {
    setSelectedOrder(order);
    setShowDetailsMobile(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-orange-100 text-orange-700 border-orange-200";
      case "processing": return "bg-blue-100 text-blue-700 border-blue-200";
      case "completed": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending": return "Pendiente";
      case "processing": return "En Preparación";
      case "completed": return "Entregado";
      default: return status;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed md:static inset-y-0 left-0 z-50 w-64 bg-emerald-900 text-white flex flex-col shrink-0 transition-transform duration-300 transform md:transform-none md:translate-x-0 shadow-2xl md:shadow-none",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-4 md:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-900/50">
              <span className="font-bold text-xl">R</span>
            </div>
            <span className="font-bold text-xl tracking-tight">Admin</span>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="md:hidden text-emerald-300">
            <ChevronRight className="w-6 h-6 rotate-180" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <NavItem icon={<Package className="w-5 h-5" />} label="Pedidos" active />
          <NavItem icon={<ChefHat className="w-5 h-5" />} label="Productos" />
          <NavItem icon={<User className="w-5 h-5" />} label="Clientes" />
          <NavItem icon={<Settings className="w-5 h-5" />} label="Ajustes" />
        </nav>

        <div className="p-4 border-t border-emerald-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-medium">Edwin H.</p>
              <p className="text-xs text-emerald-300">Gerente</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 shadow-sm z-10 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileMenuOpen(true)} className="md:hidden p-2 -ml-2 text-gray-600">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">Panel de Control</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar pedido..."
                className="pl-9 pr-4 py-2 rounded-full bg-gray-100 border-none text-sm focus:ring-2 focus:ring-emerald-500 w-64"
              />
            </div>
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Order List Column */}
          <div className={cn(
            "w-full md:w-[400px] border-r border-gray-200 bg-white flex flex-col absolute inset-0 md:static transition-transform duration-300 z-10",
            showDetailsMobile ? "-translate-x-full md:translate-x-0" : "translate-x-0"
          )}>
            <div className="p-4 border-b border-gray-100">
              <div className="flex gap-2 w-full overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
                {["all", "pending", "processing"].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                      activeTab === tab
                        ? "bg-emerald-50 text-emerald-700"
                        : "text-gray-500 hover:bg-gray-50"
                    )}
                  >
                    {tab === "all" ? "Todos" : getStatusLabel(tab)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar pb-20 md:pb-2">
              {MOCK_ORDERS.map(order => (
                <div
                  key={order.id}
                  onClick={() => handleOrderClick(order)}
                  className={cn(
                    "p-4 rounded-xl cursor-pointer border transition-all hover:shadow-md active:scale-[0.98]",
                    selectedOrder?.id === order.id
                      ? "bg-emerald-50 border-emerald-200 shadow-sm"
                      : "bg-white border-gray-100 hover:border-gray-200"
                  )}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-gray-900">{order.id}</span>
                    <span className="text-xs text-gray-500 flex items-center">
                      <Clock className="w-3 h-3 mr-1" /> {order.time}
                    </span>
                  </div>
                  <h3 className="font-medium text-gray-800 mb-1">{order.customer}</h3>
                  <div className="flex justify-between items-center mt-3">
                    <span className={cn("text-xs px-2 py-0.5 rounded-full border", getStatusColor(order.status))}>
                      {getStatusLabel(order.status)}
                    </span>
                    <span className="font-bold text-emerald-700">{formatCurrency(order.total)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Details Column */}
          <div className={cn(
            "absolute inset-0 md:static bg-gray-50/50 flex-1 overflow-y-auto transition-transform duration-300 z-20 md:z-auto bg-gray-50",
            showDetailsMobile ? "translate-x-0" : "translate-x-full md:translate-x-0"
          )}>
            {selectedOrder ? (
              <div className="p-4 md:p-8 space-y-6 pb-24 md:pb-8">
                {/* Mobile Back Header */}
                <div className="md:hidden flex items-center gap-2 mb-4">
                  <Button variant="ghost" size="icon" onClick={() => setShowDetailsMobile(false)} className="-ml-2">
                    <ArrowLeft className="w-6 h-6 text-gray-700" />
                  </Button>
                  <span className="font-bold text-gray-900">Volver a la lista</span>
                </div>
                {/* Header Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-2xl font-bold text-gray-900">{selectedOrder.id}</h2>
                      <span className={cn("text-sm px-3 py-1 rounded-full font-bold border", getStatusColor(selectedOrder.status))}>
                        {getStatusLabel(selectedOrder.status)}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm flex items-center">
                      <Clock className="w-4 h-4 mr-2" /> Solicitado {selectedOrder.time}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    {selectedOrder.status === "pending" && (
                      <>
                        <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">Rechazar</Button>
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200">
                          Aceptar Pedido
                        </Button>
                      </>
                    )}
                    {selectedOrder.status === "processing" && (
                      <Link href={`/admin/delivery/${encodeURIComponent(selectedOrder.id)}`}>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 flex items-center">
                          <Bike className="w-4 h-4 mr-2" /> Ver Ruta
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Customer Info */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
                    <h3 className="font-bold text-gray-900 flex items-center">
                      <User className="w-5 h-5 mr-2 text-emerald-600" /> Cliente
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Nombre</p>
                        <p className="text-gray-900 font-medium">{selectedOrder.customer}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Teléfono</p>
                        <div className="flex items-center gap-2">
                          <p className="text-gray-900 font-medium font-mono">{selectedOrder.phone}</p>
                          <Button size="icon" variant="ghost" className="h-6 w-6 text-emerald-600">
                            <Phone className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
                    <h3 className="font-bold text-gray-900 flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-emerald-600" /> Deilvery
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Dirección</p>
                        <p className="text-gray-900 text-sm leading-relaxed">{selectedOrder.address}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Referencia</p>
                        <p className="text-gray-600 text-sm italic">"{selectedOrder.details}"</p>
                      </div>

                      {/* Client Location Map */}
                      <div className="h-32 w-full rounded-xl border border-emerald-100 overflow-hidden relative shadow-sm group">
                        {selectedOrder.location ? (
                          <ClientLocationMap lat={selectedOrder.location.lat} lng={selectedOrder.location.lng} interactive={false} />
                        ) : (
                          <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                            Sin ubicación GPS
                          </div>
                        )}
                        {selectedOrder.location && (
                          <div className="absolute top-2 right-2 z-[400]">
                            <button
                              onClick={() => setShowMapModal(true)}
                              className="bg-white/90 backdrop-blur p-1.5 rounded-lg shadow-sm border border-emerald-100 text-emerald-800 hover:bg-emerald-50 transition-colors"
                              title="Ver pantalla completa"
                            >
                              <Maximize2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Map Modal */}
                      {showMapModal && selectedOrder?.location && (
                        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowMapModal(false)}>
                          <div className="bg-white w-full max-w-4xl h-[80vh] rounded-2xl overflow-hidden shadow-2xl relative flex flex-col" onClick={e => e.stopPropagation()}>
                            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white z-10">
                              <h3 className="font-bold text-gray-900 flex items-center">
                                <MapPin className="w-5 h-5 mr-2 text-emerald-600" /> Ubicación del Cliente
                              </h3>
                            </div>
                            <div className="flex-1 relative bg-gray-100">
                              <ClientLocationMap lat={selectedOrder.location.lat} lng={selectedOrder.location.lng} interactive={true} />
                            </div>
                            <div className="p-4 border-t border-gray-100 bg-gray-50 text-xs text-gray-500 text-center">
                              La ubicación es proporcionada por el cliente y no puede ser modificada.
                            </div>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                </div>

                {/* Items Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-gray-900 flex items-center">
                      <Package className="w-5 h-5 mr-2 text-emerald-600" /> Productos
                    </h3>
                    <span className="text-sm text-gray-500">{selectedOrder.items.length} ítems</span>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center font-bold text-gray-500 text-xs">
                            x{item.qty}
                          </div>
                          <span className="text-gray-900 font-medium">{item.name}</span>
                        </div>
                        <span className="text-gray-900 font-bold">{formatCurrency(item.price * item.qty)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-gray-50 p-6 space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Subtotal</span>
                      <span>{formatCurrency(selectedOrder.total)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Envío</span>
                      <span className="text-emerald-600 font-bold">GRATIS</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-gray-900 pt-4 border-t border-gray-200">
                      <span>Total</span>
                      <span>{formatCurrency(selectedOrder.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Pago Móvil</p>
                      <p className="text-sm text-gray-500">Ref: <span className="font-mono font-bold bg-gray-100 px-1 rounded">{selectedOrder.paymentRef}</span></p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    <CheckCircle className="w-4 h-4" /> Pagado
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 h-full">
                <Package className="w-16 h-16 mb-4 opacity-20" />
                <p>Selecciona un pedido para ver los detalles</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <button className={cn(
      "w-full flex items-center p-3 rounded-xl transition-all duration-200 group",
      active
        ? "bg-emerald-800 text-white shadow-lg shadow-emerald-900/20"
        : "text-emerald-300 hover:bg-emerald-800/50 hover:text-white"
    )}>
      {icon}
      <span className="ml-3 font-medium">{label}</span>
      {active && <ChevronRight className="ml-auto w-4 h-4 opacity-50" />}
    </button>
  );
}
