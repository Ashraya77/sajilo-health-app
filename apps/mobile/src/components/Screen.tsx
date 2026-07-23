import type { PropsWithChildren } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';

const DEFAULT_EDGES: Edge[] = ['top'];

type ScreenProps = PropsWithChildren<{
  edges?: Edge[];
  style?: StyleProp<ViewStyle>;
}>;

/** Shared safe-area root for product screens. */
export function Screen({ children, edges = DEFAULT_EDGES, style }: ScreenProps) {
  return (
    <SafeAreaView edges={edges} style={[styles.screen, style]}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: Colors.background,
    flex: 1,
  },
});
