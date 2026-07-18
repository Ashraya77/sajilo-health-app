import { useCallback } from 'react';
import { useRouter } from 'expo-router';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Screen } from '@/components/Screen';
import { HomeDiscoverySection } from '@/components/home/HomeDiscoverySection';
import { HomeClinicMembershipsSection } from '@/components/home/HomeClinicMembershipsSection';
import { HomeHeader } from '@/components/home/HomeHeader';
import { HomeQuickActions } from '@/components/home/HomeQuickActions';
import { HomeSearchEntry } from '@/components/home/HomeSearchEntry';
import { HomeSpecialtySection } from '@/components/home/HomeSpecialtySection';
import { UpcomingAppointmentSection } from '@/components/home/UpcomingAppointmentSection';
import { BottomTabInset, Colors, Spacing } from '@/constants/theme';
import { useGreeting } from '@/hooks/useGreeting';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useHomeClinicMemberships } from '@/hooks/useClinicMemberships';
import { useClinicWorkspace } from '@/hooks/useClinicWorkspace';
import { useHomeDiscovery } from '@/hooks/useHomeDiscovery';
import { useSpecialties } from '@/hooks/useSpecialties';
import { useUpcomingAppointment } from '@/hooks/useUpcomingAppointment';
import type { HomeDiscoveryFilters, HomeDiscoveryListing } from '@/types/home';
import type { ClinicMembership } from '@/types/clinic';
import type { ApiUser } from '@/types/profile';
import type { Specialty } from '@/types/specialty';

const HOME_DISCOVERY_FILTERS: HomeDiscoveryFilters = { limit: 8 };

