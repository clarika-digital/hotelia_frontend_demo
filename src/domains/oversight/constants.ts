export const OVERSIGHT_API_ROUTES = {
  overrides: "/v1/oversight/overrides",
  whitelist: "/v1/oversight/whitelist",
  log: "/v1/oversight/log",
  auditLog: "/v1/audit/log",
  users: "/v1/oversight/users",
  matrix: "/v1/oversight/matrix",
  analytics: "/v1/oversight/analytics",
} as const;

export const OVERSIGHT_PAGE_ROUTES = {
  home: "/super_admin/",
  overrides: "/super_admin/overrides/",
  whitelist: "/super_admin/whitelist/",
  log: "/super_admin/oversight-log/",
  auditLog: "/super_admin/audit-log/",
} as const;

export const OVERRIDE_EXPIRY_OPTIONS = [
  { label: "No expiry", value: "" },
  { label: "24 hours", value: "24h" },
  { label: "7 days", value: "7d" },
  { label: "30 days", value: "30d" },
] as const;

export function expiresFromOption(
  option: string,
  now: Date = new Date()
): string | undefined {
  if (!option) return undefined;
  const hours =
    option === "24h" ? 24 : option === "7d" ? 168 : option === "30d" ? 720 : 0;
  if (!hours) return undefined;
  return new Date(now.getTime() + hours * 3600 * 1000).toISOString();
}