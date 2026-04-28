import type { Product } from "@/lib/types";
import { ProductCard } from "./product-card";

interface ProductGridProps {
  products: Product[];
  dictionary: any;
}

export function ProductGrid({ products, dictionary }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center py-20 text-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{dictionary.grid_no_products_title}</h2>
          <p className="mt-2 text-muted-foreground">
            {dictionary.grid_no_products_description}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          className="animate-fade-in-up"
          style={{ animationDelay: `${index * 50}ms`, opacity: 0 }}
        />
      ))}
    </div>
  );
}
