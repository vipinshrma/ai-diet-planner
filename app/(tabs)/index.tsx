import { StyleSheet, Text, View } from 'react-native';


import { SafeAreaView } from 'react-native-safe-area-context';

 function HomeScreen() {
  return (
   <SafeAreaView>
    <View className="p-4 bg-green-200">
      <Text className="text-red-800 font-semibold">
        NativeWind is working 🎉
      </Text>
    </View>
   </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});

export default HomeScreen;