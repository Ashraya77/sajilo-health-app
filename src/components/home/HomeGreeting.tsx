import { StyleSheet, Text, View } from 'react-native';

import { Fonts, Spacing, Typography, brandColors } from '@/constants/theme';

type HomeGreetingProps = {
  greeting: string;
  firstName?: string;
  supportingText: string;
};

export function HomeGreeting({ greeting, firstName, supportingText }: HomeGreetingProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>{greeting}</Text>
      <Text ellipsizeMode="tail" numberOfLines={1} style={styles.name}>
        {firstName ?? 'Welcome'}
      </Text>
      <Text numberOfLines={2} style={styles.supportingText}>
        {supportingText}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: Spacing.one,
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
  },
  supportingText: {
    color: brandColors.slate,
    fontFamily: Fonts.sans,
    ...Typography.bodyLarge,
  },
});
