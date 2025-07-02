import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const router = useRouter();
  const cameraRef = useRef<any>(null);

  useEffect(() => {
    if (!permission) return;
    if (!permission.granted) {
      (async () => {
        const response = await requestPermission();
        if (!response.granted) {
          Alert.alert("Permission required", "Camera access is needed to use this feature.");
          router.replace("/");
        }
      })();
    }
  }, [permission]);

  const handleTakePhoto = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({ base64: true });
        if (photo && photo.base64) {
          await fetch("https://erp-segment-nancy-probability.trycloudflare.com/upload", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ image: photo.base64 }),
          });
          Alert.alert("Success", "Photo uploaded successfully!");
        } else {
          Alert.alert("Error", "Failed to capture photo.");
        }
      } catch (err) {
        Alert.alert("Error", "Failed to upload photo.");
        console.log(err)
      }
    }
  };

  if (!permission || !permission.granted) {
    // While requesting permission or if not granted, render nothing
    return <View className="flex-1 bg-black" />;
  }

  return (
    <View className="flex-1">
      <CameraView ref={cameraRef} style={{ flex: 1 }} />
      <View className="absolute top-10 left-4">
        <TouchableOpacity
          className="bg-white/80 px-4 py-2 rounded-lg"
          onPress={() => router.replace("/")}
        >
          <Text className="text-black font-semibold">Back</Text>
        </TouchableOpacity>
      </View>
      <View className="absolute bottom-10 left-0 right-0 items-center">
        <TouchableOpacity
          className="bg-white/80 px-8 py-4 rounded-full border-2 border-gray-400"
          onPress={handleTakePhoto}
        >
          <Text className="text-black font-bold text-lg">Take Photo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
} 