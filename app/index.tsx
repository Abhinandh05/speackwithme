import React, { useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth, useUser } from "@clerk/expo";
import { Feather } from "@expo/vector-icons";
import { images } from "../constants/images";

export default function Index() {
  const router = useRouter();
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    // Check authentication and redirect to onboarding if needed
    if (isLoaded && !isSignedIn) {
      router.replace("/onboarding");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || !isSignedIn) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#6C4EF5" />
      </View>
    );
  }

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const email = user?.emailAddresses[0]?.emailAddress || "";

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Navbar */}
      <View className="flex-row justify-between items-center px-6 py-4 border-b border-neutral-border bg-white">
        <View className="flex-row items-center">
          <Image
            source={images.mascotLogo}
            className="w-8 h-8 mr-2"
            resizeMode="contain"
          />
          <Text className="text-h3 font-poppins-bold text-neutral-primary">
            SpeakWithMe
          </Text>
        </View>
 
        {/* User Info / Streak */}
        <View className="flex-row items-center bg-[#FFF8EE] px-3 py-1.5 rounded-full">
          <Image source={images.streakFire} className="w-5 h-5 mr-1" resizeMode="contain" />
          <Text className="font-poppins-bold text-body-sm text-[#FF8A00]">
            3 Day Streak!
          </Text>
        </View>
      </View>
 
      {/* Main Content Area */}
      <View className="flex-1 px-6 pt-6 justify-between pb-8">
        {/* Welcome Section */}
        <View className="space-y-4">
          <View className="bg-neutral-surface rounded-3xl p-6 border border-neutral-border items-center">
            {/* Mascot welcoming */}
            <Image
              source={images.mascotWelcome}
              className="w-36 h-36 mb-4"
              resizeMode="contain"
            />
            <Text className="text-h2 font-poppins-bold text-neutral-primary text-center">
              Welcome back!
            </Text>
            <Text className="text-body-md font-poppins-regular text-neutral-secondary text-center mt-1">
              Logged in as:{"\n"}
              <Text className="font-poppins-semibold text-neutral-primary">
                {email}
              </Text>
            </Text>
          </View>


          {/* Lesson Card */}
          <View className="bg-white rounded-3xl p-5 border-2 border-primary/20 mt-4 relative overflow-hidden">
            <View className="flex-row justify-between items-center">
              <View className="flex-1 pr-4">
                <Text className="text-xs font-poppins-bold text-primary uppercase tracking-wider">
                  Next Lesson
                </Text>
                <Text className="text-h3 font-poppins-bold text-neutral-primary mt-1">
                  Introduce Yourself
                </Text>
                <Text className="text-body-sm font-poppins-regular text-neutral-secondary mt-1">
                  Learn to greet others and say where you are from.
                </Text>
              </View>
              <View className="w-12 h-12 bg-primary/10 rounded-full items-center justify-center">
                <Feather name="play" size={24} color="#6C4EF5" className="ml-1" />
              </View>
            </View>
          </View>
        </View>

        {/* Buttons Section */}
        <View className="space-y-3">
          {/* Start Learning Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.btnShadow}
            className="w-full bg-primary py-4 rounded-2xl items-center justify-center"
          >
            <Text className="text-white font-poppins-bold text-body-lg">
              Start Learning
            </Text>
          </TouchableOpacity>

          {/* Log Out Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleLogout}
            className="w-full bg-white border border-neutral-border py-4 rounded-2xl items-center justify-center mt-3"
          >
            <Text className="text-neutral-primary font-poppins-semibold text-body-lg">
              Log Out
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  btnShadow: {
    shadowColor: "#6C4EF5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
});
