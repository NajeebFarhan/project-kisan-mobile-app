import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from 'expo-image-manipulator';
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from "react-native";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const router = useRouter();
  const cameraRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const IMG_UPLOAD_URL: string = process.env.EXPO_PUBLIC_IMG_UPLOAD_URL || "";

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
    if (cameraRef.current && !loading) {
      setLoading(true);
      try {
        const photo = await cameraRef.current.takePictureAsync({
          base64: false,
          quality: 0.3,
          skipProcessing: true,
        });

        const compressed = await ImageManipulator.manipulateAsync(photo.uri, [], {
          compress: 0.4,
          format: ImageManipulator.SaveFormat.JPEG,
        });

        const formData = new FormData();
        formData.append('image', {
          uri: compressed.uri,
          name: 'photo.jpg',
          type: 'image/jpeg',
        } as any);

        if (photo) {

          // const response = 
	        await fetch(IMG_UPLOAD_URL + "/upload", {
            method: "POST",
            headers: { 'Content-Type': 'multipart/form-data' },
            // headers: { 'Content-Type': 'application/json' },
            body: formData,
            // body: JSON.stringify({ image: photo.base64 }),
          });

          // const data = await response.json();
          Alert.alert("Success", "Photo uploaded successfully!");

        } else {
          Alert.alert("Error", "Failed to capture photo.");
        }
      } catch (err) {
        Alert.alert("Error", "Failed to upload photo.");
        console.log(err)
      } finally {
        setLoading(false);
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
          disabled={loading}
        >
          <Text className="text-black font-bold text-lg">Take Photo</Text>
        </TouchableOpacity>
      </View>
      {loading && (
        <View className="absolute inset-0 bg-black/60 items-center justify-center z-50">
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
    </View>
  );
} 
