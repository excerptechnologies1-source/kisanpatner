// import axios from 'axios';
// import * as DocumentPicker from 'expo-document-picker';
// import * as Location from 'expo-location';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import { ChevronLeft, ChevronRight, MapPin, Plus, Upload, X } from 'lucide-react-native';
// import React, { useEffect, useState,useCallback } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   ScrollView,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
//   Linking,
// } from 'react-native';
// import { SafeAreaView } from "react-native-safe-area-context";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import CustomAlert from '../../components/CustomAlert';

// interface Category {
//   _id: string;
//   categoryName: string;
// }

// interface Market {
//   id: string;
//   name: string;
// }

// interface FormData {
//   personalInfo: {
//     name: string;
//     mobileNo: string;
//     email: string;
//     address: string;
//     villageGramaPanchayat: string;
//     pincode: string;
//     state: string;
//     district: string;
//     taluk: string;
//     post: string;
//   };
//   farmLocation: {
//     latitude: string;
//     longitude: string;
//   };
//   farmLand: {
//     total: string;
//     cultivated: string;
//     uncultivated: string;
//   };
//   commodities: string[];

//   nearestMarkets: Market[];
//   bankDetails: {
//     accountHolderName: string;
//     accountNumber: string;
//     ifscCode: string;
//     branch: string;
//   };
//   documents: {
//     panCard: any;
//     aadharFront: any;
//     aadharBack: any;
//     bankPassbook: any;
//   };
//   security: {
//     referralCode: string;
//     mpin: string;
//     confirmMpin: string;
//     password: string;
//     confirmPassword: string;
//   };
// }

// const FarmerRegistration: React.FC = () => {
//   const params = useLocalSearchParams();
//   const router = useRouter();
//   const role = (params.role as string) || 'farmer';
//   console.log('Role:', role);

//   const [currentStep, setCurrentStep] = useState(1);
//   const totalSteps = 5;

//   const [formData, setFormData] = useState<FormData>({
//     personalInfo: {
//       name: '',
//       mobileNo: '',
//       email: '',
//       address: '',
//       villageGramaPanchayat: '',
//       pincode: '',
//       state: '',
//       district: '',
//       taluk: '',
//       post: '',
//     },
//     farmLocation: {
//       latitude: '',
//       longitude: '',
//     },
//     farmLand: {
//       total: '',
//       cultivated: '',
//       uncultivated: '',
//     },
//     commodities: [],
//     nearestMarkets: [],
//     bankDetails: {
//       accountHolderName: '',
//       accountNumber: '',
//       ifscCode: '',
//       branch: '',
//     },
//     documents: {
//       panCard: null,
//       aadharFront: null,
//       aadharBack: null,
//       bankPassbook: null,
//     },
//     security: {
//       referralCode: '',
//       mpin: '',
//       confirmMpin: '',
//       password: '',
//       confirmPassword: '',
//     },
//   });

//   const [categories, setCategories] = useState<Category[]>([]);
//   const [newMarket, setNewMarket] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [pincodeLoading, setPincodeLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [showAlert, setShowAlert] = useState(false);
//   const [alertTitle, setAlertTitle] = useState("");
//   const [alertMessage, setAlertMessage] = useState("");
//   const [alertAction, setAlertAction] = useState<null | (() => void)>(null);

//    const showAppAlert = (title: string, message: string, action?: () => void) => {
//   setAlertTitle(title);
//   setAlertMessage(message);
//   setAlertAction(() => action || null);
//   setShowAlert(true);
// };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const fetchCategories = async () => {
//     try {
//       const res = await fetch('https://kisan.etpl.ai/category/all');
//       const data = await res.json();
//       setCategories(data.data);
//     } catch (error) {
//       console.error('Error fetching categories:', error);
//     }
//   };

//   const fetchPincodeData = async (pincode: string) => {
//     if (pincode.length !== 6) return;
//     setPincodeLoading(true);
//     try {
//       const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
//       const data = await response.json();
//       if (data[0].Status === 'Success' && data[0].PostOffice && data[0].PostOffice.length > 0) {
//         const postOffice = data[0].PostOffice[0];
//         setFormData(prev => ({
//           ...prev,
//           personalInfo: {
//             ...prev.personalInfo,
//             state: postOffice.State,
//             district: postOffice.District,
//             taluk: postOffice.Block || postOffice.Division,
//             post: postOffice.Name,
//           },
//         }));
//       }
//     } catch (error) {
//       console.error('Error fetching pincode data:', error);
//     } finally {
//       setPincodeLoading(false);
//     }
//   };

//   const handlePincodeChange = (pincode: string) => {
//     setFormData(prev => ({
//       ...prev,
//       personalInfo: { ...prev.personalInfo, pincode },
//     }));
//     if (pincode.length === 6) fetchPincodeData(pincode);
//   };

//   const getCurrentLocation = async () => {
//     try {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         showAppAlert('Permission Denied', 'Location permission required.');
//         return;
//       }
//       const location = await Location.getCurrentPositionAsync({});
//       setFormData(prev => ({
//         ...prev,
//         farmLocation: {
//           latitude: location.coords.latitude.toString(),
//           longitude: location.coords.longitude.toString(),
//         },
//       }));
//       showAppAlert('Success', 'Location captured!');
//     } catch (error) {
//       showAppAlert('Error', 'Failed to pick document.');
//     }
//   };

//   const handleCommodityToggle = (categoryId: string) => {
//     setFormData(prev => ({
//       ...prev,
//       commodities: prev.commodities.includes(categoryId)
//         ? prev.commodities.filter(id => id !== categoryId)
//         : [...prev.commodities, categoryId],
//     }));
//   };

//   const addMarket = () => {
//     if (newMarket.trim()) {
//       setFormData(prev => ({
//         ...prev,
//         nearestMarkets: [
//           ...prev.nearestMarkets,
//           { id: Date.now().toString(), name: newMarket.trim() },
//         ],
//       }));
//       setNewMarket('');
//     }
//   };

//   const removeMarket = (id: string) => {
//     setFormData(prev => ({
//       ...prev,
//       nearestMarkets: prev.nearestMarkets.filter(m => m.id !== id),
//     }));
//   };

//   const handleFileChange = async (docType: keyof FormData['documents']) => {
//     try {
//       const result = await DocumentPicker.getDocumentAsync({
//         type: ['image/*', 'application/pdf'],
//         copyToCacheDirectory: true,
//       });

//       if (result.canceled === false && result.assets && result.assets.length > 0) {
//         setFormData(prev => ({
//           ...prev,
//           documents: {
//             ...prev.documents,
//             [docType]: result.assets[0],
//           },
//         }));
//       }
//     } catch (error) {
//       showAppAlert('Error', 'Failed to pick document.');
//     }
//   };

//   const validateStep1 = () => {
//     setError('');
//     if (!formData.personalInfo.name.trim()) {
//       setError('Please enter your name');
//       return false;
//     }
//     if (
//       !formData.personalInfo.mobileNo.trim() ||
//       formData.personalInfo.mobileNo.length !== 10
//     ) {
//       setError('Please enter valid 10-digit mobile number');
//       return false;
//     }
//     if (
//       !formData.personalInfo.pincode.trim() ||
//       formData.personalInfo.pincode.length !== 6
//     ) {
//       setError('Please enter valid 6-digit pincode');
//       return false;
//     }
//     if (!formData.personalInfo.state || !formData.personalInfo.district) {
//       setError('Please wait for location details from pincode');
//       return false;
//     }
//     return true;
//   };

//   const validateStep2 = () => {
//     setError('');
//     if (role === 'farmer' && !formData.farmLocation.latitude) {
//       setError('Please pin your farm location');
//       return false;
//     }
//     return true;
//   };

//   const validateStep3 = () => {
//     setError('');
//     if (formData.commodities.length === 0) {
//       setError('Please select at least one commodity');
//       return false;
//     }
//     return true;
//   };

//   const validateStep5 = () => {
//     setError('');
//     if (!formData.security.mpin || formData.security.mpin.length !== 4) {
//       setError('Please enter 4-digit MPIN');
//       return false;
//     }
//     if (formData.security.mpin !== formData.security.confirmMpin) {
//       setError('MPIN and Confirm MPIN do not match');
//       return false;
//     }
//     if (!formData.security.password || formData.security.password.length < 6) {
//       setError('Password must be at least 6 characters');
//       return false;
//     }
//     if (formData.security.password !== formData.security.confirmPassword) {
//       setError('Passwords do not match');
//       return false;
//     }
//     return true;
//   };

//   const handleNext = () => {
//     let isValid = false;
//     if (currentStep === 1) isValid = validateStep1();
//     else if (currentStep === 2) isValid = validateStep2();
//     else if (currentStep === 3) isValid = validateStep3();
//     else isValid = true;

//     if (isValid && currentStep < totalSteps) {
//       setCurrentStep(currentStep + 1);
//       setError('');
//     }
//   };

//   const handlePrevious = () => {
//     if (currentStep > 1) {
//       setCurrentStep(currentStep - 1);
//       setError('');
//     }
//   };

//   const handleSubmit = async () => {
//     if (!validateStep5()) return;
//     setLoading(true);

//     const submitFormData = new FormData();
//     submitFormData.append('personalInfo', JSON.stringify(formData.personalInfo));
//     submitFormData.append('farmLocation', JSON.stringify(formData.farmLocation));
//     submitFormData.append('farmLand', JSON.stringify(formData.farmLand));
//     submitFormData.append('commodities', JSON.stringify(formData.commodities));
//     submitFormData.append('nearestMarkets', JSON.stringify(formData.nearestMarkets));
//     submitFormData.append('bankDetails', JSON.stringify(formData.bankDetails));
//     submitFormData.append('role', role);
//     submitFormData.append(
//       'security',
//       JSON.stringify({
//         referralCode: formData.security.referralCode,
//         mpin: formData.security.mpin,
//         password: formData.security.password,
//       })
//     );

//     if (formData.documents.panCard) {
//       submitFormData.append('panCard', {
//         uri: formData.documents.panCard.uri,
//         type: formData.documents.panCard.mimeType,
//         name: formData.documents.panCard.name,
//       } as any);
//     }
//     if (formData.documents.aadharFront) {
//       submitFormData.append('aadharFront', {
//         uri: formData.documents.aadharFront.uri,
//         type: formData.documents.aadharFront.mimeType,
//         name: formData.documents.aadharFront.name,
//       } as any);
//     }
//     if (formData.documents.aadharBack) {
//       submitFormData.append('aadharBack', {
//         uri: formData.documents.aadharBack.uri,
//         type: formData.documents.aadharBack.mimeType,
//         name: formData.documents.aadharBack.name,
//       } as any);
//     }
//     if (formData.documents.bankPassbook) {
//       submitFormData.append('bankPassbook', {
//         uri: formData.documents.bankPassbook.uri,
//         type: formData.documents.bankPassbook.mimeType,
//         name: formData.documents.bankPassbook.name,
//       } as any);
//     }

//     try {
//       const response = await axios.post(
//         'https://kisan.etpl.ai/farmer/register',
//         submitFormData,
//         { headers: { 'Content-Type': 'multipart/form-data' } }
//       );
//       if (response.status === 200 || response.status === 201) {

//           showAppAlert(
//             'Success 🎉',
//             'Registration Successful!',
//             () => router.push('/(auth)/Login')
//           );
//       }
//     } catch (error: any) {
//       setError(error?.response?.data?.message || 'Registration failed.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderProgressBar = () => (
//     <View className="mt-2 mb-6">
//       <View className="flex-row items-center justify-between">
//         {Array.from({ length: totalSteps }, (_, index) => {
//           const step = index + 1;
//           const isCompleted = currentStep > step;
//           const isCurrent = currentStep === step;
//           const isActive = currentStep >= step;

//           return (
//             <View
//               key={step}
//               className="flex-row items-center flex-1"
//             >
//               {/* Circle */}
//               <View
//                 className={[
//                   'w-8 h-8 rounded-full border-2 items-center justify-center',
//                   'bg-white',
//                   isCurrent
//                     ? 'border-[#1FAD4E] bg-[#1FAD4E]'
//                     : isActive
//                     ? 'border-[#1FAD4E]'
//                     : 'border-gray-300',
//                 ].join(' ')}
//               >
//                 <Text
//                   className={[
//                     'text-sm font-medium',
//                     isCurrent
//                       ? 'text-green-500'
//                       : isActive
//                       ? 'text-[#1FAD4E]'
//                       : 'text-gray-500',
//                   ].join(' ')}
//                 >
//                   {step}
//                 </Text>
//               </View>

//               {/* Connecting line */}
//               {index < totalSteps - 1 && (
//                 <View
//                   className={[
//                     'h-0.5 mx-1 flex-1',
//                     isCompleted ? 'bg-[#1FAD4E]' : 'bg-gray-300',
//                   ].join(' ')}
//                 />
//               )}
//             </View>
//           );
//         })}
//       </View>
//     </View>
//   );

//   const renderStep1 = () => (
//     <View className="mb-5">
//       <Text className="text-sm font-heading text-[#1FAD4E] mb-4">
//         Personal & Location
//       </Text>

//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//           Name <Text className="text-red-500">*</Text>
//         </Text>
//         <TextInput
//           className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
//           placeholder="Full name"
//           value={formData.personalInfo.name}
//           onChangeText={text =>
//             setFormData(p => ({
//               ...p,
//               personalInfo: { ...p.personalInfo, name: text },
//             }))
//           }
//         />
//       </View>

//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//           Mobile <Text className="text-red-500">*</Text>
//         </Text>
//         <TextInput
//           className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
//           placeholder="10-digit number"
//           keyboardType="phone-pad"
//           maxLength={10}
//           value={formData.personalInfo.mobileNo}
//           onChangeText={text =>
//             setFormData(p => ({
//               ...p,
//               personalInfo: { ...p.personalInfo, mobileNo: text },
//             }))
//           }
//         />
//       </View>

//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//           Email (Optional)
//         </Text>
//         <TextInput
//           className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
//           placeholder="email@example.com"
//           keyboardType="email-address"
//           autoCapitalize="none"
//           value={formData.personalInfo.email}
//           onChangeText={text =>
//             setFormData(p => ({
//               ...p,
//               personalInfo: { ...p.personalInfo, email: text },
//             }))
//           }
//         />
//       </View>

//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">Address</Text>
//         <TextInput
//           className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white h-20 text-top"
//           placeholder="Full address"
//           multiline
//           numberOfLines={3}
//           value={formData.personalInfo.address}
//           onChangeText={text =>
//             setFormData(p => ({
//               ...p,
//               personalInfo: { ...p.personalInfo, address: text },
//             }))
//           }
//         />
//       </View>

//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//           Village / Grama Panchayat
//         </Text>
//         <TextInput
//           className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
//           placeholder="Village name"
//           value={formData.personalInfo.villageGramaPanchayat}
//           onChangeText={text =>
//             setFormData(p => ({
//               ...p,
//               personalInfo: {
//                 ...p.personalInfo,
//                 villageGramaPanchayat: text,
//               },
//             }))
//           }
//         />
//       </View>

//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//           Pincode <Text className="text-red-500">*</Text>
//         </Text>
//         <TextInput
//           className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
//           placeholder="6-digit pincode"
//           keyboardType="number-pad"
//           maxLength={6}
//           value={formData.personalInfo.pincode}
//           onChangeText={handlePincodeChange}
//         />
//         {pincodeLoading && (
//           <Text className="text-xs text-gray-500 mt-1">Fetching location...</Text>
//         )}
//       </View>

//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//           State <Text className="text-red-500">*</Text>
//         </Text>
//         <TextInput
//           className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-gray-100"
//           value={formData.personalInfo.state}
//           editable={false}
//           placeholder="Auto-filled"
//         />
//       </View>

//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//           District <Text className="text-red-500">*</Text>
//         </Text>
//         <TextInput
//           className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-gray-100"
//           value={formData.personalInfo.district}
//           editable={false}
//           placeholder="Auto-filled"
//         />
//       </View>

//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">Taluk</Text>
//         <TextInput
//           className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-gray-100"
//           value={formData.personalInfo.taluk}
//           editable={false}
//           placeholder="Auto-filled"
//         />
//       </View>

//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">Post</Text>
//         <TextInput
//           className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-gray-100"
//           value={formData.personalInfo.post}
//           editable={false}
//           placeholder="Auto-filled"
//         />
//       </View>
//     </View>
//   );

//   const renderStep2 = () => (
//     <View className="mb-5">
//       <Text className="text-lg font-heading text-[#1FAD4E] mb-4">
//         {role === 'farmer' ? 'Farm Details' : 'Business Location'}
//       </Text>

//       {role === 'farmer' && (
//         <>
//           <View className="mb-3">
//   <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//     Farm Location <Text className="text-red-500">*</Text>
//   </Text>

//   <View className="flex flex-row items-center gap-3">
//     <TouchableOpacity
//       className="flex flex-row items-center bg-green-50 border border-green-200 rounded-lg px-4 py-3 active:bg-green-100"
//       onPress={getCurrentLocation}
//     >
//       <MapPin size={18} color="#1FAD4E" className="mr-2" />
//       <Text className="text-green-700 font-medium"> Use Current Location</Text>
//     </TouchableOpacity>

//     {formData.farmLocation.latitude && (
//       <View className="flex-1">
//         <Text className="text-xs text-gray-500 mb-1">Selected Location:</Text>
//         <Text className="text-sm text-gray-800 font-medium">
//           {parseFloat(formData.farmLocation.latitude).toFixed(6)}, {parseFloat(formData.farmLocation.longitude).toFixed(6)}
//         </Text>
//       </View>
//     )}
//   </View>
// </View>

//           <Text className="text-base font-medium text-gray-800 mt-3 mb-3">
//             Farm Land (Acres)
//           </Text>

//           <View className="mb-3">
//             <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//               Total
//             </Text>
//             <TextInput
//               className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
//               placeholder="Total acres"
//               keyboardType="decimal-pad"
//               value={formData.farmLand.total}
//               onChangeText={text =>
//                 setFormData(p => ({
//                   ...p,
//                   farmLand: { ...p.farmLand, total: text },
//                 }))
//               }
//             />
//           </View>

//           <View className="mb-3">
//             <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//               Cultivated
//             </Text>
//             <TextInput
//               className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
//               placeholder="Cultivated acres"
//               keyboardType="decimal-pad"
//               value={formData.farmLand.cultivated}
//               onChangeText={text =>
//                 setFormData(p => ({
//                   ...p,
//                   farmLand: { ...p.farmLand, cultivated: text },
//                 }))
//               }
//             />
//           </View>

//           <View className="mb-3">
//             <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//               Uncultivated
//             </Text>
//             <TextInput
//               className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
//               placeholder="Uncultivated acres"
//               keyboardType="decimal-pad"
//               value={formData.farmLand.uncultivated}
//               onChangeText={text =>
//                 setFormData(p => ({
//                   ...p,
//                   farmLand: { ...p.farmLand, uncultivated: text },
//                 }))
//               }
//             />
//           </View>
//         </>
//       )}

//       <Text className="text-base font-medium text-gray-800 mt-4 mb-3">
//         Nearest Markets
//       </Text>

//       <View className="mb-3">
//         {formData.nearestMarkets.map(market => (
//           <View
//             key={market.id}
//             className="flex-row items-center justify-between bg-gray-50 px-3 py-2.5 rounded-lg mb-2"
//           >
//             <Text className="flex-1 text-sm text-gray-800">
//               {market.name}
//             </Text>
//             <TouchableOpacity onPress={() => removeMarket(market.id)}>
//               <X size={18} color="#EF4444" />
//             </TouchableOpacity>
//           </View>
//         ))}
//       </View>

//       <View className="flex-row items-center">
//         <TextInput
//           className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white"
//           placeholder="Market name"
//           value={newMarket}
//           onChangeText={setNewMarket}
//         />
//         <TouchableOpacity
//           className="bg-[#1FAD4E] px-4 py-2.5 rounded-lg items-center justify-center ml-3 mr-4"
//           onPress={addMarket}
//         >
//           <Plus size={18} color="#fff" />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   const renderStep3 = () => (
//     <View className="mb-5">
//       <Text className="text-lg font-heading text-[#1FAD4E] mb-4">
//         Commodities & Bank
//       </Text>

//       <Text className="text-base font-heading text-gray-800 mb-3">
//         Commodities <Text className="text-red-500">*</Text>
//       </Text>

//       {categories.map(cat => (
//         <TouchableOpacity
//           key={cat._id}
//           className="flex-row items-center mb-3"
//           onPress={() => handleCommodityToggle(cat._id)}
//         >
//           <View
//             className={`w-5 h-5 rounded-md border-2 mr-3 items-center justify-center ${
//               formData.commodities.includes(cat._id)
//                 ? 'bg-[#1FAD4E] border-[#1FAD4E]'
//                 : 'border-gray-300'
//             }`}
//           >
//             {formData.commodities.includes(cat._id) && (
//               <Text className="text-xs font-bold text-white">✓</Text>
//             )}
//           </View>
//           <Text className="text-sm text-gray-800">{cat.categoryName}</Text>
//         </TouchableOpacity>
//       ))}

//       <Text className="text-base font-medium text-gray-800 mt-4 mb-3">
//         Bank Details (Optional)
//       </Text>

//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//           Account Holder
//         </Text>
//         <TextInput
//           className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
//           placeholder="Name"
//           value={formData.bankDetails.accountHolderName}
//           onChangeText={text =>
//             setFormData(p => ({
//               ...p,
//               bankDetails: { ...p.bankDetails, accountHolderName: text },
//             }))
//           }
//         />
//       </View>

//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//           Account Number
//         </Text>
//         <TextInput
//           className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
//           placeholder="Number"
//           keyboardType="number-pad"
//           value={formData.bankDetails.accountNumber}
//           onChangeText={text =>
//             setFormData(p => ({
//               ...p,
//               bankDetails: { ...p.bankDetails, accountNumber: text },
//             }))
//           }
//         />
//       </View>

//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//           IFSC Code
//         </Text>
//         <TextInput
//           className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
//           placeholder="IFSC"
//           autoCapitalize="characters"
//           value={formData.bankDetails.ifscCode}
//           onChangeText={text =>
//             setFormData(p => ({
//               ...p,
//               bankDetails: { ...p.bankDetails, ifscCode: text },
//             }))
//           }
//         />
//       </View>

//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//           Branch
//         </Text>
//         <TextInput
//           className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
//           placeholder="Branch name"
//           value={formData.bankDetails.branch}
//           onChangeText={text =>
//             setFormData(p => ({
//               ...p,
//               bankDetails: { ...p.bankDetails, branch: text },
//             }))
//           }
//         />
//       </View>
//     </View>
//   );

//   const renderStep4 = () => (
//     <View className="mb-5">
//       <Text className="text-lg font-heading text-[#1FAD4E] mb-4">
//         Documents (Optional)
//       </Text>

//       {[
//         { key: 'panCard', label: 'Upload PAN Card / ID' },
//         { key: 'aadharFront', label: 'Upload Aadhaar Front' },
//         { key: 'aadharBack', label: 'Upload Aadhaar Back' },
//         { key: 'bankPassbook', label: 'Upload Bank Passbook' },
//       ].map(doc => {
//         const docKey = doc.key as keyof FormData['documents'];
//         const fileObj = formData.documents[docKey];

//         return (
//           <View
//             key={doc.key}
//             className="border border-dashed border-gray-300 rounded-xl p-4 mb-4 bg-white"
//           >
//             <View className="flex-row items-center justify-between">
//               {/* LEFT ICON + TEXT */}
//               <View className="flex-row items-start flex-1">
//                 <View className="w-10 h-10 rounded-full bg-green-100 items-center justify-center mr-3">
//                   <Upload size={18} color="#1FAD4E" />
//                 </View>

//                 <View className="flex-1">
//                   <Text className="text-sm font-medium text-gray-900">
//                     {doc.label}
//                   </Text>
//                   <Text className="text-xs text-gray-500 mt-0.5">
//                     Securely verify your identity to access all features
//                   </Text>

//                   {/* FILE NAME */}
//                   {fileObj?.name && (
//                     <Text className="text-[11px] text-[#1FAD4E] mt-1">
//                       ✅ {fileObj.name}
//                     </Text>
//                   )}
//                 </View>
//               </View>

//               {/* RIGHT UPLOAD BUTTON */}
//               <TouchableOpacity
//                 onPress={() => handleFileChange(docKey)}
//                 className="border border-[#1FAD4E] px-4 py-2 rounded-lg"
//               >
//                 <Text className="text-[#1FAD4E] text-xs font-medium">
//                   Upload
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         );
//       })}
//     </View>
//   );

//   const renderStep5 = () => (
//     <View className="mb-5">
//       <Text className="text-lg font-heading text-[#1FAD4E] mb-4">
//         Security
//       </Text>

//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//           Referral Code (Optional)
//         </Text>
//         <TextInput
//           className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
//           placeholder="Referral code"
//           value={formData.security.referralCode}
//           onChangeText={text =>
//             setFormData(p => ({
//               ...p,
//               security: { ...p.security, referralCode: text },
//             }))
//           }
//         />
//       </View>

