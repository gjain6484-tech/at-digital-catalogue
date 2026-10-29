import { Product } from "@/lib/products";
import { ProductCard } from "./ProductCard";

type ProductGridProps = { products: Product[]; onSelect: (product: Product) => void };

export function ProductGrid({ products, onSelect }: ProductGridProps) {
  return <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5 lg:gap-5">{products.map((product, index) => <ProductCard key={product.id} product={product} index={index} onSelect={onSelect} />)}</div>;
}
