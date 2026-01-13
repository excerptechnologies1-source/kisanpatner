
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
// import * as ImageManipulator from 'expo-image-manipulator';
// import * as ImagePicker from 'expo-image-picker';
// import {
//   Camera,
//   ChevronDown,
//   FlipHorizontal,
//   Trash2,
//   X
// } from 'lucide-react-native';
// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   AppState,
//   AppStateStatus,
//   Image,
//   Linking,
//   Modal,
//   Platform,
//   SafeAreaView,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View
// } from 'react-native';

// // API Base URL configurations
// const API_BASE_URL = 'https://kisan.etpl.ai';
// const AD_API_BASE_URL = 'https://kisanadmin.etpl.ai';

// // Create main axios instance for kisan.etpl.ai
// const api = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 60000,
// });

// // Create separate axios instance for advertisements (kisanadmin.etpl.ai)
// const adApi = axios.create({
//   baseURL: AD_API_BASE_URL,
//   timeout: 30000,
// });

// // Add token to main API requests
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

// // Add token to advertisement API requests
// adApi.interceptors.request.use(
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

// interface Product {
//   images: string[];
//   productName: string;
//   description: string;
//   mrpPrice: number;
//   salesPrice: number;
// }

// interface CallToAction {
//   buyNowLink: string;
//   visitWebsiteLink: string;
//   callNowNumber: string;
//   whatsappNowNumber: string;
//   price: number;
//   selectedAction: 'buyNow' | 'visitWebsite' | 'callNow' | 'whatsappNow';
// }

// interface Advertisement {
//   _id: string;
//   stage: string;
//   tab: string;
//   heading: string;
//   description: string;
//   companyLogo: string;
//   companyName: string;
//   advice: string;
//   guide: string;
//   banner: string;
//   callToAction: CallToAction;
//   products: Product[];
//   isActive: boolean;
//   createdAt: string;
// }

// // Advertisement Card Component
// const AdvertisementCard: React.FC<{ ad: Advertisement }> = ({ ad }) => {
//   const { selectedAction, price } = ad.callToAction;
  
//   const adviceText = ad.guide || ad.advice;

//   const getButtonText = () => {
//     if (price && price > 0) {
//       return `₹${price.toLocaleString()}`;
//     }
//     switch (selectedAction) {
//       case 'callNow':
//         return `Call: ${ad.callToAction.callNowNumber}`;
//       case 'whatsappNow':
//         return `WhatsApp: ${ad.callToAction.whatsappNowNumber}`;
//       default:
//         return 'View Details';
//     }
//   };

//   const handleAdClick = async () => {
//     switch (selectedAction) {
//       case 'buyNow':
//         await Linking.openURL(ad.callToAction.buyNowLink);
//         break;
//       case 'visitWebsite':
//         await Linking.openURL(ad.callToAction.visitWebsiteLink);
//         break;
//       case 'callNow':
//         await Linking.openURL(`tel:${ad.callToAction.callNowNumber}`);
//         break;
//       case 'whatsappNow':
//         await Linking.openURL(`https://wa.me/${ad.callToAction.whatsappNowNumber}`);
//         break;
//     }
//   };

//   const getButtonColor = () => {
//     switch (selectedAction) {
//       case 'buyNow': return '#28a745';
//       case 'visitWebsite': return '#007bff';
//       case 'callNow': return '#17a2b8';
//       case 'whatsappNow': return '#25D366';
//       default: return '#1ca723';
//     }
//   };

//   return (
//     <TouchableOpacity
//       onPress={handleAdClick}
//       className="bg-white rounded-lg overflow-hidden mb-3 border border-gray-200"
//       activeOpacity={0.8}
//     >
//       {ad.banner && (
//         <Image
//           source={{ uri: ad.banner }}
//           className="w-full h-20"
//           resizeMode="cover"
//         />
//       )}

//       <View className="p-3">
//         <View className="flex-row items-center mb-2">
//           {ad.companyLogo && (
//             <Image
//               source={{ uri: ad.companyLogo }}
//               className="w-5 h-5 rounded-full mr-2"
//             />
//           )}
//           <View className="flex-1">
//             <Text numberOfLines={1} className="text-xs font-bold text-gray-900">
//               {ad.heading}
//             </Text>
//             {ad.companyName && (
//               <Text numberOfLines={1} className="text-xs text-gray-600">
//                 {ad.companyName}
//               </Text>
//             )}
//           </View>
//         </View>

//         {ad.description && (
//           <Text numberOfLines={2} className="text-xs text-gray-700 mb-1">
//             {ad.description}
//           </Text>
//         )}

//         {adviceText && (
//           <View className="bg-blue-50 p-2 rounded mb-2">
//             <Text className="text-xs text-blue-900">
//               <Text className="font-bold">💡 Tip: </Text>
//               {adviceText}
//             </Text>
//           </View>
//         )}

//         {ad.products && ad.products.length > 0 && (
//           <View className="flex-row items-center mb-2">
//             {ad.products[0].images && ad.products[0].images.length > 0 && (
//               <Image
//                 source={{ uri: ad.products[0].images[0] }}
//                 className="w-4 h-4 rounded mr-2"
//               />
//             )}
//             <View className="flex-1">
//               <Text numberOfLines={1} className="text-xs font-bold text-gray-900">
//                 {ad.products[0].productName}
//               </Text>
//               <View className="flex-row items-center gap-1">
//                 <Text className="text-xs font-bold text-red-600">
//                   ₹{ad.products[0].salesPrice.toLocaleString()}
//                 </Text>
//                 {ad.products[0].mrpPrice > ad.products[0].salesPrice && (
//                   <Text className="text-xs text-gray-400 line-through">
//                     ₹{ad.products[0].mrpPrice.toLocaleString()}
//                   </Text>
//                 )}
//               </View>
//             </View>
//           </View>
//         )}

//         <TouchableOpacity
//           onPress={handleAdClick}
//           style={{ backgroundColor: getButtonColor() }}
//           className="py-2 rounded items-center"
//         >
//           <Text className="text-white text-xs font-bold">{getButtonText()}</Text>
//         </TouchableOpacity>
//       </View>
//     </TouchableOpacity>
//   );
// };

// // Stage Advertisements Component
// const StageAdvertisements: React.FC<{ stageIndex: number; stageName: string }> = ({
//   stageIndex,
//   stageName,
// }) => {
//   const [ads, setAds] = useState<Advertisement[]>([]);
//   const [loading, setLoading] = useState(false);

//   const getStageNumber = (index: number): string => {
//     return `stage${String(index + 1).padStart(2, '0')}`;
//   };

//   const getFallbackStages = (currentStage: number): string[] => {
//     const allStages = [0, 1, 2, 3, 4, 5, 6];
//     return allStages
//       .filter(stage => stage !== currentStage)
//       .sort((a, b) => Math.abs(a - currentStage) - Math.abs(b - currentStage))
//       .map(stage => `stage${String(stage + 1).padStart(2, '0')}`);
//   };

//   useEffect(() => {
//     loadAds();
//   }, [stageIndex]);

//   const loadAds = async () => {
//     setLoading(true);
//     try {
//       let adsData: Advertisement[] = [];
//       const currentStageNumber = getStageNumber(stageIndex);
      
//       try {
//         const response = await adApi.get('/api/ads', {
//           params: {
//             page: 1,
//             limit: 3,
//             stage: currentStageNumber,
//             isActive: 'true',
//           },
//         });

