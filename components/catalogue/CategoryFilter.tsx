type CategoryFilterProps = { categories: string[]; selected: string; onChange: (category: string) => void };

export function CategoryFilter({ categories, selected, onChange }: CategoryFilterProps) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 text-xs font-bold text-muted">Categories</legend>
      <div className="flex flex-wrap gap-2" aria-label="Product categories">
        {categories.map((category) => {
          const active = selected === category;
          return <button key={category} type="button" aria-pressed={active} onClick={() => onChange(category)} className={`min-h-10 rounded-full border px-3.5 text-sm font-semibold transition active:scale-[0.98] ${active ? "border-accent bg-accent text-white" : "border-line bg-paper text-muted hover:border-accent hover:text-accent"}`}>{category}</button>;
        })}
      </div>
    </fieldset>
  );
}
