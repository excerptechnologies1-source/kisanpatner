import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';

// Type Definitions
interface VehicleCapacity {
  value: number;
  unit: string;
}

interface VehicleDocuments {
  rcBook: string;
  insuranceDoc?: string;
  pollutionCert?: string;
  permitDoc?: string;
}

interface DriverInfo {
  driverName: string;
  driverMobileNo: string;
  driverAge: number;
  driverLicense?: string;
  driverPhoto?: string;
}

interface Vehicle {
  _id: string;
  vehicleType: string;
  vehicleCapacity: VehicleCapacity;
  vehicleNumber: string;
  vehicleDocuments: VehicleDocuments;
  driverInfo: DriverInfo;
  isActive: boolean;
  primaryVehicle: boolean;
  addedAt: string;
}

interface PersonalInfo {
  name: string;
  mobileNo: string;
  email?: string;
  address: string;
  villageGramaPanchayat?: string;
  pincode: string;
  state: string;
  district: string;
  taluk: string;
  post?: string;
  location?: string;
}

interface TransportInfo {
  vehicleCapacity: VehicleCapacity;
  vehicleDocuments: VehicleDocuments;
  driverInfo: DriverInfo;
  isCompany: boolean;
  vehicleType: string;
  vehicleNumber: string;
  vehicles?: Vehicle[];
}

interface BankDetails {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branch?: string;
  upiId?: string;
}

interface Transporter {
  _id: string;
  personalInfo: PersonalInfo;
  transportInfo: TransportInfo;
  bankDetails: BankDetails;
  role: string;
  isActive: boolean;
  rating: number;
  totalTrips: number;
  maxVehicles: number;
  vehicleCount: number;
  registeredAt: string;
  lastLogin?: string;
}

interface Product {
  cropBriefDetails: string;
  unitMeasurement: string;
}

