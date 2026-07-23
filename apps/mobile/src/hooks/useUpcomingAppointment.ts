import { useUpcomingAppointments } from '@/hooks/useUpcomingAppointments';
import type { ApiAppointment, UpcomingAppointmentItem } from '@/types/home';

export type UpcomingAppointmentViewState =
  | { status: 'loading'; appointment: null }
  | { status: 'error'; appointment: null; message: string }
  | { status: 'empty'; appointment: null }
  | { status: 'populated'; appointment: UpcomingAppointmentItem };

/** Returns the patient's next future appointment for the Home focal card. */
export function useUpcomingAppointment() {
  const query = useUpcomingAppointments();
  const appointment = selectUpcomingAppointment(query.data ?? []);
  const state: UpcomingAppointmentViewState = appointment
    ? { status: 'populated', appointment }
    : query.isPending
      ? { status: 'loading', appointment: null }
      : query.isError
        ? {
            status: 'error',
            appointment: null,
            message: 'We couldn’t load your upcoming appointment.',
          }
        : { status: 'empty', appointment: null };

  return {
    state,
    isRefetching: query.isRefetching,
    refresh: query.refetch,
  };
}

export function selectUpcomingAppointment(
  appointments: readonly ApiAppointment[],
  now = Date.now(),
): UpcomingAppointmentItem | null {
  return appointments.reduce<UpcomingAppointmentItem | null>((soonest, appointment) => {
    const item = toAppointmentItem(appointment);
    if (!item || item.startAt.getTime() <= now) return soonest;
    if (soonest && item.startAt.getTime() >= soonest.startAt.getTime()) return soonest;
    return item;
  }, null);
}

function toAppointmentItem(appointment: ApiAppointment): UpcomingAppointmentItem | null {
  const startAt = parseDate(appointment.start_at);
  if (!startAt) return null;

  return {
    id: normalizeId(appointment.id),
    doctorName: firstText(
      appointment.doctor_name,
      appointment.clinician_name,
      appointment.doctor?.full_name,
      appointment.doctor?.name,
    ),
    specialty: firstText(
      appointment.specialty,
      appointment.specialization,
      appointment.doctor?.specialty,
      appointment.doctor?.specialization,
    ),
    clinicName: firstText(appointment.clinic_name, appointment.clinic?.name),
    startAt,
    endAt: parseDate(appointment.end_at) ?? undefined,
    status: normalizeText(appointment.status)?.toLowerCase(),
    visitType: normalizeText(appointment.visit_type),
    channel: normalizeText(appointment.channel),
    reason: getConciseReason(appointment.reason),
  };
}

function firstText(...values: unknown[]): string | undefined {
  return values.map(normalizeText).find(Boolean);
}

function parseDate(value: string | undefined): Date | null {
  if (!value) return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function normalizeId(value: string | number | undefined): string | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  return normalizeText(value);
}

function normalizeText(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function getConciseReason(value: string | undefined): string | undefined {
  const reason = normalizeText(value);
  return reason && reason.length <= 120 ? reason : undefined;
}