//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//           4-Digit MPIN <Text className="text-red-500">*</Text>
//         </Text>
//         <TextInput
//           className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
//           keyboardType="number-pad"
//           maxLength={4}
//           secureTextEntry
//           placeholder="****"
//           value={formData.security.mpin}
//           onChangeText={text =>
//             setFormData(p => ({
//               ...p,
//               security: { ...p.security, mpin: text },
//             }))
//           }
//         />
//         <Text className="text-xs text-gray-500 mt-1">
//           Quick login PIN
//         </Text>
//       </View>

//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//           Confirm MPIN <Text className="text-red-500">*</Text>
//         </Text>
//         <TextInput
//           className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
//           keyboardType="number-pad"
//           maxLength={4}
//           secureTextEntry
//           placeholder="****"
//           value={formData.security.confirmMpin}
//           onChangeText={text =>
//             setFormData(p => ({
//               ...p,
//               security: { ...p.security, confirmMpin: text },
//             }))
//           }
//         />
//       </View>

//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//           Password <Text className="text-red-500">*</Text>
//         </Text>
//         <TextInput
//           className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
//           secureTextEntry
//           maxLength={20}
//           placeholder="Password"
//           value={formData.security.password}
//           onChangeText={text =>
//             setFormData(p => ({
//               ...p,
//               security: { ...p.security, password: text },
//             }))
//           }
//         />
//         <Text className="text-xs text-gray-500 mt-1">
//           Min 6 characters
//         </Text>
//       </View>

//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//           Confirm Password <Text className="text-red-500">*</Text>
//         </Text>
//         <TextInput
//           className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
//           secureTextEntry
//           maxLength={20}
//           placeholder="Confirm"
//           value={formData.security.confirmPassword}
//           onChangeText={text =>
//             setFormData(p => ({
//               ...p,
//               security: { ...p.security, confirmPassword: text },
//             }))
//           }
//         />
//       </View>
//     </View>
//   );

//   return (
//     <>
//     <View className="flex-1 bg-white py-10">
//        <View className="absolute -top-24 -left-40 w-72 h-72 rounded-full bg-[#E8FDEB]" />
//       <ScrollView
//         contentContainerStyle={{ flexGrow: 1 }}
//         keyboardShouldPersistTaps="handled"
//         className="px-4 py-4"
//       >
//         <View className="p-5">
//           <View className="items-center mb-5">
//             <Text className="text-2xl text-[#1FAD4E] font-medium">
//               Create {role} Account
//             </Text>
//             <Text className="text-xs text-gray-500 mt-1">
//               Step {currentStep} of {totalSteps}
//             </Text>
//           </View>

//           {renderProgressBar()}

//           {currentStep === 1 && renderStep1()}
//           {currentStep === 2 && renderStep2()}
//           {currentStep === 3 && renderStep3()}
//           {currentStep === 4 && renderStep4()}
//           {currentStep === 5 && renderStep5()}

//           {error ? (
//             <View className="bg-red-100 px-3 py-2.5 rounded-lg mt-2">
//               <Text className="text-sm text-red-700 text-center">
//                 {error}
//               </Text>
//             </View>
//           ) : null}

//           <View className="flex-row justify-between mt-5 gap-3">
//             {currentStep > 1 && (
//               <TouchableOpacity
//                 onPress={handlePrevious}
//                 className="flex-row items-center px-4 py-3 rounded-lg border border-[#1FAD4E] bg-white flex-1 justify-center"
//               >
//                 <ChevronLeft size={20} color="#1FAD4E" />
//                 <Text className="text-[#1FAD4E] text-base font-medium ml-2">
//                   Previous
//                 </Text>
//               </TouchableOpacity>
//             )}

//             {currentStep < totalSteps ? (
//               <TouchableOpacity
//                 onPress={handleNext}
//                 className={`flex-row items-center px-4 py-3 rounded-lg flex-1 justify-center ${
//                   currentStep > 1 ? '' : 'ml-0'
//                 } bg-[#1FAD4E]`}
//               >
//                 <Text className="text-white text-base font-medium mr-2">
//                   Save & Next
//                 </Text>
//                 <ChevronRight size={20} color="#fff" />
//               </TouchableOpacity>
//             ) : (
//               <TouchableOpacity
//                 onPress={handleSubmit}
//                 disabled={loading}
//                 className={`flex-row items-center px-4 py-3 rounded-lg flex-1 justify-center ${
//                   loading ? 'opacity-70' : ''
//                 } bg-[#1FAD4E]`}
//               >
//                 {loading ? (
//                   <View className="flex-row items-center">
//                     <ActivityIndicator color="#fff" size="small" />
//                     <Text className="text-white text-base font-medium ml-2">
//                       Registering...
//                     </Text>
//                   </View>
//                 ) : (
//                   <Text className="text-white text-base font-medium">
//                     Register
//                   </Text>
//                 )}
//               </TouchableOpacity>
//             )}
//           </View>

//           <View className="flex-row justify-center mt-6">
//             <Text className="text-sm text-gray-500">
//               Already registered?{' '}
//             </Text>
//             <TouchableOpacity onPress={() => router.push('/(auth)/Login')}>
//               <Text className="text-sm text-[#1FAD4E] font-medium">
//                 Login here
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </ScrollView>
//     </View>

//      <CustomAlert
//   visible={showAlert}
//   title={alertTitle}
//   message={alertMessage}
//   onClose={() => {
//     setShowAlert(false);
//     if (alertAction) alertAction();   // optional navigation callback
//   }}
// />

//     </>
//   );
// };

// export default FarmerRegistration;

// import axios from "axios";
// import * as DocumentPicker from "expo-document-picker";
// import * as Location from "expo-location";
// import * as ImagePicker from "expo-image-picker";
// import * as FileSystem from "expo-file-system";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import {
//   ChevronLeft,
//   ChevronRight,
//   MapPin,
//   Plus,
//   Upload,
//   X,
// } from "lucide-react-native";
// import React, { useEffect, useState, useCallback } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   ScrollView,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
//   Platform,
//   KeyboardAvoidingView,
//   TouchableWithoutFeedback,
//   Keyboard,
//   Image,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import CustomAlert from "@/components/CustomAlert";

// interface Category {
//   _id: string;
//   categoryName: string;
//   image?: string;
// }

// interface Market {
//   id: string;
//   name: string;
// }
// interface SubCategory {
//   _id: string;
//   subCategoryName: string;
//   categoryId: string;
//   image?: string;
// }
// interface FormData {
//   personalInfo: {
//     name: string;
//     mobileNo: string;
//     email: string;
//     address: string;
//     villageGramaPanchayat: string;
//     pincode: string;
//     state: string;
//     district: string;
//     taluk: string;
//     post: string;
//   };
//   farmLocation: {
//     latitude: string;
//     longitude: string;
//   };
//   farmLand: {
//     total: string;
//     cultivated: string;
//     uncultivated: string;
//   };
//   commodities: string[];
//   subcategories: string[];
//   nearestMarkets: string[];
//   bankDetails: {
//     accountHolderName: string;
//     accountNumber: string;
//     ifscCode: string;
//     branch: string;
//   };
//   documents: {
//     panCard: any;
//     aadharFront: any;
//     aadharBack: any;
//     bankPassbook: any;
//   };
//   security: {
//     referralCode: string;
//     mpin: string;
//     confirmMpin: string;
//     password: string;
//     confirmPassword: string;
//   };
// }

// const FarmerRegistration: React.FC = () => {
//   const params = useLocalSearchParams();
//   const router = useRouter();
//   const role = (params.role as string) || "farmer";

//   const [currentStep, setCurrentStep] = useState(1);
//   const totalSteps = 5;

//   const [formData, setFormData] = useState<FormData>({
//     personalInfo: {
//       name: "",
//       mobileNo: "",
//       email: "",
//       address: "",
//       villageGramaPanchayat: "",
//       pincode: "",
//       state: "",
//       district: "",
//       taluk: "",
//       post: "",
//     },
//     farmLocation: {
//       latitude: "",
//       longitude: "",
//     },
//     farmLand: {
//       total: "",
//       cultivated: "",
//       uncultivated: "",
//     },
//     commodities: [],
//     subcategories: [],
//     nearestMarkets: [], // Already correct as string array
//     bankDetails: {
//       accountHolderName: "",
//       accountNumber: "",
//       ifscCode: "",
//       branch: "",
//     },
//     documents: {
//       panCard: null,
//       aadharFront: null,
//       aadharBack: null,
//       bankPassbook: null,
//     },
//     security: {
//       referralCode: "",
//       mpin: "",
//       confirmMpin: "",
//       password: "",
//       confirmPassword: "",
//     },
//   });

//   const [markets, setMarkets] = useState<any[]>([]);
//   const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
//   const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [newMarket, setNewMarket] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [pincodeLoading, setPincodeLoading] = useState(false);
//   const [error, setError] = useState("");
//   const DOCUMENTS_BY_ROLE = {
//     farmer: [
//       { key: "panCard", label: "Upload PAN Card / ID" },
//       { key: "aadharFront", label: "Upload Aadhaar Front" },
//       { key: "aadharBack", label: "Upload Aadhaar Back" },
//       { key: "bankPassbook", label: "Upload Bank Passbook" },
//     ],
//     trader: [
//       { key: "panCard", label: "Upload PAN Card / ID" },
//       { key: "aadharFront", label: "Upload Aadhaar Front" },
//       { key: "aadharBack", label: "Upload Aadhaar Back" },
//       { key: "businessLicense", label: "Upload Business License" },
//       { key: "photo", label: "Upload Photo" },
//       { key: "businessNameBoard", label: "Upload Business Name Board" },
//     ],
//   };

//   useEffect(() => {
//     fetchCategories();
//     fetchMarkets(); // ADD THIS
//   }, []);

//   const fetchCategories = async () => {
//     try {
//       const res = await fetch("https://kisan.etpl.ai/category/all");
//       const data = await res.json();
//       setCategories(data.data);
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//     }
//   };

//   const fetchMarkets = async () => {
//     try {
//       const res = await fetch("https://kisan.etpl.ai/api/market/all");
//       const data = await res.json();
//       setMarkets(data.data || data);
//     } catch (error) {
//       console.error("Error fetching markets:", error);
//     }
//   };

//   const fetchSubCategories = async (categoryId: string) => {
//     try {
//       const res = await fetch(
//         `https://kisan.etpl.ai/subcategory/category/${categoryId}`
//       );
//       const data = await res.json();
//       return data.data || [];
//     } catch (error) {
//       console.error("Error fetching subcategories:", error);
//       return [];
//     }
//   };
//   const fetchPincodeData = async (pincode: string) => {
//     if (pincode.length !== 6) return;
//     setPincodeLoading(true);
//     try {
//       const response = await fetch(
//         `https://api.postalpincode.in/pincode/${pincode}`
//       );
//       const data = await response.json();
//       if (
//         data[0].Status === "Success" &&
//         data[0].PostOffice &&
//         data[0].PostOffice.length > 0
//       ) {
//         const postOffice = data[0].PostOffice[0];
//         setFormData((prev) => ({
//           ...prev,
//           personalInfo: {
//             ...prev.personalInfo,
//             state: postOffice.State,
//             district: postOffice.District,
//             taluk: postOffice.Block || postOffice.Division,
//             post: postOffice.Name,
//           },
//         }));
//       }
//     } catch (error) {
//       console.error("Error fetching pincode data:", error);
//     } finally {
//       setPincodeLoading(false);
//     }
//   };

//   const handlePincodeChange = (pincode: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       personalInfo: { ...prev.personalInfo, pincode },
//     }));
//     if (pincode.length === 6) fetchPincodeData(pincode);
//   };

//   const getCurrentLocation = async () => {
//     try {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         Alert.alert("Permission Denied", "Location permission required.");
//         return;
//       }
//       const location = await Location.getCurrentPositionAsync({});
//       setFormData((prev) => ({
//         ...prev,
//         farmLocation: {
//           latitude: location.coords.latitude.toString(),
//           longitude: location.coords.longitude.toString(),
//         },
//       }));
//       Alert.alert("Success", "Location captured!");
//     } catch (error) {
//       Alert.alert("Error", "Unable to get location.");
//     }
//   };

//   const handleCommodityToggle = async (categoryId: string) => {
//     const isCurrentlySelected = formData.commodities.includes(categoryId);

//     if (isCurrentlySelected) {
//       // Remove category and its subcategories
//       setFormData((prev) => ({
//         ...prev,
//         commodities: prev.commodities.filter((id) => id !== categoryId),
//         subcategories: prev.subcategories.filter((subId) => {
//           const sub = subCategories.find((s) => s._id === subId);
//           return sub?.categoryId !== categoryId;
//         }),
//       }));
//       setExpandedCategories((prev) => prev.filter((id) => id !== categoryId));
//     } else {
//       // Add category and fetch subcategories
//       setFormData((prev) => ({
//         ...prev,
//         commodities: [...prev.commodities, categoryId],
//       }));

//       const subs = await fetchSubCategories(categoryId);
//       setSubCategories((prev) => [...prev, ...subs]);
//       setExpandedCategories((prev) => [...prev, categoryId]);
//     }
//   };

//   const handleSubCategoryToggle = (subCategoryId: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       subcategories: prev.subcategories.includes(subCategoryId)
//         ? prev.subcategories.filter((id) => id !== subCategoryId)
//         : [...prev.subcategories, subCategoryId],
//     }));
//   };

//   const removeMarket = (id: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       nearestMarkets: prev.nearestMarkets.filter((m) => m.id !== id),
//     }));
//   };

//   const handleFileChange = async (docType: keyof FormData["documents"]) => {
//     try {
//       const result = await DocumentPicker.getDocumentAsync({
//         type: ["image/*", "application/pdf"],
//         copyToCacheDirectory: true,
//       });

//       if (
//         result.canceled === false &&
//         result.assets &&
//         result.assets.length > 0
//       ) {
//         setFormData((prev) => ({
//           ...prev,
//           documents: {
//             ...prev.documents,
//             [docType]: result.assets[0],
//           },
//         }));
//       }
//     } catch (error) {
//       Alert.alert("Error", "Failed to pick document.");
//     }
//   };

//   const validateStep1 = () => {
//     setError("");
//     if (!formData.personalInfo.name.trim()) {
//       setError("Please enter your name");
//       return false;
//     }
//     if (
//       !formData.personalInfo.mobileNo.trim() ||
//       formData.personalInfo.mobileNo.length !== 10
//     ) {
//       setError("Please enter valid 10-digit mobile number");
//       return false;
//     }
//     if (
//       !formData.personalInfo.pincode.trim() ||
//       formData.personalInfo.pincode.length !== 6
//     ) {
//       setError("Please enter valid 6-digit pincode");
//       return false;
//     }
//     if (!formData.personalInfo.state || !formData.personalInfo.district) {
//       setError("Please wait for location details from pincode");
//       return false;
//     }
//     return true;
//   };

//   const validateStep2 = () => {
//     setError("");
//     if (role === "farmer" && !formData.farmLocation.latitude) {
//       setError("Please pin your farm location");
//       return false;
//     }
//     return true;
//   };

//   const validateStep3 = () => {
//     setError("");
//     if (formData.commodities.length === 0) {
//       setError("Please select at least one commodity");
//       return false;
//     }
//     return true;
//   };

//   const validateStep5 = () => {
//     setError("");
//     if (!formData.security.mpin || formData.security.mpin.length !== 4) {
//       setError("Please enter 4-digit MPIN");
//       return false;
//     }
//     if (formData.security.mpin !== formData.security.confirmMpin) {
//       setError("MPIN and Confirm MPIN do not match");
//       return false;
//     }
//     if (!formData.security.password || formData.security.password.length < 6) {
//       setError("Password must be at least 6 characters");
//       return false;
//     }
//     if (formData.security.password !== formData.security.confirmPassword) {
//       setError("Passwords do not match");
//       return false;
//     }
//     return true;
//   };

//   const handleNext = () => {
//     let isValid = false;
//     if (currentStep === 1) isValid = validateStep1();
//     else if (currentStep === 2) isValid = validateStep2();
//     else if (currentStep === 3) isValid = validateStep3();
//     else isValid = true;

//     if (isValid && currentStep < totalSteps) {
//       setCurrentStep(currentStep + 1);
//       setError("");
//     }
//   };

//   const handlePrevious = () => {
//     if (currentStep > 1) {
//       setCurrentStep(currentStep - 1);
//       setError("");
//     }
//   };

//   const handleSubmit = async () => {
//     if (!validateStep5()) return;
//     setLoading(true);

//     const submitFormData = new FormData();
//     submitFormData.append(
//       "personalInfo",
//       JSON.stringify(formData.personalInfo)
//     );
//     submitFormData.append(
//       "farmLocation",
//       JSON.stringify(formData.farmLocation)
//     );
//     submitFormData.append("farmLand", JSON.stringify(formData.farmLand));
//     submitFormData.append("commodities", JSON.stringify(formData.commodities));
//     submitFormData.append(
//       "nearestMarkets",
//       JSON.stringify(formData.nearestMarkets)
//     );
//     submitFormData.append("bankDetails", JSON.stringify(formData.bankDetails));
//     submitFormData.append(
//       "subcategories",
//       JSON.stringify(formData.subcategories)
//     );
//     submitFormData.append("role", role);
//     submitFormData.append(
//       "security",
//       JSON.stringify({
//         referralCode: formData.security.referralCode,
//         mpin: formData.security.mpin,
//         password: formData.security.password,
//       })
//     );

//     if (formData.documents.panCard) {
//       submitFormData.append("panCard", {
//         uri: formData.documents.panCard.uri,
//         type: formData.documents.panCard.mimeType,
//         name: formData.documents.panCard.name,
//       } as any);
//     }
//     if (formData.documents.aadharFront) {
//       submitFormData.append("aadharFront", {
//         uri: formData.documents.aadharFront.uri,
//         type: formData.documents.aadharFront.mimeType,
//         name: formData.documents.aadharFront.name,
//       } as any);
//     }
//     if (formData.documents.aadharBack) {
//       submitFormData.append("aadharBack", {
//         uri: formData.documents.aadharBack.uri,
//         type: formData.documents.aadharBack.mimeType,
//         name: formData.documents.aadharBack.name,
//       } as any);
//     }
//     if (formData.documents.bankPassbook) {
//       submitFormData.append("bankPassbook", {
//         uri: formData.documents.bankPassbook.uri,
//         type: formData.documents.bankPassbook.mimeType,
//         name: formData.documents.bankPassbook.name,
//       } as any);
//     }

//     try {
//       const response = await axios.post(
//         "https://kisan.etpl.ai/farmer/register",
//         submitFormData,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );
//       if (response.status === 200 || response.status === 201) {
//         Alert.alert("Success", "Registration Successful!", [
//           { text: "OK", onPress: () => router.push("/(auth)/Login") },
//         ]);
//       }
//     } catch (error: any) {
//       setError(error?.response?.data?.message || "Registration failed.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderProgressBar = () => (
//     <View className="mt-2 mb-6">
//       <View className="flex-row items-center justify-between">
//         {Array.from({ length: totalSteps }, (_, index) => {
//           const step = index + 1;
//           const isCompleted = currentStep > step;
//           const isCurrent = currentStep === step;
//           const isActive = currentStep >= step;

//           return (
//             <View key={step} className="flex-row items-center flex-1">
//               {/* Circle */}
//               <View
//                 className={[
//                   "w-8 h-8 rounded-full border-2 items-center justify-center",
//                   "bg-white",
//                   isCurrent
//                     ? "border-[#1FAD4E] bg-[#1FAD4E]"
//                     : isActive
//                     ? "border-[#1FAD4E]"
//                     : "border-gray-300",
//                 ].join(" ")}
//               >
//                 <Text
//                   className={[
//                     "text-sm font-medium",
//                     isCurrent
//                       ? "text-green-500"
//                       : isActive
//                       ? "text-[#1FAD4E]"
//                       : "text-gray-500",
//                   ].join(" ")}
//                 >
//                   {step}
//                 </Text>
//               </View>

//               {/* Connecting line */}
//               {index < totalSteps - 1 && (
//                 <View
//                   className={[
//                     "h-0.5 mx-1 flex-1",
//                     isCompleted ? "bg-[#1FAD4E]" : "bg-gray-300",
//                   ].join(" ")}
//                 />
//               )}
//             </View>
//           );
//         })}
//       </View>
//     </View>
//   );

//   const renderStep1 = () => (
//     <View className="mb-5">
//       <Text className="text-sm font-heading text-[#1FAD4E] mb-4">
//         Personal & Location
//       </Text>

//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//           Name <Text className="text-red-500">*</Text>
//         </Text>
//         <TextInput
//           className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
//           placeholder="Full name"
//           value={formData.personalInfo.name}
//           onChangeText={(text) =>
//             setFormData((p) => ({
//               ...p,
//               personalInfo: { ...p.personalInfo, name: text },
//             }))
//           }
//         />
//       </View>

//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//           Mobile <Text className="text-red-500">*</Text>
//         </Text>
//         <TextInput
//           className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
//           placeholder="10-digit number"
//           keyboardType="phone-pad"
//           maxLength={10}
//           value={formData.personalInfo.mobileNo}
//           onChangeText={(text) =>
//             setFormData((p) => ({
//               ...p,
//               personalInfo: { ...p.personalInfo, mobileNo: text },
//             }))
//           }
//         />
//       </View>

//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//           Email (Optional)
//         </Text>
//         <TextInput
//           className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
//           placeholder="email@example.com"
//           keyboardType="email-address"
//           autoCapitalize="none"
//           value={formData.personalInfo.email}
//           onChangeText={(text) =>
//             setFormData((p) => ({
//               ...p,
//               personalInfo: { ...p.personalInfo, email: text },
//             }))
//           }
//         />
//       </View>

//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//           Address
//         </Text>
//         <TextInput
//           className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white h-20 text-top"
//           placeholder="Full address"
//           multiline
//           numberOfLines={3}
//           value={formData.personalInfo.address}
//           onChangeText={(text) =>
//             setFormData((p) => ({
//               ...p,
//               personalInfo: { ...p.personalInfo, address: text },
//             }))
//           }
//         />
//       </View>

//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//           Village / Grama Panchayat
//         </Text>
//         <TextInput
//           className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
//           placeholder="Village name"
//           value={formData.personalInfo.villageGramaPanchayat}
//           onChangeText={(text) =>
//             setFormData((p) => ({
//               ...p,
//               personalInfo: {
//                 ...p.personalInfo,
//                 villageGramaPanchayat: text,
//               },
//             }))
//           }
//         />
//       </View>

//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//           Pincode <Text className="text-red-500">*</Text>
//         </Text>
//         <TextInput
//           className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
//           placeholder="6-digit pincode"
//           keyboardType="number-pad"
//           maxLength={6}
//           value={formData.personalInfo.pincode}
//           onChangeText={handlePincodeChange}
//         />
//         {pincodeLoading && (
//           <Text className="text-xs text-gray-500 mt-1">
//             Fetching location...
//           </Text>
//         )}
//       </View>

//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//           State <Text className="text-red-500">*</Text>
//         </Text>
//         <TextInput
//           className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-gray-100"
//           value={formData.personalInfo.state}
//           editable={false}
//           placeholder="Auto-filled"
//         />
//       </View>

//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//           District <Text className="text-red-500">*</Text>
//         </Text>
//         <TextInput
//           className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-gray-100"
//           value={formData.personalInfo.district}
//           editable={false}
//           placeholder="Auto-filled"
//         />
//       </View>

//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//           Taluk
//         </Text>
//         <TextInput
//           className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-gray-100"
//           value={formData.personalInfo.taluk}
//           editable={false}
//           placeholder="Auto-filled"
//         />
//       </View>

//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//           Post
//         </Text>
//         <TextInput
//           className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-gray-100"
//           value={formData.personalInfo.post}
//           editable={false}
//           placeholder="Auto-filled"
//         />
//       </View>
//     </View>
//   );

//   const renderStep2 = () => (
//     <View className="mb-5">
//       <Text className="text-lg font-heading text-[#1FAD4E] mb-4">
//         {role === "farmer" ? "Farm Details" : "Business Location"}
//       </Text>

//       {role === "farmer" && (
//         <>
//           <View className="mb-3">
//             <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//               Farm Location <Text className="text-red-500">*</Text>
//             </Text>

//             <View className="flex flex-row items-center gap-3">
//               <TouchableOpacity
//                 className="flex flex-row items-center bg-green-50 border border-green-200 rounded-lg px-4 py-3 active:bg-green-100"
//                 onPress={getCurrentLocation}
//               >
//                 <MapPin size={18} color="#1FAD4E" className="mr-2" />
//                 <Text className="text-green-700 font-medium">
//                   {" "}
//                   Use Current Location
//                 </Text>
//               </TouchableOpacity>

//               {formData.farmLocation.latitude && (
//                 <View className="flex-1">
//                   <Text className="text-xs text-gray-500 mb-1 font-medium">
//                     Selected Location:
//                   </Text>
//                   <Text className="text-sm text-gray-800 font-medium">
//                     {parseFloat(formData.farmLocation.latitude).toFixed(6)},{" "}
//                     {parseFloat(formData.farmLocation.longitude).toFixed(6)}
//                   </Text>
//                 </View>
//               )}
//             </View>
//           </View>

//           <Text className="text-base font-medium text-gray-800 mt-3 mb-3">
//             Farm Land (Acres)
//           </Text>

