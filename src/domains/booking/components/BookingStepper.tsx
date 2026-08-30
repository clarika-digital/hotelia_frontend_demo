"use client";

import Link from "next/link";
import { BOOKING_PAGE_ROUTES, BOOKING_STEPS } from "@/domains/booking/constants";
import { cn } from "@/lib/cn";

interface BookingStepperProps {
  current: number;
}

export function BookingStepper({ current }: BookingStepperProps) {
  return (
    <nav
      aria-label="Booking progress"
      className="border-b border-surface-muted bg-white"
    >
      <ol className="mx-auto flex max-w-[1180px] items-center gap-0 px-5">
        {BOOKING_STEPS.map((s) => {
          const done = s.step < current;
          const active = s.step === current;
          return (
            <li key={s.step} className="flex flex-1 items-center">
              <span className="flex items-center gap-2 py-0">
                <span
                  className={cn(
                    "flex h-7 w-7 flex-none items-center justify-center rounded-full border text-xs font-semibold",
                    done &&
                      "border-brand-gold bg-brand-gold text-white",
                    active &&
                      "border-brand-gold bg-white text-brand-gold ring-2 ring-brand-gold/30",
                    !done && !active && "border-gray-300 bg-white text-gray-400"
                  )}
                >
                  {done ? "\u2713" : s.step}
                </span>
                <span
                  className={cn(
                    "hidden text-xs font-medium sm:block",
                    active ? "text-brand-navy" : "text-gray-500",
                    done && "text-brand-navy"
                  )}
                >
                  {s.label}
                </span>
              </span>
              {s.step < BOOKING_STEPS.length && (
                <span
                  className={cn(
                    "mx-3 h-px flex-1",
                    done ? "bg-brand-gold" : "bg-surface-muted"
                  )}
                  aria-hidden
                />
              )}
            </li>
          );
        })}
        {current === 1 && (
          <Link
            href={BOOKING_PAGE_ROUTES.select}
            className="ml-4 hidden text-xs font-semibold text-brand-gold no-underline hover:underline lg:block"
          >
            Edit search
          </Link>
        )}
      </ol>
    </nav>
  );
}