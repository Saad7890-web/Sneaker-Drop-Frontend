import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function Input({ label, error, className = "", ...props }: Props) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-slate-200">{label}</span>
      <input
        className={`w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-blue-500 ${className}`}
        {...props}
      />
      {error ? <p className="text-sm text-rose-400">{error}</p> : null}
    </label>
  );
}
