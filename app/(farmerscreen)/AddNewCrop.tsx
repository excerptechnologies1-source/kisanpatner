

// import AsyncStorage from '@react-native-async-storage/async-storage';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import axios from 'axios';
// import {
//   Calendar,
//   ChevronLeft,
//   Plus,
//   RefreshCw
// } from 'lucide-react-native';
// import React, { useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   FlatList,
//   Modal,
//   Platform,
//   SafeAreaView,
//   ScrollView,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View
// } from 'react-native';
// import StageUpload from './StageUpload';


// interface Crop {
//   _id: string;
//   farmingType: string;
//   seedType: string;
//   acres: number;
//   sowingDate: string;
//   farmerId: string;
//   trackingId?: string;
//   createdAt?: string;
// }



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


// const CropManagement: React.FC = () => {
//   const [showAddNewCrop, setShowAddNewCrop] = useState(false);
//   const [showMyCrops, setShowMyCrops] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [fetchingCrops, setFetchingCrops] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);

//   // Add New Crop States
//   const [farmingTypeCrop, setFarmingTypeCrop] = useState('');
//   const [seedTypeCrop, setSeedTypeCrop] = useState('');
//   const [acres, setAcres] = useState('');
//   const [sowingDate, setSowingDate] = useState<Date | null>(null);
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [myCrops, setMyCrops] = useState<Crop[]>([]);
//   const [showStageUpload, setShowStageUpload] = useState(false);
//   const [createdCrop, setCreatedCrop] = useState<Crop | null>(null);

//   // Debug state changes
//   useEffect(() => {
//     console.log('myCrops state updated:', myCrops);
//   }, [myCrops]);

//   const showMessage = (message: string, type: 'success' | 'error') => {
//     if (type === 'success') {
//       setSuccess(message);
//       setError(null);
//     } else {
//       setError(message);
//       setSuccess(null);
//     }
//     setTimeout(() => {
//       setSuccess(null);
//       setError(null);
//     }, 5000);
//   };

//   const fetchFarmerCrops = async () => {
//     try {
//       setFetchingCrops(true);
//       const farmerId = await AsyncStorage.getItem('farmerId');

//       console.log('Fetched farmerId:', farmerId);
    
//       if (!farmerId) {
//         showMessage('Please login as farmer', 'error');
//         return;
//       }

//       const response = await api.get(`/crop/farmer/${farmerId}`);
//       console.log('Fetched crops response:', response.data);
      
//       if (response.data.success) {
//         // Ensure we're setting the array correctly
//         const cropsArray = response.data.data || [];
//         console.log('Setting myCrops to:', cropsArray.length, 'crops');
//         setMyCrops(cropsArray);
//       } else {
//         console.log('API response not successful:', response.data);
//         setMyCrops([]);
//       }
//     } catch (error: any) {
//       console.error('Error fetching farmer crops:', error);
//       console.error('Error response:', error.response?.data);
//       showMessage('Error fetching crops: ' + (error.message || 'Network error'), 'error');
//       setMyCrops([]);
//     } finally {
//       setFetchingCrops(false);
//     }
//   };

//   const handleAddCropSubmit = async () => {
//     if (!farmingTypeCrop || !seedTypeCrop || !acres || !sowingDate) {
//       showMessage('Please fill all fields', 'error');
//       return;
//     }

//     try {
//       // FIX: Extract farmerId from userData string
//       const userDataString = await AsyncStorage.getItem('userData');
//       if (!userDataString) {
//         showMessage('Please login as farmer', 'error');
//         return;
//       }

//       const userData = JSON.parse(userDataString);
//       const farmerId = userData.farmerId || userData.id;
      
//       if (!farmerId) {
//         showMessage('Please login as farmer', 'error');
//         return;
//       }

//       const cropData = {
//         farmingType: farmingTypeCrop,
//         seedType: seedTypeCrop,
//         acres: parseFloat(acres),
//         sowingDate: sowingDate.toISOString(),
//         farmerId: farmerId,
//       };

