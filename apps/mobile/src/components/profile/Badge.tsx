import { BadgeCheck } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import { Fonts, Radius, Spacing, brandColors, profileColors } from '@/constants/theme';

export function Badge() {
  return <View style={styles.badge}><BadgeCheck color={brandColors.primary} size={15} strokeWidth={2.5} /><Text style={styles.text}>Verified patient</Text></View>;
}
const styles = StyleSheet.create({
  badge: { alignItems: 'center', alignSelf: 'center', backgroundColor: profileColors.tint, borderRadius: Radius.pill, flexDirection: 'row', gap: Spacing.one, paddingHorizontal: Spacing.two, paddingVertical: 6 },
  text: { color: brandColors.primary, fontFamily: Fonts.sans, fontSize: 12, fontWeight: '700' },
});
