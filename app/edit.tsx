import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { rootStore } from "@/lib/rootStore";
import { Snackbar } from 'react-native-paper';
import * as ImageManipulator from 'expo-image-manipulator';

const countries = [
  { label: "Afghanistan", value: "AF" },
  { label: "Albania", value: "AL" },
  { label: "Algeria", value: "DZ" },
  { label: "Andorra", value: "AD" },
  { label: "Angola", value: "AO" },
  { label: "Argentina", value: "AR" },
  { label: "Armenia", value: "AM" },
  { label: "Australia", value: "AU" },
  { label: "Austria", value: "AT" },
  { label: "Azerbaijan", value: "AZ" },
  { label: "Bahamas", value: "BS" },
  { label: "Bahrain", value: "BH" },
  { label: "Bangladesh", value: "BD" },
  { label: "Belarus", value: "BY" },
  { label: "Belgium", value: "BE" },
  { label: "Belize", value: "BZ" },
  { label: "Benin", value: "BJ" },
  { label: "Bhutan", value: "BT" },
  { label: "Bolivia", value: "BO" },
  { label: "Bosnia and Herzegovina", value: "BA" },
  { label: "Botswana", value: "BW" },
  { label: "Brazil", value: "BR" },
  { label: "Brunei", value: "BN" },
  { label: "Bulgaria", value: "BG" },
  { label: "Burkina Faso", value: "BF" },
  { label: "Burundi", value: "BI" },
  { label: "Cambodia", value: "KH" },
  { label: "Cameroon", value: "CM" },
  { label: "Canada", value: "CA" },
  { label: "Cape Verde", value: "CV" },
  { label: "Central African Republic", value: "CF" },
  { label: "Chad", value: "TD" },
  { label: "Chile", value: "CL" },
  { label: "China", value: "CN" },
  { label: "Colombia", value: "CO" },
  { label: "Comoros", value: "KM" },
  { label: "Congo", value: "CG" },
  { label: "Costa Rica", value: "CR" },
  { label: "Croatia", value: "HR" },
  { label: "Cuba", value: "CU" },
  { label: "Cyprus", value: "CY" },
  { label: "Czech Republic", value: "CZ" },
  { label: "Denmark", value: "DK" },
  { label: "Djibouti", value: "DJ" },
  { label: "Dominican Republic", value: "DO" },
  { label: "Ecuador", value: "EC" },
  { label: "Egypt", value: "EG" },
  { label: "El Salvador", value: "SV" },
  { label: "Estonia", value: "EE" },
  { label: "Eswatini", value: "SZ" },
  { label: "Ethiopia", value: "ET" },
  { label: "Fiji", value: "FJ" },
  { label: "Finland", value: "FI" },
  { label: "France", value: "FR" },
  { label: "Gabon", value: "GA" },
  { label: "Gambia", value: "GM" },
  { label: "Georgia", value: "GE" },
  { label: "Germany", value: "DE" },
  { label: "Ghana", value: "GH" },
  { label: "Greece", value: "GR" },
  { label: "Guatemala", value: "GT" },
  { label: "Guinea", value: "GN" },
  { label: "Haiti", value: "HT" },
  { label: "Honduras", value: "HN" },
  { label: "Hungary", value: "HU" },
  { label: "Iceland", value: "IS" },
  { label: "India", value: "IN" },
  { label: "Indonesia", value: "ID" },
  { label: "Iran", value: "IR" },
  { label: "Iraq", value: "IQ" },
  { label: "Ireland", value: "IE" },
  { label: "Israel", value: "IL" },
  { label: "Italy", value: "IT" },
  { label: "Jamaica", value: "JM" },
  { label: "Japan", value: "JP" },
  { label: "Jordan", value: "JO" },
  { label: "Kazakhstan", value: "KZ" },
  { label: "Kenya", value: "KE" },
  { label: "Kuwait", value: "KW" },
  { label: "Laos", value: "LA" },
  { label: "Latvia", value: "LV" },
  { label: "Lebanon", value: "LB" },
  { label: "Libya", value: "LY" },
  { label: "Lithuania", value: "LT" },
  { label: "Luxembourg", value: "LU" },
  { label: "Madagascar", value: "MG" },
  { label: "Malaysia", value: "MY" },
  { label: "Maldives", value: "MV" },
  { label: "Mali", value: "ML" },
  { label: "Malta", value: "MT" },
  { label: "Mexico", value: "MX" },
  { label: "Moldova", value: "MD" },
  { label: "Monaco", value: "MC" },
  { label: "Mongolia", value: "MN" },
  { label: "Montenegro", value: "ME" },
  { label: "Morocco", value: "MA" },
  { label: "Myanmar", value: "MM" },
  { label: "Nepal", value: "NP" },
  { label: "Netherlands", value: "NL" },
  { label: "New Zealand", value: "NZ" },
  { label: "Nicaragua", value: "NI" },
  { label: "Nigeria", value: "NG" },
  { label: "North Korea", value: "KP" },
  { label: "Norway", value: "NO" },
  { label: "Oman", value: "OM" },
  { label: "Pakistan", value: "PK" },
  { label: "Panama", value: "PA" },
  { label: "Paraguay", value: "PY" },
  { label: "Peru", value: "PE" },
  { label: "Philippines", value: "PH" },
  { label: "Poland", value: "PL" },
  { label: "Portugal", value: "PT" },
  { label: "Qatar", value: "QA" },
  { label: "Romania", value: "RO" },
  { label: "Russia", value: "RU" },
  { label: "Saudi Arabia", value: "SA" },
  { label: "Senegal", value: "SN" },
  { label: "Serbia", value: "RS" },
  { label: "Singapore", value: "SG" },
  { label: "Slovakia", value: "SK" },
  { label: "Slovenia", value: "SI" },
  { label: "South Africa", value: "ZA" },
  { label: "South Korea", value: "KR" },
  { label: "Spain", value: "ES" },
  { label: "Sweden", value: "SE" },
  { label: "Switzerland", value: "CH" },
  { label: "Thailand", value: "TH" },
  { label: "Turkey", value: "TR" },
  { label: "Ukraine", value: "UA" },
  { label: "United Arab Emirates", value: "AE" },
  { label: "United Kingdom", value: "GB" },
  { label: "United States", value: "US" },
  { label: "Vietnam", value: "VN" },
  { label: "Zimbabwe", value: "ZW" }
];


