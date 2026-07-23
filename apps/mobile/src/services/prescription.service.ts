import { apiClient } from '@/api/apiClient';
import {
  normalizeApiCollection,
  unwrapApiResponse,
  type ApiCollection,
  type ApiResponse,
} from '@/api/apiResponse';
import { ENDPOINTS } from '@/api/endpoints';
import type { ApiPrescription } from '@/types/home';

/** Retrieves the authenticated patient's prescriptions on demand. */
export async function getMyPrescriptions(): Promise<ApiPrescription[]> {
  const { data } = await apiClient.get<ApiResponse<ApiCollection<ApiPrescription>>>(
    ENDPOINTS.PRESCRIPTIONS,
    { params: { status: 'issued' } },
  );

  return normalizeApiCollection(unwrapApiResponse(data));
}
