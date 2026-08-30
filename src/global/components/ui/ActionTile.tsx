import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface ActionTileProps {
  label: string;
  href?: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export function ActionTile({ label, href, icon, disabled }: ActionTileProps) {
  const content = (
    <>
      {icon && (
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-gold/10 text-brand-gold">
          {icon}
        </span>
      )}
      <span className="font-semibold text-brand-navy">{label}</span>
      {disabled && (
        <span className="rounded-full bg-surface-muted px-2 py-0.5 text-[11px] font-semibold text-gray-400">
          Coming soon
        </span>
      )}
    </>
  );

  const base = cn(
    "flex flex-col items-start gap-2 rounded-xl border border-gray-200 bg-white p-4 transition-colors",
    disabled
      ? "cursor-not-allowed opacity-70"
      : "hover:border-brand-gold hover:shadow-sm"
  );

  if (!href || disabled) {
    return <div className={base}>{content}</div>;
  }
  return (
    <Link href={href} className={cn(base, "no-underline")}>
      {content}
    </Link>
  );
}