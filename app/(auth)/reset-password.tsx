import * as Linking from 'expo-linking';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { LoadingScreen } from '@/components/ui/loading';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<Record<string, string | string[]>>();
  const { updatePassword, signOut } = useAuth();

  const [initializing, setInitializing] = useState(true);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const establishSessionFromParams = async () => {
      try {
        if (typeof params.access_token === 'string' && typeof params.refresh_token === 'string') {
          const { error: setSessionError } = await supabase.auth.setSession({
            access_token: params.access_token,
            refresh_token: params.refresh_token,
          });
          if (setSessionError) {
            throw new Error(setSessionError.message);
          }
          return;
        }

        if (typeof params.code === 'string') {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(params.code);
          if (exchangeError) {
            throw new Error(exchangeError.message);
          }
          return;
        }

        const initialUrl = await Linking.getInitialURL();
        if (initialUrl) {
          const { error: deepLinkError } = await supabase.auth.exchangeCodeForSession(initialUrl);
          if (deepLinkError) {
            throw new Error(deepLinkError.message);
          }
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unable to use reset link. Request a new one.';
        setError(message);
      } finally {
        setInitializing(false);
      }
    };

    establishSessionFromParams();
  }, [params]);

  const handleUpdatePassword = async () => {
    setSubmitting(true);
    setError(null);
    setInfo(null);

    if (!newPassword || !confirmPassword) {
      setError('Enter and confirm your new password.');
      setSubmitting(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      setSubmitting(false);
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      setSubmitting(false);
      return;
    }

    const message = await updatePassword(newPassword);
    if (message) {
      setError(message);
    } else {
      setInfo('Password updated. Sign in with your new credentials.');
      await signOut();
      router.replace('/(auth)/sign-in');
    }

    setSubmitting(false);
  };

  if (initializing) {
    return <LoadingScreen />;
  }

  return (
    <View className="flex-1 bg-white dark:bg-neutral-950 px-6 justify-center">
      <Text className="text-3xl font-semibold text-neutral-900 dark:text-white mb-2">Create a new password</Text>
      <Text className="text-neutral-500 dark:text-neutral-400 mb-8">
        Choose a strong password to secure your AI Diet Planner account.
      </Text>

      <TextInput
        className="h-12 rounded-xl border border-neutral-300 dark:border-neutral-800 px-4 text-base text-neutral-900 dark:text-white bg-white dark:bg-neutral-900 mb-4"
        placeholder="New password"
        placeholderTextColor="#9CA3AF"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />

      <TextInput
        className="h-12 rounded-xl border border-neutral-300 dark:border-neutral-800 px-4 text-base text-neutral-900 dark:text-white bg-white dark:bg-neutral-900 mb-2"
        placeholder="Confirm new password"
        placeholderTextColor="#9CA3AF"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {error ? <Text className="text-sm text-red-500 mb-4">{error}</Text> : null}
      {info ? <Text className="text-sm text-emerald-600 mb-4">{info}</Text> : null}

      <View className="mt-2 space-y-5">
        <Pressable
          className="h-12 rounded-xl bg-emerald-500 items-center justify-center"
          onPress={handleUpdatePassword}
          disabled={submitting}
        >
          <Text className="text-white font-medium">
            {submitting ? 'Updating…' : 'Update password'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
