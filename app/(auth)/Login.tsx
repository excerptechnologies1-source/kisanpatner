// import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import {
//   ChevronLeft,
// } from 'lucide-react-native';
// import React, { useEffect, useRef, useState } from 'react';
// import {
//   ActivityIndicator,
//   Animated,
//   ImageBackground,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   StatusBar,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View
// } from 'react-native';

// const LoginPage = () => {
//   const [loginMethod, setLoginMethod] = useState('otp'); // 'otp', 'mpin', 'password'
//   const [otpSent, setOtpSent] = useState(false);
//   const [mobileNo, setMobileNo] = useState('');
//   const [otp, setOtp] = useState('');
//   const [mpin, setMpin] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const router = useRouter();
//   const params = useLocalSearchParams();
//   const role = params.role || 'farmer';

//   const API_URL = 'https://kisan.etpl.ai/farmer';

//   const goToRegister = () => {
//     router.push({
//       pathname: '/(auth)/Registration',
//       params: { role },
//     });
//   };

//   const redirectByRole = (userRole: string) => {
//     if (userRole === 'trader') {
//       router.replace('/(trader)/home');
//     } else if (userRole === 'farmer') {
//       router.replace('/(farmer)/home');
//     }if (userRole === 'transport') {
//       router.replace('/(transporter)/home');
//     } else {
//       router.replace('/(auth)/Login');
//     }
//   };

//   const saveUserToAsyncStorage = async (userData: any) => {
//     try {
//       const setIf = async (key: string, value: any) => {
//         if (value === null || value === undefined) return;
//         await AsyncStorage.setItem(key, String(value));
//       };

//       await setIf('userData', JSON.stringify(userData ?? {}));

//       // Some APIs may return slightly different field names; guard and stringify safely
//       await setIf('userId', userData?.id ?? userData?._id);
//       await setIf('userName', userData?.name ?? userData?.username);
//       await setIf('userMobile', userData?.mobileNo ?? userData?.mobile);
//       await setIf('userRole', userData?.role);

//       const role = userData?.role;
//       if (role === 'farmer') {
//         const farmerId = userData?.farmerId ?? userData?.farmer_id ?? userData?.farmerIdString;
//         if (farmerId !== undefined && farmerId !== null) {
//           await setIf('farmerId', farmerId);
//           console.log('Farmer ID saved:', farmerId);
//         }
//       } else if (role === 'trader') {
//         const traderId = userData?.traderId ?? userData?.trader_id;
//         if (traderId !== undefined && traderId !== null) {
//           await setIf('traderId', traderId);
//           console.log('Trader ID saved:', traderId);
//         }
//       }

//       console.log('User data saved to AsyncStorage:', userData);
//     } catch (error) {
//       console.error('Error saving user data:', error);
//     }
//   };

//   const selectMethod = (method: string) => {
//     setLoginMethod(method);
//     setError('');
//     setOtpSent(false);
//   };

//   const handleSendOtp = async () => {
//     if (!mobileNo || mobileNo.length !== 10) {
//       setError('Please enter a valid 10-digit mobile number');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       const response = await fetch(`${API_URL}/send-otp`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ mobileNo, role }),
//       });

//       const data = await response.json();

//       if (data.success) {
//         setOtpSent(true);
//         if (data.otp) console.log('OTP:', data.otp);
//       } else {
//         setError(data.message || 'Failed to send OTP');
//       }
//     } catch (err) {
//       setError('Failed to send OTP. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogin = async () => {
//     setLoading(true);
//     setError('');

//     try {
//       let endpoint = '';
//       let body: any = { mobileNo, role };

//       if (loginMethod === 'otp') {
//         if (!otp || otp.length !== 6) {
//           setError('Please enter a valid 6-digit OTP');
//           setLoading(false);
//           return;
//         }
//         endpoint = '/verify-otp-login';
//         body.otp = otp;
//       } else if (loginMethod === 'mpin') {
//         if (!mpin || mpin.length !== 4) {
//           setError('Please enter a valid 4-digit MPIN');
//           setLoading(false);
//           return;
//         }
//         endpoint = '/login-mpin';
//         body.mpin = mpin;
//       } else if (loginMethod === 'password') {
//         if (!password) {
//           setError('Please enter your password');
//           setLoading(false);
//           return;
//         }
//         endpoint = '/login-password';
//         body.password = password;
//       }

