import { useMemo } from 'react';

import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useActivePrescriptions } from '@/hooks/useActivePrescriptions';
import { useRecentDiagnostics } from '@/hooks/useRecentDiagnostics';
import { useUpcomingAppointments } from '@/hooks/useUpcomingAppointments';
import type {
  ApiAppointment,
  ApiDiagnosticReport,
  ApiPrescription,
  FeaturedItem,
} from '@/types/home';

/**
 * UI-facing Home dashboard adapter. The screen consumes this single hook;
 * API-backed dashboard data stays outside the Hero components.
 */
export function useHomeFeaturedItem() {
  const userQuery = useCurrentUser();
  const appointmentsQuery = useUpcomingAppointments();
  const prescriptionsQuery = useActivePrescriptions();
  const diagnosticsQuery = useRecentDiagnostics();

  const item = useMemo<FeaturedItem>(() => {
    const appointment = findSoonest(
      getCollectionItems<ApiAppointment>(appointmentsQuery.data)
        .map(toAppointmentItem)
        .filter((value): value is Extract<FeaturedItem, { kind: 'appointment' }> => value !== null),
      (value) => value.dateTime,
    );

    if (appointment) return appointment;

    const medication = findSoonest(
      getCollectionItems<ApiPrescription>(prescriptionsQuery.data)
        .filter((prescription) => prescription.is_active !== false)
        .map(toMedicationItem),
      (value) => value.dueAt,
    );
    if (medication) return medication;

    const report = getCollectionItems<ApiDiagnosticReport>(diagnosticsQuery.data)
      .map(toReportItem)
      .find((value) => value.isNew);
    if (report) return report;

    return { kind: 'empty' };
  }, [appointmentsQuery.data, diagnosticsQuery.data, prescriptionsQuery.data]);

  return {
    firstName: getFirstName(userQuery.data),
    photoUri: userQuery.data?.avatar_url ?? userQuery.data?.avatar ?? userQuery.data?.photo,
    item,
    isUserLoading: userQuery.isLoading,
    isLoading: userQuery.isLoading
      || appointmentsQuery.isLoading
      || prescriptionsQuery.isLoading
      || diagnosticsQuery.isLoading,
  };
}

function getFirstName(user: { first_name?: string; full_name?: string } | undefined): string {
  if (user?.first_name?.trim()) return user.first_name.trim();
  if (user?.full_name?.trim()) return user.full_name.trim().split(/\s+/)[0] ?? 'there';
  return 'there';
}

function toAppointmentItem(
  appointment: {
    doctor_name?: string;
    doctor?: string;
    specialty?: string;
    doctor_specialty?: string;
    department?: string;
    clinic_name?: string;
    clinic?: string;
    appointment_date?: string;
    appointment_time?: string;
    date_time?: string;
    scheduled_at?: string;
    status?: string;
  },
): Extract<FeaturedItem, { kind: 'appointment' }> | null {
  const dateTime = parseAppointmentDate(appointment);
  if (dateTime === null || dateTime.getTime() < Date.now()) return null;

  return {
    kind: 'appointment',
    doctorName: appointment.doctor_name ?? appointment.doctor ?? 'Your care provider',
    specialty: appointment.specialty ?? appointment.doctor_specialty ?? appointment.department,
    clinicName: appointment.clinic_name ?? appointment.clinic ?? 'Sajilo Health',
    dateTime,
    status: appointment.status?.toLowerCase() === 'pending' ? 'pending' : 'confirmed',
  };
}

function parseAppointmentDate(appointment: {
  appointment_date?: string;
  appointment_time?: string;
  date_time?: string;
  scheduled_at?: string;
}): Date | null {
  const value = appointment.scheduled_at ?? appointment.date_time
    ?? (appointment.appointment_date && appointment.appointment_time
      ? `${appointment.appointment_date}T${appointment.appointment_time}`
      : appointment.appointment_date);
  if (!value) return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function toMedicationItem(prescription: ApiPrescription): Extract<FeaturedItem, { kind: 'medication' }> {
  return {
    kind: 'medication',
    medicineName: prescription.medicine_name ?? prescription.medication ?? prescription.name ?? 'Your medication',
    dosage: prescription.dosage ?? prescription.dose ?? 'Follow your prescription',
    instruction: prescription.instruction ?? prescription.instructions ?? prescription.frequency ?? 'Take as directed',
    dueAt: parseDate(prescription.due_at ?? prescription.next_dose_at) ?? new Date(),
  };
}

function toReportItem(report: ApiDiagnosticReport): Extract<FeaturedItem, { kind: 'lab-report' }> {
  return {
    kind: 'lab-report',
    testName: report.test_name ?? report.name ?? 'Diagnostic report',
    labName: report.lab_name ?? report.lab ?? 'Sajilo Health',
    availableOn: parseDate(report.reported_at ?? report.created_at) ?? undefined,
    isNew: report.is_new === true
      || report.is_read === false
      || report.status?.toLowerCase() === 'available',
  };
}

function parseDate(value: string | undefined): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function findSoonest<T>(items: T[], getDate: (item: T) => Date): T | undefined {
  return items.reduce<T | undefined>((soonest, item) => {
    if (!soonest || getDate(item).getTime() < getDate(soonest).getTime()) {
      return item;
    }
    return soonest;
  }, undefined);
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
