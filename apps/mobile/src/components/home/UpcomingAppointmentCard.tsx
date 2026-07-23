import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Building2, CalendarDays, ChevronRight, Stethoscope, UserRound } from 'lucide-react-native';

import { Card } from '@/components/Card';
import { Fonts, Radius, Spacing, Typography, brandColors } from '@/constants/theme';
import type { UpcomingAppointmentItem } from '@/types/home';

const MIN_TOUCH_TARGET = Spacing.five + Spacing.twoHalf;

type UpcomingAppointmentCardProps = {
  appointment: UpcomingAppointmentItem;
  isRefreshing: boolean;
  onOpenDetails?: () => void;
};

export function UpcomingAppointmentCard({
  appointment,
  isRefreshing,
  onOpenDetails,
}: UpcomingAppointmentCardProps) {
  const status = getStatusLabel(appointment.status);
  const visitLabel = formatLabel(appointment.visitType ?? appointment.channel);

  return (
    <Card style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.identity}>
          <View style={styles.iconMark}>
            <CalendarDays color={brandColors.primary} size={Spacing.four} />
          </View>
          <View style={styles.identityCopy}>
            <Text style={styles.date}>{formatAppointmentDate(appointment.startAt)}</Text>
            <Text style={styles.time}>{formatAppointmentTime(appointment.startAt)}</Text>
          </View>
        </View>
        <View style={styles.statusArea}>
          {isRefreshing && (
            <ActivityIndicator
              accessibilityLabel="Refreshing appointment"
              color={brandColors.primary}
              size="small"
            />
          )}
          <View style={styles.statusPill}><Text style={styles.statusText}>{status}</Text></View>
        </View>
      </View>

      <View style={styles.details}>
        <DetailRow icon={UserRound} label={appointment.doctorName ?? 'Care provider'} />
        <DetailRow icon={Stethoscope} label={appointment.specialty ?? visitLabel ?? 'General consultation'} />
        <DetailRow icon={Building2} label={appointment.clinicName ?? 'Clinic details in appointment'} />
        {appointment.reason && (
          <Text numberOfLines={2} style={styles.reason}>{appointment.reason}</Text>
        )}
      </View>

      {onOpenDetails && (
        <Pressable
          accessibilityLabel="Open appointment details"
          accessibilityRole="button"
          onPress={onOpenDetails}
          style={({ pressed }) => [styles.detailsAction, pressed && styles.actionPressed]}
        >
          <Text style={styles.detailsActionLabel}>View details</Text>
          <ChevronRight color={brandColors.primary} size={Spacing.three} />
        </Pressable>
      )}
    </Card>
  );
}

type DetailRowProps = {
  icon: typeof UserRound;
  label: string;
};

function DetailRow({ icon: Icon, label }: DetailRowProps) {
  return (
    <View style={styles.detailRow}>
      <Icon color={brandColors.primaryMuted} size={Spacing.three} />
      <Text numberOfLines={1} style={styles.detailText}>{label}</Text>
    </View>
  );
}

function getStatusLabel(status: string | undefined): string {
  if (status === 'confirmed') return 'Confirmed';
  if (status === 'pending') return 'Pending';
  return formatLabel(status) ?? 'Status unavailable';
}

function formatLabel(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const label = value.replace(/[_-]+/g, ' ').trim();
  return label ? label.replace(/^\w/, (character) => character.toUpperCase()) : undefined;
}

function formatAppointmentDate(date: Date): string {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';

  return date.toLocaleDateString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function formatAppointmentTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: brandColors.white,
    borderColor: brandColors.surfaceBlue,
    borderWidth: 1,
    gap: Spacing.three,
  },
  topRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: Spacing.two,
    justifyContent: 'space-between',
  },
  identity: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: Spacing.twoHalf,
    minWidth: 0,
  },
  iconMark: {
    alignItems: 'center',
    backgroundColor: brandColors.surfaceBlue,
    borderRadius: Radius.full,
    height: Spacing.five + Spacing.two,
    justifyContent: 'center',
    width: Spacing.five + Spacing.two,
  },
  identityCopy: {
    flex: 1,
    gap: Spacing.half,
    minWidth: 0,
  },
  date: {
    color: brandColors.primaryDark,
    fontFamily: Fonts.rounded,
    ...Typography.title,
  },
  time: {
    color: brandColors.slate,
    fontFamily: Fonts.sans,
    ...Typography.body,
  },
  statusArea: {
    alignItems: 'flex-end',
    gap: Spacing.one,
  },
  details: {
    gap: Spacing.two,
  },
  detailRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.two,
  },
  detailText: {
    color: brandColors.slate,
    flex: 1,
    fontFamily: Fonts.sans,
    ...Typography.body,
  },
  reason: {
    color: brandColors.primaryDark,
    fontFamily: Fonts.sans,
    ...Typography.body,
  },
  detailsAction: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: Spacing.one,
    justifyContent: 'center',
    minHeight: MIN_TOUCH_TARGET,
    paddingRight: Spacing.three,
  },
  detailsActionLabel: {
    color: brandColors.primary,
    fontFamily: Fonts.sans,
    ...Typography.body,
    fontWeight: Typography.weights.semibold,
  },
  actionPressed: {
    opacity: 0.7,
  },
  statusPill: { backgroundColor: brandColors.surfaceBlue, borderRadius: Radius.full, paddingHorizontal: Spacing.twoHalf, paddingVertical: Spacing.one },
  statusText: { color: brandColors.slate, fontFamily: Fonts.sans, fontSize: 11, fontWeight: '700' },
});
