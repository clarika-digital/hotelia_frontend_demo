import type { GuestBooking } from "@/domains/guests/types";
import type {
  AuditEntry,
  PermissionOverride,
  WhitelistEntry,
} from "@/domains/oversight/types";
import type {
  ApprovalItem,
  CollectionBucket,
  InvoiceItem,
  MethodSplit,
  RefundItem,
} from "@/domains/accounting/types";
import type {
  AttentionItem,
  TeamCounter,
  WorkOrderItem,
} from "@/domains/operations/types";

export interface MockUser {
  id: string;
  userType: "guest" | "staff";
  name: string;
  email: string;
  phone?: string;
  password: string;
  pin?: string;
  role?: string;
  permissions: string[];
  /** Simulated on-premise device state. Denied only when the role requires geofence
   *  (see geofenceAllowed in engine.ts: executive/super_admin are whitelisted/exempt). */
  geofenceVerified: boolean;
}

export const STAFF_USERS: MockUser[] = [
  {
    id: "staff-front-desk",
    userType: "staff",
    name: "Ama Mensah",
    email: "frontdesk@hotelia.test",
    password: "staff123",
    pin: "1234",
    role: "front_desk",
    permissions: [
      "rooms.read",
      "rooms.status.update",
      "reservations.create",
      "reservations.checkin",
      "reservations.checkout",
      "payments.record",
      "guests.lookup",
    ],
    geofenceVerified: true,
  },
  {
    id: "staff-accountant",
    userType: "staff",
    name: "Kwame Osei",
    email: "accountant@hotelia.test",
    password: "staff123",
    pin: "1234",
    role: "accountant",
    permissions: ["payments.read", "payments.approve", "refunds.initiate", "invoices.read"],
    geofenceVerified: true,
  },
  {
    id: "staff-housekeeping",
    userType: "staff",
    name: "Akosua Danso",
    email: "housekeeping@hotelia.test",
    password: "staff123",
    pin: "1234",
    role: "housekeeping",
    permissions: ["housekeeping.read", "housekeeping.update", "rooms.status.update"],
    geofenceVerified: false,
  },
  {
    id: "staff-maintenance",
    userType: "staff",
    name: "Kofi Boateng",
    email: "maintenance@hotelia.test",
    password: "staff123",
    pin: "1234",
    role: "maintenance",
    permissions: ["maintenance.read", "maintenance.update"],
    geofenceVerified: true,
  },
  {
    id: "staff-manager",
    userType: "staff",
    name: "Efua Owusu",
    email: "manager@hotelia.test",
    password: "staff123",
    pin: "1234",
    role: "manager",
    permissions: ["maintenance.manage", "rooms.status.override", "audit.read", "analytics.read"],
    geofenceVerified: true,
  },
  {
    id: "staff-it",
    userType: "staff",
    name: "Yaw Antwi",
    email: "it@hotelia.test",
    password: "staff123",
    pin: "1234",
    role: "it_manager",
    permissions: ["staff.manage", "sessions.read"],
    geofenceVerified: true,
  },
  {
    id: "staff-executive",
    userType: "staff",
    name: "Nana Adjei",
    email: "executive@hotelia.test",
    password: "staff123",
    pin: "1234",
    role: "executive",
    permissions: ["analytics.read", "recommendations.read"],
    geofenceVerified: true,
  },
  {
    id: "staff-super_admin",
    userType: "staff",
    name: "Super Admin",
    email: "super_admin@hotelia.test",
    password: "staff123",
    pin: "1234",
    role: "super_admin",
    permissions: [
      "rbac.override",
      "rbac.whitelist",
      "audit.read",
      "audit.super_admin.read",
    ],
    geofenceVerified: true,
  },
];

