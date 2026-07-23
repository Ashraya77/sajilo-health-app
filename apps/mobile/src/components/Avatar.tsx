import { useMemo, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { Colors, Fonts, Typography } from '@/constants/theme';

type AvatarProps = {
  uri?: string;
  name: string;
  size?: number;
};

export function Avatar({ uri, name, size = 40 }: AvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const initials = useMemo(() => getInitials(name), [name]);
  const circleStyle = { borderRadius: size / 2, height: size, width: size };

  if (uri && !imageFailed) {
    return <Image accessibilityLabel={name} onError={() => setImageFailed(true)} source={{ uri }} style={circleStyle} />;
  }

  return (
    <View accessibilityLabel={name} style={[styles.fallback, circleStyle]}>
      <Text style={[styles.initials, { fontSize: Math.max(12, Math.round(size * 0.36)) }]}>{initials}</Text>
    </View>
  );
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((part) => part[0]).join('').toUpperCase() || '?';
}

const styles = StyleSheet.create({
  fallback: { alignItems: 'center', backgroundColor: Colors.infoSurface, justifyContent: 'center' },
  initials: { color: Colors.primary, fontFamily: Fonts.sans, fontWeight: Typography.weights.semibold },
});
