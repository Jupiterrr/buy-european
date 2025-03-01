import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === 'web') {
      window.frameworkReady?.();
    }
  }, []);

  return (
    <>
      <Stack screenOptions={{ headerShown: true }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="scan-eu"
          options={{
            title: "",
            headerTintColor: "black",
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name="scan-non-eu"
          options={{
            title: "",
            headerTintColor: "black",
            headerTransparent: true,
          }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      {/* <StatusBar style="auto" /> */}
    </>
  );
}
