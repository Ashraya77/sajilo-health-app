import { useQuery } from '@tanstack/react-query';

import { getMyPrescriptions } from '@/services/prescription.service';
import type { ApiPrescription } from '@/types/home';

const activePrescriptionsKey = ['home-active-prescriptions'] as const;

/** Fetches active medication reminders for the Home Hero. */
export function useActivePrescriptions() {
  return useQuery<ApiPrescription[]>({
    queryKey: activePrescriptionsKey,
    queryFn: getMyPrescriptions,
  });
}

export { activePrescriptionsKey };
