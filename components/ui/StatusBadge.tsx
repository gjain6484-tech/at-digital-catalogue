type StatusBadgeProps = {
  published: boolean;
};

export function StatusBadge({ published }: StatusBadgeProps) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] ${published ? "bg-[#edf3ec] text-[#346538]" : "bg-[#fbf3db] text-[#7a5d17]"}`}>
      {published ? "Published" : "Draft"}
    </span>
  );
}