//         if (response.data?.success && response.data.data.length > 0) {
//           adsData = response.data.data;
//         }
//       } catch (err) {
//         console.log(`No ads found for exact stage: ${currentStageNumber}`);
//       }

//       if (adsData.length === 0) {
//         const fallbackStages = getFallbackStages(stageIndex);
        
//         for (const fallbackStage of fallbackStages) {
//           if (adsData.length >= 2) break;
          
//           try {
//             const response = await adApi.get('/api/ads', {
//               params: {
//                 page: 1,
//                 limit: 2,
//                 stage: fallbackStage,
//                 isActive: 'true',
//               },
//             });

//             if (response.data?.success && response.data.data.length > 0) {
//               adsData = [...adsData, ...response.data.data];
//             }
//           } catch (err) {
//             console.log(`No ads found for fallback stage: ${fallbackStage}`);
//           }
//         }
//       }

//       if (adsData.length === 0) {
//         const STAGE_KEYWORDS: Record<number, string[]> = {
//           0: ['preparation', 'field', 'soil', 'land'],
//           1: ['sowing', 'planting', 'seeds', 'sapling'],
//           2: ['growth', 'vegetative', 'fertilizer', 'nutrient'],
//           3: ['flowering', 'bloom', 'pollination'],
//           4: ['fruiting', 'fruit', 'crop', 'produce'],
//           5: ['harvesting', 'harvest', 'collection', 'gathering'],
//           6: ['post-harvest', 'storage', 'processing', 'packaging'],
//         };

//         const keywords = STAGE_KEYWORDS[stageIndex] || [];
//         for (const keyword of keywords) {
//           if (adsData.length >= 2) break;
          
//           try {
//             const response = await adApi.get('/api/ads', {
//               params: {
//                 page: 1,
//                 limit: 2,
//                 stage: keyword,
//                 isActive: 'true',
//               },
//             });

//             if (response.data?.success && response.data.data.length > 0) {
//               adsData = [...adsData, ...response.data.data];
//             }
//           } catch (err) {
//             console.log(`No ads found for keyword: ${keyword}`);
//           }
//         }
//       }

//       if (adsData.length === 0) {
//         try {
//           const response = await adApi.get('/api/ads', {
//             params: {
//               page: 1,
//               limit: 3,
//               isActive: 'true',
//             },
//           });
//           if (response.data?.success) {
//             adsData = response.data.data;
//           }
//         } catch (err) {
//           console.error('Failed to fetch general ads:', err);
//         }
//       }

//       const uniqueAds = adsData.filter(
//         (ad, index, self) => self.findIndex(a => a._id === ad._id) === index
//       );

//       setAds(uniqueAds.slice(0, 2));
//     } catch (err) {
//       console.error(`Error fetching ads for stage ${stageIndex}:`, err);
//       setAds([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View className="mt-4">
//       <Text className="text-sm font-bold text-gray-900 mb-2">
//         📢 Recommended Products for {stageName}
//       </Text>
//       {loading ? (
//         <ActivityIndicator size="small" color="#3498db" />
//       ) : ads.length > 0 ? (
//         <View>
//           {ads.map((ad) => (
//             <AdvertisementCard key={ad._id} ad={ad} />
//           ))}
//         </View>
//       ) : (
//         <Text className="text-xs text-gray-500">No recommendations available</Text>
//       )}
//     </View>
//   );
// };

// // Main StageUpload Component with Camera
// const StageUpload: React.FC<{ crop: Crop; onClose: () => void }> = ({ crop, onClose }) => {
//   const [tracking, setTracking] = useState<Tracking | null>(null);
//   const [loadingInit, setLoadingInit] = useState(false);
//   const [uploadingStage, setUploadingStage] = useState<number | null>(null);
//   const [filesByStage, setFilesByStage] = useState<{ [key: number]: string[] }>({});
//   const [dropdownValues, setDropdownValues] = useState<string[]>(Array(7).fill(''));
//   const [expandedStage, setExpandedStage] = useState<number | null>(null);
//   const [deletingPhoto, setDeletingPhoto] = useState<{ stageIndex: number; photoIndex: number } | null>(null);

//   // Camera states
//   const [cameraVisible, setCameraVisible] = useState(false);
//   const [currentStageForCamera, setCurrentStageForCamera] = useState<number | null>(null);
//   const [permission, requestPermission] = useCameraPermissions();
//   const cameraRef = useRef<CameraView>(null);
//   const [facing, setFacing] = useState<CameraType>('back');
//   const [capturingPhoto, setCapturingPhoto] = useState(false);
//   const [cameraReady, setCameraReady] = useState(false);
//   const [appState, setAppState] = useState(AppState.currentState);
//   const [useAlternativeCamera, setUseAlternativeCamera] = useState(false);

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
    
//     // Handle app state changes to manage camera
//     const subscription = AppState.addEventListener('change', handleAppStateChange);
    
//     return () => {
//       subscription.remove();
//     };
//   }, []);

//   const handleAppStateChange = (nextAppState: AppStateStatus) => {
//     if (appState.match(/inactive|background/) && nextAppState === 'active') {
//       // App has come to the foreground
//       if (cameraVisible) {
//         setCameraReady(false);
//         setTimeout(() => setCameraReady(true), 100);
//       }
//     }
//     setAppState(nextAppState);
//   };

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

//   // Camera Functions - FIXED
//   const openCamera = useCallback(async (stageIndex: number) => {
//     try {
//       let cameraPermission = permission;
      
//       if (!cameraPermission || !cameraPermission.granted) {
//         cameraPermission = await requestPermission();
//       }

//       if (!cameraPermission?.granted) {
//         Alert.alert(
//           'Camera Permission Required',
//           'This app needs camera access to take photos.',
//           [
//             { text: 'Cancel', style: 'cancel' },
//             { text: 'Open Settings', onPress: () => Linking.openSettings() }
//           ]
//         );
//         return;
//       }

//       setCurrentStageForCamera(stageIndex);
//       setCameraVisible(true);
//       setCameraReady(false);
      
//       // Give camera time to initialize properly
//       setTimeout(() => {
//         setCameraReady(true);
//       }, 800);
//     } catch (error) {
//       console.error('Error opening camera:', error);
//       Alert.alert('Error', 'Failed to open camera. Please try again.');
//     }
//   }, [permission, requestPermission]);

//   // FIXED: Simplified takePicture with improved reliability and fallback
//   const takePicture = useCallback(async () => {
//     if (!cameraRef.current || !cameraReady || capturingPhoto) {
//       Alert.alert('Please Wait', 'Camera is still initializing...');
//       return;
//     }

//     setCapturingPhoto(true);

//     try {
//       console.log('Attempting camera capture...');

//       // Small stabilization delay to avoid native 'Failed to capture image' errors
//       await new Promise((res) => setTimeout(res, 250));

//       // Primary approach: use CameraView.takePictureAsync
//       const photo = await cameraRef.current.takePictureAsync({
//         quality: 0.8,
//         base64: false,
//         exif: false,
//         skipProcessing: Platform.OS === 'android', // Skip processing on Android for faster capture
//       });

//       if (!photo || !photo.uri) {
//         throw new Error('Failed to capture image');
//       }

