import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import {
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
  adaptNavigationTheme
} from 'react-native-paper';
import merge from 'deepmerge';
import { AuthProvider } from '@/context/AuthContext';
import { FraldasProvider } from '@/context/FraldasContext';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  ThemeProvider
} from '@react-navigation/native';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const customDarkTheme = {
  ...MD3DarkTheme,
  colors: Colors.dark
}

const customLightTheme = {
  ...MD3LightTheme,
  colors: Colors.light
}

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

const CombinedDefaultTheme = merge(customLightTheme, NavigationDefaultTheme);
const CombinedDarkTheme = merge(customDarkTheme, NavigationDarkTheme);

import { useTheme } from '@/hooks/useTheme';
import { StatusBar } from 'expo-status-bar';
import * as Network from 'expo-network';
import { NetworkProvider } from './../context/NetworkContext';

export default function RootLayout() {
  // const colorScheme = useColorScheme();
  const { colorScheme } = useTheme();

  const paperTheme = colorScheme === 'dark' ? CombinedDarkTheme : CombinedDefaultTheme

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }

  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <NetworkProvider>
      <FraldasProvider>
    <AuthProvider>
      <PaperProvider theme={paperTheme}>
        <ThemeProvider value={paperTheme}>
          <Slot />
        </ThemeProvider>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      </PaperProvider>
    </AuthProvider>
    </FraldasProvider>
    </NetworkProvider>
  );
}


