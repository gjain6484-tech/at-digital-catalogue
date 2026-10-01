'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

type Product = { id: string; name: string; description: string | null; category: string | null; price: number | null; image_url: string | null; is_published: boolean };

const emptyForm = { name: "", description: "", category: "", price: "", image_url: "", is_published: true };

export default function AdminPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const load = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return router.replace("/admin/login");
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setProducts((data ?? []) as Product[]);
  };

  useEffect(() => { load(); }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    const payload = { name: form.name.trim(), description: form.description || null, category: form.category || null, price: form.price ? Number(form.price) : null, image_url: form.image_url || null, is_published: form.is_published };
    const result = editingId ? await supabase.from("products").update(payload).eq("id", editingId) : await supabase.from("products").insert(payload);
    if (result.error) return setMessage(result.error.message);
    setForm(emptyForm); setEditingId(null); setMessage("Saved."); load();
  };

  const edit = (p: Product) => setForm({ name: p.name, description: p.description ?? "", category: p.category ?? "", price: p.price?.toString() ?? "", image_url: p.image_url ?? "", is_published: p.is_published });
  const remove = async (id: string) => { if (!confirm("Delete this product?")) return; const supabase = createClient(); await supabase.from("products").delete().eq("id", id); load(); };

  return (
    <main className="mx-auto max-w-6xl p-4">
      <div className="flex items-center justify-between py-6">
        <div><p className="text-sm font-semibold uppercase tracking-wide text-slate-500">AT Digital Catalogue</p><h1 className="text-3xl font-bold">Admin</h1></div>
        <button className="rounded-lg border px-4 py-2" onClick={async () => { await createClient().auth.signOut(); router.replace("/admin/login"); }}>Sign out</button>
      </div>
      <form onSubmit={save} className="grid gap-3 rounded-2xl border bg-white p-5 md:grid-cols-2">
        <input required className="rounded-lg border px-3 py-2" placeholder="Product name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
        <input className="rounded-lg border px-3 py-2" placeholder="Category" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}/>
        <input className="rounded-lg border px-3 py-2" placeholder="Price" type="number" min="0" value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/>
        <input className="rounded-lg border px-3 py-2" placeholder="Image URL" value={form.image_url} onChange={e=>setForm({...form,image_url:e.target.value})}/>
        <textarea className="rounded-lg border px-3 py-2 md:col-span-2" placeholder="Description" rows={3} value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_published} onChange={e=>setForm({...form,is_published:e.target.checked})}/> Published</label>
        <div className="flex gap-2 md:justify-end"><button className="rounded-lg bg-slate-900 px-5 py-2 text-white" type="submit">{editingId ? "Update" : "Add"} product</button>{editingId && <button type="button" className="rounded-lg border px-5 py-2" onClick={()=>{setEditingId(null);setForm(emptyForm)}}>Cancel</button>}</div>
        {message && <p className="text-sm text-slate-600 md:col-span-2">{message}</p>}
      </form>
      <div className="mt-6 overflow-hidden rounded-2xl border bg-white">
        <div className="border-b px-5 py-4 font-semibold">Products</div>
        {products.map(p => <div key={p.id} className="flex flex-col gap-2 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between"><div><div className="font-medium">{p.name}</div><div className="text-sm text-slate-500">{p.category || "Uncategorised"} · {p.is_published ? "Published" : "Draft"}</div></div><div className="flex gap-2"><button className="rounded-lg border px-3 py-1.5" onClick={()=>{setEditingId(p.id);edit(p)}}>Edit</button><button className="rounded-lg border px-3 py-1.5" onClick={()=>remove(p.id)}>Delete</button></div></div>)}
      </div>
    </main>
  );
}
