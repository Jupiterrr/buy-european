import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { AlertCircle, CheckCircle, ScanLine, XCircle } from 'lucide-react-native';
import { useState } from 'react';
import { Button, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Mock database of products
// In a real app, this would be fetched from an API
const productDatabase = {
  '8710447319239': { name: 'Philips Shaver', origin: 'EU', company: 'Philips', country: 'Netherlands' },
  '5000112637922': { name: 'Cadbury Chocolate', origin: 'Non-EU', company: 'Mondelez International', country: 'USA' },
  '3017620422003': { name: 'Nutella', origin: 'EU', company: 'Ferrero', country: 'Italy' },
  '8001505005592': { name: 'Barilla Pasta', origin: 'EU', company: 'Barilla', country: 'Italy' },
  '5449000000996': { name: 'Coca-Cola', origin: 'Non-EU', company: 'The Coca-Cola Company', country: 'USA' },
  '4008400202037': { name: 'Haribo Gummies', origin: 'EU', company: 'Haribo', country: 'Germany' },
  '3046920022651': { name: 'Lindt Chocolate', origin: 'EU', company: 'Lindt & Sprüngli', country: 'Switzerland' },
  '5000157024466': { name: 'Heinz Ketchup', origin: 'Non-EU', company: 'Kraft Heinz', country: 'USA' },
  '8000500033784': { name: 'Lavazza Coffee', origin: 'EU', company: 'Lavazza', country: 'Italy' },
  '3168930010265': { name: 'Evian Water', origin: 'EU', company: 'Danone', country: 'France' },
};

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();

  const [scanned, setScanned] = useState(false);
  const [product, setProduct] = useState<any>(null);

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




  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    // setScanned(true);
    alert(`Barcode type: ${type}\nData: ${data}`);

    return;
  };

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
          {product.origin === 'EU' ? (
            <CheckCircle size={80} color="#4CD964" style={styles.resultIcon} />
          ) : product.origin === 'Non-EU' ? (
            <XCircle size={80} color="#FF3B30" style={styles.resultIcon} />
          ) : (
            <AlertCircle size={80} color="#FF9500" style={styles.resultIcon} />
          )}
          
          <Text style={styles.productName}>{product.name}</Text>
          
          {product.origin === 'EU' ? (
            <View style={[styles.originBadge, styles.euBadge]}>
              <Text style={styles.originText}>European Product</Text>
            </View>
          ) : product.origin === 'Non-EU' ? (
            <View style={[styles.originBadge, styles.nonEuBadge]}>
              <Text style={styles.originText}>Non-European Product</Text>
            </View>
          ) : (
            <View style={[styles.originBadge, styles.unknownBadge]}>
              <Text style={styles.originText}>Unknown Origin</Text>
            </View>
          )}
          
          {product.company && (
            <Text style={styles.companyText}>
              Company: {product.company} ({product.country})
            </Text>
          )}
          
          {product.barcode && (
            <Text style={styles.barcodeText}>Barcode: {product.barcode}</Text>
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