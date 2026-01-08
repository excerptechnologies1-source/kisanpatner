import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { router } from "expo-router";
import {
  ArrowLeft,
  Building,
  Car,
  CheckCircle,
  CreditCard,
  Download,
  Edit,
  Eye,
  FileText as FilePdf,
  FileText,
  Mail,
  MapPin,
  Phone,
  Shield,
  Truck,
  User,
  X
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface TransportProfileData {
  personalInfo: {
    name: string;
    mobileNo: string;
    email?: string;
    address: string;
    state: string;
    district: string;
    taluk: string;
    pincode: string;
    villageGramaPanchayat?: string;
    post?: string;
    location?: string;
  };
  transportInfo: {
    vehicleType: string;
    vehicleCapacity: {
      value: number;
      unit: string;
    };
    vehicleNumber: string;
    driverInfo?: {
      driverName?: string;
      driverMobileNo?: string;
      driverAge?: number;
    };
    vehicleDocuments?: {
      rcBook?: string;
      insuranceDoc?: string;
      pollutionCert?: string;
      permitDoc?: string;
    };
  };
  bankDetails: {
    accountHolderName: string;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    branch?: string;
    upiId?: string;
  };
  documents?: {
    panCard?: string;
    aadharFront?: string;
    aadharBack?: string;
    bankPassbook?: string;
    rcBook?: string;
    insuranceDoc?: string;
    pollutionCert?: string;
    permitDoc?: string;
    driverLicense?: string;
  };
  rating: number;
  totalTrips: number;
}

const TransportProfile: React.FC = () => {
  const navigation = useNavigation();
  const [profile, setProfile] = useState<TransportProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewingDocument, setViewingDocument] = useState<{name: string, url: string} | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
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
        
        setProfile({
          personalInfo: {
            name: userData.personalInfo?.name || '',
            mobileNo: userData.personalInfo?.mobileNo || '',
            email: userData.personalInfo?.email || '',
            address: userData.personalInfo?.address || '',
            state: userData.personalInfo?.state || '',
            district: userData.personalInfo?.district || '',
            taluk: userData.personalInfo?.taluk || '',
            pincode: userData.personalInfo?.pincode || '',
            villageGramaPanchayat: userData.personalInfo?.villageGramaPanchayat || '',
            post: userData.personalInfo?.post || '',
            location: userData.personalInfo?.location || ''
          },
          transportInfo: {
            vehicleType: userData.transportInfo?.vehicleType || '',
            vehicleCapacity: userData.transportInfo?.vehicleCapacity || { value: 0, unit: 'kg' },
            vehicleNumber: userData.transportInfo?.vehicleNumber || '',
            driverInfo: {
              driverName: userData.transportInfo?.driverInfo?.driverName || '',
              driverMobileNo: userData.transportInfo?.driverInfo?.driverMobileNo || '',
              driverAge: userData.transportInfo?.driverInfo?.driverAge || 0
            },
            vehicleDocuments: userData.transportInfo?.vehicleDocuments || {}
          },
          bankDetails: {
            accountHolderName: userData.bankDetails?.accountHolderName || '',
            bankName: userData.bankDetails?.bankName || '',
            accountNumber: userData.bankDetails?.accountNumber || '',
            ifscCode: userData.bankDetails?.ifscCode || '',
            branch: userData.bankDetails?.branch || '',
            upiId: userData.bankDetails?.upiId || ''
          },
          documents: userData.documents || {},
          rating: userData.rating || 0,
          totalTrips: userData.totalTrips || 0
        });
        
        if (!userId && userData._id) {
          await AsyncStorage.setItem('userId', userData._id);
        }
        
        await AsyncStorage.setItem('transporter_data', JSON.stringify(userData));
      } else {
        throw new Error(response?.data?.message || 'Failed to fetch profile');
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      
      if (error.response?.status === 404) {
        setError('Profile not found. Please complete your registration first.');
      } else if (error.response?.status === 401) {
        setError('Session expired. Please login again.');
        setTimeout(() => {
          navigation.navigate('Login' as never);
        }, 2000);
      } else {
        setError(error.message || 'Failed to load profile data. Please check your connection.');
      }
      
      const storedData = await AsyncStorage.getItem('transporter_data');
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          setProfile({
            personalInfo: {
              name: parsedData.name || '',
              mobileNo: parsedData.mobileNo || '',
              email: parsedData.email || '',
              address: parsedData.address || '',
              state: parsedData.state || '',
              district: parsedData.district || '',
              taluk: parsedData.taluk || '',
              pincode: parsedData.pincode || '',
              villageGramaPanchayat: parsedData.villageGramaPanchayat || '',
              post: parsedData.post || '',
              location: parsedData.location || ''
            },
            transportInfo: {
              vehicleType: parsedData.vehicleType || '',
              vehicleCapacity: { value: parsedData.capacity || 0, unit: 'kg' },
              vehicleNumber: parsedData.vehicleNumber || '',
              driverInfo: {
                driverName: parsedData.driverName || '',
                driverMobileNo: parsedData.driverMobileNo || ''
              },
              vehicleDocuments: parsedData.vehicleDocuments || {}
            },
            bankDetails: {
              accountHolderName: parsedData.accountHolderName || '',
              bankName: parsedData.bankName || '',
              accountNumber: parsedData.accountNumber || '',
              ifscCode: parsedData.ifscCode || '',
              branch: parsedData.branch || '',
              upiId: parsedData.upiId || ''
            },
            documents: parsedData.documents || {},
            rating: parsedData.rating || 0,
            totalTrips: parsedData.totalTrips || 0
          });
        } catch (parseError) {
          console.error('Error parsing stored data:', parseError);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    router.replace("/transportscreen/EditTransportProfile")
  };

  const handleViewDocument = (name: string, url: string) => {
    setViewingDocument({ name, url });
    setModalVisible(true);
  };

  const handleDownloadDocument = async (url: string, filename: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Cannot open this file');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to download document');
    }
  };

  const documentCategories = [
    {
      title: 'Personal Documents',
      icon: <User size={20} color="#3b82f6" />,
      documents: [
        { key: 'panCard', label: 'PAN Card', icon: <FileText size={20} color="#3b82f6" /> },
        { key: 'aadharFront', label: 'Aadhar Card (Front)', icon: <CreditCard size={20} color="#3b82f6" /> },
        { key: 'aadharBack', label: 'Aadhar Card (Back)', icon: <CreditCard size={20} color="#3b82f6" /> }
      ]
    },
    {
      title: 'Vehicle Documents',
      icon: <Car size={20} color="#3b82f6" />,
      documents: [
        { key: 'rcBook', label: 'RC Book', icon: <FileText size={20} color="#3b82f6" /> },
        { key: 'insuranceDoc', label: 'Insurance Document', icon: <Shield size={20} color="#3b82f6" /> },
        { key: 'pollutionCert', label: 'Pollution Certificate', icon: <FileText size={20} color="#3b82f6" /> },
        { key: 'permitDoc', label: 'Permit Document', icon: <FileText size={20} color="#3b82f6" /> },
        { key: 'driverLicense', label: 'Driver License', icon: <CreditCard size={20} color="#3b82f6" /> }
      ]
    },
    {
      title: 'Bank Documents',
      icon: <Building size={20} color="#3b82f6" />,
      documents: [
        { key: 'bankPassbook', label: 'Bank Passbook', icon: <CreditCard size={20} color="#3b82f6" /> }
      ]
    }
  ];

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-4 text-lg font-medium text-gray-600">Loading profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center p-6 bg-gray-50">
        <View className="w-full max-w-md bg-red-50 border border-red-200 rounded-xl p-6">
          <Text className="text-red-600 font-medium text-center mb-4">{error}</Text>
          <View className="flex-row gap-3 justify-center">
            <TouchableOpacity
              className="px-6 py-3 bg-blue-500 rounded-lg"
              onPress={fetchProfile}
            >
              <Text className="text-white font-medium">Retry</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="px-6 py-3 bg-green-500 rounded-lg"
              onPress={() => navigation.navigate('Login' as never)}
            >
              <Text className="text-white font-medium">Go to Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  if (!profile) {
    return (
      <View className="flex-1 items-center justify-center p-6 bg-gray-50">
        <View className="w-full max-w-md bg-orange-50 border border-orange-200 rounded-xl p-6">
          <Text className="text-orange-600 font-medium text-center mb-4">
            No profile data found. Please complete your registration.
          </Text>
          <TouchableOpacity
            className="px-6 py-3 bg-orange-500 rounded-lg self-center"
            onPress={() => navigation.navigate('TransportRegistration' as never)}
          >
            <Text className="text-white font-medium">Complete Registration</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Document Viewer Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-black/80 justify-center items-center p-5">
          <View className="bg-white rounded-xl w-full max-h-[90%] overflow-hidden">
            <View className="flex-row justify-between items-center p-6 border-b border-gray-200">
              <Text className="text-lg font-medium text-gray-800">
                {viewingDocument?.name || 'Document'}
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="p-2"
              >
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <ScrollView className="p-6">
              {viewingDocument?.url && viewingDocument.url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                <Image
                  source={{ uri: viewingDocument.url }}
                  className="w-full h-96 rounded-lg"
                  resizeMode="contain"
                />
              ) : (
                <View className="p-8 bg-gray-50 rounded-lg items-center">
                  <FilePdf size={80} color="#ef4444" />
                  <Text className="mt-4 text-gray-600 text-center font-medium">
                    PDF document: {viewingDocument?.name}
                  </Text>
                  <TouchableOpacity
                    className="mt-4 px-6 py-3 bg-blue-500 rounded-lg"
                    onPress={() => Linking.openURL(viewingDocument?.url || '')}
                  >
                    <Text className="text-white font-medium">Open Document</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
            <View className="flex-row gap-3 p-6 border-t border-gray-200">
              <TouchableOpacity
                className="flex-1 flex-row items-center justify-center gap-2 px-4 py-3 bg-green-500 rounded-lg"
                onPress={() => {
                  if (viewingDocument) {
                    handleDownloadDocument(viewingDocument.url, viewingDocument.name);
                  }
                }}
              >
                <Download size={20} color="white" />
                <Text className="text-white font-medium font-medium">Download</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="px-6 py-3 bg-red-500 rounded-lg"
                onPress={() => setModalVisible(false)}
              >
                <Text className="text-white font-medium">Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Main Content */}
      <ScrollView className="flex-1" contentContainerClassName="pb-8">
        {/* Header */}
        <View className="flex-row items-center justify-between p-6 bg-white border-b border-gray-200">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="p-2 rounded-full bg-gray-100"
          >
            <ArrowLeft size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-2xl font-medium text-gray-900">My Profile</Text>
          <TouchableOpacity
            className="flex-row items-center gap-2 px-4 py-2 bg-blue-500 rounded-lg"
            onPress={handleEditProfile}
          >
            <Edit size={18} color="white" />
            <Text className="text-white font-medium">Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Personal Information */}
        <View className="bg-white rounded-xl mx-6 mt-6 p-6 shadow-sm">
          <View className="flex-row items-center gap-3 mb-6 pb-4 border-b border-gray-200">
            <User size={24} color="#3b82f6" />
            <Text className="text-xl font-medium text-gray-900">Personal Information</Text>
          </View>
          
          <View className="space-y-4 mb-6">
            <View className="flex-row items-center gap-4">
              <View className="bg-blue-50 p-3 rounded-lg">
                <User size={20} color="#3b82f6" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-500">Full Name</Text>
                <Text className="text-base font-medium text-gray-900">{profile.personalInfo.name}</Text>
              </View>
            </View>

            <View className="flex-row items-center gap-4">
              <View className="bg-green-50 p-3 rounded-lg">
                <Phone size={20} color="#10b981" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-500">Mobile Number</Text>
                <Text className="text-base font-medium text-gray-900">{profile.personalInfo.mobileNo}</Text>
              </View>
            </View>

            <View className="flex-row items-center gap-4">
              <View className="bg-yellow-50 p-3 rounded-lg">
                <Mail size={20} color="#f59e0b" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-500">Email</Text>
                <Text className="text-base font-medium text-gray-900">
                  {profile.personalInfo.email || 'Not provided'}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center gap-4">
              <View className="bg-purple-50 p-3 rounded-lg">
                <MapPin size={20} color="#8b5cf6" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-500">Complete Address</Text>
                <Text className="text-base font-medium text-gray-900">{profile.personalInfo.address}</Text>
              </View>
            </View>
          </View>

          <View className="bg-gray-50 rounded-lg p-5">
            <View className="flex-row justify-between mb-4">
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-500">State</Text>
                <Text className="text-base font-medium text-gray-900">{profile.personalInfo.state}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-500">District</Text>
                <Text className="text-base font-medium text-gray-900">{profile.personalInfo.district}</Text>
              </View>
            </View>
            
            <View className="flex-row justify-between mb-4">
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-500">Taluk</Text>
                <Text className="text-base font-medium text-gray-900">{profile.personalInfo.taluk}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-500">Pincode</Text>
                <Text className="text-base font-medium text-gray-900">{profile.personalInfo.pincode}</Text>
              </View>
            </View>
            
            {profile.personalInfo.villageGramaPanchayat && (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-500">Village/Grama Panchayat</Text>
                <Text className="text-base font-medium text-gray-900">
                  {profile.personalInfo.villageGramaPanchayat}
                </Text>
              </View>
            )}
            
            {profile.personalInfo.post && (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-500">Post</Text>
                <Text className="text-base font-medium text-gray-900">{profile.personalInfo.post}</Text>
              </View>
            )}
            
            {profile.personalInfo.location && (
              <View>
                <Text className="text-sm font-medium text-gray-500">Location</Text>
                <Text className="text-base font-medium text-gray-900">{profile.personalInfo.location}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Transport Information */}
        <View className="bg-white rounded-xl mx-6 mt-6 p-6 shadow-sm">
          <View className="flex-row items-center gap-3 mb-6 pb-4 border-b border-gray-200">
            <Truck size={24} color="#3b82f6" />
            <Text className="text-xl font-medium text-gray-900">Transport Information</Text>
          </View>
          
          <View className="space-y-4 mb-6">
            <View className="flex-row items-center gap-4">
              <View className="bg-blue-50 p-3 rounded-lg">
                <Truck size={20} color="#3b82f6" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-500">Vehicle Type</Text>
                <Text className="text-base font-medium text-gray-900">{profile.transportInfo.vehicleType}</Text>
              </View>
            </View>

            <View className="flex-row items-center gap-4">
              <View className="bg-green-50 p-3 rounded-lg">
                <Truck size={20} color="#10b981" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-500">Vehicle Capacity</Text>
                <Text className="text-base font-medium text-gray-900">
                  {profile.transportInfo.vehicleCapacity.value} {profile.transportInfo.vehicleCapacity.unit}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center gap-4">
              <View className="bg-yellow-50 p-3 rounded-lg">
                <CreditCard size={20} color="#f59e0b" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-500">Vehicle Number</Text>
                <Text className="text-base font-medium text-gray-900">{profile.transportInfo.vehicleNumber}</Text>
              </View>
            </View>
          </View>

          {/* Driver Information */}
          {profile.transportInfo.driverInfo?.driverName && (
            <View className="bg-gray-50 rounded-lg p-5 mb-6">
              <View className="flex-row items-center gap-3 mb-4">
                <User size={20} color="#3b82f6" />
                <Text className="text-lg font-medium text-gray-900">Driver Information</Text>
              </View>
              <View className="flex-row flex-wrap justify-between">
                <View className="min-w-[45%] mb-3">
                  <Text className="text-sm font-medium text-gray-500">Driver Name</Text>
                  <Text className="text-base font-medium text-gray-900">
                    {profile.transportInfo.driverInfo.driverName}
                  </Text>
                </View>
                <View className="min-w-[45%] mb-3">
                  <Text className="text-sm font-medium text-gray-500">Driver Mobile</Text>
                  <Text className="text-base font-medium text-gray-900">
                    {profile.transportInfo.driverInfo.driverMobileNo}
                  </Text>
                </View>
                {profile.transportInfo.driverInfo.driverAge && (
                  <View className="min-w-[45%]">
                    <Text className="text-sm font-medium text-gray-500">Driver Age</Text>
                    <Text className="text-base font-medium text-gray-900">
                      {profile.transportInfo.driverInfo.driverAge} years
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Vehicle Documents */}
          {profile.transportInfo.vehicleDocuments && Object.keys(profile.transportInfo.vehicleDocuments).length > 0 && (
            <View className="bg-blue-50 rounded-lg p-5 border border-blue-100">
              <View className="flex-row items-center gap-3 mb-4">
                <FileText size={20} color="#3b82f6" />
                <Text className="text-lg font-medium text-gray-900">Vehicle Documents</Text>
              </View>
              <View className="space-y-3">
                {profile.transportInfo.vehicleDocuments.rcBook && (
                  <View className="bg-white rounded-lg p-4 border border-gray-200">
                    <View className="flex-row items-center gap-3 mb-3">
                      <FileText size={20} color="#3b82f6" />
                      <Text className="text-base font-medium text-gray-900">RC Book</Text>
                    </View>
                    <View className="flex-row gap-2">
                      <TouchableOpacity
                        className="flex-1 flex-row items-center justify-center gap-2 py-2 bg-blue-500 rounded-lg"
                        onPress={() => handleViewDocument('RC Book', profile.transportInfo.vehicleDocuments!.rcBook!)}
                      >
                        <Eye size={16} color="white" />
                        <Text className="text-white font-medium">View</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="w-12 items-center justify-center py-2 bg-green-500 rounded-lg"
                        onPress={() => handleDownloadDocument(profile.transportInfo.vehicleDocuments!.rcBook!, 'RC_Book.pdf')}
                      >
                        <Download size={16} color="white" />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                
                {profile.transportInfo.vehicleDocuments.insuranceDoc && (
                  <View className="bg-white rounded-lg p-4 border border-gray-200">
                    <View className="flex-row items-center gap-3 mb-3">
                      <Shield size={20} color="#10b981" />
                      <Text className="text-base font-medium text-gray-900">Insurance</Text>
                    </View>
                    <View className="flex-row gap-2">
                      <TouchableOpacity
                        className="flex-1 flex-row items-center justify-center gap-2 py-2 bg-blue-500 rounded-lg"
                        onPress={() => handleViewDocument('Insurance Document', profile.transportInfo.vehicleDocuments!.insuranceDoc!)}
                      >
                        <Eye size={16} color="white" />
                        <Text className="text-white font-medium">View</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="w-12 items-center justify-center py-2 bg-green-500 rounded-lg"
                        onPress={() => handleDownloadDocument(profile.transportInfo.vehicleDocuments!.insuranceDoc!, 'Insurance.pdf')}
                      >
                        <Download size={16} color="white" />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            </View>
          )}
        </View>

        {/* Bank Details */}
        <View className="bg-white rounded-xl mx-6 mt-6 p-6 shadow-sm">
          <View className="flex-row items-center gap-3 mb-6 pb-4 border-b border-gray-200">
            <Building size={24} color="#3b82f6" />
            <Text className="text-xl font-medium text-gray-900">Bank Details</Text>
          </View>
          
          <View className="space-y-5">
            <View>
              <Text className="text-sm font-medium text-gray-500">Account Holder Name</Text>
              <Text className="text-base font-medium text-gray-900">{profile.bankDetails.accountHolderName}</Text>
            </View>
            
            <View>
              <Text className="text-sm font-medium text-gray-500">Bank Name</Text>
              <Text className="text-base font-medium text-gray-900">{profile.bankDetails.bankName}</Text>
            </View>
            
            <View>
              <Text className="text-sm font-medium text-gray-500">Account Number</Text>
              <Text className="text-base font-medium text-gray-900">{profile.bankDetails.accountNumber}</Text>
            </View>
            
            <View>
              <Text className="text-sm font-medium text-gray-500">IFSC Code</Text>
              <Text className="text-base font-medium text-gray-900">{profile.bankDetails.ifscCode}</Text>
            </View>
            
            {profile.bankDetails.branch && (
              <View>
                <Text className="text-sm font-medium text-gray-500">Branch</Text>
                <Text className="text-base font-medium text-gray-900">{profile.bankDetails.branch}</Text>
              </View>
            )}
            
            {profile.bankDetails.upiId && (
              <View>
                <Text className="text-sm font-medium text-gray-500">UPI ID</Text>
                <Text className="text-base font-medium text-gray-900">{profile.bankDetails.upiId}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Documents Section */}
        {profile.documents && Object.keys(profile.documents).length > 0 && (
          <View className="bg-white rounded-xl mx-6 mt-6 p-6 shadow-sm">
            <View className="flex-row items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <FileText size={24} color="#3b82f6" />
              <Text className="text-xl font-medium text-gray-900">Uploaded Documents</Text>
            </View>
            
            {documentCategories.map((category, categoryIndex) => {
              const categoryDocuments = category.documents.filter(doc => 
                profile.documents && profile.documents[doc.key as keyof typeof profile.documents]
              );
              
              if (categoryDocuments.length === 0) return null;
              
              return (
                <View key={categoryIndex} className="mb-6">
                  <View className="flex-row items-center gap-3 mb-4">
                    {category.icon}
                    <Text className="text-lg font-medium text-gray-900">{category.title}</Text>
                  </View>
                  
                  <View className="space-y-3">
                    {categoryDocuments.map((doc) => {
                      const documentUrl = profile.documents![doc.key as keyof typeof profile.documents] as string;
                      return (
                        <TouchableOpacity
                          key={doc.key}
                          className="bg-gray-50 rounded-lg p-5 border border-gray-200"
                          onPress={() => handleViewDocument(doc.label, documentUrl)}
                          activeOpacity={0.8}
                        >
                          <View className="flex-row items-center gap-4 mb-4">
                            <View className="bg-blue-50 p-3 rounded-lg">
                              {doc.icon}
                            </View>
                            <View className="flex-1">
                              <Text className="text-base font-medium text-gray-900">{doc.label}</Text>
                              <View className="flex-row items-center gap-1 mt-1">
                                <CheckCircle size={14} color="#10b981" />
                                <Text className="text-xs text-green-600 font-medium">Uploaded</Text>
                              </View>
                            </View>
                          </View>
                          
                          <View className="flex-row gap-2">
                            <TouchableOpacity
                              className="flex-1 flex-row items-center justify-center gap-2 py-3 bg-blue-500 rounded-lg"
                              onPress={() => handleViewDocument(doc.label, documentUrl)}
                            >
                              <Eye size={16} color="white" />
                              <Text className="text-white font-medium">View Document</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              className="w-14 items-center justify-center py-3 bg-green-500 rounded-lg"
                              onPress={() => handleDownloadDocument(documentUrl, `${doc.label.replace(/\s+/g, '_')}.pdf`)}
                            >
                              <Download size={16} color="white" />
                            </TouchableOpacity>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              );
            })}
            
            {/* Missing Documents */}
            <View className="bg-orange-50 rounded-lg p-5 border border-orange-200">
              <Text className="text-lg font-medium text-orange-700 mb-2">Missing Documents</Text>
              <Text className="text-sm text-gray-600 mb-4 font-medium">
                The following documents are not uploaded yet. Please upload them through the edit profile section or contact support.
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {documentCategories.flatMap(category => 
                  category.documents.filter(doc => 
                    !profile.documents || !profile.documents[doc.key as keyof typeof profile.documents]
                  ).map(doc => (
                    <View
                      key={doc.key}
                      className="flex-row items-center gap-2 px-3 py-2 bg-orange-100 rounded-full"
                    >
                      {doc.icon}
                      <Text className="text-xs text-orange-800 font-medium">{doc.label}</Text>
                    </View>
                  ))
                )}
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default TransportProfile;