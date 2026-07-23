import { StyleSheet, Text, View } from 'react-native';

import { Fonts, Spacing, Typography, brandColors } from '@/constants/theme';

type HomeGreetingProps = {
  greeting: string;
  firstName?: string;
  supportingText: string;
};

export function HomeGreeting({ greeting, firstName, supportingText }: HomeGreetingProps) {
  return (
    <View
      style={styles.container}
      accessible
      accessibilityRole="header"
      accessibilityLabel={`${greeting}, ${firstName ?? 'Welcome'}. ${supportingText}`}
    >
      <View style={styles.headline}>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.greeting}>
          {greeting}
        </Text>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.name}>
          {firstName ?? 'Welcome'}
        </Text>
      </View>
      <Text numberOfLines={2} style={styles.supportingText}>
        {supportingText}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: Spacing.two,
    minWidth: 0,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: brandColors.primaryMuted,
    borderRadius: Spacing.two,
    padding: Spacing.two,
    // blend the line into the surface instead of a hard stroke
    opacity: 1,
  },
  headline: {
    gap: Spacing.half ?? 2,
    minWidth: 0,
  },
  greeting: {
    color: brandColors.primaryMuted,
    fontFamily: Fonts.sans,
    ...Typography.body,
    fontWeight: Typography.weights.medium,
  },
  name: {
    color: brandColors.primaryDark,
    fontFamily: Fonts.rounded,
    ...Typography.heading,
    fontWeight: Typography.weights.semibold,
    lineHeight: (Typography.heading.fontSize ?? 24) * 1.15,
  },
  supportingText: {
    color: brandColors.slate,
    fontFamily: Fonts.sans,
    ...Typography.body,
    opacity: 0.85,
  },
});