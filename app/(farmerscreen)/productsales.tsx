// import AsyncStorage from "@react-native-async-storage/async-storage";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import axios from "axios";
// import * as FileSystem from 'expo-file-system';
// import * as ImageManipulator from "expo-image-manipulator";
// import * as ImagePicker from "expo-image-picker";
// import * as Location from "expo-location";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import { ChevronDown, ChevronLeft, X } from 'lucide-react-native';
// import React, { useCallback, useEffect, useMemo, useState } from "react";
// import {
//   ActivityIndicator,
//   FlatList,
//   Image,
//   Modal,
//   ScrollView,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View
// } from "react-native";
// import CustomAlert from '../../components/CustomAlert';



// const compressVideo = async (uri: string) => {
//   try {
//     // Using the new File API instead of legacy getInfoAsync
//     const file = new File(uri);
//     const fileInfo = await file.size;
    
//     const fileSizeInMB = fileInfo / (1024 * 1024);
    
//     console.log(`Original video size: ${fileSizeInMB.toFixed(2)} MB`);
    
//     // Videos captured with quality: 0.1 should already be compressed
//     // If still too large, we'll return the URI with a warning
//     if (fileSizeInMB > 10) {
//       console.warn('Video is larger than 10MB, may cause upload issues');
//     }
    
//     return {
//       uri,
//       size: fileInfo
//     };
//   } catch (error) {
//     console.error("Error compressing video:", error);
//     // Fallback: return without size info
//     return { uri, size: 0 };
//   }
// };
// const compressImage = async (uri, quality = 0.1) => {
//   try {
//     const manipulations = [{ resize: { width: 500 } }]; // Reduced from 600 to 500
    
//     const manipResult = await ImageManipulator.manipulateAsync(
//       uri,
//       manipulations,
//       { 
//         compress: quality,
//         format: ImageManipulator.SaveFormat.JPEG 
//       }
//     );
    
//     return manipResult;
//   } catch (error) {
//     console.error("Error compressing image:", error);
//     return { uri };
//   }
// };

// // Add watermark to image
// const addWatermarkToImage = async (uri: string) => {
//   try {
//     const now = new Date();
//     const dateStr = now.toLocaleDateString('en-IN', { 
//       day: '2-digit', 
//       month: '2-digit', 
//       year: 'numeric' 
//     });
//     const timeStr = now.toLocaleTimeString('en-IN', { 
//       hour: '2-digit', 
//       minute: '2-digit',
//       second: '2-digit',
//       hour12: true 
//     });
//     const watermarkText = `${dateStr} | ${timeStr}`;
    
//     // First compress the image
//     const compressed = await ImageManipulator.manipulateAsync(
//       uri,
//       [{ resize: { width: 1024 } }],
//       { 
//         compress: 0.7, 
//         format: ImageManipulator.SaveFormat.JPEG 
//       }
//     );
    
//     // Create a semi-transparent overlay at the bottom
//     // This will show timestamp location
//     const watermarked = await ImageManipulator.manipulateAsync(
//       compressed.uri,
//       [
//         {
//           // Add a flip operation (this is a workaround to trigger re-render)
//           // In practice, you'd need react-native-canvas or similar for text
//           rotate: 0
//         }
//       ],
//       { 
//         compress: 0.3, 
//         format: ImageManipulator.SaveFormat.JPEG 
//       }
//     );
    
//     // Return watermarked image with metadata
//     return {
//       ...watermarked,
//       watermarkText, // Store for potential use
//       timestamp: now.toISOString()
//     };
//   } catch (error) {
//     console.error("Error adding watermark:", error);
//     return { uri };
//   }
// };

// // Custom Picker component
// const CustomPicker = ({ label, value, options, onValueChange, placeholder }) => {
//   const [modalVisible, setModalVisible] = useState(false);

//   return (
//     <View className="mb-5">
//       <Text className="text-base font-medium text-gray-900 mb-2">{label}</Text>
//       <TouchableOpacity
//         className="bg-white border-2 border-gray-300 rounded-xl p-4 shadow-sm flex-row justify-between items-center"
//         onPress={() => setModalVisible(true)}
//       >
//         <Text className={`text-base flex-1 ${value ? 'text-gray-900' : 'text-gray-500'}`}>
//           {value ? options.find(o => o.value === value)?.label : placeholder}
//         </Text>
//         <ChevronDown size={20} color="#6b7280" />
//       </TouchableOpacity>

//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View className="flex-1 justify-end bg-black/50">
//           <View className="bg-white rounded-t-3xl h-[50%] p-5 shadow-2xl">
//             <View className="flex-row justify-between items-center mb-4 border-b border-gray-200 pb-3">
//               <Text className="text-xl font-medium text-gray-900">{label}</Text>
//               <TouchableOpacity onPress={() => setModalVisible(false)} className="p-2">
//                  <X size={24} color="#374151" />
//               </TouchableOpacity>
//             </View>
            
