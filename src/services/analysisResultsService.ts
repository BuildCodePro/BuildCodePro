import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { API_ENDPOINTS } from './api/endpoints';
import { QUERY_KEYS } from './api/keys';
import type {
  ComplianceChecklistApiResponse,
  DesignNarrativeApiResponse,
  UpdateDesignNarrativePayload
} from '@/types/analysis-results';

// --- API Functions ---

const getComplianceChecklistApi = async (projectId: string): Promise<ComplianceChecklistApiResponse> => {
  return apiRequest<ComplianceChecklistApiResponse>(API_ENDPOINTS.PROJECTS.ANALYSIS.COMPLIANCE(projectId), {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
};

const regenerateComplianceChecklistApi = async (projectId: string): Promise<ComplianceChecklistApiResponse> => {
  return apiRequest<ComplianceChecklistApiResponse>(API_ENDPOINTS.PROJECTS.ANALYSIS.COMPLIANCE_REGENERATE(projectId), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
};
const cancelAiAnalaysis = async (projectId: string, jobId: string): Promise<ComplianceChecklistApiResponse> => {
  return apiRequest<ComplianceChecklistApiResponse>(API_ENDPOINTS.PROJECTS.ANALYSIS.CANCEL(projectId, jobId), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
};
const retryAiAnalaysis = async (projectId: string, jobId: string): Promise<ComplianceChecklistApiResponse> => {
  return apiRequest<ComplianceChecklistApiResponse>(API_ENDPOINTS.PROJECTS.ANALYSIS.RETRY(projectId, jobId), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
};

const getDesignNarrativeApi = async (projectId: string): Promise<DesignNarrativeApiResponse> => {
  return apiRequest<DesignNarrativeApiResponse>(API_ENDPOINTS.PROJECTS.ANALYSIS.NARRATIVE(projectId), {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
};

const regenerateDesignNarrativeApi = async (projectId: string): Promise<DesignNarrativeApiResponse> => {
  return apiRequest<DesignNarrativeApiResponse>(API_ENDPOINTS.PROJECTS.ANALYSIS.NARRATIVE_REGENERATE(projectId), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
};

const updateDesignNarrativeApi = async (projectId: string, data: UpdateDesignNarrativePayload): Promise<DesignNarrativeApiResponse> => {
  return apiRequest<DesignNarrativeApiResponse>(API_ENDPOINTS.PROJECTS.ANALYSIS.NARRATIVE(projectId), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
};

// --- React Query Hooks ---

export const useGetComplianceChecklistQuery = (projectId?: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.PROJECTS.ANALYSIS.COMPLIANCE(projectId as string),
    queryFn: () => getComplianceChecklistApi(projectId as string),
    enabled: !!projectId,
  });
};

export const useRegenerateComplianceChecklistMutation = (projectId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => regenerateComplianceChecklistApi(projectId as string),
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEYS.PROJECTS.ANALYSIS.COMPLIANCE(projectId as string), data);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECTS.ANALYSIS.COMPLIANCE(projectId as string) });
    },
  });
};

export const useCancelAiAnalysis = (projectId: string, jobId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cancelAiAnalaysis(projectId, jobId),
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEYS.PROJECTS.ANALYSIS.CANCEL(projectId, jobId), data);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECTS.ANALYSIS.CANCEL(projectId, jobId) });
    },
  });
};
export const useRetryAiAnalysis = (projectId: string, jobId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => retryAiAnalaysis(projectId, jobId),
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEYS.PROJECTS.ANALYSIS.RETRY(projectId, jobId), data);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECTS.ANALYSIS.RETRY(projectId, jobId) });
    },
  });
};

export const useGetDesignNarrativeQuery = (projectId?: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.PROJECTS.ANALYSIS.NARRATIVE(projectId as string),
    queryFn: () => getDesignNarrativeApi(projectId as string),
    enabled: !!projectId,
  });
};

export const useRegenerateDesignNarrativeMutation = (projectId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => regenerateDesignNarrativeApi(projectId as string),
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEYS.PROJECTS.ANALYSIS.NARRATIVE(projectId as string), data);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECTS.ANALYSIS.NARRATIVE(projectId as string) });
    },
  });
};

export const useUpdateDesignNarrativeMutation = (projectId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateDesignNarrativePayload) => updateDesignNarrativeApi(projectId as string, data),
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEYS.PROJECTS.ANALYSIS.NARRATIVE(projectId as string), data);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECTS.ANALYSIS.NARRATIVE(projectId as string) });
    },
  });
};