//       console.log('Submitting crop data:', cropData);

//       setLoading(true);
//       const response = await api.post('/crop/add', cropData);

//       console.log('Add crop response:', response.data);

//       if (response.data.success) {
//         showMessage('Crop added successfully!', 'success');
//         setShowAddNewCrop(false);
//         resetCropForm();
//         setCreatedCrop(response.data.data);
//         setShowStageUpload(true);
//         // Refresh crops list after adding new crop
//         if (showMyCrops) {
//           fetchFarmerCrops();
//         }
//       } else {
//         showMessage(response.data.message || 'Failed to add crop', 'error');
//       }
//     } catch (error: any) {
//       console.error('Error adding crop:', error);
//       showMessage(error.response?.data?.message || 'Error adding crop', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetCropForm = () => {
//     setFarmingTypeCrop('');
//     setSeedTypeCrop('');
//     setAcres('');
//     setSowingDate(null);
//   };

//   // MY CROPS VIEW
//   const renderMyCrops = () => {
//     if (!showMyCrops) return null;

//     return (
//       <Modal visible={showMyCrops} animationType="slide">
//         <SafeAreaView className="flex-1 bg-white">
//           <View className="flex-row items-center px-4 py-4 border-b border-gray-200">
//             <TouchableOpacity
//               onPress={() => setShowMyCrops(false)}
//               className="p-2"
//             >
//               <ChevronLeft size={24} color="#374151" />
//             </TouchableOpacity>
//             <Text className="ml-3 text-xl font-medium text-gray-900">My Crops</Text>
            
//             {/* Refresh button */}
//             <TouchableOpacity
//               onPress={fetchFarmerCrops}
//               className="ml-auto p-2"
//               disabled={fetchingCrops}
//             >
//               {fetchingCrops ? (
//                 <ActivityIndicator size="small" color="#3B82F6" />
//               ) : (
//                 <RefreshCw size={20} color="#3B82F6" />
//               )}
//             </TouchableOpacity>
//           </View>

//           {fetchingCrops ? (
//             <View className="flex-1 justify-center items-center">
//               <ActivityIndicator size="large" color="#10B981" />
//               <Text className="mt-2 text-gray-600">Loading crops...</Text>
//             </View>
//           ) : (
//             <>
//               {/* Debug info (remove in production) */}
//               <View className="px-4 py-2 bg-gray-100">
//                 <Text className="text-xs text-gray-500">
//                   Found {myCrops.length} crops
//                 </Text>
//               </View>

