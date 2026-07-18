import { FlatList, StyleSheet, View } from 'react-native';
import type { ListRenderItem } from 'react-native';

import { Spacing } from '@/constants/theme';
import { SkeletonBlock } from '@/components/SkeletonBlock';

type InfoRowProps<T> = {
  data: readonly T[];
  renderItem: ListRenderItem<T>;
  emptyBehavior?: 'hide';
  loading?: boolean;
  skeletonHeight?: number;
  skeletonWidth?: number;
};

const LOADING_ITEMS = [0, 1, 2];

export function InfoRow<T>({
  data,
  renderItem,
  emptyBehavior = 'hide',
  loading = false,
  skeletonHeight = 120,
  skeletonWidth = 160,
}: InfoRowProps<T>) {
  if (!loading && data.length === 0 && emptyBehavior === 'hide') return null;

  if (loading) {
    return (
      <View style={styles.loadingRow}>
        {LOADING_ITEMS.map((item) => <SkeletonBlock key={item} height={skeletonHeight} width={skeletonWidth} />)}
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      horizontal
      keyExtractor={(_, index) => index.toString()}
      renderItem={renderItem}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
    />
  );
}

const styles = StyleSheet.create({
  content: { gap: Spacing.three },
  loadingRow: { flexDirection: 'row', gap: Spacing.three },
});
