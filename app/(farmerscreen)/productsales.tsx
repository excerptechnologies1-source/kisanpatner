// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import DateTimePicker from "@react-native-community/datetimepicker";
// // import { Picker } from "@react-native-picker/picker";
// // import axios from "axios";
// // import * as ImagePicker from "expo-image-picker";
// // import * as Location from "expo-location";
// // import { ChevronLeft } from "lucide-react-native";
// // import React, { useEffect, useState } from "react";
// // import {
// //   ActivityIndicator,
// //   Alert,
// //   Image,
// //   Modal,
// //   Platform,
// //   ScrollView,
// //   Text,
// //   TextInput,
// //   TouchableOpacity,
// //   View,
// // } from "react-native";

// // interface Category {
// //   _id: string;
// //   categoryId: string;
// //   categoryName: string;
// // }

// // interface SubCategory {
// //   _id: string;
// //   subCategoryId: string;
// //   subCategoryName: string;
// //   categoryId: string;
// // }

// // interface GradePrice {
// //   grade: string;
// //   pricePerUnit: string;
// //   totalQty: string;
// //   quantityType: string;
// //   priceType: string;
// // }

// // interface CapturedPhoto {
// //   uri: string;
// //   watermarkedUri?: string;
// // }

// // const SellProductForm: React.FC = () => {
// //   const [step, setStep] = useState(1);

// //   // Step 1: Category & Basic Info
// //   const [categories, setCategories] = useState<Category[]>([]);
// //   const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
// //   const [selectedCategory, setSelectedCategory] = useState("");
// //   const [selectedSubCategory, setSelectedSubCategory] = useState("");
// //   const [cropBriefDetails, setCropBriefDetails] = useState("");

// //   // Step 2: Farming & Packaging Details
// //   const [farmingType, setFarmingType] = useState("");
// //   const [typeOfSeeds, setTypeOfSeeds] = useState("");
// //   const [packagingType, setPackagingType] = useState("");
// //   const [packageMeasurement, setPackageMeasurement] = useState("");
// //   const [unitMeasurement, setUnitMeasurement] = useState("");

// //   const [showDatePicker, setShowDatePicker] = useState(false);
// //   const [showTimePicker, setShowTimePicker] = useState(false);

// //   // Step 3: Grade & Pricing
// //   const [gradePrices, setGradePrices] = useState<GradePrice[]>([
// //     { grade: "A Grade", pricePerUnit: "", totalQty: "", quantityType: "", priceType: "" },
// //     { grade: "B Grade", pricePerUnit: "", totalQty: "", quantityType: "", priceType: "" },
// //     { grade: "All Mixed Grades", pricePerUnit: "", totalQty: "", quantityType: "", priceType: "" },
// //   ]);
// //   const [gradeCounter, setGradeCounter] = useState(2);
// //   const [selectedGrades, setSelectedGrades] = useState<string[]>([]);

// //   // Step 4: Final Details
// //   const [deliveryDate, setDeliveryDate] = useState(new Date());
// //   const [deliveryTime, setDeliveryTime] = useState(new Date());
// //   const [nearestMarket, setNearestMarket] = useState("");
// //   const [cropPhotos, setCropPhotos] = useState<CapturedPhoto[]>([]);
// //   const [farmLocation, setFarmLocation] = useState({
// //     latitude: 12.9716,
// //     longitude: 77.5946,
// //   });

// //   // Camera States
// //   const [showCamera, setShowCamera] = useState(false);
// //   const [capturedImage, setCapturedImage] = useState<string | null>(null);
// //   const [gpsText, setGpsText] = useState("");

// //   // Map States
// //   const [showLocationPicker, setShowLocationPicker] = useState(false);
// //   const [isGettingLocation, setIsGettingLocation] = useState(false);

// //   useEffect(() => {
// //     fetchCategories();
// //     requestLocationPermission();
// //   }, []);

// //   const requestLocationPermission = async () => {
// //     try {
// //       const { status } = await Location.requestForegroundPermissionsAsync();
// //       if (status === "granted") {
// //         const location = await Location.getCurrentPositionAsync({});
// //         setFarmLocation({
// //           latitude: location.coords.latitude,
// //           longitude: location.coords.longitude,
// //         });
// //       }
// //     } catch (error) {
// //       console.error("Error getting location:", error);
// //     }
// //   };

// //   const fetchCategories = async () => {
// //     try {
// //       const res = await axios.get("https://kisan.etpl.ai/category/all");
// //       setCategories(res.data.data);
// //     } catch (error) {
// //       console.error("Error fetching categories:", error);
// //     }
// //   };

// //   const fetchSubCategories = async (categoryId: string) => {
// //     try {
// //       const res = await axios.get(
// //         `https://kisan.etpl.ai/subcategory/category/${categoryId}`
// //       );
// //       setSubCategories(res.data.data);
// //     } catch (error) {
// //       console.error("Error fetching subcategories:", error);
// //     }
// //   };

// //   const onDateChange = (event: any, selectedDate?: Date) => {
// //     setShowDatePicker(Platform.OS === "ios");
// //     if (selectedDate) {
// //       setDeliveryDate(selectedDate);
// //     }
// //   };

// //   const onTimeChange = (event: any, selectedTime?: Date) => {
// //     setShowTimePicker(Platform.OS === "ios");
// //     if (selectedTime) {
// //       setDeliveryTime(selectedTime);
// //     }
// //   };

// //   const formatDate = (date: Date) => {
// //     const year = date.getFullYear();
// //     const month = String(date.getMonth() + 1).padStart(2, "0");
// //     const day = String(date.getDate()).padStart(2, "0");
// //     return `${year}-${month}-${day}`;
// //   };

// //   const formatTime = (date: Date) => {
// //     const hours = String(date.getHours()).padStart(2, "0");
// //     const minutes = String(date.getMinutes()).padStart(2, "0");
// //     return `${hours}:${minutes}`;
// //   };

// //   const handleCategoryChange = (categoryId: string) => {
// //     setSelectedCategory(categoryId);
// //     setSelectedSubCategory("");
// //     if (categoryId) {
// //       fetchSubCategories(categoryId);
// //     } else {
// //       setSubCategories([]);
// //     }
// //   };

// //   const handleGradeToggle = (grade: string) => {
// //     if (selectedGrades.includes(grade)) {
// //       setSelectedGrades(selectedGrades.filter((g) => g !== grade));
// //     } else {
// //       setSelectedGrades([...selectedGrades, grade]);
// //     }
// //   };

// //   const handleGradePriceChange = (
// //     index: number,
// //     field: string,
// //     value: string
// //   ) => {
// //     const updated = [...gradePrices];
// //     updated[index] = { ...updated[index], [field]: value };
// //     setGradePrices(updated);
// //   };

// //   const handleAddGrade = () => {
// //     const nextGrade = String.fromCharCode(65 + gradeCounter);
// //     const newGrade: GradePrice = {
// //       grade: `${nextGrade} Grade`,
// //       pricePerUnit: "",
// //       totalQty: "",
// //       quantityType: "",
// //       priceType: ""
// //     };
// //     setGradePrices([...gradePrices.slice(0, -1), newGrade, gradePrices[gradePrices.length - 1]]);
// //     setGradeCounter(gradeCounter + 1);
// //   };

// //   // Camera Functions
// //   const openCamera = async () => {
// //     try {
// //       console.log("Opening camera...");

// //       const { status } = await ImagePicker.requestCameraPermissionsAsync();
// //       if (status !== "granted") {
// //         Alert.alert("Permission Denied", "Camera permission is required");
// //         return;
// //       }

// //       console.log("Camera permission granted, launching camera...");

// //       const result = await ImagePicker.launchCameraAsync({
// //         mediaTypes: ImagePicker.MediaTypeOptions.Images,
// //         allowsEditing: false,
// //         quality: 0.3,
// //         exif: false,
// //         base64: false,
// //       });

// //       console.log("Camera result:", result);

// //       if (result.canceled) {
// //         console.log("User cancelled camera");
// //         return;
// //       }

// //       if (result.assets && result.assets[0]) {
// //         const imageUri = result.assets[0].uri;
// //         console.log("Image captured:", imageUri);

// //         try {
// //           console.log("Getting location...");
// //           const loc = await Location.getCurrentPositionAsync({
// //             accuracy: Location.Accuracy.Balanced,
// //           });

// //           const text = `Lat: ${loc.coords.latitude.toFixed(6)}\nLon: ${loc.coords.longitude.toFixed(6)}\n${new Date().toLocaleString()}`;

// //           console.log("Location obtained:", text);
// //           setGpsText(text);
// //           setCapturedImage(imageUri);
// //         } catch (locError) {
// //           console.error("Error getting location:", locError);
// //           const text = `Location unavailable\n${new Date().toLocaleString()}`;
// //           setGpsText(text);
// //           setCapturedImage(imageUri);
// //         }
// //       }
// //     } catch (error) {
// //       console.error("Camera error:", error);
// //       Alert.alert("Error", "Failed to open camera. Please try again.");
// //     }
// //   };

// //   const saveWithWatermark = async () => {
// //     try {
// //       console.log("Saving photo...");

// //       if (!capturedImage) {
// //         Alert.alert("Error", "No image to save");
// //         return;
// //       }

// //       if (cropPhotos.length >= 3) {
// //         Alert.alert("Limit Reached", "Maximum 3 photos allowed");
// //         setCapturedImage(null);
// //         setGpsText("");
// //         return;
// //       }

// //       const newPhoto = {
// //         uri: capturedImage,
// //         watermarkedUri: capturedImage,
// //         timestamp: new Date().toISOString()
// //       };

// //       console.log("Adding photo:", newPhoto);

// //       setCropPhotos([...cropPhotos, newPhoto]);
// //       setCapturedImage(null);
// //       setGpsText("");

// //       Alert.alert("Success", "Photo saved!");
// //     } catch (error) {
// //       console.error("Error saving photo:", error);
// //       Alert.alert("Error", "Failed to save photo");
// //     }
// //   };

// //   const removePhoto = (index: number) => {
// //     const updated = cropPhotos.filter((_, i) => i !== index);
// //     setCropPhotos(updated);
// //   };

// //   // Location Functions
// //   const getCurrentLocation = async () => {
// //     setIsGettingLocation(true);
// //     try {
// //       const { status } = await Location.requestForegroundPermissionsAsync();
// //       if (status !== "granted") {
// //         Alert.alert("Permission Denied", "Location permission is required");
// //         setIsGettingLocation(false);
// //         return;
// //       }

// //       const location = await Location.getCurrentPositionAsync({
// //         accuracy: Location.Accuracy.High,
// //       });

// //       setFarmLocation({
// //         latitude: location.coords.latitude,
// //         longitude: location.coords.longitude,
// //       });

// //       Alert.alert("Success", "Current location captured!");
// //     } catch (error) {
// //       console.error("Error getting location:", error);
// //       Alert.alert("Error", "Failed to get current location");
// //     } finally {
// //       setIsGettingLocation(false);
// //     }
// //   };

// //   const openLocationPicker = () => {
// //     setShowLocationPicker(true);
// //   };

// //   const saveManualLocation = () => {
// //     if (farmLocation.latitude && farmLocation.longitude) {
// //       setShowLocationPicker(false);
// //       Alert.alert("Success", "Location saved!");
// //     } else {
// //       Alert.alert("Error", "Please enter valid coordinates");
// //     }
// //   };

// //   const handleSubmit = async () => {
// //     if (cropPhotos.length > 3) {
// //       Alert.alert("Too Many Photos", "Please limit to 3 photos maximum.");
// //       return;
// //     }

// //     if (!selectedCategory || !selectedSubCategory) {
// //       Alert.alert("Missing Information", "Please fill in all required fields");
// //       return;
// //     }

// //     if (!cropBriefDetails || !farmingType || !typeOfSeeds) {
// //       Alert.alert("Missing Information", "Please fill in all farming details");
// //       return;
// //     }

// //     if (!packagingType || !packageMeasurement) {
// //       Alert.alert("Missing Information", "Please fill in packaging details");
// //       return;
// //     }

// //     if (selectedGrades.length === 0) {
// //       Alert.alert("Missing Information", "Please select at least one grade");
// //       return;
// //     }

// //     // ✅ ADD VALIDATION FOR GRADE PRICES
// //     const selectedGradeObjects = gradePrices.filter((gp) =>
// //       selectedGrades.includes(gp.grade)
// //     );

// //     for (const gp of selectedGradeObjects) {
// //       if (!gp.pricePerUnit || !gp.totalQty || !gp.quantityType || !gp.priceType) {
// //         Alert.alert(
// //           "Incomplete Grade Information",
// //           `Please fill all fields for ${gp.grade} including Quantity Type and Price Type`
// //         );
// //         return;
// //       }
// //     }

// //     if (!nearestMarket) {
// //       Alert.alert("Missing Information", "Please enter nearest market");
// //       return;
// //     }
// // const farmerId = await AsyncStorage.getItem('farmerId');
// //     const formData = new FormData();
// //     formData.append("farmerId", farmerId || "");
// //     formData.append("categoryId", selectedCategory);
// //     formData.append("subCategoryId", selectedSubCategory);
// //     formData.append("cropBriefDetails", cropBriefDetails);
// //     formData.append("farmingType", farmingType);
// //     formData.append("typeOfSeeds", typeOfSeeds);
// //     formData.append("packagingType", packagingType);
// //     formData.append("packageMeasurement", packageMeasurement);
// //     formData.append("unitMeasurement", unitMeasurement);
// //     formData.append("deliveryDate", formatDate(deliveryDate));
// //     formData.append("deliveryTime", formatTime(deliveryTime));
// //     formData.append("nearestMarket", nearestMarket);

// //     formData.append("farmLocation", JSON.stringify({
// //       lat: farmLocation.latitude.toString(),
// //       lng: farmLocation.longitude.toString()
// //     }));

// //     // ✅ FIXED: Include quantityType and priceType
// //     const selectedGradeData = gradePrices
// //       .filter((gp) => selectedGrades.includes(gp.grade))
// //       .map((gp) => ({
// //         grade: gp.grade,
// //         pricePerUnit: parseFloat(gp.pricePerUnit) || 0,
// //         totalQty: parseFloat(gp.totalQty) || 0,
// //         quantityType: gp.quantityType,  // ✅ Added
// //         priceType: gp.priceType,        // ✅ Added
// //       }));

// //     formData.append("gradePrices", JSON.stringify(selectedGradeData));

// //     cropPhotos.forEach((photo, index) => {
// //       const photoUri = photo.watermarkedUri || photo.uri;
// //       const normalizedUri = photoUri.startsWith('file://')
// //         ? photoUri
// //         : `file://${photoUri}`;

// //       formData.append("photos", {
// //         uri: normalizedUri,
// //         type: "image/jpeg",
// //         name: `crop_photo_${Date.now()}_${index}.jpg`,
// //       } as any);
// //     });

// //     try {
// //       console.log("Submitting product...");
// //       console.log("Grade data being sent:", selectedGradeData); // ✅ Debug log

// //       const response = await axios.post(
// //         "https://kisan.etpl.ai/product/add",
// //         formData,
// //         {
// //           headers: {
// //             "Content-Type": "multipart/form-data",
// //           },
// //           timeout: 30000,
// //           maxContentLength: Infinity,
// //           maxBodyLength: Infinity,
// //         }
// //       );

// //       console.log("Response:", response.data);
// //       Alert.alert("Success", "Product added successfully!");
// //       setStep(1);
// //       resetForm();
// //     } catch (error: any) {
// //       console.error("Error submitting product:", error);
// //       console.error("Error response:", error.response?.data);

// //       if (error.response?.status === 413) {
// //         Alert.alert(
// //           "Upload Too Large",
// //           "The images are too large. Please use fewer photos or lower quality."
// //         );
// //       } else if (error.response?.status === 500) {
// //         Alert.alert(
// //           "Server Error",
// //           "Server error: " + (error.response?.data?.message || "Please try again")
// //         );
// //       } else if (error.response?.status === 400) {
// //         Alert.alert(
// //           "Validation Error",
// //           "Invalid data: " + (error.response?.data?.message || "Please check all fields")
// //         );
// //       } else if (error.code === 'ECONNABORTED') {
// //         Alert.alert(
// //           "Timeout",
// //           "Upload timed out. Please try again with fewer/smaller photos."
// //         );
// //       } else if (error.code === 'ECONNREFUSED') {
// //         Alert.alert(
// //           "Connection Error",
// //           "Cannot connect to server. Please check your internet connection."
// //         );
// //       } else {
// //         Alert.alert(
// //           "Error",
// //           "Failed to submit: " + (error.message || "Unknown error")
// //         );
// //       }
// //     }
// //   };

// //   const resetForm = () => {
// //     setSelectedCategory("");
// //     setSelectedSubCategory("");
// //     setCropBriefDetails("");
// //     setFarmingType("");
// //     setTypeOfSeeds("");
// //     setPackagingType("");
// //     setPackageMeasurement("");
// //     setUnitMeasurement("");
// //     setSelectedGrades([]);
// //     setDeliveryDate(new Date());
// //     setDeliveryTime(new Date());
// //     setNearestMarket("");
// //     setCropPhotos([]);
// //     setGradePrices([
// //       { grade: "A Grade", pricePerUnit: "", totalQty: "", quantityType: "", priceType: "" },
// //       { grade: "B Grade", pricePerUnit: "", totalQty: "", quantityType: "", priceType: "" },
// //       { grade: "All Mixed Grades", pricePerUnit: "", totalQty: "", quantityType: "", priceType: "" },
// //     ]);
// //     setGradeCounter(2);
// //   };

// //   const nextStep = () => {
// //     if (step < 4) setStep(step + 1);
// //   };

// //   const prevStep = () => {
// //     if (step > 1) setStep(step - 1);
// //   };

// //   const getStepTitle = () => {
// //     switch(step) {
// //       case 1: return "Category & Product";
// //       case 2: return "Farming & Packaging";
// //       case 3: return "Pricing & Details";
// //       case 4: return "Final Details";
// //       default: return "Sell Your Produce";
// //     }
// //   };

// //   const renderProgressBar = () => {
// //     const totalSteps = 4;
// //     const progress = (step - 1) / (totalSteps - 1);

// //     return (
// //       <View className="relative py-4 ">
// //         <View className="absolute top-5 left-10 right-10 h-0.5">
// //           <View className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200" />
// //           <View
// //             className="absolute top-0 left-0 h-0.5 bg-green-600"
// //             style={{ width: `${progress * 100}%` }}
// //           />
// //         </View>

// //         <View className="flex-row justify-between px-6 py-4">
// //           {[1, 2, 3, 4].map((stepNum) => (
// //             <View key={stepNum} className="items-center z-10">
// //               <View
// //                 className={`
// //                   w-8 h-8 rounded-full items-center justify-center border-2
// //                   ${step >= stepNum
// //                     ? "bg-green-600 border-green-600"
// //                     : "bg-white border-gray-300"
// //                   }
// //                 `}
// //               >
// //                 <Text
// //                   className={`
// //                     font-medium
// //                     ${step >= stepNum ? "text-white" : "text-gray-400"}
// //                   `}
// //                 >
// //                   {stepNum}
// //                 </Text>
// //               </View>
// //               <Text
// //                 className={`
// //                   text-xs mt-1 text-center
// //                   ${step >= stepNum
// //                     ? "text-green-600 font-medium"
// //                     : "text-gray-500"
// //                   }
// //                 `}
// //               >
// //                 {stepNum === 1 && "Category"}
// //                 {stepNum === 2 && "Farming"}
// //                 {stepNum === 3 && "Pricing"}
// //                 {stepNum === 4 && "Details"}
// //               </Text>
// //             </View>
// //           ))}
// //         </View>
// //       </View>
// //     );
// //   };

// //   return (
// //     <View className="flex-1 bg-white">
// //       {/* Header with back button */}
// //       <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-200">
// //         <TouchableOpacity
// //           onPress={prevStep}
// //           activeOpacity={0.7}
// //           className="p-2 rounded-full"
// //         >
// //           <ChevronLeft size={20} color="#064E3B" />
// //         </TouchableOpacity>

// //         <Text className="text-lg font-medium text-gray-900 ml-2">
// //           {getStepTitle()}
// //         </Text>
// //       </View>

// //       {/* Image Preview with GPS Info Modal */}
// //       <Modal visible={!!capturedImage} animationType="slide" transparent={false}>
// //         <View className="flex-1 bg-black">
// //           <View className="flex-1">
// //             {capturedImage ? (
// //               <Image
// //                 source={{ uri: capturedImage }}
// //                 className="flex-1 w-full"
// //                 resizeMode="contain"
// //                 onError={(error) => {
// //                   console.error("Image load error:", error.nativeEvent);
// //                   Alert.alert("Error", "Failed to load image");
// //                   setCapturedImage(null);
// //                   setGpsText("");
// //                 }}
// //                 onLoad={() => console.log("Image loaded successfully")}
// //               />
// //             ) : null}
// //             {gpsText ? (
// //               <View className="absolute bottom-10 left-5 right-5">
// //                 <Text className="text-white bg-black/70 p-3 text-base font-medium rounded-lg">
// //                   {gpsText}
// //                 </Text>
// //               </View>
// //             ) : null}
// //           </View>
// //           <View className="flex-row p-4 bg-black">
// //             <TouchableOpacity
// //               className="flex-1 py-3 rounded-lg mx-2 bg-red-500"
// //               onPress={() => {
// //                 setCapturedImage(null);
// //                 setGpsText("");
// //               }}
// //             >
// //               <Text className="text-white text-center font-medium">Retake</Text>
// //             </TouchableOpacity>
// //             <TouchableOpacity
// //               className="flex-1 py-3 rounded-lg mx-2 bg-green-500"
// //               onPress={saveWithWatermark}
// //             >
// //               <Text className="text-white text-center font-medium">Save Photo</Text>
// //             </TouchableOpacity>
// //           </View>
// //         </View>
// //       </Modal>

// //       {/* Map Picker Modal */}
// //       <Modal visible={showLocationPicker} animationType="slide" transparent={true}>
// //         <View className="flex-1 bg-black/50 justify-center items-center">
// //           <View className="bg-white rounded-xl p-6 w-5/6 max-h-[70%]">
// //             <Text className="text-xl font-medium mb-5 text-center">Enter Farm Location</Text>

// //             <Text className="font-medium mb-2 text-base">Latitude</Text>
// //             <TextInput
// //               className="bg-white border border-gray-300 rounded-lg px-3 py-3 mb-4 text-base text-gray-900"
// //               placeholder="e.g., 12.9716"
// //               value={farmLocation.latitude.toString()}
// //               onChangeText={(text) =>
// //                 setFarmLocation({
// //                   ...farmLocation,
// //                   latitude: parseFloat(text) || 0,
// //                 })
// //               }
// //               keyboardType="numeric"
// //             />

// //             <Text className="font-medium mb-2 text-base">Longitude</Text>
// //             <TextInput
// //               className="bg-white border border-gray-300 rounded-lg px-3 py-3 mb-4 text-base text-gray-900"
// //               placeholder="e.g., 77.5946"
// //               value={farmLocation.longitude.toString()}
// //               onChangeText={(text) =>
// //                 setFarmLocation({
// //                   ...farmLocation,
// //                   longitude: parseFloat(text) || 0,
// //                 })
// //               }
// //               keyboardType="numeric"
// //             />

// //             <TouchableOpacity
// //               className="bg-green-600 py-3 rounded-lg mb-4"
// //               onPress={getCurrentLocation}
// //               disabled={isGettingLocation}
// //             >
// //               {isGettingLocation ? (
// //                 <ActivityIndicator color="#fff" />
// //               ) : (
// //                 <Text className="text-white text-center font-medium">📍 Use Current Location</Text>
// //               )}
// //             </TouchableOpacity>

// //             <View className="flex-row mt-6 gap-2">
// //               <TouchableOpacity
// //                 className="flex-1 py-3 rounded-lg mx-2 bg-gray-500"
// //                 onPress={() => setShowLocationPicker(false)}
// //               >
// //                 <Text className="text-white text-center font-medium">Cancel</Text>
// //               </TouchableOpacity>
// //               <TouchableOpacity
// //                 className="flex-1 py-3 rounded-lg mx-2 bg-green-600"
// //                 onPress={saveManualLocation}
// //               >
// //                 <Text className="text-white text-center font-medium">Save Location</Text>
// //               </TouchableOpacity>
// //             </View>
// //           </View>
// //         </View>
// //       </Modal>

// //       <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
// //         {renderProgressBar()}

// //         <View className="p-4">
// //           {/* Step 1: Category Selection */}
// //           {step === 1 && (
// //             <View>
// //               <Text className="text-base font-medium mb-2 text-gray-900">Select Category</Text>
// //               <View className="bg-white border border-gray-300 rounded-lg mb-4">
// //                 <Picker
// //                   selectedValue={selectedCategory}
// //                   onValueChange={handleCategoryChange}
// //                   className="h-12 w-full text-gray-900"
// //                 >
// //                   <Picker.Item label="Select Category" value="" />
// //                   {categories.map((c) => (
// //                     <Picker.Item key={c._id} label={c.categoryName} value={c._id} />
// //                   ))}
// //                 </Picker>
// //               </View>

// //               <Text className="text-base font-medium mb-2 text-gray-900">Select Sub Category</Text>
// //               <View className="bg-white border border-gray-300 rounded-lg mb-4">
// //                 <Picker
// //                   selectedValue={selectedSubCategory}
// //                   onValueChange={setSelectedSubCategory}
// //                   enabled={!!selectedCategory}
// //                   className="h-12 w-full text-gray-900"
// //                 >
// //                   <Picker.Item label="Select Sub Category" value="" />
// //                   {subCategories.map((s) => (
// //                     <Picker.Item
// //                       key={s._id}
// //                       label={s.subCategoryName}
// //                       value={s._id}
// //                     />
// //                   ))}
// //                 </Picker>
// //               </View>

// //               <View className="mb-6">
// //                 <Text className="text-base font-medium mb-2 text-gray-900">Crop Brief Details</Text>
// //                 <TextInput
// //                   className="bg-white border border-gray-300 rounded-lg px-3 py-3 text-base text-gray-900 min-h-[100px] text-align-top"
// //                   placeholder="Enter brief description (farming type, seeds type, organic/regular)"
// //                   value={cropBriefDetails}
// //                   onChangeText={setCropBriefDetails}
// //                   multiline
// //                   numberOfLines={4}
// //                   textAlignVertical="top"
// //                 />
// //               </View>

// //               <TouchableOpacity className="bg-green-600 py-3 rounded-lg" onPress={nextStep}>
// //                 <Text className="text-white text-center font-medium text-base">Next Step →</Text>
// //               </TouchableOpacity>
// //             </View>
// //           )}

// //           {/* Step 2: Farming & Packaging Details */}
// //           {step === 2 && (
// //             <View>
// //               <Text className="text-lg font-medium mb-2 text-gray-900">Farming & Packaging Details</Text>

// //               <View className="bg-gray-100 p-4 rounded-lg mb-4">
// //                 <Text className="text-base font-medium mb-2 text-gray-900">Farming Type</Text>
// //                 <View className="bg-white border border-gray-300 rounded-lg mb-4">
// //                   <Picker
// //                     selectedValue={farmingType}
// //                     onValueChange={setFarmingType}
// //                     className="h-12 w-full text-gray-900"
// //                   >
// //                     <Picker.Item label="Select Farming Type" value="" />
// //                     <Picker.Item label="Drop Down 1" value="drop down 1" />
// //                     <Picker.Item label="Regular" value="regular" />
// //                     <Picker.Item label="Organic" value="organic" />
// //                   </Picker>
// //                 </View>

// //                 <Text className="text-base font-medium mb-2 text-gray-900">Type of Seeds</Text>
// //                 <TextInput
// //                   className="bg-white border border-gray-300 rounded-lg px-3 py-3 mb-4 text-base text-gray-900"
// //                   placeholder="e.g., Naati, Hybrid"
// //                   value={typeOfSeeds}
// //                   onChangeText={setTypeOfSeeds}
// //                 />

// //                 <Text className="text-base font-medium mb-2 text-gray-900">Packaging Type</Text>
// //                 <View className="bg-white border border-gray-300 rounded-lg mb-4">
// //                   <Picker
// //                     selectedValue={packagingType}
// //                     onValueChange={setPackagingType}
// //                     className="h-12 w-full text-gray-900"
// //                   >
// //                     <Picker.Item label="Select Package Type" value="" />
// //                     <Picker.Item label="KGs" value="KGs" />
// //                     <Picker.Item label="Box" value="box" />
// //                     <Picker.Item label="Crate" value="crate" />
// //                     <Picker.Item label="Bunches" value="bunches" />
// //                     <Picker.Item label="Bag" value="bag" />
// //                     <Picker.Item label="Sack" value="sack" />
// //                     <Picker.Item label="Quanttal" value="quanttal" />
// //                     <Picker.Item label="Ton" value="ton" />
// //                   </Picker>
// //                 </View>

// //                 {packagingType === "KGs" && (
// //                   <>
// //                     <Text className="text-base font-medium mb-2 text-gray-900">Number of KGs</Text>
// //                     <View className="bg-white border border-gray-300 rounded-lg mb-4">
// //                       <Picker
// //                         selectedValue={packageMeasurement}
// //                         onValueChange={setPackageMeasurement}
// //                         className="h-12 w-full text-gray-900"
// //                       >
// //                         <Picker.Item label="Select KG" value="" />
// //                         <Picker.Item label="1 KG" value="1" />
// //                         <Picker.Item label="2 KG" value="2" />
// //                         <Picker.Item label="3 KG" value="3" />
// //                         <Picker.Item label="4 KG" value="4" />
// //                         <Picker.Item label="5 KG" value="5" />
// //                       </Picker>
// //                     </View>
// //                   </>
// //                 )}

// //                 {(packagingType === "box" || packagingType === "crate") && (
// //                   <>
// //                     <Text className="text-base font-medium mb-2 text-gray-900">Measurement</Text>
// //                     <View className="bg-white border border-gray-300 rounded-lg mb-4">
// //                       <Picker
// //                         selectedValue={packageMeasurement}
// //                         onValueChange={setPackageMeasurement}
// //                         className="h-12 w-full text-gray-900"
// //                       >
// //                         <Picker.Item label="Select Measurement" value="" />
// //                         <Picker.Item label="10kg Box" value="10kg" />
// //                         <Picker.Item label="12kg Box" value="12kg" />
// //                         <Picker.Item label="15kg Box" value="15kg" />
// //                         <Picker.Item label="18kg Box" value="18kg" />
// //                         <Picker.Item label="20kg Box" value="20kg" />
// //                         <Picker.Item label="25kg Box" value="25kg" />
// //                       </Picker>
// //                     </View>
// //                   </>
// //                 )}