//               <FlatList
//                 data={myCrops}
//                 keyExtractor={(item) => item._id}
//                 ListHeaderComponent={
//                   myCrops.length > 0 ? (
//                     <View className="px-4 py-2">
//                       <Text className="text-gray-500 text-sm">
//                         Total Crops: {myCrops.length}
//                       </Text>
//                     </View>
//                   ) : null
//                 }
//                 renderItem={({ item }) => (
//                   <View className="m-4 p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
//                     <View className="flex-row justify-between items-start">
//                       <View className="flex-1">
//                         <Text className="text-lg font-medium text-gray-900">
//                           {item.seedType ? item.seedType.charAt(0).toUpperCase() + item.seedType.slice(1) : 'Unknown Seed'}
//                         </Text>
//                         <Text className="text-sm text-gray-600 mt-1">
//                           <Text className="font-medium">Farming Type:</Text> {item.farmingType ? item.farmingType.charAt(0).toUpperCase() + item.farmingType.slice(1) : 'N/A'}
//                         </Text>
//                         <Text className="text-sm text-gray-600 mt-1">
//                           <Text className="font-medium">Acres:</Text> {item.acres || 0}
//                         </Text>
//                         <Text className="text-sm text-gray-600 mt-1">
//                           <Text className="font-medium">Sowing Date:</Text> {item.sowingDate 
//                             ? new Date(item.sowingDate).toLocaleDateString('en-IN', {
//                                 day: 'numeric',
//                                 month: 'short',
//                                 year: 'numeric'
//                               })
//                             : 'Not set'}
//                         </Text>
//                         {item.createdAt && (
//                           <Text className="text-xs text-gray-500 mt-1">
//                             <Text className="font-medium">Added:</Text> {new Date(item.createdAt).toLocaleDateString()}
//                           </Text>
//                         )}
//                         {item.trackingId && (
//                           <Text className="text-xs text-blue-500 mt-2">
//                             <Text className="font-medium">Tracking ID:</Text> {item.trackingId}
//                           </Text>
//                         )}
//                       </View>
//                       <TouchableOpacity
//                         onPress={() => {
//                           setCreatedCrop(item);
//                           setShowStageUpload(true);
//                         }}
//                         className="px-4 py-2 bg-emerald-500 rounded-lg ml-2"
//                       >
//                         <Text className="text-white font-medium text-sm">Upload Stages</Text>
//                       </TouchableOpacity>
//                     </View>
//                   </View>
//                 )}
//                 ListEmptyComponent={
//                   <View className="flex-1 items-center justify-center py-12 px-4">
//                     <Text className="text-gray-600 font-medium text-lg mb-2">
//                       No crops found
//                     </Text>
//                     <Text className="text-gray-500 text-center">
//                       Add your first crop by tapping the + button below
//                     </Text>
//                     <TouchableOpacity
//                       onPress={() => {
//                         setShowMyCrops(false);
//                         setShowAddNewCrop(true);
//                       }}
//                       className="mt-4 px-6 py-3 bg-emerald-500 rounded-lg"
//                     >
//                       <Text className="text-white font-medium">Add First Crop</Text>
//                     </TouchableOpacity>
//                   </View>
//                 }
//               />
//             </>
//           )}

//           <TouchableOpacity
//             onPress={() => {
//               setShowMyCrops(false);
//               setShowAddNewCrop(true);
//             }}
//             className="absolute bottom-6 right-6 w-14 h-14 bg-emerald-500 rounded-full items-center justify-center shadow-lg"
//           >
//             <Plus size={24} color="white" />
//           </TouchableOpacity>
//         </SafeAreaView>
//       </Modal>
//     );
//   };

//   // ADD NEW CROP MODAL
//   const renderAddNewCrop = () => {
//     if (!showAddNewCrop) return null;

//     return (
//       <Modal visible={showAddNewCrop} animationType="slide">
//         <SafeAreaView className="flex-1 bg-white">
//           <View className="flex-row items-center px-4 py-4 border-b border-gray-200">
//             <TouchableOpacity
//               onPress={() => {
//                 setShowAddNewCrop(false);
//                 resetCropForm();
//                 if (showMyCrops) {
//                   setShowMyCrops(true);
//                 }
//               }}
//               className="p-2"
//             >
//               <ChevronLeft size={24} color="#374151" />
//             </TouchableOpacity>
//             <Text className="ml-3 text-xl font-medium text-gray-900">Add New Crop</Text>
//           </View>

//           <ScrollView className="flex-1 px-4 py-4" showsVerticalScrollIndicator={false}>
//             {/* Error/Success Messages */}
//             {error && (
//               <View className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg">
//                 <Text className="text-red-800">{error}</Text>
//               </View>
//             )}
//             {success && (
//               <View className="mb-4 p-3 bg-emerald-100 border border-emerald-300 rounded-lg">
//                 <Text className="text-emerald-800">{success}</Text>
//               </View>
//             )}

//             {/* Form Fields */}
//             <View className="space-y-4">
//               <View className="mb-4">
//                 <Text className="font-medium text-gray-700 mb-2">Type of Farming</Text>
//                 <View className="flex-row flex-wrap gap-2">
//                   {['regular', 'organic', 'natural', 'hydroponic'].map((type) => (
//                     <TouchableOpacity
//                       key={type}
//                       onPress={() => setFarmingTypeCrop(type)}
//                       className={`px-4 py-3 border rounded-lg ${
//                         farmingTypeCrop === type
//                           ? 'border-emerald-500 bg-emerald-100'
//                           : 'border-gray-300 bg-white'
//                       }`}
//                     >
//                       <Text className="capitalize text-sm font-medium">{type}</Text>
//                     </TouchableOpacity>
//                   ))}
//                 </View>
//               </View>

