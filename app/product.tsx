import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, Button, StyleSheet, Text, View } from "react-native";
import { ScanResultScreen } from "../components/scan-result/ScanResultScreen";
import { rootStore } from "../lib/rootStore";
import { observer } from "mobx-react-lite";

const ProductScreen = observer(function ProductScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const code: string = typeof params.code === "string" ? params.code : params.code?.[0];
  const { product, error, loading, currentLoadingCode } = rootStore.productStore;
  const showLoading = useTimer(500);

  if (!currentLoadingCode) {
    rootStore.productStore.fetchProduct(code);
  }

  if (!code) {
    router.dismissTo("/scan");
    return null;
  }

  if (error) {
    if (error.code === "not_found") {
      return (
        <View style={styles.container}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>Product not found</Text>
          <Text style={{ fontSize: 16, color: "gray" }}>{code}</Text>
          <View style={{ marginTop: 24 }}>
            <Button title="Go back" onPress={() => router.dismissTo("/scan")} />
          </View>
          <View style={{ marginTop: 24 }}>
            <Button title="Add product" onPress={() => router.push({
              pathname: "/edit",
              params: {
                data: JSON.stringify({'product': {'code': code,}, 'isNew': true}),
              },
            })} />
          </View>
          
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

  return <ScanResultScreen product={product} />;
});

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

export default ProductScreen;
