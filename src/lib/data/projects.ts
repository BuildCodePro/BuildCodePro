import type { DashboardProject } from "@/types/dashboard";

export const projectsList: DashboardProject[] = [
  {
    id: "1",
    name: "Riverside Mall — Bldg A",
    address: "245 Commerce Blvd, TX",
    occupancyType: "Assembly",
    status: "completed",
    lastUpdated: "Jun 9, 2025",
    createdAt: "Jun 9, 2025",
    imageUrl: "/images/projects/project-1.jpg",
  },
  {
    id: "2",
    name: "Greenfield Office Tower",
    address: "880 Market St, CA",
    occupancyType: "Business",
    status: "review-needed",
    lastUpdated: "Jun 8, 2025",
    createdAt: "Jun 8, 2025",
    imageUrl: "/images/projects/project-2.jpg",
  },
  {
    id: "3",
    name: "Harbor View Apartments",
    address: "12 Bayfront Dr, FL",
    occupancyType: "Residential",
    status: "processing",
    lastUpdated: "Jun 7, 2025",
    createdAt: "Jun 7, 2025",
    imageUrl: "/images/projects/project-3.jpg",
  },
  {
    id: "4",
    name: "Eastside High School",
    address: "400 Campus Rd, OH",
    occupancyType: "Educational",
    status: "draft",
    lastUpdated: "Jun 6, 2025",
    createdAt: "Jun 6, 2025",
    imageUrl: "/images/projects/project-4.jpg",
  },
  {
    id: "5",
    name: "Metro Logistics Hub",
    address: "19 Industrial Pkwy, NJ",
    occupancyType: "Industrial",
    status: "exported",
    lastUpdated: "Jun 5, 2025",
    createdAt: "Jun 5, 2025",
    imageUrl: "/images/projects/project-5.jpg",
  },
  {
    id: "6",
    name: "Sunset Medical Center",
    address: "77 Lakeview Ave, MN",
    occupancyType: "Mercantile",
    status: "completed",
    lastUpdated: "Jun 4, 2025",
    createdAt: "Jun 4, 2025",
    imageUrl: "/images/projects/project-6.jpg",
  },
];

export const PROJECT_STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "completed", label: "Completed" },
  { value: "review-needed", label: "Review Needed" },
  { value: "processing", label: "Processing" },
  { value: "draft", label: "Draft" },
  { value: "exported", label: "Exported" },
] as const;

export const PROJECT_OCCUPANCY_FILTER_OPTIONS = [
  { value: "all", label: "All Occupancy" },
  { value: "Assembly", label: "Assembly" },
  { value: "Business", label: "Business" },
  { value: "Residential", label: "Residential" },
  { value: "Educational", label: "Educational" },
  { value: "Industrial", label: "Industrial" },
  { value: "Mercantile", label: "Mercantile" },
] as const;

export const PROJECT_DATE_FILTER_OPTIONS = [
  { value: "created", label: "Date Created" },
  { value: "updated", label: "Last Updated" },
] as const;

export const PROJECT_JURISDICTION_FILTER_OPTIONS = [
  { value: "all", label: "Jurisdiction" },
  { value: "tx", label: "Texas" },
  { value: "ca", label: "California" },
  { value: "fl", label: "Florida" },
  { value: "oh", label: "Ohio" },
  { value: "nj", label: "New Jersey" },
] as const;
