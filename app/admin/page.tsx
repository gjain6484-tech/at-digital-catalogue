'use client';

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProductForm } from "@/components/admin/ProductForm";
import { ProductList } from "@/components/admin/ProductList";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Product, ProductFormValues, emptyProductForm } from "@/lib/products";
import { createClient } from "@/lib/supabase-browser";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const BUCKET = "product-images";

type Notice = { text: string; tone: "success" | "error" };
type BusyState = "idle" | "uploading" | "saving";

function getExtension(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase();
  return extension && /^[a-z0-9]+$/.test(extension) ? extension : "jpg";
}

function getStoragePath(imageUrl: string | null) {
  if (!imageUrl) return null;
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const index = imageUrl.indexOf(marker);
  return index >= 0 ? decodeURIComponent(imageUrl.slice(index + marker.length)) : null;
}

export default function AdminPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductFormValues>(emptyProductForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [busyState, setBusyState] = useState<BusyState>("idle");
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.replace("/admin/login");
      return;
    }
    const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (error) setNotice({ text: error.message, tone: "error" });
    else setProducts((data ?? []) as Product[]);
    setLoading(false);
  }, [router]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyProductForm);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleFile = (file: File | null) => {
    if (!file) return;
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setNotice({ text: "Choose a JPG, PNG, WEBP, or GIF image.", tone: "error" });
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setNotice({ text: "Image must be 5 MB or smaller.", tone: "error" });
      return;
    }
    setNotice(null);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setForm((current) => ({ ...current, image_url: "" }));
  };

  const uploadImage = async (file: File) => {
    const supabase = createClient();
    const filePath = `${crypto.randomUUID()}.${getExtension(file)}`;
    const { error } = await supabase.storage.from(BUCKET).upload(filePath, file, { cacheControl: "3600", contentType: file.type, upsert: false });
    if (error) throw new Error(`Image upload failed: ${error.message}`);
    return { filePath, publicUrl: supabase.storage.from(BUCKET).getPublicUrl(filePath).data.publicUrl };
  };

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim()) {
      setNotice({ text: "Product name is required.", tone: "error" });
      return;
    }

    setNotice(null);
    setBusyState(selectedFile ? "uploading" : "saving");
    const supabase = createClient();
    let uploadedPath: string | null = null;

    try {
      let imageUrl = form.image_url || null;
      if (selectedFile) {
        const uploaded = await uploadImage(selectedFile);
        uploadedPath = uploaded.filePath;
        imageUrl = uploaded.publicUrl;
        setBusyState("saving");
      }

      const price = form.price ? Number(form.price) : null;
      if (price !== null && (!Number.isFinite(price) || price < 0)) throw new Error("Enter a valid non-negative price.");

      const payload = { name: form.name.trim(), description: form.description.trim() || null, category: form.category.trim() || null, price, image_url: imageUrl, is_published: form.is_published };
      const result = editingId ? await supabase.from("products").update(payload).eq("id", editingId) : await supabase.from("products").insert(payload);
      if (result.error) throw new Error(result.error.message);

      const oldProduct = editingId ? products.find((product) => product.id === editingId) : null;
      const oldStoragePath = getStoragePath(oldProduct?.image_url ?? null);
      if (oldStoragePath && oldProduct?.image_url !== imageUrl) await supabase.storage.from(BUCKET).remove([oldStoragePath]);

      setNotice({ text: editingId ? "Product updated." : "Product added to the catalogue.", tone: "success" });
      resetForm();
      await load();
    } catch (error) {
      if (uploadedPath) await supabase.storage.from(BUCKET).remove([uploadedPath]);
      setNotice({ text: error instanceof Error ? error.message : "Something went wrong.", tone: "error" });
    } finally {
      setBusyState("idle");
    }
  };

  const edit = (product: Product) => {
    setEditingId(product.id);
    setForm({ name: product.name, description: product.description ?? "", category: product.category ?? "", price: product.price?.toString() ?? "", image_url: product.image_url ?? "", is_published: product.is_published });
    setSelectedFile(null);
    setPreviewUrl(null);
    setNotice(null);
    document.getElementById("product-editor")?.scrollIntoView({ behavior: "smooth" });
  };

  const remove = async () => {
    if (!deleteTarget) return;
    const product = deleteTarget;
    setDeletingId(product.id);
    setDeleteTarget(null);
    setNotice(null);
    const supabase = createClient();
    const { error } = await supabase.from("products").delete().eq("id", product.id);
    if (error) {
      setNotice({ text: error.message, tone: "error" });
      setDeletingId(null);
      return;
    }
    const storagePath = getStoragePath(product.image_url);
    if (storagePath) await supabase.storage.from(BUCKET).remove([storagePath]);
    if (editingId === product.id) resetForm();
    setNotice({ text: `“${product.name}” was deleted.`, tone: "success" });
    await load();
    setDeletingId(null);
  };

  const signOut = async () => {
    setSigningOut(true);
    await createClient().auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  };

  const scrollToForm = () => document.getElementById("product-editor")?.scrollIntoView({ behavior: "smooth" });

  return (
    <main className="min-h-screen bg-canvas">
      <AdminHeader productCount={products.length} onSignOut={signOut} signingOut={signingOut} />
      <ProductForm values={form} editing={Boolean(editingId)} selectedFile={selectedFile} previewUrl={previewUrl} busyState={busyState} notice={notice} onChange={setForm} onFile={handleFile} onRemoveImage={removeImage} onSubmit={save} onCancel={resetForm} />
      <ProductList products={products} loading={loading} deletingId={deletingId} onEdit={edit} onDelete={setDeleteTarget} onAdd={scrollToForm} />
      <Modal open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} title="Confirm product deletion" className="max-w-md">
        <div className="p-6 sm:p-8"><p className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted">Permanent action</p><h2 className="mt-3 font-display text-3xl tracking-[-0.03em] text-ink">Delete this product?</h2><p className="mt-4 text-sm leading-6 text-muted">“{deleteTarget?.name}” and its stored image will be removed. This cannot be undone.</p><div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><Button variant="secondary" onClick={() => setDeleteTarget(null)}>Keep product</Button><Button variant="danger" onClick={remove}>Delete product</Button></div></div>
      </Modal>
    </main>
  );
}
