import { CategoryFilter } from "@/components/shop/CategoryFilter";
import { ProductCard } from "@/components/shop/ProductCard";
import { products, categories } from "@/lib/data";
import { Button } from "@/components/ui/Button";

export default async function Home(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const categorySlug = searchParams?.category;

  const activeCategory = categorySlug
    ? categories.find(c => c.slug === categorySlug)
    : null;

  const filteredProducts = activeCategory
    ? products.filter((p) => p.category === activeCategory.name)
    : products;

  return (
    <div className="min-h-screen pb-12">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-emerald-900 to-emerald-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/bg.webp')] bg-cover bg-center opacity-30" />
        <div className="container relative mx-auto px-4 py-20 md:py-32 flex flex-col items-center text-center">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-emerald-100 uppercase bg-emerald-800/50 rounded-full backdrop-blur-sm border border-emerald-400/30">
            Directo del campo
          </span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 drop-shadow-lg">
            Frescura en tu Mesa
          </h1>
          <p className="text-lg md:text-xl text-emerald-100 max-w-2xl mx-auto mb-8 font-light">
            La mejor selección de productos locales, con entrega inmediata
            y la calidad que tu familia merece.
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="sticky top-16 z-40 bg-white/80 backdrop-blur border-b shadow-sm">
        <CategoryFilter />
      </div>

      {/* Product Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            {activeCategory ? activeCategory.name : "Todos los Productos"}
          </h2>
          <span className="text-sm text-gray-500">
            {filteredProducts.length} resultados
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 lg:gap-8">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Sin resultados</h3>
              <p className="text-gray-500">Intenta con otra categoría.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
