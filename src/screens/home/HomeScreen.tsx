import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { HomeGreeting } from '@/components/home/HomeGreeting';
import { HomeHeader } from '@/components/home/HomeHeader';
import { UpcomingAppointmentCard } from '@/components/home/UpcomingAppointmentCard';
import { BottomTabInset, Spacing, brandColors } from '@/constants/theme';
import { useGreeting } from '@/hooks/useGreeting';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useUpcomingAppointment } from '@/hooks/useUpcomingAppointment';

export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const greeting = useGreeting();
  const userQuery = useCurrentUser();
  const firstName = getFirstName(userQuery.data?.first_name, userQuery.data?.full_name);
  const photoUri = userQuery.data?.avatar_url ?? userQuery.data?.avatar ?? userQuery.data?.photo;
  const { appointment, isLoading } = useUpcomingAppointment();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        {
          paddingBottom: insets.bottom + BottomTabInset + Spacing.five,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <HomeHeader
        firstName={firstName}
        isLoading={userQuery.isLoading}
        photoUri={photoUri}
        topInset={insets.top}
      />
      <View style={styles.heroContent}>
        <View style={styles.hero}>
          <Animated.View entering={FadeInUp.duration(300)}>
            <HomeGreeting
              greeting={greeting}
              firstName={firstName}
              subtitle="Let's take care of your health today."
            />
          </Animated.View>
          <Animated.View entering={FadeInUp.delay(100).duration(300)}>
            <UpcomingAppointmentCard
              appointment={appointment}
              isLoading={isLoading}
            />
          </Animated.View>
        </View>
      </View>
    </ScrollView>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: brandColors.white,
  },
  content: {
    flexGrow: 1,
  },
  heroContent: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
  },
  hero: {
    gap: Spacing.four,
  },
});

function getFirstName(firstName: string | undefined, fullName: string | undefined): string {
  if (firstName?.trim()) return firstName.trim();
  if (fullName?.trim()) return fullName.trim().split(/\s+/)[0] ?? 'there';
  return 'there';
}