export default function EditCompanyScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const data = JSON.parse(params.data  as string);
  const product = data["product"] ? data["product"] : null;
  
  const isNew =  data["isNew"] ?? false;

  const [productName, setProductName] = useState(product?.name || "");
  const [companyName, setCompanyName] = useState(product?.company?.name || "");
  const [companyCountry, setCompanyCountry] = useState(product?.company?.countryCode  || "");
  const [parentCompany, setParentCompany] = useState(product?.parentCompany?.name || "");
  const [parentCompanyCountry, setParentCompanyCountry] = useState(product?.parentCompany?.countryCode  || "");

  const [imageUri, setImageUri] = useState<string | null>(product?.imageUrl);
  const [base64Image, setBase64Image] = useState<string | null>(product?.base64Image);

  // Function to pick an image
  const pickImage = async () => {
    // Request permission to access media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "You need to grant permission to access photos.");
      return;
    }

    // Open image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });


    if (!result.canceled) {
      const selectedImageUri = result.assets[0].uri;
      setImageUri(selectedImageUri);
      convertToBase64(selectedImageUri);
    }
  };

  // Function to convert image to Base64
  const convertToBase64 = async (uri: string) => {
    try {
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 800 } }], // Resize to 800px width (maintains aspect ratio)
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG, base64: true }
      );
  
      const base64String = `data:image/jpeg;base64,${manipulatedImage.base64}`;
      setBase64Image(base64String);
      return base64String;
    } catch (error) {
      console.error("Error converting to Base64:", error);
      return null;
    }
  };


  const handleSave = async () => {


    const response = await fetch('https://api64.ipify.org?format=json');
    const data:any = await response.json();

    if (companyName != null ||companyCountry != null || parentCompany != null || parentCompanyCountry != null) {
      // check if origin of country is changed
      if (companyCountry != product?.company?.countryCode && companyCountry!= '') {
        rootStore.productStore.makeChangeRequest(product.code,{
          'data': JSON.stringify({
            'company': companyName,
            'companyCountryCode': companyCountry,
          }),
          'ip_address': data.ip,
        });
      }
      
      // check if parent company is changed
      if ( parentCompany != '' && parentCompany != product?.parentCompany?.name) {
        rootStore.productStore.makeChangeRequest(product.code,{
          'data': JSON.stringify({
            'company': companyName,
            'parentCompany': parentCompany,
          }),
          'ip_address': data.ip,
        });
      }
    
      
      // check if parent company origin has changed
      if (parentCompanyCountry != '' && parentCompanyCountry != product?.parentCompany?.countryCode && parentCompany!= '') {
        rootStore.productStore.makeChangeRequest(product.code,{
          'data': JSON.stringify({
            'company': parentCompany,
            'companyCountryCode': parentCompanyCountry,
          }),
          'ip_address': data.ip,
        });
      }
    }
    
    if (product.code != null && ((productName != null && product.name != productName && productName != '' && productName != 'N/A') || (companyName != null && companyName != '' && product.company.name != companyName) || (base64Image != null))) {
      // check for any changes
      if (productName != product?.name || companyName != product?.company?.name || base64Image != product?.base64Image) {
        rootStore.productStore.addProduct({
          'ean': product.code,
          'name': productName,
          'ip_address': data.ip,
          'data': JSON.stringify({
            'company': {
              'name':companyName,
            },
            'base64image':base64Image,
          } as LocalProductData),
        });
      }
    }
    

     showSnackbar();

  };

    const [isFocusCompanyCountry, setIsFocusCompanyCountry] = useState(false);
    const [isFocusParentCompanyCountry, setIsFocusParentCompanyCountry] = useState(false);

    const [snackbarVisible, setSnackbarVisible] = useState(false);

    const showSnackbar = () => {
      setSnackbarVisible(true);
    
      setTimeout(() => {
        setSnackbarVisible(false);
        
        // Navigate back after Snackbar disappears
        router.back();
      }, 1000); // Hide Snackbar and navigate back after 3 seconds
    };

  return (
    <View style={{ flex: 1, position: "relative" }}>

    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>

      {(!imageUri && !base64Image) && (
      <>
      {/* Image  */}
      <View style={styles.uploadBox}>
      <Text style={styles.title}>Upload an Image</Text>

      {/* Upload Button */}
      <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
        <AntDesign name="upload" size={20} color="white" style={styles.icon} />
        <Text style={styles.uploadButtonText}>Choose Image</Text>
      </TouchableOpacity>
      </View>
      </>
      )}
   

    {/* Display Selected Image */}
    {imageUri && (
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUri }} style={styles.imagePreview} />
      </View>
    )}
   
    {/* Display Selected Image */}
    {base64Image && !imageUri && (
      <View style={styles.imageContainer}>
        <Image source={{ uri: base64Image }} style={styles.imagePreview} />
      </View>
    )}

      {/* Product Name */}
      <Text style={styles.label}>Product Name</Text>
      <TextInput
        style={styles.input}
        value={productName}
        onChangeText={setProductName}
        />
      {/* Company Name */}
      <Text style={styles.label}>Company Name</Text>
      <TextInput
        style={styles.input}
        value={companyName}
        onChangeText={setCompanyName}
      />

