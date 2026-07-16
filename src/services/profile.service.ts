import { apiClient } from '@/api/apiClient';
import { ENDPOINTS } from '@/api/endpoints';
import type { ApiPatientProfile, ApiUser, UpdatePatientProfileDto } from '@/types/profile';

/** Retrieves the currently authenticated account. */
export async function getMe(): Promise<ApiUser> {
  const { data } = await apiClient.get<ApiUser>(ENDPOINTS.ME);
  return data;
}

/** Retrieves the authenticated patient's profile details. */
export async function getPatientProfile(): Promise<ApiPatientProfile> {
  const { data } = await apiClient.get<ApiPatientProfile>(ENDPOINTS.PATIENT_PROFILE);
  return data;
}

/** Updates the authenticated patient's editable profile fields. */
export async function updatePatientProfile(data: UpdatePatientProfileDto): Promise<ApiPatientProfile> {
  const response = await apiClient.put<ApiPatientProfile>(ENDPOINTS.PATIENT_PROFILE, data);
  return response.data;
}

/** Retrieves the roles and contexts available to the authenticated account. */
export async function getUserContexts(): Promise<unknown> {
  const { data } = await apiClient.get<unknown>(ENDPOINTS.USER_CONTEXTS);
  return data;
}
