import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'ai-diet-planner:onboarding';

type OnboardingContextValue = {
  hasCompletedOnboarding: boolean;
  loading: boolean;
  completeOnboarding: () => Promise<void>;
  resetOnboarding: () => Promise<void>;
};

const OnboardingContext = createContext<OnboardingContextValue | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (!mounted) return;
        setHasCompletedOnboarding(value === 'true');
      })
      .catch((error) => {
        console.warn('[Onboarding] Failed to read onboarding state', error);
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const completeOnboarding = useCallback(async () => {
    try {
      setHasCompletedOnboarding(true);
      await AsyncStorage.setItem(STORAGE_KEY, 'true');
    } catch (error) {
      console.warn('[Onboarding] Failed to persist onboarding completion', error);
    }
  }, []);

  const resetOnboarding = useCallback(async () => {
    try {
      setHasCompletedOnboarding(false);
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('[Onboarding] Failed to clear onboarding state', error);
    }
  }, []);

  const value = useMemo(
    () => ({
      hasCompletedOnboarding,
      loading,
      completeOnboarding,
      resetOnboarding,
    }),
    [hasCompletedOnboarding, loading, completeOnboarding, resetOnboarding]
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}
