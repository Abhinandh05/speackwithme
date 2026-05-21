import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-h1 font-poppins-bold text-neutral-primary text-center">
          SpeakWithMe
        </Text>
        <Text className="text-body-md font-poppins-regular text-neutral-secondary text-center mt-2 mb-8">
          AI-powered language learning companion
        </Text>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push("/onboarding")}
          style={styles.button}
          className="bg-primary py-4 px-8 rounded-xl"
        >
          <Text className="text-white font-poppins-bold text-body-lg">
            Open Onboarding Screen
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  button: {
    shadowColor: "#6C4EF5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
});

