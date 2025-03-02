import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { ScanResultScreen } from "../components/scan-result/ScanResultScreen";
import { useProductInfo } from "../lib/lookup";

export default function ProductScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const code: string = typeof params.code === "string" ? params.code : params.code?.[0];
  const { product, error, loading } = useProductInfo(code);

  if (!code) {
    router.dismissTo("/scan");
    return null;
  }

  if (error) {
    if (error.type === "not-found") {
      return (
        <View style={styles.container}>
          <Text style={{}}>Product not found</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <Text style={{}}>Error</Text>
        </View>
      );
    }
  }

  if (loading || !product) {
    return <Text>loading...</Text>;
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
