import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiRequest } from "@/lib/queryClient";
import { API_ENDPOINTS } from "./api/endpoints";
import { QUERY_KEYS } from "./api/keys";

export type ProjectReviewAction = "approve" | "request_changes" | "reject";

export interface ProjectReviewUser {
  id: string;
  name: string;
  role: string;
}

export interface PermitChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

export interface ProjectReviewResponse {
  project_id: string;
  engineer_review_status: string;
  engineer_notes: string | null;
  reviewed_by: ProjectReviewUser | null;
  reviewed_at: string | null;
  permit_checklist: PermitChecklistItem[];
  permit_ready_at: string | null;
  can_approve: boolean;
  can_request_changes: boolean;
  can_reject: boolean;
  can_mark_permit_ready: boolean;
}

export interface ProjectReviewActivityItem {
  id: string;
  project_id: string;
  actor: ProjectReviewUser | null;
  action: string;
  notes: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface ProjectReviewActivityResponse {
  items: ProjectReviewActivityItem[];
  total: number;
}

export interface ProjectReviewActivityParams {
  page?: number;
  pageSize?: number;
}

export interface SubmitProjectReviewDecisionDto {
  action: ProjectReviewAction;
  notes?: string;
}

export interface UpdateEngineerNotesDto {
  notes: string;
}

export interface UpdatePermitChecklistDto {
  items: PermitChecklistItem[];
}

const getProjectReviewApi = async (projectId: string): Promise<ProjectReviewResponse> => {
  return apiRequest<ProjectReviewResponse>(API_ENDPOINTS.PROJECTS.REVIEW.GET(projectId), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
};

const listProjectReviewActivityApi = async (
  projectId: string,
  params: ProjectReviewActivityParams = {},
): Promise<ProjectReviewActivityResponse> => {
  const searchParams = new URLSearchParams();

  if (params.page !== undefined) {
    searchParams.set("page", String(params.page));
  }
  if (params.pageSize !== undefined) {
    searchParams.set("page_size", String(params.pageSize));
  }

  const queryString = searchParams.toString();
  const endpoint = `${API_ENDPOINTS.PROJECTS.REVIEW.ACTIVITY(projectId)}${queryString ? `?${queryString}` : ""}`;

  return apiRequest<ProjectReviewActivityResponse>(endpoint, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
};

const submitProjectReviewDecisionApi = async ({
  projectId,
  data,
}: {
  projectId: string;
  data: SubmitProjectReviewDecisionDto;
}): Promise<ProjectReviewResponse> => {
  return apiRequest<ProjectReviewResponse>(API_ENDPOINTS.PROJECTS.REVIEW.SUBMIT_DECISION(projectId), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

const updateEngineerNotesApi = async ({
  projectId,
  data,
}: {
  projectId: string;
  data: UpdateEngineerNotesDto;
}): Promise<ProjectReviewResponse> => {
  return apiRequest<ProjectReviewResponse>(API_ENDPOINTS.PROJECTS.REVIEW.UPDATE_NOTES(projectId), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

const updatePermitChecklistApi = async ({
  projectId,
  data,
}: {
  projectId: string;
  data: UpdatePermitChecklistDto;
}): Promise<ProjectReviewResponse> => {
  return apiRequest<ProjectReviewResponse>(API_ENDPOINTS.PROJECTS.REVIEW.UPDATE_PERMIT_CHECKLIST(projectId), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

const markProjectPermitReadyApi = async (projectId: string): Promise<ProjectReviewResponse> => {
  return apiRequest<ProjectReviewResponse>(API_ENDPOINTS.PROJECTS.REVIEW.MARK_PERMIT_READY(projectId), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
};

export const useProjectReviewQuery = (projectId?: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.PROJECTS.REVIEW.GET(projectId as string),
    queryFn: () => getProjectReviewApi(projectId as string),
    enabled: !!projectId,
  });
};

export const useProjectReviewActivityQuery = (
  projectId?: string,
  params: ProjectReviewActivityParams = {},
) => {
  return useQuery({
    queryKey: QUERY_KEYS.PROJECTS.REVIEW.ACTIVITY(projectId as string, {
      page: params.page,
      pageSize: params.pageSize,
    }),
    queryFn: () => listProjectReviewActivityApi(projectId as string, params),
    enabled: !!projectId,
  });
};

export const useSubmitProjectReviewDecisionMutation = (projectId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SubmitProjectReviewDecisionDto) =>
      submitProjectReviewDecisionApi({ projectId: projectId as string, data }),
    onSuccess: (data) => {
      if (!projectId) return;
      queryClient.setQueryData(QUERY_KEYS.PROJECTS.REVIEW.GET(projectId), data);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECTS.REVIEW.GET(projectId) });
    },
  });
};

export const useUpdateEngineerNotesMutation = (projectId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateEngineerNotesDto) =>
      updateEngineerNotesApi({ projectId: projectId as string, data }),
    onSuccess: (data) => {
      if (!projectId) return;
      queryClient.setQueryData(QUERY_KEYS.PROJECTS.REVIEW.GET(projectId), data);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECTS.REVIEW.GET(projectId) });
    },
  });
};

export const useUpdatePermitChecklistMutation = (projectId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdatePermitChecklistDto) =>
      updatePermitChecklistApi({ projectId: projectId as string, data }),
    onSuccess: (data) => {
      if (!projectId) return;
      queryClient.setQueryData(QUERY_KEYS.PROJECTS.REVIEW.GET(projectId), data);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECTS.REVIEW.GET(projectId) });
    },
  });
};

export const useMarkProjectPermitReadyMutation = (projectId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => markProjectPermitReadyApi(projectId as string),
    onSuccess: (data) => {
      if (!projectId) return;
      queryClient.setQueryData(QUERY_KEYS.PROJECTS.REVIEW.GET(projectId), data);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECTS.REVIEW.GET(projectId) });
    },
  });
};
