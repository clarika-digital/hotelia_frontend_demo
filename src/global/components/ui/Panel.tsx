import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface PanelProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function Panel({ title, description, action, className, children }: PanelProps) {
  return (
    <section className={cn("rounded-xl border border-gray-200 bg-white shadow-sm", className)}>
      {(title || action) && (
        <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-4">
          <div>
            {title && <h2 className="font-display text-lg font-bold text-brand-navy">{title}</h2>}
            {description && <p className="mt-0.5 text-xs text-gray-500">{description}</p>}
          </div>
          {action}
        </div>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}