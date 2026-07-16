import { useCallback, useMemo } from 'react';
import { isAxiosError } from 'axios';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Activity, Bell, CalendarDays, ClipboardList, Crown, FileHeart, FileText, HelpCircle, HeartPulse, LockKeyhole, LogOut, Microscope, Pill, ShieldCheck, Smartphone, Stethoscope, UserRound } from 'lucide-react-native';

import { HealthCard } from '@/components/profile/HealthCard';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileLoading } from '@/components/profile/ProfileLoading';
import { SectionTitle } from '@/components/profile/SectionTitle';
import { SettingCard } from '@/components/profile/SettingCard';
import { StatCard } from '@/components/profile/StatCard';
import { BottomTabInset, Fonts, Spacing, brandColors, profileColors } from '@/constants/theme';
import { useAuthSession } from '@/hooks/useAuthSession';
import { useProfileDashboard } from '@/hooks/useProfileDashboard';
import type { PatientProfile } from '@/types/profile';

function calculateAge(dateOfBirth?: string): string { if (!dateOfBirth) return '—'; const birth = new Date(dateOfBirth); if (Number.isNaN(birth.getTime())) return '—'; const now = new Date(); let age = now.getFullYear() - birth.getFullYear(); const hasHadBirthday = now.getMonth() > birth.getMonth() || (now.getMonth() === birth.getMonth() && now.getDate() >= birth.getDate()); return `${hasHadBirthday ? age : age - 1} yrs`; }
function calculateBmi(profile: PatientProfile): string { if (!profile.heightCm || !profile.weightKg) return '—'; const heightMetres = profile.heightCm / 100; return (profile.weightKg / (heightMetres * heightMetres)).toFixed(1); }
function getProfileLoadMessage(error: unknown): string {
  if (isAxiosError(error)) {
    if (error.response?.status === 401) return 'Your session has expired. Please sign in again.';
    if (error.response?.status === 403) return 'You do not have permission to view this profile.';
    if (error.response?.status === 404) return 'Your account profile is not available yet.';
    if (!error.response) return 'We could not reach Sajilo Health. Check your connection and try again.';
  }
  return 'Please try again. Your health information remains safely protected.';
}

