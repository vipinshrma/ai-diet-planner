import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { LoadingScreen } from '@/components/ui/loading';
import { useAuth } from '@/providers/AuthProvider';

const ACTIVE_COLOR = '#2CD4A0';
const INACTIVE_COLOR = 'rgba(255,255,255,0.65)';

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="bg-transparent px-5"
      style={{
        paddingBottom: Math.max(insets.bottom - 10, 4),
        paddingTop: 4,
      }}
    >
      <View className="flex-row items-center rounded-[28px] bg-[#0F3E36] px-4 py-3 shadow-lg shadow-black/25" style={{ justifyContent: 'space-between' }}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const icon =
            typeof options.tabBarIcon === 'function'
              ? options.tabBarIcon({
                  color: isFocused ? ACTIVE_COLOR : INACTIVE_COLOR,
                  size: 26,
                  focused: isFocused,
                })
              : null;

          return (
            <View key={route.key} className="flex-1 items-center">
              <Pressable
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                // testID={options.tabBarTestID ?? ''}
                onPress={onPress}
                className="h-12 w-12 items-center justify-center rounded-full active:opacity-80"
              >
                {icon}
              </Pressable>
              <View
                className="mt-2 h-1 w-6 rounded-full"
                style={{ backgroundColor: isFocused ? ACTIVE_COLOR : 'transparent' }}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
}

const TabLayout = () => {
  const { session, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!session) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <IconSymbol size={size} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="weight"
        options={{
          title: 'Weight',
          tabBarIcon: ({ color, size }) => <IconSymbol size={size} name="scalemass.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          title: 'Report',
          tabBarIcon: ({ color, size }) => <IconSymbol size={size} name="chart.pie.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <IconSymbol size={size} name="person.crop.circle.fill" color={color} />,
        }}
      />
      
    </Tabs>
  );
};


export default TabLayout;
