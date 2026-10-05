import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest, BASE_URL } from "@/lib/queryClient";
import { useAuthStore } from "@/store/auth-store";
import type { ProjectIntakeResponse } from "@/types/project-intake";
import { API_ENDPOINTS } from "./api/endpoints";
import { QUERY_KEYS } from "./api/keys";
import type { CreateProjectDto, ProjectDto } from "./projectService";

const INTAKE_RECONNECT_BASE_MS = 1000;
const INTAKE_RECONNECT_MAX_MS = 30000;

export const createDraftProjectApi = async (): Promise<ProjectDto> =>
  apiRequest<ProjectDto>(API_ENDPOINTS.PROJECTS.CREATE_DRAFT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

const getProjectIntakeApi = async (projectId: string): Promise<ProjectIntakeResponse> =>
  apiRequest<ProjectIntakeResponse>(API_ENDPOINTS.PROJECTS.INTAKE.GET(projectId), { method: "GET" });

const retryProjectIntakeApi = async (projectId: string): Promise<ProjectIntakeResponse> =>
  apiRequest<ProjectIntakeResponse>(API_ENDPOINTS.PROJECTS.INTAKE.RETRY(projectId), { method: "POST" });

const confirmProjectInfoApi = async ({ projectId, payload }: { projectId: string; payload: CreateProjectDto }): Promise<ProjectDto> =>
  apiRequest<ProjectDto>(API_ENDPOINTS.PROJECTS.CONFIRM_INFO(projectId), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

export const useCreateDraftProjectMutation = () => useMutation({ mutationFn: createDraftProjectApi });

export const useConfirmProjectInfoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: confirmProjectInfoApi,
    onSuccess: (_project, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECTS.LIST() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECTS.DETAIL(variables.projectId) });
    },
  });
};

export const useRetryProjectIntakeMutation = (projectId: string | null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => retryProjectIntakeApi(projectId ?? ""),
    onSuccess: (intakeResponse) => {
      if (projectId) queryClient.setQueryData(QUERY_KEYS.PROJECTS.INTAKE(projectId), intakeResponse);
    },
  });
};

export function useProjectIntake(projectId: string | null): { intake: ProjectIntakeResponse | undefined; activity: string | null } {
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((state) => state.accessToken);
  const [activity, setActivity] = useState<string | null>(null);
  const { data: intake } = useQuery({
    queryKey: QUERY_KEYS.PROJECTS.INTAKE(projectId ?? ""),
    queryFn: () => getProjectIntakeApi(projectId ?? ""),
    enabled: Boolean(projectId),
  });
  const isSettled = intake?.status === "ready" || intake?.status === "failed";
  useEffect(() => {
    if (!projectId || !accessToken || isSettled) return;
    let socket: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let reconnectAttempt = 0;
    let isDisposed = false;
    const connect = () => {
      const wsBase = BASE_URL.replace(/^https/, "wss").replace(/^http/, "ws");
      socket = new WebSocket(`${wsBase}${API_ENDPOINTS.PROJECTS.INTAKE.LIVE(projectId)}?token=${accessToken}`);
      socket.onopen = () => {
        reconnectAttempt = 0;
      };
      socket.onmessage = (message) => {
        try {
          const payload = JSON.parse(message.data) as { event?: string; activity?: string };
          if (payload.event === "ping") {
            socket?.send("ping");
            return;
          }
          if (payload.event === "project.intake_progress") {
            setActivity(payload.activity ?? null);
            return;
          }
          if (payload.event === "project.intake_ready" || payload.event === "project.intake_snapshot") {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECTS.INTAKE(projectId) });
          }
        } catch {
          return;
        }
      };
      socket.onclose = () => {
        if (isDisposed) return;
        const delay = Math.min(INTAKE_RECONNECT_BASE_MS * 2 ** reconnectAttempt, INTAKE_RECONNECT_MAX_MS);
        reconnectAttempt += 1;
        reconnectTimer = setTimeout(connect, delay);
      };
      socket.onerror = () => socket?.close();
    };
    connect();
    return () => {
      isDisposed = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      socket?.close();
    };
  }, [projectId, accessToken, isSettled, queryClient]);
  return { intake, activity };
}
