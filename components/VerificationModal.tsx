import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Feather } from "@expo/vector-icons";

interface VerificationModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  email: string;
}

export default function VerificationModal({
  visible,
  onClose,
  onSuccess,
  email,
}: VerificationModalProps) {
  const [code, setCode] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  // Clear code when modal becomes visible
  useEffect(() => {
    if (visible) {
      setCode("");
      // Auto-focus input when modal opens
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [visible]);

  const handleChangeText = (text: string) => {
    // Only allow numbers
    const cleanText = text.replace(/[^0-9]/g, "");
    setCode(cleanText);

    if (cleanText.length === 6) {
      // Hide keyboard
      Keyboard.dismiss();
      // Wait a brief moment for user feedback, then trigger success
      setTimeout(() => {
        onSuccess();
      }, 300);
    }
  };

  const handleBoxPress = () => {
    inputRef.current?.focus();
  };

  // Render the 6 individual code boxes
  const renderBoxes = () => {
    const boxes = [];
    for (let i = 0; i < 6; i++) {
      const char = code[i] || "";
      const isCurrent = i === code.length;
      const isFilled = i < code.length;

      // Class names for different states
      let borderClass = "border-[#E2E8F0]";
      let bgClass = "bg-white";

      if (isFocused && isCurrent) {
        borderClass = "border-primary border-2";
      } else if (isFilled) {
        borderClass = "border-neutral-primary";
      }

      boxes.push(
        <TouchableOpacity
          key={i}
          activeOpacity={0.8}
          onPress={handleBoxPress}
          className={`w-12 h-14 rounded-xl border items-center justify-center ${borderClass} ${bgClass}`}
        >
          <Text className="text-h2 font-poppins-bold text-neutral-primary">
            {char}
          </Text>
        </TouchableOpacity>
      );
    }
    return boxes;
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 justify-end bg-neutral-primary/50">
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
            >
              {/* Bottom Sheet Container */}
              <View className="bg-white rounded-t-3xl px-6 pt-4 pb-8 w-full border-t border-neutral-border">
                {/* Drag Handle */}
                <View className="w-12 h-1.5 bg-[#E2E8F0] rounded-full mx-auto mb-6" />

                {/* Close Button */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={onClose}
                  className="absolute right-4 top-4 w-8 h-8 items-center justify-center rounded-full bg-neutral-surface"
                >
                  <Feather name="x" size={20} color="#6B7280" />
                </TouchableOpacity>

                {/* Title & Description */}
                <View className="items-center mb-6">
                  <Text className="text-h2 font-poppins-bold text-neutral-primary text-center">
                    Verify your email
                  </Text>
                  <Text className="text-body-md font-poppins-regular text-neutral-secondary text-center mt-2 px-4 leading-5">
                    {"We've sent a 6-digit verification code to"}{"\n"}
                    <Text className="font-poppins-semibold text-neutral-primary">
                      {email || "your email"}
                    </Text>
                  </Text>
                </View>

                {/* Secret Hidden TextInput */}
                <TextInput
                  ref={inputRef}
                  value={code}
                  onChangeText={handleChangeText}
                  maxLength={6}
                  keyboardType="number-pad"
                  style={styles.hiddenInput}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  caretHidden={true}
                />

                {/* Visual Boxes Container */}
                <View className="flex-row justify-between items-center mb-8 px-2">
                  {renderBoxes()}
                </View>

                {/* Footer Link / Info */}
                <View className="flex-row justify-center items-center">
                  <Text className="text-body-sm font-poppins-regular text-neutral-secondary">
                    {"Didn't receive the code?"}
                  </Text>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      setCode("");
                      inputRef.current?.focus();
                    }}
                  >
                    <Text className="text-body-sm font-poppins-bold text-primary ml-1">
                      Resend Code
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  hiddenInput: {
    position: "absolute",
    width: 0,
    height: 0,
    opacity: 0,
  },
});
