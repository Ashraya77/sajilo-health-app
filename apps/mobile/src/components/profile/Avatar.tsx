import { Image, StyleSheet, Text, View } from 'react-native';

import { Fonts, Radius, brandColors } from '@/constants/theme';

type AvatarProps = { name: string; imageUrl?: string; size?: 'large' | 'small' };

export function Avatar({ name, imageUrl, size = 'large' }: AvatarProps) {
  const initials = name.split(' ').filter(Boolean).map((part) => part[0]).join('').slice(0, 2).toUpperCase();
  const sizeStyle = size === 'large' ? styles.large : styles.small;
  const textStyle = size === 'large' ? styles.largeText : styles.smallText;

  return (
    <View style={[styles.base, sizeStyle]}>
      {imageUrl ? <Image source={{ uri: imageUrl }} style={styles.image} /> : <Text style={textStyle}>{initials}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', backgroundColor: brandColors.primary, justifyContent: 'center', overflow: 'hidden' },
  large: { borderRadius: Radius.pill, height: 96, width: 96 },
  small: { borderRadius: Radius.pill, height: 40, width: 40 },
  image: { height: '100%', width: '100%' },
  largeText: { color: brandColors.white, fontFamily: Fonts.rounded, fontSize: 32, fontWeight: '800' },
  smallText: { color: brandColors.white, fontFamily: Fonts.rounded, fontSize: 14, fontWeight: '800' },
});
