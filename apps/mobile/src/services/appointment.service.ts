import { apiClient } from '@/api/apiClient';
import {
  normalizeApiCollection,
  unwrapApiResponse,
  type ApiCollection,
  type ApiResponse,
} from '@/api/apiResponse';
import { ENDPOINTS } from '@/api/endpoints';
import type { ApiAppointment } from '@/types/home';

const UPCOMING_APPOINTMENT_PARAMS = {
  status: 'pending,confirmed',
  upcoming: true,
} as const;

/** Retrieves pending and confirmed future appointments for the authenticated patient. */
export async function getUpcomingAppointments(): Promise<ApiAppointment[]> {
  const { data } = await apiClient.get<ApiResponse<ApiCollection<ApiAppointment>>>(
    ENDPOINTS.UPCOMING_APPOINTMENTS,
    { params: UPCOMING_APPOINTMENT_PARAMS },
  );

  return normalizeApiCollection(unwrapApiResponse(data));
}
