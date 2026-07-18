export type ClinicRequestHeaders = {
  'X-Clinic-ID': string;
};

/** Builds the required header for endpoints scoped to the selected clinic. */
export function getClinicRequestHeaders(clinicId: string): ClinicRequestHeaders {
  const normalizedClinicId = clinicId.trim();

  if (!normalizedClinicId) {
    throw new Error('A selected clinic is required for this request.');
  }

  return {
    'X-Clinic-ID': normalizedClinicId,
  };
}
