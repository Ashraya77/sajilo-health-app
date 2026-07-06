import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  BottomTabInset,
  Fonts,
  Radius,
  Spacing,
  brandColors,
  splashColors,
} from '@/constants/theme';

type MenuItemProps = {
  label: string;
  detail?: string;
  onPress?: () => void;
};

function MenuItem({ label, detail, onPress }: MenuItemProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.menuItem,
        pressed && styles.menuItemPressed,
      ]}>
      <Text style={styles.menuLabel}>{label}</Text>
      <Text style={styles.menuDetail}>{detail ?? '›'}</Text>
    </Pressable>
  );
}

type MenuSectionProps = {
  title: string;
  children: React.ReactNode;
};

function MenuSection({ title, children }: MenuSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );
}

function AvatarPlaceholder({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>{initials}</Text>
    </View>
  );
}

export function ProfileScreen() {
  const insets = useSafeAreaInsets();

  // Placeholder data — replace with real user data from a hook/store
  const user = {
    name: 'Ashraya',
    email: 'ashraya@sajilohealth.com',
    phone: '+977 98XXXXXXXX',
    memberSince: 'July 2025',
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + Spacing.five,
          paddingBottom: insets.bottom + BottomTabInset + Spacing.five,
        },
      ]}>
      {/* Profile header */}
      <View style={styles.profileHeader}>
        <AvatarPlaceholder name={user.name} />
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Member since {user.memberSince}</Text>
        </View>
      </View>

      {/* Account section */}
      <MenuSection title="Account">
        <MenuItem label="Edit profile" />
        <MenuItem label="Phone" detail={user.phone} />
        <MenuItem label="Email" detail={user.email} />
      </MenuSection>

      {/* Health section */}
      <MenuSection title="Health">
        <MenuItem label="Medical records" />
        <MenuItem label="Prescriptions" />
        <MenuItem label="Insurance info" />
      </MenuSection>

      {/* Preferences section */}
      <MenuSection title="Preferences">
        <MenuItem label="Notifications" />
        <MenuItem label="Language" detail="English" />
        <MenuItem label="Appearance" detail="System" />
      </MenuSection>

      {/* Support section */}
      <MenuSection title="Support">
        <MenuItem label="Help center" />
        <MenuItem label="Privacy policy" />
        <MenuItem label="Terms of service" />
      </MenuSection>

      {/* Sign out */}
      <Pressable
        style={({ pressed }) => [
          styles.signOutButton,
          pressed && styles.signOutPressed,
        ]}>
        <Text style={styles.signOutText}>Sign out</Text>
      </Pressable>

      <Text style={styles.version}>SajiloHealth v1.0.0</Text>
    </ScrollView>
  );
}

export default ProfileScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: brandColors.white,
  },
  content: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },

  /* ── Profile header ── */
  profileHeader: {
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.four,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: brandColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.one,
  },
  avatarText: {
    color: brandColors.white,
    fontFamily: Fonts.sans,
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: 0,
  },
  userName: {
    color: brandColors.primaryDark,
    fontFamily: Fonts.sans,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 0,
  },
  userEmail: {
    color: brandColors.slate,
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: 0,
  },
  badge: {
    marginTop: Spacing.one,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one + 2,
    borderRadius: Radius.pill,
    backgroundColor: splashColors.surfaceBorder,
  },
  badgeText: {
    color: brandColors.primaryMuted,
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0,
  },

  /* ── Sections ── */
  section: {
    gap: Spacing.two,
  },
  sectionTitle: {
    color: brandColors.slate,
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    paddingHorizontal: Spacing.one,
  },
  sectionCard: {
    borderRadius: Radius.medium,
    backgroundColor: brandColors.white,
    borderWidth: 1,
    borderColor: brandColors.surfaceBlue,
    overflow: 'hidden',
  },

  /* ── Menu items ── */
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: brandColors.surfaceBlue,
  },
  menuItemPressed: {
    backgroundColor: splashColors.surfaceBorder,
  },
  menuLabel: {
    color: brandColors.primaryDark,
    fontFamily: Fonts.sans,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0,
  },
  menuDetail: {
    color: brandColors.softBlue,
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: 0,
  },

  /* ── Sign out ── */
  signOutButton: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.small,
    borderWidth: 1,
    borderColor: brandColors.surfaceBlue,
    backgroundColor: brandColors.white,
  },
  signOutPressed: {
    backgroundColor: splashColors.surfaceBorder,
  },
  signOutText: {
    color: brandColors.primary,
    fontFamily: Fonts.sans,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0,
  },

  /* ── Footer ── */
  version: {
    textAlign: 'center',
    color: brandColors.softBlue,
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0,
  },
});
