import { View, Text, StyleSheet, ScrollView, Image, Linking, TouchableOpacity, Share } from 'react-native';
import { ExternalLink, Mail, Flag, Heart } from 'lucide-react-native';

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1467733037332-340204010293?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' }}
          style={styles.headerImage}
        />
        <View style={styles.overlay}>
          <Text style={styles.title}>About Buy European</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Share the App</Text>
        <Text style={styles.paragraph}>
          Love using Buy European? Share it with your friends and family!
        </Text>
        <TouchableOpacity
          style={styles.contactButton}
          onPress={() => {
            Share.share({
              message:
                'Check out Buy European – the app that helps you find products made by European companies. Available now:\n\nAndroid: https://play.google.com/store/apps/details?id=com.carsam.buyeuropean\nApple: https://apps.apple.com/lt/app/buy-european/id6742723534',
            });
          }}
        >
          <ExternalLink size={20} color="#FFFFFF" style={styles.contactIcon} />
          <Text style={styles.contactButtonText}>Share App</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Mission</Text>
        <Text style={styles.paragraph}>
          Buy European is an initiative to help consumers make informed choices about the products they purchase. 
          By identifying products made in Europe or by European companies, we aim to support local economies, 
          reduce carbon footprints from long-distance shipping, and preserve European jobs and traditions.
        </Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How It Works</Text>
        <Text style={styles.paragraph}>
          Our app allows you to scan product barcodes to instantly check if a product is made in Europe 
          or by a European company. We maintain a database of thousands of products and their parent companies, 
          which is regularly updated to ensure accuracy.
        </Text>
        <Text style={styles.paragraph}>
          When you scan a product, we check our database and show you:
        </Text>
        <View style={styles.featureList}>
          <View style={styles.featureItem}>
            <Flag size={20} color="#0052B4" style={styles.featureIcon} />
            <Text style={styles.featureText}>Product origin (European or non-European)</Text>
          </View>
          <View style={styles.featureItem}>
            <Flag size={20} color="#0052B4" style={styles.featureIcon} />
            <Text style={styles.featureText}>Parent company information</Text>
          </View>
          <View style={styles.featureItem}>
            <Flag size={20} color="#0052B4" style={styles.featureIcon} />
            <Text style={styles.featureText}>Country of company headquarters</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Why Buy European?</Text>
        <Text style={styles.paragraph}>
          Choosing European products helps:
        </Text>
        <View style={styles.featureList}>
          <View style={styles.featureItem}>
            <Heart size={20} color="#0052B4" style={styles.featureIcon} />
            <Text style={styles.featureText}>Support local economies and jobs</Text>
          </View>
          <View style={styles.featureItem}>
            <Heart size={20} color="#0052B4" style={styles.featureIcon} />
            <Text style={styles.featureText}>Reduce carbon emissions from long-distance shipping</Text>
          </View>
          <View style={styles.featureItem}>
            <Heart size={20} color="#0052B4" style={styles.featureIcon} />
            <Text style={styles.featureText}>Preserve European manufacturing traditions</Text>
          </View>
          <View style={styles.featureItem}>
            <Heart size={20} color="#0052B4" style={styles.featureIcon} />
            <Text style={styles.featureText}>Ensure products meet EU quality and safety standards</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Us</Text>
        <Text style={styles.paragraph}>
          Have questions, suggestions, or want to report incorrect product information? 
          We'd love to hear from you!
        </Text>
        <TouchableOpacity 
          style={styles.contactButton}
          onPress={() => Linking.openURL('mailto:buy-european@googlegroups.com')}
        >
          <Mail size={20} color="#FFFFFF" style={styles.contactIcon} />
          <Text style={styles.contactButtonText}>Email Us</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Buy European © 2025</Text>
        <TouchableOpacity 
          style={styles.privacyLink}
          onPress={() => Linking.openURL('https://drive.google.com/file/d/1qqlubS33ZvgFQXVepW4A8g1a0u0Cgqw5/view?usp=sharing')}
        >
          <Text style={styles.privacyLinkText}>Privacy Policy</Text>
          <ExternalLink size={16} color="#0052B4" style={styles.linkIcon} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    position: 'relative',
    height: 200,
    marginBottom: 20,
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 82, 180, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0052B4',
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333333',
    marginBottom: 16,
  },
  featureList: {
    marginLeft: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#333333',
    flex: 1,
  },
  contactButton: {
    backgroundColor: '#0052B4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  contactIcon: {
    marginRight: 8,
  },
  contactButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
  },
  privacyLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  privacyLinkText: {
    fontSize: 14,
    color: '#0052B4',
    marginRight: 4,
  },
  linkIcon: {
    marginLeft: 4,
  },
});