import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { MapPin, PlayCircle } from 'lucide-react-native';

interface Delivery {
  id: string;
  orderId: string;
  status: 'Picked Up' | 'In Transit' | 'Reached';
  pickupLocation: string;
  deliveryLocation: string;
  cropName: string;
  progress: number; // 0-100
}

interface OngoingDeliveriesProps {
  deliveries: Delivery[];
  onContinueDelivery: (deliveryId: string) => void;
}

const OngoingDeliveries: React.FC<OngoingDeliveriesProps> = ({ deliveries, onContinueDelivery }) => {
  if (deliveries.length === 0) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Picked Up': return '#f39c12';
      case 'In Transit': return '#3498db';
      case 'Reached': return '#27ae60';
      default: return '#666';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🚚 Ongoing Deliveries</Text>
      <View style={styles.deliveriesGrid}>
        {deliveries.map((delivery) => (
          <View key={delivery.id} style={styles.deliveryCard}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.orderId}>Order: {delivery.orderId}</Text>
                <Text style={styles.cropName}>{delivery.cropName}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(delivery.status) }]}>
                <Text style={styles.statusText}>{delivery.status}</Text>
              </View>
            </View>

            <View style={styles.locationContainer}>
              <View style={styles.locationRow}>
                <Text style={styles.locationLabel}>From:</Text>
                <Text style={styles.locationValue}>{delivery.pickupLocation}</Text>
              </View>
              <View style={styles.locationRow}>
                <Text style={styles.locationLabel}>To:</Text>
                <Text style={styles.locationValue}>{delivery.deliveryLocation}</Text>
              </View>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${delivery.progress}%` }
                  ]} 
                />
              </View>
              <View style={styles.progressLabels}>
                <Text style={styles.progressLabel}>Pickup</Text>
                <Text style={styles.progressPercentage}>{delivery.progress}%</Text>
                <Text style={styles.progressLabel}>Delivery</Text>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.continueButton}
                onPress={() => onContinueDelivery(delivery.id)}
              >
                <PlayCircle size={20} color="white" />
                <Text style={styles.continueButtonText}>Continue Delivery</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.mapButton}
                onPress={() => onContinueDelivery(delivery.id)}
              >
                <MapPin size={20} color="#3498db" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
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
    color: '#3498db',
    marginBottom: 15,
  },
  deliveriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  deliveryCard: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderTopWidth: 4,
    borderTopColor: '#3498db',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cropName: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  locationContainer: {
    marginBottom: 15,
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  locationLabel: {
    fontSize: 14,
    color: '#666',
  },
  locationValue: {
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 10,
    textAlign: 'right',
  },
  progressContainer: {
    marginBottom: 15,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#ecf0f1',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3498db',
    borderRadius: 3,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  progressLabel: {
    fontSize: 12,
    color: '#666',
  },
  progressPercentage: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 15,
  },
  continueButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 10,
    backgroundColor: '#3498db',
    borderRadius: 5,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  mapButton: {
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default OngoingDeliveries;