export type Product = {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  price: number | null;
  image_url: string | null;
  is_published: boolean;
};

export type ProductFormValues = {
  name: string;
  description: string;
  category: string;
  price: string;
  image_url: string;
  is_published: boolean;
};

export const emptyProductForm: ProductFormValues = {
  name: "",
  description: "",
  category: "",
  price: "",
  image_url: "",
  is_published: true,
};

export function formatPrice(price: number | null) {
  if (price === null) return null;
  return `₹${Number(price).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}
