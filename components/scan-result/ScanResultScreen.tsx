// import { useEffect } from "react";
import { BanIcon, CircleCheckBig } from "lucide-react-native";
import { Dimensions, Image, ScrollView, StyleSheet, Text, View } from "react-native";
// import Animated, {
//   Easing,
//   useAnimatedStyle,
//   useSharedValue,
//   withDelay,
//   withSequence,
//   withTiming,
// } from "react-native-reanimated";
import { Product } from "../../lib/lookup-types";
import { capitalize } from "lodash";
import { eanPrefixes } from "@/lib/ean_prefix";

export function ScanResultScreen({ product, code }: { product: Product; code?: string }) {
  function checkIsEuProduct(): boolean {
    // Check if code exists before trying to use it
    if (!code) return false;
    
    const prefix = Number(code.substring(0, 3));
    for (const entry of eanPrefixes) {
      const range = entry.range;
      if (Array.isArray(range)) { 
        const min = range[0];
        const max = range.length > 1 ? range[1] : range[0]; // Handle single-value ranges

        if (prefix >= min && prefix <= max) { // Numeric comparison
            return entry.origin == 'EU';
        }
    }
    }

    return false; // Replace with actual implementation
  }

  // Call the function to determine if it's an EU product
  const isEuropeanProduct = checkIsEuProduct();

  console.log("product", JSON.stringify(product));
  // product = product;

  function MadeInEuValue({ madeInEu }: { madeInEu: boolean }) {
    return madeInEu ? <Text>🇪🇺 Yes</Text> : <Text>⛔ No</Text>;
  }

  // const opacity = useSharedValue(0.5);

  // useEffect(() => {
  //   opacity.value = withSequence(
  //     withDelay(50, withTiming(1, { duration: 100, easing: Easing.linear })),
  //     withDelay(500, withTiming(0, { duration: 500, easing: Easing.linear }))
  //   );
  // }, []);

  // const overlayAnimatedStyle = useAnimatedStyle(() => {
  //   return {
  //     opacity: opacity.value,
  //   };
  // });

  return (
    <View style={styles.container}>
      {/* <Animated.View
        style={[
          styles.statusOverlay,
          isEuropeanProduct ? styles.statusOverlayOk : styles.statusOverlayError,
          overlayAnimatedStyle,
        ]}
      ></Animated.View> */}

      <ScrollView>
        <View style={styles.image2Container}>
          <Image
            source={{ uri: product.image_front_url }}
            style={styles.image2}
            resizeMode="contain"
          />
        </View>

        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 12,
            paddingHorizontal: 24,
            // textAlign: "center",
          }}
        >
          {product.product_name}
        </Text>

        {/* {isEuropeanProduct ? (
          <View style={[styles.euContainer, { backgroundColor: "green" }]}>
            <CircleCheckBig size={24} color="#FFCC00" />
            <Text style={[styles.euText, { color: "white" }]}>This is a European product.</Text>
          </View>
        ) : (
          <View style={[styles.euContainer, { backgroundColor: "#cbd5e1" }]}>
            <BanIcon size={24} color="red" />
            <Text style={[styles.euText, {}]}>This is a non-European product.</Text>
          </View>
        )} */}

        {/* <View style={styles.euContainer}>
          <Flag size={24} color="#0052B4" />
          <Text style={styles.euText}>
            Supporting European products helps strengthen our economy and preserves jobs within the
            EU.
          </Text>
        </View> */}

        {/* <Text style={styles.productName}>Brand: {product.brands}</Text> */}

        <InfoSectionDivider />
        <InfoSection label="Made in Europe" value={<MadeInEuValue madeInEu={isEuropeanProduct} />} />
        <InfoSectionDivider />
        <InfoSection label="Made by European company" value={<MadeInEuValue madeInEu={isEuropeanProduct} />} />
        <InfoSectionDivider />


        <InfoSection label="Company" value={product.brands} />
        {/* <InfoSectionDivider /> */}
        {/* <InfoSection label="Parent company" value={product.brands} /> */}
        <InfoSectionDivider />
        {/* <InfoSection label="Location" value={product.origins_tags} /> */}
        <InfoSection
          label="Location"
          value={product.countries_tags.map((tag: string) => capitalize(tag.replace("en:", ""))).join(", ")}
        />
        <InfoSectionDivider />
      </ScrollView>
    </View>
  );
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
  image: {
    width: "100%",
    height: "40%",
    // resizeMode: "contain",
    backgroundColor: "#e2e8f0",
    marginBottom: 12,
  },
  statusOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // red border
    borderWidth: 24,
    zIndex: 1000,
    pointerEvents: "none",
  },
  statusOverlayOk: {
    borderColor: "green",
  },
  statusOverlayError: {
    borderColor: "red",
  },
  image2Container: {
    width: "100%",
    height: Dimensions.get("window").height * 0.3,
    // resizeMode: "contain",
    backgroundColor: "#e2e8f0",
    // marginBottom: 12,
    padding: 32,
    marginBlockEnd: 32,
  },
  image2: {
    // width: "100%",
    // height: "100%",
    // resizeMode: "contain",
    // backgroundColor: "#e2e8f0",
    position: "relative",
    height: "100%",
    // width: "100%",
    // resizeMode: "contain",
    // margin: 30,
  },
  euContainer: {
    backgroundColor: "#FFCC00",
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 30,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  euText: {
    fontSize: 14,
    color: "#333333",
    marginLeft: 12,
    flex: 1,
  },
});

function InfoSection({
  label,
  value,
  description,
}: {
  label: string;
  value: string | React.ReactNode;
  description?: string;
}) {
  return (
    <View style={{ padding: 12, flexDirection: "column", gap: 4, paddingHorizontal: 24 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ fontSize: 14, fontWeight: "bold" }}>{label}</Text>
        <Text style={{ fontSize: 14, fontWeight: "bold" }}>{value}</Text>
      </View>
      {description && <Text style={{ fontSize: 14, color: "#666666" }}>{description}</Text>}
    </View>
  );
}

function InfoSectionDivider() {
  return <View style={{ height: 1, backgroundColor: "#e2e8f0", marginVertical: 12 }} />;
}
