import { useEffect, useRef } from "react";
import { Stack, usePathname, useGlobalSearchParams } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { ClerkProvider, ClerkLoaded } from "@clerk/expo";
import { configureReanimatedLogger, ReanimatedLogLevel } from "react-native-reanimated";
import { PostHogProvider } from "posthog-react-native";
import { tokenCache } from "../lib/tokenCache";
import { posthog } from "../lib/posthog";
import "../global.css";

// Suppress Reanimated value reading warnings in render
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env file."
  );
}

// Keep the splash screen visible while loading resources
SplashScreen.preventAutoHideAsync().catch(() => {
  /* Ignore error if splash screen is already hidden */
});

function RootLayoutNav() {
  const pathname = usePathname();
  const params = useGlobalSearchParams();
  const previousPathname = useRef<string | undefined>(undefined);

  // Manual screen tracking for Expo Router
  useEffect(() => {
    if (previousPathname.current !== pathname) {
      posthog.screen(pathname, {
        previous_screen: previousPathname.current ?? null,
        ...params,
      });
      previousPathname.current = pathname;
    }
  }, [pathname, params]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#FFFFFF" },
      }}
    />
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync().catch(() => {
        /* Ignore error */
      });
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <PostHogProvider
          client={posthog}
          autocapture={{
            captureScreens: true,
            captureTouches: true,
            propsToCapture: ["testID"],
          }}
        >
          <StatusBar style="dark" />
          <RootLayoutNav />
        </PostHogProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