//           <View className="mb-3">
//             <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//               Total
//             </Text>
//             <TextInput
//               className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
//               placeholder="Total acres"
//               keyboardType="decimal-pad"
//               value={formData.farmLand.total}
//               onChangeText={(text) =>
//                 setFormData((p) => ({
//                   ...p,
//                   farmLand: { ...p.farmLand, total: text },
//                 }))
//               }
//             />
//           </View>

//           <View className="mb-3">
//             <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//               Cultivated
//             </Text>
//             <TextInput
//               className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
//               placeholder="Cultivated acres"
//               keyboardType="decimal-pad"
//               value={formData.farmLand.cultivated}
//               onChangeText={(text) =>
//                 setFormData((p) => ({
//                   ...p,
//                   farmLand: { ...p.farmLand, cultivated: text },
//                 }))
//               }
//             />
//           </View>

//           <View className="mb-3">
//             <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//               Uncultivated
//             </Text>
//             <TextInput
//               className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
//               placeholder="Uncultivated acres"
//               keyboardType="decimal-pad"
//               value={formData.farmLand.uncultivated}
//               onChangeText={(text) =>
//                 setFormData((p) => ({
//                   ...p,
//                   farmLand: { ...p.farmLand, uncultivated: text },
//                 }))
//               }
//             />
//           </View>
//         </>
//       )}

//       <Text className="text-base font-medium text-gray-800 mt-4 mb-3">
//         Nearest Markets
//       </Text>

//       <View className="mb-3">
//         <Text className="text-sm text-gray-600 mb-2">
//           Select multiple markets (tap to select/deselect)
//         </Text>

//         {markets.map((market) => (
//           <TouchableOpacity
//             key={market._id}
//             onPress={() => {
//               setFormData((prev) => ({
//                 ...prev,
//                 nearestMarkets: prev.nearestMarkets.includes(market._id)
//                   ? prev.nearestMarkets.filter((id) => id !== market._id)
//                   : [...prev.nearestMarkets, market._id],
//               }));
//             }}
//             className="flex-row items-center mb-3"
//           >
//             <View
//               className={`w-5 h-5 rounded-md border-2 mr-3 items-center justify-center ${
//                 formData.nearestMarkets.includes(market._id)
//                   ? "bg-[#1FAD4E] border-[#1FAD4E]"
//                   : "border-gray-300"
//               }`}
//             >
//               {formData.nearestMarkets.includes(market._id) && (
//                 <Text className="text-xs font-bold text-white">✓</Text>
//               )}
//             </View>
//             <View className="flex-1">
//               <Text className="text-sm font-medium text-gray-800">
//                 {market.marketName}
//               </Text>
//               <Text className="text-xs text-gray-500">
//                 {market.exactAddress}
//               </Text>
//             </View>
//           </TouchableOpacity>
//         ))}

//         <Text className="text-xs text-gray-500 mt-2">
//           Selected: {formData.nearestMarkets.length} market(s)
//         </Text>
//       </View>

//       <View className="flex-row items-center"></View>
//     </View>
//   );

//   const renderStep3 = () => (
//     <View className="mb-5">
//       <Text className="text-lg font-heading text-[#1FAD4E] mb-4">
//         Commodities & Bank
//       </Text>

//       <Text className="text-base font-heading text-gray-800 mb-3">
//         Commodities <Text className="text-red-500">*</Text>
//       </Text>

//       {categories.map((cat) => (
//         <View
//           key={cat._id}
//           className="border border-gray-200 rounded-lg p-3 mb-3"
//         >
//           <TouchableOpacity
//             className="flex-row items-center"
//             onPress={() => handleCommodityToggle(cat._id)}
//           >
//             <View
//               className={`w-5 h-5 rounded-md border-2 mr-3 items-center justify-center ${
//                 formData.commodities.includes(cat._id)
//                   ? "bg-[#1FAD4E] border-[#1FAD4E]"
//                   : "border-gray-300"
//               }`}
//             >
//               {formData.commodities.includes(cat._id) && (
//                 <Text className="text-xs font-bold text-white">✓</Text>
//               )}
//             </View>

//             {/* Category Image */}
//             {cat.image && (
//               <Image
//                 source={{ uri: `https://kisan.etpl.ai/uploads/${cat.image}` }}
//                 className="w-10 h-10 rounded mr-3"
//                 resizeMode="cover"
//               />
//             )}

//             <Text className="text-sm text-gray-800 flex-1">
//               {cat.categoryName}
//             </Text>
//           </TouchableOpacity>

//           {/* Subcategories */}
//           {formData.commodities.includes(cat._id) &&
//             expandedCategories.includes(cat._id) && (
//               <View className="ml-8 mt-3 pl-3 border-l-2 border-green-200">
//                 {subCategories
//                   .filter((sub) => sub.categoryId === cat._id)
//                   .map((subCat) => (
//                     <TouchableOpacity
//                       key={subCat._id}
//                       onPress={() => handleSubCategoryToggle(subCat._id)}
//                       className="flex-row items-center mb-2"
//                     >
//                       <View
//                         className={`w-4 h-4 rounded border-2 mr-2 items-center justify-center ${
//                           formData.subcategories.includes(subCat._id)
//                             ? "bg-[#1FAD4E] border-[#1FAD4E]"
//                             : "border-gray-300"
//                         }`}
//                       >
//                         {formData.subcategories.includes(subCat._id) && (
//                           <Text className="text-[10px] font-bold text-white">
//                             ✓
//                           </Text>
//                         )}
//                       </View>

//                       {/* Subcategory Image */}
//                       {subCat.image && (
//                         <Image
//                           source={{
//                             uri: `https://kisan.etpl.ai/uploads/${subCat.image}`,
//                           }}
//                           className="w-8 h-8 rounded mr-2"
//                           resizeMode="cover"
//                         />
//                       )}

//                       <Text className="text-xs text-gray-600 flex-1">
//                         {subCat.subCategoryName}
//                       </Text>
//                     </TouchableOpacity>
//                   ))}
//               </View>
//             )}
//         </View>
//       ))}
//       <Text className="text-base font-medium text-gray-800 mt-4 mb-3">
//         Bank Details (Optional)
//       </Text>

//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//           Account Holder
//         </Text>
//         <TextInput
//           className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
//           placeholder="Name"
//           value={formData.bankDetails.accountHolderName}
//           onChangeText={(text) =>
//             setFormData((p) => ({
//               ...p,
//               bankDetails: { ...p.bankDetails, accountHolderName: text },
//             }))
//           }
//         />
//       </View>

//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//           Account Number
//         </Text>
//         <TextInput
//           className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
//           placeholder="Number"
//           keyboardType="number-pad"
//           value={formData.bankDetails.accountNumber}
//           onChangeText={(text) =>
//             setFormData((p) => ({
//               ...p,
//               bankDetails: { ...p.bankDetails, accountNumber: text },
//             }))
//           }
//         />
//       </View>

//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//           IFSC Code
//         </Text>
//         <TextInput
//           className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
//           placeholder="IFSC"
//           autoCapitalize="characters"
//           value={formData.bankDetails.ifscCode}
//           onChangeText={(text) =>
//             setFormData((p) => ({
//               ...p,
//               bankDetails: { ...p.bankDetails, ifscCode: text },
//             }))
//           }
//         />
//       </View>

//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//           Branch
//         </Text>
//         <TextInput
//           className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
//           placeholder="Branch name"
//           value={formData.bankDetails.branch}
//           onChangeText={(text) =>
//             setFormData((p) => ({
//               ...p,
//               bankDetails: { ...p.bankDetails, branch: text },
//             }))
//           }
//         />
//       </View>
//     </View>
//   );

//   const renderStep4 = () => {
//     const documents = DOCUMENTS_BY_ROLE[role as "farmer" | "trader"] || [];

//     return (
//       <View className="mb-5">
//         <Text className="text-lg font-heading text-[#1FAD4E] mb-4">
//           Documents (Optional)
//         </Text>

//         {documents.map((doc) => {
//           const docKey = doc.key as keyof FormData["documents"];
//           const fileObj = formData.documents[docKey];

//           return (
//             <View
//               key={doc.key}
//               className="border border-dashed border-gray-300 rounded-xl p-4 mb-4 bg-white"
//             >
//               <View className="flex-row items-center justify-between">
//                 {/* LEFT ICON + TEXT */}
//                 <View className="flex-row items-start flex-1">
//                   <View className="w-10 h-10 rounded-full bg-green-100 items-center justify-center mr-3">
//                     <Upload size={18} color="#1FAD4E" />
//                   </View>

//                   <View className="flex-1">
//                     <Text className="text-sm font-medium text-gray-900">
//                       {doc.label}
//                     </Text>
//                     <Text className="text-xs text-gray-500 mt-0.5">
//                       Securely verify your identity to access all features
//                     </Text>

//                     {/* FILE NAME */}
//                     {fileObj?.name && (
//                       <Text className="text-[11px] text-[#1FAD4E] mt-1">
//                         ✅ {fileObj.name}
//                       </Text>
//                     )}
//                   </View>
//                 </View>

//                 {/* UPLOAD BUTTON */}
//                 <TouchableOpacity
//                   onPress={() => handleFileChange(docKey)}
//                   className="border border-[#1FAD4E] px-4 py-2 rounded-lg"
//                 >
//                   <Text className="text-[#1FAD4E] text-xs font-medium">
//                     Upload
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           );
//         })}
//       </View>
//     );
//   };

//   const renderStep5 = () => (
//     <View className="mb-5">
//       <Text className="text-lg font-heading text-[#1FAD4E] mb-4">Security</Text>

//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//           Referral Code (Optional)
//         </Text>
//         <TextInput
//           className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
//           placeholder="Referral code"
//           value={formData.security.referralCode}
//           onChangeText={(text) =>
//             setFormData((p) => ({
//               ...p,
//               security: { ...p.security, referralCode: text },
//             }))
//           }
//         />
//       </View>

//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//           4-Digit MPIN <Text className="text-red-500">*</Text>
//         </Text>
//         <TextInput
//           className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
//           keyboardType="number-pad"
//           maxLength={4}
//           secureTextEntry
//           placeholder="****"
//           value={formData.security.mpin}
//           onChangeText={(text) =>
//             setFormData((p) => ({
//               ...p,
//               security: { ...p.security, mpin: text },
//             }))
//           }
//         />
//         <Text className="text-xs text-gray-500 mt-1">Quick login PIN</Text>
//       </View>

//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//           Confirm MPIN <Text className="text-red-500">*</Text>
//         </Text>
//         <TextInput
//           className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
//           keyboardType="number-pad"
//           maxLength={4}
//           secureTextEntry
//           placeholder="****"
//           value={formData.security.confirmMpin}
//           onChangeText={(text) =>
//             setFormData((p) => ({
//               ...p,
//               security: { ...p.security, confirmMpin: text },
//             }))
//           }
//         />
//       </View>

//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//           Password <Text className="text-red-500">*</Text>
//         </Text>
//         <TextInput
//           className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
//           secureTextEntry
//           maxLength={20}
//           placeholder="Password"
//           value={formData.security.password}
//           onChangeText={(text) =>
//             setFormData((p) => ({
//               ...p,
//               security: { ...p.security, password: text },
//             }))
//           }
//         />
//         <Text className="text-xs text-gray-500 mt-1">Min 6 characters</Text>
//       </View>

//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//           Confirm Password <Text className="text-red-500">*</Text>
//         </Text>
//         <TextInput
//           className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
//           secureTextEntry
//           maxLength={20}
//           placeholder="Confirm"
//           value={formData.security.confirmPassword}
//           onChangeText={(text) =>
//             setFormData((p) => ({
//               ...p,
//               security: { ...p.security, confirmPassword: text },
//             }))
//           }
//         />
//       </View>
//     </View>
//   );

//   return (
//     <View className="flex-1 bg-white py-10">
//       <View className="absolute -top-24 -left-40 w-72 h-72 rounded-full bg-[#E8FDEB]" />
//       <ScrollView
//         contentContainerStyle={{ flexGrow: 1 }}
//         keyboardShouldPersistTaps="handled"
//         className="px-4 py-4"
//       >
//         <View className="p-5">
//           <View className="items-center mb-5">
//             <Text className="text-2xl text-[#1FAD4E] font-medium">
//               Create {role === "farmer" ? "Farmer" : "Trader"} Account
//             </Text>
//             <Text className="text-xs text-gray-500 mt-1">
//               Step {currentStep} of {totalSteps}
//             </Text>
//           </View>

//           {renderProgressBar()}

//           {currentStep === 1 && renderStep1()}
//           {currentStep === 2 && renderStep2()}
//           {currentStep === 3 && renderStep3()}
//           {currentStep === 4 && renderStep4()}
//           {currentStep === 5 && renderStep5()}

//           {error ? (
//             <View className="bg-red-100 px-3 py-2.5 rounded-lg mt-2">
//               <Text className="text-sm text-red-700 text-center">{error}</Text>
//             </View>
//           ) : null}

//           <View className="flex-row justify-between mt-5 gap-3">
//             {currentStep > 1 && (
//               <TouchableOpacity
//                 onPress={handlePrevious}
//                 className="flex-row items-center px-4 py-3 rounded-lg border border-[#1FAD4E] bg-white flex-1 justify-center"
//               >
//                 <ChevronLeft size={20} color="#1FAD4E" />
//                 <Text className="text-[#1FAD4E] text-base font-medium ml-2">
//                   Previous
//                 </Text>
//               </TouchableOpacity>
//             )}

//             {currentStep < totalSteps ? (
//               <TouchableOpacity
//                 onPress={handleNext}
//                 className={`flex-row items-center px-4 py-3 rounded-lg flex-1 justify-center ${
//                   currentStep > 1 ? "" : "ml-0"
//                 } bg-[#1FAD4E]`}
//               >
//                 <Text className="text-white text-base font-medium mr-2">
//                   Save & Next
//                 </Text>
//                 <ChevronRight size={20} color="#fff" />
//               </TouchableOpacity>
//             ) : (
//               <TouchableOpacity
//                 onPress={handleSubmit}
//                 disabled={loading}
//                 className={`flex-row items-center px-4 py-3 rounded-lg flex-1 justify-center ${
//                   loading ? "opacity-70" : ""
//                 } bg-[#1FAD4E]`}
//               >
//                 {loading ? (
//                   <View className="flex-row items-center">
//                     <ActivityIndicator color="#fff" size="small" />
//                     <Text className="text-white text-base font-medium ml-2">
//                       Registering...
//                     </Text>
//                   </View>
//                 ) : (
//                   <Text className="text-white text-base font-medium">
//                     Register
//                   </Text>
//                 )}
//               </TouchableOpacity>
//             )}
//           </View>

//           <View className="flex-row justify-center mt-6">
//             <Text className="text-sm text-gray-500">Already registered? </Text>
//             <TouchableOpacity onPress={() => router.push("/(auth)/Login")}>
//               <Text className="text-sm text-[#1FAD4E] font-medium">
//                 Login here
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// export default FarmerRegistration;

// import axios from "axios";
// import * as DocumentPicker from "expo-document-picker";
// import * as Location from "expo-location";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import { ChevronLeft, ChevronRight, MapPin, Upload, X } from "lucide-react-native";
// import React, { useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   ScrollView,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
//   Image,
// } from "react-native";

// // 🎯 COMPLETE ROLE-BASED REGISTRATION COMPONENT
// // Supports: Farmer (5 steps) | Trader (5 steps) | Transport (5 steps)

// const UnifiedRegistration = () => {
//   const params = useLocalSearchParams();
//   const router = useRouter();
//   const role = (params.role as string) || "farmer";

//   const getTotalSteps = () => (role === "farmer" || role === "trader" || role === "transport" ? 5 : 5);
//   const [currentStep, setCurrentStep] = useState(1);
//   const totalSteps = getTotalSteps();

//   const [formData, setFormData] = useState({
//     personalInfo: { name: "", mobileNo: "", email: "", address: "", villageGramaPanchayat: "", pincode: "", state: "", district: "", taluk: "", post: "" },
//     farmLocation: { latitude: "", longitude: "" },
//     farmLand: { total: "", cultivated: "", uncultivated: "" },
//     businessDetails: { businessName: "", businessType: "", gstNumber: "", tradeLicense: "" },
//     vehicleDetails: { vehicleType: "", vehicleCapacity: "", capacityUnit: "kg", vehicleNumber: "" },
//     driverDetails: { isCompany: false, driverName: "", driverMobileNo: "", driverAge: "" },
//     commodities: [],
//     subcategories: [],
//     nearestMarkets: [],
//     bankDetails: { accountHolderName: "", accountNumber: "", ifscCode: "", branch: "" },
//     documents: { panCard: null, aadharFront: null, aadharBack: null, bankPassbook: null, businessLicense: null, photo: null, businessNameBoard: null, rcBook: null, insuranceDoc: null, pollutionCert: null, permitDoc: null, driverLicense: null, driverPhoto: null },
//     security: { referralCode: "", mpin: "", confirmMpin: "", password: "", confirmPassword: "" },
//   });

//   const [markets, setMarkets] = useState([]);
//   const [subCategories, setSubCategories] = useState([]);
//   const [expandedCategories, setExpandedCategories] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [pincodeLoading, setPincodeLoading] = useState(false);
//   const [error, setError] = useState("");

//   const vehicleTypes = ["Pickup Van", "Bolero", "Tata Ace", "Mini Truck", "Lorry", "Truck", "Container", "Trailer", "Other"];
//   const capacityUnits = ["kg", "ton", "quintal", "boxes"];
//   const businessTypes = ["Retailer", "Wholesaler", "Commission Agent", "Export/Import", "Processing Unit", "Other"];

//   useEffect(() => {
//     if (role === "farmer" || role === "trader") fetchCategories();
//     fetchMarkets();
//   }, [role]);

//   const fetchCategories = async () => {
//     try {
//       const res = await fetch("https://kisan.etpl.ai/category/all");
//       const data = await res.json();
//       setCategories(data.data);
//     } catch (error) { console.error("Error fetching categories:", error); }
//   };

//   const fetchMarkets = async () => {
//     try {
//       const res = await fetch("https://kisan.etpl.ai/api/market/all");
//       const data = await res.json();
//       setMarkets(data.data || data);
//     } catch (error) { console.error("Error fetching markets:", error); }
//   };

//   const fetchSubCategories = async (categoryId) => {
//     try {
//       const res = await fetch(`https://kisan.etpl.ai/subcategory/category/${categoryId}`);
//       const data = await res.json();
//       return data.data || [];
//     } catch (error) { console.error("Error fetching subcategories:", error); return []; }
//   };

//   const fetchPincodeData = async (pincode) => {
//     if (pincode.length !== 6) return;
//     setPincodeLoading(true);
//     try {
//       const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
//       const data = await response.json();
//       if (data[0].Status === "Success" && data[0].PostOffice && data[0].PostOffice.length > 0) {
//         const postOffice = data[0].PostOffice[0];
//         setFormData((prev) => ({
//           ...prev,
//           personalInfo: { ...prev.personalInfo, state: postOffice.State, district: postOffice.District, taluk: postOffice.Block || postOffice.Division, post: postOffice.Name },
//         }));
//       }
//     } catch (error) { console.error("Error fetching pincode data:", error); }
//     finally { setPincodeLoading(false); }
//   };

//   const handlePincodeChange = (pincode) => {
//     setFormData((prev) => ({ ...prev, personalInfo: { ...prev.personalInfo, pincode } }));
//     if (pincode.length === 6) fetchPincodeData(pincode);
//   };

//   const getCurrentLocation = async () => {
//     try {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") { Alert.alert("Permission Denied", "Location permission required."); return; }
//       const location = await Location.getCurrentPositionAsync({});
//       setFormData((prev) => ({ ...prev, farmLocation: { latitude: location.coords.latitude.toString(), longitude: location.coords.longitude.toString() } }));
//       Alert.alert("Success", "Location captured!");
//     } catch (error) { Alert.alert("Error", "Unable to get location."); }
//   };

//   const handleCommodityToggle = async (categoryId) => {
//     const isCurrentlySelected = formData.commodities.includes(categoryId);
//     if (isCurrentlySelected) {
//       setFormData((prev) => ({
//         ...prev,
//         commodities: prev.commodities.filter((id) => id !== categoryId),
//         subcategories: prev.subcategories.filter((subId) => {
//           const sub = subCategories.find((s) => s._id === subId);
//           return sub?.categoryId !== categoryId;
//         }),
//       }));
//       setExpandedCategories((prev) => prev.filter((id) => id !== categoryId));
//     } else {
//       setFormData((prev) => ({ ...prev, commodities: [...prev.commodities, categoryId] }));
//       const subs = await fetchSubCategories(categoryId);
//       setSubCategories((prev) => [...prev, ...subs]);
//       setExpandedCategories((prev) => [...prev, categoryId]);
//     }
//   };

//   const handleSubCategoryToggle = (subCategoryId) => {
//     setFormData((prev) => ({
//       ...prev,
//       subcategories: prev.subcategories.includes(subCategoryId)
//         ? prev.subcategories.filter((id) => id !== subCategoryId)
//         : [...prev.subcategories, subCategoryId],
//     }));
//   };

//   const handleFileChange = async (docType) => {
//     try {
//       const result = await DocumentPicker.getDocumentAsync({ type: ["image/*", "application/pdf"], copyToCacheDirectory: true });
//       if (result.canceled === false && result.assets && result.assets.length > 0) {
//         setFormData((prev) => ({ ...prev, documents: { ...prev.documents, [docType]: result.assets[0] } }));
//       }
//     } catch (error) { Alert.alert("Error", "Failed to pick document."); }
//   };

//   // Validation functions
//   const validateStep1 = () => {
//     setError("");
//     if (!formData.personalInfo.name.trim()) { setError("Please enter your name"); return false; }
//     if (!formData.personalInfo.mobileNo.trim() || formData.personalInfo.mobileNo.length !== 10) { setError("Please enter valid 10-digit mobile number"); return false; }
//     if (!formData.personalInfo.pincode.trim() || formData.personalInfo.pincode.length !== 6) { setError("Please enter valid 6-digit pincode"); return false; }
//     if (!formData.personalInfo.state || !formData.personalInfo.district) { setError("Please wait for location details from pincode"); return false; }
//     if (role === "transport" && !formData.personalInfo.address.trim()) { setError("Please enter your address"); return false; }
//     return true;
//   };

//   const validateStep2 = () => {
//     setError("");
//     if (role === "farmer" && !formData.farmLocation.latitude) { setError("Please pin your farm location"); return false; }
//     if (role === "trader" && !formData.businessDetails.businessName.trim()) { setError("Please enter business name"); return false; }
//     if (role === "transport") {
//       if (!formData.vehicleDetails.vehicleType) { setError("Please select vehicle type"); return false; }
//       if (!formData.vehicleDetails.vehicleNumber.trim()) { setError("Please enter vehicle number"); return false; }
//       if (!formData.documents.rcBook) { setError("Please upload RC Book"); return false; }
//     }
//     return true;
//   };

//   const validateStep3 = () => {
//     setError("");
//     if ((role === "farmer" || role === "trader") && formData.commodities.length === 0) { setError("Please select at least one commodity"); return false; }
//     if (role === "transport" && formData.driverDetails.isCompany) {
//       if (!formData.driverDetails.driverName.trim()) { setError("Please enter driver name"); return false; }
//       if (!formData.driverDetails.driverMobileNo.trim() || formData.driverDetails.driverMobileNo.length !== 10) { setError("Please enter valid 10-digit driver mobile number"); return false; }
//       if (!formData.documents.driverLicense) { setError("Please upload driver license"); return false; }
//     }
//     return true;
//   };

//   const validateStep4 = () => {
//     setError("");
//     if (role === "farmer" || role === "transport") {
//       if (!formData.bankDetails.accountHolderName.trim()) { setError("Please enter account holder name"); return false; }
//       if (!formData.bankDetails.accountNumber.trim()) { setError("Please enter account number"); return false; }
//       if (!formData.bankDetails.ifscCode.trim()) { setError("Please enter IFSC code"); return false; }
//     }
//     return true;
//   };

//   const validateStep5 = () => {
//     setError("");
//     if (!formData.security.mpin || formData.security.mpin.length !== 4) { setError("Please enter 4-digit MPIN"); return false; }
//     if (formData.security.mpin !== formData.security.confirmMpin) { setError("MPIN and Confirm MPIN do not match"); return false; }
//     if (!formData.security.password || formData.security.password.length < 6) { setError("Password must be at least 6 characters"); return false; }
//     if (formData.security.password !== formData.security.confirmPassword) { setError("Passwords do not match"); return false; }
//     return true;
//   };

//   const handleNext = () => {
//     let isValid = false;
//     if (currentStep === 1) isValid = validateStep1();
//     else if (currentStep === 2) isValid = validateStep2();
//     else if (currentStep === 3) isValid = validateStep3();
//     else if (currentStep === 4) isValid = validateStep4();
//     else isValid = true;

//     if (isValid && currentStep < totalSteps) {
//       setCurrentStep(currentStep + 1);
//       setError("");
//     }
//   };

//   const handlePrevious = () => {
//     if (currentStep > 1) {
//       setCurrentStep(currentStep - 1);
//       setError("");
//     }
//   };

//   const handleSubmit = async () => {
//     if (!validateStep5()) return;
//     setLoading(true);

