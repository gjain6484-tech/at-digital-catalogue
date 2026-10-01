'use client';

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

type Product = {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  price: number | null;
  image_url: string | null;
  is_published: boolean;
};

type ProductForm = {
  name: string;
  description: string;
  category: string;
  price: string;
  image_url: string;
  is_published: boolean;
};

const emptyForm: ProductForm = {
  name: "",
  description: "",
  category: "",
  price: "",
  image_url: "",
  is_published: true,
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const BUCKET = "product-images";

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
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/admin/login");
      return;
    }

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage(error.message);
    } else {
      setProducts((data ?? []) as Product[]);
    }

    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setMessage("Please select an image file.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setMessage("Image must be 5 MB or smaller.");
      event.target.value = "";
      return;
    }

    setMessage("");
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const uploadImage = async (file: File) => {
    const supabase = createClient();
    const filePath = `${crypto.randomUUID()}.${getExtension(file)}`;

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, file, {
        cacheControl: "3600",
        contentType: file.type,
        upsert: false,
      });

    if (error) throw new Error(`Image upload failed: ${error.message}`);

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath);

    return { filePath, publicUrl: data.publicUrl };
  };

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setMessage("Product name is required.");
      return;
    }

    setSaving(true);
    setMessage("");

    const supabase = createClient();
    let uploadedPath: string | null = null;

    try {
      let imageUrl = form.image_url || null;

      if (selectedFile) {
        const uploaded = await uploadImage(selectedFile);
        uploadedPath = uploaded.filePath;
        imageUrl = uploaded.publicUrl;
      }

      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || null,
        category: form.category.trim() || null,
        price: form.price ? Number(form.price) : null,
        image_url: imageUrl,
        is_published: form.is_published,
      };

      if (payload.price !== null && (!Number.isFinite(payload.price) || payload.price < 0)) {
        throw new Error("Enter a valid non-negative price.");
      }

      const result = editingId
        ? await supabase.from("products").update(payload).eq("id", editingId)
        : await supabase.from("products").insert(payload);

      if (result.error) {
        throw new Error(result.error.message);
      }

      const oldProduct = editingId ? products.find((product) => product.id === editingId) : null;
      const oldStoragePath = oldProduct ? getStoragePath(oldProduct.image_url) : null;

      if (uploadedPath && oldStoragePath && oldStoragePath !== uploadedPath) {
        await supabase.storage.from(BUCKET).remove([oldStoragePath]);
      }

      setMessage(editingId ? "Product updated successfully." : "Product added successfully.");
      resetForm();
      await load();
    } catch (error) {
      if (uploadedPath) {
        await supabase.storage.from(BUCKET).remove([uploadedPath]);
      }

      setMessage(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const edit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description ?? "",
      category: product.category ?? "",
      price: product.price?.toString() ?? "",
      image_url: product.image_url ?? "",
      is_published: product.is_published,
    });
    setSelectedFile(null);
    setPreviewUrl(null);
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (product: Product) => {
    if (!confirm(`Delete "${product.name}"?`)) return;

    const supabase = createClient();
    setMessage("");

    const { error } = await supabase.from("products").delete().eq("id", product.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    const storagePath = getStoragePath(product.image_url);
    if (storagePath) {
      await supabase.storage.from(BUCKET).remove([storagePath]);
    }

    if (editingId === product.id) {
      resetForm();
    }

    setMessage("Product deleted.");
    await load();
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl p-4 sm:p-6">
        <div className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">AT Digital Catalogue</p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900">Admin</h1>
            <p className="mt-1 text-sm text-slate-500">Manage products and catalogue images.</p>
          </div>
          <button
            className="rounded-lg border bg-white px-4 py-2 text-sm font-medium"
            onClick={async () => {
              await createClient().auth.signOut();
              router.replace("/admin/login");
            }}
          >
            Sign out
          </button>
        </div>

        <form onSubmit={save} className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">{editingId ? "Edit product" : "Add product"}</h2>
            <p className="text-sm text-slate-500">Upload a product image directly from your device.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              required
              className="rounded-lg border px-3 py-2.5"
              placeholder="Product name"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
            />

            <input
              className="rounded-lg border px-3 py-2.5"
              placeholder="Category"
              value={form.category}
              onChange={(event) => setForm({ ...form, category: event.target.value })}
            />

            <input
              className="rounded-lg border px-3 py-2.5"
              placeholder="Price"
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={(event) => setForm({ ...form, price: event.target.value })}
            />

            <label className="rounded-lg border border-dashed bg-slate-50 p-4">
              <span className="block text-sm font-medium text-slate-700">Product image</span>
              <span className="mt-1 block text-xs text-slate-500">PNG, JPG, WEBP up to 5 MB</span>
              <input
                className="mt-3 block w-full text-sm"
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={handleFileChange}
              />
            </label>

            <textarea
              className="rounded-lg border px-3 py-2.5 md:col-span-2"
              placeholder="Description"
              rows={4}
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
            />

            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.is_published}
                  onChange={(event) => setForm({ ...form, is_published: event.target.checked })}
                />
                Published and visible in the public catalogue
              </label>
            </div>

            {(previewUrl || form.image_url) && (
              <div className="overflow-hidden rounded-xl border bg-slate-100 md:col-span-2">
                <div className="border-b bg-white px-4 py-2 text-sm font-medium">Image preview</div>
                <div className="flex min-h-48 items-center justify-center p-4">
                  <img
                    src={previewUrl ?? form.image_url ?? ""}
                    alt="Product preview"
                    className="max-h-64 max-w-full rounded-lg object-contain"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2 md:col-span-2">
              <button
                disabled={saving}
                className="rounded-lg bg-slate-900 px-5 py-2.5 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                type="submit"
              >
                {saving ? "Saving..." : editingId ? "Update product" : "Add product"}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="rounded-lg border px-5 py-2.5 font-medium"
                  onClick={resetForm}
                  disabled={saving}
                >
                  Cancel
                </button>
              )}
            </div>

            {message && <p className="text-sm text-slate-600 md:col-span-2">{message}</p>}
          </div>
        </form>

        <section className="mt-6 overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="border-b px-5 py-4 font-semibold">Products</div>

          {loading ? (
            <p className="px-5 py-8 text-sm text-slate-500">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="px-5 py-8 text-sm text-slate-500">No products yet.</p>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="flex flex-col gap-4 border-b px-5 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 overflow-hidden rounded-lg bg-slate-100">
                    {product.image_url ? (
                      <img src={product.image_url} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-slate-400">No image</div>
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">{product.name}</div>
                    <div className="text-sm text-slate-500">
                      {product.category || "Uncategorised"} · {product.is_published ? "Published" : "Draft"}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="rounded-lg border px-3 py-1.5 text-sm" onClick={() => edit(product)}>
                    Edit
                  </button>
                  <button className="rounded-lg border px-3 py-1.5 text-sm" onClick={() => remove(product)}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