//       // Compress image for better upload performance
//       const compressedPhoto = await ImageManipulator.manipulateAsync(
//         photo.uri,
//         [{ resize: { width: 1200 } }],
//         {
//           compress: 0.7,
//           format: ImageManipulator.SaveFormat.JPEG,
//         }
//       );

//       if (currentStageForCamera !== null) {
//         setFilesByStage((prev) => ({
//           ...prev,
//           [currentStageForCamera]: [...(prev[currentStageForCamera] || []), compressedPhoto.uri],
//         }));

//         setCameraVisible(false);
//         setCurrentStageForCamera(null);
//         setCameraReady(false);

//         Alert.alert('Success', 'Photo captured successfully!');
//       }
//     } catch (error: any) {
//       console.error('Camera capture error:', error);

//       // Fallback: try using ImagePicker camera UI once
//       try {
//         console.log('Attempting fallback camera using ImagePicker...');
//         const { status } = await ImagePicker.requestCameraPermissionsAsync();
//         if (status === 'granted') {
//           const result = await ImagePicker.launchCameraAsync({
//             mediaTypes: ImagePicker.MediaTypeOptions.Images,
//             allowsEditing: false,
//             quality: 0.8,
//           });

//           if (!result.canceled && result.assets && result.assets.length > 0) {
//             const uri = result.assets[0].uri;
//             const compressedPhoto = await ImageManipulator.manipulateAsync(
//               uri,
//               [{ resize: { width: 1200 } }],
//               { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
//             );

//             if (currentStageForCamera !== null) {
//               setFilesByStage((prev) => ({
//                 ...prev,
//                 [currentStageForCamera]: [...(prev[currentStageForCamera] || []), compressedPhoto.uri],
//               }));

//               setCameraVisible(false);
//               setCurrentStageForCamera(null);
//               setCameraReady(false);

//               Alert.alert('Success', 'Photo captured successfully!');
//               return;
//             }
//           }
//         }
//       } catch (fallbackErr) {
//         console.error('Fallback capture failed:', fallbackErr);
//       }

//       Alert.alert(
//         'Capture Failed',
//         'Unable to capture photo. Please try again or use gallery.'
//       );
//     } finally {
//       setCapturingPhoto(false);
//     }
//   }, [cameraReady, capturingPhoto, currentStageForCamera]);

//   const toggleCameraFacing = useCallback(() => {
//     setFacing(current => (current === 'back' ? 'front' : 'back'));
//     setCameraReady(false);
//     setTimeout(() => setCameraReady(true), 400);
//   }, []);

//   const closeCamera = useCallback(() => {
//     setCameraVisible(false);
//     setCurrentStageForCamera(null);
//     setCapturingPhoto(false);
//     setCameraReady(false);
//     setUseAlternativeCamera(false);
//   }, []);

//   const handleCameraReady = useCallback(() => {
//     console.log('CameraView is ready');
//     setCameraReady(true);
//   }, []);

//   const pickImages = async (stageIndex: number) => {
//     // Show action sheet for image source selection
//     Alert.alert(
//       'Add Photos',
//       'Choose photo source',
//       [
//         {
//           text: '📸 Take Photo',
//           onPress: () => openCamera(stageIndex),
//           style: 'default',
//         },
//         {
//           text: '📁 Choose from Gallery',
//           onPress: async () => {
//             const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//             if (status !== 'granted') {
//               Alert.alert('Permission Required', 'Please grant photo library permissions');
//               return;
//             }

//             const result = await ImagePicker.launchImageLibraryAsync({
//               mediaTypes: ImagePicker.MediaTypeOptions.Images,
//               allowsMultipleSelection: true,
//               quality: 0.8,
//               selectionLimit: 10,
//             });

//             if (!result.canceled && result.assets.length > 0) {
//               const uris = result.assets.map((asset) => asset.uri);
//               setFilesByStage((prev) => ({
//                 ...prev,
//                 [stageIndex]: [...(prev[stageIndex] || []), ...uris],
//               }));
//             }
//           },
//         },
//         {
//           text: 'Cancel',
//           style: 'cancel',
//         },
//       ],
//       { cancelable: true }
//     );
//   };

//   const deleteExistingPhoto = async (stageIndex: number, photoPath: string) => {
//     Alert.alert(
//       'Delete Photo',
//       'Are you sure you want to delete this photo?',
//       [
//         {
//           text: 'Cancel',
//           onPress: () => {},
//           style: 'cancel',
//         },
//         {
//           text: 'Delete',
//           onPress: async () => {
//             setDeletingPhoto({ stageIndex, photoIndex: 0 });
//             try {
//               const res = await api.delete(`/tracking/${tracking?._id}/photo`, {
//                 data: {
//                   stageIndex,
//                   photoPath,
//                 },
//               });

//               if (res.data?.success) {
//                 setTracking(res.data.data);
//                 Alert.alert('Success', 'Photo deleted successfully');
//               }
//             } catch (err) {
//               Alert.alert('Error', 'Failed to delete photo');
//               console.error('Delete photo error:', err);
//             } finally {
//               setDeletingPhoto(null);
//             }
//           },
//           style: 'destructive',
//         },
//       ]
//     );
//   };

//   const uploadStage = async (index: number): Promise<boolean> => {
//     if (!tracking) {
//       Alert.alert('Error', 'Tracking not initialized');
//       return false;
//     }
    
//     const files = filesByStage[index] || [];
//     if (files.length === 0) {
//       Alert.alert('No Files', 'Please select files to upload');
//       return false;
//     }

//     // Create FormData properly
//     const formData = new FormData();
//     formData.append('stageIndex', String(index));

//     // Add files to formData
//     for (const uri of files) {
//       // Extract filename from URI
//       let filename = uri.split('/').pop();
      
//       // Ensure the filename has an extension
//       if (!filename || !filename.includes('.')) {
//         filename = `photo_${Date.now()}.jpg`;
//       }
      
//       // Get the file extension
//       const match = /\.(\w+)$/.exec(filename);
//       const type = match ? `image/${match[1]}` : 'image/jpeg';
      
//       // Create file object for FormData
//       const file = {
//         uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
//         type,
//         name: filename,
//       };

//       // Append to formData
//       formData.append('files', file as any);
//     }

//     try {
//       setUploadingStage(index);
      
//       console.log('Uploading files:', {
//         trackingId: tracking._id,
//         stageIndex: index,
//         fileCount: files.length,
//       });

//       const res = await api.post(`/tracking/${tracking._id}/upload`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           'Accept': 'application/json',
//         },
//         timeout: 60000,
//       });

//       console.log('Upload response:', res.data);

//       if (res.data?.success) {
//         setTracking(res.data.data);
//         setFilesByStage((prev) => {
//           const updated = { ...prev };
//           updated[index] = [];
//           return updated;
//         });
//         Alert.alert('Success', `${files.length} photo(s) uploaded successfully`);
//         return true;
//       } else {
//         Alert.alert('Upload Failed', res.data?.message || 'Unknown error occurred');
//         return false;
//       }
//     } catch (err: any) {
//       console.error('Upload error:', err);
      
//       let errorMessage = 'Failed to upload files';
//       if (err.response) {
//         errorMessage = err.response.data?.message || `Server error: ${err.response.status}`;
//       } else if (err.request) {
//         errorMessage = 'No response from server. Check your internet connection.';
//       } else {
//         errorMessage = err.message || 'Unknown error occurred';
//       }
      
//       Alert.alert('Upload Failed', errorMessage);
//       return false;
//     } finally {
//       setUploadingStage(null);
//     }
//   };

