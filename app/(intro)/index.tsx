import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useMemo, useRef, useState } from 'react';
import { Dimensions, FlatList, Pressable, Text, View, ViewToken } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

import { useOnboarding } from '@/providers/OnboardingProvider';

type Slide = {
  title: string;
  subtitle: string;
  topic: string;
};

const SLIDES: Slide[] = [
  {
    title: 'Know What You Eat',
    subtitle: 'Gain insights into your nutrition habits with detailed stats and smarter tracking.',
    topic: 'healthy-food',
  },
  {
    title: 'Track Your Diet',
    subtitle: 'Stay on course with weekly goals, macro breakdowns, and realtime coaching.',
    topic: 'nutrition-tracking',
  },
  {
    title: 'Live Healthy & Great',
    subtitle: 'Kickstart your journey today and build lasting habits with AI-powered support.',
    topic: 'wellness-award',
  },
];

const { width } = Dimensions.get('window');

function generateIllustrationUrls(topics: string[]) {
  return topics.map((topic, index) => {
    const seed = Math.floor(Math.random() * 1000) + index;
    return `https://source.unsplash.com/900x900/?${topic}&sig=${seed}`;
  });
}

type ProgressButtonProps = {
  progress: number;
  isLastStep: boolean;
  onPress: () => void;
};

const BUTTON_SIZE = 84;
const STROKE_WIDTH = 6;
const RADIUS = (BUTTON_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function ProgressButton({ progress, isLastStep, onPress }: ProgressButtonProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const strokeDashoffset = CIRCUMFERENCE * (1 - clampedProgress);

  return (
    <Pressable
      onPress={onPress}
      className="w-[108px] h-[108px] items-center justify-center rounded-full"
    >
      <View className="absolute inset-0 items-center justify-center">
        <Svg width={BUTTON_SIZE} height={BUTTON_SIZE}>
          <Circle
            stroke="#D8EDE6"
            cx={BUTTON_SIZE / 2}
            cy={BUTTON_SIZE / 2}
            r={RADIUS}
            strokeWidth={STROKE_WIDTH}
            fill="none"
          />
          <Circle
            stroke="#0CC28F"
            cx={BUTTON_SIZE / 2}
            cy={BUTTON_SIZE / 2}
            r={RADIUS}
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
            strokeDashoffset={strokeDashoffset}
            transform={`rotate(-90 ${BUTTON_SIZE / 2} ${BUTTON_SIZE / 2})`}
          />
        </Svg>
      </View>
      <View className="w-[72px] h-[72px] rounded-full bg-[#0A3D35] dark:bg-neutral-100 items-center justify-center">
        {isLastStep ? (
          <Text className="text-white dark:text-neutral-900 text-base font-semibold">
            Start
          </Text>
        ) : (
          <Feather name="chevron-right" size={28} color="#FFFFFF" />
        )}
      </View>
    </Pressable>
  );
}

export default function OnboardingScreen() {
  const flatListRef = useRef<FlatList<Slide>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { completeOnboarding } = useOnboarding();

  const illustrationUrls = useMemo(
    () => generateIllustrationUrls(SLIDES.map((slide) => slide.topic)),
    []
  );

  const handleViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && typeof viewableItems[0].index === 'number') {
        setCurrentIndex(viewableItems[0].index);
      }
    }
  ).current;

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    }
  };

  const handleFinish = completeOnboarding;

  const handleSkip = completeOnboarding;

  const isLastSlide = currentIndex === SLIDES.length - 1;
  const progress = (currentIndex + 1) / SLIDES.length;

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-neutral-950">
      <View className="flex-1">
        <View className="flex-row items-center justify-between px-6 pt-4">
          <Text className="text-2xl font-semibold text-emerald-600 dark:text-emerald-400">LifeFit</Text>
          <Pressable
            onPress={isLastSlide ? handleFinish : handleSkip}
            className="px-4 py-2 rounded-full bg-white/80 dark:bg-neutral-900/80 border border-emerald-200 dark:border-neutral-800"
          >
            <Text className="text-sm font-medium text-emerald-600 dark:text-emerald-300">
              {isLastSlide ? 'Login' : 'Skip'}
            </Text>
          </Pressable>
        </View>

        <FlatList
          ref={flatListRef}
          data={SLIDES}
          keyExtractor={(item) => item.title}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={handleViewableItemsChanged}
          viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
          renderItem={({ item, index }) => (
            <View style={{ width }} className="px-6 flex-1">
              <View className="mt-10 mb-12 h-[320px] rounded-3xl bg-white dark:bg-neutral-900 items-center justify-center shadow-lg shadow-slate-300 dark:shadow-black/40">
                <Image
                  source={{ uri: illustrationUrls[index] }}
                  contentFit="contain"
                  style={{ width: width - 120, height: 260 }}
                  transition={300}
                />
              </View>

              <View className="flex-1 rounded-[36px] bg-[#F5F7F6] dark:bg-neutral-900/90 px-6 pt-10 pb-12 shadow-lg shadow-emerald-100/60 dark:shadow-black/40 w-full self-center">
                <View className="flex-1 items-center justify-between">
                  <View>
                    <Text className="text-3xl font-semibold text-[#0F3E36] dark:text-white mb-3 text-center">
                      {item.title}
                    </Text>
                    <Text className="text-base leading-6 text-[#5B6D67] dark:text-neutral-400 text-center">
                      {item.subtitle}
                    </Text>
                  </View>
                  <View className="mt-12 items-center">
                    <ProgressButton
                      progress={progress}
                      isLastStep={isLastSlide}
                      onPress={isLastSlide ? handleFinish : handleNext}
                    />
                  </View>
                </View>
              </View>
            </View>
          )}
      />

        <View className="pb-10" />
      </View>
    </SafeAreaView>
  );
}
