import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Modal,
  Dimensions,
    Platform, 
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import axios from "axios";

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
}

interface CapturedPhoto {
  uri: string;
  watermarkedUri?: string;
}

const { width, height } = Dimensions.get("window");

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
    { grade: "A Grade", pricePerUnit: "", totalQty: "" },
    { grade: "B Grade", pricePerUnit: "", totalQty: "" },
    { grade: "All Mixed Grades", pricePerUnit: "", totalQty: "" },
  ]);
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
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      try {
        const location = await Location.getCurrentPositionAsync({});
        setFarmLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (error) {
        console.error("Error getting location:", error);
      }
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
  // Limit photos to maximum 3
  if (cropPhotos.length > 3) {
    Alert.alert("Too Many Photos", "Please limit to 3 photos maximum.");
    return;
  }

  // Validate required fields
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

  if (!nearestMarket) {
    Alert.alert("Missing Information", "Please enter nearest market");
    return;
  }

  const formData = new FormData();

  // Append all form data
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
  
  // Append farm location
  formData.append("farmLocation", JSON.stringify({
    lat: farmLocation.latitude.toString(),
    lng: farmLocation.longitude.toString()
  }));

  // Add selected grades with prices
  const selectedGradeData = gradePrices
    .filter((gp) => selectedGrades.includes(gp.grade))
    .map((gp) => ({
      grade: gp.grade,
      pricePerUnit: parseFloat(gp.pricePerUnit) || 0,
      totalQty: parseFloat(gp.totalQty) || 0
    }));
  formData.append("gradePrices", JSON.stringify(selectedGradeData));

  // Add photos with better formatting
  cropPhotos.forEach((photo, index) => {
    const photoUri = photo.watermarkedUri || photo.uri;
    
    // Make sure URI is properly formatted
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
    
    const response = await axios.post("https://kisan.etpl.ai/product/add", formData, {
      headers: { 
        "Content-Type": "multipart/form-data",
      },
      timeout: 30000, // 30 second timeout
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });
    
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
      Alert.alert("Timeout", "Upload timed out. Please try again with fewer/smaller photos.");
    } else if (error.code === 'ECONNREFUSED') {
      Alert.alert("Connection Error", "Cannot connect to server. Please check your internet connection.");
    } else {
      Alert.alert("Error", "Failed to submit: " + (error.message || "Unknown error"));
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
    { grade: "A Grade", pricePerUnit: "", totalQty: "" },
    { grade: "B Grade", pricePerUnit: "", totalQty: "" },
    { grade: "All Mixed Grades", pricePerUnit: "", totalQty: "" },
  ]);
};

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const renderProgressBar = () => {
    const progress = (step / 4) * 100;
    return (
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Image Preview with GPS Info Modal */}
  {/* Image Preview with GPS Info Modal */}
<Modal visible={!!capturedImage} animationType="slide" transparent={false}>
  <View style={styles.previewContainer}>
    <View style={{ flex: 1 }}>
      {capturedImage ? (
        <Image
          source={{ uri: capturedImage }}
          style={styles.previewImage}
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
        <View style={styles.watermarkBox}>
          <Text style={styles.watermark}>{gpsText}</Text>
        </View>
      ) : null}
    </View>
    <View style={styles.previewButtons}>
      <TouchableOpacity
        style={[styles.button, styles.cancelButton]}
        onPress={() => {
          setCapturedImage(null);
          setGpsText("");
        }}
      >
        <Text style={styles.buttonText}>Retake</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.primaryButton]}
        onPress={saveWithWatermark}
      >
        <Text style={styles.buttonText}>Save Photo</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

      {/* Map Picker Modal */}
      <Modal visible={showLocationPicker} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.locationPickerContainer}>
            <Text style={styles.modalTitle}>Enter Farm Location</Text>

            <Text style={styles.label}>Latitude</Text>
            <TextInput
              style={styles.input}
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

            <Text style={styles.label}>Longitude</Text>
            <TextInput
              style={styles.input}
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
              style={[styles.button, styles.primaryButton, { marginTop: 10 }]}
              onPress={getCurrentLocation}
              disabled={isGettingLocation}
            >
              {isGettingLocation ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>📍 Use Current Location</Text>
              )}
            </TouchableOpacity>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setShowLocationPicker(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={saveManualLocation}
              >
                <Text style={styles.buttonText}>Save Location</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerText}>SELL YOUR PRODUCE</Text>
        </View>

        {renderProgressBar()}

        {/* Step 1: Category Selection */}
        {step === 1 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Step 1: Select Category & Product</Text>

            <Text style={styles.label}>Select Category</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedCategory}
                onValueChange={handleCategoryChange}
              >
                <Picker.Item label="Select Category" value="" />
                {categories.map((c) => (
                  <Picker.Item key={c._id} label={c.categoryName} value={c._id} />
                ))}
              </Picker>
            </View>

            <Text style={styles.label}>Select Sub Category</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedSubCategory}
                onValueChange={setSelectedSubCategory}
                enabled={!!selectedCategory}
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

            <Text style={styles.label}>Crop Brief Details</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter brief description (farming type, seeds type, organic/regular)"
              value={cropBriefDetails}
              onChangeText={setCropBriefDetails}
              multiline
              numberOfLines={4}
            />

            <TouchableOpacity style={styles.primaryButton} onPress={nextStep}>
              <Text style={styles.buttonText}>Next Step</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Step 2: Farming & Packaging Details */}
        {step === 2 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>
              Step 2: Farming & Packaging Details
            </Text>

            <Text style={styles.label}>Farming Type</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={farmingType}
                onValueChange={setFarmingType}
              >
                <Picker.Item label="Select Farming Type" value="" />
                <Picker.Item label="Drop Down 1" value="drop down 1" />
                <Picker.Item label="Regular" value="regular" />
                <Picker.Item label="Organic" value="organic" />
              </Picker>
            </View>

            <Text style={styles.label}>Type of Seeds</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Naati, Hybrid"
              value={typeOfSeeds}
              onChangeText={setTypeOfSeeds}
            />

            <Text style={styles.label}>Packaging Type</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={packagingType}
                onValueChange={setPackagingType}
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
                <Text style={styles.label}>Number of KGs</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={packageMeasurement}
                    onValueChange={setPackageMeasurement}
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
                <Text style={styles.label}>Measurement</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={packageMeasurement}
                    onValueChange={setPackageMeasurement}
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
                <Text style={styles.label}>Bag Measurement</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={packageMeasurement}
                    onValueChange={setPackageMeasurement}
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
                <Text style={styles.label}>Bunch Size</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={packageMeasurement}
                    onValueChange={setPackageMeasurement}
                  >
                    <Picker.Item label="Select Size" value="" />
                    <Picker.Item label="Small" value="small" />
                    <Picker.Item label="Medium" value="medium" />
                    <Picker.Item label="Large" value="large" />
                  </Picker>
                </View>
              </>
            )}

            <Text style={styles.label}>
              Unit Measurement (as per package type)
            </Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., kg per box, bag, etc."
              value={unitMeasurement}
              onChangeText={setUnitMeasurement}
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={prevStep}
              >
                <Text style={styles.buttonText}>Previous</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={nextStep}
              >
                <Text style={styles.buttonText}>Next Step</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Step 3: Pricing & Details */}
        {step === 3 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Step 3: Add Pricing & Details</Text>

            <Text style={styles.label}>Select Grades & Add Pricing</Text>

            {gradePrices.map((gp, index) => (
              <View
                key={index}
                style={[
                  styles.gradeContainer,
                  selectedGrades.includes(gp.grade) && styles.gradeSelected,
                ]}
              >
                <TouchableOpacity
                  style={styles.checkboxContainer}
                  onPress={() => handleGradeToggle(gp.grade)}
                >
                  <View
                    style={[
                      styles.checkbox,
                      selectedGrades.includes(gp.grade) && styles.checkboxChecked,
                    ]}
                  >
                    {selectedGrades.includes(gp.grade) && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>
                  <Text style={styles.gradeLabel}>{gp.grade}</Text>
                </TouchableOpacity>

                {selectedGrades.includes(gp.grade) && (
                  <View style={styles.priceInputRow}>
                    <TextInput
                      style={[styles.input, styles.halfInput]}
                      placeholder="Price / unit (₹)"
                      value={gp.pricePerUnit}
                      onChangeText={(value) =>
                        handleGradePriceChange(index, "pricePerUnit", value)
                      }
                      keyboardType="numeric"
                    />
                    <TextInput
                      style={[styles.input, styles.halfInput]}
                      placeholder="Total Qty"
                      value={gp.totalQty}
                      onChangeText={(value) =>
                        handleGradePriceChange(index, "totalQty", value)
                      }
                      keyboardType="numeric"
                    />
                  </View>
                )}
              </View>
            ))}

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={prevStep}
              >
                <Text style={styles.buttonText}>Previous</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={nextStep}
              >
                <Text style={styles.buttonText}>Next Step</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Step 4: Final Details */}
        {step === 4 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Final Details</Text>

           <Text style={styles.label}>Delivery Date</Text>
            <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker(true)}>
              <Text style={styles.datePickerText}>📅 {formatDate(deliveryDate)}</Text>
            </TouchableOpacity>
            {showDatePicker && <DateTimePicker value={deliveryDate} mode="date" display="default" onChange={onDateChange} minimumDate={new Date()} />}
            <Text style={styles.label}>Delivery Time</Text>
            <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowTimePicker(true)}>
              <Text style={styles.datePickerText}>🕐 {formatTime(deliveryTime)}</Text>
            </TouchableOpacity>
            {showTimePicker && <DateTimePicker value={deliveryTime} mode="time" display="default" onChange={onTimeChange} />}

            <Text style={styles.label}>Nearest Market</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter nearest market"
              value={nearestMarket}
              onChangeText={setNearestMarket}
            />

            <Text style={styles.label}>Upload Crop Photos & Videos</Text>
            <Text style={styles.helperText}>Maximum 3 photos (compressed automatically)</Text>
            <TouchableOpacity
              style={styles.cameraButtonMain}
              onPress={openCamera}
              disabled={cropPhotos.length >= 3}
            >
              <Text style={styles.buttonText}>
                📷 Open Camera {cropPhotos.length >= 3 ? "(Limit Reached)" : `(${cropPhotos.length}/3)`}
              </Text>
            </TouchableOpacity>

            {cropPhotos.length > 0 && (
              <View style={styles.photoGrid}>
                {cropPhotos.map((photo, index) => (
                  <View key={index} style={styles.photoItem}>
                    <Image
                      source={{ uri: photo.watermarkedUri || photo.uri }}
                      style={styles.thumbnail}
                    />
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removePhoto(index)}
                    >
                      <Text style={styles.removeButtonText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            <Text style={styles.label}>Farm Location</Text>
            <TouchableOpacity style={styles.mapButton} onPress={getCurrentLocation} disabled={isGettingLocation}>
              {isGettingLocation ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>📍 Get Current Location</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.mapButton, { backgroundColor: "#9C27B0", marginTop: 10 }]}
              onPress={openLocationPicker}
            >
              <Text style={styles.buttonText}>✏️ Enter Location Manually</Text>
            </TouchableOpacity>

            <View style={styles.locationInfo}>
              <Text style={styles.locationText}>
                Lat: {farmLocation.latitude.toFixed(6)}
              </Text>
              <Text style={styles.locationText}>
                Lon: {farmLocation.longitude.toFixed(6)}
              </Text>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={prevStep}
              >
                <Text style={styles.buttonText}>Previous</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.submitButton]}
                onPress={handleSubmit}
              >
                <Text style={styles.buttonText}>Submit Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: "#f4c430",
    padding: 20,
    alignItems: "center",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    margin: 15,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#4caf50",
    borderRadius: 4,
  },
  stepContainer: {
    padding: 15,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  helperText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
    fontStyle: "italic",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 14,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  pickerContainer: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButton: {
    backgroundColor: "#4caf50",
  },
  secondaryButton: {
    backgroundColor: "#757575",
  },
  submitButton: {
    backgroundColor: "#4caf50",
  },
  cancelButton: {
    backgroundColor: "#f44336",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },
  gradeContainer: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  gradeSelected: {
    backgroundColor: "#e8f5e9",
    borderColor: "#4caf50",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 4,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#4caf50",
    borderColor: "#4caf50",
  },
  checkmark: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  gradeLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  priceInputRow: {
    flexDirection: "row",
    gap: 10,
  },
  halfInput: {
    flex: 1,
    marginBottom: 0,
  },
  cameraButtonMain: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 15,
  },
  photoItem: {
    position: "relative",
    width: (width - 50) / 3,
    height: (width - 50) / 3,
  },
  thumbnail: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  removeButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(244, 67, 54, 0.9)",
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  removeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  mapButton: {
    backgroundColor: "#FF9800",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  locationInfo: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  locationText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  cameraButtonContainer: {
    flexDirection: "row",
    gap: 10,
    padding: 15,
    backgroundColor: "#000",
  },
  cameraButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  captureButton: {
    backgroundColor: "#4caf50",
  },
  previewContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
  },
  previewImage: {
    flex: 1,
    width: "100%",
  },
  watermarkBox: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
  },
  watermark: {
    color: "white",
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 12,
    fontSize: 16,
    borderRadius: 8,
    fontWeight: "bold",
  },
  previewButtons: {
    flexDirection: "row",
    gap: 10,
    padding: 15,
    backgroundColor: "#000",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  locationPickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: width - 40,
    maxHeight: height * 0.7,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
 
  datePickerButton: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 15, marginBottom: 15 },
  datePickerText: { fontSize: 16, color: "#333" },
 
});

export default SellProductForm;