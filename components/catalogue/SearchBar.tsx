import { RefObject } from "react";
import { MagnifyingGlass, X } from "@phosphor-icons/react";

type SearchBarProps = { value: string; onChange: (value: string) => void; inputRef?: RefObject<HTMLInputElement | null> };

export function SearchBar({ value, onChange, inputRef }: SearchBarProps) {
  return (
    <label className="group flex min-h-14 w-full items-center rounded-2xl border border-line bg-canvas px-4 transition focus-within:bg-accent-soft sm:max-w-xl">
      <MagnifyingGlass size={20} weight="bold" aria-hidden="true" className="mr-3 shrink-0 text-accent" />
      <span className="sr-only">Search by product name, description, or category</span>
      <input ref={inputRef} type="search" value={value} onChange={(event) => onChange(event.target.value)} placeholder="Search products, categories, descriptions" className="h-14 min-w-0 flex-1 bg-transparent text-sm font-medium text-ink outline-none placeholder:font-normal placeholder:text-muted focus-visible:outline-none" />
      {value && <button type="button" onClick={() => onChange("")} className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:bg-paper hover:text-ink" aria-label="Clear search"><X size={16} weight="bold" /></button>}
    </label>
  );
}
