import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { useSignUp, useOAuth } from "@clerk/expo";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { images } from "../../constants/images";
import VerificationModal from "../../components/VerificationModal";

// Complete any pending auth session (essential for OAuth redirects)
WebBrowser.maybeCompleteAuthSession();

function useWarmUpBrowser() {
  React.useEffect(() => {
    // Warm up the android browser to improve performance
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
}

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp } = useSignUp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Warm up browser for OAuth flow
  useWarmUpBrowser();

  // Social OAuth Strategies
  const { startOAuthFlow: startGoogleOAuth } = useOAuth({ strategy: "oauth_google" });
  const { startOAuthFlow: startFacebookOAuth } = useOAuth({ strategy: "oauth_facebook" });
  const { startOAuthFlow: startAppleOAuth } = useOAuth({ strategy: "oauth_apple" });

  const handleSignUp = async () => {
    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await signUp.create({
        emailAddress: email,
        password: password,
      });

      if (error) {
        alert(error.message || "Failed to initiate sign up.");
        return;
      }

      const { error: sendError } = await signUp.verifications.sendEmailCode();
      if (sendError) {
        alert(sendError.message || "Failed to send verification code.");
        return;
      }

      setModalVisible(true);
    } catch (err: any) {
      alert(err.errors?.[0]?.message || err.message || "Failed to initiate sign up.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerification = async (code: string) => {
    const { error } = await signUp.verifications.verifyEmailCode({
      code,
    });

    if (error) {
      throw new Error(error.message || "Verification failed");
    }

    if (signUp.status === "complete") {
      const { error: finalizeError } = await signUp.finalize();
      if (finalizeError) {
        throw new Error(finalizeError.message || "Finalize failed");
      }
      setModalVisible(false);
      router.replace("/");
    } else {
      throw new Error(`Sign up failed with status: ${signUp.status}`);
    }
  };

  // OAuth handlers
  const handleGoogleSignUp = useCallback(async () => {
    try {
      const redirectUrl = Linking.createURL("/", { scheme: "speackwithme" });
      const { createdSessionId, setActive: setOAuthActive } = await startGoogleOAuth({ redirectUrl });
      if (createdSessionId && setOAuthActive) {
        await setOAuthActive({ session: createdSessionId });
        router.replace("/");
      }
    } catch (err: any) {
      alert(err.errors?.[0]?.message || err.message || "Google Sign-Up failed.");
    }
  }, [startGoogleOAuth, router]);

  const handleFacebookSignUp = useCallback(async () => {
    try {
      const redirectUrl = Linking.createURL("/", { scheme: "speackwithme" });
      const { createdSessionId, setActive: setOAuthActive } = await startFacebookOAuth({ redirectUrl });
      if (createdSessionId && setOAuthActive) {
        await setOAuthActive({ session: createdSessionId });
        router.replace("/");
      }
    } catch (err: any) {
      alert(err.errors?.[0]?.message || err.message || "Facebook Sign-Up failed.");
    }
  }, [startFacebookOAuth, router]);

  const handleAppleSignUp = useCallback(async () => {
    try {
      const redirectUrl = Linking.createURL("/", { scheme: "speackwithme" });
      const { createdSessionId, setActive: setOAuthActive } = await startAppleOAuth({ redirectUrl });
      if (createdSessionId && setOAuthActive) {
        await setOAuthActive({ session: createdSessionId });
        router.replace("/");
      }
    } catch (err: any) {
      alert(err.errors?.[0]?.message || err.message || "Apple Sign-In failed.");
    }
  }, [startAppleOAuth, router]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Bar with Back Button */}
          <View className="flex-row items-center pt-2 px-4">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.back()}
              className="w-10 h-10 items-center justify-center rounded-full bg-neutral-surface"
            >
              <Feather name="chevron-left" size={24} color="#0D132B" />
            </TouchableOpacity>
          </View>

          {/* Form & Graphic Container */}
          <View className="px-6 pb-6">
            {/* Header Text */}
            <Text className="text-h1 font-poppins-bold text-neutral-primary tracking-tight leading-tight mt-4">
              Create your account
            </Text>
            <Text className="text-body-lg font-poppins-regular text-neutral-secondary mt-1">
              Start your language journey today ✨
            </Text>

            {/* Mascot Illustration Center */}
            <View className="items-center justify-center my-6 relative">
              <View className="w-40 h-40 items-center justify-center relative">
                {/* Waving Mascot Image */}
                <Image
                  source={images.mascotAuth}
                  className="w-32 h-32"
                  resizeMode="contain"
                />

                {/* Decorative Stars */}
                {/* Left Star (Orange) */}
                <View className="absolute left-1 top-8" style={styles.starRotateLeft}>
                  <FontAwesome name="star" size={16} color="#FF9F0A" />
                </View>

                {/* Top Right Star (Light Blue) */}
                <View className="absolute right-3 top-2" style={styles.starRotateRight}>
                  <FontAwesome name="star" size={18} color="#60A5FA" />
                </View>

                {/* Bottom Right Star (Yellow) */}
                <View className="absolute right-1 bottom-8" style={styles.starRotateLeft}>
                  <FontAwesome name="star" size={14} color="#FFD60A" />
                </View>
              </View>
            </View>

            {/* Input Form Fields */}
            <View className="space-y-4">
              {/* Email Field */}
              <View className="w-full bg-white border border-neutral-border rounded-2xl px-4 py-3">
                <Text className="text-xs font-poppins-semibold text-neutral-secondary uppercase tracking-wider mb-0.5">
                  Email
                </Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email address"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                  className="text-body-lg font-poppins-medium text-neutral-primary p-0 m-0"
                />
              </View>

              {/* Password Field */}
              <View className="w-full bg-white border border-neutral-border rounded-2xl px-4 py-3 flex-row items-center justify-between mt-4">
                <View className="flex-1">
                  <Text className="text-xs font-poppins-semibold text-neutral-secondary uppercase tracking-wider mb-0.5">
                    Password
                  </Text>
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Create a password"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isLoading}
                    className="text-body-lg font-poppins-medium text-neutral-primary p-0 m-0 flex-1"
                  />
                </View>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setShowPassword(!showPassword)}
                  className="pl-2"
                >
                  <Feather
                    name={showPassword ? "eye-off" : "eye"}
                    size={20}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Primary Sign Up Button */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleSignUp}
              disabled={isLoading}
              style={styles.buttonShadow}
              className="w-full bg-primary py-4 rounded-2xl items-center justify-center mt-6"
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text className="text-white font-poppins-bold text-body-lg">
                  Sign Up
                </Text>
              )}
            </TouchableOpacity>

            {/* "or continue with" Divider */}
            <View className="flex-row items-center justify-center my-6">
              <View className="flex-1 h-[1px] bg-neutral-border" />
              <Text className="text-body-sm font-poppins-semibold text-neutral-secondary px-3 uppercase tracking-wider">
                or continue with
              </Text>
              <View className="flex-1 h-[1px] bg-neutral-border" />
            </View>

            {/* Social Logins */}
            <View className="space-y-3">
              {/* Google Button */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleGoogleSignUp}
                className="w-full bg-white border border-neutral-border py-4 rounded-2xl flex-row items-center justify-center space-x-3"
              >
                <FontAwesome name="google" size={18} color="#EA4335" />
                <Text className="text-neutral-primary font-poppins-semibold text-body-lg ml-2">
                  Continue with Google
                </Text>
              </TouchableOpacity>

              {/* Facebook Button */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleFacebookSignUp}
                className="w-full bg-white border border-neutral-border py-4 rounded-2xl flex-row items-center justify-center space-x-3 mt-3"
              >
                <FontAwesome name="facebook" size={18} color="#1877F2" />
                <Text className="text-neutral-primary font-poppins-semibold text-body-lg ml-2">
                  Continue with Facebook
                </Text>
              </TouchableOpacity>

              {/* Apple Button */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleAppleSignUp}
                className="w-full bg-white border border-neutral-border py-4 rounded-2xl flex-row items-center justify-center space-x-3 mt-3"
              >
                <FontAwesome name="apple" size={18} color="#000000" />
                <Text className="text-neutral-primary font-poppins-semibold text-body-lg ml-2">
                  Continue with Apple
                </Text>
              </TouchableOpacity>
            </View>

            {/* Footer Text */}
            <View className="flex-row items-center justify-center mt-8 mb-4">
              <Text className="text-body-md font-poppins-regular text-neutral-secondary">
                Already have an account?
              </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => router.push("/signin")}
              >
                <Text className="text-body-md font-poppins-bold text-primary ml-1">
                  Log in
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Verification Code Bottom Sheet Modal */}
      <VerificationModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onVerify={handleVerification}
        email={email}
      />
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
  },
  buttonShadow: {
    shadowColor: "#6C4EF5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  starRotateLeft: {
    transform: [{ rotate: "-15deg" }],
  },
  starRotateRight: {
    transform: [{ rotate: "15deg" }],
  },
});