export function ProfileScreen() {
  const { logout } = useAuthSession();
  const { data, error, isLoading, isError, isRefetching, refresh } = useProfileDashboard();
  const healthMetrics = useMemo(() => data ? [
    { label: 'Blood group', value: data.profile.bloodGroup ?? '—', icon: HeartPulse }, { label: 'Gender', value: data.profile.gender ?? '—', icon: UserRound }, { label: 'Age', value: calculateAge(data.profile.dateOfBirth), icon: CalendarDays }, { label: 'Height', value: data.profile.heightCm ? `${data.profile.heightCm} cm` : '—', icon: Activity }, { label: 'Weight', value: data.profile.weightKg ? `${data.profile.weightKg} kg` : '—', icon: Activity }, { label: 'BMI', value: calculateBmi(data.profile), icon: HeartPulse }, { label: 'Allergies', value: `${data.profile.allergiesCount}`, icon: ShieldCheck }, { label: 'Conditions', value: `${data.profile.chronicConditionsCount}`, icon: ClipboardList },
  ] : [], [data]);
  const handleRefresh = useCallback(() => { void refresh(); }, [refresh]);
  const handleEdit = useCallback(() => {}, []);

  if (isLoading) return <SafeAreaView style={[styles.screen, styles.loadingScreen]}><ProfileLoading /></SafeAreaView>;
  if (isError || !data) return <SafeAreaView style={[styles.screen, styles.errorScreen]}><HeartPulse color={brandColors.primary} size={42}/><Text style={styles.errorTitle}>We couldn’t load your profile</Text><Text style={styles.errorBody}>{getProfileLoadMessage(error)}</Text><Pressable onPress={handleRefresh} style={styles.retryButton}><Text style={styles.retryText}>Try again</Text></Pressable></SafeAreaView>;

  return <SafeAreaView style={styles.screen} edges={['top']}><ScrollView contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={handleRefresh} tintColor={brandColors.primary} />} showsVerticalScrollIndicator={false}>
    <Animated.View entering={FadeInUp.duration(450)}><ProfileHeader profile={data.profile} onEdit={handleEdit}/></Animated.View>
    <Animated.View entering={FadeInUp.delay(70).duration(450)} style={styles.section}><SectionTitle eyebrow="Your health" title="A clearer picture of you"/><HealthCard metrics={healthMetrics}/></Animated.View>
    <Animated.View entering={FadeInUp.delay(130).duration(450)} style={styles.section}><SectionTitle eyebrow="At a glance" title="Your care journey"/><View style={styles.stats}><StatCard delay={180} icon={CalendarDays} label="Appointments" value={data.appointmentsCount}/><StatCard delay={230} icon={Pill} label="Prescriptions" value={data.prescriptionsCount}/><StatCard delay={280} icon={FileText} label="Reports" value={data.reportsCount}/><StatCard delay={330} icon={Stethoscope} label="Doctors visited" value={data.doctorsVisitedCount}/></View></Animated.View>
    <Animated.View entering={FadeInUp.delay(190).duration(450)} style={styles.section}><SectionTitle eyebrow="Care hub" title="Medical"/><View style={styles.settingList}><SettingCard icon={FileHeart} title="Medical records" subtitle="Your personal health history"/><SettingCard icon={Pill} title="Prescriptions" subtitle={`${data.prescriptionsCount} active and past prescriptions`}/><SettingCard icon={Microscope} title="Lab reports" subtitle={`${data.reportsCount} reports ready to review`}/><SettingCard icon={Crown} title="Membership" subtitle={data.membershipsCount ? `${data.membershipsCount} active plan` : 'Explore member benefits'}/><SettingCard icon={ShieldCheck} title="Consent management" subtitle={`${data.consentsCount} consent preferences`}/></View></Animated.View>
    <Animated.View entering={FadeInUp.delay(250).duration(450)} style={styles.section}><SectionTitle eyebrow="In your control" title="Security"/><View style={styles.settingList}><SettingCard icon={Smartphone} title="Devices" subtitle={data.devicesCount ? `${data.devicesCount} trusted devices` : 'Manage trusted devices'}/><SettingCard icon={LockKeyhole} title="Biometric login" subtitle="Secure, quick access"/><SettingCard icon={ShieldCheck} title="Privacy" subtitle="Control your health data"/><SettingCard icon={Bell} title="Notifications" subtitle="Appointments and care updates"/></View></Animated.View>
    <Animated.View entering={FadeInUp.delay(310).duration(450)} style={styles.section}><SectionTitle eyebrow="Here for you" title="Support"/><View style={styles.settingList}><SettingCard icon={HelpCircle} title="Help" subtitle="Get support from Sajilo Health"/><SettingCard icon={Activity} title="About Sajilo Health" subtitle="Version and care mission"/><SettingCard icon={FileText} title="Terms" subtitle="Review our terms of service"/><SettingCard icon={LogOut} onPress={() => { void logout(); }} title="Log out" subtitle="Sign out securely on this device" tone="danger"/></View></Animated.View>
  </ScrollView></SafeAreaView>;
}
export default ProfileScreen;
const styles = StyleSheet.create({ screen: { backgroundColor: profileColors.canvas, flex: 1 }, content: { gap: Spacing.five, paddingBottom: BottomTabInset + Spacing.five, paddingHorizontal: Spacing.three, paddingTop: Spacing.two }, loadingScreen: { paddingHorizontal: Spacing.three, paddingTop: Spacing.four }, errorScreen: { alignItems: 'center', gap: Spacing.two, justifyContent: 'center', paddingHorizontal: Spacing.five }, errorTitle: { color: brandColors.primaryDark, fontFamily: Fonts.rounded, fontSize: 22, fontWeight: '800', marginTop: Spacing.two }, errorBody: { color: brandColors.slate, fontFamily: Fonts.sans, fontSize: 15, lineHeight: 22, textAlign: 'center' }, retryButton: { backgroundColor: brandColors.primary, borderRadius: 999, marginTop: Spacing.two, paddingHorizontal: Spacing.three, paddingVertical: Spacing.two }, retryText: { color: brandColors.white, fontFamily: Fonts.sans, fontSize: 14, fontWeight: '800' }, section: { gap: Spacing.three }, stats: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two, justifyContent: 'space-between' }, settingList: { gap: Spacing.two } });