//             <FlatList
//               data={options}
//               keyExtractor={(item) => item.value.toString()}
//               showsVerticalScrollIndicator={false}
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   className={`p-4 border-b border-gray-100 flex-row justify-between items-center active:bg-gray-50 ${item.value === value ? 'bg-green-50' : ''}`}
//                   onPress={() => {
//                     onValueChange(item.value);
//                     setModalVisible(false);
//                   }}
//                 >
//                   <Text className={`text-lg ${item.value === value ? 'text-green-700 font-medium' : 'text-gray-700'}`}>
//                     {item.label}
//                   </Text>
//                   {item.value === value && (
//                     <View className="w-3 h-3 rounded-full bg-green-600" />
//                   )}
//                 </TouchableOpacity>
//               )}
//             />
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const SellProductForm: React.FC = () => {
//   const router = useRouter();
//   const params = useLocalSearchParams();
//   const categoryId = params.categoryId as string;
//   const subCategoryId = params.subCategoryId as string;

//   const [step, setStep] = useState(2);
//   const [isSubmitting, setIsSubmitting] = useState(false);
  
//   // State declarations
//   const [categories, setCategories] = useState([]);
//   const [subCategories, setSubCategories] = useState([]);
//   const [cropBriefDetails, setCropBriefDetails] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState(categoryId || "");
//   const [selectedSubCategory, setSelectedSubCategory] = useState(subCategoryId || "");
//   const [globalQuantityType, setGlobalQuantityType] = useState("");
//   const [globalPriceType, setGlobalPriceType] = useState("");
//   const [isGradingEnabled, setIsGradingEnabled] = useState(true);
//   const [farmingType, setFarmingType] = useState("");
//   const [typeOfSeeds, setTypeOfSeeds] = useState("");
//   const [packagingType, setPackagingType] = useState("");
//   const [packageMeasurement, setPackageMeasurement] = useState("");
//   const [unitMeasurement, setUnitMeasurement] = useState("");
//   const [packagingOptions, setPackagingOptions] = useState([]);
//   const [selectedPackaging, setSelectedPackaging] = useState(null);
  
//   const [markets, setMarkets] = useState([]);
//   const [filteredMarkets, setFilteredMarkets] = useState([]);
//   const [marketSearch, setMarketSearch] = useState("");
//   const [nearestMarket, setNearestMarket] = useState("");
  
//   const [gradePrices, setGradePrices] = useState([
//     { grade: "A Grade", pricePerUnit: "", totalQty: "", photos: [] },
//     { grade: "B Grade", pricePerUnit: "", totalQty: "", photos: [] },
//    // { grade: "All Mixed Grades", pricePerUnit: "", totalQty: "", photos: [] },
//   ]);
//   const [gradeCounter, setGradeCounter] = useState(2);
//   const [selectedGrades, setSelectedGrades] = useState([]);
  
//   const [deliveryDate, setDeliveryDate] = useState(new Date());
//   const [deliveryTime, setDeliveryTime] = useState(new Date());
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [showTimePicker, setShowTimePicker] = useState(false);
  
//   const [cropPhotos, setCropPhotos] = useState([]);
//   const [farmLocation, setFarmLocation] = useState({
//     latitude: 12.9716,
//     longitude: 77.5946,
//   });
//   const [showLocationPicker, setShowLocationPicker] = useState(false);
//   const [isGettingLocation, setIsGettingLocation] = useState(false);

//   const [showAlert, setShowAlert] = useState(false);
//   const [alertTitle, setAlertTitle] = useState("");
//   const [alertMessage, setAlertMessage] = useState("");
//   const [alertAction, setAlertAction] = useState<null | (() => void)>(null);
  
//   const showAppAlert = (title: string, message: string, action?: () => void) => {
//     setAlertTitle(title);
//     setAlertMessage(message);
//     setAlertAction(() => action || null);
//     setShowAlert(true);
//   };
// useEffect(() => {
//   if (isGradingEnabled) {
//     // Switch to grading mode
//     setGradePrices([
//       { grade: "A Grade", pricePerUnit: "", totalQty: "", photos: [] },
//       { grade: "B Grade", pricePerUnit: "", totalQty: "", photos: [] },
//     ]);
//     setSelectedGrades([]);
//     setGradeCounter(2);
//   } else {
//     // Switch to non-grading mode
//     setGradePrices([
//       { grade: "All Mixed Grades", pricePerUnit: "", totalQty: "", photos: [] },
//     ]);
//     setSelectedGrades(["All Mixed Grades"]);
//   }
// }, [isGradingEnabled]);
//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       setCropPhotos([]);
//       setGradePrices(prev => prev.map(gp => ({ ...gp, photos: [] })));
//     };
//   }, []);

//   useEffect(() => {
//     const fetchSubCategoryName = async () => {
//       if (subCategoryId) {
//         try {
//           const res = await axios.get(
//             `https://kisan.etpl.ai/subcategory/category/${categoryId}`
//           );
//           const subCategory = res.data.data.find(
//             (sub: any) => sub._id === subCategoryId
//           );
//           if (subCategory) {
//             setCropBriefDetails(subCategory.subCategoryName);
//           }
//         } catch (error) {
//           console.error("Error fetching subcategory name:", error);
//         }
//       }
//     };

//     fetchSubCategoryName();
//   }, [categoryId, subCategoryId]);

//   // Memoize options
//   const farmingTypeOptions = useMemo(() => [
//     // { label: "Select Farming Type", value: "" },
//   //  { label: "Drop Down 1", value: "drop down 1" },
//     { label: "Regular", value: "regular" },
//     { label: "Organic", value: "organic" },
//   ], []);

//   const priceTypeOptions = useMemo(() => [
//     // { label: "Select Type", value: "" },
//     { label: "Fixed", value: "fixed" },
//     { label: "Negotiable", value: "negotiable" },
//   ], []);

//   const quantityTypeOptions = useMemo(() => [
//     // { label: "Select Type", value: "" },
//     { label: "Bulk", value: "bulk" },
//     { label: "Split", value: "split" },
//   ], []);

//   // Data fetching
//   useEffect(() => {
//     fetchCategories();
//     requestLocationPermission();
//     fetchPackaging();
//     fetchMarkets();
//   }, []);

//   const fetchCategories = async () => {
//     try {
//       const res = await axios.get("https://kisan.etpl.ai/category/all");
//       setCategories(res.data.data || []);
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//       showAppAlert("Error", "Failed to load categories");
//     }
//   };

//   const fetchPackaging = async () => {
//     try {
//       const res = await axios.get("https://kisan.etpl.ai/api/packaging/all");
//       setPackagingOptions(res.data || []);
//     } catch (error) {
//       console.error("Error fetching packaging:", error);
//     }
//   };

//   const fetchMarkets = async () => {
//     try {
//       const farmerId = await AsyncStorage.getItem('farmerId');
//       if (!farmerId) {
//         console.error("Farmer ID not found");
//         return;
//       }

//       const farmerRes = await axios.get(`https://kisan.etpl.ai/farmer/register/all`);
//       const farmerData = farmerRes.data.data || farmerRes.data || [];
      
//       const currentFarmer = farmerData.find((f: any) => f.farmerId === farmerId);
      
//       if (!currentFarmer || !currentFarmer.nearestMarkets || currentFarmer.nearestMarkets.length === 0) {
//         console.log("No nearest markets found for farmer");
//         setMarkets([]);
//         setFilteredMarkets([]);
//         return;
//       }

//       const marketsRes = await axios.get("https://kisan.etpl.ai/api/market/all");
//       const allMarkets = marketsRes.data.data || marketsRes.data || [];
      
//       const farmerMarkets = allMarkets.filter((market: any) => 
//         currentFarmer.nearestMarkets.some((nm: any) => 
//           nm._id === market._id || nm === market._id
//         )
//       );
      
//       setMarkets(farmerMarkets);
//       setFilteredMarkets(farmerMarkets);
//     } catch (error) {
//       console.error("Error fetching markets:", error);
//     }
//   };

//   const requestLocationPermission = async () => {
//     try {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status === "granted") {
//         const location = await Location.getCurrentPositionAsync({});
//         setFarmLocation({
//           latitude: location.coords.latitude,
//           longitude: location.coords.longitude,
//         });
//       }
//     } catch (error) {
//       console.error("Error getting location:", error);
//     }
//   };

//   const handleMarketSearch = useCallback((searchValue: string) => {
//     setMarketSearch(searchValue);
    
//     if (!searchValue.trim()) {
//       setFilteredMarkets(markets);
//       return;
//     }
    
//     const filtered = markets.filter(market => 
//       market.marketName?.toLowerCase().includes(searchValue.toLowerCase()) ||
//       market.pincode?.includes(searchValue) ||
//       market.district?.toLowerCase().includes(searchValue.toLowerCase())
//     );
    
//     setFilteredMarkets(filtered);
//   }, [markets]);
// // Add this function near other permission functions
// const requestCameraPermission = async () => {
//   try {
//     const { status } = await ImagePicker.requestCameraPermissionsAsync();
//     if (status !== "granted") {
//       showAppAlert("Permission Denied", "Camera permission is required");
//       return false;
//     }
//     return true;
//   } catch (error) {
//     console.error("Error requesting camera permission:", error);
//     return false;
//   }
// };
//   const handlePhotoUpload = async () => {
//     try {
//       if (cropPhotos.length >= 3) {
//         showAppAlert("Limit Reached", "Maximum 3 photos allowed");
//         return;
//       }

//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsMultipleSelection: true,
//         quality: 0.5,
//         allowsEditing: false,
//       });

//       if (!result.canceled && result.assets) {
//         const remainingSlots = 3 - cropPhotos.length;
//         const selectedPhotos = result.assets.slice(0, remainingSlots);
        
//         // Compress images
//         const compressedPhotos = await Promise.all(
//           selectedPhotos.map(async (photo) => {
//             const compressed = await compressImage(photo.uri, 0.3);
//             return { ...photo, uri: compressed.uri };
//           })
//         );
        
//         setCropPhotos(prev => [...prev, ...compressedPhotos]);
        
//         if (selectedPhotos.length < result.assets.length) {
//           showAppAlert("Info", `Only ${selectedPhotos.length} photo(s) added (3 photo limit)`);
//         }
//       }
//     } catch (error) {
//       console.error("Error uploading photos:", error);
//       showAppAlert("Error", "Failed to upload photos");
//     }
//   };
// // Add timestamp metadata to captured images
// const addTimestampMetadata = async (uri) => {
//   try {
//     const now = new Date();
//     const dateStr = now.toLocaleDateString('en-IN', { 
//       day: '2-digit', 
//       month: '2-digit', 
//       year: 'numeric' 
//     });
//     const timeStr = now.toLocaleTimeString('en-IN', { 
//       hour: '2-digit', 
//       minute: '2-digit',
//       second: '2-digit',
//       hour12: true 
//     });
    
//     // Even more aggressive compression
//     const compressed = await ImageManipulator.manipulateAsync(
//       uri,
//       [{ resize: { width: 500 } }], // Reduced from 800
//       { 
//         compress: 0.1, // Very aggressive
//         format: ImageManipulator.SaveFormat.JPEG 
//       }
//     );
    
//     return {
//       uri: compressed.uri,
//       timestamp: `${dateStr} ${timeStr}`,
//       capturedAt: now.toISOString()
//     };
//   } catch (error) {
//     console.error("Error processing image:", error);
//     return { uri, timestamp: '', capturedAt: '' };
//   }
// };


// const handleGradePhotoUpload = async (index, useCamera = false, mediaType = 'photo') => {
//   try {
//     const currentPhotos = gradePrices[index].photos.length;
//     if (currentPhotos >= 5) {
//       showAppAlert("Limit Reached", "Maximum 5 media items per grade");
//       return;
//     }

//     let result;

//     if (useCamera) {
//       const hasPermission = await requestCameraPermission();
//       if (!hasPermission) return;

//       if (mediaType === 'video') {
//         // Launch camera for video with AGGRESSIVE compression
//         result = await ImagePicker.launchCameraAsync({
//           mediaTypes: ImagePicker.MediaTypeOptions.Videos,
//           quality: 0, // LOWEST quality
//           videoMaxDuration: 8, // Reduced to 8 seconds
//           allowsEditing: false,
//           videoQuality: 0,
//         });
//       } else {
//         result = await ImagePicker.launchCameraAsync({
//           mediaTypes: ImagePicker.MediaTypeOptions.Images,
//           quality: 0.1,
//           allowsEditing: false,
//           exif: true,
//         });
//       }
//     } else {
//       result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsMultipleSelection: true,
//         quality: 0.2,
//         allowsEditing: false,
//         exif: true,
//       });
//     }

//     if (!result.canceled && result.assets) {
//       const remainingSlots = 5 - currentPhotos;
//       const selectedMedia = result.assets.slice(0, remainingSlots);
      
//       // Process media with compression
//       const processedMedia = await Promise.all(
//         selectedMedia.map(async (media) => {
//           if (media.type === 'image') {
//             // Super aggressive image compression
//             const compressed = await compressImage(media.uri, 0.1);
//             if (useCamera) {
//               const withTimestamp = await addTimestampMetadata(compressed.uri);
//               return { ...withTimestamp, type: 'image' };
//             }
//             return { ...media, uri: compressed.uri, type: 'image' };
//           } else if (media.type === 'video') {
//             // NEW FILE API - Check video file size
//             try {
//               const file = new FileSystem.File(media.uri);
//               const fileSize = await file.size; // Returns size in bytes
//               const fileSizeInMB = fileSize / (1024 * 1024);
              
//               console.log(`Video size: ${fileSizeInMB.toFixed(2)} MB`);
              
//               // STRICT: Reject videos over 5MB
//               if (fileSizeInMB > 50) {
//                 showAppAlert(
//                   "Video Too Large", 
//                   `Video is ${fileSizeInMB.toFixed(1)}MB. Maximum 50MB allowed. Please record a shorter video.`
//                 );
//                 return null;
//               }

//               // Check duration
//               const duration = media.duration || 0;
//               // if (duration > 8) {
//               //   showAppAlert(
//               //     "Video Too Long", 
//               //     "Please record videos under 8 seconds"
//               //   );
//               //   return null;
//               // }

//               return {
//                 uri: media.uri,
//                 type: 'video',
//                 duration: duration,
//                 fileSize: fileSizeInMB,
//                 capturedAt: new Date().toISOString()
//               };
//             } catch (error) {
//               console.error("Error checking video file:", error);
//               // If we can't check size, still allow but warn
//               const duration = media.duration || 0;
//               if (duration > 8) {
//                 showAppAlert("Warning", "Video may be too large");
//                 return null;
//               }
//               return {
//                 uri: media.uri,
//                 type: 'video',
//                 duration: duration,
//                 capturedAt: new Date().toISOString()
//               };
//             }
//           }
//           return media;
//         })
//       );
      
//       // Filter out null entries
//       const validMedia = processedMedia.filter(m => m !== null);
      
//       if (validMedia.length === 0) {
//         return;
//       }

//       setGradePrices(prev => {
//         const updated = [...prev];
//         updated[index] = {
//           ...updated[index],
//           photos: [...updated[index].photos, ...validMedia],
//         };
//         return updated;
//       });

//       if (validMedia.length > 0 && validMedia.length < selectedMedia.length) {
//         showAppAlert("Info", `${validMedia.length} media added (some were too large)`);
//       }
//     }
//   } catch (error) {
//     console.error("Error capturing/uploading media:", error);
//     showAppAlert("Error", "Failed to capture/upload media");
//   }
// };


//   const handleGradePriceChange = useCallback((index: number, field: string, value: string) => {
//     if ((field === "pricePerUnit" || field === "totalQty") && parseFloat(value) < 0) {
//       return;
//     }
//     setGradePrices(prev => {
//       const updated = [...prev];
//       updated[index] = { ...updated[index], [field]: value };
//       return updated;
//     });
//   }, []);

//   const getCurrentLocation = async () => {
//     setIsGettingLocation(true);
//     try {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         showAppAlert("Permission Denied", "Location permission is required");
//         return;
//       }

//       const location = await Location.getCurrentPositionAsync({
//         accuracy: Location.Accuracy.Balanced,
//       });

//       setFarmLocation({
//         latitude: location.coords.latitude,
//         longitude: location.coords.longitude,
//       });

//       showAppAlert("Success", "Current location captured!");
//     } catch (error) {
//       console.error("Error getting location:", error);
//       showAppAlert("Error", "Failed to get current location");
//     } finally {
//       setIsGettingLocation(false);
//     }
//   };

//   const formatDate = (date: Date) => {
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const day = String(date.getDate()).padStart(2, "0");
//     return `${year}-${month}-${day}`;
//   };

//   const formatTime = (date: Date) => {
//     const hours = String(date.getHours()).padStart(2, "0");
//     const minutes = String(date.getMinutes()).padStart(2, "0");
//     return `${hours}:${minutes}`;
//   };

//   const handleAddGrade = () => {
//     const nextGrade = String.fromCharCode(65 + gradeCounter);
//     const newGrade: GradePrice = {
//       grade: `${nextGrade} Grade`,
//       pricePerUnit: "",
//       totalQty: "",
//       photos: [],
//     };
//     setGradePrices([...gradePrices, newGrade]);
//   setGradeCounter(gradeCounter + 1);
//   };
//   const handleSubmit = async () => {
//     if (isSubmitting) return;
    
//     if (!selectedCategory || !selectedSubCategory) {
//       showAppAlert("Missing Information", "Please fill in all required fields");
//       return;
//     }

//     const farmerId = await AsyncStorage.getItem('farmerId');
//     if (!farmerId) {
//       showAppAlert("Error", "You are not logged in. Please login again.");
//       return;
//     }

//     const selectedGradeObjects = gradePrices.filter((gp) => 
//       selectedGrades.includes(gp.grade)
//     );

//     for (const gp of selectedGradeObjects) {
//       if (!gp.pricePerUnit || !gp.totalQty) {
//         showAppAlert(
//           "Incomplete Grade Information", 
//           `Please fill Price and Quantity for ${gp.grade}`
//         );
//         return;
//       }
//     }

//     setIsSubmitting(true);

//     try {
//       const getMimeType = (uri: string) => {
//         const extension = uri.split('.').pop()?.toLowerCase();
//         if (extension === 'png') return 'image/png';
//         if (extension === 'jpg' || extension === 'jpeg') return 'image/jpeg';
//         return 'image/jpeg';
//       };

//       const formData = new FormData();
//       formData.append("farmerId", farmerId);
//       formData.append("categoryId", selectedCategory);
//       formData.append("subCategoryId", selectedSubCategory);
//       formData.append("cropBriefDetails", cropBriefDetails);
//       formData.append("farmingType", farmingType);
//       formData.append("typeOfSeeds", typeOfSeeds);
//       formData.append("packagingType", packagingType);
//       formData.append("packageMeasurement", packageMeasurement);
//       formData.append("unitMeasurement", unitMeasurement);
//       formData.append("deliveryDate", formatDate(deliveryDate));
//       formData.append("deliveryTime", formatTime(deliveryTime));
//       formData.append("nearestMarket", nearestMarket);
      
//       formData.append("farmLocation", JSON.stringify({
//         lat: farmLocation.latitude.toString(),
//         lng: farmLocation.longitude.toString()
//       }));

//       const selectedGradeData = selectedGradeObjects.map((gp) => ({
//         grade: gp.grade,
//         pricePerUnit: gp.pricePerUnit,
//         totalQty: gp.totalQty,
//         quantityType: globalQuantityType,
//         priceType: globalPriceType,
//       }));

//       formData.append("gradePrices", JSON.stringify(selectedGradeData));

//       // Append grade photos
//       for (const gp of gradePrices) {
//         if (selectedGrades.includes(gp.grade)) {
//           for (let index = 0; index < gp.photos.length; index++) {
//             const photo = gp.photos[index];
//             const extension = photo.uri.split('.').pop()?.toLowerCase() || 'jpg';
//             const mimeType = getMimeType(photo.uri);
            
//             formData.append(`gradePhotos_${gp.grade}`, {
//               uri: photo.uri,
//               type: mimeType,
//               name: `grade_${gp.grade}_${Date.now()}_${index}.${extension}`,
//             } as any);
//           }
//         }
//       }

//       // Append crop photos
//       cropPhotos.forEach((photo: any, idx) => {
//         const extension = photo.uri.split('.').pop()?.toLowerCase() || 'jpg';
//         const mimeType = getMimeType(photo.uri);

//         formData.append(`photos`, {
//           uri: photo.uri,
//           type: mimeType,
//           name: `photo_${Date.now()}_${idx}.${extension}`,
//         } as any);
//       });
// // Append grade photos and videos
// for (const gp of gradePrices) {
//   if (selectedGrades.includes(gp.grade)) {
//     for (let index = 0; index < gp.photos.length; index++) {
//       const media = gp.photos[index];
      
//       if (media.type === 'video') {
//         // Handle video
//         formData.append(`gradeVideos_${gp.grade}`, {
//           uri: media.uri,
//           type: 'video/mp4',
//           name: `grade_${gp.grade}_${Date.now()}_${index}.mp4`,
//         } as any);
//       } else {
//         // Handle image
//         const extension = media.uri.split('.').pop()?.toLowerCase() || 'jpg';
//         const mimeType = getMimeType(media.uri);
        
//         formData.append(`gradePhotos_${gp.grade}`, {
//           uri: media.uri,
//           type: mimeType,
//           name: `grade_${gp.grade}_${Date.now()}_${index}.${extension}`,
//         } as any);
//       }
//     }
//   }
// }
//       console.log("Submitting product...");
//       const response = await axios.post(
//         "https://kisan.etpl.ai/product/add",
//         formData,
//         {
//           headers: { 
//             "Content-Type": "multipart/form-data",
//           },
//           timeout: 120000, // 2 minutes
//           maxContentLength: Infinity,
//           maxBodyLength: Infinity,
//         }
//       );

//       console.log("Submit success:", response.data);
//       showAppAlert("Success", "Product added successfully!",() => router.replace("/(farmer)/home"));
//     } catch (error: any) {
//       console.error("Submit error details:", error.response?.data || error.message);
      
//       let errorMessage = "Failed to submit. Please try again.";
      
//       if (error.code === 'ECONNABORTED') {
//         errorMessage = "Upload timed out. Please check your internet connection and try again.";
//       } else if (error.response?.status === 413) {
//         errorMessage = "Images are too large. Please remove some photos and try again.";
//       } else if (error.response?.data?.message) {
//         errorMessage = error.response.data.message;
//       }
      
//       showAppAlert("Error", errorMessage);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const nextStep = () => {
//     if (step < 4) setStep(step + 1);
//   };

//   const prevStep = () => {
//     if (step > 2) setStep(step - 1);
//   };

//   const goBack = () => {
//     if (step > 2) {
//       prevStep();
//     } else {
//       router.back();
//     }
//   };

//   // Render methods with improved UI
//   const renderStep1 = () => (
//     <View>
//       <Text className="text-2xl font-medium text-gray-900 mb-6">Category & Product</Text>
//       <View className="mb-6">
//         <Text className="text-base font-medium text-gray-900 mb-2">Crop Brief Details</Text>
//         <TextInput
//           className="bg-white border-2 border-gray-300 rounded-xl p-4 min-h-[120px] text-base text-gray-900 shadow-sm"
//           placeholder="Enter brief description of your crop..."
//           value={cropBriefDetails}
//           onChangeText={setCropBriefDetails}
//           multiline
//           numberOfLines={4}
//           textAlignVertical="top"
//         />
//       </View>
//       <TouchableOpacity 
//         className="bg-green-600 py-4 rounded-xl shadow-lg active:bg-green-700" 
//         onPress={nextStep}
//       >
//         <Text className="text-white text-center text-lg font-medium">Next Step →</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   const renderStep2 = () => (
//     <View>
//       <Text className="text-2xl font-medium text-gray-900 mb-6">Farming & Packaging Details</Text>
      
//       <CustomPicker
//         label="Farming Type"
//         value={farmingType}
//         options={farmingTypeOptions}
//         onValueChange={setFarmingType}
//         placeholder="Select Farming Type"
//       />

//       <View className="mb-5">
//         <Text className="text-base font-medium text-gray-900 mb-2">Type of Seeds</Text>
//         <TextInput
//           className="bg-white border-2 border-gray-300 rounded-xl p-4 text-base text-gray-900 shadow-sm"
//           placeholder="e.g., Naati, Hybrid"
//           value={typeOfSeeds}
//           onChangeText={setTypeOfSeeds}
//         />
//       </View>

//       <CustomPicker
//         label="Packaging Type"
//         value={packagingType}
//         options={packagingOptions.map(p => ({ label: p.packageType, value: p.packageType }))}
//         onValueChange={(value) => {
//           setPackagingType(value);
//           const selected = packagingOptions.find(p => p.packageType === value);
//           setSelectedPackaging(selected || null);
//         }}
//         placeholder="Select Package Type"
//       />

//       {selectedPackaging?.measurements?.length > 0 && (
//         <CustomPicker
//           label="Measurement"
//           value={packageMeasurement}
//           options={selectedPackaging.measurements.map(m => ({ label: m, value: m }))}
//           onValueChange={setPackageMeasurement}
//           placeholder="Select Measurement"
//         />
//       )}

//       <View className="mb-5">
//         <Text className="text-base font-medium text-gray-900 mb-2">Unit Measurement</Text>
//         <TextInput
//           className="bg-white border-2 border-gray-300 rounded-xl p-4 text-base text-gray-900 shadow-sm"
//           placeholder="e.g., kg per box"
//           value={unitMeasurement}
//           onChangeText={setUnitMeasurement}
//         />
//       </View>

//       <View className="flex-row gap-3 mt-8 mb-[150px]">
//         <TouchableOpacity 
//           className="bg-gray-500 flex-1 py-4 rounded-xl shadow-lg active:bg-gray-600" 
//           onPress={prevStep}
//         >
//           <Text className="text-white text-center text-lg font-medium">← Previous</Text>
//         </TouchableOpacity>
//         <TouchableOpacity 
//           className="bg-green-600 flex-1 py-4 rounded-xl shadow-lg active:bg-green-700" 
//           onPress={nextStep}
//         >
//           <Text className="text-white text-center text-lg font-medium">Next Step →</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

// //   const renderStep3 = () => (
// //     <View>
// //       <Text className="text-2xl font-medium text-gray-900 mb-6">Pricing & Details</Text>
      
// //       <View className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl mb-6 border-2 border-blue-200">
// //         <Text className="text-lg font-medium text-gray-900 mb-4">Global Settings</Text>
        
// //         <CustomPicker
// //           label="Quantity Type"
// //           value={globalQuantityType}
// //           options={quantityTypeOptions}
// //           onValueChange={setGlobalQuantityType}
// //           placeholder="Select Type"
// //         />

// //         <CustomPicker
// //           label="Price Type"
// //           value={globalPriceType}
// //           options={priceTypeOptions}
// //           onValueChange={setGlobalPriceType}
// //           placeholder="Select Type"
// //         />
// //       </View>
// //  <TouchableOpacity className="bg-blue-500 px-4 py-2 rounded-lg w-20 mb-3 flex items-center justify-center" onPress={handleAddGrade} >
// //                   <Text className="text-white font-medium text-base"  >+</Text>
// //                 </TouchableOpacity>
// //       {gradePrices.map((gp, index) => (
// //         <View key={index} className="bg-white border-2 border-gray-300 rounded-xl p-5 mb-4 shadow-sm">
// //           <TouchableOpacity
// //             className="flex-row items-center mb-4"
// //             onPress={() => {
// //               if (selectedGrades.includes(gp.grade)) {
// //                 setSelectedGrades(prev => prev.filter(g => g !== gp.grade));
// //               } else {
// //                 setSelectedGrades(prev => [...prev, gp.grade]);
// //               }
// //             }}
// //           >
// //             <View className={`w-7 h-7 border-2 rounded-lg mr-3 items-center justify-center ${
// //               selectedGrades.includes(gp.grade) 
// //                 ? 'bg-green-600 border-green-600' 
// //                 : 'border-gray-400'
// //             }`}>
// //               {selectedGrades.includes(gp.grade) && (
// //                 <Text className="text-white font-medium text-lg">✓</Text>
// //               )}
// //             </View>
// //             <Text className="text-lg font-medium text-gray-900">{gp.grade}</Text>
// //           </TouchableOpacity>

// //           {selectedGrades.includes(gp.grade) && (
// //             <View>
// //               <View className="flex-row gap-3 mb-4">
// //                 <View className="flex-1">
// //                   <Text className="text-sm font-medium text-gray-700 mb-2">Price / unit (₹)</Text>
// //                   <TextInput
// //                     className="bg-gray-50 border-2 border-gray-300 rounded-xl p-3 text-base text-gray-900"
// //                     placeholder="₹"
// //                     value={gp.pricePerUnit}
// //                     onChangeText={(value) => handleGradePriceChange(index, "pricePerUnit", value)}
// //                     keyboardType="numeric"
// //                   />
// //                 </View>
// //                 <View className="flex-1">
// //                   <Text className="text-sm font-medium text-gray-700 mb-2">Total Qty</Text>
// //                   <TextInput
// //                     className="bg-gray-50 border-2 border-gray-300 rounded-xl p-3 text-base text-gray-900"
// //                     placeholder="Qty"
// //                     value={gp.totalQty}
// //                     onChangeText={(value) => handleGradePriceChange(index, "totalQty", value)}
// //                     keyboardType="numeric"
// //                   />
// //                 </View>
// //               </View>

// // <View className="mb-4">
// //   <Text className="text-sm font-medium text-gray-700 mb-2">Capture Media</Text>
// //   <View className="flex-row gap-2">
// //     <TouchableOpacity
// //       className="bg-blue-600 p-4 rounded-xl items-center flex-1 shadow-md active:bg-blue-700"
// //       onPress={() => handleGradePhotoUpload(index, true, 'photo')}
// //     >
// //       <Text className="text-white text-base font-medium">
// //         📷 Photo
// //       </Text>
// //     </TouchableOpacity>
    
   
// //   </View>
// //   <Text className="text-xs text-gray-500 mt-1 text-center">
// //     ({gp.photos.length}/3 media items)
// //   </Text>
// // </View>
  

// // {gp.photos.length > 0 && (
// //   <View className="flex-row flex-wrap gap-2">
// //     {gp.photos.map((photo, photoIdx) => (
// //       <View key={photoIdx} className="w-[100px] h-[100px] relative">
// //         {photo.type === 'video' ? (
// //           // Video thumbnail
// //           <View className="w-full h-full rounded-xl bg-gray-800 items-center justify-center">
// //             <Text className="text-white text-2xl">▶️</Text>
// //             {photo.duration && (
// //               <Text className="text-white text-xs mt-1">
// //                 {Math.round(photo.duration)}s
// //               </Text>
// //             )}
// //           </View>
// //         ) : (
// //           // Image
// //           <Image source={{ uri: photo.uri }} className="w-full h-full rounded-xl" />
// //         )}
        
// //         {/* Timestamp overlay for images */}
// //         {photo.timestamp && photo.type !== 'video' && (
// //           <View className="absolute bottom-0 left-0 right-0 bg-black/70 px-1 py-0.5">
// //             <Text className="text-white text-[8px] font-medium text-center">
// //               {photo.timestamp}
// //             </Text>
// //           </View>
// //         )}
        
// //         <TouchableOpacity
// //           className="absolute top-1 right-1 bg-red-500 w-7 h-7 rounded-full items-center justify-center shadow-lg"
// //           onPress={() => {
// //             setGradePrices(prev => {
// //               const updated = [...prev];
// //               updated[index].photos = updated[index].photos.filter((_, idx) => idx !== photoIdx);
// //               return updated;
// //             });
// //           }}
// //         >
// //           <Text className="text-white font-medium text-lg">×</Text>
// //         </TouchableOpacity>
// //       </View>
// //     ))}
// //   </View>
// // )}
// //             </View>
// //           )}
// //         </View>
// //       ))}

// //       <View className="flex-row gap-3 mt-8 mb-[150px]">
// //         <TouchableOpacity 
// //           className="bg-gray-500 flex-1 py-4 rounded-xl shadow-lg active:bg-gray-600" 
// //           onPress={prevStep}
// //         >
// //           <Text className="text-white text-center text-lg font-medium">← Previous</Text>
// //         </TouchableOpacity>
// //         <TouchableOpacity 
// //           className="bg-green-600 flex-1 py-4 rounded-xl shadow-lg active:bg-green-700" 
// //           onPress={nextStep}
// //         >
// //           <Text className="text-white text-center text-lg font-medium">Next Step →</Text>
// //         </TouchableOpacity>
// //       </View>
// //     </View>
// //   );

// const renderStep3 = () => (
//   <View>
//     <Text className="text-2xl font-medium text-gray-900 mb-6">Pricing & Details</Text>
    
//     <View className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl mb-6 border-2 border-blue-200">
//       <Text className="text-lg font-medium text-gray-900 mb-4">Global Settings</Text>
      
//       <CustomPicker
//         label="Quantity Type"
//         value={globalQuantityType}
//         options={quantityTypeOptions}
//         onValueChange={setGlobalQuantityType}
//         placeholder="Select Type"
//       />

//       <CustomPicker
//         label="Price Type"
//         value={globalPriceType}
//         options={priceTypeOptions}
//         onValueChange={setGlobalPriceType}
//         placeholder="Select Type"
//       />

//       {/* Grading Toggle */}
//       {/* <View className="mb-4">
//         <Text className="text-base font-medium text-gray-900 mb-3">Product Grading</Text>
//         <View className="flex-row items-center bg-white rounded-xl p-4 shadow-sm border-2 border-gray-300">
//           <Text className="flex-1 text-base text-gray-700">
//             {isGradingEnabled ? "Grading Enabled" : "Non-Grading (Mixed)"}
//           </Text>
//           <TouchableOpacity
//             className={`w-14 h-8 rounded-full p-1 ${isGradingEnabled ? 'bg-green-600' : 'bg-gray-400'}`}
//             onPress={() => setIsGradingEnabled(!isGradingEnabled)}
//           >
//             <View className={`w-6 h-6 rounded-full bg-white shadow-md ${isGradingEnabled ? 'ml-6' : ''}`} />
//           </TouchableOpacity>
//         </View>
//         <Text className="text-xs text-gray-500 mt-2">
//           {isGradingEnabled 
//             ? "Separate pricing for different grades (A, B, C...)" 
//             : "Single pricing for all mixed grades"}
//         </Text>
//       </View> */}
//       {/* Tab-based Toggle */}
// <View className="mb-6">
//   <View className="flex-row border-2 border-gray-300 rounded-xl overflow-hidden">
//    <TouchableOpacity
//   className={`flex-1 py-4 ${
//     isGradingEnabled ? 'bg-blue-500' : 'bg-white'
//   }`}
//   onPress={() => setIsGradingEnabled(true)}
//   activeOpacity={0.7}
// >
//   <Text
//     className={`text-center font-medium text-base ${
//       isGradingEnabled ? 'text-white' : 'text-gray-700'
//     }`}
//   >
//     GRADING
//   </Text>
// </TouchableOpacity>

// <TouchableOpacity
//   className={`flex-1 py-4 ${
//     !isGradingEnabled ? 'bg-blue-500' : 'bg-white'
//   }`}
//   onPress={() => setIsGradingEnabled(false)}
//   activeOpacity={0.7}
// >
//   <Text
//     className={`text-center font-medium text-base ${
//       !isGradingEnabled ? 'text-white' : 'text-gray-700'
//     }`}
//   >
//     NON-GRADING
//   </Text>
// </TouchableOpacity>

//   </View>
// </View>
//     </View>

//     {/* Show Add Grade button only in grading mode */}
//     {isGradingEnabled && (
//       <TouchableOpacity 
//         className="bg-blue-500 px-4 py-2 rounded-lg w-20 mb-3 flex items-center justify-center" 
//         onPress={handleAddGrade}
//       >
//         <Text className="text-white font-medium text-base">+</Text>
//       </TouchableOpacity>
//     )}

//     {gradePrices.map((gp, index) => (
//       <View key={index} className="bg-white border-2 border-gray-300 rounded-xl p-5 mb-4 shadow-sm">
//         <TouchableOpacity
//           className="flex-row items-center mb-4"
//           onPress={() => {
//             if (selectedGrades.includes(gp.grade)) {
//               setSelectedGrades(prev => prev.filter(g => g !== gp.grade));
//             } else {
//               setSelectedGrades(prev => [...prev, gp.grade]);
//             }
//           }}
//           disabled={!isGradingEnabled && gp.grade === "All Mixed Grades"}
//         >
//           <View className={`w-7 h-7 border-2 rounded-lg mr-3 items-center justify-center ${
//             selectedGrades.includes(gp.grade) 
//               ? 'bg-green-600 border-green-600' 
//               : 'border-gray-400'
//           }`}>
//             {selectedGrades.includes(gp.grade) && (
//               <Text className="text-white font-medium text-lg">✓</Text>
//             )}
//           </View>
//           <Text className="text-lg font-medium text-gray-900">{gp.grade}</Text>
//         </TouchableOpacity>

//         {selectedGrades.includes(gp.grade) && (
//           <View>
//             <View className="flex-row gap-3 mb-4">
//               <View className="flex-1">
//                 <Text className="text-sm font-medium text-gray-700 mb-2">Price / unit (₹)</Text>
//                 <TextInput
//                   className="bg-gray-50 border-2 border-gray-300 rounded-xl p-3 text-base text-gray-900"
//                   placeholder="₹"
//                   value={gp.pricePerUnit}
//                   onChangeText={(value) => handleGradePriceChange(index, "pricePerUnit", value)}
//                   keyboardType="numeric"
//                 />
//               </View>
//               <View className="flex-1">
//                 <Text className="text-sm font-medium text-gray-700 mb-2">Total Qty</Text>
//                 <TextInput
//                   className="bg-gray-50 border-2 border-gray-300 rounded-xl p-3 text-base text-gray-900"
//                   placeholder="Qty"
//                   value={gp.totalQty}
//                   onChangeText={(value) => handleGradePriceChange(index, "totalQty", value)}
//                   keyboardType="numeric"
//                 />
//               </View>
//             </View>

//             <View className="mb-4">
//               <Text className="text-sm font-medium text-gray-700 mb-2">Capture Media</Text>
//               <View className="flex-row gap-2">
//                 <TouchableOpacity
//                   className="bg-blue-600 p-4 rounded-xl items-center flex-1 shadow-md active:bg-blue-700"
//                   onPress={() => handleGradePhotoUpload(index, true, 'photo')}
//                 >
//                   <Text className="text-white text-base font-medium">
//                     📷 Photo
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//               <Text className="text-xs text-gray-500 mt-1 text-center">
//                 ({gp.photos.length}/3 media items)
//               </Text>
//             </View>

//             {gp.photos.length > 0 && (
//               <View className="flex-row flex-wrap gap-2">
//                 {gp.photos.map((photo, photoIdx) => (
//                   <View key={photoIdx} className="w-[100px] h-[100px] relative">
//                     {photo.type === 'video' ? (
//                       <View className="w-full h-full rounded-xl bg-gray-800 items-center justify-center">
//                         <Text className="text-white text-2xl">▶️</Text>
//                         {photo.duration && (
//                           <Text className="text-white text-xs mt-1">
//                             {Math.round(photo.duration)}s
//                           </Text>
//                         )}
//                       </View>
//                     ) : (
//                       <Image source={{ uri: photo.uri }} className="w-full h-full rounded-xl" />
//                     )}
                    
//                     {photo.timestamp && photo.type !== 'video' && (
//                       <View className="absolute bottom-0 left-0 right-0 bg-black/70 px-1 py-0.5">
//                         <Text className="text-white text-[8px] font-medium text-center">
//                           {photo.timestamp}
//                         </Text>
//                       </View>
//                     )}
                    
//                     <TouchableOpacity
//                       className="absolute top-1 right-1 bg-red-500 w-7 h-7 rounded-full items-center justify-center shadow-lg"
//                       onPress={() => {
//                         setGradePrices(prev => {
//                           const updated = [...prev];
//                           updated[index].photos = updated[index].photos.filter((_, idx) => idx !== photoIdx);
//                           return updated;
//                         });
//                       }}
//                     >
//                       <Text className="text-white font-medium text-lg">×</Text>
//                     </TouchableOpacity>
//                   </View>
//                 ))}
//               </View>
//             )}
//           </View>
//         )}
//       </View>
//     ))}

//     <View className="flex-row gap-3 mt-8 mb-[150px]">
//       <TouchableOpacity 
//         className="bg-gray-500 flex-1 py-4 rounded-xl shadow-lg active:bg-gray-600" 
//         onPress={prevStep}
//       >
//         <Text className="text-white text-center text-lg font-medium">← Previous</Text>
//       </TouchableOpacity>
//       <TouchableOpacity 
//         className="bg-green-600 flex-1 py-4 rounded-xl shadow-lg active:bg-green-700" 
//         onPress={nextStep}
//       >
//         <Text className="text-white text-center text-lg font-medium">Next Step →</Text>
//       </TouchableOpacity>
//     </View>
//   </View>
// );

//   const renderStep4 = () => (
//     <View>
//       <Text className="text-2xl font-medium text-gray-900 mb-6">Final Details</Text>

//       <View className="mb-6">
//         <Text className="text-base font-medium text-gray-900 mb-3">Farm Location</Text>
//         <TouchableOpacity 
//           className="bg-green-600 py-4 rounded-xl items-center mb-3 shadow-lg active:bg-green-700"
//           onPress={getCurrentLocation}
//           disabled={isGettingLocation}
//         >
//           {isGettingLocation ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <Text className="text-white text-base font-medium">📍 Get Current Location</Text>
//           )}
//         </TouchableOpacity>

//         <View className="bg-gray-50 border-2 border-gray-300 rounded-xl p-4">
//           <Text className="text-sm text-gray-700 mb-1 font-medium">
//             Latitude: {farmLocation.latitude.toFixed(6)}
//           </Text>
//           <Text className="text-sm text-gray-700 font-medium">
//             Longitude: {farmLocation.longitude.toFixed(6)}
//           </Text>
//         </View>
//       </View>

//       <View className="mb-6">
//         <Text className="text-base font-medium text-gray-900 mb-2">Delivery Date</Text>
//         <TouchableOpacity 
//           className="bg-white border-2 border-gray-300 rounded-xl p-4 mb-4 shadow-sm"
//           onPress={() => setShowDatePicker(true)}
//         >
//           <Text className="text-base text-gray-900 font-medium">📅 {formatDate(deliveryDate)}</Text>
//         </TouchableOpacity>
//         {showDatePicker && (
//           <DateTimePicker 
//             value={deliveryDate} 
//             mode="date" 
//             display="default" 
//             onChange={(event, date) => {
//               setShowDatePicker(false);
//               if (date) setDeliveryDate(date);
//             }}
//             minimumDate={new Date()} 
//           />
//         )}
        
//         <Text className="text-base font-medium text-gray-900 mb-2">Delivery Time</Text>
//         <TouchableOpacity 
//           className="bg-white border-2 border-gray-300 rounded-xl p-4 shadow-sm"
//           onPress={() => setShowTimePicker(true)}
//         >
//           <Text className="text-base text-gray-900 font-medium">🕐 {formatTime(deliveryTime)}</Text>
//         </TouchableOpacity>
//         {showTimePicker && (
//           <DateTimePicker 
//             value={deliveryTime} 
//             mode="time" 
//             display="default" 
//             onChange={(event, time) => {
//               setShowTimePicker(false);
//               if (time) setDeliveryTime(time);
//             }}
//           />
//         )}
//       </View>

//       <View className="mb-6">
//         {/* <Text className="text-base font-medium text-gray-900 mb-3">Upload Crop Photos</Text>
//         <TouchableOpacity
//           className="bg-blue-500 p-4 rounded-xl items-center mb-4 shadow-lg active:bg-blue-600"
//           onPress={handlePhotoUpload}
//           disabled={cropPhotos.length >= 3}
//         >
//           <Text className="text-white text-base font-medium">
//             📸 Select Photos ({cropPhotos.length}/3)
//           </Text>
//         </TouchableOpacity> */}

//         {cropPhotos.length > 0 && (
//           <View className="flex-row flex-wrap gap-2">
//             {cropPhotos.map((photo, index) => (
//               <View key={index} className="w-[100px] h-[100px] relative">
//                 <Image source={{ uri: photo.uri }} className="w-full h-full rounded-xl" />
//                 <TouchableOpacity
//                   className="absolute top-1 right-1 bg-red-500 w-7 h-7 rounded-full items-center justify-center shadow-lg"
//                   onPress={() => setCropPhotos(prev => prev.filter((_, i) => i !== index))}
//                 >
//                   <Text className="text-white font-medium text-lg">×</Text>
//                 </TouchableOpacity>
//               </View>
//             ))}
//           </View>
//         )}
//       </View>

//       <View className="mb-6">
//         <Text className="text-base font-medium text-gray-900 mb-2">Nearest Market</Text>
//         <TextInput
//           className="bg-white border-2 border-gray-300 rounded-xl p-4 text-base text-gray-900 mb-4 shadow-sm"
//           placeholder="🔍 Search markets..."
//           value={marketSearch}
//           onChangeText={handleMarketSearch}
//         />
        
//         <CustomPicker
//           label=""
//           value={nearestMarket}
//           options={filteredMarkets.map(m => ({
//             label: `${m.marketName} - ${m.district}`,
//             value: m._id
//           }))}
//           onValueChange={setNearestMarket}
//           placeholder="Select Market"
//         />
//       </View>

//       <View className="flex-row gap-3 mt-8 mb-[150px]">
//         <TouchableOpacity 
//           className="bg-gray-500 flex-1 py-4 rounded-xl shadow-lg active:bg-gray-600" 
//           onPress={prevStep}
//           disabled={isSubmitting}
//         >
//           <Text className="text-white text-center text-lg font-medium">← Previous</Text>
//         </TouchableOpacity>
//         <TouchableOpacity 
//           className="bg-green-600 flex-1 py-4 rounded-xl shadow-lg active:bg-green-700" 
//           onPress={handleSubmit}
//           disabled={isSubmitting}
//         >
//           {isSubmitting ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <Text className="text-white text-center text-lg font-medium">Submit Post</Text>
//           )}
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   return (
//     <>
//     <View className="flex-1 bg-gray-50">
//       <View className="flex-row items-center p-4 bg-white border-b-2 border-gray-200">
//         <TouchableOpacity onPress={goBack} className="p-2 mr-2">
//           <ChevronLeft size={24} color="#374151" />
//         </TouchableOpacity>
//         <Text className="text-xl font-medium text-gray-900">
//           Step {step} of 4
//         </Text>
//       </View>

//       <ScrollView 
//         className="flex-1" 
//         keyboardShouldPersistTaps="handled"
//         showsVerticalScrollIndicator={false}
//       >
//         <View className="p-5">
//           {/* {step === 1 && renderStep1()} */}
//           {step === 2 && renderStep2()}
//           {step === 3 && renderStep3()}
//           {step === 4 && renderStep4()}
//         </View>
//       </ScrollView>
//     </View>

//       <CustomAlert
//   visible={showAlert}
//   title={alertTitle}
//   message={alertMessage}
//   onClose={() => {
//     setShowAlert(false);
//     if (alertAction) alertAction();  
//   }}
// />
//     </>
//   );
// };

// export default SellProductForm;




import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronDown, ChevronLeft, X } from 'lucide-react-native';
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import CustomAlert from '../../components/CustomAlert';



const compressVideo = async (uri: string) => {
  try {
    // Using the new File API instead of legacy getInfoAsync
    const file = new File(uri);
    const fileInfo = await file.size;
    
    const fileSizeInMB = fileInfo / (1024 * 1024);
    
    console.log(`Original video size: ${fileSizeInMB.toFixed(2)} MB`);
    
    // Videos captured with quality: 0.1 should already be compressed
    // If still too large, we'll return the URI with a warning
    if (fileSizeInMB > 10) {
      console.warn('Video is larger than 10MB, may cause upload issues');
    }
    
    return {
      uri,
      size: fileInfo
    };
  } catch (error) {
    console.error("Error compressing video:", error);
    // Fallback: return without size info
    return { uri, size: 0 };
  }
};
const compressImage = async (uri, quality = 0.1) => {
  try {
    const manipulations = [{ resize: { width: 500 } }]; // Reduced from 600 to 500
    
    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      manipulations,
      { 
        compress: quality,
        format: ImageManipulator.SaveFormat.JPEG 
      }
    );
    
    return manipResult;
  } catch (error) {
    console.error("Error compressing image:", error);
    return { uri };
  }
};