//               <View className="mb-4">
//                 <Text className="font-medium text-gray-700 mb-2">Type of Seeds</Text>
//                 <View className="flex-row flex-wrap gap-2">
//                   {['naati', 'hybrid', 'gmo', 'heirloom'].map((seed) => (
//                     <TouchableOpacity
//                       key={seed}
//                       onPress={() => setSeedTypeCrop(seed)}
//                       className={`px-4 py-3 border rounded-lg ${
//                         seedTypeCrop === seed
//                           ? 'border-emerald-500 bg-emerald-100'
//                           : 'border-gray-300 bg-white'
//                       }`}
//                     >
//                       <Text className="capitalize text-sm font-medium">{seed}</Text>
//                     </TouchableOpacity>
//                   ))}
//                 </View>
//               </View>

//               <View className="mb-4">
//                 <Text className="font-medium text-gray-700 mb-2">Number of Acres</Text>
//                 <TextInput
//                   value={acres}
//                   onChangeText={setAcres}
//                   placeholder="Enter number of acres"
//                   placeholderTextColor="#9CA3AF"
//                   keyboardType="numeric"
//                   className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
//                 />
//               </View>

//               <View className="mb-4">
//                 <Text className="font-medium text-gray-700 mb-2">Date of Sowing</Text>
//                 <TouchableOpacity
//                   onPress={() => setShowDatePicker(true)}
//                   className="border border-gray-300 rounded-lg px-4 py-3 flex-row justify-between items-center"
//                 >
//                   <Text className={sowingDate ? "text-gray-900" : "text-gray-500"}>
//                     {sowingDate ? sowingDate.toDateString() : 'Select date'}
//                   </Text>
//                   <Calendar size={20} color="#6B7280" />
//                 </TouchableOpacity>
//               </View>

//               {showDatePicker && (
//                 <DateTimePicker
//                   value={sowingDate || new Date()}
//                   mode="date"
//                   display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//                   maximumDate={new Date()}
//                   onChange={(event, date) => {
//                     setShowDatePicker(false);
//                     if (date) setSowingDate(date);
//                   }}
//                 />
//               )}
//             </View>

//             {/* Submit Button */}
//             <TouchableOpacity
//               onPress={handleAddCropSubmit}
//               disabled={loading || !farmingTypeCrop || !seedTypeCrop || !acres || !sowingDate}
//               className={`py-3 rounded-lg items-center mt-2 mb-8 ${
//                 loading || !farmingTypeCrop || !seedTypeCrop || !acres || !sowingDate
//                   ? 'bg-gray-300'
//                   : 'bg-emerald-500'
//               }`}
//             >
//               {loading ? (
//                 <ActivityIndicator color="white" />
//               ) : (
//                 <Text className="text-white font-medium text-base">Add Crop</Text>
//               )}
//             </TouchableOpacity>
//           </ScrollView>
//         </SafeAreaView>
//       </Modal>
//     );
//   };

//   // STAGE UPLOAD MODAL
//   if (showStageUpload && createdCrop) {
//     return <StageUpload crop={createdCrop} onClose={() => setShowStageUpload(false)} />;
//   }

//   return (
//     <SafeAreaView className="flex-1 bg-white">
//       {/* Header */}
//       <View className="px-4 py-4 bg-white border-b border-gray-200">
//         <Text className="text-2xl font-medium text-center text-gray-900">Crop Management</Text>
//       </View>

//       {/* Main Content */}
//       <View className="flex-1 justify-center items-center px-8">
//         <Text className="text-base text-gray-600 text-center mb-8">
//           Manage your crops and track their growth stages
//         </Text>

