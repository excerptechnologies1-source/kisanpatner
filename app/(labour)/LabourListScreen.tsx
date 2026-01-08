

// import React, { useState, useEffect, useCallback } from "react";
// import { router } from "expo-router";
// import {
//   View,
//   Text,
//   Image,
//   TextInput,
//   ScrollView,
//   TouchableOpacity,
//   RefreshControl,
//   Platform,
//   ActivityIndicator,
//   Alert,
// } from "react-native";
// import { AntDesign, FontAwesome, Feather } from "@expo/vector-icons";
// import axios from "axios";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { NavigationProps, Labourer } from "../labourscreen/types";
// import { ChevronLeft } from "lucide-react-native";
// import { Picker } from "@react-native-picker/picker";
// import CustomAlert from "@/components/CustomAlert";

// // Images
// const maleAvatar = "https://cdn-icons-png.flaticon.com/512/6858/6858504.png";
// const femaleAvatar = "https://cdn-icons-png.flaticon.com/512/6997/6997662.png";

// // API Config
// const API_URL =
//   Platform.OS === "android"
//     ? "https://labourkisan.etpl.ai"
//     : "https://labourkisan.etpl.ai";

// export default function LabourListScreen({
//   navigation,
// }: NavigationProps<"LabourList">) {
//   const [labourers, setLabourers] = useState<Labourer[]>([]);
//   const [villages, setVillages] = useState<string[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [villagesLoading, setVillagesLoading] = useState<boolean>(true);
//   const [refreshing, setRefreshing] = useState<boolean>(false);
//   const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
//   const [searchText, setSearchText] = useState("");
//   const [villageFilter, setVillageFilter] = useState("");
//   const [error, setError] = useState<string>("");
//   const [showAlert, setShowAlert] = useState(false);
// const [alertTitle, setAlertTitle] = useState("");
// const [alertMessage, setAlertMessage] = useState("");
// const [alertAction, setAlertAction] = useState<null | (() => void)>(null);

// const showAppAlert = (title: string, message: string, action?: () => void) => {
//   setAlertTitle(title);
//   setAlertMessage(message);
//   setAlertAction(() => action || null);
//   setShowAlert(true);
// };


//   // Fetch unique villages from API
//   const fetchVillages = async () => {
//     try {
//       setVillagesLoading(true);
//       const response = await axios.get(`${API_URL}/labour/villages`);
      
//       if (response.data?.success) {
//         setVillages(response.data.data || []);
//       }
//     } catch (error) {
//       console.error("Error fetching villages:", error);
//       // Fallback: extract unique villages from current labourers if API fails
//       const uniqueVillages = Array.from(
//         new Set(labourers.map((l) => l.villageName).filter(Boolean))
//       );
//       setVillages(uniqueVillages);
//     } finally {
//       setVillagesLoading(false);
//     }
//   };

//   // Fetch labourers with filters from API
//   const fetchLabourers = async (name?: string, village?: string) => {
//     try {
//       setLoading(true);
//       setError("");

//       const params: any = {};
//       if (name && name.trim()) {
//         params.search = name.trim();
//       }
//       if (village && village.trim()) {
//         params.village = village.trim();
//       }

//       const response = await axios.get(`${API_URL}/labour`, { params });

//       if (response.data?.success) {
//         setLabourers(response.data.data || []);
//       } else {
//         setLabourers([]);
//       }
//     } catch (error: any) {
//       console.error("Error fetching labourers:", error);
//       setError("Failed to fetch data. Please check your connection.");
//       showAppAlert(
//         "Error",
//         error?.response?.data?.message ||
//           "Failed to fetch data. Ensure backend is running."
//       );
//       setLabourers([]);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   // Initial fetch
//   useEffect(() => {
//     fetchLabourers();
//     fetchVillages();
//   }, []);

//   // Debounced search with 400ms delay for searchText only
//   useEffect(() => {
//     const delay = setTimeout(() => {
//       fetchLabourers(searchText, villageFilter);
//     }, 400);

