import { Pressable, StyleSheet, View } from 'react-native';

import { Avatar, SkeletonBlock } from '@/components';
import { HomeGreeting } from '@/components/home/HomeGreeting';
import { Colors, Radius, Spacing } from '@/constants/theme';

const AVATAR_SIZE = Spacing.five + Spacing.two;
const PROFILE_ACTION_SIZE = Spacing.five + Spacing.twoHalf;

type HomeHeaderProps = {
  firstName?: string;
  greeting: string;
  photoUri?: string;
  isLoading: boolean;
  onProfilePress: () => void;
};

export function HomeHeader({
  firstName,
  greeting,
  photoUri,
  isLoading,
  onProfilePress,
}: HomeHeaderProps) {
  const avatarName = firstName ?? 'Patient';

  return (
    <View style={styles.container}>
      {isLoading ? <HeaderIdentitySkeleton /> : (
        <>
          <HomeGreeting
            firstName={firstName}
            greeting={greeting}
            supportingText="How can we help you today?"
          />
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
        </>
      )}
    </View>
  );
}

function HeaderIdentitySkeleton() {
  return (
    <View style={styles.loadingContainer}>
      <View style={styles.skeletonCopy}>
        <SkeletonBlock height={Spacing.three} radius={Radius.sm} width="38%" />
        <SkeletonBlock height={Spacing.four} radius={Radius.sm} width="62%" />
        <SkeletonBlock height={Spacing.three} radius={Radius.sm} width="76%" />
      </View>
      <SkeletonBlock height={AVATAR_SIZE} radius={Radius.full} width={AVATAR_SIZE} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    backgroundColor: Colors.background,
    flexDirection: 'row',
    gap: Spacing.three,
  },
  loadingContainer: {
    alignItems: 'flex-start',
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
    backgroundColor: Colors.surface,
  },
  skeletonCopy: {
    flex: 1,
    gap: Spacing.two,
  },
});
