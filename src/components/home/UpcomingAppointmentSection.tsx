import { CalendarPlus, RefreshCw } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/Card';
import { SectionHeader } from '@/components/SectionHeader';
import { SkeletonBlock } from '@/components/SkeletonBlock';
import { UpcomingAppointmentCard } from '@/components/home/UpcomingAppointmentCard';
import { Colors, Fonts, Radius, Spacing, Typography } from '@/constants/theme';
import type { UpcomingAppointmentViewState } from '@/hooks/useUpcomingAppointment';

const MIN_TOUCH_TARGET = Spacing.five + Spacing.twoHalf;

type UpcomingAppointmentSectionProps = {
  state: UpcomingAppointmentViewState;
  isRefreshing: boolean;
  onBookAppointment: () => void;
  onOpenDetails: (appointmentId: string) => void;
  onRetry: () => void;
  onViewAll: () => void;
};

export function UpcomingAppointmentSection({
  state,
  isRefreshing,
  onBookAppointment,
  onOpenDetails,
  onRetry,
  onViewAll,
}: UpcomingAppointmentSectionProps) {
  const appointmentId = state.status === 'populated' ? state.appointment.id : undefined;
  const openDetails = appointmentId ? () => onOpenDetails(appointmentId) : undefined;

  return (
    <View style={styles.section}>
      <SectionHeader
        onSeeAllPress={onViewAll}
        seeAllAccessibilityLabel="View all appointments"
        title="Upcoming appointment"
      />
      {state.status === 'loading' && <AppointmentLoading />}
      {state.status === 'error' && (
        <AppointmentError message={state.message} onRetry={onRetry} />
      )}
      {state.status === 'empty' && (
        <AppointmentEmpty onBookAppointment={onBookAppointment} />
      )}
      {state.status === 'populated' && (
        <UpcomingAppointmentCard
          appointment={state.appointment}
          isRefreshing={isRefreshing}
          onOpenDetails={openDetails}
        />
      )}
    </View>
  );
}

function AppointmentLoading() {
  return (
    <Card style={styles.loadingCard}>
      <View style={styles.loadingHeader}>
        <SkeletonBlock height={Spacing.five + Spacing.two} radius={Radius.full} width={Spacing.five + Spacing.two} />
        <View style={styles.loadingCopy}>
          <SkeletonBlock height={Spacing.three} width="52%" />
          <SkeletonBlock height={Spacing.twoHalf} width="34%" />
        </View>
      </View>
      <SkeletonBlock height={Spacing.three} width="68%" />
    </Card>
  );
}

function AppointmentEmpty({ onBookAppointment }: { onBookAppointment: () => void }) {
  return (
    <Card style={styles.stateCard}>
      <CalendarPlus color={Colors.primary} size={Spacing.four} />
      <View style={styles.stateCopy}>
        <Text style={styles.stateTitle}>No upcoming appointment</Text>
        <Text style={styles.stateBody}>You don’t have an appointment scheduled.</Text>
        <StateAction label="Book appointment" onPress={onBookAppointment} />
      </View>
    </Card>
  );
}

function AppointmentError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <Card style={styles.stateCard}>
      <RefreshCw color={Colors.primary} size={Spacing.four} />
      <View style={styles.stateCopy}>
        <Text style={styles.stateTitle}>{message}</Text>
        <StateAction label="Try again" onPress={onRetry} />
      </View>
    </Card>
  );
}

function StateAction({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.stateAction, pressed && styles.stateActionPressed]}
    >
      <Text style={styles.stateActionLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.three,
  },
  loadingCard: {
    gap: Spacing.three,
  },
  loadingHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.twoHalf,
  },
  loadingCopy: {
    flex: 1,
    gap: Spacing.two,
  },
  stateCard: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: Spacing.three,
  },
  stateCopy: {
    flex: 1,
    gap: Spacing.one,
  },
  stateTitle: {
    color: Colors.textPrimary,
    fontFamily: Fonts.rounded,
    ...Typography.title,
  },
  stateBody: {
    color: Colors.textSecondary,
    fontFamily: Fonts.sans,
    ...Typography.body,
  },
  stateAction: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    justifyContent: 'center',
    minHeight: MIN_TOUCH_TARGET,
    paddingRight: Spacing.three,
  },
  stateActionPressed: {
    opacity: 0.7,
  },
  stateActionLabel: {
    color: Colors.primary,
    fontFamily: Fonts.sans,
    ...Typography.body,
    fontWeight: Typography.weights.semibold,
  },
});
