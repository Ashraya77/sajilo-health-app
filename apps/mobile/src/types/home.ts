import type { LucideIcon } from 'lucide-react-native';

export type AppointmentItem = {
  kind: 'appointment';
  id?: string;
  doctorName: string;
  specialty?: string;
  clinicName: string;
  avatarUri?: string;
  dateTime: Date;
  status: 'confirmed' | 'pending';
};

export type UpcomingAppointmentItem = {
  id?: string;
  doctorName?: string;
  specialty?: string;
  clinicName?: string;
  startAt: Date;
  endAt?: Date;
  status?: string;
  visitType?: string;
  channel?: string;
  reason?: string;
};

export type MedicationItem = {
  kind: 'medication';
  medicineName: string;
  dosage: string;
  instruction: string;
  dueAt: Date;
};

export type LabReportItem = {
  kind: 'lab-report';
  testName: string;
  labName: string;
  availableOn?: Date;
  isNew: boolean;
};

export type HealthReminderItem = {
  kind: 'health-reminder';
  title: string;
  body: string;
};

export type EmptyItem = {
  kind: 'empty';
};

export type FeaturedItem =
  | AppointmentItem
  | MedicationItem
  | LabReportItem
  | HealthReminderItem
  | EmptyItem;

export type CardEyebrowConfig = {
  icon: LucideIcon;
  label: string;
};

export type HomeDiscoverySectionKey =
  | 'personalized'
  | 'sponsored'
  | 'patients_choice'
  | 'certified_plus'
  | 'others';

export type HomeDiscoveryFilters = {
  city?: string;
  area?: string;
  specialty?: string;
  type?: string;
  limit?: number;
};

export type ApiHomeDiscoveryListing = {
  id: string;
  type?: string;
  title: string;
  specialization?: string;
  city?: string;
  area?: string;
  rating_avg?: number;
  rating_count?: number;
  next_available_at?: string;
  badges?: unknown;
};

export type HomeDiscoveryResponse = Partial<
  Record<HomeDiscoverySectionKey, readonly ApiHomeDiscoveryListing[]>
>;

export type HomeDiscoveryListing = {
  id: string;
  type?: string;
  title: string;
  specialty?: string;
  city?: string;
  area?: string;
  ratingAverage?: number;
  ratingCount?: number;
  nextAvailableAt?: string;
  badge?: string;
};

export type CuratedHomeDiscoverySection = {
  id: 'recommended' | 'nearby' | 'patients-choice' | 'sponsored';
  title: string;
  listings: readonly HomeDiscoveryListing[];
  isSponsored: boolean;
};

// ---------------------------------------------------------------------------
// API response types — raw shapes returned by the backend
// ---------------------------------------------------------------------------

export type ApiAppointment = {
  id?: string | number;
  doctor_id?: string | number;
  patient_id?: string | number;
  start_at?: string;
  end_at?: string;
  status?: string;
  visit_type?: string;
  channel?: string;
  reason?: string;
  fee_amount?: string | number;
  currency?: string;
  doctor_name?: string;
  clinician_name?: string;
  specialty?: string;
  specialization?: string;
  clinic_name?: string;
  doctor?: {
    full_name?: string;
    name?: string;
    specialty?: string;
    specialization?: string;
  };
  clinic?: { name?: string };
};

export type ApiPrescription = {
  id?: string | number;
  medicine_name?: string;
  medication?: string;
  name?: string;
  dosage?: string;
  dose?: string;
  instruction?: string;
  instructions?: string;
  frequency?: string;
  due_at?: string;
  next_dose_at?: string;
  is_active?: boolean;
};

export type ApiDiagnosticReport = {
  id?: string | number;
  test_name?: string;
  name?: string;
  lab_name?: string;
  lab?: string;
  status?: string;
  is_new?: boolean;
  is_read?: boolean;
  created_at?: string;
  reported_at?: string;
};
