import { useQuery } from '@tanstack/react-query';

import { getActivePrescriptions } from '@/services/home.service';
import type { ApiPrescription } from '@/types/home';

const activePrescriptionsKey = ['home-active-prescriptions'] as const;

/** Fetches active medication reminders for the Home Hero. */
export function useActivePrescriptions() {
  return useQuery<ApiPrescription[]>({
    queryKey: activePrescriptionsKey,
    queryFn: getActivePrescriptions,
  });
}

export { activePrescriptionsKey };