//   const handleSubmit = async () => {
//     if (!tracking) {
//       Alert.alert('Error', 'Tracking not initialized');
//       return;
//     }

//     // Update stage statuses
//     for (let idx = 0; idx < dropdownValues.length; idx++) {
//       const status = dropdownValues[idx];
//       if (status) {
//         try {
//           await api.put(`/tracking/${tracking._id}/stage`, { 
//             stageIndex: idx, 
//             status 
//           });
//         } catch (err) {
//           console.error('Failed to update stage status', err);
//         }
//       }
//     }

//     // Upload photos for each stage
//     const uploadPromises = [];
//     for (let idx = 0; idx < 7; idx++) {
//       if (filesByStage[idx]?.length) {
//         uploadPromises.push(uploadStage(idx));
//       }
//     }

//     if (uploadPromises.length > 0) {
//       const results = await Promise.all(uploadPromises);
//       const successfulUploads = results.filter(result => result === true).length;
//       if (successfulUploads > 0) {
//         Alert.alert('Success', `${successfulUploads} out of ${uploadPromises.length} uploads completed successfully`);
//       }
//     } else {
//       Alert.alert('Success', 'Stage statuses updated successfully');
//     }
    
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

//   // FIXED CameraModal Component
//   const CameraModal = () => (
//     <Modal
//       visible={cameraVisible}
//       animationType="slide"
//       onRequestClose={closeCamera}
//       statusBarTranslucent
//     >
//       <View style={styles.cameraContainer}>
//         {permission?.granted ? (
//           <>
//             <CameraView
//               ref={cameraRef}
//               style={styles.camera}
//               facing={facing}
//               onCameraReady={() => {
//                 console.log('Camera ready');
//                 setCameraReady(true);
//               }}
//               onMountError={(error) => {
//                 console.error('Camera mount error:', error);
//                 Alert.alert('Camera Error', 'Failed to start camera. Please try again.');
//                 closeCamera();
//               }}
//             >
//               <View style={styles.cameraOverlay}>
//                 {/* Top Controls */}
//                 <View style={styles.topControls}>
//                   <TouchableOpacity
//                     style={styles.closeButton}
//                     onPress={closeCamera}
//                   >
//                     <X size={28} color="white" />
//                   </TouchableOpacity>
                  
//                   <View style={styles.stageIndicator}>
//                     <Text style={styles.stageIndicatorText}>
//                       Stage {currentStageForCamera !== null ? currentStageForCamera + 1 : ''}
//                     </Text>
//                   </View>
//                 </View>

//                 {/* Bottom Controls */}
//                 <View style={styles.bottomControls}>
//                   <TouchableOpacity
//                     style={styles.flipButton}
//                     onPress={toggleCameraFacing}
//                     disabled={capturingPhoto || !cameraReady}
//                   >
//                     <FlipHorizontal size={28} color="white" />
//                   </TouchableOpacity>
                  
//                   <TouchableOpacity
//                     style={[
//                       styles.captureButton, 
//                       (!cameraReady || capturingPhoto) && styles.captureButtonDisabled
//                     ]}
//                     onPress={takePicture}
//                     disabled={capturingPhoto || !cameraReady}
//                     activeOpacity={0.7}
//                   >
//                     {capturingPhoto ? (
//                       <ActivityIndicator size="large" color="white" />
//                     ) : (
//                       <View style={styles.captureButtonInner} />
//                     )}
//                   </TouchableOpacity>
                  
//                   <View style={styles.spacer} />
//                 </View>
//               </View>
//             </CameraView>
            
//             {/* Loading overlay while camera initializes */}
//             {!cameraReady && (
//               <View style={styles.cameraLoading}>
//                 <ActivityIndicator size="large" color="white" />
//                 <Text style={styles.cameraLoadingText}>Initializing Camera...</Text>
//               </View>
//             )}
//           </>
//         ) : (
//           <View style={styles.permissionContainer}>
//             <Text style={styles.permissionText}>
//               Camera permission is required to take photos
//             </Text>
//             <TouchableOpacity
//               style={styles.permissionButton}
//               onPress={requestPermission}
//             >
//               <Text style={styles.permissionButtonText}>Grant Permission</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={[styles.permissionButton, styles.cancelButton]}
//               onPress={closeCamera}
//             >
//               <Text style={styles.permissionButtonText}>Cancel</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       </View>
//     </Modal>
//   );

//   return (
//     <SafeAreaView className="flex-1 bg-white">
//       {/* Camera Modal */}
//       <CameraModal />

//       {/* Header */}
//       <View className="flex-row items-center px-4 py-4 border-b border-gray-200">
//         <TouchableOpacity onPress={onClose} className="p-2">
//           <X size={24} color="#374151" />
//         </TouchableOpacity>
//         <View className="ml-3">
//           <Text className="text-xl font-bold text-gray-900">Upload Stage Photos</Text>
//           <Text className="text-gray-600 text-sm">{trackingName}</Text>
//         </View>
//       </View>

//       {loadingInit ? (
//         <View className="flex-1 justify-center items-center">
//           <ActivityIndicator size="large" color="#3498db" />
//           <Text className="mt-4 text-gray-600">Loading tracking data...</Text>
//         </View>
//       ) : (
//         <ScrollView className="flex-1 px-4 py-4">
//           {(tracking?.stages || DEFAULT_STAGE_NAMES).map((stage: Stage | string, idx: number) => {
//             const stageName = typeof stage === 'string' ? stage : stage.name || DEFAULT_STAGE_NAMES[idx];
//             const stageStatus = typeof stage === 'string' ? 'pending' : stage.status || 'pending';
//             const stagePhotos = typeof stage === 'string' ? [] : stage.photos || [];
//             const selectedFiles = filesByStage[idx] || [];
//             const isExpanded = expandedStage === idx;

//             return (
//               <View key={idx} className="mb-2 bg-white border border-gray-200 rounded-lg overflow-hidden">
//                 {/* Stage Header - Dropdown Trigger */}
//                 <TouchableOpacity
//                   onPress={() => setExpandedStage(isExpanded ? null : idx)}
//                   className="flex-row justify-between items-center px-4 py-3 bg-gray-50"
//                 >
//                   <View className="flex-1">
//                     <Text className="text-base font-bold text-gray-900">
//                       Stage {idx + 1}: {stageName}
//                     </Text>
//                     <View className={`px-2 py-1 rounded-full mt-1 self-start ${getStatusStyle(stageStatus)}`}>
//                       <Text className={`text-xs font-medium capitalize ${getStatusTextStyle(stageStatus)}`}>
//                         {stageStatus.replace('_', ' ')}
//                       </Text>
//                     </View>
//                   </View>
//                   <ChevronDown
//                     size={24}
//                     color="#666"
//                     style={{
//                       transform: [{ rotate: isExpanded ? '180deg' : '0deg' }],
//                     }}
//                   />
//                 </TouchableOpacity>

