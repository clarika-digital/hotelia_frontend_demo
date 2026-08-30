export const PORTAL_PROFILE = {
  firstName: "Ama",
  lastName: "Serwaa",
  staffId: "HT-FD-0137",
  phone: "+233 24 025 8378",
  email: "front@hotelia.test",
  address: "East Legon, Accra",
  emergencyContact: {
    name: "Kwame Serwaa",
    relation: "Brother",
    phone: "+233 20 555 0198",
  },
  department: "Front Office",
  startDate: "12 Apr 2023",
  employmentType: "Full-time",
  manager: "Mrs. Ama Owusu",
  location: "Hotelia Accra",
};

export const PORTAL_TENURE = {
  started: "12 Apr 2023",
  years: 3,
  months: 4,
  milestones: [
    { label: "1 year with Hotelia", date: "12 Apr 2024", tone: "completed" as const },
    { label: "2-year service award", date: "12 Apr 2025", tone: "awarded" as const },
    { label: "Employee of the Month", date: "Jun 2025", tone: "awarded" as const },
    { label: "3-year anniversary", date: "12 Apr 2026", tone: "awarded" as const },
    { label: "4-year anniversary", date: "12 Apr 2027", tone: "upcoming" as const },
  ],
  recognitions: [
    { title: "Employee of the Month", date: "Jun 2025", detail: "Front desk excellence" },
    { title: "2-year service award", date: "Apr 2025", detail: "Long service recognition" },
    { title: "Guest shout-out — Gold Coast Grill", date: "Feb 2024", detail: "Exceptional service" },
  ],
};

export const PORTAL_DOCUMENTS = [
  { name: "Employment contract.pdf", category: "Contract", added: "12 Apr 2023", size: "248 KB" },
  { name: "Staff ID card.pdf", category: "Identification", added: "15 Apr 2023", size: "96 KB" },
  { name: "SSCE certificate.pdf", category: "Certification", added: "12 Apr 2023", size: "1.1 MB" },
  { name: "Tax ID (TIN).pdf", category: "Tax", added: "12 Apr 2023", size: "74 KB" },
  { name: "Bank account details.pdf", category: "Payroll", added: "14 Apr 2023", size: "132 KB" },
];

export const PORTAL_LEAVE_BALANCES = [
  { type: "Annual leave", used: 12, total: 24 },
  { type: "Sick leave", used: 2, total: 6 },
  { type: "Casual leave", used: 0, total: 3 },
];

export const LEAVE_OPTIONS: { value: "annual" | "sick" | "casual" | "unpaid"; label: string }[] = [
  { value: "annual", label: "Annual leave" },
  { value: "sick", label: "Sick leave" },
  { value: "casual", label: "Casual leave" },
  { value: "unpaid", label: "Unpaid leave" },
];

export const PORTAL_ROSTER = [
  { date: "Sun 30 Aug", shift: "06:00 – 14:00", duty: "Front desk" },
  { date: "Mon 31 Aug", shift: "14:00 – 22:00", duty: "Front desk" },
  { date: "Tue 01 Sep", shift: "Off", duty: "—" },
  { date: "Wed 02 Sep", shift: "06:00 – 14:00", duty: "Front desk" },
  { date: "Thu 03 Sep", shift: "Off", duty: "—" },
  { date: "Fri 04 Sep", shift: "14:00 – 22:00", duty: "Front desk" },
  { date: "Sat 05 Sep", shift: "14:00 – 22:00", duty: "Reception cover" },
  { date: "Sun 06 Sep", shift: "06:00 – 14:00", duty: "Front desk" },
  { date: "Mon 07 Sep", shift: "Off", duty: "—" },
  { date: "Tue 08 Sep", shift: "14:00 – 22:00", duty: "Front desk" },
  { date: "Wed 09 Sep", shift: "Off", duty: "—" },
  { date: "Thu 10 Sep", shift: "06:00 – 14:00", duty: "Front desk" },
  { date: "Fri 11 Sep", shift: "06:00 – 14:00", duty: "Front desk" },
  { date: "Sat 12 Sep", shift: "Off", duty: "—" },
];

export interface Payslip {
  month: string;
  gross: number;
  net: number;
  status: "paid";
  earnings: { label: string; amount: number }[];
  deductions: { label: string; amount: number }[];
}

