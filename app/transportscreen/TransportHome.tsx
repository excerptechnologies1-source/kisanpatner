import React, { useState, useEffect } from 'react';
import { router } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Bell, Car, FileText, Phone, HelpCircle } from 'lucide-react-native';
import Sidebar from './Sidebar';
import StatsCards from './StatsCard';
import NewOrdersList from './NewOrdersList';
import OngoingDeliveries from './OngoingDeliveries';
import BottomNavigation from './BottomNavigation';

// Types
interface UserData {
  _id: string;
  personalInfo: {
    name: string;
    mobileNo: string;
    email?: string;
    address?: string;
    state?: string;
    district?: string;
  };
  transportInfo?: {
    vehicleType?: string;
    vehicleNumber?: string;
  };
  rating?: number;
  totalTrips?: number;
}

interface Order {
  id: string;
  pickupLocation: string;
  deliveryLocation: string;
  cropName: string;
  quantity: number;
  unit: string;
  distance?: number;
  farmerName: string;
  price: number;
}

interface Delivery {
  id: string;
  orderId: string;
  status: 'Picked Up' | 'In Transit' | 'Reached';
  pickupLocation: string;
  deliveryLocation: string;
  cropName: string;
  progress: number;
}

const TransportHome: React.FC = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    newOrders: 5,
    ongoingDeliveries: 3,
    completedDeliveries: 42,
    earnings: 12500
  });

  // Mock data for orders
  const [newOrders, setNewOrders] = useState<Order[]>([
    {
      id: 'ORD001',
      pickupLocation: 'Madurai, Tamil Nadu',
      deliveryLocation: 'Chennai, Tamil Nadu',
      cropName: 'Tomatoes',
      quantity: 250,
      unit: 'Boxes',
      distance: 450,
      farmerName: 'Rajesh Kumar',
      price: 8500
    },
    {
      id: 'ORD002',
      pickupLocation: 'Coimbatore, Tamil Nadu',
      deliveryLocation: 'Bangalore, Karnataka',
      cropName: 'Bananas',
      quantity: 150,
      unit: 'Bunches',
      distance: 350,
      farmerName: 'Suresh Babu',
      price: 6500
    }
  ]);

  const [ongoingDeliveries, _setOngoingDeliveries] = useState<Delivery[]>([
    {
      id: 'DLV001',
      orderId: 'ORD003',
      status: 'In Transit',
      pickupLocation: 'Trichy, Tamil Nadu',
      deliveryLocation: 'Hyderabad, Telangana',
      cropName: 'Mangoes',
      progress: 65
    },
    {
      id: 'DLV002',
      orderId: 'ORD004',
      status: 'Picked Up',
      pickupLocation: 'Salem, Tamil Nadu',
      deliveryLocation: 'Kochi, Kerala',
      cropName: 'Rice',
      progress: 20
    }
  ]);

  // Quick actions
  const quickActions = [
    { icon: <Car size={28} color="#3498db" />, label: 'Add Vehicle', action: () => console.log('Add Vehicle') },
    { icon: <FileText size={28} color="#3498db" />, label: 'Update Docs', action: () => console.log('Update Documents') },
    { icon: <Phone size={28} color="#3498db" />, label: 'Call Support', action: () => Linking.openURL('tel:+918888888888') },
    { icon: <HelpCircle size={28} color="#3498db" />, label: 'Help / FAQ', action: () => console.log('Help') }
  ];

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get user data from AsyncStorage
        const userId = await AsyncStorage.getItem('userId');
        const mobileNo = await AsyncStorage.getItem('phone');
        
        // Use the correct endpoint
        const API_BASE = 'https://kisan.etpl.ai/transport';
        
        let response;
        
        // Try to fetch by ID first
        if (userId && userId !== 'undefined') {
          try {
            response = await axios.get(`${API_BASE}/profile/${userId}`);
          } catch (idError) {
            // Try by mobile number if ID fails
            if (mobileNo) {
              response = await axios.get(`${API_BASE}/mobile/${mobileNo}`);
            } else {
              throw idError;
            }
          }
        } else if (mobileNo) {
          // If no userId, try by mobile number
          response = await axios.get(`${API_BASE}/mobile/${mobileNo}`);
        } else {
          throw new Error('No user ID or mobile number found');
        }

        if (response.data.success) {
          const userData = response.data.data;
          
          setUser(userData);
          
          // Update AsyncStorage with complete user data
          await AsyncStorage.setItem('userId', userData._id || userId || '');
          await AsyncStorage.setItem('transporter_data', JSON.stringify(userData));
          
          // Update stats based on user data
          if (userData.totalTrips) {
            setStats(prev => ({
              ...prev,
              completedDeliveries: userData.totalTrips || prev.completedDeliveries
            }));
          }
        } else {
          throw new Error(response.data.message || 'Failed to fetch user data');
        }
        
      } catch (error: any) {
        console.error('Error fetching user data:', error);
        
        // More specific error messages
        if (error.response?.status === 404) {
          setError('User profile not found. Please complete your registration.');
        } else if (error.response?.status === 401) {
          setError('Session expired. Please login again.');
          setTimeout(() => {
            navigation.navigate('Login' as never);
          }, 2000);
        } else {
          setError(error.message || 'Failed to load user data. Please check your connection.');
        }
        
        // Fallback to AsyncStorage data
        const storedData = await AsyncStorage.getItem('transporter_data');
        if (storedData) {
          try {
            const parsedData = JSON.parse(storedData);
            setUser({
              _id: parsedData._id || parsedData.id || (await AsyncStorage.getItem('userId')) || '',
              personalInfo: {
                name: parsedData.personalInfo?.name || parsedData.name || 'Transporter',
                mobileNo: parsedData.personalInfo?.mobileNo || parsedData.mobileNo || '',
                email: parsedData.personalInfo?.email || parsedData.email
              },
              transportInfo: parsedData.transportInfo
            });
          } catch (parseError) {
            console.error('Error parsing stored data:', parseError);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigation]);

  // Handlers
  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            // Clear AsyncStorage
            await AsyncStorage.multiRemove([
              'transporter_token',
              'transporter_data',
              'userId',
              'userData',
              'role',
              'isLoggedIn',
              'phone'
            ]);
            
          
          }
        }
      ]
    );
  };

  const handleEditProfile = () => {
    navigation.navigate('EditTransportProfile' as never);
  };

  const handleViewProfile = () => {
    navigation.navigate('TransportProfile' as never);
  };

  const handleAcceptOrder = (orderId: string) => {
    Alert.alert(
      'Accept Order',
      'Are you sure you want to accept this order?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Accept',
          onPress: () => {
            console.log('Accept order:', orderId);
            // API call to accept order
            setNewOrders(newOrders.filter(order => order.id !== orderId));
            setStats(prev => ({ ...prev, newOrders: prev.newOrders - 1 }));
          }
        }
      ]
    );
  };

  const handleRejectOrder = (orderId: string) => {
    Alert.alert(
      'Reject Order',
      'Are you sure you want to reject this order?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reject',
          onPress: () => {
            console.log('Reject order:', orderId);
            // API call to reject order
            setNewOrders(newOrders.filter(order => order.id !== orderId));
            setStats(prev => ({ ...prev, newOrders: prev.newOrders - 1 }));
          }
        }
      ]
    );
  };

  const handleViewDetails = (orderId: string) => {
  console.log("View details for order:", orderId);
  router.push({
    pathname: "/(tabs)/transporterpages/OrderDetails",
    params: { orderId },
  });
};

