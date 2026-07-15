import * as SplashScreen from 'expo-splash-screen';
import { DarkTheme, DefaultTheme, Tabs, ThemeProvider } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Image,
  StyleSheet,
  useColorScheme,
  View,
  type ColorValue,
  type ImageSourcePropType,
} from 'react-native';

import { brandColors } from '@/constants/theme';
import { AuthSessionProvider } from '@/hooks/useAuthSession';
import { SplashScreen as StartupSplashScreen } from '@/screens/SplashScreen';

void SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 700,
  fade: true,
});

type TabIconProps = {
  color: ColorValue;
  source: ImageSourcePropType;
  size: number;
};

function TabIcon({ color, source, size }: TabIconProps) {
  return (
    <Image
      resizeMode="contain"
      source={source}
      style={[styles.tabIcon, { width: size, height: size, tintColor: color }]}
    />
  );
}

type ProfileTabIconProps = {
  color: ColorValue;
  size: number;
};

function ProfileTabIcon({ color, size }: ProfileTabIconProps) {
  const headSize = size * 0.38;
  const shoulderWidth = size * 0.78;
  const shoulderHeight = size * 0.34;

  return (
    <View style={[styles.profileIcon, { width: size, height: size }]}>
      <View
        style={[
          styles.profileHead,
          {
            width: headSize,
            height: headSize,
            borderRadius: headSize / 2,
            backgroundColor: color,
          },
        ]}
      />
      <View
        style={[
          styles.profileShoulders,
          {
            width: shoulderWidth,
            height: shoulderHeight,
            borderTopLeftRadius: shoulderHeight,
            borderTopRightRadius: shoulderHeight,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [showStartupSplash, setShowStartupSplash] = useState(true);

  useEffect(() => {
    const hideNativeSplashFrame = requestAnimationFrame(() => {
      SplashScreen.hide();
    });
    const startupSplashTimer = setTimeout(() => {
      setShowStartupSplash(false);
    }, 1800);

    return () => {
      cancelAnimationFrame(hideNativeSplashFrame);
      clearTimeout(startupSplashTimer);
    };
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthSessionProvider>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: brandColors.primary,
            tabBarInactiveTintColor: brandColors.softBlue,
            tabBarLabelStyle: styles.tabLabel,
            tabBarStyle: styles.tabBar,
          }}>
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              tabBarIcon: ({ color, size }) => (
                <TabIcon
                  color={color}
                  source={require('@/assets/images/tabIcons/home.png')}
                  size={size}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="login"
            options={{
              href: null,
              title: 'Login',
              tabBarIcon: ({ color, size }) => (
                <TabIcon
                  color={color}
                  source={require('@/assets/images/tabIcons/explore.png')}
                  size={size}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: 'Profile',
              tabBarIcon: ({ color, size }) => (
                <ProfileTabIcon color={color} size={size} />
              ),
            }}
          />
        </Tabs>
        {showStartupSplash && (
          <View style={[StyleSheet.absoluteFill, styles.startupSplash]}>
            <StartupSplashScreen />
          </View>
        )}
      </AuthSessionProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    marginTop: 2,
  },
  profileIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    marginTop: 2,
  },
  profileHead: {
    marginBottom: 1,
  },
  profileShoulders: {
    opacity: 0.95,
  },
  tabBar: {
    backgroundColor: brandColors.white,
    borderTopWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  tabLabel: {
    fontWeight: '700',
    letterSpacing: 0,
  },
  startupSplash: {
    zIndex: 1000,
    elevation: 1000,
  },
});
