import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ScanResultScreen } from "../components/scan-result/ScanResultScreen";
import { rootStore } from "../lib/rootStore";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";

const ProductScreen = observer(function ProductScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams();
  const code: string = typeof params.code === "string" ? params.code : params.code?.[0];
  const { product, error, loading, currentLoadingCode } = rootStore.productStore;
  const showLoading = useTimer(500);

  useEffect(() => {
    if (code) {
      rootStore.productStore.fetchProduct(code);
    }
  }, [code]);

  if (!code) {
    router.dismissTo("/scan");
    return null;
  }

  if (error) {
    if (error.code === "not_found") {
      return (
        <View style={styles.container}>
          <View style={styles.notFoundCard}>
            <Text style={styles.notFoundTitle}>{t("product.notFound")}</Text>
            <Text style={styles.notFoundCode}>{code}</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() =>
                router.push({
                  pathname: "/edit",
                  params: {
                    data: JSON.stringify({ product: { code: code }, isNew: true }),
                  },
                })
              }
            >
              <Text style={styles.addButtonText}>{t("common.addProduct")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>{t("common.error")}</Text>
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

  return <ScanResultScreen />;
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#F2F5FA",
  },
  notFoundCard: {
    width: "100%",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    paddingVertical: 24,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: "#DFE6F2",
    alignItems: "center",
  },
  notFoundTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1C2C46",
    marginBottom: 8,
  },
  notFoundCode: {
    fontSize: 15,
    color: "#6B7485",
    marginBottom: 20,
  },
  addButton: {
    width: "100%",
    backgroundColor: "#0052B4",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
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