//       const response = await fetch(`${API_URL}${endpoint}`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(body),
//       });

//       const data = await response.json();


//       if (data.success) {
//         await saveUserToAsyncStorage(data.data);
//         setTimeout(() => {
//           redirectByRole(data.data.role);
//         }, 500);
//       } else {
//         setError(data.message || 'Login failed');
        
//       }
//     } catch (err) {
//       console.log("🔥 LOGIN ERROR =>", err);
//       setError('Login failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };


//   const scale = useRef(new Animated.Value(1)).current;
//   const opacity = useRef(new Animated.Value(1)).current;

//   useEffect(() => {
//     Animated.loop(
//       Animated.parallel([
//         Animated.sequence([
//           Animated.timing(scale, {
//             toValue: 1.6,
//             duration: 800,
//             useNativeDriver: true,
//           }),
//           Animated.timing(scale, {
//             toValue: 1,
//             duration: 800,
//             useNativeDriver: true,
//           }),
//         ]),
//         Animated.sequence([
//           Animated.timing(opacity, {
//             toValue: 0.2,
//             duration: 800,
//             useNativeDriver: true,
//           }),
//           Animated.timing(opacity, {
//             toValue: 1,
//             duration: 800,
//             useNativeDriver: true,
//           }),
//         ]),
//       ])
//     ).start();
//   }, []);

//   return (
//     <View className="flex-1 bg-white py-10">
//          <View className="flex-row items-center justify-between px-4 py-4">
//             <TouchableOpacity
//               onPress={() => router.push('/(auth)/onboarding')}
//               className="p-2"
//             >
//               <ChevronLeft size={24} color="#374151" />
             
//             </TouchableOpacity>
            
          

//           </View>

//       <StatusBar barStyle="dark-content" />

//       <ImageBackground
//         source={require('../../assets/images/green-bg.jpg')}
//         resizeMode="contain"
//         className="flex-1 bg-position-bottom"
//       >
//         <View className="flex-1 bg-white/60">
//           <KeyboardAvoidingView
//             className="flex-1"
//             behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//           >
//             <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
//               <View className="flex-1 px-6 pt-12 pb-8">
//                 {/* Logo */}
//                 <View className="items-center mb-6">
//                   <Text className="text-[#1FAD4E] text-4xl">🌾</Text>
//                   <Text className="text-2xl font-heading text-slate-900">
//                     Welcome back
//                   </Text>
//                   <Text className="text-xs font-medium text-slate-500 mt-1">
//                     Login to Your {role} Account.
//                   </Text>
//                 </View>

//                 {/* Card */}
//                 <View className="px-5 pt-4 pb-6">
//                   {/* PHONE NUMBER */}
//                   <Text className="text-xs font-medium text-slate-600 mb-1">
//                     Phone Number
//                   </Text>

//                   <View className="flex-row items-center border border-slate-200 rounded-lg px-3 py-2 mb-3 bg-slate-50">
//                     <MaterialCommunityIcons
//                       name="phone"
//                       size={18}
//                       color="#64748B"
//                     />
//                     <Text className="mx-2 text-slate-700 font-medium">+91</Text>
//                     <TextInput
//                       value={mobileNo}
//                       onChangeText={(t) => {
//                         setMobileNo(t);
//                         setOtpSent(false);
//                       }}
//                       keyboardType="number-pad"
//                       maxLength={10}
//                       placeholder="9876543210"
//                       className="flex-1 text-sm font-medium"
//                     />
//                   </View>

