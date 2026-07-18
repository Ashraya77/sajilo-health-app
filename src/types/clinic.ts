export type ClinicPreview = {
  id: string;
  name: string;
  clinicType: string;
  location: string;
  imageUri?: string;
};

export type HomeClinicsFixtureMode = 'loading' | 'empty' | 'error' | 'populated';

export type ClinicConsentStatus = 'pending' | 'approved' | 'revoked';

/** Raw ClinicPatientMembership serializer fields confirmed by the API schema. */
export type ApiClinicMembership = {
  id: number;
  clinic_id: number;
  clinic_name: string;
  clinic_slug: string;
  clinic_theme_color: string;
  clinic_logo: string | null;
  clinic_banner: string | null;
  consent_status: ClinicConsentStatus;
  consented_at: string | null;
  created_at: string;
};

/** UI-facing membership model. */
export type ClinicMembership = {
  id: string;
  clinicId: string;
  clinicName: string;
  clinicSlug: string;
  clinicThemeColor?: string;
  clinicLogo?: string;
  clinicBanner?: string;
  consentStatus: ClinicConsentStatus;
  consentedAt?: string;
  createdAt: string;
};

export type SelectedClinicWorkspace = Pick<
  ClinicMembership,
  'clinicId' | 'clinicName' | 'clinicSlug'
>;
