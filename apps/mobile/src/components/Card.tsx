import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

import { Colors, Radius, Spacing } from '@/constants/theme';

type CardProps = {
  children: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function Card({ children, onPress, style }: CardProps) {
  if (!onPress) return <View style={[styles.card, style]}>{children}</View>;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, style, pressed && styles.pressed]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.three,
  },
  pressed: { opacity: 0.8 },
});
