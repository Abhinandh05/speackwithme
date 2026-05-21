import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { languages } from "../data/languages";
import { images } from "../constants/images";

// Learner count mapping to match the design screenshot
const learnerCounts: Record<string, string> = {
  es: "28.4M learners",
  fr: "19.4M learners",
  ja: "12.7M learners",
  ko: "9.3M learners",
  de: "8.1M learners",
  zh: "7.4M learners",
};

export default function LanguageSelectionScreen() {
  const router = useRouter();
  const [selectedLanguageId, setSelectedLanguageId] = useState<string | null>("es"); // Default to Spanish as selected in design
  const [searchQuery, setSearchQuery] = useState("");

  const handleConfirm = () => {
    if (selectedLanguageId) {
      // Navigate back or to home screen (will store in Zustand store in next task)
      router.replace("/");
    }
  };

  // Filter languages based on search query
  const filteredLanguages = languages.filter((lang) =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header Bar */}
      <View className="flex-row items-center justify-between px-6 py-4">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full bg-white border border-neutral-border"
        >
          <Feather name="chevron-left" size={24} color="#0D132B" />
        </TouchableOpacity>
        <Text className="text-h3 font-poppins-bold text-neutral-primary text-center">
          Choose a language
        </Text>
        <View className="w-10" />
      </View>

      {/* Search Bar */}
      <View className="px-6 mb-6">
        <View className="flex-row items-center bg-neutral-surface border border-neutral-border px-4 py-3 rounded-full">
          <Feather name="search" size={20} color="#6B7280" style={{ marginRight: 8 }} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search languages"
            placeholderTextColor="#6B7280"
            className="flex-1 font-poppins-regular text-body-md text-neutral-primary py-0.5"
            style={{ padding: 0 }}
          />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1">
          {/* Section Header */}
          <Text className="px-6 text-body-lg font-poppins-bold text-neutral-primary mb-4">
            Popular
          </Text>

          {/* Language Selection Cards */}
          <View className="px-6">
            {filteredLanguages.map((lang) => {
              const isSelected = selectedLanguageId === lang.id;
              const learnersStr = learnerCounts[lang.code] || "5.0M learners";

              return (
                <TouchableOpacity
                  key={lang.id}
                  activeOpacity={0.8}
                  onPress={() => setSelectedLanguageId(lang.id)}
                  className={`flex-row items-center justify-between p-4 rounded-2xl border-2 mb-4 bg-white ${
                    isSelected
                      ? "border-primary bg-[#F0EDFF]/30"
                      : "border-neutral-border/50 bg-white"
                  }`}
                  style={styles.cardShadow}
                >
                  <View className="flex-row items-center flex-1">
                    {/* Circular Flag Image */}
                    <Image
                      source={{ uri: lang.flag }}
                      className="w-12 h-12 rounded-full mr-4 border border-neutral-border/20"
                      resizeMode="cover"
                    />
                    <View className="flex-1 pr-4">
                      <Text className="text-body-lg font-poppins-bold text-neutral-primary leading-tight">
                        {lang.name}
                      </Text>
                      <Text className="text-body-sm font-poppins-medium text-neutral-secondary mt-0.5">
                        {learnersStr}
                      </Text>
                    </View>
                  </View>

                  {/* Indicator Icon */}
                  {isSelected ? (
                    <View className="w-6 h-6 rounded-full items-center justify-center bg-primary">
                      <Feather name="check" size={14} color="#FFFFFF" />
                    </View>
                  ) : (
                    <Feather name="chevron-right" size={20} color="#9CA3AF" />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Tactile 3D Confirm Button (replaces 'See all languages') */}
          <TouchableOpacity
            activeOpacity={selectedLanguageId ? 0.85 : 1}
            disabled={!selectedLanguageId}
            onPress={handleConfirm}
            className={`btn-3d mx-6 mt-4 mb-6 ${
              selectedLanguageId
                ? "btn-3d-primary"
                : "bg-neutral-surface border-[#D1D5DB] border-b-[4px]"
            }`}
          >
            <Text
              className={`font-poppins-bold text-body-lg text-center ${
                selectedLanguageId ? "text-white" : "text-neutral-secondary"
              }`}
            >
              Confirm
            </Text>
          </TouchableOpacity>
        </View>

        {/* Earth Illustration Footer */}
        <View className="w-full items-center justify-end">
          <Image
            source={images.earth}
            style={{ width: "100%", height: 180 }}
            resizeMode="cover"
          />
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
  },
  cardShadow: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
});
