import { QueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth-store';

export const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://buildcapi.tekxai.com/api/v1';

function handleAuthFailure() {
  useAuthStore.getState().clearSession();

  if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
}

// Custom fetch function with token handling and refresh logic
async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const token = useAuthStore.getState().accessToken;

  const headers = new Headers(options.headers);

  // Bypass ngrok's browser warning interstitial page (ERR_NGROK_6024)
  headers.set('ngrok-skip-browser-warning', 'true');
  headers.set('accept', 'application/json');

  if (token) {
    headers.set('authorization', `Bearer ${token}`);
  }

  // Automatically set Content-Type if body is present
  if (options.body && typeof options.body === 'string') {
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
  }

  // Merge headers
  const config: RequestInit = {
    ...options,
    headers,
  };

  let response = await fetch(url, config);

  // Handle 401 errors with token refresh
  if (response.status === 401) {
    try {
      // Try to refresh the token
      const refreshResponse = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({}),
      });

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        const newAccessToken =
          refreshData?.payload?.accessToken ||
          refreshData?.accessToken ||
          refreshData?.token;

        if (newAccessToken) {
          useAuthStore.getState().setAccessToken(newAccessToken);

          headers.set('authorization', `Bearer ${newAccessToken}`);
          response = await fetch(url, { ...config, headers });

          // If the retried request is still unauthorized, treat it as a real auth failure.
          if (response.status === 401) {
            handleAuthFailure();
          }
        } else {
          handleAuthFailure();
        }
      } else {
        handleAuthFailure();
      }
    } catch (error) {
      handleAuthFailure();
      throw error;
    }
  }

  return response;
}

// Helper: safely parse a response body.
// Handles 204 No Content and any other empty-body response (e.g. some
// DELETE/PATCH endpoints) without throwing "Unexpected end of JSON input".
async function parseResponseBody<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();

  if (!text) {
    return undefined as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return undefined as T;
  }
}

// API helper function
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
  const response = await fetchWithAuth(url, options);

  if (!response.ok) {
    const error = await parseResponseBody<{ message?: string }>(response).then(
      (val) => val ?? { message: 'Request failed' }
    );
    throw { status: response.status, data: error, message: error.message || 'Request failed' };
  }

  return parseResponseBody<T>(response);
}

// Create QueryClient with default options
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      retry: 0,
    },
  },
});