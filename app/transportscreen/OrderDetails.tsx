import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';

interface RouteParams {
  orderId?: string;
}

const OrderDetails: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const params = route.params as RouteParams;
  const orderId = params?.orderId || '';
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching order details
    const fetchOrderDetails = async () => {
      setLoading(true);
      // Simulate API delay
      setTimeout(() => {
        const mockOrder = {
          id: orderId,
          farmerName: 'Rajesh Kumar',
          farmerPhone: '9876543210',
          crop: 'Tomatoes',
          quantity: '250 Boxes',
          price: 8500,
          pickup: 'Madurai',
          delivery: 'Chennai'
        };
        setOrder(mockOrder);
        setLoading(false);
      }, 500);
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Order not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details: {orderId}</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Farmer Name:</Text>
          <Text style={styles.detailValue}>{order.farmerName}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Farmer Phone:</Text>
          <Text style={styles.detailValue}>{order.farmerPhone}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Crop:</Text>
          <Text style={styles.detailValue}>{order.crop}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Quantity:</Text>
          <Text style={styles.detailValue}>{order.quantity}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Price:</Text>
          <Text style={styles.detailValue}>₹{order.price}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Pickup:</Text>
          <Text style={styles.detailValue}>{order.pickup}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Delivery:</Text>
          <Text style={styles.detailValue}>{order.delivery}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 18,
    color: '#e74c3c',
    textAlign: 'center',
    marginTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 10,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
});

export default OrderDetails;