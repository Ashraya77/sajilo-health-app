import { ChevronRight, Search } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Fonts, Radius, Spacing, Typography, brandColors } from '@/constants/theme';

type HomeSearchEntryProps = {
  onPress: () => void;
};

export function HomeSearchEntry({ onPress }: HomeSearchEntryProps) {
  return (
    <Pressable
      accessibilityHint="Opens patient search"
      accessibilityLabel="Search doctors, clinics, specialties, or health concerns"
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.containerPressed]}
    >
      <View style={styles.iconContainer}>
        <Search color={brandColors.primary} size={20} />
      </View>
      <Text numberOfLines={2} style={styles.label}>
        Search doctors, clinics & specialties
      </Text>
      <ChevronRight color={brandColors.softBlue} size={Spacing.four} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: brandColors.white,
    borderColor: brandColors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: Spacing.twoHalf,
    minHeight: 56,
    shadowColor: brandColors.primaryDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 2,
    paddingHorizontal: Spacing.three,
  },
  containerPressed: {
    backgroundColor: brandColors.surfaceBlue,
  },
  iconContainer: {
    alignItems: 'center',
    backgroundColor: brandColors.surfaceBlue,
    borderRadius: Radius.full,
    height: Spacing.five + Spacing.two,
    justifyContent: 'center',
    width: Spacing.five + Spacing.two,
  },
  label: {
    color: brandColors.slate,
    flex: 1,
    fontFamily: Fonts.sans,
    ...Typography.bodyLarge,
  },
});
