import { Feather, FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { usePostHog } from "posthog-react-native";
import React, { useMemo, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants/images";
import { languages } from "@/data/languages";
import { lessons as allLessons } from "@/data/lessons";
import { units } from "@/data/units";
import { useLanguageStore } from "@/store/languageStore";
import { Lesson } from "@/types/learning";

const TABS = [
  { id: "lessons", label: "Lessons" },
  { id: "practice", label: "Practice" },
] as const;

type TabId = (typeof TABS)[number]["id"];

type LessonStatus = "completed" | "in_progress" | "locked";

// Mocked progress: first two completed, third in-progress, rest locked.
// AGENTS.md: "no locking logic for now" — all lessons stay tappable.
function statusForLessonIndex(index: number): LessonStatus {
  if (index < 2) return "completed";
  if (index === 2) return "in_progress";
  return "locked";
}

// "Unit 1: Getting Started" -> "Getting Started"
function stripUnitPrefix(title: string) {
  const colonIndex = title.indexOf(":");
  return colonIndex === -1 ? title : title.slice(colonIndex + 1).trim();
}

export default function LearnTabScreen() {
  const router = useRouter();
  const posthog = usePostHog();
  const selectedLanguageId = useLanguageStore((state) => state.selectedLanguageId);
  const [activeTab, setActiveTab] = useState<TabId>("lessons");

  const selectedLanguage = useMemo(() => {
    if (!selectedLanguageId) return null;
    return languages.find((language) => language.id === selectedLanguageId) ?? null;
  }, [selectedLanguageId]);

  const currentUnit = useMemo(() => {
    if (!selectedLanguageId) return null;
    return (
      units
        .filter((unit) => unit.languageId === selectedLanguageId)
        .sort((a, b) => a.order - b.order)[0] ?? null
    );
  }, [selectedLanguageId]);

  const lessonsForUnit = useMemo<Lesson[]>(() => {
    if (!currentUnit) return [];
    return allLessons
      .filter((lesson) => lesson.unitId === currentUnit.id)
      .sort((a, b) => a.order - b.order);
  }, [currentUnit]);

  const completedCount = useMemo(
    () =>
      lessonsForUnit.filter((_, index) => statusForLessonIndex(index) === "completed").length,
    [lessonsForUnit]
  );

  if (!selectedLanguage || !currentUnit) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center font-poppins-bold text-h3 text-neutral-primary">
            Choose a language to start learning
          </Text>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => router.push("/language-selection")}
            className="btn-3d btn-3d-primary mt-6 w-full"
          >
            <Text className="font-poppins-bold text-[15px] text-white">Pick a language</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const unitTitle = stripUnitPrefix(currentUnit.title);
  const totalLessons = lessonsForUnit.length;

  const handleLessonPress = (lesson: Lesson, index: number) => {
    posthog.capture("learn_lesson_selected", {
      language: selectedLanguage.name,
      language_id: selectedLanguage.id,
      unit_id: currentUnit.id,
      lesson_id: lesson.id,
      lesson_title: lesson.title,
      lesson_status: statusForLessonIndex(index),
    });
    router.push({ pathname: "/lesson/[id]", params: { id: lesson.id } });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View className="flex-row items-center px-5 pb-1 pt-1">
        <TouchableOpacity
          activeOpacity={0.7}
          hitSlop={10}
          onPress={() =>
            router.canGoBack() ? router.back() : router.replace("/(tabs)/home")
          }
          className="h-8 w-8 items-center justify-center"
        >
          <Feather name="chevron-left" size={26} color="#0D132B" />
        </TouchableOpacity>
        <View className="ml-1 flex-1">
          <Text
            className="font-poppins-bold text-[22px] leading-[26px] text-neutral-primary"
            numberOfLines={1}
          >
            {unitTitle}
          </Text>
          <Text className="mt-0.5 font-poppins-medium text-[13px] text-[#8A91A8]">
            {`Unit ${currentUnit.order} • ${completedCount} / ${totalLessons} lessons`}
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 14, paddingBottom: 140 }}
      >
        <View
          className="relative overflow-hidden rounded-[24px] bg-[#CDE9F5]"
          style={{ height: 210 }}
        >
          <View className="absolute left-0 right-0 top-0 h-[120px] bg-[#CDE9F5]" />
          <View className="absolute bottom-0 left-0 right-0 h-[100px] bg-[#E3F1D3]" />
          <Image
            source={images.palace}
            className="absolute -right-4 bottom-1 h-[150px] w-[150px] opacity-90"
            resizeMode="contain"
          />
          <View className="absolute inset-x-0 bottom-0 items-center">
            <Image
              source={images.mascotWelcome}
              className="h-[180px] w-[180px]"
              resizeMode="contain"
            />
          </View>
          <TouchableOpacity
            activeOpacity={0.85}
            hitSlop={8}
            className="absolute right-3 top-3 h-8 w-7 items-center justify-center"
          >
            <FontAwesome name="bookmark" size={26} color="#F4B740" />
          </TouchableOpacity>
        </View>

        <View
          className="mt-5 flex-row rounded-[18px] bg-[#F2F3F8] p-1.5"
          style={styles.tabContainer}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                activeOpacity={0.85}
                onPress={() => setActiveTab(tab.id)}
                className={`flex-1 items-center justify-center rounded-[14px] py-3 ${
                  isActive ? "bg-white" : ""
                }`}
                style={isActive ? styles.activeTabShadow : undefined}
              >
                <Text
                  className={`font-poppins-bold text-[15px] ${
                    isActive ? "text-primary" : "text-[#8A91A8]"
                  }`}
                >
                  {tab.label}
                </Text>
                {isActive ? (
                  <View className="mt-1.5 h-[3px] w-7 rounded-full bg-primary" />
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>

        {activeTab === "lessons" ? (
          <View className="mt-5">
            {lessonsForUnit.map((lesson, index) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                index={index}
                status={statusForLessonIndex(index)}
                onPress={() => handleLessonPress(lesson, index)}
              />
            ))}
          </View>
        ) : (
          <PracticePlaceholder languageName={selectedLanguage.name} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

type LessonCardProps = {
  lesson: Lesson;
  index: number;
  status: LessonStatus;
  onPress: () => void;
};

function LessonCard({ lesson, index, status, onPress }: LessonCardProps) {
  const isInProgress = status === "in_progress";
  const isCompleted = status === "completed";
  const isLocked = status === "locked";

  const containerClasses = isInProgress
    ? "border-[1.5px] border-primary bg-[#F6F3FF]"
    : "border border-[#EDEFF5] bg-white";

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      className={`mt-3 flex-row items-center rounded-[16px] px-4 py-3.5 ${containerClasses}`}
    >
      <View className="flex-1 pr-3">
        <Text
          className={`font-poppins-medium text-[13px] ${
            isInProgress ? "text-primary" : "text-[#8A91A8]"
          }`}
        >
          {`Lesson ${index + 1}`}
        </Text>
        <Text className="mt-0.5 font-poppins-bold text-[16px] leading-[20px] text-neutral-primary">
          {lesson.title}
        </Text>
        {isInProgress ? (
          <Text className="mt-1 font-poppins-medium text-[13px] text-primary">In progress</Text>
        ) : isLocked ? (
          <Text className="mt-1 font-poppins-medium text-[13px] text-[#8A91A8]">
            {`0 / ${Math.max(lesson.activities.length, 6)} lessons`}
          </Text>
        ) : null}
      </View>

      {isCompleted ? (
        <View
          className="h-7 w-7 items-center justify-center rounded-full"
          style={{ backgroundColor: "#21C16B" }}
        >
          <Feather name="check" size={16} color="#FFFFFF" />
        </View>
      ) : isInProgress ? (
        <Image source={images.palace} className="h-12 w-12" resizeMode="contain" />
      ) : (
        <Feather name="lock" size={20} color="#9AA0B6" />
      )}
    </TouchableOpacity>
  );
}

function PracticePlaceholder({ languageName }: { languageName: string }) {
  return (
    <View className="mt-12 items-center justify-center px-6">
      <View
        className="h-16 w-16 items-center justify-center rounded-full"
        style={{ backgroundColor: "#EFEAFF" }}
      >
        <Feather name="repeat" size={26} color="#6C4EF5" />
      </View>
      <Text className="mt-4 font-poppins-bold text-[18px] text-neutral-primary">
        Practice coming soon
      </Text>
      <Text className="mt-2 text-center font-poppins-medium text-[14px] text-[#8A91A8]">
        {`We're preparing review activities to help you strengthen your ${languageName}.`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    shadowColor: "#1A173D",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  activeTabShadow: {
    shadowColor: "#1A173D",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
});
