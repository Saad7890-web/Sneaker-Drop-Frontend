import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: Props) {
  return (
    <div
      className={`rounded-2xl border border-slate-800 bg-slate-950/80 shadow-soft backdrop-blur ${className}`}
    >
      {children}
    </div>
  );
}
