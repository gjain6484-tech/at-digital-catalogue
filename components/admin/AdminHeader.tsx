import Link from "next/link";
import { Button } from "@/components/ui/Button";

type AdminHeaderProps = { productCount: number; onSignOut: () => void; signingOut: boolean };

export function AdminHeader({ productCount, onSignOut, signingOut }: AdminHeaderProps) {
  return (
    <header className="border-b border-line">
      <div className="mx-auto max-w-[1280px] px-5 py-6 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between gap-5">
          <Link href="/" className="font-display text-xl tracking-[-0.03em] text-ink">Aarti <span className="italic">Trading</span></Link>
          <Button variant="quiet" onClick={onSignOut} disabled={signingOut}>{signingOut ? "Signing out…" : "Sign out"}</Button>
        </div>
        <div className="mt-14 grid gap-5 sm:mt-20 sm:grid-cols-[1fr_auto] sm:items-end">
          <div><p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted">Catalogue workspace</p><h1 className="mt-3 font-display text-5xl tracking-[-0.04em] text-ink sm:text-6xl">Products</h1></div>
          <p className="max-w-xs text-sm leading-6 text-muted">{productCount} {productCount === 1 ? "entry" : "entries"} in the catalogue. Add, revise, and control what is visible.</p>
        </div>
      </div>
    </header>
  );
}
