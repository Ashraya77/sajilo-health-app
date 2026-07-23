import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import { useClinicWorkspace } from '@/hooks/useClinicWorkspace';
import { getMemberships } from '@/services/membership.service';
import type { ClinicMembership } from '@/types/clinic';

const clinicMembershipsKey = (clinicId?: string) => ['clinic-memberships', clinicId] as const;

/** Fetches memberships only after the app supplies its selected clinic ID. */
export function useClinicMemberships(clinicId?: string) {
  return useQuery<ClinicMembership[]>({
    queryKey: clinicMembershipsKey(clinicId),
    queryFn: () => (clinicId ? getMemberships(clinicId) : Promise.resolve([])),
    enabled: Boolean(clinicId),
  });
}

export type HomeClinicMembershipsViewState =
  | { status: 'empty'; memberships: readonly [] }
  | { status: 'loading'; memberships: readonly [] }
  | { status: 'error'; memberships: readonly []; message: string }
  | { status: 'populated'; memberships: readonly ClinicMembership[] };

/** Home-facing membership state for the currently selected clinic workspace. */
export function useHomeClinicMemberships() {
  const { selectedClinic } = useClinicWorkspace();
  const query = useClinicMemberships(selectedClinic?.clinicId);
  const state = useMemo<HomeClinicMembershipsViewState>(() => {
    if (!selectedClinic) return { status: 'empty', memberships: [] };
    if (query.isPending) return { status: 'loading', memberships: [] };
    if (query.isError) {
      return {
        status: 'error',
        memberships: [],
        message: 'We couldn’t load your clinics right now.',
      };
    }

    const memberships = (query.data ?? []).filter(
      (membership) => membership.consentStatus !== 'revoked',
    );

    return memberships.length > 0
      ? { status: 'populated', memberships }
      : { status: 'empty', memberships: [] };
  }, [query.data, query.isError, query.isPending, selectedClinic]);
  const refetch = query.refetch;
  const refresh = useCallback(async () => {
    if (!selectedClinic) return;
    await refetch();
  }, [refetch, selectedClinic]);

  return { state, isRefetching: query.isRefetching, refresh };
}

export { clinicMembershipsKey };
