import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Building2,
  CalendarDays,
  CalendarPlus,
  FileHeart,
  FlaskConical,
  Pill,
  Stethoscope,
  type LucideIcon,
} from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { Fonts, Radius, Spacing, Typography, brandColors } from '@/constants/theme';

const ACTION_ITEM_WIDTH = 86;
const ACTION_GAP = 14;
const ACTION_SNAP_INTERVAL = ACTION_ITEM_WIDTH + ACTION_GAP;
const SPRING_CONFIG = {
  damping: 16,
  mass: 0.55,
  reduceMotion: ReduceMotion.System,
  stiffness: 260,
};

type HomeQuickActionsProps = {
  onFindClinicsPress: () => void;
  onBookAppointmentPress: () => void;
  onAppointmentsPress: () => void;
  onRecordsPress: () => void;
};

type QuickAction = {
  accessibilityLabel: string;
  icon: LucideIcon;
  isPrimary?: boolean;
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
      accessibilityLabel: 'Book an appointment',
      icon: CalendarPlus,
      isPrimary: true,
      label: 'Book Appointment',
      onPress: onBookAppointmentPress,
    },
    {
      accessibilityLabel: 'Find doctors',
      icon: Stethoscope,
      label: 'Find Doctors',
      onPress: onFindClinicsPress,
    },
    {
      accessibilityLabel: 'Find clinics',
      icon: Building2,
      label: 'Find Clinics',
      onPress: onFindClinicsPress,
    },
    {
      accessibilityLabel: 'Open my appointments',
      icon: CalendarDays,
      label: 'My Appointments',
      onPress: onAppointmentsPress,
    },
    {
      accessibilityLabel: 'Open my medical records',
      icon: FileHeart,
      label: 'Medical Records',
      onPress: onRecordsPress,
    },
    {
      accessibilityLabel: 'Open my lab reports',
      icon: FlaskConical,
      label: 'Lab Reports',
      onPress: onRecordsPress,
    },
    {
      accessibilityLabel: 'Open my prescriptions',
      icon: Pill,
      label: 'Prescriptions',
      onPress: onRecordsPress,
    },
  ];

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Quick actions</Text>
      <ScrollView
        accessibilityLabel="Quick actions"
        contentContainerStyle={styles.actionsContent}
        decelerationRate="fast"
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToAlignment="start"
        snapToInterval={ACTION_SNAP_INTERVAL}
      >
        {actions.map((action) => (
          <QuickActionButton action={action} key={action.label} />
        ))}
      </ScrollView>
    </View>
  );
}

function QuickActionButton({ action }: { action: QuickAction }) {
  const scale = useSharedValue(1);
  const Icon = action.icon;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  function handlePressIn() {
    scale.set(withSpring(0.94, SPRING_CONFIG));
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
  }

  function handlePressOut() {
    scale.set(withSpring(1, SPRING_CONFIG));
  }

  const ringColors = action.isPrimary
    ? [brandColors.primaryDark, brandColors.primary, brandColors.primaryMuted, brandColors.softBlue] as const
    : [brandColors.primary, brandColors.primaryMuted, brandColors.softBlue, brandColors.surfaceBlue] as const;

  return (
    <Animated.View style={[styles.actionItem, animatedStyle]}>
      <Pressable
        accessibilityHint="Double tap to open"
        accessibilityLabel={action.accessibilityLabel}
        accessibilityRole="button"
        onPress={action.onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.actionPressable}
      >
        <LinearGradient
          colors={ringColors}
          end={{ x: 1, y: 1 }}
          start={{ x: 0, y: 0 }}
          style={[styles.ring, action.isPrimary && styles.primaryRing]}
        >
          <View style={styles.iconSurface}>
            <Icon
              color={action.isPrimary ? brandColors.primaryDark : brandColors.primary}
              size={action.isPrimary ? 35 : 31}
              strokeWidth={action.isPrimary ? 2.2 : 2}
            />
          </View>
        </LinearGradient>
        <Text numberOfLines={2} style={[styles.actionLabel, action.isPrimary && styles.primaryLabel]}>
          {action.label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.three,
  },
  sectionTitle: {
    color: brandColors.primaryDark,
    fontFamily: Fonts.rounded,
    ...Typography.title,
    fontWeight: '700',
  },
  actionsContent: {
    gap: ACTION_GAP,
    paddingBottom: Spacing.one,
    paddingRight: Spacing.four,
  },
  actionItem: {
    width: ACTION_ITEM_WIDTH,
  },
  actionPressable: {
    alignItems: 'center',
    minHeight: 126,
    width: '100%',
  },
  ring: {
    alignItems: 'center',
    borderRadius: Radius.full,
    height: 78,
    justifyContent: 'center',
    padding: 3,
    width: 78,
  },
  primaryRing: {
    height: 86,
    padding: 4,
    width: 86,
  },
  iconSurface: {
    alignItems: 'center',
    backgroundColor: brandColors.white,
    borderRadius: Radius.full,
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  actionLabel: {
    color: brandColors.slate,
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: Typography.weights.semibold,
    lineHeight: 16,
    marginTop: Spacing.two,
    minHeight: 32,
    textAlign: 'center',
    width: '100%',
  },
  primaryLabel: {
    color: brandColors.primaryDark,
    fontWeight: '700',
  },
});
