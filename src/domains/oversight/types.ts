export interface ScopedHours {
  start: string;
  end: string;
}

export interface OversightUser {
  id: string;
  name: string;
  email: string;
  userType: "guest" | "staff";
  role: string | null;
  permissions: string[];
}

export interface PermissionOverride {
  id: string;
  userId: string;
  userName: string;
  permission: string;
  grantedBy: string;
  createdAt: string;
  expiresAt?: string;
}

export interface WhitelistEntry {
  id: string;
  userId: string;
  userName: string;
  reason?: string;
  scopedHours?: ScopedHours;
  grantedBy: string;
  createdAt: string;
}

export interface AuditEntry {
  id: string;
  actor: string;
  actorRole: string;
  action: string;
  detail: string;
  at: string;
}

export interface RoleMatrix {
  roles: Record<string, string[]>;
  catalog: string[];
}

export interface GrantOverrideRequest {
  userId: string;
  permission: string;
  expiresAt?: string;
}

export interface AddWhitelistRequest {
  userId: string;
  reason?: string;
  scopedHours?: ScopedHours;
}

export interface CategoryOccupancy {
  category: string;
  total: number;
  occupied: number;
}

export interface RevenueBucket {
  label: string;
  amount: number;
}

export interface AnalyticsSnapshot {
  generatedAt: string;
  occupancy: {
    totalRooms: number;
    inHouse: number;
    arrivingToday: number;
    departingToday: number;
    available: number;
    rate: number;
    byCategory: CategoryOccupancy[];
  };
  revenue: {
    total: number;
    confirmed: number;
    pending: number;
    cancelled: number;
    perNight: number;
    tax: number;
    trend: RevenueBucket[];
  };
  reservations: {
    pending: number;
    confirmed: number;
    inHouse: number;
    completed: number;
    cancelled: number;
    account: number;
    walkIn: number;
    avgNights: number;
  };
  guests: {
    total: number;
    registered: number;
    completeProfiles: number;
    byCountry: { country: string; count: number }[];
  };
  security: {
    activeSessions: number;
    overrides: number;
    expiringSoon: number;
    whitelist: number;
    violations: number;
    accountsByRole: { role: string; count: number }[];
  };
  audit: {
    isolatedToday: number;
    standardToday: number;
    recent: AuditEntry[];
  };
}