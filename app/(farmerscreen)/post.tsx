// import { useRouter } from "expo-router";
// import { ArrowRight } from "lucide-react-native";
// import React from "react";
// import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";

// const PostCropScreen: React.FC = () => {
//   const router = useRouter();

//   const handleSell = () => {
//     router.push("/(farmerscreen)/productsales");
//   };

//   const handleAddCrop = () => {
//     router.push("/(farmerscreen)/AddNewCrop");
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-white">
//       {/* Header */}
//       <View className="bg-white border-b border-gray-200 px-5 pt-5 pb-5 mt-6">
//         <Text className="text-xl font-medium text-gray-900">
//           Post Crop
//         </Text>
//       </View>

//       <View className="px-5 flex-1 justify-center items-center gap-10">
//         {/* Title */}
//         <View className="items-center">
//           <Text className="text-2xl text-[#0F5132] font-heading">
//             Welcome, Farmer!
//           </Text>
//           <Text className="text-sm text-gray-500 mt-2 font-subheading">
//             What would you like to do today?
//           </Text>
//         </View>

//         {/* Buttons */}
//         <View className="w-full flex-col gap-3">
//           {/* SELL */}
//           <TouchableOpacity
//             activeOpacity={0.85}
//             onPress={handleSell}
//             className="h-14 rounded-lg bg-yellow-400 items-center justify-center shadow-lg"
//           >
//             <View className="w-full px-4 flex-row items-center justify-center">
//               <Text className="text-base text-[#0F1724] font-medium">
//                 SELL YOUR PRODUCE
//               </Text>
//               <View className="absolute right-4">
//                 <ArrowRight size={18} color="#0F1724" />
//               </View>
//             </View>
//           </TouchableOpacity>

//           {/* ADD NEW CROP */}
//           <TouchableOpacity
//             activeOpacity={0.85}
//             onPress={handleAddCrop}
//             className="h-14 rounded-lg bg-green-600 items-center justify-center shadow-lg"
//           >
//             <View className="w-full px-4 flex-row items-center justify-center">
//               <Text className="text-base text-white font-medium">
//                 CROP
//               </Text>
//               <View className="absolute right-4">
//                 <ArrowRight size={18} color="#fff" />
//               </View>
//             </View>
//           </TouchableOpacity>
          
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default PostCropScreen;





import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router } from "expo-router";
import { Calendar, ChevronLeft, Plus } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// API Base URL configuration
const API_BASE_URL = 'https://kisan.etpl.ai';

// Interfaces (same as before)
interface Crop {
  _id: string;
  farmingType: string;
  seedType: string;
  acres: number;
  sowingDate: string;
  farmerId: string;
}

interface Category {
  _id: string;
  categoryId: string;
  categoryName: string;
  image: string;
}

interface SubCategory {
  _id: string;
  subCategoryId: string;
  subCategoryName: string;
  categoryId: string;
  image: string;
}

interface AddNewCropProps {
  onBack: () => void;
  onCropCreated: (crop: Crop) => void;
}