export const GUEST_USERS: MockUser[] = [
  {
    id: "guest-1",
    userType: "guest",
    name: "John Smith",
    email: "guest@hotelia.test",
    phone: "+233201234567",
    password: "guest123",
    permissions: [
      "bookings.own.read",
      "bookings.own.create",
      "profile.own.manage",
      "export.own.request",
    ],
    geofenceVerified: true,
  },
  {
    id: "guest-2",
    userType: "guest",
    name: "Ama Serwaa",
    email: "ama@example.com",
    phone: "+233209876543",
    password: "guest123",
    permissions: [
      "bookings.own.read",
      "bookings.own.create",
      "profile.own.manage",
      "export.own.request",
    ],
    geofenceVerified: true,
  },
];

/** Seeded booking history per fixture guest (own-data only, mock-first). */
export const GUEST_BOOKINGS: GuestBooking[] = [
  {
    id: "bkg-101",
    ref: "HT-9081",
    guestId: "guest-1",
    roomCategory: "Deluxe Room",
    checkIn: "2026-10-08",
    checkOut: "2026-10-11",
    nights: 3,
    guests: 2,
    total: 1740,
    currency: "GHS",
    status: "pending",
    pin: "4281",
    createdAt: "2026-08-29T09:30:00.000Z",
    events: [
      { at: "2026-08-29T09:30:00.000Z", label: "Booking requested", note: "Deposit hold pending at the desk." },
    ],
  },
  {
    id: "bkg-102",
    ref: "HT-8774",
    guestId: "guest-1",
    roomCategory: "Executive Suite",
    checkIn: "2026-09-18",
    checkOut: "2026-09-22",
    nights: 4,
    guests: 2,
    total: 4600,
    currency: "GHS",
    status: "confirmed",
    pin: "9165",
    createdAt: "2026-07-02T14:10:00.000Z",
    events: [
      { at: "2026-07-02T14:10:00.000Z", label: "Booking requested" },
      { at: "2026-07-02T14:12:00.000Z", label: "Confirmed", note: "Email confirmation sent." },
    ],
  },
  {
    id: "bkg-103",
    ref: "HT-8358",
    guestId: "guest-1",
    roomCategory: "King Room",
    checkIn: "2026-08-28",
    checkOut: "2026-08-31",
    nights: 3,
    guests: 1,
    total: 1740,
    currency: "GHS",
    status: "checked_in",
    pin: "5520",
    createdAt: "2026-08-01T08:05:00.000Z",
    events: [
      { at: "2026-08-01T08:05:00.000Z", label: "Booking requested" },
      { at: "2026-08-01T08:10:00.000Z", label: "Confirmed" },
      { at: "2026-08-28T11:40:00.000Z", label: "Checked in", note: "Key cards issued at the desk." },
    ],
  },
  {
    id: "bkg-104",
    ref: "HT-7912",
    guestId: "guest-1",
    roomCategory: "Twin Room",
    checkIn: "2026-07-03",
    checkOut: "2026-07-05",
    nights: 2,
    guests: 2,
    total: 1000,
    currency: "GHS",
    status: "checked_out",
    pin: "3307",
    createdAt: "2026-06-01T16:45:00.000Z",
    events: [
      { at: "2026-06-01T16:45:00.000Z", label: "Booking requested" },
      { at: "2026-06-02T08:00:00.000Z", label: "Confirmed" },
      { at: "2026-07-03T12:00:00.000Z", label: "Checked in" },
      { at: "2026-07-05T10:20:00.000Z", label: "Checked out", note: "Invoice settled in full." },
    ],
  },
  {
    id: "bkg-105",
    ref: "HT-7546",
    guestId: "guest-1",
    roomCategory: "Deluxe Room",
    checkIn: "2026-06-13",
    checkOut: "2026-06-15",
    nights: 2,
    guests: 1,
    total: 1160,
    currency: "GHS",
    status: "cancelled",
    pin: "6672",
    createdAt: "2026-06-04T11:20:00.000Z",
    events: [
      { at: "2026-06-04T11:20:00.000Z", label: "Booking requested" },
      { at: "2026-06-04T11:31:00.000Z", label: "Confirmed" },
      { at: "2026-06-09T09:00:00.000Z", label: "Cancelled", note: "Refunded 75% of nightly rate." },
    ],
  },
  {
    id: "bkg-106",
    ref: "HT-7129",
    guestId: "guest-1",
    roomCategory: "Studio Room",
    checkIn: "2026-05-20",
    checkOut: "2026-05-22",
    nights: 2,
    guests: 2,
    total: 1100,
    currency: "GHS",
    status: "no_show",
    pin: "1140",
    createdAt: "2026-05-01T10:00:00.000Z",
    events: [
      { at: "2026-05-01T10:00:00.000Z", label: "Booking requested" },
      { at: "2026-05-01T10:12:00.000Z", label: "Confirmed" },
      { at: "2026-05-20T23:59:00.000Z", label: "No show", note: "Cancellation window missed." },
    ],
  },
  {
    id: "bkg-201",
    ref: "HT-6502",
    guestId: "guest-2",
    roomCategory: "Twin Room",
    checkIn: "2026-09-02",
    checkOut: "2026-09-04",
    nights: 2,
    guests: 2,
    total: 1000,
    currency: "GHS",
    status: "pending",
    pin: "8813",
    createdAt: "2026-08-27T13:15:00.000Z",
    events: [
      { at: "2026-08-27T13:15:00.000Z", label: "Booking requested" },
    ],
  },
  {
    id: "bkg-202",
    ref: "HT-6139",
    guestId: "guest-2",
    roomCategory: "Executive Suite",
    checkIn: "2026-07-22",
    checkOut: "2026-07-25",
    nights: 3,
    guests: 1,
    total: 3450,
    currency: "GHS",
    status: "checked_out",
    pin: "3204",
    createdAt: "2026-06-14T09:00:00.000Z",
    events: [
      { at: "2026-06-14T09:00:00.000Z", label: "Booking requested" },
      { at: "2026-06-15T08:30:00.000Z", label: "Confirmed" },
      { at: "2026-07-22T12:05:00.000Z", label: "Checked in" },
      { at: "2026-07-25T09:40:00.000Z", label: "Checked out" },
    ],
  },
];

