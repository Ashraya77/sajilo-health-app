import type { ClinicPreview, HomeClinicsFixtureMode } from '@/types/clinic';

/**
 * UI-only Home fixtures. These clinics are fictional and must be replaced when
 * the clinic discovery API contract is available.
 */
export const HOME_CLINIC_FIXTURES: readonly ClinicPreview[] = [
  {
    id: 'fixture-sunrise-family-clinic',
    name: 'Sunrise Family Clinic',
    clinicType: 'Primary and family care',
    location: 'New Baneshwor, Kathmandu',
  },
  {
    id: 'fixture-valley-womens-care',
    name: "Valley Women's Care Centre",
    clinicType: "Women's health and maternity care",
    location: 'Jawalakhel, Lalitpur',
  },
  {
    id: 'fixture-evergreen-childrens-clinic',
    name: "Evergreen Children's Clinic",
    clinicType: 'Child and adolescent care',
    location: 'Suryabinayak, Bhaktapur',
  },
] as const;

/** Change this value locally to preview every visual state. */
export const HOME_CLINICS_FIXTURE_MODE: HomeClinicsFixtureMode = 'populated';
