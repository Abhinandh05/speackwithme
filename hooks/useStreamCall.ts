import { useCallback, useEffect, useRef, useState } from "react";
// `import type` is stripped at compile time — no runtime native module check
import type {
  Call,
  StreamVideoClient,
} from "@stream-io/video-react-native-sdk";
import Constants from "expo-constants";
import type { Subscription } from "rxjs";

// Expo Go does not ship WebRTC native modules — detect early to avoid crashes
const isExpoGo =
  Constants.executionEnvironment === "storeClient";

export type StreamCallState =
  | "idle"
  | "loading"
  | "connecting"
  | "joined"
  | "ended"
  | "error";

export type AgentState = "idle" | "connecting" | "connected" | "failed";

export interface LessonContext {
  title: string;
  languageName: string;
  goals: string[];
  vocabulary: Array<{ word: string; translation: string }>;
  phrases: Array<{ phrase: string; translation: string }>;
  systemPrompt?: string;
  teacherName?: string;
  teacherPersona?: string;
}

interface UseStreamCallOptions {
  lessonId: string;
  languageId: string;
  userId: string;
  userName: string;
  lessonContext?: LessonContext;
}

interface UseStreamCallReturn {
  callState: StreamCallState;
  agentState: AgentState;
  isMuted: boolean;
  errorMessage: string | null;
  joinCall: () => Promise<void>;
  endCall: () => Promise<void>;
  toggleMute: () => Promise<void>;
  enableMic: () => Promise<void>;
  disableMic: () => Promise<void>;
}

