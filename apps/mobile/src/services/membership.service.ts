import { apiClient } from '@/api/apiClient';
import { getClinicRequestHeaders } from '@/api/clinicRequest';
import {
  normalizeApiCollection,
  unwrapApiResponse,
  type ApiCollection,
  type ApiResponse,
} from '@/api/apiResponse';
import { ENDPOINTS } from '@/api/endpoints';
import type { ApiClinicMembership, ClinicMembership } from '@/types/clinic';

/** Retrieves memberships belonging to the authenticated patient. */
export async function getMemberships(clinicId: string): Promise<ClinicMembership[]> {
  const { data } = await apiClient.get<ApiResponse<ApiCollection<ApiClinicMembership>>>(
    ENDPOINTS.MEMBERSHIPS,
    { headers: getClinicRequestHeaders(clinicId) },
  );

  return normalizeApiCollection(unwrapApiResponse(data)).map(mapMembership);
}

function mapMembership(membership: ApiClinicMembership): ClinicMembership {
  return {
    id: String(membership.id),
    clinicId: String(membership.clinic_id),
    clinicName: membership.clinic_name.trim(),
    clinicSlug: membership.clinic_slug.trim(),
    clinicThemeColor: getNonEmptyString(membership.clinic_theme_color),
    clinicLogo: getSafeRemoteImageUrl(membership.clinic_logo),
    clinicBanner: getSafeRemoteImageUrl(membership.clinic_banner),
    consentStatus: membership.consent_status,
    consentedAt: getNonEmptyString(membership.consented_at),
    createdAt: membership.created_at,
  };
}

function getSafeRemoteImageUrl(value: string | null): string | undefined {
  const url = getNonEmptyString(value);
  return url && /^https?:\/\/\S+$/i.test(url) ? url : undefined;
}

function getNonEmptyString(value: string | null): string | undefined {
  return value?.trim() || undefined;
}
