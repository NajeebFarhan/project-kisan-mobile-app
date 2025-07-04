import { Tabs } from "expo-router";
import { Bot, Camera, Home } from "lucide-react-native";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white px-4">
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl font-bold">Project Kisan</Text>
      </View>
      <Tabs
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            if (route.name === "index") return <Home color={color} size={size} />;
            if (route.name === "camera") return <Camera color={color} size={size === 24 ? 40 : size} />;
            if (route.name === "chatbot") return <Bot color={color} size={size} />;
            return null;
          },
          tabBarShowLabel: false,
          tabBarStyle: {
            height: 70,
            paddingBottom: 10,
            paddingTop: 10,
          },
        })}
      >
        <Tabs.Screen name="index" options={{ title: "Home" }} />
        <Tabs.Screen name="camera" options={{ title: "Camera" }} />
        <Tabs.Screen name="chatbot" options={{ title: "Chatbot" }} />
      </Tabs>
    </SafeAreaView>
  );
} 