export const OVERSEER_ROLE_MATRIX: Record<string, string[]> = {
  front_desk: [
    "rooms.read",
    "rooms.status.update",
    "reservations.create",
    "reservations.checkin",
    "reservations.checkout",
    "payments.record",
    "guests.lookup",
  ],
  accountant: [
    "payments.read",
    "payments.approve",
    "refunds.initiate",
    "invoices.read",
  ],
  housekeeping: ["housekeeping.read", "housekeeping.update", "rooms.status.update"],
  maintenance: ["maintenance.read", "maintenance.update"],
  manager: [
    "maintenance.manage",
    "rooms.status.override",
    "audit.read",
    "analytics.read",
    "reservations.update",
  ],
  it_manager: ["staff.manage", "sessions.read"],
  executive: ["analytics.read", "recommendations.read"],
  super_admin: [
    "rbac.override",
    "rbac.whitelist",
    "audit.read",
    "audit.super_admin.read",
  ],
};

export const PERMISSION_CATALOG = [
  "audit.read",
  "payments.approve",
  "payments.record",
  "refunds.initiate",
  "reservations.create",
  "reservations.checkin",
  "reservations.update",
  "rooms.status.override",
  "staff.manage",
  "sessions.read",
  "housekeeping.update",
  "maintenance.manage",
  "maintenance.update",
  "guests.lookup",
] as const;

export const OVERRIDE_FIXTURES: PermissionOverride[] = [
  {
    id: "ovr-1",
    userId: "staff-manager",
    userName: "Efua Owusu",
    permission: "refunds.initiate",
    grantedBy: "Super Admin",
    createdAt: "2026-08-24T10:10:00.000Z",
    expiresAt: "2026-09-30T10:10:00.000Z",
  },
  {
    id: "ovr-2",
    userId: "staff-front-desk",
    userName: "Ama Mensah",
    permission: "audit.read",
    grantedBy: "Super Admin",
    createdAt: "2026-08-30T14:20:00.000Z",
    expiresAt: "2026-09-06T14:20:00.000Z",
  },
  {
    id: "ovr-3",
    userId: "staff-accountant",
    userName: "Kwame Osei",
    permission: "staff.manage",
    grantedBy: "Super Admin",
    createdAt: "2026-07-01T09:00:00.000Z",
    expiresAt: "2026-07-03T09:00:00.000Z",
  },
];

