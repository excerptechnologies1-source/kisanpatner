import { usePathname, useRouter } from 'expo-router';
import { ClipboardList, Home, Truck, User } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface BottomNavigationProps {
  activeTab?: string;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab }) => {
  const router = useRouter();
  const pathname = usePathname();

  // ✅ Correct active tab detection
  const getActiveTab = () => {
    if (activeTab) return activeTab;

    if (pathname.includes('NewOrdersList')) return 'new-orders';
    if (pathname.includes('OngoingDeliveries')) return 'orders';
    if (pathname.includes('VehiclesPage')) return 'vehicles';
    if (pathname.includes('TransportProfile')) return 'profile';
    if (pathname.includes('TransportHome')) return 'dashboard';

    return 'dashboard';
  };

  const currentTab = getActiveTab();

  const tabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: (color: string) => <Home size={24} color={color} />,
      path: '/(tabs)/transporterpages/TransportHome',
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: (color: string) => <ClipboardList size={24} color={color} />,
      path: '/(tabs)/transporterpages/OngoingDeliveries',
      disableNavigation: true, // 🔹 added
    },
    {
      id: 'new-orders',
      label: 'New Orders',
      icon: (color: string) => <Truck size={24} color={color} />,
      path: '/(tabs)/transporterpages/NewOrdersList',
      disableNavigation: true, // 🔹 added
    },
    {
      id: 'vehicles',
      label: 'Vehicles',
      icon: (color: string) => <Truck size={24} color={color} />,
      path: '/(tabs)/transporterpages/TransportVehicles',
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: (color: string) => <User size={24} color={color} />,
      path: '/(tabs)/transporterpages/TransportProfile',
    },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;
        const color = isActive ? '#3498db' : '#666';

        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tabButton}
            activeOpacity={0.7}
            onPress={() => {
              if (tab.disableNavigation) {
                // ✅ clickable but NO navigation
                return;
              }
              router.replace(tab.path);
            }}
          >
            {tab.icon(color)}
            <Text
              style={[
                styles.tabLabel,
                { color, fontWeight: isActive ? 'bold' : 'normal' },
              ]}
            >
              {tab.label}
            </Text>
            {isActive && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    elevation: 5,
  },
  tabButton: {
    alignItems: 'center',
    width: 70,
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 4,
  },
  activeIndicator: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#3498db',
    marginTop: 4,
  },
});

export default BottomNavigation;