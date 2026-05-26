import { Feather, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { usePostHog } from "posthog-react-native";
import React, { useEffect, useMemo } from "react";
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
import { Activity, SpeakingPracticeActivity } from "@/types/learning";

// Pulls the first speaking-practice phrase if the lesson has one,
// otherwise falls back to a friendly encouragement bubble.
function getTeacherBubble(activities: Activity[]) {
  const speaking = activities.find(
    (activity): activity is SpeakingPracticeActivity =>
      activity.type === "speaking_practice"
  );

  if (speaking) {
    return {
      primary: speaking.phrase,
      secondary: speaking.translation,
    };
  }

  return {
    primary: "¡Muy bien!",
    secondary: "That was great! 👋",
  };
}

export default function LessonScreen() {
  const router = useRouter();
  const posthog = usePostHog();
  const { id } = useLocalSearchParams<{ id: string }>();

  const lesson = useMemo(
    () => allLessons.find((item) => item.id === id) ?? null,
    [id]
  );

  const language = useMemo(() => {
    if (!lesson) return null;
    const languageId = lesson.unitId.split("-")[0];
    return languages.find((item) => item.id === languageId) ?? null;
  }, [lesson]);

  useEffect(() => {
    if (!lesson) return;
    posthog.capture("lesson_opened", {
      lesson_id: lesson.id,
      lesson_title: lesson.title,
      lesson_type: lesson.type,
      language_id: language?.id ?? null,
    });
  }, [lesson, language, posthog]);

  if (!lesson) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center font-poppins-bold text-h3 text-neutral-primary">
            Lesson not found
          </Text>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() =>
              router.canGoBack() ? router.back() : router.replace("/(tabs)/learn")
            }
            className="btn-3d btn-3d-primary mt-6 w-full"
          >
            <Text className="font-poppins-bold text-[15px] text-white">Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const teacherName = lesson.aiTeacherConfig?.name ?? "AI Teacher";
  const bubble = getTeacherBubble(lesson.activities);
  const primaryGoal = lesson.goals[0] ?? lesson.description;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View className="flex-row items-center px-5 pb-1 pt-1">
        <TouchableOpacity
          activeOpacity={0.7}
          hitSlop={10}
          onPress={() =>
            router.canGoBack() ? router.back() : router.replace("/(tabs)/learn")
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
            {teacherName}
          </Text>
          <View className="mt-0.5 flex-row items-center">
            <View
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: "#21C16B" }}
            />
            <Text className="ml-1.5 font-poppins-medium text-[13px] text-[#21C16B]">
              Online
            </Text>
          </View>
        </View>

        <View className="flex-row items-center gap-2.5">
          <View
            className="h-10 flex-row items-center rounded-full bg-[#F2F3F8] px-3"
            style={styles.headerPill}
          >
            <Feather name="video" size={16} color="#0D132B" />
            <Text className="ml-1.5 font-poppins-bold text-[13px] text-neutral-primary">
              12
            </Text>
          </View>
          <View
            className="h-10 w-10 items-center justify-center rounded-full bg-[#F2F3F8]"
            style={styles.headerPill}
          >
            <Feather name="bell" size={18} color="#0D132B" />
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 14,
          paddingBottom: 140,
        }}
      >
        <View
          className="relative overflow-hidden rounded-[28px] bg-[#E9D4B8]"
          style={[{ height: 420 }, styles.stageShadow]}
        >
          <View className="absolute left-0 right-0 top-0 h-[55%] bg-[#EBD9C0]" />
          <View className="absolute bottom-0 left-0 right-0 h-[45%] bg-[#D9C29A]" />

          <View className="absolute -left-6 top-10 h-24 w-24 rounded-[14px] bg-[#F4E6CB] opacity-70" />
          <View className="absolute right-10 top-6 h-16 w-12 rounded-[10px] bg-[#C9B084] opacity-80" />
          <View className="absolute right-6 top-28 h-20 w-16 rounded-[10px] bg-[#A8C58A] opacity-90" />
          <View className="absolute right-3 top-44 h-14 w-14 rounded-[8px] bg-[#B7D29B] opacity-85" />

          <View className="absolute inset-x-0 bottom-0 items-center">
            <Image
              source={images.mascotWelcome}
              className="h-[330px] w-[330px]"
              resizeMode="contain"
            />
          </View>

          <View
            className="absolute right-3 top-3 h-[120px] w-[92px] overflow-hidden rounded-[18px] border-2 border-white bg-[#3A7048]"
            style={styles.pipShadow}
          >
            <View className="absolute inset-0 items-center justify-center bg-[#3A7048]">
              <View className="h-10 w-10 items-center justify-center rounded-full bg-[#2F5E3A]">
                <Feather name="user" size={22} color="#D6E7C7" />
              </View>
              <Text className="mt-1.5 font-poppins-medium text-[10px] text-[#D6E7C7]">
                You
              </Text>
            </View>
            <View className="absolute bottom-1.5 right-1.5 flex-row items-center rounded-full bg-black/40 px-1.5 py-0.5">
              <View className="h-1.5 w-1.5 rounded-full bg-[#FF4D4F]" />
              <Text className="ml-1 font-poppins-bold text-[9px] text-white">LIVE</Text>
            </View>
          </View>

          <View
            className="absolute bottom-5 left-5 right-5 rounded-[20px] bg-white px-4 py-3"
            style={styles.bubbleShadow}
          >
            <View className="flex-row items-center">
              <View className="flex-1 pr-3">
                <Text className="font-poppins-bold text-[18px] leading-[22px] text-neutral-primary">
                  {bubble.primary}
                </Text>
                <Text className="mt-0.5 font-poppins-medium text-[15px] leading-[20px] text-neutral-primary">
                  {bubble.secondary}
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                hitSlop={8}
                className="h-9 w-9 items-center justify-center"
              >
                <Feather name="volume-2" size={22} color="#6C4EF5" />
              </TouchableOpacity>
            </View>
            <View
              className="absolute -bottom-2 left-10 h-4 w-4 rotate-45 bg-white"
              style={styles.bubbleTail}
            />
          </View>
        </View>

        <View className="mt-5 flex-row items-center justify-between px-1">
          <ControlButton
            label="Camera"
            icon={<Feather name="video" size={22} color="#0D132B" />}
          />
          <ControlButton
            label="Mic"
            icon={<Feather name="mic" size={22} color="#0D132B" />}
          />
          <ControlButton
            label="Subtitles"
            icon={
              <MaterialCommunityIcons name="translate" size={22} color="#0D132B" />
            }
          />
          <ControlButton
            label="End Call"
            tone="danger"
            icon={
              <FontAwesome5 name="phone-alt" size={18} color="#FFFFFF" style={{ transform: [{ rotate: "135deg" }] }} />
            }
            onPress={() => {
              posthog.capture("lesson_end_call_tapped", {
                lesson_id: lesson.id,
                language_id: language?.id ?? null,
              });
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace("/(tabs)/learn");
              }
            }}
          />
        </View>

        <View
          className="mt-6 flex-row rounded-[18px] bg-white p-4"
          style={styles.feedbackCard}
        >
          <FeedbackColumn label="Speaking" value="Excellent" tone="success" />
          <View className="mx-1 w-px self-stretch bg-[#EDEFF5]" />
          <FeedbackColumn label="Pronunciation" value="Great" tone="info" />
          <View className="mx-1 w-px self-stretch bg-[#EDEFF5]" />
          <FeedbackColumn label="Grammar" value="Good" tone="info" />
        </View>

        <View className="mt-5 rounded-[18px] bg-[#F6F7FB] px-4 py-3.5">
          <Text className="font-poppins-medium text-[12px] uppercase tracking-[1px] text-[#8A91A8]">
            {`${language?.name ?? "Language"} • Lesson ${lesson.order}`}
          </Text>
          <Text className="mt-1 font-poppins-bold text-[17px] leading-[22px] text-neutral-primary">
            {lesson.title}
          </Text>
          <Text className="mt-1 font-poppins-medium text-[13px] leading-[18px] text-[#6B7280]">
            {`Goal: ${primaryGoal}`}
          </Text>
          {lesson.aiTeacherConfig?.persona ? (
            <Text className="mt-2 font-poppins-medium text-[12px] leading-[16px] text-[#8A91A8]">
              {`Teacher: ${lesson.aiTeacherConfig.persona}`}
            </Text>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type ControlButtonProps = {
  label: string;
  icon: React.ReactNode;
  tone?: "default" | "danger";
  onPress?: () => void;
};

function ControlButton({ label, icon, tone = "default", onPress }: ControlButtonProps) {
  const isDanger = tone === "danger";

  return (
    <View className="items-center" style={{ width: 70 }}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        className="h-[58px] w-[58px] items-center justify-center rounded-full"
        style={[
          isDanger
            ? { backgroundColor: "#FF4D4F" }
            : { backgroundColor: "#FFFFFF" },
          styles.controlShadow,
        ]}
      >
        {icon}
      </TouchableOpacity>
      <Text className="mt-2 font-poppins-medium text-[13px] text-neutral-primary">
        {label}
      </Text>
    </View>
  );
}

type FeedbackColumnProps = {
  label: string;
  value: string;
  tone: "success" | "info";
};

function FeedbackColumn({ label, value, tone }: FeedbackColumnProps) {
  const valueColor = tone === "success" ? "#21C16B" : "#4D8BFF";

  return (
    <View className="flex-1 items-center">
      <Text className="font-poppins-bold text-[14px] text-neutral-primary">
        {label}
      </Text>
      <Text
        className="mt-2 font-poppins-bold text-[15px]"
        style={{ color: valueColor }}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerPill: {
    shadowColor: "#1A173D",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  stageShadow: {
    shadowColor: "#1A173D",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 6,
  },
  pipShadow: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 5,
  },
  bubbleShadow: {
    shadowColor: "#1A173D",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  bubbleTail: {
    shadowColor: "#1A173D",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  controlShadow: {
    shadowColor: "#1A173D",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  feedbackCard: {
    shadowColor: "#1A173D",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
});
