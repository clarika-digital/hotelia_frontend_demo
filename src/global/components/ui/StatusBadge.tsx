import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "neutral" | "gold" | "green" | "red" | "amber";

const TONES: Record<Tone, string> = {
  neutral: "bg-gray-100 text-gray-600",
  gold: "bg-brand-gold/10 text-brand-gold",
  green: "bg-emerald-50 text-emerald-700",
  red: "bg-red-50 text-red-600",
  amber: "bg-amber-50 text-amber-700",
};

interface StatusBadgeProps {
  tone?: Tone;
  children: ReactNode;
}

export function StatusBadge({ tone = "neutral", children }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        TONES[tone]
      )}
    >
      {children}
    </span>
  );
}