//     return () => clearTimeout(delay);
//   }, [searchText]);

//   // Immediate fetch when village filter changes (no debounce)
//   useEffect(() => {
//     fetchLabourers(searchText, villageFilter);
//   }, [villageFilter]);

//   // Pull to refresh
//   const onRefresh = useCallback(() => {
//     setRefreshing(true);
//     fetchLabourers(searchText, villageFilter);
//     fetchVillages();
//   }, [searchText, villageFilter]);

//   // Toggle selection (if needed for bulk operations)
//   const toggleSelection = (id: string) => {
//     const copy = new Set(selectedIds);
//     copy.has(id) ? copy.delete(id) : copy.add(id);
//     setSelectedIds(copy);
//   };

//   // Handle attendance
//   const handleAttendance = async (labourer: Labourer) => {
//     try {
//       const response = await axios.post(
//         `${API_URL}/labour/${labourer._id}/assign`,
//         {
//           farmerId: "DEFAULT_FARMER",
//           assignmentDate: new Date().toISOString(),
//           notes: "Quick attendance from mobile list",
//         }
//       );

//       if (response.data.success) {
//         router.push({
//           pathname: "/labourscreen/AttendanceScreen",
//           params: {
//             assignmentId: response.data.data.assignmentId,
//             labourer: JSON.stringify(labourer),
//           },
//         });
//       }
//     } catch (error: any) {
//       showAppAlert(
//         "Error",
//         error?.response?.data?.message || "Failed to assign labourer"
//       );
//     }
//   };

//   // Clear all filters
//   const clearFilters = () => {
//     setSearchText("");
//     setVillageFilter("");
//   };

//   return (
//     <>
//     <SafeAreaView className="bg-white flex-1">
//       {/* Header */}
//       <View className="flex-row items-center px-4 py-4 border-b border-gray-200">
//         <TouchableOpacity
//           onPress={() => router.push("/(farmer)/home")}
//           className="p-2"
//         >
//           <ChevronLeft size={24} color="#374151" />
//         </TouchableOpacity>
//         <Text className="ml-3 text-xl font-medium text-gray-900">
//           Agricultural Labour Directory
//         </Text>
//       </View>

//       {/* Filters */}
//       <View className="mb-4 space-y-3 gap-3 px-4 mt-3">
//         {/* Search by Name */}
//         <View className="flex-row items-center bg-white-100 rounded-lg px-3 py-2 border border-gray-200">
//           <Feather name="search" size={16} color="#6B7280" />
//           <TextInput
//             placeholder="Search by name or village"
//             value={searchText}
//             onChangeText={setSearchText}
//             className="ml-2 flex-1 text-sm text-gray-800 font-medium"
//             placeholderTextColor="#9CA3AF"
//           />
//           {searchText.length > 0 && (
//             <TouchableOpacity onPress={() => setSearchText("")}>
//               <Feather name="x" size={16} color="#6B7280" />
//             </TouchableOpacity>
//           )}
//         </View>

       

//         {/* Clear Filters Button */}
//         {(searchText || villageFilter) && (
//           <TouchableOpacity onPress={clearFilters} className="self-end">
//             <Text className="text-blue-600 text-xs font-semibold">
//               Clear Filters
//             </Text>
//           </TouchableOpacity>
//         )}
//       </View>

//       {/* Error Message */}
//       {error && !loading && (
//         <View className="mx-4 mb-3 bg-red-50 border border-red-200 rounded-lg p-3">
//           <Text className="text-red-800 text-sm">{error}</Text>
//         </View>
//       )}

