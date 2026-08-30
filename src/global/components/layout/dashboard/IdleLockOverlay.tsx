"use client";

import { useState, type FormEvent } from "react";
import { unlockSession } from "@/domains/auth/api";
import { ApiError } from "@/global/api/client";
import { Icon } from "@/global/components/ui/Icon";
import { useSessionStore } from "@/stores/session-store";

export function IdleLockOverlay({ open }: { open: boolean }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!pin.trim()) {
      setError("Enter your staff PIN to resume.");
      return;
    }
    setSubmitting(true);
    try {
      await unlockSession(pin.trim());
      useSessionStore.getState().unlock();
      setPin("");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.detail ?? err.title
          : "Could not unlock your session."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-brand-navyDark/95 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Session locked"
    >
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-white p-6 text-brand-navy shadow-2xl"
      >
        <div className="flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold">
            <Icon name="lock" className="h-7 w-7" />
          </span>
          <h2 className="mt-4 font-display text-xl font-bold text-brand-navy">
            Session locked
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            You were idle, so the workstation was secured. Enter your staff PIN
            to resume where you left off.
          </p>
        </div>

        <div className="mt-6">
          <label
            htmlFor="unlock-pin"
            className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500"
          >
            Staff PIN
          </label>
          <input
            id="unlock-pin"
            type="password"
            inputMode="numeric"
            autoFocus
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="••••"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-center text-lg font-semibold tracking-[0.5em] text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
          />
        </div>

        {error && (
          <p className="mt-2 animate-shake rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-4 w-full rounded-lg bg-brand-navy px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-navyDark disabled:opacity-60"
        >
          {submitting ? "Unlocking\u2026" : "Unlock session"}
        </button>
      </form>
    </div>
  );
}