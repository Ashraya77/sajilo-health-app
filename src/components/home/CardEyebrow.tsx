import { StyleSheet, Text, View } from 'react-native';

import { Fonts, Spacing, brandColors } from '@/constants/theme';
import type { CardEyebrowConfig } from '@/types/home';

type CardEyebrowProps = CardEyebrowConfig;

export function CardEyebrow({ icon: Icon, label }: CardEyebrowProps) {
  return (
    <View style={styles.row}>
      <Icon color={brandColors.primary} size={16} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.two,
  },
  label: {
    color: brandColors.primary,
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
});
