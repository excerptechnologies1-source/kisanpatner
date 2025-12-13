import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList,
  SafeAreaView,
  Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface Vehicle {
  id: string;
  vehicleType: string;
  vehicleNumber: string;
  capacity: string;
  rcBookStatus: 'verified' | 'pending' | 'expired';
  insuranceStatus: 'verified' | 'pending' | 'expired';
  pollutionStatus: 'verified' | 'pending' | 'expired';
  isActive: boolean;
}

const TransportVehicles: React.FC = () => {
  const navigation = useNavigation();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    // Mock data
    const mockVehicles: Vehicle[] = [
      {
        id: '1',
        vehicleType: 'Truck',
        vehicleNumber: 'TN-09-AB-1234',
        capacity: '10 ton',
        rcBookStatus: 'verified',
        insuranceStatus: 'pending',
        pollutionStatus: 'expired',
        isActive: true
      },
      {
        id: '2',
        vehicleType: 'Mini Truck',
        vehicleNumber: 'KA-01-CD-5678',
        capacity: '3 ton',
        rcBookStatus: 'pending',
        insuranceStatus: 'verified',
        pollutionStatus: 'verified',
        isActive: true
      },
      {
        id: '3',
        vehicleType: 'Container',
        vehicleNumber: 'MH-12-EF-9012',
        capacity: '20 ton',
        rcBookStatus: 'expired',
        insuranceStatus: 'expired',
        pollutionStatus: 'pending',
        isActive: false
      },
    ];
    
    setVehicles(mockVehicles);
  };

  const handleAddVehicle = () => {
    // Navigate to add vehicle form
    console.log('Add vehicle');
    // navigation.navigate('AddVehicle');
  };

  const handleEditVehicle = (vehicleId: string) => {
    console.log('Edit vehicle', vehicleId);
    // navigation.navigate('EditVehicle', { vehicleId });
  };

  const handleDeleteVehicle = (vehicleId: string) => {
    Alert.alert(
      'Delete Vehicle',
      'Are you sure you want to delete this vehicle?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            console.log('Delete vehicle', vehicleId);
            // Implement delete logic here
            setVehicles(prev => prev.filter(vehicle => vehicle.id !== vehicleId));
          },
        },
      ]
    );
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return '#27ae60';
      case 'pending': return '#f39c12';
      case 'expired': return '#e74c3c';
      default: return '#666';
    }
  };

  const renderVehicleItem = ({ item }: { item: Vehicle }) => (
    <View style={styles.vehicleCard}>
      {/* Vehicle Header */}
      <View style={styles.vehicleHeader}>
        <View>
          <Text style={styles.vehicleType}>{item.vehicleType}</Text>
          <Text style={styles.vehicleNumber}>{item.vehicleNumber}</Text>
        </View>
        
        <View style={[
          styles.statusBadge,
          { backgroundColor: item.isActive ? '#27ae60' : '#95a5a6' }
        ]}>
          <Text style={styles.statusText}>
            {item.isActive ? 'Active' : 'Inactive'}
          </Text>
        </View>
      </View>

      {/* Vehicle Details */}
      <View style={styles.vehicleDetails}>
        <Text style={styles.capacityText}>
          <Text style={styles.label}>Capacity: </Text>
          {item.capacity}
        </Text>
        
        {/* Document Status */}
        <View style={styles.documentsContainer}>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>RC Book:</Text>
            <Text style={[styles.statusValue, { color: getStatusColor(item.rcBookStatus) }]}>
              {item.rcBookStatus.toUpperCase()}
            </Text>
          </View>
          
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Insurance:</Text>
            <Text style={[styles.statusValue, { color: getStatusColor(item.insuranceStatus) }]}>
              {item.insuranceStatus.toUpperCase()}
            </Text>
          </View>
          
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Pollution Cert:</Text>
            <Text style={[styles.statusValue, { color: getStatusColor(item.pollutionStatus) }]}>
              {item.pollutionStatus.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          onPress={() => handleEditVehicle(item.id)}
          style={styles.editButton}
        >
          <Icon name="edit" size={16} color="white" />
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => handleDeleteVehicle(item.id)}
          style={styles.deleteButton}
        >
          <Icon name="trash" size={16} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>No vehicles added yet</Text>
      <TouchableOpacity
        onPress={handleAddVehicle}
        style={styles.addFirstVehicleButton}
      >
        <Icon name="plus" size={16} color="white" />
        <Text style={styles.addFirstVehicleText}>Add Your First Vehicle</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Icon name="arrow-left" size={20} color="#000" />
            </TouchableOpacity>
            <Text style={styles.title}>My Vehicles</Text>
          </View>
          
          <TouchableOpacity
            onPress={handleAddVehicle}
            style={styles.addButton}
          >
            <Icon name="plus" size={16} color="white" />
            <Text style={styles.addButtonText}>Add Vehicle</Text>
          </TouchableOpacity>
        </View>

        {/* Vehicles List */}
        <FlatList
          data={vehicles}
          renderItem={renderVehicleItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    padding: 20,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#27ae60',
    borderRadius: 5,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: 20,
  },
  vehicleCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  vehicleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  vehicleType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  vehicleNumber: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  vehicleDetails: {
    marginBottom: 20,
  },
  capacityText: {
    fontSize: 16,
    marginBottom: 15,
    color: '#000',
  },
  label: {
    fontWeight: 'bold',
  },
  documentsContainer: {
    gap: 8,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 14,
    color: '#666',
  },
  statusValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: '#3498db',
    borderRadius: 5,
  },
  editButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  deleteButton: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#e74c3c',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    marginTop: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  addFirstVehicleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 30,
    paddingVertical: 12,
    backgroundColor: '#3498db',
    borderRadius: 5,
  },
  addFirstVehicleText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default TransportVehicles;