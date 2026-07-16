import { apiClient } from '@/api/apiClient';
import { ENDPOINTS } from '@/api/endpoints';
/** Retrieves patient consent requests and their current statuses. */
export async function getConsents(): Promise<unknown> { const { data } = await apiClient.get<unknown>(ENDPOINTS.CONSENTS); return data; }
/** Approves a patient consent request. */
export async function approveConsent(id: string): Promise<unknown> { const response = await apiClient.post<unknown>(ENDPOINTS.APPROVE_CONSENT, { consent: id }); return response.data; }
/** Rejects a patient consent request. */
export async function rejectConsent(id: string): Promise<unknown> { const response = await apiClient.post<unknown>(ENDPOINTS.REJECT_CONSENT, { consent: id }); return response.data; }
