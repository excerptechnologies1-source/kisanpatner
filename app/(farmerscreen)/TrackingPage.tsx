import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import {
    AlertCircle,
    Calendar,
    Camera,
    CheckCircle,
    ChevronDown,
    ChevronRight,
    Clock,
    Plus,
    RefreshCw,
    Trash2,
    Upload,
    X
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Stage {
  name: string;
  status: string;
  startDate?: string;
  endDate?: string;
  photos: string[];
  uploadDate?: string;
}

interface Tracking {
  _id: string;
  name: string;
  stages: Stage[];
  currentStageIndex: number;
}

const TrackingPage: React.FC<{ name: string }> = ({ name }) => {
  const [tracking, setTracking] = useState<Tracking | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMode, setUploadMode] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<{ [key: number]: string[] }>({});
  const [stageStatuses, setStageStatuses] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStageIndex, setSelectedStageIndex] = useState<number | null>(null);
  const [statusModalVisible, setStatusModalVisible] = useState(false);

  const BASE_URL = 'https://kisan.etpl.ai';

  useEffect(() => {
    fetchTracking();
    const interval = setInterval(fetchTracking, 10000);
    return () => clearInterval(interval);
  }, [name]);

  const fetchTracking = async () => {
    try {
      setRefreshing(true);
      const res = await axios.get(`${BASE_URL}/tracking/by-name`, { params: { name } });
      if (res.data?.data) {
        setTracking(res.data.data);
        setOpenIndex(res.data.data.currentStageIndex ?? 0);
        const stages = res.data.data.stages || [];
        console.log('Fetched stages:', stages);
        setStageStatuses(stages.map((s: Stage) => s.status || 'pending'));
      }
    } catch (err) {
      console.error('fetchTracking', err);
      Alert.alert('Error', 'Failed to fetch tracking data');
    } finally {
      setRefreshing(false);
    }
  };

  const pickImages = async (stageIndex: number) => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please grant camera roll permissions');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: 10,
      });

      if (!result.canceled && result.assets.length > 0) {
        const files = result.assets.map(asset => asset.uri);
        setSelectedFiles(prev => ({
          ...prev,
          [stageIndex]: [...(prev[stageIndex] || []), ...files]
        }));
      }
    } catch (error) {
      console.error('Error picking images:', error);
      Alert.alert('Error', 'Failed to pick images');
    }
  };

  const takePhoto = async (stageIndex: number) => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please grant camera permissions');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        quality: 0.8,
        allowsEditing: false,
      });

      if (!result.canceled && result.assets[0]) {
        const fileUri = result.assets[0].uri;
        setSelectedFiles(prev => ({
          ...prev,
          [stageIndex]: [...(prev[stageIndex] || []), fileUri]
        }));
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const uploadFiles = async () => {
    if (!tracking) return;

    setUploading(true);
    try {
      const uploadPromises = [];

      for (const stageIndexStr in selectedFiles) {
        const stageIndex = parseInt(stageIndexStr, 10);
        const files = selectedFiles[stageIndex];

        if (!files || files.length === 0) continue;

        const formData = new FormData();
        
        for (const fileUri of files) {
          const fileInfo = await FileSystem.getInfoAsync(fileUri);
          const fileName = fileUri.split('/').pop() || `photo_${Date.now()}.jpg`;
          const fileType = 'image/jpeg';

          formData.append('files', {
            uri: fileUri,
            type: fileType,
            name: fileName,
          } as any);
        }

        formData.append('stageIndex', stageIndex.toString());
        formData.append('uploadDate', new Date().toISOString());

        uploadPromises.push(
          axios.post(`${BASE_URL}/tracking/${tracking._id}/upload`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
        );
      }

      // Update statuses if changed
      if (stageStatuses.length > 0) {
        tracking.stages.forEach((stage, idx) => {
          if (stageStatuses[idx] && stageStatuses[idx] !== stage.status) {
            uploadPromises.push(
              axios.put(`${BASE_URL}/tracking/${tracking._id}/stage`, {
                stageIndex: idx,
                status: stageStatuses[idx]
              })
            );
          }
        });
      }

      await Promise.all(uploadPromises);
      
      Alert.alert('Success', 'All files uploaded successfully!');
      setSelectedFiles({});
      setUploadMode(false);
      fetchTracking();
    } catch (err) {
      console.error('Upload error:', err);
      Alert.alert('Error', 'Failed to upload files');
    } finally {
      setUploading(false);
    }
  };

  const clearStagePhotos = async (stageIndex: number) => {
    if (!tracking) return;

    Alert.alert(
      'Clear Photos',
      'Are you sure you want to clear all photos for this stage?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              setUploading(true);
              await axios.put(`${BASE_URL}/tracking/${tracking._id}/stage`, {
                stageIndex,
                clearPhotos: true
              });
              fetchTracking();
              Alert.alert('Success', 'Photos cleared successfully');
            } catch (err) {
              console.error('Clear error:', err);
              Alert.alert('Error', 'Failed to clear photos');
            } finally {
              setUploading(false);
            }
          }
        }
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
      case 'in progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <CheckCircle size={16} color="#059669" />;
      case 'in_progress':
      case 'in progress':
        return <Clock size={16} color="#D97706" />;
      default:
        return <AlertCircle size={16} color="#6B7280" />;
    }
  };

  const renderStageItem = ({ item: stage, index }: { item: Stage; index: number }) => {
    const isOpen = openIndex === index;
    const hasPhotos = stage.photos && stage.photos.length > 0;

    return (
      <View className="mb-3 rounded-xl bg-white shadow-sm border border-gray-200 overflow-hidden">
        <TouchableOpacity
          onPress={() => setOpenIndex(isOpen ? null : index)}
          className="p-4 flex-row justify-between items-center"
          activeOpacity={0.7}
        >
          <View className="flex-row items-center flex-1">
            <View className="w-8 h-8 rounded-full bg-blue-50 items-center justify-center mr-3">
              <Text className="font-semibold text-blue-600">{index + 1}</Text>
            </View>
            <View className="flex-1">
              <Text className="font-semibold text-gray-900 text-base">{stage.name}</Text>
              <View className="flex-row items-center mt-1">
                {getStatusIcon(stage.status)}
                <Text className={`ml-2 text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(stage.status)}`}>
                  {stage.status?.replace('_', ' ').toUpperCase()}
                </Text>
              </View>
            </View>
          </View>
          {isOpen ? (
            <ChevronDown size={20} color="#6B7280" />
          ) : (
            <ChevronRight size={20} color="#6B7280" />
          )}
        </TouchableOpacity>

        {isOpen && (
          <View className="px-4 pb-4 border-t border-gray-100 pt-4">
            {/* Dates */}
            <View className="flex-row mb-4">
              {stage.startDate && (
                <View className="flex-row items-center mr-4">
                  <Calendar size={14} color="#6B7280" />
                  <Text className="ml-1 text-xs text-gray-600">
                    Start: {new Date(stage.startDate).toLocaleDateString()}
                  </Text>
                </View>
              )}
              {stage.endDate && (
                <View className="flex-row items-center">
                  <Calendar size={14} color="#6B7280" />
                  <Text className="ml-1 text-xs text-gray-600">
                    End: {new Date(stage.endDate).toLocaleDateString()}
                  </Text>
                </View>
              )}
            </View>

            {/* Photos Grid */}
            <Text className="font-medium text-gray-700 mb-2">Photos ({stage.photos?.length || 0})</Text>
            {hasPhotos ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                {stage.photos.map((photo, photoIndex) => (
                  <View key={photoIndex} className="mr-2 relative">
                    <Image
                      source={{ uri: `${BASE_URL}/${photo}` }}
                      className="w-24 h-24 rounded-lg"
                      resizeMode="cover"
                    />
                    <TouchableOpacity
                      className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center"
                      onPress={() => clearStagePhotos(index)}
                    >
                      <Trash2 size={12} color="white" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            ) : (
              <View className="bg-gray-50 rounded-lg p-6 items-center justify-center mb-4">
                <Camera size={32} color="#9CA3AF" />
                <Text className="text-gray-500 mt-2">No photos uploaded yet</Text>
              </View>
            )}

            {/* Upload Actions */}
            <View className="flex-row space-x-2">
              <TouchableOpacity
                onPress={() => pickImages(index)}
                disabled={uploading}
                className="flex-1 bg-blue-500 py-3 rounded-lg items-center flex-row justify-center"
              >
                <Upload size={18} color="white" />
                <Text className="text-white font-medium ml-2">Add Photos</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => takePhoto(index)}
                disabled={uploading}
                className="px-4 py-3 bg-green-500 rounded-lg items-center justify-center"
              >
                <Camera size={18} color="white" />
              </TouchableOpacity>

              {hasPhotos && (
                <TouchableOpacity
                  onPress={() => clearStagePhotos(index)}
                  disabled={uploading}
                  className="px-4 py-3 bg-red-500 rounded-lg items-center justify-center"
                >
                  <Trash2 size={18} color="white" />
                </TouchableOpacity>
              )}
            </View>

            {stage.uploadDate && (
              <View className="mt-3 bg-green-50 p-2 rounded-lg">
                <Text className="text-green-700 text-xs text-center">
                  📅 Last uploaded: {new Date(stage.uploadDate).toLocaleString()}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  const renderUploadMode = () => (
    <Modal
      visible={uploadMode}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1">
          {/* Header */}
          <View className="px-4 pt-4 pb-4 border-b border-gray-200 flex-row justify-between items-center">
            <View>
              <Text className="text-xl font-bold text-gray-900">Upload Photos</Text>
              <Text className="text-gray-600 mt-1">{tracking?.name}</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setUploadMode(false);
                setSelectedFiles({});
              }}
              className="p-2"
            >
              <X size={24} color="#374151" />
            </TouchableOpacity>
          </View>

          {/* Stages List */}
          <FlatList
            data={tracking?.stages || []}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item: stage, index }) => (
              <View className="m-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="font-semibold text-gray-900">
                    {index + 1}. {stage.name}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedStageIndex(index);
                      setStatusModalVisible(true);
                    }}
                    className={`px-3 py-1 rounded-full ${getStatusColor(stageStatuses[index] || stage.status)}`}
                  >
                    <Text className="text-xs font-medium">
                      {stageStatuses[index] || stage.status}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Photo Upload Area */}
                <TouchableOpacity
                  onPress={() => pickImages(index)}
                  className="border-2 border-dashed border-green-500 rounded-xl p-6 items-center justify-center bg-white mb-3"
                >
                  <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mb-2">
                    <Plus size={24} color="#10B981" />
                  </View>
                  <Text className="font-medium text-gray-900">Add Photos</Text>
                  <Text className="text-gray-500 text-xs mt-1">Tap to select images</Text>
                </TouchableOpacity>

                {/* Selected Files Preview */}
                {selectedFiles[index] && selectedFiles[index].length > 0 && (
                  <View className="mt-3">
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                      Selected ({selectedFiles[index].length})
                    </Text>
                    <FlatList
                      horizontal
                      data={selectedFiles[index]}
                      keyExtractor={(item, idx) => idx.toString()}
                      renderItem={({ item: uri, index: photoIndex }) => (
                        <View className="mr-2 relative">
                          <Image source={{ uri }} className="w-20 h-20 rounded-lg" />
                          <TouchableOpacity
                            onPress={() => {
                              setSelectedFiles(prev => ({
                                ...prev,
                                [index]: prev[index].filter((_, i) => i !== photoIndex)
                              }));
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center"
                          >
                            <X size={12} color="white" />
                          </TouchableOpacity>
                        </View>
                      )}
                    />
                  </View>
                )}
              </View>
            )}
            contentContainerClassName="pb-24"
          />

          {/* Bottom Actions */}
          <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={() => {
                  setUploadMode(false);
                  setSelectedFiles({});
                }}
                disabled={uploading}
                className="flex-1 py-3 border border-gray-300 rounded-xl items-center"
              >
                <Text className="font-medium text-gray-700">Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={uploadFiles}
                disabled={uploading || Object.keys(selectedFiles).length === 0}
                className={`flex-1 py-3 rounded-xl items-center ${
                  uploading || Object.keys(selectedFiles).length === 0
                    ? 'bg-gray-300'
                    : 'bg-green-500'
                }`}
              >
                {uploading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <View className="flex-row items-center">
                    <Upload size={18} color="white" />
                    <Text className="text-white font-medium ml-2">Upload All</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );

  const renderStatusModal = () => (
    <Modal
      visible={statusModalVisible}
      transparent
      animationType="fade"
    >
      <View className="flex-1 bg-black/50 items-center justify-center">
        <View className="bg-white rounded-2xl w-11/12 max-w-md p-6">
          <Text className="text-lg font-bold text-gray-900 mb-4">Update Status</Text>
          
          <View className="space-y-2 mb-6">
            {['pending', 'in_progress', 'completed'].map((status) => (
              <TouchableOpacity
                key={status}
                onPress={() => {
                  if (selectedStageIndex !== null) {
                    const newStatuses = [...stageStatuses];
                    newStatuses[selectedStageIndex] = status;
                    setStageStatuses(newStatuses);
                  }
                  setStatusModalVisible(false);
                }}
                className={`p-3 rounded-lg border ${
                  stageStatuses[selectedStageIndex || 0] === status
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200'
                }`}
              >
                <View className="flex-row items-center">
                  {getStatusIcon(status)}
                  <Text className="ml-3 font-medium capitalize">
                    {status.replace('_', ' ')}
                  </Text>
                  {stageStatuses[selectedStageIndex || 0] === status && (
                    <CheckCircle size={20} color="#3B82F6" className="ml-auto" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            onPress={() => setStatusModalVisible(false)}
            className="py-3 border border-gray-300 rounded-lg items-center"
          >
            <Text className="font-medium text-gray-700">Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  if (!tracking) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-gray-600">Loading tracking data...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-4 pt-4 pb-3 bg-white border-b border-gray-200">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-2xl font-bold text-gray-900">{tracking.name}</Text>
            <View className="flex-row items-center mt-1">
              <View className="bg-blue-100 px-2 py-1 rounded-full">
                <Text className="text-blue-700 text-xs font-medium">
                  Stage {tracking.currentStageIndex + 1} of {tracking.stages.length}
                </Text>
              </View>
              <TouchableOpacity
                onPress={fetchTracking}
                className="ml-2 p-1"
                disabled={refreshing}
              >
                <RefreshCw size={16} color="#6B7280" className={refreshing ? 'animate-spin' : ''} />
              </TouchableOpacity>
            </View>
          </View>
          
          <TouchableOpacity
            onPress={() => setUploadMode(true)}
            className="bg-green-500 px-4 py-2 rounded-full flex-row items-center"
          >
            <Upload size={18} color="white" />
            <Text className="text-white font-medium ml-2">Batch Upload</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stages List */}
      <FlatList
        data={tracking.stages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderStageItem}
        contentContainerClassName="p-4"
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={fetchTracking}
        ListEmptyComponent={
          <View className="items-center justify-center py-12">
            <Text className="text-gray-500">No stages found</Text>
          </View>
        }
      />

      {renderUploadMode()}
      {renderStatusModal()}

      {/* Uploading Overlay */}
      {uploading && (
        <View className="absolute inset-0 bg-black/50 items-center justify-center">
          <View className="bg-white rounded-2xl p-6 items-center">
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text className="mt-4 text-gray-700 font-medium">Uploading...</Text>
            <Text className="text-gray-500 text-sm mt-1">Please wait</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default TrackingPage;