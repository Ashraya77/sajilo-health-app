import { apiClient } from '@/api/apiClient';
import { ENDPOINTS } from '@/api/endpoints';
/** Retrieves memberships belonging to the authenticated patient. */
export async function getMemberships(): Promise<unknown> { const { data } = await apiClient.get<unknown>(ENDPOINTS.MEMBERSHIPS); return data; }