//         <View className="w-full space-y-4">
//           <TouchableOpacity
//             onPress={() => {
//               setShowMyCrops(true);
//               // Fetch crops when opening
//               setTimeout(() => {
//                 fetchFarmerCrops();
//               }, 100);
//             }}
//             className="py-4 bg-blue-500 rounded-lg items-center shadow-sm"
//           >
//             <Text className="text-white font-medium text-base">My Crops</Text>
//           </TouchableOpacity>

//           {/* <TouchableOpacity
//             onPress={() => setShowAddNewCrop(true)}
//             className="py-4 bg-emerald-500 rounded-lg items-center shadow-sm"
//           >
//             <Text className="text-white font-medium text-base">+ Add New Crop</Text>
//           </TouchableOpacity> */}
//         </View>

//         {/* Current crops count preview */}
//         {myCrops.length > 0 && (
//           <View className="mt-8 p-4 bg-gray-50 rounded-lg">
//             <Text className="text-gray-600 text-center">
//               You have {myCrops.length} crop{myCrops.length !== 1 ? 's' : ''} in your farm
//             </Text>
//           </View>
//         )}
//       </View>

//       {/* Modals */}
//       {renderMyCrops()}
//       {renderAddNewCrop()}
//     </SafeAreaView>
//   );
// };

// export default CropManagement;








import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Calendar,
  ChevronLeft,
  Plus,
  RefreshCw
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import StageUpload from './StageUpload';

interface Crop {
  _id: string;
  farmingType: string;
  seedType: string;
  acres: number;
  sowingDate: string;
  farmerId: string;
  trackingId?: string;
  createdAt?: string;
}



// API Base URL configuration
const API_BASE_URL = 'https://kisan.etpl.ai';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

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


