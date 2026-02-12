import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";
import { ScanLine, Info, Rabbit, Search } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#0052B4', // EU blue
        tabBarInactiveTintColor: '#555555',
        tabBarStyle: [
          styles.tabBar,
          {
            height: 60 + insets.bottom,
            paddingBottom: insets.bottom,
          },
        ],
        tabBarLabelStyle: styles.tabBarLabel,
        headerStyle: styles.header,
        headerTintColor: '#FFFFFF',
        headerTitleStyle: styles.headerTitle,
      }}
    >
      <Tabs.Screen
        name="scan"
        options={{
          title: t("tabs.scan"),
          tabBarIcon: ({ color, size }) => <ScanLine size={size} color={color} />,
          headerTitle: t("headers.scanProduct"),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: t("tabs.search"),
          tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
          headerTitle: t("headers.search"),
        }}
      />
      
      <Tabs.Screen
        name="about"
        options={{
          title: t("tabs.about"),
          tabBarIcon: ({ color, size }) => <Info size={size} color={color} />,
          headerTitle: t("headers.aboutBuyEuropean"),
        }}
      />
      
      <Tabs.Screen
        name="test"
        options={{
          href: __DEV__ ? undefined : null,
          title: t("tabs.test"),
          tabBarIcon: ({ color, size }) => <Rabbit size={size} color={color} />,
          headerTitle: t("common.appName"),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopColor: '#DDDDDD',
    height: 60,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  header: {
    backgroundColor: '#0052B4', // EU blue
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
});