//     try {
//       if (role === "farmer") {
//         const submitFormData = new FormData();
//         submitFormData.append("personalInfo", JSON.stringify(formData.personalInfo));
//         submitFormData.append("farmLocation", JSON.stringify(formData.farmLocation));
//         submitFormData.append("farmLand", JSON.stringify(formData.farmLand));
//         submitFormData.append("commodities", JSON.stringify(formData.commodities));
//         submitFormData.append("subcategories", JSON.stringify(formData.subcategories));
//         submitFormData.append("nearestMarkets", JSON.stringify(formData.nearestMarkets));
//         submitFormData.append("bankDetails", JSON.stringify(formData.bankDetails));
//         submitFormData.append("role", role);
//         submitFormData.append("security", JSON.stringify({
//           referralCode: formData.security.referralCode,
//           mpin: formData.security.mpin,
//           password: formData.security.password
//         }));

//         if (formData.documents.panCard) {
//           submitFormData.append("panCard", {
//             uri: formData.documents.panCard.uri,
//             type: formData.documents.panCard.mimeType || formData.documents.panCard.type,
//             name: formData.documents.panCard.name
//           } as any);
//         }
//         if (formData.documents.aadharFront) {
//           submitFormData.append("aadharFront", {
//             uri: formData.documents.aadharFront.uri,
//             type: formData.documents.aadharFront.mimeType || formData.documents.aadharFront.type,
//             name: formData.documents.aadharFront.name
//           } as any);
//         }
//         if (formData.documents.aadharBack) {
//           submitFormData.append("aadharBack", {
//             uri: formData.documents.aadharBack.uri,
//             type: formData.documents.aadharBack.mimeType || formData.documents.aadharBack.type,
//             name: formData.documents.aadharBack.name
//           } as any);
//         }
//         if (formData.documents.bankPassbook) {
//           submitFormData.append("bankPassbook", {
//             uri: formData.documents.bankPassbook.uri,
//             type: formData.documents.bankPassbook.mimeType || formData.documents.bankPassbook.type,
//             name: formData.documents.bankPassbook.name
//           } as any);
//         }

//         const response = await axios.post("https://kisan.etpl.ai/farmer/register", submitFormData, {
//           headers: { "Content-Type": "multipart/form-data" },
//           timeout: 60000
//         });

//         if (response.status === 200 || response.status === 201) {
//           Alert.alert("Success", "Registration Successful!", [
//             { text: "OK", onPress: () => router.push("/(auth)/Login") }
//           ]);
//         }
//       } else if (role === "trader") {
//         const submitFormData = new FormData();

//         // Flatten personal info for trader (similar structure to farmer)
//         submitFormData.append("personalInfo", JSON.stringify(formData.personalInfo));
//         submitFormData.append("businessDetails", JSON.stringify(formData.businessDetails));
//         submitFormData.append("commodities", JSON.stringify(formData.commodities));
//         submitFormData.append("subcategories", JSON.stringify(formData.subcategories));
//         submitFormData.append("nearestMarkets", JSON.stringify(formData.nearestMarkets));
//         submitFormData.append("role", role);
//         submitFormData.append("security", JSON.stringify({
//           referralCode: formData.security.referralCode,
//           mpin: formData.security.mpin,
//           password: formData.security.password
//         }));

//         // Documents
//         if (formData.documents.panCard) {
//           submitFormData.append("panCard", {
//             uri: formData.documents.panCard.uri,
//             type: formData.documents.panCard.mimeType || formData.documents.panCard.type,
//             name: formData.documents.panCard.name
//           } as any);
//         }
//         if (formData.documents.aadharFront) {
//           submitFormData.append("aadharFront", {
//             uri: formData.documents.aadharFront.uri,
//             type: formData.documents.aadharFront.mimeType || formData.documents.aadharFront.type,
//             name: formData.documents.aadharFront.name
//           } as any);
//         }
//         if (formData.documents.aadharBack) {
//           submitFormData.append("aadharBack", {
//             uri: formData.documents.aadharBack.uri,
//             type: formData.documents.aadharBack.mimeType || formData.documents.aadharBack.type,
//             name: formData.documents.aadharBack.name
//           } as any);
//         }
//         if (formData.documents.businessLicense) {
//           submitFormData.append("businessLicense", {
//             uri: formData.documents.businessLicense.uri,
//             type: formData.documents.businessLicense.mimeType || formData.documents.businessLicense.type,
//             name: formData.documents.businessLicense.name
//           } as any);
//         }
//         if (formData.documents.photo) {
//           submitFormData.append("photo", {
//             uri: formData.documents.photo.uri,
//             type: formData.documents.photo.mimeType || formData.documents.photo.type,
//             name: formData.documents.photo.name
//           } as any);
//         }
//         if (formData.documents.businessNameBoard) {
//           submitFormData.append("businessNameBoard", {
//             uri: formData.documents.businessNameBoard.uri,
//             type: formData.documents.businessNameBoard.mimeType || formData.documents.businessNameBoard.type,
//             name: formData.documents.businessNameBoard.name
//           } as any);
//         }

//         console.log("Sending trader registration...");
//         const response = await axios.post("https://kisan.etpl.ai/trader/register", submitFormData, {
//           headers: { "Content-Type": "multipart/form-data" },
//           timeout: 60000
//         });

//         console.log("Trader response:", response.data);
//         if (response.status === 200 || response.status === 201) {
//           Alert.alert("Success", "Registration Successful!", [
//             { text: "OK", onPress: () => router.push("/(auth)/Login") }
//           ]);
//         }
//       } else if (role === "transport") {
//         const submitFormData = new FormData();

//         // Personal info - structured as nested object (matching API schema)
//         const personalInfo = {
//           name: formData.personalInfo.name.trim(),
//           mobileNo: formData.personalInfo.mobileNo.trim(),
//           email: formData.personalInfo.email.trim() || "",
//           address: formData.personalInfo.address.trim() || "N/A", // Required field
//           village: formData.personalInfo.villageGramaPanchayat.trim() || "",
//           gramPanchayat: formData.personalInfo.villageGramaPanchayat.trim() || "",
//           pincode: formData.personalInfo.pincode.trim(),
//           state: formData.personalInfo.state.trim(),
//           district: formData.personalInfo.district.trim(),
//           taluk: formData.personalInfo.taluk.trim(),
//           post: formData.personalInfo.post.trim() || ""
//         };

//         submitFormData.append("personalInfo", JSON.stringify(personalInfo));

//         // Location - only if available
//         if (formData.farmLocation.latitude && formData.farmLocation.longitude) {
//           submitFormData.append("location", JSON.stringify({
//             latitude: formData.farmLocation.latitude,
//             longitude: formData.farmLocation.longitude
//           }));
//         } else {
//           submitFormData.append("location", JSON.stringify({ latitude: "", longitude: "" }));
//         }

//         // Vehicle details
//         const vehicleDetails = {
//           vehicleType: formData.vehicleDetails.vehicleType.trim(),
//           vehicleCapacity: formData.vehicleDetails.vehicleCapacity.trim() || "0",
//           capacityUnit: formData.vehicleDetails.capacityUnit.trim(),
//           vehicleNumber: formData.vehicleDetails.vehicleNumber.trim()
//         };
//         submitFormData.append("vehicleDetails", JSON.stringify(vehicleDetails));

//         // Vehicle documents
//         if (formData.documents.rcBook) {
//           submitFormData.append("rcBook", {
//             uri: formData.documents.rcBook.uri,
//             type: formData.documents.rcBook.mimeType || formData.documents.rcBook.type || "image/jpeg",
//             name: formData.documents.rcBook.name
//           } as any);
//         }
//         if (formData.documents.insuranceDoc) {
//           submitFormData.append("insuranceDoc", {
//             uri: formData.documents.insuranceDoc.uri,
//             type: formData.documents.insuranceDoc.mimeType || formData.documents.insuranceDoc.type || "image/jpeg",
//             name: formData.documents.insuranceDoc.name
//           } as any);
//         }
//         if (formData.documents.pollutionCert) {
//           submitFormData.append("pollutionCert", {
//             uri: formData.documents.pollutionCert.uri,
//             type: formData.documents.pollutionCert.mimeType || formData.documents.pollutionCert.type || "image/jpeg",
//             name: formData.documents.pollutionCert.name
//           } as any);
//         }
//         if (formData.documents.permitDoc) {
//           submitFormData.append("permitDoc", {
//             uri: formData.documents.permitDoc.uri,
//             type: formData.documents.permitDoc.mimeType || formData.documents.permitDoc.type || "image/jpeg",
//             name: formData.documents.permitDoc.name
//           } as any);
//         }

//         // Driver details
//         const driverDetails = {
//           isCompany: formData.driverDetails.isCompany,
//           driverName: formData.driverDetails.isCompany ? formData.driverDetails.driverName.trim() : "",
//           driverMobileNo: formData.driverDetails.isCompany ? formData.driverDetails.driverMobileNo.trim() : "",
//           driverAge: formData.driverDetails.isCompany ? formData.driverDetails.driverAge.trim() || "0" : "0"
//         };
//         submitFormData.append("driverDetails", JSON.stringify(driverDetails));

//         if (formData.driverDetails.isCompany && formData.documents.driverLicense) {
//           submitFormData.append("driverLicense", {
//             uri: formData.documents.driverLicense.uri,
//             type: formData.documents.driverLicense.mimeType || formData.documents.driverLicense.type || "image/jpeg",
//             name: formData.documents.driverLicense.name
//           } as any);
//         }
//         if (formData.driverDetails.isCompany && formData.documents.driverPhoto) {
//           submitFormData.append("driverPhoto", {
//             uri: formData.documents.driverPhoto.uri,
//             type: formData.documents.driverPhoto.mimeType || formData.documents.driverPhoto.type || "image/jpeg",
//             name: formData.documents.driverPhoto.name
//           } as any);
//         }

//         // Bank details
//         const bankDetails = {
//           accountHolderName: formData.bankDetails.accountHolderName.trim(),
//           bankName: formData.bankDetails.branch.trim() || "",
//           accountNo: formData.bankDetails.accountNumber.trim(),
//           ifscCode: formData.bankDetails.ifscCode.trim(),
//           upiId: ""
//         };
//         submitFormData.append("bankDetails", JSON.stringify(bankDetails));

//         // Security
//         const security = {
//           referralCode: formData.security.referralCode.trim() || "",
//           mpin: formData.security.mpin.trim(),
//           password: formData.security.password.trim()
//         };
//         submitFormData.append("security", JSON.stringify(security));

//         console.log("Sending transport registration...");
//         const response = await axios.post("https://kisan.etpl.ai/transport/register", submitFormData, {
//           headers: { "Content-Type": "multipart/form-data" },
//           timeout: 60000
//         });

//         console.log("Transport response:", response.data);
//         if (response.data.success || response.status === 200 || response.status === 201) {
//           Alert.alert("Success", "Registration Successful!", [
//             {
//               text: "OK",
//               onPress: () => router.push({ pathname: "/Login", params: { role: "transport" } })
//             }
//           ]);
//         }
//       }
//     } catch (error: any) {
//       console.error("Registration error:", error);
//       console.error("Error response:", error?.response?.data);
//       console.error("Error status:", error?.response?.status);

//       let errorMessage = "Registration failed.";
//       if (error?.response?.status === 404) {
//         errorMessage = "Registration endpoint not found. Please check the API URL.";
//       } else if (error?.response?.status === 500) {
//         errorMessage = error?.response?.data?.message || "Server error. Please try again later.";
//       } else if (error?.response?.data?.message) {
//         errorMessage = error.response.data.message;
//       } else if (error?.message) {
//         errorMessage = error.message;
//       }

//       setError(errorMessage);
//       Alert.alert("Registration Failed", errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // === RENDER FUNCTIONS ===

//   const renderProgressBar = () => (
//     <View className="mt-2 mb-6">
//       <View className="flex-row items-center justify-between">
//         {Array.from({ length: totalSteps }, (_, index) => {
//           const step = index + 1;
//           const isCompleted = currentStep > step;
//           const isCurrent = currentStep === step;
//           const isActive = currentStep >= step;
//           return (
//             <View key={step} className="flex-row items-center flex-1">
//               <View className={`w-8 h-8 rounded-full border-2 items-center justify-center bg-white ${isCurrent ? "border-[#1FAD4E] bg-[#1FAD4E]" : isActive ? "border-[#1FAD4E]" : "border-gray-300"}`}>
//                 <Text className={`text-sm font-medium ${isCurrent ? "text-white" : isActive ? "text-[#1FAD4E]" : "text-gray-500"}`}>{step}</Text>
//               </View>
//               {index < totalSteps - 1 && <View className={`h-0.5 mx-1 flex-1 ${isCompleted ? "bg-[#1FAD4E]" : "bg-gray-300"}`} />}
//             </View>
//           );
//         })}
//       </View>
//     </View>
//   );

//   // STEP 1: Personal Info (All Roles)
//   const renderStep1 = () => (
//     <View className="mb-5">
//       <Text className="text-sm font-heading text-[#1FAD4E] mb-4">Personal & Location</Text>
//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">Name <Text className="text-red-500">*</Text></Text>
//         <TextInput className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white" placeholder="Full name" value={formData.personalInfo.name} onChangeText={(text) => setFormData((p) => ({ ...p, personalInfo: { ...p.personalInfo, name: text } }))} />
//       </View>
//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">Mobile <Text className="text-red-500">*</Text></Text>
//         <TextInput className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white" placeholder="10-digit number" keyboardType="phone-pad" maxLength={10} value={formData.personalInfo.mobileNo} onChangeText={(text) => setFormData((p) => ({ ...p, personalInfo: { ...p.personalInfo, mobileNo: text } }))} />
//       </View>
//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">Email (Optional)</Text>
//         <TextInput className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white" placeholder="email@example.com" keyboardType="email-address" autoCapitalize="none" value={formData.personalInfo.email} onChangeText={(text) => setFormData((p) => ({ ...p, personalInfo: { ...p.personalInfo, email: text } }))} />
//       </View>
//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">Address {role === "transport" && <Text className="text-red-500">*</Text>}</Text>
//         <TextInput className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white h-20" placeholder="Full address" multiline numberOfLines={3} value={formData.personalInfo.address} onChangeText={(text) => setFormData((p) => ({ ...p, personalInfo: { ...p.personalInfo, address: text } }))} />
//       </View>
//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">Village / Grama Panchayat</Text>
//         <TextInput className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white" placeholder="Village name" value={formData.personalInfo.villageGramaPanchayat} onChangeText={(text) => setFormData((p) => ({ ...p, personalInfo: { ...p.personalInfo, villageGramaPanchayat: text } }))} />
//       </View>
//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">Pincode <Text className="text-red-500">*</Text></Text>
//         <TextInput className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white" placeholder="6-digit pincode" keyboardType="number-pad" maxLength={6} value={formData.personalInfo.pincode} onChangeText={handlePincodeChange} />
//         {pincodeLoading && <Text className="text-xs text-gray-500 mt-1">Fetching location...</Text>}
//       </View>
//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">State <Text className="text-red-500">*</Text></Text>
//         <TextInput className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-gray-100" value={formData.personalInfo.state} editable={false} placeholder="Auto-filled" />
//       </View>
//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">District <Text className="text-red-500">*</Text></Text>
//         <TextInput className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-gray-100" value={formData.personalInfo.district} editable={false} placeholder="Auto-filled" />
//       </View>
//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">Taluk</Text>
//         <TextInput className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-gray-100" value={formData.personalInfo.taluk} editable={false} placeholder="Auto-filled" />
//       </View>
//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">Post</Text>
//         <TextInput className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-gray-100" value={formData.personalInfo.post} editable={false} placeholder="Auto-filled" />
//       </View>
//     </View>
//   );

//   // STEP 2: Role-specific (Farm/Business/Vehicle)
//   const renderStep2 = () => {
//     if (role === "farmer") {
//       return (
//         <View className="mb-5">
//           <Text className="text-lg font-heading text-[#1FAD4E] mb-4">Farm Details</Text>
//           <View className="mb-3">
//             <Text className="text-sm font-subheading text-gray-800 mb-1.5">Farm Location <Text className="text-red-500">*</Text></Text>
//             <TouchableOpacity className="flex-row items-center bg-green-50 border border-green-200 rounded-lg px-4 py-3" onPress={getCurrentLocation}>
//               <MapPin size={18} color="#1FAD4E" />
//               <Text className="text-green-700 font-medium ml-2">Use Current Location</Text>
//             </TouchableOpacity>
//             {formData.farmLocation.latitude && (
//               <Text className="text-sm text-gray-800 mt-2">{parseFloat(formData.farmLocation.latitude).toFixed(6)}, {parseFloat(formData.farmLocation.longitude).toFixed(6)}</Text>
//             )}
//           </View>
//           <Text className="text-base font-medium text-gray-800 mt-3 mb-3">Farm Land (Acres)</Text>
//           <View className="mb-3">
//             <Text className="text-sm font-subheading text-gray-800 mb-1.5">Total</Text>
//             <TextInput className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white" placeholder="Total acres" keyboardType="decimal-pad" value={formData.farmLand.total} onChangeText={(text) => setFormData((p) => ({ ...p, farmLand: { ...p.farmLand, total: text } }))} />
//           </View>
//           <View className="mb-3">
//             <Text className="text-sm font-subheading text-gray-800 mb-1.5">Cultivated</Text>
//             <TextInput className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white" placeholder="Cultivated acres" keyboardType="decimal-pad" value={formData.farmLand.cultivated} onChangeText={(text) => setFormData((p) => ({ ...p, farmLand: { ...p.farmLand, cultivated: text } }))} />
//           </View>
//           <View className="mb-3">
//             <Text className="text-sm font-subheading text-gray-800 mb-1.5">Uncultivated</Text>
//             <TextInput className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white" placeholder="Uncultivated acres" keyboardType="decimal-pad" value={formData.farmLand.uncultivated} onChangeText={(text) => setFormData((p) => ({ ...p, farmLand: { ...p.farmLand, uncultivated: text } }))} />
//           </View>
//           <Text className="text-base font-medium text-gray-800 mt-4 mb-3">Nearest Markets</Text>
//           {markets.map((market) => (
//             <TouchableOpacity key={market._id} onPress={() => setFormData((prev) => ({ ...prev, nearestMarkets: prev.nearestMarkets.includes(market._id) ? prev.nearestMarkets.filter((id) => id !== market._id) : [...prev.nearestMarkets, market._id] }))} className="flex-row items-center mb-3">
//               <View className={`w-5 h-5 rounded-md border-2 mr-3 items-center justify-center ${formData.nearestMarkets.includes(market._id) ? "bg-[#1FAD4E] border-[#1FAD4E]" : "border-gray-300"}`}>
//                 {formData.nearestMarkets.includes(market._id) && <Text className="text-xs font-bold text-white">✓</Text>}
//               </View>
//               <View className="flex-1">
//                 <Text className="text-sm font-medium text-gray-800">{market.marketName}</Text>
//                 <Text className="text-xs text-gray-500">{market.exactAddress}</Text>
//               </View>
//             </TouchableOpacity>
//           ))}
//         </View>
//       );
//     } else if (role === "trader") {
//       return (
//         <View className="mb-5">
//           <Text className="text-lg font-heading text-[#1FAD4E] mb-4">Business Details</Text>
//           <View className="mb-3">
//             <Text className="text-sm font-subheading text-gray-800 mb-1.5">Business Name <Text className="text-red-500">*</Text></Text>
//             <TextInput className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white" placeholder="Enter business name" value={formData.businessDetails.businessName} onChangeText={(text) => setFormData((p) => ({ ...p, businessDetails: { ...p.businessDetails, businessName: text } }))} />
//           </View>
//           <View className="mb-3">
//             <Text className="text-sm font-subheading text-gray-800 mb-1.5">Business Type</Text>
//             <ScrollView className="border border-gray-300 rounded-lg max-h-48">
//               {businessTypes.map((type) => (
//                 <TouchableOpacity key={type} className={`p-3 border-b border-gray-100 ${formData.businessDetails.businessType === type ? "bg-green-50" : ""}`} onPress={() => setFormData((prev) => ({ ...prev, businessDetails: { ...prev.businessDetails, businessType: type } }))}>
//                   <Text className={`text-sm ${formData.businessDetails.businessType === type ? "text-[#1FAD4E] font-medium" : "text-gray-800"}`}>{type}</Text>
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
//           </View>
//           <View className="mb-3">
//             <Text className="text-sm font-subheading text-gray-800 mb-1.5">GST Number (Optional)</Text>
//             <TextInput className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white" placeholder="GST Number" autoCapitalize="characters" value={formData.businessDetails.gstNumber} onChangeText={(text) => setFormData((p) => ({ ...p, businessDetails: { ...p.businessDetails, gstNumber: text } }))} />
//           </View>
//           <View className="mb-3">
//             <Text className="text-sm font-subheading text-gray-800 mb-1.5">Trade License (Optional)</Text>
//             <TextInput className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white" placeholder="License number" value={formData.businessDetails.tradeLicense} onChangeText={(text) => setFormData((p) => ({ ...p, businessDetails: { ...p.businessDetails, tradeLicense: text } }))} />
//           </View>
//         </View>
//       );
//     } else if (role === "transport") {
//       return (
//         <View className="mb-5">
//           <Text className="text-lg font-heading text-[#1FAD4E] mb-4">Vehicle Details</Text>
//           <View className="mb-3">
//             <Text className="text-sm font-subheading text-gray-800 mb-1.5">Vehicle Type <Text className="text-red-500">*</Text></Text>
//             <ScrollView className="border border-gray-300 rounded-lg max-h-48">
//               {vehicleTypes.map((type) => (
//                 <TouchableOpacity key={type} className={`p-3 border-b border-gray-100 ${formData.vehicleDetails.vehicleType === type ? "bg-green-50" : ""}`} onPress={() => setFormData((prev) => ({ ...prev, vehicleDetails: { ...prev.vehicleDetails, vehicleType: type } }))}>
//                   <Text className={`text-sm ${formData.vehicleDetails.vehicleType === type ? "text-[#1FAD4E] font-medium" : "text-gray-800"}`}>{type}</Text>
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
//           </View>
//           <View className="mb-3">
//             <Text className="text-sm font-subheading text-gray-800 mb-1.5">Vehicle Capacity</Text>
//             <View className="flex-row gap-2">
//               <TextInput className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white" placeholder="Capacity" keyboardType="numeric" value={formData.vehicleDetails.vehicleCapacity} onChangeText={(text) => setFormData((p) => ({ ...p, vehicleDetails: { ...p.vehicleDetails, vehicleCapacity: text } }))} />
//               <ScrollView className="w-24 border border-gray-300 rounded-lg max-h-32">
//                 {capacityUnits.map((unit) => (
//                   <TouchableOpacity key={unit} className={`p-2 border-b border-gray-100 ${formData.vehicleDetails.capacityUnit === unit ? "bg-green-50" : ""}`} onPress={() => setFormData((prev) => ({ ...prev, vehicleDetails: { ...prev.vehicleDetails, capacityUnit: unit } }))}>
//                     <Text className={`text-xs text-center ${formData.vehicleDetails.capacityUnit === unit ? "text-[#1FAD4E] font-medium" : "text-gray-800"}`}>{unit}</Text>
//                   </TouchableOpacity>
//                 ))}
//               </ScrollView>
//             </View>
//           </View>
//           <View className="mb-3">
//             <Text className="text-sm font-subheading text-gray-800 mb-1.5">Vehicle Number <Text className="text-red-500">*</Text></Text>
//             <TextInput className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white" placeholder="e.g., KA01AB1234" autoCapitalize="characters" value={formData.vehicleDetails.vehicleNumber} onChangeText={(text) => setFormData((p) => ({ ...p, vehicleDetails: { ...p.vehicleDetails, vehicleNumber: text } }))} />
//           </View>
//           <Text className="text-base font-medium text-gray-800 mt-4 mb-3">Vehicle Documents</Text>
//           <View className="border border-dashed border-gray-300 rounded-xl p-4 mb-4 bg-white">
//             <View className="flex-row items-center justify-between">
//               <View className="flex-1">
//                 <Text className="text-sm font-medium text-gray-900">RC Book <Text className="text-red-500">*</Text></Text>
//                 {formData.documents.rcBook?.name && <Text className="text-[11px] text-[#1FAD4E] mt-1">✅ {formData.documents.rcBook.name}</Text>}
//               </View>
//               <TouchableOpacity onPress={() => handleFileChange("rcBook")} className="border border-[#1FAD4E] px-4 py-2 rounded-lg">
//                 <Text className="text-[#1FAD4E] text-xs font-medium">Upload</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//           <View className="border border-dashed border-gray-300 rounded-xl p-4 mb-4 bg-white">
//             <View className="flex-row items-center justify-between">
//               <View className="flex-1">
//                 <Text className="text-sm font-medium text-gray-900">Insurance (Optional)</Text>
//                 {formData.documents.insuranceDoc?.name && <Text className="text-[11px] text-[#1FAD4E] mt-1">✅ {formData.documents.insuranceDoc.name}</Text>}
//               </View>
//               <TouchableOpacity onPress={() => handleFileChange("insuranceDoc")} className="border border-[#1FAD4E] px-4 py-2 rounded-lg">
//                 <Text className="text-[#1FAD4E] text-xs font-medium">Upload</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       );
//     }
//   };

