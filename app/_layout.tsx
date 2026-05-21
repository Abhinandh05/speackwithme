import { useEffect } from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { ClerkProvider, ClerkLoaded } from "@clerk/expo";
import { configureReanimatedLogger, ReanimatedLogLevel } from "react-native-reanimated";
import { tokenCache } from "../lib/tokenCache";
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
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#FFFFFF" },
          }}
        />
      </ClerkLoaded>
    </ClerkProvider>
  );
}

