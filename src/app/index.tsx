import { Image } from 'expo-image';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  BottomTabInset,
  Fonts,
  Radius,
  Spacing,
  brandColors,
  splashColors,
} from '@/constants/theme';

const LOGO_SOURCE = require('@/assets/images/logo.png');

const careHighlights = [
  { label: 'Upcoming visit', value: 'Today, 4:30 PM' },
  { label: 'Care status', value: 'All records synced' },
] as const;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + Spacing.five,
          paddingBottom: insets.bottom + BottomTabInset + Spacing.five,
        },
      ]}>
      <View style={styles.header}>
        <Image source={LOGO_SOURCE} style={styles.logo} contentFit="contain" />
        <Text style={styles.eyebrow}>Welcome back</Text>
        <Text style={styles.title}>Your health, organized simply.</Text>
      </View>

      <View style={styles.primaryCard}>
        <Text style={styles.cardLabel}>Next step</Text>
        <Text style={styles.cardTitle}>Review your care timeline</Text>
        <Text style={styles.cardCopy}>
          Keep appointments, records, and health updates in one calm place.
        </Text>
      </View>

      <View style={styles.highlights}>
        {careHighlights.map((item) => (
          <View key={item.label} style={styles.highlightCard}>
            <Text style={styles.highlightLabel}>{item.label}</Text>
            <Text style={styles.highlightValue}>{item.value}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: brandColors.white,
  },
  content: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  header: {
    gap: Spacing.two,
  },
  logo: {
    width: '100%',
    height: 72,
    marginBottom: Spacing.three,
  },
  eyebrow: {
    color: brandColors.primary,
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0,
  },
  title: {
    color: brandColors.primaryDark,
    fontFamily: Fonts.sans,
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 38,
    letterSpacing: 0,
  },
  primaryCard: {
    gap: Spacing.two,
    padding: Spacing.four,
    borderRadius: Radius.large,
    backgroundColor: splashColors.surfaceBorder,
    borderWidth: 1,
    borderColor: brandColors.surfaceBlue,
  },
  cardLabel: {
    color: brandColors.primaryMuted,
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0,
  },
  cardTitle: {
    color: brandColors.primaryDark,
    fontFamily: Fonts.sans,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
    letterSpacing: 0,
  },
  cardCopy: {
    color: brandColors.slate,
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 22,
    letterSpacing: 0,
  },
  highlights: {
    gap: Spacing.three,
  },
  highlightCard: {
    padding: Spacing.four,
    borderRadius: Radius.medium,
    backgroundColor: brandColors.white,
    borderWidth: 1,
    borderColor: brandColors.surfaceBlue,
    shadowColor: brandColors.primaryDark,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 2,
  },
  highlightLabel: {
    color: brandColors.slate,
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    letterSpacing: 0,
  },
  highlightValue: {
    marginTop: Spacing.one,
    color: brandColors.primaryDark,
    fontFamily: Fonts.sans,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
    letterSpacing: 0,
  },
});
