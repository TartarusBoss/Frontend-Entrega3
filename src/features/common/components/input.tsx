import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function Input({ id, label, error, className = "", ...props }: InputProps) {
  const inputId = id ?? props.name;
  return (
    <div className="grid gap-1.5">
      <label className="font-semibold text-slate-800" htmlFor={inputId}>{label}</label>
      <input
        id={inputId}
        className={`w-full rounded-lg border px-3 py-2.5 outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-sky-100 ${error ? "border-red-500" : "border-slate-300"} ${className}`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && <span id={`${inputId}-error`} className="text-sm text-red-700">{error}</span>}
    </div>
  );
}
