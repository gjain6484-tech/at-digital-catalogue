import { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "quiet" | "danger";
};

const variants = {
  primary: "border-accent bg-accent text-white hover:border-accent-dark hover:bg-accent-dark",
  secondary: "border-line bg-paper text-ink hover:bg-bone",
  quiet: "border-transparent bg-transparent text-muted hover:text-ink",
  danger: "border-[#dcc5c3] bg-[#fdebec] text-[#8a3c39] hover:bg-[#f8dddd]",
};

export function Button({ className = "", variant = "primary", type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