//                   {/* OTP FLOW */}
//                   {loginMethod === 'otp' && (
//                     <>
//                       {!otpSent ? (
//                         <TouchableOpacity
//                           onPress={handleSendOtp}
//                           className="bg-[#1FAD4E] rounded-lg py-3 items-center"
//                           disabled={loading}
//                         >
//                           {loading ? (
//                             <ActivityIndicator color="#fff" />
//                           ) : (
//                             <Text className="text-white text-base font-medium">
//                               Send OTP via WhatsApp
//                             </Text>
//                           )}
//                         </TouchableOpacity>
//                       ) : (
//                         <>
//                           <TextInput
//                             className="border border-slate-200 rounded-xl px-3 py-2 mt-3 bg-slate-50 font-medium"
//                             placeholder="Enter 6-digit OTP"
//                             keyboardType="number-pad"
//                             maxLength={6}
//                             value={otp}
//                             onChangeText={setOtp}
//                           />
//                           <TouchableOpacity onPress={handleSendOtp}>
//                             <Text className="text-xs text-[#1FAD4E] mt-2 font-medium">
//                               Resend OTP
//                             </Text>
//                           </TouchableOpacity>
//                         </>
//                       )}
//                     </>
//                   )}

//                   {/* MPIN FLOW */}
//                   {loginMethod === 'mpin' && (
//                     <TextInput
//                       className="border border-slate-200 rounded-lg px-3 py-2 mt-3 bg-slate-50 font-medium"
//                       placeholder="Enter 4-digit MPIN"
//                       keyboardType="number-pad"
//                       secureTextEntry
//                       maxLength={4}
//                       value={mpin}
//                       onChangeText={setMpin}
//                     />
//                   )}

//                   {/* PASSWORD FLOW */}
//                   {loginMethod === 'password' && (
//                     <View className="flex-row items-center border border-slate-200 rounded-lg bg-slate-50 px-3 mt-3">
//                       <TextInput
//                         className="flex-1 py-2 font-medium"
//                         placeholder="Enter your password"
//                         secureTextEntry={!showPassword}
//                         value={password}
//                         onChangeText={setPassword}
//                       />
//                       <TouchableOpacity
//                         onPress={() => setShowPassword(!showPassword)}
//                       >
//                         <Ionicons
//                           name={showPassword ? 'eye-off-outline' : 'eye-outline'}
//                           size={20}
//                           color="#64748B"
//                         />
//                       </TouchableOpacity>
//                     </View>
//                   )}

//                   {/* ERROR */}
//                   {error !== '' && (
//                     <View className="bg-red-100 border border-red-300 py-2 px-3 rounded-xl mt-3">
//                       <Text className="text-xs text-red-700">{error}</Text>
//                     </View>
//                   )}

//                   {/* LOGIN BUTTON */}
//                   {(loginMethod !== 'otp' || otpSent) && (
//                     <TouchableOpacity
//                       onPress={handleLogin}
//                       className="bg-[#1FAD4E] rounded-lg py-3 items-center mt-4"
//                       disabled={loading}
//                     >
//                       {loading ? (
//                         <ActivityIndicator color="#fff" />
//                       ) : (
//                         <Text className="text-white font-medium">Login</Text>
//                       )}
//                     </TouchableOpacity>
//                   )}

//                   {/* DIVIDER */}
//                   <View className="flex-row items-center my-5">
//                     <View className="flex-1 h-px bg-slate-300" />
//                     <Text className="text-xs text-slate-500 px-3 font-medium">
//                       or
//                     </Text>
//                     <View className="flex-1 h-px bg-slate-300" />
//                   </View>

//                   {/* LOGIN METHOD SWITCHER */}
//                   <View className="flex-col justify-around gap-3">
//                     <TouchableOpacity
//                       activeOpacity={0.9}
//                       className="flex-row items-center justify-center bg-white rounded-2xl py-3 border border-slate-200"
//                       onPress={() => selectMethod('mpin')}
//                     >
//                       <MaterialCommunityIcons
//                         name="dialpad"
//                         size={15}
//                         color="#1F2933"
//                       />
//                       <Text className="ml-2 text-sm text-slate-800 font-medium">
//                         Use MPIN
//                       </Text>
//                     </TouchableOpacity>

//                     <TouchableOpacity
//                       activeOpacity={0.9}
//                       className="flex-row items-center justify-center bg-white rounded-2xl py-3 mb-3 border border-slate-200"
//                       onPress={() => selectMethod('password')}
//                     >
//                       <MaterialCommunityIcons
//                         name="lock-outline"
//                         size={15}
//                         color="#1F2933"
//                       />
//                       <Text className="ml-2 text-sm text-slate-800 font-medium">
//                         Login using password
//                       </Text>
//                     </TouchableOpacity>
//                   </View>

