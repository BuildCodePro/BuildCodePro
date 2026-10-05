import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { API_ENDPOINTS } from './api/endpoints';
import { QUERY_KEYS } from './api/keys';
import type { DashboardProject, ProjectStatus } from '@/types/dashboard';

// --- DTOs ---

export type CreateProjectDto = {
  name: string;
  address?: string;
  jurisdiction?: string;
  ibc_edition?: string;
  ifc_edition?: string;
  nfpa72_edition?: string;
  square_footage?: number;
  number_of_floors?: number;
  occupancy_type?: string;
  system_scope?: string;
  bid_to_minimum_code?: boolean;
  monitoring_communication_type?: string;
  preferred_manufacturer?: string;
  preferred_panel_family?: string;
  sprinkler_system?: boolean;
  elevator?: boolean;
  duct_detectors?: boolean;
  voice_evacuation?: boolean;
  special_notes?: string;
};

export interface ProjectDto {
  id: string;
  company_id: string;
  data?: {
    id: string;
  }
  created_by_user_id: string;
  name: string;
  address: string;
  jurisdiction: string;
  ibc_edition: string | null;
  ifc_edition: string | null;
  nfpa72_edition: string | null;
  square_footage: number;
  number_of_floors: number;
  occupancy_type: string;
  system_scope: string;
  bid_to_minimum_code: boolean;
  monitoring_communication_type: string | null;
  preferred_manufacturer: string | null;
  preferred_panel_family: string | null;
  sprinkler_system: boolean;
  elevator: boolean;
  duct_detectors: boolean;
  voice_evacuation: boolean;
  special_notes: string;
  status: string;
  display_status: ProjectStatus;
  workflow_status: ProjectStatus;
  engineer_review_status?: string;
  current_step?: string;
  created_at: string;
  updated_at: string;
  engineer_notes: string;
  engineer_reviewed_at: string;
  is_design_locked?: boolean;
  design_locked_at?: string | null;
  review_acknowledgments?: string[];
  code_context?: {
    permit_date: string;
    match_level: string;
    parsed_city: string | null;
    parsed_state: string | null;
    parsed_postal_code: string | null;
    ahj_name: string;
    ibc_edition: string;
    ifc_edition: string;
    nfpa72_edition: string;
    amendment_label: string;
    source_citation: string;
    resolved_summary: string;
    jurisdiction_label: string;
  } | null;
}

export interface PaginatedProjectsResponse {
  items: ProjectDto[];
  total: number;
  page: number;
  page_size: number;
}

export interface GetProjectsParams {
  page?: number;
  page_size?: number;
  search?: string;
  status?: string;
  occupancy_type?: string;
  jurisdiction_state?: string;
}

export interface SendForReviewResponse {
  id: string;
  workflow_status: 'under_review';
  message?: string;
}


export interface EngineerItem {
  id: string;
  name: string;
  email: string;
}

export interface EngineersResponse {
  items: EngineerItem[];
}

export interface SendForReviewRequest {
  engineer_user_id: string;
  acknowledgments: string[];
}

export const REVIEW_ACKNOWLEDGMENTS = [
  {
    id: "qualified_person_responsible",
    label:
      "A qualified person remains responsible for confirming project-specific requirements.",
  },
  {
    id: "not_a_sealed_document",
    label: "This package is AI-assisted and is not a sealed engineering document.",
  },
  {
    id: "assumptions_reviewed",
    label: "I have reviewed the listed design assumptions and calculation sources.",
  },
] as const;

// export type SendForReviewResponse = ProjectDto;


