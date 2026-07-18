import { apiClient } from '@/api/apiClient';
import {
  normalizeApiCollection,
  unwrapApiResponse,
  type ApiCollection,
  type ApiResponse,
} from '@/api/apiResponse';
import { ENDPOINTS } from '@/api/endpoints';
import type {
  ApiPatientProfile,
  ApiUser,
  ApiUserContext,
  UpdatePatientProfileDto,
} from '@/types/profile';

/** Retrieves the currently authenticated account. */
export async function getMe(): Promise<ApiUser> {
  const { data } = await apiClient.get<ApiResponse<ApiUser>>(ENDPOINTS.ME);
  return unwrapApiResponse(data);
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
export async function getUserContexts(): Promise<ApiUserContext[]> {
  const { data } = await apiClient.get<ApiResponse<ApiCollection<ApiUserContext>>>(
    ENDPOINTS.USER_CONTEXTS,
  );
  return normalizeApiCollection(unwrapApiResponse(data));
}
