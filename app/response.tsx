import { useLocalSearchParams, useRouter } from "expo-router";
import * as Speech from "expo-speech";
import { useEffect } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function ResponseScreen() {
  const router = useRouter();
  const { message } = useLocalSearchParams();

  useEffect(() => {
    if (typeof message === 'string' && message.trim()) {
      Speech.speak(message);
    }
    // No cleanup needed for speech on unmount, as we want it to finish unless user presses back
  }, [message]);

  const handleBack = () => {
    Speech.stop();
    router.replace("/");
  };

  return (
    <View className="flex-1 bg-white px-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 32 }}>
        <Text className="text-xl font-bold text-green-800 mb-8 text-center">
          {typeof message === 'string' ? message : ''}
        </Text>
        <TouchableOpacity
          className="bg-gray-400 px-6 py-3 rounded-lg mb-8"
          onPress={handleBack}
        >
          <Text className="text-white text-base font-semibold">Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
} 