export function mapProjectDtoToDashboardProject(project: ProjectDto): DashboardProject {
  return {
    id: project.id,
    name: project.name,
    address: project.address || project.jurisdiction || "—",
    occupancyType: project.occupancy_type || "—",
    status: project.status as ProjectStatus,
    display_status: project.display_status,
    workflow_status: project.workflow_status,
    lastUpdated: project.updated_at,
    createdAt: project.created_at,
    jurisdiction: project.jurisdiction,
    ibc_edition: project.ibc_edition,
    ifc_edition: project.ifc_edition,
    nfpa72_edition: project.nfpa72_edition,
    square_footage: project.square_footage,
    number_of_floors: project.number_of_floors,
    sprinkler_system: project.sprinkler_system,
    elevator: project.elevator,
    duct_detectors: project.duct_detectors,
    voice_evacuation: project.voice_evacuation,
    special_notes: project.special_notes,
    system_scope: project.system_scope,
    bid_to_minimum_code: project.bid_to_minimum_code,
    monitoring_communication_type: project.monitoring_communication_type,
    preferred_manufacturer: project.preferred_manufacturer,
    preferred_panel_family: project.preferred_panel_family,
    current_step: project.current_step,
  };
}

// --- API Functions ---

const createProjectApi = async (data: CreateProjectDto): Promise<ProjectDto> => {
  return apiRequest<ProjectDto>(API_ENDPOINTS.PROJECTS.CREATE_PROJECT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
};

const getProjectsApi = async (params?: GetProjectsParams): Promise<PaginatedProjectsResponse> => {
  let url = API_ENDPOINTS.PROJECTS.GET_PROJECTS;

  if (params) {
    const searchParams = new URLSearchParams();
    if (params.page !== undefined) searchParams.append('page', params.page.toString());
    if (params.page_size !== undefined) searchParams.append('page_size', params.page_size.toString());

    if (params.search && params.search.trim() !== '') {
      searchParams.append('search', params.search.trim());
    }
    if (params.status && params.status !== 'all') {
      searchParams.append('status', params.status);
    }
    if (params.occupancy_type && params.occupancy_type !== 'all') {
      searchParams.append('occupancy_type', params.occupancy_type);
    }
    if (params.jurisdiction_state && params.jurisdiction_state !== 'all') {
      searchParams.append('jurisdiction_state', params.jurisdiction_state);
    }

    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  return apiRequest<PaginatedProjectsResponse>(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
};

const getProjectByIdApi = async (id: string): Promise<ProjectDto> => {
  return apiRequest<ProjectDto>(API_ENDPOINTS.PROJECTS.GET_SINGLE_PROJECT(id), {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
};

const sendForReviewApi = async (
  projectId: string,
  payload: SendForReviewRequest,
): Promise<SendForReviewResponse> => {
  return apiRequest<SendForReviewResponse>(
    API_ENDPOINTS.PROJECTS.SEND_FOR_REVIEW(projectId),
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    },
  );
};


// --- Types ---


// --- API Function ---

const getEngineersApi = async (): Promise<EngineersResponse> => {
  return apiRequest<EngineersResponse>(API_ENDPOINTS.TEAM.GET_ENGINEERS);
};


export const useCreateProjectMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProjectApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECTS.LIST() });
    },
  });
};

export const useGetProjectsQuery = (params?: GetProjectsParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.PROJECTS.LIST(params as Record<string, unknown>),
    queryFn: () => getProjectsApi(params),
  });
};

export const useGetProjectQuery = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.PROJECTS.DETAIL(id),
    queryFn: () => getProjectByIdApi(id),
    enabled: !!id,
  });
};

export const useSendForReviewMutation = (projectId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SendForReviewRequest) => {
      if (!projectId) {
        throw new Error('Project is missing. Please open a valid project first.');
      }
      return sendForReviewApi(projectId, payload);
    },
    onSuccess: () => {
      if (!projectId) return;

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PROJECTS.DETAIL(projectId),
      });

      queryClient.invalidateQueries({
        queryKey: ['projects', 'list'],
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTIFICATIONS.LIST(),
      });
    },
  });
}

export const useEngineersQuery = () => {
  return useQuery({
    queryKey: QUERY_KEYS.TEAM.GET_ENGINEERS,
    queryFn: getEngineersApi,
  });
};