import { useMemo } from 'react';

import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useActivePrescriptions } from '@/hooks/useActivePrescriptions';
import { useRecentDiagnostics } from '@/hooks/useRecentDiagnostics';
import type {
  ApiDiagnosticReport,
  ApiPrescription,
  FeaturedItem,
} from '@/types/home';

/**
 * UI-facing Home dashboard adapter. The screen consumes this single hook;
 * API-backed dashboard data stays outside the Hero components.
 */
export function useHomeFeaturedItem(selectedClinicId?: string) {
  const userQuery = useCurrentUser();
  const prescriptionsQuery = useActivePrescriptions();
  const diagnosticsQuery = useRecentDiagnostics(selectedClinicId);

  const item = useMemo<FeaturedItem>(() => {
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
  }, [diagnosticsQuery.data, prescriptionsQuery.data]);

  return {
    firstName: getFirstName(userQuery.data),
    photoUri: userQuery.data?.avatar_url ?? userQuery.data?.avatar ?? userQuery.data?.photo,
    item,
    isUserLoading: userQuery.isLoading,
    isLoading: userQuery.isLoading
      || prescriptionsQuery.isLoading
      || diagnosticsQuery.isLoading,
  };
}

function getFirstName(user: { first_name?: string; full_name?: string } | undefined): string {
  if (user?.first_name?.trim()) return user.first_name.trim();
  if (user?.full_name?.trim()) return user.full_name.trim().split(/\s+/)[0] ?? 'there';
  return 'there';
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
