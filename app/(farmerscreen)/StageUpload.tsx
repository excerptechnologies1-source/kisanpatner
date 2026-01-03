// import React, { useEffect, useState } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   TextInput,
//   Alert,
//   ActivityIndicator,
//   Modal,
//   Image,
//   Platform,
//   SafeAreaView,
//   FlatList,
// } from 'react-native';
// import axios from 'axios';
// import * as ImagePicker from 'expo-image-picker';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import {
//   ChevronLeft,
//   Camera,
//   X,
//   Calendar,
//   Plus,
// } from 'lucide-react-native';

// // API Base URL configuration
// const API_BASE_URL = 'https://kisan.etpl.ai';

// // Create axios instance
// const api = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 30000,
// });

// api.interceptors.request.use(
//   async (config) => {
//     const token = await AsyncStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );


// // Interfaces
// interface Crop {
//   _id: string;
//   farmingType: string;
//   seedType: string;
//   acres: number;
//   sowingDate: string;
//   farmerId: string;
// }

// interface Stage {
//   name: string;
//   status: string;
//   photos: string[];
// }

// interface Tracking {
//   _id: string;
//   name: string;
//   stages: Stage[];
// }

// // StageUpload Component
// const StageUpload: React.FC<{ crop: Crop; onClose: () => void }> = ({ crop, onClose }) => {
//   const [tracking, setTracking] = useState<Tracking | null>(null);
//   const [loadingInit, setLoadingInit] = useState(false);
//   const [uploadingStage, setUploadingStage] = useState<number | null>(null);
//   const [filesByStage, setFilesByStage] = useState<{ [key: number]: string[] }>({});
//   const [dropdownValues, setDropdownValues] = useState<string[]>(Array(7).fill(''));

//   const DEFAULT_STAGE_NAMES = [
//     'Field Preparation',
//     'Sowing/Planting',
//     'Vegetative Growth',
//     'Flowering',
//     'Fruiting',
//     'Harvesting',
//     'Post Harvest',
//   ];

//   const trackingName = `${crop.seedType || 'Crop'} Tracking (${crop.farmingType || ''})`;

//   useEffect(() => {
//     initTracking();
//   }, []);

//   const initTracking = async () => {
//     setLoadingInit(true);
//     const payload = {
//       name: trackingName,
//       cropId: crop._id,
//       cropName: crop.seedType || '',
//       farmerId: crop.farmerId,
//     };

//     try {
//       const fetchRes = await api.get(`/tracking/by-crop/${crop._id}`);
//       if (fetchRes.data?.success) {
//         setTracking(fetchRes.data.data);
//         return;
//       }
//     } catch (err) {
//       console.log('No existing tracking found, creating new...');
//     }

//     try {
//       const res = await api.post('/tracking/init', payload);
//       if (res.data?.success) {
//         setTracking(res.data.data);
//       }
//     } catch (err) {
//       Alert.alert('Error', 'Failed to initialize tracking');
//     } finally {
//       setLoadingInit(false);
//     }
//   };

