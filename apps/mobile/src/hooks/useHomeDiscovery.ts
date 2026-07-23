import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import { getHomeFeed, getHomeMetadata } from '@/services/home.service';
import type {
  ApiHomeDiscoveryListing,
  CuratedHomeDiscoverySection,
  HomeDiscoveryFilters,
  HomeDiscoveryListing,
  HomeDiscoveryResponse,
  HomeDiscoverySectionKey,
} from '@/types/home';

const MAX_SECTION_LISTINGS = 6;
const MIN_DISTINCT_PATIENTS_CHOICE_LISTINGS = 2;

export type HomeDiscoveryViewState =
  | { status: 'loading'; sections: readonly [] }
  | { status: 'empty'; sections: readonly [] }
  | { status: 'error'; sections: readonly []; message: string }
  | { status: 'populated'; sections: readonly CuratedHomeDiscoverySection[] };

export function useHomeDiscovery(filters: HomeDiscoveryFilters = {}) {
  const { area, city, limit, specialty, type } = filters;
  const stableFilters = useMemo<HomeDiscoveryFilters>(
    () => ({ area, city, limit, specialty, type }),
    [area, city, limit, specialty, type],
  );
  const metadataQuery = useQuery({
    queryKey: ['home-discovery', 'metadata', stableFilters],
    queryFn: () => getHomeMetadata(stableFilters),
  });
  const feedQuery = useQuery({
    queryKey: ['home-discovery', 'feed', stableFilters],
    queryFn: () => getHomeFeed(stableFilters),
  });
  const sections = useMemo(
    () => selectHomeDiscoverySections(metadataQuery.data, feedQuery.data),
    [feedQuery.data, metadataQuery.data],
  );
  const state = getViewState({
    sections,
    isMetadataError: metadataQuery.isError,
    isMetadataPending: metadataQuery.isPending,
    isFeedError: feedQuery.isError,
    isFeedPending: feedQuery.isPending,
  });
  const metadataRefetch = metadataQuery.refetch;
  const feedRefetch = feedQuery.refetch;
  const refresh = useCallback(async () => {
    await Promise.allSettled([metadataRefetch(), feedRefetch()]);
  }, [feedRefetch, metadataRefetch]);

  return {
    state,
    isRefetching: metadataQuery.isRefetching || feedQuery.isRefetching,
    refresh,
  };
}

type ViewStateInput = {
  sections: readonly CuratedHomeDiscoverySection[];
  isMetadataError: boolean;
  isMetadataPending: boolean;
  isFeedError: boolean;
  isFeedPending: boolean;
};

function getViewState({
  sections,
  isMetadataError,
  isMetadataPending,
  isFeedError,
  isFeedPending,
}: ViewStateInput): HomeDiscoveryViewState {
  if (sections.length > 0) {
    return { status: 'populated', sections };
  }

  if (isMetadataError && isFeedError) {
    return {
      status: 'error',
      sections: [],
      message: 'We couldn’t load clinics and doctors right now.',
    };
  }

  if (isMetadataPending || isFeedPending) {
    return { status: 'loading', sections: [] };
  }

  return { status: 'empty', sections: [] };
}

export function selectHomeDiscoverySections(
  metadata: HomeDiscoveryResponse | undefined,
  feed: HomeDiscoveryResponse | undefined,
): CuratedHomeDiscoverySection[] {
  const personalized = mapListings(combineSections(feed, metadata, 'personalized'));
  const primary = personalized.length > 0
    ? {
        id: 'recommended' as const,
        title: 'Recommended for you',
        listings: personalized,
        source: 'personalized' as HomeDiscoverySectionKey,
      }
    : selectStrongestOrganicSection(metadata, feed);
  const sections: CuratedHomeDiscoverySection[] = [];
  const displayedIds = new Set<string>();

  if (primary) {
    const listings = getUniqueListings(primary.listings, displayedIds);
    if (listings.length > 0) {
      sections.push({
        id: primary.id,
        title: primary.title,
        listings,
        isSponsored: false,
      });
      addDisplayedListings(listings, displayedIds);
    }
  }

  if (primary?.source !== 'patients_choice') {
    const patientsChoice = getUniqueListings(
      mapListings(combineSections(metadata, feed, 'patients_choice')),
      displayedIds,
    );

    if (patientsChoice.length >= MIN_DISTINCT_PATIENTS_CHOICE_LISTINGS) {
      sections.push({
        id: 'patients-choice',
        title: 'Patients’ choice',
        listings: patientsChoice,
        isSponsored: false,
      });
      addDisplayedListings(patientsChoice, displayedIds);
    }
  }

  if (sections.length < 2) {
    const sponsored = getUniqueListings(
      mapListings(combineSections(metadata, feed, 'sponsored')),
      displayedIds,
    );

    if (sponsored.length > 0) {
      sections.push({
        id: 'sponsored',
        title: 'Sponsored care options',
        listings: sponsored,
        isSponsored: true,
      });
    }
  }

  return sections.slice(0, 2);
}

