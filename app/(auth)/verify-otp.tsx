import { useRef, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { useAuth } from '@/providers/AuthProvider';

const PRIMARY = '#0F3E36';

export default function VerifyOtpScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string }>();
  const email = typeof params.email === 'string' ? params.email : '';

  const { verifyOtp, sendOtp } = useAuth();

  const [digits, setDigits] = useState<string[]>(Array(6).fill(''));
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const inputRefs = useRef<(TextInput | null)[]>([]);

  if (!email) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-neutral-950 px-6 items-center justify-center">
        <Text className="text-lg font-semibold text-[#0F3E36] dark:text-white mb-2">
          We need your email
        </Text>
        <Text className="text-center text-[#6B7B76] dark:text-neutral-400 mb-6">
          Go back and request a sign-in code so we know where to send it.
        </Text>
        <Link href="/(auth)/sign-in" className="text-[#1CBF82] font-medium">
          Back to sign in
        </Link>
      </SafeAreaView>
    );
  }

  const handleVerify = async () => {
    const token = digits.join('').trim();
    if (token.length !== 6) {
      setError('Enter the 6-digit code sent to your email.');
      return;
    }

    setLoading(true);
    setError(null);

    const message = await verifyOtp(email, token);
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

  const handleDigitChange = (value: string, index: number) => {
    const sanitized = value.replace(/\D/g, '').slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = sanitized;
      return next;
    });

    if (sanitized && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    if (!sanitized && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
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
              Enter your code
            </Text>
            <Text className="text-base text-[#6B7B76] dark:text-neutral-400">
              We sent a 6-digit code to {email}. Enter it below to finish signing in.
            </Text>

            <View className="mt-12">
              <View className="flex-row justify-between">
                {Array.from({ length: 6 }).map((_, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    keyboardType="number-pad"
                    maxLength={1}
                    value={digits[index] ?? ''}
                    onChangeText={(text) => handleDigitChange(text, index)}
                    placeholder="•"
                    placeholderTextColor="#9CB4AD"
                    className="w-12 h-16 rounded-[24px] bg-[#F4F6F5] dark:bg-neutral-900/80 text-xl text-center text-[#103B33] dark:text-white"
                  />
                ))}
              </View>

              {error ? <Text className="mt-4 text-sm text-red-500">{error}</Text> : null}
              {info ? <Text className="mt-4 text-sm text-emerald-600">{info}</Text> : null}
            </View>
          </View>

          <View className="mt-12">
            <Pressable
              className="h-16 rounded-[32px] bg-[#0F3E36] flex-row items-center justify-between px-6 active:opacity-90"
              onPress={handleVerify}
              disabled={loading}
            >
              <Text className="text-white text-lg font-semibold">
                {loading ? 'Verifying…' : 'Verify code'}
              </Text>
              <Feather name="arrow-right" size={24} color="#2CD4A0" />
            </Pressable>

            <Pressable
              className="mt-6 h-14 rounded-[32px] border border-[#D8E4E0] flex-row items-center justify-center bg-white active:opacity-90 px-6"
              onPress={handleResend}
              disabled={resending}
            >
              <Feather name="refresh-ccw" size={18} color={PRIMARY} />
              <Text className="ml-2 text-[#103B33] font-medium">
                {resending ? 'Resending…' : 'Resend code'}
              </Text>
            </Pressable>

            <Text className="mt-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
              Entered the wrong email?{' '}
              <Link href="/(auth)/sign-in" className="text-[#1CBF82] font-medium">
                Try again
              </Link>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
