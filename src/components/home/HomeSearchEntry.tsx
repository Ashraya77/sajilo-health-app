import { ChevronRight, Search } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, Fonts, Radius, Spacing, Typography } from '@/constants/theme';

type HomeSearchEntryProps = {
  onPress: () => void;
};

export function HomeSearchEntry({ onPress }: HomeSearchEntryProps) {
  return (
    <Pressable
      accessibilityHint="Opens patient search"
      accessibilityLabel="Search clinics, doctors, or services"
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.containerPressed]}
    >
      <View style={styles.iconContainer}>
        <Search color={Colors.primary} size={Spacing.four} />
      </View>
      <Text numberOfLines={2} style={styles.label}>
        Search clinics, doctors, or services
      </Text>
      <ChevronRight color={Colors.textSecondary} size={Spacing.four} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    flexDirection: 'row',
    gap: Spacing.twoHalf,
    minHeight: Spacing.six,
    paddingHorizontal: Spacing.three,
  },
  containerPressed: {
    backgroundColor: Colors.infoSurface,
  },
  iconContainer: {
    alignItems: 'center',
    backgroundColor: Colors.infoSurface,
    borderRadius: Radius.full,
    height: Spacing.five + Spacing.two,
    justifyContent: 'center',
    width: Spacing.five + Spacing.two,
  },
  label: {
    color: Colors.textSecondary,
    flex: 1,
    fontFamily: Fonts.sans,
    ...Typography.bodyLarge,
  },
});