export const WHITELIST_FIXTURES: WhitelistEntry[] = [
  {
    id: "wl-1",
    userId: "staff-executive",
    userName: "Nana Adjei",
    reason: "Whitelisted by role policy [FR-012].",
    grantedBy: "Super Admin",
    createdAt: "2026-06-01T08:00:00.000Z",
  },
  {
    id: "wl-2",
    userId: "staff-super_admin",
    userName: "Super Admin",
    reason: "Never blocked — console must always be reachable.",
    grantedBy: "Super Admin",
    createdAt: "2026-06-01T08:00:00.000Z",
  },
  {
    id: "wl-3",
    userId: "staff-front-desk",
    userName: "Ama Mensah",
    reason: "Night-shift reception from the home kiosk.",
    scopedHours: { start: "21:00", end: "06:00" },
    grantedBy: "Super Admin",
    createdAt: "2026-08-15T17:40:00.000Z",
  },
];

export const STANDARD_AUDIT_FIXTURES: AuditEntry[] = [
  {
    id: "aud-1",
    actor: "Kwame Osei",
    actorRole: "accountant",
    action: "Payment approved",
    detail: "Payment #PAY-1042 approved (GHS 2,400).",
    at: "2026-08-31T08:05:00.000Z",
  },
  {
    id: "aud-2",
    actor: "Ama Mensah",
    actorRole: "front_desk",
    action: "Checked in",
    detail: "Guest A. Boateng checked in to room 402 (HT-6105).",
    at: "2026-08-30T20:12:00.000Z",
  },
  {
    id: "aud-3",
    actor: "Efua Owusu",
    actorRole: "manager",
    action: "Room status override",
    detail: "Room 217 set out-of-order pending carpet inspection.",
    at: "2026-08-30T15:40:00.000Z",
  },
  {
    id: "aud-4",
    actor: "Akosua Danso",
    actorRole: "housekeeping",
    action: "Task completed",
    detail: "Cleaning finished on room 118.",
    at: "2026-08-29T11:22:00.000Z",
  },
  {
    id: "aud-5",
    actor: "Kofi Boateng",
    actorRole: "maintenance",
    action: "Work order closed",
    detail: "AC fault resolved in suite 505.",
    at: "2026-08-29T09:00:00.000Z",
  },
];

export const ISOLATED_AUDIT_FIXTURES: AuditEntry[] = [
  {
    id: "iso-1",
    actor: "Super Admin",
    actorRole: "super_admin",
    action: "Override granted",
    detail: "Efua Owusu \u2192 refunds.initiate (until 30 Sep).",
    at: "2026-08-24T10:10:00.000Z",
  },
  {
    id: "iso-2",
    actor: "Super Admin",
    actorRole: "super_admin",
    action: "Override granted",
    detail: "Ama Mensah \u2192 audit.read (7-day time-box).",
    at: "2026-08-30T14:20:00.000Z",
  },
  {
    id: "iso-3",
    actor: "Super Admin",
    actorRole: "super_admin",
    action: "Whitelist exemption added",
    detail: "Ama Mensah \u2014 scoped 21:00\u201306:00 (night kiosk).",
    at: "2026-08-15T17:40:00.000Z",
  },
  {
    id: "iso-4",
    actor: "Super Admin",
    actorRole: "super_admin",
    action: "Override revoked",
    detail: "Kwame Osei \u2014 staff.manage (expired 03 Jul).",
    at: "2026-07-03T10:00:00.000Z",
  },
  {
    id: "iso-5",
    actor: "Super Admin",
    actorRole: "super_admin",
    action: "Session unlocked",
    detail: "Recovered locked console after idle-lock (workstation 04).",
    at: "2026-08-31T07:55:00.000Z",
  },
];

