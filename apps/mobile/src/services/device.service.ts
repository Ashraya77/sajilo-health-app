import { apiClient } from '@/api/apiClient';
import { ENDPOINTS } from '@/api/endpoints';
import type { RegisterDeviceDto } from '@/types/profile';

/** Retrieves devices currently authenticated for this account. */
export async function getDevices(): Promise<unknown> { const { data } = await apiClient.get<unknown>(ENDPOINTS.DEVICES); return data; }
/** Registers the current device for the authenticated account. */
export async function registerDevice(data: RegisterDeviceDto): Promise<unknown> { const response = await apiClient.post<unknown>(ENDPOINTS.DEVICES, data); return response.data; }
/** Removes one authenticated device by its server identifier. */
export async function removeDevice(id: string): Promise<void> { await apiClient.delete(`${ENDPOINTS.DEVICES}${id}/`); }
