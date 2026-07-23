import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Fonts, Radius, Spacing, splashColors } from '@/constants/theme';

const LOGO_ASPECT_RATIO = 320 / 82;
const LOGO_SOURCE = require('@/assets/images/logo.png');
const WATERMARK_SOURCE = require('@/assets/images/logo1.png');
const DOTS = [0, 1, 2] as const;

type LoadingDotProps = {
  index: number;
};

function LoadingDot({ index }: LoadingDotProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      index * 140,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 420, easing: Easing.out(Easing.cubic) }),
          withTiming(0, { duration: 420, easing: Easing.in(Easing.cubic) })
        ),
        -1,
        false
      )
    );

    return () => {
      cancelAnimation(progress);
    };
  }, [index, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: 0.38 + progress.value * 0.62,
    transform: [{ translateY: -3 * progress.value }, { scale: 0.9 + progress.value * 0.12 }],
  }));

  const dotColor = index === 1 ? splashColors.primary : splashColors.primaryLight;

  return <Animated.View style={[styles.dot, { backgroundColor: dotColor }, animatedStyle]} />;
}

export function SplashScreen() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const logoWidth = Math.max(280, width - Spacing.four);
  const watermarkSize = Math.min(width * 0.94, height * 0.37);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.watermarkLayer]}>
        <Image
          source={WATERMARK_SOURCE}
          style={[
            styles.watermarkLogo,
            {
              width: watermarkSize,
              height: watermarkSize,
              right: -watermarkSize * 0.25,
              top: 0,
            },
          ]}
          contentFit="contain"
        />
        <Image
          source={WATERMARK_SOURCE}
          style={[
            styles.watermarkLogo,
            {
              width: watermarkSize,
              height: watermarkSize,
              left: -watermarkSize * 0.4,
              bottom: 0,
            },
          ]}
          contentFit="contain"
        />
      </View>

      <View style={styles.centerContent}>
        <View style={styles.logoShadow}>
          <Image
            accessibilityLabel="SajiloHealth"
            source={LOGO_SOURCE}
            style={{ width: logoWidth, height: logoWidth / LOGO_ASPECT_RATIO }}
            contentFit="contain"
          />
        </View>

        <View accessibilityLabel="Loading" accessibilityRole="progressbar" style={styles.loading}>
          {DOTS.map((dot) => (
            <LoadingDot key={dot} index={dot} />
          ))}
        </View>
      </View>

      <View
        style={[
          styles.taglineContainer,
          { paddingBottom: Math.max(insets.bottom + Spacing.three, Spacing.five) },
        ]}>
        <Text style={styles.tagline}>Better Health, Simpler Life</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: splashColors.background,
    overflow: 'hidden',
  },
  watermarkLayer: {
    overflow: 'hidden',
  },
  watermarkLogo: {
    position: 'absolute',
    opacity: 0.06,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.six,
  },
  logoShadow: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: splashColors.primaryDark,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
  },
  loading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    height: Spacing.four,
    marginTop: Spacing.four,
  },
  dot: {
    width: Spacing.two,
    height: Spacing.two,
    borderRadius: Radius.pill,
  },
  taglineContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
  },
  tagline: {
    color: splashColors.mutedText,
    fontFamily: Fonts.sans,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
    letterSpacing: 0,
    textAlign: 'center',
  },
});
