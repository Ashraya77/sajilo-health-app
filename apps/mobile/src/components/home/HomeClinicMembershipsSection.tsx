import { Building2, RefreshCw } from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/Avatar';
import { HomeSectionHeader } from '@/components/home/HomeSectionHeader';
import { SkeletonBlock } from '@/components/SkeletonBlock';
import { Fonts, Radius, Spacing, Typography, brandColors } from '@/constants/theme';
import type { HomeClinicMembershipsViewState } from '@/hooks/useClinicMemberships';
import type { ClinicMembership } from '@/types/clinic';

const CARD_WIDTH = Spacing.six * 4;
const LOGO_SIZE = Spacing.six;
const MIN_TOUCH_TARGET = Spacing.five + Spacing.twoHalf;

type HomeClinicMembershipsSectionProps = {
  state: HomeClinicMembershipsViewState;
  onOpenClinic: (membership: ClinicMembership) => void;
  onRetry: () => void;
  onBrowseClinics: () => void;
};

export function HomeClinicMembershipsSection({
  state,
  onOpenClinic,
  onRetry,
  onBrowseClinics,
}: HomeClinicMembershipsSectionProps) {
  return (
    <View style={styles.section}>
      <HomeSectionHeader title="My clinics" />
      {state.status === 'loading' && <MembershipLoading />}
      {state.status === 'error' && (
        <MembershipError message={state.message} onRetry={onRetry} />
      )}
      {state.status === 'empty' && <MembershipEmpty onBrowseClinics={onBrowseClinics} />}
      {state.status === 'populated' && (
        <MembershipList
          memberships={state.memberships}
          onOpenClinic={onOpenClinic}
        />
      )}
    </View>
  );
}

function MembershipEmpty({ onBrowseClinics }: { onBrowseClinics: () => void }) {
  return (
    <View style={styles.state}>
      <Building2 color={brandColors.primary} size={Spacing.four} />
      <View style={styles.stateCopy}>
        <Text style={styles.stateTitle}>Your clinics will appear here</Text>
        <Text style={styles.stateText}>Connect with a clinic to keep care and records in one place.</Text>
        <Pressable
          accessibilityLabel="Browse clinics"
          accessibilityRole="button"
          onPress={onBrowseClinics}
          style={({ pressed }) => [styles.retry, pressed && styles.pressed]}
        >
          <Text style={styles.retryLabel}>Browse clinics</Text>
        </Pressable>
      </View>
    </View>
  );
}

function MembershipList({
  memberships,
  onOpenClinic,
}: {
  memberships: readonly ClinicMembership[];
  onOpenClinic: (membership: ClinicMembership) => void;
}) {
  if (memberships.length === 1) {
    return (
      <MembershipClinicCard
        membership={memberships[0]}
        onOpenClinic={onOpenClinic}
      />
    );
  }

  return (
    <ScrollView
      accessibilityLabel="My clinics"
      contentContainerStyle={styles.listContent}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      {memberships.map((membership) => (
        <MembershipClinicCard
          compact
          key={membership.id}
          membership={membership}
          onOpenClinic={onOpenClinic}
        />
      ))}
    </ScrollView>
  );
}

function MembershipClinicCard({
  compact = false,
  membership,
  onOpenClinic,
}: {
  compact?: boolean;
  membership: ClinicMembership;
  onOpenClinic: (membership: ClinicMembership) => void;
}) {
  const isApproved = membership.consentStatus === 'approved';
  const content = (
    <>
      <Avatar
        name={membership.clinicName}
        size={LOGO_SIZE}
        uri={membership.clinicLogo}
      />
      <View style={styles.cardCopy}>
        <Text style={styles.clinicName}>{membership.clinicName}</Text>
        <Text style={[styles.status, isApproved ? styles.connected : styles.pending]}>
          {isApproved ? 'Connected clinic' : 'Consent pending'}
        </Text>
        {isApproved && <Text style={styles.actionLabel}>Open clinic</Text>}
      </View>
    </>
  );

  if (!isApproved) {
    return <View style={[styles.card, compact && styles.compactCard]}>{content}</View>;
  }

  return (
    <Pressable
      accessibilityLabel={`Open ${membership.clinicName} clinic`}
      accessibilityRole="button"
      onPress={() => onOpenClinic(membership)}
      style={({ pressed }) => [
        styles.card,
        compact && styles.compactCard,
        pressed && styles.pressed,
      ]}
    >
      {content}
    </Pressable>
  );
}

