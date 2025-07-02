import { Image } from 'expo-image';
import { Platform, StyleSheet, TouchableOpacity, View, Alert } from 'react-native';
import { Camera as LucideCamera } from 'lucide-react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  function handleCheckPlant() {
    Alert.alert('Camera is enabled');
  }

  return (
    <View className="flex-1 bg-white justify-center items-center">
      <View className="w-full flex-col items-center justify-center">
        <TouchableOpacity
          className="bg-gray-300 w-72 h-24 rounded-3xl flex-row items-center justify-center gap-4 shadow-lg"
          onPress={handleCheckPlant}
          activeOpacity={0.85}
        >
          <LucideCamera color="black" size={40} />
          <ThemedText className="text-black text-2xl font-bold">Check Plant</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
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
