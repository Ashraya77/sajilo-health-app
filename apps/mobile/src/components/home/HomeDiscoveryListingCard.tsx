import { Building2, CalendarClock, MapPin, Star, Stethoscope } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Fonts, Radius, Spacing, Typography, brandColors } from '@/constants/theme';
import type { HomeDiscoveryListing } from '@/types/home';

const CARD_HEIGHT = Spacing.six * 3 + Spacing.four + Spacing.three;
const MARK_SIZE = Spacing.five + Spacing.three;

type HomeDiscoveryListingCardProps = {
  listing: HomeDiscoveryListing;
  isSponsored: boolean;
  onPress: (listing: HomeDiscoveryListing) => void;
  width: number;
};

export function HomeDiscoveryListingCard({
  listing,
  isSponsored,
  onPress,
  width,
}: HomeDiscoveryListingCardProps) {
  const typeLabel = getTypeLabel(listing.type);
  const location = formatLocation(listing.city, listing.area);
  const availability = formatAvailability(listing.nextAvailableAt);
  const MarkIcon = listing.type?.toLowerCase() === 'doctor' ? Stethoscope : Building2;

  return (
    <Pressable
      accessibilityHint="Opens details for this listing"
      accessibilityLabel={getAccessibilityLabel(listing, isSponsored)}
      accessibilityRole="button"
      onPress={() => onPress(listing)}
      style={({ pressed }) => [
        styles.card,
        { width },
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.identityRow}>
        <View style={styles.mark}>
            <MarkIcon color={brandColors.primary} size={Spacing.four} />
        </View>
        <View style={styles.identityCopy}>
          {typeLabel && <Text style={styles.type}>{typeLabel}</Text>}
          <Text numberOfLines={2} style={styles.title}>{listing.title}</Text>
        </View>
      </View>

      <View style={styles.details}>
        {listing.specialty && (
          <Text numberOfLines={2} style={styles.specialty}>{listing.specialty}</Text>
        )}
        {location && (
          <View style={styles.detailRow}>
            <MapPin color={brandColors.primaryMuted} size={Spacing.three} />
            <Text numberOfLines={1} style={styles.detailText}>{location}</Text>
          </View>
        )}
        {listing.ratingAverage !== undefined && (
          <View style={styles.detailRow}>
            <Star color={brandColors.primaryMuted} fill={brandColors.primaryMuted} size={Spacing.three} />
            <Text style={styles.detailText}>
              {formatRating(listing.ratingAverage, listing.ratingCount)}
            </Text>
          </View>
        )}
        {availability && (
          <View style={styles.detailRow}>
            <CalendarClock color={brandColors.primary} size={Spacing.three} />
            <Text numberOfLines={1} style={styles.availability}>{availability}</Text>
          </View>
        )}
      </View>

      <View style={styles.badges}>
        {isSponsored && <ListingBadge label="Sponsored" />}
        {listing.badge && <ListingBadge label={listing.badge} />}
      </View>
    </Pressable>
  );
}

function ListingBadge({ label }: { label: string }) {
  return <View style={styles.badge}><Text style={styles.badgeText}>{label}</Text></View>;
}

function getTypeLabel(type: string | undefined): string | undefined {
  if (type?.toLowerCase() === 'doctor') return 'Doctor';
  if (type?.toLowerCase() === 'clinic') return 'Clinic';
  return undefined;
}

function formatLocation(city: string | undefined, area: string | undefined): string | undefined {
  const parts = [area, city].filter((part): part is string => Boolean(part));
  return parts.length > 0 ? [...new Set(parts)].join(', ') : undefined;
}

function formatRating(average: number, count: number | undefined): string {
  const rating = average.toFixed(1);
  return count === undefined ? rating : `${rating} (${count})`;
}

function formatAvailability(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);

  return `Next ${date.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
  })}, ${date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  })}`;
}

function getAccessibilityLabel(listing: HomeDiscoveryListing, isSponsored: boolean): string {
  const parts = [
    isSponsored ? 'Sponsored' : undefined,
    listing.title,
    getTypeLabel(listing.type),
    listing.specialty,
    formatLocation(listing.city, listing.area),
    listing.ratingAverage === undefined
      ? undefined
      : `Rated ${formatRating(listing.ratingAverage, listing.ratingCount)}`,
  ];

  return parts.filter((part): part is string => Boolean(part)).join('. ');
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: brandColors.white,
    borderColor: brandColors.surfaceBlue,
    borderRadius: Radius.lg,
    borderWidth: 1,
    gap: Spacing.twoHalf,
    height: CARD_HEIGHT,
    justifyContent: 'space-between',
    padding: Spacing.three,
  },
  cardPressed: {
    backgroundColor: brandColors.surfaceBlue,
  },
  identityRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.twoHalf,
  },
  mark: {
    alignItems: 'center',
    backgroundColor: brandColors.surfaceBlue,
    borderRadius: Radius.full,
    height: MARK_SIZE,
    justifyContent: 'center',
    width: MARK_SIZE,
  },
  identityCopy: {
    flex: 1,
    gap: Spacing.half,
    minWidth: 0,
  },
  type: {
    color: brandColors.primary,
    fontFamily: Fonts.sans,
    ...Typography.caption,
    fontWeight: Typography.weights.semibold,
  },
  title: {
    color: brandColors.primaryDark,
    fontFamily: Fonts.rounded,
    ...Typography.title,
  },
  details: {
    flex: 1,
    gap: Spacing.one,
  },
  specialty: {
    color: brandColors.slate,
    fontFamily: Fonts.sans,
    ...Typography.body,
  },
  detailRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.two,
  },
  detailText: {
    color: brandColors.slate,
    flex: 1,
    fontFamily: Fonts.sans,
    ...Typography.caption,
  },
  availability: {
    color: brandColors.primary,
    flex: 1,
    fontFamily: Fonts.sans,
    ...Typography.caption,
    fontWeight: Typography.weights.medium,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.one,
    minHeight: Spacing.three,
  },
  badge: { backgroundColor: brandColors.surfaceBlue, borderRadius: Radius.full, paddingHorizontal: Spacing.two, paddingVertical: 3 },
  badgeText: { color: brandColors.slate, fontFamily: Fonts.sans, fontSize: 10, fontWeight: '700' },
});