//   // STEP 3: Commodities (Farmer/Trader) OR Driver (Transport)
//   const renderStep3 = () => {
//     if (role === "farmer" || role === "trader") {
//       return (
//         <View className="mb-5">
//           <Text className="text-lg font-heading text-[#1FAD4E] mb-4">Commodities</Text>
//           {categories.map((cat) => (
//             <View key={cat._id} className="border border-gray-200 rounded-lg p-3 mb-3">
//               <TouchableOpacity className="flex-row items-center" onPress={() => handleCommodityToggle(cat._id)}>
//                 <View className={`w-5 h-5 rounded-md border-2 mr-3 items-center justify-center ${formData.commodities.includes(cat._id) ? "bg-[#1FAD4E] border-[#1FAD4E]" : "border-gray-300"}`}>
//                   {formData.commodities.includes(cat._id) && <Text className="text-xs font-bold text-white">✓</Text>}
//                 </View>
//                 {cat.image && <Image source={{ uri: `https://kisan.etpl.ai/uploads/${cat.image}` }} className="w-10 h-10 rounded mr-3" resizeMode="cover" />}
//                 <Text className="text-sm text-gray-800 flex-1">{cat.categoryName}</Text>
//               </TouchableOpacity>
//               {formData.commodities.includes(cat._id) && expandedCategories.includes(cat._id) && (
//                 <View className="ml-8 mt-3 pl-3 border-l-2 border-green-200">
//                   {subCategories.filter((sub) => sub.categoryId === cat._id).map((subCat) => (
//                     <TouchableOpacity key={subCat._id} onPress={() => handleSubCategoryToggle(subCat._id)} className="flex-row items-center mb-2">
//                       <View className={`w-4 h-4 rounded border-2 mr-2 items-center justify-center ${formData.subcategories.includes(subCat._id) ? "bg-[#1FAD4E] border-[#1FAD4E]" : "border-gray-300"}`}>
//                         {formData.subcategories.includes(subCat._id) && <Text className="text-[10px] font-bold text-white">✓</Text>}
//                       </View>
//                       {subCat.image && <Image source={{ uri: `https://kisan.etpl.ai/uploads/${subCat.image}` }} className="w-8 h-8 rounded mr-2" resizeMode="cover" />}
//                       <Text className="text-xs text-gray-600 flex-1">{subCat.subCategoryName}</Text>
//                     </TouchableOpacity>
//                   ))}
//                 </View>
//               )}
//             </View>
//           ))}
//         </View>
//       );
//     } else if (role === "transport") {
//       return (
//         <View className="mb-5">
//           <Text className="text-lg font-heading text-[#1FAD4E] mb-4">Driver Details</Text>
//           <TouchableOpacity className="flex-row items-center mb-4" onPress={() => setFormData((prev) => ({ ...prev, driverDetails: { ...prev.driverDetails, isCompany: !prev.driverDetails.isCompany } }))}>
//             <View className={`w-5 h-5 rounded border-2 mr-3 items-center justify-center ${formData.driverDetails.isCompany ? "bg-[#1FAD4E] border-[#1FAD4E]" : "border-gray-300"}`}>
//               {formData.driverDetails.isCompany && <Text className="text-xs font-bold text-white">✓</Text>}
//             </View>
//             <Text className="text-sm text-gray-800">I am a transport company (with drivers)</Text>
//           </TouchableOpacity>
//           {formData.driverDetails.isCompany && (
//             <View className="bg-gray-50 rounded-lg border border-gray-200 p-4">
//               <View className="mb-3">
//                 <Text className="text-sm font-subheading text-gray-800 mb-1.5">Driver Name <Text className="text-red-500">*</Text></Text>
//                 <TextInput className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white" placeholder="Enter driver name" value={formData.driverDetails.driverName} onChangeText={(text) => setFormData((p) => ({ ...p, driverDetails: { ...p.driverDetails, driverName: text } }))} />
//               </View>
//               <View className="mb-3">
//                 <Text className="text-sm font-subheading text-gray-800 mb-1.5">Driver Mobile <Text className="text-red-500">*</Text></Text>
//                 <TextInput className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white" placeholder="10-digit mobile" keyboardType="phone-pad" maxLength={10} value={formData.driverDetails.driverMobileNo} onChangeText={(text) => setFormData((p) => ({ ...p, driverDetails: { ...p.driverDetails, driverMobileNo: text } }))} />
//               </View>
//               <View className="mb-3">
//                 <Text className="text-sm font-subheading text-gray-800 mb-1.5">Driver Age</Text>
//                 <TextInput className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white" placeholder="Age" keyboardType="numeric" value={formData.driverDetails.driverAge} onChangeText={(text) => setFormData((p) => ({ ...p, driverDetails: { ...p.driverDetails, driverAge: text } }))} />
//               </View>
//               <View className="border border-dashed border-gray-300 rounded-xl p-4 mb-4 bg-white">
//                 <View className="flex-row items-center justify-between">
//                   <View className="flex-1">
//                     <Text className="text-sm font-medium text-gray-900">Driving License <Text className="text-red-500">*</Text></Text>
//                     {formData.documents.driverLicense?.name && <Text className="text-[11px] text-[#1FAD4E] mt-1">✅ {formData.documents.driverLicense.name}</Text>}
//                   </View>
//                   <TouchableOpacity onPress={() => handleFileChange("driverLicense")} className="border border-[#1FAD4E] px-4 py-2 rounded-lg">
//                     <Text className="text-[#1FAD4E] text-xs font-medium">Upload</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//               <View className="border border-dashed border-gray-300 rounded-xl p-4 bg-white">
//                 <View className="flex-row items-center justify-between">
//                   <View className="flex-1">
//                     <Text className="text-sm font-medium text-gray-900">Driver Photo (Optional)</Text>
//                     {formData.documents.driverPhoto?.name && <Text className="text-[11px] text-[#1FAD4E] mt-1">✅ {formData.documents.driverPhoto.name}</Text>}
//                   </View>
//                   <TouchableOpacity onPress={() => handleFileChange("driverPhoto")} className="border border-[#1FAD4E] px-4 py-2 rounded-lg">
//                     <Text className="text-[#1FAD4E] text-xs font-medium">Upload</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </View>
//           )}
//         </View>
//       );
//     }
//   };

//   // STEP 4: Bank (Farmer/Transport) OR Documents (Trader)
//   const renderStep4 = () => {
//     if (role === "farmer" || role === "transport") {
//       return (
//         <View className="mb-5">
//           <Text className="text-lg font-heading text-[#1FAD4E] mb-4">Bank Details</Text>
//           <View className="mb-3">
//             <Text className="text-sm font-subheading text-gray-800 mb-1.5">Account Holder Name <Text className="text-red-500">*</Text></Text>
//             <TextInput className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white" placeholder="Name" value={formData.bankDetails.accountHolderName} onChangeText={(text) => setFormData((p) => ({ ...p, bankDetails: { ...p.bankDetails, accountHolderName: text } }))} />
//           </View>
//           <View className="mb-3">
//             <Text className="text-sm font-subheading text-gray-800 mb-1.5">Account Number <Text className="text-red-500">*</Text></Text>
//             <TextInput className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white" placeholder="Number" keyboardType="number-pad" value={formData.bankDetails.accountNumber} onChangeText={(text) => setFormData((p) => ({ ...p, bankDetails: { ...p.bankDetails, accountNumber: text } }))} />
//           </View>
//           <View className="mb-3">
//             <Text className="text-sm font-subheading text-gray-800 mb-1.5">IFSC Code <Text className="text-red-500">*</Text></Text>
//             <TextInput className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white" placeholder="IFSC" autoCapitalize="characters" value={formData.bankDetails.ifscCode} onChangeText={(text) => setFormData((p) => ({ ...p, bankDetails: { ...p.bankDetails, ifscCode: text } }))} />
//           </View>
//           <View className="mb-3">
//             <Text className="text-sm font-subheading text-gray-800 mb-1.5">Branch</Text>
//             <TextInput className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white" placeholder="Branch name" value={formData.bankDetails.branch} onChangeText={(text) => setFormData((p) => ({ ...p, bankDetails: { ...p.bankDetails, branch: text } }))} />
//           </View>
//         </View>
//       );
//     } else if (role === "trader") {
//       return (
//         <View className="mb-5">
//           <Text className="text-lg font-heading text-[#1FAD4E] mb-4">Documents (Optional)</Text>
//           {[
//             { key: "panCard", label: "PAN Card / ID" },
//             { key: "aadharFront", label: "Aadhaar Front" },
//             { key: "aadharBack", label: "Aadhaar Back" },
//             { key: "businessLicense", label: "Business License" },
//             { key: "photo", label: "Photo" },
//             { key: "businessNameBoard", label: "Business Name Board" },
//           ].map((doc) => (
//             <View key={doc.key} className="border border-dashed border-gray-300 rounded-xl p-4 mb-4 bg-white">
//               <View className="flex-row items-center justify-between">
//                 <View className="flex-1">
//                   <Text className="text-sm font-medium text-gray-900">{doc.label}</Text>
//                   {formData.documents[doc.key]?.name && <Text className="text-[11px] text-[#1FAD4E] mt-1">✅ {formData.documents[doc.key].name}</Text>}
//                 </View>
//                 <TouchableOpacity onPress={() => handleFileChange(doc.key)} className="border border-[#1FAD4E] px-4 py-2 rounded-lg">
//                   <Text className="text-[#1FAD4E] text-xs font-medium">Upload</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           ))}
//         </View>
//       );
//     }
//   };

//   // STEP 5: Security (All Roles)
//   const renderStep5 = () => (
//     <View className="mb-5">
//       <Text className="text-lg font-heading text-[#1FAD4E] mb-4">Security</Text>
//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">Referral Code (Optional)</Text>
//         <TextInput className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white" placeholder="Referral code" value={formData.security.referralCode} onChangeText={(text) => setFormData((p) => ({ ...p, security: { ...p.security, referralCode: text } }))} />
//       </View>
//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">4-Digit MPIN <Text className="text-red-500">*</Text></Text>
//         <TextInput className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white" keyboardType="number-pad" maxLength={4} secureTextEntry placeholder="****" value={formData.security.mpin} onChangeText={(text) => setFormData((p) => ({ ...p, security: { ...p.security, mpin: text } }))} />
//       </View>
//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">Confirm MPIN <Text className="text-red-500">*</Text></Text>
//         <TextInput className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white" keyboardType="number-pad" maxLength={4} secureTextEntry placeholder="****" value={formData.security.confirmMpin} onChangeText={(text) => setFormData((p) => ({ ...p, security: { ...p.security, confirmMpin: text } }))} />
//       </View>
//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">Password <Text className="text-red-500">*</Text></Text>
//         <TextInput className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white" secureTextEntry maxLength={20} placeholder="Password" value={formData.security.password} onChangeText={(text) => setFormData((p) => ({ ...p, security: { ...p.security, password: text } }))} />
//         <Text className="text-xs text-gray-500 mt-1">Min 6 characters</Text>
//       </View>
//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">Confirm Password <Text className="text-red-500">*</Text></Text>
//         <TextInput className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white" secureTextEntry maxLength={20} placeholder="Confirm" value={formData.security.confirmPassword} onChangeText={(text) => setFormData((p) => ({ ...p, security: { ...p.security, confirmPassword: text } }))} />
//       </View>
//     </View>
//   );

//   return (
//     <View className="flex-1 bg-white py-10">
//       <View className="absolute -top-24 -left-40 w-72 h-72 rounded-full bg-[#E8FDEB]" />
//       <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" className="px-4 py-4">
//         <View className="p-5">
//           <View className="items-center mb-5">
//             <Text className="text-2xl text-[#1FAD4E] font-medium">
//               {role === "farmer" ? "Farmer" : role === "trader" ? "Trader" : "Transport"} Registration
//             </Text>
//             <Text className="text-xs text-gray-500 mt-1">Step {currentStep} of {totalSteps}</Text>
//           </View>

//           {renderProgressBar()}

//           {currentStep === 1 && renderStep1()}
//           {currentStep === 2 && renderStep2()}
//           {currentStep === 3 && renderStep3()}
//           {currentStep === 4 && renderStep4()}
//           {currentStep === 5 && renderStep5()}

//           {error ? (
//             <View className="bg-red-100 px-3 py-2.5 rounded-lg mt-2">
//               <Text className="text-sm text-red-700 text-center">{error}</Text>
//             </View>
//           ) : null}

//           <View className="flex-row justify-between mt-5 gap-3">
//             {currentStep > 1 && (
//               <TouchableOpacity onPress={handlePrevious} className="flex-row items-center px-4 py-3 rounded-lg border border-[#1FAD4E] bg-white flex-1 justify-center">
//                 <ChevronLeft size={20} color="#1FAD4E" />
//                 <Text className="text-[#1FAD4E] text-base font-medium ml-2">Previous</Text>
//               </TouchableOpacity>
//             )}

//             {currentStep < totalSteps ? (
//               <TouchableOpacity onPress={handleNext} className={`flex-row items-center px-4 py-3 rounded-lg flex-1 justify-center bg-[#1FAD4E]`}>
//                 <Text className="text-white text-base font-medium mr-2">Save & Next</Text>
//                 <ChevronRight size={20} color="#fff" />
//               </TouchableOpacity>
//             ) : (
//               <TouchableOpacity onPress={handleSubmit} disabled={loading} className={`flex-row items-center px-4 py-3 rounded-lg flex-1 justify-center bg-[#1FAD4E] ${loading ? "opacity-70" : ""}`}>
//                 {loading ? (
//                   <View className="flex-row items-center">
//                     <ActivityIndicator color="#fff" size="small" />
//                     <Text className="text-white text-base font-medium ml-2">Registering...</Text>
//                   </View>
//                 ) : (
//                   <Text className="text-white text-base font-medium">Register</Text>
//                 )}
//               </TouchableOpacity>
//             )}
//           </View>

//           <View className="flex-row justify-center mt-6">
//             <Text className="text-sm text-gray-500">Already registered? </Text>
//             <TouchableOpacity onPress={() => router.push("/(auth)/Login")}>
//               <Text className="text-sm text-[#1FAD4E] font-medium">Login here</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// export default UnifiedRegistration





// import axios from "axios";
// import * as DocumentPicker from "expo-document-picker";
// import * as Location from "expo-location";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import {
//   ChevronLeft,
//   ChevronRight,
//   MapPin,
//   Upload
// } from "lucide-react-native";
// import React, { useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Image,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View
// } from "react-native";


// interface Category {
//   _id: string;
//   categoryName: string;
//   image?: string;
// }

// interface Market {
//   id: string;
//   name: string;
// }
// interface SubCategory {
//   _id: string;
//   subCategoryName: string;
//   categoryId: string;
//   image?: string;
// }
// interface FormData {
//   personalInfo: {
//     name: string;
//     mobileNo: string;
//     email: string;
//     address: string;
//     villageGramaPanchayat: string;
//     pincode: string;
//     state: string;
//     district: string;
//     taluk: string;
//     post: string;
//   };
//   farmLocation: {
//     latitude: string;
//     longitude: string;
//   };
//   farmLand: {
//     total: string;
//     cultivated: string;
//     uncultivated: string;
//   };
//   commodities: string[];
//   subcategories: string[];
//   nearestMarkets: string[];
//   bankDetails: {
//     accountHolderName: string;
//     accountNumber: string;
//     ifscCode: string;
//     branch: string;
//   };
//   documents: {
//     panCard: any;
//     aadharFront: any;
//     aadharBack: any;
//     bankPassbook: any;
//   };
//   security: {
//     referralCode: string;
//     mpin: string;
//     confirmMpin: string;
//     password: string;
//     confirmPassword: string;
//   };
// }

// const FarmerRegistration: React.FC = () => {
//   const params = useLocalSearchParams();
//   const router = useRouter();
//   const role = (params.role as string) || "farmer";
//   console.log(role);

//   const [currentStep, setCurrentStep] = useState(1);
//   const totalSteps = 5;

//   const [formData, setFormData] = useState<FormData>({
//     personalInfo: {
//       name: "",
//       mobileNo: "",
//       email: "",
//       address: "",
//       villageGramaPanchayat: "",
//       pincode: "",
//       state: "",
//       district: "",
//       taluk: "",
//       post: "",
//     },
//     farmLocation: {
//       latitude: "",
//       longitude: "",
//     },
//     farmLand: {
//       total: "",
//       cultivated: "",
//       uncultivated: "",
//     },

    
//     commodities: [],
//     subcategories: [],
//     nearestMarkets: [], // Already correct as string array
//     bankDetails: {
//       accountHolderName: "",
//       accountNumber: "",
//       ifscCode: "",
//       branch: "",
//     },
//     documents: {
//       panCard: null,
//       aadharFront: null,
//       aadharBack: null,
//       bankPassbook: null,
//     },
//     security: {
//       referralCode: "",
//       mpin: "",
//       confirmMpin: "",
//       password: "",
//       confirmPassword: "",
//     },
//   });

//   const [markets, setMarkets] = useState<any[]>([]);
//   const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
//   const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [newMarket, setNewMarket] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [pincodeLoading, setPincodeLoading] = useState(false);
//   const [error, setError] = useState("");
//   const DOCUMENTS_BY_ROLE = {
//     farmer: [
//       { key: "panCard", label: "Upload PAN Card / ID" },
//       { key: "aadharFront", label: "Upload Aadhaar Front" },
//       { key: "aadharBack", label: "Upload Aadhaar Back" },
//       { key: "bankPassbook", label: "Upload Bank Passbook" },
//     ],
//     trader: [
//       { key: "panCard", label: "Upload PAN Card / ID" },
//       { key: "aadharFront", label: "Upload Aadhaar Front" },
//       { key: "aadharBack", label: "Upload Aadhaar Back" },
//       { key: "businessLicense", label: "Upload Business License" },
//       { key: "photo", label: "Upload Photo" },
//       { key: "businessNameBoard", label: "Upload Business Name Board" },
//     ],
//   };

//   useEffect(() => {
//     fetchCategories();
//     fetchMarkets(); // ADD THIS
//   }, []);

//   const fetchCategories = async () => {
//     try {
//       const res = await fetch("https://kisan.etpl.ai/category/all");
//       const data = await res.json();
//       setCategories(data.data);
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//     }
//   };

//   const fetchMarkets = async () => {
//     try {
//       const res = await fetch("https://kisan.etpl.ai/api/market/all");
//       const data = await res.json();
//       setMarkets(data.data || data);
//     } catch (error) {
//       console.error("Error fetching markets:", error);
//     }
//   };

//   const fetchSubCategories = async (categoryId: string) => {
//     try {
//       const res = await fetch(
//         `https://kisan.etpl.ai/subcategory/category/${categoryId}`
//       );
//       const data = await res.json();
//       return data.data || [];
//     } catch (error) {
//       console.error("Error fetching subcategories:", error);
//       return [];
//     }
//   };
//   const fetchPincodeData = async (pincode: string) => {
//     if (pincode.length !== 6) return;
//     setPincodeLoading(true);
//     try {
//       const response = await fetch(
//         `https://api.postalpincode.in/pincode/${pincode}`
//       );
//       const data = await response.json();
//       if (
//         data[0].Status === "Success" &&
//         data[0].PostOffice &&
//         data[0].PostOffice.length > 0
//       ) {
//         const postOffice = data[0].PostOffice[0];
//         setFormData((prev) => ({
//           ...prev,
//           personalInfo: {
//             ...prev.personalInfo,
//             state: postOffice.State,
//             district: postOffice.District,
//             taluk: postOffice.Block || postOffice.Division,
//             post: postOffice.Name,
//           },
//         }));
//       }
//     } catch (error) {
//       console.error("Error fetching pincode data:", error);
//     } finally {
//       setPincodeLoading(false);
//     }
//   };

//   const handlePincodeChange = (pincode: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       personalInfo: { ...prev.personalInfo, pincode },
//     }));
//     if (pincode.length === 6) fetchPincodeData(pincode);
//   };

//   const getCurrentLocation = async () => {
//     try {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         Alert.alert("Permission Denied", "Location permission required.");
//         return;
//       }
//       const location = await Location.getCurrentPositionAsync({});
//       setFormData((prev) => ({
//         ...prev,
//         farmLocation: {
//           latitude: location.coords.latitude.toString(),
//           longitude: location.coords.longitude.toString(),
//         },
//       }));
//       Alert.alert("Success", "Location captured!");
//     } catch (error) {
//       Alert.alert("Error", "Unable to get location.");
//     }
//   };

//   const handleCommodityToggle = async (categoryId: string) => {
//     const isCurrentlySelected = formData.commodities.includes(categoryId);

//     if (isCurrentlySelected) {
//       // Remove category and its subcategories
//       setFormData((prev) => ({
//         ...prev,
//         commodities: prev.commodities.filter((id) => id !== categoryId),
//         subcategories: prev.subcategories.filter((subId) => {
//           const sub = subCategories.find((s) => s._id === subId);
//           return sub?.categoryId !== categoryId;
//         }),
//       }));
//       setExpandedCategories((prev) => prev.filter((id) => id !== categoryId));
//     } else {
//       // Add category and fetch subcategories
//       setFormData((prev) => ({
//         ...prev,
//         commodities: [...prev.commodities, categoryId],
//       }));

//       const subs = await fetchSubCategories(categoryId);
//       setSubCategories((prev) => [...prev, ...subs]);
//       setExpandedCategories((prev) => [...prev, categoryId]);
//     }
//   };

//   const handleSubCategoryToggle = (subCategoryId: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       subcategories: prev.subcategories.includes(subCategoryId)
//         ? prev.subcategories.filter((id) => id !== subCategoryId)
//         : [...prev.subcategories, subCategoryId],
//     }));
//   };

//   const removeMarket = (id: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       nearestMarkets: prev.nearestMarkets.filter((m) => m.id !== id),
//     }));
//   };

//   const handleFileChange = async (docType: keyof FormData["documents"]) => {
//     try {
//       const result = await DocumentPicker.getDocumentAsync({
//         type: ["image/*", "application/pdf"],
//         copyToCacheDirectory: true,
//       });

//       if (
//         result.canceled === false &&
//         result.assets &&
//         result.assets.length > 0
//       ) {
//         setFormData((prev) => ({
//           ...prev,
//           documents: {
//             ...prev.documents,
//             [docType]: result.assets[0],
//           },
//         }));
//       }
//     } catch (error) {
//       Alert.alert("Error", "Failed to pick document.");
//     }
//   };

//   const validateStep1 = () => {
//     setError("");
//     if (!formData.personalInfo.name.trim()) {
//       setError("Please enter your name");
//       return false;
//     }
//     if (
//       !formData.personalInfo.mobileNo.trim() ||
//       formData.personalInfo.mobileNo.length !== 10
//     ) {
//       setError("Please enter valid 10-digit mobile number");
//       return false;
//     }
//     if (
//       !formData.personalInfo.pincode.trim() ||
//       formData.personalInfo.pincode.length !== 6
//     ) {
//       setError("Please enter valid 6-digit pincode");
//       return false;
//     }
//     if (!formData.personalInfo.state || !formData.personalInfo.district) {
//       setError("Please wait for location details from pincode");
//       return false;
//     }
//     return true;
//   };

//   const validateStep2 = () => {
//     setError("");
//     if (role === "farmer" && !formData.farmLocation.latitude) {
//       setError("Please pin your farm location");
//       return false;
//     }
//     return true;
//   };

//   const validateStep3 = () => {
//     setError("");
//     if (formData.commodities.length === 0) {
//       setError("Please select at least one commodity");
//       return false;
//     }
//     return true;
//   };

//   const validateStep5 = () => {
//     setError("");
//     if (!formData.security.mpin || formData.security.mpin.length !== 4) {
//       setError("Please enter 4-digit MPIN");
//       return false;
//     }
//     if (formData.security.mpin !== formData.security.confirmMpin) {
//       setError("MPIN and Confirm MPIN do not match");
//       return false;
//     }
//     if (!formData.security.password || formData.security.password.length < 6) {
//       setError("Password must be at least 6 characters");
//       return false;
//     }
//     if (formData.security.password !== formData.security.confirmPassword) {
//       setError("Passwords do not match");
//       return false;
//     }
//     return true;
//   };

//   const handleNext = () => {
//     let isValid = false;
//     if (currentStep === 1) isValid = validateStep1();
//     else if (currentStep === 2) isValid = validateStep2();
//     else if (currentStep === 3) isValid = validateStep3();
//     else isValid = true;

//     if (isValid && currentStep < totalSteps) {
//       setCurrentStep(currentStep + 1);
//       setError("");
//     }
//   };

//   const handlePrevious = () => {
//     if (currentStep > 1) {
//       setCurrentStep(currentStep - 1);
//       setError("");
//     }
//   };


//   const handleSubmit = async () => {
//     try {
//       if (!validateStep5()) return;

//       setLoading(true);
//       setError("");

//       console.log("🚀 SUBMIT STARTED");
//       console.log("Role:", role);

//       const submitFormData = new FormData();

