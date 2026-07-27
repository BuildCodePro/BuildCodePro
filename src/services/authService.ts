import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { API_ENDPOINTS } from './api/endpoints';
import { QUERY_KEYS } from './api/keys';
import { useAuthStore } from '@/store/auth-store';
import type { AuthUser, UserRole } from '@/types/auth';

// --- DTOs ---

export type RegisterDto = {
  email: string;
  owner_name: string;
  company_name: string;
  role: 'company_owner';
  is_verified: boolean;
  password: string;
};

export type VerifyEmailDto = {
  token: string;
};

export type ResendVerificationDto = {
  email: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
  remember_me: boolean;
};

export type VerifyOTPDto = {
  email: string;
  otp_code: string;
  remember_me: boolean;
};

export type ResendOTPDto = {
  email: string;
};

export type ForgetPasswordDto = {
  email: string;
};

export type ResetPasswordDto = {
  token: string;
  new_password: string;
};

// --- API Response Types ---

export interface LoginApiResponse {
  requires_otp?: boolean;
  message?: string;
  access_token?: string | null;
  refresh_token?: string | null;
  role?: string | null;

  accessToken?: string;
  token?: string;
  user?: {
    id?: string;
    email?: string;
    name?: string;
    role?: string;
    roleName?: string;
    roleNames?: string[];
    avatarUrl?: string;
    subtitle?: string;
  };

  payload?: {
    accessToken?: string;
    token?: string;
    refresh_token?: string;
    role?: string;
    user?: {
      id?: string;
      email?: string;
      name?: string;
      phone?: string | null;
      specialty?: string;
      status?: string;
      role?: string;
      roleName?: string;
      roleNames?: string[];
      avatarUrl?: string;
      subtitle?: string;
      created_at?: string;
      updated_at?: string;
    };
  };

  data?: {
    accessToken?: string;
    token?: string;
    refresh_token?: string;
    role?: string;
    user?: {
      id?: string;
      email?: string;
      name?: string;
      role?: string;
      roleName?: string;
      roleNames?: string[];
      avatarUrl?: string;
      subtitle?: string;
    };
  };
}

export interface Company {
  id: string;
  name: string;
  created_at: string;
}

export interface MeResponse {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  phone?: string;
  role: string;
  is_verified: boolean;
  is_active: boolean;
  is_owner: boolean;
  company_id: string;
  company: Company;
  created_at: string;
  updated_at: string;
}

// --- API Functions ---

const getMeApi = async (): Promise<MeResponse> => {
  return apiRequest<MeResponse>(API_ENDPOINTS.AUTH.ME);
};

