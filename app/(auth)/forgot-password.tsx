import { Link } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { useAuth } from '@/providers/AuthProvider';

export default function ForgotPasswordScreen() {
  const { sendPasswordReset } = useAuth();

  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    setLoading(true);
    setError(null);
    setInfo(null);

    if (!email.trim()) {
      setError('Enter your email to receive reset instructions.');
      setLoading(false);
      return;
    }

    const message = await sendPasswordReset(email.trim());
    if (message) {
      setError(message);
    } else {
      setInfo('Check your inbox for a password reset link.');
    }

    setLoading(false);
  };

  return (
    <View className="flex-1 bg-white dark:bg-neutral-950 px-6 justify-center">
      <Text className="text-3xl font-semibold text-neutral-900 dark:text-white mb-2">Reset password</Text>
      <Text className="text-neutral-500 dark:text-neutral-400 mb-8">
        Enter the email you used to sign up and we’ll send you a link to create a new password.
      </Text>

      <TextInput
        className="h-12 rounded-xl border border-neutral-300 dark:border-neutral-800 px-4 text-base text-neutral-900 dark:text-white bg-white dark:bg-neutral-900 mb-2"
        placeholder="Email address"
        placeholderTextColor="#9CA3AF"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      {error ? <Text className="text-sm text-red-500 mb-4">{error}</Text> : null}
      {info ? <Text className="text-sm text-emerald-600 mb-4">{info}</Text> : null}

      <View className="mt-2 space-y-5">
        <Pressable
          className="h-12 rounded-xl bg-emerald-500 items-center justify-center"
          onPress={handleReset}
          disabled={loading}
        >
          <Text className="text-white font-medium">
            {loading ? 'Sending link…' : 'Send reset link'}
          </Text>
        </Pressable>

        <Text className="text-center text-sm mt-2 text-neutral-500 dark:text-neutral-400">
          Remembered your password?{' '}
          <Link href="/(auth)/sign-in" className="text-emerald-600">
            Back to sign in
          </Link>
        </Text>
      </View>
    </View>
  );
}