const CropManagement: React.FC = () => {

    const router = useRouter();
  const params = useLocalSearchParams();
  const categoryId = params.categoryId as string;
  const subCategoryId = params.subCategoryId as string;

  console.log('Received params:', params, 'categoryId:', categoryId, 'subCategoryId:', subCategoryId);

  const [showAddNewCrop, setShowAddNewCrop] = useState(false);
  const [showMyCrops, setShowMyCrops] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingCrops, setFetchingCrops] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Add New Crop States
  const [farmingTypeCrop, setFarmingTypeCrop] = useState('');
  const [seedTypeCrop, setSeedTypeCrop] = useState('');
  const [acres, setAcres] = useState('');
  const [sowingDate, setSowingDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [myCrops, setMyCrops] = useState<Crop[]>([]);
  const [showStageUpload, setShowStageUpload] = useState(false);
  const [createdCrop, setCreatedCrop] = useState<Crop | null>(null);

  // Debug state changes
  useEffect(() => {
    console.log('myCrops state updated:', myCrops);
  }, [myCrops]);

  const showMessage = (message: string, type: 'success' | 'error') => {
    if (type === 'success') {
      setSuccess(message);
      setError(null);
    } else {
      setError(message);
      setSuccess(null);
    }
    setTimeout(() => {
      setSuccess(null);
      setError(null);
    }, 5000);
  };

  const fetchFarmerCrops = async () => {
    try {
      setFetchingCrops(true);
      const farmerId = await AsyncStorage.getItem('farmerId');

      console.log('Fetched farmerId:', farmerId);
    
      if (!farmerId) {
        showMessage('Please login as farmer', 'error');
        return;
      }

      const response = await api.get(`/crop/farmer/${farmerId}`);
      console.log('Fetched crops response:', response.data);
      
      if (response.data.success) {
        // Ensure we're setting the array correctly
        const cropsArray = response.data.data || [];
        console.log('Setting myCrops to:', cropsArray.length, 'crops');
        setMyCrops(cropsArray);
      } else {
        console.log('API response not successful:', response.data);
        setMyCrops([]);
      }
    } catch (error: any) {
      console.error('Error fetching farmer crops:', error);
      console.error('Error response:', error.response?.data);
      showMessage('Error fetching crops: ' + (error.message || 'Network error'), 'error');
      setMyCrops([]);
    } finally {
      setFetchingCrops(false);
    }
  };

  const handleAddCropSubmit = async () => {
    if (!farmingTypeCrop || !seedTypeCrop || !acres || !sowingDate) {
      showMessage('Please fill all fields', 'error');
      return;
    }

    try {
      // FIX: Extract farmerId from userData string
      const userDataString = await AsyncStorage.getItem('userData');
      if (!userDataString) {
        showMessage('Please login as farmer', 'error');
        return;
      }

      const userData = JSON.parse(userDataString);
      const farmerId = userData.farmerId || userData.id;
      
      if (!farmerId) {
        showMessage('Please login as farmer', 'error');
        return;
      }

      const cropData = {
        farmingType: farmingTypeCrop,
        seedType: seedTypeCrop,
        acres: parseFloat(acres),
        sowingDate: sowingDate.toISOString(),
        farmerId: farmerId,
        categoryId: categoryId,
        subCategoryId: subCategoryId,
      };

      console.log('Submitting crop data:', cropData);

      setLoading(true);
      const response = await api.post('/crop/add', cropData);

      console.log('Add crop response:', response.data);

      if (response.data.success) {
        showMessage('Crop added successfully!', 'success');
        setShowAddNewCrop(false);
        resetCropForm();
        setCreatedCrop(response.data.data);
        setShowStageUpload(true);
        // Refresh crops list after adding new crop
        if (showMyCrops) {
          fetchFarmerCrops();
        }
      } else {
        showMessage(response.data.message || 'Failed to add crop', 'error');
      }
    } catch (error: any) {
      console.error('Error adding crop:', error);
      showMessage(error.response?.data?.message || 'Error adding crop', 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetCropForm = () => {
    setFarmingTypeCrop('');
    setSeedTypeCrop('');
    setAcres('');
    setSowingDate(null);
  };

  // MY CROPS VIEW
  const renderMyCrops = () => {
    if (!showMyCrops) return null;

    return (
      <Modal visible={showMyCrops} animationType="slide">
        <SafeAreaView className="flex-1 bg-white">
          <View className="flex-row items-center px-4 py-4 border-b border-gray-200">
            <TouchableOpacity
              onPress={() => setShowMyCrops(false)}
              className="p-2"
            >
              <ChevronLeft size={24} color="#374151" />
            </TouchableOpacity>
            <Text className="ml-3 text-xl font-medium text-gray-900">My Crops</Text>
            
            {/* Refresh button */}
            <TouchableOpacity
              onPress={fetchFarmerCrops}
              className="ml-auto p-2"
              disabled={fetchingCrops}
            >
              {fetchingCrops ? (
                <ActivityIndicator size="small" color="#3B82F6" />
              ) : (
                <RefreshCw size={20} color="#3B82F6" />
              )}
            </TouchableOpacity>
          </View>

          {fetchingCrops ? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="#10B981" />
              <Text className="mt-2 text-gray-600">Loading crops...</Text>
            </View>
          ) : (
            <>
              {/* Debug info (remove in production) */}
              <View className="px-4 py-2 bg-gray-100">
                <Text className="text-xs text-gray-500">
                  Found {myCrops.length} crops
                </Text>
              </View>

              <FlatList
                data={myCrops}
                keyExtractor={(item) => item._id}
                ListHeaderComponent={
                  myCrops.length > 0 ? (
                    <View className="px-4 py-2">
                      <Text className="text-gray-500 text-sm">
                        Total Crops: {myCrops.length}
                      </Text>
                    </View>
                  ) : null
                }
                renderItem={({ item }) => (
                  <View className="m-4 p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                    <View className="flex-row justify-between items-start">
                      <View className="flex-1">
                        <Text className="text-lg font-medium text-gray-900">
                          {item.seedType ? item.seedType.charAt(0).toUpperCase() + item.seedType.slice(1) : 'Unknown Seed'}
                        </Text>
                        <Text className="text-sm text-gray-600 mt-1">
                          <Text className="font-medium">Farming Type:</Text> {item.farmingType ? item.farmingType.charAt(0).toUpperCase() + item.farmingType.slice(1) : 'N/A'}
                        </Text>
                        <Text className="text-sm text-gray-600 mt-1">
                          <Text className="font-medium">Acres:</Text> {item.acres || 0}
                        </Text>
                        <Text className="text-sm text-gray-600 mt-1">
                          <Text className="font-medium">Sowing Date:</Text> {item.sowingDate 
                            ? new Date(item.sowingDate).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })
                            : 'Not set'}
                        </Text>
                        {item.createdAt && (
                          <Text className="text-xs text-gray-500 mt-1">
                            <Text className="font-medium">Added:</Text> {new Date(item.createdAt).toLocaleDateString()}
                          </Text>
                        )}
                        {item.trackingId && (
                          <Text className="text-xs text-blue-500 mt-2">
                            <Text className="font-medium">Tracking ID:</Text> {item.trackingId}
                          </Text>
                        )}
                      </View>
                      <TouchableOpacity
                        onPress={() => {
                          setCreatedCrop(item);
                          setShowStageUpload(true);
                        }}
                        className="px-4 py-2 bg-emerald-500 rounded-lg ml-2"
                      >
                        <Text className="text-white font-medium text-sm">Upload Stages</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                ListEmptyComponent={
                  <View className="flex-1 items-center justify-center py-12 px-4">
                    <Text className="text-gray-600 font-medium text-lg mb-2">
                      No crops found
                    </Text>
                    <Text className="text-gray-500 text-center">
                      Add your first crop by tapping the + button below
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        setShowMyCrops(false);
                        setShowAddNewCrop(true);
                      }}
                      className="mt-4 px-6 py-3 bg-emerald-500 rounded-lg"
                    >
                      <Text className="text-white font-medium">Add First Crop</Text>
                    </TouchableOpacity>
                  </View>
                }
              />
            </>
          )}

          <TouchableOpacity
            onPress={() => {
              setShowMyCrops(false);
              setShowAddNewCrop(true);
            }}
            className="absolute bottom-6 right-6 w-14 h-14 bg-emerald-500 rounded-full items-center justify-center shadow-lg"
          >
            <Plus size={24} color="white" />
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    );
  };

  // ADD NEW CROP MODAL
  const renderAddNewCrop = () => {
    if (!showAddNewCrop) return null;

    return (
      <Modal visible={showAddNewCrop} animationType="slide">
        <SafeAreaView className="flex-1 bg-white">
          <View className="flex-row items-center px-4 py-4 border-b border-gray-200">
            <TouchableOpacity
              onPress={() => {
                setShowAddNewCrop(false);
                resetCropForm();
                if (showMyCrops) {
                  setShowMyCrops(true);
                }
              }}
              className="p-2"
            >
              <ChevronLeft size={24} color="#374151" />
            </TouchableOpacity>
            <Text className="ml-3 text-xl font-medium text-gray-900">Add New Crop</Text>
          </View>

          <ScrollView className="flex-1 px-4 py-4" showsVerticalScrollIndicator={false}>
            {/* Error/Success Messages */}
            {error && (
              <View className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg">
                <Text className="text-red-800">{error}</Text>
              </View>
            )}
            {success && (
              <View className="mb-4 p-3 bg-emerald-100 border border-emerald-300 rounded-lg">
                <Text className="text-emerald-800">{success}</Text>
              </View>
            )}

           {/* Form Fields */}
<View className="space-y-4">

  {/* Type of Farming */}
  <View className="mb-4">
    <Text className="font-medium text-gray-700 mb-2">Type of Farming</Text>
    <View className="flex-row flex-wrap gap-2">
      {['regular', 'organic', 'natural', 'hydroponic'].map((type) => (
        <TouchableOpacity
          key={type}
          onPress={() => setFarmingTypeCrop(type)}
          className={`px-4 py-3 border rounded-lg ${
            farmingTypeCrop === type
              ? 'border-emerald-500 bg-emerald-100'
              : 'border-gray-300 bg-white'
          }`}
        >
          <Text className="capitalize text-sm font-medium">{type}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>

  {/* Type of Seeds */}
  <View className="mb-4">
    <Text className="font-medium text-gray-700 mb-2">Type of Seeds</Text>
    <View className="flex-row flex-wrap gap-2">
      {['naati', 'hybrid', 'gmo', 'heirloom'].map((seed) => (
        <TouchableOpacity
          key={seed}
          onPress={() => setSeedTypeCrop(seed)}
          className={`px-4 py-3 border rounded-lg ${
            seedTypeCrop === seed
              ? 'border-emerald-500 bg-emerald-100'
              : 'border-gray-300 bg-white'
          }`}
        >
          <Text className="capitalize text-sm font-medium">{seed}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>

  {/* Number of Acres */}
  <View className="mb-4">
    <Text className="font-medium text-gray-700 mb-2">Number of Acres</Text>
    <TextInput
      value={acres}
      onChangeText={setAcres}
      placeholder="Enter number of acres (optional)"
      placeholderTextColor="#9CA3AF"
      keyboardType="numeric"
      className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
    />
  </View>

  {/* Date of Sowing */}
  <View className="mb-4">
    <Text className="font-medium text-gray-700 mb-2">Date of Sowing</Text>
    <TouchableOpacity
      onPress={() => setShowDatePicker(true)}
      className="border border-gray-300 rounded-lg px-4 py-3 flex-row justify-between items-center"
    >
      <Text className={sowingDate ? "text-gray-900" : "text-gray-500"}>
        {sowingDate ? sowingDate.toDateString() : 'Select date (optional)'}
      </Text>
      <Calendar size={20} color="#6B7280" />
    </TouchableOpacity>
  </View>

  {showDatePicker && (
    <DateTimePicker
      value={sowingDate || new Date()}
      mode="date"
      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
      maximumDate={new Date()}
      onChange={(event, date) => {
        setShowDatePicker(false);
        if (date) setSowingDate(date);
      }}
    />
  )}

</View>


            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleAddCropSubmit}
              disabled={loading || !farmingTypeCrop || !seedTypeCrop || !acres || !sowingDate}
              className={`py-3 rounded-lg items-center mt-2 mb-8 ${
                loading || !farmingTypeCrop || !seedTypeCrop || !acres || !sowingDate
                  ? 'bg-gray-300'
                  : 'bg-emerald-500'
              }`}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-medium text-base">Add Crop</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    );
  };

  // STAGE UPLOAD MODAL
  if (showStageUpload && createdCrop) {
    return <StageUpload crop={createdCrop} onClose={() => setShowStageUpload(false)} />;
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 py-4 bg-white border-b border-gray-200">
        <Text className="text-2xl font-medium text-center text-gray-900">Crop Management</Text>
      </View>

      {/* Main Content */}
      <View className="flex-1 justify-center items-center px-8">
        <Text className="text-base text-gray-600 text-center mb-8">
          Manage your crops and track their growth stages
        </Text>

        <View className="w-full space-y-4">
          <TouchableOpacity
            onPress={() => {
              setShowMyCrops(true);
              // Fetch crops when opening
              setTimeout(() => {
                fetchFarmerCrops();
              }, 100);
            }}
            className="py-4 bg-blue-500 rounded-lg items-center shadow-sm mb-4"
          >
            <Text className="text-white font-medium text-base">My Crops</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowAddNewCrop(true)}
            className="py-4 bg-emerald-500 rounded-lg items-center shadow-sm"
          >
            <Text className="text-white font-medium text-base">+ Add New Crop</Text>
          </TouchableOpacity>
        </View>

        {/* Current crops count preview */}
        {myCrops.length > 0 && (
          <View className="mt-8 p-4 bg-gray-50 rounded-lg">
            <Text className="text-gray-600 text-center">
              You have {myCrops.length} crop{myCrops.length !== 1 ? 's' : ''} in your farm
            </Text>
          </View>
        )}
      </View>

      {/* Modals */}
      {renderMyCrops()}
      {renderAddNewCrop()}
    </SafeAreaView>
  );
};

export default CropManagement;