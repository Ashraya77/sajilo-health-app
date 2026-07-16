import Animated, { FadeInUp } from 'react-native-reanimated';
import type { LucideIcon } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import { Fonts, Radius, Spacing, brandColors, profileColors } from '@/constants/theme';
type StatCardProps = { icon: LucideIcon; label: string; value: number; delay: number };
export function StatCard({ icon: Icon, label, value, delay }: StatCardProps) { return <Animated.View entering={FadeInUp.delay(delay).duration(450)} style={styles.card}><View style={styles.icon}><Icon color={brandColors.primary} size={18}/></View><Text style={styles.value}>{value}</Text><Text style={styles.label}>{label}</Text></Animated.View>; }
const styles = StyleSheet.create({ card: { backgroundColor: profileColors.card, borderRadius: Radius.medium, gap: Spacing.one, minHeight: 130, padding: Spacing.three, shadowColor: profileColors.shadow, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.05, shadowRadius: 16, width: '48%' }, icon: { alignItems: 'center', backgroundColor: profileColors.tint, borderRadius: Radius.pill, height: 34, justifyContent: 'center', width: 34 }, value: { color: brandColors.primaryDark, fontFamily: Fonts.rounded, fontSize: 29, fontWeight: '800', marginTop: Spacing.one }, label: { color: brandColors.slate, fontFamily: Fonts.sans, fontSize: 12, fontWeight: '600' } });
