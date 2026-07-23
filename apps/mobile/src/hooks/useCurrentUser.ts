import { useQuery } from '@tanstack/react-query';

import { getHomeUser } from '@/services/home.service';
import type { ApiUser } from '@/types/profile';

const homeUserKey = ['home-user'] as const;

/** Fetches the authenticated user's account info for the Home greeting. */
export function useCurrentUser() {
  return useQuery<ApiUser>({
    queryKey: homeUserKey,
    queryFn: getHomeUser,
  });
}

export { homeUserKey };
