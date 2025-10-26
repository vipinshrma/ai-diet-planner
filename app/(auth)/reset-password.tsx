import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { LoadingScreen } from '@/components/ui/loading';
import { AuthField } from '@/components/auth/auth-field';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';

const PRIMARY = '#0F3E36';
const ACCENT = '#1CBF82';

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
          if (setSessionError) throw new Error(setSessionError.message);
          return;
        }

        if (typeof params.code === 'string') {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(params.code);
          if (exchangeError) throw new Error(exchangeError.message);
          return;
        }

        const initialUrl = await Linking.getInitialURL();
        if (initialUrl) {
          const { error: deepLinkError } = await supabase.auth.exchangeCodeForSession(initialUrl);
          if (deepLinkError) throw new Error(deepLinkError.message);
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Unable to use reset link. Request a new one.';
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
    <SafeAreaView className="flex-1 bg-white dark:bg-neutral-950">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 justify-between px-6 py-10">
          <View>
            <Pressable
              onPress={() => router.back()}
              className="w-12 h-12 rounded-full bg-[#F4F6F5] items-center justify-center mb-8 active:opacity-80"
            >
              <Feather name="chevron-left" size={22} color={PRIMARY} />
            </Pressable>

            <Text className="text-4xl font-semibold text-[#0F3E36] dark:text-white mb-2">
              Create a new password
            </Text>
            <Text className="text-base text-[#6B7B76] dark:text-neutral-400">
              Choose something secure to keep your account safe.
            </Text>

            <View className="mt-12">
              <AuthField
                placeholder="New password"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
                icon={<Feather name="lock" size={20} color={ACCENT} />}
              />
              <AuthField
                placeholder="Confirm new password"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                icon={<Feather name="check" size={20} color={ACCENT} />}
                containerClassName="mt-5"
              />

              {error ? <Text className="mt-4 text-sm text-red-500">{error}</Text> : null}
              {info ? <Text className="mt-2 text-sm text-emerald-600">{info}</Text> : null}
            </View>
          </View>

          <Pressable
            className="mt-12 h-16 rounded-[32px] bg-[#0F3E36] flex-row items-center justify-between px-6 active:opacity-90"
            onPress={handleUpdatePassword}
            disabled={submitting}
          >
            <Text className="text-white text-lg font-semibold">
              {submitting ? 'Updating…' : 'Update password'}
            </Text>
            <Feather name="arrow-right" size={24} color="#2CD4A0" />
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
