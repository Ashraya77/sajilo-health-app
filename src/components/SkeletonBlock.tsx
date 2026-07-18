import { useEffect } from 'react';
import type { DimensionValue } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { Colors, Radius } from '@/constants/theme';

type SkeletonBlockProps = { width: DimensionValue; height: number; radius?: number };

export function SkeletonBlock({ width, height, radius = Radius.md }: SkeletonBlockProps) {
  const opacity = useSharedValue(0.45);

  useEffect(() => {
    opacity.set(withRepeat(withTiming(1, { duration: 700, easing: Easing.inOut(Easing.ease) }), -1, true));
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return <Animated.View style={[{ backgroundColor: Colors.border, borderRadius: radius, height, width }, animatedStyle]} />;
}
