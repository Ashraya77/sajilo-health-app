import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import { getSpecialties } from '@/services/specialty.service';
import type { Specialty } from '@/types/specialty';

const MAX_HOME_SPECIALTIES = 6;

export type SpecialtyViewState =
  | { status: 'loading'; specialties: readonly [] }
  | { status: 'empty'; specialties: readonly [] }
  | { status: 'error'; specialties: readonly []; message: string }
  | { status: 'populated'; specialties: readonly Specialty[] };

export function useSpecialties() {
  const query = useQuery({
    queryKey: ['metadata', 'specialties'],
    queryFn: getSpecialties,
  });
  const state = useMemo<SpecialtyViewState>(() => {
    if (query.data?.length) {
      return {
        status: 'populated',
        specialties: query.data.slice(0, MAX_HOME_SPECIALTIES),
      };
    }

    if (query.isError) {
      return {
        status: 'error',
        specialties: [],
        message: 'We couldn’t load specialties right now.',
      };
    }

    if (query.isPending) return { status: 'loading', specialties: [] };
    return { status: 'empty', specialties: [] };
  }, [query.data, query.isError, query.isPending]);
  const refetch = query.refetch;
  const refresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return { state, isRefetching: query.isRefetching, refresh };
}