//   const pickImages = async (stageIndex: number) => {
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== 'granted') {
//       Alert.alert('Permission Required', 'Please grant camera roll permissions');
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsMultipleSelection: true,
//       quality: 0.8,
//       selectionLimit: 10,
//     });

//     if (!result.canceled && result.assets.length > 0) {
//       const uris = result.assets.map((asset) => asset.uri);
//       setFilesByStage((prev) => ({
//         ...prev,
//         [stageIndex]: [...(prev[stageIndex] || []), ...uris],
//       }));
//     }
//   };

//   const uploadStage = async (index: number): Promise<boolean> => {
//     if (!tracking) return false;
//     const files = filesByStage[index] || [];
//     if (files.length === 0) {
//       Alert.alert('No Files', 'Please select files to upload');
//       return false;
//     }

//     const formData = new FormData();
//     formData.append('stageIndex', String(index));

//     for (const uri of files) {
//       const fileName = uri.split('/').pop() || `photo_${Date.now()}.jpg`;
//       formData.append('files', {
//         uri,
//         type: 'image/jpeg',
//         name: fileName,
//       } as any);
//     }

//     try {
//       setUploadingStage(index);
//       const res = await api.post(`/tracking/${tracking._id}/upload`, formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });

//       if (res.data?.success) {
//         setTracking(res.data.data);
//         setFilesByStage((prev) => {
//           const updated = { ...prev };
//           updated[index] = [];
//           return updated;
//         });
//         return true;
//       }
//       return false;
//     } catch (err) {
//       Alert.alert('Upload Failed', 'Failed to upload files');
//       return false;
//     } finally {
//       setUploadingStage(null);
//     }
//   };

//   const handleSubmit = async () => {
//     if (!tracking) return;

//     // Update statuses
//     for (let idx = 0; idx < dropdownValues.length; idx++) {
//       const status = dropdownValues[idx];
//       if (status) {
//         try {
//           await api.put(`/tracking/${tracking._id}/stage`, { stageIndex: idx, status });
//         } catch (err) {
//           console.error('Failed to update stage status', err);
//         }
//       }
//     }

//     // Upload files
//     const uploadPromises = [];
//     for (let idx = 0; idx < 7; idx++) {
//       if (filesByStage[idx]?.length) {
//         uploadPromises.push(uploadStage(idx));
//       }
//     }

//     await Promise.all(uploadPromises);
//     Alert.alert('Success', 'All updates submitted successfully');
//     onClose();
//   };

//   const getStatusStyle = (status: string) => {
//     switch (status) {
//       case 'completed':
//         return 'bg-emerald-100';
//       case 'in_progress':
//         return 'bg-amber-100';
//       default:
//         return 'bg-gray-100';
//     }
//   };

//   const getStatusTextStyle = (status: string) => {
//     switch (status) {
//       case 'completed':
//         return 'text-emerald-800';
//       case 'in_progress':
//         return 'text-amber-800';
//       default:
//         return 'text-gray-800';
//     }
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-white">
//       {/* Header */}
//       <View className="flex-row items-center px-4 py-4 border-b border-gray-200">
//         <TouchableOpacity onPress={onClose} className="p-2">
//           <X size={24} color="#374151" />
//         </TouchableOpacity>
//         <View className="ml-3">
//           <Text className="text-xl font-bold text-gray-900 font-medium">Upload Stage Photos</Text>
//           <Text className="text-gray-600 text-sm font-medium">{trackingName}</Text>
//         </View>
//       </View>

//       <ScrollView className="flex-1 px-4 py-4">
//         {(tracking?.stages || DEFAULT_STAGE_NAMES).map((stage: Stage | string, idx: number) => {
//           const stageName = typeof stage === 'string' ? stage : stage.name || DEFAULT_STAGE_NAMES[idx];
//           const stageStatus = typeof stage === 'string' ? 'pending' : stage.status || 'pending';
//           const stagePhotos = typeof stage === 'string' ? [] : stage.photos || [];
//           const selectedFiles = filesByStage[idx] || [];

//           return (
//             <View key={idx} className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-xl">
//               {/* Stage Header */}
//               <View className="flex-row justify-between items-center mb-4">
//                 <View className="flex-1">
//                   <Text className="text-lg font-bold text-gray-900 font-medium">
//                     Stage {idx + 1}: {stageName}
//                   </Text>
//                   <View className={`px-2 py-1 rounded-full mt-1 self-start ${getStatusStyle(stageStatus)}`}>
//                     <Text className={`text-xs font-medium capitalize ${getStatusTextStyle(stageStatus)}`}>
//                       {stageStatus.replace('_', ' ')}
//                     </Text>
//                   </View>
//                 </View>
//               </View>

//               {/* Status Dropdown */}
//               <View className="mb-4">
//                 <Text className="text-sm text-gray-700 mb-2 font-medium">Update Status</Text>
//                 <View className="flex-row flex-wrap gap-2">
//                   {['pending', 'in_progress', 'completed'].map((status) => (
//                     <TouchableOpacity
//                       key={status}
//                       onPress={() => {
//                         const newValues = [...dropdownValues];
//                         newValues[idx] = status;
//                         setDropdownValues(newValues);
//                       }}
//                       className={`px-3 py-2 border rounded-lg font-medium ${
//                         dropdownValues[idx] === status
//                           ? 'border-emerald-500 bg-emerald-100'
//                           : 'border-gray-300 bg-white'
//                       }`}
//                     >
//                       <Text className="text-sm capitalize font-medium">{status.replace('_', ' ')}</Text>
//                     </TouchableOpacity>
//                   ))}
//                 </View>
//               </View>

//               {/* Existing Photos */}
//               {stagePhotos.length > 0 && (
//                 <View className="mb-4">
//                   <Text className="text-sm text-gray-700 mb-2 font-medium">Existing Photos</Text>
//                   <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//                     {stagePhotos.map((photo, i) => (
//                       <Image
//                         key={i}
//                         source={{ uri: photo.startsWith('http') ? photo : `${API_BASE_URL}/${photo.replace(/^\//, '')}` }}
//                         className="w-20 h-20 rounded-lg mr-2"
//                       />
//                     ))}
//                   </ScrollView>
//                 </View>
//               )}

//               {/* Upload Area */}
//               <View className="mb-4">
//                 <Text className="text-sm text-gray-700 mb-2 font-medium">Add New Photos</Text>
//                 <TouchableOpacity
//                   onPress={() => pickImages(idx)}
//                   className="border-2 border-dashed border-emerald-500 rounded-xl p-6 items-center justify-center bg-white"
//                 >
//                   <Camera size={32} color="#10B981" />
//                   <Text className="text-gray-900 mt-2 font-medium">Select Photos</Text>
//                   <Text className="text-gray-600 text-xs mt-1 font-medium">Tap to choose images</Text>
//                 </TouchableOpacity>
//               </View>

//               {/* Selected Files Preview */}
//               {selectedFiles.length > 0 && (
//                 <View className="mb-4">
//                   <Text className="text-sm text-gray-700 mb-2 font-medium">
//                     Selected ({selectedFiles.length})
//                   </Text>
//                   <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//                     {selectedFiles.map((uri, i) => (
//                       <View key={i} className="mr-2 relative">
//                         <Image source={{ uri }} className="w-20 h-20 rounded-lg" />
//                         <TouchableOpacity
//                           onPress={() => {
//                             setFilesByStage((prev) => ({
//                               ...prev,
//                               [idx]: prev[idx].filter((_, index) => index !== i),
//                             }));
//                           }}
//                           className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center"
//                         >
//                           <X size={12} color="white" />
//                         </TouchableOpacity>
//                       </View>
//                     ))}
//                   </ScrollView>
//                 </View>
//               )}

//               {/* Upload Button */}
//               <TouchableOpacity
//                 onPress={() => uploadStage(idx)}
//                 disabled={uploadingStage === idx || selectedFiles.length === 0}
//                 className={`py-3 rounded-lg items-center mt-2 ${
//                   uploadingStage === idx || selectedFiles.length === 0
//                     ? 'bg-gray-300'
//                     : 'bg-emerald-500'
//                 }`}
//               >
//                 {uploadingStage === idx ? (
//                   <ActivityIndicator color="white" />
//                 ) : (
//                   <Text className="text-white font-medium">Upload Photos</Text>
//                 )}
//               </TouchableOpacity>
//             </View>
//           );
//         })}

//         {/* Submit All Button */}
//         <TouchableOpacity
//           onPress={handleSubmit}
//           className="py-4 bg-blue-500 rounded-xl items-center justify-center mt-4 mb-8"
//         >
//           <Text className="text-white text-lg font-bold font-medium">Submit All Updates</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default StageUpload;







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
  Linking,
  RefreshControl,
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
  ChevronDown,
} from 'lucide-react-native';

