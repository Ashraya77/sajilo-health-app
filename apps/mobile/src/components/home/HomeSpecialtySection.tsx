import { Activity, Brain, Bone, Eye, HeartPulse, RefreshCw, Sparkles, Stethoscope } from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { HomeSectionHeader } from '@/components/home/HomeSectionHeader';
import { SkeletonBlock } from '@/components/SkeletonBlock';
import { Fonts, Radius, Spacing, Typography, brandColors } from '@/constants/theme';
import type { SpecialtyViewState } from '@/hooks/useSpecialties';
import type { Specialty } from '@/types/specialty';

const ITEM_WIDTH = Spacing.six * 2 + Spacing.four;
const MIN_TOUCH_TARGET = Spacing.five + Spacing.twoHalf;

type HomeSpecialtySectionProps = {
  state: SpecialtyViewState;
  onRetry: () => void;
  onSeeAll: () => void;
  onSpecialtyPress: (specialty: Specialty) => void;
};

export function HomeSpecialtySection({
  state,
  onRetry,
  onSeeAll,
  onSpecialtyPress,
}: HomeSpecialtySectionProps) {
  return (
    <View style={styles.section}>
      <HomeSectionHeader
        onSeeAllPress={onSeeAll}
        seeAllAccessibilityLabel="Browse all specialties"
        title="Browse by specialty"
      />
      {state.status === 'loading' && <SpecialtyLoading />}
      {state.status === 'empty' && <SpecialtyEmpty />}
      {state.status === 'error' && (
        <SpecialtyError message={state.message} onRetry={onRetry} />
      )}
      {state.status === 'populated' && (
        <SpecialtyGrid
          onSpecialtyPress={onSpecialtyPress}
          specialties={state.specialties}
        />
      )}
    </View>
  );
}

type SpecialtyGridProps = {
  specialties: readonly Specialty[];
  onSpecialtyPress: (specialty: Specialty) => void;
};

function SpecialtyGrid({ specialties, onSpecialtyPress }: SpecialtyGridProps) {
  const columns = getColumns(specialties);

  return (
    <ScrollView
      accessibilityLabel="Specialties"
      horizontal
      contentContainerStyle={styles.gridContent}
      showsHorizontalScrollIndicator={false}
    >
      {columns.map((column) => (
        <View key={column[0].value} style={styles.column}>
          {column.map((specialty) => (
            <SpecialtyItem
              key={specialty.value}
              onPress={onSpecialtyPress}
              specialty={specialty}
            />
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

function SpecialtyItem({
  specialty,
  onPress,
}: {
  specialty: Specialty;
  onPress: (specialty: Specialty) => void;
}) {
  return (
    <Pressable
      accessibilityLabel={`Browse ${specialty.label}`}
      accessibilityRole="button"
      onPress={() => onPress(specialty)}
      style={({ pressed }) => [styles.item, pressed && styles.pressed]}
    >
      <View style={styles.iconSurface}>
        <SpecialtyIcon label={specialty.label} />
      </View>
      <Text style={styles.itemLabel}>{specialty.label}</Text>
    </Pressable>
  );
}

function SpecialtyLoading() {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={styles.loadingGrid}
    >
      {[0, 1, 2].map((column) => (
        <View key={column} style={styles.column}>
          <SkeletonBlock
            color={brandColors.surfaceBlue}
            height={MIN_TOUCH_TARGET + Spacing.two}
            radius={Radius.md}
            width={ITEM_WIDTH}
          />
          <SkeletonBlock
            color={brandColors.surfaceBlue}
            height={MIN_TOUCH_TARGET + Spacing.two}
            radius={Radius.md}
            width={ITEM_WIDTH}
          />
        </View>
      ))}
    </View>
  );
}

function SpecialtyEmpty() {
  return (
    <View style={styles.state}>
      <Stethoscope color={brandColors.primary} size={Spacing.four} />
      <Text style={styles.stateText}>Specialties aren’t available yet.</Text>
    </View>
  );
}

function SpecialtyError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <View style={styles.state}>
      <RefreshCw color={brandColors.primary} size={Spacing.four} />
      <View style={styles.stateCopy}>
        <Text style={styles.stateText}>{message}</Text>
        <Pressable
          accessibilityLabel="Retry specialties"
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

function getColumns(specialties: readonly Specialty[]): Specialty[][] {
  const columns: Specialty[][] = [];

  for (let index = 0; index < specialties.length; index += 2) {
    columns.push(specialties.slice(index, index + 2));
  }

  return columns;
}

function SpecialtyIcon({ label }: { label: string }) {
  const value = label.toLowerCase();
  const Icon = value.includes('heart') || value.includes('cardio')
    ? HeartPulse
    : value.includes('eye') || value.includes('ophthal')
      ? Eye
      : value.includes('brain') || value.includes('neuro')
        ? Brain
        : value.includes('bone') || value.includes('ortho')
          ? Bone
          : value.includes('skin') || value.includes('derma')
            ? Sparkles
            : value.includes('general') || value.includes('medicine')
              ? Activity
              : Stethoscope;
  return <Icon color={brandColors.primary} size={Spacing.four} />;
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.three,
  },
  gridContent: {
    gap: Spacing.twoHalf,
    paddingRight: Spacing.four,
  },
  column: {
    gap: Spacing.twoHalf,
  },
  item: {
    alignItems: 'center',
    backgroundColor: brandColors.white,
    borderColor: brandColors.surfaceBlue,
    borderRadius: Radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: Spacing.two,
    minHeight: MIN_TOUCH_TARGET + Spacing.two,
    paddingHorizontal: Spacing.twoHalf,
    paddingVertical: Spacing.two,
    width: ITEM_WIDTH,
  },
  iconSurface: {
    alignItems: 'center',
    backgroundColor: brandColors.surfaceBlue,
    borderRadius: Radius.full,
    height: MIN_TOUCH_TARGET,
    justifyContent: 'center',
    width: MIN_TOUCH_TARGET,
  },
  itemLabel: {
    color: brandColors.primaryDark,
    flex: 1,
    flexShrink: 1,
    fontFamily: Fonts.sans,
    ...Typography.body,
    fontWeight: Typography.weights.medium,
  },
  pressed: {
    opacity: 0.7,
  },
  loadingGrid: {
    flexDirection: 'row',
    gap: Spacing.twoHalf,
    overflow: 'hidden',
  },
  state: {
    alignItems: 'flex-start',
    backgroundColor: brandColors.surfaceBlue,
    borderRadius: Radius.md,
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
    flex: 1,
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
    color: brandColors.primary,
    fontFamily: Fonts.sans,
    ...Typography.body,
    fontWeight: Typography.weights.semibold,
  },
});
