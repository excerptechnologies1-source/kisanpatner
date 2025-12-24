// import React, { useState } from 'react';
// import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert, Platform, ActivityIndicator } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { Feather, FontAwesome5 } from '@expo/vector-icons';
// import axios from 'axios';

// const API_URL = Platform.OS === 'android' ? 'https://labourkisan.etpl.ai' : 'https://labourkisan.etpl.ai';

// export default function AddLabourScreen({ navigation }) {
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     villageName: '',
//     contactNumber: '',
//     email: '',
//     workTypes: '',
//     experience: '',
//     availability: '',
//     address: ''
//   });

//   const handleChange = (name, value) => {
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async () => {
//     if (!formData.name.trim() || !formData.villageName.trim()) {
//       Alert.alert('Validation Error', 'Name and Village Name are required fields');
//       return;
//     }

//     setLoading(true);

//     try {
//       const workTypes = formData.workTypes
//         ? formData.workTypes.split(',').map(type => type.trim()).filter(type => type.length > 0)
//         : [];

//       const payload = {
//         name: formData.name.trim(),
//         villageName: formData.villageName.trim(),
//         contactNumber: formData.contactNumber.trim() || undefined,
//         email: formData.email.trim() || undefined,
//         workTypes: workTypes,
//         experience: formData.experience.trim() || undefined,
//         availability: formData.availability.trim() || undefined,
//         address: formData.address.trim() || undefined
//       };

//       const response = await axios.post(`${API_URL}/labour`, payload);
      
//       if (response.data.success) {
//         Alert.alert('Success', 'Labourer added successfully!', [
//             { text: 'OK', onPress: () => navigation.goBack() }
//         ]);
//       }
//     } catch (error) {
//       console.error(error);
//       Alert.alert('Error', error.response?.data?.message || 'Failed to create labourer.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const InputField = ({ label, icon, value, onChangeText, placeholder, multiline = false, keyboardType }) => (
//     <View className="mb-4">
//       <Text className="text-gray-700 font-semibold mb-2">{label}</Text>
//       <View className="flex-row items-center bg-white border border-gray-300 rounded-lg px-3 py-2">
//         {icon}
//         <TextInput 
//             className="flex-1 ml-2 text-gray-800"
//             value={value}
//             onChangeText={onChangeText}
//             placeholder={placeholder}
//             placeholderTextColor="#9ca3af"
//             multiline={multiline}
//             numberOfLines={multiline ? 3 : 1}
//             keyboardType={keyboardType === 'phone-pad' || keyboardType === 'email-address' || keyboardType === 'numeric' ? keyboardType : 'default'}
//         />
//       </View>
//     </View>
//   );

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
//       {/* Header */}
//       <View className="flex-row items-center p-4 bg-white border-b border-gray-200">
//         <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
//            <Feather name="arrow-left" size={24} color="black" />
//         </TouchableOpacity>
//         <Text className="text-xl font-bold ml-4 text-black">Add New Labourer</Text>
//       </View>

//       <ScrollView className="flex-1 p-5">
         
//          <InputField 
//             label="Name *"
//             icon={<Feather name="user" size={20} color="gray" />}
//             value={formData.name}
//             onChangeText={(text) => handleChange('name', text)}
//             placeholder="Enter labourer name"
//          />

//          <InputField 
//             label="Village Name *"
//             icon={<Feather name="map-pin" size={20} color="gray" />}
//             value={formData.villageName}
//             onChangeText={(text) => handleChange('villageName', text)}
//             placeholder="Enter village name"
//          />

//          <View className="flex-row gap-2">
//              <View className="flex-1">
//                 <InputField 
//                     label="Contact Number"
//                     icon={<Feather name="phone" size={20} color="gray" />}
//                     value={formData.contactNumber}
//                     onChangeText={(text) => handleChange('contactNumber', text)}
//                     placeholder="Mobile number"
//                     keyboardType="phone-pad"
//                 />
//              </View>
//              <View className="flex-1">
//                 <InputField 
//                     label="Email"
//                     icon={<Feather name="mail" size={20} color="gray" />}
//                     value={formData.email}
//                     onChangeText={(text) => handleChange('email', text)}
//                     placeholder="Email address"
//                     keyboardType="email-address"
//                 />
//              </View>
//          </View>

//          <InputField 
//             label="Work Types"
//             icon={<Feather name="briefcase" size={20} color="gray" />}
//             value={formData.workTypes}
//             onChangeText={(text) => handleChange('workTypes', text)}
//             placeholder="E.g. Plowing, Harvesting"
//          />
         
//          <InputField 
//             label="Experience"
//             icon={<Feather name="file-text" size={20} color="gray" />}
//             value={formData.experience}
//             onChangeText={(text) => handleChange('experience', text)}
//             placeholder="E.g. 10 years..."
//          />

//          <InputField 
//             label="Availability"
//             icon={<FontAwesome5 name="clock" size={20} color="gray" />}
//             value={formData.availability}
//             onChangeText={(text) => handleChange('availability', text)}
//             placeholder="E.g. Mon-Sat"
//          />

//          <InputField 
//             label="Address"
//             icon={<Feather name="map" size={20} color="gray" />}
//             value={formData.address}
//             onChangeText={(text) => handleChange('address', text)}
//             placeholder="Enter complete address"
//             multiline={true}
//          />

//          <View className="pt-4 pb-12">
//             <TouchableOpacity 
//                 className={`w-full py-4 rounded-xl items-center shadow-lg ${loading ? 'bg-blue-400' : 'bg-blue-600'}`}
//                 onPress={handleSubmit}
//                 disabled={loading}
//             >
//                 {loading ? (
//                     <ActivityIndicator color="white" />
//                 ) : (
//                     <Text className="text-white text-lg font-bold">Save Labourer</Text>
//                 )}
//             </TouchableOpacity>
//          </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }


import React, { useState } from 'react';
import { router } from "expo-router";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  ActivityIndicator,
  TextInputProps,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import axios, { AxiosError } from 'axios';
import { NavigationProps } from './types';

/* ----------------------------- API & Models -------------------------------- */

const API_URL =
  Platform.OS === 'android'
    ? 'https://labourkisan.etpl.ai'
    : 'https://labourkisan.etpl.ai';

interface LabourFormData {
  name: string;
  villageName: string;
  contactNumber: string;
  email: string;
  workTypes: string;
  experience: string;
  availability: string;
  address: string;
}

interface CreateLabourPayload {
  name: string;
  villageName: string;
  contactNumber?: string;
  email?: string;
  workTypes: string[];
  experience?: string;
  availability?: string;
  address?: string;
}

interface CreateLabourResponse {
  success: boolean;
  message?: string;
}

/* ----------------------------- Input Field -------------------------------- */

interface InputFieldProps {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
  keyboardType?: TextInputProps['keyboardType'];
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  icon,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  keyboardType,
}) => (
  <View className="mb-4">
    <Text className="text-gray-700 font-semibold mb-2">{label}</Text>
    <View className="flex-row items-center bg-white border border-gray-300 rounded-lg px-3 py-2">
      {icon}
      <TextInput
        className="flex-1 ml-2 text-gray-800"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        keyboardType={
          keyboardType === 'phone-pad' ||
          keyboardType === 'email-address' ||
          keyboardType === 'numeric'
            ? keyboardType
            : 'default'
        }
      />
    </View>
  </View>
);

