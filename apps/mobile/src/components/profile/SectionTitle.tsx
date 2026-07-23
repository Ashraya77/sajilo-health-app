import { StyleSheet, Text, View } from 'react-native';
import { Fonts, Spacing, brandColors } from '@/constants/theme';
type SectionTitleProps = { eyebrow?: string; title: string };
export function SectionTitle({ eyebrow, title }: SectionTitleProps) { return <View style={styles.container}>{eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}<Text style={styles.title}>{title}</Text></View>; }
const styles = StyleSheet.create({ container: { gap: Spacing.half }, eyebrow: { color: brandColors.primary, fontFamily: Fonts.sans, fontSize: 12, fontWeight: '800', letterSpacing: 1.2, textTransform: 'uppercase' }, title: { color: brandColors.primaryDark, fontFamily: Fonts.rounded, fontSize: 23, fontWeight: '800' } });
