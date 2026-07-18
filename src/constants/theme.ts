/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const brandColors = {
  primary: '#3A6AD6',
  primaryDark: '#131C34',
  primaryMuted: '#4A71C7',
  slate: '#2F436F',
  softBlue: '#95A7CA',
  surfaceBlue: '#D9E1EE',
  white: '#FFFFFF',
} as const;

/** Shared semantic tokens for all product UI. */
export const Colors = {
  primary: brandColors.primary,
  background: brandColors.white,
  surface: '#F7F9FA',
  textPrimary: '#1A1A1A',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  success: '#237A57',
  warning: '#A96810',
  danger: '#C2465C',
  info: brandColors.primary,
  successSurface: '#E7F5EE',
  warningSurface: '#FFF4DE',
  dangerSurface: '#FDECEF',
  infoSurface: brandColors.surfaceBlue,
} as const;

export const splashColors = {
  background: brandColors.white,
  primaryDark: '#1D2D5C',
  primary: '#4A7FF0',
  primaryLight: '#6D9BFF',
  surface: brandColors.white,
  surfaceBorder: '#EEF3FF',
  mutedText: '#8392B5',
  inactiveDot: '#C9D7F5',
  watermark: '#4A7FF0',
} as const;

export const profileColors = {
  canvas: '#F5F8FE',
  tint: '#EAF0FF',
  sky: '#EAF6FF',
  card: brandColors.white,
  shadow: '#172B5A',
  danger: '#C2465C',
  dangerSurface: '#FDECEF',
  darkCanvas: '#0E1730',
  darkCard: '#17213D',
  darkText: '#F5F8FF',
} as const;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  twoHalf: 12,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  small: 8,
  sm: 8,
  md: 12,
  lg: 16,
  medium: 16,
  large: 28,
  full: 999,
  pill: 999,
} as const;

export const Typography = {
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '400' },
  body: { fontSize: 14, lineHeight: 20, fontWeight: '400' },
  bodyLarge: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
  title: { fontSize: 18, lineHeight: 24, fontWeight: '600' },
  heading: { fontSize: 22, lineHeight: 28, fontWeight: '600' },
  weights: { regular: '400', medium: '500', semibold: '600' },
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
