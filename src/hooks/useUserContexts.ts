import { useQuery } from '@tanstack/react-query';

import { getUserContexts } from '@/services/profile.service';
import type { ApiUserContext } from '@/types/profile';

const userContextsKey = ['user-contexts'] as const;

/** Retrieves account contexts without choosing a clinic on the user's behalf. */
export function useUserContexts() {
  return useQuery<ApiUserContext[]>({
    queryKey: userContextsKey,
    queryFn: getUserContexts,
  });
}

export { userContextsKey };
