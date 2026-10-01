import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

type FieldProps = {
  label: string;
  hint?: string;
  error?: string;
  id: string;
};

export function Input({ label, hint, error, id, className = "", ...props }: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  const descriptionId = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <label htmlFor={id} className="block">
      <span className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-muted">{label}</span>
      <input
        id={id}
        aria-describedby={descriptionId}
        aria-invalid={error ? true : undefined}
        className={`min-h-12 w-full rounded-md border bg-paper px-3.5 py-2.5 text-[15px] text-ink outline-none transition placeholder:text-[#77766f] ${error ? "border-[#b76863] focus:border-[#9b4742]" : "border-line focus:border-accent"} ${className}`}
        {...props}
      />
      {error ? (
        <span id={`${id}-error`} className="mt-2 block text-xs leading-5 text-[#8a3c39]">{error}</span>
      ) : hint ? (
        <span id={`${id}-hint`} className="mt-2 block text-xs leading-5 text-muted">{hint}</span>
      ) : null}
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
