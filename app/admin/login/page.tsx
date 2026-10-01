'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createClient } from "@/lib/supabase-browser";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const { error } = await createClient().auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setSubmitting(false);
      return;
    }
    router.replace("/admin");
    router.refresh();
  };

  return (
    <main className="grid min-h-screen bg-canvas lg:grid-cols-[0.9fr_1.1fr]">
      <section className="editorial-grid hidden border-r border-line p-10 lg:flex lg:flex-col lg:justify-between">
        <Link href="/" className="font-display text-2xl tracking-[-0.03em] text-ink">Aarti <span className="italic">Trading</span></Link>
        <div className="max-w-xl pb-8"><p className="text-[10px] font-medium uppercase tracking-[0.17em] text-muted">Private workspace</p><p className="mt-5 font-display text-6xl leading-[0.98] tracking-[-0.045em] text-ink">A quiet place to keep the catalogue current.</p></div>
        <p className="text-xs text-muted">Aarti Trading / Catalogue administration</p>
      </section>
      <section className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <Link href="/" className="font-display text-xl tracking-[-0.03em] text-ink lg:hidden">Aarti <span className="italic">Trading</span></Link>
          <div className="mt-16 lg:mt-0"><p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted">Admin access</p><h1 className="mt-3 font-display text-5xl tracking-[-0.04em] text-ink">Sign in</h1><p className="mt-4 text-sm leading-6 text-muted">Use your catalogue administrator account to continue.</p></div>
          <form onSubmit={submit} className="mt-10 space-y-6">
            <Input required id="email" label="Email address" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
            <Input required id="password" label="Password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" />
            {error && <p role="alert" className="rounded-md border border-[#e6c8c6] bg-[#fdebec] px-4 py-3 text-sm leading-5 text-[#8a3c39]">{error}</p>}
            <Button type="submit" className="w-full" disabled={submitting}>{submitting ? "Signing in…" : "Sign in"}</Button>
          </form>
          <Link href="/" className="mt-8 inline-flex min-h-11 items-center text-sm text-muted transition hover:text-ink">← Return to the catalogue</Link>
        </div>
      </section>
    </main>
  );
}