const registerApi = async (data: RegisterDto) => {
  return apiRequest(API_ENDPOINTS.AUTH.REGISTER, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
};

const verifyEmailApi = async (data: VerifyEmailDto): Promise<LoginApiResponse> => {
  return apiRequest<LoginApiResponse>(API_ENDPOINTS.AUTH.VERIFY_EMAIL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
};

const resendVerificationApi = async (data: ResendVerificationDto) => {
  return apiRequest(API_ENDPOINTS.AUTH.RESEND_VERIFICATION, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
};

const loginApi = async (credentials: LoginCredentials): Promise<LoginApiResponse> => {
  return apiRequest<LoginApiResponse>(API_ENDPOINTS.AUTH.LOGIN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
};

const verifyOTPApi = async (data: VerifyOTPDto): Promise<LoginApiResponse> => {
  return apiRequest<LoginApiResponse>(API_ENDPOINTS.AUTH.VERIFY_OTP, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
};

const resendOTPApi = async (data: ResendOTPDto) => {
  return apiRequest(API_ENDPOINTS.AUTH.RESEND_OTP, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
};

const refreshApi = async () => {
  return apiRequest(API_ENDPOINTS.AUTH.REFRESH, {
    method: 'POST',
    credentials: 'include',
  });
};

const getSessionsApi = async () => {
  return apiRequest(API_ENDPOINTS.AUTH.SESSIONS);
};

const deleteSessionApi = async (sessionId: string) => {
  return apiRequest(API_ENDPOINTS.AUTH.DELETE_SESSION(sessionId), {
    method: 'DELETE',
  });
};

const forgetPasswordApi = async (data: ForgetPasswordDto) => {
  return apiRequest(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
};

const resetPasswordApi = async (data: ResetPasswordDto) => {
  return apiRequest(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
};

const logoutApi = async () => {
  return apiRequest(API_ENDPOINTS.AUTH.LOGOUT, {
    method: 'POST',
    credentials: 'include',
  });
};

const getProfileApi = async () => {
  return apiRequest(API_ENDPOINTS.AUTH.ME);
};

// --- Helper: map raw response -> session ---

export const applySession = (
  data: LoginApiResponse,
  setSession: (user: AuthUser, accessToken: string, role: UserRole) => void,
) => {
  const raw = data?.payload ?? data?.data ?? data;

  const accessToken: string =
    raw?.accessToken ?? raw?.token ?? (raw as any)?.access_token ?? (data as any)?.access_token ?? '';

  const rawUser = raw?.user;
  const directRole: string =
    (data as any)?.role ?? raw?.role ?? rawUser?.role ?? rawUser?.roleName ?? '';

  if (!accessToken) {
    console.error('Missing token in response', { raw });
    throw new Error('Invalid response from server: Missing authentication token.');
  }

  const role = directRole as UserRole;

  if (!role) {
    console.error('Unable to determine role from backend response:', raw);
    throw new Error('Invalid response from server: Missing user role.');
  }

  let userId = '';
  let userEmail = '';
  let userName = '';

  if (rawUser) {
    userId = String(rawUser.id ?? '');
    userEmail = rawUser.email ?? '';
    userName = rawUser.name ?? '';
  } else {
    try {
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      userId = payload?.sub ?? '';
    } catch {
      // If JWT decode fails, leave empty — not critical
    }
  }

  const user: AuthUser = { id: userId, email: userEmail, name: userName, role };

  setSession(user, accessToken, role);
};

// --- Helper: fetch /auth/me and sync it into the persisted auth store ---
// This runs after every flow that establishes a session (login, verify
// email, verify OTP) so that `useAuthStore` — and therefore localStorage —
// always holds the full, fresh profile instead of just the minimal data
// decoded from the JWT.
const fetchAndSyncMe = async (
  updateUser: (user: Partial<AuthUser>) => void,
): Promise<MeResponse | null> => {
  try {
    const meData = await getMeApi();
    updateUser(meData as unknown as Partial<AuthUser>);
    return meData;
  } catch (error) {
    console.error('Failed to fetch /auth/me and sync session:', error);
    return null;
  }
};

const extractToken = (response: LoginApiResponse): string | undefined => {
  return (
    response?.access_token ||
    response?.accessToken ||
    response?.token ||
    response?.payload?.accessToken ||
    response?.data?.accessToken ||
    response?.data?.token ||
    undefined
  );
};

// --- TanStack Query Hooks ---

export const useMeQuery = () => {
  return useQuery({
    queryKey: QUERY_KEYS.AUTH.ME,
    queryFn: getMeApi,
  });
};

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: registerApi,
  });
};

export const useVerifyEmailMutation = () => {
  const setSession = useAuthStore((s) => s.setSession);
  const updateUser = useAuthStore((s) => s.updateUser);

  return useMutation({
    mutationFn: async (data: VerifyEmailDto) => {
      const response = await verifyEmailApi(data);

      if (extractToken(response)) {
        applySession(response, setSession);
        await fetchAndSyncMe(updateUser);
      }

      return response;
    },
  });
};

export const useResendVerificationMutation = () => {
  return useMutation({
    mutationFn: resendVerificationApi,
  });
};

export const useLoginMutation = () => {
  const setSession = useAuthStore((s) => s.setSession);
  const updateUser = useAuthStore((s) => s.updateUser);

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const data = await loginApi(credentials);

      // If backend requires OTP verification, don't set a session yet —
      // /auth/me will be synced once OTP is verified instead.
      if (data.requires_otp) {
        return data;
      }

      applySession(data, setSession);
      await fetchAndSyncMe(updateUser);

      return data;
    },
  });
};

export const useVerifyOTPMutation = () => {
  const setSession = useAuthStore((s) => s.setSession);
  const updateUser = useAuthStore((s) => s.updateUser);

  return useMutation({
    mutationFn: async (data: VerifyOTPDto) => {
      const response = await verifyOTPApi(data);

      if (extractToken(response)) {
        applySession(response, setSession);
        await fetchAndSyncMe(updateUser);
      }

      return response;
    },
  });
};

export const useResendOTPMutation = () => {
  return useMutation({
    mutationFn: resendOTPApi,
  });
};

export const useRefreshMutation = () => {
  const updateUser = useAuthStore((s) => s.updateUser);

  return useMutation({
    mutationFn: async () => {
      const response = await refreshApi();
      // After a silent token refresh, also resync the profile so any
      // server-side changes (e.g. plan upgrade, name change) reflect
      // in the persisted store.
      await fetchAndSyncMe(updateUser);
      return response;
    },
  });
};

export const useSessionsQuery = (enabled: boolean = true) => {
  return useQuery({
    queryKey: QUERY_KEYS.AUTH.SESSIONS(),
    queryFn: getSessionsApi,
    enabled,
  });
};

export const useDeleteSessionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => deleteSessionApi(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.SESSIONS() });
    },
  });
};

export const useForgetPasswordMutation = () => {
  return useMutation({
    mutationFn: forgetPasswordApi,
  });
};

export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: resetPasswordApi,
  });
};

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  const clearSession = useAuthStore((s) => s.clearSession);

  return useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      clearSession();
      queryClient.clear();
    },
  });
};

export const useGetProfileQuery = (enabled: boolean = true) => {
  return useQuery({
    queryKey: QUERY_KEYS.AUTH.PROFILE,
    queryFn: getProfileApi,
    enabled,
  });
};