export function useStreamCall({
  lessonId,
  languageId,
  userId,
  userName,
  lessonContext,
}: UseStreamCallOptions): UseStreamCallReturn {
  const [callState, setCallState] = useState<StreamCallState>("idle");
  const [agentState, setAgentState] = useState<AgentState>("idle");
  const [isMuted, setIsMuted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const clientRef = useRef<StreamVideoClient | null>(null);
  const callRef = useRef<Call | null>(null);
  const subscriptionRef = useRef<Subscription | null>(null);
  // Stored so we can DELETE the session on cleanup
  const agentSessionIdRef = useRef<string | null>(null);
  const agentCallIdRef = useRef<string | null>(null);

  // ---------------------------------------------------------------------------
  // Agent lifecycle helpers
  // ---------------------------------------------------------------------------

  const startAgent = useCallback(
    async (callType: string, callId: string) => {
      setAgentState("connecting");
      try {
        const response = await fetch("/api/agent-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ callType, callId, lessonContext }),
        });

        if (!response.ok) {
          console.warn("Agent session start returned non-OK:", response.status);
          setAgentState("failed");
          return;
        }

        const data = (await response.json()) as { sessionId?: string };
        agentSessionIdRef.current = data.sessionId ?? null;
        agentCallIdRef.current = callId;
        setAgentState("connected");
      } catch (err) {
        console.warn("Agent session start error:", err);
        setAgentState("failed");
      }
    },
    [lessonContext]
  );

  const stopAgent = useCallback(async () => {
    const sessionId = agentSessionIdRef.current;
    const callId = agentCallIdRef.current;
    if (!sessionId || !callId) return;

    agentSessionIdRef.current = null;
    agentCallIdRef.current = null;
    setAgentState("idle");

    try {
      await fetch(
        `/api/agent-session?callId=${encodeURIComponent(callId)}&sessionId=${encodeURIComponent(sessionId)}`,
        { method: "DELETE" }
      );
    } catch (err) {
      console.warn("Agent session stop error:", err);
    }
  }, []);

  // ---------------------------------------------------------------------------
  // Call lifecycle
  // ---------------------------------------------------------------------------

  const joinCall = useCallback(async () => {
    // WebRTC native modules are not bundled in Expo Go — fail fast with a clear message
    if (isExpoGo) {
      setErrorMessage(
        "Audio calls require a dev build.\nRun `npx expo run:android` or `npx expo run:ios`."
      );
      setCallState("error");
      return;
    }

    setCallState("loading");
    setErrorMessage(null);
    setAgentState("idle");

    try {
      // Lazy require — only executed when user taps Start, not at module load.
      // This prevents the WebRTC native module check from running on Expo Go startup.
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { StreamVideoClient: Client, CallingState } = require(
        "@stream-io/video-react-native-sdk"
      ) as typeof import("@stream-io/video-react-native-sdk");
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { createStreamVideoClient } = require(
        "@/lib/stream"
      ) as typeof import("@/lib/stream");

      const response = await fetch("/api/stream-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          userName,
          lessonId,
          languageId,
          lessonContext,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(
          (data as { error?: string }).error ?? "Failed to get Stream token"
        );
      }

      const { token, callId, callType } = (await response.json()) as {
        token: string;
        callId: string;
        callType: string;
      };

      const client: StreamVideoClient = createStreamVideoClient(
        userId,
        userName,
        token
      );
      clientRef.current = client;

      const call: Call = (client as InstanceType<typeof Client>).call(
        callType,
        callId
      );
      callRef.current = call;

      // Subscribe before joining so no state events are missed
      subscriptionRef.current = call.state.callingState$.subscribe((state) => {
        if (state === CallingState.JOINED) {
          setCallState("joined");
          // Start the agent as soon as the user has joined
          void startAgent(callType, callId);
        } else if (state === CallingState.JOINING) {
          setCallState("connecting");
        } else if (state === CallingState.RECONNECTING) {
          setCallState("connecting");
        } else if (
          state === CallingState.LEFT ||
          state === CallingState.IDLE
        ) {
          setCallState((prev) =>
            prev === "joined" || prev === "connecting" ? "ended" : prev
          );
        }
      });

      setCallState("connecting");

      await call.join({ create: true });
      await call.camera.disable();
      // Start muted so the agent can speak first without echo.
      // The user unmutes by holding the push-to-talk button.
      await call.microphone.disable();
      setIsMuted(true);
    } catch (error) {
      const raw = error instanceof Error ? error.message : String(error);
      // Surface a friendlier message for Expo Go users
      const message = raw.toLowerCase().includes("webrtc native module")
        ? "Audio calls require a dev build — run `npx expo run:android` or `npx expo run:ios`."
        : raw;
      setErrorMessage(message);
      setCallState("error");
      setAgentState("idle");
      subscriptionRef.current?.unsubscribe();
      subscriptionRef.current = null;
      callRef.current = null;
      clientRef.current = null;
    }
  }, [lessonId, languageId, userId, userName, lessonContext, startAgent]);

  const endCall = useCallback(async () => {
    subscriptionRef.current?.unsubscribe();
    subscriptionRef.current = null;
    // Stop the agent first so it gracefully leaves before the call ends
    await stopAgent();
    try {
      if (callRef.current) await callRef.current.leave();
      if (clientRef.current) await clientRef.current.disconnectUser();
    } catch {
      // Always transition to ended regardless of cleanup errors
    } finally {
      callRef.current = null;
      clientRef.current = null;
      setCallState("ended");
      setIsMuted(false);
    }
  }, [stopAgent]);

  const toggleMute = useCallback(async () => {
    const call = callRef.current;
    if (!call) return;
    try {
      if (isMuted) {
        await call.microphone.enable();
        setIsMuted(false);
      } else {
        await call.microphone.disable();
        setIsMuted(true);
      }
    } catch {
      // Ignore toggle errors
    }
  }, [isMuted]);

  // Silence or restore the agent's audio tracks locally.
  // Setting track.enabled = false pauses local playback without dropping the WebRTC
  // connection, so buffered agent speech stops immediately when the user holds PTT.
  const setAgentAudioEnabled = useCallback((enabled: boolean) => {
    const call = callRef.current;
    if (!call) return;
    try {
      for (const participant of call.state.remoteParticipants) {
        const tracks = participant.audioStream?.getAudioTracks?.() ?? [];
        for (const track of tracks) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (track as any).enabled = enabled;
        }
      }
    } catch {
      // Graceful degradation — audio toggling is best-effort
    }
  }, []);

  const enableMic = useCallback(async () => {
    const call = callRef.current;
    if (!call) return;
    try {
      // Silence the agent immediately so buffered speech doesn't bleed into the user's turn.
      // The server-side VAD will detect the user's voice and interrupt the agent's generation.
      setAgentAudioEnabled(false);
      await call.microphone.enable();
      setIsMuted(false);
    } catch {
      // Ignore errors
    }
  }, [setAgentAudioEnabled]);

  const disableMic = useCallback(async () => {
    const call = callRef.current;
    if (!call) return;
    try {
      await call.microphone.disable();
      setIsMuted(true);
      // Restore agent audio — the agent has already interrupted and is now listening
      setAgentAudioEnabled(true);
    } catch {
      // Ignore errors
    }
  }, [setAgentAudioEnabled]);

  // Cleanup on unmount — stop agent and leave call
  useEffect(() => {
    return () => {
      subscriptionRef.current?.unsubscribe();
      const cleanup = async () => {
        // Stop agent session before leaving so it doesn't idle-timeout unnecessarily
        await stopAgent();
        try {
          if (callRef.current) await callRef.current.leave();
          if (clientRef.current) await clientRef.current.disconnectUser();
        } catch {
          // Ignore
        }
      };
      void cleanup();
    };
    // stopAgent is stable (useCallback with no deps that change), safe to include
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { callState, agentState, isMuted, errorMessage, joinCall, endCall, toggleMute, enableMic, disableMic };
}