// Add watermark to image
const addWatermarkToImage = async (uri: string) => {
  try {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
    const timeStr = now.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: true 
    });
    const watermarkText = `${dateStr} | ${timeStr}`;
    
    // First compress the image
    const compressed = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 1024 } }],
      { 
        compress: 0.7, 
        format: ImageManipulator.SaveFormat.JPEG 
      }
    );
    
    // Create a semi-transparent overlay at the bottom
    // This will show timestamp location
    const watermarked = await ImageManipulator.manipulateAsync(
      compressed.uri,
      [
        {
          // Add a flip operation (this is a workaround to trigger re-render)
          // In practice, you'd need react-native-canvas or similar for text
          rotate: 0
        }
      ],
      { 
        compress: 0.3, 
        format: ImageManipulator.SaveFormat.JPEG 
      }
    );
    
    // Return watermarked image with metadata
    return {
      ...watermarked,
      watermarkText, // Store for potential use
      timestamp: now.toISOString()
    };
  } catch (error) {
    console.error("Error adding watermark:", error);
    return { uri };
  }
};

// Custom Picker component
const CustomPicker = ({ label, value, options, onValueChange, placeholder }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View className="mb-5">
      <Text className="text-base font-medium text-gray-900 mb-2">{label}</Text>
      <TouchableOpacity
        className="bg-white border-2 border-gray-300 rounded-xl p-4 shadow-sm flex-row justify-between items-center"
        onPress={() => setModalVisible(true)}
      >
        <Text className={`text-base flex-1 ${value ? 'text-gray-900' : 'text-gray-500'}`}>
          {value ? options.find(o => o.value === value)?.label : placeholder}
        </Text>
        <ChevronDown size={20} color="#6b7280" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl h-[50%] p-5 shadow-2xl">
            <View className="flex-row justify-between items-center mb-4 border-b border-gray-200 pb-3">
              <Text className="text-xl font-bold text-gray-900">{label}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} className="p-2">
                 <X size={24} color="#374151" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={options}
              keyExtractor={(item) => item.value.toString()}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className={`p-4 border-b border-gray-100 flex-row justify-between items-center active:bg-gray-50 ${item.value === value ? 'bg-green-50' : ''}`}
                  onPress={() => {
                    onValueChange(item.value);
                    setModalVisible(false);
                  }}
                >
                  <Text className={`text-lg ${item.value === value ? 'text-green-700 font-semibold' : 'text-gray-700'}`}>
                    {item.label}
                  </Text>
                  {item.value === value && (
                    <View className="w-3 h-3 rounded-full bg-green-600" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const SellProductForm: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const categoryId = params.categoryId as string;
  const subCategoryId = params.subCategoryId as string;

  const [step, setStep] = useState(2);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State declarations
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [cropBriefDetails, setCropBriefDetails] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categoryId || "");
  const [selectedSubCategory, setSelectedSubCategory] = useState(subCategoryId || "");
  const [globalQuantityType, setGlobalQuantityType] = useState("");
  const [globalPriceType, setGlobalPriceType] = useState("");
  const [isGradingEnabled, setIsGradingEnabled] = useState(true);
  const [farmingType, setFarmingType] = useState("");
  const [typeOfSeeds, setTypeOfSeeds] = useState("");
  const [packagingType, setPackagingType] = useState("");
  const [packageMeasurement, setPackageMeasurement] = useState("");
  const [unitMeasurement, setUnitMeasurement] = useState("");
  const [packagingOptions, setPackagingOptions] = useState([]);
  const [selectedPackaging, setSelectedPackaging] = useState(null);
  const [selectedMeasurementUnit, setSelectedMeasurementUnit] = useState("");
  const [markets, setMarkets] = useState([]);
  const [filteredMarkets, setFilteredMarkets] = useState([]);
  const [marketSearch, setMarketSearch] = useState("");
  const [nearestMarket, setNearestMarket] = useState("");
  
  const [gradePrices, setGradePrices] = useState([
    { grade: "A Grade", pricePerUnit: "", totalQty: "", photos: [] },
    { grade: "B Grade", pricePerUnit: "", totalQty: "", photos: [] },
   // { grade: "All Mixed Grades", pricePerUnit: "", totalQty: "", photos: [] },
  ]);
  const [gradeCounter, setGradeCounter] = useState(2);
  const [selectedGrades, setSelectedGrades] = useState([]);
  
  const [deliveryDate, setDeliveryDate] = useState(new Date());
  const [deliveryTime, setDeliveryTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  
  const [cropPhotos, setCropPhotos] = useState([]);
  const [farmLocation, setFarmLocation] = useState({
    latitude: 12.9716,
    longitude: 77.5946,
  });
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertAction, setAlertAction] = useState<null | (() => void)>(null);
  const calculateGradeTotal = (pricePerUnit, totalQty) => {
  const price = parseFloat(pricePerUnit) || 0;
  const qty = parseFloat(totalQty) || 0;
  return (price * qty).toFixed(2);
};

const calculateGrandTotal = () => {
  return selectedGrades.reduce((total, gradeName) => {
    const grade = gradePrices.find(gp => gp.grade === gradeName);
    if (grade) {
      const gradeTotal = parseFloat(calculateGradeTotal(grade.pricePerUnit, grade.totalQty));
      return total + gradeTotal;
    }
    return total;
  }, 0).toFixed(2);
};
  const showAppAlert = (title: string, message: string, action?: () => void) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertAction(() => action || null);
    setShowAlert(true);
  };
