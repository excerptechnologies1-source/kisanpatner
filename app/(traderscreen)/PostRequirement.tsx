import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

interface Category {
  _id: string;
  categoryName: string;
}

interface SubCategory {
  _id: string;
  subCategoryName: string;
  categoryId: string;
}

interface Quality {
  grade: 'A' | 'B';
  pricePerPack: string;
  quantity: string;
}

const PostRequirement = ({ navigation }: any) => {
  // ===== DB-driven state =====
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');

  // ===== Form state =====
  const [farmingType, setFarmingType] = useState('');
  const [variety, setVariety] = useState('');
  const [packType, setPackType] = useState('');
  const [weightPerPack, setWeightPerPack] = useState('');
  const [requirementDate, setRequirementDate] = useState('');
  const [location, setLocation] = useState('');

  // ===== Date Picker =====
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // ===== Quality =====
  const [aGradeChecked, setAGradeChecked] = useState(false);
  const [bGradeChecked, setBGradeChecked] = useState(false);
  const [aPrice, setAPrice] = useState('');
  const [aQty, setAQty] = useState('');
  const [bPrice, setBPrice] = useState('');
  const [bQty, setBQty] = useState('');

  // ===== UI =====
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // ===== Constants =====
  const farmingTypes = ['Organic', 'Inorganic', 'Hydroponic', 'Polyhouse', 'Open Field'];
  const packTypes = ['Bag', 'Box', 'Crate', 'Loose', 'Basket'];

  // ===== Init =====
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('https://kisan.etpl.ai/category/all');
      if (res.data && res.data.data) {
        setCategories(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      Alert.alert('Error', 'Failed to fetch categories');
    }
  };

  const fetchSubCategories = async (categoryId: string) => {
    try {
      const res = await axios.get(`https://kisan.etpl.ai/subcategory/category/${categoryId}`);
      if (res.data && res.data.data) {
        setSubCategories(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      Alert.alert('Error', 'Failed to fetch subcategories');
    }
  };

  const handleCategorySelect = useCallback((categoryId: string) => {
    try {
      setSelectedCategory(categoryId);
      setSelectedSubCategory('');
      setSubCategory('');
      
      if (categoryId) {
        const cat = categories.find((c) => c._id === categoryId);
        if (cat && cat.categoryName) {
          setCategory(cat.categoryName);
          fetchSubCategories(categoryId);
        }
      } else {
        setCategory('');
        setSubCategories([]);
      }
    } catch (error) {
      console.error('Error in handleCategorySelect:', error);
    }
  }, [categories]);

  const handleSubCategorySelect = useCallback((subCategoryId: string) => {
    try {
      setSelectedSubCategory(subCategoryId);
      if (subCategoryId) {
        const sub = subCategories.find((s) => s._id === subCategoryId);
        if (sub && sub.subCategoryName) {
          setSubCategory(sub.subCategoryName);
        }
      } else {
        setSubCategory('');
      }
    } catch (error) {
      console.error('Error in handleSubCategorySelect:', error);
    }
  }, [subCategories]);

  // ===== Date Handler =====
  const onDateChange = useCallback((event: any, selectedDate?: Date) => {
    try {
      const currentDate = selectedDate || date;
      
      if (Platform.OS === 'android') {
        setShowDatePicker(false);
      }
      
      if (event.type === 'set' && selectedDate) {
        setDate(selectedDate);
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDate.getDate()).padStart(2, '0');
        setRequirementDate(`${year}-${month}-${day}`);
      } else if (event.type === 'dismissed') {
        // User cancelled
        setShowDatePicker(false);
      }
    } catch (error) {
      console.error('Error in onDateChange:', error);
      setShowDatePicker(false);
    }
  }, [date]);

  const showDatePickerModal = useCallback(() => {
    try {
      Keyboard.dismiss();
      setTimeout(() => {
        setShowDatePicker(true);
      }, 100);
    } catch (error) {
      console.error('Error showing date picker:', error);
    }
  }, []);

  // ===== Safe Text Input Handlers =====
  const handleTextChange = useCallback((text: string, setter: (value: string) => void) => {
    try {
      setter(text);
    } catch (error) {
      console.error('Error in handleTextChange:', error);
    }
  }, []);

  const handleNumericChange = useCallback((text: string, setter: (value: string) => void, allowDecimal: boolean = false) => {
    try {
      if (!text) {
        setter('');
        return;
      }
      
      // Simple validation without complex regex
      let isValid = true;
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char >= '0' && char <= '9') continue;
        if (allowDecimal && char === '.' && text.indexOf('.') === i) continue;
        isValid = false;
        break;
      }
      
      if (isValid) {
        setter(text);
      }
    } catch (error) {
      console.error('Error in handleNumericChange:', error);
    }
  }, []);

  // ===== Validation =====
  const validateForm = useCallback(() => {
    try {
      const errors: Record<string, string> = {};

      if (!category) errors.category = 'Select category';
      if (!subCategory) errors.subCategory = 'Select sub-category';
      if (!farmingType) errors.farmingType = 'Select farming type';
      if (!packType) errors.packType = 'Select pack type';

      const w = parseFloat(weightPerPack);
      if (!weightPerPack || isNaN(w) || w <= 0) errors.weightPerPack = 'Invalid weight';

      if (!aGradeChecked && !bGradeChecked) errors.quality = 'Select at least one grade';

      if (aGradeChecked) {
        const ap = parseFloat(aPrice);
        const aq = parseInt(aQty);
        if (!aPrice || isNaN(ap) || ap <= 0) errors.aPrice = 'Invalid A price';
        if (!aQty || isNaN(aq) || aq <= 0) errors.aQty = 'Invalid A qty';
      }

      if (bGradeChecked) {
        const bp = parseFloat(bPrice);
        const bq = parseInt(bQty);
        if (!bPrice || isNaN(bp) || bp <= 0) errors.bPrice = 'Invalid B price';
        if (!bQty || isNaN(bq) || bq <= 0) errors.bQty = 'Invalid B qty';
      }

      if (!requirementDate) errors.requirementDate = 'Select date';
      if (!location || !location.trim()) errors.location = 'Enter location';

      setFormErrors(errors);
      return Object.keys(errors).length === 0;
    } catch (error) {
      console.error('Error in validateForm:', error);
      return false;
    }
  }, [category, subCategory, farmingType, packType, weightPerPack, aGradeChecked, bGradeChecked, aPrice, aQty, bPrice, bQty, requirementDate, location]);

  // ===== Submit =====
  const handleSubmit = async () => {
    try {
      Keyboard.dismiss();
      
      if (!validateForm()) {
        Alert.alert('Validation Error', 'Please fill all required fields correctly');
        return;
      }

      setLoading(true);

      const traderId = await AsyncStorage.getItem('traderId');
      const finalTraderId = traderId || 'guest';

      const qualities: Quality[] = [];
      if (aGradeChecked) {
        qualities.push({ 
          grade: 'A', 
          pricePerPack: aPrice, 
          quantity: aQty 
        });
      }
      if (bGradeChecked) {
        qualities.push({ 
          grade: 'B', 
          pricePerPack: bPrice, 
          quantity: bQty 
        });
      }

      const payload = {
        postedBy: finalTraderId,
        userType: 'Trader',
        category,
        subCategory,
        farmingType,
        variety: variety.trim(),
        packType,
        weightPerPack: Number(weightPerPack),
        qualities,
        requirementDate,
        location: location.trim(),
      };

      const res = await axios.post(
        'https://site10.etpl.ai/api/requirements/post-requirement',
        payload,
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 15000,
        }
      );

      if (res.data && res.data.success) {
        Alert.alert('Success', 'Requirement posted successfully', [
          { 
            text: 'OK', 
            onPress: () => {
              if (navigation && navigation.goBack) {
                navigation.goBack();
              }
            }
          },
        ]);
      } else {
        Alert.alert('Error', res.data?.message || 'Submission failed');
      }
    } catch (err: any) {
      console.error('Submit error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Server error';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleAGrade = useCallback(() => {
    setAGradeChecked(prev => !prev);
  }, []);

  const toggleBGrade = useCallback(() => {
    setBGradeChecked(prev => !prev);
  }, []);

  return (
    <KeyboardAvoidingView 
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView 
        className="flex-1 bg-gray-50"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header */}
        <View className="flex-row items-center px-4 py-4 bg-white border-b border-gray-200">
          <Text className="ml-4 text-xl font-medium text-gray-800">Post Requirement</Text>
        </View>

        <View className="p-4">
          <Text className="mb-4 text-lg font-medium text-gray-800">Step 1: Select Category & Product</Text>

          {/* Category */}
          <View className="mb-4">
            <Text className="mb-2 text-sm font-medium text-gray-800">Select Category *</Text>
            <View className="overflow-hidden border border-gray-300 rounded-lg bg-white">
              <Picker
                selectedValue={selectedCategory}
                onValueChange={handleCategorySelect}
                className="h-12 font-medium"
              >
                <Picker.Item label="Select Category" value="" />
                {categories.map((c) => (
                  <Picker.Item key={c._id} label={c.categoryName} value={c._id} />
                ))}
              </Picker>
            </View>
            {formErrors.category && <Text className="mt-1 text-xs text-red-600 font-medium">{formErrors.category}</Text>}
          </View>

          {/* Sub Category */}
          <View className="mb-4">
            <Text className="mb-2 text-sm font-medium text-gray-800">Select Sub Category *</Text>
            <View className="overflow-hidden border border-gray-300 rounded-lg bg-white">
              <Picker
                selectedValue={selectedSubCategory}
                onValueChange={handleSubCategorySelect}
                enabled={!!selectedCategory}
                className="h-12 font-medium"
              >
                <Picker.Item label="Select Sub Category" value="" />
                {subCategories.map((s) => (
                  <Picker.Item key={s._id} label={s.subCategoryName} value={s._id} />
                ))}
              </Picker>
            </View>
            {formErrors.subCategory && <Text className="mt-1 text-xs text-red-600">{formErrors.subCategory}</Text>}
          </View>

          {/* Farming Type */}
          <View className="mb-4">
            <Text className="mb-2 text-sm font-medium text-gray-800">Farming Type *</Text>
            <View className="overflow-hidden border border-gray-300 rounded-lg bg-white">
              <Picker
                selectedValue={farmingType}
                onValueChange={setFarmingType}
                className="h-12 font-medium"
              >
                <Picker.Item label="Select" value="" />
                {farmingTypes.map((f) => (
                  <Picker.Item key={f} label={f} value={f} />
                ))}
              </Picker>
            </View>
            {formErrors.farmingType && <Text className="mt-1 text-xs text-red-600">{formErrors.farmingType}</Text>}
          </View>

          {/* Variety */}
          <View className="mb-4">
            <Text className="mb-2 text-sm font-medium text-gray-800">Variety</Text>
            <TextInput
              className="px-3 py-3 border border-gray-300 rounded-lg bg-white text-gray-800"
              value={variety}
              onChangeText={(text) => handleTextChange(text, setVariety)}
              placeholder="Enter variety"
              placeholderTextColor="#9CA3AF"
              returnKeyType="done"
              blurOnSubmit={true}
            />
          </View>

          {/* Pack Type */}
          <View className="mb-4">
            <Text className="mb-2 text-sm font-medium text-gray-800">Pack Type *</Text>
            <View className="overflow-hidden border border-gray-300 rounded-lg bg-white">
              <Picker
                selectedValue={packType}
                onValueChange={setPackType}
                className="h-12 font-medium"
              >
                <Picker.Item label="Select" value="" />
                {packTypes.map((p) => (
                  <Picker.Item key={p} label={p} value={p} />
                ))}
              </Picker>
            </View>
            {formErrors.packType && <Text className="mt-1 text-xs text-red-600">{formErrors.packType}</Text>}
          </View>

          {/* Weight per Pack */}
          <View className="mb-4">
            <Text className="mb-2 text-sm font-medium text-gray-800">Weight per Pack (kg) *</Text>
            <TextInput
              className="px-3 py-3 border border-gray-300 rounded-lg bg-white text-gray-800"
              value={weightPerPack}
              onChangeText={(text) => handleNumericChange(text, setWeightPerPack, true)}
              placeholder="Enter weight"
              placeholderTextColor="#9CA3AF"
              keyboardType="decimal-pad"
              returnKeyType="done"
              blurOnSubmit={true}
            />
            {formErrors.weightPerPack && <Text className="mt-1 text-xs text-red-600">{formErrors.weightPerPack}</Text>}
          </View>

          {/* Quality Section */}
          <View className="mb-4">
            <Text className="mb-2 text-sm font-medium text-gray-800">Quality *</Text>
            {formErrors.quality && <Text className="mt-1 text-xs text-red-600">{formErrors.quality}</Text>}

            {/* A Grade */}
            <View className="flex-row items-center mb-3">
              <TouchableOpacity
                className="w-6 h-6 border-2 border-green-700 rounded justify-center items-center mr-2 font-medium"
                onPress={toggleAGrade}
                activeOpacity={0.7}
              >
                <View className={`w-3.5 h-3.5 rounded-sm ${aGradeChecked ? 'bg-green-700' : 'bg-transparent'}`} />
              </TouchableOpacity>
              <Text className="w-16 text-sm font-medium text-gray-800 mr-2">A Grade</Text>
              <TextInput
                className={`flex-1 px-2 py-2 border border-gray-300 rounded mx-1 min-h-10 ${!aGradeChecked ? 'bg-gray-100 text-gray-500' : 'bg-white text-gray-800'}`}
                value={aPrice}
                onChangeText={(text) => handleNumericChange(text, setAPrice, true)}
                placeholder="Price"
                placeholderTextColor="#9CA3AF"
                keyboardType="decimal-pad"
                editable={aGradeChecked}
                returnKeyType="done"
                blurOnSubmit={true}
              />
              <TextInput
                className={`flex-1 px-2 py-2 border border-gray-300 rounded mx-1 min-h-10 ${!aGradeChecked ? 'bg-gray-100 text-gray-500' : 'bg-white text-gray-800'}`}
                value={aQty}
                onChangeText={(text) => handleNumericChange(text, setAQty, false)}
                placeholder="Qty"
                placeholderTextColor="#9CA3AF"
                keyboardType="number-pad"
                editable={aGradeChecked}
                returnKeyType="done"
                blurOnSubmit={true}
              />
            </View>
            {formErrors.aPrice && <Text className="mt-1 text-xs text-red-600">{formErrors.aPrice}</Text>}
            {formErrors.aQty && <Text className="mt-1 text-xs text-red-600">{formErrors.aQty}</Text>}

            {/* B Grade */}
            <View className="flex-row items-center mb-3 font-medium">
              <TouchableOpacity
                className="w-6 h-6 border-2 border-green-700 rounded justify-center items-center mr-2"
                onPress={toggleBGrade}
                activeOpacity={0.7}
              >
                <View className={`w-3.5 h-3.5 rounded-sm ${bGradeChecked ? 'bg-green-700' : 'bg-transparent'}`} />
              </TouchableOpacity>
              <Text className="w-16 text-sm font-medium text-gray-800 mr-2">B Grade</Text>
              <TextInput
                className={`flex-1 px-2 py-2 border border-gray-300 rounded mx-1 min-h-10 ${!bGradeChecked ? 'bg-gray-100 text-gray-500' : 'bg-white text-gray-800'}`}
                value={bPrice}
                onChangeText={(text) => handleNumericChange(text, setBPrice, true)}
                placeholder="Price"
                placeholderTextColor="#9CA3AF"
                keyboardType="decimal-pad"
                editable={bGradeChecked}
                returnKeyType="done"
                blurOnSubmit={true}
              />
              <TextInput
                className={`flex-1 px-2 py-2 border border-gray-300 rounded mx-1 min-h-10 ${!bGradeChecked ? 'bg-gray-100 text-gray-500' : 'bg-white text-gray-800'}`}
                value={bQty}
                onChangeText={(text) => handleNumericChange(text, setBQty, false)}
                placeholder="Qty"
                placeholderTextColor="#9CA3AF"
                keyboardType="number-pad"
                editable={bGradeChecked}
                returnKeyType="done"
                blurOnSubmit={true}
              />
            </View>
            {formErrors.bPrice && <Text className="mt-1 text-xs text-red-600">{formErrors.bPrice}</Text>}
            {formErrors.bQty && <Text className="mt-1 text-xs text-red-600">{formErrors.bQty}</Text>}
          </View>

          {/* Requirement Date */}
          <View className="mb-4">
            <Text className="mb-2 text-sm font-medium text-gray-800">Requirement Date *</Text>
            <TouchableOpacity
              className="px-3 py-3 border border-gray-300 rounded-lg bg-white"
              onPress={showDatePickerModal}
              activeOpacity={0.7}
            >
              <Text className={`text-gray-800 ${!requirementDate ? 'text-gray-500' : ''}`}>
                {requirementDate || 'Select Date'}
              </Text>
            </TouchableOpacity>
            {formErrors.requirementDate && <Text className="mt-1 text-xs text-red-600">{formErrors.requirementDate}</Text>}
            
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onDateChange}
                minimumDate={new Date()}
              />
            )}
          </View>

          {/* Location */}
          <View className="mb-4">
            <Text className="mb-2 text-sm font-medium text-gray-800">Location *</Text>
            <TextInput
              className="px-3 py-3 border border-gray-300 rounded-lg bg-white text-gray-800"
              value={location}
              onChangeText={(text) => handleTextChange(text, setLocation)}
              placeholder="Enter location"
              placeholderTextColor="#9CA3AF"
              returnKeyType="done"
              blurOnSubmit={true}
            />
            {formErrors.location && <Text className="mt-1 text-xs text-red-600">{formErrors.location}</Text>}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            className={`py-4 rounded-lg items-center mt-4 mb-5 ${loading ? 'bg-green-300' : 'bg-green-700'}`}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.7}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-base font-medium">Submit Requirement</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default PostRequirement;