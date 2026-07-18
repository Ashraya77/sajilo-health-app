import { StyleSheet, Text, View } from 'react-native';

import { Colors, Radius, Spacing, Typography } from '@/constants/theme';

type BadgeVariant = 'success' | 'warning' | 'neutral' | 'info';

type BadgeProps = { label: string; variant?: BadgeVariant };

const variantStyles = {
  success: { backgroundColor: Colors.successSurface, color: Colors.success },
  warning: { backgroundColor: Colors.warningSurface, color: Colors.warning },
  neutral: { backgroundColor: Colors.surface, color: Colors.textSecondary },
  info: { backgroundColor: Colors.infoSurface, color: Colors.info },
} as const;

export function Badge({ label, variant = 'neutral' }: BadgeProps) {
  const colors = variantStyles[variant];
  return (
    <View style={[styles.badge, { backgroundColor: colors.backgroundColor }]}>
      <Text style={[styles.label, { color: colors.color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { alignSelf: 'flex-start', borderRadius: Radius.full, paddingHorizontal: Spacing.two, paddingVertical: Spacing.half },
  label: { ...Typography.caption, fontWeight: Typography.weights.medium },
});
