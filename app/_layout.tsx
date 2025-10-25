import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import '../global.css';

import { LoadingScreen } from '@/components/ui/loading';
import { AuthProvider, useAuth } from '@/providers/AuthProvider';
import { OnboardingProvider, useOnboarding } from '@/providers/OnboardingProvider';


export const unstable_settings = {
  anchor: '(tabs)',
};

function RootNavigator() {
  const { loading } = useAuth();
  const { loading: onboardingLoading } = useOnboarding();

  if (loading || onboardingLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName="(intro)">
      <Stack.Screen name="(intro)" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
    </Stack>
  );
}

function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <OnboardingProvider>
          <RootNavigator />
        </OnboardingProvider>
      </AuthProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default RootLayout;
