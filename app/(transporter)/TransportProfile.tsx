





import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router } from 'expo-router';
import {
  ArrowLeft,
  Building2,
  Car,
  CheckCircle,
  CreditCard,
  Download,
  Edit,
  Eye,
  File,
  FileText,
  Mail,
  MapPin,
  Phone,
  Shield,
  Star,
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
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  const [profile, setProfile] = useState<TransportProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewingDocument, setViewingDocument] = useState<{name: string, url: string} | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const API_BASE = 'https://kisan.etpl.ai';

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
      const TRANSPORT_API_BASE = `${API_BASE}/api/transporter`;
      
      // Try to fetch by ID first
      if (userId && userId !== 'undefined') {
        try {
          response = await axios.get(`${TRANSPORT_API_BASE}/profile/${userId}`);
        } catch (idError) {
          // Try by mobile number if ID fails
          if (mobileNo) {
            response = await axios.get(`${TRANSPORT_API_BASE}/mobile/${mobileNo}`);
          } else {
            throw idError;
          }
        }
      } else if (mobileNo) {
        response = await axios.get(`${TRANSPORT_API_BASE}/mobile/${mobileNo}`);
      }

      if (response?.data.success) {
        const userData = response.data.data;
        
        console.log('Full API Response:', JSON.stringify(userData, null, 2));
        
        // Merge vehicleDocuments into documents for easier access
        const allDocuments = {
          ...(userData.documents || {}),
          ...(userData.transportInfo?.vehicleDocuments || {})
        };
        
        console.log('All merged documents:', allDocuments);
        
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
          documents: allDocuments,
          rating: userData.rating || 0,
          totalTrips: userData.totalTrips || 0
        });
        
        // Update userId in AsyncStorage if we got it from mobile lookup
        if (!userId && userData._id) {
          await AsyncStorage.setItem('userId', userData._id);
        }
        
        // Update transporter_data in AsyncStorage
        await AsyncStorage.setItem('transporter_data', JSON.stringify(userData));
      } else {
        throw new Error(response?.data?.message || 'Failed to fetch profile');
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      
      // More specific error messages
      if (error.response?.status === 404) {
        setError('Profile not found. Please complete your registration first.');
      } else if (error.response?.status === 401) {
        setError('Session expired. Please login again.');
        setTimeout(() => {
          router.push('/(login)/Login');
        }, 2000);
      } else {
        setError(error.message || 'Failed to load profile data. Please check your connection.');
      }
      
      // Fallback to AsyncStorage data
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
    router.push('/(tabs)/transporterpages/EditTransportProfile');
  };

  // Fix: Format document URL properly
  const formatDocumentUrl = (url: string): string => {
    if (!url) {
      console.log('formatDocumentUrl: Empty URL provided');
      return '';
    }
    
    console.log('formatDocumentUrl - Input:', url);
    
    // Clean the URL - remove any leading/trailing slashes
    const cleanUrl = url.trim();
    
    // If it's already a full URL, return as is
    if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
      console.log('formatDocumentUrl - Already full URL:', cleanUrl);
      return cleanUrl;
    }
    
    // Handle different URL formats
    let finalUrl = '';
    
    if (cleanUrl.startsWith('uploads/')) {
      finalUrl = `${API_BASE}/${cleanUrl}`;
    } else if (cleanUrl.startsWith('/uploads/')) {
      finalUrl = `${API_BASE}${cleanUrl}`;
    } else if (cleanUrl.includes('/')) {
      // Has some path but doesn't start with uploads
      finalUrl = `${API_BASE}/${cleanUrl}`;
    } else {
      // Just a filename
      finalUrl = `${API_BASE}/uploads/${cleanUrl}`;
    }
    
    console.log('formatDocumentUrl - Output:', finalUrl);
    return finalUrl;
  };

  const handleViewDocument = (name: string, url: string) => {
    console.log('handleViewDocument called:', { name, url });
    
    if (!url) {
      Alert.alert('Error', `Document URL is not available for ${name}`);
      return;
    }
    
    const formattedUrl = formatDocumentUrl(url);
    console.log('Viewing document:', { 
      name, 
      originalUrl: url, 
      formattedUrl,
      'URL starts with uploads/': url.startsWith('uploads/'),
      'URL starts with /uploads/': url.startsWith('/uploads/')
    });
    
    // Check if it's an image or PDF
    const isImage = url.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp|bmp)$/);
    const isPdf = url.toLowerCase().match(/\.pdf$/);
    
    if (!isImage && !isPdf) {
      Alert.alert(
        'Document Type',
        'This document type cannot be previewed. Would you like to download it?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Download', onPress: () => handleDownloadDocument(url, name) }
        ]
      );
      return;
    }
    
    setViewingDocument({ name, url: formattedUrl });
    setModalVisible(true);
  };

  const handleDownloadDocument = async (url: string, filename: string) => {
    try {
      const formattedUrl = formatDocumentUrl(url);
      console.log('Downloading document:', { filename, formattedUrl });
      
      const supported = await Linking.canOpenURL(formattedUrl);
      if (supported) {
        await Linking.openURL(formattedUrl);
      } else {
        // Try different approaches for different file types
        const fileExtension = filename.split('.').pop()?.toLowerCase();
        const baseFilename = filename.split('.').slice(0, -1).join('.') || filename;
        const safeFilename = baseFilename.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        
        Alert.alert(
          'Download Document',
          `Download ${filename}?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Download', 
              onPress: async () => {
                try {
                  // Create a temporary link and trigger download
                  const link = document.createElement('a');
                  link.href = formattedUrl;
                  link.download = `${safeFilename}.${fileExtension || 'jpg'}`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  
                  Alert.alert('Success', 'Download started in browser');
                } catch (linkError) {
                  console.error('Error creating download link:', linkError);
                  Alert.alert('Error', 'Cannot download this file directly. Please use a browser.');
                }
              }
            }
          ]
        );
      }
    } catch (error: any) {
      console.error('Error downloading document:', error);
      Alert.alert('Error', `Failed to download document: ${error.message}`);
    }
  };

  const documentCategories = [
    {
      title: 'Personal Documents',
      icon: <User size={20} color="#4F46E5" />,
      documents: [
        { key: 'panCard', label: 'PAN Card', icon: <FileText size={20} color="#4F46E5" /> },
        { key: 'aadharFront', label: 'Aadhar Card (Front)', icon: <CreditCard size={20} color="#4F46E5" /> },
        { key: 'aadharBack', label: 'Aadhar Card (Back)', icon: <CreditCard size={20} color="#4F46E5" /> }
      ]
    },
    {
      title: 'Vehicle Documents',
      icon: <Car size={20} color="#4F46E5" />,
      documents: [
        { key: 'rcBook', label: 'RC Book', icon: <FileText size={20} color="#4F46E5" /> },
        { key: 'insuranceDoc', label: 'Insurance Document', icon: <Shield size={20} color="#4F46E5" /> },
        { key: 'pollutionCert', label: 'Pollution Certificate', icon: <FileText size={20} color="#4F46E5" /> },
        { key: 'permitDoc', label: 'Permit Document', icon: <FileText size={20} color="#4F46E5" /> },
        { key: 'driverLicense', label: 'Driver License', icon: <CreditCard size={20} color="#4F46E5" /> }
      ]
    },
    {
      title: 'Bank Documents',
      icon: <Building2 size={20} color="#4F46E5" />,
      documents: [
        { key: 'bankPassbook', label: 'Bank Passbook', icon: <CreditCard size={20} color="#4F46E5" /> }
      ]
    }
  ];

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text className="mt-4 text-base font-medium text-gray-500">Loading profile...</Text>
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
              onPress={() => router.push('/(login)/Login')}
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
            onPress={() => router.push('/(auth)/onboarding')}
          >
            <Text className="text-white font-medium">Complete Registration</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 pt-4">
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      {/* Document Viewer Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-black/80 justify-center items-center p-5">
          <View className="bg-white rounded-2xl w-full max-h-[90%] overflow-hidden">
            <View className="flex-row justify-between items-center p-5 border-b border-gray-100">
              <Text className="text-lg font-bold text-gray-900">
                {viewingDocument?.name || 'Document'}
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="p-2 bg-gray-100 rounded-full"
              >
                <X size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <ScrollView className="p-5">
              {viewingDocument?.url ? (
                <>
                  {viewingDocument.url.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp|bmp)$/) ? (
                    <Image
                      source={{ uri: viewingDocument.url }}
                      className="w-full h-96 rounded-xl"
                      resizeMode="contain"
                    />
                  ) : viewingDocument.url.toLowerCase().match(/\.pdf$/) ? (
                    <View className="p-8 bg-gray-50 rounded-xl items-center border border-gray-200 border-dashed">
                      <FileText size={64} color="#EF4444" />
                      <Text className="mt-4 text-gray-900 text-center font-semibold text-lg">
                        PDF Document
                      </Text>
                      <Text className="mt-1 text-sm text-gray-500 text-center mb-6">
                        {viewingDocument.name}
                      </Text>
                      <TouchableOpacity
                        className="flex-row items-center gap-2 px-6 py-3 bg-indigo-600 rounded-xl"
                        onPress={() => Linking.openURL(viewingDocument.url)}
                      >
                        <Download size={20} color="white" />
                        <Text className="text-white font-semibold">Open PDF</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View className="p-8 bg-gray-50 rounded-xl items-center border border-gray-200 border-dashed">
                      <File size={64} color="#9CA3AF" />
                      <Text className="mt-4 text-gray-900 text-center font-semibold text-lg">
                        Document File
                      </Text>
                      <Text className="mt-1 text-sm text-gray-500 text-center mb-6">
                        {viewingDocument.name}
                      </Text>
                      <TouchableOpacity
                        className="flex-row items-center gap-2 px-6 py-3 bg-indigo-600 rounded-xl"
                        onPress={() => Linking.openURL(viewingDocument.url)}
                      >
                        <Download size={20} color="white" />
                        <Text className="text-white font-semibold">Open Document</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              ) : (
                <View className="p-8 items-center justify-center">
                  <File size={48} color="#D1D5DB" />
                  <Text className="mt-4 text-gray-500">No document available</Text>
                </View>
              )}
            </ScrollView>
            <View className="flex-row gap-3 p-5 border-t border-gray-100">
              {viewingDocument?.url && (
                <TouchableOpacity
                  className="flex-1 flex-row items-center justify-center gap-2 px-4 py-3.5 bg-indigo-600 rounded-xl"
                  onPress={() => {
                    if (viewingDocument) {
                      handleDownloadDocument(viewingDocument.url, viewingDocument.name);
                    }
                  }}
                >
                  <Download size={20} color="white" />
                  <Text className="text-white font-bold">Download</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                className="flex-1 items-center justify-center py-3.5 bg-gray-100 rounded-xl"
                onPress={() => setModalVisible(false)}
              >
                <Text className="text-gray-700 font-bold">Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Header */}
      <View className="px-5 pb-4 bg-gray-50">
        <View className="flex-row items-center justify-between mb-4">
             <TouchableOpacity
            onPress={() => router.push('/(transporter)/home')}
            className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm border border-gray-100"
          >
            <ArrowLeft size={20} color="#1F2937" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900">My Profile</Text>
          <TouchableOpacity
            className="w-10 h-10 bg-indigo-50 rounded-full items-center justify-center"
            onPress={handleEditProfile}
          >
            <Edit size={20} color="#4F46E5" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView className="flex-1 px-5" contentContainerClassName="pb-10" showsVerticalScrollIndicator={false}>

        {/* Stats Card */}
        <View className="flex-row gap-4 mb-6">
          <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <View className="w-10 h-10 bg-yellow-50 rounded-full items-center justify-center mb-3">
              <Star size={20} color="#F59E0B" />
            </View>
            <Text className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">Rating</Text>
            <Text className="text-gray-900 text-2xl font-bold">{profile.rating.toFixed(1)}</Text>
          </View>
          
          <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <View className="w-10 h-10 bg-indigo-50 rounded-full items-center justify-center mb-3">
              <Truck size={20} color="#4F46E5" />
            </View>
            <Text className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">Total Trips</Text>
            <Text className="text-gray-900 text-2xl font-bold">{profile.totalTrips}</Text>
          </View>
        </View>

        {/* Personal Information */}
        <View className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
          <View className="flex-row items-center gap-3 mb-6 pb-4 border-b border-gray-50">
            <View className="w-8 h-8 bg-blue-50 rounded-full items-center justify-center">
              <User size={16} color="#2563EB" />
            </View>
            <Text className="text-lg font-bold text-gray-900">Personal Info</Text>
          </View>
          
          <View className="space-y-6">
            <View className="flex-row gap-4">
              <View className="mt-1">
                <User size={18} color="#9CA3AF" />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-gray-500 mb-0.5">Full Name</Text>
                <Text className="text-base font-semibold text-gray-900">{profile.personalInfo.name}</Text>
              </View>
            </View>

            <View className="flex-row gap-4">
              <View className="mt-1">
                <Phone size={18} color="#9CA3AF" />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-gray-500 mb-0.5">Mobile Number</Text>
                <Text className="text-base font-semibold text-gray-900">{profile.personalInfo.mobileNo}</Text>
              </View>
            </View>

            <View className="flex-row gap-4">
              <View className="mt-1">
                <Mail size={18} color="#9CA3AF" />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-gray-500 mb-0.5">Email</Text>
                <Text className="text-base font-semibold text-gray-900">
                  {profile.personalInfo.email || 'Not provided'}
                </Text>
              </View>
            </View>

            <View className="flex-row gap-4">
              <View className="mt-1">
                <MapPin size={18} color="#9CA3AF" />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-gray-500 mb-0.5">Address</Text>
                <Text className="text-base font-medium text-gray-900 leading-6">{profile.personalInfo.address}</Text>
                <View className="flex-row flex-wrap gap-2 mt-2">
                  <View className="bg-gray-100 px-2 py-1 rounded-md">
                    <Text className="text-xs text-gray-600">{profile.personalInfo.district}</Text>
                  </View>
                  <View className="bg-gray-100 px-2 py-1 rounded-md">
                    <Text className="text-xs text-gray-600">{profile.personalInfo.state}</Text>
                  </View>
                  <View className="bg-gray-100 px-2 py-1 rounded-md">
                    <Text className="text-xs text-gray-600">{profile.personalInfo.pincode}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Transport Information */}
        <View className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
          <View className="flex-row items-center gap-3 mb-6 pb-4 border-b border-gray-50">
            <View className="w-8 h-8 bg-indigo-50 rounded-full items-center justify-center">
              <Truck size={16} color="#4F46E5" />
            </View>
            <Text className="text-lg font-bold text-gray-900">Transport Info</Text>
          </View>
          
          <View className="space-y-6">
            <View className="flex-row justify-between">
              <View className="flex-1">
                <Text className="text-sm text-gray-500 mb-1">Vehicle Type</Text>
                <Text className="text-base font-semibold text-gray-900">{profile.transportInfo.vehicleType}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-sm text-gray-500 mb-1">Vehicle Number</Text>
                <View className="bg-gray-100 px-3 py-1.5 rounded-lg self-start">
                  <Text className="text-base font-bold text-gray-900 uppercase">{profile.transportInfo.vehicleNumber}</Text>
                </View>
              </View>
            </View>

            <View>
              <Text className="text-sm text-gray-500 mb-1">Capacity</Text>
              <Text className="text-base font-semibold text-gray-900">
                {profile.transportInfo.vehicleCapacity.value} {profile.transportInfo.vehicleCapacity.unit}
              </Text>
            </View>

            {/* Driver Information Sub-section */}
            {profile.transportInfo.driverInfo?.driverName && (
              <View className="bg-gray-50 rounded-xl p-4 border border-gray-100 mt-2">
                <View className="flex-row items-center gap-2 mb-3">
                  <User size={16} color="#4B5563" />
                  <Text className="text-sm font-bold text-gray-700">Driver Details</Text>
                </View>
                <View className="space-y-3">
                  <View className="flex-row justify-between border-b border-gray-200 pb-2">
                    <Text className="text-sm text-gray-500">Name</Text>
                    <Text className="text-sm font-semibold text-gray-900">{profile.transportInfo.driverInfo.driverName}</Text>
                  </View>
                  <View className="flex-row justify-between border-b border-gray-200 pb-2">
                    <Text className="text-sm text-gray-500">Mobile</Text>
                    <Text className="text-sm font-semibold text-gray-900">{profile.transportInfo.driverInfo.driverMobileNo}</Text>
                  </View>
                  {profile.transportInfo.driverInfo.driverAge && (
                    <View className="flex-row justify-between">
                      <Text className="text-sm text-gray-500">Age</Text>
                      <Text className="text-sm font-semibold text-gray-900">{profile.transportInfo.driverInfo.driverAge} years</Text>
                    </View>
                  )}
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Bank Details */}
        <View className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
          <View className="flex-row items-center gap-3 mb-6 pb-4 border-b border-gray-50">
            <View className="w-8 h-8 bg-green-50 rounded-full items-center justify-center">
              <Building2 size={16} color="#059669" />
            </View>
            <Text className="text-lg font-bold text-gray-900">Bank Details</Text>
          </View>
          
          <View className="space-y-5">
            <View>
              <Text className="text-sm text-gray-500 mb-1">Account Holder</Text>
              <Text className="text-base font-semibold text-gray-900">{profile.bankDetails.accountHolderName}</Text>
            </View>
            
            <View className="flex-row justify-between">
              <View className="flex-1">
                <Text className="text-sm text-gray-500 mb-1">Bank Name</Text>
                <Text className="text-base font-semibold text-gray-900">{profile.bankDetails.bankName}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-sm text-gray-500 mb-1">Account Number</Text>
                <Text className="text-base font-mono font-medium text-gray-900">{profile.bankDetails.accountNumber}</Text>
              </View>
            </View>
            
            <View className="flex-row justify-between">
              <View className="flex-1">
                <Text className="text-sm text-gray-500 mb-1">IFSC Code</Text>
                <View className="bg-gray-100 px-2 py-1 rounded self-start">
                  <Text className="text-bm font-mono font-medium text-gray-800">{profile.bankDetails.ifscCode}</Text>
                </View>
              </View>
              {profile.bankDetails.upiId && (
                <View className="flex-1">
                  <Text className="text-sm text-gray-500 mb-1">UPI ID</Text>
                  <Text className="text-base font-medium text-gray-900">{profile.bankDetails.upiId}</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Documents Section */}
        {profile.documents && Object.keys(profile.documents).length > 0 && (
          <View className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-8">
            <View className="flex-row items-center gap-3 mb-6 pb-4 border-b border-gray-50">
              <View className="w-8 h-8 bg-purple-50 rounded-full items-center justify-center">
                <FileText size={16} color="#7C3AED" />
              </View>
              <Text className="text-lg font-bold text-gray-900">Documents</Text>
            </View>
            
            {documentCategories.map((category, categoryIndex) => {
              const categoryDocuments = category.documents.filter(doc => 
                profile.documents && profile.documents[doc.key as keyof typeof profile.documents]
              );
              
              if (categoryDocuments.length === 0) return null;
              
              return (
                <View key={categoryIndex} className="mb-6 last:mb-0">
                  <View className="flex-row items-center gap-2 mb-3">
                    {category.icon}
                    <Text className="text-base font-semibold text-gray-900">{category.title}</Text>
                  </View>
                  
                  <View className="space-y-3">
                    {categoryDocuments.map((doc) => {
                      const documentUrl = profile.documents![doc.key as keyof typeof profile.documents] as string;
                      return (
                        <View key={doc.key} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                          <View className="flex-row items-center justify-between mb-3">
                            <View className="flex-row items-center gap-3 flex-1">
                              <View className="w-10 h-10 bg-white rounded-lg items-center justify-center border border-gray-100 shadow-sm">
                                {doc.icon}
                              </View>
                              <View className="flex-1">
                                <Text className="text-sm font-semibold text-gray-900">{doc.label}</Text>
                                <View className="flex-row items-center gap-1 mt-0.5">
                                  <CheckCircle size={10} color="#059669" />
                                  <Text className="text-[10px] text-green-600 font-bold uppercase tracking-wide">Uploaded</Text>
                                </View>
                              </View>
                            </View>
                          </View>
                          
                          <View className="flex-row gap-2">
                            <TouchableOpacity
                              className="flex-1 flex-row items-center justify-center gap-1.5 py-2.5 bg-white border border-gray-200 rounded-lg shadow-sm"
                              onPress={() => handleViewDocument(doc.label, documentUrl)}
                              activeOpacity={0.7}
                            >
                              <Eye size={16} color="#4B5563" />
                              <Text className="text-sm font-medium text-gray-700">View</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              className="w-10 items-center justify-center bg-gray-100 rounded-lg border border-gray-200"
                              onPress={() => handleDownloadDocument(documentUrl, doc.label)}
                              activeOpacity={0.7}
                            >
                              <Download size={16} color="#4B5563" />
                            </TouchableOpacity>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default TransportProfile;