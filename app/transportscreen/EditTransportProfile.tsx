import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArrowLeft, Save, X, Upload } from 'lucide-react-native';

interface ProfileFormData {
  personalInfo: {
    name: string;
    mobileNo: string;
    email: string;
    address: string;
    villageGramaPanchayat: string;
    pincode: string;
    state: string;
    district: string;
    taluk: string;
    post: string;
    location: string;
  };
  transportInfo: {
    vehicleType: string;
    vehicleCapacity: {
      value: number;
      unit: string;
    };
    vehicleNumber: string;
    vehicleDocuments?: {
      rcBook?: string;
      insuranceDoc?: string;
      pollutionCert?: string;
      permitDoc?: string;
    };
    driverInfo: {
      driverName: string;
      driverMobileNo: string;
      driverAge: number;
    };
  };
  bankDetails: {
    accountHolderName: string;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    branch: string;
    upiId: string;
  };
  documents?: DocumentsType;
  rating?: number;
  totalTrips?: number;
}

interface DocumentsType {
  panCard?: string;
  aadharFront?: string;
  aadharBack?: string;
  bankPassbook?: string;
  rcBook?: string;
  insuranceDoc?: string;
  pollutionCert?: string;
  permitDoc?: string;
  driverLicense?: string;
  [key: string]: string | undefined;
}

