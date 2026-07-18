import { useQuery } from '@tanstack/react-query';

import { getRecentDiagnostics } from '@/services/home.service';
import type { ApiDiagnosticReport } from '@/types/home';

const recentDiagnosticsKey = ['home-recent-diagnostics'] as const;

/** Fetches newly available diagnostic reports for the Home Hero. */
export function useRecentDiagnostics() {
  return useQuery<ApiDiagnosticReport[]>({
    queryKey: recentDiagnosticsKey,
    queryFn: getRecentDiagnostics,
  });
}

export { recentDiagnosticsKey };
