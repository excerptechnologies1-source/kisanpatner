import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { Home, ClipboardList, Truck, User } from 'lucide-react-native';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={24} color="#666" /> },
    { id: 'orders', label: 'Orders', icon: <ClipboardList size={24} color="#666" /> },
    { id: 'new-orders', label: 'New Orders', icon: <Truck size={24} color="#666" /> },
    { id: 'vehicles', label: 'Vehicles', icon: <Truck size={24} color="#666" /> },
    { id: 'profile', label: 'Profile', icon: <User size={24} color="#666" /> }
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          onPress={() => onTabChange(tab.id)}
          style={styles.tabButton}
        >
          <View style={styles.iconContainer}>
            {React.cloneElement(tab.icon, {
              color: activeTab === tab.id ? '#3498db' : '#666',
              size: 24
            })}
          </View>
          <Text style={[
            styles.tabLabel,
            { color: activeTab === tab.id ? '#3498db' : '#666' }
          ]}>
            {tab.label}
          </Text>
          {activeTab === tab.id && (
            <View style={styles.activeIndicator} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 100,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  tabButton: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  iconContainer: {
    marginBottom: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 24,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  activeIndicator: {
    width: 5,
    height: 5,
    backgroundColor: '#3498db',
    borderRadius: 2.5,
    marginTop: 5,
  },
});

export default BottomNavigation;