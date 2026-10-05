import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { API_ENDPOINTS } from "@/services/api/endpoints";
import { QUERY_KEYS } from "@/services/api/keys";

export interface JurisdictionResolution {
  permit_date: string;
  match_level: "city" | "county" | "state" | "national_fallback";
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
}

const resolveJurisdictionApi = async (
  address: string,
): Promise<JurisdictionResolution> => {
  return apiRequest<JurisdictionResolution>(
    API_ENDPOINTS.PROJECTS.RESOLVE_JURISDICTION,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address }),
    },
  );
};

export function useJurisdictionResolution(address: string) {
  const trimmedAddress = address.trim();
  return useQuery({
    queryKey: QUERY_KEYS.PROJECTS.JURISDICTION_RESOLUTION(trimmedAddress),
    queryFn: () => resolveJurisdictionApi(trimmedAddress),
    enabled: trimmedAddress.length >= 8,
    staleTime: 5 * 60 * 1000,
  });
}