// API Base URL configurations
const API_BASE_URL = 'https://kisan.etpl.ai'; // Main API base URL
const AD_API_BASE_URL = 'https://kisanadmin.etpl.ai'; // Advertisement API base URL

// Create main axios instance for kisan.etpl.ai
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// Create separate axios instance for advertisements (kisanadmin.etpl.ai)
const adApi = axios.create({
  baseURL: AD_API_BASE_URL,
  timeout: 30000,
});

// Add token to main API requests
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

// Add token to advertisement API requests
adApi.interceptors.request.use(
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

interface Product {
  images: string[];
  productName: string;
  description: string;
  mrpPrice: number;
  salesPrice: number;
}

interface CallToAction {
  buyNowLink: string;
  visitWebsiteLink: string;
  callNowNumber: string;
  whatsappNowNumber: string;
  price: number;
  selectedAction: 'buyNow' | 'visitWebsite' | 'callNow' | 'whatsappNow';
}

interface Advertisement {
  _id: string;
  stage: string;
  tab: string;
  heading: string;
  description: string;
  companyLogo: string;
  companyName: string;
  advice: string;
  guide: string;
  banner: string;
  callToAction: CallToAction;
  products: Product[];
  isActive: boolean;
  createdAt: string;
}

// Advertisement Card Component
const AdvertisementCard: React.FC<{ ad: Advertisement }> = ({ ad }) => {
  const { selectedAction, price } = ad.callToAction;
  
  // Use guide if available, otherwise use advice
  const adviceText = ad.guide || ad.advice;

  const getButtonText = () => {
    if (price && price > 0) {
      return `₹${price.toLocaleString()}`;
    }
    switch (selectedAction) {
      case 'callNow':
        return `Call: ${ad.callToAction.callNowNumber}`;
      case 'whatsappNow':
        return `WhatsApp: ${ad.callToAction.whatsappNowNumber}`;
      default:
        return 'View Details';
    }
  };

  const handleAdClick = async () => {
    switch (selectedAction) {
      case 'buyNow':
        await Linking.openURL(ad.callToAction.buyNowLink);
        break;
      case 'visitWebsite':
        await Linking.openURL(ad.callToAction.visitWebsiteLink);
        break;
      case 'callNow':
        await Linking.openURL(`tel:${ad.callToAction.callNowNumber}`);
        break;
      case 'whatsappNow':
        await Linking.openURL(`https://wa.me/${ad.callToAction.whatsappNowNumber}`);
        break;
    }
  };

  const getButtonColor = () => {
    switch (selectedAction) {
      case 'buyNow': return '#28a745';
      case 'visitWebsite': return '#007bff';
      case 'callNow': return '#17a2b8';
      case 'whatsappNow': return '#25D366';
      default: return '#1ca723';
    }
  };

  return (
    <TouchableOpacity
      onPress={handleAdClick}
      className="bg-white rounded-lg overflow-hidden mb-3 border border-gray-200"
      activeOpacity={0.8}
    >
      {ad.banner && (
        <Image
          source={{ uri: ad.banner }}
          className="w-full h-20"
          resizeMode="cover"
        />
      )}

      <View className="p-3">
        <View className="flex-row items-center mb-2">
          {ad.companyLogo && (
            <Image
              source={{ uri: ad.companyLogo }}
              className="w-5 h-5 rounded-full mr-2"
            />
          )}
          <View className="flex-1">
            <Text numberOfLines={1} className="text-xs font-bold text-gray-900">
              {ad.heading}
            </Text>
            {ad.companyName && (
              <Text numberOfLines={1} className="text-xs text-gray-600">
                {ad.companyName}
              </Text>
            )}
          </View>
        </View>

        {ad.description && (
          <Text numberOfLines={2} className="text-xs text-gray-700 mb-1">
            {ad.description}
          </Text>
        )}

        {adviceText && (
          <View className="bg-blue-50 p-2 rounded mb-2">
            <Text className="text-xs text-blue-900">
              <Text className="font-bold">💡 Tip: </Text>
              {adviceText}
            </Text>
          </View>
        )}

        {ad.products && ad.products.length > 0 && (
          <View className="flex-row items-center mb-2">
            {ad.products[0].images && ad.products[0].images.length > 0 && (
              <Image
                source={{ uri: ad.products[0].images[0] }}
                className="w-4 h-4 rounded mr-2"
              />
            )}
            <View className="flex-1">
              <Text numberOfLines={1} className="text-xs font-bold text-gray-900">
                {ad.products[0].productName}
              </Text>
              <View className="flex-row items-center gap-1">
                <Text className="text-xs font-bold text-red-600">
                  ₹{ad.products[0].salesPrice.toLocaleString()}
                </Text>
                {ad.products[0].mrpPrice > ad.products[0].salesPrice && (
                  <Text className="text-xs text-gray-400 line-through">
                    ₹{ad.products[0].mrpPrice.toLocaleString()}
                  </Text>
                )}
              </View>
            </View>
          </View>
        )}

        <TouchableOpacity
          onPress={handleAdClick}
          style={{ backgroundColor: getButtonColor() }}
          className="py-2 rounded items-center"
        >
          <Text className="text-white text-xs font-bold">{getButtonText()}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

// Stage Advertisements Component
const StageAdvertisements: React.FC<{ stageIndex: number; stageName: string }> = ({
  stageIndex,
  stageName,
}) => {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(false);

  // Function to get stage number like stage01, stage02, etc.
  const getStageNumber = (index: number): string => {
    return `stage${String(index + 1).padStart(2, '0')}`;
  };

  // Get all stage numbers for fallback (closest stages first)
  const getFallbackStages = (currentStage: number): string[] => {
    const allStages = [0, 1, 2, 3, 4, 5, 6];
    return allStages
      .filter(stage => stage !== currentStage)
      .sort((a, b) => Math.abs(a - currentStage) - Math.abs(b - currentStage))
      .map(stage => `stage${String(stage + 1).padStart(2, '0')}`);
  };

  useEffect(() => {
    loadAds();
  }, [stageIndex]);

  const loadAds = async () => {
    setLoading(true);
    try {
      let adsData: Advertisement[] = [];
      const currentStageNumber = getStageNumber(stageIndex);
      
      // Step 1: Try exact stage number match (e.g., stage01)
      try {
        const response = await adApi.get('/api/ads', {
          params: {
            page: 1,
            limit: 3,
            stage: currentStageNumber,
            isActive: 'true',
          },
        });

        if (response.data?.success && response.data.data.length > 0) {
          adsData = response.data.data;
        }
      } catch (err) {
        console.log(`No ads found for exact stage: ${currentStageNumber}`);
      }

      // Step 2: If no ads found for exact stage, try fallback stages
      if (adsData.length === 0) {
        const fallbackStages = getFallbackStages(stageIndex);
        
        for (const fallbackStage of fallbackStages) {
          if (adsData.length >= 2) break;
          
          try {
            const response = await adApi.get('/api/ads', {
              params: {
                page: 1,
                limit: 2,
                stage: fallbackStage,
                isActive: 'true',
              },
            });

            if (response.data?.success && response.data.data.length > 0) {
              adsData = [...adsData, ...response.data.data];
            }
          } catch (err) {
            console.log(`No ads found for fallback stage: ${fallbackStage}`);
          }
        }
      }

      // Step 3: If still no ads, try keyword-based search as fallback
      if (adsData.length === 0) {
        const STAGE_KEYWORDS: Record<number, string[]> = {
          0: ['preparation', 'field', 'soil', 'land'],
          1: ['sowing', 'planting', 'seeds', 'sapling'],
          2: ['growth', 'vegetative', 'fertilizer', 'nutrient'],
          3: ['flowering', 'bloom', 'pollination'],
          4: ['fruiting', 'fruit', 'crop', 'produce'],
          5: ['harvesting', 'harvest', 'collection', 'gathering'],
          6: ['post-harvest', 'storage', 'processing', 'packaging'],
        };

        const keywords = STAGE_KEYWORDS[stageIndex] || [];
        for (const keyword of keywords) {
          if (adsData.length >= 2) break;
          
          try {
            const response = await adApi.get('/api/ads', {
              params: {
                page: 1,
                limit: 2,
                stage: keyword,
                isActive: 'true',
              },
            });

            if (response.data?.success && response.data.data.length > 0) {
              adsData = [...adsData, ...response.data.data];
            }
          } catch (err) {
            console.log(`No ads found for keyword: ${keyword}`);
          }
        }
      }

      // Step 4: Final fallback - get any active ads
      if (adsData.length === 0) {
        try {
          const response = await adApi.get('/api/ads', {
            params: {
              page: 1,
              limit: 3,
              isActive: 'true',
            },
          });
          if (response.data?.success) {
            adsData = response.data.data;
          }
        } catch (err) {
          console.error('Failed to fetch general ads:', err);
        }
      }

      // Remove duplicates based on _id
      const uniqueAds = adsData.filter(
        (ad, index, self) => self.findIndex(a => a._id === ad._id) === index
      );

      setAds(uniqueAds.slice(0, 2)); // Show max 2 ads
    } catch (err) {
      console.error(`Error fetching ads for stage ${stageIndex}:`, err);
      setAds([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="mt-4">
      <Text className="text-sm font-bold text-gray-900 mb-2">
        📢 Recommended Products for {stageName}
      </Text>
      {loading ? (
        <ActivityIndicator size="small" color="#3498db" />
      ) : ads.length > 0 ? (
        <View>
          {ads.map((ad) => (
            <AdvertisementCard key={ad._id} ad={ad} />
          ))}
        </View>
      ) : (
        <Text className="text-xs text-gray-500">No recommendations available</Text>
      )}
    </View>
  );
};

// Main StageUpload Component
const StageUpload: React.FC<{ crop: Crop; onClose: () => void }> = ({ crop, onClose }) => {
  const [tracking, setTracking] = useState<Tracking | null>(null);
  const [loadingInit, setLoadingInit] = useState(false);
  const [uploadingStage, setUploadingStage] = useState<number | null>(null);
  const [filesByStage, setFilesByStage] = useState<{ [key: number]: string[] }>({});
  const [dropdownValues, setDropdownValues] = useState<string[]>(Array(7).fill(''));
  const [expandedStage, setExpandedStage] = useState<number | null>(null);

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
        Alert.alert('Success', 'Photos uploaded successfully');
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

  // if (loadingInit) {
  //   return (
  //     <SafeAreaView className="flex-1 bg-white justify-center items-center">
  //       <ActivityIndicator size="large" color="#1ca723" />
  //       <Text className="mt-4 text-gray-600">Loading stages...</Text>
  //     </SafeAreaView>
  //   );
  // }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 border-b border-gray-200">
        <TouchableOpacity onPress={onClose} className="p-2">
          <X size={24} color="#374151" />
        </TouchableOpacity>
        <View className="ml-3">
          <Text className="text-xl font-bold text-gray-900">Upload Stage Photos</Text>
          <Text className="text-gray-600 text-sm">{trackingName}</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 py-4">
        {(tracking?.stages || DEFAULT_STAGE_NAMES).map((stage: Stage | string, idx: number) => {
          const stageName = typeof stage === 'string' ? stage : stage.name || DEFAULT_STAGE_NAMES[idx];
          const stageStatus = typeof stage === 'string' ? 'pending' : stage.status || 'pending';
          const stagePhotos = typeof stage === 'string' ? [] : stage.photos || [];
          const selectedFiles = filesByStage[idx] || [];
          const isExpanded = expandedStage === idx;

          return (
            <View key={idx} className="mb-2 bg-white border border-gray-200 rounded-lg overflow-hidden">
              {/* Stage Header - Dropdown Trigger */}
              <TouchableOpacity
                onPress={() => setExpandedStage(isExpanded ? null : idx)}
                className="flex-row justify-between items-center px-4 py-3 bg-gray-50"
              >
                <View className="flex-1">
                  <Text className="text-base font-bold text-gray-900">
                    Stage {idx + 1}: {stageName}
                  </Text>
                  <View className={`px-2 py-1 rounded-full mt-1 self-start ${getStatusStyle(stageStatus)}`}>
                    <Text className={`text-xs font-medium capitalize ${getStatusTextStyle(stageStatus)}`}>
                      {stageStatus.replace('_', ' ')}
                    </Text>
                  </View>
                </View>
                <ChevronDown
                  size={24}
                  color="#666"
                  style={{
                    transform: [{ rotate: isExpanded ? '180deg' : '0deg' }],
                  }}
                />
              </TouchableOpacity>

              {/* Expanded Content */}
              {isExpanded && (
                <View className="px-4 py-4 border-t border-gray-200">
                  {/* Status Dropdown */}
                  <View className="mb-4">
                    <Text className="text-sm text-gray-700 mb-2 font-semibold">Update Status</Text>
                    <View className="flex-row flex-wrap gap-2">
                      {['pending', 'in_progress', 'completed'].map((status) => (
                        <TouchableOpacity
                          key={status}
                          onPress={() => {
                            const newValues = [...dropdownValues];
                            newValues[idx] = status;
                            setDropdownValues(newValues);
                          }}
                          className={`px-3 py-2 border rounded-lg ${
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
                      <Text className="text-sm text-gray-700 mb-2 font-semibold">Existing Photos</Text>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {stagePhotos.map((photo, i) => (
                          <Image
                            key={i}
                            source={{
                              uri: photo.startsWith('http') ? photo : `${API_BASE_URL}/${photo.replace(/^\//, '')}`,
                            }}
                            className="w-20 h-20 rounded-lg mr-2"
                          />
                        ))}
                      </ScrollView>
                    </View>
                  )}

                  {/* Upload Area */}
                  <View className="mb-4">
                    <Text className="text-sm text-gray-700 mb-2 font-semibold">Add New Photos</Text>
                    <TouchableOpacity
                      onPress={() => pickImages(idx)}
                      className="border-2 border-dashed border-emerald-500 rounded-xl p-6 items-center justify-center bg-white"
                    >
                      <Camera size={32} color="#10B981" />
                      <Text className="text-gray-900 mt-2 font-medium">Select Photos</Text>
                      <Text className="text-gray-600 text-xs mt-1">Tap to choose images</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Selected Files Preview */}
                  {selectedFiles.length > 0 && (
                    <View className="mb-4">
                      <Text className="text-sm text-gray-700 mb-2 font-semibold">
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
                    className={`py-3 rounded-lg items-center mb-4 ${
                      uploadingStage === idx || selectedFiles.length === 0
                        ? 'bg-gray-300'
                        : 'bg-emerald-500'
                    }`}
                  >
                    {uploadingStage === idx ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text className="text-white font-bold">Upload Photos</Text>
                    )}
                  </TouchableOpacity>

                  {/* Advertisements */}
                  <StageAdvertisements stageIndex={idx} stageName={stageName} />
                </View>
              )}
            </View>
          );
        })}

        {/* Submit All Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          className="py-4 bg-blue-500 rounded-xl items-center justify-center mt-4 mb-8"
        >
          <Text className="text-white text-lg font-bold">Submit All Updates</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StageUpload;