import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { rootStore } from "@/lib/rootStore";
import { observer } from "mobx-react-lite";

export const ScanResultScreen = observer(() => {
  const product = rootStore.productStore.product;
  const [alternatives, setAlternatives] = React.useState<any>(null); // ✅ use state

  useFocusEffect(
    React.useCallback(() => {
      if (product?.code) {
        rootStore.productStore.fetchProduct(product.code);
        if (product?.companyOrigin !== "eu") {
          rootStore.productStore.fetchAlternatives(product.code).then((result) => {
            setAlternatives(result ?? []); // ✅ triggers re-render
          });
        }
        
      }
    }, [product?.code])
  );

  function capitalizeFirst(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.image2Container}>
          <Image source={{ uri: product?.imageUrl != null ? product.imageUrl : product?.base64Image }} style={styles.image2} resizeMode="contain" />
        </View>

        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 32,
            paddingHorizontal: 24,
            // textAlign: "center",
          }}
        >
          {product?.name}
        </Text>

        {/** TODO: a third version, when we do not know */}
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

        {/* <InfoSectionDivider />
        <InfoSection label="Made in Europe" value={<MadeInEuValue madeInEu={isEuropeanProduct} origin={companyInfo?['headquarter']} />} /> */}
        <InfoSectionDivider />
        {/* <InfoSection
          label="Made in Europe"
          value={<MadeInEuValue madeInEu={isEuropeanProduct} />}
          isBad={!isEuropeanProduct}
          description={`Produced in ${companyInfo?.company || "Unknown"}`}
        /> */}
        <InfoSectionDivider />
        <InfoSection
          label="Made by European company"
          value={<MadeInEuValue madeInEu={product?.companyOrigin} />}
          isBad={product?.companyOrigin !== "eu"}
          // description={`Made by ${companyInfo?.company || "Unknown"}`}
        />
        <InfoSectionDivider />

        <InfoSection
          label="Company"
          value={
            <CompanyDescription
              name={product?.company?.name || "Unknown"}
              location={product?.company?.country || "Unknown"}
            />
          }
        />
        {/* {companyInfo?.parentCompany && <InfoSectionDivider />}
        {companyInfo?.parentCompany && (
          <InfoSection
            label="Parent-Company"
            value={`${companyInfo?.parentCompany || "None"}${companyInfo?.parentCompanyHeadquarter ? ` (${companyInfo.parentCompanyHeadquarter})` : ""}`}
          />
        )} */}
        {product?.parentCompany && (
          <React.Fragment>
            <InfoSectionDivider />

            <InfoSection
              label="Parent Company"
              value={
                <CompanyDescription
                  name={product.parentCompany.name}
                  location={product.parentCompany.country ?? ''}
                />
              }
            />
          </React.Fragment>
        )}

        {/* <InfoSectionDivider /> */}
        {/* <InfoSection label="Parent company" value={product.brands} /> */}
        <InfoSectionDivider />
        {/* <InfoSection label="Location" value={product.origins_tags} /> */}
        {/* <InfoSection
          label="Location"
          value={product.countries_tags
            .map((tag: string) => capitalize(tag.replace("en:", "")))
            .join(", ")}
        />
        <InfoSectionDivider /> */}


        {/* ALTERNATIVES */}
        {(product?.companyOrigin !== "eu") &&
        <>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              paddingHorizontal: 24,
              marginTop: 24,
              marginBottom: 12,
            }}
          >
            European Alternatives
          </Text>

          <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          >
          {alternatives != null && alternatives?.length === 0  && ( 
            <View
            style={{
              width: Dimensions.get("window").width - 32, // minus paddings
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View style={styles.alternativeStateContainer}>
              <Text style={styles.altStateEmoji}>😕</Text>
              <Text style={styles.altStateText}>No European alternatives found.</Text>
            </View>
          </View>
          )}

          {alternatives === null && (
          <View
          style={{
            width: Dimensions.get("window").width - 32,
            justifyContent: "center",
            alignItems: "center",
          }}
          >
          <View style={styles.alternativeStateContainer}>
            <ActivityIndicator size="small" color="#888" />
            <Text style={styles.altStateText}>Looking for alternatives...</Text>
          </View>
          </View>
          )}

          {alternatives?.map((alt: any, index: number) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                rootStore.productStore.fetchProduct(alt.code).then(() => {
                  setAlternatives([]); // clear old alternatives
                  rootStore.productStore.fetchAlternatives(alt.code).then((result) => {
                    setAlternatives(result);
                  });
                });
              }}
              style={{
                width: 140,
                marginRight: 16,
                backgroundColor: "white",
                borderRadius: 12,
                padding: 8,
              }}
            >
              <Image
                source={{ uri: alt.image_front_url }}
                style={{ width: "100%", height: 100, borderRadius: 8, backgroundColor: "#e2e8f0" }}
                resizeMode="cover"
              />
              <Text style={{ fontWeight: "bold", fontSize: 14, marginTop: 8 }} numberOfLines={2}>
                {alt.product_name || "Unnamed"}
              </Text>
              <Text style={{ fontSize: 12, color: "#666" }} numberOfLines={1}>
                {capitalizeFirst(alt.brands_tags != null && alt.brands_tags.length > 0 ? alt.brands_tags.at(-1) : alt.brands)}
              </Text>
            </TouchableOpacity>
          ))}
          </ScrollView>
        </>
        }
        


        <Text
          style={{
            fontSize: 12,
            color: "#888888",
            paddingHorizontal: 24,
            marginTop: 24,
            marginBottom: 12,
            textAlign: "center",
          }}
        >
          Always refer to the labels on the packaging for the most accurate information.
        </Text>
        <TouchableOpacity onPress={() => {
          console.log("product", product);
              router.push({
                pathname: "/edit",
                params: {
                  data: JSON.stringify({'product': product, 'isNew': false}),
                },
        });}}>
      
        <Text
        style={{
          fontSize: 12,
          color: "#b53539",
          paddingHorizontal: 24,
          marginTop: 12,
          marginBottom: 24,
          textAlign: "center",
          textDecorationLine: "underline",
        }}>
          Found an error?
        </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
});

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
  alternativeStateContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  altStateText: {
    marginTop: 8,
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  altStateEmoji: {
    fontSize: 28,
  },
});

