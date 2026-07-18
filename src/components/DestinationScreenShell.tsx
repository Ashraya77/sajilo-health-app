import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { Colors, Fonts, Spacing, Typography } from '@/constants/theme';

type DestinationScreenShellProps = {
  title: string;
  description?: string;
};

/** Shared minimal layout for confirmed routes awaiting their complete product UI. */
export function DestinationScreenShell({
  title,
  description = 'This screen is ready for its future product experience.',
}: DestinationScreenShellProps) {
  return (
    <Screen>
      <View style={styles.content}>
        <Text accessibilityRole="header" style={styles.title}>{title}</Text>
        <Card>
          <Text style={styles.body}>{description}</Text>
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: Spacing.four,
    padding: Spacing.four,
  },
  title: {
    color: Colors.textPrimary,
    fontFamily: Fonts.rounded,
    ...Typography.heading,
  },
  body: {
    color: Colors.textSecondary,
    fontFamily: Fonts.sans,
    ...Typography.bodyLarge,
  },
});
