import { apiClient } from '@/api/apiClient';
import { getClinicRequestHeaders } from '@/api/clinicRequest';
import {
  normalizeApiCollection,
  unwrapApiResponse,
  type ApiCollection,
  type ApiResponse,
} from '@/api/apiResponse';
import { ENDPOINTS } from '@/api/endpoints';
import type { ApiDiagnosticReport } from '@/types/home';

/** Retrieves diagnostics for the authenticated patient on demand. */
export async function getDiagnostics(clinicId: string): Promise<ApiDiagnosticReport[]> {
  const { data } = await apiClient.get<ApiResponse<ApiCollection<ApiDiagnosticReport>>>(
    ENDPOINTS.DIAGNOSTICS,
    { headers: getClinicRequestHeaders(clinicId) },
  );

  return normalizeApiCollection(unwrapApiResponse(data));
}
