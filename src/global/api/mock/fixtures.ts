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
    id: "staff-superadmin",
    userType: "staff",
    name: "Root Overseer",
    email: "superadmin@hotelia.test",
    password: "staff123",
    pin: "1234",
    role: "super_admin",
    permissions: ["rbac.override", "rbac.whitelist", "audit.superadmin.read"],
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
    permissions: ["bookings.own.read", "profile.own.manage", "export.own.request"],
    geofenceVerified: true,
  },
  {
    id: "guest-2",
    userType: "guest",
    name: "Ama Serwaa",
    email: "ama@example.com",
    phone: "+233209876543",
    password: "guest123",
    permissions: ["bookings.own.read", "profile.own.manage", "export.own.request"],
    geofenceVerified: true,
  },
];
