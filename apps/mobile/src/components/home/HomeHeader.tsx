import { LinearGradient } from 'expo-linear-gradient';
import { Menu } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar, SkeletonBlock } from '@/components';
import { Fonts, Radius, Spacing, brandColors } from '@/constants/theme';

const AVATAR_SIZE = Spacing.five + Spacing.two;
const PROFILE_ACTION_SIZE = Spacing.five + Spacing.twoHalf;

type HomeHeaderProps = {
  firstName?: string;
  greeting: string;
  photoUri?: string;
  isLoading: boolean;
  onProfilePress: () => void;
  onMenuPress: () => void;
};

export function HomeHeader({
  firstName,
  greeting,
  photoUri,
  isLoading,
  onProfilePress,
  onMenuPress,
}: HomeHeaderProps) {
  const insets = useSafeAreaInsets();
  const avatarName = firstName ?? 'Patient';

  return (
    <LinearGradient
      colors={[brandColors.primaryDark, brandColors.slate, brandColors.primary]}
      end={{ x: 1, y: 1 }}
      start={{ x: 0, y: 0 }}
      style={[styles.container, { paddingTop: insets.top + Spacing.four }]}
    >
      <View pointerEvents="none" style={styles.glow} />
      <View pointerEvents="none" style={styles.curve} />
      <View style={styles.identityRow}>
        {isLoading ? <HeaderIdentitySkeleton /> : (
          <>
          <Pressable
            accessibilityHint="Navigates to your profile"
            accessibilityLabel="Open profile"
            accessibilityRole="button"
            accessible
            hitSlop={Spacing.two}
            onPress={onProfilePress}
            style={({ pressed }) => [styles.profileAction, pressed && styles.profileActionPressed]}
          >
            <Avatar name={avatarName} size={AVATAR_SIZE} uri={photoUri} />
          </Pressable>
          <View style={styles.greetingCopy}>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text numberOfLines={1} style={styles.name}>{firstName ?? 'Welcome back'}</Text>
          </View>
          <Pressable
            accessibilityHint="Opens account and navigation shortcuts"
            accessibilityLabel="Open menu"
            accessibilityRole="button"
            hitSlop={Spacing.two}
            onPress={onMenuPress}
            style={({ pressed }) => [styles.menuAction, pressed && styles.profileActionPressed]}
          >
            <Menu color={brandColors.white} size={24} strokeWidth={2.2} />
          </Pressable>
          </>
        )}
      </View>
    </LinearGradient>
  );
}

function HeaderIdentitySkeleton() {
  return (
    <View style={styles.loadingContainer}>
      <SkeletonBlock color={brandColors.surfaceBlue} height={AVATAR_SIZE} radius={Radius.full} width={AVATAR_SIZE} />
      <View style={styles.skeletonCopy}>
        <SkeletonBlock color={brandColors.surfaceBlue} height={Spacing.twoHalf} radius={Radius.sm} width="34%" />
        <SkeletonBlock color={brandColors.surfaceBlue} height={Spacing.four} radius={Radius.sm} width="58%" />
      </View>
      <SkeletonBlock color={brandColors.surfaceBlue} height={46} radius={Radius.full} width={46} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
    overflow: 'hidden',
    paddingBottom: Spacing.four,
    paddingHorizontal: Spacing.four,
    position: 'relative',
  },
  identityRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.three,
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: Spacing.three,
  },
  profileAction: {
    alignItems: 'center',
    borderRadius: Radius.full,
    height: PROFILE_ACTION_SIZE,
    justifyContent: 'center',
    width: PROFILE_ACTION_SIZE,
  },
  profileActionPressed: {
    opacity: 0.72,
  },
  greetingCopy: { flex: 1, gap: 2, minWidth: 0 },
  greeting: { color: brandColors.surfaceBlue, fontFamily: Fonts.sans, fontSize: 13, fontWeight: '600', lineHeight: 18 },
  name: { color: brandColors.white, fontFamily: Fonts.rounded, fontSize: 22, fontWeight: '800', letterSpacing: -0.3, lineHeight: 28 },
  menuAction: {
    alignItems: 'center',
    borderRadius: Radius.full,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  skeletonCopy: {
    flex: 1,
    gap: Spacing.two,
  },
  glow: { backgroundColor: brandColors.softBlue, borderRadius: 100, height: 180, opacity: 0.2, position: 'absolute', right: -54, top: -86, width: 180 },
  curve: { borderColor: brandColors.white, borderRadius: 140, borderWidth: 1, bottom: -128, height: 240, opacity: 0.14, position: 'absolute', right: -22, width: 310 },
});