// //                 {packagingType === "bag" && (
// //                   <>
// //                     <Text className="text-base font-medium mb-2 text-gray-900">Bag Measurement</Text>
// //                     <View className="bg-white border border-gray-300 rounded-lg mb-4">
// //                       <Picker
// //                         selectedValue={packageMeasurement}
// //                         onValueChange={setPackageMeasurement}
// //                         className="h-12 w-full text-gray-900"
// //                       >
// //                         <Picker.Item label="Select Bag Size" value="" />
// //                         <Picker.Item label="10kg Bag" value="10kg" />
// //                         <Picker.Item label="15kg Bag" value="15kg" />
// //                         <Picker.Item label="20kg Bag" value="20kg" />
// //                         <Picker.Item label="25kg Bag" value="25kg" />
// //                       </Picker>
// //                     </View>
// //                   </>
// //                 )}

// //                 {packagingType === "bunches" && (
// //                   <>
// //                     <Text className="text-base font-medium mb-2 text-gray-900">Bunch Size</Text>
// //                     <View className="bg-white border border-gray-300 rounded-lg mb-4">
// //                       <Picker
// //                         selectedValue={packageMeasurement}
// //                         onValueChange={setPackageMeasurement}
// //                         className="h-12 w-full text-gray-900"
// //                       >
// //                         <Picker.Item label="Select Size" value="" />
// //                         <Picker.Item label="Small" value="small" />
// //                         <Picker.Item label="Medium" value="medium" />
// //                         <Picker.Item label="Large" value="large" />
// //                       </Picker>
// //                     </View>
// //                   </>
// //                 )}

// //                 <Text className="text-base font-medium mb-2 text-gray-900">Unit Measurement (as per package type)</Text>
// //                 <TextInput
// //                   className="bg-white border border-gray-300 rounded-lg px-3 py-3 mb-4 text-base text-gray-900"
// //                   placeholder="e.g., kg per box, bag, etc."
// //                   value={unitMeasurement}
// //                   onChangeText={setUnitMeasurement}
// //                 />
// //               </View>

// //               <View className="flex-row gap-4 mt-6">
// //                 <TouchableOpacity
// //                   className="flex-1 py-3 rounded-lg bg-gray-500"
// //                   onPress={prevStep}
// //                 >
// //                   <Text className="text-white text-center font-medium">← Previous</Text>
// //                 </TouchableOpacity>
// //                 <TouchableOpacity
// //                   className="flex-1 py-3 rounded-lg bg-green-600"
// //                   onPress={nextStep}
// //                 >
// //                   <Text className="text-white text-center font-medium">Next Step →</Text>
// //                 </TouchableOpacity>
// //               </View>
// //             </View>
// //           )}

// //           {/* Step 3: Pricing & Details */}
// //           {step === 3 && (
// //             <View>
// //               <View className="flex-row justify-between items-center mb-4">
// //                 <Text className="text-lg font-medium text-gray-900">Add Pricing & Details</Text>
// //                 <TouchableOpacity
// //                   onPress={handleAddGrade}
// //                   className="bg-blue-500 px-4 py-2 rounded-lg"
// //                 >
// //                   <Text className="text-white font-medium text-lg">+ Add Grade</Text>
// //                 </TouchableOpacity>
// //               </View>

// //               <View className="bg-gray-100 p-4 rounded-lg mb-4">
// //                 {gradePrices.map((gp, index) => (
// //                   <View
// //                     key={index}
// //                     className={`
// //                       bg-white border rounded-lg p-4 mb-3
// //                       ${selectedGrades.includes(gp.grade)
// //                         ? "border-green-600 bg-green-50"
// //                         : "border-gray-300"
// //                       }
// //                     `}
// //                   >
// //                     <TouchableOpacity
// //                       className="flex-row items-center mb-3"
// //                       onPress={() => handleGradeToggle(gp.grade)}
// //                     >
// //                       <View
// //                         className={`
// //                           w-6 h-6 border-2 rounded mr-3 items-center justify-center
// //                           ${selectedGrades.includes(gp.grade)
// //                             ? "bg-green-600 border-green-600"
// //                             : "border-gray-400"
// //                           }
// //                         `}
// //                       >
// //                         {selectedGrades.includes(gp.grade) && (
// //                           <Text className="text-white font-medium">✓</Text>
// //                         )}
// //                       </View>
// //                       <Text className="text-base font-medium text-gray-900">{gp.grade}</Text>
// //                     </TouchableOpacity>

// //                     {selectedGrades.includes(gp.grade) && (
// //                       <View>
// //                         <Text className="text-sm font-medium mb-2 text-gray-700 mt-3">Quantity Type</Text>
// //                         <View className="bg-white border border-gray-300 rounded-lg mb-3">
// //                           <Picker
// //                             selectedValue={gp.quantityType}
// //                             onValueChange={(value) =>
// //                               handleGradePriceChange(index, "quantityType", value)
// //                             }
// //                             className="h-12 w-full text-gray-900"
// //                           >
// //                             <Picker.Item label="Select Type" value="" />
// //                             <Picker.Item label="Bulk" value="bulk" />
// //                             <Picker.Item label="Split" value="split" />
// //                           </Picker>
// //                         </View>

// //                         <Text className="text-sm font-medium mb-2 text-gray-700">Price Type</Text>
// //                         <View className="bg-white border border-gray-300 rounded-lg mb-3">
// //                           <Picker
// //                             selectedValue={gp.priceType}
// //                             onValueChange={(value) =>
// //                               handleGradePriceChange(index, "priceType", value)
// //                             }
// //                             className="h-12 w-full text-gray-900"
// //                           >
// //                             <Picker.Item label="Select Type" value="" />
// //                             <Picker.Item label="Fixed" value="fixed" />
// //                             <Picker.Item label="Negotiable" value="negotiable" />
// //                           </Picker>
// //                         </View>

// //                         <View className="flex-row gap-3 mt-3">
// //                           <View className="flex-1">
// //                             <Text className="text-sm font-medium mb-2 text-gray-700">Price / unit (₹)</Text>
// //                             <TextInput
// //                               className="bg-white border border-gray-300 rounded-lg px-3 py-3 text-base text-gray-900"
// //                               placeholder="₹"
// //                               value={gp.pricePerUnit}
// //                               onChangeText={(value) =>
// //                                 handleGradePriceChange(index, "pricePerUnit", value)
// //                               }
// //                               keyboardType="numeric"
// //                             />
// //                           </View>
// //                           <View className="flex-1">
// //                             <Text className="text-sm font-medium mb-2 text-gray-700">Total Qty</Text>
// //                             <TextInput
// //                               className="bg-white border border-gray-300 rounded-lg px-3 py-3 text-base text-gray-900"
// //                               placeholder="Qty"
// //                               value={gp.totalQty}
// //                               onChangeText={(value) =>
// //                                 handleGradePriceChange(index, "totalQty", value)
// //                               }
// //                               keyboardType="numeric"
// //                             />
// //                           </View>
// //                         </View>
// //                       </View>
// //                     )}
// //                   </View>
// //                 ))}
// //               </View>

// //               <View className="flex-row gap-4 mt-6">
// //                 <TouchableOpacity
// //                   className="flex-1 py-3 rounded-lg bg-gray-500"
// //                   onPress={prevStep}
// //                 >
// //                   <Text className="text-white text-center font-medium">← Previous</Text>
// //                 </TouchableOpacity>
// //                 <TouchableOpacity
// //                   className="flex-1 py-3 rounded-lg bg-green-600"
// //                   onPress={nextStep}
// //                 >
// //                   <Text className="text-white text-center font-medium">Next Step →</Text>
// //                 </TouchableOpacity>
// //               </View>
// //             </View>
// //           )}

// //           {/* Step 4: Final Details */}
// //           {step === 4 && (
// //             <View>
// //               <Text className="text-lg font-medium mb-2 text-gray-900">Final Details</Text>

// //               <View className="bg-gray-100 p-4 rounded-lg mb-4">
// //                 <Text className="text-base font-medium mb-2 text-gray-900">Farm Location</Text>
// //                 <TouchableOpacity
// //                   className="bg-orange-500 py-3 rounded-lg mb-3"
// //                   onPress={getCurrentLocation}
// //                   disabled={isGettingLocation}
// //                 >
// //                   {isGettingLocation ? (
// //                     <ActivityIndicator color="#fff" />
// //                   ) : (
// //                     <Text className="text-white text-center font-medium">📍 Get Current Location</Text>
// //                   )}
// //                 </TouchableOpacity>

// //                 <TouchableOpacity
// //                   className="bg-purple-600 py-3 rounded-lg mb-4"
// //                   onPress={openLocationPicker}
// //                 >
// //                   <Text className="text-white text-center font-medium">✏️ Enter Location Manually</Text>
// //                 </TouchableOpacity>

// //                 <View className="bg-white border border-gray-300 rounded-lg p-3 mb-4">
// //                   <Text className="text-sm text-gray-700">
// //                     Lat: {farmLocation.latitude.toFixed(6)}
// //                   </Text>
// //                   <Text className="text-sm text-gray-700">
// //                     Lon: {farmLocation.longitude.toFixed(6)}
// //                   </Text>
// //                 </View>

// //                 <View className="mt-4">
// //                   <Text className="text-base font-medium mb-2 text-gray-900">Delivery Date</Text>
// //                   <TouchableOpacity
// //                     className="bg-white border border-gray-300 rounded-lg p-3 mb-3"
// //                     onPress={() => setShowDatePicker(true)}
// //                   >
// //                     <Text className="text-base text-gray-900">📅 {formatDate(deliveryDate)}</Text>
// //                   </TouchableOpacity>
// //                   {showDatePicker && (
// //                     <DateTimePicker
// //                       value={deliveryDate}
// //                       mode="date"
// //                       display="default"
// //                       onChange={onDateChange}
// //                       minimumDate={new Date()}
// //                     />
// //                   )}

// //                   <Text className="text-base font-medium mb-2 text-gray-900">Delivery Time</Text>
// //                   <TouchableOpacity
// //                     className="bg-white border border-gray-300 rounded-lg p-3 mb-3"
// //                     onPress={() => setShowTimePicker(true)}
// //                   >
// //                     <Text className="text-base text-gray-900">🕐 {formatTime(deliveryTime)}</Text>
// //                   </TouchableOpacity>
// //                   {showTimePicker && (
// //                     <DateTimePicker
// //                       value={deliveryTime}
// //                       mode="time"
// //                       display="default"
// //                       onChange={onTimeChange}
// //                     />
// //                   )}
// //                 </View>

// //                 <View className="mt-4">
// //                   <Text className="text-base font-medium mb-2 text-gray-900">Upload Crop Photos</Text>
// //                   <Text className="text-sm text-gray-500 mb-3">Maximum 3 photos (compressed automatically)</Text>
// //                   <TouchableOpacity
// //                     className="bg-blue-500 py-3 rounded-lg mb-4"
// //                     onPress={openCamera}
// //                     disabled={cropPhotos.length >= 3}
// //                   >
// //                     <Text className="text-white text-center font-medium">
// //                       📷 Open Camera {cropPhotos.length >= 3 ? "(Limit Reached)" : `(${cropPhotos.length}/3)`}
// //                     </Text>
// //                   </TouchableOpacity>

// //                   {cropPhotos.length > 0 && (
// //                     <View className="flex-row flex-wrap -mx-1">
// //                       {cropPhotos.map((photo, index) => (
// //                         <View key={index} className="w-1/3 p-1 relative">
// //                           <Image
// //                             source={{ uri: photo.watermarkedUri || photo.uri }}
// //                             className="w-full aspect-square rounded-lg"
// //                           />
// //                           <TouchableOpacity
// //                             className="absolute top-2 right-2 bg-red-500 w-6 h-6 rounded-full items-center justify-center"
// //                             onPress={() => removePhoto(index)}
// //                           >
// //                             <Text className="text-white font-medium">✕</Text>
// //                           </TouchableOpacity>
// //                         </View>
// //                       ))}
// //                     </View>
// //                   )}
// //                 </View>

// //                 <View className="mt-4">
// //                   <Text className="text-base font-medium mb-2 text-gray-900">Nearest Market</Text>
// //                   <TextInput
// //                     className="bg-white border border-gray-300 rounded-lg px-3 py-3 text-base text-gray-900"
// //                     placeholder="Enter nearest market"
// //                     value={nearestMarket}
// //                     onChangeText={setNearestMarket}
// //                   />
// //                 </View>
// //               </View>

// //               <View className="flex-row gap-4 mt-6">
// //                 <TouchableOpacity
// //                   className="flex-1 py-3 rounded-lg bg-gray-500"
// //                   onPress={prevStep}
// //                 >
// //                   <Text className="text-white text-center font-medium">← Previous</Text>
// //                 </TouchableOpacity>
// //                 <TouchableOpacity
// //                   className="flex-1 py-3 rounded-lg bg-green-600"
// //                   onPress={handleSubmit}
// //                 >
// //                   <Text className="text-white text-center font-medium">Submit Post</Text>
// //                 </TouchableOpacity>
// //               </View>
// //             </View>
// //           )}
// //         </View>
// //       </ScrollView>
// //     </View>
// //   );
// // };

// // export default SellProductForm;


// // import DateTimePicker from "@react-native-community/datetimepicker";
// // import { Picker } from "@react-native-picker/picker";
// // import axios from "axios";
// // import * as ImagePicker from "expo-image-picker";
// // import * as Location from "expo-location";
// // import { ChevronLeft } from "lucide-react-native";
// // import React, { useEffect, useState } from "react";
// // import MapView, { Marker } from "react-native-maps";
// // import {
// //   ActivityIndicator,
// //   Alert,
// //   Dimensions,
// //   Image,
// //   Modal,
// //   Platform,
// //   ScrollView,
// //   StyleSheet,
// //   Text,
// //   TextInput,
// //   TouchableOpacity,
// //   View,
// // } from "react-native";
// // import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
// // interface Category {
// //   _id: string;
// //   categoryId: string;
// //   categoryName: string;
// // }

// // interface SubCategory {
// //   _id: string;
// //   subCategoryId: string;
// //   subCategoryName: string;
// //   categoryId: string;
// // }

// // interface GradePrice {
// //   grade: string;
// //   pricePerUnit: string;
// //   totalQty: string;
// //   photos: any[];
// // }
// // interface Packaging {
// //   _id: string;
// //   packageType: string;
// //   measurements: string[];
// // }

// // interface Market {
// //   _id: string;
// //   marketId: string;
// //   marketName: string;
// //   pincode: string;
// //   postOffice?: string;
// //   district?: string;
// //   state?: string;
// //   exactAddress: string;
// //   landmark?: string;
// // }
// // interface CapturedPhoto {
// //   uri: string;
// //   watermarkedUri?: string;
// // }

// // const { width, height } = Dimensions.get("window");

// // const SellProductForm: React.FC = ({ route }: any) => {
// //   const [step, setStep] = useState(1);

// //   // Step 1: Category & Basic Info
// //   const [categories, setCategories] = useState<Category[]>([]);
// //   const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
// //   const [cropBriefDetails, setCropBriefDetails] = useState("");

// //   const { categoryId, subCategoryId } = route?.params || {};
// //   const [selectedCategory, setSelectedCategory] = useState(categoryId || "");
// //   const [selectedSubCategory, setSelectedSubCategory] = useState(subCategoryId || "");

// // const [globalQuantityType, setGlobalQuantityType] = useState("");
// // const [globalPriceType, setGlobalPriceType] = useState("");
// //   // Step 2: Farming & Packaging Details
// //   const [farmingType, setFarmingType] = useState("");
// //   const [typeOfSeeds, setTypeOfSeeds] = useState("");
// //   const [packagingType, setPackagingType] = useState("");
// //   const [packageMeasurement, setPackageMeasurement] = useState("");
// //   const [unitMeasurement, setUnitMeasurement] = useState("");
// // const [packagingOptions, setPackagingOptions] = useState<Packaging[]>([]);
// // const [selectedPackaging, setSelectedPackaging] = useState<Packaging | null>(null);
// // const [markets, setMarkets] = useState<Market[]>([]);
// // const [filteredMarkets, setFilteredMarkets] = useState<Market[]>([]);
// // const [marketSearch, setMarketSearch] = useState("");
// //   const [showDatePicker, setShowDatePicker] = useState(false);
// //   const [showTimePicker, setShowTimePicker] = useState(false);
  
// //   // Step 3: Grade & Pricing

// //   const [gradePrices, setGradePrices] = useState<GradePrice[]>([
// //     { grade: "A Grade", pricePerUnit: "", totalQty: "", photos: [] },
// //     { grade: "B Grade", pricePerUnit: "", totalQty: "", photos: [] },
// //     { grade: "All Mixed Grades", pricePerUnit: "", totalQty: "", photos: [] },
// //   ]);
// //   const [gradeCounter, setGradeCounter] = useState(2);
// //   const [selectedGrades, setSelectedGrades] = useState<string[]>([]);


// //   // Step 4: Final Details
// //   const [deliveryDate, setDeliveryDate] = useState(new Date());
// //   const [deliveryTime, setDeliveryTime] = useState(new Date());
// //   const [nearestMarket, setNearestMarket] = useState("");
// //   const [cropPhotos, setCropPhotos] = useState<CapturedPhoto[]>([]);
// //   const [farmLocation, setFarmLocation] = useState({
// //     latitude: 12.9716,
// //     longitude: 77.5946,
// //   });

// //   // Camera States
// //   const [showCamera, setShowCamera] = useState(false);
// //   const [capturedImage, setCapturedImage] = useState<string | null>(null);
// //   const [gpsText, setGpsText] = useState("");

// //   // Map States
// //   const [showLocationPicker, setShowLocationPicker] = useState(false);
// //   const [isGettingLocation, setIsGettingLocation] = useState(false);
// // const compressImage = async (uri: string) => {
// //   try {
// //     const manipResult = await manipulateAsync(
// //       uri,
// //       [{ resize: { width: 800 } }], // Resize to max width 800px
// //       { compress: 0.6, format: SaveFormat.JPEG }
// //     );
// //     return manipResult.uri;
// //   } catch (error) {
// //     console.error('Error compressing image:', error);
// //     return uri; // Return original if compression fails
// //   }
// // };
// //   useEffect(() => {
// //     fetchCategories();
// //     requestLocationPermission();
// //     fetchPackaging();     // ADD THIS
// //   fetchMarkets(); 
// //   }, []);
// // // Add this after your existing useEffects
// // useEffect(() => {
// //   // Cleanup function to release memory when changing steps
// //   return () => {
// //     // Clear captured image when leaving step 4
// //     if (step !== 4 && capturedImage) {
// //       setCapturedImage(null);
// //       setGpsText("");
// //     }
// //   };
// // }, [step]);
// //   const requestLocationPermission = async () => {
// //     try {
// //       const { status } = await Location.requestForegroundPermissionsAsync();
// //       if (status === "granted") {
// //         const location = await Location.getCurrentPositionAsync({});
// //         setFarmLocation({
// //           latitude: location.coords.latitude,
// //           longitude: location.coords.longitude,
// //         });
// //       }
// //     } catch (error) {
// //       console.error("Error getting location:", error);
// //     }
// //   };

// //   const fetchCategories = async () => {
// //     try {
// //       const res = await axios.get("https://kisan.etpl.ai/category/all");
// //       setCategories(res.data.data);
// //     } catch (error) {
// //       console.error("Error fetching categories:", error);
// //     }
// //   };

// //   const fetchSubCategories = async (categoryId: string) => {
// //     try {
// //       const res = await axios.get(
// //         `https://kisan.etpl.ai/subcategory/category/${categoryId}`
// //       );
// //       setSubCategories(res.data.data);
// //     } catch (error) {
// //       console.error("Error fetching subcategories:", error);
// //     }
// //   };
// //   const fetchPackaging = async () => {
// //   try {
// //     const res = await axios.get("https://kisan.etpl.ai/api/packaging/all");
// //     setPackagingOptions(res.data);
// //   } catch (error) {
// //     console.error("Error fetching packaging:", error);
// //   }
// // };

// // const fetchMarkets = async () => {
// //   try {
// //     const res = await axios.get("https://kisan.etpl.ai/api/market/all");
// //     setMarkets(res.data.data || res.data);
// //     setFilteredMarkets(res.data.data || res.data);
// //   } catch (error) {
// //     console.error("Error fetching markets:", error);
// //   }
// // };

// // const handleMarketSearch = (searchValue: string) => {
// //   setMarketSearch(searchValue);
  
// //   if (!searchValue.trim()) {
// //     setFilteredMarkets(markets);
// //     return;
// //   }
  
// //   const filtered = markets.filter(market => 
// //     market.marketName.toLowerCase().includes(searchValue.toLowerCase()) ||
// //     market.pincode.includes(searchValue) ||
// //     market.district?.toLowerCase().includes(searchValue.toLowerCase()) ||
// //     market.exactAddress.toLowerCase().includes(searchValue.toLowerCase())
// //   );
  
// //   setFilteredMarkets(filtered);
// // };
// //   const onDateChange = (event: any, selectedDate?: Date) => {
// //     setShowDatePicker(Platform.OS === "ios");
// //     if (selectedDate) {
// //       setDeliveryDate(selectedDate);
// //     }
// //   };

// //   const onTimeChange = (event: any, selectedTime?: Date) => {
// //     setShowTimePicker(Platform.OS === "ios");
// //     if (selectedTime) {
// //       setDeliveryTime(selectedTime);
// //     }
// //   };
  
// //   const formatDate = (date: Date) => {
// //     const year = date.getFullYear();
// //     const month = String(date.getMonth() + 1).padStart(2, "0");
// //     const day = String(date.getDate()).padStart(2, "0");
// //     return `${year}-${month}-${day}`;
// //   };

// //   const formatTime = (date: Date) => {
// //     const hours = String(date.getHours()).padStart(2, "0");
// //     const minutes = String(date.getMinutes()).padStart(2, "0");
// //     return `${hours}:${minutes}`;
// //   };

// //   const handleGradeToggle = (grade: string) => {
// //     if (selectedGrades.includes(grade)) {
// //       setSelectedGrades(selectedGrades.filter((g) => g !== grade));
// //     } else {
// //       setSelectedGrades([...selectedGrades, grade]);
// //     }
// //   };

// //   const handleGradePriceChange = (index: number, field: string, value: string) => {
// //     // Restrict negative values for number inputs
// //     if ((field === "pricePerUnit" || field === "totalQty") && parseFloat(value) < 0) {
// //       return;
// //     }
// //     const updated = [...gradePrices];
// //     updated[index] = { ...updated[index], [field]: value };
// //     setGradePrices(updated);
// //   };

// //   const handleAddGrade = () => {
// //     const nextGrade = String.fromCharCode(65 + gradeCounter);
// //     const newGrade: GradePrice = {
// //       grade: `${nextGrade} Grade`,
// //       pricePerUnit: "",
// //       totalQty: "",
// //       photos: [],
// //     };
// //     setGradePrices([...gradePrices.slice(0, -1), newGrade, gradePrices[gradePrices.length - 1]]);
// //     setGradeCounter(gradeCounter + 1);
// //   };

// //   const handleRemoveGradePhoto = (gradeIndex: number, photoIndex: number) => {
// //     const updated = [...gradePrices];
// //     updated[gradeIndex].photos = updated[gradeIndex].photos.filter((_, idx) => idx !== photoIndex);
// //     setGradePrices(updated);
// //   };


// // const handleGradePhotoUpload = async (index: number) => {
// //   Alert.alert(
// //     "Select Media",
// //     "Choose photo or video",
// //     [
// //       {
// //         text: "Camera",
// //         onPress: async () => {
// //           const result = await ImagePicker.launchCameraAsync({
// //             mediaTypes: ImagePicker.MediaTypeOptions.Images,
// //             allowsEditing: true,
// //             quality: 0.5, // Reduce quality
// //           });
// //           if (!result.canceled && result.assets) {
// //             // Compress all images
// //             const compressedAssets = await Promise.all(
// //               result.assets.map(async (asset) => ({
// //                 ...asset,
// //                 uri: await compressImage(asset.uri)
// //               }))
// //             );
            
// //             const updated = [...gradePrices];
// //             updated[index] = {
// //               ...updated[index],
// //               photos: [...updated[index].photos, ...compressedAssets].slice(0, 5), // Limit to 5
// //             };
// //             setGradePrices(updated);
// //           }
// //         },
// //       },
// //       {
// //         text: "Gallery",
// //         onPress: async () => {
// //           const result = await ImagePicker.launchImageLibraryAsync({
// //             mediaTypes: ImagePicker.MediaTypeOptions.Images,
// //             allowsMultipleSelection: true,
// //             quality: 0.5,
// //           });
// //           if (!result.canceled && result.assets) {
// //             // Compress all images
// //             const compressedAssets = await Promise.all(
// //               result.assets.slice(0, 5).map(async (asset) => ({
// //                 ...asset,
// //                 uri: await compressImage(asset.uri)
// //               }))
// //             );
            
// //             const updated = [...gradePrices];
// //             updated[index] = {
// //               ...updated[index],
// //               photos: [...updated[index].photos, ...compressedAssets].slice(0, 5),
// //             };
// //             setGradePrices(updated);
// //           }
// //         },
// //       },
// //       { text: "Cancel", style: "cancel" },
// //     ]
// //   );
// // };
// //   const handlePhotoUpload = async () => {
// //     Alert.alert(
// //       "Select Media",
// //       "Choose photo or video",
// //       [
// //         {
// //           text: "Camera",
// //           onPress: async () => {
// //             const result = await ImagePicker.launchCameraAsync({
// //               mediaTypes: ImagePicker.MediaTypeOptions.All,
// //               allowsEditing: true,
// //               quality: 0.8,
// //             });
// //             if (!result.canceled && result.assets) {
// //               setCropPhotos([...cropPhotos, ...result.assets]);
// //             }
// //           },
// //         },
// //         {
// //           text: "Gallery",
// //           onPress: async () => {
// //             const result = await ImagePicker.launchImageLibraryAsync({
// //               mediaTypes: ImagePicker.MediaTypeOptions.All,
// //               allowsMultipleSelection: true,
// //               quality: 0.8,
// //             });
// //             if (!result.canceled && result.assets) {
// //               setCropPhotos([...cropPhotos, ...result.assets]);
// //             }
// //           },
// //         },
// //         { text: "Cancel", style: "cancel" },
// //       ]
// //     );
// //   };

// //   // Camera Functions
// // const openCamera = async () => {
// //   try {
// //     if (cropPhotos.length >= 3) {
// //       Alert.alert("Limit Reached", "Maximum 3 photos allowed");
// //       return;
// //     }

// //     const { status } = await ImagePicker.requestCameraPermissionsAsync();
// //     if (status !== "granted") {
// //       Alert.alert("Permission Denied", "Camera permission is required");
// //       return;
// //     }

// //     const result = await ImagePicker.launchCameraAsync({
// //       mediaTypes: ImagePicker.MediaTypeOptions.Images,
// //       allowsEditing: false,
// //       quality: 0.3, // Low quality to reduce memory
// //       exif: false,
// //       base64: false,
// //     });

// //     if (result.canceled || !result.assets?.[0]) return;

// //     // Compress image immediately
// //     const compressedUri = await compressImage(result.assets[0].uri);

// //     const loc = await Location.getCurrentPositionAsync({
// //       accuracy: Location.Accuracy.Balanced,
// //     });
    
// //     const text = `Lat: ${loc.coords.latitude.toFixed(6)}\nLon: ${loc.coords.longitude.toFixed(6)}\n${new Date().toLocaleString()}`;
    
// //     setGpsText(text);
// //     setCapturedImage(compressedUri); // Use compressed image
// //   } catch (error) {
// //     console.error("Camera error:", error);
// //     Alert.alert("Error", "Failed to open camera");
// //   }
// // };

// //   const saveWithWatermark = async () => {
// //     try {
// //       console.log("Saving photo...");
      
// //       if (!capturedImage) {
// //         Alert.alert("Error", "No image to save");
// //         return;
// //       }

// //       if (cropPhotos.length >= 3) {
// //         Alert.alert("Limit Reached", "Maximum 3 photos allowed");
// //         setCapturedImage(null);
// //         setGpsText("");
// //         return;
// //       }

// //       const newPhoto = { 
// //         uri: capturedImage, 
// //         watermarkedUri: capturedImage,
// //         timestamp: new Date().toISOString()
// //       };

// //       console.log("Adding photo:", newPhoto);
      
// //       setCropPhotos([...cropPhotos, newPhoto]);
// //       setCapturedImage(null);
// //       setGpsText("");
      
// //       Alert.alert("Success", "Photo saved!");
// //     } catch (error) {
// //       console.error("Error saving photo:", error);
// //       Alert.alert("Error", "Failed to save photo");
// //     }
// //   };

// //   const removePhoto = (index: number) => {
// //     const updated = cropPhotos.filter((_, i) => i !== index);
// //     setCropPhotos(updated);
// //   };

// //   // Location Functions
// //   const getCurrentLocation = async () => {
// //     setIsGettingLocation(true);
// //     try {
// //       const { status } = await Location.requestForegroundPermissionsAsync();
// //       if (status !== "granted") {
// //         Alert.alert("Permission Denied", "Location permission is required");
// //         setIsGettingLocation(false);
// //         return;
// //       }

// //       const location = await Location.getCurrentPositionAsync({
// //         accuracy: Location.Accuracy.High,
// //       });

// //       setFarmLocation({
// //         latitude: location.coords.latitude,
// //         longitude: location.coords.longitude,
// //       });

// //       Alert.alert("Success", "Current location captured!");
// //     } catch (error) {
// //       console.error("Error getting location:", error);
// //       Alert.alert("Error", "Failed to get current location");
// //     } finally {
// //       setIsGettingLocation(false);
// //     }
// //   };

// //   const openLocationPicker = () => {
// //     setShowLocationPicker(true);
// //   };

// //   const saveManualLocation = () => {
// //     if (farmLocation.latitude && farmLocation.longitude) {
// //       setShowLocationPicker(false);
// //       Alert.alert("Success", "Location saved!");
// //     } else {
// //       Alert.alert("Error", "Please enter valid coordinates");
// //     }
// //   };

  
// // {/* Map Picker Modal */}
// // <Modal visible={showLocationPicker} animationType="slide" transparent={true}>
// //   <View style={styles.modalOverlay}>
// //     <View style={styles.locationModal}>
// //       <Text style={styles.modalTitle}>Select Farm Location</Text>
// //       <Text style={styles.modalSubtitle}>
// //         Tap on the map or drag the marker to select your farm location
// //       </Text>

