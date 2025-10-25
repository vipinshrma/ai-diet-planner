import { Redirect, Stack } from 'expo-router';

import { LoadingScreen } from '@/components/ui/loading';
import { useAuth } from '@/providers/AuthProvider';
import { useOnboarding } from '@/providers/OnboardingProvider';

export default function AuthLayout() {
  const { session, loading } = useAuth();
  const { hasCompletedOnboarding, loading: onboardingLoading } = useOnboarding();

  if (loading || onboardingLoading) {
    return <LoadingScreen />;
  }

  if (!hasCompletedOnboarding) {
    return <Redirect href="/(intro)" />;
  }

  if (session) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
      <Stack.Screen name="verify-otp" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="reset-password" />
    </Stack>
  );
}