interface Purchase {
  _id: string;
  product: Product;
  grade: string;
  quantity: number;
  totalAmount: number;
  purchaseDate: string;
  paymentStatus: string;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

const TraderOrder: React.FC = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [transporters, setTransporters] = useState<Transporter[]>([]);
  const [filteredTransporters, setFilteredTransporters] = useState<Transporter[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTransporter, setSelectedTransporter] = useState<Record<string, Transporter>>({});
  const [showTransporterModal, setShowTransporterModal] = useState<boolean>(false);
  const [currentPurchaseId, setCurrentPurchaseId] = useState<string | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedPincode, setSelectedPincode] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('');

  useEffect(() => {
    fetchPurchases();
    fetchTransporters();
  }, []);

  useEffect(() => {
    filterTransporters();
  }, [searchTerm, selectedPincode, selectedDistrict, selectedState, transporters]);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const traderId = await AsyncStorage.getItem('traderId');
      const response = await fetch(`https://kisan.etpl.ai/product/trader-purchases/${traderId}`);
      const data = await response.json();
      setPurchases(data.data || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching purchases:', error);
      setError('Failed to load purchases');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchTransporters = async () => {
    try {
      const response = await fetch('https://kisan.etpl.ai/transport/all');
      const data = await response.json();
      setTransporters(data.data || []);
      setFilteredTransporters(data.data || []);
    } catch (error) {
      console.error('Error fetching transporters:', error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchPurchases();
  };

  const filterTransporters = () => {
    let filtered = [...transporters];

    // Search by name, mobile, or vehicle number
    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.personalInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.personalInfo.mobileNo.includes(searchTerm) ||
        t.transportInfo.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by pincode
    if (selectedPincode) {
      filtered = filtered.filter(t => t.personalInfo.pincode === selectedPincode);
    }

    // Filter by district
    if (selectedDistrict) {
      filtered = filtered.filter(t => t.personalInfo.district === selectedDistrict);
    }

    // Filter by state
    if (selectedState) {
      filtered = filtered.filter(t => t.personalInfo.state === selectedState);
    }

    setFilteredTransporters(filtered);
  };

  const getUniquePincodes = () => {
    const pincodes = transporters.map(t => t.personalInfo.pincode);
    return ['', ...new Set(pincodes)].sort();
  };

  const getUniqueDistricts = () => {
    const districts = transporters.map(t => t.personalInfo.district);
    return ['', ...new Set(districts)].sort();
  };

  const getUniqueStates = () => {
    const states = transporters.map(t => t.personalInfo.state);
    return ['', ...new Set(states)].sort();
  };

  const openTransporterModal = (purchaseId: string) => {
    setCurrentPurchaseId(purchaseId);
    setShowTransporterModal(true);
    // Reset filters when opening modal
    setSearchTerm('');
    setSelectedPincode('');
    setSelectedDistrict('');
    setSelectedState('');
  };

  const selectTransporter = (transporter: Transporter) => {
    if (currentPurchaseId) {
      setSelectedTransporter({
        ...selectedTransporter,
        [currentPurchaseId]: transporter
      });
    }
    setShowTransporterModal(false);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedPincode('');
    setSelectedDistrict('');
    setSelectedState('');
  };

  const handlePayment = async (item: Purchase) => {
    try {
      const res = await fetch('https://kisan.etpl.ai/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: item.totalAmount,
          purchaseId: item._id,
          transporterId: selectedTransporter[item._id]?._id,
        }),
      });

      const data = await res.json();

      // Note: Razorpay integration in React Native requires additional setup
      // You'll need to install react-native-razorpay or use Razorpay's React Native SDK
      Alert.alert(
        'Payment',
        'Razorpay integration requires react-native-razorpay package. Please integrate the payment gateway.',
        [{ text: 'OK' }]
      );
      
      // Example placeholder for Razorpay integration
      // import RazorpayCheckout from 'react-native-razorpay';
      // var options = {
      //   description: item.product.cropBriefDetails,
      //   image: 'https://your-logo-url.png',
      //   currency: 'INR',
      //   key: 'rzp_test_qUmhUFElBiSNIs',
      //   amount: data.order.amount,
      //   name: 'Farmer Marketplace',
      //   order_id: data.order.id,
      //   prefill: {
      //     email: 'user@example.com',
      //     contact: '9999999999',
      //     name: 'User Name'
      //   },
      //   theme: {color: '#198754'}
      // }
      // RazorpayCheckout.open(options).then((data) => {
      //   // handle success
      // }).catch((error) => {
      //   // handle failure
      // });

    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Error', 'Failed to initiate payment');
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#198754" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#198754']} />
      }
    >
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <Ionicons name="cube" size={28} color="#198754" />
          <Text style={styles.headerText}>My Purchases</Text>
        </View>
        <TouchableOpacity style={styles.refreshButton} onPress={fetchPurchases}>
          <Ionicons name="refresh" size={20} color="#198754" />
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={20} color="#dc3545" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {purchases.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="file-tray" size={80} color="#6c757d" />
          <Text style={styles.emptyTitle}>No purchases yet</Text>
          <Text style={styles.emptySubtitle}>Your purchase history will appear here.</Text>
        </View>
      ) : (
        <View style={styles.purchasesList}>
          {purchases.map((item) => (
            <View key={item._id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.product.cropBriefDetails}</Text>
              </View>
              <View style={styles.cardBody}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Grade: {item.grade}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Quantity:</Text>
                  <Text style={styles.detailValue}>
                    {item.quantity} {item.product.unitMeasurement}
                  </Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Total Amount:</Text>
                  <Text style={styles.amountText}>₹{item.totalAmount.toFixed(2)}</Text>
                </View>
                
                <View style={styles.divider} />

                {item.paymentStatus !== 'paid' && (
                  <View style={styles.transporterSection}>
                    {selectedTransporter[item._id] ? (
                      <View style={styles.selectedTransporterCard}>
                        <View style={styles.selectedTransporterInfo}>
                          <Ionicons name="car" size={16} color="#0dcaf0" />
                          <View style={styles.selectedTransporterText}>
                            <Text style={styles.transporterName}>
                              {selectedTransporter[item._id].personalInfo.name}
                            </Text>
                            <Text style={styles.transporterDetails}>
                              {selectedTransporter[item._id].transportInfo.vehicleType} - 
                              {selectedTransporter[item._id].transportInfo.vehicleNumber}
                            </Text>
                          </View>
                        </View>
                        <TouchableOpacity onPress={() => openTransporterModal(item._id)}>
                          <Text style={styles.changeButton}>Change</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={styles.selectTransporterButton}
                        onPress={() => openTransporterModal(item._id)}
                      >
                        <Ionicons name="car" size={18} color="#0d6efd" />
                        <Text style={styles.selectTransporterText}>Select Transporter</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}

                <View style={styles.detailRow}>
                  <Text style={styles.dateLabel}>Purchased:</Text>
                  <Text style={styles.dateValue}>
                    {new Date(item.purchaseDate).toLocaleString('en-IN')}
                  </Text>
                </View>

                {item.paymentStatus === 'paid' ? (
                  <TouchableOpacity style={styles.paidButton} disabled>
                    <Ionicons name="checkmark-circle" size={18} color="#fff" />
                    <Text style={styles.paidButtonText}>Paid</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[
                      styles.payButton,
                      !selectedTransporter[item._id] && styles.payButtonDisabled
                    ]}
                    onPress={() => handlePayment(item)}
                    disabled={!selectedTransporter[item._id]}
                  >
                    <Ionicons name="card" size={18} color="#fff" />
                    <Text style={styles.payButtonText}>Pay Now</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Transporter Selection Modal */}
      <Modal
        visible={showTransporterModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowTransporterModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderTitle}>
              <Ionicons name="car" size={24} color="#fff" />
              <Text style={styles.modalTitle}>Select Transporter</Text>
            </View>
            <TouchableOpacity onPress={() => setShowTransporterModal(false)}>
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            {/* Filter Section */}
            <View style={styles.filterCard}>
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>
                  <Ionicons name="search" size={16} /> Search
                </Text>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search by name, mobile, or vehicle number..."
                  value={searchTerm}
                  onChangeText={setSearchTerm}
                />
              </View>

              <View style={styles.filterRow}>
                <View style={styles.filterItem}>
                  <Text style={styles.filterLabel}>
                    <Ionicons name="mail" size={16} /> Pincode
                  </Text>
                  <Picker
                    selectedValue={selectedPincode}
                    onValueChange={setSelectedPincode}
                    style={styles.picker}
                  >
                    <Picker.Item label="All Pincodes" value="" />
                    {getUniquePincodes().slice(1).map(pincode => (
                      <Picker.Item key={pincode} label={pincode} value={pincode} />
                    ))}
                  </Picker>
                </View>

                <View style={styles.filterItem}>
                  <Text style={styles.filterLabel}>
                    <Ionicons name="business" size={16} /> District
                  </Text>
                  <Picker
                    selectedValue={selectedDistrict}
                    onValueChange={setSelectedDistrict}
                    style={styles.picker}
                  >
                    <Picker.Item label="All Districts" value="" />
                    {getUniqueDistricts().slice(1).map(district => (
                      <Picker.Item key={district} label={district} value={district} />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={styles.filterRow}>
                <View style={styles.filterItem}>
                  <Text style={styles.filterLabel}>
                    <Ionicons name="map" size={16} /> State
                  </Text>
                  <Picker
                    selectedValue={selectedState}
                    onValueChange={setSelectedState}
                    style={styles.picker}
                  >
                    <Picker.Item label="All States" value="" />
                    {getUniqueStates().slice(1).map(state => (
                      <Picker.Item key={state} label={state} value={state} />
                    ))}
                  </Picker>
                </View>

                <View style={styles.filterItem}>
                  <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
                    <Ionicons name="close-circle" size={18} color="#6c757d" />
                    <Text style={styles.clearButtonText}>Clear Filters</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.resultsCount}>
                Showing {filteredTransporters.length} of {transporters.length} transporters
              </Text>
            </View>

            {/* Transporter List */}
            {filteredTransporters.length === 0 ? (
              <View style={styles.emptyModal}>
                <Ionicons name="file-tray" size={60} color="#6c757d" />
                <Text style={styles.emptyModalText}>
                  No transporters found matching your filters
                </Text>
              </View>
            ) : (
              <View style={styles.transporterList}>
                {filteredTransporters.map((transporter) => (
                  <TouchableOpacity
                    key={transporter._id}
                    style={styles.transporterCard}
                    onPress={() => selectTransporter(transporter)}
                  >
                    <View style={styles.transporterHeader}>
                      <Text style={styles.transporterName}>{transporter.personalInfo.name}</Text>
                      <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={16} color="#ffc107" />
                        <Text style={styles.rating}>{transporter.rating}</Text>
                      </View>
                    </View>

                    <View style={styles.transporterInfo}>
                      <View style={styles.infoRow}>
                        <Ionicons name="call" size={14} color="#0d6efd" />
                        <Text style={styles.infoText}>{transporter.personalInfo.mobileNo}</Text>
                      </View>
                      <View style={styles.infoRow}>
                        <Ionicons name="car" size={14} color="#198754" />
                        <Text style={styles.infoText}>
                          {transporter.transportInfo.vehicleType} - {transporter.transportInfo.vehicleNumber}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.transporterDetails}>
                      <View style={styles.detailItem}>
                        <Ionicons name="mail" size={12} color="#6c757d" />
                        <Text style={styles.detailItemText}>{transporter.personalInfo.pincode}</Text>
                      </View>
                      <View style={styles.detailItem}>
                        <Ionicons name="business" size={12} color="#6c757d" />
                        <Text style={styles.detailItemText}>{transporter.personalInfo.district}</Text>
                      </View>
                      <View style={styles.detailItem}>
                        <Ionicons name="map" size={12} color="#6c757d" />
                        <Text style={styles.detailItemText}>{transporter.personalInfo.state}</Text>
                      </View>
                      <View style={styles.detailItem}>
                        <Ionicons name="cube" size={12} color="#6c757d" />
                        <Text style={styles.detailItemText}>
                          Capacity: {transporter.transportInfo.vehicleCapacity.value}{' '}
                          {transporter.transportInfo.vehicleCapacity.unit}
                        </Text>
                      </View>
                    </View>

                    {transporter.transportInfo.vehicles && transporter.transportInfo.vehicles.length > 0 && (
                      <View style={styles.vehicleBadge}>
                        <Text style={styles.vehicleBadgeText}>
                          {transporter.transportInfo.vehicles.length} vehicles available
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6c757d',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#212529',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#198754',
    borderRadius: 6,
  },
  refreshButtonText: {
    marginLeft: 4,
    color: '#198754',
    fontWeight: '600',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8d7da',
    padding: 12,
    margin: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#f5c2c7',
  },
  errorText: {
    marginLeft: 8,
    color: '#842029',
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6c757d',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 8,
  },
  purchasesList: {
    padding: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#198754',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    backgroundColor: 'rgba(25, 135, 84, 0.1)',
    padding: 12,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#198754',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#198754',
  },
  cardBody: {
    padding: 12,
  },
  badge: {
    backgroundColor: '#198754',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6c757d',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212529',
  },
  amountText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#198754',
  },
  divider: {
    height: 1,
    backgroundColor: '#dee2e6',
    marginVertical: 12,
  },
  transporterSection: {
    marginBottom: 12,
  },
  selectedTransporterCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#d1ecf1',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#bee5eb',
  },
  selectedTransporterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectedTransporterText: {
    marginLeft: 8,
    flex: 1,
  },
  transporterName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#212529',
  },
  transporterDetails: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 2,
  },
  changeButton: {
    color: '#0d6efd',
    fontSize: 14,
    fontWeight: '600',
  },
  selectTransporterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#0d6efd',
    padding: 12,
    borderRadius: 6,
  },
  selectTransporterText: {
    marginLeft: 8,
    color: '#0d6efd',
    fontSize: 14,
    fontWeight: '600',
  },
  dateLabel: {
    fontSize: 12,
    color: '#6c757d',
  },
  dateValue: {
    fontSize: 12,
    color: '#212529',
  },
  paidButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6c757d',
    padding: 12,
    borderRadius: 6,
    marginTop: 8,
  },
  paidButtonText: {
    marginLeft: 8,
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#198754',
    padding: 12,
    borderRadius: 6,
    marginTop: 8,
  },
  payButtonDisabled: {
    backgroundColor: '#adb5bd',
  },
  payButtonText: {
    marginLeft: 8,
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#198754',
    padding: 16,
    paddingTop: 40,
  },
  modalHeaderTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
  modalBody: {
    flex: 1,
  },
  filterCard: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    margin: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  filterSection: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 6,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  filterItem: {
    flex: 1,
  },
  picker: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 6,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#6c757d',
    padding: 10,
    borderRadius: 6,
    marginTop: 24,
  },
  clearButtonText: {
    marginLeft: 6,
    color: '#6c757d',
    fontSize: 14,
    fontWeight: '600',
  },
  resultsCount: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 8,
  },
  emptyModal: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyModalText: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 16,
    textAlign: 'center',
  },
  transporterList: {
    padding: 12,
  },
  transporterCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  transporterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: '#212529',
  },
  transporterInfo: {
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoText: {
    marginLeft: 6,
    fontSize: 12,
    color: '#212529',
  },
//   transporterDetails: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginTop: 8,
//   },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 4,
  },
  detailItemText: {
    marginLeft: 4,
    fontSize: 11,
    color: '#6c757d',
  },
  vehicleBadge: {
    backgroundColor: '#0dcaf0',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 8,
  },
  vehicleBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
});

export default TraderOrder;