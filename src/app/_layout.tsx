import * as SplashScreen from 'expo-splash-screen';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, useColorScheme, View } from 'react-native';

import AppTabs from '@/components/app-tabs';
import { SplashScreen as StartupSplashScreen } from '@/presentation/screens/SplashScreen';

void SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 700,
  fade: true,
});

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
      <AppTabs />
      {showStartupSplash && (
        <View style={[StyleSheet.absoluteFill, styles.startupSplash]}>
          <StartupSplashScreen />
        </View>
      )}
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  startupSplash: {
    zIndex: 1000,
    elevation: 1000,
  },
});
