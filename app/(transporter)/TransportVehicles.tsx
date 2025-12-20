// import React, { useState, useEffect } from 'react';
// import { useRouter, useLocalSearchParams } from 'expo-router';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   StyleSheet,
//   Alert,
//   ActivityIndicator,
//   Platform,
//   Image,
//   Modal,
//   Linking,
//   Dimensions
// } from 'react-native';
// import * as DocumentPicker from 'expo-document-picker';
// import * as FileSystem from 'expo-file-system';
// import * as ImagePicker from 'expo-image-picker';
// import { Picker } from '@react-native-picker/picker';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import { LinearGradient } from 'expo-linear-gradient';

// const { width } = Dimensions.get('window');

// // Define icon names mapping
// const Icons = {
//   FaArrowLeft: 'arrow-left',
//   FaSave: 'save',
//   FaTimes: 'times',
//   FaTruck: 'truck',
//   FaUser: 'user',
//   FaEdit: 'edit',
//   FaCheck: 'check',
//   FaDownload: 'download',
//   FaUpload: 'upload',
//   FaFilePdf: 'file-pdf-o',
//   FaFileImage: 'file-image-o',
//   FaFile: 'file',
//   FaTrash: 'trash',
//   FaPlus: 'plus',
//   FaList: 'list',
//   FaStar: 'star',
//   FaArrowRight: 'arrow-right',
//   FaTimesCircle: 'times-circle'
// };

// interface VehicleCapacity {
//   value: number;
//   unit: string;
// }

// interface DriverInfo {
//   driverName: string;
//   driverMobileNo: string;
//   driverAge: number;
//   driverLicense?: string;
//   driverPhoto?: string;
// }

// interface VehicleDocuments {
//   rcBook?: string;
//   insuranceDoc?: string;
//   pollutionCert?: string;
//   permitDoc?: string;
// }

// interface VehicleFormData {
//   vehicleType: string;
//   vehicleCapacity: VehicleCapacity;
//   vehicleNumber: string;
//   vehicleDocuments?: VehicleDocuments;
//   driverInfo: DriverInfo;
//   primaryVehicle?: boolean;
//   _id?: string;
//   addedAt?: string;
// }

// interface DocumentsType {
//   [key: string]: string | undefined;
// }

// interface DocumentFile {
//   file: any | null;
//   currentUrl: string;
// }

// const VehiclesPage: React.FC = () => {
//   const router = useRouter();
//   const [formData, setFormData] = useState<VehicleFormData>({
//     vehicleType: 'Truck',
//     vehicleCapacity: { value: 0, unit: 'kg' },
//     vehicleNumber: '',
//     driverInfo: {
//       driverName: '',
//       driverMobileNo: '',
//       driverAge: 0
//     }
//   });
  
//   const [loading, setLoading] = useState(false);
//   const [fetching, setFetching] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [validationErrors, setValidationErrors] = useState<string[]>([]);
//   const [isEditing, setIsEditing] = useState(false);
//   const [originalData, setOriginalData] = useState<VehicleFormData | null>(null);
//   const [fileUploads, setFileUploads] = useState<{[key: string]: DocumentFile}>({});
//   const [deletingFiles, setDeletingFiles] = useState<string[]>([]);
  
//   // Multi-vehicle states
//   const [vehicles, setVehicles] = useState<VehicleFormData[]>([]);
//   const [currentVehicleIndex, setCurrentVehicleIndex] = useState<number>(-1);
//   const [showAddVehicleForm, setShowAddVehicleForm] = useState(false);
//   const [isAddingNewVehicle, setIsAddingNewVehicle] = useState(false);
  
//   // Store documents separately for each vehicle
//   const [vehiclesDocuments, setVehiclesDocuments] = useState<{[key: number]: DocumentsType}>({});
//   const [vehiclesFileUploads, setVehiclesFileUploads] = useState<{[key: number]: {[key: string]: DocumentFile}}>({});
//   const [vehiclesDeletingFiles, setVehiclesDeletingFiles] = useState<{[key: number]: string[]}>({});

//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedDoc, setSelectedDoc] = useState<{key: string, url: string} | null>(null);

//   useEffect(() => {
//     fetchVehicleData();
//   }, []);

//   const fetchVehicleData = async () => {
//     try {
//       setFetching(true);
//       setError(null);
      
//       const userId = await AsyncStorage.getItem('userId');
//       const mobileNo = await AsyncStorage.getItem('phone');
      
//       if (!userId && !mobileNo) {
//         throw new Error('User not logged in');
//       }

//       let response;
//       const API_BASE = 'https://kisan.etpl.ai/transport';
      
//       if (userId && userId !== 'undefined') {
//         try {
//           response = await axios.get(`${API_BASE}/profile/${userId}`);
//         } catch (idError) {
//           if (mobileNo) {
//             response = await axios.get(`${API_BASE}/mobile/${mobileNo}`);
//           } else {
//             throw idError;
//           }
//         }
//       } else if (mobileNo) {
//         response = await axios.get(`${API_BASE}/mobile/${mobileNo}`);
//       }

//       if (response?.data.success) {
//         const userData = response.data.data;
        
//         let fetchedVehicles: VehicleFormData[] = [];
        
//         if (userData.transportInfo?.vehicles && userData.transportInfo.vehicles.length > 0) {
//           fetchedVehicles = userData.transportInfo.vehicles.map((vehicle: any) => ({
//             vehicleType: vehicle.vehicleType || 'Truck',
//             vehicleCapacity: vehicle.vehicleCapacity || { value: 0, unit: 'kg' },
//             vehicleNumber: vehicle.vehicleNumber || '',
//             vehicleDocuments: vehicle.vehicleDocuments || {},
//             driverInfo: {
//               driverName: vehicle.driverInfo?.driverName || '',
//               driverMobileNo: vehicle.driverInfo?.driverMobileNo || '',
//               driverAge: vehicle.driverInfo?.driverAge || 0,
//               driverLicense: vehicle.driverInfo?.driverLicense,
//               driverPhoto: vehicle.driverInfo?.driverPhoto
//             },
//             primaryVehicle: vehicle.primaryVehicle || false,
//             _id: vehicle._id,
//             addedAt: vehicle.addedAt
//           }));
//         } else if (userData.transportInfo?.vehicleNumber) {
//           fetchedVehicles = [{
//             vehicleType: userData.transportInfo?.vehicleType || 'Truck',
//             vehicleCapacity: userData.transportInfo?.vehicleCapacity || { value: 0, unit: 'kg' },
//             vehicleNumber: userData.transportInfo?.vehicleNumber || '',
//             vehicleDocuments: userData.transportInfo?.vehicleDocuments || {},
//             driverInfo: {
//               driverName: userData.transportInfo?.driverInfo?.driverName || '',
//               driverMobileNo: userData.transportInfo?.driverInfo?.driverMobileNo || '',
//               driverAge: userData.transportInfo?.driverInfo?.driverAge || 0,
//               driverLicense: userData.transportInfo?.driverInfo?.driverLicense,
//               driverPhoto: userData.transportInfo?.driverInfo?.driverPhoto
//             },
//             primaryVehicle: true,
//             _id: userData._id
//           }];
//         }

//         setVehicles(fetchedVehicles);
        
//         const docsMap: {[key: number]: DocumentsType} = {};
//         const fileUploadsMap: {[key: number]: {[key: string]: DocumentFile}} = {};
//         const deletingFilesMap: {[key: number]: string[]} = {};
        
//         fetchedVehicles.forEach((vehicle, index) => {
//           const vehicleDocs: DocumentsType = {};
          
//           if (vehicle.vehicleDocuments) {
//             Object.entries(vehicle.vehicleDocuments).forEach(([key, value]) => {
//               if (value && typeof value === 'string') {
//                 vehicleDocs[key] = value;
//               }
//             });
//           }
          
//           if (vehicle.driverInfo?.driverLicense) {
//             vehicleDocs['driverLicense'] = vehicle.driverInfo.driverLicense;
//           }
          
//           docsMap[index] = vehicleDocs;
//           fileUploadsMap[index] = {};
//           deletingFilesMap[index] = [];
//         });
        
//         setVehiclesDocuments(docsMap);
//         setVehiclesFileUploads(fileUploadsMap);
//         setVehiclesDeletingFiles(deletingFilesMap);
        
//         if (fetchedVehicles.length > 0) {
//           const primaryIndex = fetchedVehicles.findIndex(v => v.primaryVehicle);
//           const defaultIndex = primaryIndex >= 0 ? primaryIndex : 0;
//           setCurrentVehicleIndex(defaultIndex);
          
//           const currentVehicle = fetchedVehicles[defaultIndex];
//           setFormData(currentVehicle);
//           setOriginalData(currentVehicle);
//         }
        
//       } else {
//         throw new Error(response?.data?.message || 'Failed to fetch vehicle data');
//       }
//     } catch (error: any) {
//       console.error('Error fetching vehicle data:', error);
//       setError(error.message || 'Failed to load vehicle data');
//     } finally {
//       setFetching(false);
//     }
//   };

//   const getCurrentDocuments = () => {
//     return currentVehicleIndex >= 0 ? vehiclesDocuments[currentVehicleIndex] || {} : {};
//   };

//   const getCurrentFileUploads = () => {
//     return currentVehicleIndex >= 0 ? vehiclesFileUploads[currentVehicleIndex] || {} : {};
//   };

//   const getCurrentDeletingFiles = () => {
//     return currentVehicleIndex >= 0 ? vehiclesDeletingFiles[currentVehicleIndex] || [] : [];
//   };

//   const updateCurrentDocuments = (newDocs: DocumentsType) => {
//     if (currentVehicleIndex >= 0) {
//       setVehiclesDocuments(prev => ({
//         ...prev,
//         [currentVehicleIndex]: newDocs
//       }));
//     }
//   };

//   const updateCurrentFileUploads = (newUploads: {[key: string]: DocumentFile}) => {
//     if (currentVehicleIndex >= 0) {
//       setVehiclesFileUploads(prev => ({
//         ...prev,
//         [currentVehicleIndex]: newUploads
//       }));
//     }
//   };

//   const updateCurrentDeletingFiles = (newDeleting: string[]) => {
//     if (currentVehicleIndex >= 0) {
//       setVehiclesDeletingFiles(prev => ({
//         ...prev,
//         [currentVehicleIndex]: newDeleting
//       }));
//     }
//   };

//   const handleInputChange = (field: keyof VehicleFormData, value: any) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//     setValidationErrors([]);
//   };

//   const handleDriverInfoChange = (field: keyof VehicleFormData['driverInfo'], value: any) => {
//     setFormData(prev => ({
//       ...prev,
//       driverInfo: {
//         ...prev.driverInfo,
//         [field]: value
//       }
//     }));
//     setValidationErrors([]);
//   };

//   const handleVehicleCapacityChange = (field: 'value' | 'unit', value: any) => {
//     setFormData(prev => ({
//       ...prev,
//       vehicleCapacity: {
//         ...prev.vehicleCapacity,
//         [field]: field === 'value' ? parseInt(value) || 0 : value
//       }
//     }));
//     setValidationErrors([]);
//   };

//   const pickDocument = async (docKey: string) => {
//     try {
//       const result = await DocumentPicker.getDocumentAsync({
//         type: ['image/*', 'application/pdf'],
//         copyToCacheDirectory: true
//       });
      
//       if (!result.canceled && result.assets[0]) {
//         const asset = result.assets[0];
//         const file = {
//           uri: asset.uri,
//           name: asset.name || `document_${Date.now()}`,
//           type: asset.mimeType || 'application/octet-stream',
//           size: asset.size || 0
//         };
        
//         const currentDocs = getCurrentDocuments();
//         const newUploads = {
//           ...getCurrentFileUploads(),
//           [docKey]: {
//             file,
//             currentUrl: currentDocs[docKey] || ''
//           }
//         };
//         updateCurrentFileUploads(newUploads);
//       }
//     } catch (error) {
//       console.error('Error picking document:', error);
//       setError('Failed to pick document');
//     }
//   };

//   const handleRemoveDocument = (docKey: string) => {
//     const currentDocs = getCurrentDocuments();
//     const currentDeleting = getCurrentDeletingFiles();
    
//     updateCurrentDeletingFiles([...currentDeleting, docKey]);
    
//     const newDocs = { ...currentDocs };
//     delete newDocs[docKey];
//     updateCurrentDocuments(newDocs);
    
//     const newUploads = { ...getCurrentFileUploads() };
//     delete newUploads[docKey];
//     updateCurrentFileUploads(newUploads);
//   };

//   const handleRestoreDocument = (docKey: string, originalUrl: string) => {
//     const currentDeleting = getCurrentDeletingFiles();
//     const currentDocs = getCurrentDocuments();
    
//     updateCurrentDeletingFiles(currentDeleting.filter(item => item !== docKey));
    
//     updateCurrentDocuments({
//       ...currentDocs,
//       [docKey]: originalUrl
//     });
//   };

//   const viewDocument = async (docKey: string, url: string) => {
//     try {
//       let fullUrl = url;
//       if (url.startsWith('/uploads/')) {
//         fullUrl = `https://kisan.etpl.ai${url}`;
//       } else if (!url.startsWith('http')) {
//         fullUrl = `https://kisan.etpl.ai/uploads/${url}`;
//       }
      
