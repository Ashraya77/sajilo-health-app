import { Building2, RefreshCw } from 'lucide-react-native';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

import { HomeSectionHeader } from '@/components/home/HomeSectionHeader';
import { SkeletonBlock } from '@/components/SkeletonBlock';
import { HomeDiscoveryListingCard } from '@/components/home/HomeDiscoveryListingCard';
import { Fonts, Radius, Spacing, Typography, brandColors } from '@/constants/theme';
import type { HomeDiscoveryViewState } from '@/hooks/useHomeDiscovery';
import type { CuratedHomeDiscoverySection, HomeDiscoveryListing } from '@/types/home';

const CARD_MAX_WIDTH = Spacing.six * 4 + Spacing.four;
const CARD_HEIGHT = Spacing.six * 3 + Spacing.four + Spacing.three;
const MIN_TOUCH_TARGET = Spacing.five + Spacing.twoHalf;

type HomeDiscoverySectionProps = {
  state: HomeDiscoveryViewState;
  onListingPress: (listing: HomeDiscoveryListing) => void;
  onRetry: () => void;
};

export function HomeDiscoverySection({
  state,
  onListingPress,
  onRetry,
}: HomeDiscoverySectionProps) {
  const { width: windowWidth } = useWindowDimensions();
  const availableWidth = windowWidth - Spacing.four * 2;
  const cardWidth = Math.min(availableWidth - Spacing.four, CARD_MAX_WIDTH);

  if (state.status === 'loading') {
    return <DiscoveryLoading cardWidth={cardWidth} />;
  }

  if (state.status === 'error') {
    return <DiscoveryError message={state.message} onRetry={onRetry} />;
  }

  if (state.status === 'empty') {
    return <DiscoveryEmpty />;
  }

  return (
    <View style={styles.discovery}>
      {state.sections.map((section) => (
        <DiscoveryCarousel
          cardWidth={cardWidth}
          key={section.id}
          onListingPress={onListingPress}
          section={section}
        />
      ))}
    </View>
  );
}

type DiscoveryCarouselProps = {
  cardWidth: number;
  onListingPress: (listing: HomeDiscoveryListing) => void;
  section: CuratedHomeDiscoverySection;
};

function DiscoveryCarousel({ cardWidth, onListingPress, section }: DiscoveryCarouselProps) {
  return (
    <View style={styles.section}>
      <HomeSectionHeader title={section.title} />
      <FlatList
        accessibilityLabel={section.title}
        accessibilityRole="list"
        contentContainerStyle={styles.listContent}
        data={section.listings}
        horizontal
        keyExtractor={(listing) => listing.id}
        renderItem={({ item }) => (
          <HomeDiscoveryListingCard
            isSponsored={section.isSponsored}
            listing={item}
            onPress={onListingPress}
            width={cardWidth}
          />
        )}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

function DiscoveryLoading({ cardWidth }: { cardWidth: number }) {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={styles.section}
    >
      <SkeletonBlock color={brandColors.surfaceBlue} height={Spacing.four} radius={Radius.sm} width="54%" />
      <View style={styles.loadingRow}>
        <SkeletonBlock color={brandColors.surfaceBlue} height={CARD_HEIGHT} radius={Radius.lg} width={cardWidth} />
        <SkeletonBlock color={brandColors.surfaceBlue} height={CARD_HEIGHT} radius={Radius.lg} width={cardWidth} />
      </View>
    </View>
  );
}

function DiscoveryEmpty() {
  return (
    <View style={styles.state}>
      <Building2 color={brandColors.primary} size={Spacing.four} />
      <View style={styles.stateCopy}>
        <Text style={styles.stateTitle}>No clinic suggestions yet</Text>
        <Text style={styles.stateBody}>Use Find clinics to browse all available care options.</Text>
      </View>
    </View>
  );
}

function DiscoveryError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <View style={styles.state}>
      <RefreshCw color={brandColors.primary} size={Spacing.four} />
      <View style={styles.stateCopy}>
        <Text style={styles.stateTitle}>{message}</Text>
        <Pressable
          accessibilityLabel="Retry clinic and doctor discovery"
          accessibilityRole="button"
          onPress={onRetry}
          style={({ pressed }) => [styles.retry, pressed && styles.retryPressed]}
        >
          <Text style={styles.retryLabel}>Try again</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  discovery: {
    gap: Spacing.five,
  },
  section: {
    gap: Spacing.three,
  },
  listContent: {
    gap: Spacing.twoHalf,
    paddingRight: Spacing.four,
  },
  loadingRow: {
    flexDirection: 'row',
    gap: Spacing.twoHalf,
    overflow: 'hidden',
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
  stateTitle: {
    color: brandColors.primaryDark,
    fontFamily: Fonts.rounded,
    ...Typography.title,
  },
  stateBody: {
    color: brandColors.slate,
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
  retryPressed: {
    opacity: 0.7,
  },
  retryLabel: {
    color: brandColors.primary,
    fontFamily: Fonts.sans,
    ...Typography.body,
    fontWeight: Typography.weights.semibold,
  },
});