export const APPROVAL_FIXTURES: ApprovalItem[] = [
  {
    id: "appr-1",
    ref: "PYM-8841",
    guest: "Ama Serwaa",
    method: "momo",
    amount: 1250,
    createdAt: "2026-08-31T08:20:00.000Z",
    status: "pending",
  },
  {
    id: "appr-2",
    ref: "PYM-8839",
    guest: "Daniel Boadu",
    method: "card",
    amount: 3480,
    createdAt: "2026-08-31T08:06:00.000Z",
    status: "pending",
  },
  {
    id: "appr-3",
    ref: "PYM-8836",
    guest: "John Smith",
    method: "cash",
    amount: 940,
    createdAt: "2026-08-31T07:48:00.000Z",
    status: "pending",
  },
];

export const REFUND_FIXTURES: RefundItem[] = [
  {
    id: "rfd-1",
    ref: "REF-112",
    guest: "Kwame Mensah",
    amount: 850,
    status: "pending",
    createdAt: "2026-08-31T09:02:00.000Z",
  },
  {
    id: "rfd-2",
    ref: "REF-109",
    guest: "Efua Owusu",
    amount: 2140,
    status: "manager_sign_off",
    createdAt: "2026-08-30T16:40:00.000Z",
  },
];

export const INVOICE_FIXTURES: InvoiceItem[] = [
  {
    id: "inv-1",
    ref: "INV-9021",
    guest: "Accra Chamber of Commerce",
    amount: 48750,
    status: "overdue",
    dueDate: "2026-08-20",
  },
  {
    id: "inv-2",
    ref: "INV-9022",
    guest: "GoldStar Travel Ltd",
    amount: 22650,
    status: "open",
    dueDate: "2026-09-05",
  },
  {
    id: "inv-3",
    ref: "INV-9023",
    guest: "British Council",
    amount: 13900,
    status: "open",
    dueDate: "2026-09-12",
  },
];

export const COLLECTION_HISTORY: CollectionBucket[] = [
  { date: "Mon 25 Aug", amount: 17400 },
  { date: "Tue 26 Aug", amount: 15200 },
  { date: "Wed 27 Aug", amount: 18900 },
  { date: "Thu 28 Aug", amount: 21100 },
  { date: "Fri 29 Aug", amount: 19850 },
  { date: "Sat 30 Aug", amount: 24100 },
  { date: "Sun 31 Aug", amount: 18450 },
];

export const COLLECTION_SPLIT_TODAY: MethodSplit[] = [
  { method: "cash", amount: 4875 },
  { method: "card", amount: 9120 },
  { method: "momo", amount: 4455 },
];

export const WORK_ORDER_FIXTURES: WorkOrderItem[] = [
  { id: "wo-1", ref: "WO-2214", room: "405", issue: "AC not cooling", priority: "high", status: "open" },
  { id: "wo-2", ref: "WO-2213", room: "509", issue: "Bathroom leak", priority: "high", status: "in_progress" },
  { id: "wo-3", ref: "WO-2211", room: "217", issue: "Carpet stain — deep clean", priority: "medium", status: "open" },
  { id: "wo-4", ref: "WO-2208", room: "118", issue: "TV no signal", priority: "low", status: "open" },
  { id: "wo-5", ref: "WO-2204", room: "505", issue: "AC fault — resolved", priority: "low", status: "resolved" },
];

export const ATTENTION_FIXTURES: AttentionItem[] = [
  { id: "attn-1", label: "High-priority maintenance", detail: "Rooms 405 and 509", priority: "high" },
  { id: "attn-2", label: "Refund above threshold", detail: "PYM-8832 · GHS 6,400", priority: "medium" },
  { id: "attn-3", label: "Escalated guest message", detail: "Conversation #1041", priority: "medium" },
  { id: "attn-4", label: "Departed room outstanding charges", detail: "Room 217 · balance due", priority: "low" },
];

export const TEAM_SNAPSHOT_FIXTURES: TeamCounter[] = [
  { label: "Housekeeping in progress", value: 3 },
  { label: "Maintenance open work orders", value: 4 },
  { label: "Guest approvals pending", value: 3 },
  { label: "Rooms blocked for maintenance", value: 1 },
];