//                 {/* Expanded Content */}
//                 {isExpanded && (
//                   <View className="px-4 py-4 border-t border-gray-200">
//                     {/* Status Dropdown */}
//                     <View className="mb-4">
//                       <Text className="text-sm text-gray-700 mb-2 font-semibold">Update Status</Text>
//                       <View className="flex-row flex-wrap gap-2">
//                         {['pending', 'in_progress', 'completed'].map((status) => (
//                           <TouchableOpacity
//                             key={status}
//                             onPress={() => {
//                               const newValues = [...dropdownValues];
//                               newValues[idx] = status;
//                               setDropdownValues(newValues);
//                             }}
//                             className={`px-3 py-2 border rounded-lg ${
//                               dropdownValues[idx] === status
//                                 ? 'border-emerald-500 bg-emerald-100'
//                                 : 'border-gray-300 bg-white'
//                             }`}
//                           >
//                             <Text className="text-sm capitalize font-medium">{status.replace('_', ' ')}</Text>
//                           </TouchableOpacity>
//                         ))}
//                       </View>
//                     </View>

//                     {/* Existing Photos */}
//                     {stagePhotos.length > 0 && (
//                       <View className="mb-4">
//                         <Text className="text-sm text-gray-700 mb-2 font-semibold">Existing Photos</Text>
//                         <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//                           {stagePhotos.map((photo, i) => (
//                             <View key={i} className="mr-2 relative">
//                               <Image
//                                 source={{
//                                   uri: photo.startsWith('http') ? photo : `${API_BASE_URL}/${photo.replace(/^\//, '')}`,
//                                 }}
//                                 className="w-20 h-20 rounded-lg"
//                                 resizeMode="cover"
//                               />
//                               <TouchableOpacity
//                                 onPress={() => deleteExistingPhoto(idx, photo)}
//                                 disabled={deletingPhoto?.stageIndex === idx && deletingPhoto?.photoIndex === i}
//                                 className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center"
//                               >
//                                 {deletingPhoto?.stageIndex === idx && deletingPhoto?.photoIndex === i ? (
//                                   <ActivityIndicator size="small" color="white" />
//                                 ) : (
//                                   <Trash2 size={12} color="white" />
//                                 )}
//                               </TouchableOpacity>
//                             </View>
//                           ))}
//                         </ScrollView>
//                       </View>
//                     )}

//                     {/* Upload Area - Now with Camera Option */}
//                     <View className="mb-4">
//                       <Text className="text-sm text-gray-700 mb-2 font-semibold">Add New Photos</Text>
//                       <TouchableOpacity
//                         onPress={() => pickImages(idx)}
//                         disabled={uploadingStage === idx}
//                         className={`border-2 border-dashed border-emerald-500 rounded-xl p-6 items-center justify-center ${
//                           uploadingStage === idx ? 'bg-gray-100' : 'bg-white'
//                         }`}
//                       >
//                         <Camera size={32} color="#10B981" />
//                         <Text className="text-gray-900 mt-2 font-medium">Take or Select Photos</Text>
//                         <Text className="text-gray-600 text-xs mt-1">Tap to open camera or choose from gallery</Text>
//                         <Text className="text-blue-600 text-xs mt-1 font-medium">
//                           📸 Live camera available
//                         </Text>
//                       </TouchableOpacity>
//                     </View>

//                     {/* Selected Files Preview */}
//                     {selectedFiles.length > 0 && (
//                       <View className="mb-4">
//                         <Text className="text-sm text-gray-700 mb-2 font-semibold">
//                           Selected Photos ({selectedFiles.length})
//                         </Text>
//                         <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//                           {selectedFiles.map((uri, i) => (
//                             <View key={i} className="mr-2 relative">
//                               <Image 
//                                 source={{ uri }} 
//                                 className="w-20 h-20 rounded-lg"
//                                 resizeMode="cover"
//                               />
//                               <TouchableOpacity
//                                 onPress={() => {
//                                   setFilesByStage((prev) => ({
//                                     ...prev,
//                                     [idx]: prev[idx].filter((_, index) => index !== i),
//                                   }));
//                                 }}
//                                 className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center"
//                                 disabled={uploadingStage === idx}
//                               >
//                                 <X size={12} color="white" />
//                               </TouchableOpacity>
//                             </View>
//                           ))}
//                         </ScrollView>
//                       </View>
//                     )}

//                     {/* Upload Button */}
//                     {selectedFiles.length > 0 && (
//                       <TouchableOpacity
//                         onPress={() => uploadStage(idx)}
//                         disabled={uploadingStage === idx}
//                         className={`py-3 rounded-lg items-center mb-4 ${
//                           uploadingStage === idx
//                             ? 'bg-gray-400'
//                             : 'bg-emerald-500'
//                         }`}
//                       >
//                         {uploadingStage === idx ? (
//                           <View className="flex-row items-center">
//                             <ActivityIndicator color="white" size="small" />
//                             <Text className="text-white font-bold ml-2">Uploading...</Text>
//                           </View>
//                         ) : (
//                           <Text className="text-white font-bold">
//                             Upload {selectedFiles.length} Photo{selectedFiles.length !== 1 ? 's' : ''}
//                           </Text>
//                         )}
//                       </TouchableOpacity>
//                     )}

//                     {/* Advertisements */}
//                     <StageAdvertisements stageIndex={idx} stageName={stageName} />
//                   </View>
//                 )}
//               </View>
//             );
//           })}

