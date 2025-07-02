import { Link } from "expo-router";
import * as Speech from "expo-speech";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const [inputText, setInputText] = useState("");

  const handleSpeak = () => {
    if (inputText.trim()) {
      Speech.speak(inputText);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-white px-4">
      <Text className="text-lg font-semibold text-gray-800 mb-6 text-center min-h-[28px]">
        {inputText}
      </Text>
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-2 w-full max-w-md mb-4 text-base"
        placeholder="Type text to read out loud..."
        value={inputText}
        onChangeText={setInputText}
        multiline
      />
      <TouchableOpacity
        className="bg-gray-400 px-6 py-3 rounded-lg mb-4"
        onPress={handleSpeak}
      >
        <Text className="text-white text-base font-semibold">read out loud</Text>
      </TouchableOpacity>
      <Link
        href="./camera"
        asChild
      >
        <TouchableOpacity className="bg-blue-500 px-6 py-3 rounded-lg">
          <Text className="text-white text-base font-semibold">Open Camera</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}