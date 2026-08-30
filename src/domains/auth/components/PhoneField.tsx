"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { COUNTRIES, getCountry } from "@/data/countries";
import { formatPhonePreview, normalizeNationalNumber } from "@/data/phones";
import { cn } from "@/lib/cn";

interface PhoneFieldProps {
  id: string;
  label: string;
  countryIso: string;
  nationalNumber: string;
  onCountryChange: (iso: string) => void;
  onNationalChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string | null;
}

export function PhoneField({
  id,
  label,
  countryIso,
  nationalNumber,
  onCountryChange,
  onNationalChange,
  required,
  disabled,
  error,
}: PhoneFieldProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selected = getCountry(countryIso) ?? COUNTRIES[0];
  const preview = formatPhonePreview(selected.dialCode, nationalNumber);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dialCode.replace(/\D/g, "").includes(q.replace(/\D/g, ""))
    );
  }, [query]);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  function selectCountry(iso: string) {
    onCountryChange(iso);
    setOpen(false);
    setQuery("");
  }

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500"
      >
        {label}
        {required && <span className="sr-only">required</span>}
      </label>

      <div className="flex gap-2">
        <div ref={wrapperRef} className="relative shrink-0">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            disabled={disabled}
            aria-haspopup="listbox"
            aria-expanded={open}
            className={cn(
              "flex h-[46px] items-center gap-1.5 rounded border border-gray-300 bg-white px-3 text-sm text-brand-navy outline-none transition-colors",
              "focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30"
            )}
          >
            <span aria-hidden>{selected.flag}</span>
            <span className="font-semibold tabular-nums">
              {selected.dialCode}
            </span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={cn(
                "text-gray-400 transition-transform",
                open && "rotate-180"
              )}
              aria-hidden
            >
              <path d="M2 4l4 4 4-4" />
            </svg>
          </button>

          {open && (
            <div className="absolute left-0 z-20 mt-1 w-72 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl shadow-brand-navy/20">
              <div className="border-b border-gray-100 p-2">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setOpen(false);
                    } else if (e.key === "Enter" && filtered[0]) {
                      selectCountry(filtered[0].iso);
                    }
                  }}
                  placeholder="Search country or code…"
                  className="w-full rounded border border-gray-200 px-3 py-2 text-sm text-brand-navy outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30"
                />
              </div>
              <ul
                role="listbox"
                aria-label="Select a country"
                className="max-h-56 overflow-y-auto py-1"
              >
                {filtered.length === 0 && (
                  <li className="px-4 py-3 text-sm text-gray-500">
                    No countries match.
                  </li>
                )}
                {filtered.map((c) => (
                  <li key={c.iso}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={c.iso === selected.iso}
                      onClick={() => selectCountry(c.iso)}
                      className={cn(
                        "flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-brand-navy transition-colors",
                        c.iso === selected.iso
                          ? "bg-brand-gold/10 font-semibold"
                          : "hover:bg-gray-50"
                      )}
                    >
                      <span aria-hidden>{c.flag}</span>
                      <span className="flex-1 truncate">{c.name}</span>
                      <span className="tabular-nums text-gray-400">
                        {c.dialCode}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <input
            id={id}
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder={`e.g. 240258378 (no leading 0)`}
            value={nationalNumber}
            onChange={(e) =>
              onNationalChange(normalizeNationalNumber(e.target.value))
            }
            required={required}
            disabled={disabled}
            className="w-full rounded border border-gray-300 bg-white px-4 py-3 text-sm text-brand-navy outline-none transition-colors focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>
      </div>

      <div className="mt-1.5 flex items-baseline justify-between gap-2">
        <p
          className={cn(
            "min-h-[1rem] text-xs",
            error ? "text-red-600" : "text-gray-500"
          )}
          aria-live="polite"
        >
          {error ?? (preview ? `Will be stored as ${preview}` : "")}
        </p>
      </div>
    </div>
  );
}