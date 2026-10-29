import Link from "next/link";
import { LockSimple, MagnifyingGlass } from "@phosphor-icons/react";

type CatalogueHeaderProps = { onSearchClick: () => void };

export function CatalogueHeader({ onSearchClick }: CatalogueHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-[#13251f] text-[#fcfffd] shadow-[0_8px_28px_rgba(19,37,31,0.18)]">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 sm:h-20 sm:px-8 lg:px-12">
        <div className="flex items-center gap-4">
          <a href="#top" className="font-display text-xl tracking-[-0.03em] text-white sm:text-2xl">Aarti <span className="text-[#ff9a7c]">Trading</span></a>
          <span className="hidden border-l border-white/20 pl-4 text-[10px] font-semibold uppercase tracking-[0.13em] text-white/55 sm:inline">Digital catalogue</span>
        </div>
        <nav aria-label="Primary navigation" className="flex items-center gap-1 sm:gap-5">
          <a href="#collection" className="hidden min-h-11 items-center px-2 text-sm text-white/65 transition hover:text-white sm:inline-flex">Products</a>
          <button onClick={onSearchClick} className="inline-flex min-h-11 items-center gap-2 px-2 text-sm text-white/65 transition hover:text-white" type="button"><MagnifyingGlass size={17} weight="bold" /> Search</button>
          <Link href="/admin/login" className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/20 px-3 text-sm text-white/75 transition hover:border-white/40 hover:text-white"><LockSimple size={16} weight="bold" /> <span className="hidden sm:inline">Admin</span></Link>
        </nav>
      </div>
    </header>
  );
}
