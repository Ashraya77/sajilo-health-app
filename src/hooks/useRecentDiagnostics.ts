import { useQuery } from '@tanstack/react-query';

import { getDiagnostics } from '@/services/diagnostics.service';
import type { ApiDiagnosticReport } from '@/types/home';

const recentDiagnosticsKey = (clinicId?: string) => ['home-recent-diagnostics', clinicId] as const;

/** Fetches clinic-scoped reports only when the caller supplies a selected clinic. */
export function useRecentDiagnostics(clinicId?: string) {
  return useQuery<ApiDiagnosticReport[]>({
    queryKey: recentDiagnosticsKey(clinicId),
    queryFn: () => (clinicId ? getDiagnostics(clinicId) : Promise.resolve([])),
    enabled: Boolean(clinicId),
  });
}

export { recentDiagnosticsKey };