// //       {/* INTERACTIVE MAP VIEW */}
// //       <View style={styles.mapContainer}>
// //         <MapView
// //           style={styles.map}
// //           region={{
// //             latitude: farmLocation.latitude,
// //             longitude: farmLocation.longitude,
// //             latitudeDelta: 0.05,
// //             longitudeDelta: 0.05,
// //           }}
// //           onPress={(e) => {
// //             // User taps anywhere on map to set location
// //             setFarmLocation({
// //               latitude: e.nativeEvent.coordinate.latitude,
// //               longitude: e.nativeEvent.coordinate.longitude,
// //             });
// //           }}
// //         >
// //           <Marker
// //             coordinate={{
// //               latitude: farmLocation.latitude,
// //               longitude: farmLocation.longitude,
// //             }}
// //             draggable
// //             onDragEnd={(e) => {
// //               // User drags the marker to set location
// //               setFarmLocation({
// //                 latitude: e.nativeEvent.coordinate.latitude,
// //                 longitude: e.nativeEvent.coordinate.longitude,
// //               });
// //             }}
// //             title="Farm Location"
// //             description="Drag me to adjust position"
// //           />
// //         </MapView>
// //       </View>

// //       {/* COORDINATES DISPLAY - Optional, can be hidden */}
// //       <View style={styles.coordinatesDisplay}>
// //         <Text style={styles.coordinateText}>
// //           📍 Selected Location:
// //         </Text>
// //         <Text style={styles.coordinateText}>
// //           Lat: {farmLocation.latitude.toFixed(6)}, Lon: {farmLocation.longitude.toFixed(6)}
// //         </Text>
// //       </View>

// //       {/* USE CURRENT LOCATION BUTTON */}
// //       <TouchableOpacity
// //         style={styles.currentLocationButton}
// //         onPress={getCurrentLocation}
// //         disabled={isGettingLocation}
// //       >
// //         {isGettingLocation ? (
// //           <ActivityIndicator color="#fff" />
// //         ) : (
// //           <Text style={styles.buttonText}>📍 Use My Current Location</Text>
// //         )}
// //       </TouchableOpacity>

// //       {/* ACTION BUTTONS */}
// //       <View style={styles.modalButtonsContainer}>
// //         <TouchableOpacity
// //           style={[styles.modalButton, styles.cancelButton]}
// //           onPress={() => setShowLocationPicker(false)}
// //         >
// //           <Text style={styles.buttonText}>Cancel</Text>
// //         </TouchableOpacity>
// //         <TouchableOpacity
// //           style={[styles.modalButton, styles.confirmButton]}
// //           onPress={saveManualLocation}
// //         >
// //           <Text style={styles.buttonText}>✓ Confirm Location</Text>
// //         </TouchableOpacity>
// //       </View>
// //     </View>
// //   </View>
// // </Modal>

// // const handleSubmit = async () => {
// //   if (cropPhotos.length > 3) {
// //     Alert.alert("Too Many Photos", "Please limit to 3 photos maximum.");
// //     return;
// //   }

// //   if (!selectedCategory || !selectedSubCategory) {
// //     Alert.alert("Missing Information", "Please fill in all required fields");
// //     return;
// //   }

// //   if (!cropBriefDetails || !farmingType || !typeOfSeeds) {
// //     Alert.alert("Missing Information", "Please fill in all farming details");
// //     return;
// //   }

  

// //   if (selectedGrades.length === 0) {
// //     Alert.alert("Missing Information", "Please select at least one grade");
// //     return;
// //   }

// //   // ✅ ADD VALIDATION FOR GRADE PRICES
// //   // VALIDATION
// // if (selectedGrades.length === 0) {
// //   Alert.alert("Missing Information", "Please select at least one grade");
// //   return;
// // }

// // if (!globalQuantityType || !globalPriceType) {
// //   Alert.alert("Missing Information", "Please select Quantity Type and Price Type");
// //   return;
// // }

// // const selectedGradeObjects = gradePrices.filter((gp) => 
// //   selectedGrades.includes(gp.grade)
// // );

// // for (const gp of selectedGradeObjects) {
// //   if (!gp.pricePerUnit || !gp.totalQty) {
// //     Alert.alert(
// //       "Incomplete Grade Information", 
// //       `Please fill Price and Quantity for ${gp.grade}`
// //     );
// //     return;
// //   }
// // }

// //   if (!nearestMarket) {
// //     Alert.alert("Missing Information", "Please enter nearest market");
// //     return;
// //   }

// //   const formData = new FormData();
  
// //   formData.append("categoryId", selectedCategory);
// //   formData.append("subCategoryId", selectedSubCategory);
// //   formData.append("cropBriefDetails", cropBriefDetails);
// //   formData.append("farmingType", farmingType);
// //   formData.append("typeOfSeeds", typeOfSeeds);
// //   formData.append("packagingType", packagingType);
// //   formData.append("packageMeasurement", packageMeasurement);
// //   formData.append("unitMeasurement", unitMeasurement);
// //   formData.append("deliveryDate", formatDate(deliveryDate));
// //   formData.append("deliveryTime", formatTime(deliveryTime));
// //   formData.append("nearestMarket", nearestMarket);
  
// //   formData.append("farmLocation", JSON.stringify({
// //     lat: farmLocation.latitude.toString(),
// //     lng: farmLocation.longitude.toString()
// //   }));

// //   // ✅ FIXED: Include quantityType and priceType

// //     const selectedGradeData = gradePrices
// //       .filter((gp) => selectedGrades.includes(gp.grade))
// //       .map((gp) => ({
// //         grade: gp.grade,
// //         pricePerUnit: gp.pricePerUnit,
// //         totalQty: gp.totalQty,
// //         quantityType: globalQuantityType,
// //         priceType: globalPriceType,
// //       }));

// //     formData.append("gradePrices", JSON.stringify(selectedGradeData));

// //     // Append grade-specific photos
// //     gradePrices.forEach((gp) => {
// //       if (selectedGrades.includes(gp.grade)) {
// //         gp.photos.forEach((photo) => {
// //           formData.append(`gradePhotos_${gp.grade}`, {
// //             uri: photo.uri,
// //             type: photo.type || "image/jpeg",
// //             name: photo.fileName || `grade_${gp.grade}_${Date.now()}.jpg`,
// //           } as any);
// //         });
// //       }
// //     });

// //     // Add crop photos
// //     cropPhotos.forEach((photo) => {
// //       formData.append(`photos`, {
// //         uri: photo.uri,
// //         type: photo.type || "image/jpeg",
// //         name: photo.fileName || `photo_${Date.now()}.jpg`,
// //       } as any);
// //     });

// //   try {
// //     console.log("Submitting product...");
// //     console.log("Grade data being sent:", selectedGradeData); // ✅ Debug log

// //     const response = await axios.post(
// //       "https://kisan.etpl.ai/product/add",
// //       formData,
// //       {
// //         headers: {
// //           "Content-Type": "multipart/form-data",
// //         },
// //         timeout: 30000,
// //         maxContentLength: Infinity,
// //         maxBodyLength: Infinity,
// //       }
// //     );

// //     console.log("Response:", response.data);
// //     Alert.alert("Success", "Product added successfully!");
// //     setStep(1);
// //     resetForm();
// //   } catch (error: any) {
// //     console.error("Error submitting product:", error);
// //     console.error("Error response:", error.response?.data);

// //     if (error.response?.status === 413) {
// //       Alert.alert(
// //         "Upload Too Large",
// //         "The images are too large. Please use fewer photos or lower quality."
// //       );
// //     } else if (error.response?.status === 500) {
// //       Alert.alert(
// //         "Server Error",
// //         "Server error: " + (error.response?.data?.message || "Please try again")
// //       );
// //     } else if (error.response?.status === 400) {
// //       Alert.alert(
// //         "Validation Error",
// //         "Invalid data: " + (error.response?.data?.message || "Please check all fields")
// //       );
// //     } else if (error.code === 'ECONNABORTED') {
// //       Alert.alert(
// //         "Timeout",
// //         "Upload timed out. Please try again with fewer/smaller photos."
// //       );
// //     } else if (error.code === 'ECONNREFUSED') {
// //       Alert.alert(
// //         "Connection Error",
// //         "Cannot connect to server. Please check your internet connection."
// //       );
// //     } else {
// //       Alert.alert(
// //         "Error",
// //         "Failed to submit: " + (error.message || "Unknown error")
// //       );
// //     }
// //   }
// // };
// //   const resetForm = () => {
// //     setSelectedCategory("");
// //     setSelectedSubCategory("");
// //     setCropBriefDetails("");
// //     setFarmingType("");
// //     setTypeOfSeeds("");
// //     setPackagingType("");
// //     setPackageMeasurement("");
// //     setUnitMeasurement("");
// //     setSelectedGrades([]);
// //     setDeliveryDate(new Date());
// //     setDeliveryTime(new Date());
// //     setNearestMarket("");
// //     setCropPhotos([]);
// //     // setGradePrices([
// //     //   { grade: "A Grade", pricePerUnit: "", totalQty: "",  priceType: "" },
// //     //   { grade: "B Grade", pricePerUnit: "", totalQty: "", priceType: "" },
// //     //   { grade: "All Mixed Grades", pricePerUnit: "", totalQty: "", quantityType: "", priceType: "" },
// //     // ]);
// //     setGradeCounter(2);
// //   };

// //   const nextStep = () => {
// //     if (step < 4) setStep(step + 1);
// //   };

// //   const prevStep = () => {
// //     if (step > 1) setStep(step - 1);
// //   };

// //   const getStepTitle = () => {
// //     switch(step) {
// //       case 1: return "Category & Product";
// //       case 2: return "Farming & Packaging";
// //       case 3: return "Pricing & Details";
// //       case 4: return "Final Details";
// //       default: return "Sell Your Produce";
// //     }
// //   };

// //   const renderProgressBar = () => {
// //     const totalSteps = 4;
// //     const progress = (step - 1) / (totalSteps - 1);
    
// //     return (
// //       <View style={styles.progressContainer}>
// //         <View style={styles.progressLineContainer}>
// //           <View style={styles.progressLineBackground} />
// //           <View style={[styles.progressLineCompleted, { width: `${progress * 100}%` }]} />
// //         </View>
        
// //         <View style={styles.stepsContainer}>
// //           {[1, 2, 3, 4].map((stepNum) => (
// //             <View key={stepNum} style={styles.stepIndicator}>
// //               <View
// //                 style={[
// //                   styles.stepCircle,
// //                   step >= stepNum ? styles.stepCircleActive : styles.stepCircleInactive
// //                 ]}
// //               >
// //                 <Text
// //                   style={[
// //                     styles.stepNumber,
// //                     step >= stepNum ? styles.stepNumberActive : styles.stepNumberInactive
// //                   ]}
// //                 >
// //                   {stepNum}
// //                 </Text>
// //               </View>
// //               <Text
// //                 style={[
// //                   styles.stepLabel,
// //                   step >= stepNum ? styles.stepLabelActive : styles.stepLabelInactive
// //                 ]}
// //               >
// //                 {stepNum === 1 && "Category"}
// //                 {stepNum === 2 && "Farming"}
// //                 {stepNum === 3 && "Pricing"}
// //                 {stepNum === 4 && "Details"}
// //               </Text>
// //             </View>
// //           ))}
// //         </View>
// //       </View>
// //     );
// //   };

// //   return (
// //     <View style={styles.container}>
// //       {/* Header with back button */}
// //       <View style={styles.header}>
// //         <TouchableOpacity
// //           onPress={prevStep}
// //           activeOpacity={0.7}
// //           style={styles.backButton}
// //         >
// //           <ChevronLeft size={20} color="#064E3B" />
// //         </TouchableOpacity>

// //         <Text style={styles.headerTitle}>
// //           {getStepTitle()}
// //         </Text>
// //       </View>

// //       {/* Image Preview with GPS Info Modal */}
// //       <Modal visible={!!capturedImage} animationType="slide" transparent={false}>
// //         <View style={styles.modalContainer}>
// //           <View style={styles.imageContainer}>
// //             {capturedImage ? (
// //               <Image
// //                 source={{ uri: capturedImage }}
// //                 style={styles.previewImage}
// //                 resizeMode="contain"
// //                 onError={(error) => {
// //                   console.error("Image load error:", error.nativeEvent);
// //                   Alert.alert("Error", "Failed to load image");
// //                   setCapturedImage(null);
// //                   setGpsText("");
// //                 }}
// //                 onLoad={() => console.log("Image loaded successfully")}
// //               />
// //             ) : null}
// //             {gpsText ? (
// //               <View style={styles.gpsOverlay}>
// //                 <Text style={styles.gpsText}>
// //                   {gpsText}
// //                 </Text>
// //               </View>
// //             ) : null}
// //           </View>
// //           <View style={styles.imageButtonsContainer}>
// //             <TouchableOpacity
// //               style={[styles.imageButton, styles.retakeButton]}
// //               onPress={() => {
// //                 setCapturedImage(null);
// //                 setGpsText("");
// //               }}
// //             >
// //               <Text style={styles.imageButtonText}>Retake</Text>
// //             </TouchableOpacity>
// //             <TouchableOpacity
// //               style={[styles.imageButton, styles.saveButton]}
// //               onPress={saveWithWatermark}
// //             >
// //               <Text style={styles.imageButtonText}>Save Photo</Text>
// //             </TouchableOpacity>
// //           </View>
// //         </View>
// //       </Modal>

// //       {/* Map Picker Modal */}
// //       <Modal visible={showLocationPicker} animationType="slide" transparent={true}>
// //         <View style={styles.modalOverlay}>
// //           <View style={styles.locationModal}>
// //             <Text style={styles.modalTitle}>Enter Farm Location</Text>

// //             <Text style={styles.inputLabel}>Latitude</Text>
// //             <TextInput
// //               style={styles.input}
// //               placeholder="e.g., 12.9716"
// //               value={farmLocation.latitude.toString()}
// //               onChangeText={(text) =>
// //                 setFarmLocation({
// //                   ...farmLocation,
// //                   latitude: parseFloat(text) || 0,
// //                 })
// //               }
// //               keyboardType="numeric"
// //             />

// //             <Text style={styles.inputLabel}>Longitude</Text>
// //             <TextInput
// //               style={styles.input}
// //               placeholder="e.g., 77.5946"
// //               value={farmLocation.longitude.toString()}
// //               onChangeText={(text) =>
// //                 setFarmLocation({
// //                   ...farmLocation,
// //                   longitude: parseFloat(text) || 0,
// //                 })
// //               }
// //               keyboardType="numeric"
// //             />

// //             <TouchableOpacity
// //               style={styles.currentLocationButton}
// //               onPress={getCurrentLocation}
// //               disabled={isGettingLocation}
// //             >
// //               {isGettingLocation ? (
// //                 <ActivityIndicator color="#fff" />
// //               ) : (
// //                 <Text style={styles.buttonText}>📍 Use Current Location</Text>
// //               )}
// //             </TouchableOpacity>

// //             <View style={styles.modalButtonsContainer}>
// //               <TouchableOpacity
// //                 style={[styles.modalButton, styles.cancelButton]}
// //                 onPress={() => setShowLocationPicker(false)}
// //               >
// //                 <Text style={styles.buttonText}>Cancel</Text>
// //               </TouchableOpacity>
// //               <TouchableOpacity
// //                 style={[styles.modalButton, styles.confirmButton]}
// //                 onPress={saveManualLocation}
// //               >
// //                 <Text style={styles.buttonText}>Save Location</Text>
// //               </TouchableOpacity>
// //             </View>
// //           </View>
// //         </View>
// //       </Modal>

// //       <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
// //         {renderProgressBar()}
        
// //         <View style={styles.content}>
// //           {/* Step 1: Category Selection */}
// //           {step === 1 && (
// //             <View>
// //               <Text style={styles.label}>Select Category</Text>
         
// //               <View style={styles.section}>
// //                 <Text style={styles.label}>Crop Brief Details</Text>
// //                 <TextInput
// //                   style={[styles.input, styles.textArea]}
// //                   placeholder="Enter brief description (farming type, seeds type, organic/regular)"
// //                   value={cropBriefDetails}
// //                   onChangeText={setCropBriefDetails}
// //                   multiline
// //                   numberOfLines={4}
// //                   textAlignVertical="top"
// //                 />
// //               </View>

// //               <TouchableOpacity style={styles.primaryButton} onPress={nextStep}>
// //                 <Text style={styles.buttonText}>Next Step →</Text>
// //               </TouchableOpacity>
// //             </View>
// //           )}

// //           {/* Step 2: Farming & Packaging Details */}
// //           {step === 2 && (
// //             <View>
// //               <Text style={styles.sectionTitle}>Farming & Packaging Details</Text>

// //               <View style={styles.formSection}>
// //                 <Text style={styles.label}>Farming Type</Text>
// //                 <View style={styles.pickerContainer}>
// //                   <Picker
// //                     selectedValue={farmingType}
// //                     onValueChange={setFarmingType}
// //                     style={styles.picker}
// //                   >
// //                     <Picker.Item label="Select Farming Type" value="" />
// //                     <Picker.Item label="Drop Down 1" value="drop down 1" />
// //                     <Picker.Item label="Regular" value="regular" />
// //                     <Picker.Item label="Organic" value="organic" />
// //                   </Picker>
// //                 </View>

// //                 <Text style={styles.label}>Type of Seeds</Text>
// //                 <TextInput
// //                   style={styles.input}
// //                   placeholder="e.g., Naati, Hybrid"
// //                   value={typeOfSeeds}
// //                   onChangeText={setTypeOfSeeds}
// //                 />

// //                 <Text style={styles.label}>Packaging Type</Text>
// // <Text style={styles.label}>Packaging Type</Text>
// // <View style={styles.pickerContainer}>
// //   <Picker
// //     selectedValue={packagingType}
// //     onValueChange={(value) => {
// //       setPackagingType(value);
// //       const selected = packagingOptions.find(p => p.packageType === value);
// //       setSelectedPackaging(selected || null);
// //       setPackageMeasurement(""); // Reset measurement
// //     }}
// //     style={styles.picker}
// //   >
// //     <Picker.Item label="Select Package Type" value="" />
// //     {packagingOptions.map((pkg) => (
// //       <Picker.Item key={pkg._id} label={pkg.packageType} value={pkg.packageType} />
// //     ))}
// //   </Picker>
// // </View>

// // {selectedPackaging && selectedPackaging.measurements.length > 0 && (
// //   <>
// //     <Text style={styles.label}>Measurement</Text>
// //     <View style={styles.pickerContainer}>
// //       <Picker
// //         selectedValue={packageMeasurement}
// //         onValueChange={setPackageMeasurement}
// //         style={styles.picker}
// //       >
// //         <Picker.Item label="Select Measurement" value="" />
// //         {selectedPackaging.measurements.map((measurement, idx) => (
// //           <Picker.Item key={idx} label={measurement} value={measurement} />
// //         ))}
// //       </Picker>
// //     </View>
// //   </>
// // )}


// //                 <Text style={styles.label}>Unit Measurement (as per package type)</Text>
// //                 <TextInput
// //                   style={styles.input}
// //                   placeholder="e.g., kg per box, bag, etc."
// //                   value={unitMeasurement}
// //                   onChangeText={setUnitMeasurement}
// //                 />
// //               </View>

// //               <View style={styles.navigationButtons}>
// //                 <TouchableOpacity
// //                   style={[styles.button, styles.secondaryButton]}
// //                   onPress={prevStep}
// //                 >
// //                   <Text style={styles.buttonText}>← Previous</Text>
// //                 </TouchableOpacity>
// //                 <TouchableOpacity
// //                   style={[styles.button, styles.primaryButton]}
// //                   onPress={nextStep}
// //                 >
// //                   <Text style={styles.buttonText}>Next Step →</Text>
// //                 </TouchableOpacity>
// //               </View>
// //             </View>
// //           )}



// //    {step === 3 && (
// //         <View style={styles.stepContainer}>
// //           <Text style={styles.stepTitle}>Step 3: Add Pricing & Details</Text>

// //           <View style={styles.globalSettings}>
// //             <Text style={styles.globalSettingsTitle}>Global Settings (applies to all grades)</Text>

// //             <Text style={styles.label}>Quantity Type</Text>
// //             <View style={styles.pickerContainer}>
// //               <Picker
// //                 selectedValue={globalQuantityType}
// //                 onValueChange={(value) => setGlobalQuantityType(value)}
// //                 style={styles.picker}
// //               >
// //                 <Picker.Item label="Select Type" value="" />
// //                 <Picker.Item label="Bulk" value="bulk" />
// //                 <Picker.Item label="Split" value="split" />
// //               </Picker>
// //             </View>

// //             <Text style={styles.label}>Price Type</Text>
// //             <View style={styles.pickerContainer}>
// //               <Picker
// //                 selectedValue={globalPriceType}
// //                 onValueChange={(value) => setGlobalPriceType(value)}
// //                 style={styles.picker}
// //               >
// //                 <Picker.Item label="Select Type" value="" />
// //                 <Picker.Item label="Fixed" value="fixed" />
// //                 <Picker.Item label="Negotiable" value="negotiable" />
// //               </Picker>
// //             </View>
// //           </View>

// //           <View style={styles.gradeHeader}>
// //             <Text style={styles.label}>Select Grades & Add Pricing</Text>
// //             <TouchableOpacity style={styles.addGradeButton} onPress={handleAddGrade}>
// //               <Text style={styles.addGradeButtonText}>+ Add Grade</Text>
// //             </TouchableOpacity>
// //           </View>

// //           {gradePrices.map((gp, index) => (
// //             <View
// //               key={index}
// //               style={[
// //                 styles.gradeCard,
// //                 selectedGrades.includes(gp.grade) && styles.gradeCardSelected,
// //               ]}
// //             >
// //               <TouchableOpacity
// //                 style={styles.checkboxContainer}
// //                 onPress={() => handleGradeToggle(gp.grade)}
// //               >
// //                 <View
// //                   style={[
// //                     styles.checkbox,
// //                     selectedGrades.includes(gp.grade) && styles.checkboxChecked,
// //                   ]}
// //                 >
// //                   {selectedGrades.includes(gp.grade) && <Text style={styles.checkmark}>✓</Text>}
// //                 </View>
// //                 <Text style={styles.gradeTitle}>{gp.grade}</Text>
// //               </TouchableOpacity>

// //               {selectedGrades.includes(gp.grade) && (
// //                 <>
// //                   <View style={styles.inputRow}>
// //                     <View style={styles.inputHalf}>
// //                       <Text style={styles.label}>Price / unit (₹)</Text>
// //                       <TextInput
// //                         style={styles.input}
// //                         placeholder="Price / unit (₹)"
// //                         value={gp.pricePerUnit}
// //                         onChangeText={(value) => {
// //                           // Restrict negative values
// //                           if (value === "" || parseFloat(value) >= 0) {
// //                             handleGradePriceChange(index, "pricePerUnit", value);
// //                           }
// //                         }}
// //                         keyboardType="numeric"
// //                       />
// //                     </View>
// //                     <View style={styles.inputHalf}>
// //                       <Text style={styles.label}>Total Qty</Text>
// //                       <TextInput
// //                         style={styles.input}
// //                         placeholder="Total Qty"
// //                         value={gp.totalQty}
// //                         onChangeText={(value) => {
// //                           // Restrict negative values
// //                           if (value === "" || parseFloat(value) >= 0) {
// //                             handleGradePriceChange(index, "totalQty", value);
// //                           }
// //                         }}
// //                         keyboardType="numeric"
// //                       />
// //                     </View>
// //                   </View>

// //                   <View style={styles.photoUploadSection}>
// //                     <Text style={styles.label}>Upload Photos/Videos for {gp.grade}</Text>
// //                     <TouchableOpacity
// //                       style={styles.uploadButton}
// //                       onPress={() => handleGradePhotoUpload(index)}
// //                     >
// //                       <Text style={styles.uploadButtonText}>📷 Select Media</Text>
// //                     </TouchableOpacity>

// //                     {gp.photos.length > 0 && (
// //                       <View style={styles.photoGrid}>
// //                         {gp.photos.map((photo, photoIdx) => (
// //                           <View key={photoIdx} style={styles.photoPreview}>
// //                             <Image source={{ uri: photo.uri }} style={styles.photoImage} />
// //                             <TouchableOpacity
// //                               style={styles.removePhotoButton}
// //                               onPress={() => handleRemoveGradePhoto(index, photoIdx)}
// //                             >
// //                               <Text style={styles.removePhotoText}>×</Text>
// //                             </TouchableOpacity>
// //                           </View>
// //                         ))}
// //                       </View>
// //                     )}

// //                     {gp.photos.length > 0 && (
// //                       <Text style={styles.photoCount}>✓ {gp.photos.length} file(s) selected</Text>
// //                     )}
// //                   </View>
// //                 </>
// //               )}
// //             </View>
// //           ))}

// //           <View style={styles.buttonRow}>
// //             <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={prevStep}>
// //               <Text style={styles.buttonText}>Previous</Text>
// //             </TouchableOpacity>
// //             <TouchableOpacity style={styles.button} onPress={nextStep}>
// //               <Text style={styles.buttonText}>Next Step</Text>
// //             </TouchableOpacity>
// //           </View>
// //         </View>
// //       )}
       
// // {/* Step 4: Final Details */}
// // {step === 4 && (
// //   <View>
// //     <Text style={styles.sectionTitle}>Final Details</Text>

// //     <View style={styles.formSection}>
// //       <Text style={styles.label}>Farm Location</Text>
      
// //       <TouchableOpacity 
// //         style={styles.locationButton} 
// //         onPress={getCurrentLocation} 
// //         disabled={isGettingLocation}
// //       >
// //         {isGettingLocation ? (
// //           <ActivityIndicator color="#fff" />
// //         ) : (
// //           <Text style={styles.buttonText}>📍 Get Current Location</Text>
// //         )}
// //       </TouchableOpacity>

// //       <TouchableOpacity
// //         style={styles.manualLocationButton}
// //         onPress={openLocationPicker}
// //       >
// //         <Text style={styles.buttonText}>✏️ Enter Location Manually</Text>
// //       </TouchableOpacity>

// //     {/* MAP PREVIEW */}
// // <View style={styles.mapPreviewContainer}>
// //   <MapView
// //     style={styles.mapPreview}
// //     region={{
// //       latitude: farmLocation.latitude,
// //       longitude: farmLocation.longitude,
// //       latitudeDelta: 0.01,
// //       longitudeDelta: 0.01,
// //     }}
// //     scrollEnabled={false}
// //     zoomEnabled={false}
// //     pitchEnabled={false}
// //     rotateEnabled={false}
// //   >
// //     <Marker
// //       coordinate={{
// //         latitude: farmLocation.latitude,
// //         longitude: farmLocation.longitude,
// //       }}
// //       title="Farm Location"
// //     />
// //   </MapView>
// // </View>

// // <View style={styles.locationDisplay}>
// //   <Text style={styles.locationText}>
// //     📍 Lat: {farmLocation.latitude.toFixed(6)}
// //   </Text>
// //   <Text style={styles.locationText}>
// //     📍 Lon: {farmLocation.longitude.toFixed(6)}
// //   </Text>
// // </View>
// //       <View style={styles.dateTimeSection}>
// //         <Text style={styles.label}>Delivery Date</Text>
// //         <TouchableOpacity 
// //           style={styles.dateTimeButton} 
// //           onPress={() => setShowDatePicker(true)}
// //         >
// //           <Text style={styles.dateTimeText}>📅 {formatDate(deliveryDate)}</Text>
// //         </TouchableOpacity>
// //         {showDatePicker && (
// //           <DateTimePicker 
// //             value={deliveryDate} 
// //             mode="date" 
// //             display="default" 
// //             onChange={onDateChange} 
// //             minimumDate={new Date()} 
// //           />
// //         )}
        
// //         <Text style={styles.label}>Delivery Time</Text>
// //         <TouchableOpacity 
// //           style={styles.dateTimeButton} 
// //           onPress={() => setShowTimePicker(true)}
// //         >
// //           <Text style={styles.dateTimeText}>🕐 {formatTime(deliveryTime)}</Text>
// //         </TouchableOpacity>
// //         {showTimePicker && (
// //           <DateTimePicker 
// //             value={deliveryTime} 
// //             mode="time" 
// //             display="default" 
// //             onChange={onTimeChange} 
// //           />
// //         )}
// //       </View>

// //       <View style={styles.photoSection}>
// //         <Text style={styles.label}>Upload Crop Photos</Text>
// //         <Text style={styles.helperText}>Maximum 3 photos (compressed automatically)</Text>
// //         <TouchableOpacity
// //           style={styles.cameraButton}
// //           onPress={openCamera}
// //           disabled={cropPhotos.length >= 3}
// //         >
// //           <Text style={styles.buttonText}>
// //             📷 Open Camera {cropPhotos.length >= 3 ? "(Limit Reached)" : `(${cropPhotos.length}/3)`}
// //           </Text>
// //         </TouchableOpacity>

// //         {cropPhotos.length > 0 && (
// //           <View style={styles.photoGrid}>
// //             {cropPhotos.map((photo, index) => (
// //               <View key={index} style={styles.photoItem}>
// //                 <Image
// //                   source={{ uri: photo.watermarkedUri || photo.uri }}
// //                   style={styles.thumbnail}
// //                 />
// //                 <TouchableOpacity
// //                   style={styles.removePhotoButton}
// //                   onPress={() => removePhoto(index)}
// //                 >
// //                   <Text style={styles.removePhotoText}>✕</Text>
// //                 </TouchableOpacity>
// //               </View>
// //             ))}
// //           </View>
// //         )}
// //       </View>

// // <View style={styles.marketSection}>
// //   <Text style={styles.label}>Nearest Market</Text>
  
// //   <TextInput
// //     style={styles.input}
// //     placeholder="🔍 Search by market name, pincode, district..."
// //     value={marketSearch}
// //     onChangeText={handleMarketSearch}
// //   />
  
// //   <View style={styles.pickerContainer}>
// //     <Picker
// //       selectedValue={nearestMarket}
// //       onValueChange={setNearestMarket}
// //       style={styles.picker}
// //     >
// //       <Picker.Item label="Select Nearest Market" value="" />
// //       {filteredMarkets.map((market) => (
// //         <Picker.Item 
// //           key={market._id} 
// //           label={`${market.marketName} - ${market.exactAddress}, ${market.district} (${market.pincode})`}
// //           value={market._id}
// //         />
// //       ))}
// //     </Picker>
// //   </View>
  
