import '@/lib/react-shim';
import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import { GameSessionProvider } from "@/lib/gameSession";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Geri" }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="word-list" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
      <Stack.Screen name="guess" options={{ headerShown: false }} />
      <Stack.Screen name="add-word" options={{ headerShown: false }} />
      <Stack.Screen name="result" options={{ headerShown: false }} />

    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GameSessionProvider>
        <GestureHandlerRootView style={styles.container}>
          <RootLayoutNav />
        </GestureHandlerRootView>
      </GameSessionProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});