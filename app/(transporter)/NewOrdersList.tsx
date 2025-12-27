import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { MapPin, Navigation, Sprout, Package, Navigation as Road } from 'lucide-react-native';

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

interface NewOrdersListProps {
  orders: Order[];
  onAccept: (orderId: string) => void;
  onReject: (orderId: string) => void;
  onViewDetails: (orderId: string) => void;
}

const NewOrdersList: React.FC<NewOrdersListProps> = ({ orders, onAccept, onReject, onViewDetails }) => {
  if (orders.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No new delivery requests available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🚨 New Delivery Requests (Top Priority)</Text>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {orders.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderGrid}>
              <View style={styles.orderInfo}>
                <MapPin size={20} color="#e74c3c" />
                <View style={styles.infoText}>
                  <Text style={styles.infoLabel}>Pickup From</Text>
                  <Text style={styles.infoValue}>{order.pickupLocation}</Text>
                </View>
              </View>

              <View style={styles.orderInfo}>
                <Navigation size={20} color="#3498db" />
                <View style={styles.infoText}>
                  <Text style={styles.infoLabel}>Deliver To</Text>
                  <Text style={styles.infoValue}>{order.deliveryLocation}</Text>
                </View>
              </View>

              <View style={styles.orderInfo}>
                <Sprout size={20} color="#27ae60" />
                <View style={styles.infoText}>
                  <Text style={styles.infoLabel}>Crop</Text>
                  <Text style={styles.infoValue}>{order.cropName}</Text>
                </View>
              </View>

              <View style={styles.orderInfo}>
                <Package size={20} color="#f39c12" />
                <View style={styles.infoText}>
                  <Text style={styles.infoLabel}>Quantity</Text>
                  <Text style={styles.infoValue}>
                    {order.quantity} {order.unit}
                  </Text>
                </View>
              </View>
            </View>

            {order.distance && (
              <View style={styles.distanceContainer}>
                <Road size={20} color="#9b59b6" />
                <Text style={styles.distanceText}>Distance: {order.distance} km</Text>
              </View>
            )}

            <View style={styles.orderFooter}>
              <View>
                <Text style={styles.farmerText}>Farmer: {order.farmerName}</Text>
                <Text style={styles.priceText}>Price: ₹{order.price}</Text>
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.viewButton]}
                  onPress={() => onViewDetails(order.id)}
                >
                  <Text style={styles.viewButtonText}>View Details</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.rejectButton]}
                  onPress={() => onReject(order.id)}
                >
                  <Text style={styles.rejectButtonText}>Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.acceptButton]}
                  onPress={() => onAccept(order.id)}
                >
                  <Text style={styles.acceptButtonText}>Accept</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 15,
  },
  scrollContainer: {
    maxHeight: 500,
  },
  emptyContainer: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    marginVertical: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#e74c3c',
  },
  orderGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  orderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 15,
  },
  infoText: {
    marginLeft: 10,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  distanceText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#333',
  },
  orderFooter: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  farmerText: {
    fontSize: 14,
    color: '#333',
  },
  priceText: {
    marginTop: 5,
    fontWeight: 'bold',
    color: '#27ae60',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#3498db',
  },
  viewButtonText: {
    color: '#3498db',
    fontSize: 14,
  },
  rejectButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#e74c3c',
  },
  rejectButtonText: {
    color: '#e74c3c',
    fontSize: 14,
  },
  acceptButton: {
    backgroundColor: '#27ae60',
  },
  acceptButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default NewOrdersList;










