import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';

interface VehicleFormData {
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
    driverLicense?: string;
    driverPhoto?: string;
  };
  primaryVehicle?: boolean;
  _id?: string;
  addedAt?: string;
}

interface DocumentsType {
  rcBook?: string;
  insuranceDoc?: string;
  pollutionCert?: string;
  permitDoc?: string;
  driverLicense?: string;
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

  // Document modal state
  const [documentModalVisible, setDocumentModalVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<{key: string, url: string} | null>(null);

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
      const API_BASE = 'https://kisan.etpl.ai/api/transporter';
      
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
          const primaryIndex = fetchedVehicles.findIndex(v => v.primaryVehicle === true);
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

  const handleNestedChange = (section: keyof VehicleFormData, subSection: string, field: string, value: any) => {
    setFormData(prev => {
      const sectionData = prev[section] as any;
      
      return {
        ...prev,
        [section]: {
          ...sectionData,
          [subSection]: {
            ...(sectionData[subSection] || {}),
            [field]: value
          }
        }
      };
    });
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

  const handleFileChange = async (docKey: string) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true
      });

      if (result.canceled) {
        return;
      }

      const file = result.assets[0];
      const currentDocs = getCurrentDocuments();
      
      const newUploads = {
        ...getCurrentFileUploads(),
        [docKey]: {
          file,
          currentUrl: currentDocs[docKey] || ''
        }
      };
      updateCurrentFileUploads(newUploads);
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to pick document');
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