//       {/* Labour List */}
//       <ScrollView
//         className="flex-1 px-4 py-4"
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//       >
//         {loading && !refreshing ? (
//           <ActivityIndicator
//             size="large"
//             color="#2563EB"
//             style={{ marginTop: 40 }}
//           />
//         ) : labourers.length === 0 ? (
//           <View className="mt-20 items-center">
//             <Feather name="user-x" size={48} color="#9CA3AF" />
//             <Text className="text-gray-500 text-base mt-4 text-center">
//               No labourers found
//             </Text>
//             {(searchText || villageFilter) && (
//               <TouchableOpacity onPress={clearFilters} className="mt-3">
//                 <Text className="text-blue-600 text-sm font-semibold">
//                   Clear filters to see all
//                 </Text>
//               </TouchableOpacity>
//             )}
//           </View>
//         ) : (
//           labourers.map((labourer) => {
//             const isSelected = selectedIds.has(labourer._id);
//             const avatar =
//               labourer.gender === "female" ? femaleAvatar : maleAvatar;

//             return (
//               <View
//                 key={labourer._id}
//                 className={`mb-4 bg-white border ${
//                   isSelected ? "border-blue-600 bg-blue-50" : "border-gray-200"
//                 } rounded-lg p-4 relative`}
//               >
//                 <TouchableOpacity
//                   onPress={() =>
//                     router.push({
//                       pathname: "/labourscreen/LabourDetailsScreen",
//                       params: {
//                         id: labourer._id,
//                       },
//                     })
//                   }
//                   activeOpacity={0.7}
//                 >
//                   <View className="absolute left-2 z-10">
//                     <Text className="text-[10px] font-medium text-gray-500 uppercase">
//                       LABOUR ID: {labourer._id.slice(-4)}
//                     </Text>
//                   </View>

//                   <View className="flex-row mt-4 items-center">
//                     <Image
//                       source={{ uri: avatar }}
//                       className="w-16 h-16 rounded-full border border-gray-200"
//                       resizeMode="cover"
//                     />
//                     <View className="ml-4 justify-center flex-1">
//                       <Text className="text-sm font-medium text-gray-900">
//                         {labourer.name}
//                       </Text>
//                       <Text className="text-sm font-medium text-gray-600">
//                         {labourer.villageName}
//                       </Text>
//                     </View>
//                   </View>
//                 </TouchableOpacity>

//                 <View className="flex-row justify-end items-center mt-4 space-x-2 gap-2 flex-wrap">
//                   {/* Status Badge */}
//                   {labourer.todayAttendance === "present" && (
//                     <View className="bg-green-100 px-3 py-1 rounded-full border border-green-200">
//                       <Text className="text-green-800 text-xs font-semibold">
//                         Present Today
//                       </Text>
//                     </View>
//                   )}
//                   {labourer.todayAttendance === "absent" && (
//                     <View className="bg-red-100 px-3 py-1 rounded-full border border-red-200">
//                       <Text className="text-red-800 text-xs font-semibold">
//                         Absent Today
//                       </Text>
//                     </View>
//                   )}

//                   <TouchableOpacity
//                     className={`${
//                       !labourer.todayAttendance ||
//                       labourer.todayAttendance === "pending"
//                         ? "bg-green-500"
//                         : "bg-gray-500"
//                     } px-4 py-2 rounded-full flex-row items-center shadow-sm`}
//                     onPress={() => handleAttendance(labourer)}
//                   >
//                     <Text className="text-white text-xs font-medium">
//                       {!labourer.todayAttendance ||
//                       labourer.todayAttendance === "pending"
//                         ? "Attendance"
//                         : "Update Status"}
//                     </Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             );
//           })
//         )}
//         <View className="h-20" />
//       </ScrollView>
//     </SafeAreaView>

//      <CustomAlert
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
// }




import React, { useState, useEffect, useCallback } from "react";
import { router } from "expo-router";
import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Platform,
  ActivityIndicator,
  Alert,
  Modal,
  Linking,
} from "react-native";
import { AntDesign, FontAwesome, Feather } from "@expo/vector-icons";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationProps, Labourer } from "../labourscreen/types";
import { ChevronLeft } from "lucide-react-native";
import { Picker } from "@react-native-picker/picker";
import CustomAlert from "@/components/CustomAlert";
import DotLoader from "@/components/DotLoader";