//                   {/* Register & forgot links */}
//                   <View className="flex-row justify-center mt-5">
//                     <Text className="text-xs text-slate-500 font-medium">
//                       Don't have an account ?{' '}
//                     </Text>
                  
//                   </View>

//                    <View className="flex-row justify-center items-center mt-3">
//                      <TouchableOpacity
//     onPress={() =>
//     router.push({
//       pathname: "/(auth)/Registration",
//       params: { role }
//     })
//   }
//     className="px-4 py-2 rounded bg-green-600 w-22"
//   >
//     <Text className="text-white text-xs font-medium">Register</Text>
//   </TouchableOpacity>
//                  </View>

//                   <View className="flex-row justify-center items-center mt-1">
//                     <TouchableOpacity>
//                       <Text className="text-xs text-[#1FAD4E] font-medium">
//                         Forgot MPIN?
//                       </Text>
//                     </TouchableOpacity>
//                     <Text className="mx-2 text-slate-300">|</Text>
//                     <TouchableOpacity>
//                       <Text className="text-xs text-[#1FAD4E] font-medium">
//                         Forgot Password?
//                       </Text>
//                     </TouchableOpacity>
//                   </View>


//                 </View>

               
//               </View>

              
//             </ScrollView>
//           </KeyboardAvoidingView>
//         </View>
//       </ImageBackground>
//     </View>
//   );
// };

// export default LoginPage;





