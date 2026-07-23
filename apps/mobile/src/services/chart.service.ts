import { apiClient } from '@/api/apiClient';
import { ENDPOINTS } from '@/api/endpoints';
/** Retrieves the authenticated patient's complete medical chart. */
export async function getPatientChart(): Promise<unknown> { const { data } = await apiClient.get<unknown>(ENDPOINTS.PATIENT_CHART); return data; }
