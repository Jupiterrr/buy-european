import { useEffect, useState } from "react";
import { BanIcon, CircleCheckBig } from "lucide-react-native";
import { ActivityIndicator, Dimensions, Image, ScrollView, StyleSheet, Text, View } from "react-native";
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


export function ScanResultScreen({ product, code }: { product: Product; code?: string }) {
  const { GoogleGenerativeAI } = require("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GOOGLE_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const [companyInfo, setCompanyInfo] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEuropeanProduct, setIsEuropeanProduct] = useState(null);

  useEffect(() => {
    async function fetchCompanyInfo() {
      setLoading(true);
      const info = await GetOriginWithGemini(product.brands);
      console.log('info', info);
      if (info) {
        setCompanyInfo(info);
        const isEU = info['euCompany'];
        setIsEuropeanProduct(isEU);
      }
      
      setLoading(false);
    }

    fetchCompanyInfo();
  }, [product.brands]);  

  // async function GetOriginFromLlm()  {
  //     console.log('GetOriginFromLlm');
  //     const apiKey = "API_KEY";
  
  //     const client = new Mistral({apiKey: apiKey});
  //     console.log('client ', client);
  
  //     const chatResponse = await client.chat.complete({
  //         model: "mistral-large-latest",
  //         messages: [{
  //           "role": "user",
  //           "content": "Where is the brand 'Nestle' headquartered? Does it have a parent company? Where is the parent company headquartered? Return only a JSON array with the following format: ['company', 'headquarter', 'is headquarter in eu',  'parent-company', 'parent-company-headquarter', 'is parent-company-headquarter in eu']."
  //         }]
  //     });
  //     console.log('chatResponse', chatResponse);
  
  //     console.log('Chat:', chatResponse.choices[0].message.content);
  // }

  async function GetOriginWithGemini(brand: string | null) {
    if (!brand) {
      return null;
    }

    // const prompt = `Where is the brand '${brand}' headquartered? Does it have a parent company? Where is the parent company headquartered? Return a JSON array with the following format: ['company', 'headquarter', 'is headquarter in eu',  'parent-company', 'parent-company-headquarter', 'is parent-company-headquarter in eu'].`;
    const prompt = `Provide information about the brand '${brand}' in a structured JSON array. Specifically, include:
      1. The company's official name.
      2. The company's headquarters location.
      3. Whether the headquarters is in the European Union (true/false).
      4. The parent company's official name (if applicable).
      5. The parent company's headquarters location (if applicable).
      6. Whether the parent company's headquarters is in the European Union (true/false).

      Return the response strictly in a JSON array format as follows:
      {
        "company": "Company Name",
        "headquarter": "Headquarters Location",
        "is_headquarter_in_eu": true/false,
        "parent_company": "Parent Company Name",
        "parent_company_headquarter": "Parent Company Headquarters Location",
        "is_parent_company_headquarter_in_eu": true/false
      }`;

    const result = await model.generateContent(prompt);
    console.log(result.response.text());
    // 1. Find the start of the JSON array.
    const startIndex = result.response.text().indexOf('[');

    // 2. Find the end of the JSON array.
    const endIndex = result.response.text().indexOf(']', startIndex) + 1;

    // 3. Extract the JSON string.
    const cleanedResult = result.response.text().substring(startIndex, endIndex);

    const resultArray = JSON.parse(cleanedResult);
    console.log('resultArray', resultArray);

    return {
      company: resultArray[0]["company"],
      headquarter: resultArray[0]["headquarter"],
      euCompany: resultArray[0]["is_headquarter_in_eu"],
      parentCompany: resultArray[0]["parent_company"],
      parentCompanyHeadquarter: resultArray[0]["parent_company_headquarter"],
      euParentCompanyHeadquarter: resultArray[0]["is_parent_company_headquarter_in_eu"],
    };
  }

  function MadeInEuValue({ madeInEu, origin }: { madeInEu: boolean | null; origin: string }) {
    if (madeInEu === null) {
      return <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <Text style={{ fontSize: 18 }}>❓</Text>
        <Text style={{ fontWeight: "bold" }}>Unknown</Text>
      </View>
    }
    return madeInEu ? (
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <Text style={{ fontSize: 18 }}>🇪🇺</Text>
        <Text style={{ fontWeight: "bold" }}>Yes ({origin})</Text>
      </View>
    ) : (
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <Text style={{ fontSize: 18 }}>⛔</Text>
        <Text style={{ fontWeight: "bold" }}>No ({origin})</Text>
      </View>
    );
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

  if (loading) {
    return <View
      style={{
        height: "100%",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size="large" color="#0000ff" />
    </View>;
  }


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
            marginBottom: 32,
            paddingHorizontal: 24,
            // textAlign: "center",
          }}
        >
          {product.product_name}
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
        <InfoSection
          label="Made in Europe"
          value={<MadeInEuValue madeInEu={isEuropeanProduct} origin={companyInfo?.headquarter || "Unknown"} />}
          isBad={!isEuropeanProduct}
        />
        <InfoSectionDivider />
        <InfoSection
          label="Made by European company"
          value={<MadeInEuValue madeInEu={isEuropeanProduct} origin={companyInfo?.headquarter || "Unknown"} />}
          isBad={!isEuropeanProduct}
        />
        <InfoSectionDivider />

        <InfoSection label="Company" value={product.brands} />
        {companyInfo?.parentCompany && 
        <InfoSectionDivider />}
        {companyInfo?.parentCompany && 
        <InfoSection
          label="Parent-Company"
          value={`${companyInfo?.parentCompany || "None"}${companyInfo?.parentCompanyHeadquarter ? ` (${companyInfo.parentCompanyHeadquarter})` : ""}`}
        />
        }
        {companyInfo?.euParentCompanyHeadquarter && <InfoSectionDivider />}
        {companyInfo?.euParentCompanyHeadquarter && 
        <InfoSection
          label="Parent Company from Europe"
          value={<MadeInEuValue madeInEu={companyInfo?.euParentCompanyHeadquarter ?? null} origin={companyInfo?.parentCompanyHeadquarter || "Unknown"} />}
        />}

        {/* <InfoSectionDivider /> */}
        {/* <InfoSection label="Parent company" value={product.brands} /> */}
        <InfoSectionDivider />
        {/* <InfoSection label="Location" value={product.origins_tags} /> */}
        <InfoSection
          label="Location"
          value={product.countries_tags
            .map((tag: string) => capitalize(tag.replace("en:", "")))
            .join(", ")}
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
  isBad,
}: {
  label: string;
  value: string | React.ReactNode;
  description?: string;
  isBad?: boolean;
}) {  
  return (
    <View style={{ padding: 24, flexDirection: "column", gap: 4, paddingHorizontal: 24, backgroundColor: isBad ? "#fecaca" : undefined }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", flexWrap: "wrap" }}>
        <Text style={{ fontSize: 14, fontWeight: "bold", flex: 1 }}>{label}</Text>
        <Text style={{ fontSize: 14, fontWeight: "bold", flex: 1, flexWrap: "wrap" }}>
          {value}
        </Text>
      </View>
      {description && <Text style={{ fontSize: 14, color: "#666666" }}>{description}</Text>}
    </View>
  );
}


function InfoSectionDivider() {
  return <View style={{ height: 1, backgroundColor: "#e2e8f0" }} />;
}
