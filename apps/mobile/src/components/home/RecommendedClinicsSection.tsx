import { Building2, RefreshCw } from 'lucide-react-native';
import { FlatList, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { Card, SectionHeader, SkeletonBlock } from '@/components';
import { ClinicCard } from '@/components/home/ClinicCard';
import { Colors, Fonts, Radius, Spacing, Typography } from '@/constants/theme';
import type { ClinicPreview, HomeClinicsFixtureMode } from '@/types/clinic';

const CARD_MAX_WIDTH = Spacing.six * 4 + Spacing.four;
const CARD_SKELETON_HEIGHT = Spacing.six * 3 + Spacing.four;
const MIN_TOUCH_TARGET = Spacing.five + Spacing.twoHalf;

type RecommendedClinicsSectionProps = {
  clinics: readonly ClinicPreview[];
  mode: HomeClinicsFixtureMode;
  onClinicPress: (clinic: ClinicPreview) => void;
  onRetry: () => void;
};

export function RecommendedClinicsSection({
  clinics,
  mode,
  onClinicPress,
  onRetry,
}: RecommendedClinicsSectionProps) {
  const { width: windowWidth } = useWindowDimensions();
  const availableWidth = windowWidth - Spacing.four * 2;
  const cardWidth = Math.min(availableWidth - Spacing.four, CARD_MAX_WIDTH);

  return (
    <View style={styles.section}>
      <SectionHeader title="Recommended clinics" />
      {renderContent({ cardWidth, clinics, mode, onClinicPress, onRetry })}
    </View>
  );
}

type SectionContentProps = RecommendedClinicsSectionProps & {
  cardWidth: number;
};

function renderContent({ cardWidth, clinics, mode, onClinicPress, onRetry }: SectionContentProps) {
  if (mode === 'loading') {
    return (
      <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={styles.loadingRow}>
        <SkeletonBlock height={CARD_SKELETON_HEIGHT} radius={Radius.lg} width={cardWidth} />
        <SkeletonBlock height={CARD_SKELETON_HEIGHT} radius={Radius.lg} width={cardWidth} />
      </View>
    );
  }

  if (mode === 'error') {
    return (
      <Card style={styles.stateCard}>
        <RefreshCw color={Colors.primary} size={Spacing.four} />
        <Text style={styles.stateTitle}>We couldn’t load clinic suggestions</Text>
        <Text style={styles.stateBody}>Please try again in a moment.</Text>
        <Pressable
          accessibilityRole="button"
          onPress={onRetry}
          style={({ pressed }) => [styles.retryButton, pressed && styles.retryButtonPressed]}
        >
          <Text style={styles.retryLabel}>Try again</Text>
        </Pressable>
      </Card>
    );
  }

  if (mode === 'empty' || clinics.length === 0) {
    return (
      <Card style={styles.stateCard}>
        <Building2 color={Colors.primary} size={Spacing.four} />
        <Text style={styles.stateTitle}>No clinic recommendations yet</Text>
        <Text style={styles.stateBody}>Clinic options will appear here when they’re available.</Text>
      </Card>
    );
  }

  return (
    <FlatList
      accessibilityLabel="Recommended clinics"
      contentContainerStyle={styles.listContent}
      data={clinics}
      horizontal
      keyExtractor={(clinic) => clinic.id}
      renderItem={({ item }) => (
        <ClinicCard clinic={item} onPress={onClinicPress} width={cardWidth} />
      )}
      showsHorizontalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    gap: Spacing.three,
    paddingRight: Spacing.four,
  },
  loadingRow: {
    flexDirection: 'row',
    gap: Spacing.three,
    overflow: 'hidden',
  },
  retryButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    justifyContent: 'center',
    minHeight: MIN_TOUCH_TARGET,
    paddingHorizontal: Spacing.three,
  },
  retryButtonPressed: {
    opacity: 0.8,
  },
  retryLabel: {
    color: Colors.background,
    fontFamily: Fonts.sans,
    ...Typography.body,
    fontWeight: Typography.weights.semibold,
  },
  section: {
    gap: Spacing.three,
  },
  stateBody: {
    color: Colors.textSecondary,
    fontFamily: Fonts.sans,
    ...Typography.body,
    textAlign: 'center',
  },
  stateCard: {
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.four,
  },
  stateTitle: {
    color: Colors.textPrimary,
    fontFamily: Fonts.rounded,
    ...Typography.title,
    textAlign: 'center',
  },
});
