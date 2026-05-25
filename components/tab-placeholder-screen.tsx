import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type TabPlaceholderScreenProps = {
  title: string;
  subtitle: string;
};

export function TabPlaceholderScreen({ title, subtitle }: TabPlaceholderScreenProps) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-3xl font-poppins-bold text-neutral-primary">{title}</Text>
        <Text className="mt-2 text-center font-poppins-regular text-body-md text-neutral-secondary">
          {subtitle}
        </Text>
      </View>
    </SafeAreaView>
  );
}
