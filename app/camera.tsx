import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
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
          const response = await fetch(IMG_UPLOAD_URL + "/upload", {
            method: "POST",
            headers: { 'Content-Type': 'multipart/form-data' },
            body: formData,
          });
          const data = await response.json();
          if (response.ok && data && data.message) {
            router.replace({ pathname: "/response", params: { message: data.message } });
          } else {
            Alert.alert("Error", "Failed to upload photo.");
          }
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

  const handlePickImage = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Permission to access files is required!');
        setLoading(false);
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.4,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const compressed = await ImageManipulator.manipulateAsync(asset.uri, [], {
          compress: 0.4,
          format: ImageManipulator.SaveFormat.JPEG,
        });
        const formData = new FormData();
        formData.append('image', {
          uri: compressed.uri,
          name: 'photo.jpg',
          type: 'image/jpeg',
        } as any);
        const response = await fetch(IMG_UPLOAD_URL + "/upload", {
          method: "POST",
          headers: { 'Content-Type': 'multipart/form-data' },
          body: formData,
        });
        const data = await response.json();
        if (response.ok && data && data.message) {
          router.replace({ pathname: "/response", params: { message: data.message } });
        } else {
          Alert.alert("Error", "Failed to upload photo.");
        }
      } else {
        // User cancelled or no asset
        setLoading(false);
      }
    } catch (err) {
      Alert.alert("Error", "Failed to pick or upload photo.");
      setLoading(false);
    } finally {
      setLoading(false);
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
      <View className="absolute bottom-10 left-0 right-0 flex-row items-center justify-between px-8">
        <TouchableOpacity
          className="bg-white/80 px-6 py-3 rounded-lg border-2 border-gray-400"
          onPress={handlePickImage}
          disabled={loading}
        >
          <Text className="text-black text-base font-semibold">Files</Text>
        </TouchableOpacity>
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