// //   {filteredMarkets.length === 0 && marketSearch && (
// //     <Text style={styles.helperText}>
// //       No markets found matching "{marketSearch}"
// //     </Text>
// //   )}
  
// //   {nearestMarket && !marketSearch && (
// //     <View style={styles.selectedMarketDisplay}>
// //       <Text style={styles.selectedMarketText}>✓ Market Selected</Text>
// //     </View>
// //   )}
// // </View>
// //     </View>

// //     <View style={styles.navigationButtons}>
// //       <TouchableOpacity
// //         style={[styles.button, styles.secondaryButton]}
// //         onPress={prevStep}
// //       >
// //         <Text style={styles.buttonText}>← Previous</Text>
// //       </TouchableOpacity>
// //       <TouchableOpacity
// //         style={[styles.button, styles.primaryButton]}
// //         onPress={handleSubmit}
// //       >
// //         <Text style={styles.buttonText}>Submit Post</Text>
// //       </TouchableOpacity>
// //     </View>
// //   </View>
// // )}
// //         </View>
// //       </ScrollView>
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#ffffff',
// //   },
// //   header: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     paddingHorizontal: 16,
// //     paddingVertical: 12,
// //     backgroundColor: '#ffffff',
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#e5e7eb',
// //   },
// //   backButton: {
// //     padding: 8,
// //     borderRadius: 20,
// //   },
// //   headerTitle: {
// //     fontSize: 18,
// //     fontWeight: '600',
// //     color: '#111827',
// //     marginLeft: 8,
// //   },
// //   scrollView: {
// //     flex: 1,
// //   },
// //   content: {
// //     padding: 16,
// //   },
// //   progressContainer: {
// //     position: 'relative',
// //     paddingVertical: 16,
// //   },
// //   progressLineContainer: {
// //     position: 'absolute',
// //     top: 28,
// //     left: 40,
// //     right: 40,
// //     height: 2,
// //   },
// //   progressLineBackground: {
// //     position: 'absolute',
// //     top: 0,
// //     left: 0,
// //     right: 0,
// //     height: 2,
// //     backgroundColor: '#e5e7eb',
// //   },
// //   progressLineCompleted: {
// //     position: 'absolute',
// //     top: 0,
// //     left: 0,
// //     height: 2,
// //     backgroundColor: '#16a34a',
// //   },
// //   stepsContainer: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     paddingHorizontal: 24,
// //     paddingVertical: 16,
// //   },
// //   stepIndicator: {
// //     alignItems: 'center',
// //     zIndex: 10,
// //   },
// //   stepCircle: {
// //     width: 32,
// //     height: 32,
// //     borderRadius: 16,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     borderWidth: 2,
// //   },
// //   stepCircleActive: {
// //     backgroundColor: '#16a34a',
// //     borderColor: '#16a34a',
// //   },
// //   stepCircleInactive: {
// //     backgroundColor: '#ffffff',
// //     borderColor: '#d1d5db',
// //   },
// //   stepNumber: {
// //     fontWeight: '500',
// //   },
// //   stepNumberActive: {
// //     color: '#ffffff',
// //   },
// //   stepNumberInactive: {
// //     color: '#9ca3af',
// //   },
// //   mapPreviewContainer: {
// //   height: 200,
// //   borderRadius: 8,
// //   overflow: 'hidden',
// //   marginBottom: 16,
// //   borderWidth: 1,
// //   borderColor: '#d1d5db',
// // },
// // mapPreview: {
// //   width: '100%',
// //   height: '100%',
// // },
// //   stepLabel: {
// //     fontSize: 12,
// //     marginTop: 4,
// //     textAlign: 'center',
// //   },
// //   stepLabelActive: {
// //     color: '#16a34a',
// //     fontWeight: '500',
// //   },
// //   stepLabelInactive: {
// //     color: '#6b7280',
// //   },
// //   label: {
// //     fontSize: 16,
// //     fontWeight: '500',
// //     marginBottom: 8,
// //     color: '#111827',
// //   },
// //   subLabel: {
// //     fontSize: 14,
// //     fontWeight: '500',
// //     marginBottom: 8,
// //     marginTop: 12,
// //     color: '#374151',
// //   },
// //   pickerContainer: {
// //     backgroundColor: '#ffffff',
// //     borderWidth: 1,
// //     borderColor: '#d1d5db',
// //     borderRadius: 8,
// //     marginBottom: 16,
// //   },
// //   picker: {
// //     height: 50,
// //     width: '100%',
// //     color: '#333333',
// //   },
// //   input: {
// //     backgroundColor: '#ffffff',
// //     borderWidth: 1,
// //     borderColor: '#d1d5db',
// //     borderRadius: 8,
// //     padding: 12,
// //     marginBottom: 16,
// //     fontSize: 16,
// //     color: '#111827',
// //   },
// //   textArea: {
// //     minHeight: 100,
// //     textAlignVertical: 'top',
// //   },
// //   section: {
// //     borderRadius: 8,
// //     marginBottom: 24,
// //   },
// //   sectionTitle: {
// //     fontSize: 18,
// //     fontWeight: '600',
// //     color: '#111827',
// //     marginBottom: 8,
// //   },
// //   formSection: {
// //     backgroundColor: '#f3f4f6',
// //     padding: 16,
// //     borderRadius: 8,
// //     marginBottom: 16,
// //   },
// //   navigationButtons: {
// //     flexDirection: 'row',
// //     gap: 16,
// //     marginTop: 24,
// //   },
// //   button: {
// //     flex: 1,
// //     paddingVertical: 12,
// //     borderRadius: 8,
// //     alignItems: 'center',
// //   },
// //   primaryButton: {
// //     backgroundColor: '#16a34a',
// //   },
// //   secondaryButton: {
// //     backgroundColor: '#6b7280',
// //   },
// //   mapContainer: {
// //   height: 250,
// //   borderRadius: 8,
// //   overflow: 'hidden',
// //   marginBottom: 16,
// //   borderWidth: 1,
// //   borderColor: '#d1d5db',
// // },
// // modalSubtitle: {
// //     fontSize: 14,
// //     color: '#6b7280',
// //     textAlign: 'center',
// //     marginBottom: 16,
// //     paddingHorizontal: 8,
// //   },
  

  
// //   map: {
// //     width: '100%',
// //     height: '100%',
// //   },
  
// //   coordinatesDisplay: {
// //     backgroundColor: '#f3f4f6',
// //     borderRadius: 8,
// //     padding: 12,
// //     marginBottom: 12,
// //   },
  
// //   coordinateText: {
// //     color: '#374151',
// //     fontSize: 13,
// //     textAlign: 'center',
// //   },
  
// //   currentLocationButton: {
// //     backgroundColor: '#16a34a',
// //     paddingVertical: 14,
// //     borderRadius: 8,
// //     marginBottom: 16,
// //     alignItems: 'center',
// //   },
  
// //   modalButtonsContainer: {
// //     flexDirection: 'row',
// //     gap: 12,
// //   },
  
// //   modalButton: {
// //     flex: 1,
// //     paddingVertical: 14,
// //     borderRadius: 8,
// //     alignItems: 'center',
// //   },
  
// //   cancelButton: {
// //     backgroundColor: '#6b7280',
// //   },
  
// //   confirmButton: {
// //     backgroundColor: '#16a34a',
// //   },
  
// //   locationModal: {
// //     backgroundColor: '#ffffff',
// //     borderRadius: 12,
// //     padding: 20,
// //     width: '90%',
// //     maxHeight: '85%',
// //   },
  
// //   modalTitle: {
// //     fontSize: 20,
// //     fontWeight: '600',
// //     marginBottom: 8,
// //     textAlign: 'center',
// //     color: '#111827',
// //   },
  
// //   buttonText: {
// //     color: '#ffffff',
// //     textAlign: 'center',
// //     fontWeight: '500',
// //     fontSize: 16,
// //   },

// //   addGradeHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 16,
// //   },
// //   addGradeButton: {
// //     backgroundColor: '#2196F3',
// //     paddingHorizontal: 16,
// //     paddingVertical: 8,
// //     borderRadius: 8,
// //   },
// //   addGradeButtonText: {
// //     color: '#ffffff',
// //     fontWeight: 'bold',
// //     fontSize: 18,
// //   },
// //   gradeCard: {
// //     backgroundColor: '#ffffff',
// //     borderWidth: 1,
// //     borderColor: '#d1d5db',
// //     borderRadius: 8,
// //     padding: 16,
// //     marginBottom: 12,
// //   },
// //   gradeCardActive: {
// //     borderColor: '#16a34a',
// //     backgroundColor: '#f0fdf4',
// //   },
// //   gradeCheckbox: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginBottom: 12,
// //   },
// //   checkbox: {
// //     width: 24,
// //     height: 24,
// //     borderWidth: 2,
// //     borderColor: '#9ca3af',
// //     borderRadius: 4,
// //     marginRight: 12,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //   },
// //   checkboxActive: {
// //     backgroundColor: '#16a34a',
// //     borderColor: '#16a34a',
// //   },
// //   checkmark: {
// //     color: '#ffffff',
// //     fontWeight: '600',
// //   },
// //   gradeLabel: {
// //     fontSize: 16,
// //     fontWeight: '500',
// //     color: '#111827',
// //   },
// //   rowInputs: {
// //     flexDirection: 'row',
// //     gap: 12,
// //     marginTop: 12,
// //   },
// //   halfInput: {
// //     flex: 1,
// //   },
// //   locationButton: {
// //     backgroundColor: '#FF9800',
// //     paddingVertical: 12,
// //     borderRadius: 8,
// //     marginBottom: 12,
// //   },
// //   manualLocationButton: {
// //     backgroundColor: '#9C27B0',
// //     paddingVertical: 12,
// //     borderRadius: 8,
// //     marginBottom: 16,
// //   },
// //   locationDisplay: {
// //     backgroundColor: '#ffffff',
// //     borderWidth: 1,
// //     borderColor: '#d1d5db',
// //     borderRadius: 8,
// //     padding: 12,
// //     marginBottom: 16,
// //   },
// //   locationText: {
// //     color: '#374151',
// //     fontSize: 14,
// //   },
// //   dateTimeSection: {
// //     marginTop: 16,
// //   },
// //   dateTimeButton: {
// //     backgroundColor: '#ffffff',
// //     borderWidth: 1,
// //     borderColor: '#d1d5db',
// //     borderRadius: 8,
// //     padding: 12,
// //     marginBottom: 12,
// //   },
// //   dateTimeText: {
// //     color: '#111827',
// //     fontSize: 16,
// //   },
// //   photoSection: {
// //     marginTop: 16,
// //   },
// //   helperText: {
// //     fontSize: 14,
// //     color: '#6b7280',
// //     marginBottom: 12,
// //   },
// //   cameraButton: {
// //     backgroundColor: '#2196F3',
// //     paddingVertical: 12,
// //     borderRadius: 8,
// //     marginBottom: 16,
// //   },
// //   photoGrid: {
// //     flexDirection: 'row',
// //     flexWrap: 'wrap',
// //     marginHorizontal: -4,
// //   },
// //   photoItem: {
// //     width: '33.33%',
// //     padding: 4,
// //     position: 'relative',
// //   },
// //   thumbnail: {
// //     width: '100%',
// //     aspectRatio: 1,
// //     borderRadius: 8,
// //   },
// //   removePhotoButton: {
// //     position: 'absolute',
// //     top: 8,
// //     right: 8,
// //     backgroundColor: '#ef4444',
// //     width: 24,
// //     height: 24,
// //     borderRadius: 12,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //   },
// //   removePhotoText: {
// //     color: '#ffffff',
// //     fontWeight: '600',
// //   },
// //   marketSection: {
// //     marginTop: 16,
// //   },
// //   modalContainer: {
// //     flex: 1,
// //     backgroundColor: '#000000',
// //   },
// //   imageContainer: {
// //     flex: 1,
// //   },
// //   previewImage: {
// //     flex: 1,
// //     width: '100%',
// //   },
// //   gpsOverlay: {
// //     position: 'absolute',
// //     bottom: 40,
// //     left: 20,
// //     right: 20,
// //   },
// //   gpsText: {
// //     color: '#ffffff',
// //     backgroundColor: 'rgba(0, 0, 0, 0.7)',
// //     padding: 12,
// //     fontSize: 16,
// //     borderRadius: 8,
// //     fontWeight: '500',
// //   },
// //   imageButtonsContainer: {
// //     flexDirection: 'row',
// //     padding: 16,
// //     backgroundColor: '#000000',
// //   },
// //   imageButton: {
// //     flex: 1,
// //     paddingVertical: 12,
// //     borderRadius: 8,
// //     marginHorizontal: 8,
// //   },
// //   retakeButton: {
// //     backgroundColor: '#ef4444',
// //   },
// //   saveButton: {
// //     backgroundColor: '#22c55e',
// //   },
// //   imageButtonText: {
// //     color: '#ffffff',
// //     textAlign: 'center',
// //     fontWeight: '500',
// //   },
// //   modalOverlay: {
// //     flex: 1,
// //     backgroundColor: 'rgba(0, 0, 0, 0.5)',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },

// //   inputLabel: {
// //     fontWeight: '500',
// //     marginBottom: 8,
// //     fontSize: 16,
// //   },
// //   selectedMarketDisplay: {
// //   backgroundColor: '#e8f5e9',
// //   padding: 12,
// //   borderRadius: 8,
// //   marginTop: 8,
// // },
// // selectedMarketText: {
// //   color: '#16a34a',
// //   fontSize: 14,
// //   fontWeight: '500',
// // },
// // globalSettingsCard: {
// //   backgroundColor: '#f0f0f0',
// //   padding: 16,
// //   borderRadius: 8,
// //   marginBottom: 20,
// // },
// // globalSettingsTitle: {
// //   fontSize: 16,
// //   fontWeight: '600',
// //   color: '#111827',
// //   marginBottom: 12,
// // },

// //   headerText: {
// //     fontSize: 20,
// //     fontWeight: "bold",
// //     color: "#000",
// //   },
// //   progressBarContainer: {
// //     width: "100%",
// //     height: 8,
// //     backgroundColor: "#e0e0e0",
// //     borderRadius: 4,
// //     marginBottom: 20,
// //     overflow: "hidden",
// //   },
// //   progressBar: {
// //     height: "100%",
// //     backgroundColor: "#4caf50",
// //     borderRadius: 4,
// //   },
// //   stepContainer: {
// //     marginBottom: 20,
// //   },
// //   stepTitle: {
// //     fontSize: 18,
// //     fontWeight: "bold",
// //     marginBottom: 15,
// //   },



// //   buttonDisabled: {
// //     backgroundColor: "#ccc",
// //   },
// //   buttonSecondary: {
// //     backgroundColor: "#757575",
// //   },

// //   buttonRow: {
// //     flexDirection: "row",
// //     marginTop: 20,
// //   },
// //   globalSettings: {
// //     backgroundColor: "#f0f0f0",
// //     padding: 15,
// //     borderRadius: 8,
// //     marginBottom: 25,
// //   },

// //   gradeHeader: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //     marginBottom: 10,
// //   },


// //   gradeCardSelected: {
// //     backgroundColor: "#e8f5e9",
// //   },
// //   checkboxContainer: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     marginBottom: 10,
// //   },

// //   checkboxChecked: {
// //     backgroundColor: "#4caf50",
// //   },

// //   gradeTitle: {
// //     fontSize: 16,
// //     fontWeight: "bold",
// //   },
// //   inputRow: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     gap: 10,
// //   },
// //   inputHalf: {
// //     flex: 1,
// //   },
// //   photoUploadSection: {
// //     marginTop: 15,
// //   },
// //   uploadButton: {
// //     backgroundColor: "#2196F3",
// //     padding: 12,
// //     borderRadius: 4,
// //     alignItems: "center",
// //     marginTop: 5,
// //     marginBottom: 10,
// //   },
// //   uploadButtonText: {
// //     color: "#fff",
// //     fontSize: 14,
// //     fontWeight: "bold",
// //   },

// //   photoPreview: {
// //     width: 100,
// //     height: 100,
// //     borderRadius: 4,
// //     borderWidth: 1,
// //     borderColor: "#ddd",
// //     position: "relative",
// //     overflow: "hidden",
// //   },
// //   photoImage: {
// //     width: "100%",
// //     height: "100%",
// //     resizeMode: "cover",
// //   },

// //   photoCount: {
// //     marginTop: 8,
// //     color: "#4caf50",
// //     fontSize: 13,
// //     fontWeight: "bold",
// //   },
// //   mapPlaceholder: {
// //     padding: 60,
// //     backgroundColor: "#e0e0e0",
// //     alignItems: "center",
// //     borderRadius: 4,
// //     marginBottom: 15,
// //     marginTop: 10,
// //   },
// //   mapPlaceholderText: {
// //     color: "#999",
// //     fontSize: 14,
// //   },

// // });

// // export default SellProductForm;














// import DateTimePicker from "@react-native-community/datetimepicker";
// import { Picker } from "@react-native-picker/picker";
// import axios from "axios";
// import * as ImagePicker from "expo-image-picker";
// import * as Location from "expo-location";
// import { ChevronLeft } from "lucide-react-native";
// import React, { useEffect, useState } from "react";
// import MapView, { Marker } from "react-native-maps";
// import {
//   ActivityIndicator,
//   Alert,
//   Dimensions,
//   Image,
//   Modal,
//   Platform,
//   ScrollView,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

// interface Category {
//   _id: string;
//   categoryId: string;
//   categoryName: string;
// }

// interface SubCategory {
//   _id: string;
//   subCategoryId: string;
//   subCategoryName: string;
//   categoryId: string;
// }

// interface GradePrice {
//   grade: string;
//   pricePerUnit: string;
//   totalQty: string;
//   photos: any[];
// }

// interface Packaging {
//   _id: string;
//   packageType: string;
//   measurements: string[];
// }

// interface Market {
//   _id: string;
//   marketId: string;
//   marketName: string;
//   pincode: string;
//   postOffice?: string;
//   district?: string;
//   state?: string;
//   exactAddress: string;
//   landmark?: string;
// }

// interface CapturedPhoto {
//   uri: string;
//   watermarkedUri?: string;
// }

// const { width, height } = Dimensions.get("window");

// const SellProductForm: React.FC = ({ route }: any) => {
//   const [step, setStep] = useState(1);

//   // Step 1: Category & Basic Info
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
//   const [cropBriefDetails, setCropBriefDetails] = useState("");

//   const { categoryId, subCategoryId } = route?.params || {};
//   const [selectedCategory, setSelectedCategory] = useState(categoryId || "");
//   const [selectedSubCategory, setSelectedSubCategory] = useState(subCategoryId || "");

//   const [globalQuantityType, setGlobalQuantityType] = useState("");
//   const [globalPriceType, setGlobalPriceType] = useState("");

//   // Step 2: Farming & Packaging Details
//   const [farmingType, setFarmingType] = useState("");
//   const [typeOfSeeds, setTypeOfSeeds] = useState("");
//   const [packagingType, setPackagingType] = useState("");
//   const [packageMeasurement, setPackageMeasurement] = useState("");
//   const [unitMeasurement, setUnitMeasurement] = useState("");
//   const [packagingOptions, setPackagingOptions] = useState<Packaging[]>([]);
//   const [selectedPackaging, setSelectedPackaging] = useState<Packaging | null>(null);
//   const [markets, setMarkets] = useState<Market[]>([]);
//   const [filteredMarkets, setFilteredMarkets] = useState<Market[]>([]);
//   const [marketSearch, setMarketSearch] = useState("");
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [showTimePicker, setShowTimePicker] = useState(false);
  
//   // Step 3: Grade & Pricing
//   const [gradePrices, setGradePrices] = useState<GradePrice[]>([
//     { grade: "A Grade", pricePerUnit: "", totalQty: "", photos: [] },
//     { grade: "B Grade", pricePerUnit: "", totalQty: "", photos: [] },
//     { grade: "All Mixed Grades", pricePerUnit: "", totalQty: "", photos: [] },
//   ]);
//   const [gradeCounter, setGradeCounter] = useState(2);
//   const [selectedGrades, setSelectedGrades] = useState<string[]>([]);

//   // Step 4: Final Details
//   const [deliveryDate, setDeliveryDate] = useState(new Date());
//   const [deliveryTime, setDeliveryTime] = useState(new Date());
//   const [nearestMarket, setNearestMarket] = useState("");
//   const [cropPhotos, setCropPhotos] = useState<CapturedPhoto[]>([]);
//   const [farmLocation, setFarmLocation] = useState({
//     latitude: 12.9716,
//     longitude: 77.5946,
//   });

//   // Camera States
//   const [showCamera, setShowCamera] = useState(false);
//   const [capturedImage, setCapturedImage] = useState<string | null>(null);
//   const [gpsText, setGpsText] = useState("");

//   // Map States
//   const [showLocationPicker, setShowLocationPicker] = useState(false);
//   const [isGettingLocation, setIsGettingLocation] = useState(false);

//   const compressImage = async (uri: string) => {
//     try {
//       const manipResult = await manipulateAsync(
//         uri,
//         [{ resize: { width: 800 } }],
//         { compress: 0.6, format: SaveFormat.JPEG }
//       );
//       return manipResult.uri;
//     } catch (error) {
//       console.error('Error compressing image:', error);
//       return uri;
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//     requestLocationPermission();
//     fetchPackaging();
//     fetchMarkets();
//   }, []);

//   useEffect(() => {
//     return () => {
//       if (step !== 4 && capturedImage) {
//         setCapturedImage(null);
//         setGpsText("");
//       }
//     };
//   }, [step]);

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

//   const fetchCategories = async () => {
//     try {
//       const res = await axios.get("https://kisan.etpl.ai/category/all");
//       setCategories(res.data.data);
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//     }
//   };

//   const fetchSubCategories = async (categoryId: string) => {
//     try {
//       const res = await axios.get(
//         `https://kisan.etpl.ai/subcategory/category/${categoryId}`
//       );
//       setSubCategories(res.data.data);
//     } catch (error) {
//       console.error("Error fetching subcategories:", error);
//     }
//   };

//   const fetchPackaging = async () => {
//     try {
//       const res = await axios.get("https://kisan.etpl.ai/api/packaging/all");
//       setPackagingOptions(res.data);
//     } catch (error) {
//       console.error("Error fetching packaging:", error);
//     }
//   };

//   const fetchMarkets = async () => {
//     try {
//       const res = await axios.get("https://kisan.etpl.ai/api/market/all");
//       setMarkets(res.data.data || res.data);
//       setFilteredMarkets(res.data.data || res.data);
//     } catch (error) {
//       console.error("Error fetching markets:", error);
//     }
//   };

//   const handleMarketSearch = (searchValue: string) => {
//     setMarketSearch(searchValue);
    
//     if (!searchValue.trim()) {
//       setFilteredMarkets(markets);
//       return;
//     }
    
//     const filtered = markets.filter(market => 
//       market.marketName.toLowerCase().includes(searchValue.toLowerCase()) ||
//       market.pincode.includes(searchValue) ||
//       market.district?.toLowerCase().includes(searchValue.toLowerCase()) ||
//       market.exactAddress.toLowerCase().includes(searchValue.toLowerCase())
//     );
    
//     setFilteredMarkets(filtered);
//   };

//   const onDateChange = (event: any, selectedDate?: Date) => {
//     setShowDatePicker(Platform.OS === "ios");
//     if (selectedDate) {
//       setDeliveryDate(selectedDate);
//     }
//   };

//   const onTimeChange = (event: any, selectedTime?: Date) => {
//     setShowTimePicker(Platform.OS === "ios");
//     if (selectedTime) {
//       setDeliveryTime(selectedTime);
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

//   const handleGradeToggle = (grade: string) => {
//     if (selectedGrades.includes(grade)) {
//       setSelectedGrades(selectedGrades.filter((g) => g !== grade));
//     } else {
//       setSelectedGrades([...selectedGrades, grade]);
//     }
//   };

//   const handleGradePriceChange = (index: number, field: string, value: string) => {
//     if ((field === "pricePerUnit" || field === "totalQty") && parseFloat(value) < 0) {
//       return;
//     }
//     const updated = [...gradePrices];
//     updated[index] = { ...updated[index], [field]: value };
//     setGradePrices(updated);
//   };

//   const handleAddGrade = () => {
//     const nextGrade = String.fromCharCode(65 + gradeCounter);
//     const newGrade: GradePrice = {
//       grade: `${nextGrade} Grade`,
//       pricePerUnit: "",
//       totalQty: "",
//       photos: [],
//     };
//     setGradePrices([...gradePrices.slice(0, -1), newGrade, gradePrices[gradePrices.length - 1]]);
//     setGradeCounter(gradeCounter + 1);
//   };

//   const handleRemoveGradePhoto = (gradeIndex: number, photoIndex: number) => {
//     const updated = [...gradePrices];
//     updated[gradeIndex].photos = updated[gradeIndex].photos.filter((_, idx) => idx !== photoIndex);
//     setGradePrices(updated);
//   };

//   const handleGradePhotoUpload = async (index: number) => {
//     Alert.alert(
//       "Select Media",
//       "Choose photo or video",
//       [
//         {
//           text: "Camera",
//           onPress: async () => {
//             const result = await ImagePicker.launchCameraAsync({
//               mediaTypes: ImagePicker.MediaTypeOptions.Images,
//               allowsEditing: true,
//               quality: 0.5,
//             });
//             if (!result.canceled && result.assets) {
//               const compressedAssets = await Promise.all(
//                 result.assets.map(async (asset) => ({
//                   ...asset,
//                   uri: await compressImage(asset.uri)
//                 }))
//               );
              
//               const updated = [...gradePrices];
//               updated[index] = {
//                 ...updated[index],
//                 photos: [...updated[index].photos, ...compressedAssets].slice(0, 5),
//               };
//               setGradePrices(updated);
//             }
//           },
//         },
//         {
//           text: "Gallery",
//           onPress: async () => {
//             const result = await ImagePicker.launchImageLibraryAsync({
//               mediaTypes: ImagePicker.MediaTypeOptions.Images,
//               allowsMultipleSelection: true,
//               quality: 0.5,
//             });
//             if (!result.canceled && result.assets) {
//               const compressedAssets = await Promise.all(
//                 result.assets.slice(0, 5).map(async (asset) => ({
//                   ...asset,
//                   uri: await compressImage(asset.uri)
//                 }))
//               );
              
//               const updated = [...gradePrices];
//               updated[index] = {
//                 ...updated[index],
//                 photos: [...updated[index].photos, ...compressedAssets].slice(0, 5),
//               };
//               setGradePrices(updated);
//             }
//           },
//         },
//         { text: "Cancel", style: "cancel" },
//       ]
//     );
//   };

//   const handlePhotoUpload = async () => {
//     Alert.alert(
//       "Select Media",
//       "Choose photo or video",
//       [
//         {
//           text: "Camera",
//           onPress: async () => {
//             const result = await ImagePicker.launchCameraAsync({
//               mediaTypes: ImagePicker.MediaTypeOptions.All,
//               allowsEditing: true,
//               quality: 0.8,
//             });
//             if (!result.canceled && result.assets) {
//               setCropPhotos([...cropPhotos, ...result.assets]);
//             }
//           },
//         },
//         {
//           text: "Gallery",
//           onPress: async () => {
//             const result = await ImagePicker.launchImageLibraryAsync({
//               mediaTypes: ImagePicker.MediaTypeOptions.All,
//               allowsMultipleSelection: true,
//               quality: 0.8,
//             });
//             if (!result.canceled && result.assets) {
//               setCropPhotos([...cropPhotos, ...result.assets]);
//             }
//           },
//         },
//         { text: "Cancel", style: "cancel" },
//       ]
//     );
//   };

//   const openCamera = async () => {
//     try {
//       if (cropPhotos.length >= 3) {
//         Alert.alert("Limit Reached", "Maximum 3 photos allowed");
//         return;
//       }

//       const { status } = await ImagePicker.requestCameraPermissionsAsync();
//       if (status !== "granted") {
//         Alert.alert("Permission Denied", "Camera permission is required");
//         return;
//       }

//       const result = await ImagePicker.launchCameraAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: false,
//         quality: 0.3,
//         exif: false,
//         base64: false,
//       });

//       if (result.canceled || !result.assets?.[0]) return;

//       const compressedUri = await compressImage(result.assets[0].uri);

//       const loc = await Location.getCurrentPositionAsync({
//         accuracy: Location.Accuracy.Balanced,
//       });
      
//       const text = `Lat: ${loc.coords.latitude.toFixed(6)}\nLon: ${loc.coords.longitude.toFixed(6)}\n${new Date().toLocaleString()}`;
      
//       setGpsText(text);
//       setCapturedImage(compressedUri);
//     } catch (error) {
//       console.error("Camera error:", error);
//       Alert.alert("Error", "Failed to open camera");
//     }
//   };

//   const saveWithWatermark = async () => {
//     try {
//       console.log("Saving photo...");
      
//       if (!capturedImage) {
//         Alert.alert("Error", "No image to save");
//         return;
//       }

//       if (cropPhotos.length >= 3) {
//         Alert.alert("Limit Reached", "Maximum 3 photos allowed");
//         setCapturedImage(null);
//         setGpsText("");
//         return;
//       }

//       const newPhoto = { 
//         uri: capturedImage, 
//         watermarkedUri: capturedImage,
//         timestamp: new Date().toISOString()
//       };

//       console.log("Adding photo:", newPhoto);
      
//       setCropPhotos([...cropPhotos, newPhoto]);
//       setCapturedImage(null);
//       setGpsText("");
      
//       Alert.alert("Success", "Photo saved!");
//     } catch (error) {
//       console.error("Error saving photo:", error);
//       Alert.alert("Error", "Failed to save photo");
//     }
//   };

//   const removePhoto = (index: number) => {
//     const updated = cropPhotos.filter((_, i) => i !== index);
//     setCropPhotos(updated);
//   };

//   const getCurrentLocation = async () => {
//     setIsGettingLocation(true);
//     try {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         Alert.alert("Permission Denied", "Location permission is required");
//         setIsGettingLocation(false);
//         return;
//       }

//       const location = await Location.getCurrentPositionAsync({
//         accuracy: Location.Accuracy.High,
//       });