const JULY: Payslip = {
  month: "July 2026",
  gross: 2800,
  net: 2416,
  status: "paid",
  earnings: [
    { label: "Basic pay", amount: 2600 },
    { label: "Shift allowance", amount: 200 },
  ],
  deductions: [
    { label: "PAYE (income tax)", amount: 264 },
    { label: "SSNIT pension (5.5%)", amount: 120 },
  ],
};

const JUNE: Payslip = {
  month: "June 2026",
  gross: 2800,
  net: 2410,
  status: "paid",
  earnings: [
    { label: "Basic pay", amount: 2600 },
    { label: "Shift allowance", amount: 200 },
  ],
  deductions: [
    { label: "PAYE (income tax)", amount: 270 },
    { label: "SSNIT pension (5.5%)", amount: 120 },
  ],
};

const MAY: Payslip = {
  month: "May 2026",
  gross: 2800,
  net: 2388,
  status: "paid",
  earnings: [
    { label: "Basic pay", amount: 2600 },
    { label: "Shift allowance", amount: 200 },
  ],
  deductions: [
    { label: "PAYE (income tax)", amount: 292 },
    { label: "SSNIT pension (5.5%)", amount: 120 },
  ],
};

const APRIL: Payslip = {
  month: "April 2026",
  gross: 2800,
  net: 2416,
  status: "paid",
  earnings: [
    { label: "Basic pay", amount: 2600 },
    { label: "Shift allowance", amount: 200 },
  ],
  deductions: [
    { label: "PAYE (income tax)", amount: 264 },
    { label: "SSNIT pension (5.5%)", amount: 120 },
  ],
};

export const PORTAL_PAYSLIPS: Payslip[] = [JULY, JUNE, MAY, APRIL];

export const PORTAL_PAY_CALENDAR = [
  { date: "31 Aug 2026", label: "July payday", status: "upcoming" as const },
  { date: "30 Sep 2026", label: "August payday", status: "upcoming" as const },
  { date: "31 Oct 2026", label: "September payday", status: "upcoming" as const },
  { date: "30 Nov 2026", label: "October payday", status: "upcoming" as const },
  { date: "31 Dec 2026", label: "November payday", status: "upcoming" as const },
];

export const NEXT_PAYDAY = { date: "31 Aug 2026", label: "July payday" };

export const PORTAL_BENEFITS = [
  { title: "Meals on shift", detail: "Complimentary staff meals during scheduled shifts.", status: "enrolled" as const },
  { title: "Pension (SSNIT)", detail: "15% employer + 5.5% employee statutory contributions.", status: "enrolled" as const },
  { title: "Staff accommodation rates", detail: "Up to 30% off room rates for personal stays.", status: "enrolled" as const },
  { title: "Uniform allowance", detail: "Annual uniform refresh provided by Housekeeping.", status: "enrolled" as const },
  { title: "Health insurance (Comprehensive)", detail: "Private medical cover with partner clinics.", status: "enrolled" as const },
  { title: "Staff transport", detail: "Scheduled shuttle for early and late shifts.", status: "enrolling" as const },
];

export const PORTAL_TRAINING = [
  { title: "Hospitality service essentials", completed: "Mar 2023", status: "completed" as const },
  { title: "No-show & late arrival handling", completed: "Nov 2023", status: "completed" as const },
  { title: "Card payments & reconciliation", completed: "Jun 2025", status: "completed" as const },
  { title: "Customer escalation paths", completed: "Jan 2026", status: "completed" as const },
  { title: "Property management system refresh", status: "in-progress" as const, progress: 40 },
  { title: "Fire & evacuation marshal", scheduled: "18 Sep 2026", status: "upcoming" as const },
];

export const PORTAL_REVIEWS = [
  {
    period: "Q2 2026",
    rating: 4.6,
    summary: "Strong service consistency; recommended for front-office lead rotation.",
    status: "completed" as const,
  },
  {
    period: "H2 2025",
    rating: 4.2,
    summary: "Reliable during peak season; focus on cross-sell conversion.",
    status: "completed" as const,
  },
  {
    period: "Q4 2026",
    rating: null,
    summary: "",
    scheduledOn: "15 Nov 2026",
    status: "upcoming" as const,
  },
];

export const PORTAL_NOTICES = [
  { title: "August holiday rota published", date: "24 Aug 2026" },
  { title: "New HR noticeboard channel live", date: "18 Aug 2026" },
  { title: "Uniform refresh – collect from Housekeeping", date: "02 Aug 2026" },
];

export function formatGhs(amount: number): string {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    maximumFractionDigits: 0,
  }).format(amount);
}