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
  square_footage?: number;
  number_of_floors?: number;
  occupancy_type?: string;
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
  square_footage: number;
  number_of_floors: number;
  occupancy_type: string;
  sprinkler_system: boolean;
  elevator: boolean;
  duct_detectors: boolean;
  voice_evacuation: boolean;
  special_notes: string;
  status: string;
  display_status: ProjectStatus;
  engineer_review_status?: string;
  created_at: string;
  updated_at: string;
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

export function mapProjectDtoToDashboardProject(project: ProjectDto): DashboardProject {
  return {
    id: project.id,
    name: project.name,
    address: project.address || project.jurisdiction || "—",
    occupancyType: project.occupancy_type || "—",
    status: project.status as ProjectStatus,
    display_status: project.display_status,
    lastUpdated: project.updated_at,
    createdAt: project.created_at,
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

// --- TanStack Query Hooks ---

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
