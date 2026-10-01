import { Product, formatPrice } from "@/lib/products";
import { Modal } from "@/components/ui/Modal";

type ProductDetailProps = { product: Product | null; onClose: () => void };

export function ProductDetail({ product, onClose }: ProductDetailProps) {
  return (
    <Modal open={Boolean(product)} onClose={onClose} title={product?.name ?? "Product details"} className="max-w-5xl">
      {product && <div className="relative grid lg:grid-cols-[1.15fr_0.85fr]">
        <button type="button" onClick={onClose} className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-md border border-line bg-paper text-xl text-ink transition hover:bg-bone" aria-label="Close product details">×</button>
        <div className="aspect-square min-h-0 overflow-hidden bg-bone lg:aspect-auto lg:min-h-[620px]">{product.image_url ? <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" /> : <div className="editorial-grid flex h-full items-end p-8 text-xs uppercase tracking-[0.14em] text-muted">Image forthcoming</div>}</div>
        <div className="flex flex-col p-6 sm:p-10 lg:p-12">
          <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted">{product.category || "Uncategorised"}</p>
          <h2 className="mt-5 max-w-md font-display text-4xl leading-[1.02] tracking-[-0.035em] text-ink sm:text-5xl">{product.name}</h2>
          {product.description && <p className="mt-7 text-[15px] leading-7 text-muted">{product.description}</p>}
          {formatPrice(product.price) && <p className="mt-10 border-t border-line pt-6 font-mono text-xl tracking-[-0.025em] text-ink lg:mt-auto">{formatPrice(product.price)}</p>}
        </div>
      </div>}
    </Modal>
  );
}