//       // -------- Append JSON fields --------
//       submitFormData.append(
//         "personalInfo",
//         JSON.stringify(formData.personalInfo)
//       );
//       submitFormData.append(
//         "farmLocation",
//         JSON.stringify(formData.farmLocation)
//       );
//       submitFormData.append("farmLand", JSON.stringify(formData.farmLand));
//       submitFormData.append(
//         "commodities",
//         JSON.stringify(formData.commodities)
//       );
//       submitFormData.append(
//         "nearestMarkets",
//         JSON.stringify(formData.nearestMarkets)
//       );
//       submitFormData.append(
//         "bankDetails",
//         JSON.stringify(formData.bankDetails)
//       );
//       submitFormData.append(
//         "subcategories",
//         JSON.stringify(formData.subcategories)
//       );
//       submitFormData.append("role", role);

//       submitFormData.append(
//         "security",
//         JSON.stringify({
//           referralCode: formData.security.referralCode,
//           mpin: formData.security.mpin,
//           password: formData.security.password,
//         })
//       );

//       // -------- Append Files Safely --------
//       const addFile = (key: string, file: any) => {
//         if (!file) return;

//         submitFormData.append(key, {
//           uri: file.uri,
//           type: file.mimeType || "image/jpeg",
//           name: file.name || `${key}.jpg`,
//         } as any);
//       };

//       addFile("panCard", formData.documents.panCard);
//       addFile("aadharFront", formData.documents.aadharFront);
//       addFile("aadharBack", formData.documents.aadharBack);
//       addFile("bankPassbook", formData.documents.bankPassbook);

//       // Debug log FormData
//       console.log("📨 FINAL PAYLOAD:");
//       // React Native trick to print FormData
//       // @ts-ignore
//       submitFormData._parts?.forEach((p: any) => console.log(p));

//       console.log("🌐 Sending request...");

//       const response = await axios.post(
//         "https://kisan.etpl.ai/farmer/register",
//         submitFormData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//           timeout: 60000,
//         }
//       );

//       console.log("✅ RESPONSE RECEIVED:", response.status, response.data);

//       if (
//         response.status === 200 ||
//         response.status === 201 ||
//         response.data.success
//       ) {
//         Alert.alert("Success", "Registration Successful!", [
//           { text: "OK", onPress: () => router.push("/(auth)/Login") },
//         ]);
//       } else {
//         setError(response.data?.message || "Registration failed. Try again.");
//       }
//     } catch (error: any) {
//       console.log("❌ REGISTRATION ERROR:", error);

//       if (error.response) {
//         console.log("🚨 SERVER ERROR DATA:", error.response.data);
//         console.log("STATUS:", error.response.status);

//         setError(error.response.data?.message || "Server returned an error");
//       } else if (error.request) {
//         console.log("📡 REQUEST SENT BUT NO RESPONSE");
//         setError("No response from server. Please check internet.");
//       } else {
//         console.log("⚠️ UNKNOWN ERROR:", error.message);
//         setError(error.message || "Something went wrong");
//       }
//     } finally {
//       setLoading(false);
//       console.log("🛑 SUBMIT FINISHED");
//     }
//   };

//   const renderProgressBar = () => (
//     <View className="mt-2 mb-6">
//       <View className="flex-row items-center justify-between">
//         {Array.from({ length: totalSteps }, (_, index) => {
//           const step = index + 1;
//           const isCompleted = currentStep > step;
//           const isCurrent = currentStep === step;
//           const isActive = currentStep >= step;

//           return (
//             <View key={step} className="flex-row items-center flex-1">
//               {/* Circle */}
//               <View
//                 className={[
//                   "w-8 h-8 rounded-full border-2 items-center justify-center",
//                   "bg-white",
//                   isCurrent
//                     ? "border-[#1FAD4E] bg-[#1FAD4E]"
//                     : isActive
//                     ? "border-[#1FAD4E]"
//                     : "border-gray-300",
//                 ].join(" ")}
//               >
//                 <Text
//                   className={[
//                     "text-sm font-medium",
//                     isCurrent
//                       ? "text-green-500"
//                       : isActive
//                       ? "text-[#1FAD4E]"
//                       : "text-gray-500",
//                   ].join(" ")}
//                 >
//                   {step}
//                 </Text>
//               </View>

//               {/* Connecting line */}
//               {index < totalSteps - 1 && (
//                 <View
//                   className={[
//                     "h-0.5 mx-1 flex-1",
//                     isCompleted ? "bg-[#1FAD4E]" : "bg-gray-300",
//                   ].join(" ")}
//                 />
//               )}
//             </View>
//           );
//         })}
//       </View>
//     </View>
//   );

//   const renderStep1 = () => (
//     <View className="mb-5">
//       <Text className="text-sm font-heading text-[#1FAD4E] mb-4">
//         Personal & Location
//       </Text>

//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//           Name <Text className="text-red-500">*</Text>
//         </Text>
//         <TextInput
//           className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
//           placeholder="Full name"
//           value={formData.personalInfo.name}
//           onChangeText={(text) =>
//             setFormData((p) => ({
//               ...p,
//               personalInfo: { ...p.personalInfo, name: text },
//             }))
//           }
//         />
//       </View>

//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//           Mobile <Text className="text-red-500">*</Text>
//         </Text>
//         <TextInput
//           className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
//           placeholder="10-digit number"
//           keyboardType="phone-pad"
//           maxLength={10}
//           value={formData.personalInfo.mobileNo}
//           onChangeText={(text) =>
//             setFormData((p) => ({
//               ...p,
//               personalInfo: { ...p.personalInfo, mobileNo: text },
//             }))
//           }
//         />
//       </View>

//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//           Email (Optional)
//         </Text>
//         <TextInput
//           className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
//           placeholder="email@example.com"
//           keyboardType="email-address"
//           autoCapitalize="none"
//           value={formData.personalInfo.email}
//           onChangeText={(text) =>
//             setFormData((p) => ({
//               ...p,
//               personalInfo: { ...p.personalInfo, email: text },
//             }))
//           }
//         />
//       </View>

//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//           Address
//         </Text>
//         <TextInput
//           className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white h-20 text-top"
//           placeholder="Full address"
//           multiline
//           numberOfLines={3}
//           value={formData.personalInfo.address}
//           onChangeText={(text) =>
//             setFormData((p) => ({
//               ...p,
//               personalInfo: { ...p.personalInfo, address: text },
//             }))
//           }
//         />
//       </View>

//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//           Village / Grama Panchayat
//         </Text>
//         <TextInput
//           className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
//           placeholder="Village name"
//           value={formData.personalInfo.villageGramaPanchayat}
//           onChangeText={(text) =>
//             setFormData((p) => ({
//               ...p,
//               personalInfo: {
//                 ...p.personalInfo,
//                 villageGramaPanchayat: text,
//               },
//             }))
//           }
//         />
//       </View>

//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//           Pincode <Text className="text-red-500">*</Text>
//         </Text>
//         <TextInput
//           className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
//           placeholder="6-digit pincode"
//           keyboardType="number-pad"
//           maxLength={6}
//           value={formData.personalInfo.pincode}
//           onChangeText={handlePincodeChange}
//         />
//         {pincodeLoading && (
//           <Text className="text-xs text-gray-500 mt-1">
//             Fetching location...
//           </Text>
//         )}
//       </View>

//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//           State <Text className="text-red-500">*</Text>
//         </Text>
//         <TextInput
//           className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-gray-100"
//           value={formData.personalInfo.state}
//           editable={false}
//           placeholder="Auto-filled"
//         />
//       </View>

//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//           District <Text className="text-red-500">*</Text>
//         </Text>
//         <TextInput
//           className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-gray-100"
//           value={formData.personalInfo.district}
//           editable={false}
//           placeholder="Auto-filled"
//         />
//       </View>

//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//           Taluk
//         </Text>
//         <TextInput
//           className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-gray-100"
//           value={formData.personalInfo.taluk}
//           editable={false}
//           placeholder="Auto-filled"
//         />
//       </View>

//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//           Post
//         </Text>
//         <TextInput
//           className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-gray-100"
//           value={formData.personalInfo.post}
//           editable={false}
//           placeholder="Auto-filled"
//         />
//       </View>
//     </View>
//   );

//   const renderStep2 = () => (
//     <View className="mb-5">
//       <Text className="text-lg font-heading text-[#1FAD4E] mb-4">
//         {role === "farmer" ? "Farm Details" : "Business Location"}
//       </Text>

//       {role === "farmer" && (
//         <>
//           <View className="mb-3">
//             <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//               Farm Location <Text className="text-red-500">*</Text>
//             </Text>
//             <View className="flex flex-row items-center gap-3">
//               <TouchableOpacity
//                 className="bg-[#1FAD4E] w-10 h-10 rounded-full flex items-center justify-center"
//                 onPress={getCurrentLocation}
//               >
//                 <MapPin size={18} color="#fff" />
//               </TouchableOpacity>

//               {formData.farmLocation.latitude && (
//                 <Text className="text-xs text-gray-600">
//                   Location:{" "}
//                   {parseFloat(formData.farmLocation.latitude).toFixed(6)},{" "}
//                   {parseFloat(formData.farmLocation.longitude).toFixed(6)}
//                 </Text>
//               )}
//             </View>
//           </View>

//           <Text className="text-base font-medium text-gray-800 mt-3 mb-3">
//             Farm Land (Acres)
//           </Text>

//           <View className="mb-3">
//             <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//               Total
//             </Text>
//             <TextInput
//               className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
//               placeholder="Total acres"
//               keyboardType="decimal-pad"
//               value={formData.farmLand.total}
//               onChangeText={(text) =>
//                 setFormData((p) => ({
//                   ...p,
//                   farmLand: { ...p.farmLand, total: text },
//                 }))
//               }
//             />
//           </View>

//           <View className="mb-3">
//             <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//               Cultivated
//             </Text>
//             <TextInput
//               className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
//               placeholder="Cultivated acres"
//               keyboardType="decimal-pad"
//               value={formData.farmLand.cultivated}
//               onChangeText={(text) =>
//                 setFormData((p) => ({
//                   ...p,
//                   farmLand: { ...p.farmLand, cultivated: text },
//                 }))
//               }
//             />
//           </View>

//           <View className="mb-3">
//             <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//               Uncultivated
//             </Text>
//             <TextInput
//               className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
//               placeholder="Uncultivated acres"
//               keyboardType="decimal-pad"
//               value={formData.farmLand.uncultivated}
//               onChangeText={(text) =>
//                 setFormData((p) => ({
//                   ...p,
//                   farmLand: { ...p.farmLand, uncultivated: text },
//                 }))
//               }
//             />
//           </View>
//         </>
//       )}

//       <Text className="text-base font-medium text-gray-800 mt-4 mb-3">
//         Nearest Markets
//       </Text>

//       <View className="mb-3">
//         <Text className="text-sm text-gray-600 mb-2">
//           Select multiple markets (tap to select/deselect)
//         </Text>

//         {markets.map((market) => (
//           <TouchableOpacity
//             key={market._id}
//             onPress={() => {
//               setFormData((prev) => ({
//                 ...prev,
//                 nearestMarkets: prev.nearestMarkets.includes(market._id)
//                   ? prev.nearestMarkets.filter((id) => id !== market._id)
//                   : [...prev.nearestMarkets, market._id],
//               }));
//             }}
//             className="flex-row items-center mb-3"
//           >
//             <View
//               className={`w-5 h-5 rounded-md border-2 mr-3 items-center justify-center ${
//                 formData.nearestMarkets.includes(market._id)
//                   ? "bg-[#1FAD4E] border-[#1FAD4E]"
//                   : "border-gray-300"
//               }`}
//             >
//               {formData.nearestMarkets.includes(market._id) && (
//                 <Text className="text-xs font-bold text-white">✓</Text>
//               )}
//             </View>
//             <View className="flex-1">
//               <Text className="text-sm font-medium text-gray-800">
//                 {market.marketName}
//               </Text>
//               <Text className="text-xs text-gray-500">
//                 {market.exactAddress}
//               </Text>
//             </View>
//           </TouchableOpacity>
//         ))}

//         <Text className="text-xs text-gray-500 mt-2">
//           Selected: {formData.nearestMarkets.length} market(s)
//         </Text>
//       </View>

     
//     </View>
//   );

//   const renderStep3 = () => (
//     <View className="mb-5">
//       <Text className="text-lg font-heading text-[#1FAD4E] mb-4">
//         Commodities & Bank
//       </Text>

//       <Text className="text-base font-heading text-gray-800 mb-3">
//         Commodities <Text className="text-red-500">*</Text>
//       </Text>

//       {categories.map((cat) => (
//         <View
//           key={cat._id}
//           className="border border-gray-200 rounded-lg p-3 mb-3"
//         >
//           <TouchableOpacity
//             className="flex-row items-center"
//             onPress={() => handleCommodityToggle(cat._id)}
//           >
//             <View
//               className={`w-5 h-5 rounded-md border-2 mr-3 items-center justify-center ${
//                 formData.commodities.includes(cat._id)
//                   ? "bg-[#1FAD4E] border-[#1FAD4E]"
//                   : "border-gray-300"
//               }`}
//             >
//               {formData.commodities.includes(cat._id) && (
//                 <Text className="text-xs font-bold text-white">✓</Text>
//               )}
//             </View>

//             {/* Category Image */}
//             {cat.image && (
//               <Image
//                 source={{ uri: `https://kisan.etpl.ai/uploads/${cat.image}` }}
//                 className="w-10 h-10 rounded mr-3"
//                 resizeMode="cover"
//               />
//             )}

//             <Text className="text-sm text-gray-800 flex-1">
//               {cat.categoryName}
//             </Text>
//           </TouchableOpacity>

//           {/* Subcategories */}
//           {formData.commodities.includes(cat._id) &&
//             expandedCategories.includes(cat._id) && (
//               <View className="ml-8 mt-3 pl-3 border-l-2 border-green-200">
//                 {subCategories
//                   .filter((sub) => sub.categoryId === cat._id)
//                   .map((subCat) => (
//                     <TouchableOpacity
//                       key={subCat._id}
//                       onPress={() => handleSubCategoryToggle(subCat._id)}
//                       className="flex-row items-center mb-2"
//                     >
//                       <View
//                         className={`w-4 h-4 rounded border-2 mr-2 items-center justify-center ${
//                           formData.subcategories.includes(subCat._id)
//                             ? "bg-[#1FAD4E] border-[#1FAD4E]"
//                             : "border-gray-300"
//                         }`}
//                       >
//                         {formData.subcategories.includes(subCat._id) && (
//                           <Text className="text-[10px] font-bold text-white">
//                             ✓
//                           </Text>
//                         )}
//                       </View>

//                       {/* Subcategory Image */}
//                       {subCat.image && (
//                         <Image
//                           source={{
//                             uri: `https://kisan.etpl.ai/uploads/${subCat.image}`,
//                           }}
//                           className="w-8 h-8 rounded mr-2"
//                           resizeMode="cover"
//                         />
//                       )}

//                       <Text className="text-xs text-gray-600 flex-1">
//                         {subCat.subCategoryName}
//                       </Text>
//                     </TouchableOpacity>
//                   ))}
//               </View>
//             )}
//         </View>
//       ))}
//       <Text className="text-base font-medium text-gray-800 mt-4 mb-3">
//         Bank Details (Optional)
//       </Text>

//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//           Account Holder
//         </Text>
//         <TextInput
//           className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
//           placeholder="Name"
//           value={formData.bankDetails.accountHolderName}
//           onChangeText={(text) =>
//             setFormData((p) => ({
//               ...p,
//               bankDetails: { ...p.bankDetails, accountHolderName: text },
//             }))
//           }
//         />
//       </View>

//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//           Account Number
//         </Text>
//         <TextInput
//           className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
//           placeholder="Number"
//           keyboardType="number-pad"
//           value={formData.bankDetails.accountNumber}
//           onChangeText={(text) =>
//             setFormData((p) => ({
//               ...p,
//               bankDetails: { ...p.bankDetails, accountNumber: text },
//             }))
//           }
//         />
//       </View>

//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//           IFSC Code
//         </Text>
//         <TextInput
//           className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
//           placeholder="IFSC"
//           autoCapitalize="characters"
//           value={formData.bankDetails.ifscCode}
//           onChangeText={(text) =>
//             setFormData((p) => ({
//               ...p,
//               bankDetails: { ...p.bankDetails, ifscCode: text },
//             }))
//           }
//         />
//       </View>

//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//           Branch
//         </Text>
//         <TextInput
//           className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
//           placeholder="Branch name"
//           value={formData.bankDetails.branch}
//           onChangeText={(text) =>
//             setFormData((p) => ({
//               ...p,
//               bankDetails: { ...p.bankDetails, branch: text },
//             }))
//           }
//         />
//       </View>
//     </View>
//   );

  
//   const renderStep4 = () => {
//     const documents = DOCUMENTS_BY_ROLE[role as "farmer" | "trader"] || [];

//     return (
//       <View className="mb-5">
//         <Text className="text-lg font-heading text-[#1FAD4E] mb-4">
//           Documents (Optional)
//         </Text>

//         {documents.map((doc) => {
//           const docKey = doc.key as keyof FormData["documents"];
//           const fileObj = formData.documents[docKey];

//           return (
//             <View
//               key={doc.key}
//               className="border border-dashed border-gray-300 rounded-xl p-4 mb-4 bg-white"
//             >
//               <View className="flex-row items-center justify-between">
//                 {/* LEFT ICON + TEXT */}
//                 <View className="flex-row items-start flex-1">
//                   <View className="w-10 h-10 rounded-full bg-green-100 items-center justify-center mr-3">
//                     <Upload size={18} color="#1FAD4E" />
//                   </View>

//                   <View className="flex-1">
//                     <Text className="text-sm font-medium text-gray-900">
//                       {doc.label}
//                     </Text>
//                     <Text className="text-xs text-gray-500 mt-0.5">
//                       Securely verify your identity to access all features
//                     </Text>

//                     {/* FILE NAME */}
//                     {fileObj?.name && (
//                       <Text className="text-[11px] text-[#1FAD4E] mt-1">
//                         ✅ {fileObj.name}
//                       </Text>
//                     )}
//                   </View>
//                 </View>

//                 {/* UPLOAD BUTTON */}
//                 <TouchableOpacity
//                   onPress={() => handleFileChange(docKey)}
//                   className="border border-[#1FAD4E] px-4 py-2 rounded-lg"
//                 >
//                   <Text className="text-[#1FAD4E] text-xs font-medium">
//                     Upload
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           );
//         })}
//       </View>
//     );
//   };

//   const renderStep5 = () => (
//     <View className="mb-5">
//       <Text className="text-lg font-heading text-[#1FAD4E] mb-4">Security</Text>

//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//           Referral Code (Optional)
//         </Text>
//         <TextInput
//           className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
//           placeholder="Referral code"
//           value={formData.security.referralCode}
//           onChangeText={(text) =>
//             setFormData((p) => ({
//               ...p,
//               security: { ...p.security, referralCode: text },
//             }))
//           }
//         />
//       </View>

//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//           4-Digit MPIN <Text className="text-red-500">*</Text>
//         </Text>
//         <TextInput
//           className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
//           keyboardType="number-pad"
//           maxLength={4}
//           secureTextEntry
//           placeholder="****"
//           value={formData.security.mpin}
//           onChangeText={(text) =>
//             setFormData((p) => ({
//               ...p,
//               security: { ...p.security, mpin: text },
//             }))
//           }
//         />
//         <Text className="text-xs text-gray-500 mt-1">Quick login PIN</Text>
//       </View>

//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//           Confirm MPIN <Text className="text-red-500">*</Text>
//         </Text>
//         <TextInput
//           className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
//           keyboardType="number-pad"
//           maxLength={4}
//           secureTextEntry
//           placeholder="****"
//           value={formData.security.confirmMpin}
//           onChangeText={(text) =>
//             setFormData((p) => ({
//               ...p,
//               security: { ...p.security, confirmMpin: text },
//             }))
//           }
//         />
//       </View>

//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//           Password <Text className="text-red-500">*</Text>
//         </Text>
//         <TextInput
//           className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
//           secureTextEntry
//           maxLength={20}
//           placeholder="Password"
//           value={formData.security.password}
//           onChangeText={(text) =>
//             setFormData((p) => ({
//               ...p,
//               security: { ...p.security, password: text },
//             }))
//           }
//         />
//         <Text className="text-xs text-gray-500 mt-1">Min 6 characters</Text>
//       </View>

//       <View className="mb-3">
//         <Text className="text-sm font-subheading text-gray-800 mb-1.5">
//           Confirm Password <Text className="text-red-500">*</Text>
//         </Text>
//         <TextInput
//           className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
//           secureTextEntry
//           maxLength={20}
//           placeholder="Confirm"
//           value={formData.security.confirmPassword}
//           onChangeText={(text) =>
//             setFormData((p) => ({
//               ...p,
//               security: { ...p.security, confirmPassword: text },
//             }))
//           }
//         />
//       </View>
//     </View>
//   );

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       className="flex-1 bg-white"
//     >
//       <View className="flex-1 bg-white py-10">
//         <View className="absolute -top-24 -left-40 w-72 h-72 rounded-full bg-[#E8FDEB]" />

//         <ScrollView
//           contentContainerStyle={{ paddingBottom: 140 }}
//           keyboardShouldPersistTaps="handled"
//           className="px-4 py-4"
//         >
//           <View className="p-5">
//             <View className="items-center mb-5">
//               <Text className="text-2xl text-[#1FAD4E] font-medium">
//                 Create{" "}
//                 {role === "farmer"
//                   ? "Farmer"
//                   : role === "trader"
//                   ? "Trader"
//                   :role === "partner"
//                   ? "partner"
//                   : "Transport"}{" "}
//                 Account
//               </Text>
//               <Text className="text-xs text-gray-500 mt-1">
//                 Step {currentStep} of {totalSteps}
//               </Text>
//             </View>

//             {renderProgressBar()}

//             {currentStep === 1 && renderStep1()}
//             {currentStep === 2 && renderStep2()}
//             {currentStep === 3 && renderStep3()}
//             {currentStep === 4 && renderStep4()}
//             {currentStep === 5 && renderStep5()}

//             {error ? (
//               <View className="bg-red-100 px-3 py-2.5 rounded-lg mt-2">
//                 <Text className="text-sm text-red-700 text-center">
//                   {error}
//                 </Text>
//               </View>
//             ) : null}
//           </View>
//         </ScrollView>

//         <View className="bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
//           <View className="flex-row justify-between gap-3">
//             {currentStep > 1 && (
//               <TouchableOpacity
//                 onPress={handlePrevious}
//                 className="flex-row items-center px-4 py-3 rounded-lg border border-[#1FAD4E] bg-white flex-1 justify-center"
//               >
//                 <ChevronLeft size={20} color="#1FAD4E" />
//                 <Text className="text-[#1FAD4E] text-base font-medium ml-2">
//                   Previous
//                 </Text>
//               </TouchableOpacity>
//             )}

//             {currentStep < totalSteps ? (
//               <TouchableOpacity
//                 onPress={handleNext}
//                 className="flex-row items-center px-4 py-3 rounded-lg flex-1 justify-center bg-[#1FAD4E]"
//               >
//                 <Text className="text-white text-base font-medium mr-2">
//                   Save & Next
//                 </Text>
//                 <ChevronRight size={20} color="#fff" />
//               </TouchableOpacity>
//             ) : (
//               <TouchableOpacity
//                 onPress={handleSubmit}
//                 disabled={loading}
//                 className={`flex-row items-center px-4 py-3 rounded-lg flex-1 justify-center ${
//                   loading ? "opacity-70" : ""
//                 } bg-[#1FAD4E]`}
//               >
//                 {loading ? (
//                   <View className="flex-row items-center">
//                     <ActivityIndicator color="#fff" size="small" />
//                     <Text className="text-white text-base font-medium ml-2">
//                       Registering...
//                     </Text>
//                   </View>
//                 ) : (
//                   <Text className="text-white text-base font-medium">
//                     Register
//                   </Text>
//                 )}
//               </TouchableOpacity>
//             )}
//           </View>
//         </View>

//         <View className="flex-row justify-center">
//           <Text className="text-sm text-gray-500">Already registered? </Text>
//           <TouchableOpacity onPress={() => router.push("/(auth)/Login")}>
//             <Text className="text-sm text-[#1FAD4E] font-medium">
//               Login here
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </KeyboardAvoidingView>
//   );
// };

// export default FarmerRegistration;






import axios from "axios";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ChevronLeft,
  ChevronRight,
  Loader,
  MapPin,
  Search,
  Upload,
  X
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

interface Category {
  _id: string;
  categoryName: string;
  image?: string;
}

interface Market {
  id: string;
  name: string;
}

interface SubCategory {
  _id: string;
  subCategoryName: string;
  categoryId: string;
  image?: string;
}

