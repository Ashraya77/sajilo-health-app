import { ArrowRight, CalendarCheck, ShieldCheck } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Fonts, Radius, Spacing, brandColors } from '@/constants/theme';
import type { UpcomingAppointmentViewState } from '@/hooks/useUpcomingAppointment';

type HomeHeroCardProps = {
  appointmentState: UpcomingAppointmentViewState;
  onBook: () => void;
  onOpenAppointment: (id: string) => void;
};

export function HomeHeroCard({ appointmentState, onBook, onOpenAppointment }: HomeHeroCardProps) {
  const appointment = appointmentState.status === 'populated' ? appointmentState.appointment : null;
  const canOpen = Boolean(appointment?.id);
  const handlePress = canOpen && appointment?.id ? () => onOpenAppointment(appointment.id!) : onBook;

  return (
    <Pressable
      accessibilityLabel={appointment ? 'View your next appointment' : 'Book an appointment'}
      accessibilityRole="button"
      onPress={handlePress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View pointerEvents="none" style={styles.orbLarge} />
      <View pointerEvents="none" style={styles.orbSmall} />
      <View style={styles.eyebrow}>
        {appointment ? <CalendarCheck color={brandColors.white} size={16} /> : <ShieldCheck color={brandColors.white} size={16} />}
        <Text style={styles.eyebrowText}>{appointment ? 'NEXT VISIT' : 'YOUR HEALTH, SIMPLIFIED'}</Text>
      </View>
      <Text style={styles.title}>
        {appointment ? formatHeroDate(appointment.startAt) : 'Care that moves with you'}
      </Text>
      <Text numberOfLines={2} style={styles.body}>
        {appointment
          ? `${appointment.doctorName ?? 'Your care provider'} · ${appointment.clinicName ?? 'Appointment details'}`
          : 'Find trusted care, manage appointments, and keep your health records close.'}
      </Text>
      <View style={styles.cta}>
        <Text style={styles.ctaText}>{appointment ? 'View appointment' : 'Find care'}</Text>
        <ArrowRight color={brandColors.primaryDark} size={17} />
      </View>
    </Pressable>
  );
}

function formatHeroDate(date: Date): string {
  return date.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: brandColors.primary,
    borderRadius: Radius.large,
    gap: Spacing.two,
    minHeight: 218,
    overflow: 'hidden',
    padding: Spacing.four,
    shadowColor: brandColors.primaryDark,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 5,
  },
  pressed: { opacity: 0.92, transform: [{ scale: 0.995 }] },
  orbLarge: { backgroundColor: brandColors.primaryMuted, borderRadius: 100, height: 190, position: 'absolute', right: -76, top: -72, width: 190 },
  orbSmall: { backgroundColor: brandColors.softBlue, borderRadius: 50, bottom: -35, height: 96, opacity: 0.4, position: 'absolute', right: 44, width: 96 },
  eyebrow: { alignItems: 'center', flexDirection: 'row', gap: Spacing.two },
  eyebrowText: { color: brandColors.white, fontFamily: Fonts.sans, fontSize: 11, fontWeight: '800', letterSpacing: 1.2 },
  title: { color: brandColors.white, fontFamily: Fonts.rounded, fontSize: 25, fontWeight: '800', letterSpacing: -0.4, lineHeight: 31, marginTop: Spacing.one, maxWidth: '82%' },
  body: { color: brandColors.white, fontFamily: Fonts.sans, fontSize: 14, fontWeight: '500', lineHeight: 21, maxWidth: '88%', opacity: 0.9 },
  cta: { alignItems: 'center', alignSelf: 'flex-start', backgroundColor: brandColors.white, borderRadius: Radius.full, flexDirection: 'row', gap: Spacing.two, marginTop: 'auto', minHeight: 42, paddingHorizontal: Spacing.three },
  ctaText: { color: brandColors.primaryDark, fontFamily: Fonts.sans, fontSize: 13, fontWeight: '800' },
});
