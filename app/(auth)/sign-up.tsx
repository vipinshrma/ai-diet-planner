import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { Link } from 'expo-router';

import { useAuth } from '@/providers/AuthProvider';

export default function SignUpScreen() {
  const { signUpWithPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    setError(null);
    setInfo(null);

    if (!email.trim() || !password || !confirmPassword) {
      setError('Please fill out all fields.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      setLoading(false);
      return;
    }

    const result = await signUpWithPassword(email.trim(), password);
    if (result.error) {
      setError(result.error);
    } else if (result.needsEmailVerification) {
      setInfo('Check your inbox to confirm your email before signing in.');
    } else {
      setInfo('Account created successfully.');
    }

    setLoading(false);
  };

  return (
    <View className="flex-1 bg-white dark:bg-neutral-950">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="py-12">
          <Text className="text-3xl font-semibold text-neutral-900 dark:text-white mb-2">Create account</Text>
          <Text className="text-neutral-500 dark:text-neutral-400 mb-8">
            Join AI Diet Planner and personalize your nutrition journey.
          </Text>

          <TextInput
            className="h-12 rounded-xl border border-neutral-300 dark:border-neutral-800 px-4 text-base text-neutral-900 dark:text-white bg-white dark:bg-neutral-900 mb-4"
            placeholder="Email address"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            className="h-12 rounded-xl border border-neutral-300 dark:border-neutral-800 px-4 text-base text-neutral-900 dark:text-white bg-white dark:bg-neutral-900 mb-4"
            placeholder="Password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TextInput
            className="h-12 rounded-xl border border-neutral-300 dark:border-neutral-800 px-4 text-base text-neutral-900 dark:text-white bg-white dark:bg-neutral-900 mb-2"
            placeholder="Confirm password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          {error ? <Text className="text-sm text-red-500 mb-4">{error}</Text> : null}
          {info ? <Text className="text-sm text-emerald-600 mb-4">{info}</Text> : null}

          <View className="mt-6 space-y-5">
            <Pressable
              className="h-12 rounded-xl bg-emerald-500 items-center justify-center"
              onPress={handleSignUp}
              disabled={loading}
            >
              <Text className="text-white font-medium">
                {loading ? 'Creating account…' : 'Create account'}
              </Text>
            </Pressable>

            <Text className="text-center text-sm text-neutral-500 dark:text-neutral-400">
              Already have an account?{' '}
              <Link href="/(auth)/sign-in" className="text-emerald-600">
                Sign in
              </Link>
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
