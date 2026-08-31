import { PAGE_ROUTES, ROLE_LANDING } from "@/domains/auth/constants";
import type { IconName } from "@/global/components/ui/Icon";

export interface StaffNavItem {
  label: string;
  href: string;
  disabled?: boolean;
}

export interface StaffNavGroup {
  title: string;
  icon: IconName;
  items?: StaffNavItem[];
  children?: StaffNavGroup[];
}

export function navGroupItems(group: StaffNavGroup): StaffNavItem[] {
  return group.children ? group.children.flatMap((c) => c.items ?? []) : group.items ?? [];
}

export interface StaffRoleMeta {
  key: string;
  label: string;
  home: string;
  homeLabel?: string;
  backTo?: { label: string; href: string };
  groups: StaffNavGroup[];
}

export const STAFF_ROLES: Record<string, StaffRoleMeta> = {
  front_desk: {
    key: "front_desk",
    label: "Front Desk",
    home: ROLE_LANDING.front_desk,
    groups: [
      {
        title: "Operations",
        icon: "key",
        items: [
          { label: "Guest Lookup", href: "/front-desk/lookup/", disabled: true },
          { label: "Check-in / Check-out", href: "/front-desk/check-in/", disabled: true },
          { label: "Room Rack", href: "/front-desk/rack/", disabled: true },
        ],
      },
      {
        title: "Sales & Payments",
        icon: "wallet",
        items: [
          { label: "Walk-in Booking", href: "/front-desk/walk-in/", disabled: true },
          { label: "Record Payment", href: "/front-desk/payments/", disabled: true },
        ],
      },
      {
        title: "Guest Services",
        icon: "inbox",
        items: [{ label: "Guest Inbox", href: "/front-desk/inbox/", disabled: true }],
      },
    ],
  },
  accountant: {
    key: "accountant",
    label: "Accountant",
    home: ROLE_LANDING.accountant,
    groups: [
      {
        title: "Approvals",
        icon: "alert-triangle",
        items: [
          { label: "Approvals Queue", href: "/accountant/approvals/", disabled: true },
          { label: "Escalated Refunds", href: "/accountant/refunds-escalated/", disabled: true },
        ],
      },
      {
        title: "Reporting",
        icon: "chart",
        items: [
          { label: "Invoices", href: "/accountant/invoices/", disabled: true },
          { label: "Refunds", href: "/accountant/refunds/", disabled: true },
          { label: "Daily Reconciliation", href: "/accountant/reconciliation/", disabled: true },
        ],
      },
    ],
  },
  housekeeping: {
    key: "housekeeping",
    label: "Housekeeping",
    home: ROLE_LANDING.housekeeping,
    groups: [
      {
        title: "Tasks",
        icon: "list",
        items: [
          { label: "Cleaning Board", href: "/housekeeping/cleaning-board/", disabled: true },
          { label: "Inspections", href: "/housekeeping/inspection/", disabled: true },
        ],
      },
    ],
  },
  maintenance: {
    key: "maintenance",
    label: "Maintenance",
    home: ROLE_LANDING.maintenance,
    groups: [
      {
        title: "Work Orders",
        icon: "wrench",
        items: [
          { label: "Open Requests", href: "/maintenance/requests/", disabled: true },
          { label: "Room Blocking", href: "/maintenance/blocking/", disabled: true },
          { label: "Completed", href: "/maintenance/completed/", disabled: true },
        ],
      },
    ],
  },
  manager: {
    key: "manager",
    label: "Manager",
    home: ROLE_LANDING.manager,
    groups: [
      {
        title: "Operations",
        icon: "list",
        items: [
          { label: "Maintenance Oversight", href: "/manager/maintenance/", disabled: true },
          { label: "Housekeeping Levels", href: "/manager/housekeeping/", disabled: true },
          { label: "Shift Handover", href: "/manager/handover/", disabled: true },
        ],
      },
      {
        title: "Governance",
        icon: "shield",
        items: [
          { label: "Audit Log", href: "/manager/audit-log/", disabled: true },
          { label: "Refund Sign-off", href: "/manager/refunds/", disabled: true },
          { label: "Reports", href: "/manager/reports/", disabled: true },
        ],
      },
    ],
  },
  it_manager: {
    key: "it_manager",
    label: "IT Manager",
    home: ROLE_LANDING.it_manager,
    groups: [
      {
        title: "Identity",
        icon: "user",
        items: [
          { label: "Staff Accounts", href: "/it/accounts/", disabled: true },
          { label: "Sessions & Devices", href: "/it/sessions/", disabled: true },
          { label: "Role Permissions", href: "/it/permissions/", disabled: true },
        ],
      },
      {
        title: "Platform",
        icon: "shield",
        items: [
          { label: "Health & Tokens", href: "/it/health/", disabled: true },
          { label: "Kiosk Touchpoints", href: "/it/kiosks/", disabled: true },
        ],
      },
    ],
  },
  executive: {
    key: "executive",
    label: "Executive",
    home: ROLE_LANDING.executive,
    groups: [
      {
        title: "Insights",
        icon: "chart",
        items: [
          { label: "Recommendations", href: "/executive/recommendations/", disabled: true },
          { label: "Demand Snapshot", href: "/executive/demand/", disabled: true },
          { label: "Forecast", href: "/executive/forecast/", disabled: true },
        ],
      },
      {
        title: "Reporting",
        icon: "list",
        items: [
          { label: "P&L Summary", href: "/executive/pl/", disabled: true },
          { label: "Export Reports", href: "/executive/exports/", disabled: true },
        ],
      },
    ],
  },
  super_admin: {
    key: "super_admin",
    label: "Super Admin",
    home: ROLE_LANDING.super_admin,
    homeLabel: "Overview",
    groups: [
      {
        title: "Identity & Access",
        icon: "users",
        items: [
          { label: "Staff Accounts", href: "/super_admin/it/accounts/", disabled: true },
          { label: "Guest Accounts", href: "/super_admin/it/guests/", disabled: true },
          { label: "Sessions & Devices", href: "/super_admin/it/sessions/", disabled: true },
        ],
      },
      {
        title: "Settings",
        icon: "settings",
        items: [
          { label: "Health & Tokens", href: "/super_admin/it/health/", disabled: true },
          { label: "Permission Overrides", href: "/super_admin/overrides/", disabled: false },
          { label: "Geofence Whitelist", href: "/super_admin/whitelist/", disabled: false },
          { label: "Environment & Deployments", href: "/super_admin/env/deployments/", disabled: true },
          { label: "Feature Flags / Toggles", href: "/super_admin/settings/feature-flags/", disabled: true },
          { label: "Booking & Payments Config", href: "/super_admin/settings/booking-payments/", disabled: true },
          { label: "Audit & Log Retention", href: "/super_admin/settings/audit-retention/", disabled: true },
          { label: "Identity & SSO Settings", href: "/super_admin/settings/identity-sso/", disabled: true },
          { label: "API Config", href: "/super_admin/api-config/", disabled: true },
        ],
      },
      {
        title: "Reports",
        icon: "list",
        items: [
          { label: "Audit Log", href: "/super_admin/audit-log/", disabled: false },
          { label: "Oversight Log", href: "/super_admin/oversight-log/", disabled: false },
          { label: "Refund Sign-off", href: "/super_admin/management/refunds/", disabled: true },
          { label: "Reports", href: "/super_admin/management/reports/", disabled: true },
        ],
      },
      {
        title: "Hotel",
        icon: "briefcase",
        children: [
          {
            title: "Reception",
            icon: "key",
            items: [
              { label: "Guest Lookup", href: "/super_admin/reception/lookup/", disabled: true },
              { label: "Check-in / Check-out", href: "/super_admin/reception/check-in/", disabled: true },
              { label: "Room Rack", href: "/super_admin/reception/rack/", disabled: true },
              { label: "Guest Inbox", href: "/super_admin/reception/inbox/", disabled: true },
            ],
          },
          {
            title: "Finance",
            icon: "wallet",
            items: [
              { label: "Approvals Queue", href: "/super_admin/finance/approvals/", disabled: true },
              { label: "Invoices", href: "/super_admin/finance/invoices/", disabled: true },
              { label: "Refunds", href: "/super_admin/finance/refunds/", disabled: true },
              { label: "Reconciliation", href: "/super_admin/finance/reconciliation/", disabled: true },
            ],
          },
          {
            title: "Housekeeping",
            icon: "list",
            items: [
              { label: "Cleaning Board", href: "/super_admin/housekeeping/board/", disabled: true },
              { label: "Inspections", href: "/super_admin/housekeeping/inspection/", disabled: true },
            ],
          },
          {
            title: "Maintenance",
            icon: "wrench",
            items: [
              { label: "Work Orders", href: "/super_admin/maintenance/orders/", disabled: true },
              { label: "Room Blocking", href: "/super_admin/maintenance/blocking/", disabled: true },
            ],
          },
          {
            title: "Executive",
            icon: "chart",
            items: [
              { label: "Recommendations", href: "/super_admin/executive/recommendations/", disabled: true },
              { label: "Demand Snapshot", href: "/super_admin/executive/demand/", disabled: true },
              { label: "Forecast", href: "/super_admin/executive/forecast/", disabled: true },
            ],
          },
        ],
      },
    ],
  },
};

