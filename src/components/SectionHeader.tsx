import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, Fonts, Spacing, Typography } from '@/constants/theme';

type SectionHeaderProps = { title: string; onSeeAllPress?: () => void; seeAllLabel?: string };

export function SectionHeader({ title, onSeeAllPress, seeAllLabel = 'See all' }: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {onSeeAllPress && (
        <Pressable accessibilityRole="button" hitSlop={Spacing.two} onPress={onSeeAllPress}>
          <Text style={styles.link}>{seeAllLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  title: { color: Colors.textPrimary, fontFamily: Fonts.sans, ...Typography.title },
  link: { color: Colors.primary, fontFamily: Fonts.sans, ...Typography.body, fontWeight: Typography.weights.medium },
});
