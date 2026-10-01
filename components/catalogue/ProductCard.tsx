import { CSSProperties } from "react";
import { Product, formatPrice } from "@/lib/products";

type ProductCardProps = { product: Product; index: number; onSelect: (product: Product) => void };

export function ProductCard({ product, index, onSelect }: ProductCardProps) {
  const price = formatPrice(product.price);
  return (
    <article className="reveal group min-w-0 border-t border-line pt-3 transition-colors hover:border-accent" style={{ animationDelay: `${Math.min(index, 8) * 70}ms` } as CSSProperties}>
      <button type="button" onClick={() => onSelect(product)} className="w-full text-left" aria-label={`View details for ${product.name}`}>
        <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-line bg-bone">
          {product.image_url ? <img src={product.image_url} alt={product.name} className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.015]" /> : <div className="editorial-grid flex h-full items-end p-5 text-xs uppercase tracking-[0.14em] text-muted">Image forthcoming</div>}
          <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-md border border-white bg-accent text-lg text-white opacity-0 transition group-hover:opacity-100" aria-hidden="true">+</span>
        </div>
        <div className="py-3.5">
          <div className="min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-accent">{product.category || "Uncategorised"}</p>
            <h2 className="mt-1.5 font-display text-xl leading-[1.15] tracking-[-0.02em] text-ink">{product.name}</h2>
            {product.description && <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted">{product.description}</p>}
          </div>
          {price && <p className="mt-3 font-mono text-xs font-medium tracking-[-0.02em] text-accent-dark">{price}</p>}
        </div>
      </button>
    </article>
  );
}
