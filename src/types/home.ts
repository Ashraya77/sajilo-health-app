import type { LucideIcon } from 'lucide-react-native';

export type AppointmentItem = {
  kind: 'appointment';
  doctorName: string;
  specialty?: string;
  clinicName: string;
  avatarUri?: string;
  dateTime: Date;
  status: 'confirmed' | 'pending';
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

// ---------------------------------------------------------------------------
// API response types — raw shapes returned by the backend
// ---------------------------------------------------------------------------

export type ApiAppointment = {
  id?: string | number;
  doctor_name?: string;
  doctor?: string;
  doctor_avatar?: string;
  doctor_avatar_url?: string;
  clinic_avatar?: string;
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
