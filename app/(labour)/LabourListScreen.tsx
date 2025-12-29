// import React, { useState, useEffect } from "react";
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
// import {
//   ChevronLeft,
// } from 'lucide-react-native';
// import { Picker } from "@react-native-picker/picker";


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
//   const [loading, setLoading] = useState<boolean>(true);
//   const [refreshing, setRefreshing] = useState<boolean>(false);
//   const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
//   const [searchText, setSearchText] = useState("");
//   const [villageFilter, setVillageFilter] = useState("");
  

//   const fiteredLabourers = labourers.filter((labourer) => {
//     const nameMatch =
//       labourer.name?.toLowerCase().includes(searchText.toLowerCase()) ||
//       labourer.villageName
//         ?.toLowerCase()
//         .includes(searchText.toLocaleLowerCase());

//     const villageExactMatch = villageFilter
//       ? labourer.villageName === villageFilter
//       : true;

//     return nameMatch && villageExactMatch;
//   });

 

//   const fetchLabourers = async (name?: string, village?: string) => {
//     try {
//       setLoading(true);

//       const response = await axios.get(`${API_URL}/labour`, {
//         params: {
//           search: name || "",
//           village: village || "",
//         },
//       });

//       setLabourers(response.data?.data || []);
//     } catch (error) {
//       console.error("Error fetching labourers:", error);
//       showAppAlert("Error", "Failed to fetch data. Ensure backend is running.");
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//    useEffect(() => {
//     fetchLabourers();
//   }, []);

//   useEffect(() => {
//     const delay = setTimeout(() => {
//       fetchLabourers(searchText, villageFilter);
//     }, 400);

//     return () => clearTimeout(delay);
//   }, [searchText, villageFilter]);

//   const onRefresh = React.useCallback(() => {
//     setRefreshing(true);
//     fetchLabourers(searchText, villageFilter);
//   }, []);

//   const toggleSelection = (id: string) => {
//     const copy = new Set(selectedIds);
//     copy.has(id) ? copy.delete(id) : copy.add(id);
//     setSelectedIds(copy);
//   };

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
//     } catch (error) {
//       showAppAlert("Error", "Failed to assign labourer");
//     }
//   };

//   return (
//     <SafeAreaView className="bg-white flex-1">

//       <View className="flex-row items-center px-4 py-4 border-b border-gray-200">
//             <TouchableOpacity
//               onPress={() => router.push('/(auth)/onboarding')}
//               className="p-2"
//             >
//               <ChevronLeft size={24} color="#374151" />
//             </TouchableOpacity>
//             <Text className="ml-3 text-xl font-medium text-gray-900"> Agricultural Labour Directory</Text>
//           </View>

//       {/* Filters */}
//       <View className="mb-4 space-y-3 gap-3 px-4 mt-3">
//         {/* Search by Name or Village */}
//         <View className="flex-row items-center bg-white-100 rounded-lg px-3 py-2 border border-gray-200">
//           <Feather name="search" size={16} color="#6B7280" />
//           <TextInput
//             placeholder="Search by name or village"
//             value={searchText}
//             onChangeText={setSearchText}
//             className="ml-2 flex-1 text-sm text-gray-800 font-medium"
//             placeholderTextColor="#9CA3AF"
//           />
//         </View>

//         {/* Exact Village Match */}
//         <View className="flex-row items-center bg-white-100 rounded-lg px-3 py-2 border border-gray-200">
//           <FontAwesome name="map-marker" size={16} color="#6B7280" />
//           <TextInput
//             placeholder="Filter by exact village name"
//             value={villageFilter}
//             onChangeText={setVillageFilter}
//             className="ml-2 flex-1 text-sm text-gray-800 font-medium"
//             placeholderTextColor="#9CA3AF"
//           />
//         </View>

//         {(searchText || villageFilter) && (
//           <TouchableOpacity
//             onPress={() => {
//               setSearchText("");
//               setVillageFilter("");
//             }}
//             className="self-end"
//           >
//             <Text className="text-blue-600 text-xs font-semibold">
//               Clear Filters
//             </Text>
//           </TouchableOpacity>
//         )}
//       </View>

//       <ScrollView
//         className="flex-1 px-4 py-4"
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} />
//         }
//       >
      

//         {loading ? (
//           <ActivityIndicator
//             size="large"
//             color="#2563EB"
//             style={{ marginTop: 40 }}
//           />
//         ) : (
//           fiteredLabourers.map((labourer) => {
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
//                     <Text className="text-white text-xs font-bold">
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
} from "react-native";
import { AntDesign, FontAwesome, Feather } from "@expo/vector-icons";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationProps, Labourer } from "../labourscreen/types";
import { ChevronLeft } from "lucide-react-native";
import { Picker } from "@react-native-picker/picker";
import CustomAlert from "@/components/CustomAlert";

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

      const response = await axios.get(`${API_URL}/labour`, { params });

      if (response.data?.success) {
        setLabourers(response.data.data || []);
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
        {/* Search by Name */}
        <View className="flex-row items-center bg-white-100 rounded-lg px-3 py-2 border border-gray-200">
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

                  <TouchableOpacity
                    className={`${
                      !labourer.todayAttendance ||
                      labourer.todayAttendance === "pending"
                        ? "bg-green-500"
                        : "bg-gray-500"
                    } px-4 py-2 rounded-full flex-row items-center shadow-sm`}
                    onPress={() => handleAttendance(labourer)}
                  >
                    <Text className="text-white text-xs font-bold">
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