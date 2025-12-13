import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Image,
  Modal,
  Linking,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Truck,
  CreditCard,
  Edit,
  ArrowLeft,
  FileText,
  Building,
  Shield,
  Car,
  File,
  Eye,
  Download,
  Star,
  FileText as FilePdf,
  CheckCircle,
} from 'lucide-react-native';

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
          navigation.navigate('Login' as never);
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
    navigation.navigate('EditTransportProfile' as never);
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
      icon: <User size={20} color="#3498db" />,
      documents: [
        { key: 'panCard', label: 'PAN Card', icon: <FileText size={20} color="#3498db" /> },
        { key: 'aadharFront', label: 'Aadhar Card (Front)', icon: <CreditCard size={20} color="#3498db" /> },
        { key: 'aadharBack', label: 'Aadhar Card (Back)', icon: <CreditCard size={20} color="#3498db" /> }
      ]
    },
    {
      title: 'Vehicle Documents',
      icon: <Car size={20} color="#3498db" />,
      documents: [
        { key: 'rcBook', label: 'RC Book', icon: <FileText size={20} color="#3498db" /> },
        { key: 'insuranceDoc', label: 'Insurance Document', icon: <Shield size={20} color="#3498db" /> },
        { key: 'pollutionCert', label: 'Pollution Certificate', icon: <FileText size={20} color="#3498db" /> },
        { key: 'permitDoc', label: 'Permit Document', icon: <FileText size={20} color="#3498db" /> },
        { key: 'driverLicense', label: 'Driver License', icon: <CreditCard size={20} color="#3498db" /> }
      ]
    },
    {
      title: 'Bank Documents',
      icon: <Building size={20} color="#3498db" />,
      documents: [
        { key: 'bankPassbook', label: 'Bank Passbook', icon: <CreditCard size={20} color="#3498db" /> }
      ]
    }
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>{error}</Text>
          <View style={styles.errorButtons}>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={fetchProfile}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => navigation.navigate('Login' as never)}
            >
              <Text style={styles.loginButtonText}>Go to Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.noProfileContainer}>
        <View style={styles.noProfileCard}>
          <Text style={styles.noProfileText}>No profile data found. Please complete your registration.</Text>
          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => navigation.navigate('TransportRegistration' as never)}
          >
            <Text style={styles.registerButtonText}>Complete Registration</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Document Viewer Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {viewingDocument?.name || 'Document'}
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseText}>×</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalContent}>
              {viewingDocument?.url && viewingDocument.url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                <Image
                  source={{ uri: viewingDocument.url }}
                  style={styles.documentImage}
                  resizeMode="contain"
                />
              ) : (
                <View style={styles.pdfContainer}>
                  <FilePdf size={80} color="#e74c3c" />
                  <Text style={styles.pdfText}>
                    PDF document: {viewingDocument?.name}
                  </Text>
                  <TouchableOpacity
                    style={styles.openButton}
                    onPress={() => Linking.openURL(viewingDocument?.url || '')}
                  >
                    <Text style={styles.openButtonText}>Open Document</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.downloadButton}
                onPress={() => {
                  if (viewingDocument) {
                    handleDownloadDocument(viewingDocument.url, viewingDocument.name);
                  }
                }}
              >
                <Download size={20} color="white" />
                <Text style={styles.downloadButtonText}>Download</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeModalButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeModalButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Main Content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Profile</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditProfile}
          >
            <Edit size={20} color="white" />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Card */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Star size={24} color="white" />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>Rating</Text>
              <Text style={styles.statValue}>{profile.rating.toFixed(1)} ⭐</Text>
            </View>
          </View>
          <View style={[styles.statCard, styles.statCard2]}>
            <View style={[styles.statIconContainer, styles.statIconContainer2]}>
              <Truck size={24} color="white" />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>Total Trips</Text>
              <Text style={styles.statValue}>{profile.totalTrips}</Text>
            </View>
          </View>
        </View>

        {/* Personal Information */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <User size={24} color="#3498db" />
            <Text style={styles.sectionTitle}>Personal Information</Text>
          </View>
          
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <User size={20} color="#3498db" />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Full Name</Text>
                <Text style={styles.infoValue}>{profile.personalInfo.name}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={[styles.infoIconContainer, styles.infoIconContainerGreen]}>
                <Phone size={20} color="#27ae60" />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Mobile Number</Text>
                <Text style={styles.infoValue}>{profile.personalInfo.mobileNo}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={[styles.infoIconContainer, styles.infoIconContainerYellow]}>
                <Mail size={20} color="#f39c12" />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>
                  {profile.personalInfo.email || 'Not provided'}
                </Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={[styles.infoIconContainer, styles.infoIconContainerPurple]}>
                <MapPin size={20} color="#9b59b6" />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Complete Address</Text>
                <Text style={styles.infoValue}>{profile.personalInfo.address}</Text>
              </View>
            </View>
          </View>

          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>State</Text>
                <Text style={styles.detailValue}>{profile.personalInfo.state}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>District</Text>
                <Text style={styles.detailValue}>{profile.personalInfo.district}</Text>
              </View>
            </View>
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Taluk</Text>
                <Text style={styles.detailValue}>{profile.personalInfo.taluk}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Pincode</Text>
                <Text style={styles.detailValue}>{profile.personalInfo.pincode}</Text>
              </View>
            </View>
            {profile.personalInfo.villageGramaPanchayat && (
              <View style={styles.detailRow}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Village/Grama Panchayat</Text>
                  <Text style={styles.detailValue}>{profile.personalInfo.villageGramaPanchayat}</Text>
                </View>
              </View>
            )}
            {profile.personalInfo.post && (
              <View style={styles.detailRow}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Post</Text>
                  <Text style={styles.detailValue}>{profile.personalInfo.post}</Text>
                </View>
              </View>
            )}
            {profile.personalInfo.location && (
              <View style={styles.detailRow}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Location</Text>
                  <Text style={styles.detailValue}>{profile.personalInfo.location}</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Transport Information */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Truck size={24} color="#3498db" />
            <Text style={styles.sectionTitle}>Transport Information</Text>
          </View>
          
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <Truck size={20} color="#3498db" />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Vehicle Type</Text>
                <Text style={styles.infoValue}>{profile.transportInfo.vehicleType}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={[styles.infoIconContainer, styles.infoIconContainerGreen]}>
                <Truck size={20} color="#27ae60" />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Vehicle Capacity</Text>
                <Text style={styles.infoValue}>
                  {profile.transportInfo.vehicleCapacity.value} {profile.transportInfo.vehicleCapacity.unit}
                </Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={[styles.infoIconContainer, styles.infoIconContainerYellow]}>
                <CreditCard size={20} color="#f39c12" />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Vehicle Number</Text>
                <Text style={styles.infoValue}>{profile.transportInfo.vehicleNumber}</Text>
              </View>
            </View>
          </View>

          {/* Driver Information */}
          {profile.transportInfo.driverInfo?.driverName && (
            <View style={styles.driverContainer}>
              <View style={styles.driverHeader}>
                <User size={20} color="#3498db" />
                <Text style={styles.driverTitle}>Driver Information</Text>
              </View>
              <View style={styles.driverDetails}>
                <View style={styles.driverItem}>
                  <Text style={styles.driverLabel}>Driver Name</Text>
                  <Text style={styles.driverValue}>{profile.transportInfo.driverInfo.driverName}</Text>
                </View>
                <View style={styles.driverItem}>
                  <Text style={styles.driverLabel}>Driver Mobile</Text>
                  <Text style={styles.driverValue}>{profile.transportInfo.driverInfo.driverMobileNo}</Text>
                </View>
                {profile.transportInfo.driverInfo.driverAge && (
                  <View style={styles.driverItem}>
                    <Text style={styles.driverLabel}>Driver Age</Text>
                    <Text style={styles.driverValue}>{profile.transportInfo.driverInfo.driverAge} years</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Vehicle Documents */}
          {profile.transportInfo.vehicleDocuments && Object.keys(profile.transportInfo.vehicleDocuments).length > 0 && (
            <View style={styles.vehicleDocsContainer}>
              <View style={styles.vehicleDocsHeader}>
                <FileText size={20} color="#3498db" />
                <Text style={styles.vehicleDocsTitle}>Vehicle Documents</Text>
              </View>
              <View style={styles.vehicleDocsGrid}>
                {profile.transportInfo.vehicleDocuments.rcBook && (
                  <View style={styles.documentCard}>
                    <View style={styles.documentHeader}>
                      <FileText size={20} color="#3498db" />
                      <Text style={styles.documentTitle}>RC Book</Text>
                    </View>
                    <View style={styles.documentButtons}>
                      <TouchableOpacity
                        style={styles.viewButton}
                        onPress={() => handleViewDocument('RC Book', profile.transportInfo.vehicleDocuments!.rcBook!)}
                      >
                        <Eye size={16} color="white" />
                        <Text style={styles.viewButtonText}>View</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.downloadDocButton}
                        onPress={() => handleDownloadDocument(profile.transportInfo.vehicleDocuments!.rcBook!, 'RC_Book.pdf')}
                      >
                        <Download size={16} color="white" />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                {profile.transportInfo.vehicleDocuments.insuranceDoc && (
                  <View style={styles.documentCard}>
                    <View style={styles.documentHeader}>
                      <Shield size={20} color="#27ae60" />
                      <Text style={styles.documentTitle}>Insurance</Text>
                    </View>
                    <View style={styles.documentButtons}>
                      <TouchableOpacity
                        style={styles.viewButton}
                        onPress={() => handleViewDocument('Insurance Document', profile.transportInfo.vehicleDocuments!.insuranceDoc!)}
                      >
                        <Eye size={16} color="white" />
                        <Text style={styles.viewButtonText}>View</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.downloadDocButton}
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
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Building size={24} color="#3498db" />
            <Text style={styles.sectionTitle}>Bank Details</Text>
          </View>
          
          <View style={styles.bankGrid}>
            <View style={styles.bankItem}>
              <Text style={styles.bankLabel}>Account Holder Name</Text>
              <Text style={styles.bankValue}>{profile.bankDetails.accountHolderName}</Text>
            </View>
            <View style={styles.bankItem}>
              <Text style={styles.bankLabel}>Bank Name</Text>
              <Text style={styles.bankValue}>{profile.bankDetails.bankName}</Text>
            </View>
            <View style={styles.bankItem}>
              <Text style={styles.bankLabel}>Account Number</Text>
              <Text style={styles.bankValue}>{profile.bankDetails.accountNumber}</Text>
            </View>
            <View style={styles.bankItem}>
              <Text style={styles.bankLabel}>IFSC Code</Text>
              <Text style={styles.bankValue}>{profile.bankDetails.ifscCode}</Text>
            </View>
            {profile.bankDetails.branch && (
              <View style={styles.bankItem}>
                <Text style={styles.bankLabel}>Branch</Text>
                <Text style={styles.bankValue}>{profile.bankDetails.branch}</Text>
              </View>
            )}
            {profile.bankDetails.upiId && (
              <View style={styles.bankItem}>
                <Text style={styles.bankLabel}>UPI ID</Text>
                <Text style={styles.bankValue}>{profile.bankDetails.upiId}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Documents Section */}
        {profile.documents && Object.keys(profile.documents).length > 0 && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <FileText size={24} color="#3498db" />
              <Text style={styles.sectionTitle}>Uploaded Documents</Text>
            </View>
            
            {documentCategories.map((category, categoryIndex) => {
              const categoryDocuments = category.documents.filter(doc => 
                profile.documents && profile.documents[doc.key as keyof typeof profile.documents]
              );
              
              if (categoryDocuments.length === 0) return null;
              
              return (
                <View key={categoryIndex} style={styles.categoryContainer}>
                  <View style={styles.categoryHeader}>
                    {category.icon}
                    <Text style={styles.categoryTitle}>{category.title}</Text>
                  </View>
                  <View style={styles.documentsGrid}>
                    {categoryDocuments.map((doc) => {
                      const documentUrl = profile.documents![doc.key as keyof typeof profile.documents] as string;
                      return (
                        <TouchableOpacity
                          key={doc.key}
                          style={styles.documentItem}
                          onPress={() => handleViewDocument(doc.label, documentUrl)}
                          activeOpacity={0.8}
                        >
                          <View style={styles.documentItemHeader}>
                            <View style={styles.documentIconContainer}>
                              {doc.icon}
                            </View>
                            <View style={styles.documentItemText}>
                              <Text style={styles.documentItemTitle}>{doc.label}</Text>
                              <View style={styles.uploadedBadge}>
                                <CheckCircle size={12} color="#27ae60" />
                                <Text style={styles.uploadedText}>Uploaded</Text>
                              </View>
                            </View>
                          </View>
                          
                          <View style={styles.documentItemButtons}>
                            <TouchableOpacity
                              style={styles.documentViewButton}
                              onPress={() => handleViewDocument(doc.label, documentUrl)}
                            >
                              <Eye size={16} color="white" />
                              <Text style={styles.documentViewButtonText}>View Document</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.documentDownloadButton}
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
            <View style={styles.missingDocsContainer}>
              <Text style={styles.missingDocsTitle}>Missing Documents</Text>
              <Text style={styles.missingDocsText}>
                The following documents are not uploaded yet. Please upload them through the edit profile section or contact support.
              </Text>
              <View style={styles.missingTags}>
                {documentCategories.flatMap(category => 
                  category.documents.filter(doc => 
                    !profile.documents || !profile.documents[doc.key as keyof typeof profile.documents]
                  ).map(doc => (
                    <View key={doc.key} style={styles.missingTag}>
                      {doc.icon}
                      <Text style={styles.missingTagText}>{doc.label}</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  errorCard: {
    backgroundColor: '#ffeaea',
    borderWidth: 1,
    borderColor: '#ffcccc',
    borderRadius: 8,
    padding: 20,
    maxWidth: 500,
    width: '100%',
  },
  errorText: {
    color: '#cc0000',
    marginBottom: 15,
    textAlign: 'center',
  },
  errorButtons: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
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
  loginButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#27ae60',
    borderRadius: 5,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
  },
  noProfileContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noProfileCard: {
    backgroundColor: '#fff3e0',
    borderWidth: 1,
    borderColor: '#ffcc80',
    borderRadius: 8,
    padding: 20,
    maxWidth: 500,
    width: '100%',
  },
  noProfileText: {
    color: '#f39c12',
    marginBottom: 15,
    textAlign: 'center',
  },
  registerButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f39c12',
    borderRadius: 5,
    alignSelf: 'center',
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: '100%',
    maxHeight: '90%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  modalCloseButton: {
    padding: 5,
  },
  modalCloseText: {
    fontSize: 24,
    color: '#666',
  },
  modalContent: {
    padding: 20,
  },
  documentImage: {
    width: '100%',
    height: 400,
    borderRadius: 5,
  },
  pdfContainer: {
    padding: 40,
    backgroundColor: '#f8f9fa',
    borderRadius: 5,
    alignItems: 'center',
  },
  pdfText: {
    marginTop: 20,
    color: '#666',
    textAlign: 'center',
  },
  openButton: {
    marginTop: 15,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#3498db',
    borderRadius: 5,
  },
  openButtonText: {
    color: 'white',
    fontSize: 16,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 10,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  downloadButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: '#27ae60',
    borderRadius: 5,
  },
  downloadButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeModalButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#e74c3c',
    borderRadius: 5,
  },
  closeModalButtonText: {
    color: 'white',
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  backButton: {
    marginRight: 15,
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  headerTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#3498db',
    borderRadius: 5,
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#667eea',
    borderRadius: 10,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  statCard2: {
    backgroundColor: '#f093fb',
  },
  statIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 15,
    borderRadius: 25,
  },
  statIconContainer2: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
    marginBottom: 5,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  sectionContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#3498db',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  infoGrid: {
    gap: 15,
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  infoIconContainer: {
    backgroundColor: '#e3f2fd',
    padding: 10,
    borderRadius: 8,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoIconContainerGreen: {
    backgroundColor: '#e8f5e9',
  },
  infoIconContainerYellow: {
    backgroundColor: '#fff3e0',
  },
  infoIconContainerPurple: {
    backgroundColor: '#f3e5f5',
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  detailsContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  driverContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 20,
    marginTop: 25,
  },
  driverHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 15,
  },
  driverTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  driverDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  driverItem: {
    minWidth: '30%',
    marginBottom: 10,
  },
  driverLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  driverValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  vehicleDocsContainer: {
    backgroundColor: '#e8f4fd',
    borderRadius: 8,
    padding: 20,
    marginTop: 25,
    borderWidth: 1,
    borderColor: '#d0e3fa',
  },
  vehicleDocsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 15,
  },
  vehicleDocsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  vehicleDocsGrid: {
    gap: 15,
  },
  documentCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  documentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  documentButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  viewButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    padding: 8,
    backgroundColor: '#3498db',
    borderRadius: 5,
  },
  viewButtonText: {
    color: 'white',
    fontSize: 14,
  },
  downloadDocButton: {
    padding: 8,
    backgroundColor: '#27ae60',
    borderRadius: 5,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bankGrid: {
    gap: 15,
  },
  bankItem: {
    marginBottom: 15,
  },
  bankLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  bankValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  categoryContainer: {
    marginBottom: 25,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 15,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#34495e',
  },
  documentsGrid: {
    gap: 15,
  },
  documentItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  documentItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginBottom: 15,
  },
  documentIconContainer: {
    backgroundColor: '#e3f2fd',
    padding: 10,
    borderRadius: 8,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  documentItemText: {
    flex: 1,
  },
  documentItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  uploadedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  uploadedText: {
    fontSize: 12,
    color: '#27ae60',
  },
  documentItemButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 15,
  },
  documentViewButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 10,
    backgroundColor: '#3498db',
    borderRadius: 5,
  },
  documentViewButtonText: {
    color: 'white',
    fontSize: 14,
  },
  documentDownloadButton: {
    padding: 10,
    backgroundColor: '#27ae60',
    borderRadius: 5,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  missingDocsContainer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#fff3e0',
    borderRadius: 8,
  },
  missingDocsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e67e22',
    marginBottom: 10,
  },
  missingDocsText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  missingTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  missingTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#ffecb3',
    borderRadius: 20,
  },
  missingTagText: {
    fontSize: 12,
    color: '#e65100',
  },
});

export default TransportProfile;