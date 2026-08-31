import { client } from "@/global/api/client";
import { OVERSIGHT_API_ROUTES } from "./constants";
import type {
  AddWhitelistRequest,
  AnalyticsSnapshot,
  AuditEntry,
  GrantOverrideRequest,
  OversightUser,
  PermissionOverride,
  RoleMatrix,
  WhitelistEntry,
} from "./types";

export function fetchOversightOverrides(): Promise<PermissionOverride[]> {
  return client.get<PermissionOverride[]>(OVERSIGHT_API_ROUTES.overrides);
}

export function grantOverride(
  req: GrantOverrideRequest
): Promise<PermissionOverride> {
  return client.post<PermissionOverride, GrantOverrideRequest>(
    OVERSIGHT_API_ROUTES.overrides,
    req
  );
}

export function revokeOverride(id: string): Promise<{ revoked: boolean }> {
  return client.delete<{ revoked: boolean }>(
    `${OVERSIGHT_API_ROUTES.overrides}/${encodeURIComponent(id)}`
  );
}

export function fetchWhitelist(): Promise<WhitelistEntry[]> {
  return client.get<WhitelistEntry[]>(OVERSIGHT_API_ROUTES.whitelist);
}

export function addWhitelistEntry(
  req: AddWhitelistRequest
): Promise<WhitelistEntry> {
  return client.post<WhitelistEntry, AddWhitelistRequest>(
    OVERSIGHT_API_ROUTES.whitelist,
    req
  );
}

export function revokeWhitelistEntry(id: string): Promise<{ revoked: boolean }> {
  return client.delete<{ revoked: boolean }>(
    `${OVERSIGHT_API_ROUTES.whitelist}/${encodeURIComponent(id)}`
  );
}

export function fetchOversightLog(): Promise<AuditEntry[]> {
  return client.get<AuditEntry[]>(OVERSIGHT_API_ROUTES.log);
}

export function fetchStandardAuditLog(): Promise<AuditEntry[]> {
  return client.get<AuditEntry[]>(OVERSIGHT_API_ROUTES.auditLog);
}

export function fetchOversightUsers(): Promise<OversightUser[]> {
  return client.get<OversightUser[]>(OVERSIGHT_API_ROUTES.users);
}

export function fetchRoleMatrix(): Promise<RoleMatrix> {
  return client.get<RoleMatrix>(OVERSIGHT_API_ROUTES.matrix);
}

export function fetchOversightAnalytics(): Promise<AnalyticsSnapshot> {
  return client.get<AnalyticsSnapshot>(OVERSIGHT_API_ROUTES.analytics);
}