import { Product } from "@/lib/products";
import { ProductCard } from "./ProductCard";

type ProductGridProps = { products: Product[]; onSelect: (product: Product) => void };

export function ProductGrid({ products, onSelect }: ProductGridProps) {
  return <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 lg:gap-x-5 lg:gap-y-10">{products.map((product, index) => <ProductCard key={product.id} product={product} index={index} onSelect={onSelect} />)}</div>;
}
