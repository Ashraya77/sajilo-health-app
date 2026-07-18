export type PatientProfile = {
  fullName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  bloodGroup?: string;
  gender?: string;
  dateOfBirth?: string;
  heightCm?: number;
  weightKg?: number;
  allergiesCount: number;
  chronicConditionsCount: number;
};

export type CollectionResponse = { count: number };

export type ProfileDashboard = {
  profile: PatientProfile;
  appointmentsCount: number;
  prescriptionsCount: number;
  reportsCount: number;
  doctorsVisitedCount: number;
  membershipsCount: number;
  consentsCount: number;
  devicesCount: number;
};

export type ApiUser = {
  full_name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  avatar_url?: string;
  photo?: string;
};

export type ApiPatientProfile = {
  full_name?: string;
  name?: string;
  email?: string;
  phone?: string;
  phone_number?: string;
  avatar?: string;
  avatar_url?: string;
  blood_group?: string;
  gender?: string;
  date_of_birth?: string;
  dob?: string;
  height?: number;
  height_cm?: number;
  weight?: number;
  weight_kg?: number;
  allergies?: unknown[];
  allergies_count?: number;
  conditions?: unknown[];
  chronic_conditions?: unknown[];
  chronic_conditions_count?: number;
};

export type UpdatePatientProfileDto = {
  first_name?: string;
  last_name?: string;
  phone?: string;
  email?: string;
  gender?: string;
  date_of_birth?: string;
  address?: string;
  emergency_contact?: string;
};

export type RegisterDeviceDto = { device_name: string; device_id: string; platform?: string };
