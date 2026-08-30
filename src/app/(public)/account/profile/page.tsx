"use client";

import { useEffect, useState, type FormEvent } from "react";
import { buildCountries } from "@/data/countries";
import { fetchGuestProfile, updateGuestProfile } from "@/domains/guests/api";
import { GUEST_PAGE_ROUTES } from "@/domains/guests/constants";
import type { GuestProfile } from "@/domains/guests/types";
import { ApiError } from "@/global/api/client";
import { Icon } from "@/global/components/ui/Icon";
import { PageHeader } from "@/global/components/ui/PageHeader";
import { Panel } from "@/global/components/ui/Panel";
import { cn } from "@/lib/cn";

const LOCALES = [
  { value: "en", label: "English" },
  { value: "fr", label: "Français" },
  { value: "de", label: "Deutsch" },
];

const CURRENCIES = [
  { value: "GHS", label: "Ghana cedi (GHS)" },
  { value: "USD", label: "US dollar (USD)" },
  { value: "EUR", label: "Euro (EUR)" },
  { value: "GBP", label: "British pound (GBP)" },
];

const inputCls =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-gold/40";

export default function AccountProfilePage() {
  const [profile, setProfile] = useState<GuestProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredCountry, setPreferredCountry] = useState("");
  const [locale, setLocale] = useState("en");
  const [currency, setCurrency] = useState("GHS");

  useEffect(() => {
    fetchGuestProfile()
      .then((p) => {
        setProfile(p);
        setName(p.name);
        setPhone(p.phone);
        setPreferredCountry(p.preferredCountry ?? "");
        setLocale(p.locale);
        setCurrency(p.currency);
      })
      .catch(() => setError("Could not load your profile."))
      .finally(() => setLoading(false));
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const updated = await updateGuestProfile({
        name: name.trim(),
        phone: phone.trim(),
        preferredCountry: preferredCountry.trim(),
        locale,
        currency,
      });
      setProfile(updated);
      setPhone(updated.phone);
      setSaved(true);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.detail ?? err.title : "Could not save your profile."
      );
    } finally {
      setSaving(false);
    }
  }

  const pct = profile
    ? Math.round(
        ((3 - profile.missingFields.length) / 3) * 100
      )
    : 0;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <PageHeader
          title="My profile"
          description="Personal details, preferences and how we reach you."
        />
        {profile && (
          <Panel className="mb-6" title="Profile completion" description="Needed to unlock your personal data export.">
            <div className="flex items-center gap-3">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-brand-gold transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-brand-navy">{pct}%</span>
            </div>
            {profile.missingFields.length > 0 ? (
              <p className="mt-2 text-xs text-gray-500">
                Still missing: {profile.missingFields.join(", ")}.
              </p>
            ) : (
              <p className="mt-2 text-xs text-emerald-600">
                Complete — your data export is unlocked.
              </p>
            )}
          </Panel>
        )}

        <Panel title="Personal details">
          {loading ? (
            <p className="py-6 text-center text-sm text-gray-500">Loading…</p>
          ) : error && !profile ? (
            <p className="py-6 text-center text-sm text-red-600">{error}</p>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label htmlFor="profile-name" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Full name
                </label>
                <input
                  id="profile-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputCls}
                  required
                />
              </div>

              <div>
                <label htmlFor="profile-email" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Email
                </label>
                <input
                  id="profile-email"
                  type="email"
                  value={profile?.email ?? ""}
                  disabled
                  className={cn(inputCls, "cursor-not-allowed bg-gray-50 text-gray-500")}
                />
                <p className="mt-1 text-[11px] text-gray-400">
                  Used to sign in — contact the front desk to change it.
                </p>
              </div>

              <div>
                <label htmlFor="profile-phone" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Phone (E.164)
                </label>
                <input
                  id="profile-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+233 24 000 0000"
                  className={inputCls}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="profile-country" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Country of residence
                  </label>
                  <select
                    id="profile-country"
                    value={preferredCountry}
                    onChange={(e) => setPreferredCountry(e.target.value)}
                    className={inputCls}
                  >
                    <option value="">Select a country…</option>
                    {buildCountries().map((c) => (
                      <option key={c.iso} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="profile-locale" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Language
                  </label>
                  <select
                    id="profile-locale"
                    value={locale}
                    onChange={(e) => setLocale(e.target.value)}
                    className={inputCls}
                  >
                    {LOCALES.map((l) => (
                      <option key={l.value} value={l.value}>
                        {l.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="profile-currency" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Preferred currency
                </label>
                <select
                  id="profile-currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className={inputCls}
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {error && (
                <p className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
                  {error}
                </p>
              )}
              {saved && (
                <p className="flex items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
                  <Icon name="check" className="h-4 w-4" />
                  Profile saved.
                </p>
              )}

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-lg bg-brand-navy px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-navyDark disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save profile"}
              </button>
            </form>
          )}
        </Panel>
      </div>

      <Panel
        title="Your data, your way"
        description="How Hotelia uses your information."
        className="h-fit"
      >
        <ul className="space-y-4 text-sm text-gray-600">
          <li className="flex gap-3">
            <Icon name="shield-check" className="h-5 w-5 flex-none text-brand-gold" />
            <span>We only share your data with the teams you interact with at the property.</span>
          </li>
          <li className="flex gap-3">
            <Icon name="key" className="h-5 w-5 flex-none text-brand-gold" />
            <span>Your booking PIN is unique to each reservation and shown only on your confirmation.</span>
          </li>
          <li className="flex gap-3">
            <Icon name="external-link" className="h-5 w-5 flex-none text-brand-gold" />
            <span>
              You can export a copy of your own profile and booking history anytime — see{" "}
              <a href={GUEST_PAGE_ROUTES.export} className="font-semibold text-brand-gold no-underline hover:underline">
                Data &amp; privacy
              </a>.
            </span>
          </li>
        </ul>
      </Panel>
    </div>
  );
}