import { useMemo } from 'react';

import { useUpcomingAppointments } from '@/hooks/useUpcomingAppointments';
import type { ApiAppointment, AppointmentItem } from '@/types/home';

/** Returns the patient's next future appointment for the Home focal card. */
export function useUpcomingAppointment() {
  const query = useUpcomingAppointments();
  const appointment = useMemo(() => findSoonest(getCollectionItems<ApiAppointment>(query.data)), [query.data]);

  return { appointment, isLoading: query.isLoading };
}

function findSoonest(appointments: ApiAppointment[]): AppointmentItem | null {
  return appointments.reduce<AppointmentItem | null>((soonest, appointment) => {
    const item = toAppointmentItem(appointment);
    if (!item || (soonest && item.dateTime.getTime() >= soonest.dateTime.getTime())) return soonest;
    return item;
  }, null);
}

function toAppointmentItem(appointment: ApiAppointment): AppointmentItem | null {
  const dateTime = parseDateTime(appointment);
  if (!dateTime || dateTime.getTime() < Date.now()) return null;

  return {
    kind: 'appointment',
    doctorName: appointment.doctor_name ?? appointment.doctor ?? 'Your care provider',
    specialty: appointment.specialty ?? appointment.doctor_specialty ?? appointment.department,
    clinicName: appointment.clinic_name ?? appointment.clinic ?? 'Sajilo Health',
    avatarUri: appointment.doctor_avatar_url ?? appointment.doctor_avatar ?? appointment.clinic_avatar,
    dateTime,
    status: appointment.status?.toLowerCase() === 'pending' ? 'pending' : 'confirmed',
  };
}

function parseDateTime(appointment: ApiAppointment): Date | null {
  const value = appointment.scheduled_at ?? appointment.date_time
    ?? (appointment.appointment_date && appointment.appointment_time
      ? `${appointment.appointment_date}T${appointment.appointment_time}`
      : appointment.appointment_date);
  if (!value) return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getCollectionItems<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (!value || typeof value !== 'object') return [];

  const source = value as Record<string, unknown>;
  for (const key of ['results', 'items', 'data']) {
    if (Array.isArray(source[key])) return source[key] as T[];
  }
  return [];
}
