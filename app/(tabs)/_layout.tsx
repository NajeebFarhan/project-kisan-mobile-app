import { Tabs } from "expo-router";
import { Bot, Camera, Home } from "lucide-react-native";
import { useEffect } from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TAB_ICONS = [Home, Camera, Bot];
// const TAB_KEYS = ["home", "camera", "chatbot"];
const TAB_COUNT = 3;
const TAB_BAR_HEIGHT = 70;
const OVERLAY_COLOR = 'rgba(0,0,0,0.08)';

function CustomTabBar({ state, descriptors, navigation }: { state: any, descriptors: any, navigation: any }) {
  const insets = useSafeAreaInsets();
  const width = Dimensions.get('window').width;
  const tabWidth = width / TAB_COUNT;
  const translateX = useSharedValue(state.index * tabWidth);

  useEffect(() => {
    translateX.value = withTiming(state.index * tabWidth, { duration: 250 });
  }, [state.index]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={[styles.tabBar, { height: TAB_BAR_HEIGHT + insets.bottom, paddingBottom: insets.bottom }]}> 
      <Animated.View
        style={[
          styles.overlay,
          { width: tabWidth, height: TAB_BAR_HEIGHT, backgroundColor: OVERLAY_COLOR },
          animatedStyle,
        ]}
      />
      {state.routes.map((route: any, idx: number) => {
        const isFocused = state.index === idx;
        const Icon = TAB_ICONS[idx];
        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={() => {
              if (!isFocused) navigation.navigate(route.name);
            }}
            style={styles.tabButton}
            activeOpacity={0.8}
          >
            <Icon color="#000" size={24} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 0,
    elevation: 8,
    position: 'relative',
    overflow: 'visible',
  },
  overlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    borderRadius: 16,
    zIndex: 0,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: TAB_BAR_HEIGHT,
    zIndex: 1,
  },
});

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="camera" options={{ title: "Camera" }} />
      <Tabs.Screen name="chatbot" options={{ title: "Chatbot" }} />
    </Tabs>
  );
}