//       setFarmLocation({
//         latitude: location.coords.latitude,
//         longitude: location.coords.longitude,
//       });

//       Alert.alert("Success", "Current location captured!");
//     } catch (error) {
//       console.error("Error getting location:", error);
//       Alert.alert("Error", "Failed to get current location");
//     } finally {
//       setIsGettingLocation(false);
//     }
//   };

//   const openLocationPicker = () => {
//     setShowLocationPicker(true);
//   };

//   const saveManualLocation = () => {
//     if (farmLocation.latitude && farmLocation.longitude) {
//       setShowLocationPicker(false);
//       Alert.alert("Success", "Location saved!");
//     } else {
//       Alert.alert("Error", "Please enter valid coordinates");
//     }
//   };

//   const handleSubmit = async () => {
//     if (cropPhotos.length > 3) {
//       Alert.alert("Too Many Photos", "Please limit to 3 photos maximum.");
//       return;
//     }

//     if (!selectedCategory || !selectedSubCategory) {
//       Alert.alert("Missing Information", "Please fill in all required fields");
//       return;
//     }

//     if (!cropBriefDetails || !farmingType || !typeOfSeeds) {
//       Alert.alert("Missing Information", "Please fill in all farming details");
//       return;
//     }

//     if (selectedGrades.length === 0) {
//       Alert.alert("Missing Information", "Please select at least one grade");
//       return;
//     }

//     if (!globalQuantityType || !globalPriceType) {
//       Alert.alert("Missing Information", "Please select Quantity Type and Price Type");
//       return;
//     }

//     const selectedGradeObjects = gradePrices.filter((gp) => 
//       selectedGrades.includes(gp.grade)
//     );

//     for (const gp of selectedGradeObjects) {
//       if (!gp.pricePerUnit || !gp.totalQty) {
//         Alert.alert(
//           "Incomplete Grade Information", 
//           `Please fill Price and Quantity for ${gp.grade}`
//         );
//         return;
//       }
//     }

//     if (!nearestMarket) {
//       Alert.alert("Missing Information", "Please enter nearest market");
//       return;
//     }

//     const formData = new FormData();
    
//     formData.append("categoryId", selectedCategory);
//     formData.append("subCategoryId", selectedSubCategory);
//     formData.append("cropBriefDetails", cropBriefDetails);
//     formData.append("farmingType", farmingType);
//     formData.append("typeOfSeeds", typeOfSeeds);
//     formData.append("packagingType", packagingType);
//     formData.append("packageMeasurement", packageMeasurement);
//     formData.append("unitMeasurement", unitMeasurement);
//     formData.append("deliveryDate", formatDate(deliveryDate));
//     formData.append("deliveryTime", formatTime(deliveryTime));
//     formData.append("nearestMarket", nearestMarket);
    
//     formData.append("farmLocation", JSON.stringify({
//       lat: farmLocation.latitude.toString(),
//       lng: farmLocation.longitude.toString()
//     }));

//     const selectedGradeData = gradePrices
//       .filter((gp) => selectedGrades.includes(gp.grade))
//       .map((gp) => ({
//         grade: gp.grade,
//         pricePerUnit: gp.pricePerUnit,
//         totalQty: gp.totalQty,
//         quantityType: globalQuantityType,
//         priceType: globalPriceType,
//       }));

//     formData.append("gradePrices", JSON.stringify(selectedGradeData));

//     gradePrices.forEach((gp) => {
//       if (selectedGrades.includes(gp.grade)) {
//         gp.photos.forEach((photo) => {
//           formData.append(`gradePhotos_${gp.grade}`, {
//             uri: photo.uri,
//             type: photo.type || "image/jpeg",
//             name: photo.fileName || `grade_${gp.grade}_${Date.now()}.jpg`,
//           } as any);
//         });
//       }
//     });

//     cropPhotos.forEach((photo) => {
//       formData.append(`photos`, {
//         uri: photo.uri,
//         type: photo.type as string || "image/jpeg",
//         name: photo.fileName || `photo_${Date.now()}.jpg`,
//       } as any);
//     });

//     try {
//       console.log("Submitting product...");
//       console.log("Grade data being sent:", selectedGradeData);

//       const response = await axios.post(
//         "https://kisan.etpl.ai/product/add",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//           timeout: 30000,
//           maxContentLength: Infinity,
//           maxBodyLength: Infinity,
//         }
//       );

//       console.log("Response:", response.data);
//       Alert.alert("Success", "Product added successfully!");
//       setStep(1);
//       resetForm();
//     } catch (error: any) {
//       console.error("Error submitting product:", error);
//       console.error("Error response:", error.response?.data);

//       if (error.response?.status === 413) {
//         Alert.alert(
//           "Upload Too Large",
//           "The images are too large. Please use fewer photos or lower quality."
//         );
//       } else if (error.response?.status === 500) {
//         Alert.alert(
//           "Server Error",
//           "Server error: " + (error.response?.data?.message || "Please try again")
//         );
//       } else if (error.response?.status === 400) {
//         Alert.alert(
//           "Validation Error",
//           "Invalid data: " + (error.response?.data?.message || "Please check all fields")
//         );
//       } else if (error.code === 'ECONNABORTED') {
//         Alert.alert(
//           "Timeout",
//           "Upload timed out. Please try again with fewer/smaller photos."
//         );
//       } else if (error.code === 'ECONNREFUSED') {
//         Alert.alert(
//           "Connection Error",
//           "Cannot connect to server. Please check your internet connection."
//         );
//       } else {
//         Alert.alert(
//           "Error",
//           "Failed to submit: " + (error.message || "Unknown error")
//         );
//       }
//     }
//   };

//   const resetForm = () => {
//     setSelectedCategory("");
//     setSelectedSubCategory("");
//     setCropBriefDetails("");
//     setFarmingType("");
//     setTypeOfSeeds("");
//     setPackagingType("");
//     setPackageMeasurement("");
//     setUnitMeasurement("");
//     setSelectedGrades([]);
//     setDeliveryDate(new Date());
//     setDeliveryTime(new Date());
//     setNearestMarket("");
//     setCropPhotos([]);
//     setGradeCounter(2);
//   };

//   const nextStep = () => {
//     if (step < 4) setStep(step + 1);
//   };

//   const prevStep = () => {
//     if (step > 1) setStep(step - 1);
//   };

//   const getStepTitle = () => {
//     switch(step) {
//       case 1: return "Category & Product";
//       case 2: return "Farming & Packaging";
//       case 3: return "Pricing & Details";
//       case 4: return "Final Details";
//       default: return "Sell Your Produce";
//     }
//   };

//   const renderProgressBar = () => {
//     const totalSteps = 4;
//     const progress = (step - 1) / (totalSteps - 1);
    
//     return (
//       <View className="relative py-4">
//         <View className="absolute top-1/2 left-10 right-10 h-0.5">
//           <View className="absolute top-0 left-0 right-0 h-0.5 bg-gray-300" />
//           <View className="absolute top-0 left-0 h-0.5 bg-green-300" style={{ width: `${progress * 100}%` }} />
//         </View>
        
//         <View className="flex-row justify-between px-6 py-4">
//           {[1, 2, 3, 4].map((stepNum) => (
//             <View key={stepNum} className="items-center z-10">
//               <View
//                 className={`w-8 h-8 rounded-full items-center justify-center border-2 ${
//                   step >= stepNum ? 'bg-green-600 border-green-600' : 'bg-white border-gray-300'
//                 }`}
//               >
//                 <Text className={`font-medium ${step >= stepNum ? 'text-white' : 'text-gray-400'}`}>
//                   {stepNum}
//                 </Text>
//               </View>
//               <Text className={`text-xs mt-1 text-center ${step >= stepNum ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
//                 {stepNum === 1 ? "Category" : stepNum === 2 ? "Farming" : stepNum === 3 ? "Pricing" : "Details"}
//               </Text>
//             </View>
//           ))}
//         </View>
//       </View>
//     );
//   };

//   return (
//     <View className="flex-1 bg-white">
//       <View className="flex-row items-center bg-white px-4 py-3 border-b border-gray-200">
//         <TouchableOpacity
//           onPress={prevStep}
//           activeOpacity={0.7}
//           className="p-2 rounded-full"
//         >
//           <ChevronLeft size={20} color="#064E3B" />
//         </TouchableOpacity>

//         <Text className="ml-2 text-lg font-medium text-gray-900">
//           {getStepTitle()}
//         </Text>
//       </View>

//       <Modal visible={!!capturedImage} animationType="slide" transparent={false}>
//         <View className="flex-1 bg-black">
//           <View className="flex-1">
//             {capturedImage ? (
//               <Image
//                 source={{ uri: capturedImage }}
//                 className="flex-1 w-full"
//                 resizeMode="contain"
//                 onError={(error) => {
//                   console.error("Image load error:", error.nativeEvent);
//                   Alert.alert("Error", "Failed to load image");
//                   setCapturedImage(null);
//                   setGpsText("");
//                 }}
//                 onLoad={() => console.log("Image loaded successfully")}
//               />
//             ) : null}
//             {gpsText ? (
//               <View className="absolute bottom-10 left-5 right-5">
//                 <Text className="text-white bg-black/70 p-3 text-base rounded-lg font-medium">
//                   {gpsText}
//                 </Text>
//               </View>
//             ) : null}
//           </View>
//           <View className="flex-row p-4 bg-black">
//             <TouchableOpacity
//               className="flex-1 py-3 rounded-lg mx-2 bg-red-500"
//               onPress={() => {
//                 setCapturedImage(null);
//                 setGpsText("");
//               }}
//             >
//               <Text className="text-white text-center font-medium">Retake</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               className="flex-1 py-3 rounded-lg mx-2 bg-green-500"
//               onPress={saveWithWatermark}
//             >
//               <Text className="text-white text-center font-medium">Save Photo</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       <Modal visible={showLocationPicker} animationType="slide" transparent={true}>
//         <View className="flex-1 bg-black/50 justify-center items-center">
//           <View className="bg-white rounded-xl p-5 w-11/12 max-h-5/6">
//             <Text className="text-xl font-medium mb-2 text-center text-gray-900">
//               Select Farm Location
//             </Text>
//             <Text className="text-sm text-gray-500 text-center mb-4 px-2">
//               Tap on the map or drag the marker to select your farm location
//             </Text>

//             <View className="h-64 rounded-lg overflow-hidden mb-4 border border-gray-300">
//               <MapView
//                 className="w-full h-full"
//                 region={{
//                   latitude: farmLocation.latitude,
//                   longitude: farmLocation.longitude,
//                   latitudeDelta: 0.05,
//                   longitudeDelta: 0.05,
//                 }}
//                 onPress={(e) => {
//                   setFarmLocation({
//                     latitude: e.nativeEvent.coordinate.latitude,
//                     longitude: e.nativeEvent.coordinate.longitude,
//                   });
//                 }}
//               >
//                 <Marker
//                   coordinate={{
//                     latitude: farmLocation.latitude,
//                     longitude: farmLocation.longitude,
//                   }}
//                   draggable
//                   onDragEnd={(e) => {
//                     setFarmLocation({
//                       latitude: e.nativeEvent.coordinate.latitude,
//                       longitude: e.nativeEvent.coordinate.longitude,
//                     });
//                   }}
//                   title="Farm Location"
//                   description="Drag me to adjust position"
//                 />
//               </MapView>
//             </View>

//             <View className="bg-gray-50 rounded-lg p-3 mb-3">
//               <Text className="text-gray-700 text-center">
//                 Selected Location:
//               </Text>
//               <Text className="text-gray-700 text-center text-xs">
//                 Lat: {farmLocation.latitude.toFixed(6)}, Lon: {farmLocation.longitude.toFixed(6)}
//               </Text>
//             </View>

//             <TouchableOpacity
//               className="bg-green-600 py-3.5 rounded-lg mb-4 items-center"
//               onPress={getCurrentLocation}
//               disabled={isGettingLocation}
//             >
//               {isGettingLocation ? (
//                 <ActivityIndicator color="#fff" />
//               ) : (
//                 <Text className="text-white font-medium">Use My Current Location</Text>
//               )}
//             </TouchableOpacity>

//             <View className="flex-row gap-3">
//               <TouchableOpacity
//                 className="flex-1 py-3.5 rounded-lg items-center bg-gray-500"
//                 onPress={() => setShowLocationPicker(false)}
//               >
//                 <Text className="text-white font-medium">Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 className="flex-1 py-3.5 rounded-lg items-center bg-green-600"
//                 onPress={saveManualLocation}
//               >
//                 <Text className="text-white font-medium">Confirm Location</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
//         {renderProgressBar()}
        
//         <View className="p-4 pb-24">
//           {step === 1 && (
//             <View>
//               <Text className="text-base font-medium mb-2 text-gray-900">Crop Brief Details</Text>
//               <TextInput
//                 className="bg-white border border-gray-300 rounded-lg p-3 mb-4 text-base text-gray-900 min-h-24"
//                 placeholder="Enter brief description"
//                 value={cropBriefDetails}
//                 onChangeText={setCropBriefDetails}
//                 multiline
//                 numberOfLines={4}
//                 textAlignVertical="top"
//               />
//             </View>
//           )}

//           {step === 2 && (
//             <View>
//               <Text className="text-lg font-medium mb-4 text-gray-900">Farming & Packaging Details</Text>

//               <View className="bg-gray-50 p-4 rounded-lg mb-4">
//                 <Text className="text-base font-medium mb-2 text-gray-900">Farming Type</Text>
//                 <View className="bg-white border border-gray-300 rounded-lg mb-4">
//                   <Picker
//                     selectedValue={farmingType}
//                     onValueChange={setFarmingType}
//                     className="h-12 text-gray-900"
//                   >
//                     <Picker.Item label="Select Farming Type" value="" />
//                     <Picker.Item label="Drop Down 1" value="drop down 1" />
//                     <Picker.Item label="Regular" value="regular" />
//                     <Picker.Item label="Organic" value="organic" />
//                   </Picker>
//                 </View>

//                 <Text className="text-base font-medium mb-2 text-gray-900">Type of Seeds</Text>
//                 <TextInput
//                   className="bg-white border border-gray-300 rounded-lg p-3 mb-4 text-base text-gray-900"
//                   placeholder="e.g., Naati, Hybrid"
//                   value={typeOfSeeds}
//                   onChangeText={setTypeOfSeeds}
//                 />

//                 <Text className="text-base font-medium mb-2 text-gray-900">Packaging Type</Text>
//                 <View className="bg-white border border-gray-300 rounded-lg mb-4">
//                   <Picker
//                     selectedValue={packagingType}
//                     onValueChange={(value) => {
//                       setPackagingType(value);
//                       const selected = packagingOptions.find(p => p.packageType === value);
//                       setSelectedPackaging(selected || null);
//                       setPackageMeasurement("");
//                     }}
//                     className="h-12 text-gray-900"
//                   >
//                     <Picker.Item label="Select Package Type" value="" />
//                     {packagingOptions.map((pkg) => (
//                       <Picker.Item key={pkg._id} label={pkg.packageType} value={pkg.packageType} />
//                     ))}
//                   </Picker>
//                 </View>

//                 {selectedPackaging && selectedPackaging.measurements.length > 0 && (
//                   <View>
//                     <Text className="text-base font-medium mb-2 text-gray-900">Measurement</Text>
//                     <View className="bg-white border border-gray-300 rounded-lg mb-4">
//                       <Picker
//                         selectedValue={packageMeasurement}
//                         onValueChange={setPackageMeasurement}
//                         className="h-12 text-gray-900"
//                       >
//                         <Picker.Item label="Select Measurement" value="" />
//                         {selectedPackaging.measurements.map((measurement, idx) => (
//                           <Picker.Item key={idx} label={measurement} value={measurement} />
//                         ))}
//                       </Picker>
//                     </View>
//                   </View>
//                 )}

//                 <Text className="text-base font-medium mb-2 text-gray-900">Unit Measurement</Text>
//                 <TextInput
//                   className="bg-white border border-gray-300 rounded-lg p-3 mb-4 text-base text-gray-900"
//                   placeholder="e.g., kg per box"
//                   value={unitMeasurement}
//                   onChangeText={setUnitMeasurement}
//                 />
//               </View>
//             </View>
//           )}

//           {step === 3 && (
//             <View>
//               <Text className="text-lg font-medium mb-4 text-gray-900">Add Pricing & Details</Text>

//               <View className="bg-gray-50 p-4 rounded-lg mb-6">
//                 <Text className="text-base font-medium mb-3 text-gray-900">Global Settings</Text>

//                 <Text className="text-base font-medium mb-2 text-gray-900">Quantity Type</Text>
//                 <View className="bg-white border border-gray-300 rounded-lg mb-4">
//                   <Picker
//                     selectedValue={globalQuantityType}
//                     onValueChange={(value) => setGlobalQuantityType(value)}
//                     className="h-12 text-gray-900"
//                   >
//                     <Picker.Item label="Select Type" value="" />
//                     <Picker.Item label="Bulk" value="bulk" />
//                     <Picker.Item label="Split" value="split" />
//                   </Picker>
//                 </View>

//                 <Text className="text-base font-medium mb-2 text-gray-900">Price Type</Text>
//                 <View className="bg-white border border-gray-300 rounded-lg mb-4">
//                   <Picker
//                     selectedValue={globalPriceType}
//                     onValueChange={(value) => setGlobalPriceType(value)}
//                     className="h-12 text-gray-900"
//                   >
//                     <Picker.Item label="Select Type" value="" />
//                     <Picker.Item label="Fixed" value="fixed" />
//                     <Picker.Item label="Negotiable" value="negotiable" />
//                   </Picker>
//                 </View>
//               </View>

//               <View className="flex-row justify-between items-center mb-4">
//                 <Text className="text-base font-medium text-gray-900">Select Grades & Add Pricing</Text>
//                 <TouchableOpacity className="bg-blue-500 px-4 py-2 rounded-lg" onPress={handleAddGrade}>
//                   <Text className="text-white font-medium text-base">+ Add Grade</Text>
//                 </TouchableOpacity>
//               </View>

//               {gradePrices.map((gp, index) => (
//                 <View
//                   key={index}
//                   className={`bg-white border border-gray-300 rounded-lg p-4 mb-3 ${
//                     selectedGrades.includes(gp.grade) ? 'bg-green-50 border-green-500' : ''
//                   }`}
//                 >
//                   <TouchableOpacity
//                     className="flex-row items-center mb-2"
//                     onPress={() => handleGradeToggle(gp.grade)}
//                   >
//                     <View
//                       className={`w-6 h-6 border-2 rounded mr-3 items-center justify-center ${
//                         selectedGrades.includes(gp.grade) ? 'bg-green-600 border-green-600' : 'border-gray-400'
//                       }`}
//                     >
//                       {selectedGrades.includes(gp.grade) && (
//                         <Text className="text-white font-medium">✓</Text>
//                       )}
//                     </View>
//                     <Text className="text-base font-medium text-gray-900">{gp.grade}</Text>
//                   </TouchableOpacity>

//                   {selectedGrades.includes(gp.grade) && (
//                     <View>
//                       <View className="flex-row gap-3">
//                         <View className="flex-1">
//                           <Text className="text-base font-medium mb-2 text-gray-700">Price / unit</Text>
//                           <TextInput
//                             className="bg-white border border-gray-300 rounded-lg p-3 text-base text-gray-900"
//                             placeholder="Price"
//                             value={gp.pricePerUnit}
//                             onChangeText={(value) => {
//                               if (value === "" || parseFloat(value) >= 0) {
//                                 handleGradePriceChange(index, "pricePerUnit", value);
//                               }
//                             }}
//                             keyboardType="numeric"
//                           />
//                         </View>
//                         <View className="flex-1">
//                           <Text className="text-base font-medium mb-2 text-gray-700">Total Qty</Text>
//                           <TextInput
//                             className="bg-white border border-gray-300 rounded-lg p-3 text-base text-gray-900"
//                             placeholder="Quantity"
//                             value={gp.totalQty}
//                             onChangeText={(value) => {
//                               if (value === "" || parseFloat(value) >= 0) {
//                                 handleGradePriceChange(index, "totalQty", value);
//                               }
//                             }}
//                             keyboardType="numeric"
//                           />
//                         </View>
//                       </View>

//                       <View className="mt-4">
//                         <Text className="text-base font-medium mb-2 text-gray-900">Upload Photos for {gp.grade}</Text>
//                         <TouchableOpacity
//                           className="bg-blue-500 p-3 rounded-lg mb-3"
//                           onPress={() => handleGradePhotoUpload(index)}
//                         >
//                           <Text className="text-white text-center font-medium">Select Media</Text>
//                         </TouchableOpacity>

//                         {gp.photos.length > 0 && (
//                           <View className="flex-row flex-wrap">
//                             {gp.photos.map((photo, photoIdx) => (
//                               <View key={photoIdx} className="w-1/3 p-1">
//                                 <View className="relative">
//                                   <Image source={{ uri: photo.uri }} className="w-full aspect-square rounded" />
//                                   <TouchableOpacity
//                                     className="absolute top-1 right-1 bg-red-500 w-6 h-6 rounded-full items-center justify-center"
//                                     onPress={() => handleRemoveGradePhoto(index, photoIdx)}
//                                   >
//                                     <Text className="text-white font-medium">×</Text>
//                                   </TouchableOpacity>
//                                 </View>
//                               </View>
//                             ))}
//                           </View>
//                         )}

//                         {gp.photos.length > 0 && (
//                           <Text className="mt-2 text-green-600 text-sm font-medium">{gp.photos.length} file(s) selected</Text>
//                         )}
//                       </View>
//                     </View>
//                   )}
//                 </View>
//               ))}
//             </View>
//           )}

//           {step === 4 && (
//             <View>
//               <Text className="text-lg font-medium mb-4 text-gray-900">Final Details</Text>

//               <View className="bg-gray-50 p-4 rounded-lg mb-4">
//                 <Text className="text-base font-medium mb-2 text-gray-900">Farm Location</Text>
                
//                 <TouchableOpacity 
//                   className="bg-orange-500 py-3 rounded-lg mb-3" 
//                   onPress={getCurrentLocation} 
//                   disabled={isGettingLocation}
//                 >
//                   {isGettingLocation ? (
//                     <ActivityIndicator color="#fff" />
//                   ) : (
//                     <Text className="text-white text-center font-medium">Get Current Location</Text>
//                   )}
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   className="bg-purple-600 py-3 rounded-lg mb-4"
//                   onPress={openLocationPicker}
//                 >
//                   <Text className="text-white text-center font-medium">Enter Location Manually</Text>
//                 </TouchableOpacity>

//                 <View className="h-48 rounded-lg overflow-hidden mb-4 border border-gray-300">
//                   <MapView
//                     className="w-full h-full"
//                     region={{
//                       latitude: farmLocation.latitude,
//                       longitude: farmLocation.longitude,
//                       latitudeDelta: 0.01,
//                       longitudeDelta: 0.01,
//                     }}
//                     scrollEnabled={false}
//                     zoomEnabled={false}
//                     pitchEnabled={false}
//                     rotateEnabled={false}
//                   >
//                     <Marker
//                       coordinate={{
//                         latitude: farmLocation.latitude,
//                         longitude: farmLocation.longitude,
//                       }}
//                       title="Farm Location"
//                     />
//                   </MapView>
//                 </View>

//                 <View className="mb-4">
//                   <Text className="text-gray-700 text-sm">
//                     Lat: {farmLocation.latitude.toFixed(6)}
//                   </Text>
//                   <Text className="text-gray-700 text-sm">
//                     Lon: {farmLocation.longitude.toFixed(6)}
//                   </Text>
//                 </View>

//                 <View className="mb-4">
//                   <Text className="text-base font-medium mb-2 text-gray-900">Delivery Date</Text>
//                   <TouchableOpacity 
//                     className="bg-white border border-gray-300 rounded-lg p-3 mb-3"
//                     onPress={() => setShowDatePicker(true)}
//                   >
//                     <Text className="text-gray-900 text-base">{formatDate(deliveryDate)}</Text>
//                   </TouchableOpacity>
//                   {showDatePicker && (
//                     <DateTimePicker 
//                       value={deliveryDate} 
//                       mode="date" 
//                       display="default" 
//                       onChange={onDateChange} 
//                       minimumDate={new Date()} 
//                     />
//                   )}
                  
//                   <Text className="text-base font-medium mb-2 text-gray-900">Delivery Time</Text>
//                   <TouchableOpacity 
//                     className="bg-white border border-gray-300 rounded-lg p-3"
//                     onPress={() => setShowTimePicker(true)}
//                   >
//                     <Text className="text-gray-900 text-base">{formatTime(deliveryTime)}</Text>
//                   </TouchableOpacity>
//                   {showTimePicker && (
//                     <DateTimePicker 
//                       value={deliveryTime} 
//                       mode="time" 
//                       display="default" 
//                       onChange={onTimeChange} 
//                     />
//                   )}
//                 </View>

//                 <View className="mb-4">
//                   <Text className="text-base font-medium mb-2 text-gray-900">Upload Crop Photos</Text>
//                   <Text className="text-sm text-gray-500 mb-3">Maximum 3 photos</Text>
                  
//                   {cropPhotos.length >= 3 ? (
//                     <TouchableOpacity
//                       className="bg-gray-400 py-3 rounded-lg"
//                       disabled={true}
//                     >
//                       <Text className="text-white text-center font-medium">Open Camera (Limit Reached)</Text>
//                     </TouchableOpacity>
//                   ) : (
//                     <TouchableOpacity
//                       className="bg-blue-500 py-3 rounded-lg"
//                       onPress={openCamera}
//                     >
//                       <Text className="text-white text-center font-medium">
//                         Open Camera ({cropPhotos.length}/3)
//                       </Text>
//                     </TouchableOpacity>
//                   )}

//                   {cropPhotos.length > 0 && (
//                     <View className="flex-row flex-wrap mt-3">
//                       {cropPhotos.map((photo, index) => (
//                         <View key={index} className="w-1/3 p-1">
//                           <View className="relative">
//                             <Image
//                               source={{ uri: photo.watermarkedUri || photo.uri }}
//                               className="w-full aspect-square rounded-lg"
//                             />
//                             <TouchableOpacity
//                               className="absolute top-1 right-1 bg-red-500 w-6 h-6 rounded-full items-center justify-center"
//                               onPress={() => removePhoto(index)}
//                             >
//                               <Text className="text-white font-medium">✕</Text>
//                             </TouchableOpacity>
//                           </View>
//                         </View>
//                       ))}
//                     </View>
//                   )}
//                 </View>

//                 <View>
//                   <Text className="text-base font-medium mb-2 text-gray-900">Nearest Market</Text>
                  
//                   <TextInput
//                     className="bg-white border border-gray-300 rounded-lg p-3 mb-3 text-base text-gray-900"
//                     placeholder="Search by market name, pincode..."
//                     value={marketSearch}
//                     onChangeText={handleMarketSearch}
//                   />
                  
//                   <View className="bg-white border border-gray-300 rounded-lg mb-3">
//                     <Picker
//                       selectedValue={nearestMarket}
//                       onValueChange={setNearestMarket}
//                       className="h-12 text-gray-900"
//                     >
//                       <Picker.Item label="Select Nearest Market" value="" />
//                       {filteredMarkets.map((market) => (
//                         <Picker.Item 
//                           key={market._id} 
//                           label={`${market.marketName} - ${market.exactAddress}`}
//                           value={market._id}
//                         />
//                       ))}
//                     </Picker>
//                   </View>
                  
//                   {filteredMarkets.length === 0 && marketSearch ? (
//                     <Text className="text-sm text-gray-500">
//                       No markets found matching your search
//                     </Text>
//                   ) : null}
                  
//                   {nearestMarket && !marketSearch ? (
//                     <View className="bg-green-50 p-3 rounded-lg mt-2">
//                       <Text className="text-green-600 text-sm font-medium">Market Selected</Text>
//                     </View>
//                   ) : null}
//                 </View>
//               </View>
//             </View>
//           )}
//         </View>
//       </ScrollView>

//       <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
//         <View className="flex-row gap-3">
//           {step > 1 ? (
//             <TouchableOpacity
//               className="flex-1 py-3 rounded-lg items-center bg-gray-500"
//               onPress={prevStep}
//             >
//               <Text className="text-white font-medium">Previous</Text>
//             </TouchableOpacity>
//           ) : null}
          
//           {step < 4 ? (
//             <TouchableOpacity
//               className={`py-3 rounded-lg items-center bg-green-600 ${step > 1 ? 'flex-1' : 'flex-1'}`}
//               onPress={nextStep}
//             >
//               <Text className="text-white font-medium">Next Step</Text>
//             </TouchableOpacity>
//           ) : (
//             <TouchableOpacity
//               className={`py-3 rounded-lg items-center bg-green-600 ${step > 1 ? 'flex-1' : 'flex-1'}`}
//               onPress={handleSubmit}
//             >
//               <Text className="text-white font-medium">Submit Post</Text>
//             </TouchableOpacity>
//           )}
//         </View>
//       </View>
//     </View>
//   );
// };

// export default SellProductForm;




// import DateTimePicker from "@react-native-community/datetimepicker";
// import { Picker } from "@react-native-picker/picker";
// import axios from "axios";
// import * as ImagePicker from "expo-image-picker";
// import * as Location from "expo-location";
// import { ChevronLeft } from "lucide-react-native";
// import React, { useEffect, useState } from "react";
// import MapView, { Marker } from "react-native-maps";
// import {
//   ActivityIndicator,
//   Alert,
//   Dimensions,
//   Image,
//   Modal,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";

// interface Category {
//   _id: string;
//   categoryId: string;
//   categoryName: string;
// }

// interface SubCategory {
//   _id: string;
//   subCategoryId: string;
//   subCategoryName: string;
//   categoryId: string;
// }

// interface GradePrice {
//   grade: string;
//   pricePerUnit: string;
//   totalQty: string;
//   photos: any[];
// }
// interface Packaging {
//   _id: string;
//   packageType: string;
//   measurements: string[];
// }

// interface Market {
//   _id: string;
//   marketId: string;
//   marketName: string;
//   pincode: string;
//   postOffice?: string;
//   district?: string;
//   state?: string;
//   exactAddress: string;
//   landmark?: string;
// }
// interface CapturedPhoto {
//   uri: string;
//   watermarkedUri?: string;
// }

// const { width, height } = Dimensions.get("window");
// import { useLocalSearchParams } from 'expo-router';
// const SellProductForm: React.FC = ({ route }: any) => {
//   const [step, setStep] = useState(1);

