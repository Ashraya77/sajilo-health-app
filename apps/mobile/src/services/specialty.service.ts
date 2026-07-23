import { apiClient } from '@/api/apiClient';
import { unwrapApiResponse, type ApiResponse } from '@/api/apiResponse';
import { ENDPOINTS } from '@/api/endpoints';
import type { Specialty } from '@/types/specialty';

type SpecialtySources = {
  categories?: unknown;
  facets?: unknown;
};

/**
 * Retrieves backend-defined specialty values without assuming unconfirmed
 * category serializer fields. Facet keys provide the confirmed fallback shape.
 */
export async function getSpecialties(): Promise<Specialty[]> {
  const [categoriesResult, facetsResult] = await Promise.allSettled([
    apiClient.get<ApiResponse<unknown>>(ENDPOINTS.METADATA_CATEGORIES),
    apiClient.get<ApiResponse<unknown>>(ENDPOINTS.METADATA_FACETS),
  ]);

  if (categoriesResult.status === 'rejected' && facetsResult.status === 'rejected') {
    throw new Error('Specialties are unavailable.');
  }

  const specialties = normalizeSpecialtySources({
    categories: categoriesResult.status === 'fulfilled'
      ? unwrapApiResponse(categoriesResult.value.data)
      : undefined,
    facets: facetsResult.status === 'fulfilled'
      ? unwrapApiResponse(facetsResult.value.data)
      : undefined,
  });

  if (categoriesResult.status === 'rejected' && specialties.length === 0) {
    throw new Error('Specialties are unavailable.');
  }

  return specialties;
}

export function normalizeSpecialtySources({
  categories,
  facets,
}: SpecialtySources): Specialty[] {
  const values = [
    ...getCategoryStringValues(categories),
    ...getFacetSpecialtyValues(facets),
  ];
  const seen = new Set<string>();

  return values.reduce<Specialty[]>((specialties, rawValue) => {
    const value = rawValue.trim();
    const identity = value.toLocaleLowerCase();

    if (!value || seen.has(identity)) return specialties;
    seen.add(identity);
    specialties.push({ value, label: formatSpecialtyLabel(value) });
    return specialties;
  }, []);
}

function getCategoryStringValues(value: unknown): string[] {
  const collection = Array.isArray(value)
    ? value
    : isRecord(value) && Array.isArray(value.results)
      ? value.results
      : [];

  return collection.filter((item): item is string => typeof item === 'string');
}

function getFacetSpecialtyValues(value: unknown): string[] {
  if (!isRecord(value) || !isRecord(value.specialization)) return [];
  return Object.keys(value.specialization);
}

function formatSpecialtyLabel(value: string): string {
  return value
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (character) => character.toLocaleUpperCase());
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