useEffect(() => {
  if (isGradingEnabled) {
    // Switch to grading mode
    setGradePrices([
      { grade: "A Grade", pricePerUnit: "", totalQty: "", photos: [] },
      { grade: "B Grade", pricePerUnit: "", totalQty: "", photos: [] },
    ]);
    setSelectedGrades([]);
    setGradeCounter(2);
  } else {
    // Switch to non-grading mode
    setGradePrices([
      { grade: "All Mixed Grades", pricePerUnit: "", totalQty: "", photos: [] },
    ]);
    setSelectedGrades(["All Mixed Grades"]);
  }
}, [isGradingEnabled]);
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setCropPhotos([]);
      setGradePrices(prev => prev.map(gp => ({ ...gp, photos: [] })));
    };
  }, []);

  useEffect(() => {
    const fetchSubCategoryName = async () => {
      if (subCategoryId) {
        try {
          const res = await axios.get(
            `https://kisan.etpl.ai/subcategory/category/${categoryId}`
          );
          const subCategory = res.data.data.find(
            (sub: any) => sub._id === subCategoryId
          );
          if (subCategory) {
            setCropBriefDetails(subCategory.subCategoryName);
          }
        } catch (error) {
          console.error("Error fetching subcategory name:", error);
        }
      }
    };

    fetchSubCategoryName();
  }, [categoryId, subCategoryId]);

  // Memoize options
  const farmingTypeOptions = useMemo(() => [
    // { label: "Select Farming Type", value: "" },
    // { label: "Drop Down 1", value: "drop down 1" },
    { label: "Regular", value: "regular" },
    { label: "Organic", value: "organic" },
  ], []);

  const priceTypeOptions = useMemo(() => [
    // { label: "Select Type", value: "" },
    { label: "Fixed", value: "fixed" },
    { label: "Negotiable", value: "negotiable" },
  ], []);

  const quantityTypeOptions = useMemo(() => [
    // { label: "Select Type", value: "" },
    { label: "Bulk", value: "bulk" },
    { label: "Split", value: "split" },
  ], []);

  // Data fetching
  useEffect(() => {
    fetchCategories();
    requestLocationPermission();
    fetchPackaging();
    fetchMarkets();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("https://kisan.etpl.ai/category/all");
      setCategories(res.data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      showAppAlert("Error", "Failed to load categories");
    }
  };

  const fetchPackaging = async () => {
    try {
      const res = await axios.get("https://kisan.etpl.ai/api/packaging/all");
      setPackagingOptions(res.data || []);
    } catch (error) {
      console.error("Error fetching packaging:", error);
    }
  };

  const fetchMarkets = async () => {
    try {
      const farmerId = await AsyncStorage.getItem('farmerId');
      if (!farmerId) {
        console.error("Farmer ID not found");
        return;
      }

      const farmerRes = await axios.get(`https://kisan.etpl.ai/farmer/register/all`);
      const farmerData = farmerRes.data.data || farmerRes.data || [];
      
      const currentFarmer = farmerData.find((f: any) => f.farmerId === farmerId);
      
      if (!currentFarmer || !currentFarmer.nearestMarkets || currentFarmer.nearestMarkets.length === 0) {
        console.log("No nearest markets found for farmer");
        setMarkets([]);
        setFilteredMarkets([]);
        return;
      }

      const marketsRes = await axios.get("https://kisan.etpl.ai/api/market/all");
      const allMarkets = marketsRes.data.data || marketsRes.data || [];
      
      const farmerMarkets = allMarkets.filter((market: any) => 
        currentFarmer.nearestMarkets.some((nm: any) => 
          nm._id === market._id || nm === market._id
        )
      );
      
      setMarkets(farmerMarkets);
      setFilteredMarkets(farmerMarkets);
    } catch (error) {
      console.error("Error fetching markets:", error);
    }
  };

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        setFarmLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    } catch (error) {
      console.error("Error getting location:", error);
    }
  };

  const handleMarketSearch = useCallback((searchValue: string) => {
    setMarketSearch(searchValue);
    
    if (!searchValue.trim()) {
      setFilteredMarkets(markets);
      return;
    }
    
    const filtered = markets.filter(market => 
      market.marketName?.toLowerCase().includes(searchValue.toLowerCase()) ||
      market.pincode?.includes(searchValue) ||
      market.district?.toLowerCase().includes(searchValue.toLowerCase())
    );
    
    setFilteredMarkets(filtered);
  }, [markets]);
