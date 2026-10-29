import { CSSProperties } from "react";
import { Product, formatPrice } from "@/lib/products";
import { WhatsAppButton } from "./WhatsAppButton";

type ProductCardProps = { product: Product; index: number; onSelect: (product: Product) => void };

export function ProductCard({ product, index, onSelect }: ProductCardProps) {
  const price = formatPrice(product.price);
  return (
    <article className="reveal group flex min-w-0 flex-col overflow-hidden rounded-[18px] border border-line bg-paper transition duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-[0_18px_42px_rgba(242,99,58,0.14)]" style={{ animationDelay: `${Math.min(index, 8) * 70}ms` } as CSSProperties}>
      <button type="button" onClick={() => onSelect(product)} className="w-full text-left" aria-label={`View details for ${product.name}`}>
        <div className="relative aspect-square overflow-hidden border-b border-line bg-bone">
          {product.image_url ? <img src={product.image_url} alt={product.name} className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.015]" /> : <div className="editorial-grid flex h-full items-end p-5 text-xs uppercase tracking-[0.14em] text-muted">Image forthcoming</div>}
          <span className="absolute bottom-2 right-2 hidden min-h-8 items-center rounded-full border border-white/70 bg-[#13251f]/90 px-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-white opacity-0 transition group-hover:opacity-100 sm:flex" aria-hidden="true">View details</span>
        </div>
        <div className="px-3 pb-3 pt-3 sm:px-4 sm:pt-4">
          <div className="min-w-0">
            <p className="truncate text-[9px] font-bold uppercase tracking-[0.1em] text-accent sm:text-[10px]">{product.category || "Uncategorised"}</p>
            <h2 className="mt-1.5 min-h-[2.3em] font-display text-base leading-[1.15] tracking-[-0.02em] text-ink sm:text-xl">{product.name}</h2>
            {product.description && <p className="mt-2 line-clamp-2 text-[11px] leading-4 text-muted sm:text-xs sm:leading-5">{product.description}</p>}
          </div>
        </div>
      </button>
      <div className="mt-auto flex flex-col gap-2 border-t border-line px-3 py-3 sm:px-4">
        <p className="truncate text-xs font-bold tracking-[-0.01em] text-ink">{price || "Price on request"}</p>
        <WhatsAppButton product={product} />
      </div>
    </article>
  );
}
