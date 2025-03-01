import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { AlertCircle, CheckCircle, ScanLine, XCircle } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import { Button, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { companiesDatabase } from '../../components/database';
import { useFocusEffect } from '@react-navigation/native';
import { eanPrefixes } from './ean_prefix';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();

  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [origin, setOrigin] = useState<string | null>(null);
  const [country, setCountry] = useState<string | null>(null);

  // set product to null when open the page again
  useFocusEffect(
    useCallback(() => {
      setProduct(null);
      setLoading(false);
      setScanned(false);
    }, [])
  );

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


  async function handleBarCodeScanned({ type, data }: { type: string; data: string })  {
    if (loading) {
      return;
    }

    if (data && data != '') {
      setLoading(true);
    }

    const url = `https://world.openfoodfacts.org/api/v3/product/${encodeURIComponent(data)}.json`;
    const response = await fetch(url);
    const product = await response.json();
    getCountryFromEAN(data);

    if (product.result.status === "failure") {
      throw new Error(product.result.name, { cause: product.result.code });
    }

    // only shows details if product is found
    if (product.result.id == "product_found") {
      setProduct(product);
      setScanned(true);
    }
    
    setLoading(false);
  };

  function getCountryFromEAN(ean: string) {
    if (!ean || ean.length < 3) {
        return { country: "Unknown", origin: "Unknown" };
    }
    
    const prefix = Number(ean.substring(0, 3)); // Convert to a number
    
    for (const entry of eanPrefixes) {
        const range = entry.range; // Extract range
    
        if (Array.isArray(range)) { 
            const min = range[0];
            const max = range.length > 1 ? range[1] : range[0]; // Handle single-value ranges
    
            if (prefix >= min && prefix <= max) { // Numeric comparison
                setCountry(entry.country);
                setOrigin(entry.origin);
                return;
            }
        }
    }
  }


  // For web demo purposes, let's add a function to simulate scanning
  const simulateScan = (barcode: string) => {
    handleBarCodeScanned({ type: 'simulated', data: barcode });
  };


  return (
    <View style={styles.container}>
      {!scanned ? (
        <>
          {Platform.OS !== 'web' ? (
            <View style={styles.scannerContainer}>
             <CameraView style={styles.camera} facing='back' onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}>
              </CameraView>

              <View style={styles.overlay}>
                <View style={styles.scanArea}>
                  <ScanLine size={24} color="#FFFFFF" style={styles.scanIcon} />
                </View>
                <Text style={styles.scanText}>Position barcode within the frame</Text>
              </View>
            </View>
          ) : (
            // Web fallback - show demo buttons
            <View style={styles.webDemo}>
              <Text style={styles.webDemoTitle}>Web Demo Mode</Text>
              <Text style={styles.webDemoText}>
                Camera scanning is not available on web. Try these sample products:
              </Text>
              <View style={styles.demoButtons}>
                <TouchableOpacity 
                  style={styles.demoButton} 
                  onPress={() => simulateScan('8710447319239')}
                >
                  <Text style={styles.demoButtonText}>Philips Shaver (EU)</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.demoButton} 
                  onPress={() => simulateScan('5000112637922')}
                >
                  <Text style={styles.demoButtonText}>Cadbury Chocolate (Non-EU)</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.demoButton} 
                  onPress={() => simulateScan('3017620422003')}
                >
                  <Text style={styles.demoButtonText}>Nutella (EU)</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.demoButton} 
                  onPress={() => simulateScan('5449000000996')}
                >
                  <Text style={styles.demoButtonText}>Coca-Cola (Non-EU)</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </>
      ) : (
        <View style={styles.resultContainer}>
          {origin === 'EU' ? (
            <CheckCircle size={80} color="#4CD964" style={styles.resultIcon} />
          ) : origin === 'Non-EU' ? (
            <XCircle size={80} color="#FF3B30" style={styles.resultIcon} />
          ) : (
            <AlertCircle size={80} color="#FF9500" style={styles.resultIcon} />
          )}
          
          <Text style={styles.productName}>{product?.product.product_name}</Text>
          
          {origin === 'EU' ? (
            <View style={[styles.originBadge, styles.euBadge]}>
              <Text style={styles.originText}>European Product</Text>
            </View>
          ) : origin === 'Non-EU' ? (
            <View style={[styles.originBadge, styles.nonEuBadge]}>
              <Text style={styles.originText}>Non-European Product</Text>
            </View>
          ) : (
            <View style={[styles.originBadge, styles.unknownBadge]}>
              <Text style={styles.originText}>Unknown Origin</Text>
            </View>
          )}
          
          {product?.product.brands && (
            <Text style={styles.companyText}>
              Company: {product.product.brands} ({country})
            </Text>
          )}
          
          {/** if the brand is empty but we still should show the country */  }
          {!product?.product.brands && country && (
            <Text style={styles.companyText}>
              Origin: {country}
            </Text>
          )}
         
          {product?.code && (
            <Text style={styles.barcodeText}>Barcode: {product.code}</Text>
          )}
          
          <TouchableOpacity 
            style={styles.scanAgainButton}
            onPress={() => setScanned(false)}
          >
            <Text style={styles.scanAgainButtonText}>Scan Another Product</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scannerContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  scanner: {
    ...StyleSheet.absoluteFillObject,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanIcon: {
    marginBottom: 8,
  },
  scanText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  resultIcon: {
    marginBottom: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  originBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  euBadge: {
    backgroundColor: '#4CD964',
  },
  nonEuBadge: {
    backgroundColor: '#FF3B30',
  },
  unknownBadge: {
    backgroundColor: '#FF9500',
  },
  originText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  companyText: {
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
  },
  barcodeText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 30,
  },
  scanAgainButton: {
    backgroundColor: '#0052B4',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  scanAgainButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 12,
    textAlign: 'center',
  },
  icon: {
    marginBottom: 16,
  },
  webDemo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  webDemoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#0052B4',
  },
  webDemoText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  demoButtons: {
    width: '100%',
  },
  demoButton: {
    backgroundColor: '#0052B4',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  demoButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
});