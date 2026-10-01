import { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex min-h-64 flex-col items-start justify-center border-y border-line py-12">
      <span aria-hidden="true" className="mb-7 block h-px w-16 bg-ink" />
      <h3 className="font-display text-3xl tracking-[-0.025em] text-ink">{title}</h3>
      <p className="mt-3 max-w-md text-sm leading-6 text-muted">{description}</p>
      {action && <div className="mt-7">{action}</div>}
    </div>
  );
}
