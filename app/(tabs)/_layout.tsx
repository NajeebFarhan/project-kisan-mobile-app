import { Tabs } from "expo-router";
import { Bot, Camera, Home } from "lucide-react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          const color = '#000';
          const size = 24;
          if (route.name === 'home') return <Home color={color} size={size} />;
          if (route.name === 'camera') return <Camera color={color} size={size} />;
          if (route.name === 'chatbot') return <Bot color={color} size={size} />;
          return null;
        },
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
        },
        headerShown: false,
      })}
    >
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="camera" options={{ title: "Camera" }} />
      <Tabs.Screen name="chatbot" options={{ title: "Chatbot" }} />
    </Tabs>
  );
}