import { Product, formatPrice } from "@/lib/products";
import { Modal } from "@/components/ui/Modal";
import { WhatsAppButton } from "./WhatsAppButton";

type ProductDetailProps = { product: Product | null; onClose: () => void };

export function ProductDetail({ product, onClose }: ProductDetailProps) {
  return (
    <Modal open={Boolean(product)} onClose={onClose} title={product?.name ?? "Product details"} className="max-w-4xl">
      {product && <div className="relative grid lg:grid-cols-[0.9fr_1.1fr]">
        <button type="button" onClick={onClose} className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-line bg-paper text-xl text-ink transition hover:border-accent hover:text-accent" aria-label="Close product details">×</button>
        <div className="aspect-[4/3] min-h-0 overflow-hidden bg-bone lg:aspect-auto lg:min-h-[500px]">{product.image_url ? <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" /> : <div className="editorial-grid flex h-full items-end p-8 text-xs uppercase tracking-[0.14em] text-muted">Image forthcoming</div>}</div>
        <div className="flex flex-col p-6 sm:p-10 lg:p-12">
          <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-accent">{product.category || "Uncategorised"}</p>
          <h2 className="mt-5 max-w-md font-display text-4xl leading-[1.02] tracking-[-0.035em] text-ink sm:text-5xl">{product.name}</h2>
          {product.description && <p className="mt-7 text-[15px] leading-7 text-muted">{product.description}</p>}
          <div className="mt-10 border-t border-line pt-6 lg:mt-auto">
            <p className="text-xl font-bold tracking-[-0.025em] text-ink">{formatPrice(product.price) || "Price on request"}</p>
            <div className="mt-6"><WhatsAppButton product={product} variant="detail" /></div>
            <p className="mt-3 text-xs leading-5 text-muted">WhatsApp opens with this product already added to your message.</p>
          </div>
        </div>
      </div>}
    </Modal>
  );
}
