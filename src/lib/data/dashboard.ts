import type { DashboardProject, DashboardStat, PlanUsage } from "@/types/dashboard";

export const planUsage: PlanUsage = {
  planName: "Professional Plan",
  used: 14,
  total: 25,
};

export const dashboardStats: DashboardStat[] = [
  {
    id: "active-projects",
    label: "Active Projects",
    value: "12",
    change: { text: "↑ 3 this month", variant: "success" },
  },
  {
    id: "designs-generated",
    label: "Designs Generated",
    value: "47",
    change: { text: "↑ 8 this week", variant: "success" },
  },
  {
    id: "monthly-usage",
    label: "Monthly Usage",
    value: "14 / 25",
    change: { text: "56% of plan used", variant: "neutral" },
    progress: 56,
  },
  {
    id: "pending-review",
    label: "Pending Review",
    value: "3",
    change: { text: "⚠ Needs attention", variant: "warning" },
  },
];

export const recentProjects: DashboardProject[] = [
  {
    id: "1",
    name: "Riverside Mall — Bldg A",
    address: "Austin, TX",
    occupancyType: "assembly",
    status: "completed",
    display_status: "completed",
    lastUpdated: "Jun 9, 2025",
  },
  {
    id: "2",
    name: "Greenfield Office Tower",
    address: "Sacramento, CA",
    occupancyType: "Business",
    status: "review_needed",
    display_status: "review_needed",
    lastUpdated: "Jun 8, 2025",
  },
  {
    id: "3",
    name: "Harbor View Apartments",
    address: "Tampa, FL",
    occupancyType: "Residential",
    status: "processing",
    display_status: "processing",
    lastUpdated: "Jun 7, 2025",
  },
  {
    id: "4",
    name: "Eastside High School",
    address: "Columbus, OH",
    occupancyType: "Educational",
    status: "draft",
    display_status: "draft",
    lastUpdated: "Jun 6, 2025",
  },
  {
    id: "5",
    name: "Metro Logistics Hub",
    address: "Newark, NJ",
    occupancyType: "Industrial",
    status: "exported",
    display_status: "exported",
    lastUpdated: "Jun 5, 2025",
  },
];