// Images
const maleAvatar = "https://cdn-icons-png.flaticon.com/512/6858/6858504.png";
const femaleAvatar = "https://cdn-icons-png.flaticon.com/512/6997/6997662.png";

// API Config
const API_URL =
  Platform.OS === "android"
    ? "https://labourkisan.etpl.ai"
    : "https://labourkisan.etpl.ai";

export default function LabourListScreen({
  navigation,
}: NavigationProps<"LabourList">) {
  const [labourers, setLabourers] = useState<Labourer[]>([]);
  const [villages, setVillages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [villagesLoading, setVillagesLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchText, setSearchText] = useState("");
  const [villageFilter, setVillageFilter] = useState("");
  const [showVillageModal, setShowVillageModal] = useState(false);
  const [error, setError] = useState<string>("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertAction, setAlertAction] = useState<null | (() => void)>(null);

  const showAppAlert = (title: string, message: string, action?: () => void) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertAction(() => action || null);
    setShowAlert(true);
  };

  // Fetch unique villages from API
  const fetchVillages = async () => {
    try {
      setVillagesLoading(true);
      const response = await axios.get(`${API_URL}/labour/villages`);
      
      if (response.data?.success) {
        setVillages(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching villages:", error);
      // Fallback: extract unique villages from current labourers if API fails
      const uniqueVillages = Array.from(
        new Set(labourers.map((l) => l.villageName).filter(Boolean))
      );
      setVillages(uniqueVillages);
    } finally {
      setVillagesLoading(false);
    }
  };

  // Fetch labourers with filters from API
  const fetchLabourers = async (name?: string, village?: string) => {
    try {
      setLoading(true);
      setError("");

      const params: any = {};
      if (name && name.trim()) {
        params.search = name.trim();
      }
      if (village && village.trim()) {
        params.village = village.trim();
      }

      console.log("Fetching labourers with params:", params);

      const response = await axios.get(`${API_URL}/labour`, { params });

      

      if (response.data?.success) {
        const fetchedData = response.data.data || [];
        console.log("Fetched labourers count:", fetchedData.length);
        
        // Apply client-side filtering as backup if server filtering didn't work
        let filteredData = fetchedData;
        
        if (village && village.trim()) {
          filteredData = fetchedData.filter((labourer: Labourer) => 
            labourer.villageName?.toLowerCase() === village.toLowerCase()
          );
          console.log("After village filter:", filteredData.length);
        }
        
        if (name && name.trim()) {
          filteredData = filteredData.filter((labourer: Labourer) =>
            labourer.name?.toLowerCase().includes(name.toLowerCase()) ||
            labourer.villageName?.toLowerCase().includes(name.toLowerCase())
          );
          console.log("After name filter:", filteredData.length);
        }
        
        setLabourers(filteredData);
      } else {
        setLabourers([]);
      }
    } catch (error: any) {
      console.error("Error fetching labourers:", error);
      setError("Failed to fetch data. Please check your connection.");
      showAppAlert(
        "Error",
        error?.response?.data?.message ||
          "Failed to fetch data. Ensure backend is running."
      );
      setLabourers([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchLabourers();
    fetchVillages();
  }, []);

  // Debounced search with 400ms delay for searchText only
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchLabourers(searchText, villageFilter);
    }, 400);

    return () => clearTimeout(delay);
  }, [searchText]);

  // Immediate fetch when village filter changes (no debounce)
  useEffect(() => {
    fetchLabourers(searchText, villageFilter);
  }, [villageFilter]);

  // Pull to refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchLabourers(searchText, villageFilter);
    fetchVillages();
  }, [searchText, villageFilter]);

  // Toggle selection (if needed for bulk operations)
  const toggleSelection = (id: string) => {
    const copy = new Set(selectedIds);
    copy.has(id) ? copy.delete(id) : copy.add(id);
    setSelectedIds(copy);
  };

  // Handle phone call
  const handleCall = (labourer: Labourer) => {
    if (!labourer.contactNumber) {
      showAppAlert(
        "No Contact Number",
        `${labourer.name} does not have a contact number registered.`
      );
      return;
    }

    const phoneNumber = labourer.contactNumber.replace(/[^0-9+]/g, "");
    const phoneUrl = Platform.OS === "ios" ? `telprompt:${phoneNumber}` : `tel:${phoneNumber}`;

    Linking.canOpenURL(phoneUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(phoneUrl);
        } else {
          showAppAlert(
            "Call Failed",
            "Unable to make phone calls on this device."
          );
        }
      })
      .catch((err) => {
        console.error("Error making call:", err);
        showAppAlert("Error", "Failed to initiate phone call.");
      });
  };

  // Handle attendance
  const handleAttendance = async (labourer: Labourer) => {
    try {
      const response = await axios.post(
        `${API_URL}/labour/${labourer._id}/assign`,
        {
          farmerId: "DEFAULT_FARMER",
          assignmentDate: new Date().toISOString(),
          notes: "Quick attendance from mobile list",
        }
      );

      if (response.data.success) {
        router.push({
          pathname: "/labourscreen/AttendanceScreen",
          params: {
            assignmentId: response.data.data.assignmentId,
            labourer: JSON.stringify(labourer),
          },
        });
      }
    } catch (error: any) {
      showAppAlert(
        "Error",
        error?.response?.data?.message || "Failed to assign labourer"
      );
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchText("");
    setVillageFilter("");
  };

  // Handle village selection
  const handleVillageSelect = (village: string) => {
    setVillageFilter(village);
    setShowVillageModal(false);
  };

  return (
    <>
      <SafeAreaView className="bg-white flex-1">
        {/* Header */}
        <View className="flex-row items-center px-4 py-4 border-b border-gray-200">
          <TouchableOpacity
            onPress={() => router.push("/(farmer)/home")}
            className="p-2"
          >
            <ChevronLeft size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="ml-3 text-xl font-medium text-gray-900">
            Agricultural Labour Directory
          </Text>
        </View>

        {/* Filters */}
        <View className="mb-4 space-y-3 gap-3 px-4 mt-3">
          {/* Search by Name with Filter Icon */}
          <View className="flex-row items-center gap-2">
            <View className="flex-1 flex-row items-center bg-white-100 rounded-lg px-3 py-2 border border-gray-200">
              <Feather name="search" size={16} color="#6B7280" />
              <TextInput
                placeholder="Search by name or village"
                value={searchText}
                onChangeText={setSearchText}
                className="ml-2 flex-1 text-sm text-gray-800 font-medium"
                placeholderTextColor="#9CA3AF"
              />
              {searchText.length > 0 && (
                <TouchableOpacity onPress={() => setSearchText("")}>
                  <Feather name="x" size={16} color="#6B7280" />
                </TouchableOpacity>
              )}
            </View>

            {/* Filter Icon Button */}
            <TouchableOpacity
              onPress={() => setShowVillageModal(true)}
              className={`p-3 rounded-lg border ${
                villageFilter ? "bg-blue-50 border-blue-600" : "bg-white border-gray-200"
              }`}
            >
              <Feather 
                name="filter" 
                size={20} 
                color={villageFilter ? "#2563EB" : "#6B7280"} 
              />
              {villageFilter && (
                <View className="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 rounded-full" />
              )}
            </TouchableOpacity>
          </View>

          {/* Selected Village Display */}
          {villageFilter && (
            <View className="flex-row items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
              <View className="flex-row items-center flex-1">
                <Feather name="map-pin" size={14} color="#2563EB" />
                <Text className="ml-2 text-sm font-medium text-blue-800">
                  {villageFilter}
                </Text>
              </View>
              <TouchableOpacity 
                onPress={() => setVillageFilter("")}
                className="p-1"
              >
                <Feather name="x" size={16} color="#2563EB" />
              </TouchableOpacity>
            </View>
          )}

          {/* Clear Filters Button */}
          {(searchText || villageFilter) && (
            <TouchableOpacity onPress={clearFilters} className="self-end">
              <Text className="text-blue-600 text-xs font-semibold">
                Clear Filters
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Error Message */}
        {error && !loading && (
          <View className="mx-4 mb-3 bg-red-50 border border-red-200 rounded-lg p-3">
            <Text className="text-red-800 text-sm">{error}</Text>
          </View>
        )}

        {/* Labour List */}
        <ScrollView
          className="flex-1 px-4 py-4"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {loading && !refreshing ? (
            <ActivityIndicator
              size="large"
              color="#2563EB"
              style={{ marginTop: 40 }}
            />
          ) : labourers.length === 0 ? (
            <View className="mt-20 items-center">
              <Feather name="user-x" size={48} color="#9CA3AF" />
              <Text className="text-gray-500 text-base mt-4 text-center">
                No labourers found
              </Text>
              {(searchText || villageFilter) && (
                <TouchableOpacity onPress={clearFilters} className="mt-3">
                  <Text className="text-blue-600 text-sm font-semibold">
                    Clear filters to see all
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            labourers.map((labourer) => {
              const isSelected = selectedIds.has(labourer._id);
              const avatar =
                labourer.gender === "female" ? femaleAvatar : maleAvatar;

              return (
                <View
                  key={labourer._id}
                  className={`mb-4 bg-white border ${
                    isSelected ? "border-blue-600 bg-blue-50" : "border-gray-200"
                  } rounded-lg p-4 relative`}
                >
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: "/labourscreen/LabourDetailsScreen",
                        params: {
                          id: labourer._id,
                        },
                      })
                    }
                    activeOpacity={0.7}
                  >
                    <View className="absolute left-2 z-10">
                      <Text className="text-[10px] font-medium text-gray-500 uppercase">
                        LABOUR ID: {labourer._id.slice(-4)}
                      </Text>
                    </View>

                    <View className="flex-row mt-4 items-center">
                      <Image
                        source={{ uri: avatar }}
                        className="w-16 h-16 rounded-full border border-gray-200"
                        resizeMode="cover"
                      />
                      <View className="ml-4 justify-center flex-1">
                        <Text className="text-sm font-medium text-gray-900">
                          {labourer.name}
                        </Text>
                        <Text className="text-sm font-medium text-gray-600">
                          {labourer.villageName}
                        </Text>

                        <View className="flex-row items-center mt-1 space-x-3 gap-3">
                                {(labourer.attendanceSummary?.present || 0) > 0 && (
                                    <View className="flex-row items-center">
                                        <View className="w-2 h-2 rounded-full bg-green-600 mr-1" />
                                        <Text className="text-xs text-green-700 font-medium">
                                            Present: {labourer.attendanceSummary?.present} Days
                                        </Text>
                                    </View>
                                )}
                                {(labourer.attendanceSummary?.absent || 0) > 0 && (
                                    <View className="flex-row items-center">
                                        <View className="w-2 h-2 rounded-full bg-red-600 mr-1" />
                                        <Text className="text-xs text-red-700 font-medium">
                                            Absent: {labourer.attendanceSummary?.absent} Days
                                        </Text>
                                    </View>
                                )}
                            </View>
                      </View>
                    </View>
                  </TouchableOpacity>

                  <View className="flex-row justify-end items-center mt-4 space-x-2 gap-2 flex-wrap">
                    {/* Status Badge */}
                    {labourer.todayAttendance === "present" && (
                      <View className="bg-green-100 px-3 py-1 rounded-full border border-green-200">
                        <Text className="text-green-800 text-xs font-semibold">
                          Present Today
                        </Text>
                      </View>
                    )}
                    {labourer.todayAttendance === "absent" && (
                      <View className="bg-red-100 px-3 py-1 rounded-full border border-red-200">
                        <Text className="text-red-800 text-xs font-semibold">
                          Absent Today
                        </Text>
                      </View>
                    )}

                    {/* Call Button */}
                    <TouchableOpacity
                      className={`${
                        labourer.contactNumber
                          ? "bg-blue-500"
                          : "bg-gray-300"
                      } px-4 py-2 rounded-full flex-row items-center shadow-sm`}
                      onPress={() => handleCall(labourer)}
                      disabled={!labourer.contactNumber}
                    >
                      <Feather 
                        name="phone" 
                        size={14} 
                        color="white" 
                      />
                      <Text className="text-white text-xs font-medium ml-1">
                        Ask
                      </Text>
                    </TouchableOpacity>

                    {/* Attendance Button */}
                    <TouchableOpacity
                      className={`${
                        !labourer.todayAttendance ||
                        labourer.todayAttendance === "pending"
                          ? "bg-green-500"
                          : "bg-gray-500"
                      } px-4 py-2 rounded-full flex-row items-center shadow-sm`}
                      onPress={() => handleAttendance(labourer)}
                    >
                      <Text className="text-white text-xs font-medium">
                        {!labourer.todayAttendance ||
                        labourer.todayAttendance === "pending"
                          ? "Attendance"
                          : "Update Status"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
          <View className="h-20" />
        </ScrollView>
      </SafeAreaView>

      {/* Village Filter Modal */}
      <Modal
        visible={showVillageModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowVillageModal(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowVillageModal(false)}
          className="flex-1 bg-black/50 justify-center items-center"
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl w-11/12 max-h-4/5 shadow-xl"
          >
            {/* Modal Header */}
            <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
              <Text className="text-lg font-subheading text-gray-900">
                Filter by Village
              </Text>
              <TouchableOpacity
                onPress={() => setShowVillageModal(false)}
                className="p-1"
              >
                <Feather name="x" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Village List */}
            <ScrollView className="max-h-96">
              {/* All Villages Option */}
              <TouchableOpacity
                onPress={() => handleVillageSelect("")}
                className={`flex-row items-center justify-between p-4 border-b border-gray-100 ${
                  !villageFilter ? "bg-blue-50" : ""
                }`}
              >
                <View className="flex-row items-center flex-1">
                  <View className={`w-5 h-5 rounded-full border-2 ${
                    !villageFilter ? "border-blue-600 bg-blue-600" : "border-gray-300"
                  } items-center justify-center mr-3`}>
                    {!villageFilter && (
                      <Feather name="check" size={12} color="white" />
                    )}
                  </View>
                  <Text className={`text-base ${
                    !villageFilter ? "font-semibold text-blue-900" : "text-gray-700"
                  }`}>
                    All Villages
                  </Text>
                </View>
              </TouchableOpacity>

              {villagesLoading ? (
                <ActivityIndicator
                  size="small"
                  color="#2563EB"
                  style={{ marginVertical: 20 }}
                />
              ) : villages.length === 0 ? (
                <View className="p-4">
                  <Text className="text-gray-500 text-center">
                    No villages available
                  </Text>
                </View>
              ) : (
                villages.map((village, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleVillageSelect(village)}
                    className={`flex-row items-center justify-between p-4 border-b border-gray-100 ${
                      villageFilter === village ? "bg-blue-50" : ""
                    }`}
                  >
                    <View className="flex-row items-center flex-1">
                      <View className={`w-5 h-5 rounded-full border-2 ${
                        villageFilter === village ? "border-blue-600 bg-blue-600" : "border-gray-300"
                      } items-center justify-center mr-3`}>
                        {villageFilter === village && (
                          <Feather name="check" size={12} color="white" />
                        )}
                      </View>
                      <Feather name="map-pin" size={16} color="#6B7280" />
                      <Text className={`ml-2 text-base ${
                        villageFilter === village ? "font-semibold text-blue-900" : "text-gray-700"
                      }`}>
                        {village}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>

            {/* Modal Footer */}
            <View className="p-4 border-t border-gray-200">
              <TouchableOpacity
                onPress={() => setShowVillageModal(false)}
                className="bg-blue-600 py-3 rounded-lg"
              >
                <Text className="text-white text-center font-semibold">
                  Done
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

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
}