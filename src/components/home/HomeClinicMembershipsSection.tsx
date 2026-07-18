import { RefreshCw } from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/Avatar';
import { SectionHeader } from '@/components/SectionHeader';
import { SkeletonBlock } from '@/components/SkeletonBlock';
import { Colors, Fonts, Radius, Spacing, Typography } from '@/constants/theme';
import type { HomeClinicMembershipsViewState } from '@/hooks/useClinicMemberships';
import type { ClinicMembership } from '@/types/clinic';

const CARD_WIDTH = Spacing.six * 4;
const LOGO_SIZE = Spacing.six;
const MIN_TOUCH_TARGET = Spacing.five + Spacing.twoHalf;

type HomeClinicMembershipsSectionProps = {
  state: HomeClinicMembershipsViewState;
  onOpenClinic: (membership: ClinicMembership) => void;
  onRetry: () => void;
};

export function HomeClinicMembershipsSection({
  state,
  onOpenClinic,
  onRetry,
}: HomeClinicMembershipsSectionProps) {
  if (state.status === 'hidden') return null;

  return (
    <View style={styles.section}>
      <SectionHeader title="My clinics" />
      {state.status === 'loading' && <MembershipLoading />}
      {state.status === 'error' && (
        <MembershipError message={state.message} onRetry={onRetry} />
      )}
      {state.status === 'populated' && (
        <MembershipList
          memberships={state.memberships}
          onOpenClinic={onOpenClinic}
        />
      )}
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
      <SkeletonBlock height={LOGO_SIZE} radius={Radius.full} width={LOGO_SIZE} />
      <View style={styles.loadingCopy}>
        <SkeletonBlock height={Spacing.three} width="58%" />
        <SkeletonBlock height={Spacing.twoHalf} width="36%" />
      </View>
    </View>
  );
}

function MembershipError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <View style={styles.state}>
      <RefreshCw color={Colors.primary} size={Spacing.four} />
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
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
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
    color: Colors.textPrimary,
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
    color: Colors.success,
  },
  pending: {
    color: Colors.warning,
  },
  actionLabel: {
    color: Colors.primary,
    fontFamily: Fonts.sans,
    ...Typography.body,
    fontWeight: Typography.weights.semibold,
  },
  pressed: {
    opacity: 0.75,
  },
  loadingCard: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
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
    backgroundColor: Colors.surface,
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
    color: Colors.textSecondary,
    fontFamily: Fonts.sans,
    ...Typography.body,
  },
  retry: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    justifyContent: 'center',
    minHeight: MIN_TOUCH_TARGET,
    paddingRight: Spacing.three,
  },
  retryLabel: {
    color: Colors.primary,
    fontFamily: Fonts.sans,
    ...Typography.body,
    fontWeight: Typography.weights.semibold,
  },
});
