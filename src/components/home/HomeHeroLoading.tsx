import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { Radius, Spacing, profileColors } from '@/constants/theme';

export function HomeHeroLoading() {
  const opacity = useSharedValue(0.45);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 850, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [opacity]);

  const pulse = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.greeting}>
        <Animated.View style={[styles.eyebrowSkeleton, pulse]} />
        <Animated.View style={[styles.nameSkeleton, pulse]} />
        <Animated.View style={[styles.subtitleSkeleton, pulse]} />
      </View>
      <Animated.View style={[styles.cardSkeleton, pulse]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.four,
  },
  greeting: {
    gap: Spacing.two,
  },
  eyebrowSkeleton: {
    backgroundColor: profileColors.tint,
    borderRadius: Radius.small,
    height: 16,
    width: 120,
  },
  nameSkeleton: {
    backgroundColor: profileColors.tint,
    borderRadius: Radius.small,
    height: 36,
    width: 200,
  },
  subtitleSkeleton: {
    backgroundColor: profileColors.tint,
    borderRadius: Radius.small,
    height: 18,
    width: 260,
  },
  cardSkeleton: {
    backgroundColor: profileColors.tint,
    borderRadius: Radius.large,
    height: 240,
  },
});