//   const params = useLocalSearchParams();
//   const categoryId = params.categoryId as string;
//   const subCategoryId = params.subCategoryId as string;

//   // Step 1: Category & Basic Info
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

//   const [cropBriefDetails, setCropBriefDetails] = useState("");


//   const [selectedCategory, setSelectedCategory] = useState(categoryId || "");
//   const [selectedSubCategory, setSelectedSubCategory] = useState(subCategoryId || "");
// console.log("selectedCategory",selectedCategory)
// console.log("selectedSubCategory",selectedSubCategory)
// const [globalQuantityType, setGlobalQuantityType] = useState("");
// const [globalPriceType, setGlobalPriceType] = useState("");
//   // Step 2: Farming & Packaging Details
//   const [farmingType, setFarmingType] = useState("");
//   const [typeOfSeeds, setTypeOfSeeds] = useState("");
//   const [packagingType, setPackagingType] = useState("");
//   const [packageMeasurement, setPackageMeasurement] = useState("");
//   const [unitMeasurement, setUnitMeasurement] = useState("");
// const [packagingOptions, setPackagingOptions] = useState<Packaging[]>([]);
// const [selectedPackaging, setSelectedPackaging] = useState<Packaging | null>(null);
// const [markets, setMarkets] = useState<Market[]>([]);
// const [filteredMarkets, setFilteredMarkets] = useState<Market[]>([]);
// const [marketSearch, setMarketSearch] = useState("");
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [showTimePicker, setShowTimePicker] = useState(false);
  
//   // Step 3: Grade & Pricing

//   const [gradePrices, setGradePrices] = useState<GradePrice[]>([
//     { grade: "A Grade", pricePerUnit: "", totalQty: "", photos: [] },
//     { grade: "B Grade", pricePerUnit: "", totalQty: "", photos: [] },
//     { grade: "All Mixed Grades", pricePerUnit: "", totalQty: "", photos: [] },
//   ]);
//   const [gradeCounter, setGradeCounter] = useState(2);
//   const [selectedGrades, setSelectedGrades] = useState<string[]>([]);


//   // Step 4: Final Details
//   const [deliveryDate, setDeliveryDate] = useState(new Date());
//   const [deliveryTime, setDeliveryTime] = useState(new Date());
//   const [nearestMarket, setNearestMarket] = useState("");
//   const [cropPhotos, setCropPhotos] = useState<CapturedPhoto[]>([]);
//   const [farmLocation, setFarmLocation] = useState({
//     latitude: 12.9716,
//     longitude: 77.5946,
//   });

//   // Camera States
//   const [showCamera, setShowCamera] = useState(false);
//   const [capturedImage, setCapturedImage] = useState<string | null>(null);
//   const [gpsText, setGpsText] = useState("");

//   // Map States
//   const [showLocationPicker, setShowLocationPicker] = useState(false);
//   const [isGettingLocation, setIsGettingLocation] = useState(false);

//   useEffect(() => {
//     fetchCategories();
//     requestLocationPermission();
//     fetchPackaging();     // ADD THIS
//   fetchMarkets(); 
//   }, []);
// // Add this after your existing useEffects
// useEffect(() => {
//   // Cleanup function to release memory when changing steps
//   return () => {
//     // Clear captured image when leaving step 4
//     if (step !== 4 && capturedImage) {
//       setCapturedImage(null);
//       setGpsText("");
//     }
//   };
// }, [step]);
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

//   const fetchCategories = async () => {
//     try {
//       const res = await axios.get("https://kisan.etpl.ai/category/all");
//       setCategories(res.data.data);
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//     }
//   };

//   const fetchSubCategories = async (categoryId: string) => {
//     try {
//       const res = await axios.get(
//         `https://kisan.etpl.ai/subcategory/category/${categoryId}`
//       );
//       setSubCategories(res.data.data);
//     } catch (error) {
//       console.error("Error fetching subcategories:", error);
//     }
//   };
//   const fetchPackaging = async () => {
//   try {
//     const res = await axios.get("https://kisan.etpl.ai/api/packaging/all");
//     setPackagingOptions(res.data);
//   } catch (error) {
//     console.error("Error fetching packaging:", error);
//   }
// };

// const fetchMarkets = async () => {
//   try {
//     const res = await axios.get("https://kisan.etpl.ai/api/market/all");
//     setMarkets(res.data.data || res.data);
//     setFilteredMarkets(res.data.data || res.data);
//   } catch (error) {
//     console.error("Error fetching markets:", error);
//   }
// };

// const handleMarketSearch = (searchValue: string) => {
//   setMarketSearch(searchValue);
  
//   if (!searchValue.trim()) {
//     setFilteredMarkets(markets);
//     return;
//   }
  
//   const filtered = markets.filter(market => 
//     market.marketName.toLowerCase().includes(searchValue.toLowerCase()) ||
//     market.pincode.includes(searchValue) ||
//     market.district?.toLowerCase().includes(searchValue.toLowerCase()) ||
//     market.exactAddress.toLowerCase().includes(searchValue.toLowerCase())
//   );
  
//   setFilteredMarkets(filtered);
// };
//   const onDateChange = (event: any, selectedDate?: Date) => {
//     setShowDatePicker(Platform.OS === "ios");
//     if (selectedDate) {
//       setDeliveryDate(selectedDate);
//     }
//   };

//   const onTimeChange = (event: any, selectedTime?: Date) => {
//     setShowTimePicker(Platform.OS === "ios");
//     if (selectedTime) {
//       setDeliveryTime(selectedTime);
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

//   const handleGradeToggle = (grade: string) => {
//     if (selectedGrades.includes(grade)) {
//       setSelectedGrades(selectedGrades.filter((g) => g !== grade));
//     } else {
//       setSelectedGrades([...selectedGrades, grade]);
//     }
//   };

//   const handleGradePriceChange = (index: number, field: string, value: string) => {
//     // Restrict negative values for number inputs
//     if ((field === "pricePerUnit" || field === "totalQty") && parseFloat(value) < 0) {
//       return;
//     }
//     const updated = [...gradePrices];
//     updated[index] = { ...updated[index], [field]: value };
//     setGradePrices(updated);
//   };

//   const handleAddGrade = () => {
//     const nextGrade = String.fromCharCode(65 + gradeCounter);
//     const newGrade: GradePrice = {
//       grade: `${nextGrade} Grade`,
//       pricePerUnit: "",
//       totalQty: "",
//       photos: [],
//     };
//     setGradePrices([...gradePrices.slice(0, -1), newGrade, gradePrices[gradePrices.length - 1]]);
//     setGradeCounter(gradeCounter + 1);
//   };

//   const handleRemoveGradePhoto = (gradeIndex: number, photoIndex: number) => {
//     const updated = [...gradePrices];
//     updated[gradeIndex].photos = updated[gradeIndex].photos.filter((_, idx) => idx !== photoIndex);
//     setGradePrices(updated);
//   };

//   // const handleGradePhotoUpload = async (index: number) => {
//   //   Alert.alert(
//   //     "Select Media",
//   //     "Choose photo or video",
//   //     [
//   //       {
//   //         text: "Camera",
//   //         onPress: async () => {
//   //           const result = await ImagePicker.launchCameraAsync({
//   //             mediaTypes: ImagePicker.MediaTypeOptions.All,
//   //             allowsEditing: true,
//   //             quality: 0.8,
//   //           });
//   //           if (!result.canceled && result.assets) {
//   //             const updated = [...gradePrices];
//   //             updated[index] = {
//   //               ...updated[index],
//   //               photos: [...updated[index].photos, ...result.assets],
//   //             };
//   //             setGradePrices(updated);
//   //           }
//   //         },
//   //       },
//   //       {
//   //         text: "Gallery",
//   //         onPress: async () => {
//   //           const result = await ImagePicker.launchImageLibraryAsync({
//   //             mediaTypes: ImagePicker.MediaTypeOptions.All,
//   //             allowsMultipleSelection: true,
//   //             quality: 0.8,
//   //           });
//   //           if (!result.canceled && result.assets) {
//   //             const updated = [...gradePrices];
//   //             updated[index] = {
//   //               ...updated[index],
//   //               photos: [...updated[index].photos, ...result.assets],
//   //             };
//   //             setGradePrices(updated);
//   //           }
//   //         },
//   //       },
//   //       { text: "Cancel", style: "cancel" },
//   //     ]
//   //   );
//   // };
// const handleGradePhotoUpload = async (index: number) => {
//   try {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsMultipleSelection: true,
//       quality: 0.5,
//       allowsEditing: false,
//     });

//     if (!result.canceled && result.assets) {
//       const updated = [...gradePrices];
//       const currentPhotos = updated[index].photos.length;
//       const remainingSlots = 5 - currentPhotos;
//       const newPhotos = result.assets.slice(0, remainingSlots);
      
//       updated[index] = {
//         ...updated[index],
//         photos: [...updated[index].photos, ...newPhotos],
//       };
//       setGradePrices(updated);

//       if (newPhotos.length < result.assets.length) {
//         Alert.alert("Info", `Only ${newPhotos.length} photo(s) added (5 photo limit)`);
//       }
//     }
//   } catch (error) {
//     console.error("Error uploading grade photos:", error);
//     Alert.alert("Error", "Failed to upload photos");
//   }
// };


//   // const handlePhotoUpload = async () => {
//   //   Alert.alert(
//   //     "Select Media",
//   //     "Choose photo or video",
//   //     [
//   //       {
//   //         text: "Camera",
//   //         onPress: async () => {
//   //           const result = await ImagePicker.launchCameraAsync({
//   //             mediaTypes: ImagePicker.MediaTypeOptions.All,
//   //             allowsEditing: true,
//   //             quality: 0.8,
//   //           });
//   //           if (!result.canceled && result.assets) {
//   //             setCropPhotos([...cropPhotos, ...result.assets]);
//   //           }
//   //         },
//   //       },
//   //       {
//   //         text: "Gallery",
//   //         onPress: async () => {
//   //           const result = await ImagePicker.launchImageLibraryAsync({
//   //             mediaTypes: ImagePicker.MediaTypeOptions.All,
//   //             allowsMultipleSelection: true,
//   //             quality: 0.8,
//   //           });
//   //           if (!result.canceled && result.assets) {
//   //             setCropPhotos([...cropPhotos, ...result.assets]);
//   //           }
//   //         },
//   //       },
//   //       { text: "Cancel", style: "cancel" },
//   //     ]
//   //   );
//   // };

//   // Camera Functions

// const handlePhotoUpload = async () => {
//   try {
//     if (cropPhotos.length >= 3) {
//       Alert.alert("Limit Reached", "Maximum 3 photos allowed");
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsMultipleSelection: true,
//       quality: 0.5, // Reduced quality
//       allowsEditing: false,
//     });

//     if (!result.canceled && result.assets) {
//       // Take only what's needed to reach max 3 photos
//       const remainingSlots = 3 - cropPhotos.length;
//       const newPhotos = result.assets.slice(0, remainingSlots);
      
//       setCropPhotos([...cropPhotos, ...newPhotos]);
      
//       if (newPhotos.length < result.assets.length) {
//         Alert.alert("Info", `Only ${newPhotos.length} photo(s) added (3 photo limit)`);
//       }
//     }
//   } catch (error) {
//     console.error("Error uploading photos:", error);
//     Alert.alert("Error", "Failed to upload photos");
//   }
// };


// //   const openCamera = async () => {
// //   try {
// //     if (cropPhotos.length >= 3) {
// //       Alert.alert("Limit Reached", "Maximum 3 photos allowed");
// //       return;
// //     }

// //     const { status } = await ImagePicker.requestCameraPermissionsAsync();
// //     if (status !== "granted") {
// //       Alert.alert("Permission Denied", "Camera permission is required");
// //       return;
// //     }

// //     const result = await ImagePicker.launchCameraAsync({
// //       mediaTypes: ImagePicker.MediaTypeOptions.Images,
// //       allowsEditing: false,
// //       quality: 0.3, // Low quality to reduce memory
// //       exif: false,
// //       base64: false,
// //     });

// //     if (result.canceled || !result.assets?.[0]) return;

// //     // Compress image immediately
// //     const compressedUri = await compressImage(result.assets[0].uri);

// //     const loc = await Location.getCurrentPositionAsync({
// //       accuracy: Location.Accuracy.Balanced,
// //     });
    
// //     const text = `Lat: ${loc.coords.latitude.toFixed(6)}\nLon: ${loc.coords.longitude.toFixed(6)}\n${new Date().toLocaleString()}`;
    
// //     setGpsText(text);
// //     setCapturedImage(compressedUri); // Use compressed image
// //   } catch (error) {
// //     console.error("Camera error:", error);
// //     Alert.alert("Error", "Failed to open camera");
// //   }
// // };

// //   const saveWithWatermark = async () => {
// //     try {
// //       console.log("Saving photo...");
      
// //       if (!capturedImage) {
// //         Alert.alert("Error", "No image to save");
// //         return;
// //       }

// //       if (cropPhotos.length >= 3) {
// //         Alert.alert("Limit Reached", "Maximum 3 photos allowed");
// //         setCapturedImage(null);
// //         setGpsText("");
// //         return;
// //       }

// //       const newPhoto = { 
// //         uri: capturedImage, 
// //         watermarkedUri: capturedImage,
// //         timestamp: new Date().toISOString()
// //       };

// //       console.log("Adding photo:", newPhoto);
      
// //       setCropPhotos([...cropPhotos, newPhoto]);
// //       setCapturedImage(null);
// //       setGpsText("");
      
// //       Alert.alert("Success", "Photo saved!");
// //     } catch (error) {
// //       console.error("Error saving photo:", error);
// //       Alert.alert("Error", "Failed to save photo");
// //     }
// //   };

//   const removePhoto = (index: number) => {
//     const updated = cropPhotos.filter((_, i) => i !== index);
//     setCropPhotos(updated);
//   };

//   // Location Functions
//   const getCurrentLocation = async () => {
//     setIsGettingLocation(true);
//     try {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         Alert.alert("Permission Denied", "Location permission is required");
//         setIsGettingLocation(false);
//         return;
//       }

//       const location = await Location.getCurrentPositionAsync({
//         accuracy: Location.Accuracy.High,
//       });

//       setFarmLocation({
//         latitude: location.coords.latitude,
//         longitude: location.coords.longitude,
//       });

//       Alert.alert("Success", "Current location captured!");
//     } catch (error) {
//       console.error("Error getting location:", error);
//       Alert.alert("Error", "Failed to get current location");
//     } finally {
//       setIsGettingLocation(false);
//     }
//   };

//   const openLocationPicker = () => {
//     setShowLocationPicker(true);
//   };

//   const saveManualLocation = () => {
//     if (farmLocation.latitude && farmLocation.longitude) {
//       setShowLocationPicker(false);
//       Alert.alert("Success", "Location saved!");
//     } else {
//       Alert.alert("Error", "Please enter valid coordinates");
//     }
//   };

  
// {/* Map Picker Modal */}
// <Modal visible={showLocationPicker} animationType="slide" transparent={true}>
//   <View style={styles.modalOverlay}>
//     <View style={styles.locationModal}>
//       <Text style={styles.modalTitle}>Select Farm Location</Text>
//       <Text style={styles.modalSubtitle}>
//         Tap on the map or drag the marker to select your farm location
//       </Text>

//       {/* INTERACTIVE MAP VIEW */}
//       <View style={styles.mapContainer}>
//         <MapView
//           style={styles.map}
//           region={{
//             latitude: farmLocation.latitude,
//             longitude: farmLocation.longitude,
//             latitudeDelta: 0.05,
//             longitudeDelta: 0.05,
//           }}
//           onPress={(e) => {
//             // User taps anywhere on map to set location
//             setFarmLocation({
//               latitude: e.nativeEvent.coordinate.latitude,
//               longitude: e.nativeEvent.coordinate.longitude,
//             });
//           }}
//         >
//           <Marker
//             coordinate={{
//               latitude: farmLocation.latitude,
//               longitude: farmLocation.longitude,
//             }}
//             draggable
//             onDragEnd={(e) => {
//               // User drags the marker to set location
//               setFarmLocation({
//                 latitude: e.nativeEvent.coordinate.latitude,
//                 longitude: e.nativeEvent.coordinate.longitude,
//               });
//             }}
//             title="Farm Location"
//             description="Drag me to adjust position"
//           />
//         </MapView>
//       </View>

//       {/* COORDINATES DISPLAY - Optional, can be hidden */}
//       <View style={styles.coordinatesDisplay}>
//         <Text style={styles.coordinateText}>
//           📍 Selected Location:
//         </Text>
//         <Text style={styles.coordinateText}>
//           Lat: {farmLocation.latitude.toFixed(6)}, Lon: {farmLocation.longitude.toFixed(6)}
//         </Text>
//       </View>

//       {/* USE CURRENT LOCATION BUTTON */}
//       <TouchableOpacity
//         style={styles.currentLocationButton}
//         onPress={getCurrentLocation}
//         disabled={isGettingLocation}
//       >
//         {isGettingLocation ? (
//           <ActivityIndicator color="#fff" />
//         ) : (
//           <Text style={styles.buttonText}>📍 Use My Current Location</Text>
//         )}
//       </TouchableOpacity>

//       {/* ACTION BUTTONS */}
//       <View style={styles.modalButtonsContainer}>
//         <TouchableOpacity
//           style={[styles.modalButton, styles.cancelButton]}
//           onPress={() => setShowLocationPicker(false)}
//         >
//           <Text style={styles.buttonText}>Cancel</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.modalButton, styles.confirmButton]}
//           onPress={saveManualLocation}
//         >
//           <Text style={styles.buttonText}>✓ Confirm Location</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   </View>
// </Modal>

// const handleSubmit = async () => {
//   if (cropPhotos.length > 3) {
//     Alert.alert("Too Many Photos", "Please limit to 3 photos maximum.");
//     return;
//   }

//   if (!selectedCategory || !selectedSubCategory) {
//     Alert.alert("Missing Information", "Please fill in all required fields");
//     return;
//   }

//   // if (!cropBriefDetails || !farmingType || !typeOfSeeds) {
//   //   Alert.alert("Missing Information", "Please fill in all farming details");
//   //   return;
//   // }

  

//   // if (selectedGrades.length === 0) {
//   //   Alert.alert("Missing Information", "Please select at least one grade");
//   //   return;
//   // }

//   // ✅ ADD VALIDATION FOR GRADE PRICES
//   // VALIDATION
// // if (selectedGrades.length === 0) {
// //   Alert.alert("Missing Information", "Please select at least one grade");
// //   return;
// // }

// // if (!globalQuantityType || !globalPriceType) {
// //   Alert.alert("Missing Information", "Please select Quantity Type and Price Type");
// //   return;
// // }

// const selectedGradeObjects = gradePrices.filter((gp) => 
//   selectedGrades.includes(gp.grade)
// );

// for (const gp of selectedGradeObjects) {
//   if (!gp.pricePerUnit || !gp.totalQty) {
//     Alert.alert(
//       "Incomplete Grade Information", 
//       `Please fill Price and Quantity for ${gp.grade}`
//     );
//     return;
//   }
// }

//   // if (!nearestMarket) {
//   //   Alert.alert("Missing Information", "Please enter nearest market");
//   //   return;
//   // }

//   const formData = new FormData();
  
//   formData.append("categoryId", selectedCategory);
//   formData.append("subCategoryId", selectedSubCategory);
//   formData.append("cropBriefDetails", cropBriefDetails);
//   formData.append("farmingType", farmingType);
//   formData.append("typeOfSeeds", typeOfSeeds);
//   formData.append("packagingType", packagingType);
//   formData.append("packageMeasurement", packageMeasurement);
//   formData.append("unitMeasurement", unitMeasurement);
//   formData.append("deliveryDate", formatDate(deliveryDate));
//   formData.append("deliveryTime", formatTime(deliveryTime));
//   formData.append("nearestMarket", nearestMarket);
  
//   formData.append("farmLocation", JSON.stringify({
//     lat: farmLocation.latitude.toString(),
//     lng: farmLocation.longitude.toString()
//   }));

//   // ✅ FIXED: Include quantityType and priceType

//     const selectedGradeData = gradePrices
//       .filter((gp) => selectedGrades.includes(gp.grade))
//       .map((gp) => ({
//         grade: gp.grade,
//         pricePerUnit: gp.pricePerUnit,
//         totalQty: gp.totalQty,
//         quantityType: globalQuantityType,
//         priceType: globalPriceType,
//       }));

//     formData.append("gradePrices", JSON.stringify(selectedGradeData));

//     // Append grade-specific photos
//     gradePrices.forEach((gp) => {
//       if (selectedGrades.includes(gp.grade)) {
//         gp.photos.forEach((photo) => {
//           formData.append(`gradePhotos_${gp.grade}`, {
//             uri: photo.uri,
//             type: photo.type || "image/jpeg",
//             name: photo.fileName || `grade_${gp.grade}_${Date.now()}.jpg`,
//           } as any);
//         });
//       }
//     });

//     // Add crop photos
//     cropPhotos.forEach((photo) => {
//       formData.append(`photos`, {
//         uri: photo.uri,
//         type: photo.type || "image/jpeg",
//         name: photo.fileName || `photo_${Date.now()}.jpg`,
//       } as any);
//     });

//   try {
//     console.log("Submitting product...");
//     console.log("Grade data being sent:", selectedGradeData); // ✅ Debug log
// console.log("formdata",formData)
//     const response = await axios.post(
//       "https://kisan.etpl.ai/product/add",
//       formData,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//         timeout: 30000,
//         maxContentLength: Infinity,
//         maxBodyLength: Infinity,
//       }
//     );

//     console.log("Response:", response.data);
//     Alert.alert("Success", "Product added successfully!");
//     setStep(1);
//     resetForm();
//   } catch (error: any) {
//     console.error("Error submitting product:", error);
//     console.error("Error response:", error.response?.data);

//     if (error.response?.status === 413) {
//       Alert.alert(
//         "Upload Too Large",
//         "The images are too large. Please use fewer photos or lower quality."
//       );
//     } else if (error.response?.status === 500) {
//       Alert.alert(
//         "Server Error",
//         "Server error: " + (error.response?.data?.message || "Please try again")
//       );
//     } else if (error.response?.status === 400) {
//       Alert.alert(
//         "Validation Error",
//         "Invalid data: " + (error.response?.data?.message || "Please check all fields")
//       );
//     } else if (error.code === 'ECONNABORTED') {
//       Alert.alert(
//         "Timeout",
//         "Upload timed out. Please try again with fewer/smaller photos."
//       );
//     } else if (error.code === 'ECONNREFUSED') {
//       Alert.alert(
//         "Connection Error",
//         "Cannot connect to server. Please check your internet connection."
//       );
//     } else {
//       Alert.alert(
//         "Error",
//         "Failed to submit: " + (error.message || "Unknown error")
//       );
//     }
//   }
// };
//   const resetForm = () => {
//     setSelectedCategory("");
//     setSelectedSubCategory("");
//     setCropBriefDetails("");
//     setFarmingType("");
//     setTypeOfSeeds("");
//     setPackagingType("");
//     setPackageMeasurement("");
//     setUnitMeasurement("");
//     setSelectedGrades([]);
//     setDeliveryDate(new Date());
//     setDeliveryTime(new Date());
//     setNearestMarket("");
//     setCropPhotos([]);
//     // setGradePrices([
//     //   { grade: "A Grade", pricePerUnit: "", totalQty: "",  priceType: "" },
//     //   { grade: "B Grade", pricePerUnit: "", totalQty: "", priceType: "" },
//     //   { grade: "All Mixed Grades", pricePerUnit: "", totalQty: "", quantityType: "", priceType: "" },
//     // ]);
//     setGradeCounter(2);
//   };

//   const nextStep = () => {
//     if (step < 4) setStep(step + 1);
//   };

//   const prevStep = () => {
//     if (step > 1) setStep(step - 1);
//   };

//   const getStepTitle = () => {
//     switch(step) {
//       case 1: return "Category & Product";
//       case 2: return "Farming & Packaging";
//       case 3: return "Pricing & Details";
//       case 4: return "Final Details";
//       default: return "Sell Your Produce";
//     }
//   };

//   const renderProgressBar = () => {
//     const totalSteps = 4;
//     const progress = (step - 1) / (totalSteps - 1);
    
//     return (
//       <View style={styles.progressContainer}>
//         <View style={styles.progressLineContainer}>
//           <View style={styles.progressLineBackground} />
//           <View style={[styles.progressLineCompleted, { width: `${progress * 100}%` }]} />
//         </View>
        
//         <View style={styles.stepsContainer}>
//           {[1, 2, 3, 4].map((stepNum) => (
//             <View key={stepNum} style={styles.stepIndicator}>
//               <View
//                 style={[
//                   styles.stepCircle,
//                   step >= stepNum ? styles.stepCircleActive : styles.stepCircleInactive
//                 ]}
//               >
//                 <Text
//                   style={[
//                     styles.stepNumber,
//                     step >= stepNum ? styles.stepNumberActive : styles.stepNumberInactive
//                   ]}
//                 >
//                   {stepNum}
//                 </Text>
//               </View>
//               <Text
//                 style={[
//                   styles.stepLabel,
//                   step >= stepNum ? styles.stepLabelActive : styles.stepLabelInactive
//                 ]}
//               >
//                 {stepNum === 1 && "Category"}
//                 {stepNum === 2 && "Farming"}
//                 {stepNum === 3 && "Pricing"}
//                 {stepNum === 4 && "Details"}
//               </Text>
//             </View>
//           ))}
//         </View>
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       {/* Header with back button */}
//       <View style={styles.header}>
//         <TouchableOpacity
//           onPress={prevStep}
//           activeOpacity={0.7}
//           style={styles.backButton}
//         >
//           <ChevronLeft size={20} color="#064E3B" />
//         </TouchableOpacity>

//         <Text style={styles.headerTitle}>
//           {getStepTitle()}
//         </Text>
//       </View>

//       {/* Image Preview with GPS Info Modal */}
//       {/* <Modal visible={!!capturedImage} animationType="slide" transparent={false}>
//         <View style={styles.modalContainer}>
//           <View style={styles.imageContainer}>
//             {capturedImage ? (
//               <Image
//                 source={{ uri: capturedImage }}
//                 style={styles.previewImage}
//                 resizeMode="contain"
//                 onError={(error) => {
//                   console.error("Image load error:", error.nativeEvent);
//                   Alert.alert("Error", "Failed to load image");
//                   setCapturedImage(null);
//                   setGpsText("");
//                 }}
//                 onLoad={() => console.log("Image loaded successfully")}
//               />
//             ) : null}
//             {gpsText ? (
//               <View style={styles.gpsOverlay}>
//                 <Text style={styles.gpsText}>
//                   {gpsText}
//                 </Text>
//               </View>
//             ) : null}
//           </View>
//           <View style={styles.imageButtonsContainer}>
//             <TouchableOpacity
//               style={[styles.imageButton, styles.retakeButton]}
//               onPress={() => {
//                 setCapturedImage(null);
//                 setGpsText("");
//               }}
//             >
//               <Text style={styles.imageButtonText}>Retake</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={[styles.imageButton, styles.saveButton]}
//               onPress={saveWithWatermark}
//             >
//               <Text style={styles.imageButtonText}>Save Photo</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal> */}

//       {/* Map Picker Modal */}
//       <Modal visible={showLocationPicker} animationType="slide" transparent={true}>
//         <View style={styles.modalOverlay}>
//           <View style={styles.locationModal}>
//             <Text style={styles.modalTitle}>Enter Farm Location</Text>

//             <Text style={styles.inputLabel}>Latitude</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="e.g., 12.9716"
//               value={farmLocation.latitude.toString()}
//               onChangeText={(text) =>
//                 setFarmLocation({
//                   ...farmLocation,
//                   latitude: parseFloat(text) || 0,
//                 })
//               }
//               keyboardType="numeric"
//             />

//             <Text style={styles.inputLabel}>Longitude</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="e.g., 77.5946"
//               value={farmLocation.longitude.toString()}
//               onChangeText={(text) =>
//                 setFarmLocation({
//                   ...farmLocation,
//                   longitude: parseFloat(text) || 0,
//                 })
//               }
//               keyboardType="numeric"
//             />

//             <TouchableOpacity
//               style={styles.currentLocationButton}
//               onPress={getCurrentLocation}
//               disabled={isGettingLocation}
//             >
//               {isGettingLocation ? (
//                 <ActivityIndicator color="#fff" />
//               ) : (
//                 <Text style={styles.buttonText}>📍 Use Current Location</Text>
//               )}
//             </TouchableOpacity>

//             <View style={styles.modalButtonsContainer}>
//               <TouchableOpacity
//                 style={[styles.modalButton, styles.cancelButton]}
//                 onPress={() => setShowLocationPicker(false)}
//               >
//                 <Text style={styles.buttonText}>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[styles.modalButton, styles.confirmButton]}
//                 onPress={saveManualLocation}
//               >
//                 <Text style={styles.buttonText}>Save Location</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
//         {renderProgressBar()}
        
//         <View style={styles.content}>
//           {/* Step 1: Category Selection */}
//           {step === 1 && (
//             <View>
//               <Text style={styles.label}>Select Category</Text>
//               {/* <View style={styles.pickerContainer}>
//                 <Picker
//                   selectedValue={selectedCategory}
//                   onValueChange={handleCategoryChange}
//                   style={styles.picker}
//                 >
//                   <Picker.Item label="Select Category" value="" />
//                   {categories.map((c) => (
//                     <Picker.Item key={c._id} label={c.categoryName} value={c._id} />
//                   ))}
//                 </Picker>
//               </View>

//               <Text style={styles.label}>Select Sub Category</Text>
//               <View style={styles.pickerContainer}>
//                 <Picker
//                   selectedValue={selectedSubCategory}
//                   onValueChange={setSelectedSubCategory}
//                   enabled={!!selectedCategory}
//                   style={styles.picker}
//                 >
//                   <Picker.Item label="Select Sub Category" value="" />
//                   {subCategories.map((s) => (
//                     <Picker.Item
//                       key={s._id}
//                       label={s.subCategoryName}
//                       value={s._id}
//                     />
//                   ))}
//                 </Picker>
//               </View> */}

//               <View style={styles.section}>
//                 <Text style={styles.label}>Crop Brief Details</Text>
//                 <TextInput
//                   style={[styles.input, styles.textArea]}
//                   placeholder="Enter brief description (farming type, seeds type, organic/regular)"
//                   value={cropBriefDetails}
//                   onChangeText={setCropBriefDetails}
//                   multiline
//                   numberOfLines={4}
//                   textAlignVertical="top"
//                 />
//               </View>

