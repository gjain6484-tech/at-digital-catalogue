'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import { CatalogueHeader } from "@/components/catalogue/CatalogueHeader";
import { CategoryFilter } from "@/components/catalogue/CategoryFilter";
import { ProductDetail } from "@/components/catalogue/ProductDetail";
import { ProductGrid } from "@/components/catalogue/ProductGrid";
import { SearchBar } from "@/components/catalogue/SearchBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { Product } from "@/lib/products";
import { createClient } from "@/lib/supabase-browser";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const load = async () => {
      const { data, error: loadError } = await createClient().from("products").select("id,name,description,category,price,image_url,is_published").eq("is_published", true).order("created_at", { ascending: false });
      if (loadError) setError("The catalogue could not be loaded. Please try again shortly.");
      setProducts((data ?? []) as Product[]);
      setLoading(false);
    };
    load();
  }, []);

  const categories = useMemo(() => ["All", ...Array.from(new Set(products.map((product) => product.category).filter(Boolean) as string[])).sort()], [products]);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return products.filter((product) => {
      const searchable = [product.name, product.description ?? "", product.category ?? ""].join(" ").toLowerCase();
      return (!normalizedQuery || searchable.includes(normalizedQuery)) && (category === "All" || product.category === category);
    });
  }, [category, products, query]);

  const focusSearch = () => {
    document.getElementById("collection")?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => searchRef.current?.focus(), 350);
  };

  return (
    <main id="top" className="min-h-screen overflow-hidden bg-canvas">
      <CatalogueHeader onSearchClick={focusSearch} />
      <section id="collection" className="scroll-mt-4 bg-paper">
        <div className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div><p className="text-[10px] font-medium uppercase tracking-[0.16em] text-accent">The collection</p><h2 className="mt-3 font-display text-4xl tracking-[-0.035em] text-ink sm:text-5xl">Browse all products</h2></div>
            <p className="font-mono text-xs uppercase tracking-[0.1em] text-muted">{filtered.length.toString().padStart(2, "0")} pieces</p>
          </div>
          <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(320px,0.8fr)_1.2fr] lg:items-end"><SearchBar value={query} onChange={setQuery} inputRef={searchRef} /><CategoryFilter categories={categories} selected={category} onChange={setCategory} /></div>
          <div className="mt-14 sm:mt-20">
            {loading ? <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5" aria-label="Loading catalogue">{[0, 1, 2, 3, 4].map((item) => <div key={item} className="animate-pulse"><div className="aspect-[4/5] rounded-lg bg-bone" /><div className="mt-4 h-4 w-2/3 bg-bone" /></div>)}</div> : error ? <EmptyState title="Catalogue unavailable" description={error} /> : filtered.length === 0 ? <EmptyState title="No products found" description="Try a different search term or choose another category." /> : <ProductGrid products={filtered} onSelect={setSelectedProduct} />}
          </div>
        </div>
      </section>
      <footer className="border-t border-line bg-canvas"><div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-5 py-8 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12"><p>Aarti Trading</p><p>Product availability may change.</p></div></footer>
      <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </main>
  );
}
