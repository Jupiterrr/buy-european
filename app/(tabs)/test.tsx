import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ScanLine, ShoppingCart, Flag, Info } from "lucide-react-native";
import { useEffect } from "react";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1527866512907-a35a62a0f6c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
          }}
          style={styles.headerImage}
        />
        <View style={styles.overlay}>
          <Text style={styles.title}>Buy European</Text>
          <Text style={styles.subtitle}>Support European Products</Text>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Scan products to check if they are made in Europe or by European companies. Support local
          economies and make informed shopping decisions.
        </Text>
      </View>

      <View style={styles.featuresContainer}>
        {/* <TouchableOpacity style={styles.featureCard} onPress={() => router.push("/scan")}>
          <ScanLine size={40} color="#0052B4" />
          <Text style={styles.featureTitle}>Scan Products</Text>
          <Text style={styles.featureDescription}>
            Scan barcodes to instantly check product origin
          </Text>
        </TouchableOpacity> */}

        <TouchableOpacity style={styles.featureCard} onPress={() => router.push("/scan-eu")}>
          <Text style={styles.featureTitle}>EU Product</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.featureCard} onPress={() => router.push("/scan-non-eu")}>
          <Text style={styles.featureTitle}>Non-EU Product</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity style={styles.featureCard} onPress={() => router.push("/about")}>
          <Info size={40} color="#0052B4" />
          <Text style={styles.featureTitle}>About</Text>
          <Text style={styles.featureDescription}>
            Learn more about the Buy European initiative
          </Text>
        </TouchableOpacity> */}
      </View>

      <View style={styles.euContainer}>
        <Flag size={24} color="#0052B4" />
        <Text style={styles.euText}>
          Supporting European products helps strengthen our economy and preserves jobs within the
          EU.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    position: "relative",
    height: 200,
    marginBottom: 20,
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 82, 180, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#FFFFFF",
  },
  infoContainer: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333333",
  },
  featuresContainer: {
    flexDirection: "column",
    marginHorizontal: 16,
    marginBottom: 20,
  },
  featureCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginTop: 12,
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
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
