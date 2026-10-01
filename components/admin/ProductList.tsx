import { Product } from "@/lib/products";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProductListItem } from "./ProductListItem";

type ProductListProps = { products: Product[]; loading: boolean; deletingId: string | null; onEdit: (product: Product) => void; onDelete: (product: Product) => void; onAdd: () => void };

export function ProductList({ products, loading, deletingId, onEdit, onDelete, onAdd }: ProductListProps) {
  return (
    <section className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
      <div className="flex items-end justify-between gap-5"><div><p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted">Catalogue entries</p><h2 className="mt-3 font-display text-4xl tracking-[-0.035em] text-ink">Product index</h2></div><p className="hidden font-mono text-xs uppercase tracking-[0.1em] text-muted sm:block">{products.length.toString().padStart(2, "0")} total</p></div>
      <div className="mt-10">{loading ? <div className="space-y-3" aria-label="Loading products">{[0, 1, 2].map((item) => <div key={item} className="h-28 animate-pulse border-t border-line bg-[#f3f1ec]" />)}</div> : products.length === 0 ? <EmptyState title="No products yet." description="Create the first entry to begin building the public catalogue." action={<Button onClick={onAdd}>Add your first product</Button>} /> : products.map((product) => <ProductListItem key={product.id} product={product} deleting={deletingId === product.id} onEdit={onEdit} onDelete={onDelete} />)}</div>
    </section>
  );
}
