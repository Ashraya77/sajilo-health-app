import { CalendarDays, CalendarPlus } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Avatar, Badge, Card, SkeletonBlock } from '@/components';
import { Colors, Fonts, Radius, Spacing, Typography } from '@/constants/theme';
import type { AppointmentItem } from '@/types/home';

type UpcomingAppointmentCardProps = {
  appointment: AppointmentItem | null;
  isLoading: boolean;
  onBookAppointment?: () => void;
  onMessage?: () => void;
  onReschedule?: () => void;
};

export function UpcomingAppointmentCard({
  appointment,
  isLoading,
  onBookAppointment,
  onMessage,
  onReschedule,
}: UpcomingAppointmentCardProps) {
  if (isLoading) return <AppointmentSkeleton />;
  if (!appointment) return <EmptyAppointment onBookAppointment={onBookAppointment} />;

  return (
    <Card style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.provider}>
          <Avatar name={appointment.doctorName} size={40} uri={appointment.avatarUri} />
          <View style={styles.providerCopy}>
            <Text numberOfLines={1} style={styles.doctorName}>{appointment.doctorName}</Text>
            <Text numberOfLines={1} style={styles.specialty}>{appointment.specialty ?? appointment.clinicName}</Text>
          </View>
        </View>
        <Badge label={formatStatus(appointment.status)} variant={appointment.status === 'confirmed' ? 'success' : 'warning'} />
      </View>

      <View style={styles.divider} />
      <View style={styles.appointmentTime}>
        <CalendarDays color={Colors.primary} size={24} />
        <Text style={styles.timeText}>{formatAppointmentDate(appointment.dateTime)}</Text>
      </View>

      <View style={styles.actions}>
        <OutlineButton label="Reschedule" onPress={onReschedule} />
        <OutlineButton label="Message" onPress={onMessage} />
      </View>
    </Card>
  );
}

function AppointmentSkeleton() {
  return (
    <Card style={styles.card}>
      <View style={styles.skeletonProvider}>
        <SkeletonBlock height={40} radius={Radius.full} width={40} />
        <View style={styles.skeletonCopy}>
          <SkeletonBlock height={16} width={144} />
          <SkeletonBlock height={12} width={104} />
        </View>
      </View>
      <View style={styles.divider} />
      <SkeletonBlock height={28} width="78%" />
      <View style={styles.actions}>
        <SkeletonBlock height={44} radius={Radius.md} width="48%" />
        <SkeletonBlock height={44} radius={Radius.md} width="48%" />
      </View>
    </Card>
  );
}

function EmptyAppointment({ onBookAppointment }: Pick<UpcomingAppointmentCardProps, 'onBookAppointment'>) {
  return (
    <Card style={[styles.card, styles.emptyCard]}>
      <CalendarPlus color={Colors.primary} size={28} />
      <Text style={styles.emptyText}>No upcoming appointments</Text>
      <Pressable accessibilityRole="button" onPress={onBookAppointment} style={styles.primaryButton}>
        <Text style={styles.primaryButtonLabel}>Book Appointment</Text>
      </Pressable>
    </Card>
  );
}

function OutlineButton({ label, onPress }: { label: string; onPress?: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.outlineButton, pressed && styles.buttonPressed]}>
      <Text style={styles.outlineButtonLabel}>{label}</Text>
    </Pressable>
  );
}

function formatStatus(status: AppointmentItem['status']): string {
  return status === 'confirmed' ? 'Confirmed' : 'Pending';
}

function formatAppointmentDate(date: Date): string {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const time = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  if (date.toDateString() === today.toDateString()) return `Today at ${time}`;
  if (date.toDateString() === tomorrow.toDateString()) return `Tomorrow at ${time}`;
  return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

const styles = StyleSheet.create({
  card: { marginVertical: Spacing.four },
  topRow: { alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' },
  provider: { alignItems: 'center', flex: 1, flexDirection: 'row', gap: Spacing.two, paddingRight: Spacing.two },
  providerCopy: { flex: 1, gap: Spacing.half },
  doctorName: { color: Colors.textPrimary, fontFamily: Fonts.sans, ...Typography.bodyLarge, fontWeight: Typography.weights.semibold },
  specialty: { color: Colors.textSecondary, fontFamily: Fonts.sans, ...Typography.caption },
  divider: { backgroundColor: Colors.border, height: 1, marginVertical: Spacing.three },
  appointmentTime: { alignItems: 'center', flexDirection: 'row', gap: Spacing.two },
  timeText: { color: Colors.textPrimary, flex: 1, fontFamily: Fonts.sans, ...Typography.heading },
  actions: { flexDirection: 'row', gap: Spacing.two, marginTop: Spacing.three },
  outlineButton: { alignItems: 'center', borderColor: Colors.border, borderRadius: Radius.md, borderWidth: 1, flex: 1, justifyContent: 'center', minHeight: 44 },
  outlineButtonLabel: { color: Colors.primary, fontFamily: Fonts.sans, ...Typography.body, fontWeight: Typography.weights.medium },
  buttonPressed: { backgroundColor: Colors.infoSurface },
  emptyCard: { alignItems: 'center', gap: Spacing.two, paddingVertical: Spacing.four },
  emptyText: { color: Colors.textSecondary, fontFamily: Fonts.sans, ...Typography.bodyLarge },
  primaryButton: { alignItems: 'center', backgroundColor: Colors.primary, borderRadius: Radius.md, justifyContent: 'center', marginTop: Spacing.one, minHeight: 44, paddingHorizontal: Spacing.four },
  primaryButtonLabel: { color: Colors.background, fontFamily: Fonts.sans, ...Typography.body, fontWeight: Typography.weights.semibold },
  skeletonProvider: { alignItems: 'center', flexDirection: 'row', gap: Spacing.two },
  skeletonCopy: { gap: Spacing.one },
});
