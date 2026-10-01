import { Product, formatPrice } from "@/lib/products";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";

type ProductListItemProps = { product: Product; deleting: boolean; onEdit: (product: Product) => void; onDelete: (product: Product) => void };

export function ProductListItem({ product, deleting, onEdit, onDelete }: ProductListItemProps) {
  return (
    <article className="grid gap-5 border-t border-line py-5 sm:grid-cols-[88px_minmax(0,1fr)_auto] sm:items-center">
      <div className="h-24 w-full overflow-hidden rounded-md border border-line bg-bone sm:h-[88px] sm:w-[88px]">{product.image_url ? <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" /> : <div className="editorial-grid h-full" />}</div>
      <div className="min-w-0"><div className="flex flex-wrap items-center gap-3"><h3 className="truncate font-display text-2xl tracking-[-0.025em] text-ink">{product.name}</h3><StatusBadge published={product.is_published} /></div><div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted"><span>{product.category || "Uncategorised"}</span>{formatPrice(product.price) && <span className="font-mono text-ink">{formatPrice(product.price)}</span>}</div></div>
      <div className="flex gap-2 sm:justify-end"><Button variant="secondary" onClick={() => onEdit(product)} className="flex-1 sm:flex-none">Edit</Button><Button variant="quiet" onClick={() => onDelete(product)} disabled={deleting} className="flex-1 text-[#8a3c39] hover:text-[#6f2d2b] sm:flex-none">{deleting ? "Deleting…" : "Delete"}</Button></div>
    </article>
  );
}
