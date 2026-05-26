import { useUser } from "@clerk/expo";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants/images";
import { languages } from "@/data/languages";
import { lessons, vocabulary } from "@/data/lessons";
import { units } from "@/data/units";
import { useLanguageStore } from "@/store/languageStore";

const DAILY_GOAL_XP = 20;
const PLACEHOLDER_AVATAR_URL =
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=faces";

function normalizePlanSubtitle(text: string) {
  return text.length > 26 ? `${text.slice(0, 23)}...` : text;
}

export default function HomeTabScreen() {
  const { user } = useUser();
  const selectedLanguageId = useLanguageStore((state) => state.selectedLanguageId);

  const selectedLanguage = useMemo(() => {
    if (!selectedLanguageId) {
      return null;
    }
    return languages.find((language) => language.id === selectedLanguageId) ?? null;
  }, [selectedLanguageId]);

  const lessonsForLanguage = useMemo(() => {
    if (!selectedLanguageId) {
      return [];
    }

    const unitIdsForLanguage = new Set(
      units
        .filter((unit) => unit.languageId === selectedLanguageId)
        .map((unit) => unit.id)
    );

    return lessons
      .filter((lesson) => unitIdsForLanguage.has(lesson.unitId))
      .sort((a, b) => a.order - b.order);
  }, [selectedLanguageId]);

  const currentLesson = lessonsForLanguage[0] ?? null;
  const nextChatLesson =
    lessonsForLanguage.find((lesson) => lesson.type === "chat" && lesson.id !== currentLesson?.id) ??
    lessonsForLanguage.find((lesson) => lesson.type === "chat") ??
    null;
  const lessonUnit = units.find((unit) => unit.id === currentLesson?.unitId) ?? null;

  const completedXp = Math.min((currentLesson?.xp ?? 10) + 5, DAILY_GOAL_XP);
  const goalProgressWidth = `${(completedXp / DAILY_GOAL_XP) * 100}%` as const;

  const vocabularyCount = vocabulary.filter(
    (word) => word.languageId === selectedLanguage?.id
  ).length;

  const userDisplayName =
    user?.firstName?.trim() ||
    user?.username?.trim() ||
    user?.primaryEmailAddress?.emailAddress?.split("@")[0] ||
    "Learner";

  const currentLessonTitle = currentLesson?.title ?? "Start your first lesson";

  const aiConversationSubtitle = nextChatLesson?.aiTeacherConfig?.name
    ? `Talk with ${nextChatLesson.aiTeacherConfig.name}`
    : "Talk about your day";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 6, paddingBottom: 140 }}
      >
        <View className="flex-row items-center justify-between py-1">
          <View className="flex-row items-center">
            <Image
              source={{ uri: selectedLanguage?.flag ?? "https://flagcdn.com/w320/es.png" }}
              className="h-7 w-7 rounded-full"
            />
            <Text className="ml-2 font-poppins-bold text-[17px] text-neutral-primary">
              {`Hola, ${userDisplayName}!`}
            </Text>
            <Text className="ml-1 text-[15px]">👋</Text>
          </View>

          <View className="flex-row items-center">
            <Text className="text-[18px]">🔥</Text>
            <Text className="ml-1 mr-3 font-poppins-bold text-[14px] text-[#4C557A]">12</Text>
            <Feather name="bell" size={20} color="#2F365A" />
          </View>
        </View>

        <View className="mt-5 rounded-[18px] bg-[#FBEFE3] px-4 pb-3.5 pt-3">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="font-poppins-bold text-[14px] text-[#1B1F3A]">Daily goal</Text>
              <View className="mt-1 flex-row items-baseline">
                <Text className="font-poppins-bold text-[26px] text-[#131A37]">{completedXp}</Text>
                <Text className="ml-1.5 font-poppins-semibold text-[14px] text-[#8390AF]">{`/ ${DAILY_GOAL_XP} XP`}</Text>
              </View>
            </View>
            <Image source={images.treasure} className="h-[80px] w-[80px]" resizeMode="contain" />
          </View>

          <View className="mt-2 h-[8px] w-full rounded-full bg-[#EBDDC7]">
            <View
              className="h-[8px] rounded-full bg-[#F09C3E]"
              style={{ width: goalProgressWidth }}
            />
          </View>
        </View>

        <View className="mt-4 overflow-hidden rounded-[18px] bg-[#5849F2]">
          <Image
            source={images.palace}
            className="absolute bottom-0 right-0 h-[140px] w-[150px]"
            resizeMode="cover"
          />
          <View className="px-4 pb-4 pt-4">
            <Text className="font-poppins-medium text-[13px] text-[#D8D4FF]">
              Continue learning
            </Text>
            <Text className="mt-1 font-poppins-bold text-[26px] leading-[30px] text-white">
              {selectedLanguage?.name ?? "Spanish"}
            </Text>
            <Text className="mt-0.5 font-poppins-medium text-[14px] text-[#D4D0FF]">
              {`A1 • Unit ${lessonUnit?.order ?? 1}`}
            </Text>
            <TouchableOpacity
              activeOpacity={0.9}
              className="mt-3 h-[42px] w-[104px] items-center justify-center rounded-[14px] bg-white"
            >
              <Text className="font-poppins-bold text-[14px] text-primary">Continue</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mt-6 flex-row items-center justify-between">
          <Text className="font-poppins-bold text-[19px] text-neutral-primary">{"Today's plan"}</Text>
          <TouchableOpacity activeOpacity={0.8}>
            <Text className="font-poppins-bold text-[15px] text-primary">View all</Text>
          </TouchableOpacity>
        </View>

        <View className="mt-3.5 gap-3.5">
          <View className="flex-row items-center">
            <View className="h-[40px] w-[40px] items-center justify-center rounded-[12px] bg-primary">
              <Feather name="book-open" size={18} color="#FFFFFF" />
            </View>
            <View className="ml-3 flex-1">
              <Text className="font-poppins-bold text-[17px] leading-[20px] text-neutral-primary">
                Lesson
              </Text>
              <Text className="font-poppins-medium text-[14px] leading-[18px] text-[#7A809C]">
                {normalizePlanSubtitle(currentLessonTitle)}
              </Text>
            </View>
            <View className="h-[22px] w-[22px] items-center justify-center rounded-full bg-primary">
              <Feather name="check" size={12} color="#FFFFFF" />
            </View>
          </View>

          <View className="flex-row items-center">
            <View className="h-[40px] w-[40px] items-center justify-center rounded-[12px] bg-primary">
              <MaterialCommunityIcons name="headphones" size={20} color="#FFFFFF" />
            </View>
            <View className="ml-3 flex-1">
              <Text className="font-poppins-bold text-[17px] leading-[20px] text-neutral-primary">
                AI Conversation
              </Text>
              <Text className="font-poppins-medium text-[14px] leading-[18px] text-[#7A809C]">
                {normalizePlanSubtitle(aiConversationSubtitle)}
              </Text>
            </View>
            <View className="h-[22px] w-[22px] rounded-full border-2 border-[#AAB1C7]" />
          </View>

          <View className="flex-row items-center">
            <View className="h-[40px] w-[40px] items-center justify-center rounded-[12px] bg-[#F36A6A]">
              <MaterialCommunityIcons name="chat-processing" size={18} color="#FFFFFF" />
            </View>
            <View className="ml-3 flex-1">
              <Text className="font-poppins-bold text-[17px] leading-[20px] text-neutral-primary">
                New words
              </Text>
              <Text className="font-poppins-medium text-[14px] leading-[18px] text-[#7A809C]">
                {`${Math.max(vocabularyCount, 10)} words`}
              </Text>
            </View>
            <View className="h-[22px] w-[22px] rounded-full border-2 border-[#AAB1C7]" />
          </View>
        </View>

        <View className="mt-6 flex-row items-center rounded-[18px] bg-[#EEF1E7] px-4 py-3.5">
          <View className="flex-1 pr-2">
            <Text className="font-poppins-medium text-[13px] text-[#6D6F76]">Next up</Text>
            <Text className="mt-0.5 font-poppins-bold text-[19px] leading-[22px] text-neutral-primary">
              AI Video Call
            </Text>
            <Text className="font-poppins-medium text-[14px] text-[#70758C]">
              Practice speaking
            </Text>
          </View>

          <View className="relative h-[68px] w-[100px]">
            <View className="absolute left-0 top-0 h-[68px] w-[68px] items-center justify-center rounded-full bg-[#DCE8C9]">
              <Image
                source={{ uri: PLACEHOLDER_AVATAR_URL }}
                className="h-[60px] w-[60px] rounded-full"
              />
            </View>
            <TouchableOpacity
              activeOpacity={0.85}
              className="absolute right-0 top-1/2 h-[40px] w-[40px] -translate-y-[20px] items-center justify-center rounded-full bg-[#6CC542]"
            >
              <Feather name="video" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
