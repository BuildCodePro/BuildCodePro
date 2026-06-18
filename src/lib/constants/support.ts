export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export type HelpArticleCategory =
  | "getting-started"
  | "upload"
  | "compliance"
  | "exports"
  | "billing";

export interface HelpArticle {
  id: string;
  title: string;
  category: HelpArticleCategory;
  categoryLabel: string;
  readTime: string;
  excerpt: string;
  body: string[];
}

export const SUPPORT_HELP_ARTICLES: HelpArticle[] = [
  {
    id: "getting-started",
    title: "Getting started with BuildCode Pro",
    category: "getting-started",
    categoryLabel: "Getting Started",
    readTime: "4 min read",
    excerpt:
      "Learn how to create your first project, invite your team, and run an AI design from upload to export.",
    body: [
      "BuildCode Pro helps fire alarm contractors move from drawings to bid-ready estimates in minutes. After signing up, company owners can invite estimators and licensed engineers from the Team page.",
      "Start a new design from the sidebar: upload construction drawings, enter project metadata (address, jurisdiction, occupancy, square footage), then run AI analysis. Results include device recommendations, a material takeoff, compliance checklist, design narrative, and export options.",
      "Saved projects appear under Projects in grid or list view. Open any project to review results, version history, and activity logs.",
    ],
  },
  {
    id: "upload-drawings",
    title: "Uploading construction drawings",
    category: "upload",
    categoryLabel: "Upload & Drawings",
    readTime: "3 min read",
    excerpt:
      "Supported file types, size limits, and tips for preparing plan sets before AI analysis.",
    body: [
      "Supported formats are PDF, PNG, JPG, JPEG, and WEBP. Each file can be up to 50 MB, and you may upload multiple files for a single project.",
      "For best results, use clear, legible floor plans with room labels and scale information. Include life-safety sheets when available so the AI can interpret device legends and notes on the drawing set.",
      "After upload, confirm project metadata on the Project Info step. Jurisdiction and occupancy type drive NFPA 72 rule evaluation during analysis.",
    ],
  },
  {
    id: "compliance-scores",
    title: "Understanding NFPA 72 compliance scores",
    category: "compliance",
    categoryLabel: "Compliance",
    readTime: "5 min read",
    excerpt:
      "How compliance checks work, what pass and review-needed mean, and when to involve a licensed PE.",
    body: [
      "The compliance engine evaluates your project against NFPA 72 requirements based on occupancy type, building size, and jurisdiction notes. Each rule is marked pass, review needed, or flagged for attention.",
      "A high compliance score does not replace licensed engineering review. AI output is intended for the estimation and bidding stage. Professional engineers should review results before permit submission.",
      "Use the Compliance Checklist tab in project results to walk through each section. Items marked review needed may require AHJ-specific interpretation or field verification.",
    ],
  },
  {
    id: "bom-editing",
    title: "Reviewing and editing your BOM",
    category: "exports",
    categoryLabel: "Exports & BOM",
    readTime: "4 min read",
    excerpt:
      "Navigate the material takeoff, adjust quantities, and prepare data for export.",
    body: [
      "The BOM / Material Takeoff tab groups devices, wiring, and conduit estimates by category. Quantities are generated from AI interpretation of your drawings and project inputs.",
      "You can review line items before exporting. Adjust counts or notes as needed to reflect field conditions or preferred manufacturers specified on the plan set.",
      "Export the takeoff as CSV for estimating tools, or include it in a PDF report alongside design recommendations and the compliance summary.",
    ],
  },
  {
    id: "export-reports",
    title: "Exporting PDF and CSV reports",
    category: "exports",
    categoryLabel: "Exports & BOM",
    readTime: "3 min read",
    excerpt:
      "Choose export formats, select report sections, and share results with your team.",
    body: [
      "Open the Exports tab in New Design results or on a saved project's Results tab. Choose PDF, CSV, or both, and select which sections to include: design recommendations, BOM, compliance checklist, and design narrative.",
      "PDF reports use a print-ready layout suitable for internal review or client proposals. CSV exports focus on BOM line items for spreadsheet-based estimating.",
      "Email sharing is available from the export panel so you can send completed reports to estimators, project managers, or your PE reviewer without leaving the platform.",
    ],
  },
  {
    id: "subscription-usage",
    title: "Managing your subscription and usage",
    category: "billing",
    categoryLabel: "Billing",
    readTime: "3 min read",
    excerpt:
      "Plan limits, usage tracking, upgrades, and invoice history for company admins.",
    body: [
      "Starter includes 5 designs per month, Professional includes 25, and Enterprise offers unlimited designs. Usage resets at the start of each billing cycle and is shown on your dashboard and Billing page.",
      "Company admins can upgrade plans from Billing & Subscription. Invoice history lists past charges and payment status.",
      "If you reach your monthly design limit, you will be prompted to upgrade before starting a new AI analysis. Estimators see read-only usage on their dashboard and should contact an admin to change plans.",
    ],
  },
];

export const SUPPORT_FAQS: FaqItem[] = [
  {
    id: "ai-design",
    question: "How does AI design generation work?",
    answer:
      "Our AI analyzes uploaded drawings and project metadata, then applies NFPA 72 logic to suggest device placement, BOM, and compliance status.",
  },
  {
    id: "file-formats",
    question: "What file formats can I upload?",
    answer:
      "You can upload PDF, PNG, JPG, JPEG, and WEBP files up to 50 MB per file. Multiple files can be uploaded for a single project.",
  },
  {
    id: "engineer-review",
    question: "Is the AI output a substitute for engineer review?",
    answer:
      "No. AI-generated designs are intended to accelerate preliminary planning. Final designs must be reviewed and approved by a licensed fire protection engineer before submission.",
  },
  {
    id: "monthly-limits",
    question: "How many designs can I generate per month?",
    answer:
      "Limits depend on your plan: Starter includes 5 designs/month, Professional includes 25, and Enterprise offers unlimited designs. Usage resets at the start of each billing cycle.",
  },
  {
    id: "bom-editing",
    question: "Can I edit the generated BOM?",
    answer:
      "Yes. You can manually adjust quantities, add items, or remove line items from the generated Bill of Materials before exporting to PDF or CSV.",
  },
  {
    id: "upgrading",
    question: "How do I upgrade my plan?",
    answer:
      "Go to Billing & Subscription in the sidebar, review available plans, and click Switch Plan or Upgrade Plan to change your subscription.",
  },
];

export const SUPPORT_CONTACT = {
  title: "Still need help?",
  description: "Our support team typically responds within 24 hours",
  ctaLabel: "Contact Support",
  email: "support@buildcodepro.com",
};

export const SUPPORT_TICKET_CATEGORIES = [
  { value: "technical", label: "Technical Issue" },
  { value: "account", label: "Account" },
  { value: "general", label: "General Inquiry" },
] as const;

export type SupportTicketCategory =
  (typeof SUPPORT_TICKET_CATEGORIES)[number]["value"];
