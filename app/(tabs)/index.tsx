import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import { useMemo } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

const PRIMARY_DARK = '#0F3E36';

const MEALS = [
  {
    id: 'breakfast',
    title: 'Breakfast',
    summary: '3 Foods',
    calories: '582 / 631 kcal',
    image:
      'https://images.unsplash.com/photo-1484980972926-edee96e0960d?auto=format&fit=crop&w=120&q=60',
  },
  {
    id: 'lunch',
    title: 'Lunch',
    summary: '3 Foods',
    calories: '1157 / 1262 kcal',
    image:
      'https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?auto=format&fit=crop&w=120&q=60',
  },
  {
    id: 'dinner',
    title: 'Dinner',
    summary: '0 Foods',
    calories: '0 / 946 kcal',
    image:
      'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=120&q=60',
  },
];

const WATER_CUPS = 8;
const WATER_CONSUMED = 3;

export default function HomeScreen() {

  const calorieProgress = useMemo(
    () => ({
      value: 1739,
      target: 2925,
      progress: 0.6,
    }),
    []
  );

  const waterProgress = useMemo(
    () => ({
      value: 570,
      target: 2000,
    }),
    []
  );

  return (
    <SafeAreaView className="flex-1 bg-[#F5F7F6]" edges={['top']}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="pt-4">
          <Header />
          <Greeting />
          <CalorieCard
            value={calorieProgress.value}
            target={calorieProgress.target}
            progress={calorieProgress.progress}
          />
          <MacroSummary />
          <MealsSection meals={MEALS} />
          <WaterSection consumed={waterProgress.value} target={waterProgress.target} />
          <ActivitySection />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Header() {
  return (
    <View className="flex-row items-center">
      <Image
        source={{
          uri: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=140&q=60',
        }}
        className="h-12 w-12 rounded-full"
      />
      <View className="flex-1 items-center">
        <View className="flex-row items-center gap-2">
          <Text className="text-lg font-semibold text-[#0F3E36]">March 28 2022</Text>
          <Feather name="chevron-down" size={18} color="#0F3E36" />
        </View>
      </View>
      <Pressable className="h-12 w-12 rounded-full bg-[#1CBF82] items-center justify-center active:opacity-90">
        <Feather name="calendar" size={20} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

function Greeting() {
  return (
    <View className="mt-8">
      <Text className="text-[32px] font-semibold text-[#0F3E36]">Good Morning ☀️</Text>
      <Text className="mt-2 text-base text-[#5E7470]">
        You’ve gained <Text className="text-[#1CBF82] font-semibold">2kg</Text> yesterday keep it up!
      </Text>
    </View>
  );
}

function CalorieCard({
  value,
  target,
  progress,
}: {
  value: number;
  target: number;
  progress: number;
}) {
  const size = 240;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.75;
  const gap = circumference - arcLength;
  const trackOffset = gap / 2;
  const progressOffset = trackOffset + arcLength * (1 - progress);

  return (
    <View className="mt-8 rounded-[40px] bg-[#E9F7EA] px-6 py-8">
      <View className="items-center justify-center">
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#C7EACD"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={`${arcLength} ${gap}`}
            strokeDashoffset={trackOffset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#69C779"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={`${arcLength} ${gap}`}
            strokeDashoffset={progressOffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        <View className="absolute top-[78px] w-full items-center">
          <MaterialCommunityIcons name="fire" size={28} color="#61C36A" />
          <Text className="mt-2 text-base text-[#5E7470]">Calories</Text>
          <Text className="mt-2 text-[42px] font-semibold text-[#0F3E36]">{value}</Text>
          <Text className="mt-1 text-sm text-[#6B7B76]">of {target} kcal</Text>
        </View>
      </View>
    </View>
  );
}

function MacroSummary() {
  return (
    <View className="mt-6 rounded-[36px] bg-white px-6 py-5 shadow-lg shadow-black/10">
      <View className="flex-row justify-between">
        <View className="w-[48%]">
          <Text className="text-3xl font-semibold text-[#0F3E36]">134g</Text>
          <Text className="mt-1 text-sm font-semibold text-[#0F3E36]">Total carbs</Text>
          <Text className="mt-1 text-xs text-[#6B7B76]">28%</Text>
          <View className="mt-3 h-1 rounded-full bg-[#F4D1D6]">
            <View className="h-1 rounded-full bg-[#E86B7B]" style={{ width: '28%' }} />
          </View>
        </View>
        <View className="w-[48%]">
          <Text className="text-3xl font-semibold text-[#0F3E36]">94g</Text>
          <Text className="mt-1 text-sm font-semibold text-[#0F3E36]">Total fat</Text>
          <Text className="mt-1 text-xs text-[#6B7B76]">81%</Text>
          <View className="mt-3 h-1 rounded-full bg-[#FAD9B3]">
            <View className="h-1 rounded-full bg-[#F39C4A]" style={{ width: '81%' }} />
          </View>
        </View>
      </View>
    </View>
  );
}

function MealsSection({
  meals,
}: {
  meals: typeof MEALS;
}) {
  return (
    <View className="mt-8">
      <View className="flex-row items-center justify-between">
        <Text className="text-xl font-semibold text-[#0F3E36]">Today’s Meal</Text>
        <Pressable className="h-10 px-4 rounded-full bg-[#0F3E36] items-center justify-center active:opacity-80">
          <Feather name="more-horizontal" size={20} color="#FFFFFF" />
        </Pressable>
      </View>

      <View className="mt-4">
        {meals.map((meal, index) => (
          <Pressable
            key={meal.id}
            className={`flex-row items-center gap-4 rounded-[28px] bg-white px-4 py-4 shadow-lg shadow-black/10 ${index !== 0 ? 'mt-4' : ''
              }`}
          >
            <Image source={{ uri: meal.image }} className="h-12 w-12 rounded-full" />
            <View className="flex-1">
              <Text className="text-lg font-semibold text-[#0F3E36]">{meal.title}</Text>
              <Text className="mt-1 text-sm text-[#6B7B76]">
                {meal.summary}
                <Text className="text-[#0F3E36]"> — {meal.calories}</Text>
              </Text>
            </View>
            <Feather name="chevron-right" size={22} color="#1CBF82" />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function WaterSection({ consumed, target }: { consumed: number; target: number }) {
  const cups = Array.from({ length: WATER_CUPS });
  const percent = Math.min(100, Math.round((consumed / target) * 100));

  return (
    <View className="mt-10">
      <View className="flex-row items-center justify-between">
        <Text className="text-xl font-semibold text-[#0F3E36]">Water</Text>
        <Pressable className="h-10 px-4 rounded-full bg-[#0F3E36] items-center justify-center active:opacity-80">
          <Feather name="more-horizontal" size={20} color="#FFFFFF" />
        </Pressable>
      </View>

      <View className="mt-4 rounded-[32px] bg-[#11B07D] px-5 py-6">
        <View className="flex-row items-center justify-between">
          <Text className="text-white font-semibold">{consumed} / {target}ml</Text>
          <Text className="text-white font-semibold">{percent}%</Text>
        </View>
        <View className="mt-6 flex-row items-center justify-between">
          {cups.map((_, index) => {
            const filled = index < WATER_CONSUMED;
            return (
              <View
                key={index}
                className={`h-14 w-9 rounded-2xl ${filled ? 'bg-white' : 'bg-white/20'} items-center justify-center`}
              >
                {filled ? (
                  <Entypo name="cup" size={24} color="#0F3E36" />
                ) : index === WATER_CONSUMED ? (
                  <Feather name="plus" size={20} color="#0F3E36" />
                ) : (
                  <Entypo name="cup" size={24} color="rgba(255,255,255,0.5)" />
                )}
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

function ActivitySection() {
  return (
    <View className="mt-10">
      <Text className="text-xl font-semibold text-[#0F3E36]">Activity</Text>
      <Pressable className="mt-4 flex-row items-center gap-4 rounded-[28px] bg-white px-4 py-4 shadow-lg shadow-black/10">
        <View className="h-12 w-12 items-center justify-center rounded-full bg-[#F1F5F4]">
          <MaterialCommunityIcons name="shoe-print" size={22} color={PRIMARY_DARK} />
        </View>
        <View className="flex-1">
          <Text className="text-lg font-semibold text-[#0F3E36]">Activities</Text>
          <Text className="mt-1 text-sm text-[#6B7B76]">
            2 Activities — <Text className="text-[#E57373] font-semibold">-545 kcal burnt</Text>
          </Text>
        </View>
        <Feather name="chevron-right" size={22} color="#1CBF82" />
      </Pressable>
    </View>
  );
}
