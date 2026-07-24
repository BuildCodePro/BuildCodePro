import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { API_ENDPOINTS } from './api/endpoints';
import { QUERY_KEYS } from './api/keys';

// --- Types ---
// TODO: replace with actual Schemas from the Swagger doc

export interface ProjectDrawing {
    id: string;
    project_id: string;
    file_name?: string;
    file_url?: string;
    file_size?: number;
    mime_type?: string;
    uploaded_by?: string;
    created_at?: string;
    updated_at?: string;
}

export type UploadDrawingDto = {
    projectId: string;
    file: File;
};

// --- API Response Types ---

export interface DrawingResponse {
    message?: string;
    data?: ProjectDrawing;
}

export interface DrawingsListResponse {
    message?: string;
    data?: ProjectDrawing[];
    meta?: {
        total?: number;
        page?: number;
        limit?: number;
        totalPages?: number;
    };
}

// --- API Functions ---

const uploadDrawingApi = async ({
    projectId,
    file,
}: UploadDrawingDto): Promise<DrawingResponse> => {
    const formData = new FormData();
    formData.append('upload_file', file);

    return apiRequest<DrawingResponse>(API_ENDPOINTS.PROJECTS.DRAWINGS.UPLOAD_DRAWING(projectId), {
        method: 'POST',
        body: formData,
        // Do NOT set Content-Type here — let the browser set the multipart boundary
    });
};

const getDrawingsApi = async (projectId: string): Promise<DrawingsListResponse> => {
    return apiRequest<DrawingsListResponse>(API_ENDPOINTS.PROJECTS.DRAWINGS.GET_DRAWINGS(projectId));
};

const getSingleDrawingApi = async (
    projectId: string,
    drawingId: string,
): Promise<DrawingResponse> => {
    return apiRequest<DrawingResponse>(
        API_ENDPOINTS.PROJECTS.DRAWINGS.GET_SINGLE_DRAWING(projectId, drawingId),
    );
};

const deleteDrawingApi = async (projectId: string, drawingId: string): Promise<void> => {
    return apiRequest<void>(API_ENDPOINTS.PROJECTS.DRAWINGS.DELETE_DRAWING(projectId, drawingId), {
        method: 'DELETE',
    });
};

// --- TanStack Query Hooks ---

export const useUploadDrawingMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: uploadDrawingApi,
        onSuccess: (_response, variables) => {
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.PROJECTS.DRAWINGS.LIST(variables.projectId),
            });
        },
    });
};

export const useProjectDrawingsQuery = (projectId: string, enabled: boolean = true) => {
    return useQuery({
        queryKey: QUERY_KEYS.PROJECTS.DRAWINGS.LIST(projectId),
        queryFn: () => getDrawingsApi(projectId),
        enabled: enabled && !!projectId,
    });
};

export const useSingleDrawingQuery = (
    projectId: string,
    drawingId: string,
    enabled: boolean = true,
) => {
    return useQuery({
        queryKey: QUERY_KEYS.PROJECTS.DRAWINGS.DETAIL(projectId, drawingId),
        queryFn: () => getSingleDrawingApi(projectId, drawingId),
        enabled: enabled && !!projectId && !!drawingId,
    });
};

export const useDeleteDrawingMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ projectId, drawingId }: { projectId: string; drawingId: string }) =>
            deleteDrawingApi(projectId, drawingId),
        onSuccess: (_response, variables) => {
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.PROJECTS.DRAWINGS.LIST(variables.projectId),
            });
        },
    });
};