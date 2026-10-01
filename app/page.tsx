'use client';

import { useEffect, useMemo, useState } from "react";
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

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("products")
        .select("id,name,description,category,price,image_url,is_published")
        .eq("is_published", true)
        .order("created_at", { ascending: false });
      setProducts((data ?? []) as Product[]);
      setLoading(false);
    };
    load();
  }, []);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((p) => p.category).filter(Boolean) as string[]))],
    [products]
  );

  const filtered = products.filter((p) => {
    const matchesQuery = !query || [p.name, p.description ?? "", p.category ?? ""].join(" ").toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === "All" || p.category === category;
    return matchesQuery && matchesCategory;
  });

  return (
    <main className="min-h-screen">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">AT Digital Catalogue</p>
          <h1 className="mt-2 text-3xl font-bold">Our Products</h1>
          <p className="mt-2 text-slate-600">Scan, browse and enquire.</p>
        </div>
      </header>
      <section className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input className="w-full rounded-xl border bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300" placeholder="Search products..." value={query} onChange={(e) => setQuery(e.target.value)} />
          <select className="rounded-xl border bg-white px-4 py-3" value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 pb-10">
        {loading ? <p className="text-slate-500">Loading catalogue...</p> : filtered.length === 0 ? <p className="text-slate-500">No products found.</p> : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <article key={p.id} className="overflow-hidden rounded-2xl border bg-white shadow-sm">
                <div className="aspect-[4/3] bg-slate-100">
                  {p.image_url ? <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-slate-400">No image</div>}
                </div>
                <div className="p-5">
                  {p.category && <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{p.category}</p>}
                  <h2 className="mt-1 text-xl font-semibold">{p.name}</h2>
                  {p.description && <p className="mt-2 text-sm text-slate-600">{p.description}</p>}
                  {p.price !== null && <p className="mt-4 text-lg font-bold">₹{Number(p.price).toLocaleString("en-IN")}</p>}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
