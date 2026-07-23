import { useLocalSearchParams } from 'expo-router';

import { DestinationScreenShell } from '@/components';

// TODO: Implement patient search with the confirmed discovery contract.
export default function SearchRoute() {
  const { specialty, specialtyLabel } = useLocalSearchParams<{
    specialty?: string;
    specialtyLabel?: string;
  }>();
  const selectedLabel = getFirstValue(specialtyLabel) ?? getFirstValue(specialty);

  return (
    <DestinationScreenShell
      description={selectedLabel
        ? `Clinic and doctor results for ${selectedLabel} will appear here.`
        : undefined}
      title={selectedLabel ? `${selectedLabel} care` : 'Search'}
    />
  );
}

function getFirstValue(value: string | string[] | undefined): string | undefined {
  const candidate = Array.isArray(value) ? value[0] : value;
  return candidate?.trim() || undefined;
}
