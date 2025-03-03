import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";
import { ScanLine, Info, Chrome as Home, Database, LoaderPinwheelIcon, Rabbit } from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#0052B4', // EU blue
        tabBarInactiveTintColor: '#555555',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        headerStyle: styles.header,
        headerTintColor: '#FFFFFF',
        headerTitleStyle: styles.headerTitle,
      }}
    >
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan',
          tabBarIcon: ({ color, size }) => <ScanLine size={size} color={color} />,
          headerTitle: 'Scan Product',
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: "About",
          tabBarIcon: ({ color, size }) => <Info size={size} color={color} />,
          headerTitle: "About Buy European",
        }}
      />
      <Tabs.Screen
        name="test"
        options={{
          href: __DEV__ ? undefined : null,
          title: "Test",
          tabBarIcon: ({ color, size }) => <Rabbit size={size} color={color} />,
          headerTitle: "Buy European",
        }}
      />
      <Tabs.Screen
        name="product"
        options={{
          href: null,
          // title: "Product",
          tabBarIcon: ({ color, size }) => <Rabbit size={size} color={color} />,
          // headerTitle: "Buy European",
          title: "",
          headerTintColor: "black",
          headerTransparent: true,
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