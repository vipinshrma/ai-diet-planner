import { Redirect, Stack } from 'expo-router';

import { LoadingScreen } from '@/components/ui/loading';
import { useOnboarding } from '@/providers/OnboardingProvider';

export default function IntroLayout() {
  const { hasCompletedOnboarding, loading } = useOnboarding();

  if (loading) {
    return <LoadingScreen />;
  }

  if (hasCompletedOnboarding) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
