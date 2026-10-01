import Link from "next/link";

type CatalogueHeaderProps = { onSearchClick: () => void };

export function CatalogueHeader({ onSearchClick }: CatalogueHeaderProps) {
  return (
    <header className="border-b border-line bg-canvas">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 sm:h-20 sm:px-8 lg:px-12">
        <a href="#top" className="font-display text-xl tracking-[-0.03em] text-ink sm:text-2xl">Aarti <span className="italic text-accent">Trading</span></a>
        <nav aria-label="Primary navigation" className="flex items-center gap-1 sm:gap-5">
          <a href="#collection" className="hidden min-h-11 items-center px-2 text-sm text-muted transition hover:text-accent sm:inline-flex">Collection</a>
          <button onClick={onSearchClick} className="min-h-11 px-2 text-sm text-muted transition hover:text-accent" type="button">Search</button>
          <Link href="/admin/login" className="inline-flex min-h-11 items-center px-2 text-sm text-muted transition hover:text-accent">Admin</Link>
        </nav>
      </div>
    </header>
  );
}