/* ----------------------------- Component ----------------------------------- */

export default function AddLabourScreen({
  navigation,
}: NavigationProps<'AddLabour'>) {
  const [loading, setLoading] = useState<boolean>(false);

  const [formData, setFormData] = useState<LabourFormData>({
    name: '',
    villageName: '',
    contactNumber: '',
    email: '',
    workTypes: '',
    experience: '',
    availability: '',
    address: '',
  });

  const handleChange = <K extends keyof LabourFormData>(
    name: K,
    value: LabourFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (): Promise<void> => {
    if (!formData.name.trim() || !formData.villageName.trim()) {
      Alert.alert(
        'Validation Error',
        'Name and Village Name are required fields'
      );
      return;
    }

    setLoading(true);

    try {
      const workTypes: string[] = formData.workTypes
        ? formData.workTypes
            .split(',')
            .map(type => type.trim())
            .filter(type => type.length > 0)
        : [];

      const payload: CreateLabourPayload = {
        name: formData.name.trim(),
        villageName: formData.villageName.trim(),
        contactNumber: formData.contactNumber.trim() || undefined,
        email: formData.email.trim() || undefined,
        workTypes,
        experience: formData.experience.trim() || undefined,
        availability: formData.availability.trim() || undefined,
        address: formData.address.trim() || undefined,
      };

      const response = await axios.post<CreateLabourResponse>(
        `${API_URL}/labour`,
        payload
      );

      if (response.data.success) {
        Alert.alert('Success', 'Labourer added successfully!', [
          { text: 'OK', onPress: () => router.push("/(labour)/LabourListScreen") },
        ]);
      }
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to create labourer.'
      );
    } finally {
      setLoading(false);
    }
  };



  /* ----------------------------- UI ----------------------------------------- */

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <View className="flex-row items-center p-4 bg-white border-b border-gray-200">
        <TouchableOpacity onPress={() => router.push("/(labour)/LabourListScreen")} className="p-2">
          <Feather name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-subheading ml-4 text-black">
          Add New Labourer
        </Text>
      </View>

      <ScrollView className="flex-1 p-5 font-medium">
        <InputField
          label="Name *"
          
          icon={<Feather name="user" size={20} color="gray" />}
          value={formData.name}
          onChangeText={text => handleChange('name', text)}
          placeholder="Enter labourer name"
        />

        <InputField
          label="Village Name *"
          icon={<Feather name="map-pin" size={20} color="gray" />}
          value={formData.villageName}
          onChangeText={text => handleChange('villageName', text)}
          placeholder="Enter village name"
        />

        <View className="flex-row gap-2">
          <View className="flex-1">
            <InputField
              label="Contact Number"
              icon={<Feather name="phone" size={20} color="gray" />}
              value={formData.contactNumber}
              onChangeText={text => handleChange('contactNumber', text)}
              placeholder="Mobile number"
              keyboardType="phone-pad"
            />
          </View>

          <View className="flex-1">
            <InputField
              label="Email"
              icon={<Feather name="mail" size={20} color="gray" />}
              value={formData.email}
              onChangeText={text => handleChange('email', text)}
              placeholder="Email address"
              keyboardType="email-address"
            />
          </View>
        </View>

        <InputField
          label="Work Types"
          icon={<Feather name="briefcase" size={20} color="gray" />}
          value={formData.workTypes}
          onChangeText={text => handleChange('workTypes', text)}
          placeholder="E.g. Plowing, Harvesting"
        />

        <InputField
          label="Experience"
          icon={<Feather name="file-text" size={20} color="gray" />}
          value={formData.experience}
          onChangeText={text => handleChange('experience', text)}
          placeholder="E.g. 10 years..."
        />

        <InputField
          label="Availability"
          icon={<FontAwesome5 name="clock" size={20} color="gray" />}
          value={formData.availability}
          onChangeText={text => handleChange('availability', text)}
          placeholder="E.g. Mon-Sat"
        />

        <InputField
          label="Address"
          icon={<Feather name="map" size={20} color="gray" />}
          value={formData.address}
          onChangeText={text => handleChange('address', text)}
          placeholder="Enter complete address"
          multiline
        />

        <View className="pt-4 pb-12">
          <TouchableOpacity
            className={`w-full py-4 rounded-xl items-center shadow-lg ${
              loading ? 'bg-blue-400' : 'bg-blue-600'
            }`}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-medium text-lg font-bold">
                Save Labourer
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