//       const supported = await Linking.canOpenURL(fullUrl);
//       if (supported) {
//         await Linking.openURL(fullUrl);
//       } else {
//         setSelectedDoc({ key: docKey, url: fullUrl });
//         setModalVisible(true);
//       }
//     } catch (error) {
//       console.error('Error viewing document:', error);
//       setError(`Failed to view ${docKey}`);
//     }
//   };

//   const downloadDocument = async (docKey: string, url: string) => {
//     try {
//       let fullUrl = url;
//       if (url.startsWith('/uploads/')) {
//         fullUrl = `https://kisan.etpl.ai${url}`;
//       } else if (!url.startsWith('http')) {
//         fullUrl = `https://kisan.etpl.ai/uploads/${url}`;
//       }
      
//       // For React Native, we'll open in browser for download
//       const supported = await Linking.canOpenURL(fullUrl);
//       if (supported) {
//         await Linking.openURL(fullUrl);
//       }
//     } catch (error) {
//       console.error('Error downloading document:', error);
//       setError(`Failed to download ${docKey}`);
//     }
//   };

//   const validateForm = (): boolean => {
//     const errors: string[] = [];

//     if (!formData.vehicleNumber.trim()) {
//       errors.push('Vehicle number is required');
//     }
    
//     if (!formData.vehicleCapacity.value || formData.vehicleCapacity.value <= 0) {
//       errors.push('Valid vehicle capacity is required');
//     }
    
//     if (!formData.driverInfo.driverName.trim()) {
//       errors.push('Driver name is required');
//     }
    
//     if (!formData.driverInfo.driverMobileNo.trim() || !/^\d{10}$/.test(formData.driverInfo.driverMobileNo)) {
//       errors.push('Valid 10-digit driver mobile number is required');
//     }
    
//     if (!formData.driverInfo.driverAge || formData.driverInfo.driverAge < 18 || formData.driverInfo.driverAge > 70) {
//       errors.push('Driver age must be between 18 and 70');
//     }

//     setValidationErrors(errors);
//     return errors.length === 0;
//   };

//   const handleSave = async () => {
//     if (!validateForm()) {
//       setError('Please fix the validation errors below');
//       return;
//     }

//     setLoading(true);
//     setError(null);
    
//     try {
//       const userId = await AsyncStorage.getItem('userId');
//       if (!userId) {
//         throw new Error('User not logged in');
//       }

//       const currentDocs = getCurrentDocuments();
//       const currentUploads = getCurrentFileUploads();
//       const currentDeleting = getCurrentDeletingFiles();
      
//       const formDataToSend = new FormData();
      
//       const vehicleInfo = {
//         vehicleType: formData.vehicleType,
//         vehicleCapacity: {
//           value: formData.vehicleCapacity.value,
//           unit: formData.vehicleCapacity.unit
//         },
//         vehicleNumber: formData.vehicleNumber,
//         driverInfo: {
//           driverName: formData.driverInfo.driverName,
//           driverMobileNo: formData.driverInfo.driverMobileNo,
//           driverAge: formData.driverInfo.driverAge
//         },
//         primaryVehicle: formData.primaryVehicle || false
//       };
      
//       const updatedVehicles = [...vehicles];
//       updatedVehicles[currentVehicleIndex] = {
//         ...formData,
//         vehicleDocuments: {}
//       };
      
//       const transportInfo = {
//         vehicles: updatedVehicles
//       };
      
//       formDataToSend.append('transportInfo', JSON.stringify(transportInfo));

//       const documentUrls: {[key: string]: string} = {};
//       Object.entries(currentDocs).forEach(([key, url]) => {
//         if (url && !currentDeleting.includes(key)) {
//           documentUrls[key] = url;
//         }
//       });
      
//       formDataToSend.append('documents', JSON.stringify(documentUrls));

//       Object.entries(currentUploads).forEach(([key, docFile]) => {
//         if (docFile.file) {
//           const fileData = {
//             uri: docFile.file.uri,
//             type: docFile.file.type,
//             name: docFile.file.name
//           };
//           formDataToSend.append(key, fileData as any);
//         }
//       });

//       if (currentDeleting.length > 0) {
//         formDataToSend.append('deletedFiles', JSON.stringify(currentDeleting));
//       }

//       const response = await axios.put(
//         `https://kisan.etpl.ai/transport/profile/${userId}/update-with-files`,
//         formDataToSend,
//         {
//           headers: { 
//             'Content-Type': 'multipart/form-data'
//           },
//           timeout: 30000
//         }
//       );
      
//       if (response.data.success) {
//         Alert.alert('Success', 'Vehicle details updated successfully!');
        
//         const finalUpdatedVehicles = [...vehicles];
//         finalUpdatedVehicles[currentVehicleIndex] = {
//           ...formData,
//           vehicleDocuments: documentUrls as any
//         };
//         setVehicles(finalUpdatedVehicles);
        
//         updateCurrentDocuments(documentUrls);
//         updateCurrentFileUploads({});
//         updateCurrentDeletingFiles([]);
        
//         setOriginalData(formData);
//         setIsEditing(false);
        
//         const storedData = await AsyncStorage.getItem('transporter_data');
//         if (storedData) {
//           const parsedData = JSON.parse(storedData);
//           const updatedData = {
//             ...parsedData,
//             transportInfo: {
//               ...parsedData.transportInfo,
//               vehicles: finalUpdatedVehicles
//             }
//           };
//           await AsyncStorage.setItem('transporter_data', JSON.stringify(updatedData));
//         }
//       } else {
//         throw new Error(response.data.message || 'Failed to update vehicle details');
//       }
//     } catch (error: any) {
//       console.error('Error updating vehicle details:', error);
      
//       if (error.response?.data?.errors) {
//         setValidationErrors(error.response.data.errors);
//         setError('Please fix the following errors:');
//       } else if (error.response?.data?.message) {
//         setError(error.response.data.message);
//       } else {
//         setError(error.message || 'Failed to update vehicle details. Please try again.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddVehicle = async () => {
//     if (!validateForm()) {
//       setError('Please fix the validation errors below');
//       return;
//     }

//     setLoading(true);
//     setError(null);
    
//     try {
//       const userId = await AsyncStorage.getItem('userId');
//       if (!userId) {
//         throw new Error('User not logged in');
//       }

//       const formDataToSend = new FormData();
      
//       formDataToSend.append('vehicleType', formData.vehicleType);
//       formDataToSend.append('vehicleCapacityValue', formData.vehicleCapacity.value.toString());
//       formDataToSend.append('vehicleCapacityUnit', formData.vehicleCapacity.unit);
//       formDataToSend.append('vehicleNumber', formData.vehicleNumber);
//       formDataToSend.append('driverName', formData.driverInfo.driverName);
//       formDataToSend.append('driverMobileNo', formData.driverInfo.driverMobileNo);
//       formDataToSend.append('driverAge', formData.driverInfo.driverAge.toString());

//       const currentUploads = getCurrentFileUploads();
//       Object.entries(currentUploads).forEach(([key, docFile]) => {
//         if (docFile.file) {
//           const fileData = {
//             uri: docFile.file.uri,
//             type: docFile.file.type,
//             name: docFile.file.name
//           };
//           formDataToSend.append(key, fileData as any);
//         }
//       });

//       const response = await axios.post(
//         `https://kisan.etpl.ai/transport/profile/${userId}/vehicles`,
//         formDataToSend,
//         {
//           headers: { 
//             'Content-Type': 'multipart/form-data'
//           },
//           timeout: 30000
//         }
//       );
      
//       if (response.data.success) {
//         Alert.alert('Success', 'Vehicle added successfully!');
        
//         setFormData({
//           vehicleType: 'Truck',
//           vehicleCapacity: { value: 0, unit: 'kg' },
//           vehicleNumber: '',
//           driverInfo: {
//             driverName: '',
//             driverMobileNo: '',
//             driverAge: 0
//           }
//         });
        
//         updateCurrentDocuments({});
//         updateCurrentFileUploads({});
//         updateCurrentDeletingFiles([]);
//         setShowAddVehicleForm(false);
//         setIsAddingNewVehicle(false);
        
//         fetchVehicleData();
//       } else {
//         throw new Error(response.data.message || 'Failed to add vehicle');
//       }
//     } catch (error: any) {
//       console.error('Error adding vehicle:', error);
      
//       if (error.response?.data?.errors) {
//         setValidationErrors(error.response.data.errors);
//         setError('Please fix the following errors:');
//       } else if (error.response?.data?.message) {
//         setError(error.response.data.message);
//       } else {
//         setError(error.message || 'Failed to add vehicle. Please try again.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCancelEdit = () => {
//     if (originalData) {
//       setFormData(originalData);
//     }
//     setIsEditing(false);
//     setValidationErrors([]);
//     setError(null);
//     updateCurrentFileUploads({});
//     updateCurrentDeletingFiles([]);
//     if (currentVehicleIndex >= 0 && vehicles[currentVehicleIndex]) {
//       const originalVehicle = vehicles[currentVehicleIndex];
//       if (originalVehicle.vehicleDocuments) {
//         const originalDocs: DocumentsType = {};
//         Object.entries(originalVehicle.vehicleDocuments).forEach(([key, value]) => {
//           if (value && typeof value === 'string') {
//             originalDocs[key] = value;
//           }
//         });
//         if (originalVehicle.driverInfo?.driverLicense) {
//           originalDocs['driverLicense'] = originalVehicle.driverInfo.driverLicense;
//         }
//         updateCurrentDocuments(originalDocs);
//       }
//     }
//   };

//   const handleCancelAddVehicle = () => {
//     setShowAddVehicleForm(false);
//     setIsAddingNewVehicle(false);
//     setFormData({
//       vehicleType: 'Truck',
//       vehicleCapacity: { value: 0, unit: 'kg' },
//       vehicleNumber: '',
//       driverInfo: {
//         driverName: '',
//         driverMobileNo: '',
//         driverAge: 0
//       }
//     });
//     updateCurrentDocuments({});
//     updateCurrentFileUploads({});
//     updateCurrentDeletingFiles([]);
//     setError(null);
//     setValidationErrors([]);
//   };

//   const handleSelectVehicle = (index: number) => {
//     setCurrentVehicleIndex(index);
//     const selectedVehicle = vehicles[index];
//     setFormData(selectedVehicle);
//     setOriginalData(selectedVehicle);
    
//     setIsEditing(false);
//     setShowAddVehicleForm(false);
//     setIsAddingNewVehicle(false);
//     setError(null);
//     setValidationErrors([]);
//   };

//   const handleSetPrimaryVehicle = async () => {
//     try {
//       const userId = await AsyncStorage.getItem('userId');
//       if (!userId) {
//         throw new Error('User not logged in');
//       }

//       const currentVehicle = vehicles[currentVehicleIndex];
//       if (!currentVehicle) {
//         throw new Error('No vehicle selected');
//       }

//       let response;
      
//       try {
//         response = await axios.put(
//           `https://kisan.etpl.ai/transport/profile/${userId}/vehicles/${currentVehicle._id}/set-primary`
//         );
//       } catch (endpointError: any) {
//         response = await axios.put(
//           `https://kisan.etpl.ai/transport/profile/${userId}/vehicles/set-primary`,
//           { 
//             vehicleId: currentVehicle._id,
//             vehicleNumber: formData.vehicleNumber 
//           }
//         );
//       }
      
//       if (response.data.success) {
//         Alert.alert('Success', 'Primary vehicle updated successfully!');
//         fetchVehicleData();
//       } else {
//         throw new Error('Failed to set primary vehicle');
//       }
//     } catch (error: any) {
//       console.error('Error setting primary vehicle:', error);
//       setError(error.message || 'Failed to set primary vehicle');
//     }
//   };

//   const handleDeleteVehicle = async () => {
//     Alert.alert(
//       'Confirm Delete',
//       'Are you sure you want to delete this vehicle? This action cannot be undone.',
//       [
//         {
//           text: 'Cancel',
//           style: 'cancel'
//         },
//         {
//           text: 'Delete',
//           style: 'destructive',
//           onPress: async () => {
//             try {
//               const userId = await AsyncStorage.getItem('userId');
//               if (!userId) {
//                 throw new Error('User not logged in');
//               }

//               const currentVehicle = vehicles[currentVehicleIndex];
//               if (!currentVehicle) {
//                 throw new Error('No vehicle selected');
//               }

//               let response;
              
//               try {
//                 response = await axios.delete(
//                   `https://kisan.etpl.ai/transport/profile/${userId}/vehicles/${currentVehicle._id}`
//                 );
//               } catch (endpointError: any) {
//                 response = await axios.delete(
//                   `https://kisan.etpl.ai/transport/profile/${userId}/vehicles/${formData.vehicleNumber}`
//                 );
//               }
              
//               if (response.data.success) {
//                 Alert.alert('Success', 'Vehicle deleted successfully!');
                
//                 const updatedVehicles = vehicles.filter((_, index) => index !== currentVehicleIndex);
//                 setVehicles(updatedVehicles);
                
