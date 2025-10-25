import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { useAuth } from '@/providers/AuthProvider';

export default function SignInScreen() {
  const router = useRouter();
  const { signInWithPassword, sendOtp, signInWithGoogle } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleEmailPasswordSignIn = async () => {
    setLoading(true);
    setError(null);
    setInfo(null);

    if (!email.trim() || !password.trim()) {
      setError('Enter both email and password.');
      setLoading(false);
      return;
    }

    const message = await signInWithPassword(email.trim(), password);
    if (message) {
      setError(message);
    }

    setLoading(false);
  };

  const handleOtp = async () => {
    setOtpLoading(true);
    setError(null);
    setInfo(null);

    if (!email.trim()) {
      setError('Enter an email to receive a code.');
      setOtpLoading(false);
      return;
    }

    const message = await sendOtp(email.trim());
    if (message) {
      setError(message);
    } else {
      setInfo('Check your inbox for a one-time code.');
      router.push({ pathname: '/(auth)/verify-otp', params: { email: email.trim() } });
    }

    setOtpLoading(false);
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    setError(null);
    setInfo(null);

    const message = await signInWithGoogle();
    if (message) {
      setError(message);
    }

    setGoogleLoading(false);
  };

  return (
    <View className="flex-1 bg-white dark:bg-neutral-950">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="py-12">
          <Text className="text-3xl font-semibold text-neutral-900 dark:text-white mb-2">Welcome back</Text>
          <Text className="text-neutral-500 dark:text-neutral-400 mb-8">
            Sign in to keep tracking your nutrition goals.
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
            className="h-12 rounded-xl border border-neutral-300 dark:border-neutral-800 px-4 text-base text-neutral-900 dark:text-white bg-white dark:bg-neutral-900 mb-2"
            placeholder="Password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {error ? <Text className="text-sm text-red-500 mb-4">{error}</Text> : null}
          {info ? <Text className="text-sm text-emerald-600 mb-4">{info}</Text> : null}

          <View className="mt-6 space-y-4">
            <Pressable
              className="h-12 rounded-xl bg-emerald-500 items-center justify-center"
              onPress={handleEmailPasswordSignIn}
              disabled={loading}
            >
              <Text className="text-white font-medium">
                {loading ? 'Signing in…' : 'Sign in'}
              </Text>
            </Pressable>

            <Link href="/(auth)/forgot-password" className="text-center mt-2 text-sm text-emerald-600">
              Forgot password?
            </Link>
          </View>

          <View className="mt-3 space-y-5">
            <Pressable
              className="h-12 rounded-xl border border-neutral-300 dark:border-neutral-800 items-center justify-center bg-white dark:bg-neutral-900"
              disabled={otpLoading}
              onPress={handleOtp}
            >
              <Text className="text-neutral-700 dark:text-neutral-200 font-medium">
                {otpLoading ? 'Sending code…' : 'Email me a one-time code'}
              </Text>
            </Pressable>

            <Pressable
              className="h-12 mt-2 rounded-xl bg-neutral-900 dark:bg-white items-center justify-center"
              disabled={googleLoading}
              onPress={handleGoogle}
            >
              <Text className="text-white dark:text-neutral-900 font-medium">
                {googleLoading ? 'Connecting…' : 'Continue with Google'}
              </Text>
            </Pressable>
          </View>

          <Text className="mt-2 text-center text-sm text-neutral-500 dark:text-neutral-400">
            New here?{' '}
            <Link href="/(auth)/sign-up" className="text-emerald-600">
              Create an account
            </Link>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
