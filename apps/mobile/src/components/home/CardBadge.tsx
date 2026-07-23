import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { Fonts, Radius, Spacing, brandColors, profileColors } from '@/constants/theme';

type CardBadgeProps = {
  label: string;
  showDot?: boolean;
};

export function CardBadge({ label, showDot = false }: CardBadgeProps) {
  return (
    <Animated.View entering={FadeIn.delay(400).duration(300)} style={styles.badge}>
      {showDot && <View style={styles.dot} />}
      <Text style={styles.text}>{label}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: profileColors.tint,
    borderRadius: Radius.pill,
    flexDirection: 'row',
    gap: Spacing.one,
    paddingHorizontal: Spacing.two + 2,
    paddingVertical: Spacing.one,
  },
  dot: {
    backgroundColor: brandColors.primary,
    borderRadius: Radius.pill,
    height: 6,
    width: 6,
  },
  text: {
    color: brandColors.primary,
    fontFamily: Fonts.sans,
    fontSize: 11,
    fontWeight: '700',
  },
});
