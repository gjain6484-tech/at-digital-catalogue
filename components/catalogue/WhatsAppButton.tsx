import { Product } from "@/lib/products";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { WhatsappLogo } from "@phosphor-icons/react";

type WhatsAppButtonProps = {
  product: Product;
  variant?: "compact" | "detail";
};

export function WhatsAppButton({ product, variant = "compact" }: WhatsAppButtonProps) {
  const compact = variant === "compact";

  return (
    <a
      href={getWhatsAppUrl(product)}
      target="_blank"
      rel="noreferrer"
      aria-label={`Ask about ${product.name} on WhatsApp`}
      className={compact
        ? "inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full border border-[#25d366] bg-[#ecfff4] px-3 text-xs font-semibold text-[#075e54] transition hover:bg-[#dff9e9] active:scale-[0.98]"
        : "inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-full border border-[#25d366] bg-[#ecfff4] px-5 text-sm font-semibold text-[#075e54] transition hover:bg-[#dff9e9] active:scale-[0.98]"
      }
    >
      <WhatsappLogo size={19} weight="fill" aria-hidden="true" className="text-[#25d366]" />
      {compact ? "WhatsApp" : "Ask about this product"}
    </a>
  );
}
