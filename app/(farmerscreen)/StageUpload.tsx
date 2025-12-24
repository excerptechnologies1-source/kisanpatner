import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
  Image,
  Platform,
  SafeAreaView,
  FlatList,
} from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  ChevronLeft,
  Camera,
  X,
  Calendar,
  Plus,
} from 'lucide-react-native';

// API Base URL configuration
const API_BASE_URL = 'https://kisan.etpl.ai';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// Interfaces
interface Crop {
  _id: string;
  farmingType: string;
  seedType: string;
  acres: number;
  sowingDate: string;
  farmerId: string;
}

interface Stage {
  name: string;
  status: string;
  photos: string[];
}

interface Tracking {
  _id: string;
  name: string;
  stages: Stage[];
}

// StageUpload Component
const StageUpload: React.FC<{ crop: Crop; onClose: () => void }> = ({ crop, onClose }) => {
  const [tracking, setTracking] = useState<Tracking | null>(null);
  const [loadingInit, setLoadingInit] = useState(false);
  const [uploadingStage, setUploadingStage] = useState<number | null>(null);
  const [filesByStage, setFilesByStage] = useState<{ [key: number]: string[] }>({});
  const [dropdownValues, setDropdownValues] = useState<string[]>(Array(7).fill(''));

  const DEFAULT_STAGE_NAMES = [
    'Field Preparation',
    'Sowing/Planting',
    'Vegetative Growth',
    'Flowering',
    'Fruiting',
    'Harvesting',
    'Post Harvest',
  ];

  const trackingName = `${crop.seedType || 'Crop'} Tracking (${crop.farmingType || ''})`;

  useEffect(() => {
    initTracking();
  }, []);

  const initTracking = async () => {
    setLoadingInit(true);
    const payload = {
      name: trackingName,
      cropId: crop._id,
      cropName: crop.seedType || '',
      farmerId: crop.farmerId,
    };

    try {
      const fetchRes = await api.get(`/tracking/by-crop/${crop._id}`);
      if (fetchRes.data?.success) {
        setTracking(fetchRes.data.data);
        return;
      }
    } catch (err) {
      console.log('No existing tracking found, creating new...');
    }

    try {
      const res = await api.post('/tracking/init', payload);
      if (res.data?.success) {
        setTracking(res.data.data);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to initialize tracking');
    } finally {
      setLoadingInit(false);
    }
  };

  const pickImages = async (stageIndex: number) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant camera roll permissions');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 10,
    });

    if (!result.canceled && result.assets.length > 0) {
      const uris = result.assets.map((asset) => asset.uri);
      setFilesByStage((prev) => ({
        ...prev,
        [stageIndex]: [...(prev[stageIndex] || []), ...uris],
      }));
    }
  };

  const uploadStage = async (index: number): Promise<boolean> => {
    if (!tracking) return false;
    const files = filesByStage[index] || [];
    if (files.length === 0) {
      Alert.alert('No Files', 'Please select files to upload');
      return false;
    }

    const formData = new FormData();
    formData.append('stageIndex', String(index));

    for (const uri of files) {
      const fileName = uri.split('/').pop() || `photo_${Date.now()}.jpg`;
      formData.append('files', {
        uri,
        type: 'image/jpeg',
        name: fileName,
      } as any);
    }

    try {
      setUploadingStage(index);
      const res = await api.post(`/tracking/${tracking._id}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data?.success) {
        setTracking(res.data.data);
        setFilesByStage((prev) => {
          const updated = { ...prev };
          updated[index] = [];
          return updated;
        });
        return true;
      }
      return false;
    } catch (err) {
      Alert.alert('Upload Failed', 'Failed to upload files');
      return false;
    } finally {
      setUploadingStage(null);
    }
  };

  const handleSubmit = async () => {
    if (!tracking) return;

    // Update statuses
    for (let idx = 0; idx < dropdownValues.length; idx++) {
      const status = dropdownValues[idx];
      if (status) {
        try {
          await api.put(`/tracking/${tracking._id}/stage`, { stageIndex: idx, status });
        } catch (err) {
          console.error('Failed to update stage status', err);
        }
      }
    }

    // Upload files
    const uploadPromises = [];
    for (let idx = 0; idx < 7; idx++) {
      if (filesByStage[idx]?.length) {
        uploadPromises.push(uploadStage(idx));
      }
    }

    await Promise.all(uploadPromises);
    Alert.alert('Success', 'All updates submitted successfully');
    onClose();
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-100';
      case 'in_progress':
        return 'bg-amber-100';
      default:
        return 'bg-gray-100';
    }
  };

  const getStatusTextStyle = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-emerald-800';
      case 'in_progress':
        return 'text-amber-800';
      default:
        return 'text-gray-800';
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 border-b border-gray-200">
        <TouchableOpacity onPress={onClose} className="p-2">
          <X size={24} color="#374151" />
        </TouchableOpacity>
        <View className="ml-3">
          <Text className="text-xl font-bold text-gray-900 font-medium">Upload Stage Photos</Text>
          <Text className="text-gray-600 text-sm font-medium">{trackingName}</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 py-4">
        {(tracking?.stages || DEFAULT_STAGE_NAMES).map((stage: Stage | string, idx: number) => {
          const stageName = typeof stage === 'string' ? stage : stage.name || DEFAULT_STAGE_NAMES[idx];
          const stageStatus = typeof stage === 'string' ? 'pending' : stage.status || 'pending';
          const stagePhotos = typeof stage === 'string' ? [] : stage.photos || [];
          const selectedFiles = filesByStage[idx] || [];

          return (
            <View key={idx} className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-xl">
              {/* Stage Header */}
              <View className="flex-row justify-between items-center mb-4">
                <View className="flex-1">
                  <Text className="text-lg font-bold text-gray-900 font-medium">
                    Stage {idx + 1}: {stageName}
                  </Text>
                  <View className={`px-2 py-1 rounded-full mt-1 self-start ${getStatusStyle(stageStatus)}`}>
                    <Text className={`text-xs font-medium capitalize ${getStatusTextStyle(stageStatus)}`}>
                      {stageStatus.replace('_', ' ')}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Status Dropdown */}
              <View className="mb-4">
                <Text className="text-sm text-gray-700 mb-2 font-medium">Update Status</Text>
                <View className="flex-row flex-wrap gap-2">
                  {['pending', 'in_progress', 'completed'].map((status) => (
                    <TouchableOpacity
                      key={status}
                      onPress={() => {
                        const newValues = [...dropdownValues];
                        newValues[idx] = status;
                        setDropdownValues(newValues);
                      }}
                      className={`px-3 py-2 border rounded-lg font-medium ${
                        dropdownValues[idx] === status
                          ? 'border-emerald-500 bg-emerald-100'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      <Text className="text-sm capitalize font-medium">{status.replace('_', ' ')}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Existing Photos */}
              {stagePhotos.length > 0 && (
                <View className="mb-4">
                  <Text className="text-sm text-gray-700 mb-2 font-medium">Existing Photos</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {stagePhotos.map((photo, i) => (
                      <Image
                        key={i}
                        source={{ uri: photo.startsWith('http') ? photo : `${API_BASE_URL}/${photo.replace(/^\//, '')}` }}
                        className="w-20 h-20 rounded-lg mr-2"
                      />
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* Upload Area */}
              <View className="mb-4">
                <Text className="text-sm text-gray-700 mb-2 font-medium">Add New Photos</Text>
                <TouchableOpacity
                  onPress={() => pickImages(idx)}
                  className="border-2 border-dashed border-emerald-500 rounded-xl p-6 items-center justify-center bg-white"
                >
                  <Camera size={32} color="#10B981" />
                  <Text className="text-gray-900 mt-2 font-medium">Select Photos</Text>
                  <Text className="text-gray-600 text-xs mt-1 font-medium">Tap to choose images</Text>
                </TouchableOpacity>
              </View>

              {/* Selected Files Preview */}
              {selectedFiles.length > 0 && (
                <View className="mb-4">
                  <Text className="text-sm text-gray-700 mb-2 font-medium">
                    Selected ({selectedFiles.length})
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {selectedFiles.map((uri, i) => (
                      <View key={i} className="mr-2 relative">
                        <Image source={{ uri }} className="w-20 h-20 rounded-lg" />
                        <TouchableOpacity
                          onPress={() => {
                            setFilesByStage((prev) => ({
                              ...prev,
                              [idx]: prev[idx].filter((_, index) => index !== i),
                            }));
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center"
                        >
                          <X size={12} color="white" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* Upload Button */}
              <TouchableOpacity
                onPress={() => uploadStage(idx)}
                disabled={uploadingStage === idx || selectedFiles.length === 0}
                className={`py-3 rounded-lg items-center mt-2 ${
                  uploadingStage === idx || selectedFiles.length === 0
                    ? 'bg-gray-300'
                    : 'bg-emerald-500'
                }`}
              >
                {uploadingStage === idx ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-medium">Upload Photos</Text>
                )}
              </TouchableOpacity>
            </View>
          );
        })}

        {/* Submit All Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          className="py-4 bg-blue-500 rounded-xl items-center justify-center mt-4 mb-8"
        >
          <Text className="text-white text-lg font-bold font-medium">Submit All Updates</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StageUpload;