//                 if (updatedVehicles.length > 0) {
//                   const newIndex = Math.max(0, Math.min(currentVehicleIndex, updatedVehicles.length - 1));
//                   handleSelectVehicle(newIndex);
//                 } else {
//                   setCurrentVehicleIndex(-1);
//                   setFormData({
//                     vehicleType: 'Truck',
//                     vehicleCapacity: { value: 0, unit: 'kg' },
//                     vehicleNumber: '',
//                     driverInfo: {
//                       driverName: '',
//                       driverMobileNo: '',
//                       driverAge: 0
//                     }
//                   });
//                 }
                
//                 setTimeout(() => {
//                   fetchVehicleData();
//                 }, 1000);
//               } else {
//                 throw new Error('Failed to delete vehicle');
//               }
//             } catch (error: any) {
//               console.error('Error deleting vehicle:', error);
//               setError(error.message || 'Failed to delete vehicle');
//             }
//           }
//         }
//       ]
//     );
//   };

//   const vehicleTypes = ['Pickup Van', 'Bolero', 'Tata Ace', 'Mini Truck', 'Lorry', 'Truck', 'Container', 'Trailer', 'Other'];
//   const capacityUnits = ['kg', 'ton', 'quintal', 'boxes'];

//   const documentFields = [
//     { key: 'rcBook', label: 'RC Book', required: true },
//     { key: 'insuranceDoc', label: 'Insurance Document', required: false },
//     { key: 'pollutionCert', label: 'Pollution Certificate', required: false },
//     { key: 'permitDoc', label: 'Permit Document', required: false },
//     { key: 'driverLicense', label: 'Driver License', required: false }
//   ];

//   const getFileIcon = (url: string | undefined) => {
//     if (!url) return Icons.FaFile;
    
//     if (url.includes('.pdf')) return Icons.FaFilePdf;
//     if (url.match(/\.(jpg|jpeg|png|gif)$/i)) return Icons.FaFileImage;
//     return Icons.FaFile;
//   };

//   const getFileName = (url: string | undefined) => {
//     if (!url) return 'Document';
    
//     const filename = url.split('/').pop() || 'document';
//     return filename.length > 25 ? filename.substring(0, 25) + '...' : filename;
//   };

//   if (fetching) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#3498db" />
//         <Text style={styles.loadingText}>Loading vehicle details...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
//         {/* Header */}
//         <View style={styles.header}>
//           <TouchableOpacity
//             onPress={() => router.back()}
//             style={styles.backButton}
//           >
//             <Icon name={Icons.FaArrowLeft} size={20} color="#3498db" />
//           </TouchableOpacity>
          
         
          
//           {!showAddVehicleForm && !isEditing && (
//             <View style={styles.headerButtons}>
//               {vehicles.length > 0 && currentVehicleIndex >= 0 && (
//                 <TouchableOpacity
//                   onPress={() => setIsEditing(true)}
//                   style={styles.editButton}
//                 >
//                   <Icon name={Icons.FaEdit} size={14} color="white" />
//                   <Text style={styles.buttonText}>Edit Vehicle</Text>
//                 </TouchableOpacity>
//               )}
//               <TouchableOpacity
//                 onPress={() => {
//                   setShowAddVehicleForm(true);
//                   setIsAddingNewVehicle(true);
//                   setFormData({
//                     vehicleType: 'Truck',
//                     vehicleCapacity: { value: 0, unit: 'kg' },
//                     vehicleNumber: '',
//                     driverInfo: {
//                       driverName: '',
//                       driverMobileNo: '',
//                       driverAge: 0
//                     }
//                   });
//                   setCurrentVehicleIndex(vehicles.length);
//                   updateCurrentDocuments({});
//                   updateCurrentFileUploads({});
//                   updateCurrentDeletingFiles([]);
//                 }}
//                 style={styles.addButton}
//               >
//                 <Icon name={Icons.FaPlus} size={14} color="white" />
//                 <Text style={styles.buttonText}>Add Vehicle</Text>
//               </TouchableOpacity>
//             </View>
//           )}
          
//           {showAddVehicleForm && (
//             <View style={styles.headerButtons}>
//               <TouchableOpacity
//                 onPress={handleCancelAddVehicle}
//                 style={styles.cancelButton}
//                 disabled={loading}
//               >
//                 <Icon name={Icons.FaTimes} size={14} color="#666" />
//                 <Text style={[styles.buttonText, { color: '#666' }]}>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={handleAddVehicle}
//                 disabled={loading}
//                 style={[styles.saveButton, loading && { opacity: 0.7 }]}
//               >
//                 {loading ? (
//                   <>
//                     <ActivityIndicator size="small" color="white" />
//                     <Text style={styles.buttonText}>Adding...</Text>
//                   </>
//                 ) : (
//                   <>
//                     <Icon name={Icons.FaCheck} size={14} color="white" />
//                     <Text style={styles.buttonText}>Add Vehicle</Text>
//                   </>
//                 )}
//               </TouchableOpacity>
//             </View>
//           )}
          
//           {isEditing && !showAddVehicleForm && (
//             <View style={styles.headerButtons}>
//               <TouchableOpacity
//                 onPress={handleCancelEdit}
//                 style={styles.cancelButton}
//                 disabled={loading}
//               >
//                 <Icon name={Icons.FaTimes} size={14} color="#666" />
//                 <Text style={[styles.buttonText, { color: '#666' }]}>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={handleSave}
//                 disabled={loading}
//                 style={[styles.saveButton, loading && { opacity: 0.7 }]}
//               >
//                 {loading ? (
//                   <>
//                     <ActivityIndicator size="small" color="white" />
//                     <Text style={styles.buttonText}>Saving...</Text>
//                   </>
//                 ) : (
//                   <>
//                     <Icon name={Icons.FaCheck} size={14} color="white" />
//                     <Text style={styles.buttonText}>Save Changes</Text>
//                   </>
//                 )}
//               </TouchableOpacity>
//             </View>
//           )}
//         </View>
         

//         {/* Vehicle Selection List */}
//         {vehicles.length > 0 && !showAddVehicleForm && (
//           <View style={styles.vehicleListContainer}>
//             <View style={styles.sectionHeader}>
//               <Icon name={Icons.FaList} size={20} color="#3498db" />
//               <Text style={styles.sectionTitle}>Your Vehicles</Text>
//             </View>
            
//             <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.vehicleScroll}>
//               {vehicles.map((vehicle, index) => (
//                 <TouchableOpacity
//                   key={index}
//                   onPress={() => handleSelectVehicle(index)}
//                   style={[
//                     styles.vehicleCard,
//                     currentVehicleIndex === index && styles.vehicleCardSelected
//                   ]}
//                 >
//                   <View style={styles.vehicleCardContent}>
//                     <Text style={[
//                       styles.vehicleNumber,
//                       currentVehicleIndex === index && styles.vehicleNumberSelected
//                     ]}>
//                       {vehicle.vehicleNumber}
//                     </Text>
//                     <Text style={[
//                       styles.vehicleType,
//                       currentVehicleIndex === index && styles.vehicleTypeSelected
//                     ]}>
//                       {vehicle.vehicleType}
//                     </Text>
//                   </View>
//                   <View style={styles.vehicleCardIcons}>
//                     {vehicle.primaryVehicle && (
//                       <Icon 
//                         name={Icons.FaStar} 
//                         size={16} 
//                         color={currentVehicleIndex === index ? 'white' : '#f39c12'} 
//                       />
//                     )}
//                     <Icon 
//                       name={Icons.FaArrowRight} 
//                       size={12} 
//                       color={currentVehicleIndex === index ? 'white' : '#666'} 
//                     />
//                   </View>
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
            
//             {vehicles.length > 1 && currentVehicleIndex >= 0 && formData.primaryVehicle !== undefined && !formData.primaryVehicle && (
//               <View style={styles.vehicleActions}>
//                 <TouchableOpacity
//                   onPress={handleSetPrimaryVehicle}
//                   style={styles.primaryButton}
//                 >
//                   <Icon name={Icons.FaStar} size={13} color="white" />
//                   <Text style={styles.smallButtonText}>Set as Primary</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   onPress={handleDeleteVehicle}
//                   style={styles.deleteButton}
//                 >
//                   <Icon name={Icons.FaTrash} size={13} color="white" />
//                   <Text style={styles.smallButtonText}>Delete Vehicle</Text>
//                 </TouchableOpacity>
//               </View>
//             )}
//           </View>
//         )}

//         {/* Error Display */}
//         {error && (
//           <View style={styles.errorContainer}>
//             <Text style={styles.errorText}><Text style={styles.bold}>Error:</Text> {error}</Text>
//           </View>
//         )}

//         {/* Validation Errors */}
//         {validationErrors.length > 0 && (
//           <View style={styles.validationContainer}>
//             <Text style={styles.validationTitle}><Text style={styles.bold}>Please fix the following errors:</Text></Text>
//             {validationErrors.map((error, index) => (
//               <Text key={index} style={styles.validationError}>• {error}</Text>
//             ))}
//           </View>
//         )}

//         {/* Show "No Vehicles" message */}
//         {vehicles.length === 0 && !showAddVehicleForm && (
//           <View style={styles.emptyContainer}>
//             <Icon name={Icons.FaTruck} size={48} color="#ddd" />
//             <Text style={styles.emptyTitle}>No Vehicles Added</Text>
//             <Text style={styles.emptyText}>
//               You haven't added any vehicles yet. Click "Add Vehicle" to get started.
//             </Text>
//             <TouchableOpacity
//               onPress={() => {
//                 setShowAddVehicleForm(true);
//                 setIsAddingNewVehicle(true);
//                 setFormData({
//                   vehicleType: 'Truck',
//                   vehicleCapacity: { value: 0, unit: 'kg' },
//                   vehicleNumber: '',
//                   driverInfo: {
//                     driverName: '',
//                     driverMobileNo: '',
//                     driverAge: 0
//                   }
//                 });
//               }}
//               style={styles.firstVehicleButton}
//             >
//               <Icon name={Icons.FaPlus} size={16} color="white" />
//               <Text style={styles.firstVehicleButtonText}>Add Your First Vehicle</Text>
//             </TouchableOpacity>
//           </View>
//         )}

//         {/* Show current vehicle or new vehicle form */}
//         {(vehicles.length > 0 && currentVehicleIndex >= 0 && !showAddVehicleForm) || showAddVehicleForm ? (
//           <>
//             {/* Primary Vehicle Badge */}
//             {formData.primaryVehicle && !showAddVehicleForm && (
//               <View style={styles.primaryBadge}>
//                 <Icon name={Icons.FaStar} size={16} color="#f39c12" />
//                 <Text style={styles.primaryBadgeText}>This is your primary vehicle</Text>
//               </View>
//             )}

//             {/* Vehicle Information Section */}
//             <View style={styles.sectionContainer}>
//               <View style={styles.sectionHeader}>
//                 <Icon name={Icons.FaTruck} size={24} color="#3498db" />
//                 <Text style={styles.sectionTitle}>
//                   {showAddVehicleForm ? 'New Vehicle Details' : 'Vehicle Details'}
//                 </Text>
//               </View>
              
//               <View style={styles.formGrid}>
//                 <View style={styles.formGroup}>
//                   <Text style={styles.label}>Vehicle Type</Text>
//                   {isEditing || showAddVehicleForm ? (
//                     <View style={styles.pickerContainer}>
//                       <Picker
//                         selectedValue={formData.vehicleType}
//                         onValueChange={(value) => handleInputChange('vehicleType', value)}
//                         style={styles.picker}
//                       >
//                         {vehicleTypes.map(type => (
//                           <Picker.Item key={type} label={type} value={type} />
//                         ))}
//                       </Picker>
//                     </View>
//                   ) : (
//                     <View style={styles.readOnlyField}>
//                       <Text style={styles.readOnlyText}>{formData.vehicleType}</Text>
//                     </View>
//                   )}
//                 </View>

//                 <View style={styles.formGroup}>
//                   <Text style={styles.label}>Vehicle Number</Text>
//                   {isEditing || showAddVehicleForm ? (
//                     <TextInput
//                       value={formData.vehicleNumber}
//                       onChangeText={(value) => handleInputChange('vehicleNumber', value.toUpperCase())}
//                       style={styles.input}
//                       placeholder="e.g., TN01AB1234"
//                       placeholderTextColor="#999"
//                       autoCapitalize="characters"
//                     />
//                   ) : (
//                     <View style={styles.readOnlyField}>
//                       <Text style={styles.readOnlyText}>{formData.vehicleNumber}</Text>
//                     </View>
//                   )}
//                 </View>

