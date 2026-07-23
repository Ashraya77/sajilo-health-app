import {
  Bell,
  Bookmark,
  CalendarDays,
  ChevronRight,
  CircleHelp,
  FileHeart,
  LogOut,
  MessageCircle,
  Settings,
  UserRound,
  X,
  type LucideIcon,
} from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar } from '@/components/Avatar';
import { Fonts, Radius, Spacing, brandColors } from '@/constants/theme';

export type HomeDrawerDestination =
  | 'profile'
  | 'appointments'
  | 'records'
  | 'saved'
  | 'notifications'
  | 'contact'
  | 'help'
  | 'settings';

type HomeDrawerProps = {
  email?: string;
  name: string;
  photoUri?: string;
  visible: boolean;
  onClose: () => void;
  onLogout: () => void;
  onNavigate: (destination: HomeDrawerDestination) => void;
};

type MenuItem = {
  destination: HomeDrawerDestination;
  icon: LucideIcon;
  label: string;
  available: boolean;
};

// ─── Menu sections ───────────────────────────────────────────────────────────
const PRIMARY_ITEMS: MenuItem[] = [
  { destination: 'profile', icon: UserRound, label: 'Profile', available: true },
  { destination: 'appointments', icon: CalendarDays, label: 'Appointments', available: true },
  { destination: 'records', icon: FileHeart, label: 'Health Records', available: true },
  { destination: 'saved', icon: Bookmark, label: 'Saved Doctors', available: true },
];

const SECONDARY_ITEMS: MenuItem[] = [
  { destination: 'notifications', icon: Bell, label: 'Notifications', available: false },
  { destination: 'contact', icon: MessageCircle, label: 'Contact Us', available: false },
  { destination: 'help', icon: CircleHelp, label: 'Help', available: false },
  { destination: 'settings', icon: Settings, label: 'Settings', available: false },
];

// ─── Component ───────────────────────────────────────────────────────────────
export function HomeDrawer({
  email,
  name,
  photoUri,
  visible,
  onClose,
  onLogout,
  onNavigate,
}: HomeDrawerProps) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [progress] = useState(() => new Animated.Value(0));

  // Slide the full-screen panel in from the right
  const translateX = useMemo(
    () => progress.interpolate({ inputRange: [0, 1], outputRange: [width, 0] }),
    [width, progress],
  );
  const overlayOpacity = useMemo(
    () => progress.interpolate({ inputRange: [0, 1], outputRange: [0, 0.38] }),
    [progress],
  );

  // Staggered item animations
  const totalItems = PRIMARY_ITEMS.length + SECONDARY_ITEMS.length + 1; // +1 for logout
  const [itemAnims] = useState(() =>
    Array.from({ length: totalItems }, () => new Animated.Value(0)),
  );

  useEffect(() => {
    if (!visible) {
      progress.setValue(0);
      for (const anim of itemAnims) anim.setValue(0);
      return;
    }

    // Slide entrance
    Animated.spring(progress, {
      toValue: 1,
      damping: 24,
      stiffness: 220,
      mass: 0.85,
      useNativeDriver: true,
    }).start();

    // Staggered menu items
    const staggerAnims = itemAnims.map((anim, i) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 300,
        delay: 140 + i * 45,
        useNativeDriver: true,
      }),
    );
    Animated.stagger(0, staggerAnims).start();
  }, [itemAnims, progress, visible]);

  return (
    <Modal
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
      transparent
      visible={visible}
    >
      <View accessibilityViewIsModal style={styles.modal}>
        {/* Scrim */}
        <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
          <Pressable
            accessibilityLabel="Close menu"
            accessibilityRole="button"
            onPress={onClose}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>

        {/* Full-screen panel sliding from right */}
        <Animated.View
          style={[
            styles.panel,
            {
              paddingBottom: Math.max(insets.bottom, Spacing.four),
              paddingTop: Math.max(insets.top, Spacing.three),
              transform: [{ translateX }],
            },
          ]}
        >
          {/* ── Top bar ──────────────────────────────────────────────── */}
          <View style={styles.topBar}>
            <Text style={styles.menuTitle}>Menu</Text>
            <Pressable
              accessibilityLabel="Close menu"
              accessibilityRole="button"
              onPress={onClose}
              style={({ pressed }) => [styles.closeBtn, pressed && styles.closeBtnPressed]}
            >
              <X color={brandColors.primaryDark} size={20} strokeWidth={2.5} />
            </Pressable>
          </View>

          {/* ── Profile header (centered) ───────────────────────────── */}
          <View style={styles.profileSection}>
            <View style={styles.avatarRing}>
              <Avatar name={name} size={68} uri={photoUri} />
            </View>
            <Text numberOfLines={1} style={styles.profileName}>{name}</Text>
            {email ? (
              <Text numberOfLines={1} style={styles.profileDetail}>{email}</Text>
            ) : (
              <Text style={styles.profileDetail}>Sajilo Health Member</Text>
            )}
          </View>

          {/* ── Divider ─────────────────────────────────────────────── */}
          <View style={styles.divider} />

          {/* ── Menu items ──────────────────────────────────────────── */}
          <ScrollView
            contentContainerStyle={styles.menuContent}
            showsVerticalScrollIndicator={false}
            style={styles.menuScroll}
          >
            {PRIMARY_ITEMS.map((item, index) => (
              <AnimatedDrawerItem
                anim={itemAnims[index]}
                item={item}
                key={item.destination}
                onNavigate={onNavigate}
              />
            ))}

            <View style={styles.sectionDivider} />

            {SECONDARY_ITEMS.map((item, index) => (
              <AnimatedDrawerItem
                anim={itemAnims[PRIMARY_ITEMS.length + index]}
                item={item}
                key={item.destination}
                onNavigate={onNavigate}
              />
            ))}
          </ScrollView>

          {/* ── Divider ─────────────────────────────────────────────── */}
          <View style={styles.divider} />

          {/* ── Logout ──────────────────────────────────────────────── */}
          <AnimatedLogoutButton
            anim={itemAnims[totalItems - 1]}
            onLogout={onLogout}
          />
        </Animated.View>
      </View>
    </Modal>
  );
}

