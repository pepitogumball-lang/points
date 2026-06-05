import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Platform, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const ADMIN_TOKEN = "Holaquetalsoypepi5";
const COUNTDOWN_SECS = 5;

export default function AdminAuthScreen() {
  const insets = useSafeAreaInsets();
  const [countdown, setCountdown] = useState(COUNTDOWN_SECS);
  const progressAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const glowAnim = useRef(new Animated.Value(0.15)).current;

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  useEffect(() => {
    AsyncStorage.setItem("admin_token", ADMIN_TOKEN).catch(() => {});
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 120,
      friction: 8,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 0.4, duration: 1000, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
        Animated.timing(glowAnim, { toValue: 0.15, duration: 1000, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
      ])
    ).start();

    Animated.timing(progressAnim, {
      toValue: 0,
      duration: COUNTDOWN_SECS * 1000,
      useNativeDriver: false,
      easing: Easing.linear,
    }).start();

    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval);
          router.replace("/");
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [progressAnim, scaleAnim, glowAnim]);

  return (
    <View style={[styles.root, { paddingTop: topPad }]}>
      <Animated.View style={[styles.glow, { opacity: glowAnim }]} />

      <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.iconWrap}>
          <Animated.View style={[styles.iconGlow, { opacity: glowAnim }]} />
          <Ionicons name="shield-checkmark" size={44} color="#22d3ee" />
        </View>

        <Text style={styles.tag}>ACCESO CONCEDIDO</Text>
        <Text style={styles.heading}>Admin activado</Text>
        <Text style={styles.sub}>
          Redirigiendo en{" "}
          <Text style={styles.countdown}>{countdown}</Text>
          {" "}segundos...
        </Text>

        <View style={styles.barTrack}>
          <Animated.View
            style={[
              styles.barFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", "100%"],
                }),
              },
            ]}
          />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#020617",
    alignItems: "center",
    justifyContent: "center",
  },
  glow: {
    position: "absolute",
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: "#22d3ee",
  },
  card: {
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 32,
  },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(34,211,238,0.1)",
    borderWidth: 1,
    borderColor: "rgba(34,211,238,0.25)",
    marginBottom: 8,
  },
  iconGlow: {
    position: "absolute",
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#22d3ee",
  },
  tag: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    color: "rgba(34,211,238,0.5)",
    letterSpacing: 5,
    textTransform: "uppercase",
  },
  heading: {
    fontFamily: "Inter_700Bold",
    fontSize: 32,
    color: "#ffffff",
    letterSpacing: -1,
  },
  sub: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "rgba(255,255,255,0.4)",
  },
  countdown: {
    fontFamily: "Inter_700Bold",
    color: "#22d3ee",
  },
  barTrack: {
    width: 180,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 1,
    overflow: "hidden",
    marginTop: 8,
  },
  barFill: {
    height: "100%",
    backgroundColor: "#22d3ee",
    borderRadius: 1,
  },
});