const EditTransportProfile: React.FC = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState<ProfileFormData>({
    personalInfo: {
      name: '',
      mobileNo: '',
      email: '',
      address: '',
      villageGramaPanchayat: '',
      pincode: '',
      state: '',
      district: '',
      taluk: '',
      post: '',
      location: ''
    },
    transportInfo: {
      vehicleType: 'Truck',
      vehicleCapacity: { value: 0, unit: 'kg' },
      vehicleNumber: '',
      driverInfo: {
        driverName: '',
        driverMobileNo: '',
        driverAge: 0
      }
    },
    bankDetails: {
      accountHolderName: '',
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      branch: '',
      upiId: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [documents, setDocuments] = useState<DocumentsType>({});
  const [stats, setStats] = useState({
    rating: 0,
    totalTrips: 0
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setFetching(true);
      setError(null);
      setValidationErrors([]);
      
      const userId = await AsyncStorage.getItem('userId');
      const mobileNo = await AsyncStorage.getItem('phone');
      
      if (!userId && !mobileNo) {
        throw new Error('User not logged in');
      }

      let response;
      const API_BASE = 'https://kisan.etpl.ai/transport';
      
      if (userId && userId !== 'undefined') {
        try {
          response = await axios.get(`${API_BASE}/profile/${userId}`);
        } catch (idError) {
          if (mobileNo) {
            response = await axios.get(`${API_BASE}/mobile/${mobileNo}`);
          } else {
            throw idError;
          }
        }
      } else if (mobileNo) {
        response = await axios.get(`${API_BASE}/mobile/${mobileNo}`);
      }

      if (response?.data.success) {
        const userData = response.data.data;
        
        setFormData({
          personalInfo: {
            name: userData.personalInfo?.name || '',
            mobileNo: userData.personalInfo?.mobileNo || '',
            email: userData.personalInfo?.email || '',
            address: userData.personalInfo?.address || '',
            villageGramaPanchayat: userData.personalInfo?.villageGramaPanchayat || '',
            pincode: userData.personalInfo?.pincode || '',
            state: userData.personalInfo?.state || '',
            district: userData.personalInfo?.district || '',
            taluk: userData.personalInfo?.taluk || '',
            post: userData.personalInfo?.post || '',
            location: userData.personalInfo?.location || ''
          },
          transportInfo: {
            vehicleType: userData.transportInfo?.vehicleType || 'Truck',
            vehicleCapacity: userData.transportInfo?.vehicleCapacity || { value: 0, unit: 'kg' },
            vehicleNumber: userData.transportInfo?.vehicleNumber || '',
            vehicleDocuments: userData.transportInfo?.vehicleDocuments || {},
            driverInfo: {
              driverName: userData.transportInfo?.driverInfo?.driverName || '',
              driverMobileNo: userData.transportInfo?.driverInfo?.driverMobileNo || '',
              driverAge: userData.transportInfo?.driverInfo?.driverAge || 0
            }
          },
          bankDetails: {
            accountHolderName: userData.bankDetails?.accountHolderName || '',
            bankName: userData.bankDetails?.bankName || '',
            accountNumber: userData.bankDetails?.accountNumber || '',
            ifscCode: userData.bankDetails?.ifscCode || '',
            branch: userData.bankDetails?.branch || '',
            upiId: userData.bankDetails?.upiId || ''
          }
        });

        if (userData.documents) {
          setDocuments(userData.documents);
        }

        if (userData.rating || userData.totalTrips) {
          setStats({
            rating: userData.rating || 0,
            totalTrips: userData.totalTrips || 0
          });
        }
        
        if (!userId && userData._id) {
          await AsyncStorage.setItem('userId', userData._id);
        }

        await AsyncStorage.setItem('transporter_data', JSON.stringify(userData));
      } else {
        throw new Error(response?.data?.message || 'Failed to fetch profile');
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        setError('Profile not found. Please complete your registration first.');
      } else {
        setError(error.message || 'Failed to load profile data. Please check your connection.');
      }
    } finally {
      setFetching(false);
    }
  };

  const handleInputChange = (section: keyof ProfileFormData, field: string, value: any) => {
    setFormData(prev => {
      const sectionData = prev[section];
      
      if (typeof sectionData !== 'object' || sectionData === null) {
        return {
          ...prev,
          [section]: {
            [field]: value
          } as any
        };
      }
      
      return {
        ...prev,
        [section]: {
          ...sectionData,
          [field]: value
        }
      };
    });
    
    setValidationErrors([]);
  };

  const handleNestedChange = (section: keyof ProfileFormData, subSection: string, field: string, value: any) => {
    setFormData(prev => {
      const sectionData = prev[section];
      
      if (typeof sectionData !== 'object' || sectionData === null) {
        return {
          ...prev,
          [section]: {
            [subSection]: {
              [field]: value
            }
          } as any
        };
      }
      
      const subSectionData = (sectionData as any)[subSection];
      
      if (!subSectionData || typeof subSectionData !== 'object') {
        return {
          ...prev,
          [section]: {
            ...sectionData,
            [subSection]: {
              [field]: value
            }
          }
        };
      }
      
      return {
        ...prev,
        [section]: {
          ...sectionData,
          [subSection]: {
            ...subSectionData,
            [field]: value
          }
        }
      };
    });
    
    setValidationErrors([]);
  };

  const handleDocumentsChange = (field: keyof DocumentsType, value: string) => {
    setDocuments(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!formData.personalInfo.name.trim()) {
      errors.push('Full name is required');
    }
    if (!formData.personalInfo.address.trim()) {
      errors.push('Address is required');
    }
    if (!formData.personalInfo.pincode.trim() || !/^\d{6}$/.test(formData.personalInfo.pincode)) {
      errors.push('Valid 6-digit pincode is required');
    }
    if (!formData.personalInfo.state.trim()) {
      errors.push('State is required');
    }
    if (!formData.personalInfo.district.trim()) {
      errors.push('District is required');
    }
    if (!formData.personalInfo.taluk.trim()) {
      errors.push('Taluk is required');
    }

    if (!formData.transportInfo.vehicleNumber.trim()) {
      errors.push('Vehicle number is required');
    }
    if (!formData.transportInfo.vehicleCapacity.value || formData.transportInfo.vehicleCapacity.value <= 0) {
      errors.push('Valid vehicle capacity is required');
    }
    if (!formData.transportInfo.driverInfo.driverName.trim()) {
      errors.push('Driver name is required');
    }
    if (!formData.transportInfo.driverInfo.driverMobileNo.trim() || !/^\d{10}$/.test(formData.transportInfo.driverInfo.driverMobileNo)) {
      errors.push('Valid 10-digit driver mobile number is required');
    }
    if (!formData.transportInfo.driverInfo.driverAge || formData.transportInfo.driverInfo.driverAge < 18 || formData.transportInfo.driverInfo.driverAge > 70) {
      errors.push('Driver age must be between 18 and 70');
    }

    if (!formData.bankDetails.accountHolderName.trim()) {
      errors.push('Account holder name is required');
    }
    if (!formData.bankDetails.bankName.trim()) {
      errors.push('Bank name is required');
    }
    if (!formData.bankDetails.accountNumber.trim() || !/^\d{9,18}$/.test(formData.bankDetails.accountNumber)) {
      errors.push('Valid account number (9-18 digits) is required');
    }
    if (!formData.bankDetails.ifscCode.trim() || !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.bankDetails.ifscCode)) {
      errors.push('Valid IFSC code is required (format: ABCD0123456)');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setError('Please fix the validation errors below');
      return;
    }

    setLoading(true);
    setError(null);
    setValidationErrors([]);
    
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        throw new Error('User not logged in');
      }

      const updateData = {
        personalInfo: {
          name: formData.personalInfo.name,
          email: formData.personalInfo.email || '',
          address: formData.personalInfo.address,
          villageGramaPanchayat: formData.personalInfo.villageGramaPanchayat || '',
          pincode: formData.personalInfo.pincode,
          state: formData.personalInfo.state,
          district: formData.personalInfo.district,
          taluk: formData.personalInfo.taluk,
          post: formData.personalInfo.post || '',
          location: formData.personalInfo.location || ''
        },
        transportInfo: {
          vehicleType: formData.transportInfo.vehicleType,
          vehicleCapacity: {
            value: formData.transportInfo.vehicleCapacity.value,
            unit: formData.transportInfo.vehicleCapacity.unit
          },
          vehicleNumber: formData.transportInfo.vehicleNumber,
          driverInfo: {
            driverName: formData.transportInfo.driverInfo.driverName,
            driverMobileNo: formData.transportInfo.driverInfo.driverMobileNo,
            driverAge: formData.transportInfo.driverInfo.driverAge
          }
        },
        bankDetails: {
          accountHolderName: formData.bankDetails.accountHolderName,
          bankName: formData.bankDetails.bankName,
          accountNumber: formData.bankDetails.accountNumber,
          ifscCode: formData.bankDetails.ifscCode,
          branch: formData.bankDetails.branch || '',
          upiId: formData.bankDetails.upiId || ''
        }
      };

      const response = await axios.put(
        `https://kisan.etpl.ai/transport/profile/${userId}`,
        updateData,
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000
        }
      );
      
      if (response.data.success) {
        Alert.alert('Success', 'Profile updated successfully!');
        
        const storedData = await AsyncStorage.getItem('transporter_data');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          const updatedData = {
            ...parsedData,
            ...response.data.data
          };
          await AsyncStorage.setItem('transporter_data', JSON.stringify(updatedData));
        }
        
        navigation.goBack();
      } else {
        throw new Error(response.data.message || 'Failed to update profile');
      }
    } catch (error: any) {
      if (error.response?.data) {
        if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
          setValidationErrors(error.response.data.errors);
          setError('Please fix the following errors:');
        } else if (error.response.data.message) {
          setError(`Backend Error: ${error.response.data.message}`);
        } else {
          setError(`Server Error (${error.response.status}): Please try again.`);
        }
      } else if (error.request) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError(error.message || 'Failed to update profile. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const vehicleTypes = ['Pickup Van', 'Bolero', 'Tata Ace', 'Mini Truck', 'Lorry', 'Truck', 'Container', 'Trailer', 'Other'];
  const capacityUnits = ['kg', 'ton', 'quintal', 'boxes'];

  const documentFields = [
    { key: 'panCard', label: 'PAN Card' },
    { key: 'aadharFront', label: 'Aadhar Front' },
    { key: 'aadharBack', label: 'Aadhar Back' },
    { key: 'bankPassbook', label: 'Bank Passbook' },
    { key: 'rcBook', label: 'RC Book' },
    { key: 'insuranceDoc', label: 'Insurance Document' },
    { key: 'pollutionCert', label: 'Pollution Certificate' },
    { key: 'permitDoc', label: 'Permit Document' },
    { key: 'driverLicense', label: 'Driver License' }
  ];

  if (fetching) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#3498db" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Transport Profile</Text>
      </View>

      {/* Stats Overview */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.rating} ⭐</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.totalTrips}</Text>
          <Text style={styles.statLabel}>Total Trips</Text>
        </View>
      </View>

      {/* Error Display */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            <Text style={styles.boldText}>Error:</Text> {error}
          </Text>
        </View>
      )}

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <View style={styles.validationContainer}>
          <Text style={styles.validationTitle}>
            <Text style={styles.boldText}>Please fix the following errors:</Text>
          </Text>
          {validationErrors.map((error, index) => (
            <Text key={index} style={styles.validationError}>• {error}</Text>
          ))}
        </View>
      )}

      {/* Personal Information Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        
        <View style={styles.gridContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Full Name *
            </Text>
            <TextInput
              style={styles.input}
              value={formData.personalInfo.name}
              onChangeText={(text) => handleInputChange('personalInfo', 'name', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Mobile Number
            </Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={formData.personalInfo.mobileNo}
              editable={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Email Address
            </Text>
            <TextInput
              style={styles.input}
              value={formData.personalInfo.email}
              onChangeText={(text) => handleInputChange('personalInfo', 'email', text)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={[styles.inputGroup, styles.fullWidth]}>
            <Text style={styles.label}>
              Complete Address *
            </Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.personalInfo.address}
              onChangeText={(text) => handleInputChange('personalInfo', 'address', text)}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Village/Grama Panchayat
            </Text>
            <TextInput
              style={styles.input}
              value={formData.personalInfo.villageGramaPanchayat}
              onChangeText={(text) => handleInputChange('personalInfo', 'villageGramaPanchayat', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Pincode *
            </Text>
            <TextInput
              style={styles.input}
              value={formData.personalInfo.pincode}
              onChangeText={(text) => handleInputChange('personalInfo', 'pincode', text)}
              keyboardType="number-pad"
              maxLength={6}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              State *
            </Text>
            <TextInput
              style={styles.input}
              value={formData.personalInfo.state}
              onChangeText={(text) => handleInputChange('personalInfo', 'state', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              District *
            </Text>
            <TextInput
              style={styles.input}
              value={formData.personalInfo.district}
              onChangeText={(text) => handleInputChange('personalInfo', 'district', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Taluk *
            </Text>
            <TextInput
              style={styles.input}
              value={formData.personalInfo.taluk}
              onChangeText={(text) => handleInputChange('personalInfo', 'taluk', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Post Office
            </Text>
            <TextInput
              style={styles.input}
              value={formData.personalInfo.post}
              onChangeText={(text) => handleInputChange('personalInfo', 'post', text)}
            />
          </View>
        </View>
      </View>

      {/* Transport Information Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Transport Information</Text>
        
        <View style={styles.gridContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Vehicle Type *
            </Text>
            <View style={styles.pickerContainer}>
              {vehicleTypes.map(type => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.pickerOption,
                    formData.transportInfo.vehicleType === type && styles.pickerOptionSelected
                  ]}
                  onPress={() => handleInputChange('transportInfo', 'vehicleType', type)}
                >
                  <Text style={[
                    styles.pickerOptionText,
                    formData.transportInfo.vehicleType === type && styles.pickerOptionTextSelected
                  ]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Vehicle Number *
            </Text>
            <TextInput
              style={styles.input}
              value={formData.transportInfo.vehicleNumber}
              onChangeText={(text) => handleInputChange('transportInfo', 'vehicleNumber', text.toUpperCase())}
              placeholder="e.g., TN01AB1234"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Vehicle Capacity *
            </Text>
            <View style={styles.capacityContainer}>
              <TextInput
                style={[styles.input, styles.capacityInput]}
                value={formData.transportInfo.vehicleCapacity.value.toString()}
                onChangeText={(text) => handleNestedChange('transportInfo', 'vehicleCapacity', 'value', parseInt(text) || 0)}
                keyboardType="number-pad"
              />
              <View style={styles.unitContainer}>
                {capacityUnits.map(unit => (
                  <TouchableOpacity
                    key={unit}
                    style={[
                      styles.unitOption,
                      formData.transportInfo.vehicleCapacity.unit === unit && styles.unitOptionSelected
                    ]}
                    onPress={() => handleNestedChange('transportInfo', 'vehicleCapacity', 'unit', unit)}
                  >
                    <Text style={[
                      styles.unitText,
                      formData.transportInfo.vehicleCapacity.unit === unit && styles.unitTextSelected
                    ]}>
                      {unit}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View style={[styles.inputGroup, styles.fullWidth]}>
            <Text style={styles.subSectionTitle}>Driver Information</Text>
            <View style={styles.gridContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Driver Name *
                </Text>
                <TextInput
                  style={styles.input}
                  value={formData.transportInfo.driverInfo.driverName}
                  onChangeText={(text) => handleNestedChange('transportInfo', 'driverInfo', 'driverName', text)}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Driver Mobile No. *
                </Text>
                <TextInput
                  style={styles.input}
                  value={formData.transportInfo.driverInfo.driverMobileNo}
                  onChangeText={(text) => handleNestedChange('transportInfo', 'driverInfo', 'driverMobileNo', text)}
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Driver Age *
                </Text>
                <TextInput
                  style={styles.input}
                  value={formData.transportInfo.driverInfo.driverAge.toString()}
                  onChangeText={(text) => handleNestedChange('transportInfo', 'driverInfo', 'driverAge', parseInt(text) || 0)}
                  keyboardType="number-pad"
                />
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Bank Details Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Bank Details</Text>
        
        <View style={styles.gridContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Account Holder Name *
            </Text>
            <TextInput
              style={styles.input}
              value={formData.bankDetails.accountHolderName}
              onChangeText={(text) => handleInputChange('bankDetails', 'accountHolderName', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Bank Name *
            </Text>
            <TextInput
              style={styles.input}
              value={formData.bankDetails.bankName}
              onChangeText={(text) => handleInputChange('bankDetails', 'bankName', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Account Number *
            </Text>
            <TextInput
              style={styles.input}
              value={formData.bankDetails.accountNumber}
              onChangeText={(text) => handleInputChange('bankDetails', 'accountNumber', text)}
              keyboardType="number-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              IFSC Code *
            </Text>
            <TextInput
              style={styles.input}
              value={formData.bankDetails.ifscCode}
              onChangeText={(text) => handleInputChange('bankDetails', 'ifscCode', text.toUpperCase())}
              placeholder="ABCD0123456"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Branch
            </Text>
            <TextInput
              style={styles.input}
              value={formData.bankDetails.branch}
              onChangeText={(text) => handleInputChange('bankDetails', 'branch', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              UPI ID
            </Text>
            <TextInput
              style={styles.input}
              value={formData.bankDetails.upiId}
              onChangeText={(text) => handleInputChange('bankDetails', 'upiId', text)}
              placeholder="username@bank"
              autoCapitalize="none"
            />
          </View>
        </View>
      </View>

      {/* Documents Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Documents</Text>
        
        <View style={styles.gridContainer}>
          {documentFields.map(doc => (
            <View key={doc.key} style={styles.inputGroup}>
              <Text style={styles.label}>
                {doc.label}
              </Text>
              <View style={styles.documentInputContainer}>
                <TextInput
                  style={[styles.input, styles.documentInput]}
                  value={documents[doc.key] || ''}
                  onChangeText={(text) => handleDocumentsChange(doc.key, text)}
                  placeholder={`Enter ${doc.label} number`}
                />
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={() => console.log(`Upload ${doc.label}`)}
                >
                  <Upload size={20} color="#3498db" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <X size={20} color="#666" />
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.saveButton, loading && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <>
              <ActivityIndicator size="small" color="white" />
              <Text style={styles.saveButtonText}>Saving...</Text>
            </>
          ) : (
            <>
              <Save size={20} color="white" />
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 20,
    color: '#666',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  statsContainer: {
    backgroundColor: '#667eea',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  statLabel: {
    fontSize: 14,
    color: 'white',
  },
  errorContainer: {
    backgroundColor: '#ffeaea',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ffcdcd',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
  },
  validationContainer: {
    backgroundColor: '#fff3cd',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ffeaa7',
  },
  validationTitle: {
    color: '#856404',
    fontSize: 14,
    marginBottom: 10,
  },
  validationError: {
    color: '#856404',
    fontSize: 14,
    marginLeft: 10,
    marginBottom: 5,
  },
  boldText: {
    fontWeight: 'bold',
  },
  sectionContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  sectionTitle: {
    color: '#2c3e50',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#f0f0f0',
  },
  subSectionTitle: {
    color: '#2c3e50',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  inputGroup: {
    width: '48%',
    marginBottom: 15,
  },
  fullWidth: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    fontSize: 16,
    backgroundColor: 'white',
  },
  disabledInput: {
    backgroundColor: '#f5f5f5',
    color: '#666',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  pickerOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#f8f9fa',
  },
  pickerOptionSelected: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  pickerOptionText: {
    fontSize: 14,
    color: '#666',
  },
  pickerOptionTextSelected: {
    color: 'white',
    fontWeight: 'bold',
  },
  capacityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  capacityInput: {
    flex: 1,
    marginRight: 10,
  },
  unitContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  unitOption: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 5,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 3,
  },
  unitOptionSelected: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  unitText: {
    fontSize: 12,
    color: '#666',
  },
  unitTextSelected: {
    color: 'white',
    fontWeight: 'bold',
  },
  documentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  documentInput: {
    flex: 1,
  },
  uploadButton: {
    padding: 10,
    marginLeft: 10,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 15,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
  },
  saveButton: {
    backgroundColor: '#3498db',
  },
  saveButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
  },
  disabledButton: {
    opacity: 0.7,
  },
});

export default EditTransportProfile;