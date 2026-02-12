import { View, Text, StyleSheet, ScrollView, Image, Linking, TouchableOpacity, Share } from 'react-native';
import { ExternalLink, Mail, Flag, Heart } from 'lucide-react-native';
import { useTranslation } from "react-i18next";

export default function AboutScreen() {
  const { t } = useTranslation();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1467733037332-340204010293?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' }}
          style={styles.headerImage}
        />
        <View style={styles.overlay}>
          <Text style={styles.title}>{t("about.title")}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("about.shareTitle")}</Text>
        <Text style={styles.paragraph}>
          {t("about.shareBody")}
        </Text>
        <TouchableOpacity
          style={styles.contactButton}
          onPress={() => {
            Share.share({
              message: t("about.shareMessage"),
            });
          }}
        >
          <ExternalLink size={20} color="#FFFFFF" style={styles.contactIcon} />
          <Text style={styles.contactButtonText}>{t("common.shareApp")}</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("about.missionTitle")}</Text>
        <Text style={styles.paragraph}>
          {t("about.missionBody")}
        </Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("about.howItWorksTitle")}</Text>
        <Text style={styles.paragraph}>
          {t("about.howItWorksBody")}
        </Text>
        <Text style={styles.paragraph}>
          {t("about.howItWorksLead")}
        </Text>
        <View style={styles.featureList}>
          <View style={styles.featureItem}>
            <Flag size={20} color="#0052B4" style={styles.featureIcon} />
            <Text style={styles.featureText}>{t("about.featureProductOrigin")}</Text>
          </View>
          <View style={styles.featureItem}>
            <Flag size={20} color="#0052B4" style={styles.featureIcon} />
            <Text style={styles.featureText}>{t("about.featureParentCompany")}</Text>
          </View>
          <View style={styles.featureItem}>
            <Flag size={20} color="#0052B4" style={styles.featureIcon} />
            <Text style={styles.featureText}>{t("about.featureHeadquarters")}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("about.whyTitle")}</Text>
        <Text style={styles.paragraph}>
          {t("about.whyLead")}
        </Text>
        <View style={styles.featureList}>
          <View style={styles.featureItem}>
            <Heart size={20} color="#0052B4" style={styles.featureIcon} />
            <Text style={styles.featureText}>{t("about.whyLocalEconomies")}</Text>
          </View>
          <View style={styles.featureItem}>
            <Heart size={20} color="#0052B4" style={styles.featureIcon} />
            <Text style={styles.featureText}>{t("about.whyCarbon")}</Text>
          </View>
          <View style={styles.featureItem}>
            <Heart size={20} color="#0052B4" style={styles.featureIcon} />
            <Text style={styles.featureText}>{t("about.whyTraditions")}</Text>
          </View>
          <View style={styles.featureItem}>
            <Heart size={20} color="#0052B4" style={styles.featureIcon} />
            <Text style={styles.featureText}>{t("about.whyStandards")}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("about.contactTitle")}</Text>
        <Text style={styles.paragraph}>
          {t("about.contactBody")}
        </Text>
        <TouchableOpacity 
          style={styles.contactButton}
          onPress={() => Linking.openURL('mailto:buy-european@googlegroups.com')}
        >
          <Mail size={20} color="#FFFFFF" style={styles.contactIcon} />
          <Text style={styles.contactButtonText}>{t("common.emailUs")}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>{t("about.copyright")}</Text>
        <TouchableOpacity 
          style={styles.privacyLink}
          onPress={() => Linking.openURL('https://buy-european-app.com/privacy')}
        >
          <Text style={styles.privacyLinkText}>{t("about.privacyPolicy")}</Text>
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