function MembershipLoading() {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={styles.loadingCard}
    >
      <SkeletonBlock color={brandColors.surfaceBlue} height={LOGO_SIZE} radius={Radius.full} width={LOGO_SIZE} />
      <View style={styles.loadingCopy}>
        <SkeletonBlock color={brandColors.surfaceBlue} height={Spacing.three} width="58%" />
        <SkeletonBlock color={brandColors.surfaceBlue} height={Spacing.twoHalf} width="36%" />
      </View>
    </View>
  );
}

function MembershipError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <View style={styles.state}>
      <RefreshCw color={brandColors.primary} size={Spacing.four} />
      <View style={styles.stateCopy}>
        <Text style={styles.stateText}>{message}</Text>
        <Pressable
          accessibilityLabel="Retry my clinics"
          accessibilityRole="button"
          onPress={onRetry}
          style={({ pressed }) => [styles.retry, pressed && styles.pressed]}
        >
          <Text style={styles.retryLabel}>Try again</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.three,
  },
  listContent: {
    gap: Spacing.twoHalf,
    paddingRight: Spacing.four,
  },
  card: {
    alignItems: 'center',
    backgroundColor: brandColors.white,
    borderColor: brandColors.surfaceBlue,
    borderRadius: Radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: Spacing.three,
    minHeight: MIN_TOUCH_TARGET,
    padding: Spacing.three,
  },
  compactCard: {
    width: CARD_WIDTH,
  },
  cardCopy: {
    flex: 1,
    gap: Spacing.one,
  },
  clinicName: {
    color: brandColors.primaryDark,
    fontFamily: Fonts.rounded,
    ...Typography.title,
  },
  status: {
    alignSelf: 'flex-start',
    fontFamily: Fonts.sans,
    ...Typography.caption,
    fontWeight: Typography.weights.medium,
  },
  connected: {
    color: brandColors.primaryMuted,
  },
  pending: {
    color: brandColors.slate,
  },
  actionLabel: {
    color: brandColors.primary,
    fontFamily: Fonts.sans,
    ...Typography.body,
    fontWeight: Typography.weights.semibold,
  },
  pressed: {
    opacity: 0.75,
  },
  loadingCard: {
    alignItems: 'center',
    backgroundColor: brandColors.white,
    borderColor: brandColors.surfaceBlue,
    borderWidth: 1,
    borderRadius: Radius.lg,
    flexDirection: 'row',
    gap: Spacing.three,
    padding: Spacing.three,
  },
  loadingCopy: {
    flex: 1,
    gap: Spacing.two,
  },
  state: {
    alignItems: 'flex-start',
    backgroundColor: brandColors.surfaceBlue,
    borderRadius: Radius.lg,
    flexDirection: 'row',
    gap: Spacing.three,
    padding: Spacing.three,
  },
  stateCopy: {
    flex: 1,
    gap: Spacing.one,
  },
  stateText: {
    color: brandColors.slate,
    fontFamily: Fonts.sans,
    ...Typography.body,
  },
  stateTitle: { color: brandColors.primaryDark, fontFamily: Fonts.rounded, ...Typography.title },
  retry: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    justifyContent: 'center',
    minHeight: MIN_TOUCH_TARGET,
    paddingRight: Spacing.three,
  },
  retryLabel: {
    color: brandColors.primary,
    fontFamily: Fonts.sans,
    ...Typography.body,
    fontWeight: Typography.weights.semibold,
  },
});
