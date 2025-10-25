import { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';

import { useAuth } from '@/providers/AuthProvider';

export default function VerifyOtpScreen() {
  const params = useLocalSearchParams<{ email?: string }>();
  const email = typeof params.email === 'string' ? params.email : '';

  const { verifyOtp, sendOtp } = useAuth();

  const [token, setToken] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  if (!email) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-neutral-950 px-6">
        <Text className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">We need your email</Text>
        <Text className="text-center text-neutral-600 dark:text-neutral-400 mb-6">
          Go back and request a sign-in code so we know where to send it.
        </Text>
        <Link href="/(auth)/sign-in" className="text-emerald-600 font-medium">
          Back to sign in
        </Link>
      </View>
    );
  }

  const handleVerify = async () => {
    if (!token.trim()) {
      setError('Enter the code sent to your email.');
      return;
    }

    setLoading(true);
    setError(null);

    const message = await verifyOtp(email, token.trim());
    if (message) {
      setError(message);
    }

    setLoading(false);
  };

  const handleResend = async () => {
    setResending(true);
    setError(null);
    setInfo(null);

    const message = await sendOtp(email);
    if (message) {
      setError(message);
    } else {
      setInfo('A fresh code is on the way to your inbox.');
    }

    setResending(false);
  };

  return (
    <View className="flex-1 bg-white dark:bg-neutral-950 px-6 justify-center">
      <Text className="text-3xl font-semibold text-neutral-900 dark:text-white mb-2">Enter your code</Text>
      <Text className="text-neutral-500 dark:text-neutral-400 mb-8">
        We sent a 6-digit code to {email}. Enter it below to finish signing in.
      </Text>

      <TextInput
        className="h-12 rounded-xl border border-neutral-300 dark:border-neutral-800 px-4 text-base text-neutral-900 dark:text-white bg-white dark:bg-neutral-900 tracking-[8px] text-center"
        placeholder="000000"
        placeholderTextColor="#9CA3AF"
        keyboardType="number-pad"
        maxLength={6}
        value={token}
        onChangeText={setToken}
      />

      {error ? <Text className="text-sm text-red-500 mt-4">{error}</Text> : null}
      {info ? <Text className="text-sm text-emerald-600 mt-4">{info}</Text> : null}

      <View className="mt-8 space-y-5">
        <Pressable
          className="h-12 rounded-xl bg-emerald-500 items-center justify-center"
          onPress={handleVerify}
          disabled={loading}
        >
          <Text className="text-white font-medium">
            {loading ? 'Verifying…' : 'Verify code'}
          </Text>
        </Pressable>

        <Pressable className="items-center py-2" onPress={handleResend} disabled={resending}>
          <Text className="text-sm text-emerald-600">
            {resending ? 'Resending…' : 'Resend code'}
          </Text>
        </Pressable>
      </View>

      <Text className="mt-10 text-center text-sm text-neutral-500 dark:text-neutral-400">
        Entered the wrong email?{' '}
        <Link href="/(auth)/sign-in" className="text-emerald-600">
          Try again
        </Link>
      </Text>
    </View>
  );
}
