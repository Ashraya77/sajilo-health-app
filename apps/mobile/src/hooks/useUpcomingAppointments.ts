import { useQuery } from '@tanstack/react-query';

import { getUpcomingAppointments } from '@/services/appointment.service';
import type { ApiAppointment } from '@/types/home';

const upcomingAppointmentsKey = ['home-upcoming-appointments'] as const;

/** Fetches the patient's upcoming appointments for the Home featured card. */
export function useUpcomingAppointments() {
  return useQuery<ApiAppointment[]>({
    queryKey: upcomingAppointmentsKey,
    queryFn: getUpcomingAppointments,
  });
}

export { upcomingAppointmentsKey };