interface FileInfo {
  uri: string;
  name: string;
  type: string;
  size?: number;
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
  // Transport specific fields
  vehicleDetails: {
    vehicleType: string;
    vehicleCapacity: string;
    capacityUnit: string;
    vehicleNumber: string;
  };
  isCompany: boolean;
  driverDetails: {
    driverName: string;
    driverMobileNo: string;
    driverAge: string;
  };
  commodities: string[];
  subcategories: string[];
  nearestMarkets: string[];
  bankDetails: {
    accountHolderName: string;
    accountNumber: string;
    ifscCode: string;
    branch: string;
    bankName: string;
    upiId: string;
  };
  documents: {
    panCard: any;
    aadharFront: any;
    aadharBack: any;
    bankPassbook: any;
    businessLicense?: any;
    photo?: any;
    businessNameBoard?: any;
    // Transport documents
    rcBook?: FileInfo | null;
    insuranceDoc?: FileInfo | null;
    pollutionCert?: FileInfo | null;
    permitDoc?: FileInfo | null;
    driverLicense?: FileInfo | null;
    driverPhoto?: FileInfo | null;
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
  const role = (params.role as string) || "farmer";
  console.log(role);

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = role === "transport" ? 7 : 5;

  const [formData, setFormData] = useState<FormData>({
    personalInfo: {
      name: "",
      mobileNo: "",
      email: "",
      address: "",
      villageGramaPanchayat: "",
      pincode: "",
      state: "",
      district: "",
      taluk: "",
      post: "",
    },
    farmLocation: {
      latitude: "",
      longitude: "",
    },
    farmLand: {
      total: "",
      cultivated: "",
      uncultivated: "",
    },
    vehicleDetails: {
      vehicleType: "",
      vehicleCapacity: "",
      capacityUnit: "kg",
      vehicleNumber: "",
    },
    isCompany: false,
    driverDetails: {
      driverName: "",
      driverMobileNo: "",
      driverAge: "",
    },
    commodities: [],
    subcategories: [],
    nearestMarkets: [],
    bankDetails: {
      accountHolderName: "",
      accountNumber: "",
      ifscCode: "",
      branch: "",
      bankName: "",
      upiId: "",
    },
    documents: {
      panCard: null,
      aadharFront: null,
      aadharBack: null,
      bankPassbook: null,
      rcBook: null,
      insuranceDoc: null,
      pollutionCert: null,
      permitDoc: null,
      driverLicense: null,
      driverPhoto: null,
    },
    security: {
      referralCode: "",
      mpin: "",
      confirmMpin: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [markets, setMarkets] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [error, setError] = useState("");

  const vehicleTypes = [
    "Pickup Van",
    "Bolero",
    "Tata Ace",
    "Mini Truck",
    "Lorry",
    "Truck",
    "Container",
    "Trailer",
    "Other",
  ];

  const capacityUnits = ["kg", "ton", "quintal", "boxes"];

  const DOCUMENTS_BY_ROLE = {
    farmer: [
      { key: "panCard", label: "Upload PAN Card / ID" },
      { key: "aadharFront", label: "Upload Aadhaar Front" },
      { key: "aadharBack", label: "Upload Aadhaar Back" },
      { key: "bankPassbook", label: "Upload Bank Passbook" },
    ],
    trader: [
      { key: "panCard", label: "Upload PAN Card / ID" },
      { key: "aadharFront", label: "Upload Aadhaar Front" },
      { key: "aadharBack", label: "Upload Aadhaar Back" },
      { key: "businessLicense", label: "Upload Business License" },
      { key: "photo", label: "Upload Photo" },
      { key: "businessNameBoard", label: "Upload Business Name Board" },
    ],
    transport: [
      { key: "panCard", label: "Upload PAN Card / ID" },
      { key: "aadharFront", label: "Upload Aadhaar Front" },
      { key: "aadharBack", label: "Upload Aadhaar Back" },
      { key: "bankPassbook", label: "Upload Bank Passbook" },
    ],
  };

  // Debounce hook
  const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  };

  const debouncedPincode = useDebounce(formData.personalInfo.pincode, 500);

  useEffect(() => {
    fetchCategories();
    fetchMarkets();
  }, []);

  useEffect(() => {
    if (debouncedPincode.length === 6 && /^\d+$/.test(debouncedPincode)) {
      fetchPincodeData(debouncedPincode);
    }
  }, [debouncedPincode]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("https://kisan.etpl.ai/category/all");
      const data = await res.json();
      setCategories(data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchMarkets = async () => {
    try {
      const res = await fetch("https://kisan.etpl.ai/api/market/all");
      const data = await res.json();
      setMarkets(data.data || data);
    } catch (error) {
      console.error("Error fetching markets:", error);
    }
  };

  const fetchSubCategories = async (categoryId: string) => {
    try {
      const res = await fetch(
        `https://kisan.etpl.ai/subcategory/category/${categoryId}`
      );
      const data = await res.json();
      return data.data || [];
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      return [];
    }
  };

  const fetchPincodeData = async (pincode: string) => {
    if (pincode.length !== 6) return;
    setPincodeLoading(true);
    try {
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const data = await response.json();
      if (
        data[0].Status === "Success" &&
        data[0].PostOffice &&
        data[0].PostOffice.length > 0
      ) {
        const postOffice = data[0].PostOffice[0];
        setFormData((prev) => ({
          ...prev,
          personalInfo: {
            ...prev.personalInfo,
            state: postOffice.State,
            district: postOffice.District,
            taluk: postOffice.Block || postOffice.Division || postOffice.Taluk || "",
            post: postOffice.Name,
          },
        }));
      } else {
        await fetchLocationFromAlternativeAPI(pincode);
      }
    } catch (error) {
      console.error("Error fetching pincode data:", error);
      try {
        await fetchLocationFromAlternativeAPI(pincode);
      } catch (fallbackError) {
        setError("Unable to fetch location details. Please enter manually.");
      }
    } finally {
      setPincodeLoading(false);
    }
  };

  const fetchLocationFromAlternativeAPI = async (pincode: string) => {
    try {
      const response = await axios.get(
        `https://pincode.saratchandra.in/api/pincode/${pincode}`
      );

      if (response.data && response.data.length > 0) {
        const data = response.data[0];
        setFormData((prev) => ({
          ...prev,
          personalInfo: {
            ...prev.personalInfo,
            state: data.state || "",
            district: data.district || "",
            taluk: data.taluk || "",
            post: data.office || "",
          },
        }));
      }
    } catch (error) {
      throw error;
    }
  };

  const handlePincodeChange = (pincode: string) => {
    const value = pincode.replace(/\D/g, "").slice(0, 6);
    setFormData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, pincode: value },
    }));
    
    if (value.length < 6) {
      setFormData((prev) => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          state: "",
          district: "",
          taluk: "",
          post: "",
        },
      }));
    }
  };

  const handleManualFetch = () => {
    if (formData.personalInfo.pincode.length === 6 && /^\d+$/.test(formData.personalInfo.pincode)) {
      fetchPincodeData(formData.personalInfo.pincode);
    } else {
      setError("Please enter a valid 6-digit pincode");
    }
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission required.");
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setFormData((prev) => ({
        ...prev,
        farmLocation: {
          latitude: location.coords.latitude.toString(),
          longitude: location.coords.longitude.toString(),
        },
      }));
      Alert.alert("Success", "Location captured!");
    } catch (error) {
      Alert.alert("Error", "Unable to get location.");
    }
  };

  const handleCommodityToggle = async (categoryId: string) => {
    const isCurrentlySelected = formData.commodities.includes(categoryId);

    if (isCurrentlySelected) {
      setFormData((prev) => ({
        ...prev,
        commodities: prev.commodities.filter((id) => id !== categoryId),
        subcategories: prev.subcategories.filter((subId) => {
          const sub = subCategories.find((s) => s._id === subId);
          return sub?.categoryId !== categoryId;
        }),
      }));
      setExpandedCategories((prev) => prev.filter((id) => id !== categoryId));
    } else {
      setFormData((prev) => ({
        ...prev,
        commodities: [...prev.commodities, categoryId],
      }));

      const subs = await fetchSubCategories(categoryId);
      setSubCategories((prev) => [...prev, ...subs]);
      setExpandedCategories((prev) => [...prev, categoryId]);
    }
  };

  const handleSubCategoryToggle = (subCategoryId: string) => {
    setFormData((prev) => ({
      ...prev,
      subcategories: prev.subcategories.includes(subCategoryId)
        ? prev.subcategories.filter((id) => id !== subCategoryId)
        : [...prev.subcategories, subCategoryId],
    }));
  };

  const compressImage = async (uri: string, isDocument: boolean = false): Promise<string> => {
    try {
      if (isDocument) {
        const result = await ImageManipulator.manipulateAsync(
          uri,
          [{ resize: { width: 1024 } }],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
        );
        return result.uri;
      } else {
        const result = await ImageManipulator.manipulateAsync(
          uri,
          [{ resize: { width: 800 } }],
          { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
        );
        return result.uri;
      }
    } catch (error) {
      console.error("Error compressing image:", error);
      return uri;
    }
  };

  const getFileSize = async (uri: string): Promise<number> => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      return fileInfo.size || 0;
    } catch (error) {
      console.error("Error getting file size:", error);
      return 0;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const pickFile = async (
    docType: keyof FormData["documents"],
    isDocument: boolean = false
  ) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        
        setError("");
        
        const compressedUri = await compressImage(asset.uri, isDocument);
        const fileSize = await getFileSize(compressedUri);
        
        const MAX_SIZE = 2 * 1024 * 1024;
        if (fileSize > MAX_SIZE) {
          setError(`File is too large (${formatFileSize(fileSize)}). Maximum size is 2MB.`);
          return;
        }
        
        const fileName = compressedUri.split('/').pop();
        const fileTypeFromUri = fileName?.split('.').pop()?.toLowerCase() || 'jpg';
        
        let mimeType = `image/${fileTypeFromUri}`;
        if (fileTypeFromUri === 'pdf') {
          mimeType = 'application/pdf';
        } else if (fileTypeFromUri === 'png') {
          mimeType = 'image/png';
        } else {
          mimeType = 'image/jpeg';
        }

        const fileInfo: FileInfo = {
          uri: compressedUri,
          name: fileName || `${docType}.${fileTypeFromUri}`,
          type: mimeType,
          size: fileSize,
        };

        setFormData((prev) => ({
          ...prev,
          documents: {
            ...prev.documents,
            [docType]: fileInfo,
          },
        }));
      }
    } catch (error) {
      console.error("Error picking file:", error);
      setError("Failed to pick file. Please try again.");
    }
  };

  const removeFile = (docType: keyof FormData["documents"]) => {
    setFormData((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [docType]: null,
      },
    }));
  };

  const handleFileChange = async (docType: keyof FormData["documents"]) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        copyToCacheDirectory: true,
      });

      if (
        result.canceled === false &&
        result.assets &&
        result.assets.length > 0
      ) {
        setFormData((prev) => ({
          ...prev,
          documents: {
            ...prev.documents,
            [docType]: result.assets[0],
          },
        }));
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick document.");
    }
  };

  const validateStep1 = () => {
    setError("");
    if (!formData.personalInfo.name.trim()) {
      setError("Please enter your name");
      return false;
    }
    if (
      !formData.personalInfo.mobileNo.trim() ||
      formData.personalInfo.mobileNo.length !== 10
    ) {
      setError("Please enter valid 10-digit mobile number");
      return false;
    }
    if (
      !formData.personalInfo.pincode.trim() ||
      formData.personalInfo.pincode.length !== 6
    ) {
      setError("Please enter valid 6-digit pincode");
      return false;
    }
    if (!formData.personalInfo.state || !formData.personalInfo.district) {
      setError("Please wait for location details from pincode");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    setError("");
    
    if (role === "farmer" && !formData.farmLocation.latitude) {
      setError("Please pin your farm location");
      return false;
    }
    
    if (role === "transport") {
      if (!formData.vehicleDetails.vehicleType) {
        setError("Please select vehicle type");
        return false;
      }
      if (!formData.vehicleDetails.vehicleNumber.trim()) {
        setError("Please enter vehicle registration number");
        return false;
      }
    }
    
    return true;
  };

  const validateStep3 = () => {
    setError("");
    
    if (role !== "transport" && formData.commodities.length === 0) {
      setError("Please select at least one commodity");
      return false;
    }
    
    if (!formData.bankDetails.accountHolderName.trim()) {
      setError("Please enter account holder name");
      return false;
    }
    if (!formData.bankDetails.accountNumber.trim()) {
      setError("Please enter account number");
      return false;
    }
    if (!formData.bankDetails.ifscCode.trim()) {
      setError("Please enter IFSC code");
      return false;
    }
    if (role === "transport" && !formData.bankDetails.bankName.trim()) {
      setError("Please enter bank name");
      return false;
    }
    
    return true;
  };

  const validateStep5 = () => {
    setError("");
    
    if (role === "transport" && !formData.documents.rcBook) {
      setError("Please upload RC Book (mandatory)");
      return false;
    }
    
    return true;
  };

  const validateStep6 = () => {
    setError("");
    
    if (role === "transport" && formData.isCompany) {
      if (!formData.driverDetails.driverName.trim()) {
        setError("Please enter driver name");
        return false;
      }
      if (!formData.driverDetails.driverMobileNo.trim() || formData.driverDetails.driverMobileNo.length !== 10) {
        setError("Please enter valid driver mobile number");
        return false;
      }
      if (!formData.documents.driverLicense) {
        setError("Please upload driver license");
        return false;
      }
    }
    
    return true;
  };

  const validateStep7 = () => {
    setError("");
    if (!formData.security.mpin || formData.security.mpin.length !== 4) {
      setError("Please enter 4-digit MPIN");
      return false;
    }
    if (formData.security.mpin !== formData.security.confirmMpin) {
      setError("MPIN and Confirm MPIN do not match");
      return false;
    }
    if (!formData.security.password || formData.security.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (formData.security.password !== formData.security.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    let isValid = false;
    if (currentStep === 1) isValid = validateStep1();
    else if (currentStep === 2) isValid = validateStep2();
    else if (currentStep === 3) isValid = validateStep3();
    else if (currentStep === 5 && role === "transport") isValid = validateStep5();
    else if (currentStep === 6 && role === "transport") isValid = validateStep6();
    else isValid = true;

    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      setError("");
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError("");
    }
  };

  const createFormDataFile = (fileInfo: FileInfo | null | any) => {
    if (!fileInfo) return null;
    
    const uri = fileInfo.uri;
    const name = fileInfo.name || 'file.jpg';
    const type = fileInfo.type || fileInfo.mimeType || 'image/jpeg';
    
    return {
      uri,
      type,
      name,
    };
  };

  const handleSubmit = async () => {
    try {
      if (role === "transport") {
        if (!validateStep7()) return;
      } else {
        if (!validateStep7()) return;
      }

      setLoading(true);
      setError("");

      console.log("🚀 SUBMIT STARTED");
      console.log("Role:", role);

      const submitFormData = new FormData();

      if (role === "transport") {
        // TRANSPORT-SPECIFIC PAYLOAD STRUCTURE
        // Match the TransportRegistration.tsx exactly
        
        // Personal Details - individual fields
        submitFormData.append("name", formData.personalInfo.name.trim());
        submitFormData.append("mobileNo", formData.personalInfo.mobileNo.trim());
        submitFormData.append("email", formData.personalInfo.email.trim() || "");
        submitFormData.append("address", formData.personalInfo.address.trim() || "");
        submitFormData.append("village", formData.personalInfo.villageGramaPanchayat.trim() || "");
        submitFormData.append("gramPanchayat", formData.personalInfo.villageGramaPanchayat.trim() || "");
        submitFormData.append("pincode", formData.personalInfo.pincode.trim());
        submitFormData.append("state", formData.personalInfo.state.trim());
        submitFormData.append("district", formData.personalInfo.district.trim());
        submitFormData.append("taluk", formData.personalInfo.taluk.trim());
        submitFormData.append("post", formData.personalInfo.post.trim() || "");
        submitFormData.append("location", formData.farmLocation.latitude ? `${formData.farmLocation.latitude},${formData.farmLocation.longitude}` : "");

        // Vehicle Details
        submitFormData.append("vehicleType", formData.vehicleDetails.vehicleType.trim());
        submitFormData.append("vehicleCapacity", formData.vehicleDetails.vehicleCapacity.trim() || "");
        submitFormData.append("capacityUnit", formData.vehicleDetails.capacityUnit.trim());
        submitFormData.append("vehicleNumber", formData.vehicleDetails.vehicleNumber.trim());
        
        // Vehicle Documents
        const addFile = (key: string, file: any) => {
          if (!file) return;
          const formFile = createFormDataFile(file);
          if (formFile) {
            submitFormData.append(key, formFile as any);
          }
        };

        addFile("rcBook", formData.documents.rcBook);
        addFile("insuranceDoc", formData.documents.insuranceDoc);
        addFile("pollutionCert", formData.documents.pollutionCert);
        addFile("permitDoc", formData.documents.permitDoc);

        // Driver Details
        submitFormData.append("isCompany", formData.isCompany.toString());
        if (formData.isCompany) {
          submitFormData.append("driverName", formData.driverDetails.driverName.trim());
          submitFormData.append("driverMobileNo", formData.driverDetails.driverMobileNo.trim());
          submitFormData.append("driverAge", formData.driverDetails.driverAge.trim() || "");
          
          addFile("driverLicense", formData.documents.driverLicense);
          addFile("driverPhoto", formData.documents.driverPhoto);
        }

        // Bank Details
        submitFormData.append("accountHolderName", formData.bankDetails.accountHolderName.trim());
        submitFormData.append("bankName", formData.bankDetails.bankName.trim());
        submitFormData.append("accountNo", formData.bankDetails.accountNumber.trim());
        submitFormData.append("ifscCode", formData.bankDetails.ifscCode.trim());
        submitFormData.append("upiId", formData.bankDetails.upiId.trim() || "");

        // Security
        submitFormData.append("referralCode", formData.security.referralCode.trim() || "");
        submitFormData.append("mpin", formData.security.mpin.trim());
        submitFormData.append("password", formData.security.password.trim());

        // Calculate total file size
        const files = [
          formData.documents.rcBook,
          formData.documents.insuranceDoc,
          formData.documents.pollutionCert,
          formData.documents.permitDoc,
          formData.documents.driverLicense,
          formData.documents.driverPhoto,
        ];
        let totalSize = 0;
        for (const file of files) {
          if (file && (file as FileInfo).size) {
            totalSize += (file as FileInfo).size!;
          }
        }
        
        console.log("Total file size:", formatFileSize(totalSize));
        
        if (totalSize > 10 * 1024 * 1024) {
          setError("Total file size is too large. Please compress or reduce the number of files.");
          setLoading(false);
          return;
        }

      } else {
        // FARMER/TRADER PAYLOAD STRUCTURE
        submitFormData.append(
          "personalInfo",
          JSON.stringify(formData.personalInfo)
        );
        submitFormData.append(
          "farmLocation",
          JSON.stringify(formData.farmLocation)
        );
        submitFormData.append("farmLand", JSON.stringify(formData.farmLand));
        submitFormData.append(
          "commodities",
          JSON.stringify(formData.commodities)
        );
        submitFormData.append(
          "nearestMarkets",
          JSON.stringify(formData.nearestMarkets)
        );
        submitFormData.append(
          "bankDetails",
          JSON.stringify(formData.bankDetails)
        );
        submitFormData.append(
          "subcategories",
          JSON.stringify(formData.subcategories)
        );
        submitFormData.append("role", role);

        submitFormData.append(
          "security",
          JSON.stringify({
            referralCode: formData.security.referralCode,
            mpin: formData.security.mpin,
            password: formData.security.password,
          })
        );

        const addFile = (key: string, file: any) => {
          if (!file) return;
          const formFile = createFormDataFile(file);
          if (formFile) {
            submitFormData.append(key, formFile as any);
          }
        };

        addFile("panCard", formData.documents.panCard);
        addFile("aadharFront", formData.documents.aadharFront);
        addFile("aadharBack", formData.documents.aadharBack);
        addFile("bankPassbook", formData.documents.bankPassbook);

        if (role === "trader") {
          addFile("businessLicense", formData.documents.businessLicense);
          addFile("photo", formData.documents.photo);
          addFile("businessNameBoard", formData.documents.businessNameBoard);
        }
      }

      console.log("🌐 Sending request...");

      let endpoint = "https://kisan.etpl.ai/farmer/register";
      if (role === "transport") {
        endpoint = "https://kisan.etpl.ai/transport/register";
      }

      const response = await axios.post(
        endpoint,
        submitFormData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 60000,
        }
      );

      console.log("✅ RESPONSE RECEIVED:", response.status, response.data);

      if (
        response.status === 200 ||
        response.status === 201 ||
        response.data.success
      ) {
        Alert.alert("Success", "Registration Successful!", [
          { text: "OK", onPress: () => router.push("/(auth)/onboarding") },
        ]);
      } else {
        setError(response.data?.message || "Registration failed. Try again.");
      }
    } catch (error: any) {
      console.log("❌ REGISTRATION ERROR:", error);

      if (error.response) {
        console.log("🚨 SERVER ERROR DATA:", error.response.data);
        console.log("STATUS:", error.response.status);

        if (error.response.status === 413) {
          setError("Files are too large. Please compress images or use smaller files. Maximum total size is 10MB.");
        } else if (error.response.status === 400) {
          setError(error.response?.data?.message || "Invalid data format. Please check all fields.");
        } else if (error.code === 'ECONNABORTED') {
          setError("Request timeout. Please check your internet connection and try again.");
        } else if (error.response.status === 500) {
          setError("Server error. Please try again later.");
        } else {
          setError(error.response.data?.message || "Server returned an error");
        }
      } else if (error.request) {
        console.log("📡 REQUEST SENT BUT NO RESPONSE");
        setError("No response from server. Please check internet.");
      } else {
        console.log("⚠️ UNKNOWN ERROR:", error.message);
        setError(error.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
      console.log("🛑 SUBMIT FINISHED");
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
            <View key={step} className="flex-row items-center flex-1">
              <View
                className={[
                  "w-8 h-8 rounded-full border-2 items-center justify-center",
                  "bg-white",
                  isCurrent
                    ? "border-[#1FAD4E] bg-[#1FAD4E]"
                    : isActive
                    ? "border-[#1FAD4E]"
                    : "border-gray-300",
                ].join(" ")}
              >
                <Text
                  className={[
                    "text-sm font-medium",
                    isCurrent
                      ? "text-white"
                      : isActive
                      ? "text-[#1FAD4E]"
                      : "text-gray-500",
                  ].join(" ")}
                >
                  {step}
                </Text>
              </View>

              {index < totalSteps - 1 && (
                <View
                  className={[
                    "h-0.5 mx-1 flex-1",
                    isCompleted ? "bg-[#1FAD4E]" : "bg-gray-300",
                  ].join(" ")}
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
          onChangeText={(text) =>
            setFormData((p) => ({
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
          onChangeText={(text) =>
            setFormData((p) => ({
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
          onChangeText={(text) =>
            setFormData((p) => ({
              ...p,
              personalInfo: { ...p.personalInfo, email: text },
            }))
          }
        />
      </View>

      <View className="mb-3">
        <Text className="text-sm font-subheading text-gray-800 mb-1.5">
          Address
        </Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white h-20 text-top"
          placeholder="Full address"
          multiline
          numberOfLines={3}
          value={formData.personalInfo.address}
          onChangeText={(text) =>
            setFormData((p) => ({
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
          onChangeText={(text) =>
            setFormData((p) => ({
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
        <View className="flex-row items-center gap-2">
          <TextInput
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
            placeholder="6-digit pincode"
            keyboardType="number-pad"
            maxLength={6}
            value={formData.personalInfo.pincode}
            onChangeText={handlePincodeChange}
          />
          <TouchableOpacity
            className={`bg-[#1FAD4E] px-4 py-2.5 rounded-lg flex-row items-center ${
              formData.personalInfo.pincode.length !== 6 || pincodeLoading ? 'opacity-50' : ''
            }`}
            onPress={handleManualFetch}
            disabled={formData.personalInfo.pincode.length !== 6 || pincodeLoading}
          >
            {pincodeLoading ? (
              <Loader size={18} color="#fff" />
            ) : (
              <Search size={18} color="#fff" />
            )}
            <Text className="text-white font-medium ml-1">Fetch</Text>
          </TouchableOpacity>
        </View>
        {pincodeLoading && (
          <Text className="text-xs text-gray-500 mt-1">
            Fetching location...
          </Text>
        )}
        {formData.personalInfo.pincode.length === 6 && !pincodeLoading && (
          <Text className="text-xs text-gray-500 mt-1">
            Auto-fetching in 0.5 seconds or click Fetch button
          </Text>
        )}
      </View>

      <View className="mb-3">
        <Text className="text-sm font-subheading text-gray-800 mb-1.5">
          State <Text className="text-red-500">*</Text>
        </Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-gray-100"
          value={formData.personalInfo.state}
          editable={!formData.personalInfo.state}
          placeholder="Auto-filled"
        />
        {formData.personalInfo.state ? (
          <Text className="text-xs text-green-600 mt-1">
            ✓ Auto-filled from pincode
          </Text>
        ) : null}
      </View>

      <View className="mb-3">
        <Text className="text-sm font-subheading text-gray-800 mb-1.5">
          District <Text className="text-red-500">*</Text>
        </Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-gray-100"
          value={formData.personalInfo.district}
          editable={!formData.personalInfo.district}
          placeholder="Auto-filled"
        />
        {formData.personalInfo.district ? (
          <Text className="text-xs text-green-600 mt-1">
            ✓ Auto-filled from pincode
          </Text>
        ) : null}
      </View>

      <View className="mb-3">
        <Text className="text-sm font-subheading text-gray-800 mb-1.5">
          Taluk
        </Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-gray-100"
          value={formData.personalInfo.taluk}
          editable={!formData.personalInfo.taluk}
          placeholder="Auto-filled"
        />
        {formData.personalInfo.taluk ? (
          <Text className="text-xs text-green-600 mt-1">
            ✓ Auto-filled from pincode
          </Text>
        ) : null}
      </View>

      <View className="mb-3">
        <Text className="text-sm font-subheading text-gray-800 mb-1.5">
          Post
        </Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-gray-100"
          value={formData.personalInfo.post}
          editable={!formData.personalInfo.post}
          placeholder="Auto-filled"
        />
        {formData.personalInfo.post ? (
          <Text className="text-xs text-green-600 mt-1">
            ✓ Auto-filled from pincode
          </Text>
        ) : null}
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View className="mb-5">
      <Text className="text-lg font-heading text-[#1FAD4E] mb-4">
        {role === "farmer" ? "Farm Details" : role === "transport" ? "Vehicle Details" : "Business Location"}
      </Text>

      {role === "farmer" && (
        <>
          <View className="mb-3">
            <Text className="text-sm font-subheading text-gray-800 mb-1.5">
              Farm Location <Text className="text-red-500">*</Text>
            </Text>
            <View className="flex flex-row items-center gap-3">
              <TouchableOpacity
                className="bg-[#1FAD4E] w-10 h-10 rounded-full flex items-center justify-center"
                onPress={getCurrentLocation}
              >
                <MapPin size={18} color="#fff" />
              </TouchableOpacity>

              {formData.farmLocation.latitude && (
                <Text className="text-xs text-gray-600">
                  Location:{" "}
                  {parseFloat(formData.farmLocation.latitude).toFixed(6)},{" "}
                  {parseFloat(formData.farmLocation.longitude).toFixed(6)}
                </Text>
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
              onChangeText={(text) =>
                setFormData((p) => ({
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
              onChangeText={(text) =>
                setFormData((p) => ({
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
              onChangeText={(text) =>
                setFormData((p) => ({
                  ...p,
                  farmLand: { ...p.farmLand, uncultivated: text },
                }))
              }
            />
          </View>
        </>
      )}

      {role === "transport" && (
        <>
          <View className="mb-3">
            <Text className="text-sm font-subheading text-gray-800 mb-1.5">
              Vehicle Type <Text className="text-red-500">*</Text>
            </Text>
            <View className="border border-gray-300 rounded-lg max-h-48 bg-white">
              <ScrollView className="p-1">
                {vehicleTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    className={`p-3 border-b border-gray-100 ${
                      formData.vehicleDetails.vehicleType === type ? 'bg-green-50' : ''
                    }`}
                    onPress={() =>
                      setFormData((p) => ({
                        ...p,
                        vehicleDetails: { ...p.vehicleDetails, vehicleType: type },
                      }))
                    }
                  >
                    <Text
                      className={`text-sm ${
                        formData.vehicleDetails.vehicleType === type
                          ? 'text-[#1FAD4E] font-medium'
                          : 'text-gray-700'
                      }`}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          <View className="mb-3">
            <Text className="text-sm font-subheading text-gray-800 mb-1.5">
              Vehicle Capacity
            </Text>
            <View className="flex-row items-center gap-2">
              <TextInput
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
                placeholder="Capacity"
                keyboardType="numeric"
                value={formData.vehicleDetails.vehicleCapacity}
                onChangeText={(text) =>
                  setFormData((p) => ({
                    ...p,
                    vehicleDetails: { ...p.vehicleDetails, vehicleCapacity: text },
                  }))
                }
              />
              <View className="w-24 border border-gray-300 rounded-lg bg-white max-h-32">
                <ScrollView className="p-1">
                  {capacityUnits.map((unit) => (
                    <TouchableOpacity
                      key={unit}
                      className={`p-2 border-b border-gray-100 ${
                        formData.vehicleDetails.capacityUnit === unit ? 'bg-green-50' : ''
                      }`}
                      onPress={() =>
                        setFormData((p) => ({
                          ...p,
                          vehicleDetails: { ...p.vehicleDetails, capacityUnit: unit },
                        }))
                      }
                    >
                      <Text
                        className={`text-xs text-center ${
                          formData.vehicleDetails.capacityUnit === unit
                            ? 'text-[#1FAD4E] font-medium'
                            : 'text-gray-700'
                        }`}
                      >
                        {unit}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </View>

          <View className="mb-3">
            <Text className="text-sm font-subheading text-gray-800 mb-1.5">
              Vehicle Number (Registration No.) <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
              placeholder="e.g., KA01AB1234"
              autoCapitalize="characters"
              value={formData.vehicleDetails.vehicleNumber}
              onChangeText={(text) =>
                setFormData((p) => ({
                  ...p,
                  vehicleDetails: { ...p.vehicleDetails, vehicleNumber: text },
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
        <Text className="text-sm text-gray-600 mb-2">
          Select multiple markets (tap to select/deselect)
        </Text>

        {markets.map((market) => (
          <TouchableOpacity
            key={market._id}
            onPress={() => {
              setFormData((prev) => ({
                ...prev,
                nearestMarkets: prev.nearestMarkets.includes(market._id)
                  ? prev.nearestMarkets.filter((id) => id !== market._id)
                  : [...prev.nearestMarkets, market._id],
              }));
            }}
            className="flex-row items-center mb-3"
          >
            <View
              className={`w-5 h-5 rounded-md border-2 mr-3 items-center justify-center ${
                formData.nearestMarkets.includes(market._id)
                  ? "bg-[#1FAD4E] border-[#1FAD4E]"
                  : "border-gray-300"
              }`}
            >
              {formData.nearestMarkets.includes(market._id) && (
                <Text className="text-xs font-bold text-white">✓</Text>
              )}
            </View>
            <View className="flex-1">
              <Text className="text-sm font-medium text-gray-800">
                {market.marketName}
              </Text>
              <Text className="text-xs text-gray-500">
                {market.exactAddress}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        <Text className="text-xs text-gray-500 mt-2">
          Selected: {formData.nearestMarkets.length} market(s)
        </Text>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View className="mb-5">
      <Text className="text-lg font-heading text-[#1FAD4E] mb-4">
        {role === "transport" ? "Bank Details" : "Commodities & Bank"}
      </Text>

      {role !== "transport" && (
        <>
          <Text className="text-base font-heading text-gray-800 mb-3">
            Commodities <Text className="text-red-500">*</Text>
          </Text>

          {categories.map((cat) => (
            <View
              key={cat._id}
              className="border border-gray-200 rounded-lg p-3 mb-3"
            >
              <TouchableOpacity
                className="flex-row items-center"
                onPress={() => handleCommodityToggle(cat._id)}
              >
                <View
                  className={`w-5 h-5 rounded-md border-2 mr-3 items-center justify-center ${
                    formData.commodities.includes(cat._id)
                      ? "bg-[#1FAD4E] border-[#1FAD4E]"
                      : "border-gray-300"
                  }`}
                >
                  {formData.commodities.includes(cat._id) && (
                    <Text className="text-xs font-bold text-white">✓</Text>
                  )}
                </View>

                {cat.image && (
                  <Image
                    source={{ uri: `https://kisan.etpl.ai/uploads/${cat.image}` }}
                    className="w-10 h-10 rounded mr-3"
                    resizeMode="cover"
                  />
                )}

                <Text className="text-sm text-gray-800 flex-1">
                  {cat.categoryName}
                </Text>
              </TouchableOpacity>

              {formData.commodities.includes(cat._id) &&
                expandedCategories.includes(cat._id) && (
                  <View className="ml-8 mt-3 pl-3 border-l-2 border-green-200">
                    {subCategories
                      .filter((sub) => sub.categoryId === cat._id)
                      .map((subCat) => (
                        <TouchableOpacity
                          key={subCat._id}
                          onPress={() => handleSubCategoryToggle(subCat._id)}
                          className="flex-row items-center mb-2"
                        >
                          <View
                            className={`w-4 h-4 rounded border-2 mr-2 items-center justify-center ${
                              formData.subcategories.includes(subCat._id)
                                ? "bg-[#1FAD4E] border-[#1FAD4E]"
                                : "border-gray-300"
                            }`}
                          >
                            {formData.subcategories.includes(subCat._id) && (
                              <Text className="text-[10px] font-bold text-white">
                                ✓
                              </Text>
                            )}
                          </View>

                          {subCat.image && (
                            <Image
                              source={{
                                uri: `https://kisan.etpl.ai/uploads/${subCat.image}`,
                              }}
                              className="w-8 h-8 rounded mr-2"
                              resizeMode="cover"
                            />
                          )}

                          <Text className="text-xs text-gray-600 flex-1">
                            {subCat.subCategoryName}
                          </Text>
                        </TouchableOpacity>
                      ))}
                  </View>
                )}
            </View>
          ))}
        </>
      )}

      <Text className="text-base font-medium text-gray-800 mt-4 mb-3">
        Bank Details <Text className="text-red-500">*</Text>
      </Text>

      <View className="mb-3">
        <Text className="text-sm font-subheading text-gray-800 mb-1.5">
          Account Holder <Text className="text-red-500">*</Text>
        </Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
          placeholder="Name"
          value={formData.bankDetails.accountHolderName}
          onChangeText={(text) =>
            setFormData((p) => ({
              ...p,
              bankDetails: { ...p.bankDetails, accountHolderName: text },
            }))
          }
        />
      </View>

      {role === "transport" && (
        <View className="mb-3">
          <Text className="text-sm font-subheading text-gray-800 mb-1.5">
            Bank Name <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
            placeholder="Bank name"
            value={formData.bankDetails.bankName}
            onChangeText={(text) =>
              setFormData((p) => ({
                ...p,
                bankDetails: { ...p.bankDetails, bankName: text },
              }))
            }
          />
        </View>
      )}

      <View className="mb-3">
        <Text className="text-sm font-subheading text-gray-800 mb-1.5">
          Account Number <Text className="text-red-500">*</Text>
        </Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
          placeholder="Number"
          keyboardType="number-pad"
          value={formData.bankDetails.accountNumber}
          onChangeText={(text) =>
            setFormData((p) => ({
              ...p,
              bankDetails: { ...p.bankDetails, accountNumber: text },
            }))
          }
        />
      </View>

      <View className="mb-3">
        <Text className="text-sm font-subheading text-gray-800 mb-1.5">
          IFSC Code <Text className="text-red-500">*</Text>
        </Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
          placeholder="IFSC"
          autoCapitalize="characters"
          value={formData.bankDetails.ifscCode}
          onChangeText={(text) =>
            setFormData((p) => ({
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
          onChangeText={(text) =>
            setFormData((p) => ({
              ...p,
              bankDetails: { ...p.bankDetails, branch: text },
            }))
          }
        />
      </View>

      {role === "transport" && (
        <View className="mb-3">
          <Text className="text-sm font-subheading text-gray-800 mb-1.5">
            UPI ID (Optional)
          </Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
            placeholder="e.g., mobile@upi"
            autoCapitalize="none"
            value={formData.bankDetails.upiId}
            onChangeText={(text) =>
              setFormData((p) => ({
                ...p,
                bankDetails: { ...p.bankDetails, upiId: text },
              }))
            }
          />
        </View>
      )}
    </View>
  );

  const renderStep4 = () => {
    const documents = DOCUMENTS_BY_ROLE[role as "farmer" | "trader" | "transport"] || [];

    return (
      <View className="mb-5">
        <Text className="text-lg font-heading text-[#1FAD4E] mb-4">
          Documents (Optional)
        </Text>
        <Text className="text-xs text-red-500 mb-4">
          Max 2MB per file
        </Text>

        {documents.map((doc) => {
          const docKey = doc.key as keyof FormData["documents"];
          const fileObj = formData.documents[docKey];

          return (
            <View
              key={doc.key}
              className="border border-dashed border-gray-300 rounded-xl p-4 mb-4 bg-white"
            >
              <View className="flex-row items-center justify-between">
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

                    {fileObj?.name && (
                      <Text className="text-[11px] text-[#1FAD4E] mt-1">
                        ✅ {fileObj.name}
                      </Text>
                    )}
                  </View>
                </View>

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
  };

  const renderStep5Transport = () => (
    <View className="mb-5">
      <Text className="text-lg font-heading text-[#1FAD4E] mb-4">
        Vehicle Documents
      </Text>
      <Text className="text-xs text-red-500 mb-4">
        Max 2MB per file • Total max 10MB
      </Text>

      {/* RC Book */}
      <View className="mb-4">
        <Text className="text-sm font-subheading text-gray-800 mb-1.5">
          RC Book Upload <Text className="text-red-500">*</Text>
        </Text>
        {formData.documents.rcBook ? (
          <View className="border border-gray-300 rounded-lg p-3 bg-gray-50">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-xs text-gray-700 flex-1" numberOfLines={1}>
                {formData.documents.rcBook.name}
              </Text>
              <TouchableOpacity onPress={() => removeFile('rcBook')}>
                <X size={16} color="#ef4444" />
              </TouchableOpacity>
            </View>
            {formData.documents.rcBook.size && (
              <Text className="text-xs text-gray-500 mb-2">
                {`Size: ${formatFileSize(formData.documents.rcBook.size)}`}
              </Text>
            )}
            <TouchableOpacity
              className="border border-blue-500 bg-blue-50 rounded-lg p-2 flex-row items-center justify-center"
              onPress={() => pickFile('rcBook', true)}
            >
              <Upload size={16} color="#3b82f6" />
              <Text className="text-blue-500 text-xs font-medium ml-2">Reupload</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 items-center justify-center min-h-24"
            onPress={() => pickFile('rcBook', true)}
          >
            <Upload size={24} color="#9ca3af" />
            <Text className="text-xs text-gray-500 mt-2 text-center">
              Upload RC Book (Image)
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Insurance */}
      <View className="mb-4">
        <Text className="text-sm font-subheading text-gray-800 mb-1.5">
          Insurance Document
        </Text>
        {formData.documents.insuranceDoc ? (
          <View className="border border-gray-300 rounded-lg p-3 bg-gray-50">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-xs text-gray-700 flex-1" numberOfLines={1}>
                {formData.documents.insuranceDoc.name}
              </Text>
              <TouchableOpacity onPress={() => removeFile('insuranceDoc')}>
                <X size={16} color="#ef4444" />
              </TouchableOpacity>
            </View>
            {formData.documents.insuranceDoc.size && (
              <Text className="text-xs text-gray-500 mb-2">
                {`Size: ${formatFileSize(formData.documents.insuranceDoc.size)}`}
              </Text>
            )}
            <TouchableOpacity
              className="border border-blue-500 bg-blue-50 rounded-lg p-2 flex-row items-center justify-center"
              onPress={() => pickFile('insuranceDoc', true)}
            >
              <Upload size={16} color="#3b82f6" />
              <Text className="text-blue-500 text-xs font-medium ml-2">Reupload</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 items-center justify-center min-h-24"
            onPress={() => pickFile('insuranceDoc', true)}
          >
            <Upload size={24} color="#9ca3af" />
            <Text className="text-xs text-gray-500 mt-2 text-center">
              Upload Insurance (Image)
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Pollution Certificate */}
      <View className="mb-4">
        <Text className="text-sm font-subheading text-gray-800 mb-1.5">
          Pollution Certificate (PUC)
        </Text>
        {formData.documents.pollutionCert ? (
          <View className="border border-gray-300 rounded-lg p-3 bg-gray-50">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-xs text-gray-700 flex-1" numberOfLines={1}>
                {formData.documents.pollutionCert.name}
              </Text>
              <TouchableOpacity onPress={() => removeFile('pollutionCert')}>
                <X size={16} color="#ef4444" />
              </TouchableOpacity>
            </View>
            {formData.documents.pollutionCert.size && (
              <Text className="text-xs text-gray-500 mb-2">
                {`Size: ${formatFileSize(formData.documents.pollutionCert.size)}`}
              </Text>
            )}
            <TouchableOpacity
              className="border border-blue-500 bg-blue-50 rounded-lg p-2 flex-row items-center justify-center"
              onPress={() => pickFile('pollutionCert', true)}
            >
              <Upload size={16} color="#3b82f6" />
              <Text className="text-blue-500 text-xs font-medium ml-2">Reupload</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 items-center justify-center min-h-24"
            onPress={() => pickFile('pollutionCert', true)}
          >
            <Upload size={24} color="#9ca3af" />
            <Text className="text-xs text-gray-500 mt-2 text-center">
              Upload PUC (Image)
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Permit */}
      <View className="mb-4">
        <Text className="text-sm font-subheading text-gray-800 mb-1.5">
          Permit Document
        </Text>
        {formData.documents.permitDoc ? (
          <View className="border border-gray-300 rounded-lg p-3 bg-gray-50">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-xs text-gray-700 flex-1" numberOfLines={1}>
                {formData.documents.permitDoc.name}
              </Text>
              <TouchableOpacity onPress={() => removeFile('permitDoc')}>
                <X size={16} color="#ef4444" />
              </TouchableOpacity>
            </View>
            {formData.documents.permitDoc.size && (
              <Text className="text-xs text-gray-500 mb-2">
                {`Size: ${formatFileSize(formData.documents.permitDoc.size)}`}
              </Text>
            )}
            <TouchableOpacity
              className="border border-blue-500 bg-blue-50 rounded-lg p-2 flex-row items-center justify-center"
              onPress={() => pickFile('permitDoc', true)}
            >
              <Upload size={16} color="#3b82f6" />
              <Text className="text-blue-500 text-xs font-medium ml-2">Reupload</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 items-center justify-center min-h-24"
            onPress={() => pickFile('permitDoc', true)}
          >
            <Upload size={24} color="#9ca3af" />
            <Text className="text-xs text-gray-500 mt-2 text-center">
              Upload Permit (Image)
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderStep6Transport = () => (
    <View className="mb-5">
      <View className="flex-row items-center mb-4">
        <TouchableOpacity
          className="flex-row items-center"
          onPress={() =>
            setFormData((p) => ({
              ...p,
              isCompany: !p.isCompany,
            }))
          }
        >
          <View
            className={`w-5 h-5 rounded border-2 mr-2 items-center justify-center ${
              formData.isCompany
                ? "bg-[#1FAD4E] border-[#1FAD4E]"
                : "border-gray-300"
            }`}
          >
            {formData.isCompany && (
              <Text className="text-white text-xs font-bold">✓</Text>
            )}
          </View>
          <Text className="text-sm font-medium text-gray-700">
            I am a transport company (with drivers)
          </Text>
        </TouchableOpacity>
      </View>

      {formData.isCompany && (
        <View className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <Text className="text-lg font-heading text-gray-800 mb-4">
            Driver Details
          </Text>

          <View className="mb-3">
            <Text className="text-sm font-subheading text-gray-800 mb-1.5">
              Driver Name <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
              placeholder="Enter driver name"
              value={formData.driverDetails.driverName}
              onChangeText={(text) =>
                setFormData((p) => ({
                  ...p,
                  driverDetails: { ...p.driverDetails, driverName: text },
                }))
              }
            />
          </View>

          <View className="mb-3">
            <Text className="text-sm font-subheading text-gray-800 mb-1.5">
              Driver Mobile No. <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
              placeholder="10-digit mobile number"
              keyboardType="phone-pad"
              maxLength={10}
              value={formData.driverDetails.driverMobileNo}
              onChangeText={(text) =>
                setFormData((p) => ({
                  ...p,
                  driverDetails: { ...p.driverDetails, driverMobileNo: text },
                }))
              }
            />
          </View>

          <View className="mb-3">
            <Text className="text-sm font-subheading text-gray-800 mb-1.5">
              Driver Age
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
              placeholder="Enter age"
              keyboardType="numeric"
              value={formData.driverDetails.driverAge}
              onChangeText={(text) =>
                setFormData((p) => ({
                  ...p,
                  driverDetails: { ...p.driverDetails, driverAge: text },
                }))
              }
            />
          </View>

          <View className="mb-4">
            <Text className="text-sm font-subheading text-gray-800 mb-1.5">
              Driving Licence Upload <Text className="text-red-500">*</Text>
            </Text>
            {formData.documents.driverLicense ? (
              <View className="border border-gray-300 rounded-lg p-3 bg-white">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-xs text-gray-700 flex-1" numberOfLines={1}>
                    {formData.documents.driverLicense.name}
                  </Text>
                  <TouchableOpacity onPress={() => removeFile('driverLicense')}>
                    <X size={16} color="#ef4444" />
                  </TouchableOpacity>
                </View>
                {formData.documents.driverLicense.size && (
                  <Text className="text-xs text-gray-500 mb-2">
                    {`Size: ${formatFileSize(formData.documents.driverLicense.size)}`}
                  </Text>
                )}
                <TouchableOpacity
                  className="border border-blue-500 bg-blue-50 rounded-lg p-2 flex-row items-center justify-center"
                  onPress={() => pickFile('driverLicense', true)}
                >
                  <Upload size={16} color="#3b82f6" />
                  <Text className="text-blue-500 text-xs font-medium ml-2">Reupload</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 items-center justify-center min-h-24 bg-white"
                onPress={() => pickFile('driverLicense', true)}
              >
                <Upload size={24} color="#9ca3af" />
                <Text className="text-xs text-gray-500 mt-2 text-center">
                  Upload Driving Licence (Image)
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View className="mb-4">
            <Text className="text-sm font-subheading text-gray-800 mb-1.5">
              Driver Photo
            </Text>
            {formData.documents.driverPhoto ? (
              <View className="border border-gray-300 rounded-lg p-3 bg-white">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-xs text-gray-700 flex-1" numberOfLines={1}>
                    {formData.documents.driverPhoto.name}
                  </Text>
                  <TouchableOpacity onPress={() => removeFile('driverPhoto')}>
                    <X size={16} color="#ef4444" />
                  </TouchableOpacity>
                </View>
                {formData.documents.driverPhoto.size && (
                  <Text className="text-xs text-gray-500 mb-2">
                    {`Size: ${formatFileSize(formData.documents.driverPhoto.size)}`}
                  </Text>
                )}
                <TouchableOpacity
                  className="border border-blue-500 bg-blue-50 rounded-lg p-2 flex-row items-center justify-center"
                  onPress={() => pickFile('driverPhoto', false)}
                >
                  <Upload size={16} color="#3b82f6" />
                  <Text className="text-blue-500 text-xs font-medium ml-2">Reupload</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 items-center justify-center min-h-24 bg-white"
                onPress={() => pickFile('driverPhoto', false)}
              >
                <Upload size={24} color="#9ca3af" />
                <Text className="text-xs text-gray-500 mt-2 text-center">
                  Upload Driver Photo
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </View>
  );

  const renderStep5 = () => (
    <View className="mb-5">
      <Text className="text-lg font-heading text-[#1FAD4E] mb-4">Security</Text>

      <View className="mb-3">
        <Text className="text-sm font-subheading text-gray-800 mb-1.5">
          Referral Code (Optional)
        </Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white"
          placeholder="Referral code"
          value={formData.security.referralCode}
          onChangeText={(text) =>
            setFormData((p) => ({
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
          onChangeText={(text) =>
            setFormData((p) => ({
              ...p,
              security: { ...p.security, mpin: text },
            }))
          }
        />
        <Text className="text-xs text-gray-500 mt-1">Quick login PIN</Text>
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
          onChangeText={(text) =>
            setFormData((p) => ({
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
          onChangeText={(text) =>
            setFormData((p) => ({
              ...p,
              security: { ...p.security, password: text },
            }))
          }
        />
        <Text className="text-xs text-gray-500 mt-1">Min 6 characters</Text>
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
          onChangeText={(text) =>
            setFormData((p) => ({
              ...p,
              security: { ...p.security, confirmPassword: text },
            }))
          }
        />
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <View className="flex-1 bg-white py-10">
        <View className="absolute -top-24 -left-40 w-72 h-72 rounded-full bg-[#E8FDEB]" />

        <ScrollView
          contentContainerStyle={{ paddingBottom: 140 }}
          keyboardShouldPersistTaps="handled"
          className="px-4 py-4"
        >
          <View className="p-5">
            <View className="items-center mb-5">
              <Text className="text-2xl text-[#1FAD4E] font-medium">
                Create{" "}
                {role === "farmer"
                  ? "Farmer"
                  : role === "trader"
                  ? "Trader"
                  : role === "partner"
                  ? "Partner"
                  : "Transport"}{" "}
                Account
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
            {role === "transport" && currentStep === 5 && renderStep5Transport()}
            {role === "transport" && currentStep === 6 && renderStep6Transport()}
            {((role === "transport" && currentStep === 7) || (role !== "transport" && currentStep === 5)) && renderStep5()}

            {error ? (
              <View className="bg-red-100 px-3 py-2.5 rounded-lg mt-2">
                <Text className="text-sm text-red-700 text-center">
                  {error}
                </Text>
              </View>
            ) : null}
          </View>
        </ScrollView>

        <View className="bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
          <View className="flex-row justify-between gap-3">
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
                className="flex-row items-center px-4 py-3 rounded-lg flex-1 justify-center bg-[#1FAD4E]"
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
                  loading ? "opacity-70" : ""
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
        </View>

        <View className="flex-row justify-center">
          <Text className="text-sm text-gray-500">Already registered? </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/Login")}>
            <Text className="text-sm text-[#1FAD4E] font-medium">
              Login here
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default FarmerRegistration;