import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ChevronLeft,
} from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const LoginPage = () => {
  const [loginMethod, setLoginMethod] = useState('otp'); // 'otp', 'mpin', 'password'
  const [otpSent, setOtpSent] = useState(false);
  const [mobileNo, setMobileNo] = useState('');
  const [otp, setOtp] = useState('');
  const [mpin, setMpin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showMpin, setShowMpin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();
  const params = useLocalSearchParams();
  const role = params.role || 'farmer';

  const API_URL = 'https://kisan.etpl.ai/farmer';

  const goToRegister = () => {
    router.push({
      pathname: '/(auth)/Registration',
      params: { role },
    });
  };

  const redirectByRole = (userRole: string) => {
    if (userRole === 'trader') {
      router.replace('/(trader)/home');
    } else if (userRole === 'farmer') {
      router.replace('/(farmer)/home');
    }if (userRole === 'transport') {
      router.replace('/(transporter)/home');
    } else {
      router.replace('/(auth)/Login');
    }
  };

  const saveUserToAsyncStorage = async (userData: any) => {
    try {
      const setIf = async (key: string, value: any) => {
        if (value === null || value === undefined) return;
        await AsyncStorage.setItem(key, String(value));
      };

      await setIf('userData', JSON.stringify(userData ?? {}));

      // Some APIs may return slightly different field names; guard and stringify safely
      await setIf('userId', userData?.id ?? userData?._id);
      await setIf('userName', userData?.name ?? userData?.username);
      await setIf('userMobile', userData?.mobileNo ?? userData?.mobile);
      await setIf('userRole', userData?.role);

      const role = userData?.role;
      if (role === 'farmer') {
        const farmerId = userData?.farmerId ?? userData?.farmer_id ?? userData?.farmerIdString;
        if (farmerId !== undefined && farmerId !== null) {
          await setIf('farmerId', farmerId);
          console.log('Farmer ID saved:', farmerId);
        }
      } else if (role === 'trader') {
        const traderId = userData?.traderId ?? userData?.trader_id;
        if (traderId !== undefined && traderId !== null) {
          await setIf('traderId', traderId);
          console.log('Trader ID saved:', traderId);
        }
      }

      console.log('User data saved to AsyncStorage:', userData);
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const selectMethod = (method: string) => {
    setLoginMethod(method);
    setError('');
    setOtpSent(false);
  };

  const handleSendOtp = async () => {
    if (!mobileNo || mobileNo.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNo, role }),
      });

      const data = await response.json();

      if (data.success) {
        setOtpSent(true);
        if (data.otp) console.log('OTP:', data.otp);
      } else {
        setError(data.message || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      let endpoint = '';
      let body: any = { mobileNo, role };

      if (loginMethod === 'otp') {
        if (!otp || otp.length !== 6) {
          setError('Please enter a valid 6-digit OTP');
          setLoading(false);
          return;
        }
        endpoint = '/verify-otp-login';
        body.otp = otp;
      } else if (loginMethod === 'mpin') {
        if (!mpin || mpin.length !== 4) {
          setError('Please enter a valid 4-digit MPIN');
          setLoading(false);
          return;
        }
        endpoint = '/login-mpin';
        body.mpin = mpin;
      } else if (loginMethod === 'password') {
        if (!password) {
          setError('Please enter your password');
          setLoading(false);
          return;
        }
        endpoint = '/login-password';
        body.password = password;
      }

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();


      if (data.success) {
        await saveUserToAsyncStorage(data.data);
        setTimeout(() => {
          redirectByRole(data.data.role);
        }, 500);
      } else {
        setError(data.message || 'Login failed');
        
      }
    } catch (err) {
      console.log("🔥 LOGIN ERROR =>", err);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.6,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, []);

  return (
    <View className="flex-1 bg-white py-10">
         <View className="flex-row items-center justify-between px-4 py-4">
            <TouchableOpacity
              onPress={() => router.push('/(auth)/onboarding')}
              className="p-2"
            >
              <ChevronLeft size={24} color="#374151" />
             
            </TouchableOpacity>
            
          

          </View>

      <StatusBar barStyle="dark-content" />

      <ImageBackground
        source={require('../../assets/images/green-bg.jpg')}
        resizeMode="contain"
        className="flex-1 bg-position-bottom"
      >
        <View className="flex-1 bg-white/60">
          <KeyboardAvoidingView
            className="flex-1"
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <View className="flex-1 px-6 pt-12 pb-8">
                {/* Logo */}
                <View className="items-center mb-6">
                  <Text className="text-[#1FAD4E] text-4xl">🌾</Text>
                  <Text className="text-2xl font-heading text-slate-900">
                    Welcome back
                  </Text>
                  <Text className="text-xs font-medium text-slate-500 mt-1">
                    Login to Your {role} Account.
                  </Text>
                </View>

                {/* Card */}
                <View className="px-5 pt-4 pb-6">
                  {/* PHONE NUMBER */}
                  <Text className="text-xs font-medium text-slate-600 mb-1">
                    Phone Number
                  </Text>

                  <View className="flex-row items-center border border-slate-200 rounded-lg px-3 py-2 mb-3 bg-slate-50">
                    <MaterialCommunityIcons
                      name="phone"
                      size={18}
                      color="#64748B"
                    />
                    <Text className="mx-2 text-slate-700 font-medium">+91</Text>
                    <TextInput
                      value={mobileNo}
                      onChangeText={(t) => {
                        setMobileNo(t);
                        setOtpSent(false);
                      }}
                      keyboardType="number-pad"
                      maxLength={10}
                      placeholder="9876543210"
                      className="flex-1 text-sm font-medium"
                    />
                  </View>

                  {/* OTP FLOW */}
                  {loginMethod === 'otp' && (
                    <>
                      {!otpSent ? (
                        <TouchableOpacity
                          onPress={handleSendOtp}
                          className="bg-[#1FAD4E] rounded-lg py-3 items-center"
                          disabled={loading}
                        >
                          {loading ? (
                            <ActivityIndicator color="#fff" />
                          ) : (
                            <Text className="text-white text-base font-medium">
                              Send OTP via WhatsApp
                            </Text>
                          )}
                        </TouchableOpacity>
                      ) : (
                        <>
                          <TextInput
                            className="border border-slate-200 rounded-xl px-3 py-2 mt-3 bg-slate-50 font-medium"
                            placeholder="Enter 6-digit OTP"
                            keyboardType="number-pad"
                            maxLength={6}
                            value={otp}
                            onChangeText={setOtp}
                          />
                          <TouchableOpacity onPress={handleSendOtp}>
                            <Text className="text-xs text-[#1FAD4E] mt-2 font-medium">
                              Resend OTP
                            </Text>
                          </TouchableOpacity>
                        </>
                      )}
                    </>
                  )}

                  {/* MPIN FLOW */}
                  {loginMethod === 'mpin' && (
                    <View className="flex-row items-center border border-slate-200 rounded-lg bg-slate-50 px-3 mt-3">
                      <TextInput
                        className="flex-1 py-2 font-medium"
                        placeholder="Enter 4-digit MPIN"
                        keyboardType="number-pad"
                        secureTextEntry={!showMpin}
                        maxLength={4}
                        value={mpin}
                        onChangeText={setMpin}
                      />
                      <TouchableOpacity
                        onPress={() => setShowMpin(!showMpin)}
                      >
                        <Ionicons
                          name={showMpin ? 'eye-off-outline' : 'eye-outline'}
                          size={20}
                          color="#64748B"
                        />
                      </TouchableOpacity>
                    </View>
                  )}

                  {/* PASSWORD FLOW */}
                  {loginMethod === 'password' && (
                    <View className="flex-row items-center border border-slate-200 rounded-lg bg-slate-50 px-3 mt-3">
                      <TextInput
                        className="flex-1 py-2 font-medium"
                        placeholder="Enter your password"
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={setPassword}
                      />
                      <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                      >
                        <Ionicons
                          name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                          size={20}
                          color="#64748B"
                        />
                      </TouchableOpacity>
                    </View>
                  )}

                  {/* ERROR */}
                  {error !== '' && (
                    <View className="bg-red-100 border border-red-300 py-2 px-3 rounded-xl mt-3">
                      <Text className="text-xs text-red-700">{error}</Text>
                    </View>
                  )}

                  {/* LOGIN BUTTON */}
                  {(loginMethod !== 'otp' || otpSent) && (
                    <TouchableOpacity
                      onPress={handleLogin}
                      className="bg-[#1FAD4E] rounded-lg py-3 items-center mt-4"
                      disabled={loading}
                    >
                      {loading ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <Text className="text-white font-medium">Login</Text>
                      )}
                    </TouchableOpacity>
                  )}

                  {/* DIVIDER */}
                  <View className="flex-row items-center my-5">
                    <View className="flex-1 h-px bg-slate-300" />
                    <Text className="text-xs text-slate-500 px-3 font-medium">
                      or
                    </Text>
                    <View className="flex-1 h-px bg-slate-300" />
                  </View>

                  {/* LOGIN METHOD SWITCHER */}
                  <View className="flex-col justify-around gap-3">
                    <TouchableOpacity
                      activeOpacity={0.9}
                      className="flex-row items-center justify-center bg-white rounded-2xl py-3 border border-slate-200"
                      onPress={() => selectMethod('mpin')}
                    >
                      <MaterialCommunityIcons
                        name="dialpad"
                        size={15}
                        color="#1F2933"
                      />
                      <Text className="ml-2 text-sm text-slate-800 font-medium">
                        Use MPIN
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.9}
                      className="flex-row items-center justify-center bg-white rounded-2xl py-3 mb-3 border border-slate-200"
                      onPress={() => selectMethod('password')}
                    >
                      <MaterialCommunityIcons
                        name="lock-outline"
                        size={15}
                        color="#1F2933"
                      />
                      <Text className="ml-2 text-sm text-slate-800 font-medium">
                        Login using password
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Register & forgot links */}
                  <View className="flex-row justify-center mt-5">
                    <Text className="text-xs text-slate-500 font-medium">
                      Don't have an account ?{' '}
                    </Text>
                  
                  </View>

                   <View className="flex-row justify-center items-center mt-3">
                     <TouchableOpacity
    onPress={() =>
    router.push({
      pathname: "/(auth)/Registration",
      params: { role }
    })
  }
    className="px-4 py-2 rounded bg-green-600 w-22"
  >
    <Text className="text-white text-xs font-medium">Register</Text>
  </TouchableOpacity>
                 </View>

                  <View className="flex-row justify-center items-center mt-1">
                    <TouchableOpacity>
                      <Text className="text-xs text-[#1FAD4E] font-medium">
                        Forgot MPIN?
                      </Text>
                    </TouchableOpacity>
                    <Text className="mx-2 text-slate-300">|</Text>
                    <TouchableOpacity>
                      <Text className="text-xs text-[#1FAD4E] font-medium">
                        Forgot Password?
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </ImageBackground>
    </View>
  );
};

export default LoginPage;