//           {/* Submit All Button */}
//           <TouchableOpacity
//             onPress={handleSubmit}
//             disabled={loadingInit}
//             className={`py-4 rounded-xl items-center justify-center mt-4 mb-8 ${
//               loadingInit ? 'bg-gray-400' : 'bg-blue-500'
//             }`}
//           >
//             <Text className="text-white text-lg font-bold">
//               {loadingInit ? 'Loading...' : 'Submit All Updates'}
//             </Text>
//           </TouchableOpacity>
//         </ScrollView>
//       )}
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   cameraContainer: {
//     flex: 1,
//     backgroundColor: 'black',
//   },
//   camera: {
//     flex: 1,
//   },
//   alternativeCamera: {
//     flex: 1,
//     backgroundColor: '#333',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   alternativeCameraText: {
//     color: 'white',
//     fontSize: 16,
//     marginBottom: 30,
//   },
//   cameraLoading: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   cameraLoadingText: {
//     color: 'white',
//     marginTop: 10,
//     fontSize: 16,
//   },
//   cameraOverlay: {
//     flex: 1,
//     backgroundColor: 'transparent',
//     paddingTop: Platform.OS === 'ios' ? 50 : 20,
//   },
//   topControls: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//   },
//   closeButton: {
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     borderRadius: 20,
//     padding: 8,
//   },
//   stageIndicator: {
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//   },
//   stageIndicatorText: {
//     color: 'white',
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
//   bottomControls: {
//     flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-end',
//     paddingHorizontal: 20,
//     paddingBottom: 40,
//   },
//   flipButton: {
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     borderRadius: 25,
//     padding: 12,
//     marginBottom: 20,
//   },
//   captureButton: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     backgroundColor: 'rgba(255,255,255,0.3)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 3,
//     borderColor: 'white',
//   },
//   captureButtonDisabled: {
//     opacity: 0.5,
//     backgroundColor: 'rgba(255,255,255,0.2)',
//   },
//   captureButtonInner: {
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     backgroundColor: 'white',
//   },
//   spacer: {
//     width: 50,
//   },
//   permissionContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'black',
//     padding: 20,
//   },
//   permissionText: {
//     color: 'white',
//     fontSize: 18,
//     textAlign: 'center',
//     marginBottom: 30,
//   },
//   permissionButton: {
//     backgroundColor: '#007AFF',
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     borderRadius: 8,
//     marginBottom: 10,
//     width: '80%',
//   },
//   permissionButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   cancelButton: {
//     backgroundColor: '#FF3B30',
//   },
//   modeIndicator: {
//     position: 'absolute',
//     top: Platform.OS === 'ios' ? 60 : 30,
//     alignSelf: 'center',
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     paddingHorizontal: 15,
//     paddingVertical: 8,
//     borderRadius: 20,
//   },
//   modeIndicatorText: {
//     color: 'white',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
// });

// export default StageUpload;









import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { CameraType, Camera as ExpoCamera, useCameraPermissions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import {
  Camera as CameraIcon,
  ChevronDown,
  FlipHorizontal,
  Trash2,
  X
} from 'lucide-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  AppState,
  AppStateStatus,
  Image,
  Linking,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

// API Base URL configurations
const API_BASE_URL = 'https://kisan.etpl.ai';
const AD_API_BASE_URL = 'https://kisanadmin.etpl.ai';

// Create main axios instance for kisan.etpl.ai
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
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

  const getStageNumber = (index: number): string => {
    return `stage${String(index + 1).padStart(2, '0')}`;
  };

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

      const uniqueAds = adsData.filter(
        (ad, index, self) => self.findIndex(a => a._id === ad._id) === index
      );

      setAds(uniqueAds.slice(0, 2));
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

// Main StageUpload Component with Camera
const StageUpload: React.FC<{ crop: Crop; onClose: () => void }> = ({ crop, onClose }) => {
  const [tracking, setTracking] = useState<Tracking | null>(null);
  const [loadingInit, setLoadingInit] = useState(false);
  const [uploadingStage, setUploadingStage] = useState<number | null>(null);
  const [filesByStage, setFilesByStage] = useState<{ [key: number]: string[] }>({});
  const [dropdownValues, setDropdownValues] = useState<string[]>(Array(7).fill(''));
  const [expandedStage, setExpandedStage] = useState<number | null>(null);
  const [deletingPhoto, setDeletingPhoto] = useState<{ stageIndex: number; photoIndex: number } | null>(null);

  // Camera states
  const [cameraVisible, setCameraVisible] = useState(false);
  const [currentStageForCamera, setCurrentStageForCamera] = useState<number | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);
  const [facing, setFacing] = useState<CameraType>('back');
  const router = useRouter();
  const [capturingPhoto, setCapturingPhoto] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState);
  const [useAlternativeCamera, setUseAlternativeCamera] = useState(false);

  // Resolve Camera component safely at runtime (handles different module formats)
  const ResolvedCamera: any = (() => {
    try {
      if (typeof (ExpoCamera as any) === 'function') return ExpoCamera as any;
      if (ExpoCamera && typeof (ExpoCamera as any).default === 'function') return (ExpoCamera as any).default;
      if (ExpoCamera && typeof (ExpoCamera as any).Camera === 'function') return (ExpoCamera as any).Camera;
      if (ExpoCamera && (ExpoCamera as any).Camera && typeof (ExpoCamera as any).Camera.default === 'function') return (ExpoCamera as any).Camera.default;
      return null;
    } catch (err) {
      console.warn('Failed to resolve Camera component:', err);
      return null;
    }
  })();

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
    
    // Handle app state changes to manage camera
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription.remove();
    };
  }, []);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      // App has come to the foreground
      if (cameraVisible) {
        setCameraReady(false);
        setTimeout(() => setCameraReady(true), 100);
      }
    }
    setAppState(nextAppState);
  };

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

  // Camera Functions - FIXED
  const openCamera = useCallback(async (stageIndex: number) => {
    try {
      let cameraPermission = permission;
      
      if (!cameraPermission || !cameraPermission.granted) {
        cameraPermission = await requestPermission();
      }

      if (!cameraPermission?.granted) {
        Alert.alert(
          'Camera Permission Required',
          'This app needs camera access to take photos.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() }
          ]
        );
        return;
      }

      setCurrentStageForCamera(stageIndex);
      setCameraVisible(true);
      setCameraReady(false);
      
      // Give camera time to initialize properly
      setTimeout(() => {
        setCameraReady(true);
      }, 800);
    } catch (error) {
      console.error('Error opening camera:', error);
      Alert.alert('Error', 'Failed to open camera. Please try again.');
    }
  }, [permission, requestPermission]);

  // ENHANCED: takePicture with extended delay, retry/backoff, and verbose logging
  const takePicture = useCallback(async () => {
    if (capturingPhoto) {
      console.log('Capture ignored, already capturing');
      return;
    }

    if (!cameraRef.current) {
      Alert.alert('Camera Unavailable', 'Camera is not available. Please try again.');
      return;
    }

    if (!cameraReady) {
      Alert.alert('Please Wait', 'Camera is still initializing...');
      return;
    }

    setCapturingPhoto(true);

    try {
      console.log('Attempting camera capture for stage:', currentStageForCamera);

      const initialDelay = 1200; // ms
      const maxRetries = 1;

      // Stabilization delay
      await new Promise((r) => setTimeout(r, initialDelay));

      let photo: any = null;

      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          console.log(`Capture attempt ${attempt + 1}/${maxRetries + 1}`);
          photo = await cameraRef.current!.takePictureAsync({
            quality: 0.6,
            base64: false,
            exif: false,
            skipProcessing: true,
          });

          if (photo && photo.uri) {
            console.log('Capture succeeded:', photo.uri);
            break;
          }

          throw new Error('No photo returned');
        } catch (err: any) {
          console.warn('Capture attempt failed:', err?.message || err);
          if (attempt < maxRetries) {
            const backoff = 400 * (attempt + 1);
            await new Promise((r) => setTimeout(r, backoff));
            continue;
          }
        }
      }

      // If camera capture didn't produce a photo, try ImagePicker as an immediate fallback
      if (!photo || !photo.uri) {
        console.warn('Camera capture failed, launching ImagePicker fallback');
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status === 'granted') {
          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: (ImagePicker as any).MediaType?.Images ?? (ImagePicker as any).MediaTypeOptions?.Images ?? 'Images',
            allowsEditing: false,
            quality: 0.8,
          });

          if (!result.canceled && result.assets && result.assets.length > 0) {
            photo = result.assets[0];
          } else {
            throw new Error('ImagePicker cancelled or no assets');
          }
        } else {
          throw new Error('Camera permission not granted for fallback');
        }
      }

      if (!photo || !photo.uri) {
        throw new Error('No photo available after capture and fallback');
      }

      // Compress image
      const compressed = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: 1200 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );

      // Navigate to PreviewScreen with params
      const imageUri = compressed.uri;
      const categoryId = crop._id;
      const subCategoryId = currentStageForCamera !== null ? String(currentStageForCamera) : '';

      // Close camera before navigation to avoid camera conflicts on some devices
      setCameraVisible(false);
      setCurrentStageForCamera(null);
      setCameraReady(false);

      router.push({ pathname: 'PreviewScreen', params: { imageUri, categoryId, subCategoryId } });

    } catch (error: any) {
      console.error('takePicture error:', error?.message || error);
      Alert.alert('Capture Failed', error?.message || 'Unable to capture photo');
    } finally {
      setCapturingPhoto(false);
    }
  }, [cameraReady, capturingPhoto, currentStageForCamera, crop, router]);

  const toggleCameraFacing = useCallback(() => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
    setCameraReady(false);
    setTimeout(() => setCameraReady(true), 400);
  }, []);

  const closeCamera = useCallback(() => {
    setCameraVisible(false);
    setCurrentStageForCamera(null);
    setCapturingPhoto(false);
    setCameraReady(false);
    setUseAlternativeCamera(false);
  }, []);

  const handleCameraReady = useCallback(() => {
    console.log('CameraView is ready');
    setCameraReady(true);
  }, []);

  const pickImages = async (stageIndex: number) => {
    // Show action sheet for image source selection
    Alert.alert(
      'Add Photos',
      'Choose photo source',
      [
        {
          text: '📸 Take Photo',
          onPress: () => openCamera(stageIndex),
          style: 'default',
        },
        {
          text: '📁 Choose from Gallery',
          onPress: async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert('Permission Required', 'Please grant photo library permissions');
              return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: (ImagePicker as any).MediaType?.Images ?? (ImagePicker as any).MediaTypeOptions?.Images ?? 'Images',
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
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const deleteExistingPhoto = async (stageIndex: number, photoIndex: number, photoPath: string) => {
    Alert.alert(
      'Delete Photo',
      'Are you sure you want to delete this photo?',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            setDeletingPhoto({ stageIndex, photoIndex });
            try {
              // Try DELETE endpoint first
              const res = await api.delete(`/tracking/${tracking?._id}/photo`, {
                data: {
                  stageIndex,
                  photoPath,
                },
              });

              if (res.data?.success) {
                setTracking(res.data.data);
                Alert.alert('Success', 'Photo deleted successfully');
                return;
              }

              // If delete did not return success, fallthrough to fallback below
              console.warn('Delete endpoint did not return success:', res.data);
            } catch (err: any) {
              console.warn('Delete photo endpoint failed:', err?.response?.status || err);

              // If server returns 404 or delete not supported, try PUT fallback to remove single photo
              if (err?.response?.status === 404 || err?.response?.status === 400 || !err?.response) {
                try {
                  const res2 = await api.put(`/tracking/${tracking?._id}/stage`, {
                    stageIndex,
                    removePhoto: photoPath,
                  });

                  if (res2.data?.success) {
                    setTracking(res2.data.data);
                    Alert.alert('Success', 'Photo deleted successfully');
                    return;
                  }
                } catch (err2) {
                  console.error('Fallback delete via stage update failed:', err2);
                }
              }

              Alert.alert('Error', 'Failed to delete photo');
              console.error('Delete photo error:', err);
            } finally {
              setDeletingPhoto(null);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const uploadStage = async (index: number): Promise<boolean> => {
    if (!tracking) {
      Alert.alert('Error', 'Tracking not initialized');
      return false;
    }
    
    const files = filesByStage[index] || [];
    if (files.length === 0) {
      Alert.alert('No Files', 'Please select files to upload');
      return false;
    }

    // Create FormData properly
    const formData = new FormData();
    formData.append('stageIndex', String(index));

    // Add files to formData
    for (const uri of files) {
      // Extract filename from URI
      let filename = uri.split('/').pop();
      
      // Ensure the filename has an extension
      if (!filename || !filename.includes('.')) {
        filename = `photo_${Date.now()}.jpg`;
      }
      
      // Get the file extension
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';
      
      // Create file object for FormData
      const file = {
        uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
        type,
        name: filename,
      };

      // Append to formData
      formData.append('files', file as any);
    }

    try {
      setUploadingStage(index);
      
      console.log('Uploading files:', {
        trackingId: tracking._id,
        stageIndex: index,
        fileCount: files.length,
      });

      const res = await api.post(`/tracking/${tracking._id}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
        timeout: 60000,
      });

      console.log('Upload response:', res.data);

      if (res.data?.success) {
        setTracking(res.data.data);
        setFilesByStage((prev) => {
          const updated = { ...prev };
          updated[index] = [];
          return updated;
        });
        Alert.alert('Success', `${files.length} photo(s) uploaded successfully`);
        return true;
      } else {
        Alert.alert('Upload Failed', res.data?.message || 'Unknown error occurred');
        return false;
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      
      let errorMessage = 'Failed to upload files';
      if (err.response) {
        errorMessage = err.response.data?.message || `Server error: ${err.response.status}`;
      } else if (err.request) {
        errorMessage = 'No response from server. Check your internet connection.';
      } else {
        errorMessage = err.message || 'Unknown error occurred';
      }
      
      Alert.alert('Upload Failed', errorMessage);
      return false;
    } finally {
      setUploadingStage(null);
    }
  };

  const handleSubmit = async () => {
    if (!tracking) {
      Alert.alert('Error', 'Tracking not initialized');
      return;
    }

    // Update stage statuses
    for (let idx = 0; idx < dropdownValues.length; idx++) {
      const status = dropdownValues[idx];
      if (status) {
        try {
          await api.put(`/tracking/${tracking._id}/stage`, { 
            stageIndex: idx, 
            status 
          });
        } catch (err) {
          console.error('Failed to update stage status', err);
        }
      }
    }

    // Upload photos for each stage
    const uploadPromises = [];
    for (let idx = 0; idx < 7; idx++) {
      if (filesByStage[idx]?.length) {
        uploadPromises.push(uploadStage(idx));
      }
    }

    if (uploadPromises.length > 0) {
      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter(result => result === true).length;
      if (successfulUploads > 0) {
        Alert.alert('Success', `${successfulUploads} out of ${uploadPromises.length} uploads completed successfully`);
      }
    } else {
      Alert.alert('Success', 'Stage statuses updated successfully');
    }
    
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

  // FIXED CameraModal Component
  const CameraModal = () => (
    <Modal
      visible={cameraVisible}
      animationType="slide"
      onRequestClose={closeCamera}
      statusBarTranslucent
    >
      <View style={styles.cameraContainer}>
        {permission?.granted ? (
          <>
            {ResolvedCamera ? (
              <ResolvedCamera
                ref={(ref: any) => { cameraRef.current = ref; }}
                style={styles.camera}
                type={facing}
                onCameraReady={() => {
                  console.log('Camera ready');
                  setCameraReady(true);
                }}
                onMountError={(error: any) => {
                  console.error('Camera mount error:', error);
                  Alert.alert('Camera Error', 'Failed to start camera. Please try again.');
                  closeCamera();
                }}
              >
                <View style={styles.cameraOverlay}>
                  {/* Top Controls */}
                  <View style={styles.topControls}>
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={closeCamera}
                    >
                      <X size={28} color="white" />
                    </TouchableOpacity>
                    
                    <View style={styles.stageIndicator}>
                      <Text style={styles.stageIndicatorText}>
                        Stage {currentStageForCamera !== null ? currentStageForCamera + 1 : ''}
                      </Text>
                    </View>
                  </View>

                  {/* Bottom Controls */}
                  <View style={styles.bottomControls}>
                    <TouchableOpacity
                      style={styles.flipButton}
                      onPress={toggleCameraFacing}
                      disabled={capturingPhoto || !cameraReady}
                    >
                      <FlipHorizontal size={28} color="white" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[
                        styles.captureButton, 
                        (!cameraReady || capturingPhoto) && styles.captureButtonDisabled
                      ]}
                      onPress={takePicture}
                      disabled={capturingPhoto || !cameraReady}
                      activeOpacity={0.7}
                    >
                      {capturingPhoto ? (
                        <ActivityIndicator size="large" color="white" />
                      ) : (
                        <View style={styles.captureButtonInner} />
                      )}
                    </TouchableOpacity>
                    
                    <View style={styles.spacer} />
                  </View>
                </View>
              </ResolvedCamera>
            ) : (
              <View style={styles.alternativeCamera}>
                <Text style={styles.alternativeCameraText}>Camera not available on this device.</Text>
                <TouchableOpacity
                  style={[styles.permissionButton, { marginTop: 10 }]}
                  onPress={async () => {
                    try {
                      const { status } = await ImagePicker.requestCameraPermissionsAsync();
                      if (status === 'granted') {
                        const result = await ImagePicker.launchCameraAsync({
                          mediaTypes: (ImagePicker as any).MediaType?.Images ?? (ImagePicker as any).MediaTypeOptions?.Images ?? 'Images',
                          allowsEditing: false,
                          quality: 0.8,
                        });

                        if (!result.canceled && result.assets && result.assets.length > 0) {
                          const uri = result.assets[0].uri;
                          const compressed = await ImageManipulator.manipulateAsync(
                            uri,
                            [{ resize: { width: 1200 } }],
                            { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
                          );

                          if (currentStageForCamera !== null) {
                            setFilesByStage((prev) => ({
                              ...prev,
                              [currentStageForCamera]: [...(prev[currentStageForCamera] || []), compressed.uri],
                            }));

                            setCameraVisible(false);
                            setCurrentStageForCamera(null);
                            setCameraReady(false);

                            Alert.alert('Success', 'Photo captured successfully!');
                          }
                        }
                      } else {
                        Alert.alert('Permission Required', 'Camera permission is required to take photos');
                      }
                    } catch (err) {
                      console.error('Fallback camera failed:', err);
                      Alert.alert('Error', 'Failed to open camera fallback');
                    }
                  }}
                >
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>Open Camera</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.permissionButton, styles.cancelButton, { marginTop: 10 }]}
                  onPress={closeCamera}
                >
                  <Text style={styles.permissionButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            )}
            
            {/* Loading overlay while camera initializes */}
            {!cameraReady && (
              <View style={styles.cameraLoading}>
                <ActivityIndicator size="large" color="white" />
                <Text style={styles.cameraLoadingText}>Initializing Camera...</Text>
              </View>
            )}
          </>
        ) : (
          <View style={styles.permissionContainer}>
            <Text style={styles.permissionText}>
              Camera permission is required to take photos
            </Text>
            <TouchableOpacity
              style={styles.permissionButton}
              onPress={requestPermission}
            >
              <Text style={styles.permissionButtonText}>Grant Permission</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.permissionButton, styles.cancelButton]}
              onPress={closeCamera}
            >
              <Text style={styles.permissionButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Camera Modal */}
      <CameraModal />

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

      {loadingInit ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3498db" />
          <Text className="mt-4 text-gray-600">Loading tracking data...</Text>
        </View>
      ) : (
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
                            <View key={i} className="mr-2 relative">
                              <Image
                                source={{
                                  uri: photo.startsWith('http') ? photo : `${API_BASE_URL}/${photo.replace(/^\//, '')}`,
                                }}
                                className="w-20 h-20 rounded-lg"
                                resizeMode="cover"
                              />
                              <TouchableOpacity
                                onPress={() => deleteExistingPhoto(idx, i, photo)}
                                disabled={deletingPhoto?.stageIndex === idx && deletingPhoto?.photoIndex === i}
                                className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center"
                              >
                                {deletingPhoto?.stageIndex === idx && deletingPhoto?.photoIndex === i ? (
                                  <ActivityIndicator size="small" color="white" />
                                ) : (
                                  <Trash2 size={12} color="white" />
                                )}
                              </TouchableOpacity>
                            </View>
                          ))}
                        </ScrollView>
                      </View>
                    )}

                    {/* Upload Area - Now with Camera Option */}
                    <View className="mb-4">
                      <Text className="text-sm text-gray-700 mb-2 font-semibold">Add New Photos</Text>
                      <TouchableOpacity
                        onPress={() => pickImages(idx)}
                        disabled={uploadingStage === idx}
                        className={`border-2 border-dashed border-emerald-500 rounded-xl p-6 items-center justify-center ${
                          uploadingStage === idx ? 'bg-gray-100' : 'bg-white'
                        }`}
                      >
                        <CameraIcon size={32} color="#10B981" />
                        <Text className="text-gray-900 mt-2 font-medium">Take or Select Photos</Text>
                        <Text className="text-gray-600 text-xs mt-1">Tap to open camera or choose from gallery</Text>
                        <Text className="text-blue-600 text-xs mt-1 font-medium">
                          📸 Live camera available
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* Selected Files Preview */}
                    {selectedFiles.length > 0 && (
                      <View className="mb-4">
                        <Text className="text-sm text-gray-700 mb-2 font-semibold">
                          Selected Photos ({selectedFiles.length})
                        </Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                          {selectedFiles.map((uri, i) => (
                            <View key={i} className="mr-2 relative">
                              <Image 
                                source={{ uri }} 
                                className="w-20 h-20 rounded-lg"
                                resizeMode="cover"
                              />
                              <TouchableOpacity
                                onPress={() => {
                                  setFilesByStage((prev) => ({
                                    ...prev,
                                    [idx]: prev[idx].filter((_, index) => index !== i),
                                  }));
                                }}
                                className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center"
                                disabled={uploadingStage === idx}
                              >
                                <X size={12} color="white" />
                              </TouchableOpacity>
                            </View>
                          ))}
                        </ScrollView>
                      </View>
                    )}

                    {/* Upload Button */}
                    {selectedFiles.length > 0 && (
                      <TouchableOpacity
                        onPress={() => uploadStage(idx)}
                        disabled={uploadingStage === idx}
                        className={`py-3 rounded-lg items-center mb-4 ${
                          uploadingStage === idx
                            ? 'bg-gray-400'
                            : 'bg-emerald-500'
                        }`}
                      >
                        {uploadingStage === idx ? (
                          <View className="flex-row items-center">
                            <ActivityIndicator color="white" size="small" />
                            <Text className="text-white font-bold ml-2">Uploading...</Text>
                          </View>
                        ) : (
                          <Text className="text-white font-bold">
                            Upload {selectedFiles.length} Photo{selectedFiles.length !== 1 ? 's' : ''}
                          </Text>
                        )}
                      </TouchableOpacity>
                    )}

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
            disabled={loadingInit}
            className={`py-4 rounded-xl items-center justify-center mt-4 mb-8 ${
              loadingInit ? 'bg-gray-400' : 'bg-blue-500'
            }`}
          >
            <Text className="text-white text-lg font-bold">
              {loadingInit ? 'Loading...' : 'Submit All Updates'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  alternativeCamera: {
    flex: 1,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alternativeCameraText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 30,
  },
  cameraLoading: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraLoadingText: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
  },
  cameraOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  topControls: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  closeButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  stageIndicator: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  stageIndicatorText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bottomControls: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: Platform.OS === 'ios' ? 40 : 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flipButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 25,
    padding: 12,
    marginBottom: 20,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  captureButtonDisabled: {
    opacity: 0.5,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  captureButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'white',
  },
  spacer: {
    width: 50,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    padding: 20,
  },
  permissionText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 10,
    width: '80%',
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
  },
  modeIndicator: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 30,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  modeIndicatorText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default StageUpload;