//               <TouchableOpacity style={styles.primaryButton} onPress={nextStep}>
//                 <Text style={styles.buttonText}>Next Step →</Text>
//               </TouchableOpacity>
//             </View>
//           )}

//           {/* Step 2: Farming & Packaging Details */}
//           {step === 2 && (
//             <View>
//               <Text style={styles.sectionTitle}>Farming & Packaging Details</Text>

//               <View style={styles.formSection}>
//                 <Text style={styles.label}>Farming Type</Text>
//                 {/* <View style={styles.pickerContainer}>
//                   <Picker
//                     selectedValue={farmingType}
//                     onValueChange={setFarmingType}
//                     style={styles.picker}
//                   >
//                     <Picker.Item label="Select Farming Type" value="" />
//                     <Picker.Item label="Drop Down 1" value="drop down 1" />
//                     <Picker.Item label="Regular" value="regular" />
//                     <Picker.Item label="Organic" value="organic" />
//                   </Picker>
//                 </View> */}
//                 <TouchableOpacity 
//   className="bg-white border border-gray-300 rounded-lg p-3 mb-4"
//   onPress={() => {
//     Alert.alert(
//       "Select Farming Type",
//       "",
//       [
//         { text: "Drop Down 1", onPress: () => setFarmingType("drop down 1") },
//         { text: "Regular", onPress: () => setFarmingType("regular") },
//         { text: "Organic", onPress: () => setFarmingType("organic") },
//         { text: "Cancel", style: "cancel" }
//       ]
//     );
//   }}
// >
//   <Text className="text-gray-900 text-base">
//     {farmingType || "Select Farming Type"}
//   </Text>
// </TouchableOpacity>

//                 <Text style={styles.label}>Type of Seeds</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="e.g., Naati, Hybrid"
//                   value={typeOfSeeds}
//                   onChangeText={setTypeOfSeeds}
//                 />

//                 <Text style={styles.label}>Packaging Type</Text>
// <Text style={styles.label}>Packaging Type</Text>
// <View style={styles.pickerContainer}>
//   <Picker
//     selectedValue={packagingType}
//     onValueChange={(value) => {
//       setPackagingType(value);
//       const selected = packagingOptions.find(p => p.packageType === value);
//       setSelectedPackaging(selected || null);
//       setPackageMeasurement(""); // Reset measurement
//     }}
//     style={styles.picker}
//   >
//     <Picker.Item label="Select Package Type" value="" />
//     {packagingOptions.map((pkg) => (
//       <Picker.Item key={pkg._id} label={pkg.packageType} value={pkg.packageType} />
//     ))}
//   </Picker>
// </View>

// {selectedPackaging && selectedPackaging.measurements.length > 0 && (
//   <>
//     <Text style={styles.label}>Measurement</Text>
//     <View style={styles.pickerContainer}>
//       <Picker
//         selectedValue={packageMeasurement}
//         onValueChange={setPackageMeasurement}
//         style={styles.picker}
//       >
//         <Picker.Item label="Select Measurement" value="" />
//         {selectedPackaging.measurements.map((measurement, idx) => (
//           <Picker.Item key={idx} label={measurement} value={measurement} />
//         ))}
//       </Picker>
//     </View>
//   </>
// )}


//                 <Text style={styles.label}>Unit Measurement (as per package type)</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="e.g., kg per box, bag, etc."
//                   value={unitMeasurement}
//                   onChangeText={setUnitMeasurement}
//                 />
//               </View>

//               <View style={styles.navigationButtons}>
//                 <TouchableOpacity
//                   style={[styles.button, styles.secondaryButton]}
//                   onPress={prevStep}
//                 >
//                   <Text style={styles.buttonText}>← Previous</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={[styles.button, styles.primaryButton]}
//                   onPress={nextStep}
//                 >
//                   <Text style={styles.buttonText}>Next Step →</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           )}

//           {/* Step 3: Pricing & Details */}
//        {/* {step === 3 && (
//   <View>
//     <Text style={styles.sectionTitle}>Add Pricing & Details</Text>


//     <View style={styles.globalSettingsCard}>
//       <Text style={styles.globalSettingsTitle}>Global Settings (applies to all grades)</Text>
      
//       <Text style={styles.label}>Quantity Type</Text>
//       <View style={styles.pickerContainer}>
//         <Picker
//           selectedValue={globalQuantityType}
//           onValueChange={setGlobalQuantityType}
//           style={styles.picker}
//         >
//           <Picker.Item label="Select Type" value="" />
//           <Picker.Item label="Bulk" value="bulk" />
//           <Picker.Item label="Split" value="split" />
//         </Picker>
//       </View>

//       <Text style={styles.label}>Price Type</Text>
//       <View style={styles.pickerContainer}>
//         <Picker
//           selectedValue={globalPriceType}
//           onValueChange={setGlobalPriceType}
//           style={styles.picker}
//         >
//           <Picker.Item label="Select Type" value="" />
//           <Picker.Item label="Fixed" value="fixed" />
//           <Picker.Item label="Negotiable" value="negotiable" />
//         </Picker>
//       </View>
//     </View>

//     <View style={styles.addGradeHeader}>
//       <Text style={styles.sectionTitle}>Select Grades & Add Pricing</Text>
//       <TouchableOpacity
//         onPress={handleAddGrade}
//         style={styles.addGradeButton}
//       >
//         <Text style={styles.addGradeButtonText}>+ Add Grade</Text>
//       </TouchableOpacity>
//     </View>

//     <View style={styles.formSection}>
//       {gradePrices.map((gp, index) => (
//         <View
//           key={index}
//           style={[
//             styles.gradeCard,
//             selectedGrades.includes(gp.grade) && styles.gradeCardActive
//           ]}
//         >
//           <TouchableOpacity
//             style={styles.gradeCheckbox}
//             onPress={() => handleGradeToggle(gp.grade)}
//           >
//             <View
//               style={[
//                 styles.checkbox,
//                 selectedGrades.includes(gp.grade) && styles.checkboxActive
//               ]}
//             >
//               {selectedGrades.includes(gp.grade) && (
//                 <Text style={styles.checkmark}>✓</Text>
//               )}
//             </View>
//             <Text style={styles.gradeLabel}>{gp.grade}</Text>
//           </TouchableOpacity>

//           {selectedGrades.includes(gp.grade) && (
//             <View style={styles.rowInputs}>
//               <View style={styles.halfInput}>
//                 <Text style={styles.subLabel}>Price / unit (₹)</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="₹"
//                   value={gp.pricePerUnit}
//                   onChangeText={(value) =>
//                     handleGradePriceChange(index, "pricePerUnit", value)
//                   }
//                   keyboardType="numeric"
//                 />
//               </View>
//               <View style={styles.halfInput}>
//                 <Text style={styles.subLabel}>Total Qty</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Qty"
//                   value={gp.totalQty}
//                   onChangeText={(value) =>
//                     handleGradePriceChange(index, "totalQty", value)
//                   }
//                   keyboardType="numeric"
//                 />
//               </View>
//             </View>
//           )}
//         </View>
//       ))}
//     </View>

//     <View style={styles.navigationButtons}>
//       <TouchableOpacity
//         style={[styles.button, styles.secondaryButton]}
//         onPress={prevStep}
//       >
//         <Text style={styles.buttonText}>← Previous</Text>
//       </TouchableOpacity>
//       <TouchableOpacity
//         style={[styles.button, styles.primaryButton]}
//         onPress={nextStep}
//       >
//         <Text style={styles.buttonText}>Next Step →</Text>
//       </TouchableOpacity>
//     </View>
//   </View>
// )} */}

//    {step === 3 && (
//         <View style={styles.stepContainer}>
//           <Text style={styles.stepTitle}>Step 3: Add Pricing & Details</Text>

//           <View style={styles.globalSettings}>
//             <Text style={styles.globalSettingsTitle}>Global Settings (applies to all grades)</Text>

//             <Text style={styles.label}>Quantity Type</Text>
//             <View style={styles.pickerContainer}>
//               <Picker
//                 selectedValue={globalQuantityType}
//                 onValueChange={(value) => setGlobalQuantityType(value)}
//                 style={styles.picker}
//               >
//                 <Picker.Item label="Select Type" value="" />
//                 <Picker.Item label="Bulk" value="bulk" />
//                 <Picker.Item label="Split" value="split" />
//               </Picker>
//             </View>

//             <Text style={styles.label}>Price Type</Text>
//             {/* <View style={styles.pickerContainer}>
//               <Picker
//                 selectedValue={globalPriceType}
//                 onValueChange={(value) => setGlobalPriceType(value)}
//                 style={styles.picker}
//               >
//                 <Picker.Item label="Select Type" value="" />
//                 <Picker.Item label="Fixed" value="fixed" />
//                 <Picker.Item label="Negotiable" value="negotiable" />
//               </Picker>
//             </View> */}
//             <TouchableOpacity 
//   className="bg-white border border-gray-300 rounded-lg p-3 mb-4"
//   onPress={() => {
//     Alert.alert(
//       "Select Price Type",
//       "",
//       [
//         { text: "Fixed", onPress: () => setGlobalPriceType("fixed") },
//         { text: "Negotiable", onPress: () => setGlobalPriceType("negotiable") },
//         { text: "Cancel", style: "cancel" }
//       ]
//     );
//   }}
// >
//   <Text className="text-gray-900 text-base">
//     {globalPriceType || "Select Type"}
//   </Text>
// </TouchableOpacity>
//           </View>

//           <View style={styles.gradeHeader}>
//             <Text style={styles.label}>Select Grades & Add Pricing</Text>
//             <TouchableOpacity style={styles.addGradeButton} onPress={handleAddGrade}>
//               <Text style={styles.addGradeButtonText}>+ Add Grade</Text>
//             </TouchableOpacity>
//           </View>

//           {gradePrices.map((gp, index) => (
//             <View
//               key={index}
//               style={[
//                 styles.gradeCard,
//                 selectedGrades.includes(gp.grade) && styles.gradeCardSelected,
//               ]}
//             >
//               <TouchableOpacity
//                 style={styles.checkboxContainer}
//                 onPress={() => handleGradeToggle(gp.grade)}
//               >
//                 <View
//                   style={[
//                     styles.checkbox,
//                     selectedGrades.includes(gp.grade) && styles.checkboxChecked,
//                   ]}
//                 >
//                   {selectedGrades.includes(gp.grade) && <Text style={styles.checkmark}>✓</Text>}
//                 </View>
//                 <Text style={styles.gradeTitle}>{gp.grade}</Text>
//               </TouchableOpacity>

//               {selectedGrades.includes(gp.grade) && (
//                 <>
//                   <View style={styles.inputRow}>
//                     <View style={styles.inputHalf}>
//                       <Text style={styles.label}>Price / unit (₹)</Text>
//                       <TextInput
//                         style={styles.input}
//                         placeholder="Price / unit (₹)"
//                         value={gp.pricePerUnit}
//                         onChangeText={(value) => {
//                           // Restrict negative values
//                           if (value === "" || parseFloat(value) >= 0) {
//                             handleGradePriceChange(index, "pricePerUnit", value);
//                           }
//                         }}
//                         keyboardType="numeric"
//                       />
//                     </View>
//                     <View style={styles.inputHalf}>
//                       <Text style={styles.label}>Total Qty</Text>
//                       <TextInput
//                         style={styles.input}
//                         placeholder="Total Qty"
//                         value={gp.totalQty}
//                         onChangeText={(value) => {
//                           // Restrict negative values
//                           if (value === "" || parseFloat(value) >= 0) {
//                             handleGradePriceChange(index, "totalQty", value);
//                           }
//                         }}
//                         keyboardType="numeric"
//                       />
//                     </View>
//                   </View>

//                   <View style={styles.photoUploadSection}>
//                     <Text style={styles.label}>Upload Photos/Videos for {gp.grade}</Text>
//                     <TouchableOpacity
//                       style={styles.uploadButton}
//                       onPress={() => handleGradePhotoUpload(index)}
//                     >
//                       <Text style={styles.uploadButtonText}>📷 Select Media</Text>
//                     </TouchableOpacity>

//                     {gp.photos.length > 0 && (
//                       <View style={styles.photoGrid}>
//                         {gp.photos.map((photo, photoIdx) => (
//                           <View key={photoIdx} style={styles.photoPreview}>
//                             <Image source={{ uri: photo.uri }} style={styles.photoImage} />
//                             <TouchableOpacity
//                               style={styles.removePhotoButton}
//                               onPress={() => handleRemoveGradePhoto(index, photoIdx)}
//                             >
//                               <Text style={styles.removePhotoText}>×</Text>
//                             </TouchableOpacity>
//                           </View>
//                         ))}
//                       </View>
//                     )}

//                     {gp.photos.length > 0 && (
//                       <Text style={styles.photoCount}>✓ {gp.photos.length} file(s) selected</Text>
//                     )}
//                   </View>
//                 </>
//               )}
//             </View>
//           ))}

//           <View style={styles.buttonRow}>
//             <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={prevStep}>
//               <Text style={styles.buttonText}>Previous</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.button} onPress={nextStep}>
//               <Text style={styles.buttonText}>Next Step</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       )}
       
// {/* Step 4: Final Details */}
// {step === 4 && (
//   <View>
//     <Text style={styles.sectionTitle}>Final Details</Text>

//     <View style={styles.formSection}>
//       <Text style={styles.label}>Farm Location</Text>
      
//       <TouchableOpacity 
//         style={styles.locationButton} 
//         onPress={getCurrentLocation} 
//         disabled={isGettingLocation}
//       >
//         {isGettingLocation ? (
//           <ActivityIndicator color="#fff" />
//         ) : (
//           <Text style={styles.buttonText}>📍 Get Current Location</Text>
//         )}
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={styles.manualLocationButton}
//         onPress={openLocationPicker}
//       >
//         <Text style={styles.buttonText}>✏️ Enter Location Manually</Text>
//       </TouchableOpacity>

//     {/* MAP PREVIEW */}
// <View style={styles.mapPreviewContainer}>
//   <MapView
//     style={styles.mapPreview}
//     region={{
//       latitude: farmLocation.latitude,
//       longitude: farmLocation.longitude,
//       latitudeDelta: 0.01,
//       longitudeDelta: 0.01,
//     }}
//     scrollEnabled={false}
//     zoomEnabled={false}
//     pitchEnabled={false}
//     rotateEnabled={false}
//   >
//     <Marker
//       coordinate={{
//         latitude: farmLocation.latitude,
//         longitude: farmLocation.longitude,
//       }}
//       title="Farm Location"
//     />
//   </MapView>
// </View>

// <View style={styles.locationDisplay}>
//   <Text style={styles.locationText}>
//     📍 Lat: {farmLocation.latitude.toFixed(6)}
//   </Text>
//   <Text style={styles.locationText}>
//     📍 Lon: {farmLocation.longitude.toFixed(6)}
//   </Text>
// </View>
//       <View style={styles.dateTimeSection}>
//         <Text style={styles.label}>Delivery Date</Text>
//         <TouchableOpacity 
//           style={styles.dateTimeButton} 
//           onPress={() => setShowDatePicker(true)}
//         >
//           <Text style={styles.dateTimeText}>📅 {formatDate(deliveryDate)}</Text>
//         </TouchableOpacity>
//         {showDatePicker && (
//           <DateTimePicker 
//             value={deliveryDate} 
//             mode="date" 
//             display="default" 
//             onChange={onDateChange} 
//             minimumDate={new Date()} 
//           />
//         )}
        
//         <Text style={styles.label}>Delivery Time</Text>
//         <TouchableOpacity 
//           style={styles.dateTimeButton} 
//           onPress={() => setShowTimePicker(true)}
//         >
//           <Text style={styles.dateTimeText}>🕐 {formatTime(deliveryTime)}</Text>
//         </TouchableOpacity>
//         {showTimePicker && (
//           <DateTimePicker 
//             value={deliveryTime} 
//             mode="time" 
//             display="default" 
//             onChange={onTimeChange} 
//           />
//         )}
//       </View>

//     <View style={styles.photoSection}>
//   <Text style={styles.label}>Upload Crop Photos</Text>
//   <Text style={styles.helperText}>Maximum 3 photos. Select from gallery.</Text>
  
//   <TouchableOpacity
//     style={styles.uploadButton}
//     onPress={handlePhotoUpload}
//     disabled={cropPhotos.length >= 3}
//   >
//     <Text style={styles.uploadButtonText}>
//       📸 Select Photos {cropPhotos.length >= 3 ? "(Limit Reached)" : `(${cropPhotos.length}/3)`}
//     </Text>
//   </TouchableOpacity>

//   {cropPhotos.length > 0 && (
//     <View style={styles.photoGrid}>
//       {cropPhotos.map((photo, index) => (
//         <View key={index} style={styles.photoItem}>
//           <Image
//             source={{ uri: photo.uri }}
//             style={styles.thumbnail}
//           />
//           <TouchableOpacity
//             style={styles.removePhotoButton}
//             onPress={() => removePhoto(index)}
//           >
//             <Text style={styles.removePhotoText}>✕</Text>
//           </TouchableOpacity>
//         </View>
//       ))}
//     </View>
//   )}
// </View>

// <View style={styles.marketSection}>
//   <Text style={styles.label}>Nearest Market</Text>
  
//   <TextInput
//     style={styles.input}
//     placeholder="🔍 Search by market name, pincode, district..."
//     value={marketSearch}
//     onChangeText={handleMarketSearch}
//   />
  
//   <View style={styles.pickerContainer}>
//     <Picker
//       selectedValue={nearestMarket}
//       onValueChange={setNearestMarket}
//       style={styles.picker}
//     >
//       <Picker.Item label="Select Nearest Market" value="" />
//       {filteredMarkets.map((market) => (
//         <Picker.Item 
//           key={market._id} 
//           label={`${market.marketName} - ${market.exactAddress}, ${market.district} (${market.pincode})`}
//           value={market._id}
//         />
//       ))}
//     </Picker>
//   </View>
  
//   {filteredMarkets.length === 0 && marketSearch && (
//     <Text style={styles.helperText}>
//       No markets found matching "{marketSearch}"
//     </Text>
//   )}
  
//   {nearestMarket && !marketSearch && (
//     <View style={styles.selectedMarketDisplay}>
//       <Text style={styles.selectedMarketText}>✓ Market Selected</Text>
//     </View>
//   )}
// </View>
//     </View>

