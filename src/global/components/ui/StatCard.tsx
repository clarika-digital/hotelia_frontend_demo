import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface StatCardProps {
  label: string;
  value: ReactNode;
  sub?: string;
  trend?: { label: string; positive: boolean };
  accent?: boolean;
}

export function StatCard({ label, value, sub, trend, accent }: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-gray-200 bg-white p-5 shadow-sm",
        accent && "border-t-[3px] border-t-brand-gold"
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl font-bold text-brand-navy">
        {value}
      </p>
      {trend && (
        <p
          className={cn(
            "mt-1 text-xs font-medium",
            trend.positive ? "text-emerald-600" : "text-red-600"
          )}
        >
          {trend.label}
        </p>
      )}
      {sub && <p className="mt-1 text-xs text-gray-500">{sub}</p>}
    </div>
  );
}