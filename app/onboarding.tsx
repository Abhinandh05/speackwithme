import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "@clerk/expo";
import { Feather } from "@expo/vector-icons";
import { images } from "../constants/images";

export default function OnboardingScreen() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    // If already authenticated, skip onboarding and go to home
    if (isLoaded && isSignedIn) {
      router.replace("/");
    }
  }, [isLoaded, isSignedIn, router]);

  const handleGetStarted = () => {
    router.push("/signup");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header */}
        <View className="flex-row items-center justify-center mt-4">
          <Image
            source={images.mascotLogo}
            className="w-10 h-10 mr-2"
            resizeMode="contain"
          />
          <Text className="text-h3 font-poppins-bold text-neutral-primary">
            SpeakWithMe
          </Text>
        </View>

        {/* Middle Section (Headline + Subtitle + Illustration) */}
        <View className="flex-1 justify-center py-6">
          {/* Text Content */}
          <View className="px-6 mb-8">
            <Text className="text-h1 font-poppins-bold text-neutral-primary leading-[40px]">
              Your AI language{"\n"}
              <Text className="text-primary">teacher.</Text>
            </Text>
            <Text className="text-body-lg font-poppins-regular text-neutral-secondary mt-3 leading-6">
              Real conversations, personalized{"\n"}
              lessons, anytime, anywhere.
            </Text>
          </View>

          {/* Illustration Container */}
          <View className="relative w-full h-[320px] items-center justify-center mt-4">
            {/* Mascot Image */}
            <Image
              source={images.mascotWelcome}
              className="w-[280px] h-[280px]"
              resizeMode="contain"
            />

            {/* Speech Bubble: "Hello!" (Left) */}
            <View
              style={[
                styles.bubbleShadow,
                { transform: [{ rotate: "-6deg" }] },
              ]}
              className="absolute left-4 top-[50px] bg-[#EAF3FF] px-4 py-2.5 rounded-2xl"
            >
              <Text className="font-poppins-semibold text-body-md text-neutral-primary">
                Hello!
              </Text>
              {/* Bubble Tail */}
              <View
                style={{ transform: [{ rotate: "45deg" }] }}
                className="absolute -bottom-1.5 right-5 w-3.5 h-3.5 bg-[#EAF3FF]"
              />
            </View>

            {/* Speech Bubble: "¡Hola!" (Top Right) */}
            <View
              style={[
                styles.bubbleShadow,
                { transform: [{ rotate: "8deg" }] },
              ]}
              className="absolute right-8 top-[10px] bg-[#F0EDFF] px-4 py-2.5 rounded-2xl"
            >
              <Text className="font-poppins-semibold text-body-md text-primary">
                ¡Hola!
              </Text>
              {/* Bubble Tail */}
              <View
                style={{ transform: [{ rotate: "45deg" }] }}
                className="absolute -bottom-1.5 left-5 w-3.5 h-3.5 bg-[#F0EDFF]"
              />
            </View>

            {/* Speech Bubble: "你好!" (Right) */}
            <View
              style={[
                styles.bubbleShadow,
                { transform: [{ rotate: "6deg" }] },
              ]}
              className="absolute right-4 top-[135px] bg-[#FFEFEF] px-4 py-2.5 rounded-2xl"
            >
              <Text className="font-poppins-semibold text-body-md text-error">
                你好!
              </Text>
              {/* Bubble Tail */}
              <View
                style={{ transform: [{ rotate: "45deg" }] }}
                className="absolute -bottom-1.5 left-5 w-3.5 h-3.5 bg-[#FFEFEF]"
              />
            </View>
          </View>
        </View>

        {/* Bottom Section (Get Started Button) */}
        <View className="px-6 pb-4">
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleGetStarted}
            style={styles.buttonShadow}
            className="w-full bg-primary py-4 px-6 rounded-2xl flex-row items-center justify-between"
          >
            <View className="w-6" />
            <Text className="text-white font-poppins-bold text-body-lg text-center flex-1">
              Get Started
            </Text>
            <Feather name="chevron-right" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingBottom: 20,
  },
  bubbleShadow: {
    shadowColor: "#0D132B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  buttonShadow: {
    shadowColor: "#6C4EF5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
});
