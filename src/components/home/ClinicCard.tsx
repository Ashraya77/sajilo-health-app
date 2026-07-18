import { ChevronRight, MapPin } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Avatar, Card } from '@/components';
import { Colors, Fonts, Radius, Spacing, Typography } from '@/constants/theme';
import type { ClinicPreview } from '@/types/clinic';

const CLINIC_AVATAR_SIZE = Spacing.five + Spacing.three;
const CLINIC_CARD_MIN_HEIGHT = Spacing.six * 3 + Spacing.four;

type ClinicCardProps = {
  clinic: ClinicPreview;
  onPress: (clinic: ClinicPreview) => void;
  width: number;
};

export function ClinicCard({ clinic, onPress, width }: ClinicCardProps) {
  return (
    <Pressable
      accessibilityHint="Clinic details will be connected during integration"
      accessibilityLabel={`${clinic.name}. ${clinic.clinicType}. ${clinic.location}. Preview clinic details`}
      accessibilityRole="button"
      onPress={() => onPress(clinic)}
      style={({ pressed }) => pressed && styles.pressed}
    >
      <Card style={[styles.card, { width }]}>
        <View style={styles.header}>
          <Avatar name={clinic.name} size={CLINIC_AVATAR_SIZE} uri={clinic.imageUri} />
          <View style={styles.headingCopy}>
            <Text numberOfLines={2} style={styles.name}>{clinic.name}</Text>
            <Text numberOfLines={2} style={styles.clinicType}>{clinic.clinicType}</Text>
          </View>
        </View>

        <View style={styles.locationRow}>
          <MapPin color={Colors.primary} size={Spacing.three} />
          <Text numberOfLines={2} style={styles.location}>{clinic.location}</Text>
        </View>

        <View style={styles.actionRow}>
          <Text style={styles.actionLabel}>Preview clinic</Text>
          <ChevronRight color={Colors.primary} size={Spacing.three} />
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  actionLabel: {
    color: Colors.primary,
    fontFamily: Fonts.sans,
    ...Typography.body,
    fontWeight: Typography.weights.semibold,
  },
  actionRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.one,
  },
  card: {
    gap: Spacing.three,
    justifyContent: 'space-between',
    minHeight: CLINIC_CARD_MIN_HEIGHT,
  },
  clinicType: {
    color: Colors.textSecondary,
    fontFamily: Fonts.sans,
    ...Typography.body,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.twoHalf,
  },
  headingCopy: {
    flex: 1,
    gap: Spacing.half,
    minWidth: 0,
  },
  location: {
    color: Colors.textSecondary,
    flex: 1,
    fontFamily: Fonts.sans,
    ...Typography.body,
  },
  locationRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: Spacing.two,
  },
  name: {
    color: Colors.textPrimary,
    fontFamily: Fonts.rounded,
    ...Typography.title,
  },
  pressed: {
    borderRadius: Radius.lg,
    opacity: 0.78,
  },
});
