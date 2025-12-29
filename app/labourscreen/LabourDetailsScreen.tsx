import React, { useState, useEffect } from 'react';
import { router, useLocalSearchParams } from "expo-router";
import { View, Text, ScrollView, TouchableOpacity, Alert, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import { NavigationProps, Labourer } from './types';
import CustomAlert from '@/components/CustomAlert';

const API_URL = Platform.OS === 'android' ? 'https://labourkisan.etpl.ai' : 'https://labourkisan.etpl.ai';

export default function LabourDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [labourer, setLabourer] = useState<Labourer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [assigning, setAssigning] = useState<boolean>(false);
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


  useEffect(() => {
    fetchLabourerDetails();
  }, [id]);

  const fetchLabourerDetails = async () => {
    try {
      const response = await axios.get<{ data: Labourer }>(`${API_URL}/labour/${id}`);
      setLabourer(response.data.data);
    } catch (error) {
      console.error(error);
      showAppAlert('Error', 'Failed to fetch details');
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    setAssigning(true);
    try {
      const assignmentData = {
          assignmentDate: new Date().toISOString(),
          notes: ''
      };
      
      const response = await axios.post<{ success: boolean; data: { assignmentId: string } }>(`${API_URL}/labour/${id}/assign`, {
          farmerId: 'DEFAULT_FARMER',
          ...assignmentData
      });

      if (response.data.success) {
          if (labourer) {
            router.push({
                      pathname: "/labourscreen/AttendanceScreen",
                      params: {
                        assignmentId: response.data.data.assignmentId,
                        labourer: JSON.stringify(labourer),
                      },
                    });
          }
      }
    } catch (error) {
        showAppAlert('Error', 'Failed to assign labourer');
        console.error(error);
    } finally {
        setAssigning(false);
    }
  };

  if (loading) {
      return (
          <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="#2563EB" />
          </View>
      );
  }

  if (!labourer) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      {/* Header */}
      <View className="flex-row items-center p-4 border-b border-gray-100">
        <TouchableOpacity onPress={() => router.push({pathname:"/(labour)/LabourListScreen"})} className="p-2">
           <Feather name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-bold ml-4 text-black">Labourer Details</Text>
      </View>

      <ScrollView className="flex-1 p-5">
        
        {/* Profile Card */}
        <View className="flex-row items-center mb-8">
            <View className="w-24 h-24 rounded-full bg-blue-100 justify-center items-center border border-blue-200">
                <Text className="text-4xl text-blue-600 font-bold">{labourer.name?.charAt(0).toUpperCase()}</Text>
            </View>
            <View className="ml-6 flex-1">
                <Text className="text-3xl font-bold text-gray-900">{labourer.name}</Text>
                <View className="flex-row items-center mt-2">
                    <Feather name="map-pin" size={16} color="#4B5563" />
                    <Text className="ml-2 text-lg text-gray-600">{labourer.villageName}</Text>
                </View>
            </View>
        </View>

        {/* Details Grid */}
        <View className="bg-gray-50 rounded-xl p-4 mb-6 space-y-4">
             {labourer.contactNumber && (
                <View className="flex-row items-center">
                    <Feather name="phone" size={20} color="#2563EB" />
                    <View className="ml-3">
                        <Text className="font-semibold text-gray-900">Contact</Text>
                        <Text className="text-gray-600">{labourer.contactNumber}</Text>
                    </View>
                </View>
             )}
             
             {labourer.email && (
                 <View className="flex-row items-center mt-4">
                    <Feather name="mail" size={20} color="#2563EB" />
                    <View className="ml-3">
                        <Text className="font-semibold text-gray-900">Email</Text>
                        <Text className="text-gray-600">{labourer.email}</Text>
                    </View>
                </View>
             )}
        </View>

        {/* Work Types */}
        <View className="mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-3">Work Types</Text>
            <View className="flex-row flex-wrap gap-2">
                {labourer.workTypes?.map((type, idx) => (
                    <View key={idx} className="bg-blue-100 px-4 py-2 rounded-full">
                        <Text className="text-blue-800 font-medium">{type}</Text>
                    </View>
                ))}
            </View>
        </View>

        {/* Experience */}
        {labourer.experience && (
            <View className="mb-6">
                 <Text className="text-lg font-bold text-gray-900 mb-2">Experience</Text>
                 <Text className="text-gray-600 leading-6">{labourer.experience}</Text>
            </View>
        )}

        {/* Availability */}
        {labourer.availability && (
            <View className="mb-6">
                 <Text className="text-lg font-bold text-gray-900 mb-2">Availability</Text>
                 <Text className="text-gray-600 leading-6">{labourer.availability}</Text>
            </View>
        )}

      </ScrollView>

      {/* Footer Action */}
      <View className="p-4 border-t border-gray-100 pb-8">
          <TouchableOpacity 
             className="bg-blue-600 w-full py-4 rounded-xl items-center shadow-lg"
             onPress={handleAssign}
             disabled={assigning}
          >
              {assigning ? (
                  <ActivityIndicator color="white" />
              ) : (
                  <Text className="text-white text-lg font-bold">Assign & Confirm Attendance</Text>
              )}
          </TouchableOpacity>
      </View>

      <CustomAlert
  visible={showAlert}
  title={alertTitle}
  message={alertMessage}
  onClose={() => {
    setShowAlert(false);
    if (alertAction) alertAction();
  }}
/>


    </SafeAreaView>
  );
}
