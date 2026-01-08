"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { categories } from "@/lib/data";

export function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");

  const handleCategoryChange = (slug: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (slug) {
      params.set("category", slug);
    } else {
      params.delete("category");
    }
    router.replace(`/?${params.toString()}`);
  };

  return (
    <div className="w-full bg-white/50 backdrop-blur-sm sticky top-0 md:relative z-30 py-4">
      <div className="container mx-auto px-4">
        <div className="flex w-full overflow-x-auto gap-3 pb-2 no-scrollbar mask-gradient-right">
          <button
            onClick={() => handleCategoryChange(null)}
            className={cn(
              "px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm whitespace-nowrap active:scale-95",
              !currentCategory
                ? "bg-emerald-600 text-white shadow-emerald-200"
                : "bg-white text-gray-600 border border-gray-200 hover:border-emerald-200 hover:text-emerald-700 hover:bg-emerald-50"
            )}
          >
            Todas
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.slug)}
              className={cn(
                "px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm whitespace-nowrap active:scale-95",
                currentCategory === category.slug
                  ? "bg-emerald-600 text-white shadow-emerald-200"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-emerald-200 hover:text-emerald-700 hover:bg-emerald-50"
              )}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
