import { Bell, Search } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Avatar, SkeletonBlock } from '@/components';
import { Colors, Fonts, Radius, Spacing, Typography } from '@/constants/theme';

type HomeHeaderProps = {
  firstName: string;
  photoUri?: string;
  isLoading: boolean;
  topInset: number;
  onSearchPress?: () => void;
  onNotificationsPress?: () => void;
};

export function HomeHeader({
  firstName,
  photoUri,
  isLoading,
  topInset,
  onSearchPress,
  onNotificationsPress,
}: HomeHeaderProps) {
  return (
    <View style={[styles.container, { paddingTop: topInset + Spacing.three }]}>
      {isLoading ? <HeaderIdentitySkeleton /> : (
        <View style={styles.identity}>
          <Avatar name={firstName} size={40} uri={photoUri} />
          <View>
            <Text style={styles.greeting}>Hi there 👋</Text>
            <Text style={styles.name}>{firstName}</Text>
          </View>
        </View>
      )}

      <View style={styles.actions}>
        <IconButton accessibilityLabel="Search" icon={Search} onPress={onSearchPress} />
        <View>
          <IconButton accessibilityLabel="Notifications" icon={Bell} onPress={onNotificationsPress} />
          <View accessibilityLabel="Unread notifications" style={styles.notificationDot} />
        </View>
      </View>
    </View>
  );
}

function HeaderIdentitySkeleton() {
  return (
    <View style={styles.identity}>
      <SkeletonBlock height={40} radius={Radius.full} width={40} />
      <View style={styles.skeletonCopy}>
        <SkeletonBlock height={12} radius={Radius.sm} width={72} />
        <SkeletonBlock height={16} radius={Radius.sm} width={112} />
      </View>
    </View>
  );
}

type IconButtonProps = {
  accessibilityLabel: string;
  icon: typeof Search;
  onPress?: () => void;
};

function IconButton({ accessibilityLabel, icon: Icon, onPress }: IconButtonProps) {
  return (
    <Pressable accessibilityLabel={accessibilityLabel} accessibilityRole="button" hitSlop={Spacing.two} onPress={onPress} style={styles.iconButton}>
      <Icon color={Colors.textPrimary} size={24} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: Colors.background,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.three,
  },
  identity: { alignItems: 'center', flexDirection: 'row', gap: Spacing.two },
  greeting: { color: Colors.textSecondary, fontFamily: Fonts.sans, ...Typography.caption },
  name: { color: Colors.textPrimary, fontFamily: Fonts.sans, ...Typography.bodyLarge, fontWeight: Typography.weights.semibold },
  actions: { alignItems: 'center', flexDirection: 'row', gap: Spacing.two },
  iconButton: { alignItems: 'center', height: 32, justifyContent: 'center', width: 32 },
  notificationDot: { backgroundColor: Colors.danger, borderColor: Colors.background, borderRadius: Radius.full, borderWidth: 2, height: 10, position: 'absolute', right: 1, top: 1, width: 10 },
  skeletonCopy: { gap: Spacing.one },
});