const AddNewCrop: React.FC<AddNewCropProps> = ({ onBack, onCropCreated }) => {
  const [step, setStep] = useState(0); // Changed from 1 to 0 for initial screen
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Category & Subcategory states
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [selectedCategoryObj, setSelectedCategoryObj] = useState<Category | null>(null);
  const [selectedSubCategoryObj, setSelectedSubCategoryObj] = useState<SubCategory | null>(null);

  // Crop form states
  const [farmingType, setFarmingType] = useState('');
  const [seedType, setSeedType] = useState('');
  const [acres, setAcres] = useState('');
  const [sowingDate, setSowingDate] = useState('');

  useEffect(() => {
    if (step === 1) {
      fetchCategories();
    }
  }, [step]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/category/all`);
      setCategories(res.data.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      showMessage('Failed to load categories', 'error');
    }
  };

  const fetchSubCategories = async (categoryId: string) => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/subcategory/category/${categoryId}`
      );
      setSubCategories(res.data.data);
    } catch (err) {
      console.error('Error fetching subcategories:', err);
      showMessage('Failed to load subcategories', 'error');
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const catObj = categories.find(c => c._id === categoryId) || null;
    setSelectedCategoryObj(catObj);
    setSelectedSubCategory('');
    setSelectedSubCategoryObj(null);
    fetchSubCategories(categoryId);
    setStep(2);
  };

  const handleSubCategorySelect = (subCategoryId: string) => {
    setSelectedSubCategory(subCategoryId);
    const subCatObj = subCategories.find(s => s._id === subCategoryId) || null;
    setSelectedSubCategoryObj(subCatObj);
  };

  const handleProceedToCropDetails = () => {
    setStep(3);
  };

  const showMessage = (message: string, type: 'success' | 'error') => {
    if (type === 'success') {
      setSuccess(message);
      setError(null);
      Alert.alert('Success', message);
    } else {
      setError(message);
      setSuccess(null);
      Alert.alert('Error', message);
    }
    setTimeout(() => {
      setSuccess(null);
      setError(null);
    }, 5000);
  };

  const resetForm = () => {
    setFarmingType('');
    setSeedType('');
    setAcres('');
    setSowingDate('');
  };

  const handleSubmit = async () => {
    if (!farmingType || !seedType || !acres || !sowingDate) {
      showMessage('Please fill all fields', 'error');
      return;
    }

    if (!selectedCategoryObj || !selectedSubCategoryObj) {
      showMessage('Category information missing', 'error');
      return;
    }

    const farmerId = await AsyncStorage.getItem('farmerId');
    if (!farmerId) {
      showMessage('Please login as a farmer first!', 'error');
      return;
    }

    const cropData = {
      farmingType,
      seedType,
      acres: parseFloat(acres),
      sowingDate: new Date(sowingDate).toISOString(),
      farmerId,
      category: selectedCategoryObj._id,
      subcategory: selectedSubCategoryObj._id,
      categoryName: selectedCategoryObj.categoryName,
      subcategoryName: selectedSubCategoryObj.subCategoryName,
    };

    console.log('Submitting crop data:', cropData);

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/crop/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cropData),
      });

      const data = await response.json();

      if (data.success) {
        showMessage('Crop added successfully!', 'success');
        const createdCrop = data.data;
        resetForm();

        setTimeout(() => {
          onCropCreated(createdCrop);
        }, 1000);
      } else {
        showMessage(data.message || 'Failed to add crop', 'error');
      }
    } catch (error: any) {
      console.error('Error adding crop:', error);
      showMessage(error.message || 'Error adding crop', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return 'https://via.placeholder.com/100';
    return `${API_BASE_URL}/uploads/${imagePath.replace(/^uploads[\/\\]/, '')}`;
  };

  const handleBackPress = () => {
    if (step === 0) {
      onBack();
    } else if (step === 1) {
      setStep(0);
    } else if (step === 2) {
      setStep(1);
    } else {
      setStep(2);
    }
  };

  const getHeaderTitle = () => {
    switch (step) {
      case 0:
        return 'Add New Crop';
      case 1:
        return 'Step 1: Select Category';
      case 2:
        return 'Step 2: Select Product';
      case 3:
        return 'Step 3: Add Crop Details';
      default:
        return 'Add New Crop';
    }
  };

  const getHeaderSubtitle = () => {
    switch (step) {
      case 0:
        return 'Start by adding a new crop to your farm';
      case 1:
        return 'Choose a farming category';
      case 2:
        return 'Choose a product type';
      case 3:
        return 'Enter crop details';
      default:
        return '';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
   
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* STEP 0: Initial Screen with Add New Crop Button */}
        {step === 0 && (
          <View style={styles.initialContainer}>
            <View style={styles.welcomeCard}>

              <TouchableOpacity
                onPress={() => setStep(1)}
                style={styles.startButton}
                className='mb-4'
              >
                <Plus size={20} color="#FFFFFF" />
                <Text style={styles.startButtonText}>Add New Crop</Text>
              </TouchableOpacity>

               <TouchableOpacity
                 onPress={() => router.push("/(farmerscreen)/AddNewCrop")}
                style={styles.startButton}
              >
                <Plus size={20} color="#FFFFFF" />
                <Text style={styles.startButtonText}>My crop</Text>
              </TouchableOpacity>

            </View>
          </View>
        )}

        {/* STEP 1: Category Selection */}
        {step === 1 && (
          <View style={styles.categoriesContainer}>
            <View style={styles.grid}>
              {categories.map((c) => (
                <TouchableOpacity
                  key={c._id}
                  onPress={() => handleCategorySelect(c._id)}
                  style={styles.categoryCard}
                >
                  <Image
                    source={{ uri: getImageUrl(c.image) }}
                    style={styles.categoryImage}
                    resizeMode="cover"
                  />
                  <Text style={styles.categoryName}>{c.categoryName}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* STEP 2: Sub-Category Selection */}
        {step === 2 && (
          <View style={styles.subCategoriesContainer}>
            <View style={styles.selectedCategoryBanner}>
              <Text style={styles.selectedCategoryText}>
                Selected Category:{' '}
                <Text style={styles.selectedCategoryName}>
                  {selectedCategoryObj?.categoryName}
                </Text>
              </Text>
            </View>

            <View style={styles.grid}>
              {subCategories.map((s) => (
                <TouchableOpacity
                  key={s._id}
                  onPress={() => handleSubCategorySelect(s._id)}
                  style={[
                    styles.subCategoryCard,
                    selectedSubCategory === s._id && styles.selectedSubCategoryCard,
                  ]}
                >
                  <Image
                    source={{ uri: getImageUrl(s.image) }}
                    style={styles.subCategoryImage}
                    resizeMode="cover"
                  />
                  <Text style={styles.subCategoryName}>{s.subCategoryName}</Text>
                  {selectedSubCategory === s._id && (
                    <Text style={styles.selectedText}>✓ Selected</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              disabled={!selectedSubCategory}
              onPress={handleProceedToCropDetails}
              style={[
                styles.proceedButton,
                !selectedSubCategory && styles.disabledButton,
              ]}
            >
              <Text style={[
                styles.proceedButtonText,
                !selectedSubCategory && styles.disabledButtonText,
              ]}>
                Proceed to Add Details
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 3: Crop Details Form */}
        {step === 3 && (
          <View style={styles.formContainer}>
            {/* Selected Category and Subcategory Display */}
            <View style={styles.selectionSummary}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Selected Category</Text>
                <View style={styles.selectedItem}>
                  <Text style={styles.selectedItemText}>
                    {selectedCategoryObj?.categoryName}
                  </Text>
                  <View style={styles.selectedBadge}>
                    <Text style={styles.selectedBadgeText}>Selected</Text>
                  </View>
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Selected Product</Text>
                <View style={styles.selectedItem}>
                  <Text style={styles.selectedItemText}>
                    {selectedSubCategoryObj?.subCategoryName}
                  </Text>
                  <View style={styles.selectedBadge}>
                    <Text style={styles.selectedBadgeText}>Selected</Text>
                  </View>
                </View>
              </View>

              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Selected Product Summary</Text>
                <View style={styles.summaryContent}>
                  <View style={styles.summaryIcon}>
                    <Text>🌿</Text>
                  </View>
                  <View style={styles.summaryTextContainer}>
                    <Text style={styles.summaryText}>
                      <Text style={styles.highlightText}>
                        {selectedCategoryObj?.categoryName}
                      </Text>
                      {' › '}
                      <Text style={styles.highlightText}>
                        {selectedSubCategoryObj?.subCategoryName}
                      </Text>
                    </Text>
                    <Text style={styles.summaryNote}>
                      These fields are pre-selected from your previous choices
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Form Fields */}
            <View style={styles.formFields}>
              {/* Farming Type */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Type of Farming</Text>
                <View style={styles.buttonGroup}>
                  {[
                    { value: 'regular', label: 'Regular' },
                    { value: 'organic', label: 'Organic' },
                    { value: 'natural', label: 'Natural' },
                    { value: 'hydroponic', label: 'Hydroponic' },
                  ].map((type) => (
                    <TouchableOpacity
                      key={type.value}
                      onPress={() => setFarmingType(type.value)}
                      style={[
                        styles.typeButton,
                        farmingType === type.value && styles.selectedTypeButton,
                      ]}
                    >
                      <Text style={[
                        styles.typeButtonText,
                        farmingType === type.value && styles.selectedTypeButtonText,
                      ]}>
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Seed Type */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Type of Seeds</Text>
                <View style={styles.buttonGroup}>
                  {[
                    { value: 'naati', label: 'Naati' },
                    { value: 'hybrid', label: 'Hybrid' },
                    { value: 'gmo', label: 'GMO' },
                    { value: 'heirloom', label: 'Heirloom' },
                  ].map((seed) => (
                    <TouchableOpacity
                      key={seed.value}
                      onPress={() => setSeedType(seed.value)}
                      style={[
                        styles.typeButton,
                        seedType === seed.value && styles.selectedTypeButton,
                      ]}
                    >
                      <Text style={[
                        styles.typeButtonText,
                        seedType === seed.value && styles.selectedTypeButtonText,
                      ]}>
                        {seed.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Number of Acres */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Number of Acres</Text>
                <TextInput
                  style={styles.input}
                  value={acres}
                  onChangeText={setAcres}
                  placeholder="Enter number of acres"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="decimal-pad"
                />
              </View>

              {/* Date of Sowing */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Date of Sowing</Text>
                <View style={styles.dateInputContainer}>
                  <TextInput
                    style={styles.input}
                    value={sowingDate}
                    onChangeText={setSowingDate}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor="#9CA3AF"
                  />
                  <TouchableOpacity
                    style={styles.calendarIcon}
                    onPress={() => {
                      // You can implement a date picker modal here
                      // For now, using text input with date format
                    }}
                  >
                    <Calendar size={20} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={
                loading ||
                !farmingType ||
                !seedType ||
                !acres ||
                !sowingDate ||
                !selectedCategoryObj ||
                !selectedSubCategoryObj
              }
              style={[
                styles.submitButton,
                (loading ||
                  !farmingType ||
                  !seedType ||
                  !acres ||
                  !sowingDate ||
                  !selectedCategoryObj ||
                  !selectedSubCategoryObj) && styles.disabledSubmitButton,
              ]}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitButtonText}>
                  Add Crop & Continue to Tracking
                </Text>
              )}
            </TouchableOpacity>

            {/* Back Button */}
            <TouchableOpacity
              onPress={() => setStep(2)}
              style={styles.backToSelectionButton}
            >
              <Text style={styles.backToSelectionText}>← Back to Product Selection</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerContent: {
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  // STEP 0: Initial Screen Styles
  initialContainer: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
  },
  welcomeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  iconEmoji: {
    fontSize: 40,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  welcomeDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  stepsPreview: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
  },
  stepsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepInfo: {
    flex: 1,
  },
  stepInfoTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  stepInfoDesc: {
    fontSize: 13,
    color: '#6B7280',
  },
  startButton: {
    flexDirection: 'row',
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  categoriesContainer: {
    padding: 16,
  },
  subCategoriesContainer: {
    padding: 16,
  },
  formContainer: {
    padding: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  categoryImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    textAlign: 'center',
  },
  selectedCategoryBanner: {
    backgroundColor: '#D1FAE5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  selectedCategoryText: {
    fontSize: 14,
    color: '#6B7280',
  },
  selectedCategoryName: {
    fontWeight: 'bold',
    color: '#059669',
  },
  subCategoryCard: {
    width: '48%',
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  selectedSubCategoryCard: {
    borderColor: '#10B981',
    backgroundColor: '#D1FAE5',
  },
  subCategoryImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 12,
  },
  subCategoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    textAlign: 'center',
  },
  selectedText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
    marginTop: 4,
  },
  proceedButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  disabledButton: {
    backgroundColor: '#D1D5DB',
  },
  proceedButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButtonText: {
    color: '#6B7280',
  },
  selectionSummary: {
    marginBottom: 32,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  selectedItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#F9FAFB',
  },
  selectedItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  selectedBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  selectedBadgeText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
  },
  summaryCard: {
    backgroundColor: '#D1FAE5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#065F46',
    marginBottom: 8,
  },
  summaryContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryIcon: {
    backgroundColor: '#A7F3D0',
    padding: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  summaryTextContainer: {
    flex: 1,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  highlightText: {
    color: '#065F46',
  },
  summaryNote: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  formFields: {
    marginBottom: 32,
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeButton: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  selectedTypeButton: {
    borderColor: '#10B981',
    backgroundColor: '#D1FAE5',
  },
  typeButtonText: {
    fontSize: 14,
    color: '#374151',
  },
  selectedTypeButtonText: {
    color: '#065F46',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#111827',
  },
  dateInputContainer: {
    position: 'relative',
  },
  calendarIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  submitButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  disabledSubmitButton: {
    backgroundColor: '#D1D5DB',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backToSelectionButton: {
    padding: 16,
    alignItems: 'center',
  },
  backToSelectionText: {
    fontSize: 16,
    color: '#6B7280',
  },
});

export default AddNewCrop;