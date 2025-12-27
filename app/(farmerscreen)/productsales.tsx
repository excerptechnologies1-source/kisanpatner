import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { ChevronLeft } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Category {
  _id: string;
  categoryId: string;
  categoryName: string;
}

interface SubCategory {
  _id: string;
  subCategoryId: string;
  subCategoryName: string;
  categoryId: string;
}

interface GradePrice {
  grade: string;
  pricePerUnit: string;
  totalQty: string;
  quantityType: string;
  priceType: string; 
}

interface CapturedPhoto {
  uri: string;
  watermarkedUri?: string;
}

const SellProductForm: React.FC = () => {
  const [step, setStep] = useState(1);

  // Step 1: Category & Basic Info
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [cropBriefDetails, setCropBriefDetails] = useState("");

  // Step 2: Farming & Packaging Details
  const [farmingType, setFarmingType] = useState("");
  const [typeOfSeeds, setTypeOfSeeds] = useState("");
  const [packagingType, setPackagingType] = useState("");
  const [packageMeasurement, setPackageMeasurement] = useState("");
  const [unitMeasurement, setUnitMeasurement] = useState("");

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  
  // Step 3: Grade & Pricing
  const [gradePrices, setGradePrices] = useState<GradePrice[]>([
    { grade: "A Grade", pricePerUnit: "", totalQty: "", quantityType: "", priceType: "" },
    { grade: "B Grade", pricePerUnit: "", totalQty: "", quantityType: "", priceType: "" },
    { grade: "All Mixed Grades", pricePerUnit: "", totalQty: "", quantityType: "", priceType: "" },
  ]);
  const [gradeCounter, setGradeCounter] = useState(2);
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);

  // Step 4: Final Details
  const [deliveryDate, setDeliveryDate] = useState(new Date());
  const [deliveryTime, setDeliveryTime] = useState(new Date());
  const [nearestMarket, setNearestMarket] = useState("");
  const [cropPhotos, setCropPhotos] = useState<CapturedPhoto[]>([]);
  const [farmLocation, setFarmLocation] = useState({
    latitude: 12.9716,
    longitude: 77.5946,
  });

  // Camera States
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [gpsText, setGpsText] = useState("");

  // Map States
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  useEffect(() => {
    fetchCategories();
    requestLocationPermission();
  }, []);

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

  const fetchCategories = async () => {
    try {
      const res = await axios.get("https://kisan.etpl.ai/category/all");
      setCategories(res.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchSubCategories = async (categoryId: string) => {
    try {
      const res = await axios.get(
        `https://kisan.etpl.ai/subcategory/category/${categoryId}`
      );
      setSubCategories(res.data.data);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };
  
  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setDeliveryDate(selectedDate);
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === "ios");
    if (selectedTime) {
      setDeliveryTime(selectedTime);
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

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubCategory("");
    if (categoryId) {
      fetchSubCategories(categoryId);
    } else {
      setSubCategories([]);
    }
  };

  const handleGradeToggle = (grade: string) => {
    if (selectedGrades.includes(grade)) {
      setSelectedGrades(selectedGrades.filter((g) => g !== grade));
    } else {
      setSelectedGrades([...selectedGrades, grade]);
    }
  };

  const handleGradePriceChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updated = [...gradePrices];
    updated[index] = { ...updated[index], [field]: value };
    setGradePrices(updated);
  };

  const handleAddGrade = () => {
    const nextGrade = String.fromCharCode(65 + gradeCounter);
    const newGrade: GradePrice = {
      grade: `${nextGrade} Grade`,
      pricePerUnit: "",
      totalQty: "",
      quantityType: "",
      priceType: ""
    };
    setGradePrices([...gradePrices.slice(0, -1), newGrade, gradePrices[gradePrices.length - 1]]);
    setGradeCounter(gradeCounter + 1);
  };

  // Camera Functions
  const openCamera = async () => {
    try {
      console.log("Opening camera...");
      
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Camera permission is required");
        return;
      }

      console.log("Camera permission granted, launching camera...");

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.3,
        exif: false,
        base64: false,
      });

      console.log("Camera result:", result);

      if (result.canceled) {
        console.log("User cancelled camera");
        return;
      }

      if (result.assets && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        console.log("Image captured:", imageUri);

        try {
          console.log("Getting location...");
          const loc = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          
          const text = `Lat: ${loc.coords.latitude.toFixed(6)}\nLon: ${loc.coords.longitude.toFixed(6)}\n${new Date().toLocaleString()}`;
          
          console.log("Location obtained:", text);
          setGpsText(text);
          setCapturedImage(imageUri);
        } catch (locError) {
          console.error("Error getting location:", locError);
          const text = `Location unavailable\n${new Date().toLocaleString()}`;
          setGpsText(text);
          setCapturedImage(imageUri);
        }
      }
    } catch (error) {
      console.error("Camera error:", error);
      Alert.alert("Error", "Failed to open camera. Please try again.");
    }
  };

  const saveWithWatermark = async () => {
    try {
      console.log("Saving photo...");
      
      if (!capturedImage) {
        Alert.alert("Error", "No image to save");
        return;
      }

      if (cropPhotos.length >= 3) {
        Alert.alert("Limit Reached", "Maximum 3 photos allowed");
        setCapturedImage(null);
        setGpsText("");
        return;
      }

      const newPhoto = { 
        uri: capturedImage, 
        watermarkedUri: capturedImage,
        timestamp: new Date().toISOString()
      };

      console.log("Adding photo:", newPhoto);
      
      setCropPhotos([...cropPhotos, newPhoto]);
      setCapturedImage(null);
      setGpsText("");
      
      Alert.alert("Success", "Photo saved!");
    } catch (error) {
      console.error("Error saving photo:", error);
      Alert.alert("Error", "Failed to save photo");
    }
  };

  const removePhoto = (index: number) => {
    const updated = cropPhotos.filter((_, i) => i !== index);
    setCropPhotos(updated);
  };

  // Location Functions
  const getCurrentLocation = async () => {
    setIsGettingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission is required");
        setIsGettingLocation(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
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

  const openLocationPicker = () => {
    setShowLocationPicker(true);
  };

  const saveManualLocation = () => {
    if (farmLocation.latitude && farmLocation.longitude) {
      setShowLocationPicker(false);
      Alert.alert("Success", "Location saved!");
    } else {
      Alert.alert("Error", "Please enter valid coordinates");
    }
  };

  const handleSubmit = async () => {
    if (cropPhotos.length > 3) {
      Alert.alert("Too Many Photos", "Please limit to 3 photos maximum.");
      return;
    }

    if (!selectedCategory || !selectedSubCategory) {
      Alert.alert("Missing Information", "Please fill in all required fields");
      return;
    }

    if (!cropBriefDetails || !farmingType || !typeOfSeeds) {
      Alert.alert("Missing Information", "Please fill in all farming details");
      return;
    }

    if (!packagingType || !packageMeasurement) {
      Alert.alert("Missing Information", "Please fill in packaging details");
      return;
    }

    if (selectedGrades.length === 0) {
      Alert.alert("Missing Information", "Please select at least one grade");
      return;
    }

    // ✅ ADD VALIDATION FOR GRADE PRICES
    const selectedGradeObjects = gradePrices.filter((gp) => 
      selectedGrades.includes(gp.grade)
    );

    for (const gp of selectedGradeObjects) {
      if (!gp.pricePerUnit || !gp.totalQty || !gp.quantityType || !gp.priceType) {
        Alert.alert(
          "Incomplete Grade Information", 
          `Please fill all fields for ${gp.grade} including Quantity Type and Price Type`
        );
        return;
      }
    }

    if (!nearestMarket) {
      Alert.alert("Missing Information", "Please enter nearest market");
      return;
    }
const farmerId = await AsyncStorage.getItem('farmerId');
    const formData = new FormData();
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

    // ✅ FIXED: Include quantityType and priceType
    const selectedGradeData = gradePrices
      .filter((gp) => selectedGrades.includes(gp.grade))
      .map((gp) => ({
        grade: gp.grade,
        pricePerUnit: parseFloat(gp.pricePerUnit) || 0,
        totalQty: parseFloat(gp.totalQty) || 0,
        quantityType: gp.quantityType,  // ✅ Added
        priceType: gp.priceType,        // ✅ Added
      }));

    formData.append("gradePrices", JSON.stringify(selectedGradeData));

    cropPhotos.forEach((photo, index) => {
      const photoUri = photo.watermarkedUri || photo.uri;
      const normalizedUri = photoUri.startsWith('file://') 
        ? photoUri 
        : `file://${photoUri}`;
      
      formData.append("photos", {
        uri: normalizedUri,
        type: "image/jpeg",
        name: `crop_photo_${Date.now()}_${index}.jpg`,
      } as any);
    });

    try {
      console.log("Submitting product...");
      console.log("Grade data being sent:", selectedGradeData); // ✅ Debug log

      const response = await axios.post(
        "https://kisan.etpl.ai/product/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 30000,
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        }
      );

      console.log("Response:", response.data);
      Alert.alert("Success", "Product added successfully!");
      setStep(1);
      resetForm();
    } catch (error: any) {
      console.error("Error submitting product:", error);
      console.error("Error response:", error.response?.data);

      if (error.response?.status === 413) {
        Alert.alert(
          "Upload Too Large",
          "The images are too large. Please use fewer photos or lower quality."
        );
      } else if (error.response?.status === 500) {
        Alert.alert(
          "Server Error",
          "Server error: " + (error.response?.data?.message || "Please try again")
        );
      } else if (error.response?.status === 400) {
        Alert.alert(
          "Validation Error",
          "Invalid data: " + (error.response?.data?.message || "Please check all fields")
        );
      } else if (error.code === 'ECONNABORTED') {
        Alert.alert(
          "Timeout",
          "Upload timed out. Please try again with fewer/smaller photos."
        );
      } else if (error.code === 'ECONNREFUSED') {
        Alert.alert(
          "Connection Error",
          "Cannot connect to server. Please check your internet connection."
        );
      } else {
        Alert.alert(
          "Error",
          "Failed to submit: " + (error.message || "Unknown error")
        );
      }
    }
  };

  const resetForm = () => {
    setSelectedCategory("");
    setSelectedSubCategory("");
    setCropBriefDetails("");
    setFarmingType("");
    setTypeOfSeeds("");
    setPackagingType("");
    setPackageMeasurement("");
    setUnitMeasurement("");
    setSelectedGrades([]);
    setDeliveryDate(new Date());
    setDeliveryTime(new Date());
    setNearestMarket("");
    setCropPhotos([]);
    setGradePrices([
      { grade: "A Grade", pricePerUnit: "", totalQty: "", quantityType: "", priceType: "" },
      { grade: "B Grade", pricePerUnit: "", totalQty: "", quantityType: "", priceType: "" },
      { grade: "All Mixed Grades", pricePerUnit: "", totalQty: "", quantityType: "", priceType: "" },
    ]);
    setGradeCounter(2);
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const getStepTitle = () => {
    switch(step) {
      case 1: return "Category & Product";
      case 2: return "Farming & Packaging";
      case 3: return "Pricing & Details";
      case 4: return "Final Details";
      default: return "Sell Your Produce";
    }
  };

  const renderProgressBar = () => {
    const totalSteps = 4;
    const progress = (step - 1) / (totalSteps - 1);
    
    return (
      <View className="relative py-4 ">
        <View className="absolute top-5 left-10 right-10 h-0.5">
          <View className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200" />
          <View 
            className="absolute top-0 left-0 h-0.5 bg-green-600" 
            style={{ width: `${progress * 100}%` }} 
          />
        </View>
        
        <View className="flex-row justify-between px-6 py-4">
          {[1, 2, 3, 4].map((stepNum) => (
            <View key={stepNum} className="items-center z-10">
              <View
                className={`
                  w-8 h-8 rounded-full items-center justify-center border-2
                  ${step >= stepNum 
                    ? "bg-green-600 border-green-600" 
                    : "bg-white border-gray-300"
                  }
                `}
              >
                <Text
                  className={`
                    font-medium
                    ${step >= stepNum ? "text-white" : "text-gray-400"}
                  `}
                >
                  {stepNum}
                </Text>
              </View>
              <Text
                className={`
                  text-xs mt-1 text-center
                  ${step >= stepNum 
                    ? "text-green-600 font-medium" 
                    : "text-gray-500"
                  }
                `}
              >
                {stepNum === 1 && "Category"}
                {stepNum === 2 && "Farming"}
                {stepNum === 3 && "Pricing"}
                {stepNum === 4 && "Details"}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header with back button */}
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-200">
        <TouchableOpacity
          onPress={prevStep}
          activeOpacity={0.7}
          className="p-2 rounded-full"
        >
          <ChevronLeft size={20} color="#064E3B" />
        </TouchableOpacity>

        <Text className="text-lg font-semibold text-gray-900 ml-2">
          {getStepTitle()}
        </Text>
      </View>

      {/* Image Preview with GPS Info Modal */}
      <Modal visible={!!capturedImage} animationType="slide" transparent={false}>
        <View className="flex-1 bg-black">
          <View className="flex-1">
            {capturedImage ? (
              <Image
                source={{ uri: capturedImage }}
                className="flex-1 w-full"
                resizeMode="contain"
                onError={(error) => {
                  console.error("Image load error:", error.nativeEvent);
                  Alert.alert("Error", "Failed to load image");
                  setCapturedImage(null);
                  setGpsText("");
                }}
                onLoad={() => console.log("Image loaded successfully")}
              />
            ) : null}
            {gpsText ? (
              <View className="absolute bottom-10 left-5 right-5">
                <Text className="text-white bg-black/70 p-3 text-base font-medium rounded-lg">
                  {gpsText}
                </Text>
              </View>
            ) : null}
          </View>
          <View className="flex-row p-4 bg-black">
            <TouchableOpacity
              className="flex-1 py-3 rounded-lg mx-2 bg-red-500"
              onPress={() => {
                setCapturedImage(null);
                setGpsText("");
              }}
            >
              <Text className="text-white text-center font-medium">Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 py-3 rounded-lg mx-2 bg-green-500"
              onPress={saveWithWatermark}
            >
              <Text className="text-white text-center font-medium">Save Photo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Map Picker Modal */}
      <Modal visible={showLocationPicker} animationType="slide" transparent={true}>
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-white rounded-xl p-6 w-5/6 max-h-[70%]">
            <Text className="text-xl font-medium mb-5 text-center">Enter Farm Location</Text>

            <Text className="font-medium mb-2 text-base">Latitude</Text>
            <TextInput
              className="bg-white border border-gray-300 rounded-lg px-3 py-3 mb-4 text-base text-gray-900"
              placeholder="e.g., 12.9716"
              value={farmLocation.latitude.toString()}
              onChangeText={(text) =>
                setFarmLocation({
                  ...farmLocation,
                  latitude: parseFloat(text) || 0,
                })
              }
              keyboardType="numeric"
            />

            <Text className="font-medium mb-2 text-base">Longitude</Text>
            <TextInput
              className="bg-white border border-gray-300 rounded-lg px-3 py-3 mb-4 text-base text-gray-900"
              placeholder="e.g., 77.5946"
              value={farmLocation.longitude.toString()}
              onChangeText={(text) =>
                setFarmLocation({
                  ...farmLocation,
                  longitude: parseFloat(text) || 0,
                })
              }
              keyboardType="numeric"
            />

            <TouchableOpacity
              className="bg-green-600 py-3 rounded-lg mb-4"
              onPress={getCurrentLocation}
              disabled={isGettingLocation}
            >
              {isGettingLocation ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white text-center font-medium">📍 Use Current Location</Text>
              )}
            </TouchableOpacity>

            <View className="flex-row mt-6 gap-2">
              <TouchableOpacity
                className="flex-1 py-3 rounded-lg mx-2 bg-gray-500"
                onPress={() => setShowLocationPicker(false)}
              >
                <Text className="text-white text-center font-medium">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 py-3 rounded-lg mx-2 bg-green-600"
                onPress={saveManualLocation}
              >
                <Text className="text-white text-center font-medium">Save Location</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
        {renderProgressBar()}
        
        <View className="p-4">
          {/* Step 1: Category Selection */}
          {step === 1 && (
            <View>
              <Text className="text-base font-medium mb-2 text-gray-900">Select Category</Text>
              <View className="bg-white border border-gray-300 rounded-lg mb-4">
                <Picker
                  selectedValue={selectedCategory}
                  onValueChange={handleCategoryChange}
                  className="h-12 w-full text-gray-900"
                >
                  <Picker.Item label="Select Category" value="" />
                  {categories.map((c) => (
                    <Picker.Item key={c._id} label={c.categoryName} value={c._id} />
                  ))}
                </Picker>
              </View>

              <Text className="text-base font-medium mb-2 text-gray-900">Select Sub Category</Text>
              <View className="bg-white border border-gray-300 rounded-lg mb-4">
                <Picker
                  selectedValue={selectedSubCategory}
                  onValueChange={setSelectedSubCategory}
                  enabled={!!selectedCategory}
                  className="h-12 w-full text-gray-900"
                >
                  <Picker.Item label="Select Sub Category" value="" />
                  {subCategories.map((s) => (
                    <Picker.Item
                      key={s._id}
                      label={s.subCategoryName}
                      value={s._id}
                    />
                  ))}
                </Picker>
              </View>

              <View className="mb-6">
                <Text className="text-base font-medium mb-2 text-gray-900">Crop Brief Details</Text>
                <TextInput
                  className="bg-white border border-gray-300 rounded-lg px-3 py-3 text-base text-gray-900 min-h-[100px] text-align-top"
                  placeholder="Enter brief description (farming type, seeds type, organic/regular)"
                  value={cropBriefDetails}
                  onChangeText={setCropBriefDetails}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              <TouchableOpacity className="bg-green-600 py-3 rounded-lg" onPress={nextStep}>
                <Text className="text-white text-center font-medium text-base">Next Step →</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Step 2: Farming & Packaging Details */}
          {step === 2 && (
            <View>
              <Text className="text-lg font-semibold mb-2 text-gray-900">Farming & Packaging Details</Text>

              <View className="bg-gray-100 p-4 rounded-lg mb-4">
                <Text className="text-base font-medium mb-2 text-gray-900">Farming Type</Text>
                <View className="bg-white border border-gray-300 rounded-lg mb-4">
                  <Picker
                    selectedValue={farmingType}
                    onValueChange={setFarmingType}
                    className="h-12 w-full text-gray-900"
                  >
                    <Picker.Item label="Select Farming Type" value="" />
                    <Picker.Item label="Drop Down 1" value="drop down 1" />
                    <Picker.Item label="Regular" value="regular" />
                    <Picker.Item label="Organic" value="organic" />
                  </Picker>
                </View>

                <Text className="text-base font-medium mb-2 text-gray-900">Type of Seeds</Text>
                <TextInput
                  className="bg-white border border-gray-300 rounded-lg px-3 py-3 mb-4 text-base text-gray-900"
                  placeholder="e.g., Naati, Hybrid"
                  value={typeOfSeeds}
                  onChangeText={setTypeOfSeeds}
                />

                <Text className="text-base font-medium mb-2 text-gray-900">Packaging Type</Text>
                <View className="bg-white border border-gray-300 rounded-lg mb-4">
                  <Picker
                    selectedValue={packagingType}
                    onValueChange={setPackagingType}
                    className="h-12 w-full text-gray-900"
                  >
                    <Picker.Item label="Select Package Type" value="" />
                    <Picker.Item label="KGs" value="KGs" />
                    <Picker.Item label="Box" value="box" />
                    <Picker.Item label="Crate" value="crate" />
                    <Picker.Item label="Bunches" value="bunches" />
                    <Picker.Item label="Bag" value="bag" />
                    <Picker.Item label="Sack" value="sack" />
                    <Picker.Item label="Quanttal" value="quanttal" />
                    <Picker.Item label="Ton" value="ton" />
                  </Picker>
                </View>

                {packagingType === "KGs" && (
                  <>
                    <Text className="text-base font-medium mb-2 text-gray-900">Number of KGs</Text>
                    <View className="bg-white border border-gray-300 rounded-lg mb-4">
                      <Picker
                        selectedValue={packageMeasurement}
                        onValueChange={setPackageMeasurement}
                        className="h-12 w-full text-gray-900"
                      >
                        <Picker.Item label="Select KG" value="" />
                        <Picker.Item label="1 KG" value="1" />
                        <Picker.Item label="2 KG" value="2" />
                        <Picker.Item label="3 KG" value="3" />
                        <Picker.Item label="4 KG" value="4" />
                        <Picker.Item label="5 KG" value="5" />
                      </Picker>
                    </View>
                  </>
                )}

                {(packagingType === "box" || packagingType === "crate") && (
                  <>
                    <Text className="text-base font-medium mb-2 text-gray-900">Measurement</Text>
                    <View className="bg-white border border-gray-300 rounded-lg mb-4">
                      <Picker
                        selectedValue={packageMeasurement}
                        onValueChange={setPackageMeasurement}
                        className="h-12 w-full text-gray-900"
                      >
                        <Picker.Item label="Select Measurement" value="" />
                        <Picker.Item label="10kg Box" value="10kg" />
                        <Picker.Item label="12kg Box" value="12kg" />
                        <Picker.Item label="15kg Box" value="15kg" />
                        <Picker.Item label="18kg Box" value="18kg" />
                        <Picker.Item label="20kg Box" value="20kg" />
                        <Picker.Item label="25kg Box" value="25kg" />
                      </Picker>
                    </View>
                  </>
                )}

                {packagingType === "bag" && (
                  <>
                    <Text className="text-base font-medium mb-2 text-gray-900">Bag Measurement</Text>
                    <View className="bg-white border border-gray-300 rounded-lg mb-4">
                      <Picker
                        selectedValue={packageMeasurement}
                        onValueChange={setPackageMeasurement}
                        className="h-12 w-full text-gray-900"
                      >
                        <Picker.Item label="Select Bag Size" value="" />
                        <Picker.Item label="10kg Bag" value="10kg" />
                        <Picker.Item label="15kg Bag" value="15kg" />
                        <Picker.Item label="20kg Bag" value="20kg" />
                        <Picker.Item label="25kg Bag" value="25kg" />
                      </Picker>
                    </View>
                  </>
                )}

                {packagingType === "bunches" && (
                  <>
                    <Text className="text-base font-medium mb-2 text-gray-900">Bunch Size</Text>
                    <View className="bg-white border border-gray-300 rounded-lg mb-4">
                      <Picker
                        selectedValue={packageMeasurement}
                        onValueChange={setPackageMeasurement}
                        className="h-12 w-full text-gray-900"
                      >
                        <Picker.Item label="Select Size" value="" />
                        <Picker.Item label="Small" value="small" />
                        <Picker.Item label="Medium" value="medium" />
                        <Picker.Item label="Large" value="large" />
                      </Picker>
                    </View>
                  </>
                )}

                <Text className="text-base font-medium mb-2 text-gray-900">Unit Measurement (as per package type)</Text>
                <TextInput
                  className="bg-white border border-gray-300 rounded-lg px-3 py-3 mb-4 text-base text-gray-900"
                  placeholder="e.g., kg per box, bag, etc."
                  value={unitMeasurement}
                  onChangeText={setUnitMeasurement}
                />
              </View>

              <View className="flex-row gap-4 mt-6">
                <TouchableOpacity
                  className="flex-1 py-3 rounded-lg bg-gray-500"
                  onPress={prevStep}
                >
                  <Text className="text-white text-center font-medium">← Previous</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 py-3 rounded-lg bg-green-600"
                  onPress={nextStep}
                >
                  <Text className="text-white text-center font-medium">Next Step →</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Step 3: Pricing & Details */}
          {step === 3 && (
            <View>
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-semibold text-gray-900">Add Pricing & Details</Text>
                <TouchableOpacity
                  onPress={handleAddGrade}
                  className="bg-blue-500 px-4 py-2 rounded-lg"
                >
                  <Text className="text-white font-medium text-lg">+ Add Grade</Text>
                </TouchableOpacity>
              </View>

              <View className="bg-gray-100 p-4 rounded-lg mb-4">
                {gradePrices.map((gp, index) => (
                  <View
                    key={index}
                    className={`
                      bg-white border rounded-lg p-4 mb-3
                      ${selectedGrades.includes(gp.grade) 
                        ? "border-green-600 bg-green-50" 
                        : "border-gray-300"
                      }
                    `}
                  >
                    <TouchableOpacity
                      className="flex-row items-center mb-3"
                      onPress={() => handleGradeToggle(gp.grade)}
                    >
                      <View
                        className={`
                          w-6 h-6 border-2 rounded mr-3 items-center justify-center
                          ${selectedGrades.includes(gp.grade) 
                            ? "bg-green-600 border-green-600" 
                            : "border-gray-400"
                          }
                        `}
                      >
                        {selectedGrades.includes(gp.grade) && (
                          <Text className="text-white font-semibold">✓</Text>
                        )}
                      </View>
                      <Text className="text-base font-medium text-gray-900">{gp.grade}</Text>
                    </TouchableOpacity>

                    {selectedGrades.includes(gp.grade) && (
                      <View>
                        <Text className="text-sm font-medium mb-2 text-gray-700 mt-3">Quantity Type</Text>
                        <View className="bg-white border border-gray-300 rounded-lg mb-3">
                          <Picker
                            selectedValue={gp.quantityType}
                            onValueChange={(value) =>
                              handleGradePriceChange(index, "quantityType", value)
                            }
                            className="h-12 w-full text-gray-900"
                          >
                            <Picker.Item label="Select Type" value="" />
                            <Picker.Item label="Bulk" value="bulk" />
                            <Picker.Item label="Split" value="split" />
                          </Picker>
                        </View>

                        <Text className="text-sm font-medium mb-2 text-gray-700">Price Type</Text>
                        <View className="bg-white border border-gray-300 rounded-lg mb-3">
                          <Picker
                            selectedValue={gp.priceType}
                            onValueChange={(value) =>
                              handleGradePriceChange(index, "priceType", value)
                            }
                            className="h-12 w-full text-gray-900"
                          >
                            <Picker.Item label="Select Type" value="" />
                            <Picker.Item label="Fixed" value="fixed" />
                            <Picker.Item label="Negotiable" value="negotiable" />
                          </Picker>
                        </View>

                        <View className="flex-row gap-3 mt-3">
                          <View className="flex-1">
                            <Text className="text-sm font-medium mb-2 text-gray-700">Price / unit (₹)</Text>
                            <TextInput
                              className="bg-white border border-gray-300 rounded-lg px-3 py-3 text-base text-gray-900"
                              placeholder="₹"
                              value={gp.pricePerUnit}
                              onChangeText={(value) =>
                                handleGradePriceChange(index, "pricePerUnit", value)
                              }
                              keyboardType="numeric"
                            />
                          </View>
                          <View className="flex-1">
                            <Text className="text-sm font-medium mb-2 text-gray-700">Total Qty</Text>
                            <TextInput
                              className="bg-white border border-gray-300 rounded-lg px-3 py-3 text-base text-gray-900"
                              placeholder="Qty"
                              value={gp.totalQty}
                              onChangeText={(value) =>
                                handleGradePriceChange(index, "totalQty", value)
                              }
                              keyboardType="numeric"
                            />
                          </View>
                        </View>
                      </View>
                    )}
                  </View>
                ))}
              </View>

              <View className="flex-row gap-4 mt-6">
                <TouchableOpacity
                  className="flex-1 py-3 rounded-lg bg-gray-500"
                  onPress={prevStep}
                >
                  <Text className="text-white text-center font-medium">← Previous</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 py-3 rounded-lg bg-green-600"
                  onPress={nextStep}
                >
                  <Text className="text-white text-center font-medium">Next Step →</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Step 4: Final Details */}
          {step === 4 && (
            <View>
              <Text className="text-lg font-semibold mb-2 text-gray-900">Final Details</Text>

              <View className="bg-gray-100 p-4 rounded-lg mb-4">
                <Text className="text-base font-medium mb-2 text-gray-900">Farm Location</Text>
                <TouchableOpacity 
                  className="bg-orange-500 py-3 rounded-lg mb-3" 
                  onPress={getCurrentLocation} 
                  disabled={isGettingLocation}
                >
                  {isGettingLocation ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="text-white text-center font-medium">📍 Get Current Location</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-purple-600 py-3 rounded-lg mb-4"
                  onPress={openLocationPicker}
                >
                  <Text className="text-white text-center font-medium">✏️ Enter Location Manually</Text>
                </TouchableOpacity>

                <View className="bg-white border border-gray-300 rounded-lg p-3 mb-4">
                  <Text className="text-sm text-gray-700">
                    Lat: {farmLocation.latitude.toFixed(6)}
                  </Text>
                  <Text className="text-sm text-gray-700">
                    Lon: {farmLocation.longitude.toFixed(6)}
                  </Text>
                </View>

                <View className="mt-4">
                  <Text className="text-base font-medium mb-2 text-gray-900">Delivery Date</Text>
                  <TouchableOpacity 
                    className="bg-white border border-gray-300 rounded-lg p-3 mb-3" 
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Text className="text-base text-gray-900">📅 {formatDate(deliveryDate)}</Text>
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker 
                      value={deliveryDate} 
                      mode="date" 
                      display="default" 
                      onChange={onDateChange} 
                      minimumDate={new Date()} 
                    />
                  )}
                  
                  <Text className="text-base font-medium mb-2 text-gray-900">Delivery Time</Text>
                  <TouchableOpacity 
                    className="bg-white border border-gray-300 rounded-lg p-3 mb-3" 
                    onPress={() => setShowTimePicker(true)}
                  >
                    <Text className="text-base text-gray-900">🕐 {formatTime(deliveryTime)}</Text>
                  </TouchableOpacity>
                  {showTimePicker && (
                    <DateTimePicker 
                      value={deliveryTime} 
                      mode="time" 
                      display="default" 
                      onChange={onTimeChange} 
                    />
                  )}
                </View>

                <View className="mt-4">
                  <Text className="text-base font-medium mb-2 text-gray-900">Upload Crop Photos</Text>
                  <Text className="text-sm text-gray-500 mb-3">Maximum 3 photos (compressed automatically)</Text>
                  <TouchableOpacity
                    className="bg-blue-500 py-3 rounded-lg mb-4"
                    onPress={openCamera}
                    disabled={cropPhotos.length >= 3}
                  >
                    <Text className="text-white text-center font-medium">
                      📷 Open Camera {cropPhotos.length >= 3 ? "(Limit Reached)" : `(${cropPhotos.length}/3)`}
                    </Text>
                  </TouchableOpacity>

                  {cropPhotos.length > 0 && (
                    <View className="flex-row flex-wrap -mx-1">
                      {cropPhotos.map((photo, index) => (
                        <View key={index} className="w-1/3 p-1 relative">
                          <Image
                            source={{ uri: photo.watermarkedUri || photo.uri }}
                            className="w-full aspect-square rounded-lg"
                          />
                          <TouchableOpacity
                            className="absolute top-2 right-2 bg-red-500 w-6 h-6 rounded-full items-center justify-center"
                            onPress={() => removePhoto(index)}
                          >
                            <Text className="text-white font-semibold">✕</Text>
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  )}
                </View>

                <View className="mt-4">
                  <Text className="text-base font-medium mb-2 text-gray-900">Nearest Market</Text>
                  <TextInput
                    className="bg-white border border-gray-300 rounded-lg px-3 py-3 text-base text-gray-900"
                    placeholder="Enter nearest market"
                    value={nearestMarket}
                    onChangeText={setNearestMarket}
                  />
                </View>
              </View>

              <View className="flex-row gap-4 mt-6">
                <TouchableOpacity
                  className="flex-1 py-3 rounded-lg bg-gray-500"
                  onPress={prevStep}
                >
                  <Text className="text-white text-center font-medium">← Previous</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 py-3 rounded-lg bg-green-600"
                  onPress={handleSubmit}
                >
                  <Text className="text-white text-center font-medium">Submit Post</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default SellProductForm;