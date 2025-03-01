import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import { ScanLine, Info, Chrome as Home, Database } from 'lucide-react-native';

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
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          headerTitle: 'Buy European',
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan',
          tabBarIcon: ({ color, size }) => <ScanLine size={size} color={color} />,
          headerTitle: 'Scan Product',
        }}
      />
      <Tabs.Screen
        name="database"
        options={{
          title: 'Database',
          tabBarIcon: ({ color, size }) => <Database size={size} color={color} />,
          headerTitle: 'Product Database',
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'About',
          tabBarIcon: ({ color, size }) => <Info size={size} color={color} />,
          headerTitle: 'About Buy European',
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