//     <View style={styles.navigationButtons}>
//       <TouchableOpacity
//         style={[styles.button, styles.secondaryButton]}
//         onPress={prevStep}
//       >
//         <Text style={styles.buttonText}>← Previous</Text>
//       </TouchableOpacity>
//       <TouchableOpacity
//         style={[styles.button, styles.primaryButton]}
//         onPress={handleSubmit}
//       >
//         <Text style={styles.buttonText}>Submit Post</Text>
//       </TouchableOpacity>
//     </View>
//   </View>
// )}
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#ffffff',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     backgroundColor: '#ffffff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#e5e7eb',
//   },
//   backButton: {
//     padding: 8,
//     borderRadius: 20,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#111827',
//     marginLeft: 8,
//   },
//   scrollView: {
//     flex: 1,
//   },
//   content: {
//     padding: 16,
//   },
//   progressContainer: {
//     position: 'relative',
//     paddingVertical: 16,
//   },
//   progressLineContainer: {
//     position: 'absolute',
//     top: 28,
//     left: 40,
//     right: 40,
//     height: 2,
//   },
//   progressLineBackground: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     height: 2,
//     backgroundColor: '#e5e7eb',
//   },
//   progressLineCompleted: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     height: 2,
//     backgroundColor: '#16a34a',
//   },
//   stepsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: 24,
//     paddingVertical: 16,
//   },
//   stepIndicator: {
//     alignItems: 'center',
//     zIndex: 10,
//   },
//   stepCircle: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderWidth: 2,
//   },
//   stepCircleActive: {
//     backgroundColor: '#16a34a',
//     borderColor: '#16a34a',
//   },
//   stepCircleInactive: {
//     backgroundColor: '#ffffff',
//     borderColor: '#d1d5db',
//   },
//   stepNumber: {
//     fontWeight: '500',
//   },
//   stepNumberActive: {
//     color: '#ffffff',
//   },
//   stepNumberInactive: {
//     color: '#9ca3af',
//   },
//   mapPreviewContainer: {
//   height: 200,
//   borderRadius: 8,
//   overflow: 'hidden',
//   marginBottom: 16,
//   borderWidth: 1,
//   borderColor: '#d1d5db',
// },
// mapPreview: {
//   width: '100%',
//   height: '100%',
// },
//   stepLabel: {
//     fontSize: 12,
//     marginTop: 4,
//     textAlign: 'center',
//   },
//   stepLabelActive: {
//     color: '#16a34a',
//     fontWeight: '500',
//   },
//   stepLabelInactive: {
//     color: '#6b7280',
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: '500',
//     marginBottom: 8,
//     color: '#111827',
//   },
//   subLabel: {
//     fontSize: 14,
//     fontWeight: '500',
//     marginBottom: 8,
//     marginTop: 12,
//     color: '#374151',
//   },
//   pickerContainer: {
//     backgroundColor: '#ffffff',
//     borderWidth: 1,
//     borderColor: '#d1d5db',
//     borderRadius: 8,
//     marginBottom: 16,
//   },
//   picker: {
//     height: 50,
//     width: '100%',
//     color: '#333333',
//   },
//   input: {
//     backgroundColor: '#ffffff',
//     borderWidth: 1,
//     borderColor: '#d1d5db',
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 16,
//     fontSize: 16,
//     color: '#111827',
//   },
//   textArea: {
//     minHeight: 100,
//     textAlignVertical: 'top',
//   },
//   section: {
//     borderRadius: 8,
//     marginBottom: 24,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#111827',
//     marginBottom: 8,
//   },
//   formSection: {
//     backgroundColor: '#f3f4f6',
//     padding: 16,
//     borderRadius: 8,
//     marginBottom: 16,
//   },
//   navigationButtons: {
//     flexDirection: 'row',
//     gap: 16,
//     marginTop: 24,
//   },
//   button: {
//     flex: 1,
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   primaryButton: {
//     backgroundColor: '#16a34a',
//   },
//   secondaryButton: {
//     backgroundColor: '#6b7280',
//   },
//   mapContainer: {
//   height: 250,
//   borderRadius: 8,
//   overflow: 'hidden',
//   marginBottom: 16,
//   borderWidth: 1,
//   borderColor: '#d1d5db',
// },
// modalSubtitle: {
//     fontSize: 14,
//     color: '#6b7280',
//     textAlign: 'center',
//     marginBottom: 16,
//     paddingHorizontal: 8,
//   },
  

  
//   map: {
//     width: '100%',
//     height: '100%',
//   },
  
//   coordinatesDisplay: {
//     backgroundColor: '#f3f4f6',
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 12,
//   },
  
//   coordinateText: {
//     color: '#374151',
//     fontSize: 13,
//     textAlign: 'center',
//   },
  
//   currentLocationButton: {
//     backgroundColor: '#16a34a',
//     paddingVertical: 14,
//     borderRadius: 8,
//     marginBottom: 16,
//     alignItems: 'center',
//   },
  
//   modalButtonsContainer: {
//     flexDirection: 'row',
//     gap: 12,
//   },
  
//   modalButton: {
//     flex: 1,
//     paddingVertical: 14,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
  
//   cancelButton: {
//     backgroundColor: '#6b7280',
//   },
  
//   confirmButton: {
//     backgroundColor: '#16a34a',
//   },
  
//   locationModal: {
//     backgroundColor: '#ffffff',
//     borderRadius: 12,
//     padding: 20,
//     width: '90%',
//     maxHeight: '85%',
//   },
  
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     marginBottom: 8,
//     textAlign: 'center',
//     color: '#111827',
//   },
  
//   buttonText: {
//     color: '#ffffff',
//     textAlign: 'center',
//     fontWeight: '500',
//     fontSize: 16,
//   },

//   addGradeHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   addGradeButton: {
//     backgroundColor: '#2196F3',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 8,
//   },
//   addGradeButtonText: {
//     color: '#ffffff',
//     fontWeight: 'bold',
//     fontSize: 18,
//   },
//   gradeCard: {
//     backgroundColor: '#ffffff',
//     borderWidth: 1,
//     borderColor: '#d1d5db',
//     borderRadius: 8,
//     padding: 16,
//     marginBottom: 12,
//   },
//   gradeCardActive: {
//     borderColor: '#16a34a',
//     backgroundColor: '#f0fdf4',
//   },
//   gradeCheckbox: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   checkbox: {
//     width: 24,
//     height: 24,
//     borderWidth: 2,
//     borderColor: '#9ca3af',
//     borderRadius: 4,
//     marginRight: 12,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   checkboxActive: {
//     backgroundColor: '#16a34a',
//     borderColor: '#16a34a',
//   },
//   checkmark: {
//     color: '#ffffff',
//     fontWeight: '600',
//   },
//   gradeLabel: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#111827',
//   },
//   rowInputs: {
//     flexDirection: 'row',
//     gap: 12,
//     marginTop: 12,
//   },
//   halfInput: {
//     flex: 1,
//   },
//   locationButton: {
//     backgroundColor: '#FF9800',
//     paddingVertical: 12,
//     borderRadius: 8,
//     marginBottom: 12,
//   },
//   manualLocationButton: {
//     backgroundColor: '#9C27B0',
//     paddingVertical: 12,
//     borderRadius: 8,
//     marginBottom: 16,
//   },
//   locationDisplay: {
//     backgroundColor: '#ffffff',
//     borderWidth: 1,
//     borderColor: '#d1d5db',
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 16,
//   },
//   locationText: {
//     color: '#374151',
//     fontSize: 14,
//   },
//   dateTimeSection: {
//     marginTop: 16,
//   },
//   dateTimeButton: {
//     backgroundColor: '#ffffff',
//     borderWidth: 1,
//     borderColor: '#d1d5db',
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 12,
//   },
//   dateTimeText: {
//     color: '#111827',
//     fontSize: 16,
//   },
//   photoSection: {
//     marginTop: 16,
//   },
//   helperText: {
//     fontSize: 14,
//     color: '#6b7280',
//     marginBottom: 12,
//   },
//   cameraButton: {
//     backgroundColor: '#2196F3',
//     paddingVertical: 12,
//     borderRadius: 8,
//     marginBottom: 16,
//   },
//   photoGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginHorizontal: -4,
//   },
//   photoItem: {
//     width: '33.33%',
//     padding: 4,
//     position: 'relative',
//   },
//   thumbnail: {
//     width: '100%',
//     aspectRatio: 1,
//     borderRadius: 8,
//   },
//   removePhotoButton: {
//     position: 'absolute',
//     top: 8,
//     right: 8,
//     backgroundColor: '#ef4444',
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   removePhotoText: {
//     color: '#ffffff',
//     fontWeight: '600',
//   },
//   marketSection: {
//     marginTop: 16,
//   },
//   modalContainer: {
//     flex: 1,
//     backgroundColor: '#000000',
//   },
//   imageContainer: {
//     flex: 1,
//   },
//   previewImage: {
//     flex: 1,
//     width: '100%',
//   },
//   gpsOverlay: {
//     position: 'absolute',
//     bottom: 40,
//     left: 20,
//     right: 20,
//   },
//   gpsText: {
//     color: '#ffffff',
//     backgroundColor: 'rgba(0, 0, 0, 0.7)',
//     padding: 12,
//     fontSize: 16,
//     borderRadius: 8,
//     fontWeight: '500',
//   },
//   imageButtonsContainer: {
//     flexDirection: 'row',
//     padding: 16,
//     backgroundColor: '#000000',
//   },
//   imageButton: {
//     flex: 1,
//     paddingVertical: 12,
//     borderRadius: 8,
//     marginHorizontal: 8,
//   },
//   retakeButton: {
//     backgroundColor: '#ef4444',
//   },
//   saveButton: {
//     backgroundColor: '#22c55e',
//   },
//   imageButtonText: {
//     color: '#ffffff',
//     textAlign: 'center',
//     fontWeight: '500',
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   inputLabel: {
//     fontWeight: '500',
//     marginBottom: 8,
//     fontSize: 16,
//   },
//   selectedMarketDisplay: {
//   backgroundColor: '#e8f5e9',
//   padding: 12,
//   borderRadius: 8,
//   marginTop: 8,
// },
// selectedMarketText: {
//   color: '#16a34a',
//   fontSize: 14,
//   fontWeight: '500',
// },
// globalSettingsCard: {
//   backgroundColor: '#f0f0f0',
//   padding: 16,
//   borderRadius: 8,
//   marginBottom: 20,
// },
// globalSettingsTitle: {
//   fontSize: 16,
//   fontWeight: '600',
//   color: '#111827',
//   marginBottom: 12,
// },

//   headerText: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#000",
//   },
//   progressBarContainer: {
//     width: "100%",
//     height: 8,
//     backgroundColor: "#e0e0e0",
//     borderRadius: 4,
//     marginBottom: 20,
//     overflow: "hidden",
//   },
//   progressBar: {
//     height: "100%",
//     backgroundColor: "#4caf50",
//     borderRadius: 4,
//   },
//   stepContainer: {
//     marginBottom: 20,
//   },
//   stepTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 15,
//   },



//   buttonDisabled: {
//     backgroundColor: "#ccc",
//   },
//   buttonSecondary: {
//     backgroundColor: "#757575",
//   },

//   buttonRow: {
//     flexDirection: "row",
//     marginTop: 20,
//   },
//   globalSettings: {
//     backgroundColor: "#f0f0f0",
//     padding: 15,
//     borderRadius: 8,
//     marginBottom: 25,
//   },

//   gradeHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 10,
//   },


//   gradeCardSelected: {
//     backgroundColor: "#e8f5e9",
//   },
//   checkboxContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 10,
//   },

//   checkboxChecked: {
//     backgroundColor: "#4caf50",
//   },

//   gradeTitle: {
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   inputRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     gap: 10,
//   },
//   inputHalf: {
//     flex: 1,
//   },
//   photoUploadSection: {
//     marginTop: 15,
//   },
//   uploadButton: {
//     backgroundColor: "#2196F3",
//     padding: 12,
//     borderRadius: 4,
//     alignItems: "center",
//     marginTop: 5,
//     marginBottom: 10,
//   },
//   uploadButtonText: {
//     color: "#fff",
//     fontSize: 14,
//     fontWeight: "bold",
//   },

//   photoPreview: {
//     width: 100,
//     height: 100,
//     borderRadius: 4,
//     borderWidth: 1,
//     borderColor: "#ddd",
//     position: "relative",
//     overflow: "hidden",
//   },
//   photoImage: {
//     width: "100%",
//     height: "100%",
//     resizeMode: "cover",
//   },

//   photoCount: {
//     marginTop: 8,
//     color: "#4caf50",
//     fontSize: 13,
//     fontWeight: "bold",
//   },
//   mapPlaceholder: {
//     padding: 60,
//     backgroundColor: "#e0e0e0",
//     alignItems: "center",
//     borderRadius: 4,
//     marginBottom: 15,
//     marginTop: 10,
//   },
//   mapPlaceholderText: {
//     color: "#999",
//     fontSize: 14,
//   },

// });

// export default SellProductForm;








// import AsyncStorage from "@react-native-async-storage/async-storage";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import axios from "axios";
// import * as ImagePicker from "expo-image-picker";
// import * as Location from "expo-location";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import React, { useCallback, useEffect, useMemo, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Image,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View
// } from "react-native";
// //import MapView, { Marker } from "react-native-maps";

// // CRITICAL FIX 1: Replace all Picker components with this custom picker
// const CustomPicker = ({ label, value, options, onValueChange, placeholder }) => {
//   return (
//     <View style={{ marginBottom: 16 }}>
//       <Text style={styles.label}>{label}</Text>
//       <TouchableOpacity
//         style={styles.customPickerButton}
//         onPress={() => {
//           Alert.alert(
//             label,
//             placeholder,
//             [
//               ...options.map(opt => ({
//                 text: opt.label,
//                 onPress: () => onValueChange(opt.value)
//               })),
//               { text: "Cancel", style: "cancel" }
//             ],
//             { cancelable: true }
//           );
//         }}
//       >
//         <Text style={styles.customPickerText}>
//           {value ? options.find(o => o.value === value)?.label : placeholder}
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// // // CRITICAL FIX 2: Add image compression utility
// // const compressImage = async (uri: string) => {
// //   try {
// //     const manipResult = await ImagePicker.launchImageLibraryAsync({
// //       uri,
// //       quality: 0.3, // Aggressive compression
// //       allowsEditing: false,
// //     });
// //     return manipResult.canceled ? uri : manipResult.assets[0].uri;
// //   } catch (error) {
// //     console.error("Compression error:", error);
// //     return uri;
// //   }
// // };

// const SellProductForm: React.FC = () => {
//   const router = useRouter();
//   const params = useLocalSearchParams();
//   const categoryId = params.categoryId as string;
//   const subCategoryId = params.subCategoryId as string;

//   const [step, setStep] = useState(1);
  
//   // State declarations
//   const [categories, setCategories] = useState([]);
//   const [subCategories, setSubCategories] = useState([]);
//   const [cropBriefDetails, setCropBriefDetails] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState(categoryId || "");
//   const [selectedSubCategory, setSelectedSubCategory] = useState(subCategoryId || "");
//   const [globalQuantityType, setGlobalQuantityType] = useState("");
//   const [globalPriceType, setGlobalPriceType] = useState("");
  
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
//     { grade: "All Mixed Grades", pricePerUnit: "", totalQty: "", photos: [] },
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

//   // CRITICAL FIX 3: Add cleanup on unmount
//   useEffect(() => {
//     return () => {
//       // Cleanup images from memory
//       setCropPhotos([]);
//       setGradePrices(prev => prev.map(gp => ({ ...gp, photos: [] })));
//     };
//   }, []);

//   // CRITICAL FIX 4: Memoize expensive operations
//   const farmingTypeOptions = useMemo(() => [
//     { label: "Select Farming Type", value: "" },
//     { label: "Drop Down 1", value: "drop down 1" },
//     { label: "Regular", value: "regular" },
//     { label: "Organic", value: "organic" },
//   ], []);

//   const priceTypeOptions = useMemo(() => [
//     { label: "Select Type", value: "" },
//     { label: "Fixed", value: "fixed" },
//     { label: "Negotiable", value: "negotiable" },
//   ], []);

//   const quantityTypeOptions = useMemo(() => [
//     { label: "Select Type", value: "" },
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
//       Alert.alert("Error", "Failed to load categories");
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
//       const res = await axios.get("https://kisan.etpl.ai/api/market/all");
//       const marketData = res.data.data || res.data || [];
//       setMarkets(marketData);
//       setFilteredMarkets(marketData);
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

//   // CRITICAL FIX 5: Optimize market search
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

//   // CRITICAL FIX 6: Optimize photo upload with compression
//   const handlePhotoUpload = async () => {
//     try {
//       if (cropPhotos.length >= 3) {
//         Alert.alert("Limit Reached", "Maximum 3 photos allowed");
//         return;
//       }

//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsMultipleSelection: true,
//         quality: 0.3, // Heavy compression
//         allowsEditing: false,
//       });

//       if (!result.canceled && result.assets) {
//         const remainingSlots = 3 - cropPhotos.length;
//         const newPhotos = result.assets.slice(0, remainingSlots);
        
//         setCropPhotos(prev => [...prev, ...newPhotos]);
        
//         if (newPhotos.length < result.assets.length) {
//           Alert.alert("Info", `Only ${newPhotos.length} photo(s) added (3 photo limit)`);
//         }
//       }
//     } catch (error) {
//       console.error("Error uploading photos:", error);
//       Alert.alert("Error", "Failed to upload photos");
//     }
//   };

//   // CRITICAL FIX 7: Optimize grade photo upload
//   const handleGradePhotoUpload = async (index: number) => {
//     try {
//       const currentPhotos = gradePrices[index].photos.length;
//       if (currentPhotos >= 5) {
//         Alert.alert("Limit Reached", "Maximum 5 photos per grade");
//         return;
//       }

//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsMultipleSelection: true,
//         quality: 0.3,
//         allowsEditing: false,
//       });

//       if (!result.canceled && result.assets) {
//         const remainingSlots = 5 - currentPhotos;
//         const newPhotos = result.assets.slice(0, remainingSlots);
        
//         setGradePrices(prev => {
//           const updated = [...prev];
//           updated[index] = {
//             ...updated[index],
//             photos: [...updated[index].photos, ...newPhotos],
//           };
//           return updated;
//         });

//         if (newPhotos.length < result.assets.length) {
//           Alert.alert("Info", `Only ${newPhotos.length} photo(s) added (5 photo limit)`);
//         }
//       }
//     } catch (error) {
//       console.error("Error uploading grade photos:", error);
//       Alert.alert("Error", "Failed to upload photos");
//     }
//   };

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
//         Alert.alert("Permission Denied", "Location permission is required");
//         return;
//       }

//       const location = await Location.getCurrentPositionAsync({
//         accuracy: Location.Accuracy.Balanced,
//       });

//       setFarmLocation({
//         latitude: location.coords.latitude,
//         longitude: location.coords.longitude,
//       });

//       Alert.alert("Success", "Current location captured!");
//     } catch (error) {
//       console.error("Error getting location:", error);
//       Alert.alert("Error", "Failed to get current location");
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

//   const handleSubmit = async () => {
//     // Validation
//     if (!selectedCategory || !selectedSubCategory) {
//       Alert.alert("Missing Information", "Please fill in all required fields");
//       return;
//     }

//     const selectedGradeObjects = gradePrices.filter((gp) => 
//       selectedGrades.includes(gp.grade)
//     );

//     for (const gp of selectedGradeObjects) {
//       if (!gp.pricePerUnit || !gp.totalQty) {
//         Alert.alert(
//           "Incomplete Grade Information", 
//           `Please fill Price and Quantity for ${gp.grade}`
//         );
//         return;
//       }
//     }

//     const formData = new FormData();
//     const farmerId = await AsyncStorage.getItem('farmerId');
//     formData.append("farmerId", farmerId || "");
//     formData.append("categoryId", selectedCategory);
//     formData.append("subCategoryId", selectedSubCategory);
//     formData.append("cropBriefDetails", cropBriefDetails);
//     formData.append("farmingType", farmingType);
//     formData.append("typeOfSeeds", typeOfSeeds);
//     formData.append("packagingType", packagingType);
//     formData.append("packageMeasurement", packageMeasurement);
//     formData.append("unitMeasurement", unitMeasurement);
//     formData.append("deliveryDate", formatDate(deliveryDate));
//     formData.append("deliveryTime", formatTime(deliveryTime));
//     formData.append("nearestMarket", nearestMarket);
    
//     formData.append("farmLocation", JSON.stringify({
//       lat: farmLocation.latitude.toString(),
//       lng: farmLocation.longitude.toString()
//     }));

//     const selectedGradeData = selectedGradeObjects.map((gp) => ({
//       grade: gp.grade,
//       pricePerUnit: gp.pricePerUnit,
//       totalQty: gp.totalQty,
//       quantityType: globalQuantityType,
//       priceType: globalPriceType,
//     }));

//     formData.append("gradePrices", JSON.stringify(selectedGradeData));

//     // Append photos
//     gradePrices.forEach((gp) => {
//       if (selectedGrades.includes(gp.grade)) {
//         gp.photos.forEach((photo) => {
//           formData.append(`gradePhotos_${gp.grade}`, {
//             uri: photo.uri,
//             type: "image/jpeg",
//             name: `grade_${gp.grade}_${Date.now()}.jpg`,
//           } as any);
//         });
//       }
//     });

//     cropPhotos.forEach((photo, idx) => {
//       formData.append(`photos`, {
//         uri: photo.uri,
//         type: "image/jpeg",
//         name: `photo_${Date.now()}_${idx}.jpg`,
//       } as any);
//     });

//     try {
//       const response = await axios.post(
//         "https://kisan.etpl.ai/product/add",
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//           timeout: 60000,
//         }
//       );

//       Alert.alert("Success", "Product added successfully!");
//       router.back();
//     } catch (error: any) {
//       console.error("Submit error:", error);
//       Alert.alert("Error", error.response?.data?.message || "Failed to submit");
//     }
//   };

//   const nextStep = () => {
//     if (step < 4) setStep(step + 1);
//   };

//   const prevStep = () => {
//     if (step > 1) setStep(step - 1);
//   };

//   // Render methods
//   const renderStep1 = () => (
//     <View>
//       <Text style={styles.sectionTitle}>Category & Product</Text>
//       <View style={styles.section}>
//         <Text style={styles.label}>Crop Brief Details</Text>
//         <TextInput
//           style={[styles.input, styles.textArea]}
//           placeholder="Enter brief description"
//           value={cropBriefDetails}
//           onChangeText={setCropBriefDetails}
//           multiline
//           numberOfLines={4}
//           textAlignVertical="top"
//         />
//       </View>
//       <TouchableOpacity style={styles.primaryButton} onPress={nextStep}>
//         <Text style={styles.buttonText}>Next Step →</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   const renderStep2 = () => (
//     <View>
//       <Text style={styles.sectionTitle}>Farming & Packaging Details</Text>
      
//       <CustomPicker
//         label="Farming Type"
//         value={farmingType}
//         options={farmingTypeOptions}
//         onValueChange={setFarmingType}
//         placeholder="Select Farming Type"
//       />

//       <Text style={styles.label}>Type of Seeds</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="e.g., Naati, Hybrid"
//         value={typeOfSeeds}
//         onChangeText={setTypeOfSeeds}
//       />

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

//       <Text style={styles.label}>Unit Measurement</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="e.g., kg per box"
//         value={unitMeasurement}
//         onChangeText={setUnitMeasurement}
//       />

//       <View style={styles.navigationButtons}>
//         <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={prevStep}>
//           <Text style={styles.buttonText}>← Previous</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={nextStep}>
//           <Text style={styles.buttonText}>Next Step →</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   const renderStep3 = () => (
//     <View>
//       <Text style={styles.sectionTitle}>Pricing & Details</Text>
      
//       <View style={styles.globalSettingsCard}>
//         <Text style={styles.globalSettingsTitle}>Global Settings</Text>
        
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

//       {gradePrices.map((gp, index) => (
//         <View key={index} style={styles.gradeCard}>
//           <TouchableOpacity
//             style={styles.gradeCheckbox}
//             onPress={() => {
//               if (selectedGrades.includes(gp.grade)) {
//                 setSelectedGrades(prev => prev.filter(g => g !== gp.grade));
//               } else {
//                 setSelectedGrades(prev => [...prev, gp.grade]);
//               }
//             }}
//           >
//             <View style={[styles.checkbox, selectedGrades.includes(gp.grade) && styles.checkboxActive]}>
//               {selectedGrades.includes(gp.grade) && <Text style={styles.checkmark}>✓</Text>}
//             </View>
//             <Text style={styles.gradeLabel}>{gp.grade}</Text>
//           </TouchableOpacity>

//           {selectedGrades.includes(gp.grade) && (
//             <View>
//               <View style={styles.rowInputs}>
//                 <View style={styles.halfInput}>
//                   <Text style={styles.subLabel}>Price / unit (₹)</Text>
//                   <TextInput
//                     style={styles.input}
//                     placeholder="₹"
//                     value={gp.pricePerUnit}
//                     onChangeText={(value) => handleGradePriceChange(index, "pricePerUnit", value)}
//                     keyboardType="numeric"
//                   />
//                 </View>
//                 <View style={styles.halfInput}>
//                   <Text style={styles.subLabel}>Total Qty</Text>
//                   <TextInput
//                     style={styles.input}
//                     placeholder="Qty"
//                     value={gp.totalQty}
//                     onChangeText={(value) => handleGradePriceChange(index, "totalQty", value)}
//                     keyboardType="numeric"
//                   />
//                 </View>
//               </View>

//               <TouchableOpacity
//                 style={styles.uploadButton}
//                 onPress={() => handleGradePhotoUpload(index)}
//               >
//                 <Text style={styles.uploadButtonText}>
//                   📷 Upload Photos ({gp.photos.length}/5)
//                 </Text>
//               </TouchableOpacity>

//               {gp.photos.length > 0 && (
//                 <View style={styles.photoGrid}>
//                   {gp.photos.map((photo, photoIdx) => (
//                     <View key={photoIdx} style={styles.photoItem}>
//                       <Image source={{ uri: photo.uri }} style={styles.thumbnail} />
//                       <TouchableOpacity
//                         style={styles.removePhotoButton}
//                         onPress={() => {
//                           setGradePrices(prev => {
//                             const updated = [...prev];
//                             updated[index].photos = updated[index].photos.filter((_, idx) => idx !== photoIdx);
//                             return updated;
//                           });
//                         }}
//                       >
//                         <Text style={styles.removePhotoText}>×</Text>
//                       </TouchableOpacity>
//                     </View>
//                   ))}
//                 </View>
//               )}
//             </View>
//           )}
//         </View>
//       ))}

//       <View style={styles.navigationButtons}>
//         <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={prevStep}>
//           <Text style={styles.buttonText}>← Previous</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={nextStep}>
//           <Text style={styles.buttonText}>Next Step →</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   const renderStep4 = () => (
//     <View>
//       <Text style={styles.sectionTitle}>Final Details</Text>

//       <TouchableOpacity 
//         style={styles.locationButton} 
//         onPress={getCurrentLocation}
//         disabled={isGettingLocation}
//       >
//         {isGettingLocation ? (
//           <ActivityIndicator color="#fff" />
//         ) : (
//           <Text style={styles.buttonText}>📍 Get Current Location</Text>
//         )}
//       </TouchableOpacity>

//       <View style={styles.locationDisplay}>
//         <Text style={styles.locationText}>Lat: {farmLocation.latitude.toFixed(6)}</Text>
//         <Text style={styles.locationText}>Lon: {farmLocation.longitude.toFixed(6)}</Text>
//       </View>

//       <View style={styles.dateTimeSection}>
//         <Text style={styles.label}>Delivery Date</Text>
//         <TouchableOpacity 
//           style={styles.dateTimeButton} 
//           onPress={() => setShowDatePicker(true)}
//         >
//           <Text style={styles.dateTimeText}>📅 {formatDate(deliveryDate)}</Text>
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
        
//         <Text style={styles.label}>Delivery Time</Text>
//         <TouchableOpacity 
//           style={styles.dateTimeButton} 
//           onPress={() => setShowTimePicker(true)}
//         >
//           <Text style={styles.dateTimeText}>🕐 {formatTime(deliveryTime)}</Text>
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

//       <View style={styles.photoSection}>
//         <Text style={styles.label}>Upload Crop Photos</Text>
//         <TouchableOpacity
//           style={styles.uploadButton}
//           onPress={handlePhotoUpload}
//           disabled={cropPhotos.length >= 3}
//         >
//           <Text style={styles.uploadButtonText}>
//             📸 Select Photos ({cropPhotos.length}/3)
//           </Text>
//         </TouchableOpacity>

//         {cropPhotos.length > 0 && (
//           <View style={styles.photoGrid}>
//             {cropPhotos.map((photo, index) => (
//               <View key={index} style={styles.photoItem}>
//                 <Image source={{ uri: photo.uri }} style={styles.thumbnail} />
//                 <TouchableOpacity
//                   style={styles.removePhotoButton}
//                   onPress={() => setCropPhotos(prev => prev.filter((_, i) => i !== index))}
//                 >
//                   <Text style={styles.removePhotoText}>×</Text>
//                 </TouchableOpacity>
//               </View>
//             ))}
//           </View>
//         )}
//       </View>

//       <View style={styles.marketSection}>
//         <Text style={styles.label}>Nearest Market</Text>
//         <TextInput
//           style={styles.input}
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

//       <View style={styles.navigationButtons}>
//         <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={prevStep}>
//           <Text style={styles.buttonText}>← Previous</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={handleSubmit}>
//           <Text style={styles.buttonText}>Submit Post</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={prevStep} style={styles.backButton}>
//           <Text style={styles.backButtonText}>←</Text>
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>
//           Step {step} of 4
//         </Text>
//       </View>

//       <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
//         <View style={styles.content}>
//           {step === 1 && renderStep1()}
//           {step === 2 && renderStep2()}
//           {step === 3 && renderStep3()}
//           {step === 4 && renderStep4()}
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#ffffff',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#e5e7eb',
//   },
//   backButton: {
//     padding: 8,
//   },
//   backButtonText: {
//     fontSize: 24,
//     color: '#111827',
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginLeft: 12,
//   },
//   scrollView: {
//     flex: 1,
//   },
//   content: {
//     padding: 16,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     marginBottom: 16,
//     color: '#111827',
//   },
//   section: {
//     marginBottom: 16,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: '500',
//     marginBottom: 8,
//     color: '#111827',
//   },
//   subLabel: {
//     fontSize: 14,
//     fontWeight: '500',
//     marginBottom: 8,
//     color: '#374151',
//   },
//   input: {
//     backgroundColor: '#ffffff',
//     borderWidth: 1,
//     borderColor: '#d1d5db',
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 16,
//     fontSize: 16,
//   },
//   textArea: {
//     minHeight: 100,
//     textAlignVertical: 'top',
//   },
//   customPickerButton: {
//     backgroundColor: '#ffffff',
//     borderWidth: 1,
//     borderColor: '#d1d5db',
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 16,
//   },
//   customPickerText: {
//     fontSize: 16,
//     color: '#111827',
//   },
//   globalSettingsCard: {
//     backgroundColor: '#f3f4f6',
//     padding: 16,
//     borderRadius: 8,
//     marginBottom: 20,
//   },
//   globalSettingsTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#111827',
//     marginBottom: 12,
//   },
//   gradeCard: {
//     backgroundColor: '#ffffff',
//     borderWidth: 1,
//     borderColor: '#d1d5db',
//     borderRadius: 8,
//     padding: 16,
//     marginBottom: 12,
//   },
//   gradeCheckbox: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   checkbox: {
//     width: 24,
//     height: 24,
//     borderWidth: 2,
//     borderColor: '#9ca3af',
//     borderRadius: 4,
//     marginRight: 12,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   checkboxActive: {
//     backgroundColor: '#16a34a',
//     borderColor: '#16a34a',
//   },
//   checkmark: {
//     color: '#ffffff',
//     fontWeight: '600',
//     fontSize: 16,
//   },
//   gradeLabel: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#111827',
//   },
//   rowInputs: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   halfInput: {
//     flex: 1,
//   },
//   uploadButton: {
//     backgroundColor: '#2196F3',
//     padding: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 8,
//     marginBottom: 12,
//   },
//   uploadButtonText: {
//     color: '#ffffff',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   photoGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 8,
//     marginTop: 8,
//   },
//   photoItem: {
//     width: 100,
//     height: 100,
//     position: 'relative',
//   },
//   thumbnail: {
//     width: '100%',
//     height: '100%',
//     borderRadius: 8,
//   },
//   removePhotoButton: {
//     position: 'absolute',
//     top: 4,
//     right: 4,
//     backgroundColor: '#ef4444',
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   removePhotoText: {
//     color: '#ffffff',
//     fontSize: 18,
//     fontWeight: '600',
//   },
//   navigationButtons: {
//     flexDirection: 'row',
//     gap: 12,
//     marginTop: 24,
//   },
//   button: {
//     flex: 1,
//     paddingVertical: 14,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   primaryButton: {
//     backgroundColor: '#16a34a',
//   },
//   secondaryButton: {
//     backgroundColor: '#6b7280',
//   },
//   buttonText: {
//     color: '#ffffff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   locationButton: {
//     backgroundColor: '#16a34a',
//     paddingVertical: 14,
//     borderRadius: 8,
//     marginBottom: 12,
//     alignItems: 'center',
//   },
//   locationDisplay: {
//     backgroundColor: '#f3f4f6',
//     borderWidth: 1,
//     borderColor: '#d1d5db',
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 16,
//   },
//   locationText: {
//     color: '#374151',
//     fontSize: 14,
//     marginBottom: 4,
//   },
//   dateTimeSection: {
//     marginTop: 16,
//   },
//   dateTimeButton: {
//     backgroundColor: '#ffffff',
//     borderWidth: 1,
//     borderColor: '#d1d5db',
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 12,
//   },
//   dateTimeText: {
//     color: '#111827',
//     fontSize: 16,
//   },
//   photoSection: {
//     marginTop: 16,
//   },
//   marketSection: {
//     marginTop: 16,
//   },
// });

// export default SellProductForm;







import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft } from 'lucide-react-native';
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Custom Picker component with improved styling
const CustomPicker = ({ label, value, options, onValueChange, placeholder }) => {
  return (
    <View className="mb-5">
      <Text className="text-base font-medium text-gray-900 mb-2">{label}</Text>
      <TouchableOpacity
        className="bg-white border-2 border-gray-300 rounded-xl p-4 shadow-sm"
        onPress={() => {
          Alert.alert(
            label,
            placeholder,
            [
              ...options.map(opt => ({
                text: opt.label,
                onPress: () => onValueChange(opt.value)
              })),
              { text: "Cancel", style: "cancel" }
            ],
            { cancelable: true }
          );
        }}
      >
        <Text className="text-base text-gray-900">
          {value ? options.find(o => o.value === value)?.label : placeholder}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const SellProductForm: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const categoryId = params.categoryId as string;
  const subCategoryId = params.subCategoryId as string;

  const [step, setStep] = useState(1);
  
  // State declarations
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [cropBriefDetails, setCropBriefDetails] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categoryId || "");
  const [selectedSubCategory, setSelectedSubCategory] = useState(subCategoryId || "");
  const [globalQuantityType, setGlobalQuantityType] = useState("");
  const [globalPriceType, setGlobalPriceType] = useState("");
  
  const [farmingType, setFarmingType] = useState("");
  const [typeOfSeeds, setTypeOfSeeds] = useState("");
  const [packagingType, setPackagingType] = useState("");
  const [packageMeasurement, setPackageMeasurement] = useState("");
  const [unitMeasurement, setUnitMeasurement] = useState("");
  const [packagingOptions, setPackagingOptions] = useState([]);
  const [selectedPackaging, setSelectedPackaging] = useState(null);
  
  const [markets, setMarkets] = useState([]);
  const [filteredMarkets, setFilteredMarkets] = useState([]);
  const [marketSearch, setMarketSearch] = useState("");
  const [nearestMarket, setNearestMarket] = useState("");
  
  const [gradePrices, setGradePrices] = useState([
    { grade: "A Grade", pricePerUnit: "", totalQty: "", photos: [] },
    { grade: "B Grade", pricePerUnit: "", totalQty: "", photos: [] },
    { grade: "All Mixed Grades", pricePerUnit: "", totalQty: "", photos: [] },
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setCropPhotos([]);
      setGradePrices(prev => prev.map(gp => ({ ...gp, photos: [] })));
    };
  }, []);

  // Memoize options
  const farmingTypeOptions = useMemo(() => [
    { label: "Select Farming Type", value: "" },
    { label: "Drop Down 1", value: "drop down 1" },
    { label: "Regular", value: "regular" },
    { label: "Organic", value: "organic" },
  ], []);

  const priceTypeOptions = useMemo(() => [
    { label: "Select Type", value: "" },
    { label: "Fixed", value: "fixed" },
    { label: "Negotiable", value: "negotiable" },
  ], []);

  const quantityTypeOptions = useMemo(() => [
    { label: "Select Type", value: "" },
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
      Alert.alert("Error", "Failed to load categories");
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
      const res = await axios.get("https://kisan.etpl.ai/api/market/all");
      const marketData = res.data.data || res.data || [];
      setMarkets(marketData);
      setFilteredMarkets(marketData);
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

  const handlePhotoUpload = async () => {
    try {
      if (cropPhotos.length >= 3) {
        Alert.alert("Limit Reached", "Maximum 3 photos allowed");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.3,
        allowsEditing: false,
      });

      if (!result.canceled && result.assets) {
        const remainingSlots = 3 - cropPhotos.length;
        const newPhotos = result.assets.slice(0, remainingSlots);
        
        setCropPhotos(prev => [...prev, ...newPhotos]);
        
        if (newPhotos.length < result.assets.length) {
          Alert.alert("Info", `Only ${newPhotos.length} photo(s) added (3 photo limit)`);
        }
      }
    } catch (error) {
      console.error("Error uploading photos:", error);
      Alert.alert("Error", "Failed to upload photos");
    }
  };

  const handleGradePhotoUpload = async (index: number) => {
    try {
      const currentPhotos = gradePrices[index].photos.length;
      if (currentPhotos >= 5) {
        Alert.alert("Limit Reached", "Maximum 5 photos per grade");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.3,
        allowsEditing: false,
      });

      if (!result.canceled && result.assets) {
        const remainingSlots = 5 - currentPhotos;
        const newPhotos = result.assets.slice(0, remainingSlots);
        
        setGradePrices(prev => {
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            photos: [...updated[index].photos, ...newPhotos],
          };
          return updated;
        });

        if (newPhotos.length < result.assets.length) {
          Alert.alert("Info", `Only ${newPhotos.length} photo(s) added (5 photo limit)`);
        }
      }
    } catch (error) {
      console.error("Error uploading grade photos:", error);
      Alert.alert("Error", "Failed to upload photos");
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
        Alert.alert("Permission Denied", "Location permission is required");
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setFarmLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      Alert.alert("Success", "Current location captured!");
    } catch (error) {
      console.error("Error getting location:", error);
      Alert.alert("Error", "Failed to get current location");
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

  const handleSubmit = async () => {
    if (!selectedCategory || !selectedSubCategory) {
      Alert.alert("Missing Information", "Please fill in all required fields");
      return;
    }

    const selectedGradeObjects = gradePrices.filter((gp) => 
      selectedGrades.includes(gp.grade)
    );

    for (const gp of selectedGradeObjects) {
      if (!gp.pricePerUnit || !gp.totalQty) {
        Alert.alert(
          "Incomplete Grade Information", 
          `Please fill Price and Quantity for ${gp.grade}`
        );
        return;
      }
    }

    const formData = new FormData();
    const farmerId = await AsyncStorage.getItem('farmerId');
    formData.append("farmerId", farmerId || "");
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

    gradePrices.forEach((gp) => {
      if (selectedGrades.includes(gp.grade)) {
        gp.photos.forEach((photo) => {
          formData.append(`gradePhotos_${gp.grade}`, {
            uri: photo.uri,
            type: "image/jpeg",
            name: `grade_${gp.grade}_${Date.now()}.jpg`,
          } as any);
        });
      }
    });

    cropPhotos.forEach((photo, idx) => {
      formData.append(`photos`, {
        uri: photo.uri,
        type: "image/jpeg",
        name: `photo_${Date.now()}_${idx}.jpg`,
      } as any);
    });

    try {
      const response = await axios.post(
        "https://kisan.etpl.ai/product/add",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 60000,
        }
      );

      Alert.alert("Success", "Product added successfully!");
      router.back();
    } catch (error: any) {
      console.error("Submit error:", error);
      Alert.alert("Error", error.response?.data?.message || "Failed to submit");
    }
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const goBack = () => {
    if (step > 1) {
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
          label="Measurement"
          value={packageMeasurement}
          options={selectedPackaging.measurements.map(m => ({ label: m, value: m }))}
          onValueChange={setPackageMeasurement}
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
      </View>

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
                  <Text className="text-sm font-medium text-gray-700 mb-2">Price / unit (₹)</Text>
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

              <TouchableOpacity
                className="bg-blue-500 p-4 rounded-xl items-center mb-4 shadow-md active:bg-blue-600"
                onPress={() => handleGradePhotoUpload(index)}
              >
                <Text className="text-white text-base font-medium">
                  📷 Upload Photos ({gp.photos.length}/5)
                </Text>
              </TouchableOpacity>

              {gp.photos.length > 0 && (
                <View className="flex-row flex-wrap gap-2">
                  {gp.photos.map((photo, photoIdx) => (
                    <View key={photoIdx} className="w-[100px] h-[100px] relative">
                      <Image source={{ uri: photo.uri }} className="w-full h-full rounded-xl" />
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
        <Text className="text-base font-medium text-gray-900 mb-3">Upload Crop Photos</Text>
        <TouchableOpacity
          className="bg-blue-500 p-4 rounded-xl items-center mb-4 shadow-lg active:bg-blue-600"
          onPress={handlePhotoUpload}
          disabled={cropPhotos.length >= 3}
        >
          <Text className="text-white text-base font-medium">
            📸 Select Photos ({cropPhotos.length}/3)
          </Text>
        </TouchableOpacity>

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
        >
          <Text className="text-white text-center text-lg font-medium">← Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className="bg-green-600 flex-1 py-4 rounded-xl shadow-lg active:bg-green-700" 
          onPress={handleSubmit}
        >
          <Text className="text-white text-center text-lg font-medium">Submit Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
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
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </View>
      </ScrollView>
    </View>
  );
};

export default SellProductForm;