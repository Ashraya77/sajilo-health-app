import { apiClient } from '@/api/apiClient';
import { ENDPOINTS } from '@/api/endpoints';
/** Retrieves diagnostics for the authenticated patient on demand. */
export async function getDiagnostics(): Promise<unknown> { const { data } = await apiClient.get<unknown>(ENDPOINTS.DIAGNOSTICS); return data; }
