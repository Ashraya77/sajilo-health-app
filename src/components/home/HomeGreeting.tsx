import { StyleSheet, Text, View } from 'react-native';

import { Fonts, Spacing, brandColors } from '@/constants/theme';

type HomeGreetingProps = {
  greeting: string;
  firstName: string;
  subtitle: string;
};

export function HomeGreeting({ greeting, firstName, subtitle }: HomeGreetingProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>{greeting}</Text>
      <Text style={styles.name}>{firstName}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 0,
  },
  eyebrow: {
    color: brandColors.primaryMuted,
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0,
    lineHeight: 20,
  },
  name: {
    color: brandColors.primaryDark,
    fontFamily: Fonts.rounded,
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: 0,
    lineHeight: 40,
    marginTop: Spacing.one,
  },
  subtitle: {
    color: brandColors.slate,
    fontFamily: Fonts.sans,
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0,
    lineHeight: 23,
    marginTop: Spacing.two,
  },
});
