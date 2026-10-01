import { RefObject } from "react";

type SearchBarProps = { value: string; onChange: (value: string) => void; inputRef?: RefObject<HTMLInputElement | null> };

export function SearchBar({ value, onChange, inputRef }: SearchBarProps) {
  return (
    <label className="group flex min-h-14 w-full items-center border-b border-ink sm:max-w-xl">
      <svg aria-hidden="true" viewBox="0 0 24 24" className="mr-3 h-5 w-5 shrink-0 fill-none stroke-current text-muted" strokeWidth="1.8"><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></svg>
      <span className="sr-only">Search by product name, description, or category</span>
      <input ref={inputRef} type="search" value={value} onChange={(event) => onChange(event.target.value)} placeholder="Search the collection" className="h-14 min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-[#9b9891] focus-visible:outline-none" />
      {value && <button type="button" onClick={() => onChange("")} className="min-h-11 px-2 text-xs uppercase tracking-[0.1em] text-muted hover:text-ink">Clear</button>}
    </label>
  );
}