// Add this function near other permission functions
const requestCameraPermission = async () => {
  try {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      showAppAlert("Permission Denied", "Camera permission is required");
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error requesting camera permission:", error);
    return false;
  }
};
  const handlePhotoUpload = async () => {
    try {
      if (cropPhotos.length >= 3) {
        showAppAlert("Limit Reached", "Maximum 3 photos allowed");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.5,
        allowsEditing: false,
      });

      if (!result.canceled && result.assets) {
        const remainingSlots = 3 - cropPhotos.length;
        const selectedPhotos = result.assets.slice(0, remainingSlots);
        
        // Compress images
        const compressedPhotos = await Promise.all(
          selectedPhotos.map(async (photo) => {
            const compressed = await compressImage(photo.uri, 0.3);
            return { ...photo, uri: compressed.uri };
          })
        );
        
        setCropPhotos(prev => [...prev, ...compressedPhotos]);
        
        if (selectedPhotos.length < result.assets.length) {
          showAppAlert("Info", `Only ${selectedPhotos.length} photo(s) added (3 photo limit)`);
        }
      }
    } catch (error) {
      console.error("Error uploading photos:", error);
      showAppAlert("Error", "Failed to upload photos");
    }
  };
// Add timestamp metadata to captured images
const addTimestampMetadata = async (uri) => {
  try {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
    const timeStr = now.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: true 
    });
    
    // Even more aggressive compression
    const compressed = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 500 } }], // Reduced from 800
      { 
        compress: 0.1, // Very aggressive
        format: ImageManipulator.SaveFormat.JPEG 
      }
    );
    
    return {
      uri: compressed.uri,
      timestamp: `${dateStr} ${timeStr}`,
      capturedAt: now.toISOString()
    };
  } catch (error) {
    console.error("Error processing image:", error);
    return { uri, timestamp: '', capturedAt: '' };
  }
};


