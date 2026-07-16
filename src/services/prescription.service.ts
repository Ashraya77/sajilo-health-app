import { apiClient } from '@/api/apiClient';
import { ENDPOINTS } from '@/api/endpoints';
/** Retrieves the authenticated patient's prescriptions on demand. */
export async function getMyPrescriptions(): Promise<unknown> { const { data } = await apiClient.get<unknown>(ENDPOINTS.PRESCRIPTIONS); return data; }
