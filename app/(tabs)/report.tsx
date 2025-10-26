import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View } from 'react-native';

export default function ReportScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-neutral-950">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-lg font-semibold text-[#0F3E36] dark:text-white">
          Reports coming soon.
        </Text>
      </View>
    </SafeAreaView>
  );
}
