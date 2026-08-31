export type GeofenceStatus = "verified" | "denied";

export interface SessionDevice {
  id: string;
  device: string;
  user: string;
  role: string;
  os: string;
  ip: string;
  country: string;
  geofence: GeofenceStatus;
  lastActive: number;
}

export interface KioskTouchpoint {
  id: string;
  device: string;
  role: string;
  token: "valid" | "expired";
  online: boolean;
}

export interface SystemHealth {
  uptime: string;
  status: "operational" | "degraded" | "down";
  errorFeed: string[];
  lastSync: string;
}

export interface GeofenceConfig {
  property: string;
  radiusKm: number;
  latitude: number;
  longitude: number;
  enforcedRoles: string[];
}

export interface ItPlatformSnapshot {
  generatedAt: string;
  kpis: {
    staffAccounts: number;
    touchpointsProvisioned: number;
    activeSessions: number;
    tokenRefreshes24h: number;
    tokenRefreshFailures: number;
    revokedTokens7d: number;
  };
  deviceMix: { label: string; value: number; color: string }[];
  tokenHealth: { label: string; value: number; color: string }[];
  sessions: SessionDevice[];
  kiosks: KioskTouchpoint[];
  systouch: SystemHealth;
  geofence: GeofenceConfig;
}

export type DeviceAction = "revoke" | "terminate";

export interface DeviceActionRequest {
  id: string;
  target: "session" | "kiosk";
  action: DeviceAction;
}
