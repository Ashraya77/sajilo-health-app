import { useCallback, useState } from 'react';
import { useRouter } from 'expo-router';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Screen } from '@/components/Screen';
import { HomeDiscoverySection } from '@/components/home/HomeDiscoverySection';
import { HomeDrawer, type HomeDrawerDestination } from '@/components/home/HomeDrawer';
import { HomeClinicMembershipsSection } from '@/components/home/HomeClinicMembershipsSection';
import { HomeHeader } from '@/components/home/HomeHeader';
import { HomeQuickActions } from '@/components/home/HomeQuickActions';
import { HomeSpecialtySection } from '@/components/home/HomeSpecialtySection';
import { UpcomingAppointmentSection } from '@/components/home/UpcomingAppointmentSection';
import { BottomTabInset, Colors, Spacing } from '@/constants/theme';
import { useGreeting } from '@/hooks/useGreeting';
import { useAuthSession } from '@/hooks/useAuthSession';
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
  const { logout } = useAuthSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
  const displayName = getDisplayName(user);
  const photoUri = user?.avatar_url ?? user?.avatar ?? user?.photo;
  const handleProfilePress = useCallback(() => {
    router.push('/profile');
  }, [router]);
  const handleDrawerNavigate = useCallback((destination: HomeDrawerDestination) => {
    setIsMenuOpen(false);
    const routes = {
      profile: '/profile',
      appointments: '/appointments',
      records: '/prescriptions',
      saved: '/search',
    } as const;
    if (destination in routes) {
      router.push(routes[destination as keyof typeof routes]);
    }
  }, [router]);
  const handleLogout = useCallback(() => {
    setIsMenuOpen(false);
    void logout();
  }, [logout]);
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
    <Screen edges={[]}>
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
          onMenuPress={() => setIsMenuOpen(true)}
          photoUri={photoUri}
        />
        <View style={styles.sections}>
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
          <HomeSpecialtySection
            onRetry={handleSpecialtyRetry}
            onSeeAll={handleSeeAllSpecialties}
            onSpecialtyPress={handleSpecialtyPress}
            state={specialtyState}
          />
          <HomeDiscoverySection
            onListingPress={handleListingPress}
            onRetry={handleDiscoveryRetry}
            state={discoveryState}
          />
          <HomeClinicMembershipsSection
            onBrowseClinics={handleClinicsPress}
            onOpenClinic={handleOpenClinic}
            onRetry={handleMembershipsRetry}
            state={clinicMembershipsState}
          />
          <PrescriptionSummarySectionPlaceholder />
          <ClinicDiagnosticSummarySectionPlaceholder />
        </View>
      </ScrollView>
      <HomeDrawer
        email={user?.email}
        name={displayName}
        onClose={() => setIsMenuOpen(false)}
        onLogout={handleLogout}
        onNavigate={handleDrawerNavigate}
        photoUri={photoUri}
        visible={isMenuOpen}
      />
    </Screen>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    width: '100%',
  },
  sections: {
    alignSelf: 'center',
    gap: Spacing.five,
    maxWidth: 720,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.five,
    width: '100%',
  },
});

function getFirstName(user: ApiUser | undefined): string | undefined {
  if (user?.full_name?.trim()) return user.full_name.trim().split(/\s+/)[0];
  if (user?.first_name?.trim()) return user.first_name.trim();
  return undefined;
}

function getDisplayName(user: ApiUser | undefined): string {
  if (user?.full_name?.trim()) return user.full_name.trim();
  const composedName = [user?.first_name, user?.last_name].filter(Boolean).join(' ').trim();
  return composedName || 'Sajilo Health member';
}

// TODO: Replace each internal boundary as its dedicated Home section is implemented.
function PrescriptionSummarySectionPlaceholder() {
  return null;
}

function ClinicDiagnosticSummarySectionPlaceholder() {
  return null;
}
