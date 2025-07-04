import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect, useRouter } from "expo-router";
import { Camera as CameraIcon, File } from "lucide-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Image, Modal, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const router = useRouter();
  const cameraRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [cameraKey, setCameraKey] = useState(0);
  const IMG_UPLOAD_URL: string = process.env.EXPO_PUBLIC_IMG_UPLOAD_URL || "";

  // Remount CameraView on tab focus to fix blank issue
  useFocusEffect(
    useCallback(() => {
      setCameraKey(prev => prev + 1);
    }, [])
  );

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
        setSelectedImage(result.assets[0].uri);
        setModalVisible(true);
      } else {
        setLoading(false);
      }
    } catch (err) {
      Alert.alert("Error", "Failed to pick photo.");
      setLoading(false);
    }
  };

  const handleConfirmUpload = async () => {
    if (!selectedImage) return;
    setModalVisible(false);
    setTimeout(async () => {
      setLoading(true);
      try {
        const compressed = await ImageManipulator.manipulateAsync(selectedImage, [], {
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
          setSelectedImage(null);
          router.replace({ pathname: "/response", params: { message: data.message } });
        } else {
          Alert.alert("Error", "Failed to upload photo.", [
            { text: "OK", onPress: () => setLoading(false) }
          ]);
        }
      } catch (err) {
        Alert.alert("Error", "Failed to upload photo.", [
          { text: "OK", onPress: () => setLoading(false) }
        ]);
      } finally {
        if (loading) setLoading(false);
      }
    }, 300);
  };

  const handleCancelModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
    setLoading(false);
  };

  if (!permission || !permission.granted) {
    return <View className="flex-1 bg-black" />;
  }

  // Layout: File button bottom left, Take Photo button perfectly centered
  return (
    <SafeAreaView className="flex-1 bg-black">
      <CameraView key={cameraKey} ref={cameraRef} style={{ flex: 1 }} />
      <View className="absolute bottom-10 left-0 right-0 flex-row items-end px-8" style={{ width: '100%' }}>
        {/* File button bottom left */}
        <View style={{ flex: 1, alignItems: 'flex-start' }}>
          <TouchableOpacity
            className="bg-white/60 px-6 py-3 rounded-lg border-2 border-gray-400"
            onPress={handlePickImage}
            disabled={loading}
          >
            <File size={28} color="#222" />
          </TouchableOpacity>
        </View>
        {/* Take Photo button perfectly centered */}
        <View style={{ flex: 1, alignItems: 'center' }}>
          <TouchableOpacity
            className="bg-white/60 p-5 rounded-full border-2 border-gray-400"
            onPress={handleTakePhoto}
            disabled={loading}
            style={{ alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}
          >
            <CameraIcon size={40} color="#222" />
          </TouchableOpacity>
        </View>
        {/* Spacer for right side */}
        <View style={{ flex: 1 }} />
      </View>
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCancelModal}
      >
        <View className="flex-1 bg-black/70 items-center justify-center px-6">
          <View className="bg-white rounded-2xl p-6 w-full max-w-md items-center">
            {selectedImage && (
              <Image source={{ uri: selectedImage }} style={{ width: 220, height: 220, borderRadius: 16, marginBottom: 20 }} resizeMode="cover" />
            )}
            <Text className="text-lg font-semibold mb-4 text-center">Send this image?</Text>
            <View className="flex-row w-full justify-between mt-2">
              <TouchableOpacity className="bg-gray-300 px-6 py-2 rounded-lg mr-2" onPress={handleCancelModal}>
                <Text className="text-gray-800 font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-green-600 px-6 py-2 rounded-lg ml-2" onPress={handleConfirmUpload}>
                <Text className="text-white font-semibold">Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {loading && (
        <View className="absolute inset-0 bg-black/60 items-center justify-center z-50">
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
    </SafeAreaView>
  );
}
