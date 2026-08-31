import type { ReactNode } from "react";
import { Icon, type IconName } from "@/global/components/ui/Icon";
import { cn } from "@/lib/cn";
import type { RevenueBucket } from "@/domains/oversight/types";

export const DAY_MS = 86_400_000;

export const ROLE_COLORS = [
  "#223047",
  "#876a20",
  "#b4935a",
  "#64748b",
  "#334155",
  "#94a3b8",
  "#d9bd82",
  "#1e293b",
];

export const STATUS_DONUT: {
  label: string;
  field: "pending" | "confirmed" | "inHouse" | "completed" | "cancelled";
  color: string;
}[] = [
  { label: "Pending", field: "pending", color: "#d97706" },
  { label: "Confirmed", field: "confirmed", color: "#876a20" },
  { label: "In-house", field: "inHouse", color: "#15803d" },
  { label: "Completed", field: "completed", color: "#64748b" },
  { label: "Cancelled", field: "cancelled", color: "#dc2626" },
];

export function Bar({ value, total }: { value: number; total: number }) {
  const width = total > 0 ? Math.round((Math.min(value, total) / total) * 100) : 0;
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
      <div
        className={cn("h-full rounded-full", width === 0 ? "bg-gray-200" : "bg-brand-navy")}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

export function TrendBars({ buckets }: { buckets: RevenueBucket[] }) {
  const max = Math.max(...buckets.map((b) => b.amount), 1);
  return (
    <div className="flex h-28 items-end justify-between gap-3">
      {buckets.map((b) => (
        <div key={b.label} className="flex flex-1 flex-col items-center gap-1.5">
          <span className="text-[10px] font-semibold text-brand-navy">
            {Math.round((b.amount / max) * 100)}%
          </span>
          <div
            className="w-full rounded-t-md bg-brand-gold/80"
            style={{ height: `${Math.max(Math.round((b.amount / max) * 100), 4)}%` }}
          />
          <span className="text-[10px] text-gray-400">{b.label}</span>
        </div>
      ))}
    </div>
  );
}

export function Donut({
  data,
  size = 132,
  thickness = 18,
}: {
  data: { label: string; value: number; color: string }[];
  size?: number;
  thickness?: number;
}) {
  const total = data.reduce((a, d) => a + d.value, 0);
  if (total <= 0) {
    return <p className="py-4 text-center text-xs text-gray-400">No data yet</p>;
  }
  let acc = 0;
  const stops = data.map((d) => {
    const from = (acc / total) * 100;
    acc += d.value;
    const to = (acc / total) * 100;
    return `${d.color} ${from.toFixed(2)}% ${to.toFixed(2)}%`;
  });
  return (
    <div className="flex items-center gap-5">
      <div
        className="relative flex-none rounded-full"
        style={{ width: size, height: size, background: `conic-gradient(${stops.join(", ")})` }}
      >
        <div className="absolute inset-0 grid place-items-center">
          <div
            className="grid place-items-center rounded-full bg-white text-center shadow-inner"
            style={{ width: size - thickness * 2, height: size - thickness * 2 }}
          />
        </div>
      </div>
      <div className="space-y-1.5">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-2 text-xs">
            <span className="h-2.5 w-2.5 flex-none rounded-sm" style={{ background: d.color }} />
            <span className="text-gray-600">{d.label}</span>
            <span className="ml-auto font-semibold text-brand-navy">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-white px-3 py-2.5">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-0.5 text-lg font-semibold text-brand-navy">{value}</p>
    </div>
  );
}

export function SectionFilter({ children }: { children: ReactNode }) {
  return (
    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
      {children}
    </div>
  );
}

export function SectionDivider({ label = "More" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 pt-1">
      <span className="h-px flex-1 bg-gray-200" />
      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
        {label}
      </span>
      <span className="h-px flex-1 bg-gray-200" />
    </div>
  );
}

export function Section({
  id,
  icon,
  eyebrow,
  title,
  kpi,
  open,
  onToggle,
  children,
}: {
  id: string;
  icon: IconName;
  eyebrow: string;
  title: string;
  kpi: string;
  open: boolean;
  onToggle: (id: string) => void;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <button
        type="button"
        onClick={() => onToggle(id)}
        aria-expanded={open}
        className="flex w-full items-center gap-4 px-4 py-3.5 text-left transition-colors hover:bg-surface-muted/60"
      >
        <span className="grid h-9 w-9 flex-none place-items-center rounded-lg bg-brand-gold/10 text-brand-gold">
          <Icon name={icon} className="h-4 w-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-gold">
            {eyebrow}
          </span>
          <span className="block text-sm font-semibold text-brand-navy">{title}</span>
        </span>
        <span className="flex-none text-right">
          <span className="block font-display text-lg font-semibold text-brand-navy">{kpi}</span>
        </span>
        <Icon
          name="chevron-down"
          className={cn("h-4 w-4 flex-none text-gray-400 transition-transform duration-200", open && "rotate-180")}
        />
      </button>
      {open && <div className="border-t border-gray-100 px-4 py-4">{children}</div>}
    </div>
  );
}

export function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50/60 p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">{title}</p>
      {children}
    </div>
  );
}
