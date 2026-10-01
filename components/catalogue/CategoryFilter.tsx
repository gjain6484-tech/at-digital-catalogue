type CategoryFilterProps = { categories: string[]; selected: string; onChange: (category: string) => void };

export function CategoryFilter({ categories, selected, onChange }: CategoryFilterProps) {
  return (
    <div className="scrollbar-none -mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
      <div className="flex min-w-max border-b border-line" role="list" aria-label="Product categories">
        {categories.map((category) => {
          const active = selected === category;
          return <button key={category} type="button" aria-pressed={active} onClick={() => onChange(category)} className={`relative min-h-12 px-4 text-sm transition first:pl-0 ${active ? "font-medium text-accent" : "text-muted hover:text-ink"}`}>{category}{active && <span className="absolute inset-x-4 bottom-[-1px] h-0.5 bg-accent first:left-0" />}</button>;
        })}
      </div>
    </div>
  );
}