// ─── AnimatedDrawerItem ──────────────────────────────────────────────────────
function AnimatedDrawerItem({
  anim,
  item,
  onNavigate,
}: {
  anim: Animated.Value;
  item: MenuItem;
  onNavigate: (value: HomeDrawerDestination) => void;
}) {
  const Icon = item.icon;
  const translateX = anim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] });
  const opacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

  return (
    <Animated.View style={{ opacity, transform: [{ translateX }] }}>
      <Pressable
        accessibilityHint={item.available ? 'Opens this section' : 'This section is coming soon'}
        accessibilityLabel={`${item.label}${item.available ? '' : ', coming soon'}`}
        accessibilityRole="button"
        disabled={!item.available}
        onPress={() => onNavigate(item.destination)}
        style={({ pressed }) => [
          styles.menuItem,
          pressed && styles.menuItemPressed,
          !item.available && styles.menuItemDisabled,
        ]}
      >
        <View style={[styles.iconContainer, !item.available && styles.iconContainerDisabled]}>
          <Icon
            color={item.available ? brandColors.primary : brandColors.softBlue}
            size={21}
          />
        </View>
        <Text
          style={[
            styles.menuLabel,
            !item.available && styles.menuLabelDisabled,
          ]}
        >
          {item.label}
        </Text>
        {item.available ? (
          <ChevronRight color={brandColors.softBlue} size={18} strokeWidth={2.5} />
        ) : (
          <View style={styles.soonBadge}>
            <Text style={styles.soonText}>Soon</Text>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

// ─── AnimatedLogoutButton ────────────────────────────────────────────────────
function AnimatedLogoutButton({
  anim,
  onLogout,
}: {
  anim: Animated.Value;
  onLogout: () => void;
}) {
  const translateX = anim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] });
  const opacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

  return (
    <Animated.View style={{ opacity, transform: [{ translateX }] }}>
      <Pressable
        accessibilityLabel="Log out"
        accessibilityRole="button"
        onPress={onLogout}
        style={({ pressed }) => [styles.logoutBtn, pressed && styles.logoutBtnPressed]}
      >
        <View style={styles.logoutIconContainer}>
          <LogOut color="#C2465C" size={20} />
        </View>
        <Text style={styles.logoutLabel}>Logout</Text>
      </Pressable>
    </Animated.View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // Layout
  modal: {
    flex: 1,
  },
  overlay: {
    backgroundColor: brandColors.primaryDark,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  panel: {
    backgroundColor: brandColors.white,
    flex: 1,
    paddingHorizontal: Spacing.four,
  },

  // Top bar
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.one,
  },
  menuTitle: {
    color: brandColors.primaryDark,
    fontFamily: Fonts.rounded,
    fontSize: 24,
    fontWeight: '700',
  },
  closeBtn: {
    alignItems: 'center',
    backgroundColor: brandColors.surfaceBlue,
    borderRadius: Radius.full,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  closeBtnPressed: {
    backgroundColor: '#C5D0E4',
    transform: [{ scale: 0.92 }],
  },

  // Profile
  profileSection: {
    alignItems: 'center',
    gap: Spacing.one,
    paddingBottom: Spacing.four,
    paddingTop: Spacing.twoHalf,
  },
  avatarRing: {
    alignItems: 'center',
    borderColor: brandColors.surfaceBlue,
    borderRadius: Radius.full,
    borderWidth: 3,
    justifyContent: 'center',
    marginBottom: Spacing.twoHalf,
    padding: 3,
  },
  profileName: {
    color: brandColors.primaryDark,
    fontFamily: Fonts.rounded,
    fontSize: 21,
    fontWeight: '700',
    letterSpacing: 0.15,
    textAlign: 'center',
  },
  profileDetail: {
    color: brandColors.slate,
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },

  // Dividers
  divider: {
    backgroundColor: brandColors.surfaceBlue,
    height: 1,
    marginVertical: Spacing.one,
    width: '100%',
  },
  sectionDivider: {
    backgroundColor: brandColors.surfaceBlue,
    height: 1,
    marginHorizontal: Spacing.three,
    marginVertical: Spacing.twoHalf,
  },

  // Menu list
  menuScroll: {
    flex: 1,
  },
  menuContent: {
    gap: Spacing.one,
    paddingVertical: Spacing.twoHalf,
  },

  // Menu item
  menuItem: {
    alignItems: 'center',
    borderRadius: Radius.md,
    flexDirection: 'row',
    gap: Spacing.three,
    minHeight: 58,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.twoHalf,
  },
  menuItemPressed: {
    backgroundColor: brandColors.surfaceBlue,
    transform: [{ scale: 0.98 }],
  },
  menuItemDisabled: {
    opacity: 0.5,
  },
  iconContainer: {
    alignItems: 'center',
    backgroundColor: brandColors.surfaceBlue,
    borderRadius: Radius.md,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  iconContainerDisabled: {
    backgroundColor: '#EDF1F8',
  },
  menuLabel: {
    color: brandColors.primaryDark,
    flex: 1,
    fontFamily: Fonts.sans,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  menuLabelDisabled: {
    color: brandColors.softBlue,
  },

  // Soon badge
  soonBadge: {
    backgroundColor: '#EDF1F8',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.twoHalf,
    paddingVertical: Spacing.half,
  },
  soonText: {
    color: brandColors.softBlue,
    fontFamily: Fonts.sans,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },

  // Logout
  logoutBtn: {
    alignItems: 'center',
    borderColor: '#FDECEF',
    borderRadius: Radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: Spacing.three,
    marginTop: Spacing.twoHalf,
    minHeight: 58,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.twoHalf,
  },
  logoutBtnPressed: {
    backgroundColor: '#FEF5F6',
    transform: [{ scale: 0.98 }],
  },
  logoutIconContainer: {
    alignItems: 'center',
    backgroundColor: '#FDECEF',
    borderRadius: Radius.md,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  logoutLabel: {
    color: '#C2465C',
    flex: 1,
    fontFamily: Fonts.sans,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
});
