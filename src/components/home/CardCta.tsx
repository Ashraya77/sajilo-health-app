import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { Fonts, Radius, Spacing, brandColors } from '@/constants/theme';

type CardCtaProps = {
  label: string;
  onPress?: () => void;
};

const SPRING_CONFIG = { damping: 15, stiffness: 200 };

export function CardCta({ label, onPress }: CardCtaProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  function handlePressIn() {
    scale.set(withSpring(0.96, SPRING_CONFIG));
  }

  function handlePressOut() {
    scale.set(withSpring(1, SPRING_CONFIG));
  }

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      >
        <Text style={styles.text}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: brandColors.primary,
    borderRadius: Radius.pill,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: Spacing.three + Spacing.two,
  },
  pressed: {
    backgroundColor: brandColors.primaryMuted,
  },
  text: {
    color: brandColors.white,
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '800',
  },
});
