import type { StreamVideoClient } from "@stream-io/video-react-native-sdk";
import Constants from "expo-constants";

function getStreamApiKey(): string {
  const key = Constants.expoConfig?.extra?.streamApiKey as string | undefined;
  if (!key) {
    throw new Error(
      "Missing Stream API key. Set STREAM_API_KEY in .env and ensure streamApiKey is in app.config.js extra."
    );
  }
  return key;
}

// Lazy require — keeps the native WebRTC module check out of the module
// load path so Expo Go can still display the lesson screen.
export function createStreamVideoClient(
  userId: string,
  userName: string,
  token: string
): StreamVideoClient {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { StreamVideoClient: Client } = require(
    "@stream-io/video-react-native-sdk"
  ) as typeof import("@stream-io/video-react-native-sdk");

  const apiKey = getStreamApiKey();
  return new Client({
    apiKey,
    user: { id: userId, name: userName },
    token,
  });
}
