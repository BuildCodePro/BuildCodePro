import type { LucideIcon } from "lucide-react";
import {
  BrainCircuit,
  ClipboardCheck,
  FileOutput,
  Package,
  Upload,
  WandSparkles,
} from "lucide-react";

export const LANDING_NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
] as const;

export const LANDING_STATS = [
  { value: "Minutes", label: "Not days — average estimate turnaround" },
  { value: "NFPA 72", label: "Compliant design logic built in" },
  { value: "50 MB", label: "Per file upload limit" },
  { value: "PDF + CSV", label: "Bid-ready export formats" },
] as const;

export interface LandingFeature {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export const LANDING_FEATURES: LandingFeature[] = [
  {
    id: "ai-design",
    title: "AI Design Engine",
    description:
      "Analyze PDF and image drawings, interpret project metadata, and receive NFPA 72 device placement suggestions with confidence scoring.",
    icon: BrainCircuit,
  },
  {
    id: "bom",
    title: "Material Takeoff",
    description:
      "Auto-generate device counts, wiring quantities, conduit estimates, and category-grouped BOM line items for accurate bids.",
    icon: Package,
  },
  {
    id: "compliance",
    title: "Compliance Validation",
    description:
      "Occupancy-based NFPA rules, jurisdiction notes, and pass / review-needed flags so nothing slips through before PE review.",
    icon: ClipboardCheck,
  },
  {
    id: "exports",
    title: "Export Center",
    description:
      "Deliver PDF reports, CSV takeoffs, print layouts, and email sharing — everything estimators need to submit proposals fast.",
    icon: FileOutput,
  },
];

export const LANDING_STEPS = [
  {
    id: "upload",
    step: 1,
    title: "Upload Drawings",
    description:
      "Drop PDF, PNG, JPG, JPEG, or WEBP floor plans. Multiple files per project, up to 50 MB each.",
    icon: Upload,
    highlights: [
      "Drag-and-drop or browse files",
      "Life-safety sheets supported",
      "Instant upload validation",
    ],
  },
  {
    id: "project-info",
    step: 2,
    title: "Enter Project Info",
    description:
      "Address, jurisdiction, occupancy, square footage, floors, and optional building features drive code logic.",
    icon: ClipboardCheck,
    highlights: [
      "Jurisdiction & occupancy rules",
      "Sprinkler, elevator, voice evac flags",
      "Required fields checklist",
    ],
  },
  {
    id: "ai-analysis",
    step: 3,
    title: "Run AI Analysis",
    description:
      "The engine interprets drawings, applies NFPA 72 rules, and generates recommendations, BOM, and compliance output.",
    icon: WandSparkles,
    highlights: [
      "Drawing interpretation",
      "NFPA 72 device placement logic",
      "Live progress tracking",
    ],
  },
  {
    id: "results",
    step: 4,
    title: "Review & Export",
    description:
      "Refine results, track version history, and export bid-ready PDF and CSV packages in minutes.",
    icon: FileOutput,
    highlights: [
      "Design, BOM & compliance tabs",
      "Version history & activity logs",
      "PDF, CSV, print & email export",
    ],
  },
] as const;

export const LANDING_WORKFLOW_OUTCOMES = [
  { value: "< 15 min", label: "Typical time to first results" },
  { value: "4 deliverables", label: "Design, BOM, compliance & narrative" },
  { value: "1 workflow", label: "From upload to bid-ready export" },
] as const;

export const LANDING_AUDIENCES = [
  {
    id: "contractors",
    title: "Fire Alarm Contractors",
    description:
      "Win more bids with faster pre-bid estimates when engineering resources are limited.",
  },
  {
    id: "estimators",
    title: "Estimators",
    description:
      "Generate BOMs, get code guidance, and export reports without manual takeoff spreadsheets.",
  },
  {
    id: "engineers",
    title: "Professional Engineers",
    description:
      "Review AI output, approve designs, and support permit submission with structured checklists.",
  },
] as const;

export const LANDING_POPULAR_PLAN_ID = "professional";
