import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { ScanResultScreen } from "../components/scan-result/ScanResultScreen";
import { useProductInfo } from "../lib/lookup";
import { useEffect } from "react";
import { useState } from "react";

export default function ProductScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const code: string = typeof params.code === "string" ? params.code : params.code?.[0];
  const { product, error, loading } = useProductInfo(code);
  const showLoading = useTimer(500);

  if (!code) {
    router.dismissTo("/scan");
    return null;
  }

  if (error) {
    if (error.type === "not-found") {
      return (
        <View style={styles.container}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>Product not found</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>Error</Text>
        </View>
      );
    }
  }

  if (loading || !product) {
    if (showLoading) {
      return (
        <View
          style={{
            height: "100%",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    } else {
      return null;
    }
  }

  return <ScanResultScreen product={product} code={code} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

function useTimer(delay: number) {
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    setTimeout(() => setIsReady(true), delay);
  }, [delay]);
  return isReady;
}
