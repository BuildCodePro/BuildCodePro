import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiRequest } from "@/lib/queryClient";
import { API_ENDPOINTS } from "./api/endpoints";
import { QUERY_KEYS } from "./api/keys";

export interface ExportPreviewProject {
  id: string;
  company_id: string;
  created_by_user_id: string;
  name: string;
  address: string;
  jurisdiction: string;
  square_footage: number;
  number_of_floors: number;
  occupancy_type: string;
  sprinkler_system: boolean;
  elevator: boolean;
  duct_detectors: boolean;
  voice_evacuation: boolean;
  special_notes: string;
  status: string;
  display_status: string;
  jurisdiction_state: string;
  exported_at?: string;
  engineer_review_status?: string;
  engineer_reviewed_by_user_id?: string;
  engineer_reviewed_at?: string;
  engineer_notes?: string;
  permit_ready_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ExportPreviewStats {
  suggested_devices: number;
  suggested_devices_label: string;
  estimated_wiring_ft: number;
  estimated_wiring_label: string;
  compliance_status_pct: number;
  compliance_label: string;
  review_flags_count: number;
  review_flags_label: string;
}

export interface ExportPreviewRecommendationGroup {
  score_pct: number;
  device_count: number;
  flag_count: number;
  description: string;
  items: unknown[];
}

export interface ExportPreviewAnalysisResult {
  analysis_job_id: string;
  status: string;
  stats: ExportPreviewStats;
  recommendations: {
    initiating_devices: ExportPreviewRecommendationGroup;
    notification_appliances: ExportPreviewRecommendationGroup;
    control_equipment: ExportPreviewRecommendationGroup;
    review_required: ExportPreviewRecommendationGroup;
  };
  bom_summary: {
    devices: number;
    wiring: number;
    conduit: number;
    control_equipment: number;
    total_items: number;
  };
  total_cost: number;
}

export interface ExportPreviewBom {
  id: string;
  project_id: string;
  company_id: string;
  analysis_job_id: string;
  total_cost: number;
  currency: string;
  status: string;
  lines: unknown[];
  created_at: string;
  updated_at: string;
}

export interface ExportPreviewResponse {
  project: ExportPreviewProject;
  analysis_result: ExportPreviewAnalysisResult;
  bom: ExportPreviewBom | null;
  compliance_checklist: unknown;
  design_narrative: unknown;
  company_name: string;
  company_logo_url: string | null;
  nfpa_disclaimer: string;
}

export type CreateExportFormat = "pdf" | "csv" | "print" | "email";

export interface CreateExportRequest {
  format: CreateExportFormat;
  sections: {
    design_recommendations: boolean;
    bom: boolean;
    compliance_checklist: boolean;
    design_narrative: boolean;
    nfpa_disclaimer: boolean;
    company_branding: boolean;
  };
  recipient_email?: string;
}

export interface CreateExportResponse {
  export_id: string;
  project_id: string;
  format: string;
  file_name: string;
  download_url: string;
  expires_in: number;
  emailed_to?: string;
}

export interface ExportItem {
  id: string;
  format: string;
  file_name: string;
  exported_by_user_id: string;
  recipient_email?: string;
  created_at: string;
}

export interface ListExportsResponse {
  items: ExportItem[];
  total: number;
  page: number;
  page_size: number;
}

export interface ListExportsParams {
  page?: number;
  pageSize?: number;
}

const getExportPreviewApi = async (projectId: string): Promise<ExportPreviewResponse> => {
  return apiRequest<ExportPreviewResponse>(API_ENDPOINTS.PROJECTS.EXPORTS.PREVIEW(projectId), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
};

const createExportApi = async ({
  projectId,
  data,
}: {
  projectId: string;
  data: CreateExportRequest;
}): Promise<CreateExportResponse> => {
  return apiRequest<CreateExportResponse>(API_ENDPOINTS.PROJECTS.EXPORTS.CREATE(projectId), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

const listExportsApi = async (
  projectId: string,
  params: ListExportsParams = {},
): Promise<ListExportsResponse> => {
  const searchParams = new URLSearchParams();
  searchParams.set("page", String(params.page ?? 1));
  searchParams.set("page_size", String(params.pageSize ?? 20));

  return apiRequest<ListExportsResponse>(
    `${API_ENDPOINTS.PROJECTS.EXPORTS.LIST(projectId)}?${searchParams.toString()}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    },
  );
};

export const useExportPreviewQuery = (projectId?: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.PROJECTS.EXPORTS.PREVIEW(projectId as string),
    queryFn: () => getExportPreviewApi(projectId as string),
    enabled: !!projectId,
  });
};

export const useCreateExportMutation = (projectId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateExportRequest) =>
      createExportApi({ projectId: projectId as string, data }),
    onSuccess: () => {
      if (!projectId) return;
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PROJECTS.EXPORTS.LIST(projectId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PROJECTS.EXPORTS.PREVIEW(projectId),
      });
    },
  });
};

export const useListExportsQuery = (
  projectId?: string,
  params: ListExportsParams = {},
) => {
  return useQuery({
    queryKey: QUERY_KEYS.PROJECTS.EXPORTS.LIST(projectId as string, {
      page: params.page,
      pageSize: params.pageSize,
    }),
    queryFn: () => listExportsApi(projectId as string, params),
    enabled: !!projectId,
  });
};