const handleGradePhotoUpload = async (index, useCamera = false, mediaType = 'photo') => {
  try {
    const currentPhotos = gradePrices[index].photos.length;
    if (currentPhotos >= 5) {
      showAppAlert("Limit Reached", "Maximum 5 media items per grade");
      return;
    }

    let result;

    if (useCamera) {
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) return;

      if (mediaType === 'video') {
        // Launch camera for video with AGGRESSIVE compression
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Videos,
          quality: 0, // LOWEST quality
          videoMaxDuration: 8, // Reduced to 8 seconds
          allowsEditing: false,
          videoQuality: 0,
        });
      } else {
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.1,
          allowsEditing: false,
          exif: true,
        });
      }
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.2,
        allowsEditing: false,
        exif: true,
      });
    }

    if (!result.canceled && result.assets) {
      const remainingSlots = 5 - currentPhotos;
      const selectedMedia = result.assets.slice(0, remainingSlots);
      
      // Process media with compression
      const processedMedia = await Promise.all(
        selectedMedia.map(async (media) => {
          if (media.type === 'image') {
            // Super aggressive image compression
            const compressed = await compressImage(media.uri, 0.1);
            if (useCamera) {
              const withTimestamp = await addTimestampMetadata(compressed.uri);
              return { ...withTimestamp, type: 'image' };
            }
            return { ...media, uri: compressed.uri, type: 'image' };
          } else if (media.type === 'video') {
            // NEW FILE API - Check video file size
            try {
              const file = new FileSystem.File(media.uri);
              const fileSize = await file.size; // Returns size in bytes
              const fileSizeInMB = fileSize / (1024 * 1024);
              
              console.log(`Video size: ${fileSizeInMB.toFixed(2)} MB`);
              
              // STRICT: Reject videos over 5MB
              if (fileSizeInMB > 50) {
                showAppAlert(
                  "Video Too Large", 
                  `Video is ${fileSizeInMB.toFixed(1)}MB. Maximum 50MB allowed. Please record a shorter video.`
                );
                return null;
              }

              // Check duration
              const duration = media.duration || 0;
              // if (duration > 8) {
              //   showAppAlert(
              //     "Video Too Long", 
              //     "Please record videos under 8 seconds"
              //   );
              //   return null;
              // }

              return {
                uri: media.uri,
                type: 'video',
                duration: duration,
                fileSize: fileSizeInMB,
                capturedAt: new Date().toISOString()
              };
            } catch (error) {
              console.error("Error checking video file:", error);
              // If we can't check size, still allow but warn
              const duration = media.duration || 0;
              if (duration > 8) {
                showAppAlert("Warning", "Video may be too large");
                return null;
              }
              return {
                uri: media.uri,
                type: 'video',
                duration: duration,
                capturedAt: new Date().toISOString()
              };
            }
          }
          return media;
        })
      );
      
      // Filter out null entries
      const validMedia = processedMedia.filter(m => m !== null);
      
      if (validMedia.length === 0) {
        return;
      }

      setGradePrices(prev => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          photos: [...updated[index].photos, ...validMedia],
        };
        return updated;
      });

      if (validMedia.length > 0 && validMedia.length < selectedMedia.length) {
        showAppAlert("Info", `${validMedia.length} media added (some were too large)`);
      }
    }
  } catch (error) {
    console.error("Error capturing/uploading media:", error);
    showAppAlert("Error", "Failed to capture/upload media");
  }
};


  const handleGradePriceChange = useCallback((index: number, field: string, value: string) => {
    if ((field === "pricePerUnit" || field === "totalQty") && parseFloat(value) < 0) {
      return;
    }
    setGradePrices(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }, []);

  const getCurrentLocation = async () => {
    setIsGettingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        showAppAlert("Permission Denied", "Location permission is required");
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setFarmLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      showAppAlert("Success", "Current location captured!");
    } catch (error) {
      console.error("Error getting location:", error);
      showAppAlert("Error", "Failed to get current location");
    } finally {
      setIsGettingLocation(false);
    }
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatTime = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const handleAddGrade = () => {
    const nextGrade = String.fromCharCode(65 + gradeCounter);
    const newGrade: GradePrice = {
      grade: `${nextGrade} Grade`,
      pricePerUnit: "",
      totalQty: "",
      photos: [],
    };
    setGradePrices([...gradePrices, newGrade]);
  setGradeCounter(gradeCounter + 1);
  };
  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    if (!selectedCategory || !selectedSubCategory) {
      showAppAlert("Missing Information", "Please fill in all required fields");
      return;
    }

    const farmerId = await AsyncStorage.getItem('farmerId');
    if (!farmerId) {
      showAppAlert("Error", "You are not logged in. Please login again.");
      return;
    }

    const selectedGradeObjects = gradePrices.filter((gp) => 
      selectedGrades.includes(gp.grade)
    );

    for (const gp of selectedGradeObjects) {
      if (!gp.pricePerUnit || !gp.totalQty) {
        showAppAlert(
          "Incomplete Grade Information", 
          `Please fill Price and Quantity for ${gp.grade}`
        );
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const getMimeType = (uri: string) => {
        const extension = uri.split('.').pop()?.toLowerCase();
        if (extension === 'png') return 'image/png';
        if (extension === 'jpg' || extension === 'jpeg') return 'image/jpeg';
        return 'image/jpeg';
      };

      const formData = new FormData();
      formData.append("farmerId", farmerId);
      formData.append("categoryId", selectedCategory);
      formData.append("subCategoryId", selectedSubCategory);
      formData.append("cropBriefDetails", cropBriefDetails);
      formData.append("farmingType", farmingType);
      formData.append("typeOfSeeds", typeOfSeeds);
      formData.append("packagingType", packagingType);
      formData.append("packageMeasurement", packageMeasurement);
      formData.append("unitMeasurement", unitMeasurement);
      formData.append("deliveryDate", formatDate(deliveryDate));
      formData.append("deliveryTime", formatTime(deliveryTime));
      formData.append("nearestMarket", nearestMarket);
      
      formData.append("farmLocation", JSON.stringify({
        lat: farmLocation.latitude.toString(),
        lng: farmLocation.longitude.toString()
      }));

      const selectedGradeData = selectedGradeObjects.map((gp) => ({
        grade: gp.grade,
        pricePerUnit: gp.pricePerUnit,
        totalQty: gp.totalQty,
        quantityType: globalQuantityType,
        priceType: globalPriceType,
      }));

      formData.append("gradePrices", JSON.stringify(selectedGradeData));

      // Append grade photos
      for (const gp of gradePrices) {
        if (selectedGrades.includes(gp.grade)) {
          for (let index = 0; index < gp.photos.length; index++) {
            const photo = gp.photos[index];
            const extension = photo.uri.split('.').pop()?.toLowerCase() || 'jpg';
            const mimeType = getMimeType(photo.uri);
            
            formData.append(`gradePhotos_${gp.grade}`, {
              uri: photo.uri,
              type: mimeType,
              name: `grade_${gp.grade}_${Date.now()}_${index}.${extension}`,
            } as any);
          }
        }
      }

      // Append crop photos
      cropPhotos.forEach((photo: any, idx) => {
        const extension = photo.uri.split('.').pop()?.toLowerCase() || 'jpg';
        const mimeType = getMimeType(photo.uri);

        formData.append(`photos`, {
          uri: photo.uri,
          type: mimeType,
          name: `photo_${Date.now()}_${idx}.${extension}`,
        } as any);
      });
// Append grade photos and videos
for (const gp of gradePrices) {
  if (selectedGrades.includes(gp.grade)) {
    for (let index = 0; index < gp.photos.length; index++) {
      const media = gp.photos[index];
      
      if (media.type === 'video') {
        // Handle video
        formData.append(`gradeVideos_${gp.grade}`, {
          uri: media.uri,
          type: 'video/mp4',
          name: `grade_${gp.grade}_${Date.now()}_${index}.mp4`,
        } as any);
      } else {
        // Handle image
        const extension = media.uri.split('.').pop()?.toLowerCase() || 'jpg';
        const mimeType = getMimeType(media.uri);
        
        formData.append(`gradePhotos_${gp.grade}`, {
          uri: media.uri,
          type: mimeType,
          name: `grade_${gp.grade}_${Date.now()}_${index}.${extension}`,
        } as any);
      }
    }
  }
}
      console.log("Submitting product...");
      const response = await axios.post(
        "https://kisan.etpl.ai/product/add",
        formData,
        {
          headers: { 
            "Content-Type": "multipart/form-data",
          },
          timeout: 120000, // 2 minutes
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        }
      );

      console.log("Submit success:", response.data);
      showAppAlert("Success", "Product added successfully!",() => router.replace("/(farmer)/home"));
    } catch (error: any) {
      console.error("Submit error details:", error.response?.data || error.message);
      
      let errorMessage = "Failed to submit. Please try again.";
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = "Upload timed out. Please check your internet connection and try again.";
      } else if (error.response?.status === 413) {
        errorMessage = "Images are too large. Please remove some photos and try again.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      showAppAlert("Error", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 2) setStep(step - 1);
  };

  const goBack = () => {
    if (step > 2) {
      prevStep();
    } else {
      router.back();
    }
  };

  // Render methods with improved UI
  const renderStep1 = () => (
    <View>
      <Text className="text-2xl font-medium text-gray-900 mb-6">Category & Product</Text>
      <View className="mb-6">
        <Text className="text-base font-medium text-gray-900 mb-2">Crop Brief Details</Text>
        <TextInput
          className="bg-white border-2 border-gray-300 rounded-xl p-4 min-h-[120px] text-base text-gray-900 shadow-sm"
          placeholder="Enter brief description of your crop..."
          value={cropBriefDetails}
          onChangeText={setCropBriefDetails}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>
      <TouchableOpacity 
        className="bg-green-600 py-4 rounded-xl shadow-lg active:bg-green-700" 
        onPress={nextStep}
      >
        <Text className="text-white text-center text-lg font-medium">Next Step →</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep2 = () => (
    <View>
      <Text className="text-2xl font-medium text-gray-900 mb-6">Farming & Packaging Details</Text>
      
      <CustomPicker
        label="Farming Type"
        value={farmingType}
        options={farmingTypeOptions}
        onValueChange={setFarmingType}
        placeholder="Select Farming Type"
      />

      <View className="mb-5">
        <Text className="text-base font-medium text-gray-900 mb-2">Type of Seeds</Text>
        <TextInput
          className="bg-white border-2 border-gray-300 rounded-xl p-4 text-base text-gray-900 shadow-sm"
          placeholder="e.g., Naati, Hybrid"
          value={typeOfSeeds}
          onChangeText={setTypeOfSeeds}
        />
      </View>

      <CustomPicker
        label="Packaging Type"
        value={packagingType}
        options={packagingOptions.map(p => ({ label: p.packageType, value: p.packageType }))}
        onValueChange={(value) => {
          setPackagingType(value);
          const selected = packagingOptions.find(p => p.packageType === value);
          setSelectedPackaging(selected || null);
        }}
        placeholder="Select Package Type"
      />

      {selectedPackaging?.measurements?.length > 0 && (
        <CustomPicker
          // label="Measurement"
          // value={packageMeasurement}
          // options={selectedPackaging.measurements.map(m => ({ label: m, value: m }))}
          // onValueChange={setPackageMeasurement}
          // placeholder="Select Measurement"
          label="Measurement"
  value={packageMeasurement}
  options={selectedPackaging.measurements.map(m => ({ label: m, value: m }))}
  onValueChange={(value) => {
    setPackageMeasurement(value);
    // Extract unit (e.g., "25 kg" -> "kg")
    const unit = value.split(' ').pop();
    setSelectedMeasurementUnit(unit);
  }}
  placeholder="Select Measurement"
/>
      )}

      <View className="mb-5">
        <Text className="text-base font-medium text-gray-900 mb-2">Unit Measurement</Text>
        <TextInput
          className="bg-white border-2 border-gray-300 rounded-xl p-4 text-base text-gray-900 shadow-sm"
          placeholder="e.g., kg per box"
          value={unitMeasurement}
          onChangeText={setUnitMeasurement}
        />
      </View>

      <View className="flex-row gap-3 mt-8 mb-[150px]">
        <TouchableOpacity 
          className="bg-gray-500 flex-1 py-4 rounded-xl shadow-lg active:bg-gray-600" 
          onPress={prevStep}
        >
          <Text className="text-white text-center text-lg font-medium">← Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className="bg-green-600 flex-1 py-4 rounded-xl shadow-lg active:bg-green-700" 
          onPress={nextStep}
        >
          <Text className="text-white text-center text-lg font-medium">Next Step →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

//   const renderStep3 = () => (
//     <View>
//       <Text className="text-2xl font-medium text-gray-900 mb-6">Pricing & Details</Text>
      
//       <View className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl mb-6 border-2 border-blue-200">
//         <Text className="text-lg font-medium text-gray-900 mb-4">Global Settings</Text>
        
//         <CustomPicker
//           label="Quantity Type"
//           value={globalQuantityType}
//           options={quantityTypeOptions}
//           onValueChange={setGlobalQuantityType}
//           placeholder="Select Type"
//         />

//         <CustomPicker
//           label="Price Type"
//           value={globalPriceType}
//           options={priceTypeOptions}
//           onValueChange={setGlobalPriceType}
//           placeholder="Select Type"
//         />
//       </View>
//  <TouchableOpacity className="bg-blue-500 px-4 py-2 rounded-lg w-20 mb-3 flex items-center justify-center" onPress={handleAddGrade} >
//                   <Text className="text-white font-medium text-base"  >+</Text>
//                 </TouchableOpacity>
//       {gradePrices.map((gp, index) => (
//         <View key={index} className="bg-white border-2 border-gray-300 rounded-xl p-5 mb-4 shadow-sm">
//           <TouchableOpacity
//             className="flex-row items-center mb-4"
//             onPress={() => {
//               if (selectedGrades.includes(gp.grade)) {
//                 setSelectedGrades(prev => prev.filter(g => g !== gp.grade));
//               } else {
//                 setSelectedGrades(prev => [...prev, gp.grade]);
//               }
//             }}
//           >
//             <View className={`w-7 h-7 border-2 rounded-lg mr-3 items-center justify-center ${
//               selectedGrades.includes(gp.grade) 
//                 ? 'bg-green-600 border-green-600' 
//                 : 'border-gray-400'
//             }`}>
//               {selectedGrades.includes(gp.grade) && (
//                 <Text className="text-white font-medium text-lg">✓</Text>
//               )}
//             </View>
//             <Text className="text-lg font-medium text-gray-900">{gp.grade}</Text>
//           </TouchableOpacity>

//           {selectedGrades.includes(gp.grade) && (
//             <View>
//               <View className="flex-row gap-3 mb-4">
//                 <View className="flex-1">
//                   <Text className="text-sm font-medium text-gray-700 mb-2">Price / unit (₹)</Text>
//                   <TextInput
//                     className="bg-gray-50 border-2 border-gray-300 rounded-xl p-3 text-base text-gray-900"
//                     placeholder="₹"
//                     value={gp.pricePerUnit}
//                     onChangeText={(value) => handleGradePriceChange(index, "pricePerUnit", value)}
//                     keyboardType="numeric"
//                   />
//                 </View>
//                 <View className="flex-1">
//                   <Text className="text-sm font-medium text-gray-700 mb-2">Total Qty</Text>
//                   <TextInput
//                     className="bg-gray-50 border-2 border-gray-300 rounded-xl p-3 text-base text-gray-900"
//                     placeholder="Qty"
//                     value={gp.totalQty}
//                     onChangeText={(value) => handleGradePriceChange(index, "totalQty", value)}
//                     keyboardType="numeric"
//                   />
//                 </View>
//               </View>

// <View className="mb-4">
//   <Text className="text-sm font-medium text-gray-700 mb-2">Capture Media</Text>
//   <View className="flex-row gap-2">
//     <TouchableOpacity
//       className="bg-blue-600 p-4 rounded-xl items-center flex-1 shadow-md active:bg-blue-700"
//       onPress={() => handleGradePhotoUpload(index, true, 'photo')}
//     >
//       <Text className="text-white text-base font-medium">
//         📷 Photo
//       </Text>
//     </TouchableOpacity>
    
   
//   </View>
//   <Text className="text-xs text-gray-500 mt-1 text-center">
//     ({gp.photos.length}/3 media items)
//   </Text>
// </View>
  

// {gp.photos.length > 0 && (
//   <View className="flex-row flex-wrap gap-2">
//     {gp.photos.map((photo, photoIdx) => (
//       <View key={photoIdx} className="w-[100px] h-[100px] relative">
//         {photo.type === 'video' ? (
//           // Video thumbnail
//           <View className="w-full h-full rounded-xl bg-gray-800 items-center justify-center">
//             <Text className="text-white text-2xl">▶️</Text>
//             {photo.duration && (
//               <Text className="text-white text-xs mt-1">
//                 {Math.round(photo.duration)}s
//               </Text>
//             )}
//           </View>
//         ) : (
//           // Image
//           <Image source={{ uri: photo.uri }} className="w-full h-full rounded-xl" />
//         )}
        
//         {/* Timestamp overlay for images */}
//         {photo.timestamp && photo.type !== 'video' && (
//           <View className="absolute bottom-0 left-0 right-0 bg-black/70 px-1 py-0.5">
//             <Text className="text-white text-[8px] font-medium text-center">
//               {photo.timestamp}
//             </Text>
//           </View>
//         )}
        
//         <TouchableOpacity
//           className="absolute top-1 right-1 bg-red-500 w-7 h-7 rounded-full items-center justify-center shadow-lg"
//           onPress={() => {
//             setGradePrices(prev => {
//               const updated = [...prev];
//               updated[index].photos = updated[index].photos.filter((_, idx) => idx !== photoIdx);
//               return updated;
//             });
//           }}
//         >
//           <Text className="text-white font-medium text-lg">×</Text>
//         </TouchableOpacity>
//       </View>
//     ))}
//   </View>
// )}
//             </View>
//           )}
//         </View>
//       ))}

//       <View className="flex-row gap-3 mt-8 mb-[150px]">
//         <TouchableOpacity 
//           className="bg-gray-500 flex-1 py-4 rounded-xl shadow-lg active:bg-gray-600" 
//           onPress={prevStep}
//         >
//           <Text className="text-white text-center text-lg font-medium">← Previous</Text>
//         </TouchableOpacity>
//         <TouchableOpacity 
//           className="bg-green-600 flex-1 py-4 rounded-xl shadow-lg active:bg-green-700" 
//           onPress={nextStep}
//         >
//           <Text className="text-white text-center text-lg font-medium">Next Step →</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

const renderStep3 = () => (
  <View>
    <Text className="text-2xl font-medium text-gray-900 mb-6">Pricing & Details</Text>
    
    <View className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl mb-6 border-2 border-blue-200">
      <Text className="text-lg font-medium text-gray-900 mb-4">Global Settings</Text>
      
      <CustomPicker
        label="Quantity Type"
        value={globalQuantityType}
        options={quantityTypeOptions}
        onValueChange={setGlobalQuantityType}
        placeholder="Select Type"
      />

      <CustomPicker
        label="Price Type"
        value={globalPriceType}
        options={priceTypeOptions}
        onValueChange={setGlobalPriceType}
        placeholder="Select Type"
      />

      {/* Grading Toggle */}
      {/* <View className="mb-4">
        <Text className="text-base font-medium text-gray-900 mb-3">Product Grading</Text>
        <View className="flex-row items-center bg-white rounded-xl p-4 shadow-sm border-2 border-gray-300">
          <Text className="flex-1 text-base text-gray-700">
            {isGradingEnabled ? "Grading Enabled" : "Non-Grading (Mixed)"}
          </Text>
          <TouchableOpacity
            className={`w-14 h-8 rounded-full p-1 ${isGradingEnabled ? 'bg-green-600' : 'bg-gray-400'}`}
            onPress={() => setIsGradingEnabled(!isGradingEnabled)}
          >
            <View className={`w-6 h-6 rounded-full bg-white shadow-md ${isGradingEnabled ? 'ml-6' : ''}`} />
          </TouchableOpacity>
        </View>
        <Text className="text-xs text-gray-500 mt-2">
          {isGradingEnabled 
            ? "Separate pricing for different grades (A, B, C...)" 
            : "Single pricing for all mixed grades"}
        </Text>
      </View> */}
      {/* Tab-based Toggle */}
<View className="mb-6">
  <View className="flex-row border-2 border-gray-300 rounded-xl overflow-hidden">
   <TouchableOpacity
  className={`flex-1 py-4 ${
    isGradingEnabled ? 'bg-blue-500' : 'bg-white'
  }`}
  onPress={() => setIsGradingEnabled(true)}
  activeOpacity={0.7}
>
  <Text
    className={`text-center font-bold text-base ${
      isGradingEnabled ? 'text-white' : 'text-gray-700'
    }`}
  >
    GRADING
  </Text>
</TouchableOpacity>

<TouchableOpacity
  className={`flex-1 py-4 ${
    !isGradingEnabled ? 'bg-blue-500' : 'bg-white'
  }`}
  onPress={() => setIsGradingEnabled(false)}
  activeOpacity={0.7}
>
  <Text
    className={`text-center font-bold text-base ${
      !isGradingEnabled ? 'text-white' : 'text-gray-700'
    }`}
  >
    NON-GRADING
  </Text>
</TouchableOpacity>

  </View>
</View>
    </View>

    {/* Show Add Grade button only in grading mode */}
    {isGradingEnabled && (
      <TouchableOpacity 
        className="bg-blue-500 px-4 py-2 rounded-lg w-20 mb-3 flex items-center justify-center" 
        onPress={handleAddGrade}
      >
        <Text className="text-white font-medium text-base">+</Text>
      </TouchableOpacity>
    )}

    {gradePrices.map((gp, index) => (
      <View key={index} className="bg-white border-2 border-gray-300 rounded-xl p-5 mb-4 shadow-sm">
        <TouchableOpacity
          className="flex-row items-center mb-4"
          onPress={() => {
            if (selectedGrades.includes(gp.grade)) {
              setSelectedGrades(prev => prev.filter(g => g !== gp.grade));
            } else {
              setSelectedGrades(prev => [...prev, gp.grade]);
            }
          }}
          disabled={!isGradingEnabled && gp.grade === "All Mixed Grades"}
        >
          <View className={`w-7 h-7 border-2 rounded-lg mr-3 items-center justify-center ${
            selectedGrades.includes(gp.grade) 
              ? 'bg-green-600 border-green-600' 
              : 'border-gray-400'
          }`}>
            {selectedGrades.includes(gp.grade) && (
              <Text className="text-white font-medium text-lg">✓</Text>
            )}
          </View>
          <Text className="text-lg font-medium text-gray-900">{gp.grade}</Text>
        </TouchableOpacity>

        {selectedGrades.includes(gp.grade) && (
          <View>
            <View className="flex-row gap-3 mb-4">
             <View className="flex-1">
  <Text className="text-sm font-medium text-gray-700 mb-2">
    Price / {packageMeasurement || 'unit'} (₹)
  </Text>
  <TextInput
    className="bg-gray-50 border-2 border-gray-300 rounded-xl p-3 text-base text-gray-900"
    placeholder="₹"
    value={gp.pricePerUnit}
    onChangeText={(value) => handleGradePriceChange(index, "pricePerUnit", value)}
    keyboardType="numeric"
  />
</View>
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-700 mb-2">Total Qty</Text>
                <TextInput
                  className="bg-gray-50 border-2 border-gray-300 rounded-xl p-3 text-base text-gray-900"
                  placeholder="Qty"
                  value={gp.totalQty}
                  onChangeText={(value) => handleGradePriceChange(index, "totalQty", value)}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Capture Media</Text>
              <View className="flex-row gap-2">
                <TouchableOpacity
                  className="bg-blue-600 p-4 rounded-xl items-center flex-1 shadow-md active:bg-blue-700"
                  onPress={() => handleGradePhotoUpload(index, true, 'photo')}
                >
                  <Text className="text-white text-base font-medium">
                    📷 Photo
                  </Text>
                </TouchableOpacity>
              </View>
              <Text className="text-xs text-gray-500 mt-1 text-center">
                ({gp.photos.length}/3 media items)
              </Text>
            </View> */}
            <View className="mb-4">
  <Text className="text-sm font-medium text-gray-700 mb-2">Capture Media</Text>
  
  {/* Camera Row */}
  <View className="flex-row gap-2 mb-2">
    <TouchableOpacity
      className="bg-blue-600 p-4 rounded-xl items-center flex-1 shadow-md active:bg-blue-700"
      onPress={() => handleGradePhotoUpload(index, true, 'photo')}
    >
      <Text className="text-white text-base font-medium">
        📷 Camera
      </Text>
    </TouchableOpacity>
    
    {/* <TouchableOpacity
      className="bg-purple-600 p-4 rounded-xl items-center flex-1 shadow-md active:bg-purple-700"
      onPress={() => handleGradePhotoUpload(index, true, 'video')}
    >
      <Text className="text-white text-base font-medium">
        🎥 Video
      </Text>
    </TouchableOpacity> */}
  </View>
  
  {/* Gallery Row */}
  <TouchableOpacity
    className="bg-green-600 p-4 rounded-xl items-center shadow-md active:bg-green-700"
    onPress={() => handleGradePhotoUpload(index, false, 'photo')}
  >
    <Text className="text-white text-base font-medium">
      🖼️ Choose from Gallery
    </Text>
  </TouchableOpacity>
  
  <Text className="text-xs text-gray-500 mt-2 text-center">
    ({gp.photos.length}/3 media items)
  </Text>
</View>
 <View className="bg-amber-50 border border-amber-300 rounded-lg p-3 mt-2">
    {/* <Text className="text-xs text-amber-800 font-medium text-center">
      ⚠️ Note: Videos must be below 5MB for successful upload
    </Text> */}
  </View>
 {gp.pricePerUnit && gp.totalQty && (
      <View className="bg-blue-50 p-3 rounded-lg mt-3 border border-blue-200">
        <Text className="text-sm font-medium text-gray-700">
          {gp.grade} Total: ₹{calculateGradeTotal(gp.pricePerUnit, gp.totalQty)}
        </Text>
      </View>
    )}
            {gp.photos.length > 0 && (
              <View className="flex-row flex-wrap gap-2">
                {gp.photos.map((photo, photoIdx) => (
                  <View key={photoIdx} className="w-[100px] h-[100px] relative">
                    {photo.type === 'video' ? (
                      <View className="w-full h-full rounded-xl bg-gray-800 items-center justify-center">
                        <Text className="text-white text-2xl">▶️</Text>
                        {photo.duration && (
                          <Text className="text-white text-xs mt-1">
                            {Math.round(photo.duration)}s
                          </Text>
                        )}
                      </View>
                    ) : (
                      <Image source={{ uri: photo.uri }} className="w-full h-full rounded-xl" />
                    )}
                    
                    {photo.timestamp && photo.type !== 'video' && (
                      <View className="absolute bottom-0 left-0 right-0 bg-black/70 px-1 py-0.5">
                        <Text className="text-white text-[8px] font-medium text-center">
                          {photo.timestamp}
                        </Text>
                      </View>
                    )}
                    
                    <TouchableOpacity
                      className="absolute top-1 right-1 bg-red-500 w-7 h-7 rounded-full items-center justify-center shadow-lg"
                      onPress={() => {
                        setGradePrices(prev => {
                          const updated = [...prev];
                          updated[index].photos = updated[index].photos.filter((_, idx) => idx !== photoIdx);
                          return updated;
                        });
                      }}
                    >
                      <Text className="text-white font-medium text-lg">×</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </View>
    ))}
{selectedGrades.length > 0 && (
  <View className="bg-green-50 p-5 rounded-xl mb-6 border-2 border-green-300">
    <Text className="text-xl font-bold text-gray-900 text-center">
      Grand Total: ₹{calculateGrandTotal()}
    </Text>
  </View>
)}
    <View className="flex-row gap-3 mt-8 mb-[150px]">
      <TouchableOpacity 
        className="bg-gray-500 flex-1 py-4 rounded-xl shadow-lg active:bg-gray-600" 
        onPress={prevStep}
      >
        <Text className="text-white text-center text-lg font-medium">← Previous</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        className="bg-green-600 flex-1 py-4 rounded-xl shadow-lg active:bg-green-700" 
        onPress={nextStep}
      >
        <Text className="text-white text-center text-lg font-medium">Next Step →</Text>
      </TouchableOpacity>
    </View>
  </View>
);

  const renderStep4 = () => (
    <View>
      <Text className="text-2xl font-medium text-gray-900 mb-6">Final Details</Text>

      <View className="mb-6">
        <Text className="text-base font-medium text-gray-900 mb-3">Farm Location</Text>
        <TouchableOpacity 
          className="bg-green-600 py-4 rounded-xl items-center mb-3 shadow-lg active:bg-green-700"
          onPress={getCurrentLocation}
          disabled={isGettingLocation}
        >
          {isGettingLocation ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-base font-medium">📍 Get Current Location</Text>
          )}
        </TouchableOpacity>

        <View className="bg-gray-50 border-2 border-gray-300 rounded-xl p-4">
          <Text className="text-sm text-gray-700 mb-1 font-medium">
            Latitude: {farmLocation.latitude.toFixed(6)}
          </Text>
          <Text className="text-sm text-gray-700 font-medium">
            Longitude: {farmLocation.longitude.toFixed(6)}
          </Text>
        </View>
      </View>

      <View className="mb-6">
        <Text className="text-base font-medium text-gray-900 mb-2">Delivery Date</Text>
        <TouchableOpacity 
          className="bg-white border-2 border-gray-300 rounded-xl p-4 mb-4 shadow-sm"
          onPress={() => setShowDatePicker(true)}
        >
          <Text className="text-base text-gray-900 font-medium">📅 {formatDate(deliveryDate)}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker 
            value={deliveryDate} 
            mode="date" 
            display="default" 
            onChange={(event, date) => {
              setShowDatePicker(false);
              if (date) setDeliveryDate(date);
            }}
            minimumDate={new Date()} 
          />
        )}
        
        <Text className="text-base font-medium text-gray-900 mb-2">Delivery Time</Text>
        <TouchableOpacity 
          className="bg-white border-2 border-gray-300 rounded-xl p-4 shadow-sm"
          onPress={() => setShowTimePicker(true)}
        >
          <Text className="text-base text-gray-900 font-medium">🕐 {formatTime(deliveryTime)}</Text>
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker 
            value={deliveryTime} 
            mode="time" 
            display="default" 
            onChange={(event, time) => {
              setShowTimePicker(false);
              if (time) setDeliveryTime(time);
            }}
          />
        )}
      </View>

      <View className="mb-6">
        {/* <Text className="text-base font-medium text-gray-900 mb-3">Upload Crop Photos</Text>
        <TouchableOpacity
          className="bg-blue-500 p-4 rounded-xl items-center mb-4 shadow-lg active:bg-blue-600"
          onPress={handlePhotoUpload}
          disabled={cropPhotos.length >= 3}
        >
          <Text className="text-white text-base font-medium">
            📸 Select Photos ({cropPhotos.length}/3)
          </Text>
        </TouchableOpacity> */}

        {cropPhotos.length > 0 && (
          <View className="flex-row flex-wrap gap-2">
            {cropPhotos.map((photo, index) => (
              <View key={index} className="w-[100px] h-[100px] relative">
                <Image source={{ uri: photo.uri }} className="w-full h-full rounded-xl" />
                <TouchableOpacity
                  className="absolute top-1 right-1 bg-red-500 w-7 h-7 rounded-full items-center justify-center shadow-lg"
                  onPress={() => setCropPhotos(prev => prev.filter((_, i) => i !== index))}
                >
                  <Text className="text-white font-medium text-lg">×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>

      <View className="mb-6">
        <Text className="text-base font-medium text-gray-900 mb-2">Nearest Market</Text>
        <TextInput
          className="bg-white border-2 border-gray-300 rounded-xl p-4 text-base text-gray-900 mb-4 shadow-sm"
          placeholder="🔍 Search markets..."
          value={marketSearch}
          onChangeText={handleMarketSearch}
        />
        
        <CustomPicker
          label=""
          value={nearestMarket}
          options={filteredMarkets.map(m => ({
            label: `${m.marketName} - ${m.district}`,
            value: m._id
          }))}
          onValueChange={setNearestMarket}
          placeholder="Select Market"
        />
      </View>

      <View className="flex-row gap-3 mt-8 mb-[150px]">
        <TouchableOpacity 
          className="bg-gray-500 flex-1 py-4 rounded-xl shadow-lg active:bg-gray-600" 
          onPress={prevStep}
          disabled={isSubmitting}
        >
          <Text className="text-white text-center text-lg font-medium">← Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className="bg-green-600 flex-1 py-4 rounded-xl shadow-lg active:bg-green-700" 
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-center text-lg font-medium">Submit Post</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <>
    <View className="flex-1 bg-gray-50">
      <View className="flex-row items-center p-4 bg-white border-b-2 border-gray-200">
        <TouchableOpacity onPress={goBack} className="p-2 mr-2">
          <ChevronLeft size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-xl font-medium text-gray-900">
          Step {step} of 4
        </Text>
      </View>

      <ScrollView 
        className="flex-1" 
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="p-5">
          {/* {step === 1 && renderStep1()} */}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </View>
      </ScrollView>
    </View>

      <CustomAlert
  visible={showAlert}
  title={alertTitle}
  message={alertMessage}
  onClose={() => {
    setShowAlert(false);
    if (alertAction) alertAction();  
  }}
/>
    </>
  );
};

export default SellProductForm;