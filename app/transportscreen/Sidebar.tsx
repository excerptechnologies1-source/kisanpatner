import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
} from 'react-native';
import {
  User,
  Edit,
  Eye,
  LogOut,
  X,
  Menu,
} from 'lucide-react-native';

interface UserData {
  id: string;
  name: string;
  mobileNo: string;
  email?: string;
  vehicleType?: string;
  vehicleNumber?: string;
}

interface SidebarProps {
  user: UserData | null;
  onLogout: () => void;
  onEditProfile: () => void;
  onViewProfile: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, onLogout, onEditProfile, onViewProfile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [slideAnim] = useState(new Animated.Value(-300));

  const toggleSidebar = () => {
    if (isOpen) {
      Animated.timing(slideAnim, {
        toValue: -300,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsOpen(false));
    } else {
      setIsOpen(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleAction = (action: () => void) => {
    action();
    toggleSidebar();
  };

  return (
    <>
      {/* Hamburger Button */}
      <TouchableOpacity
        style={styles.hamburgerButton}
        onPress={toggleSidebar}
      >
        {isOpen ? <X size={24} color="white" /> : <Menu size={24} color="white" />}
      </TouchableOpacity>

      {/* Sidebar Modal */}
      <Modal
        animationType="none"
        transparent={true}
        visible={isOpen}
        onRequestClose={toggleSidebar}
      >
        {/* Overlay */}
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={toggleSidebar}
        >
          {/* Sidebar Content */}
          <Animated.View
            style={[
              styles.sidebarContainer,
              {
                transform: [{ translateX: slideAnim }],
              },
            ]}
          >
            <View style={styles.sidebarContent}>
              {/* Profile Section */}
              {user ? (
                <>
                  <View style={styles.profileSection}>
                    <View style={styles.profileIcon}>
                      <User size={40} color="white" />
                    </View>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userPhone}>{user.mobileNo}</Text>
                    {user.vehicleType && (
                      <Text style={styles.vehicleInfo}>
                        {user.vehicleType} - {user.vehicleNumber}
                      </Text>
                    )}
                  </View>

                  {/* Menu Items */}
                  <View style={styles.menuContainer}>
                    <TouchableOpacity
                      style={styles.menuButton}
                      onPress={() => handleAction(onEditProfile)}
                    >
                      <Edit size={20} color="#3498db" />
                      <Text style={styles.menuButtonText}>Edit Profile</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.menuButton}
                      onPress={() => handleAction(onViewProfile)}
                    >
                      <Eye size={20} color="#2ecc71" />
                      <Text style={styles.menuButtonText}>View Profile</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.logoutButton}
                      onPress={() => handleAction(onLogout)}
                    >
                      <LogOut size={20} color="#e74c3c" />
                      <Text style={styles.logoutButtonText}>Logout</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <View style={styles.loadingContainer}>
                  <Text style={styles.loadingText}>Loading user data...</Text>
                </View>
              )}
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  hamburgerButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1001,
    backgroundColor: '#3498db',
    borderRadius: 5,
    padding: 10,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sidebarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 280,
    height: '100%',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  sidebarContent: {
    flex: 1,
    padding: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3498db',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  userPhone: {
    fontSize: 14,
    color: '#666',
    marginVertical: 5,
  },
  vehicleInfo: {
    fontSize: 14,
    color: '#3498db',
    marginVertical: 5,
  },
  menuContainer: {
    flexDirection: 'column',
    gap: 10,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  menuButtonText: {
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    backgroundColor: '#fff5f5',
    borderRadius: 8,
    marginTop: 20,
  },
  logoutButtonText: {
    fontSize: 16,
    color: '#e74c3c',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
});

export default Sidebar;