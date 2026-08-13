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

export type BulkDirectUploadDto = {
    projectId: string;
    files: File[];
};

// --- Presigned upload types ---
export interface PresignDrawingUploadRequest {
    file_name: string;
    content_type: string;
    file_size: number;
}

export interface PresignDrawingUploadResponse {
    drawing_id: string;
    upload_url: string;
    file_name: string;
}

export interface BulkPresignDrawingUploadRequest {
    files: PresignDrawingUploadRequest[];
}

export interface BulkPresignDrawingUploadResponse {
    items: PresignDrawingUploadResponse[];
}

// --- Complete-batch types ---
export interface BulkCompleteDrawingRequest {
    drawing_ids: string[];
}

export interface CompletedDrawingItem {
    drawing_id: string;
    success: boolean;
    drawing: ProjectDrawing | null;
    error_message: string | null;
}

export interface BulkCompleteDrawingResponse {
    items: CompletedDrawingItem[];
    completed_count: number;
    failed_count: number;
}

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

export interface DrawingListResponse {
    items: ProjectDrawing[];
    total: number;
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

const bulkDirectUploadApi = async ({
    projectId,
    files,
}: BulkDirectUploadDto): Promise<DrawingListResponse> => {
    const formData = new FormData();
    for (const file of files) {
        formData.append('upload_files', file);
    }
    return apiRequest<DrawingListResponse>(API_ENDPOINTS.PROJECTS.DRAWINGS.BULK_UPLOAD(projectId), {
        method: 'POST',
        body: formData,
    });
};

const bulkPresignUploadApi = async ({
    projectId,
    payload,
}: {
    projectId: string;
    payload: BulkPresignDrawingUploadRequest;
}): Promise<PresignDrawingUploadResponse[]> => {
    const raw = await apiRequest<BulkPresignDrawingUploadResponse | PresignDrawingUploadResponse[]>(
        API_ENDPOINTS.PROJECTS.DRAWINGS.UPLOAD_BATCH(projectId),
        {
            method: 'POST',
            body: JSON.stringify(payload),
        },
    );
    // Handle both bare-array and envelope `{ items: [] }` shapes
    return Array.isArray(raw) ? raw : (raw?.items ?? []);
};

const bulkCompleteUploadApi = async ({
    projectId,
    payload,
}: {
    projectId: string;
    payload: BulkCompleteDrawingRequest;
}): Promise<BulkCompleteDrawingResponse> => {
    return apiRequest<BulkCompleteDrawingResponse>(
        API_ENDPOINTS.PROJECTS.DRAWINGS.COMPLETE_BATCH(projectId),
        {
            method: 'POST',
            body: JSON.stringify(payload),
        },
    );
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

export const useBulkDirectUploadMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: bulkDirectUploadApi,
        onSuccess: (_response, variables) => {
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.PROJECTS.DRAWINGS.LIST(variables.projectId),
            });
        },
    });
};

export const useBulkPresignUploadMutation = () => {
    return useMutation({
        mutationFn: bulkPresignUploadApi,
    });
};

export const useBulkCompleteMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: bulkCompleteUploadApi,
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