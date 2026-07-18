import { apiClient } from '@/api/apiClient';
import { ENDPOINTS } from '@/api/endpoints';
import type { ApiUser } from '@/types/profile';
import type { ApiAppointment, ApiDiagnosticReport, ApiPrescription } from '@/types/home';

/**
 * Retrieves the currently authenticated user's basic account info.
 * Used by the Home screen for the personalised greeting (first name).
 *
 * Re-exports the same endpoint as profile.service.getMe().
 * A dedicated call here avoids coupling the Home screen to the
 * profile service module and keeps each service self-contained.
 */
export async function getHomeUser(): Promise<ApiUser> {
  const { data } = await apiClient.get<ApiUser>(ENDPOINTS.ME);
  return data;
}

/** Retrieves the patient's upcoming appointments. */
export async function getUpcomingAppointments(): Promise<ApiAppointment[]> {
  const { data } = await apiClient.get<ApiAppointment[]>(ENDPOINTS.APPOINTMENTS);
  return data;
}

/** Retrieves the patient's active prescriptions (medications). */
export async function getActivePrescriptions(): Promise<ApiPrescription[]> {
  const { data } = await apiClient.get<ApiPrescription[]>(ENDPOINTS.PRESCRIPTIONS);
  return data;
}

/** Retrieves diagnostic / lab reports for the authenticated patient. */
export async function getRecentDiagnostics(): Promise<ApiDiagnosticReport[]> {
  const { data } = await apiClient.get<ApiDiagnosticReport[]>(ENDPOINTS.DIAGNOSTICS);
  return data;
}
