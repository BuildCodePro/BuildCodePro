export interface BillingPlan {
  id: string;
  name: string;
  price: number;
  period: "month";
  designsPerMonth: number | "unlimited";
  features: string[];
  isCurrent?: boolean;
}

export const BILLING_PLANS: BillingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    price: 99,
    period: "month",
    designsPerMonth: 5,
    features: ["AI Design Engine", "BOM Generation", "PDF Export"],
  },
  {
    id: "professional",
    name: "Professional",
    price: 249,
    period: "month",
    designsPerMonth: 25,
    isCurrent: true,
    features: [
      "Everything in Starter",
      "Compliance Engine",
      "CSV Export",
      "Priority Support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 599,
    period: "month",
    designsPerMonth: "unlimited",
    features: [
      "Everything in Professional",
      "Team Accounts",
      "Dedicated Support",
      "Custom Branding",
    ],
  },
];

export const CURRENT_BILLING_USAGE = {
  planName: "Professional Plan",
  priceLabel: "$249 / month",
  designsLabel: "25 designs per month",
  used: 14,
  total: 25,
};

export interface PaymentMethod {
  brand: string;
  last4: string;
  expiryMonth: string;
  expiryYear: string;
}

export const PAYMENT_METHOD: PaymentMethod = {
  brand: "Visa",
  last4: "4242",
  expiryMonth: "08",
  expiryYear: "2027",
};

export type InvoiceStatus = "paid" | "pending" | "failed";

export interface Invoice {
  id: string;
  date: string;
  plan: string;
  amount: number;
  status: InvoiceStatus;
}

export const INVOICES: Invoice[] = [
  {
    id: "INV-2025-006",
    date: "Jun 1, 2025",
    plan: "Professional",
    amount: 249,
    status: "paid",
  },
  {
    id: "INV-2025-005",
    date: "May 1, 2025",
    plan: "Professional",
    amount: 249,
    status: "paid",
  },
  {
    id: "INV-2025-004",
    date: "Apr 1, 2025",
    plan: "Professional",
    amount: 249,
    status: "paid",
  },
  {
    id: "INV-2025-003",
    date: "Mar 1, 2025",
    plan: "Professional",
    amount: 249,
    status: "paid",
  },
  {
    id: "INV-2025-002",
    date: "Feb 1, 2025",
    plan: "Professional",
    amount: 249,
    status: "paid",
  },
  {
    id: "INV-2025-001",
    date: "Jan 1, 2025",
    plan: "Professional",
    amount: 249,
    status: "paid",
  },
];
