import { Product, formatPrice } from "@/lib/products";

const WHATSAPP_NUMBER = "918849868611";

export function getWhatsAppUrl(product: Product) {
  const details = [
    "Hello Aarti Trading, I am interested in this product:",
    "",
    `Product: ${product.name}`,
    product.category ? `Category: ${product.category}` : null,
    formatPrice(product.price) ? `Price: ${formatPrice(product.price)}` : null,
    "",
    "Please share availability and further details.",
  ].filter((line): line is string => line !== null);

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(details.join("\n"))}`;
}
