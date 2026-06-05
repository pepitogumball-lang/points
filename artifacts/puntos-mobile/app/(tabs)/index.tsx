import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useFocusEffect } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const API_BASE = `https://${process.env.EXPO_PUBLIC_DOMAIN}/api`;

async function fetchPoints(): Promise<number> {
  const res = await fetch(`${API_BASE}/points`);
  const data = await res.json();
  return data.points ?? 0;
}

async function postPoints(points: number): Promise<number> {
  const token = await AsyncStorage.getItem("admin_token");
  const res = await fetch(`${API_BASE}/points`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "X-Admin-Token": token } : {}),
    },
    body: JSON.stringify({ points }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Error");
  return data.points;
}

function PulsingDot({ color }: { color: string }) {
  const anim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 0.25, duration: 900, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
        Animated.timing(anim, { toValue: 1, duration: 900, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
      ])
    ).start();
  }, [anim]);
  return (
    <Animated.View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: color, opacity: anim }} />
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const qc = useQueryClient();
  const [isAdmin, setIsAdmin] = useState(false);
  const [flash, setFlash] = useState<"up" | "down" | null>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const scanAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.6)).current;
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const checkAdmin = useCallback(() => {
    AsyncStorage.getItem("admin_token").then((token) => {
      setIsAdmin(token === "Holaquetalsoypepi5");
    });
  }, []);

  useEffect(() => { checkAdmin(); }, [checkAdmin]);

  useFocusEffect(checkAdmin);

  const { data: points = 0, isError } = useQuery({
    queryKey: ["points"],
    queryFn: fetchPoints,
    refetchInterval: 3000,
  });

  const mutation = useMutation({
    mutationFn: postPoints,
    onSuccess: (confirmed) => {
      qc.setQueryData(["points"], confirmed);
    },
    onError: () => {
      qc.invalidateQueries({ queryKey: ["points"] });
    },
  });

  useEffect(() => {
    Animated.loop(
      Animated.timing(scanAnim, { toValue: 1, duration: 4000, useNativeDriver: true, easing: Easing.linear })
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 2200, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
        Animated.timing(glowAnim, { toValue: 0.6, duration: 2200, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
      ])
    ).start();
  }, [scanAnim, glowAnim]);

  const handleAdjust = (delta: number) => {
    if (mutation.isPending) return;
    const next = points + delta;
    setFlash(delta > 0 ? "up" : "down");
    Haptics.impactAsync(
      delta > 0 ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light
    );
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: delta > 0 ? 1.07 : 0.93, duration: 90, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 220, useNativeDriver: true, easing: Easing.out(Easing.back(2)) }),
    ]).start();
    setTimeout(() => setFlash(null), 600);
    qc.setQueryData(["points"], next);
    mutation.mutate(next);
  };

  const onCounterPressIn = useCallback(() => {
    longPressTimer.current = setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      router.push("/Holaquetalsoypepi5");
    }, 3000);
  }, []);

  const onCounterPressOut = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const counterColor =
    flash === "up" ? "#67e8f9" : flash === "down" ? "#818cf8" : "#22d3ee";

  return (
    <View style={[styles.root, { paddingTop: topPad, paddingBottom: bottomPad + 16 }]}>
      {/* Status — top right */}
      <View style={[styles.statusRow, { top: topPad + 12 }]}>
        <PulsingDot color={isError ? "#f87171" : "#22d3ee"} />
        <Text style={styles.statusText}>{isError ? "OFFLINE" : "LIVE"}</Text>
      </View>

      {/* Brand */}
      <View style={styles.brandRow}>
        <Text style={styles.brandLabel}>ZAPIA · SISTEMA DE PUNTOS</Text>
        <Text style={styles.brandTitle}>PUNTOS</Text>
      </View>

      {/* Counter card — secret long-press (3s) navigates to admin auth */}
      <Pressable
        onPressIn={onCounterPressIn}
        onPressOut={onCounterPressOut}
        onPress={() => {}}
        testID="counter-card"
      >
        <Animated.View style={[styles.counterCard, { transform: [{ scale: scaleAnim }] }]}>
          <View style={[styles.corner, styles.cornerTL]} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />

          <Animated.View style={[styles.glow, { opacity: glowAnim }]} pointerEvents="none" />

          <Text style={[styles.counterText, { color: counterColor }]}>
            {points.toLocaleString()}
          </Text>

          <Animated.View
            pointerEvents="none"
            style={[
              styles.scanLine,
              {
                transform: [
                  {
                    translateY: scanAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-95, 95],
                    }),
                  },
                ],
              },
            ]}
          />
        </Animated.View>
      </Pressable>

      {/* Admin controls — only visible if admin token is set */}
      {isAdmin && (
        <View style={styles.controlRow}>
          <Pressable
            style={({ pressed }) => [styles.ctrlBtn, styles.ctrlBtnPlus, pressed && { opacity: 0.65, transform: [{ scale: 0.94 }] }]}
            onPress={() => handleAdjust(1)}
            disabled={mutation.isPending}
            testID="btn-plus"
          >
            <Ionicons name="add" size={40} color="#22d3ee" />
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.ctrlBtn, styles.ctrlBtnMinus, pressed && { opacity: 0.65, transform: [{ scale: 0.94 }] }]}
            onPress={() => handleAdjust(-1)}
            disabled={mutation.isPending}
            testID="btn-minus"
          >
            <Ionicons name="remove" size={40} color="#818cf8" />
          </Pressable>
        </View>
      )}

      <Text style={[styles.footer, { bottom: bottomPad + 20 }]}>
        v2.0 · REPLIT EDITION
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#020617",
    gap: 36,
  },
  statusRow: {
    position: "absolute",
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusText: {
    fontFamily: "Inter_500Medium",
    fontSize: 10,
    color: "rgba(255,255,255,0.3)",
    letterSpacing: 3,
  },
  brandRow: {
    alignItems: "center",
    gap: 4,
  },
  brandLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    color: "rgba(34,211,238,0.5)",
    letterSpacing: 6,
    textTransform: "uppercase",
  },
  brandTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 52,
    color: "#ffffff",
    letterSpacing: -2,
    textTransform: "uppercase",
  },
  counterCard: {
    width: 280,
    height: 190,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(15,23,42,0.9)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    shadowColor: "#22d3ee",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 32,
    elevation: 12,
  },
  glow: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(34,211,238,0.06)",
  },
  corner: {
    position: "absolute",
    width: 18,
    height: 18,
    borderColor: "rgba(34,211,238,0.5)",
  },
  cornerTL: { top: 0, left: 0, borderTopWidth: 1.5, borderLeftWidth: 1.5, borderTopLeftRadius: 24 },
  cornerTR: { top: 0, right: 0, borderTopWidth: 1.5, borderRightWidth: 1.5, borderTopRightRadius: 24 },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: 1.5, borderLeftWidth: 1.5, borderBottomLeftRadius: 24 },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: 1.5, borderRightWidth: 1.5, borderBottomRightRadius: 24 },
  counterText: {
    fontFamily: "Inter_700Bold",
    fontSize: 72,
    letterSpacing: -2,
  },
  scanLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "rgba(34,211,238,0.2)",
  },
  controlRow: {
    flexDirection: "row",
    gap: 20,
  },
  ctrlBtn: {
    width: 96,
    height: 96,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  ctrlBtnPlus: {
    backgroundColor: "rgba(34,211,238,0.1)",
    borderColor: "rgba(34,211,238,0.3)",
    shadowColor: "#22d3ee",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  ctrlBtnMinus: {
    backgroundColor: "rgba(99,102,241,0.08)",
    borderColor: "rgba(99,102,241,0.3)",
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  footer: {
    position: "absolute",
    fontFamily: "Inter_400Regular",
    fontSize: 10,
    color: "rgba(255,255,255,0.12)",
    letterSpacing: 4,
    textTransform: "uppercase",
  },
});