//                 <View style={styles.formGroup}>
//                   <Text style={styles.label}>Vehicle Capacity</Text>
//                   {isEditing || showAddVehicleForm ? (
//                     <View style={styles.capacityContainer}>
//                       <TextInput
//                         value={formData.vehicleCapacity.value.toString()}
//                         onChangeText={(value) => handleVehicleCapacityChange('value', parseInt(value) || 0)}
//                         style={[styles.input, styles.capacityInput]}
//                         keyboardType="numeric"
//                         placeholder="0"
//                         placeholderTextColor="#999"
//                       />
//                       <View style={styles.pickerContainer}>
//                         <Picker
//                           selectedValue={formData.vehicleCapacity.unit}
//                           onValueChange={(value) => handleVehicleCapacityChange('unit', value)}
//                           style={styles.picker}
//                         >
//                           {capacityUnits.map(unit => (
//                             <Picker.Item key={unit} label={unit} value={unit} />
//                           ))}
//                         </Picker>
//                       </View>
//                     </View>
//                   ) : (
//                     <View style={styles.readOnlyField}>
//                       <Text style={styles.readOnlyText}>
//                         {formData.vehicleCapacity.value} {formData.vehicleCapacity.unit}
//                       </Text>
//                     </View>
//                   )}
//                 </View>
//               </View>
//             </View>

//             {/* Driver Information Section */}
//             <View style={styles.sectionContainer}>
//               <View style={styles.sectionHeader}>
//                 <Icon name={Icons.FaUser} size={24} color="#3498db" />
//                 <Text style={styles.sectionTitle}>Driver Details</Text>
//               </View>
              
//               <View style={styles.formGrid}>
//                 <View style={styles.formGroup}>
//                   <Text style={styles.label}>Driver Name</Text>
//                   {isEditing || showAddVehicleForm ? (
//                     <TextInput
//                       value={formData.driverInfo.driverName}
//                       onChangeText={(value) => handleDriverInfoChange('driverName', value)}
//                       style={styles.input}
//                       placeholder="Enter driver name"
//                       placeholderTextColor="#999"
//                     />
//                   ) : (
//                     <View style={styles.readOnlyField}>
//                       <Text style={styles.readOnlyText}>{formData.driverInfo.driverName}</Text>
//                     </View>
//                   )}
//                 </View>

//                 <View style={styles.formGroup}>
//                   <Text style={styles.label}>Driver Mobile No.</Text>
//                   {isEditing || showAddVehicleForm ? (
//                     <TextInput
//                       value={formData.driverInfo.driverMobileNo}
//                       onChangeText={(value) => handleDriverInfoChange('driverMobileNo', value)}
//                       style={styles.input}
//                       keyboardType="phone-pad"
//                       maxLength={10}
//                       placeholder="10-digit number"
//                       placeholderTextColor="#999"
//                     />
//                   ) : (
//                     <View style={styles.readOnlyField}>
//                       <Text style={styles.readOnlyText}>{formData.driverInfo.driverMobileNo}</Text>
//                     </View>
//                   )}
//                 </View>

//                 <View style={styles.formGroup}>
//                   <Text style={styles.label}>Driver Age</Text>
//                   {isEditing || showAddVehicleForm ? (
//                     <TextInput
//                       value={formData.driverInfo.driverAge.toString()}
//                       onChangeText={(value) => handleDriverInfoChange('driverAge', parseInt(value) || 0)}
//                       style={styles.input}
//                       keyboardType="numeric"
//                       placeholder="Age"
//                       placeholderTextColor="#999"
//                     />
//                   ) : (
//                     <View style={styles.readOnlyField}>
//                       <Text style={styles.readOnlyText}>{formData.driverInfo.driverAge} years</Text>
//                     </View>
//                   )}
//                 </View>
//               </View>
//             </View>

//             {/* Vehicle Documents Section */}
//             <View style={styles.sectionContainer}>
//               <Text style={[styles.sectionTitle, { marginBottom: 20 }]}>
//                 Vehicle Documents
//               </Text>
              
//               <View style={styles.documentsGrid}>
//                 {documentFields.map(doc => {
//                   const currentDocs = getCurrentDocuments();
//                   const currentUploads = getCurrentFileUploads();
//                   const currentDeleting = getCurrentDeletingFiles();
                  
//                   const docValue = currentDocs[doc.key];
//                   const uploadedFile = currentUploads[doc.key];
//                   const isMarkedForDeletion = currentDeleting.includes(doc.key);
//                   const hasExistingDoc = docValue && docValue.trim() !== '';
                  
//                   return (
//                     <View 
//                       key={doc.key} 
//                       style={[
//                         styles.documentCard,
//                         isMarkedForDeletion && styles.documentCardDeleted
//                       ]}
//                     >
//                       <View style={styles.documentHeader}>
//                         <Text style={styles.documentLabel}>
//                           {doc.label}
//                           {(doc.required && !showAddVehicleForm) && <Text style={styles.requiredStar}> *</Text>}
//                           {(doc.required && showAddVehicleForm) && <Text style={styles.requiredStar}> *</Text>}
//                         </Text>
                        
//                         {!isEditing && !showAddVehicleForm && hasExistingDoc && (
//                           <TouchableOpacity
//                             onPress={() => viewDocument(doc.key, docValue!)}
//                             style={styles.viewButton}
//                           >
//                             <Icon name={Icons.FaDownload} size={14} color="white" />
//                             <Text style={styles.smallButtonText}>View/Download</Text>
//                           </TouchableOpacity>
//                         )}
//                       </View>
                      
//                       {!isEditing && !showAddVehicleForm ? (
//                         // View Mode
//                         <View>
//                           {hasExistingDoc ? (
//                             <TouchableOpacity
//                               onPress={() => viewDocument(doc.key, docValue!)}
//                               style={styles.documentItem}
//                             >
//                               <View style={styles.documentInfo}>
//                                 <Icon name={getFileIcon(docValue)} size={20} color="#3498db" />
//                                 <View style={styles.documentDetails}>
//                                   <Text style={styles.documentName} numberOfLines={1}>
//                                     {getFileName(docValue)}
//                                   </Text>
//                                   <Text style={styles.documentHint}>
//                                     Tap to view/download
//                                   </Text>
//                                 </View>
//                               </View>
//                               <Icon name={Icons.FaDownload} size={18} color="#3498db" />
//                             </TouchableOpacity>
//                           ) : (
//                             <View style={styles.noDocument}>
//                               <Text style={styles.noDocumentText}>No document uploaded</Text>
//                             </View>
//                           )}
//                         </View>
//                       ) : (
//                         // Edit Mode
//                         <View>
//                           <View style={styles.uploadContainer}>
//                             <Text style={styles.uploadLabel}>
//                               {showAddVehicleForm ? 'Upload File' : 'Upload New File (replaces existing)'}
//                             </Text>
//                             <TouchableOpacity
//                               onPress={() => pickDocument(doc.key)}
//                               style={[
//                                 styles.uploadArea,
//                                 uploadedFile && styles.uploadAreaFilled
//                               ]}
//                             >
//                               <Icon name={Icons.FaUpload} size={24} color="#3498db" />
//                               {uploadedFile ? (
//                                 <View style={styles.uploadedFileInfo}>
//                                   <Text style={styles.uploadedFileName} numberOfLines={1}>
//                                     {uploadedFile.file.name}
//                                   </Text>
//                                   <Text style={styles.uploadedFileSize}>
//                                     {(uploadedFile.file.size / 1024).toFixed(2)} KB - {showAddVehicleForm ? 'Ready to upload' : 'Will replace existing file'}
//                                   </Text>
//                                 </View>
//                               ) : (
//                                 <View>
//                                   <Text style={styles.uploadText}>Click to upload {doc.label}</Text>
//                                   <Text style={styles.uploadHint}>
//                                     PDF, JPG, PNG (Max 10MB)
//                                   </Text>
//                                 </View>
//                               )}
//                             </TouchableOpacity>
//                             {uploadedFile && (
//                               <TouchableOpacity
//                                 onPress={() => {
//                                   const newUploads = { ...getCurrentFileUploads() };
//                                   delete newUploads[doc.key];
//                                   updateCurrentFileUploads(newUploads);
//                                 }}
//                                 style={styles.removeUploadButton}
//                               >
//                                 <Icon name={Icons.FaTimes} size={12} color="#e74c3c" />
//                                 <Text style={styles.removeUploadText}>Remove uploaded file</Text>
//                               </TouchableOpacity>
//                             )}
//                           </View>
                          
//                           {hasExistingDoc && !isMarkedForDeletion && !showAddVehicleForm && (
//                             <View style={styles.existingDocument}>
//                               <View style={styles.existingDocHeader}>
//                                 <Text style={styles.existingDocLabel}>Current Document:</Text>
//                                 <Text style={styles.existingDocName} numberOfLines={1}>
//                                   {getFileName(docValue)}
//                                 </Text>
//                               </View>
//                               <View style={styles.existingDocActions}>
//                                 <TouchableOpacity
//                                   onPress={() => viewDocument(doc.key, docValue!)}
//                                   style={styles.viewDocButton}
//                                 >
//                                   <Icon name={Icons.FaDownload} size={12} color="white" />
//                                   <Text style={styles.smallButtonText}>View</Text>
//                                 </TouchableOpacity>
//                                 <TouchableOpacity
//                                   onPress={() => handleRemoveDocument(doc.key)}
//                                   style={styles.removeDocButton}
//                                 >
//                                   <Icon name={Icons.FaTrash} size={12} color="#e74c3c" />
//                                   <Text style={[styles.smallButtonText, { color: '#e74c3c' }]}>Remove</Text>
//                                 </TouchableOpacity>
//                               </View>
//                             </View>
//                           )}
                          
//                           {isMarkedForDeletion && !showAddVehicleForm && (
//                             <View style={styles.deletionWarning}>
//                               <Text style={styles.deletionWarningText}>
//                                 ⚠️ This document will be deleted. Upload a new file or restore.
//                               </Text>
//                               <TouchableOpacity
//                                 onPress={() => handleRestoreDocument(doc.key, uploadedFile?.currentUrl || '')}
//                                 style={styles.restoreButton}
//                               >
//                                 <Text style={styles.restoreButtonText}>Restore</Text>
//                               </TouchableOpacity>
//                             </View>
//                           )}
//                         </View>
//                       )}
//                     </View>
//                   );
//                 })}
//               </View>
//             </View>
//           </>
//         ) : null}
//       </ScrollView>