function selectStrongestOrganicSection(
  metadata: HomeDiscoveryResponse | undefined,
  feed: HomeDiscoveryResponse | undefined,
) {
  const keys: readonly HomeDiscoverySectionKey[] = [
    'certified_plus',
    'patients_choice',
    'others',
  ];

  for (const key of keys) {
    const listings = mapListings(combineSections(metadata, feed, key));
    if (listings.length > 0) {
      return {
        id: 'nearby' as const,
        title: 'Clinics and doctors near you',
        listings,
        source: key,
      };
    }
  }

  return undefined;
}

function combineSections(
  first: HomeDiscoveryResponse | undefined,
  second: HomeDiscoveryResponse | undefined,
  key: HomeDiscoverySectionKey,
): ApiHomeDiscoveryListing[] {
  return [...(first?.[key] ?? []), ...(second?.[key] ?? [])];
}

function mapListings(listings: readonly ApiHomeDiscoveryListing[]): HomeDiscoveryListing[] {
  const seen = new Set<string>();

  return listings.reduce<HomeDiscoveryListing[]>((result, listing) => {
    if (seen.has(listing.id)) return result;
    seen.add(listing.id);

    result.push({
      id: listing.id,
      title: listing.title,
      type: listing.type,
      specialty: listing.specialization,
      city: listing.city,
      area: listing.area,
      ratingAverage: isValidRating(listing.rating_avg) ? listing.rating_avg : undefined,
      ratingCount: isValidRatingCount(listing.rating_count) ? listing.rating_count : undefined,
      nextAvailableAt: isValidDate(listing.next_available_at)
        ? listing.next_available_at
        : undefined,
      badge: getSupportedBadge(listing.badges),
    });
    return result;
  }, []);
}

function getUniqueListings(
  listings: readonly HomeDiscoveryListing[],
  displayedIds: Set<string>,
): HomeDiscoveryListing[] {
  const unique: HomeDiscoveryListing[] = [];
  const sectionIds = new Set<string>();

  for (const listing of listings) {
    if (displayedIds.has(listing.id) || sectionIds.has(listing.id)) continue;
    sectionIds.add(listing.id);
    unique.push(listing);
    if (unique.length === MAX_SECTION_LISTINGS) break;
  }

  return unique;
}

function addDisplayedListings(
  listings: readonly HomeDiscoveryListing[],
  displayedIds: Set<string>,
) {
  for (const listing of listings) displayedIds.add(listing.id);
}

function isValidRating(value: number | undefined): value is number {
  return value !== undefined && value >= 0 && value <= 5;
}

function isValidRatingCount(value: number | undefined): value is number {
  return value !== undefined && Number.isInteger(value) && value >= 0;
}

function isValidDate(value: string | undefined): value is string {
  return value !== undefined && !Number.isNaN(new Date(value).getTime());
}

function getSupportedBadge(value: unknown): string | undefined {
  const badges = typeof value === 'string'
    ? [value]
    : Array.isArray(value)
      ? value.filter((badge): badge is string => typeof badge === 'string')
      : [];
  const supportedBadge = badges.find((badge) => /certified|verified/i.test(badge));

  if (!supportedBadge) return undefined;

  return supportedBadge
    .trim()
    .replace(/[_-]+/g, ' ')
    .replace(/^\w/, (character) => character.toUpperCase());
}