const STAFF_PORTAL_GROUPS: StaffNavGroup[] = [
  {
    title: "Employment",
    icon: "user",
    items: [
      { label: "My Profile", href: "/staff-portal/profile/" },
      { label: "Tenure & Recognition", href: "/staff-portal/tenure/" },
      { label: "Documents", href: "/staff-portal/documents/" },
    ],
  },
  {
    title: "Time & Leave",
    icon: "history",
    items: [
      { label: "Leave & Time Off", href: "/staff-portal/leave/" },
      { label: "Shift Roster", href: "/staff-portal/roster/" },
    ],
  },
  {
    title: "Pay & Benefits",
    icon: "wallet",
    items: [
      { label: "Payslips", href: "/staff-portal/payslips/" },
      { label: "Pay Calendar", href: "/staff-portal/pay-calendar/" },
      { label: "Benefits", href: "/staff-portal/benefits/" },
    ],
  },
  {
    title: "Growth",
    icon: "chart",
    items: [
      { label: "Training & Certifications", href: "/staff-portal/training/" },
      { label: "Performance Reviews", href: "/staff-portal/reviews/" },
    ],
  },
];

export function staffRoleMeta(role: string | null | undefined): StaffRoleMeta | null {
  if (!role) return null;
  return STAFF_ROLES[role] ?? null;
}

export function staffRoleLabel(role: string | null | undefined): string {
  return staffRoleMeta(role)?.label ?? "Staff";
}

export function staffPortalMeta(role: string | null | undefined): StaffRoleMeta | null {
  const base = staffRoleMeta(role);
  if (!base) return null;
  return {
    key: "staff_portal",
    label: "Staff Portal",
    home: PAGE_ROUTES.staffPortal,
    homeLabel: "Staff Portal",
    backTo: { label: `Back to ${base.label} Dashboard`, href: base.home },
    groups: STAFF_PORTAL_GROUPS,
  };
}