import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { useUser } from "@clerk/expo";
import { useLocalSearchParams, useRouter } from "expo-router";
import { usePostHog } from "posthog-react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
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
import { useStreamCall, type LessonContext } from "@/hooks/useStreamCall";
import {
  Activity,
  SpeakingPracticeActivity,
  VocabularyMatchActivity,
} from "@/types/learning";

function getTeacherBubble(activities: Activity[]) {
  const speaking = activities.find(
    (activity): activity is SpeakingPracticeActivity =>
      activity.type === "speaking_practice"
  );
  if (speaking) {
    return { primary: speaking.phrase, secondary: speaking.translation };
  }
  return { primary: "¡Muy bien!", secondary: "That was great! 👋" };
}

export default function LessonScreen() {
  const router = useRouter();
  const posthog = usePostHog();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useUser();

  const lesson = useMemo(
    () => allLessons.find((item) => item.id === id) ?? null,
    [id]
  );

  const language = useMemo(() => {
    if (!lesson) return null;
    const languageId = lesson.unitId.split("-")[0];
    return languages.find((item) => item.id === languageId) ?? null;
  }, [lesson]);

  const userId = user?.id ?? "guest";
  const userName = user?.fullName ?? user?.username ?? "Student";

  // Build a flat lesson context object to pass to the hook and eventually the agent
  const lessonContext = useMemo<LessonContext | undefined>(() => {
    if (!lesson || !language) return undefined;

    const vocabulary = lesson.activities
      .filter((a): a is VocabularyMatchActivity => a.type === "vocabulary_match")
      .flatMap((a) => a.pairs);

    const phrases = lesson.activities
      .filter((a): a is SpeakingPracticeActivity => a.type === "speaking_practice")
      .map((a) => ({ phrase: a.phrase, translation: a.translation }));

    return {
      title: lesson.title,
      languageName: language.name,
      goals: lesson.goals,
      vocabulary,
      phrases,
      systemPrompt: lesson.aiTeacherConfig?.systemPrompt,
      teacherName: lesson.aiTeacherConfig?.name,
      teacherPersona: lesson.aiTeacherConfig?.persona,
    };
  }, [lesson, language]);

  const [isPttPressed, setIsPttPressed] = useState(false);
  const pttActiveRef = useRef(false);

  const {
    callState,
    agentState,
    isMuted,
    errorMessage,
    joinCall,
    endCall,
    toggleMute,
    enableMic,
    disableMic,
  } = useStreamCall({
    lessonId: lesson?.id ?? "",
    languageId: language?.id ?? "",
    userId,
    userName,
    lessonContext,
  });

  useEffect(() => {
    if (!lesson) return;
    posthog.capture("lesson_opened", {
      lesson_id: lesson.id,
      lesson_title: lesson.title,
      lesson_type: lesson.type,
      language_id: language?.id ?? null,
    });
  }, [lesson, language, posthog]);

  const handleEndCall = async () => {
    posthog.capture("lesson_end_call_tapped", {
      lesson_id: lesson?.id ?? null,
      language_id: language?.id ?? null,
      call_state: callState,
    });
    if (callState === "joined" || callState === "connecting") {
      await endCall();
    }
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)/learn");
    }
  };

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
  const isCallActive = callState === "joined";
  const isLoading = callState === "loading" || callState === "connecting";
  const isEnded = callState === "ended";
  const isError = callState === "error";

  const agentStatusColor =
    agentState === "connected"
      ? "#21C16B"
      : agentState === "connecting"
        ? "#F4B740"
        : agentState === "failed"
          ? "#FF4D4F"
          : "#9AA0B6";

  const agentStatusLabel =
    agentState === "connected"
      ? "AI Teacher joined"
      : agentState === "connecting"
        ? "AI Teacher joining…"
        : agentState === "failed"
          ? "AI Teacher failed"
          : null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      {/* Header */}
      <View className="flex-row items-center px-5 pb-1 pt-1">
        <TouchableOpacity
          activeOpacity={0.7}
          hitSlop={10}
          onPress={handleEndCall}
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
              style={{
                backgroundColor: isCallActive
                  ? "#21C16B"
                  : isLoading
                    ? "#F4B740"
                    : "#9AA0B6",
              }}
            />
            <Text
              className="ml-1.5 font-poppins-medium text-[13px]"
              style={{
                color: isCallActive
                  ? "#21C16B"
                  : isLoading
                    ? "#F4B740"
                    : "#9AA0B6",
              }}
            >
              {isCallActive
                ? "Live"
                : isLoading
                  ? callState === "loading"
                    ? "Connecting…"
                    : "Joining…"
                  : isEnded
                    ? "Ended"
                    : isError
                      ? "Error"
                      : "Online"}
            </Text>
          </View>
        </View>

        {/* End Call button — top right */}
        {(isCallActive || isLoading) ? (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleEndCall}
            className="h-10 flex-row items-center rounded-full px-4"
            style={[{ backgroundColor: "#FF4D4F" }, styles.endCallPill]}
          >
            <FontAwesome5
              name="phone-alt"
              size={13}
              color="#FFFFFF"
              style={{ transform: [{ rotate: "135deg" }] }}
            />
            <Text className="ml-1.5 font-poppins-bold text-[13px] text-white">
              End
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Agent status banner — only shown when call is active */}
      {isCallActive && agentStatusLabel ? (
        <View
          className="mx-5 mb-2 flex-row items-center rounded-[12px] px-3 py-2"
          style={{ backgroundColor: `${agentStatusColor}18` }}
        >
          {agentState === "connecting" ? (
            <ActivityIndicator size={10} color={agentStatusColor} />
          ) : (
            <View
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: agentStatusColor }}
            />
          )}
          <Text
            className="ml-2 font-poppins-medium text-[12px]"
            style={{ color: agentStatusColor }}
          >
            {agentStatusLabel}
          </Text>
        </View>
      ) : null}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 14,
          paddingBottom: 140,
        }}
      >
        {/* Stage */}
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

          {/* User PiP — shows call state and user info */}
          <View
            className="absolute right-3 top-3 h-[120px] w-[92px] overflow-hidden rounded-[18px] border-2 border-white bg-[#3A7048]"
            style={styles.pipShadow}
          >
            <View className="absolute inset-0 items-center justify-center bg-[#3A7048]">
              <View className="h-10 w-10 items-center justify-center rounded-full bg-[#2F5E3A]">
                {isMuted ? (
                  <Feather name="mic-off" size={20} color="#FFB347" />
                ) : (
                  <Feather name="user" size={22} color="#D6E7C7" />
                )}
              </View>
              <Text
                className="mt-1.5 font-poppins-medium text-[10px] text-[#D6E7C7]"
                numberOfLines={1}
              >
                {userName}
              </Text>
            </View>

            {/* Live / connecting badge */}
            <View className="absolute bottom-1.5 right-1.5 flex-row items-center rounded-full bg-black/40 px-1.5 py-0.5">
              {isLoading ? (
                <ActivityIndicator size={8} color="#F4B740" />
              ) : (
                <View
                  className="h-1.5 w-1.5 rounded-full"
                  style={{
                    backgroundColor: isCallActive ? "#21C16B" : "#FF4D4F",
                  }}
                />
              )}
              <Text className="ml-1 font-poppins-bold text-[9px] text-white">
                {isLoading ? "…" : isCallActive ? "LIVE" : "OFF"}
              </Text>
            </View>

            {/* Muted overlay */}
            {isMuted && isCallActive ? (
              <View className="absolute inset-x-0 bottom-6 top-0 items-center justify-center">
                <View className="rounded-full bg-black/30 p-1.5">
                  <Feather name="mic-off" size={14} color="#FFB347" />
                </View>
              </View>
            ) : null}
          </View>

          {/* Loading / connecting overlay */}
          {isLoading ? (
            <View
              className="absolute inset-0 items-center justify-center rounded-[28px]"
              style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
            >
              <ActivityIndicator size="large" color="#FFFFFF" />
              <Text className="mt-3 font-poppins-bold text-[15px] text-white">
                {callState === "loading" ? "Preparing lesson…" : "Joining call…"}
              </Text>
            </View>
          ) : null}

          {/* Error overlay */}
          {isError ? (
            <View
              className="absolute inset-0 items-center justify-center rounded-[28px] px-8"
              style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
            >
              <View className="h-12 w-12 items-center justify-center rounded-full bg-[#FF4D4F]">
                <Feather name="wifi-off" size={22} color="#FFFFFF" />
              </View>
              <Text className="mt-3 text-center font-poppins-bold text-[15px] text-white">
                {"Couldn't connect"}
              </Text>
              <Text className="mt-1 text-center font-poppins-medium text-[13px] text-white/80">
                {errorMessage ?? "Please check your connection and try again."}
              </Text>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={joinCall}
                className="mt-4 rounded-full bg-white px-6 py-2.5"
              >
                <Text className="font-poppins-bold text-[14px] text-neutral-primary">
                  Retry
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {/* Ended overlay */}
          {isEnded ? (
            <View
              className="absolute inset-0 items-center justify-center rounded-[28px] px-8"
              style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
            >
              <View className="h-12 w-12 items-center justify-center rounded-full bg-white/20">
                <Feather name="check-circle" size={26} color="#FFFFFF" />
              </View>
              <Text className="mt-3 text-center font-poppins-bold text-[16px] text-white">
                Lesson ended
              </Text>
              <Text className="mt-1 text-center font-poppins-medium text-[13px] text-white/80">
                Great work! Come back to continue learning.
              </Text>
            </View>
          ) : null}

          {/* Teacher speech bubble */}
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

        {/* Controls */}
        <View className="mt-5 items-center">
          {callState === "idle" || isError ? (
            /* Start button */
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={joinCall}
              className="h-[72px] w-[72px] items-center justify-center rounded-full"
              style={[{ backgroundColor: "#21C16B" }, styles.controlShadow]}
            >
              <Feather name="phone" size={28} color="#FFFFFF" />
            </TouchableOpacity>
          ) : (
            /* Push-to-talk button */
            <View className="items-center">
              <Pressable
                onPressIn={async () => {
                  if (!isCallActive) return;
                  pttActiveRef.current = true;
                  setIsPttPressed(true);
                  await enableMic();
                }}
                onPressOut={async () => {
                  if (!pttActiveRef.current) return;
                  pttActiveRef.current = false;
                  setIsPttPressed(false);
                  await disableMic();
                }}
                style={({ pressed }) => [
                  {
                    height: 80,
                    width: 80,
                    borderRadius: 40,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: isPttPressed ? "#6C4EF5" : isCallActive ? "#FFFFFF" : "#F2F3F8",
                    opacity: isCallActive ? 1 : 0.5,
                    borderWidth: isPttPressed ? 0 : 3,
                    borderColor: isPttPressed ? "transparent" : "#E8E9F0",
                    transform: [{ scale: pressed ? 0.94 : 1 }],
                  },
                  styles.pttShadow,
                ]}
                disabled={!isCallActive}
              >
                <Feather
                  name={isPttPressed ? "mic" : "mic-off"}
                  size={28}
                  color={isPttPressed ? "#FFFFFF" : isCallActive ? "#0D132B" : "#9AA0B6"}
                />
              </Pressable>
              <Text
                className="mt-2.5 font-poppins-medium text-[13px]"
                style={{ color: isPttPressed ? "#6C4EF5" : "#9AA0B6" }}
              >
                {isPttPressed ? "Listening…" : isCallActive ? "Hold to speak" : "Connecting…"}
              </Text>
            </View>
          )}
        </View>

        {/* Feedback card */}
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

        {/* Lesson info */}
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

        {/* User + agent info card — shows when call is active */}
        {isCallActive || isLoading ? (
          <View
            className="mt-4 rounded-[18px] bg-[#F0EDFF] px-4 py-3"
            style={styles.userInfoCard}
          >
            {/* User row */}
            <View className="flex-row items-center">
              <View className="h-9 w-9 items-center justify-center rounded-full bg-primary/20">
                <Feather name="user" size={18} color="#6C4EF5" />
              </View>
              <View className="ml-3 flex-1">
                <Text className="font-poppins-bold text-[14px] text-neutral-primary">
                  {userName}
                </Text>
                <Text className="font-poppins-medium text-[12px] text-[#8A91A8]">
                  {isCallActive
                    ? isMuted
                      ? "Microphone off"
                      : "Microphone on"
                    : "Connecting…"}
                </Text>
              </View>
              <View
                className="h-2 w-2 rounded-full"
                style={{
                  backgroundColor: isCallActive ? "#21C16B" : "#F4B740",
                }}
              />
            </View>

            {/* Agent row — visible once call is joined */}
            {isCallActive ? (
              <View className="mt-2.5 flex-row items-center border-t border-[#E6E0FF] pt-2.5">
                <View className="h-9 w-9 items-center justify-center rounded-full bg-[#6C4EF5]/10">
                  <Feather name="cpu" size={18} color="#6C4EF5" />
                </View>
                <View className="ml-3 flex-1">
                  <Text className="font-poppins-bold text-[14px] text-neutral-primary">
                    {teacherName}
                  </Text>
                  <Text
                    className="font-poppins-medium text-[12px]"
                    style={{ color: agentStatusColor }}
                  >
                    {agentState === "connected"
                      ? "Speaking"
                      : agentState === "connecting"
                        ? "Joining…"
                        : agentState === "failed"
                          ? "Could not join"
                          : "Waiting"}
                  </Text>
                </View>
                {agentState === "connecting" ? (
                  <ActivityIndicator size={12} color={agentStatusColor} />
                ) : (
                  <View
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: agentStatusColor }}
                  />
                )}
              </View>
            ) : null}
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  endCallPill: {
    shadowColor: "#FF4D4F",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  pttShadow: {
    shadowColor: "#1A173D",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 14,
    elevation: 6,
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
  userInfoCard: {
    shadowColor: "#6C4EF5",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
});