{/* Company Country */}
    {!isNew && <>
        <Text style={styles.label}>Company Country</Text>
          <Dropdown
          // TODO: initial value
              style={[styles.dropdown, isFocusCompanyCountry && { borderColor: 'blue' }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              autoScroll={false} 
              data={countries}
              search={false}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocusCompanyCountry ? 'Select country' : '...'}
              searchPlaceholder="Search..."
              value={companyCountry}
              onChange={item => {
                setCompanyCountry(item.value);
              }}
            />
    </>}
      {/* Parent Company Name */}
      {!isNew && <>
      <Text style={styles.label}>Parent Company</Text>
      <TextInput
        style={styles.input}
        value={parentCompany}
        onChangeText={setParentCompany}
      />
      </>}

      {/* Parent Company Country */}
      {!isNew && <>
      <Text style={styles.label}>Parent Company Country</Text>
      <Dropdown
      // TODO: initial value
          style={[styles.dropdown, isFocusParentCompanyCountry && { borderColor: 'blue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          search={false}
          iconStyle={styles.iconStyle}
          data={countries}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocusParentCompanyCountry ? 'Select country' : '...'}
          searchPlaceholder="Search..."
          value={parentCompanyCountry}
          onFocus={() => setIsFocusParentCompanyCountry(true)}
          onBlur={() => setIsFocusParentCompanyCountry(false)}
          onChange={item => {
            setParentCompanyCountry(item.value);
            setIsFocusParentCompanyCountry(false);
          }}
        />
</>}
      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>

    </View>
    </ScrollView>

    {/* Snackbar - Now Positioned Above Everything */}
    <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        style={styles.snackbar}
      >
       Saved and will be reviewed.
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 50, // Ensure enough space at bottom
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "white",
  },
  saveButton: {
    backgroundColor: "#0052B4",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  placeholderStyle: {
    fontSize: 16,
  },
  image2: {
    position: "relative",
    height: "100%",
},
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  snackbar: {
    backgroundColor: "#323232",
    position: "absolute",
    bottom: 20,
    left: 10,
    right: 10,
    borderRadius: 8,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  icon: {
    marginRight: 5,
  },

  base64Container: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginTop: 10,
  },
  base64Text: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  uploadSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  uploadBox: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 20,
  },

  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0052B4",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  uploadButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  imageContainer: {
    marginTop: 20,
    borderRadius: 10,
    overflow: "hidden",
  },
  imagePreview: {
    height: 220,
    resizeMode: "contain",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    marginBottom: 20,
  },

});

