'use client';

import { FormEvent } from "react";
import { ProductFormValues } from "@/lib/products";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { ImageUploader } from "./ImageUploader";

type ProductFormProps = {
  values: ProductFormValues;
  editing: boolean;
  selectedFile: File | null;
  previewUrl: string | null;
  busyState: "idle" | "uploading" | "saving";
  notice: { text: string; tone: "success" | "error" } | null;
  onChange: (values: ProductFormValues) => void;
  onFile: (file: File | null) => void;
  onRemoveImage: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
};

export function ProductForm({ values, editing, selectedFile, previewUrl, busyState, notice, onChange, onFile, onRemoveImage, onSubmit, onCancel }: ProductFormProps) {
  const busy = busyState !== "idle";
  const submitText = busyState === "uploading" ? "Uploading image…" : busyState === "saving" ? "Saving product…" : editing ? "Update product" : "Add product";
  return (
    <section id="product-editor" className="scroll-mt-6 border-b border-line">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.38fr_0.62fr] lg:px-10">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted">{editing ? "Editing entry" : "New entry"}</p>
          <h2 className="mt-3 font-display text-4xl tracking-[-0.035em] text-ink">{editing ? "Edit product" : "Add product"}</h2>
          <p className="mt-4 max-w-sm text-sm leading-6 text-muted">Use a clear product name, concise description, and one strong image. Draft entries remain private.</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-8">
          <div className="grid gap-6 sm:grid-cols-2">
            <Input required id="product-name" label="Product name" value={values.name} onChange={(event) => onChange({ ...values, name: event.target.value })} placeholder="e.g. Hand-thrown serving bowl" />
            <Input id="product-category" label="Category" value={values.category} onChange={(event) => onChange({ ...values, category: event.target.value })} placeholder="e.g. Tableware" />
            <Input id="product-price" label="Price" type="number" min="0" step="0.01" inputMode="decimal" value={values.price} onChange={(event) => onChange({ ...values, price: event.target.value })} placeholder="0.00" />
            <label className="block"><span className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-muted">Visibility</span><span className="flex min-h-12 items-center justify-between rounded-md border border-line bg-paper px-3.5"><span className="text-sm text-ink">Published in catalogue</span><input type="checkbox" checked={values.is_published} onChange={(event) => onChange({ ...values, is_published: event.target.checked })} className="h-5 w-5 accent-[#a44f32]" /></span></label>
          </div>
          <Textarea id="product-description" label="Description" rows={5} value={values.description} onChange={(event) => onChange({ ...values, description: event.target.value })} placeholder="Materials, dimensions, finish, or other useful details." />
          <ImageUploader previewUrl={previewUrl} existingUrl={values.image_url} fileName={selectedFile?.name} disabled={busy} uploading={busyState === "uploading"} onFile={onFile} onRemove={onRemoveImage} />
          {notice && <p role="status" className={`rounded-md border px-4 py-3 text-sm ${notice.tone === "error" ? "border-[#e6c8c6] bg-[#fdebec] text-[#8a3c39]" : "border-[#d4dfd2] bg-[#edf3ec] text-[#346538]"}`}>{notice.text}</p>}
          <div className="flex flex-wrap gap-3 border-t border-line pt-6"><Button type="submit" disabled={busy}>{submitText}</Button>{editing && <Button variant="secondary" onClick={onCancel} disabled={busy}>Cancel editing</Button>}</div>
        </form>
      </div>
    </section>
  );
}