const handleContinueDelivery = (deliveryId: string) => {
  console.log("Continue delivery:", deliveryId);
  router.push({
    pathname: "/(tabs)/transporterpages/Livetrack",
    params: { deliveryId },
  });
};

  const handleNotificationClick = () => {
    console.log('Notification clicked');
    // Show notifications
  };

  // Get today's date
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Sidebar */}
      <Sidebar
        user={user ? {
          id: user._id,
          name: user.personalInfo.name,
          mobileNo: user.personalInfo.mobileNo,
          email: user.personalInfo.email,
          vehicleType: user.transportInfo?.vehicleType,
          vehicleNumber: user.transportInfo?.vehicleNumber
        } : null}
        onLogout={handleLogout}
        onEditProfile={handleEditProfile}
        onViewProfile={handleViewProfile}
      />

      {/* Main Content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        {/* Top Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>
              {user?.personalInfo.name || 'Transporter'}
            </Text>
            <Text style={styles.headerDate}>{today}</Text>
          </View>
          <TouchableOpacity
            onPress={handleNotificationClick}
            style={styles.notificationButton}
          >
            <Bell size={24} color="#3498db" />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <StatsCards {...stats} />

        {/* Quick Action Buttons */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.quickActionsTitle}>Quick Actions</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickActionsScroll}
          >
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                onPress={action.action}
                style={styles.quickActionButton}
              >
                {action.icon}
                <Text style={styles.quickActionText}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* New Orders Section */}
        <NewOrdersList
          orders={newOrders}
          onAccept={handleAcceptOrder}
          onReject={handleRejectOrder}
          onViewDetails={handleViewDetails}
        />

        {/* Ongoing Deliveries Section */}
        <OngoingDeliveries
          deliveries={ongoingDeliveries}
          onContinueDelivery={handleContinueDelivery}
        />
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100, // Extra space for bottom navigation
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#3498db',
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  headerDate: {
    marginTop: 5,
    fontSize: 14,
    color: '#7f8c8d',
  },
  notificationButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#e74c3c',
    borderRadius: 9,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  quickActionsContainer: {
    marginVertical: 20,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  quickActionsScroll: {
    paddingRight: 20,
  },
  quickActionButton: {
    width: 120,
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  quickActionText: {
    marginTop: 10,
    fontSize: 14,
    textAlign: 'center',
  },
});

export default TransportHome;