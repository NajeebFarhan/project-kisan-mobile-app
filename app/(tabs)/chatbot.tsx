import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChatbotScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white px-4">
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl font-bold">Chatbot (Coming Soon)</Text>
      </View>
    </SafeAreaView>
  );
} 