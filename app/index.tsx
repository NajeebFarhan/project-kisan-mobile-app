import { CameraView, useCameraPermissions } from "expo-camera";
import * as Speech from "expo-speech";
import { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

const testText = "This is a text to speech test";

export default function HomeScreen() {
  const [showCamera, setShowCamera] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const handleSpeak = () => {
    Speech.speak(testText);
  };

  const openCamera = async () => {
    if (!permission) return;
    if (!permission.granted) {
      const response = await requestPermission();
      if (!response.granted) {
        Alert.alert("Permission required", "Camera access is needed to use this feature.");
        return;
      }
    }
    setShowCamera(true);
  };

  if (showCamera) {
    return (
      <View className="flex-1">
        <CameraView style={{ flex: 1 }}>
          <View className="absolute top-10 left-4">
            <TouchableOpacity
              className="bg-white/80 px-4 py-2 rounded-lg"
              onPress={() => setShowCamera(false)}
            >
              <Text className="text-black font-semibold">Back</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-lg font-semibold text-gray-800 mb-6">{testText}</Text>
      <TouchableOpacity
        className="bg-gray-400 px-6 py-3 rounded-lg mb-4"
        onPress={handleSpeak}
      >
        <Text className="text-white text-base font-semibold">read out loud</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="bg-blue-500 px-6 py-3 rounded-lg"
        onPress={openCamera}
      >
        <Text className="text-white text-base font-semibold">Open Camera</Text>
      </TouchableOpacity>
    </View>
  );
}