import React, { useState, useEffect } from "react";
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
import {
  ChevronLeft,
} from 'lucide-react-native';

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
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchText, setSearchText] = useState("");
  const [villageFilter, setVillageFilter] = useState("");

  const fiteredLabourers = labourers.filter((labourer) => {
    const nameMatch =
      labourer.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      labourer.villageName
        ?.toLowerCase()
        .includes(searchText.toLocaleLowerCase());

    const villageExactMatch = villageFilter
      ? labourer.villageName === villageFilter
      : true;

    return nameMatch && villageExactMatch;
  });

  useEffect(() => {
    fetchLabourers();
  }, []);

  const fetchLabourers = async () => {
    try {
      const response = await axios.get<{ data: Labourer[] }>(
        `${API_URL}/labour`
      );
      setLabourers(response.data.data || []);
    } catch (error) {
      console.error("Error fetching labourers:", error);
      Alert.alert("Error", "Failed to fetch data. Ensure backend is running.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchLabourers();
  }, []);

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleAttendance = (labourer: Labourer) => {
    // Prevent parent touchable from firing if necessary, though simpler in RN to just handle here
    // Logic from web:
    // 1. Assign (if needed) -> Attendance Page
    // Here we just navigate to attendance details which handles the confirmation
    // However, frontend logic does an assign call first.

    const assignAndNavigate = async () => {
      try {
        const assignmentData = {
          assignmentDate: new Date().toISOString(),
          notes: "Quick attendance from mobile list",
        };

        // Using hardcoded default farmer as per web
        const response = await axios.post<{
          success: boolean;
          data: { assignmentId: string };
        }>(`${API_URL}/labour/${labourer._id}/assign`, {
          farmerId: "DEFAULT_FARMER",
          ...assignmentData,
        });

        if (response.data.success) {
          router.push({
            pathname: "/labourscreen/AttendanceScreen",
            params: {
              assignmentId: response.data.data.assignmentId,
              labourer: JSON.stringify(labourer),
            },
          });
        }
      } catch (error) {
        Alert.alert("Error", "Failed to assign labourer");
        console.error(error);
      }
    };

    if (!labourer.todayAttendance || labourer.todayAttendance === "pending") {
      assignAndNavigate();
    } else {
      // If already attended, finding the assignment ID might be tricky without it in the list response.
      // The web code Navigates to attendance page directly if successful response.
      // If already attended, we might need to fetch the assignment ID or just let them view details.
      // For now, let's just go to details to keep it safe or re-assign/update if the backend handles it.
      // Actually, web code says "Update Status" button.
      // Let's assume we can navigate to details or re-trigger assign (which might return existing/new).
      assignAndNavigate();
    }
  };

  return (
    <SafeAreaView className="bg-white flex-1">

      <View className="flex-row items-center px-4 py-4 border-b border-gray-200">
            <TouchableOpacity
              onPress={() => router.push('/(auth)/onboarding')}
              className="p-2"
            >
              <ChevronLeft size={24} color="#374151" />
            </TouchableOpacity>
            <Text className="ml-3 text-xl font-medium text-gray-900"> Agricultural Labour Directory</Text>
          </View>

      {/* Filters */}
      <View className="mb-4 space-y-3 gap-3 px-4 mt-3">
        {/* Search by Name or Village */}
        <View className="flex-row items-center bg-white-100 rounded-lg px-3 py-2 border border-gray-200">
          <Feather name="search" size={16} color="#6B7280" />
          <TextInput
            placeholder="Search by name or village"
            value={searchText}
            onChangeText={setSearchText}
            className="ml-2 flex-1 text-sm text-gray-800 font-medium"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Exact Village Match */}
        <View className="flex-row items-center bg-white-100 rounded-lg px-3 py-2 border border-gray-200">
          <FontAwesome name="map-marker" size={16} color="#6B7280" />
          <TextInput
            placeholder="Filter by exact village name"
            value={villageFilter}
            onChangeText={setVillageFilter}
            className="ml-2 flex-1 text-sm text-gray-800 font-medium"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {(searchText || villageFilter) && (
          <TouchableOpacity
            onPress={() => {
              setSearchText("");
              setVillageFilter("");
            }}
            className="self-end"
          >
            <Text className="text-blue-600 text-xs font-semibold">
              Clear Filters
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        className="flex-1 px-4 py-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Helper Action Bar */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-gray-500 font-medium text-sm">
            {labourers.length} Labourers Found
          </Text>
          <TouchableOpacity
            className="bg-blue-600 px-4 py-2 rounded-lg flex-row items-center"
            onPress={() => router.push("/labourscreen/AddLabourScreen")}
          >
            <Feather name="plus" size={18} color="white" />
            <Text className="text-white font-medium ml-2">Add New</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#2563EB"
            style={{ marginTop: 40 }}
          />
        ) : (
          fiteredLabourers.map((labourer) => {
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
  );
}
