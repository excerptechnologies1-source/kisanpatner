import axios from 'axios';
import * as DocumentPicker from 'expo-document-picker';
import * as Location from 'expo-location';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, ChevronRight, MapPin, Plus, Upload, X } from 'lucide-react-native';
import React, { useEffect, useState,useCallback } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Linking,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Category {
  _id: string;
  categoryName: string;
}

interface Market {
  id: string;
  name: string;
}

interface FormData {
  personalInfo: {
    name: string;
    mobileNo: string;
    email: string;
    address: string;
    villageGramaPanchayat: string;
    pincode: string;
    state: string;
    district: string;
    taluk: string;
    post: string;
  };
  farmLocation: {
    latitude: string;
    longitude: string;
  };
  farmLand: {
    total: string;
    cultivated: string;
    uncultivated: string;
  };
  commodities: string[];
  nearestMarkets: Market[];
  bankDetails: {
    accountHolderName: string;
    accountNumber: string;
    ifscCode: string;
    branch: string;
  };
  documents: {
    panCard: any;
    aadharFront: any;
    aadharBack: any;
    bankPassbook: any;
  };
  security: {
    referralCode: string;
    mpin: string;
    confirmMpin: string;
    password: string;
    confirmPassword: string;
  };
}



const FarmerRegistration: React.FC = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const role = (params.role as string) || 'farmer';
  console.log('Role:', role);

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const [formData, setFormData] = useState<FormData>({
    personalInfo: {
      name: '',
      mobileNo: '',
      email: '',
      address: '',
      villageGramaPanchayat: '',
      pincode: '',
      state: '',
      district: '',
      taluk: '',
      post: '',
    },
    farmLocation: {
      latitude: '',
      longitude: '',
    },
    farmLand: {
      total: '',
      cultivated: '',
      uncultivated: '',
    },
    commodities: [],
    nearestMarkets: [],
    bankDetails: {
      accountHolderName: '',
      accountNumber: '',
      ifscCode: '',
      branch: '',
    },
    documents: {
      panCard: null,
      aadharFront: null,
      aadharBack: null,
      bankPassbook: null,
    },
    security: {
      referralCode: '',
      mpin: '',
      confirmMpin: '',
      password: '',
      confirmPassword: '',
    },
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [newMarket, setNewMarket] = useState('');
  const [loading, setLoading] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('https://kisan.etpl.ai/category/all');
      const data = await res.json();
      setCategories(data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchPincodeData = async (pincode: string) => {
    if (pincode.length !== 6) return;
    setPincodeLoading(true);
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();
      if (data[0].Status === 'Success' && data[0].PostOffice && data[0].PostOffice.length > 0) {
        const postOffice = data[0].PostOffice[0];
        setFormData(prev => ({
          ...prev,
          personalInfo: {
            ...prev.personalInfo,
            state: postOffice.State,
            district: postOffice.District,
            taluk: postOffice.Block || postOffice.Division,
            post: postOffice.Name,
          },
        }));
      }
    } catch (error) {
      console.error('Error fetching pincode data:', error);
    } finally {
      setPincodeLoading(false);
    }
  };

  const handlePincodeChange = (pincode: string) => {
    setFormData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, pincode },
    }));
    if (pincode.length === 6) fetchPincodeData(pincode);
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission required.');
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setFormData(prev => ({
        ...prev,
        farmLocation: {
          latitude: location.coords.latitude.toString(),
          longitude: location.coords.longitude.toString(),
        },
      }));
      Alert.alert('Success', 'Location captured!');
    } catch (error) {
      Alert.alert('Error', 'Unable to get location.');
    }
  };

  const handleCommodityToggle = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      commodities: prev.commodities.includes(categoryId)
        ? prev.commodities.filter(id => id !== categoryId)
        : [...prev.commodities, categoryId],
    }));
  };

  const addMarket = () => {
    if (newMarket.trim()) {
      setFormData(prev => ({
        ...prev,
        nearestMarkets: [
          ...prev.nearestMarkets,
          { id: Date.now().toString(), name: newMarket.trim() },
        ],
      }));
      setNewMarket('');
    }
  };

  const removeMarket = (id: string) => {
    setFormData(prev => ({
      ...prev,
      nearestMarkets: prev.nearestMarkets.filter(m => m.id !== id),
    }));
  };

  const handleFileChange = async (docType: keyof FormData['documents']) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (result.canceled === false && result.assets && result.assets.length > 0) {
        setFormData(prev => ({
          ...prev,
          documents: {
            ...prev.documents,
            [docType]: result.assets[0],
          },
        }));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick document.');
    }
  };

  const validateStep1 = () => {
    setError('');
    if (!formData.personalInfo.name.trim()) {
      setError('Please enter your name');
      return false;
    }
    if (
      !formData.personalInfo.mobileNo.trim() ||
      formData.personalInfo.mobileNo.length !== 10
    ) {
      setError('Please enter valid 10-digit mobile number');
      return false;
    }
    if (
      !formData.personalInfo.pincode.trim() ||
      formData.personalInfo.pincode.length !== 6
    ) {
      setError('Please enter valid 6-digit pincode');
      return false;
    }
    if (!formData.personalInfo.state || !formData.personalInfo.district) {
      setError('Please wait for location details from pincode');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    setError('');
    if (role === 'farmer' && !formData.farmLocation.latitude) {
      setError('Please pin your farm location');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    setError('');
    if (formData.commodities.length === 0) {
      setError('Please select at least one commodity');
      return false;
    }
    return true;
  };

  const validateStep5 = () => {
    setError('');
    if (!formData.security.mpin || formData.security.mpin.length !== 4) {
      setError('Please enter 4-digit MPIN');
      return false;
    }
    if (formData.security.mpin !== formData.security.confirmMpin) {
      setError('MPIN and Confirm MPIN do not match');
      return false;
    }
    if (!formData.security.password || formData.security.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.security.password !== formData.security.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    let isValid = false;
    if (currentStep === 1) isValid = validateStep1();
    else if (currentStep === 2) isValid = validateStep2();
    else if (currentStep === 3) isValid = validateStep3();
    else isValid = true;

    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      setError('');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError('');
    }
  };

  const handleSubmit = async () => {
    if (!validateStep5()) return;
    setLoading(true);

    const submitFormData = new FormData();
    submitFormData.append('personalInfo', JSON.stringify(formData.personalInfo));
    submitFormData.append('farmLocation', JSON.stringify(formData.farmLocation));
    submitFormData.append('farmLand', JSON.stringify(formData.farmLand));
    submitFormData.append('commodities', JSON.stringify(formData.commodities));
    submitFormData.append('nearestMarkets', JSON.stringify(formData.nearestMarkets));
    submitFormData.append('bankDetails', JSON.stringify(formData.bankDetails));
    submitFormData.append('role', role);
    submitFormData.append(
      'security',
      JSON.stringify({
        referralCode: formData.security.referralCode,
        mpin: formData.security.mpin,
        password: formData.security.password,
      })
    );

    if (formData.documents.panCard) {
      submitFormData.append('panCard', {
        uri: formData.documents.panCard.uri,
        type: formData.documents.panCard.mimeType,
        name: formData.documents.panCard.name,
      } as any);
    }
    if (formData.documents.aadharFront) {
      submitFormData.append('aadharFront', {
        uri: formData.documents.aadharFront.uri,
        type: formData.documents.aadharFront.mimeType,
        name: formData.documents.aadharFront.name,
      } as any);
    }
    if (formData.documents.aadharBack) {
      submitFormData.append('aadharBack', {
        uri: formData.documents.aadharBack.uri,
        type: formData.documents.aadharBack.mimeType,
        name: formData.documents.aadharBack.name,
      } as any);
    }
    if (formData.documents.bankPassbook) {
      submitFormData.append('bankPassbook', {
        uri: formData.documents.bankPassbook.uri,
        type: formData.documents.bankPassbook.mimeType,
        name: formData.documents.bankPassbook.name,
      } as any);
    }

    try {
      const response = await axios.post(
        'https://kisan.etpl.ai/farmer/register',
        submitFormData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      if (response.status === 200 || response.status === 201) {
        Alert.alert('Success', 'Registration Successful!', [
          { text: 'OK', onPress: () => router.push('/(auth)/Login') },
        ]);
      }
    } catch (error: any) {
      setError(error?.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const renderProgressBar = () => (
    <View className="mt-2 mb-6">
      <View className="flex-row items-center justify-between">
        {Array.from({ length: totalSteps }, (_, index) => {
          const step = index + 1;
          const isCompleted = currentStep > step;
          const isCurrent = currentStep === step;
          const isActive = currentStep >= step;

          return (
            <View
              key={step}
              className="flex-row items-center flex-1"
            >
              {/* Circle */}
              <View
                className={[
                  'w-8 h-8 rounded-full border-2 items-center justify-center',
                  'bg-white',
                  isCurrent
                    ? 'border-[#1FAD4E] bg-[#1FAD4E]'
                    : isActive
                    ? 'border-[#1FAD4E]'
                    : 'border-gray-300',
                ].join(' ')}
              >
                <Text
                  className={[
                    'text-sm font-medium',
                    isCurrent
                      ? 'text-green-500'
                      : isActive
                      ? 'text-[#1FAD4E]'
                      : 'text-gray-500',
                  ].join(' ')}
                >
                  {step}
                </Text>
              </View>

              {/* Connecting line */}
              {index < totalSteps - 1 && (
                <View
                  className={[
                    'h-0.5 mx-1 flex-1',
                    isCompleted ? 'bg-[#1FAD4E]' : 'bg-gray-300',
                  ].join(' ')}
                />
              )}
            </View>
          );
        })}
      </View>
    </View>
  );

  const renderStep1 = () => (
    <View className="mb-5">
      <Text className="text-sm font-heading text-[#1FAD4E] mb-4">
        Personal & Location
      </Text>

      <View className="mb-3">
        <Text className="text-sm font-subheading text-gray-800 mb-1.5">
          Name <Text className="text-red-500">*</Text>
        </Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
          placeholder="Full name"
          value={formData.personalInfo.name}
          onChangeText={text =>
            setFormData(p => ({
              ...p,
              personalInfo: { ...p.personalInfo, name: text },
            }))
          }
        />
      </View>

      <View className="mb-3">
        <Text className="text-sm font-subheading text-gray-800 mb-1.5">
          Mobile <Text className="text-red-500">*</Text>
        </Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
          placeholder="10-digit number"
          keyboardType="phone-pad"
          maxLength={10}
          value={formData.personalInfo.mobileNo}
          onChangeText={text =>
            setFormData(p => ({
              ...p,
              personalInfo: { ...p.personalInfo, mobileNo: text },
            }))
          }
        />
      </View>

      <View className="mb-3">
        <Text className="text-sm font-subheading text-gray-800 mb-1.5">
          Email (Optional)
        </Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
          placeholder="email@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={formData.personalInfo.email}
          onChangeText={text =>
            setFormData(p => ({
              ...p,
              personalInfo: { ...p.personalInfo, email: text },
            }))
          }
        />
      </View>

      <View className="mb-3">
        <Text className="text-sm font-subheading text-gray-800 mb-1.5">Address</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white h-20 text-top"
          placeholder="Full address"
          multiline
          numberOfLines={3}
          value={formData.personalInfo.address}
          onChangeText={text =>
            setFormData(p => ({
              ...p,
              personalInfo: { ...p.personalInfo, address: text },
            }))
          }
        />
      </View>

      <View className="mb-3">
        <Text className="text-sm font-subheading text-gray-800 mb-1.5">
          Village / Grama Panchayat
        </Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
          placeholder="Village name"
          value={formData.personalInfo.villageGramaPanchayat}
          onChangeText={text =>
            setFormData(p => ({
              ...p,
              personalInfo: {
                ...p.personalInfo,
                villageGramaPanchayat: text,
              },
            }))
          }
        />
      </View>

      <View className="mb-3">
        <Text className="text-sm font-subheading text-gray-800 mb-1.5">
          Pincode <Text className="text-red-500">*</Text>
        </Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
          placeholder="6-digit pincode"
          keyboardType="number-pad"
          maxLength={6}
          value={formData.personalInfo.pincode}
          onChangeText={handlePincodeChange}
        />
        {pincodeLoading && (
          <Text className="text-xs text-gray-500 mt-1">Fetching location...</Text>
        )}
      </View>

      <View className="mb-3">
        <Text className="text-sm font-subheading text-gray-800 mb-1.5">
          State <Text className="text-red-500">*</Text>
        </Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-gray-100"
          value={formData.personalInfo.state}
          editable={false}
          placeholder="Auto-filled"
        />
      </View>

      <View className="mb-3">
        <Text className="text-sm font-subheading text-gray-800 mb-1.5">
          District <Text className="text-red-500">*</Text>
        </Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-gray-100"
          value={formData.personalInfo.district}
          editable={false}
          placeholder="Auto-filled"
        />
      </View>

      <View className="mb-3">
        <Text className="text-sm font-subheading text-gray-800 mb-1.5">Taluk</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-gray-100"
          value={formData.personalInfo.taluk}
          editable={false}
          placeholder="Auto-filled"
        />
      </View>

      <View className="mb-3">
        <Text className="text-sm font-subheading text-gray-800 mb-1.5">Post</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-gray-100"
          value={formData.personalInfo.post}
          editable={false}
          placeholder="Auto-filled"
        />
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View className="mb-5">
      <Text className="text-lg font-heading text-[#1FAD4E] mb-4">
        {role === 'farmer' ? 'Farm Details' : 'Business Location'}
      </Text>

      {role === 'farmer' && (
        <>
          <View className="mb-3">
  <Text className="text-sm font-subheading text-gray-800 mb-1.5">
    Farm Location <Text className="text-red-500">*</Text>
  </Text>
  
  <View className="flex flex-row items-center gap-3">
    <TouchableOpacity
      className="flex flex-row items-center bg-green-50 border border-green-200 rounded-lg px-4 py-3 active:bg-green-100"
      onPress={getCurrentLocation}
    >
      <MapPin size={18} color="#1FAD4E" className="mr-2" />
      <Text className="text-green-700 font-medium"> Use Current Location</Text>
    </TouchableOpacity>

    {formData.farmLocation.latitude && (
      <View className="flex-1">
        <Text className="text-xs text-gray-500 mb-1">Selected Location:</Text>
        <Text className="text-sm text-gray-800 font-medium">
          {parseFloat(formData.farmLocation.latitude).toFixed(6)}, {parseFloat(formData.farmLocation.longitude).toFixed(6)}
        </Text>
      </View>
    )}
  </View>
</View>

          <Text className="text-base font-medium text-gray-800 mt-3 mb-3">
            Farm Land (Acres)
          </Text>

          <View className="mb-3">
            <Text className="text-sm font-subheading text-gray-800 mb-1.5">
              Total
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
              placeholder="Total acres"
              keyboardType="decimal-pad"
              value={formData.farmLand.total}
              onChangeText={text =>
                setFormData(p => ({
                  ...p,
                  farmLand: { ...p.farmLand, total: text },
                }))
              }
            />
          </View>

          <View className="mb-3">
            <Text className="text-sm font-subheading text-gray-800 mb-1.5">
              Cultivated
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
              placeholder="Cultivated acres"
              keyboardType="decimal-pad"
              value={formData.farmLand.cultivated}
              onChangeText={text =>
                setFormData(p => ({
                  ...p,
                  farmLand: { ...p.farmLand, cultivated: text },
                }))
              }
            />
          </View>

          <View className="mb-3">
            <Text className="text-sm font-subheading text-gray-800 mb-1.5">
              Uncultivated
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
              placeholder="Uncultivated acres"
              keyboardType="decimal-pad"
              value={formData.farmLand.uncultivated}
              onChangeText={text =>
                setFormData(p => ({
                  ...p,
                  farmLand: { ...p.farmLand, uncultivated: text },
                }))
              }
            />
          </View>
        </>
      )}

      <Text className="text-base font-medium text-gray-800 mt-4 mb-3">
        Nearest Markets
      </Text>

      <View className="mb-3">
        {formData.nearestMarkets.map(market => (
          <View
            key={market.id}
            className="flex-row items-center justify-between bg-gray-50 px-3 py-2.5 rounded-lg mb-2"
          >
            <Text className="flex-1 text-sm text-gray-800">
              {market.name}
            </Text>
            <TouchableOpacity onPress={() => removeMarket(market.id)}>
              <X size={18} color="#EF4444" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View className="flex-row items-center">
        <TextInput
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white"
          placeholder="Market name"
          value={newMarket}
          onChangeText={setNewMarket}
        />
        <TouchableOpacity
          className="bg-[#1FAD4E] px-4 py-2.5 rounded-lg items-center justify-center ml-3 mr-4"
          onPress={addMarket}
        >
          <Plus size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View className="mb-5">
      <Text className="text-lg font-heading text-[#1FAD4E] mb-4">
        Commodities & Bank
      </Text>

      <Text className="text-base font-heading text-gray-800 mb-3">
        Commodities <Text className="text-red-500">*</Text>
      </Text>

      {categories.map(cat => (
        <TouchableOpacity
          key={cat._id}
          className="flex-row items-center mb-3"
          onPress={() => handleCommodityToggle(cat._id)}
        >
          <View
            className={`w-5 h-5 rounded-md border-2 mr-3 items-center justify-center ${
              formData.commodities.includes(cat._id)
                ? 'bg-[#1FAD4E] border-[#1FAD4E]'
                : 'border-gray-300'
            }`}
          >
            {formData.commodities.includes(cat._id) && (
              <Text className="text-xs font-bold text-white">✓</Text>
            )}
          </View>
          <Text className="text-sm text-gray-800">{cat.categoryName}</Text>
        </TouchableOpacity>
      ))}

      <Text className="text-base font-medium text-gray-800 mt-4 mb-3">
        Bank Details (Optional)
      </Text>

      <View className="mb-3">
        <Text className="text-sm font-subheading text-gray-800 mb-1.5">
          Account Holder
        </Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
          placeholder="Name"
          value={formData.bankDetails.accountHolderName}
          onChangeText={text =>
            setFormData(p => ({
              ...p,
              bankDetails: { ...p.bankDetails, accountHolderName: text },
            }))
          }
        />
      </View>

      <View className="mb-3">
        <Text className="text-sm font-subheading text-gray-800 mb-1.5">
          Account Number
        </Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
          placeholder="Number"
          keyboardType="number-pad"
          value={formData.bankDetails.accountNumber}
          onChangeText={text =>
            setFormData(p => ({
              ...p,
              bankDetails: { ...p.bankDetails, accountNumber: text },
            }))
          }
        />
      </View>

      <View className="mb-3">
        <Text className="text-sm font-subheading text-gray-800 mb-1.5">
          IFSC Code
        </Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
          placeholder="IFSC"
          autoCapitalize="characters"
          value={formData.bankDetails.ifscCode}
          onChangeText={text =>
            setFormData(p => ({
              ...p,
              bankDetails: { ...p.bankDetails, ifscCode: text },
            }))
          }
        />
      </View>

      <View className="mb-3">
        <Text className="text-sm font-subheading text-gray-800 mb-1.5">
          Branch
        </Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
          placeholder="Branch name"
          value={formData.bankDetails.branch}
          onChangeText={text =>
            setFormData(p => ({
              ...p,
              bankDetails: { ...p.bankDetails, branch: text },
            }))
          }
        />
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View className="mb-5">
      <Text className="text-lg font-heading text-[#1FAD4E] mb-4">
        Documents (Optional)
      </Text>

      {[
        { key: 'panCard', label: 'Upload PAN Card / ID' },
        { key: 'aadharFront', label: 'Upload Aadhaar Front' },
        { key: 'aadharBack', label: 'Upload Aadhaar Back' },
        { key: 'bankPassbook', label: 'Upload Bank Passbook' },
      ].map(doc => {
        const docKey = doc.key as keyof FormData['documents'];
        const fileObj = formData.documents[docKey];

        return (
          <View
            key={doc.key}
            className="border border-dashed border-gray-300 rounded-xl p-4 mb-4 bg-white"
          >
            <View className="flex-row items-center justify-between">
              {/* LEFT ICON + TEXT */}
              <View className="flex-row items-start flex-1">
                <View className="w-10 h-10 rounded-full bg-green-100 items-center justify-center mr-3">
                  <Upload size={18} color="#1FAD4E" />
                </View>

                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-900">
                    {doc.label}
                  </Text>
                  <Text className="text-xs text-gray-500 mt-0.5">
                    Securely verify your identity to access all features
                  </Text>

                  {/* FILE NAME */}
                  {fileObj?.name && (
                    <Text className="text-[11px] text-[#1FAD4E] mt-1">
                      ✅ {fileObj.name}
                    </Text>
                  )}
                </View>
              </View>

              {/* RIGHT UPLOAD BUTTON */}
              <TouchableOpacity
                onPress={() => handleFileChange(docKey)}
                className="border border-[#1FAD4E] px-4 py-2 rounded-lg"
              >
                <Text className="text-[#1FAD4E] text-xs font-medium">
                  Upload
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </View>
  );

  const renderStep5 = () => (
    <View className="mb-5">
      <Text className="text-lg font-heading text-[#1FAD4E] mb-4">
        Security
      </Text>

      <View className="mb-3">
        <Text className="text-sm font-subheading text-gray-800 mb-1.5">
          Referral Code (Optional)
        </Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
          placeholder="Referral code"
          value={formData.security.referralCode}
          onChangeText={text =>
            setFormData(p => ({
              ...p,
              security: { ...p.security, referralCode: text },
            }))
          }
        />
      </View>

      <View className="mb-3">
        <Text className="text-sm font-subheading text-gray-800 mb-1.5">
          4-Digit MPIN <Text className="text-red-500">*</Text>
        </Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
          keyboardType="number-pad"
          maxLength={4}
          secureTextEntry
          placeholder="****"
          value={formData.security.mpin}
          onChangeText={text =>
            setFormData(p => ({
              ...p,
              security: { ...p.security, mpin: text },
            }))
          }
        />
        <Text className="text-xs text-gray-500 mt-1">
          Quick login PIN
        </Text>
      </View>

      <View className="mb-3">
        <Text className="text-sm font-subheading text-gray-800 mb-1.5">
          Confirm MPIN <Text className="text-red-500">*</Text>
        </Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
          keyboardType="number-pad"
          maxLength={4}
          secureTextEntry
          placeholder="****"
          value={formData.security.confirmMpin}
          onChangeText={text =>
            setFormData(p => ({
              ...p,
              security: { ...p.security, confirmMpin: text },
            }))
          }
        />
      </View>

      <View className="mb-3">
        <Text className="text-sm font-subheading text-gray-800 mb-1.5">
          Password <Text className="text-red-500">*</Text>
        </Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
          secureTextEntry
          maxLength={20}
          placeholder="Password"
          value={formData.security.password}
          onChangeText={text =>
            setFormData(p => ({
              ...p,
              security: { ...p.security, password: text },
            }))
          }
        />
        <Text className="text-xs text-gray-500 mt-1">
          Min 6 characters
        </Text>
      </View>

      <View className="mb-3">
        <Text className="text-sm font-subheading text-gray-800 mb-1.5">
          Confirm Password <Text className="text-red-500">*</Text>
        </Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
          secureTextEntry
          maxLength={20}
          placeholder="Confirm"
          value={formData.security.confirmPassword}
          onChangeText={text =>
            setFormData(p => ({
              ...p,
              security: { ...p.security, confirmPassword: text },
            }))
          }
        />
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-white py-10">
       <View className="absolute -top-24 -left-40 w-72 h-72 rounded-full bg-[#E8FDEB]" />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        className="px-4 py-4"
      >
        <View className="p-5">
          <View className="items-center mb-5">
            <Text className="text-2xl text-[#1FAD4E] font-medium">
              Create {role} Account
            </Text>
            <Text className="text-xs text-gray-500 mt-1">
              Step {currentStep} of {totalSteps}
            </Text>
          </View>

          {renderProgressBar()}

          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
          {currentStep === 5 && renderStep5()}

          {error ? (
            <View className="bg-red-100 px-3 py-2.5 rounded-lg mt-2">
              <Text className="text-sm text-red-700 text-center">
                {error}
              </Text>
            </View>
          ) : null}

          <View className="flex-row justify-between mt-5 gap-3">
            {currentStep > 1 && (
              <TouchableOpacity
                onPress={handlePrevious}
                className="flex-row items-center px-4 py-3 rounded-lg border border-[#1FAD4E] bg-white flex-1 justify-center"
              >
                <ChevronLeft size={20} color="#1FAD4E" />
                <Text className="text-[#1FAD4E] text-base font-medium ml-2">
                  Previous
                </Text>
              </TouchableOpacity>
            )}

            {currentStep < totalSteps ? (
              <TouchableOpacity
                onPress={handleNext}
                className={`flex-row items-center px-4 py-3 rounded-lg flex-1 justify-center ${
                  currentStep > 1 ? '' : 'ml-0'
                } bg-[#1FAD4E]`}
              >
                <Text className="text-white text-base font-medium mr-2">
                  Save & Next
                </Text>
                <ChevronRight size={20} color="#fff" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={loading}
                className={`flex-row items-center px-4 py-3 rounded-lg flex-1 justify-center ${
                  loading ? 'opacity-70' : ''
                } bg-[#1FAD4E]`}
              >
                {loading ? (
                  <View className="flex-row items-center">
                    <ActivityIndicator color="#fff" size="small" />
                    <Text className="text-white text-base font-medium ml-2">
                      Registering...
                    </Text>
                  </View>
                ) : (
                  <Text className="text-white text-base font-medium">
                    Register
                  </Text>
                )}
              </TouchableOpacity>
            )}
          </View>

          <View className="flex-row justify-center mt-6">
            <Text className="text-sm text-gray-500">
              Already registered?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/Login')}>
              <Text className="text-sm text-[#1FAD4E] font-medium">
                Login here
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default FarmerRegistration;