export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { selectClinic } = useClinicWorkspace();
  const greeting = useGreeting();
  const {
    data: user,
    isLoading: isUserLoading,
    isRefetching: isUserRefetching,
    refetch: refetchUser,
  } = useCurrentUser();
  const {
    state: discoveryState,
    isRefetching: isDiscoveryRefetching,
    refresh: refreshDiscovery,
  } = useHomeDiscovery(HOME_DISCOVERY_FILTERS);
  const {
    state: upcomingAppointmentState,
    isRefetching: isAppointmentRefetching,
    refresh: refreshAppointment,
  } = useUpcomingAppointment();
  const {
    state: specialtyState,
    isRefetching: isSpecialtyRefetching,
    refresh: refreshSpecialties,
  } = useSpecialties();
  const {
    state: clinicMembershipsState,
    isRefetching: isMembershipsRefetching,
    refresh: refreshMemberships,
  } = useHomeClinicMemberships();
  const firstName = getFirstName(user);
  const photoUri = user?.avatar_url ?? user?.avatar ?? user?.photo;
  const handleProfilePress = useCallback(() => {
    router.push('/profile');
  }, [router]);
  const handleSearchPress = useCallback(() => {
    router.push('/search');
  }, [router]);
  const handleClinicsPress = useCallback(() => {
    router.push('/clinics');
  }, [router]);
  const handleBookAppointmentPress = useCallback(() => {
    router.push('/clinics');
  }, [router]);
  const handleAppointmentsPress = useCallback(() => {
    router.push('/appointments');
  }, [router]);
  const handleRecordsPress = useCallback(() => {
    router.push('/prescriptions');
  }, [router]);
  const handleListingPress = useCallback((listing: HomeDiscoveryListing) => {
    router.push({
      pathname: '/clinics/[listingId]',
      params: { listingId: listing.id },
    });
  }, [router]);
  const handleAppointmentDetailsPress = useCallback((appointmentId: string) => {
    router.push({
      pathname: '/appointments/[appointmentId]',
      params: { appointmentId },
    });
  }, [router]);
  const handleSpecialtyPress = useCallback((specialty: Specialty) => {
    router.push({
      pathname: '/search',
      params: {
        specialty: specialty.value,
        specialtyLabel: specialty.label,
      },
    });
  }, [router]);
  const handleSeeAllSpecialties = useCallback(() => {
    router.push('/search');
  }, [router]);
  const handleOpenClinic = useCallback((membership: ClinicMembership) => {
    selectClinic({
      clinicId: membership.clinicId,
      clinicName: membership.clinicName,
      clinicSlug: membership.clinicSlug,
    });
    router.push({
      pathname: '/clinics/[listingId]/workspace',
      params: {
        listingId: membership.clinicId,
        clinicName: membership.clinicName,
      },
    });
  }, [router, selectClinic]);
  const handleAppointmentRetry = useCallback(() => {
    void refreshAppointment();
  }, [refreshAppointment]);
  const handleDiscoveryRetry = useCallback(() => {
    void refreshDiscovery();
  }, [refreshDiscovery]);
  const handleSpecialtyRetry = useCallback(() => {
    void refreshSpecialties();
  }, [refreshSpecialties]);
  const handleMembershipsRetry = useCallback(() => {
    void refreshMemberships();
  }, [refreshMemberships]);
  const handleRefresh = useCallback(() => {
    void Promise.allSettled([
      refetchUser(),
      refreshAppointment(),
      refreshDiscovery(),
      refreshSpecialties(),
      refreshMemberships(),
    ]);
    // TODO: Refresh each implemented Home section as it joins this composition.
  }, [
    refetchUser,
    refreshAppointment,
    refreshDiscovery,
    refreshMemberships,
    refreshSpecialties,
  ]);

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: insets.bottom + BottomTabInset + Spacing.five,
          },
        ]}
        refreshControl={(
          <RefreshControl
            colors={[Colors.primary]}
            onRefresh={handleRefresh}
            refreshing={isUserRefetching
              || isAppointmentRefetching
              || isDiscoveryRefetching
              || isSpecialtyRefetching
              || isMembershipsRefetching}
            tintColor={Colors.primary}
          />
        )}
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader
          firstName={firstName}
          greeting={greeting}
          isLoading={isUserLoading}
          onProfilePress={handleProfilePress}
          photoUri={photoUri}
        />
        <View style={styles.sections}>
          <HomeSearchEntry onPress={handleSearchPress} />
          <HomeQuickActions
            onAppointmentsPress={handleAppointmentsPress}
            onBookAppointmentPress={handleBookAppointmentPress}
            onFindClinicsPress={handleClinicsPress}
            onRecordsPress={handleRecordsPress}
          />
          <UpcomingAppointmentSection
            isRefreshing={isAppointmentRefetching}
            onBookAppointment={handleBookAppointmentPress}
            onOpenDetails={handleAppointmentDetailsPress}
            onRetry={handleAppointmentRetry}
            onViewAll={handleAppointmentsPress}
            state={upcomingAppointmentState}
          />
          <HomeDiscoverySection
            onListingPress={handleListingPress}
            onRetry={handleDiscoveryRetry}
            state={discoveryState}
          />
          <HomeSpecialtySection
            onRetry={handleSpecialtyRetry}
            onSeeAll={handleSeeAllSpecialties}
            onSpecialtyPress={handleSpecialtyPress}
            state={specialtyState}
          />
          <HomeClinicMembershipsSection
            onOpenClinic={handleOpenClinic}
            onRetry={handleMembershipsRetry}
            state={clinicMembershipsState}
          />
          <PrescriptionSummarySectionPlaceholder />
          <ClinicDiagnosticSummarySectionPlaceholder />
        </View>
      </ScrollView>
    </Screen>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    gap: Spacing.five,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
  },
  sections: {
    gap: Spacing.five,
  },
});

function getFirstName(user: ApiUser | undefined): string | undefined {
  if (user?.full_name?.trim()) return user.full_name.trim().split(/\s+/)[0];
  if (user?.first_name?.trim()) return user.first_name.trim();
  return undefined;
}

// TODO: Replace each internal boundary as its dedicated Home section is implemented.
function PrescriptionSummarySectionPlaceholder() {
  return null;
}

function ClinicDiagnosticSummarySectionPlaceholder() {
  return null;
}
