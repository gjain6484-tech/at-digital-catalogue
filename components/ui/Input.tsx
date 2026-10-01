import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

type FieldProps = {
  label: string;
  hint?: string;
  id: string;
};

export function Input({ label, hint, id, className = "", ...props }: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-muted">{label}</span>
      <input id={id} className={`min-h-12 w-full rounded-md border border-line bg-paper px-3.5 py-2.5 text-[15px] text-ink outline-none transition placeholder:text-[#9c9a92] focus:border-accent ${className}`} {...props} />
      {hint && <span className="mt-2 block text-xs leading-5 text-muted">{hint}</span>}
    </label>
  );
}

export function Textarea({ label, hint, id, className = "", ...props }: FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-muted">{label}</span>
      <textarea id={id} className={`w-full resize-y rounded-md border border-line bg-paper px-3.5 py-3 text-[15px] leading-6 text-ink outline-none transition placeholder:text-[#9c9a92] focus:border-accent ${className}`} {...props} />
      {hint && <span className="mt-2 block text-xs leading-5 text-muted">{hint}</span>}
    </label>
  );
}
