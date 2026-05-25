import { Feather } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type FeatherIconName = React.ComponentProps<typeof Feather>["name"];

const ACTIVE_BUBBLE_SIZE = 56;
const ACTIVE_BUBBLE_COLOR = "#6C4EF5";
const INACTIVE_COLOR = "#8A8FB2";

const TAB_META: Record<string, { label: string; icon: FeatherIconName }> = {
  home: { label: "Home", icon: "home" },
  learn: { label: "Learn", icon: "book-open" },
  "ai-teacher": { label: "AI Teacher", icon: "cpu" },
  chat: { label: "Chat", icon: "message-circle" },
  profile: { label: "Profile", icon: "user" },
};

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const [barWidth, setBarWidth] = useState(0);
  const activeBubbleX = useRef(new Animated.Value(0)).current;
  const activeIndex = useRef(new Animated.Value(state.index)).current;
  const insets = useSafeAreaInsets();

  const tabWidth = useMemo(() => {
    if (!barWidth || state.routes.length === 0) {
      return 0;
    }

    return barWidth / state.routes.length;
  }, [barWidth, state.routes.length]);

  useEffect(() => {
    if (!tabWidth) {
      return;
    }

    const nextX = state.index * tabWidth + (tabWidth - ACTIVE_BUBBLE_SIZE) / 2;

    Animated.timing(activeBubbleX, {
      toValue: nextX,
      duration: 260,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, [activeBubbleX, state.index, tabWidth]);

  useEffect(() => {
    Animated.timing(activeIndex, {
      toValue: state.index,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [activeIndex, state.index]);

  return (
    <View
      className="absolute inset-x-0 bottom-0 px-5"
      style={{ paddingBottom: Math.max(insets.bottom, 10) }}
    >
      <View
        onLayout={(event) => setBarWidth(event.nativeEvent.layout.width)}
        className="relative flex-row rounded-[28px] border border-[#EEEAFB] bg-[#FCFCFF] px-2 pb-2.5 pt-3.5"
        style={styles.tabBarShadow}
      >
        {tabWidth > 0 ? (
          <Animated.View
            style={[
              styles.activeBubble,
              {
                transform: [{ translateX: activeBubbleX }],
              },
            ]}
          >
            <Feather name={TAB_META[state.routes[state.index]?.name]?.icon ?? "home"} size={24} color="#FFFFFF" />
          </Animated.View>
        ) : null}

        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const { options } = descriptors[route.key];
          const tabMeta = TAB_META[route.name];

          const label =
            typeof options.tabBarLabel === "string"
              ? options.tabBarLabel
              : options.title || tabMeta?.label || route.name;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          const inactiveOpacity = activeIndex.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [1, 0, 1],
            extrapolate: "clamp",
          });

          const inactiveScale = activeIndex.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [1, 0.9, 1],
            extrapolate: "clamp",
          });

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarButtonTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              activeOpacity={0.85}
              hitSlop={{ top: 8, bottom: 8, left: 10, right: 10 }}
              className="flex-1 items-center justify-end pb-1 pt-7"
            >
              <View className="h-10 items-center justify-end">
                <Animated.View
                  style={{
                    opacity: inactiveOpacity,
                    transform: [{ scale: inactiveScale }],
                  }}
                  className="items-center"
                >
                  <Feather name={tabMeta?.icon ?? "circle"} size={22} color={INACTIVE_COLOR} />
                  <Text className="mt-1 font-poppins-medium text-xs text-[#7B81A4]">{label}</Text>
                </Animated.View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarShadow: {
    shadowColor: "#1A173D",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 12,
  },
  activeBubble: {
    position: "absolute",
    top: 2,
    width: ACTIVE_BUBBLE_SIZE,
    height: ACTIVE_BUBBLE_SIZE,
    borderRadius: ACTIVE_BUBBLE_SIZE / 2,
    borderWidth: 4,
    borderColor: "#FFFFFF",
    backgroundColor: ACTIVE_BUBBLE_COLOR,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: ACTIVE_BUBBLE_COLOR,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 14,
  },
});
