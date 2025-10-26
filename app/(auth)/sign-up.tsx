import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { AuthField } from '@/components/auth/auth-field';
import { useAuth } from '@/providers/AuthProvider';

const PRIMARY = '#0F3E36';
const ACCENT = '#1CBF82';

export default function SignUpScreen() {
  const router = useRouter();
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
              Create Account
            </Text>
            <Text className="text-base text-[#6B7B76] dark:text-neutral-400">
              Join AI Diet Planner to personalise your journey.
            </Text>

            <View className="mt-12">
              <AuthField
                placeholder="Email"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                icon={<Feather name="mail" size={20} color={ACCENT} />}
              />
              <AuthField
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                icon={<Feather name="lock" size={20} color={ACCENT} />}
                containerClassName="mt-5"
              />
              <AuthField
                placeholder="Confirm password"
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

          <View className="mt-12">
            <Pressable
              className="h-16 rounded-[32px] bg-[#0F3E36] flex-row items-center justify-between px-6 active:opacity-90"
              onPress={handleSignUp}
              disabled={loading}
            >
              <Text className="text-white text-lg font-semibold">
                {loading ? 'Creating account…' : 'Sign up'}
              </Text>
              <Feather name="arrow-right" size={24} color="#2CD4A0" />
            </Pressable>

            <Text className="mt-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
              Already have an account?{' '}
              <Link href="/(auth)/sign-in" className="text-[#1CBF82] font-medium">
                Sign in
              </Link>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
