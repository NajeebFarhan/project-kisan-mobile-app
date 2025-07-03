import { Link } from "expo-router";
import { Camera } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white px-4">
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl font-bold">Project Kisan</Text>
      </View>
      <View className="items-center justify-end pb-4">
        <Link href="./camera" asChild>
          <TouchableOpacity className="bg-[#7ead0e] p-4 rounded-full" style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Camera size={50} color="#fff" />
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
}