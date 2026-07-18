import { useLocalSearchParams } from 'expo-router';

import { DestinationScreenShell } from '@/components';

// TODO: Implement the selected clinic's patient dashboard and scoped features.
export default function ClinicWorkspaceRoute() {
  const { clinicName } = useLocalSearchParams<{ clinicName?: string }>();
  const title = clinicName?.trim() || 'Clinic workspace';

  return (
    <DestinationScreenShell
      description="Your clinic services and records will appear here."
      title={title}
    />
  );
}
