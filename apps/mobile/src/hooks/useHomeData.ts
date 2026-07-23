import { useQuery } from '@tanstack/react-query';

import { useActivePrescriptions } from '@/hooks/useActivePrescriptions';
import { useClinicMemberships } from '@/hooks/useClinicMemberships';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useRecentDiagnostics } from '@/hooks/useRecentDiagnostics';
import { useUpcomingAppointments } from '@/hooks/useUpcomingAppointments';
import { useUserContexts } from '@/hooks/useUserContexts';
import { getHomeFeed, getHomeMetadata } from '@/services/home.service';

const homeMetadataKey = ['home-metadata'] as const;
const homeFeedKey = ['home-feed'] as const;

/**
 * Foundation-level Home query composition. Clinic data remains disabled until
 * a selected clinic ID is supplied by a future clinic-context integration.
 */
export function useHomeData(selectedClinicId?: string) {
  const user = useCurrentUser();
  const contexts = useUserContexts();
  const metadata = useQuery({ queryKey: homeMetadataKey, queryFn: () => getHomeMetadata() });
  const feed = useQuery({ queryKey: homeFeedKey, queryFn: () => getHomeFeed() });
  const appointments = useUpcomingAppointments();
  const prescriptions = useActivePrescriptions();
  const memberships = useClinicMemberships(selectedClinicId);
  const diagnostics = useRecentDiagnostics(selectedClinicId);

  return {
    user,
    contexts,
    metadata,
    feed,
    appointments,
    prescriptions,
    memberships,
    diagnostics,
  };
}

export { homeFeedKey, homeMetadataKey };
