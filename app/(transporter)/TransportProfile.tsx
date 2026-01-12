





import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';

// Icon mapping to match TransportVehicles style
const Icons = {
  FaArrowLeft: 'arrow-left',
  FaBuilding: 'building',
  FaCar: 'car',
  FaCheckCircle: 'check-circle',
  FaCreditCard: 'credit-card',
  FaDownload: 'download',
  FaEdit: 'edit',
  FaEye: 'eye',
  FaFile: 'file-o',
  FaFilePdf: 'file-pdf-o',
  FaFileText: 'file-text-o',
  FaEnvelope: 'envelope',
  FaMapMarker: 'map-marker',
  FaPhone: 'phone',
  FaShield: 'shield',
  FaStar: 'star',
  FaTruck: 'truck',
  FaUser: 'user',
  FaFileImage: 'file-image-o',
  FaTimes: 'times'
};

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
      icon: <Icon name={Icons.FaUser} size={20} color="#5B5AF7" />,
      documents: [
        { key: 'panCard', label: 'PAN Card', icon: <Icon name={Icons.FaFileText} size={20} color="#5B5AF7" /> },
        { key: 'aadharFront', label: 'Aadhar Card (Front)', icon: <Icon name={Icons.FaCreditCard} size={20} color="#5B5AF7" /> },
        { key: 'aadharBack', label: 'Aadhar Card (Back)', icon: <Icon name={Icons.FaCreditCard} size={20} color="#5B5AF7" /> }
      ]
    },
    {
      title: 'Vehicle Documents',
      icon: <Icon name={Icons.FaCar} size={20} color="#5B5AF7" />,
      documents: [
        { key: 'rcBook', label: 'RC Book', icon: <Icon name={Icons.FaFileText} size={20} color="#5B5AF7" /> },
        { key: 'insuranceDoc', label: 'Insurance Document', icon: <Icon name={Icons.FaShield} size={20} color="#5B5AF7" /> },
        { key: 'pollutionCert', label: 'Pollution Certificate', icon: <Icon name={Icons.FaFileText} size={20} color="#5B5AF7" /> },
        { key: 'permitDoc', label: 'Permit Document', icon: <Icon name={Icons.FaFileText} size={20} color="#5B5AF7" /> },
        { key: 'driverLicense', label: 'Driver License', icon: <Icon name={Icons.FaCreditCard} size={20} color="#5B5AF7" /> }
      ]
    },
    {
      title: 'Bank Documents',
      icon: <Icon name={Icons.FaBuilding} size={20} color="#5B5AF7" />,
      documents: [
        { key: 'bankPassbook', label: 'Bank Passbook', icon: <Icon name={Icons.FaCreditCard} size={20} color="#5B5AF7" /> }
      ]
    }
  ];

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#5B5AF7" />
        <Text className="mt-4 text-lg text-gray-600">Loading profile...</Text>
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
                <Icon name={Icons.FaTimes} size={24} color="#999" />
              </TouchableOpacity>
            </View>
            <ScrollView className="p-6">
              {viewingDocument?.url ? (
                <>
                  {viewingDocument.url.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp|bmp)$/) ? (
                    <Image
                      source={{ uri: viewingDocument.url }}
                      className="w-full h-96 rounded-lg"
                      resizeMode="contain"
                    />
                  ) : viewingDocument.url.toLowerCase().match(/\.pdf$/) ? (
                    <View className="p-8 bg-gray-50 rounded-lg items-center">
                      <Icon name={Icons.FaFilePdf} size={80} color="#e74c3c" />
                      <Text className="mt-4 text-gray-600 text-center font-medium">
                        PDF document: {viewingDocument.name}
                      </Text>
                      <Text className="mt-2 text-xs text-gray-400 text-center" numberOfLines={2}>
                        URL: {viewingDocument.url}
                      </Text>
                      <TouchableOpacity
                        className="mt-4 px-6 py-3 bg-blue-500 rounded-lg"
                        onPress={() => Linking.openURL(viewingDocument.url)}
                      >
                        <Text className="text-white font-medium">Open PDF in Browser</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View className="p-8 bg-gray-50 rounded-lg items-center">
                      <Icon name={Icons.FaFile} size={80} color="#95a5a6" />
                      <Text className="mt-4 text-gray-600 text-center font-medium">
                        Document: {viewingDocument.name}
                      </Text>
                      <Text className="mt-2 text-xs text-gray-400 text-center" numberOfLines={2}>
                        URL: {viewingDocument.url}
                      </Text>
                      <TouchableOpacity
                        className="mt-4 px-6 py-3 bg-blue-500 rounded-lg"
                        onPress={() => Linking.openURL(viewingDocument.url)}
                      >
                        <Text className="text-white font-medium">Open Document</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              ) : (
                <View className="p-8 items-center justify-center">
                  <Icon name={Icons.FaFile} size={60} color="#95a5a6" />
                  <Text className="mt-4 text-gray-600">No document available</Text>
                </View>
              )}
            </ScrollView>
            <View className="flex-row gap-3 p-6 border-t border-gray-200">
              {viewingDocument?.url && (
                <TouchableOpacity
                  className="flex-1 flex-row items-center justify-center gap-2 px-4 py-3 bg-green-500 rounded-lg"
                  onPress={() => {
                    if (viewingDocument) {
                      handleDownloadDocument(viewingDocument.url, viewingDocument.name);
                    }
                  }}
                >
                  <Icon name={Icons.FaDownload} size={20} color="white" />
                  <Text className="text-white font-medium">Download</Text>
                </TouchableOpacity>
              )}
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

         {/* Header */}
        <View className="flex-row items-center justify-between p-6 bg-white border-b border-gray-200">
          <TouchableOpacity
            onPress={() => router.push('/(transporter)/home')}
            className="p-2 rounded-full bg-gray-100"
          >
            <Icon name={Icons.FaArrowLeft} size={24} color="#000" />
          </TouchableOpacity>
          <Text className="text-2xl font-medium text-gray-900">My Profile</Text>
          <TouchableOpacity
            className="flex-row items-center gap-2 px-4 py-2 bg-purple-600 rounded-lg"
            onPress={handleEditProfile}
          >
            <Icon name={Icons.FaEdit} size={18} color="white" />
            <Text className="text-white font-medium">Edit Profile</Text>
          </TouchableOpacity>
        </View>

      {/* Main Content */}
      <ScrollView className="flex-1" contentContainerClassName="pb-8">
     

        {/* Stats Card */}
        <View className="flex-row gap-4 mx-6 mt-6">
          <View className="flex-1 bg-blue-500 rounded-xl p-5 flex-row items-center gap-4 shadow-sm shadow-blue-200">
            <View className="bg-white/20 p-3 rounded-full">
              <Icon name={Icons.FaStar} size={24} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-white text-sm opacity-90">Rating</Text>
              <Text className="text-white text-2xl font-bold">{profile.rating.toFixed(1)} ⭐</Text>
            </View>
          </View>
          <View className="flex-1 bg-purple-500 rounded-xl p-5 flex-row items-center gap-4 shadow-sm shadow-purple-200">
            <View className="bg-white/20 p-3 rounded-full">
              <Icon name={Icons.FaTruck} size={24} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-white text-sm opacity-90">Total Trips</Text>
              <Text className="text-white text-2xl font-bold">{profile.totalTrips}</Text>
            </View>
          </View>
        </View>

        {/* Personal Information */}
        <View className="bg-white rounded-xl mx-6 mt-6 p-6 shadow-sm border border-slate-100">
          <View className="flex-row items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <Icon name={Icons.FaUser} size={24} color="#5B5AF7" />
            <Text className="text-xl font-medium text-gray-900">Personal Information</Text>
          </View>
          
          <View className="space-y-4 mb-6">
            <View className="flex-row items-center gap-4">
              <View className="bg-blue-50 p-3 rounded-lg">
                <Icon name={Icons.FaUser} size={20} color="#5B5AF7" />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-gray-500">Full Name</Text>
                <Text className="text-base font-medium text-gray-900">{profile.personalInfo.name}</Text>
              </View>
            </View>

            <View className="flex-row items-center gap-4">
              <View className="bg-green-50 p-3 rounded-lg">
                <Icon name={Icons.FaPhone} size={20} color="#27ae60" />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-gray-500">Mobile Number</Text>
                <Text className="text-base font-medium text-gray-900">{profile.personalInfo.mobileNo}</Text>
              </View>
            </View>

            <View className="flex-row items-center gap-4">
              <View className="bg-yellow-50 p-3 rounded-lg">
                <Icon name={Icons.FaEnvelope} size={20} color="#f39c12" />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-gray-500">Email</Text>
                <Text className="text-base font-medium text-gray-900">
                  {profile.personalInfo.email || 'Not provided'}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center gap-4">
              <View className="bg-purple-50 p-3 rounded-lg">
                <Icon name={Icons.FaMapMarker} size={20} color="#9b59b6" />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-gray-500">Complete Address</Text>
                <Text className="text-base font-medium text-gray-900">{profile.personalInfo.address}</Text>
              </View>
            </View>
          </View>

          <View className="bg-gray-50 rounded-lg p-5">
            <View className="flex-row justify-between mb-4">
              <View className="flex-1">
                <Text className="text-sm text-gray-500">State</Text>
                <Text className="text-base font-medium text-gray-900">{profile.personalInfo.state}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-sm text-gray-500">District</Text>
                <Text className="text-base font-medium text-gray-900">{profile.personalInfo.district}</Text>
              </View>
            </View>
            
            <View className="flex-row justify-between mb-4">
              <View className="flex-1">
                <Text className="text-sm text-gray-500">Taluk</Text>
                <Text className="text-base font-medium text-gray-900">{profile.personalInfo.taluk}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-sm text-gray-500">Pincode</Text>
                <Text className="text-base font-medium text-gray-900">{profile.personalInfo.pincode}</Text>
              </View>
            </View>
            
            {profile.personalInfo.villageGramaPanchayat && (
              <View className="mb-4">
                <Text className="text-sm text-gray-500">Village/Grama Panchayat</Text>
                <Text className="text-base font-medium text-gray-900">
                  {profile.personalInfo.villageGramaPanchayat}
                </Text>
              </View>
            )}
            
            {profile.personalInfo.post && (
              <View className="mb-4">
                <Text className="text-sm text-gray-500">Post</Text>
                <Text className="text-base font-medium text-gray-900">{profile.personalInfo.post}</Text>
              </View>
            )}
            
            {profile.personalInfo.location && (
              <View>
                <Text className="text-sm text-gray-500">Location</Text>
                <Text className="text-base font-medium text-gray-900">{profile.personalInfo.location}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Transport Information */}
        <View className="bg-white rounded-xl mx-6 mt-6 p-6 shadow-sm border border-slate-100">
          <View className="flex-row items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <Icon name={Icons.FaTruck} size={24} color="#5B5AF7" />
            <Text className="text-xl font-medium text-gray-900">Transport Information</Text>
          </View>
          
          <View className="space-y-4 mb-6">
            <View className="flex-row items-center gap-4">
              <View className="bg-blue-50 p-3 rounded-lg">
                <Icon name={Icons.FaTruck} size={20} color="#5B5AF7" />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-gray-500">Vehicle Type</Text>
                <Text className="text-base font-medium text-gray-900">{profile.transportInfo.vehicleType}</Text>
              </View>
            </View>

            <View className="flex-row items-center gap-4">
              <View className="bg-green-50 p-3 rounded-lg">
                <Icon name={Icons.FaTruck} size={20} color="#27ae60" />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-gray-500">Vehicle Capacity</Text>
                <Text className="text-base font-medium text-gray-900">
                  {profile.transportInfo.vehicleCapacity.value} {profile.transportInfo.vehicleCapacity.unit}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center gap-4">
              <View className="bg-yellow-50 p-3 rounded-lg">
                <Icon name={Icons.FaCreditCard} size={20} color="#f39c12" />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-gray-500">Vehicle Number</Text>
                <Text className="text-base font-medium text-gray-900">{profile.transportInfo.vehicleNumber}</Text>
              </View>
            </View>
          </View>

          {/* Driver Information */}
          {profile.transportInfo.driverInfo?.driverName && (
            <View className="bg-gray-50 rounded-lg p-5 mb-6">
              <View className="flex-row items-center gap-3 mb-4">
                <Icon name={Icons.FaUser} size={20} color="#5B5AF7" />
                <Text className="text-lg font-medium text-gray-900">Driver Information</Text>
              </View>
              <View className="flex-row flex-wrap justify-between">
                <View className="min-w-[45%] mb-3">
                  <Text className="text-sm text-gray-500">Driver Name</Text>
                  <Text className="text-base font-medium text-gray-900">
                    {profile.transportInfo.driverInfo.driverName}
                  </Text>
                </View>
                <View className="min-w-[45%] mb-3">
                  <Text className="text-sm text-gray-500">Driver Mobile</Text>
                  <Text className="text-base font-medium text-gray-900">
                    {profile.transportInfo.driverInfo.driverMobileNo}
                  </Text>
                </View>
                {profile.transportInfo.driverInfo.driverAge && (
                  <View className="min-w-[45%]">
                    <Text className="text-sm text-gray-500">Driver Age</Text>
                    <Text className="text-base font-medium text-gray-900">
                      {profile.transportInfo.driverInfo.driverAge} years
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </View>

        {/* Bank Details */}
        <View className="bg-white rounded-xl mx-6 mt-6 p-6 shadow-sm border border-slate-100">
          <View className="flex-row items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <Icon name={Icons.FaBuilding} size={24} color="#5B5AF7" />
            <Text className="text-xl font-medium text-gray-900">Bank Details</Text>
          </View>
          
          <View className="space-y-5">
            <View>
              <Text className="text-sm text-gray-500">Account Holder Name</Text>
              <Text className="text-base font-medium text-gray-900">{profile.bankDetails.accountHolderName}</Text>
            </View>
            
            <View>
              <Text className="text-sm text-gray-500">Bank Name</Text>
              <Text className="text-base font-medium text-gray-900">{profile.bankDetails.bankName}</Text>
            </View>
            
            <View>
              <Text className="text-sm text-gray-500">Account Number</Text>
              <Text className="text-base font-medium text-gray-900">{profile.bankDetails.accountNumber}</Text>
            </View>
            
            <View>
              <Text className="text-sm text-gray-500">IFSC Code</Text>
              <Text className="text-base font-medium text-gray-900">{profile.bankDetails.ifscCode}</Text>
            </View>
            
            {profile.bankDetails.branch && (
              <View>
                <Text className="text-sm text-gray-500">Branch</Text>
                <Text className="text-base font-medium text-gray-900">{profile.bankDetails.branch}</Text>
              </View>
            )}
            
            {profile.bankDetails.upiId && (
              <View>
                <Text className="text-sm text-gray-500">UPI ID</Text>
                <Text className="text-base font-medium text-gray-900">{profile.bankDetails.upiId}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Documents Section */}
        {profile.documents && Object.keys(profile.documents).length > 0 && (
          <View className="bg-white rounded-xl mx-6 mt-6 p-6 shadow-sm border border-slate-100">
            <View className="flex-row items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <Icon name={Icons.FaFileText} size={24} color="#5B5AF7" />
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
                  
                  <View className="space-y-4">
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
                                <Icon name={Icons.FaCheckCircle} size={14} color="#27ae60" />
                                <Text className="text-xs text-green-600 font-medium">Uploaded</Text>
                              </View>
                              {documentUrl && (
                                <Text className="text-xs text-gray-400 font-mono mt-1" numberOfLines={1}>
                                  {documentUrl.substring(0, 30)}...
                                </Text>
                              )}
                            </View>
                          </View>
                          
                          <View className="flex-row gap-2">
                            <TouchableOpacity
                              className="flex-1 flex-row items-center justify-center gap-2 py-3 bg-blue-500 rounded-lg"
                              onPress={() => handleViewDocument(doc.label, documentUrl)}
                            >
                              <Icon name={Icons.FaEye} size={16} color="white" />
                              <Text className="text-white font-medium">View Document</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              className="w-14 items-center justify-center py-3 bg-green-500 rounded-lg"
                              onPress={() => handleDownloadDocument(documentUrl, doc.label)}
                            >
                              <Icon name={Icons.FaDownload} size={16} color="white" />
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
            <View className="bg-orange-50 rounded-lg p-5 border border-orange-200 mt-6">
              <Text className="text-lg font-medium text-orange-700 mb-2">Missing Documents</Text>
              <Text className="text-sm text-gray-600 mb-4">
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