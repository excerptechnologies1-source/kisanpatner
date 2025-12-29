import React, { useState, useEffect } from 'react';
import { useLocalSearchParams,router } from "expo-router";
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import { NavigationProps } from './types';
import CustomAlert from '@/components/CustomAlert';

const API_URL = Platform.OS === 'android' ? 'https://labourkisan.etpl.ai' : 'https://labourkisan.etpl.ai';

export default function AttendanceScreen() {
  const { assignmentId, labourer } = useLocalSearchParams<{
    assignmentId: string;
    labourer: string;
  }>();

  const parsedLabourer = labourer
    ? JSON.parse(labourer)
    : null;
   

  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState<string>(new Date().toTimeString().slice(0, 5));
  const [status, setStatus] = useState<'present' | 'absent' | ''>('');
  const [notes, setNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
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


  // If you wanted to fetch assignment details first like in web, you could do it here inside useEffect.
  // But we passed labourer details initially, so we can display them immediately.
  
  const handleSubmit = async () => {
      if (!status) {
          showAppAlert('Validation', 'Please select a status (Present/Absent)');
          return;
      }

      setSubmitting(true);
      try {
          const attendanceData = {
              status,
              date,
              time,
              notes,
          };

          const response = await axios.post<{ success: boolean }>(`${API_URL}/labour/attendance/${assignmentId}`, attendanceData);
          
          if (response.data.success) {
              

               showAppAlert(
                'Success 🎉',
                'Registration Successful!',
                () => router.push('/(labour)/LabourListScreen')
                );
          }

      } catch (error) {
          showAppAlert('Error', 'Failed to confirm attendance');
          console.error(error);
      } finally {
          setSubmitting(false);
      }
  };

  return (
    <>
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      {/* Header */}
      <View className="flex-row items-center p-4 border-b border-gray-100">
        <TouchableOpacity onPress={() => router.push("/(labour)/LabourListScreen")} className="p-2">
           <Feather name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-medium ml-4 text-black">Confirm Attendance</Text>
      </View>

      <ScrollView className="flex-1 p-5">
         
         <View className="bg-blue-50 p-4 rounded-xl flex-row items-center mb-6">
             <View className="w-16 h-16 bg-blue-200 rounded-full justify-center items-center">
                 <Text className="text-xl font-medium text-blue-800">{parsedLabourer?.name?.charAt(0).toUpperCase()}</Text>
             </View>
             <View className="ml-4">
                 <Text className="text-lg font-medium text-gray-900">{parsedLabourer?.name}</Text>
                 <Text className="text-gray-600">{parsedLabourer?.villageName}</Text>
             </View>
         </View>

         <View className="mb-6">
             <Text className="text-gray-700 font-medium mb-2">Attendance Date</Text>
             <View className="bg-white border border-gray-300 rounded-lg p-3 flex-row items-center">
                 <Feather name="calendar" size={20} color="gray" />
                 <TextInput 
                    className="ml-3 flex-1 text-black"
                    value={date}
                    onChangeText={setDate}
                    placeholder="YYYY-MM-DD"
                 />
             </View>
         </View>

         <View className="mb-6">
             <Text className="text-gray-700 font-medium mb-2">Attendance Time</Text>
             <View className="bg-white border border-gray-300 rounded-lg p-3 flex-row items-center">
                 <Feather name="clock" size={20} color="gray" />
                 <TextInput 
                    className="ml-3 flex-1 text-black"
                    value={time}
                    onChangeText={setTime}
                    placeholder="HH:MM"
                 />
             </View>
         </View>

         <View className="mb-8">
             <Text className="text-gray-700 font-medium mb-3">Status *</Text>
             <View className="flex-row gap-4">
                 <TouchableOpacity 
                    className={`flex-1 py-4 rounded-xl flex-row justify-center items-center border ${status === 'present' ? 'bg-green-100 border-green-500' : 'bg-gray-50 border-gray-200'}`}
                    onPress={() => setStatus('present')}
                 >
                     <Feather name="check-circle" size={20} color={status === 'present' ? 'green' : 'gray'} />
                     <Text className={`ml-2 font-medium ${status === 'present' ? 'text-green-700' : 'text-gray-600'}`}>Present</Text>
                 </TouchableOpacity>

                 <TouchableOpacity 
                    className={`flex-1 py-4 rounded-xl flex-row justify-center items-center border ${status === 'absent' ? 'bg-red-100 border-red-500' : 'bg-gray-50 border-gray-200'}`}
                    onPress={() => setStatus('absent')}
                 >
                     <Feather name="x-circle" size={20} color={status === 'absent' ? 'red' : 'gray'} />
                     <Text className={`ml-2 font-medium ${status === 'absent' ? 'text-red-700' : 'text-gray-600'}`}>Absent</Text>
                 </TouchableOpacity>
             </View>
         </View>

         <View className="mb-6">
             <Text className="text-gray-700 font-medium mb-2">Notes</Text>
             <TextInput 
                className="bg-white border border-gray-300 rounded-lg p-3 h-24 text-black"
                multiline
                textAlignVertical="top"
                placeholder="Optional notes..."
                value={notes}
                onChangeText={setNotes}
             />
         </View>

      </ScrollView>

      <View className="p-4 border-t border-gray-100 pb-8">
          <TouchableOpacity 
             className={`w-full py-4 rounded-xl items-center shadow-lg ${!status ? 'bg-gray-400' : 'bg-blue-600'}`}
             onPress={handleSubmit}
             disabled={submitting || !status}
          >
              {submitting ? (
                  <ActivityIndicator color="white" />
              ) : (
                  <Text className="text-white text-lg font-medium">Confirm Attendance</Text>
              )}
          </TouchableOpacity>
      </View>
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
