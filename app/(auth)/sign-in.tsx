import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

import { AuthField } from '@/components/auth/auth-field';
import { useAuth } from '@/providers/AuthProvider';

const PRIMARY = '#0F3E36';
const ACCENT = '#1CBF82';

export default function SignInScreen() {
  const router = useRouter();
  const { signInWithPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEmailPasswordSignIn = async () => {
    setLoading(true);
    setError(null);

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

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-neutral-950">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 justify-between px-6 py-10">
          <View>
            <Pressable
              onPress={() => router.back()}
              className="w-12 h-12 rounded-full bg-[#F4F6F5] items-center justify-center mb-8 active:opacity-80"
            >
              <Feather name="chevron-left" size={22} color={PRIMARY} />
            </Pressable>

            <Text className="text-4xl font-semibold text-[#0F3E36] dark:text-white mb-2">
              Welcome Back <Text>👋</Text>
            </Text>
            <Text className="text-base text-[#6B7B76] dark:text-neutral-400">
              Hi there, you’ve been missed.
            </Text>

            <View className="mt-10">
              <AuthField
                placeholder="Email"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                icon={<Feather name="mail" size={20} color={ACCENT} />}
              />

              <View className="flex-row items-center mt-4">
                <AuthField
                  placeholder="Password"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  icon={<Feather name="lock" size={20} color={ACCENT} />}
                  containerClassName="flex-1"
                />
                <Pressable
                  className="ml-3 w-14 h-14 rounded-full bg-[#1CBF82] items-center justify-center active:opacity-85"
                  onPress={() => {}}
                  accessibilityRole="button"
                  accessibilityLabel="Use fingerprint"
                >
                  <MaterialCommunityIcons name="fingerprint" size={28} color="white" />
                </Pressable>
              </View>

              {error ? <Text className="mt-4 text-sm text-red-500">{error}</Text> : null}
            </View>
          </View>

          <View className="mt-12">
            <Link
              href="/(auth)/forgot-password"
              className="text-sm text-center text-[#0F3E36] font-medium"
            >
              Forgot password?
            </Link>

            <Pressable
              className="mt-6 h-16 rounded-[32px] bg-[#0F3E36] flex-row items-center justify-between px-6 active:opacity-90"
              onPress={handleEmailPasswordSignIn}
              disabled={loading}
            >
              <Text className="text-white text-lg font-semibold">
                {loading ? 'Signing in…' : 'Login'}
              </Text>
              <Feather name="arrow-right" size={24} color="#2CD4A0" />
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
