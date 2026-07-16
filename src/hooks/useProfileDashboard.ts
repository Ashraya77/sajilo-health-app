import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import {
  getMe,
  getPatientProfile,
} from '@/services/profile.service';
import { getDevices } from '@/services/device.service';
import { getMemberships } from '@/services/membership.service';
import { getPatientChart } from '@/services/chart.service';
import type { ApiPatientProfile, ProfileDashboard } from '@/types/profile';

const profileDashboardKey = ['profile-dashboard'] as const;

async function fetchProfileDashboard(): Promise<ProfileDashboard> {
  const [meResult, profileResult, chartResult, membershipsResult, devicesResult] = await Promise.allSettled([
    getMe(), getPatientProfile(), getPatientChart(), getMemberships(), getDevices(),
  ]);
  if (meResult.status === 'rejected') {
    throw meResult.reason;
  }

  const me = meResult.value;
  const profile: ApiPatientProfile = profileResult.status === 'fulfilled' ? profileResult.value : {};
  const chart = chartResult.status === 'fulfilled' ? chartResult.value : undefined;
  const memberships = membershipsResult.status === 'fulfilled' ? membershipsResult.value : undefined;
  const devices = devicesResult.status === 'fulfilled' ? devicesResult.value : undefined;
  const fullName = me.full_name ?? profile.full_name;
  const nameFromParts = [me.first_name, me.last_name].filter(Boolean).join(' ');
  const displayName = (fullName ?? nameFromParts) || profile.name || 'Patient';
  const email = me.email ?? profile.email ?? '';
  const phone = me.phone ?? profile.phone ?? profile.phone_number ?? '';

  return {
    profile: {
      fullName: displayName,
      email,
      phone,
      avatarUrl: profile.avatar_url ?? profile.avatar,
      bloodGroup: profile.blood_group,
      gender: profile.gender,
      dateOfBirth: profile.date_of_birth ?? profile.dob,
      heightCm: profile.height_cm ?? profile.height,
      weightKg: profile.weight_kg ?? profile.weight,
      allergiesCount: profile.allergies_count ?? profile.allergies?.length ?? 0,
      chronicConditionsCount: profile.chronic_conditions_count ?? profile.chronic_conditions?.length ?? profile.conditions?.length ?? 0,
    },
    appointmentsCount: 0,
    prescriptionsCount: 0,
    reportsCount: 0,
    doctorsVisitedCount: collectionCount(chart),
    membershipsCount: collectionCount(memberships),
    consentsCount: 0,
    devicesCount: collectionCount(devices),
  };
}

function collectionCount(value: unknown): number {
  if (Array.isArray(value)) return value.length;
  if (typeof value !== 'object' || value === null) return 0;
  const source = value as Record<string, unknown>;
  if (typeof source.count === 'number') return source.count;
  if (typeof source.total === 'number') return source.total;
  if (Array.isArray(source.results)) return source.results.length;
  if (Array.isArray(source.items)) return source.items.length;
  if (typeof source.data === 'object' && source.data !== null) return collectionCount(source.data);
  return 0;
}

export function useProfileDashboard() {
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: profileDashboardKey, queryFn: fetchProfileDashboard });
  const refresh = useCallback(
    () => queryClient.invalidateQueries({ queryKey: profileDashboardKey }),
    [queryClient],
  );
  return { ...query, refresh };
}
