import { apiClient } from '@/api/apiClient';
import {
  unwrapApiResponse,
  type ApiResponse,
} from '@/api/apiResponse';
import { ENDPOINTS } from '@/api/endpoints';
import type { ApiUser } from '@/types/profile';
import type {
  ApiHomeDiscoveryListing,
  HomeDiscoveryFilters,
  HomeDiscoveryResponse,
  HomeDiscoverySectionKey,
} from '@/types/home';

const HOME_DISCOVERY_SECTION_KEYS: readonly HomeDiscoverySectionKey[] = [
  'personalized',
  'sponsored',
  'patients_choice',
  'certified_plus',
  'others',
];

/**
 * Retrieves the currently authenticated user's basic account info.
 * Used by the Home screen for the personalised greeting (first name).
 *
 * Re-exports the same endpoint as profile.service.getMe().
 * A dedicated call here avoids coupling the Home screen to the
 * profile service module and keeps each service self-contained.
 */
export async function getHomeUser(): Promise<ApiUser> {
  const { data } = await apiClient.get<ApiResponse<ApiUser>>(ENDPOINTS.ME);
  return unwrapApiResponse(data);
}

/** Retrieves server-defined discovery metadata used to assemble Patient Home. */
export async function getHomeMetadata(
  filters: HomeDiscoveryFilters = {},
): Promise<HomeDiscoveryResponse> {
  const { data } = await apiClient.get<ApiResponse<unknown>>(ENDPOINTS.HOME_METADATA, {
    params: normalizeDiscoveryFilters(filters),
  });
  return normalizeDiscoveryResponse(unwrapApiResponse(data), 'others');
}

/** Retrieves the authenticated patient's personalized Home feed. */
export async function getHomeFeed(
  filters: HomeDiscoveryFilters = {},
): Promise<HomeDiscoveryResponse> {
  const { data } = await apiClient.get<ApiResponse<unknown>>(ENDPOINTS.HOME_FEED, {
    params: normalizeDiscoveryFilters(filters),
  });
  return normalizeDiscoveryResponse(unwrapApiResponse(data), 'personalized');
}

function normalizeDiscoveryFilters(filters: HomeDiscoveryFilters): HomeDiscoveryFilters {
  const normalized: HomeDiscoveryFilters = {};

  for (const key of ['city', 'area', 'specialty', 'type'] as const) {
    const value = filters[key]?.trim();
    if (value) normalized[key] = value;
  }

  if (typeof filters.limit === 'number' && Number.isInteger(filters.limit) && filters.limit > 0) {
    normalized.limit = filters.limit;
  }

  return normalized;
}

function normalizeDiscoveryResponse(
  value: unknown,
  fallbackSection: HomeDiscoverySectionKey,
): HomeDiscoveryResponse {
  if (Array.isArray(value)) {
    return { [fallbackSection]: normalizeListings(value) };
  }

  if (!isRecord(value)) {
    return {};
  }

  const sections: HomeDiscoveryResponse = {};

  for (const key of HOME_DISCOVERY_SECTION_KEYS) {
    if (Array.isArray(value[key])) {
      sections[key] = normalizeListings(value[key]);
    }
  }

  if (Object.keys(sections).length === 0 && Array.isArray(value.results)) {
    sections[fallbackSection] = normalizeListings(value.results);
  }

  return sections;
}

function normalizeListings(values: readonly unknown[]): ApiHomeDiscoveryListing[] {
  return values
    .map(normalizeListing)
    .filter((listing): listing is ApiHomeDiscoveryListing => listing !== null);
}

function normalizeListing(value: unknown): ApiHomeDiscoveryListing | null {
  if (!isRecord(value)) return null;

  const id = getListingId(value.id);
  const title = getString(value.title);
  if (!id || !title) return null;

  return {
    id,
    title,
    type: getString(value.type),
    specialization: getString(value.specialization),
    city: getString(value.city),
    area: getString(value.area),
    rating_avg: getFiniteNumber(value.rating_avg),
    rating_count: getFiniteNumber(value.rating_count),
    next_available_at: getString(value.next_available_at),
    badges: value.badges,
  };
}

function getListingId(value: unknown): string | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  return getString(value);
}

function getString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function getFiniteNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
