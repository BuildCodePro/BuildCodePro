import { useQuery } from "@tanstack/react-query";

import { apiRequest } from "@/lib/queryClient";
import { API_ENDPOINTS } from "./api/endpoints";
import { QUERY_KEYS } from "./api/keys";

export interface DashboardStatBlock {
  total: number;
  detail_count: number;
  detail_label: string;
}

export interface MonthlyDesignUsage {
  used: number;
  limit: number;
  plan_name: string;
}

export interface DashboardStatsResponse {
  active_estimates: DashboardStatBlock;
  boms_ready: DashboardStatBlock;
  compliance_flags: DashboardStatBlock;
  exports_this_week: DashboardStatBlock;
  monthly_design_usage: MonthlyDesignUsage;
}

const getDashboardStatsApi = async (): Promise<DashboardStatsResponse> => {
  return apiRequest<DashboardStatsResponse>(API_ENDPOINTS.DASHBOARD.STATS, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
};

export const useDashboardStatsQuery = () => {
  return useQuery({
    queryKey: QUERY_KEYS.DASHBOARD.STATS,
    queryFn: getDashboardStatsApi,
  });
};