  const downloadDocument = async (docKey: string) => {
    const currentDocs = getCurrentDocuments();
    const docUrl = currentDocs[docKey];
    if (!docUrl) return;

    try {
      let fullUrl = docUrl;
      if (docUrl.startsWith('/uploads/')) {
        fullUrl = `https://kisan.etpl.ai${docUrl}`;
      } else if (!docUrl.startsWith('http')) {
        fullUrl = `https://kisan.etpl.ai/uploads/${docUrl}`;
      }
      
      if (Platform.OS === 'web') {
        window.open(fullUrl, '_blank');
      } else {
        const filename = docUrl.split('/').pop() || 'document';
        const localUri = `${FileSystem.cacheDirectory}${filename}`;
        
        const download = await FileSystem.downloadAsync(fullUrl, localUri);
        
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(download.uri);
        } else {
          Alert.alert('Success', `Document downloaded to ${download.uri}`);
        }
      }
    } catch (error) {
      console.error('Error downloading document:', error);
      setError(`Failed to download ${docKey}`);
    }
  };

  const viewDocument = (docKey: string) => {
    const currentDocs = getCurrentDocuments();
    const docUrl = currentDocs[docKey];
    if (!docUrl) return;

    setSelectedDocument({ key: docKey, url: docUrl });
    setDocumentModalVisible(true);
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
          const file = docFile.file;
          formDataToSend.append(key, {
            uri: file.uri,
            type: file.mimeType,
            name: file.name
          } as any);
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
          formDataToSend.append(key, {
            uri: docFile.file.uri,
            type: docFile.file.mimeType,
            name: docFile.file.name
          } as any);
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
    
    const fullVehicleData = {
      ...selectedVehicle,
      primaryVehicle: selectedVehicle.primaryVehicle || false
    };
    
    setFormData(fullVehicleData);
    setOriginalData(fullVehicleData);
    
    setIsEditing(false);
    setShowAddVehicleForm(false);
    setIsAddingNewVehicle(false);
    setError(null);
    setValidationErrors([]);
    
    if (selectedVehicle.vehicleDocuments) {
      const vehicleDocs: DocumentsType = {};
      Object.entries(selectedVehicle.vehicleDocuments).forEach(([key, value]) => {
        if (value && typeof value === 'string') {
          vehicleDocs[key] = value;
        }
      });
      
      if (selectedVehicle.driverInfo?.driverLicense) {
        vehicleDocs['driverLicense'] = selectedVehicle.driverInfo.driverLicense;
      }
      
      updateCurrentDocuments(vehicleDocs);
      updateCurrentFileUploads({});
      updateCurrentDeletingFiles([]);
    }
  };

  const handleSetPrimaryVehicle = async () => {
    try {
      setLoading(true);
      setError(null);

      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        throw new Error('User not logged in');
      }

      const currentVehicle = vehicles[currentVehicleIndex];
      if (!currentVehicle) {
        throw new Error('No vehicle selected');
      }

      console.log('Setting vehicle as primary:', currentVehicle.vehicleNumber);

      const updatedVehicles = vehicles.map((vehicle, index) => ({
        ...vehicle,
        primaryVehicle: index === currentVehicleIndex
      }));
      
      setVehicles(updatedVehicles);

      let success = false;
      let lastError = null;

      if (currentVehicle._id) {
        try {
          console.log('Trying Approach 1: Set primary via vehicle ID');
          const response = await axios.put(
            `https://kisan.etpl.ai/transport/profile/${userId}/vehicles/${currentVehicle._id}/set-primary`,
            {},
            {
              headers: { 'Content-Type': 'application/json' },
              timeout: 10000
            }
          );

          if (response.data.success) {
            console.log('Approach 1 succeeded');
            success = true;
          }
        } catch (err: any) {
          console.log('Approach 1 failed:', err.response?.status);
          lastError = err;
        }
      }

      if (!success) {
        try {
          console.log('Trying Approach 2: Set primary via vehicle number');
          const response = await axios.post(
            `https://kisan.etpl.ai/transport/profile/${userId}/set-primary-vehicle`,
            { vehicleNumber: currentVehicle.vehicleNumber },
            {
              headers: { 'Content-Type': 'application/json' },
              timeout: 10000
            }
          );

          if (response.data.success) {
            console.log('Approach 2 succeeded');
            success = true;
          }
        } catch (err: any) {
          console.log('Approach 2 failed:', err.response?.status);
          lastError = err;
        }
      }

      if (!success) {
        try {
          console.log('Trying Approach 3: Update full transportInfo');
          const requestData = {
            transportInfo: {
              vehicles: updatedVehicles
            }
          };

          const response = await axios.put(
            `https://kisan.etpl.ai/transport/profile/${userId}`,
            requestData,
            {
              headers: { 'Content-Type': 'application/json' },
              timeout: 10000,
              validateStatus: (status) => status < 500
            }
          );

          console.log('Approach 3 response:', response.data);
          
          setTimeout(async () => {
            try {
              const verifyResponse = await axios.get(
                `https://kisan.etpl.ai/transport/profile/${userId}`
              );
              
              if (verifyResponse.data.success) {
                const serverVehicles = verifyResponse.data.data.transportInfo?.vehicles || [];
                const primaryVehicle = serverVehicles.find((v: any) => 
                  v.vehicleNumber === currentVehicle.vehicleNumber
                );
                
                if (primaryVehicle?.primaryVehicle === true) {
                  console.log('Verified: Primary vehicle was updated successfully');
                  success = true;
                  
                  Alert.alert('Success', 'Primary vehicle updated successfully!');
                  
                  const updatedFormData = {
                    ...formData,
                    primaryVehicle: true
                  };
                  setFormData(updatedFormData);
                  setOriginalData(updatedFormData);
                  
                  const storedData = await AsyncStorage.getItem('transporter_data');
                  if (storedData) {
                    const parsedData = JSON.parse(storedData);
                    const updatedData = {
                      ...parsedData,
                      transportInfo: {
                        ...parsedData.transportInfo,
                        vehicles: updatedVehicles
                      }
                    };
                    await AsyncStorage.setItem('transporter_data', JSON.stringify(updatedData));
                  }
                  
                  fetchVehicleData();
                }
              }
            } catch (verifyErr) {
              console.error('Verification failed:', verifyErr);
            }
          }, 1000);

          return;
          
        } catch (err: any) {
          console.log('Approach 3 failed:', err.response?.status);
          lastError = err;
        }
      }

      if (success) {
        Alert.alert('Success', 'Primary vehicle updated successfully!');
        
        const updatedFormData = {
          ...formData,
          primaryVehicle: true
        };
        setFormData(updatedFormData);
        setOriginalData(updatedFormData);
        
        const storedData = await AsyncStorage.getItem('transporter_data');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          const updatedData = {
            ...parsedData,
            transportInfo: {
              ...parsedData.transportInfo,
              vehicles: updatedVehicles
            }
          };
          await AsyncStorage.setItem('transporter_data', JSON.stringify(updatedData));
        }
        
        setTimeout(() => {
          fetchVehicleData();
        }, 1000);
      }

    } catch (error: any) {
      console.error('Error setting primary vehicle:', error);
      
      let errorMessage = 'Failed to update primary vehicle. ';
      
      if (error.response?.data?.message) {
        errorMessage += error.response.data.message;
      } else if (error.message) {
        errorMessage += error.message;
      }
      
      setError(errorMessage);
      Alert.alert('Update Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVehicle = async () => {
    Alert.alert(
      'Delete Vehicle',
      'Are you sure you want to delete this vehicle? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
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
    if (!url) return <Icon name="file-text-o" size={20} className="text-gray-500" />;
    
    if (url.includes('.pdf')) return <Icon name="file-text-o" size={20} className="text-red-500" />;
    if (url.match(/\.(jpg|jpeg|png|gif)$/i)) return <Icon name="picture-o" size={20} className="text-[#5B5AF7]" />;
    return <Icon name="file-text-o" size={20} className="text-gray-500" />;
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
        <Text className="mt-5 text-gray-600 text-lg">Loading vehicle details...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
       {/* Header */}
        <View className="mb-5 pb-4 border-b border-gray-200">
          <TouchableOpacity 
            onPress={() => router.push('/(transporter)/home')} 
            className="p-2"
          >
            <Icon name="arrow-left" size={24} color="#5B5AF7" />
          </TouchableOpacity>
          <View className="flex-row justify-between items-center mt-2">
            <View className="flex-1">
              <Text className="text-2xl font-medium text-gray-800">
                {showAddVehicleForm ? 'Add New Vehicle' : 'My Vehicles'}
              </Text>
              {vehicles.length > 0 && !showAddVehicleForm && (
                <Text className="text-gray-600 mt-1">
                  ({vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''})
                </Text>
              )}
            </View>
            
            {!showAddVehicleForm && !isEditing && (
              <View className="flex-row gap-3 ml-4">
                {vehicles.length > 0 && currentVehicleIndex >= 0 && (
                  <TouchableOpacity
                    onPress={() => setIsEditing(true)}
                    className="flex-row items-center justify-center px-4 py-2 bg-[#5B5AF7] rounded-md gap-2 shadow-sm"
                  >
                    <Icon name="pencil" size={18} color="white" />
                    
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
                  className="flex-row items-center justify-center px-4 py-2 bg-green-600 rounded-md gap-2 shadow-sm"
                >
                  <Icon name="plus" size={18} color="white" />
                  
                </TouchableOpacity>
              </View>
            )}
            
            {showAddVehicleForm && (
              <View className="flex-row gap-3 ml-4">
                <TouchableOpacity
                  onPress={handleCancelAddVehicle}
                  disabled={loading}
                  className="flex-row items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-md gap-2 shadow-sm"
                >
                  <Icon name="times" size={18} color="#666" />
                  <Text className="text-gray-600 text-sm font-medium">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleAddVehicle}
                  disabled={loading}
                  className={`flex-row items-center justify-center px-4 py-2 bg-green-600 rounded-md gap-2 shadow-sm ${loading && 'opacity-70'}`}
                >
                  {loading ? (
                    <>
                      <ActivityIndicator size="small" color="white" />
                      <Text className="text-white text-sm font-medium">Adding...</Text>
                    </>
                  ) : (
                    <>
                      <Icon name="check" size={18} color="white" />
                      <Text className="text-white text-sm font-medium">Add Vehicle</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}
            
            {isEditing && !showAddVehicleForm && (
              <View className="flex-row gap-3 ml-4">
                <TouchableOpacity
                  onPress={handleCancelEdit}
                  disabled={loading}
                  className="flex-row items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-md gap-2 shadow-sm"
                >
                  <Icon name="times" size={18} color="#666" />
                  <Text className="text-gray-600 text-sm font-medium">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSave}
                  disabled={loading}
                  className={`flex-row items-center justify-center px-4 py-2 bg-green-600 rounded-md gap-2 shadow-sm ${loading && 'opacity-70'}`}
                >
                  {loading ? (
                    <>
                      <ActivityIndicator size="small" color="white" />
                      <Text className="text-white text-sm font-medium">Saving...</Text>
                    </>
                  ) : (
                    <>
                      <Icon name="check" size={18} color="white" />
                      <Text className="text-white text-sm font-medium">Save Changes</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
       

        {/* Vehicle Selection List */}
        {vehicles.length > 0 && !showAddVehicleForm && (
          <View className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-5">
            <View className="flex-row items-center mb-4 pb-3 border-b border-gray-100">
              <Icon name="list" size={20} color="#5B5AF7" />
              <Text className="ml-3 text-lg font-medium text-gray-800">Your Vehicles</Text>
            </View>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-3">
                {vehicles.map((vehicle, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleSelectVehicle(index)}
                    className={`p-3 rounded-lg min-w-[200px] shadow-sm ${
                      currentVehicleIndex === index 
                        ? 'bg-[#5B5AF7] border border-[#5B5AF7]' 
                        : 'bg-white border border-gray-200'
                    }`}
                  >
                    <View className="flex-row items-center justify-between">
                      <View>
                        <Text className={`font-medium ${
                          currentVehicleIndex === index ? 'text-white' : 'text-gray-800'
                        }`}>
                          {vehicle.vehicleNumber}
                        </Text>
                        <Text className={`text-sm mt-1 ${
                          currentVehicleIndex === index ? 'text-blue-100' : 'text-gray-600'
                        }`}>
                          {vehicle.vehicleType}
                        </Text>
                      </View>
                      <View className="flex-row items-center gap-2">
                        {vehicle.primaryVehicle && (
                          <Icon name="star" size={16} color={currentVehicleIndex === index ? 'white' : '#f39c12'} />
                        )}
                        <Icon name="chevron-right" size={16} color={currentVehicleIndex === index ? 'white' : '#666'} />
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            
            {vehicles.length > 1 && currentVehicleIndex >= 0 && formData.primaryVehicle !== undefined && !formData.primaryVehicle && (
              <View className="flex-row gap-3 mt-4">
                <TouchableOpacity
                  onPress={handleSetPrimaryVehicle}
                  className="flex-row items-center justify-center px-4 py-2 bg-[#f39c12] rounded-md gap-2 shadow-sm"
                >
                  <Icon name="star" size={16} color="white" />
                  <Text className="text-white text-sm font-medium">Set as Primary</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleDeleteVehicle}
                  className="flex-row items-center justify-center px-4 py-2 bg-red-500 rounded-md gap-2 shadow-sm"
                >
                  <Icon name="trash" size={16} color="white" />
                  <Text className="text-white text-sm font-medium">Delete Vehicle</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* Error Display */}
        {error && (
          <View className="bg-red-50 p-4 rounded-lg border border-red-200 mb-5">
            <Text className="font-medium text-red-600 mb-2">Error:</Text>
            <Text className="text-red-600">{error}</Text>
          </View>
        )}

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <View className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-5">
            <Text className="font-medium text-yellow-800 mb-3">Please fix the following errors:</Text>
            {validationErrors.map((error, index) => (
              <Text key={index} className="text-yellow-800 ml-3 mb-1">• {error}</Text>
            ))}
          </View>
        )}

        {/* Show "No Vehicles" message */}

        {vehicles.length === 0 && !showAddVehicleForm && (
          <View className="bg-white p-10 rounded-xl shadow-sm border border-slate-100 items-center mb-5">
            <Icon name="truck" size={48} color="#ddd" />
            <Text className="text-gray-600 text-lg mt-5 mb-3">No Vehicles Added</Text>
            <Text className="text-gray-500 text-center mb-5 leading-5">
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
              className="flex-row items-center justify-center px-6 py-3 bg-green-600 rounded-lg gap-3 shadow-sm"
            >
              <Icon name="plus" size={18} color="white" />
              <Text className="text-white font-medium">Add Your First Vehicle</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Show current vehicle or new vehicle form */}
        {(vehicles.length > 0 && currentVehicleIndex >= 0 && !showAddVehicleForm) || showAddVehicleForm ? (
          <>
            {/* Primary Vehicle Badge */}
            {formData.primaryVehicle && !showAddVehicleForm && (
              <View className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 mb-5 flex-row items-center gap-3">
                <Icon name="star" size={16} color="#f39c12" />
                <Text className="text-yellow-800">This is your primary vehicle</Text>
              </View>
            )}

            {/* Vehicle Information Section */}
            <View className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 mb-5">
              <View className="flex-row items-center mb-5 pb-3 border-b-2 border-gray-100">
                <Icon name="truck" size={24} color="#5B5AF7" />
                <Text className="ml-3 text-lg font-medium text-gray-800">
                  {showAddVehicleForm ? 'New Vehicle Details' : 'Vehicle Details'}
                </Text>
              </View>
              
              <View className="space-y-4">
                <View>
                  <Text className="text-gray-600 font-medium mb-2">Vehicle Type</Text>
                  {isEditing || showAddVehicleForm ? (
                    <View className="flex-row flex-wrap gap-2">
                      {vehicleTypes.map((type) => (
                        <TouchableOpacity
                          key={type}
                          onPress={() => handleInputChange('vehicleType', type)}
                          className={`px-3 py-2 border rounded-md ${
                            formData.vehicleType === type 
                              ? 'bg-[#5B5AF7] border-[#5B5AF7]' 
                              : 'bg-white border-gray-300'
                          }`}
                        >
                          <Text className={
                            formData.vehicleType === type 
                              ? 'text-white font-medium' 
                              : 'text-gray-600'
                          }>
                            {type}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ) : (
                    <View className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                      <Text className="text-gray-800">{formData.vehicleType}</Text>
                    </View>
                  )}
                </View>

                <View>
                  <Text className="text-gray-600 font-medium mb-2">Vehicle Number</Text>
                  {isEditing || showAddVehicleForm ? (
                    <TextInput
                      value={formData.vehicleNumber}
                      onChangeText={(text) => handleInputChange('vehicleNumber', text.toUpperCase())}
                      className="p-3 border border-gray-300 rounded-md text-lg bg-white"
                      placeholder="e.g., TN01AB1234"
                      placeholderTextColor="#999"
                    />
                  ) : (
                    <View className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                      <Text className="text-gray-800">{formData.vehicleNumber}</Text>
                    </View>
                  )}
                </View>

                <View>
                  <Text className="text-gray-600 font-medium mb-2">Vehicle Capacity</Text>
                  {isEditing || showAddVehicleForm ? (
                    <View className="flex-row items-center gap-3">
                      <TextInput
                        value={formData.vehicleCapacity.value.toString()}
                        onChangeText={(text) => handleVehicleCapacityChange('value', parseInt(text) || 0)}
                        className="flex-1 p-3 border border-gray-300 rounded-md text-lg bg-white"
                        keyboardType="numeric"
                      />
                      <View className="flex-row flex-wrap gap-2">
                        {capacityUnits.map((unit) => (
                          <TouchableOpacity
                            key={unit}
                            onPress={() => handleVehicleCapacityChange('unit', unit)}
                            className={`px-3 py-2 border rounded-md ${
                              formData.vehicleCapacity.unit === unit 
                                ? 'bg-[#5B5AF7] border-[#5B5AF7]' 
                                : 'bg-white border-gray-300'
                            }`}
                          >
                            <Text className={
                              formData.vehicleCapacity.unit === unit 
                                ? 'text-white font-medium' 
                                : 'text-gray-600'
                            }>
                              {unit}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  ) : (
                    <View className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                      <Text className="text-gray-800">
                        {formData.vehicleCapacity.value} {formData.vehicleCapacity.unit}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>

            {/* Driver Information Section */}
            <View className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 mb-5">
              <View className="flex-row items-center mb-5 pb-3 border-b-2 border-gray-100">
                <Icon name="user" size={24} color="#5B5AF7" />
                <Text className="ml-3 text-lg font-medium text-gray-800">Driver Details</Text>
              </View>
              
              <View className="space-y-4">
                <View>
                  <Text className="text-gray-600 font-medium mb-2">Driver Name</Text>
                  {isEditing || showAddVehicleForm ? (
                    <TextInput
                      value={formData.driverInfo.driverName}
                      onChangeText={(text) => handleDriverInfoChange('driverName', text)}
                      className="p-3 border border-gray-300 rounded-md text-lg bg-white"
                    />
                  ) : (
                    <View className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                      <Text className="text-gray-800">{formData.driverInfo.driverName}</Text>
                    </View>
                  )}
                </View>

                <View>
                  <Text className="text-gray-600 font-medium mb-2">Driver Mobile No.</Text>
                  {isEditing || showAddVehicleForm ? (
                    <TextInput
                      value={formData.driverInfo.driverMobileNo}
                      onChangeText={(text) => handleDriverInfoChange('driverMobileNo', text)}
                      className="p-3 border border-gray-300 rounded-md text-lg bg-white"
                      keyboardType="phone-pad"
                      maxLength={10}
                    />
                  ) : (
                    <View className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                      <Text className="text-gray-800">{formData.driverInfo.driverMobileNo}</Text>
                    </View>
                  )}
                </View>

                <View>
                  <Text className="text-gray-600 font-medium mb-2">Driver Age</Text>
                  {isEditing || showAddVehicleForm ? (
                    <TextInput
                      value={formData.driverInfo.driverAge.toString()}
                      onChangeText={(text) => handleDriverInfoChange('driverAge', parseInt(text) || 0)}
                      className="p-3 border border-gray-300 rounded-md text-lg bg-white"
                      keyboardType="numeric"
                    />
                  ) : (
                    <View className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                      <Text className="text-gray-800">{formData.driverInfo.driverAge} years</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>

            {/* Vehicle Documents Section */}
            <View className="bg-white p-5 rounded-xl shadow-md">
              <Text className="text-lg font-medium text-gray-800 mb-4">Vehicle Documents</Text>
              
              {documentFields.map(doc => {
                const currentDocs = getCurrentDocuments();
                const currentUploads = getCurrentFileUploads();
                const currentDeleting = getCurrentDeletingFiles();
                
                const docValue = currentDocs[doc.key];
                const uploadedFile = currentUploads[doc.key];
                const isMarkedForDeletion = currentDeleting.includes(doc.key);
                const hasExistingDoc = docValue && docValue.trim() !== '';
                
                return (
                  <View key={doc.key} className={`p-4 border border-gray-200 rounded-lg bg-gray-50 mb-4 ${
                    isMarkedForDeletion && 'opacity-70'
                  }`}>
                    <View className="flex-row justify-between items-center mb-3">
                      <Text className="text-gray-800 font-medium">
                        {doc.label}
                        {(doc.required && !showAddVehicleForm) && <Text className="text-red-500">*</Text>}
                        {(doc.required && showAddVehicleForm) && <Text className="text-red-500">*</Text>}
                      </Text>
                      
                      {!isEditing && !showAddVehicleForm && hasExistingDoc && (
                        <TouchableOpacity
                          onPress={() => viewDocument(doc.key)}
                          className="flex-row items-center justify-center px-3 py-2 bg-[#5B5AF7] rounded-md gap-2 shadow-sm"
                        >
                          <Icon name="download" size={16} color="white" />
                          <Text className="text-white text-sm font-medium">View/Download</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                    
                    {!isEditing && !showAddVehicleForm ? (
                      // View Mode
                      <View>
                        {hasExistingDoc ? (
                          <TouchableOpacity
                            onPress={() => viewDocument(doc.key)}
                            className="flex-row items-center justify-between p-4 bg-white border border-gray-300 rounded-md shadow-sm"
                          >
                            <View className="flex-row items-center gap-3">
                              {getFileIcon(docValue)}
                              <View>
                                <Text className="font-medium text-gray-800">
                                  {getFileName(docValue)}
                                </Text>
                                <Text className="text-gray-500 text-sm mt-1">
                                  Tap to view/download
                                </Text>
                              </View>
                            </View>
                            <Icon name="download" size={20} color="#5B5AF7" />
                          </TouchableOpacity>
                        ) : (
                          <View className="p-4 bg-gray-100 border border-dashed border-gray-300 rounded-md items-center">
                            <Text className="text-gray-500">No document uploaded</Text>
                          </View>
                        )}
                      </View>
                    ) : (
                      // Edit Mode
                      <View>
                        <TouchableOpacity
                          onPress={() => handleFileChange(doc.key)}
                          className={`border-2 border-dashed rounded-md p-5 items-center ${
                            uploadedFile ? 'bg-indigo-50 border-[#5B5AF7]' : 'border-gray-300'
                          }`}
                        >
                          <Icon name="upload" size={24} color="#5B5AF7" />
                          {uploadedFile ? (
                            <View className="mt-3 items-center">
                              <Text className="font-medium text-gray-800 text-center">
                                {uploadedFile.file.name}
                              </Text>
                              <Text className="text-gray-600 text-sm mt-1 text-center">
                                {(uploadedFile.file.size / 1024).toFixed(2)} KB - {showAddVehicleForm ? 'Ready to upload' : 'Will replace existing file'}
                              </Text>
                            </View>
                          ) : (
                            <View className="mt-3 items-center">
                              <Text className="text-gray-600 text-center">
                                Tap to upload {doc.label}
                              </Text>
                              <Text className="text-gray-500 text-sm mt-2 text-center">
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
                            className="flex-row items-center justify-center gap-2 mt-3 p-2 bg-red-50 border border-red-200 rounded-md"
                          >
                            <Icon name="times" size={12} color="#e74c3c" />
                            <Text className="text-red-600 text-sm">Remove uploaded file</Text>
                          </TouchableOpacity>
                        )}
                        
                        {hasExistingDoc && !isMarkedForDeletion && !showAddVehicleForm && (
                          <View className="p-3 bg-gray-100 border border-gray-300 rounded-md mt-3">
                            <View className="mb-2">
                              <Text className="font-medium text-gray-700">Current Document:</Text>
                              <Text className="text-gray-600 text-sm">{getFileName(docValue)}</Text>
                            </View>
                            <View className="flex-row gap-3">
                              <TouchableOpacity
                                onPress={() => viewDocument(doc.key)}
                                className="flex-row items-center justify-center px-3 py-2 bg-[#5B5AF7] rounded-md gap-2 shadow-sm"
                              >
                                <Icon name="download" size={12} color="white" />
                                <Text className="text-white text-xs font-medium">View</Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => handleRemoveDocument(doc.key)}
                                className="flex-row items-center justify-center px-3 py-2 bg-red-50 border border-red-200 rounded-md gap-2"
                              >
                                <Icon name="trash" size={12} color="#e74c3c" />
                                <Text className="text-red-600 text-xs font-medium">Remove</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        )}
                        
                        {isMarkedForDeletion && !showAddVehicleForm && (
                          <View className="flex-row justify-between items-center p-3 bg-yellow-50 border border-yellow-200 rounded-md mt-3">
                            <Text className="text-yellow-800 flex-1 mr-3">
                              ⚠️ This document will be deleted. Upload a new file or restore.
                            </Text>
                            <TouchableOpacity
                              onPress={() => handleRestoreDocument(doc.key, uploadedFile?.currentUrl || '')}
                              className="px-3 py-2 bg-green-100 border border-green-300 rounded-md"
                            >
                              <Text className="text-green-800 text-xs font-medium">Restore</Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </>
        ) : null}
      </ScrollView>

      {/* Document Modal */}
      <Modal
        visible={documentModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setDocumentModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-5">
            <View className="flex-row justify-between items-center mb-5">
              <Text className="text-xl font-medium text-gray-800">Document Viewer</Text>
              <TouchableOpacity onPress={() => setDocumentModalVisible(false)}>
                <Icon name="times" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            {selectedDocument && (
              <View className="items-center">
                <Text className="text-gray-600 mb-5 text-center">
                  {getFileName(selectedDocument.url)}
                </Text>
                <TouchableOpacity
                  onPress={() => downloadDocument(selectedDocument.key)}
                  className="flex-row items-center justify-center w-full py-3 bg-[#5B5AF7] rounded-lg gap-3 shadow-md"
                >
                  <Icon name="download" size={20} color="white" />
                  <Text className="text-white font-medium">Download Document</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default VehiclesPage;