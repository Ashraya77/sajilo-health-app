import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Fonts, Spacing, brandColors } from '@/constants/theme';

type HomeSectionHeaderProps = {
  title: string;
  onSeeAllPress?: () => void;
  seeAllLabel?: string;
  seeAllAccessibilityLabel?: string;
};

export function HomeSectionHeader({
  title,
  onSeeAllPress,
  seeAllLabel = 'See all',
  seeAllAccessibilityLabel,
}: HomeSectionHeaderProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {onSeeAllPress ? (
        <Pressable
          accessibilityLabel={seeAllAccessibilityLabel}
          accessibilityRole="button"
          hitSlop={Spacing.two}
          onPress={onSeeAllPress}
          style={({ pressed }) => pressed && styles.pressed}
        >
          <Text style={styles.link}>{seeAllLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { alignItems: 'center', flexDirection: 'row', gap: Spacing.two, justifyContent: 'space-between' },
  title: { color: brandColors.primaryDark, flex: 1, fontFamily: Fonts.rounded, fontSize: 18, fontWeight: '700', lineHeight: 24 },
  link: { color: brandColors.primary, fontFamily: Fonts.sans, fontSize: 13, fontWeight: '700', lineHeight: 20 },
  pressed: { opacity: 0.65 },
});
