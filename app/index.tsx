import { useAuth } from "@clerk/expo";
import { Redirect } from "expo-router";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import { useLanguageStore } from "@/store/languageStore";

export default function IndexScreen() {
  const { isLoaded, isSignedIn } = useAuth();
  const selectedLanguageId = useLanguageStore((state) => state.selectedLanguageId);
  const hasHydrated = useLanguageStore((state) => state.hasHydrated);

  if (!isLoaded || (isSignedIn && !hasHydrated)) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#6C4EF5" />
      </View>
    );
  }

  if (!isSignedIn) {
    return <Redirect href="/onboarding" />;
  }

  if (!selectedLanguageId) {
    return <Redirect href="/language-selection" />;
  }

  return <Redirect href="/(tabs)/home" />;
}