function InfoSection({
  label,
  value,
  description,
  isBad,
}: {
  label: string;
  value?: string | React.ReactNode;
  description?: string | React.ReactNode;
  isBad?: boolean;
}) {
  return (
    <View
      style={{
        padding: 24,
        flexDirection: "column",
        gap: 4,
        paddingHorizontal: 24,
        backgroundColor: isBad ? "#fecaca" : undefined,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "flex-start",
        }}
      >
        <Text style={{ fontSize: 14, fontWeight: "bold", flex: 1 }}>{label}</Text>

        <Text style={{ fontSize: 14, fontWeight: "bold", flex: 1,}}>{value}</Text>
      </View>
      {description && <Text style={{ fontSize: 14, color: "#666666" }}>{description}</Text>}
    </View>
  );
}

function InfoSectionDivider() {
  return <View style={{ height: 1, backgroundColor: "#e2e8f0" }} />;
}

function CompanyDescription({ name, location }: { name: string; location: string }) {
  return (
    <View style={{ flexDirection: "column", gap: 2, alignItems: "flex-start" }}>
      <Text style={{ fontWeight: "bold" }}>{name}</Text>
      <Text style={{ fontSize: 12, color: "#888888" }}>{location}</Text>
    </View>
  );
}

function MadeInEuValue({ madeInEu }: { madeInEu: Product["companyOrigin"] }) {
  if (madeInEu === "unknown") {
    return (
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <Text style={{ fontSize: 18 }}>❓</Text>
        <Text style={{ fontWeight: "bold" }}>Unknown</Text>
      </View>
    );
  }
  return madeInEu === "eu" ? (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
      <Text style={{ fontSize: 18 }}>🇪🇺</Text>
      <Text style={{ fontWeight: "bold" }}>Yes</Text>
    </View>
  ) : (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
      <Text style={{ fontSize: 18 }}>⛔</Text>
      <Text style={{ fontWeight: "bold" }}>No</Text>
    </View>
  );
}
