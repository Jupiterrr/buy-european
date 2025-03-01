import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { AlertCircle, CheckCircle, ScanLine, XCircle } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import { Button, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { companiesDatabase } from "../components/database";
import { useFocusEffect } from "@react-navigation/native";
import { eanPrefixes } from "./(tabs)/ean_prefix";
import { ScanResultScreen } from "../components/scan-result/ScanResultScreen";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function ProductScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const router = useRouter();

  // const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<ProductResponse | null>(null);
  // const [origin, setOrigin] = useState<string | null>(null);
  // const [country, setCountry] = useState<string | null>(null);

  const params = useLocalSearchParams();
  const code: string = typeof params.code === "string" ? params.code : params.code?.[0];

  if (!code) {
    router.dismissTo("/scan");
    return null;
  }

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);

      const url = `https://world.openfoodfacts.org/api/v3/product/${encodeURIComponent(code)}.json`;
      const response = await fetch(url);
      const product = await response.json();
      // const { country, origin } = getCountryFromEAN(code) || { country: null, origin: null };
      // setCountry(country);
      // setOrigin(origin);

      console.log("res product", product);

      if (product.result.status === "failure") {
        throw new Error(product.result.name, { cause: product.result.code });
      }

      // only shows details if product is found
      if (product.result.id == "product_found") {
        setProduct(product);
        // setScanned(true);
      }

      setLoading(false);
    }

    if (code && !product) {
      fetchProduct();
    }
  }, [code, product]);

  // set product to null when open the page again
  // useFocusEffect(
  //   useCallback(() => {
  //     setProduct(null);
  //     setLoading(false);
  //     // setScanned(false);
  //   }, [])
  // );

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function getCountryFromEAN(ean: string): { country: string; origin: string } | undefined {
    if (!ean || ean.length < 3) {
      return { country: "Unknown", origin: "Unknown" };
    }

    const prefix = Number(ean.substring(0, 3)); // Convert to a number

    for (const entry of eanPrefixes) {
      const range = entry.range; // Extract range

      if (Array.isArray(range)) {
        const min = range[0];
        const max = range.length > 1 ? range[1] : range[0]; // Handle single-value ranges

        if (prefix >= min && prefix <= max) {
          // Numeric comparison
          // setCountry(entry.country);
          // setOrigin(entry.origin);
          return {
            country: entry.country,
            origin: entry.origin,
          };
        }
      }
    }
  }

  if (product) {
    return <ScanResultScreen product={product} code={code} />;
  }

  return <Text>...</Text>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scannerContainer: {
    flex: 1,
    position: "relative",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  scanner: {
    ...StyleSheet.absoluteFillObject,
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  scanIcon: {
    marginBottom: 8,
  },
  scanText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginTop: 20,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  resultContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  resultIcon: {
    marginBottom: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  originBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  euBadge: {
    backgroundColor: "#4CD964",
  },
  nonEuBadge: {
    backgroundColor: "#FF3B30",
  },
  unknownBadge: {
    backgroundColor: "#FF9500",
  },
  originText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  companyText: {
    fontSize: 18,
    marginBottom: 8,
    textAlign: "center",
  },
  barcodeText: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 30,
  },
  scanAgainButton: {
    backgroundColor: "#0052B4",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  scanAgainButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    marginHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 12,
    textAlign: "center",
  },
  icon: {
    marginBottom: 16,
  },
  webDemo: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  webDemoTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#0052B4",
  },
  webDemoText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
  },
  demoButtons: {
    width: "100%",
  },
  demoButton: {
    backgroundColor: "#0052B4",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  demoButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
  },
});
