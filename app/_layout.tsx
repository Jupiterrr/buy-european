import { useEffect } from "react";
import { Stack } from "expo-router";
import { Platform } from "react-native";
import "@/lib/i18n";

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === "web") {
      window.frameworkReady?.();
    }
  }, []);

  return (
    <>
      <Stack screenOptions={{ headerShown: true }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="product"
          options={{
            title: "",
            headerTintColor: "black",
            headerTransparent: true,
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      {/* <StatusBar style="auto" /> */}
    </>
  );
}
