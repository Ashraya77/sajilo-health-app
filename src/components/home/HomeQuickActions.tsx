import {
  Building2,
  CalendarDays,
  CalendarPlus,
  FileText,
  type LucideIcon,
} from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { SectionHeader } from '@/components/SectionHeader';
import { Colors, Fonts, Radius, Spacing, Typography } from '@/constants/theme';

type HomeQuickActionsProps = {
  onFindClinicsPress: () => void;
  onBookAppointmentPress: () => void;
  onAppointmentsPress: () => void;
  onRecordsPress: () => void;
};

type QuickAction = {
  accessibilityLabel: string;
  icon: LucideIcon;
  label: string;
  onPress: () => void;
};

export function HomeQuickActions({
  onFindClinicsPress,
  onBookAppointmentPress,
  onAppointmentsPress,
  onRecordsPress,
}: HomeQuickActionsProps) {
  const actions: QuickAction[] = [
    {
      accessibilityLabel: 'Find clinics',
      icon: Building2,
      label: 'Find clinics',
      onPress: onFindClinicsPress,
    },
    {
      accessibilityLabel: 'Choose a clinic to book an appointment',
      icon: CalendarPlus,
      label: 'Book appointment',
      onPress: onBookAppointmentPress,
    },
    {
      accessibilityLabel: 'Open my appointments',
      icon: CalendarDays,
      label: 'My appointments',
      onPress: onAppointmentsPress,
    },
    {
      accessibilityLabel: 'Open my prescriptions and records',
      icon: FileText,
      label: 'My records',
      onPress: onRecordsPress,
    },
  ];

  return (
    <View style={styles.section}>
      <SectionHeader title="Quick actions" />
      <View style={styles.grid}>
        <View style={styles.row}>
          {actions.slice(0, 2).map((action) => (
            <QuickActionButton action={action} key={action.label} />
          ))}
        </View>
        <View style={styles.row}>
          {actions.slice(2).map((action) => (
            <QuickActionButton action={action} key={action.label} />
          ))}
        </View>
      </View>
    </View>
  );
}

function QuickActionButton({ action }: { action: QuickAction }) {
  const Icon = action.icon;

  return (
    <Pressable
      accessibilityLabel={action.accessibilityLabel}
      accessibilityRole="button"
      onPress={action.onPress}
      style={({ pressed }) => [styles.action, pressed && styles.actionPressed]}
    >
      <View style={styles.actionIcon}>
        <Icon color={Colors.primary} size={Spacing.four} />
      </View>
      <Text numberOfLines={2} style={styles.actionLabel}>
        {action.label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.three,
  },
  grid: {
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  action: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    flex: 1,
    flexDirection: 'row',
    gap: Spacing.two,
    minHeight: Spacing.six,
    minWidth: 0,
    paddingHorizontal: Spacing.twoHalf,
  },
  actionPressed: {
    backgroundColor: Colors.infoSurface,
  },
  actionIcon: {
    alignItems: 'center',
    backgroundColor: Colors.infoSurface,
    borderRadius: Radius.full,
    height: Spacing.five + Spacing.two,
    justifyContent: 'center',
    width: Spacing.five + Spacing.two,
  },
  actionLabel: {
    color: Colors.textPrimary,
    flex: 1,
    fontFamily: Fonts.sans,
    ...Typography.body,
    fontWeight: Typography.weights.medium,
  },
});