//       {/* Document Modal */}
//       <Modal
//         visible={modalVisible}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Document</Text>
//               <TouchableOpacity onPress={() => setModalVisible(false)}>
//                 <Icon name={Icons.FaTimesCircle} size={24} color="#666" />
//               </TouchableOpacity>
//             </View>
//             <Text style={styles.modalText}>
//               Document opened in browser. You can view or download it from there.
//             </Text>
//             <TouchableOpacity
//               style={styles.modalButton}
//               onPress={() => {
//                 if (selectedDoc) {
//                   Linking.openURL(selectedDoc.url);
//                 }
//                 setModalVisible(false);
//               }}
//             >
//               <Text style={styles.modalButtonText}>Open in Browser</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//   flex: 1,
//   backgroundColor: '#F2F3F7',
// },
//   scrollView: {
//     flex: 1,
//   },
//   scrollContent: {
//     padding: 20,
//     paddingBottom: 40,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5',
//   },
//   loadingText: {
//     marginTop: 20,
//     color: '#666',
//     fontSize: 16,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: 20,
//     paddingBottom: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#e0e0e0',
//     flexWrap: 'wrap',
//   },
//   backButton: {
//     padding: 8,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#2c3e50',
//     flex: 1,
//     marginLeft: 10,
//   },
//   vehicleCount: {
//     fontSize: 14,
//     color: '#666',
//     fontWeight: 'normal',
//   },
//   headerButtons: {
//     flexDirection: 'row',
//     gap: 10,
//     flexWrap: 'wrap',
//   },
//   editButton: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     backgroundColor: '#3498db',
//     borderRadius: 5,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   addButton: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     backgroundColor: '#2ecc71',
//     borderRadius: 5,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   cancelButton: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     backgroundColor: 'white',
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 5,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   saveButton: {
//   backgroundColor: '#5B5AF7',
//   paddingVertical: 16,
//   borderRadius: 28,
//   alignItems: 'center',
//   justifyContent: 'center',
//   width: '100%',
// },

//  buttonText: {
//   color: '#FFFFFF',
//   fontSize: 16,
//   fontWeight: '600',
// },

//   vehicleListContainer: {
//     backgroundColor: 'white',
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 10,
//     elevation: 3,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 15,
//     paddingBottom: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#2c3e50',
//     marginLeft: 10,
//   },
//   vehicleScroll: {
//     flexDirection: 'row',
//   },
//   vehicleCard: {
//     padding: 12,
//     backgroundColor: '#f8f9fa',
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//     borderRadius: 8,
//     minWidth: 200,
//     marginRight: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   vehicleCardSelected: {
//     backgroundColor: '#3498db',
//     borderColor: '#3498db',
//   },
//   vehicleCardContent: {
//     flex: 1,
//   },
//   vehicleNumber: {
//     fontWeight: 'bold',
//     color: '#2c3e50',
//     fontSize: 14,
//   },
//   vehicleNumberSelected: {
//     color: 'white',
//   },
//   vehicleType: {
//     fontSize: 12,
//     color: '#666',
//     marginTop: 2,
//   },
//   vehicleTypeSelected: {
//     color: 'rgba(255,255,255,0.8)',
//   },
//   vehicleCardIcons: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 5,
//   },
//   vehicleActions: {
//     flexDirection: 'row',
//     gap: 10,
//     marginTop: 15,
//   },
//   primaryButton: {
//     paddingHorizontal: 15,
//     paddingVertical: 8,
//     backgroundColor: '#f39c12',
//     borderRadius: 5,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   deleteButton: {
//     paddingHorizontal: 15,
//     paddingVertical: 8,
//     backgroundColor: '#e74c3c',
//     borderRadius: 5,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   smallButtonText: {
//     color: 'white',
//     fontSize: 13,
//     fontWeight: '600',
//   },
//   errorContainer: {
//     backgroundColor: '#ffeaea',
//     padding: 15,
//     borderRadius: 5,
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: '#ffcdcd',
//   },
//   errorText: {
//     color: '#e74c3c',
//     fontSize: 14,
//   },
//   bold: {
//     fontWeight: 'bold',
//   },
//   validationContainer: {
//     backgroundColor: '#fff3cd',
//     padding: 15,
//     borderRadius: 5,
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: '#ffeaa7',
//   },
//   validationTitle: {
//     color: '#856404',
//     fontSize: 14,
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   validationError: {
//     color: '#856404',
//     fontSize: 14,
//     marginLeft: 10,
//     marginTop: 2,
//   },
//   emptyContainer: {
//     backgroundColor: 'white',
//     padding: 40,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 10,
//     elevation: 3,
//   },
//   emptyTitle: {
//     color: '#666',
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     marginTop: 20,
//   },
//   emptyText: {
//     color: '#999',
//     textAlign: 'center',
//     marginBottom: 20,
//     lineHeight: 20,
//   },
//   firstVehicleButton: {
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     backgroundColor: '#2ecc71',
//     borderRadius: 5,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   firstVehicleButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   primaryBadge: {
//     backgroundColor: '#fff3cd',
//     padding: 10,
//     borderRadius: 5,
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: '#ffeaa7',
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 10,
//   },
//   primaryBadgeText: {
//     color: '#856404',
//     fontSize: 14,
//   },
//   sectionContainer: {
//     backgroundColor: 'white',
//     padding: 20,
//     borderRadius: 10,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 10,
//     elevation: 3,
//   },
//   formGrid: {
//     gap: 15,
//   },
//   formGroup: {
//     marginBottom: 15,
//   },
//  label: {
//   fontSize: 12,
//   color: '#9AA0A6',
//   fontWeight: '500',
//   marginBottom: 4,
// },

//   pickerContainer: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 5,
//     overflow: 'hidden',
//   },
//   picker: {
//     height: 50,
//     backgroundColor: 'white',
//   },
// input: {
//   borderBottomWidth: 1,
//   borderBottomColor: '#DADCE0',
//   paddingVertical: 10,
//   fontSize: 16,
//   backgroundColor: 'transparent',
//   color: '#111',
// },

//   capacityContainer: {
//     flexDirection: 'row',
//     gap: 10,
//   },
//   capacityInput: {
//     flex: 1,
//   },
//   readOnlyField: {
//     borderWidth: 1,
//     borderColor: '#eee',
//     borderRadius: 5,
//     padding: 12,
//     backgroundColor: '#f9f9f9',
//   },
//   readOnlyText: {
//     fontSize: 16,
//     color: '#333',
//   },
//   documentsGrid: {
//     gap: 20,
//   },
//   documentCard: {
//     padding: 15,
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//     borderRadius: 8,
//     backgroundColor: '#fafafa',
//   },
//   documentCardDeleted: {
//     opacity: 0.7,
//   },
//   documentHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   documentLabel: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#2c3e50',
//   },
//   requiredStar: {
//     color: '#e74c3c',
//   },
//   viewButton: {
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     backgroundColor: '#3498db',
//     borderRadius: 5,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   documentItem: {
//     padding: 15,
//     backgroundColor: 'white',
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 5,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   documentInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 10,
//     flex: 1,
//   },
//   documentDetails: {
//     flex: 1,
//   },
//   documentName: {
//     fontWeight: 'bold',
//     fontSize: 14,
//     color: '#2c3e50',
//   },
//   documentHint: {
//     fontSize: 12,
//     color: '#666',
//     marginTop: 2,
//   },
//   noDocument: {
//     padding: 15,
//     backgroundColor: '#f5f5f5',
//     borderWidth: 1,
//     borderStyle: 'dashed',
//     borderColor: '#ccc',
//     borderRadius: 5,
//     alignItems: 'center',
//   },
//   noDocumentText: {
//     color: '#999',
//     fontSize: 14,
//   },
//   uploadContainer: {
//     marginBottom: 15,
//   },
//   uploadLabel: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 5,
//   },
//   uploadArea: {
//     borderWidth: 2,
//     borderStyle: 'dashed',
//     borderColor: '#ddd',
//     borderRadius: 5,
//     padding: 20,
//     alignItems: 'center',
//     backgroundColor: 'white',
//   },
//   uploadAreaFilled: {
//     backgroundColor: '#f0f8ff',
//   },
//   uploadText: {
//     color: '#666',
//     textAlign: 'center',
//     marginTop: 10,
//     fontSize: 14,
//   },
//   uploadHint: {
//     fontSize: 12,
//     color: '#999',
//     textAlign: 'center',
//     marginTop: 5,
//   },
//   uploadedFileInfo: {
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   uploadedFileName: {
//     fontWeight: 'bold',
//     color: '#2c3e50',
//     fontSize: 14,
//     textAlign: 'center',
//   },
//   uploadedFileSize: {
//     fontSize: 12,
//     color: '#666',
//     textAlign: 'center',
//     marginTop: 2,
//   },
//   removeUploadButton: {
//     marginTop: 10,
//     paddingVertical: 5,
//     paddingHorizontal: 10,
//     backgroundColor: '#ffeaea',
//     borderWidth: 1,
//     borderColor: '#ffcdcd',
//     borderRadius: 5,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 5,
//     alignSelf: 'flex-start',
//   },
//   removeUploadText: {
//     color: '#e74c3c',
//     fontSize: 12,
//   },
//   existingDocument: {
//     padding: 10,
//     backgroundColor: '#f8f9fa',
//     borderWidth: 1,
//     borderColor: '#e9ecef',
//     borderRadius: 5,
//     marginBottom: 10,
//   },
//   existingDocHeader: {
//     marginBottom: 8,
//   },
//   existingDocLabel: {
//     fontWeight: 'bold',
//     fontSize: 14,
//     color: '#666',
//   },
//   existingDocName: {
//     fontSize: 12,
//     color: '#333',
//   },
//   existingDocActions: {
//     flexDirection: 'row',
//     gap: 10,
//   },
//   viewDocButton: {
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     backgroundColor: '#3498db',
//     borderRadius: 5,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 5,
//   },
//   removeDocButton: {
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     backgroundColor: '#ffeaea',
//     borderWidth: 1,
//     borderColor: '#ffcdcd',
//     borderRadius: 5,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 5,
//   },
//   deletionWarning: {
//     padding: 10,
//     backgroundColor: '#fff3cd',
//     borderWidth: 1,
//     borderColor: '#ffeaa7',
//     borderRadius: 5,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     flexWrap: 'wrap',
//   },
//   deletionWarningText: {
//     fontSize: 14,
//     color: '#856404',
//     flex: 1,
//     marginRight: 10,
//   },
//   restoreButton: {
//     backgroundColor: '#d4edda',
//     borderWidth: 1,
//     borderColor: '#c3e6cb',
//     borderRadius: 5,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//   },
//   restoreButtonText: {
//     color: '#155724',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     borderRadius: 10,
//     padding: 20,
//     width: '80%',
//     maxWidth: 400,
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#2c3e50',
//   },
//   modalText: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 20,
//     lineHeight: 20,
//   },
//   modalButton: {
//     backgroundColor: '#3498db',
//     padding: 12,
//     borderRadius: 5,
//     alignItems: 'center',
//   },
//   modalButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   formCard: {
//   backgroundColor: '#FFFFFF',
//   borderRadius: 20,
//   padding: 20,
//   marginBottom: 24,
//   shadowColor: '#000',
//   shadowOpacity: 0.08,
//   shadowRadius: 12,
//   shadowOffset: { width: 0, height: 4 },
//   elevation: 4,
// },

// imageWrapper: {
//   alignItems: 'center',
//   marginVertical: 20,
// },
// carImage: {
//   width: width * 0.55,
//   height: 120,
//   opacity: 0.95,
// },

// });

// export default VehiclesPage;



import React, { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
  Image,
  Modal,
  Linking,
  Dimensions
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

const { width } = Dimensions.get('window');

// Define icon names mapping
const Icons = {
  FaArrowLeft: 'arrow-left',
  FaSave: 'save',
  FaTimes: 'times',
  FaTruck: 'truck',
  FaUser: 'user',
  FaEdit: 'edit',
  FaCheck: 'check',
  FaDownload: 'download',
  FaUpload: 'upload',
  FaFilePdf: 'file-pdf-o',
  FaFileImage: 'file-image-o',
  FaFile: 'file',
  FaTrash: 'trash',
  FaPlus: 'plus',
  FaList: 'list',
  FaStar: 'star',
  FaArrowRight: 'arrow-right',
  FaTimesCircle: 'times-circle'
};

interface VehicleCapacity {
  value: number;
  unit: string;
}

interface DriverInfo {
  driverName: string;
  driverMobileNo: string;
  driverAge: number;
  driverLicense?: string;
  driverPhoto?: string;
}

interface VehicleDocuments {
  rcBook?: string;
  insuranceDoc?: string;
  pollutionCert?: string;
  permitDoc?: string;
}

interface VehicleFormData {
  vehicleType: string;
  vehicleCapacity: VehicleCapacity;
  vehicleNumber: string;
  vehicleDocuments?: VehicleDocuments;
  driverInfo: DriverInfo;
  primaryVehicle?: boolean;
  _id?: string;
  addedAt?: string;
}

interface DocumentsType {
  [key: string]: string | undefined;
}

interface DocumentFile {
  file: any | null;
  currentUrl: string;
}

const VehiclesPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<VehicleFormData>({
    vehicleType: 'Truck',
    vehicleCapacity: { value: 0, unit: 'kg' },
    vehicleNumber: '',
    driverInfo: {
      driverName: '',
      driverMobileNo: '',
      driverAge: 0
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState<VehicleFormData | null>(null);
  const [fileUploads, setFileUploads] = useState<{[key: string]: DocumentFile}>({});
  const [deletingFiles, setDeletingFiles] = useState<string[]>([]);
  
  // Multi-vehicle states
  const [vehicles, setVehicles] = useState<VehicleFormData[]>([]);
  const [currentVehicleIndex, setCurrentVehicleIndex] = useState<number>(-1);
  const [showAddVehicleForm, setShowAddVehicleForm] = useState(false);
  const [isAddingNewVehicle, setIsAddingNewVehicle] = useState(false);
  
  // Store documents separately for each vehicle
  const [vehiclesDocuments, setVehiclesDocuments] = useState<{[key: number]: DocumentsType}>({});
  const [vehiclesFileUploads, setVehiclesFileUploads] = useState<{[key: number]: {[key: string]: DocumentFile}}>({});
  const [vehiclesDeletingFiles, setVehiclesDeletingFiles] = useState<{[key: number]: string[]}>({});

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<{key: string, url: string} | null>(null);

  useEffect(() => {
    fetchVehicleData();
  }, []);

  const fetchVehicleData = async () => {
    try {
      setFetching(true);
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
        
        let fetchedVehicles: VehicleFormData[] = [];
        
        if (userData.transportInfo?.vehicles && userData.transportInfo.vehicles.length > 0) {
          fetchedVehicles = userData.transportInfo.vehicles.map((vehicle: any) => ({
            vehicleType: vehicle.vehicleType || 'Truck',
            vehicleCapacity: vehicle.vehicleCapacity || { value: 0, unit: 'kg' },
            vehicleNumber: vehicle.vehicleNumber || '',
            vehicleDocuments: vehicle.vehicleDocuments || {},
            driverInfo: {
              driverName: vehicle.driverInfo?.driverName || '',
              driverMobileNo: vehicle.driverInfo?.driverMobileNo || '',
              driverAge: vehicle.driverInfo?.driverAge || 0,
              driverLicense: vehicle.driverInfo?.driverLicense,
              driverPhoto: vehicle.driverInfo?.driverPhoto
            },
            primaryVehicle: vehicle.primaryVehicle || false,
            _id: vehicle._id,
            addedAt: vehicle.addedAt
          }));
        } else if (userData.transportInfo?.vehicleNumber) {
          fetchedVehicles = [{
            vehicleType: userData.transportInfo?.vehicleType || 'Truck',
            vehicleCapacity: userData.transportInfo?.vehicleCapacity || { value: 0, unit: 'kg' },
            vehicleNumber: userData.transportInfo?.vehicleNumber || '',
            vehicleDocuments: userData.transportInfo?.vehicleDocuments || {},
            driverInfo: {
              driverName: userData.transportInfo?.driverInfo?.driverName || '',
              driverMobileNo: userData.transportInfo?.driverInfo?.driverMobileNo || '',
              driverAge: userData.transportInfo?.driverInfo?.driverAge || 0,
              driverLicense: userData.transportInfo?.driverInfo?.driverLicense,
              driverPhoto: userData.transportInfo?.driverInfo?.driverPhoto
            },
            primaryVehicle: true,
            _id: userData._id
          }];
        }

        setVehicles(fetchedVehicles);
        
        const docsMap: {[key: number]: DocumentsType} = {};
        const fileUploadsMap: {[key: number]: {[key: string]: DocumentFile}} = {};
        const deletingFilesMap: {[key: number]: string[]} = {};
        
        fetchedVehicles.forEach((vehicle, index) => {
          const vehicleDocs: DocumentsType = {};
          
          if (vehicle.vehicleDocuments) {
            Object.entries(vehicle.vehicleDocuments).forEach(([key, value]) => {
              if (value && typeof value === 'string') {
                vehicleDocs[key] = value;
              }
            });
          }
          
          if (vehicle.driverInfo?.driverLicense) {
            vehicleDocs['driverLicense'] = vehicle.driverInfo.driverLicense;
          }
          
          docsMap[index] = vehicleDocs;
          fileUploadsMap[index] = {};
          deletingFilesMap[index] = [];
        });
        
        setVehiclesDocuments(docsMap);
        setVehiclesFileUploads(fileUploadsMap);
        setVehiclesDeletingFiles(deletingFilesMap);
        
        if (fetchedVehicles.length > 0) {
          const primaryIndex = fetchedVehicles.findIndex(v => v.primaryVehicle);
          const defaultIndex = primaryIndex >= 0 ? primaryIndex : 0;
          setCurrentVehicleIndex(defaultIndex);
          
          const currentVehicle = fetchedVehicles[defaultIndex];
          setFormData(currentVehicle);
          setOriginalData(currentVehicle);
        }
        
      } else {
        throw new Error(response?.data?.message || 'Failed to fetch vehicle data');
      }
    } catch (error: any) {
      console.error('Error fetching vehicle data:', error);
      setError(error.message || 'Failed to load vehicle data');
    } finally {
      setFetching(false);
    }
  };

  const getCurrentDocuments = () => {
    return currentVehicleIndex >= 0 ? vehiclesDocuments[currentVehicleIndex] || {} : {};
  };

  const getCurrentFileUploads = () => {
    return currentVehicleIndex >= 0 ? vehiclesFileUploads[currentVehicleIndex] || {} : {};
  };

  const getCurrentDeletingFiles = () => {
    return currentVehicleIndex >= 0 ? vehiclesDeletingFiles[currentVehicleIndex] || [] : [];
  };

  const updateCurrentDocuments = (newDocs: DocumentsType) => {
    if (currentVehicleIndex >= 0) {
      setVehiclesDocuments(prev => ({
        ...prev,
        [currentVehicleIndex]: newDocs
      }));
    }
  };

  const updateCurrentFileUploads = (newUploads: {[key: string]: DocumentFile}) => {
    if (currentVehicleIndex >= 0) {
      setVehiclesFileUploads(prev => ({
        ...prev,
        [currentVehicleIndex]: newUploads
      }));
    }
  };

  const updateCurrentDeletingFiles = (newDeleting: string[]) => {
    if (currentVehicleIndex >= 0) {
      setVehiclesDeletingFiles(prev => ({
        ...prev,
        [currentVehicleIndex]: newDeleting
      }));
    }
  };

  const handleInputChange = (field: keyof VehicleFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setValidationErrors([]);
  };

  const handleDriverInfoChange = (field: keyof VehicleFormData['driverInfo'], value: any) => {
    setFormData(prev => ({
      ...prev,
      driverInfo: {
        ...prev.driverInfo,
        [field]: value
      }
    }));
    setValidationErrors([]);
  };

  const handleVehicleCapacityChange = (field: 'value' | 'unit', value: any) => {
    setFormData(prev => ({
      ...prev,
      vehicleCapacity: {
        ...prev.vehicleCapacity,
        [field]: field === 'value' ? parseInt(value) || 0 : value
      }
    }));
    setValidationErrors([]);
  };

  const pickDocument = async (docKey: string) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true
      });
      
      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const file = {
          uri: asset.uri,
          name: asset.name || `document_${Date.now()}`,
          type: asset.mimeType || 'application/octet-stream',
          size: asset.size || 0
        };
        
        const currentDocs = getCurrentDocuments();
        const newUploads = {
          ...getCurrentFileUploads(),
          [docKey]: {
            file,
            currentUrl: currentDocs[docKey] || ''
          }
        };
        updateCurrentFileUploads(newUploads);
      }
    } catch (error) {
      console.error('Error picking document:', error);
      setError('Failed to pick document');
    }
  };

  const handleRemoveDocument = (docKey: string) => {
    const currentDocs = getCurrentDocuments();
    const currentDeleting = getCurrentDeletingFiles();
    
    updateCurrentDeletingFiles([...currentDeleting, docKey]);
    
    const newDocs = { ...currentDocs };
    delete newDocs[docKey];
    updateCurrentDocuments(newDocs);
    
    const newUploads = { ...getCurrentFileUploads() };
    delete newUploads[docKey];
    updateCurrentFileUploads(newUploads);
  };

  const handleRestoreDocument = (docKey: string, originalUrl: string) => {
    const currentDeleting = getCurrentDeletingFiles();
    const currentDocs = getCurrentDocuments();
    
    updateCurrentDeletingFiles(currentDeleting.filter(item => item !== docKey));
    
    updateCurrentDocuments({
      ...currentDocs,
      [docKey]: originalUrl
    });
  };

  const viewDocument = async (docKey: string, url: string) => {
    try {
      let fullUrl = url;
      if (url.startsWith('/uploads/')) {
        fullUrl = `https://kisan.etpl.ai${url}`;
      } else if (!url.startsWith('http')) {
        fullUrl = `https://kisan.etpl.ai/uploads/${url}`;
      }
      
      const supported = await Linking.canOpenURL(fullUrl);
      if (supported) {
        await Linking.openURL(fullUrl);
      } else {
        setSelectedDoc({ key: docKey, url: fullUrl });
        setModalVisible(true);
      }
    } catch (error) {
      console.error('Error viewing document:', error);
      setError(`Failed to view ${docKey}`);
    }
  };

  const downloadDocument = async (docKey: string, url: string) => {
    try {
      let fullUrl = url;
      if (url.startsWith('/uploads/')) {
        fullUrl = `https://kisan.etpl.ai${url}`;
      } else if (!url.startsWith('http')) {
        fullUrl = `https://kisan.etpl.ai/uploads/${url}`;
      }
      
      const supported = await Linking.canOpenURL(fullUrl);
      if (supported) {
        await Linking.openURL(fullUrl);
      }
    } catch (error) {
      console.error('Error downloading document:', error);
      setError(`Failed to download ${docKey}`);
    }
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!formData.vehicleNumber.trim()) {
      errors.push('Vehicle number is required');
    }
    
    if (!formData.vehicleCapacity.value || formData.vehicleCapacity.value <= 0) {
      errors.push('Valid vehicle capacity is required');
    }
    
    if (!formData.driverInfo.driverName.trim()) {
      errors.push('Driver name is required');
    }
    
    if (!formData.driverInfo.driverMobileNo.trim() || !/^\d{10}$/.test(formData.driverInfo.driverMobileNo)) {
      errors.push('Valid 10-digit driver mobile number is required');
    }
    
    if (!formData.driverInfo.driverAge || formData.driverInfo.driverAge < 18 || formData.driverInfo.driverAge > 70) {
      errors.push('Driver age must be between 18 and 70');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      setError('Please fix the validation errors below');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        throw new Error('User not logged in');
      }

      const currentDocs = getCurrentDocuments();
      const currentUploads = getCurrentFileUploads();
      const currentDeleting = getCurrentDeletingFiles();
      
      const formDataToSend = new FormData();
      
      const vehicleInfo = {
        vehicleType: formData.vehicleType,
        vehicleCapacity: {
          value: formData.vehicleCapacity.value,
          unit: formData.vehicleCapacity.unit
        },
        vehicleNumber: formData.vehicleNumber,
        driverInfo: {
          driverName: formData.driverInfo.driverName,
          driverMobileNo: formData.driverInfo.driverMobileNo,
          driverAge: formData.driverInfo.driverAge
        },
        primaryVehicle: formData.primaryVehicle || false
      };
      
      const updatedVehicles = [...vehicles];
      updatedVehicles[currentVehicleIndex] = {
        ...formData,
        vehicleDocuments: {}
      };
      
      const transportInfo = {
        vehicles: updatedVehicles
      };
      
      formDataToSend.append('transportInfo', JSON.stringify(transportInfo));

      const documentUrls: {[key: string]: string} = {};
      Object.entries(currentDocs).forEach(([key, url]) => {
        if (url && !currentDeleting.includes(key)) {
          documentUrls[key] = url;
        }
      });
      
      formDataToSend.append('documents', JSON.stringify(documentUrls));

      Object.entries(currentUploads).forEach(([key, docFile]) => {
        if (docFile.file) {
          const fileData = {
            uri: docFile.file.uri,
            type: docFile.file.type,
            name: docFile.file.name
          };
          formDataToSend.append(key, fileData as any);
        }
      });

      if (currentDeleting.length > 0) {
        formDataToSend.append('deletedFiles', JSON.stringify(currentDeleting));
      }

      const response = await axios.put(
        `https://kisan.etpl.ai/transport/profile/${userId}/update-with-files`,
        formDataToSend,
        {
          headers: { 
            'Content-Type': 'multipart/form-data'
          },
          timeout: 30000
        }
      );
      
      if (response.data.success) {
        Alert.alert('Success', 'Vehicle details updated successfully!');
        
        const finalUpdatedVehicles = [...vehicles];
        finalUpdatedVehicles[currentVehicleIndex] = {
          ...formData,
          vehicleDocuments: documentUrls as any
        };
        setVehicles(finalUpdatedVehicles);
        
        updateCurrentDocuments(documentUrls);
        updateCurrentFileUploads({});
        updateCurrentDeletingFiles([]);
        
        setOriginalData(formData);
        setIsEditing(false);
        
        const storedData = await AsyncStorage.getItem('transporter_data');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          const updatedData = {
            ...parsedData,
            transportInfo: {
              ...parsedData.transportInfo,
              vehicles: finalUpdatedVehicles
            }
          };
          await AsyncStorage.setItem('transporter_data', JSON.stringify(updatedData));
        }
      } else {
        throw new Error(response.data.message || 'Failed to update vehicle details');
      }
    } catch (error: any) {
      console.error('Error updating vehicle details:', error);
      
      if (error.response?.data?.errors) {
        setValidationErrors(error.response.data.errors);
        setError('Please fix the following errors:');
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError(error.message || 'Failed to update vehicle details. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddVehicle = async () => {
    if (!validateForm()) {
      setError('Please fix the validation errors below');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        throw new Error('User not logged in');
      }

      const formDataToSend = new FormData();
      
      formDataToSend.append('vehicleType', formData.vehicleType);
      formDataToSend.append('vehicleCapacityValue', formData.vehicleCapacity.value.toString());
      formDataToSend.append('vehicleCapacityUnit', formData.vehicleCapacity.unit);
      formDataToSend.append('vehicleNumber', formData.vehicleNumber);
      formDataToSend.append('driverName', formData.driverInfo.driverName);
      formDataToSend.append('driverMobileNo', formData.driverInfo.driverMobileNo);
      formDataToSend.append('driverAge', formData.driverInfo.driverAge.toString());

      const currentUploads = getCurrentFileUploads();
      Object.entries(currentUploads).forEach(([key, docFile]) => {
        if (docFile.file) {
          const fileData = {
            uri: docFile.file.uri,
            type: docFile.file.type,
            name: docFile.file.name
          };
          formDataToSend.append(key, fileData as any);
        }
      });

      const response = await axios.post(
        `https://kisan.etpl.ai/transport/profile/${userId}/vehicles`,
        formDataToSend,
        {
          headers: { 
            'Content-Type': 'multipart/form-data'
          },
          timeout: 30000
        }
      );
      
      if (response.data.success) {
        Alert.alert('Success', 'Vehicle added successfully!');
        
        setFormData({
          vehicleType: 'Truck',
          vehicleCapacity: { value: 0, unit: 'kg' },
          vehicleNumber: '',
          driverInfo: {
            driverName: '',
            driverMobileNo: '',
            driverAge: 0
          }
        });
        
        updateCurrentDocuments({});
        updateCurrentFileUploads({});
        updateCurrentDeletingFiles([]);
        setShowAddVehicleForm(false);
        setIsAddingNewVehicle(false);
        
        fetchVehicleData();
      } else {
        throw new Error(response.data.message || 'Failed to add vehicle');
      }
    } catch (error: any) {
      console.error('Error adding vehicle:', error);
      
      if (error.response?.data?.errors) {
        setValidationErrors(error.response.data.errors);
        setError('Please fix the following errors:');
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError(error.message || 'Failed to add vehicle. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    if (originalData) {
      setFormData(originalData);
    }
    setIsEditing(false);
    setValidationErrors([]);
    setError(null);
    updateCurrentFileUploads({});
    updateCurrentDeletingFiles([]);
    if (currentVehicleIndex >= 0 && vehicles[currentVehicleIndex]) {
      const originalVehicle = vehicles[currentVehicleIndex];
      if (originalVehicle.vehicleDocuments) {
        const originalDocs: DocumentsType = {};
        Object.entries(originalVehicle.vehicleDocuments).forEach(([key, value]) => {
          if (value && typeof value === 'string') {
            originalDocs[key] = value;
          }
        });
        if (originalVehicle.driverInfo?.driverLicense) {
          originalDocs['driverLicense'] = originalVehicle.driverInfo.driverLicense;
        }
        updateCurrentDocuments(originalDocs);
      }
    }
  };

  const handleCancelAddVehicle = () => {
    setShowAddVehicleForm(false);
    setIsAddingNewVehicle(false);
    setFormData({
      vehicleType: 'Truck',
      vehicleCapacity: { value: 0, unit: 'kg' },
      vehicleNumber: '',
      driverInfo: {
        driverName: '',
        driverMobileNo: '',
        driverAge: 0
      }
    });
    updateCurrentDocuments({});
    updateCurrentFileUploads({});
    updateCurrentDeletingFiles([]);
    setError(null);
    setValidationErrors([]);
  };

  const handleSelectVehicle = (index: number) => {
    setCurrentVehicleIndex(index);
    const selectedVehicle = vehicles[index];
    setFormData(selectedVehicle);
    setOriginalData(selectedVehicle);
    
    setIsEditing(false);
    setShowAddVehicleForm(false);
    setIsAddingNewVehicle(false);
    setError(null);
    setValidationErrors([]);
  };

  const handleSetPrimaryVehicle = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        throw new Error('User not logged in');
      }

      const currentVehicle = vehicles[currentVehicleIndex];
      if (!currentVehicle) {
        throw new Error('No vehicle selected');
      }

      let response;
      
      try {
        response = await axios.put(
          `https://kisan.etpl.ai/transport/profile/${userId}/vehicles/${currentVehicle._id}/set-primary`
        );
      } catch (endpointError: any) {
        response = await axios.put(
          `https://kisan.etpl.ai/transport/profile/${userId}/vehicles/set-primary`,
          { 
            vehicleId: currentVehicle._id,
            vehicleNumber: formData.vehicleNumber 
          }
        );
      }
      
      if (response.data.success) {
        Alert.alert('Success', 'Primary vehicle updated successfully!');
        fetchVehicleData();
      } else {
        throw new Error('Failed to set primary vehicle');
      }
    } catch (error: any) {
      console.error('Error setting primary vehicle:', error);
      setError(error.message || 'Failed to set primary vehicle');
    }
  };

  const handleDeleteVehicle = async () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this vehicle? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const userId = await AsyncStorage.getItem('userId');
              if (!userId) {
                throw new Error('User not logged in');
              }

              const currentVehicle = vehicles[currentVehicleIndex];
              if (!currentVehicle) {
                throw new Error('No vehicle selected');
              }

              let response;
              
              try {
                response = await axios.delete(
                  `https://kisan.etpl.ai/transport/profile/${userId}/vehicles/${currentVehicle._id}`
                );
              } catch (endpointError: any) {
                response = await axios.delete(
                  `https://kisan.etpl.ai/transport/profile/${userId}/vehicles/${formData.vehicleNumber}`
                );
              }
              
              if (response.data.success) {
                Alert.alert('Success', 'Vehicle deleted successfully!');
                
                const updatedVehicles = vehicles.filter((_, index) => index !== currentVehicleIndex);
                setVehicles(updatedVehicles);
                
                if (updatedVehicles.length > 0) {
                  const newIndex = Math.max(0, Math.min(currentVehicleIndex, updatedVehicles.length - 1));
                  handleSelectVehicle(newIndex);
                } else {
                  setCurrentVehicleIndex(-1);
                  setFormData({
                    vehicleType: 'Truck',
                    vehicleCapacity: { value: 0, unit: 'kg' },
                    vehicleNumber: '',
                    driverInfo: {
                      driverName: '',
                      driverMobileNo: '',
                      driverAge: 0
                    }
                  });
                }
                
                setTimeout(() => {
                  fetchVehicleData();
                }, 1000);
              } else {
                throw new Error('Failed to delete vehicle');
              }
            } catch (error: any) {
              console.error('Error deleting vehicle:', error);
              setError(error.message || 'Failed to delete vehicle');
            }
          }
        }
      ]
    );
  };

  const vehicleTypes = ['Pickup Van', 'Bolero', 'Tata Ace', 'Mini Truck', 'Lorry', 'Truck', 'Container', 'Trailer', 'Other'];
  const capacityUnits = ['kg', 'ton', 'quintal', 'boxes'];

  const documentFields = [
    { key: 'rcBook', label: 'RC Book', required: true },
    { key: 'insuranceDoc', label: 'Insurance Document', required: false },
    { key: 'pollutionCert', label: 'Pollution Certificate', required: false },
    { key: 'permitDoc', label: 'Permit Document', required: false },
    { key: 'driverLicense', label: 'Driver License', required: false }
  ];

  const getFileIcon = (url: string | undefined) => {
    if (!url) return Icons.FaFile;
    
    if (url.includes('.pdf')) return Icons.FaFilePdf;
    if (url.match(/\.(jpg|jpeg|png|gif)$/i)) return Icons.FaFileImage;
    return Icons.FaFile;
  };

  const getFileName = (url: string | undefined) => {
    if (!url) return 'Document';
    
    const filename = url.split('/').pop() || 'document';
    return filename.length > 25 ? filename.substring(0, 25) + '...' : filename;
  };

  if (fetching) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#5B5AF7" />
        <Text className="mt-3 text-gray-600 text-base">Loading vehicle details...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView contentContainerClassName="p-5 pb-10">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-3 pb-3 border-b border-gray-200">
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-2"
          >
            <Icon name={Icons.FaArrowLeft} size={20} color="#333" />
          </TouchableOpacity>
          
          {!showAddVehicleForm && !isEditing && (
            <View className="flex-row gap-2">
              {vehicles.length > 0 && currentVehicleIndex >= 0 && (
                <TouchableOpacity
                  onPress={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-500 rounded-lg flex-row items-center gap-2"
                >
                  <Icon name={Icons.FaEdit} size={14} color="white" />
                  <Text className="text-white font-semibold text-sm">Edit Vehicle</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => {
                  setShowAddVehicleForm(true);
                  setIsAddingNewVehicle(true);
                  setFormData({
                    vehicleType: 'Truck',
                    vehicleCapacity: { value: 0, unit: 'kg' },
                    vehicleNumber: '',
                    driverInfo: {
                      driverName: '',
                      driverMobileNo: '',
                      driverAge: 0
                    }
                  });
                  setCurrentVehicleIndex(vehicles.length);
                  updateCurrentDocuments({});
                  updateCurrentFileUploads({});
                  updateCurrentDeletingFiles([]);
                }}
                className="px-4 py-2 bg-green-500 rounded-lg flex-row items-center gap-2"
              >
                <Icon name={Icons.FaPlus} size={14} color="white" />
                <Text className="text-white font-semibold text-sm">Add Vehicle</Text>
              </TouchableOpacity>
            </View>
          )}
          
          {showAddVehicleForm && (
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={handleCancelAddVehicle}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg flex-row items-center gap-2"
                disabled={loading}
              >
                <Icon name={Icons.FaTimes} size={14} color="#666" />
                <Text className="text-gray-600 font-semibold text-sm">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAddVehicle}
                disabled={loading}
                className={`px-4 py-2 bg-purple-600 rounded-lg flex-row items-center gap-2 ${loading ? 'opacity-70' : ''}`}
              >
                {loading ? (
                  <>
                    <ActivityIndicator size="small" color="white" />
                    <Text className="text-white font-semibold text-sm">Adding...</Text>
                  </>
                ) : (
                  <>
                    <Icon name={Icons.FaCheck} size={14} color="white" />
                    <Text className="text-white font-semibold text-sm">Add Vehicle</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}
          
          {isEditing && !showAddVehicleForm && (
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={handleCancelEdit}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg flex-row items-center gap-2"
                disabled={loading}
              >
                <Icon name={Icons.FaTimes} size={14} color="#666" />
                <Text className="text-gray-600 font-semibold text-sm">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSave}
                disabled={loading}
                className={`px-4 py-2 bg-purple-600 rounded-lg flex-row items-center gap-2 ${loading ? 'opacity-70' : ''}`}
              >
                {loading ? (
                  <>
                    <ActivityIndicator size="small" color="black" />
                    <Text className="text-black font-semibold text-sm">Saving...</Text>
                  </>
                ) : (
                  <>
                    <Icon name={Icons.FaCheck} size={14} color="black" />
                    <Text className="text-black font-semibold text-sm">Save Changes</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        {/* Vehicle Image */}
        <View className="items-center my-6">
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/743/743922.png'
            }}
            className="w-3/5 h-32 opacity-90"
            resizeMode="contain"
          />
        </View>

        {/* Vehicle Selection List */}
        {vehicles.length > 0 && !showAddVehicleForm && (
          <View className="bg-white rounded-xl border border-slate-200 p-4 mb-5">
            <View className="flex-row items-center mb-3 pb-3 border-b border-gray-100">
              <Icon name={Icons.FaList} size={20} color="#5B5AF7" />
              <Text className="ml-2 text-lg font-bold text-gray-800">Your Vehicles</Text>
            </View>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
              {vehicles.map((vehicle, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleSelectVehicle(index)}
                  className={`mr-3 p-3 rounded-xl border min-w-[180px] flex-row items-center justify-between ${
                    currentVehicleIndex === index 
                      ? 'bg-purple-600 border-purple-600' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <View className="flex-1">
                    <Text className={`font-bold text-sm ${
                      currentVehicleIndex === index ? 'text-black' : 'text-gray-800'
                    }`}>
                      {vehicle.vehicleNumber}
                    </Text>
                    <Text className={`text-xs mt-1 ${
                      currentVehicleIndex === index ? 'text-purple-100' : 'text-gray-600'
                    }`}>
                      {vehicle.vehicleType}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    {vehicle.primaryVehicle && (
                      <Icon 
                        name={Icons.FaStar} 
                        size={14} 
                        color={currentVehicleIndex === index ? 'white' : '#f39c12'} 
                      />
                    )}
                    <Icon 
                      name={Icons.FaArrowRight} 
                      size={12} 
                      color={currentVehicleIndex === index ? 'white' : '#666'} 
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            {vehicles.length > 1 && currentVehicleIndex >= 0 && formData.primaryVehicle !== undefined && !formData.primaryVehicle && (
              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={handleSetPrimaryVehicle}
                  className="px-3 py-2 bg-amber-500 rounded-lg flex-row items-center gap-2"
                >
                  <Icon name={Icons.FaStar} size={12} color="white" />
                  <Text className="text-white font-semibold text-xs">Set as Primary</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleDeleteVehicle}
                  className="px-3 py-2 bg-red-500 rounded-lg flex-row items-center gap-2"
                >
                  <Icon name={Icons.FaTrash} size={12} color="white" />
                  <Text className="text-white font-semibold text-xs">Delete Vehicle</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* Error Display */}
        {error && (
          <View className="bg-red-50 p-4 rounded-xl mb-5 border border-red-200">
            <Text className="text-red-700 text-sm">
              <Text className="font-bold">Error:</Text> {error}
            </Text>
          </View>
        )}

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <View className="bg-amber-50 p-4 rounded-xl mb-5 border border-amber-200">
            <Text className="text-amber-800 font-bold text-sm mb-2">
              Please fix the following errors:
            </Text>
            {validationErrors.map((error, index) => (
              <Text key={index} className="text-amber-700 text-sm ml-2">• {error}</Text>
            ))}
          </View>
        )}

        {/* Show "No Vehicles" message */}
        {vehicles.length === 0 && !showAddVehicleForm && (
          <View className="bg-white rounded-2xl p-8 items-center mb-5 shadow-lg">
            <Icon name={Icons.FaTruck} size={48} color="#ddd" />
            <Text className="text-gray-600 text-lg font-bold mt-4">No Vehicles Added</Text>
            <Text className="text-gray-500 text-center mt-2 mb-6">
              You haven't added any vehicles yet. Click "Add Vehicle" to get started.
            </Text>
            <TouchableOpacity
              onPress={() => {
                setShowAddVehicleForm(true);
                setIsAddingNewVehicle(true);
                setFormData({
                  vehicleType: 'Truck',
                  vehicleCapacity: { value: 0, unit: 'kg' },
                  vehicleNumber: '',
                  driverInfo: {
                    driverName: '',
                    driverMobileNo: '',
                    driverAge: 0
                  }
                });
              }}
              className="px-6 py-3 bg-green-500 rounded-lg flex-row items-center gap-2"
            >
              <Icon name={Icons.FaPlus} size={16} color="white" />
              <Text className="text-white font-semibold text-base">Add Your First Vehicle</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Show current vehicle or new vehicle form */}
        {(vehicles.length > 0 && currentVehicleIndex >= 0 && !showAddVehicleForm) || showAddVehicleForm ? (
          <>
            {/* Primary Vehicle Badge */}
            {formData.primaryVehicle && !showAddVehicleForm && (
              <View className="bg-amber-50 p-3 rounded-lg mb-5 border border-amber-200 flex-row items-center gap-3">
                <Icon name={Icons.FaStar} size={16} color="#f39c12" />
                <Text className="text-amber-800 text-sm">This is your primary vehicle</Text>
              </View>
            )}

            {/* Vehicle Information Section */}
            <View className="bg-white rounded-lg p-5 mb-5 border border-slate-100">
              <View className="flex-row items-center mb-5 pb-4 border-b border-gray-100">
                <Icon name={Icons.FaTruck} size={24} color="#5B5AF7" />
                <Text className="ml-2 text-lg font-bold text-gray-800">
                  {showAddVehicleForm ? 'New Vehicle Details' : 'Vehicle Details'}
                </Text>
              </View>
              
              <View className="space-y-4">
                <View>
                  <Text className="text-xs text-gray-500 font-medium mb-2">Vehicle Type</Text>
                  {isEditing || showAddVehicleForm ? (
                    <View className="border border-gray-300 rounded-lg overflow-hidden">
                      <Picker
                        selectedValue={formData.vehicleType}
                        onValueChange={(value) => handleInputChange('vehicleType', value)}
                        className="h-12"
                      >
                        {vehicleTypes.map(type => (
                          <Picker.Item key={type} label={type} value={type} />
                        ))}
                      </Picker>
                    </View>
                  ) : (
                    <View className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                      <Text className="text-gray-800">{formData.vehicleType}</Text>
                    </View>
                  )}
                </View>

                <View>
                  <Text className="text-xs text-gray-500 font-medium mb-2">Vehicle Number</Text>
                  {isEditing || showAddVehicleForm ? (
                    <TextInput
                      value={formData.vehicleNumber}
                      onChangeText={(value) => handleInputChange('vehicleNumber', value.toUpperCase())}
                      className="border-b border-gray-300 py-2 text-gray-800 text-base"
                      placeholder="e.g., TN01AB1234"
                      placeholderTextColor="#aaa"
                      autoCapitalize="characters"
                    />
                  ) : (
                    <View className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                      <Text className="text-gray-800">{formData.vehicleNumber}</Text>
                    </View>
                  )}
                </View>

                <View>
                  <Text className="text-xs text-gray-500 font-medium mb-2">Vehicle Capacity</Text>
                  {isEditing || showAddVehicleForm ? (
                    <View className="flex-row gap-3">
                      <TextInput
                        value={formData.vehicleCapacity.value.toString()}
                        onChangeText={(value) => handleVehicleCapacityChange('value', parseInt(value) || 0)}
                        className="flex-1 border-b border-gray-300 py-2 text-gray-800 text-base"
                        keyboardType="numeric"
                        placeholder="0"
                        placeholderTextColor="#aaa"
                      />
                      <View className="border border-gray-300 rounded-lg overflow-hidden min-w-[100px]">
                        <Picker
                          selectedValue={formData.vehicleCapacity.unit}
                          onValueChange={(value) => handleVehicleCapacityChange('unit', value)}
                          className="h-12"
                        >
                          {capacityUnits.map(unit => (
                            <Picker.Item key={unit} label={unit} value={unit} />
                          ))}
                        </Picker>
                      </View>
                    </View>
                  ) : (
                    <View className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                      <Text className="text-gray-800">
                        {formData.vehicleCapacity.value} {formData.vehicleCapacity.unit}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>

            {/* Driver Information Section */}
            <View className="bg-white rounded-lg p-5 mb-5 border border-slate-100">
              <View className="flex-row items-center mb-5 pb-4 border-b border-gray-100">
                <Icon name={Icons.FaUser} size={24} color="#5B5AF7" />
                <Text className="ml-2 text-lg font-bold text-gray-800">Driver Details</Text>
              </View>
              
              <View className="space-y-4">
                <View>
                  <Text className="text-xs text-gray-500 font-medium mb-2">Driver Name</Text>
                  {isEditing || showAddVehicleForm ? (
                    <TextInput
                      value={formData.driverInfo.driverName}
                      onChangeText={(value) => handleDriverInfoChange('driverName', value)}
                      className="border-b border-gray-300 py-2 text-gray-800 text-base"
                      placeholder="Enter driver name"
                      placeholderTextColor="#aaa"
                    />
                  ) : (
                    <View className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                      <Text className="text-gray-800">{formData.driverInfo.driverName}</Text>
                    </View>
                  )}
                </View>

                <View>
                  <Text className="text-xs text-gray-500 font-medium mb-2">Driver Mobile No.</Text>
                  {isEditing || showAddVehicleForm ? (
                    <TextInput
                      value={formData.driverInfo.driverMobileNo}
                      onChangeText={(value) => handleDriverInfoChange('driverMobileNo', value)}
                      className="border-b border-gray-300 py-2 text-gray-800 text-base"
                      keyboardType="phone-pad"
                      maxLength={10}
                      placeholder="10-digit number"
                      placeholderTextColor="#aaa"
                    />
                  ) : (
                    <View className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                      <Text className="text-gray-800">{formData.driverInfo.driverMobileNo}</Text>
                    </View>
                  )}
                </View>

                <View>
                  <Text className="text-xs text-gray-500 font-medium mb-2">Driver Age</Text>
                  {isEditing || showAddVehicleForm ? (
                    <TextInput
                      value={formData.driverInfo.driverAge.toString()}
                      onChangeText={(value) => handleDriverInfoChange('driverAge', parseInt(value) || 0)}
                      className="border-b border-gray-300 py-2 text-gray-800 text-base"
                      keyboardType="numeric"
                      placeholder="Age"
                      placeholderTextColor="#aaa"
                    />
                  ) : (
                    <View className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                      <Text className="text-gray-800">{formData.driverInfo.driverAge} years</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>

            {/* Vehicle Documents Section */}
            <View className="bg-white rounded-lg p-5 mb-5 border border-slate-100">
              <Text className="text-lg font-bold text-gray-800 mb-5">Vehicle Documents</Text>
              
              <View className="space-y-5">
                {documentFields.map(doc => {
                  const currentDocs = getCurrentDocuments();
                  const currentUploads = getCurrentFileUploads();
                  const currentDeleting = getCurrentDeletingFiles();
                  
                  const docValue = currentDocs[doc.key];
                  const uploadedFile = currentUploads[doc.key];
                  const isMarkedForDeletion = currentDeleting.includes(doc.key);
                  const hasExistingDoc = docValue && docValue.trim() !== '';
                  
                  return (
                    <View 
                      key={doc.key} 
                      className={`p-4 mb-3 border rounded-lg border-gray-300 ${isMarkedForDeletion ? 'opacity-70' : ''}`}
                    >
                      <View className="flex-row justify-between items-center mb-3">
                        <Text className="text-gray-800 font-semibold">
                          {doc.label}
                          {(doc.required && !showAddVehicleForm) && <Text className="text-red-500"> *</Text>}
                          {(doc.required && showAddVehicleForm) && <Text className="text-red-500"> *</Text>}
                        </Text>
                        
                        {!isEditing && !showAddVehicleForm && hasExistingDoc && (
                          <TouchableOpacity
                            onPress={() => viewDocument(doc.key, docValue!)}
                            className="px-3 py-2 bg-blue-500 rounded-lg flex-row items-center gap-2"
                          >
                            <Icon name={Icons.FaDownload} size={12} color="white" />
                            <Text className="text-white font-semibold text-xs">View/Download</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                      
                      {!isEditing && !showAddVehicleForm ? (
                        // View Mode
                        <View>
                          {hasExistingDoc ? (
                            <TouchableOpacity
                              onPress={() => viewDocument(doc.key, docValue!)}
                              className="p-3 bg-white border border-gray-300 rounded-lg flex-row items-center justify-between"
                            >
                              <View className="flex-row items-center gap-3 flex-1">
                                <Icon name={getFileIcon(docValue)} size={20} color="#5B5AF7" />
                                <View className="flex-1">
                                  <Text className="font-semibold text-gray-800 text-sm" numberOfLines={1}>
                                    {getFileName(docValue)}
                                  </Text>
                                  <Text className="text-gray-500 text-xs mt-1">
                                    Tap to view/download
                                  </Text>
                                </View>
                              </View>
                              <Icon name={Icons.FaDownload} size={18} color="#5B5AF7" />
                            </TouchableOpacity>
                          ) : (
                            <View className="p-4 bg-gray-100 border border-dashed border-gray-300 rounded-lg items-center">
                              <Text className="text-gray-500">No document uploaded</Text>
                            </View>
                          )}
                        </View>
                      ) : (
                        // Edit Mode
                        <View>
                          <View className="mb-4">
                            <Text className="text-gray-600 text-sm mb-2">
                              {showAddVehicleForm ? 'Upload File' : 'Upload New File (replaces existing)'}
                            </Text>
                            <TouchableOpacity
                              onPress={() => pickDocument(doc.key)}
                              className={`border-2 border-dashed rounded-lg p-5 items-center ${
                                uploadedFile ? 'bg-blue-50 border-blue-300' : 'border-gray-300'
                              }`}
                            >
                              <Icon name={Icons.FaUpload} size={24} color="#5B5AF7" />
                              {uploadedFile ? (
                                <View className="items-center mt-2">
                                  <Text className="font-semibold text-gray-800 text-sm" numberOfLines={1}>
                                    {uploadedFile.file.name}
                                  </Text>
                                  <Text className="text-gray-600 text-xs mt-1">
                                    {(uploadedFile.file.size / 1024).toFixed(2)} KB - {showAddVehicleForm ? 'Ready to upload' : 'Will replace existing file'}
                                  </Text>
                                </View>
                              ) : (
                                <View className="items-center mt-2">
                                  <Text className="text-gray-600 text-center">Click to upload {doc.label}</Text>
                                  <Text className="text-gray-500 text-xs text-center mt-1">
                                    PDF, JPG, PNG (Max 10MB)
                                  </Text>
                                </View>
                              )}
                            </TouchableOpacity>
                            {uploadedFile && (
                              <TouchableOpacity
                                onPress={() => {
                                  const newUploads = { ...getCurrentFileUploads() };
                                  delete newUploads[doc.key];
                                  updateCurrentFileUploads(newUploads);
                                }}
                                className="mt-2 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg flex-row items-center gap-2 self-start"
                              >
                                <Icon name={Icons.FaTimes} size={10} color="#e74c3c" />
                                <Text className="text-red-600 text-xs">Remove uploaded file</Text>
                              </TouchableOpacity>
                            )}
                          </View>
                          
                          {hasExistingDoc && !isMarkedForDeletion && !showAddVehicleForm && (
                            <View className="p-3 bg-gray-100 border border-gray-300 rounded-lg mb-3">
                              <View className="mb-2">
                                <Text className="font-semibold text-gray-600 text-xs">Current Document:</Text>
                                <Text className="text-gray-800 text-sm" numberOfLines={1}>
                                  {getFileName(docValue)}
                                </Text>
                              </View>
                              <View className="flex-row gap-2">
                                <TouchableOpacity
                                  onPress={() => viewDocument(doc.key, docValue!)}
                                  className="px-3 py-1.5 bg-blue-500 rounded-lg flex-row items-center gap-2"
                                >
                                  <Icon name={Icons.FaDownload} size={10} color="white" />
                                  <Text className="text-white font-semibold text-xs">View</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() => handleRemoveDocument(doc.key)}
                                  className="px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg flex-row items-center gap-2"
                                >
                                  <Icon name={Icons.FaTrash} size={10} color="#e74c3c" />
                                  <Text className="text-red-600 font-semibold text-xs">Remove</Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          )}
                          
                          {isMarkedForDeletion && !showAddVehicleForm && (
                            <View className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex-row justify-between items-center flex-wrap">
                              <Text className="text-amber-800 text-sm flex-1 mr-2">
                                ⚠️ This document will be deleted. Upload a new file or restore.
                              </Text>
                              <TouchableOpacity
                                onPress={() => handleRestoreDocument(doc.key, uploadedFile?.currentUrl || '')}
                                className="px-3 py-1.5 bg-green-100 border border-green-300 rounded-lg"
                              >
                                <Text className="text-green-800 font-semibold text-xs">Restore</Text>
                              </TouchableOpacity>
                            </View>
                          )}
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            </View>
          </>
        ) : null}
      </ScrollView>

      {/* Document Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center p-5">
          <View className="bg-white p-5 rounded-2xl w-full max-w-[400px]">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold text-gray-800">Document</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name={Icons.FaTimesCircle} size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <Text className="text-gray-600 mb-5">
              Document opened in browser. You can view or download it from there.
            </Text>
            <TouchableOpacity
              className="bg-purple-600 py-3 rounded-lg items-center"
              onPress={() => {
                if (selectedDoc) {
                  Linking.openURL(selectedDoc.url);
                }
                setModalVisible(false);
              }}
            >
              <Text className="text-white font-semibold">Open in Browser</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default VehiclesPage;